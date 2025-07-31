-- Add super admin support for license management
-- This migration adds the ability for super admins to manage licenses across organizations

-- Add system_role to users table for super admin identification
ALTER TABLE users ADD COLUMN system_role TEXT CHECK (system_role IN ('super_admin', 'platform_admin')) DEFAULT NULL;

-- Create license management audit log
CREATE TABLE license_management_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  license_plan_id UUID REFERENCES license_plans(id),
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'suspended', 'activated', 'deleted')),
  changed_by UUID NOT NULL REFERENCES users(id),
  old_values JSONB,
  new_values JSONB,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create organization license history for tracking changes
CREATE TABLE organization_license_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_license_id UUID NOT NULL REFERENCES organization_licenses(id) ON DELETE CASCADE,
  license_plan_id UUID NOT NULL REFERENCES license_plans(id),
  status TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  changed_by UUID REFERENCES users(id),
  change_reason TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Add indexes for performance
CREATE INDEX idx_license_management_logs_org_id ON license_management_logs(organization_id);
CREATE INDEX idx_license_management_logs_changed_by ON license_management_logs(changed_by);
CREATE INDEX idx_organization_license_history_license_id ON organization_license_history(organization_license_id);
CREATE INDEX idx_users_system_role ON users(system_role) WHERE system_role IS NOT NULL;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  check_user_id UUID;
BEGIN
  -- Use provided user_id or current auth user
  check_user_id := COALESCE(user_id, auth.uid());
  
  -- Return false if no user id
  IF check_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = check_user_id 
    AND system_role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log license management actions
CREATE OR REPLACE FUNCTION log_license_management_action()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if changed by a super admin
  IF is_super_admin(auth.uid()) THEN
    INSERT INTO license_management_logs (
      organization_id,
      license_plan_id,
      action,
      changed_by,
      old_values,
      new_values,
      reason
    ) VALUES (
      COALESCE(NEW.organization_id, OLD.organization_id),
      COALESCE(NEW.license_plan_id, OLD.license_plan_id),
      CASE 
        WHEN TG_OP = 'INSERT' THEN 'created'
        WHEN TG_OP = 'UPDATE' THEN 'updated'
        WHEN TG_OP = 'DELETE' THEN 'deleted'
      END,
      auth.uid(),
      CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD) ELSE NULL END,
      CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW) ELSE NULL END,
      current_setting('license_management.change_reason', true)
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Add triggers for license management logging
CREATE TRIGGER log_organization_license_changes
  AFTER INSERT OR UPDATE OR DELETE ON organization_licenses
  FOR EACH ROW
  EXECUTE FUNCTION log_license_management_action();

-- Update RLS policies to allow super admin access
CREATE POLICY "Super admins can manage all organization licenses" ON organization_licenses
  FOR ALL USING (is_super_admin());

CREATE POLICY "Super admins can manage all organization app access" ON organization_app_access
  FOR ALL USING (is_super_admin());

CREATE POLICY "Super admins can manage all user license assignments" ON user_license_assignments
  FOR ALL USING (is_super_admin());

-- Allow super admins to view license management logs
ALTER TABLE license_management_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins can view license management logs" ON license_management_logs
  FOR SELECT USING (is_super_admin());

-- Allow super admins to view license history
ALTER TABLE organization_license_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins can view license history" ON organization_license_history
  FOR SELECT USING (is_super_admin());

-- Create a view for super admin dashboard
CREATE VIEW super_admin_license_overview AS
SELECT 
  o.id as organization_id,
  o.name as organization_name,
  ol.status as license_status,
  ol.current_user_count,
  ol.max_users,
  ol.subscription_ends_at,
  lp.name as plan_name,
  lp.pricing_model,
  lp.price_per_unit,
  lp.included_apps,
  CASE 
    WHEN ol.subscription_ends_at < NOW() THEN 'expired'
    WHEN ol.subscription_ends_at < NOW() + INTERVAL '7 days' THEN 'expiring_soon'
    WHEN ol.current_user_count >= COALESCE(ol.max_users, lp.max_users, 999999) THEN 'at_limit'
    WHEN ol.current_user_count >= COALESCE(ol.max_users, lp.max_users, 999999) * 0.8 THEN 'approaching_limit'
    ELSE 'healthy'
  END as health_status
FROM organizations o
LEFT JOIN organization_licenses ol ON o.id = ol.organization_id
LEFT JOIN license_plans lp ON ol.license_plan_id = lp.id
ORDER BY o.name;

-- Create the view without RLS since it's a view
-- Views don't directly support RLS, access is controlled by underlying tables

-- Insert a super admin user for development (should be removed in production)
-- This is just for testing - in production, super admin should be set manually
INSERT INTO users (
  email, 
  full_name, 
  system_role, 
  created_at, 
  updated_at
) VALUES (
  'admin@aesyros.com',
  'Super Administrator',
  'super_admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET 
  system_role = 'super_admin',
  updated_at = NOW();