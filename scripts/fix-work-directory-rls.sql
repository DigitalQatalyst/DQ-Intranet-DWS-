-- ============================================================================
-- Fix RLS Policies for Work Directory Tables
-- Run this if your tables exist but you're getting permission errors
-- ============================================================================

-- Enable RLS (if not already enabled)
ALTER TABLE IF EXISTS public.work_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.work_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.work_associates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.employee_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to work_units" ON public.work_units;
DROP POLICY IF EXISTS "Allow public read access to work_positions" ON public.work_positions;
DROP POLICY IF EXISTS "Allow public read access to work_associates" ON public.work_associates;
DROP POLICY IF EXISTS "Allow public read access to employee_profiles" ON public.employee_profiles;

-- Create new policies that allow public read access
CREATE POLICY "Allow public read access to work_units"
  ON public.work_units
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to work_positions"
  ON public.work_positions
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to work_associates"
  ON public.work_associates
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to employee_profiles"
  ON public.employee_profiles
  FOR SELECT
  USING (true);

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('work_units', 'work_positions', 'work_associates', 'employee_profiles')
ORDER BY tablename, policyname;

