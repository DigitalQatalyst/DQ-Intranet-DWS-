-- Quick verification script for RLS policies
-- Run this in Supabase SQL Editor to check if policies exist

-- Check if tables exist and RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE 'dq_%'
ORDER BY tablename;

-- Check existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename LIKE 'dq_%'
ORDER BY tablename, policyname;

-- If policies are missing, the schema.sql should be run first
-- If you see policies but still get 401, check:
-- 1. The anon key is correct in .env.local
-- 2. Supabase project settings allow anonymous access
-- 3. The policies use USING (true) for anonymous reads





