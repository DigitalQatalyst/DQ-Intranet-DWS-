-- ============================================================================
-- Fix 401 Unauthorized Error for work_positions
-- ============================================================================
-- This error means RLS policies aren't working correctly
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Step 1: Verify RLS is enabled
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'work_positions';

-- Step 2: Check existing policies
SELECT tablename, policyname, cmd, roles, qual as using_expression
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'work_positions';

-- Step 3: Drop ALL existing policies (clean slate)
DROP POLICY IF EXISTS "Allow read access to all users" ON public.work_positions;
DROP POLICY IF EXISTS "work_positions_select" ON public.work_positions;
DROP POLICY IF EXISTS "work_positions_select_policy" ON public.work_positions;
DROP POLICY IF EXISTS "Public read access" ON public.work_positions;
DROP POLICY IF EXISTS "anon_read" ON public.work_positions;

-- Step 4: Ensure RLS is enabled
ALTER TABLE public.work_positions ENABLE ROW LEVEL SECURITY;

-- Step 5: Create a new policy that allows anonymous SELECT
-- This policy allows ANYONE (including anonymous users) to read ALL rows
CREATE POLICY "anon_select_all_positions"
    ON public.work_positions
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Step 6: Verify the policy was created
SELECT tablename, policyname, cmd, roles, qual as using_expression
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'work_positions';

-- ============================================================================
-- Alternative: If the above doesn't work, try this simpler approach
-- ============================================================================
-- Some Supabase setups require the policy to be even more explicit:

-- DROP POLICY IF EXISTS "anon_select_all_positions" ON public.work_positions;
-- CREATE POLICY "anon_select_all_positions"
--     ON public.work_positions
--     FOR SELECT
--     USING (true);

