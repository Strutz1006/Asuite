-- Dev mode setup for license management (no auth required)
-- Copy and paste this into Supabase SQL Editor

-- 1. Create license tables if they don't exist
CREATE TABLE IF NOT EXISTS license_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  pricing_model TEXT NOT NULL CHECK (pricing_model IN ('per_user', 'organization', 'usage_based')),
  price_per_unit DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'yearly', 'one_time')),
  max_users INTEGER,
  included_apps TEXT[] NOT NULL,
  features JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_licenses (
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

CREATE TABLE IF NOT EXISTS organization_app_access (
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

-- 2. Add system_role column if it doesn't exist  
ALTER TABLE users ADD COLUMN IF NOT EXISTS system_role TEXT CHECK (system_role IN ('super_admin', 'platform_admin')) DEFAULT NULL;

-- 3. Insert some default license plans
INSERT INTO license_plans (name, slug, description, pricing_model, price_per_unit, billing_cycle, included_apps, features) VALUES
  ('Align Professional', 'align-pro', 'Professional goal alignment and OKR management', 'per_user', 15.00, 'monthly', ARRAY['align'], '{"goals_per_user": 50}'),
  ('Drive Professional', 'drive-pro', 'Advanced task and project management', 'per_user', 20.00, 'monthly', ARRAY['drive'], '{"projects_per_user": 25}'),
  ('Productivity Bundle', 'productivity-bundle', 'Align + Drive for enhanced productivity', 'per_user', 25.00, 'monthly', ARRAY['drive', 'align'], '{"storage_gb": 100}'),
  ('Enterprise Suite', 'enterprise-suite', 'Complete Aesyros Suite', 'organization', 500.00, 'monthly', ARRAY['align', 'drive', 'pulse', 'catalyst', 'flow', 'foresight'], '{"unlimited": true}'),
  ('Startup Trial', 'startup-trial', '14-day free trial', 'organization', 0.00, 'one_time', ARRAY['align', 'drive'], '{"trial_days": 14, "max_users": 10}')
ON CONFLICT (slug) DO NOTHING;

-- 4. Create super admin function
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

-- 5. Create the overview view
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

-- 6. Create dev user as super admin (for mock authentication)
INSERT INTO users (
  id,
  email, 
  full_name, 
  system_role, 
  created_at, 
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'dev@aesyros.com',
  'Dev User',
  'super_admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET 
  system_role = 'super_admin',
  updated_at = NOW();

-- 7. Create a test organization if none exists
INSERT INTO organizations (
  id,
  name,
  slug,
  settings,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'Development Organization',
  'dev-org',
  '{}',
  NOW(),
  NOW()
) ON CONFLICT (slug) DO NOTHING;

-- 8. Create a trial license for the test org
INSERT INTO organization_licenses (
  organization_id,
  license_plan_id,
  status,
  trial_ends_at,
  current_user_count,
  max_users
) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440002',
  lp.id,
  'trial',
  NOW() + INTERVAL '14 days',
  1,
  10
FROM license_plans lp 
WHERE lp.slug = 'startup-trial'
ON CONFLICT (organization_id) DO NOTHING;

-- 9. Grant app access for the test org
INSERT INTO organization_app_access (organization_id, app_name, is_enabled)
SELECT '550e8400-e29b-41d4-a716-446655440002', app_name, true
FROM unnest(ARRAY['align', 'drive']) AS app_name
ON CONFLICT (organization_id, app_name) DO NOTHING;

-- 10. Verify setup
SELECT 
  'Setup Complete' as status,
  COUNT(*) as license_plans_count
FROM license_plans
UNION ALL
SELECT 
  'Dev User Created',
  COUNT(*)
FROM users 
WHERE id = '550e8400-e29b-41d4-a716-446655440001' AND system_role = 'super_admin'
UNION ALL
SELECT 
  'Test Org Created',
  COUNT(*)
FROM organizations
WHERE id = '550e8400-e29b-41d4-a716-446655440002';