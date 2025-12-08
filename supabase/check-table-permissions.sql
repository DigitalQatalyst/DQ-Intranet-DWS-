-- Check Current RLS Status and Permissions for LMS Tables
-- Run this first to see what the current state is

-- Check RLS status
SELECT 
    tablename,
    rowsecurity as "RLS Enabled",
    CASE 
        WHEN rowsecurity THEN '❌ Restricted (RLS ON)'
        ELSE '✅ Unrestricted (RLS OFF)'
    END as "Status"
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE 'lms_%'
ORDER BY tablename;

-- Check existing policies (if RLS is enabled)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as "Command"
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename LIKE 'lms_%'
ORDER BY tablename, policyname;

-- Check table permissions/grants
SELECT 
    grantee as "Role",
    table_name as "Table",
    string_agg(privilege_type, ', ' ORDER BY privilege_type) as "Permissions"
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name LIKE 'lms_%'
  AND grantee IN ('anon', 'authenticated', 'public')
GROUP BY grantee, table_name
ORDER BY table_name, grantee;

-- If no results for grants, it means permissions haven't been explicitly granted

