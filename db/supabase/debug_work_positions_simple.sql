-- ============================================================================
-- Simple Debug Queries for work_positions
-- ============================================================================
-- Run these queries ONE AT A TIME in Supabase SQL Editor
-- ============================================================================

-- Query 1: Check if table has data
SELECT COUNT(*) as total_positions FROM public.work_positions;

-- Query 2: Check table structure (what columns exist)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'work_positions'
ORDER BY ordinal_position;

-- Query 3: See a sample row
SELECT * FROM public.work_positions LIMIT 1;

-- Query 4: Test the app's exact query
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

