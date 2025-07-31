-- Quick setup script for super admin access
-- Run this directly in Supabase SQL editor or psql

-- 1. Add system_role column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS system_role TEXT CHECK (system_role IN ('super_admin', 'platform_admin')) DEFAULT NULL;

-- 2. Create or update the super admin function
CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  check_user_id UUID;
BEGIN
  check_user_id := COALESCE(user_id, auth.uid());
  
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

-- 3. Make your current user a super admin (replace with your actual email)
-- First, make sure you have a user record
INSERT INTO users (
  id,
  email, 
  full_name, 
  system_role, 
  created_at, 
  updated_at
) 
SELECT 
  auth.uid(),
  (auth.jwt() -> 'email')::text,
  COALESCE((auth.jwt() -> 'user_metadata' ->> 'full_name'), (auth.jwt() -> 'email')::text),
  'super_admin',
  NOW(),
  NOW()
ON CONFLICT (id) DO UPDATE SET 
  system_role = 'super_admin',
  updated_at = NOW()
WHERE auth.uid() IS NOT NULL;

-- Alternative: Set a specific user as super admin by email
-- UPDATE users SET system_role = 'super_admin' WHERE email = 'your-email@example.com';

-- 4. Grant super admin policies (run these if they don't exist)
DO $$ 
BEGIN
  -- Check if policies exist and create them if they don't
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Super admins can manage all organization licenses') THEN
    EXECUTE 'CREATE POLICY "Super admins can manage all organization licenses" ON organization_licenses FOR ALL USING (is_super_admin())';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Super admins can manage all organization app access') THEN
    EXECUTE 'CREATE POLICY "Super admins can manage all organization app access" ON organization_app_access FOR ALL USING (is_super_admin())';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Super admins can manage all user license assignments') THEN
    EXECUTE 'CREATE POLICY "Super admins can manage all user license assignments" ON user_license_assignments FOR ALL USING (is_super_admin())';
  END IF;
END $$;

-- 5. Create the super admin overview view if it doesn't exist
CREATE OR REPLACE VIEW super_admin_license_overview AS
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

-- 6. Verify setup
SELECT 
  'Setup Status' as check_type,
  CASE 
    WHEN is_super_admin() THEN '✅ You are now a super admin!'
    ELSE '❌ Super admin setup failed'
  END as result;

-- Show current user info
SELECT 
  'Current User' as info_type,
  id,
  email,
  system_role,
  CASE WHEN system_role = 'super_admin' THEN '✅ Super Admin' ELSE '❌ Regular User' END as status
FROM users 
WHERE id = auth.uid();