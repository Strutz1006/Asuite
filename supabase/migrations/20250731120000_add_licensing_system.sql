-- Add licensing system tables
-- This migration creates the tables needed for the Aesyros Suite licensing system

-- License plans define available subscription options
CREATE TABLE license_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  pricing_model TEXT NOT NULL CHECK (pricing_model IN ('per_user', 'organization', 'usage_based')),
  price_per_unit DECIMAL(10,2),
  currency TEXT DEFAULT 'GBP',
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly', 'one_time')),
  max_users INTEGER,
  included_apps TEXT[] NOT NULL,
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization licenses track which license plan each organization has
CREATE TABLE organization_licenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  license_plan_id UUID NOT NULL REFERENCES license_plans(id),
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'suspended', 'trial')),
  trial_ends_at TIMESTAMPTZ,
  subscription_starts_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  current_user_count INTEGER DEFAULT 0,
  max_users INTEGER,
  billing_contact_email TEXT,
  payment_provider TEXT,
  external_subscription_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(organization_id)
);

-- Track which apps each organization can access
CREATE TABLE organization_app_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL CHECK (app_name IN ('align', 'drive', 'pulse', 'catalyst', 'flow', 'foresight')),
  is_enabled BOOLEAN DEFAULT true,
  feature_limits JSONB DEFAULT '{}',
  usage_stats JSONB DEFAULT '{}',
  enabled_at TIMESTAMPTZ DEFAULT NOW(),
  disabled_at TIMESTAMPTZ,
  
  UNIQUE(organization_id, app_name)
);

-- For per-user licenses, track which users have access to which apps
CREATE TABLE user_license_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_apps TEXT[] NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  
  UNIQUE(organization_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_organization_licenses_org_id ON organization_licenses(organization_id);
CREATE INDEX idx_organization_licenses_status ON organization_licenses(status);
CREATE INDEX idx_organization_app_access_org_id ON organization_app_access(organization_id);
CREATE INDEX idx_organization_app_access_app_name ON organization_app_access(app_name);
CREATE INDEX idx_user_license_assignments_org_id ON user_license_assignments(organization_id);
CREATE INDEX idx_user_license_assignments_user_id ON user_license_assignments(user_id);
CREATE INDEX idx_license_plans_active ON license_plans(is_active);
CREATE INDEX idx_license_plans_slug ON license_plans(slug);

-- Insert default license plans
INSERT INTO license_plans (name, slug, description, pricing_model, price_per_unit, billing_cycle, included_apps, features) VALUES
  ('Align Professional', 'align-pro', 'Professional goal alignment and OKR management', 'per_user', 15.00, 'monthly', ARRAY['align'], '{"goals_per_user": 50, "objectives_per_org": 20, "integrations": ["slack", "teams"]}'),
  ('Drive Professional', 'drive-pro', 'Advanced task and project management', 'per_user', 20.00, 'monthly', ARRAY['drive'], '{"projects_per_user": 25, "storage_gb": 50, "advanced_reporting": true}'),
  ('Productivity Bundle', 'productivity-bundle', 'Align + Drive for enhanced productivity', 'per_user', 25.00, 'monthly', ARRAY['drive', 'align'], '{"storage_gb": 100, "goals_per_user": 100, "projects_per_user": 50}'),
  ('Enterprise Suite', 'enterprise-suite', 'Complete Aesyros Suite with all applications', 'organization', 500.00, 'monthly', ARRAY['align', 'drive', 'pulse', 'catalyst', 'flow', 'foresight'], '{"unlimited": true, "sso": true, "advanced_analytics": true, "priority_support": true}'),
  ('Startup Trial', 'startup-trial', '14-day free trial of the full suite', 'organization', 0.00, 'one_time', ARRAY['align', 'drive', 'pulse', 'catalyst', 'flow', 'foresight'], '{"trial_days": 14, "max_users": 10}');

-- Add RLS policies for licensing tables
ALTER TABLE license_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_app_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_license_assignments ENABLE ROW LEVEL SECURITY;

-- License plans are publicly readable (for pricing pages)
CREATE POLICY "License plans are publicly readable" ON license_plans
  FOR SELECT USING (is_active = true);

-- Organization licenses can only be viewed by members of that organization
CREATE POLICY "Organization licenses viewable by org members" ON organization_licenses
  FOR SELECT USING (
    organization_id IN (
      SELECT id FROM organizations 
      WHERE id = auth.user_organization_id()
    )
  );

-- Organization app access can only be viewed by members of that organization
CREATE POLICY "Organization app access viewable by org members" ON organization_app_access
  FOR SELECT USING (
    organization_id IN (
      SELECT id FROM organizations 
      WHERE id = auth.user_organization_id()
    )
  );

-- User license assignments can only be viewed by members of that organization
CREATE POLICY "User license assignments viewable by org members" ON user_license_assignments
  FOR SELECT USING (
    organization_id IN (
      SELECT id FROM organizations 
      WHERE id = auth.user_organization_id()
    )
  );

-- Create function to update user count when users are added/removed
CREATE OR REPLACE FUNCTION update_organization_user_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE organization_licenses 
    SET current_user_count = (
      SELECT COUNT(*) FROM users WHERE organization_id = NEW.organization_id
    )
    WHERE organization_id = NEW.organization_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE organization_licenses 
    SET current_user_count = (
      SELECT COUNT(*) FROM users WHERE organization_id = OLD.organization_id
    )
    WHERE organization_id = OLD.organization_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update user counts
CREATE TRIGGER update_user_count_on_insert
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_organization_user_count();

CREATE TRIGGER update_user_count_on_delete
  AFTER DELETE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_organization_user_count();

-- Create function to initialize app access when an organization gets a license
CREATE OR REPLACE FUNCTION initialize_organization_app_access()
RETURNS TRIGGER AS $$
DECLARE
  app_name TEXT;
BEGIN
  -- When a new organization license is created, initialize app access
  IF TG_OP = 'INSERT' THEN
    -- Get the included apps from the license plan
    FOR app_name IN 
      SELECT unnest(included_apps) 
      FROM license_plans 
      WHERE id = NEW.license_plan_id
    LOOP
      INSERT INTO organization_app_access (organization_id, app_name, is_enabled)
      VALUES (NEW.organization_id, app_name, true)
      ON CONFLICT (organization_id, app_name) DO UPDATE SET
        is_enabled = true,
        enabled_at = NOW(),
        disabled_at = NULL;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to initialize app access
CREATE TRIGGER initialize_app_access_on_license
  AFTER INSERT ON organization_licenses
  FOR EACH ROW
  EXECUTE FUNCTION initialize_organization_app_access();