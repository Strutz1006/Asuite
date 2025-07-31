-- Cleanup script to fix "multiple rows returned" error
-- Run this in Supabase SQL Editor

-- 1. Check for duplicate users with same email
SELECT 'Duplicate users check:' as info, email, COUNT(*) as count
FROM users 
WHERE email = 'dev@aesyros.com'
GROUP BY email
HAVING COUNT(*) > 1;

-- 2. Check for duplicate organizations with same slug  
SELECT 'Duplicate orgs check:' as info, slug, COUNT(*) as count
FROM organizations 
WHERE slug = 'dev-org'
GROUP BY slug
HAVING COUNT(*) > 1;

-- 3. Check for multiple licenses for same org
SELECT 'Multiple licenses check:' as info, organization_id, COUNT(*) as count
FROM organization_licenses
GROUP BY organization_id
HAVING COUNT(*) > 1;

-- 4. Clean up duplicate users (keep the one with system_role)
DELETE FROM users 
WHERE email = 'dev@aesyros.com' 
AND system_role IS NULL 
AND id != '550e8400-e29b-41d4-a716-446655440001';

-- 5. Clean up duplicate organizations (keep one with the expected ID)
DELETE FROM organizations 
WHERE slug = 'dev-org' 
AND id != '550e8400-e29b-41d4-a716-446655440002';

-- 6. Ensure we have exactly one dev user with correct data
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
  email = 'dev@aesyros.com',
  full_name = 'Dev User',
  updated_at = NOW();

-- 7. Ensure we have exactly one dev organization
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
) ON CONFLICT (id) DO UPDATE SET 
  name = 'Development Organization',
  slug = 'dev-org',
  updated_at = NOW();

-- 8. Ensure exactly one license for the dev org
DELETE FROM organization_licenses 
WHERE organization_id = '550e8400-e29b-41d4-a716-446655440002';

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
LIMIT 1;

-- 9. Verify the cleanup worked
SELECT 'Final verification:' as info;

SELECT 'Users with dev email' as check_type, COUNT(*) as count 
FROM users WHERE email = 'dev@aesyros.com';

SELECT 'Dev organizations' as check_type, COUNT(*) as count 
FROM organizations WHERE slug = 'dev-org';

SELECT 'Licenses for dev org' as check_type, COUNT(*) as count 
FROM organization_licenses WHERE organization_id = '550e8400-e29b-41d4-a716-446655440002';

SELECT 'Super admin still works?' as check_type,
       CASE WHEN is_super_admin('550e8400-e29b-41d4-a716-446655440001') THEN 'YES' ELSE 'NO' END as result;