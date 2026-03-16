-- Verify RLS Status for LMS Tables
-- Run this to check if RLS is enabled and policies exist

-- Check if RLS is enabled on LMS tables
SELECT 
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE 'lms_%'
ORDER BY tablename;

-- Check existing policies for LMS tables
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as "Command",
  qual as "Using Expression"
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename LIKE 'lms_%'
ORDER BY tablename, policyname;

-- If no results, RLS might not be enabled or policies don't exist

