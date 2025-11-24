-- ============================================================================
-- Debug Script for work_positions
-- ============================================================================
-- Run these queries in Supabase SQL Editor to debug why positions aren't showing
-- ============================================================================

-- 1. Check if the table exists and has data
SELECT COUNT(*) as total_positions FROM public.work_positions;

-- 2. Check the actual table structure (columns)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'work_positions'
ORDER BY ordinal_position;

-- 3. Check a sample row to see what data looks like
SELECT * FROM public.work_positions LIMIT 1;

-- 4. Check if RLS is enabled
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'work_positions';

-- 5. Check if policies exist and are correct
SELECT tablename, policyname, cmd, roles, qual as using_expression
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'work_positions';

-- 6. Test the exact query the app uses (with all columns)
SELECT 
  id, 
  slug, 
  position_name, 
  role_family, 
  department, 
  unit, 
  unit_slug, 
  location, 
  sfia_rating, 
  sfia_level, 
  contract_type, 
  summary, 
  description, 
  responsibilities, 
  expectations, 
  image_url, 
  status, 
  created_at, 
  updated_at
FROM public.work_positions
ORDER BY position_name
LIMIT 5;

