-- ============================================================================
-- Fix RLS Policies for work_positions table
-- ============================================================================
-- Run this in your Supabase SQL Editor to fix the "permission denied" error
-- ============================================================================

-- Step 1: Enable Row Level Security on work_positions table
ALTER TABLE public.work_positions ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Allow read access to all users" ON public.work_positions;
DROP POLICY IF EXISTS "work_positions_select_policy" ON public.work_positions;
DROP POLICY IF EXISTS "work_positions_select" ON public.work_positions;

-- Step 3: Create a policy that allows anonymous users to read all work_positions
CREATE POLICY "Allow read access to all users"
    ON public.work_positions
    FOR SELECT
    USING (true);

-- ============================================================================
-- Optional: Also fix work_units and work_associates if they have the same issue
-- ============================================================================

-- Enable RLS on work_units
ALTER TABLE public.work_units ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read access to all users" ON public.work_units;
CREATE POLICY "Allow read access to all users"
    ON public.work_units
    FOR SELECT
    USING (true);

-- Enable RLS on work_associates
ALTER TABLE public.work_associates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow read access to all users" ON public.work_associates;
CREATE POLICY "Allow read access to all users"
    ON public.work_associates
    FOR SELECT
    USING (true);

-- ============================================================================
-- Verification: Check if policies are created
-- ============================================================================
-- Run this query to verify the policies exist:
-- SELECT tablename, policyname, cmd, roles 
-- FROM pg_policies 
-- WHERE schemaname = 'public' 
--   AND tablename IN ('work_positions', 'work_units', 'work_associates')
-- ORDER BY tablename, policyname;

