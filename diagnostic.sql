-- Diagnostic queries to understand the current state
-- Run this in Supabase SQL Editor to see what data exists

-- 1. Check users table
SELECT 'USERS' as table_name, COUNT(*) as total_count;
SELECT 'Users with dev email' as check_type, COUNT(*) as count 
FROM users WHERE email = 'dev@aesyros.com';

-- 2. Check organizations
SELECT 'ORGANIZATIONS' as table_name, COUNT(*) as total_count FROM organizations;
SELECT 'Dev organizations' as check_type, COUNT(*) as count 
FROM organizations WHERE slug = 'dev-org';

-- 3. Check license plans
SELECT 'LICENSE PLANS' as table_name, COUNT(*) as total_count FROM license_plans;

-- 4. Check organization licenses
SELECT 'ORG LICENSES' as table_name, COUNT(*) as total_count FROM organization_licenses;

-- 5. Show all users (to see duplicates)
SELECT 'All users:' as info, id, email, system_role, created_at 
FROM users 
ORDER BY created_at;

-- 6. Show all organizations
SELECT 'All orgs:' as info, id, name, slug, created_at 
FROM organizations 
ORDER BY created_at;

-- 7. Check for the specific UUID we expect
SELECT 'Dev user exists?' as check_type, 
       CASE WHEN COUNT(*) > 0 THEN 'YES' ELSE 'NO' END as result
FROM users 
WHERE id = '550e8400-e29b-41d4-a716-446655440001';

-- 8. Check super admin function
SELECT 'Super admin function works?' as check_type,
       CASE WHEN is_super_admin('550e8400-e29b-41d4-a716-446655440001') THEN 'YES' ELSE 'NO' END as result;