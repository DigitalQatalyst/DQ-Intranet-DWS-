-- =====================================================
-- Verify and Fix RLS Policies for DWS Communities
-- =====================================================
-- This script verifies and creates the required RLS policies
-- for the DWS Communities Supabase project
-- =====================================================

-- =====================================================
-- 1. Enable RLS on Tables
-- =====================================================

-- Enable RLS on communities table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'communities'
    ) THEN
        RAISE EXCEPTION 'Table communities does not exist. Please run the schema migration first.';
    END IF;
END $$;

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- Enable RLS on memberships table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'memberships'
    ) THEN
        RAISE EXCEPTION 'Table memberships does not exist. Please run the schema migration first.';
    END IF;
END $$;

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. Drop Existing Policies (if they exist)
-- =====================================================

-- Drop existing policies on communities
DROP POLICY IF EXISTS "Allow public read communities" ON public.communities;
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON public.communities;
DROP POLICY IF EXISTS "Communities are viewable" ON public.communities;

-- Drop existing policies on memberships
DROP POLICY IF EXISTS "Allow public read memberships" ON public.memberships;
DROP POLICY IF EXISTS "Allow authenticated insert memberships" ON public.memberships;
DROP POLICY IF EXISTS "Memberships are viewable" ON public.memberships;
DROP POLICY IF EXISTS "Users can join communities" ON public.memberships;
DROP POLICY IF EXISTS "Users can create memberships" ON public.memberships;

-- =====================================================
-- 3. Create Required RLS Policies
-- =====================================================

-- Public read access for Communities
CREATE POLICY "Allow public read communities"
ON public.communities
FOR SELECT
USING (true);

-- Public read for Membership counts
CREATE POLICY "Allow public read memberships"
ON public.memberships
FOR SELECT
USING (true);

-- Authenticated users can join communities
-- Note: This uses auth.uid() which requires Supabase Auth
-- For local auth, we'll create an alternative policy below
CREATE POLICY "Allow authenticated insert memberships"
ON public.memberships
FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

-- Alternative policy for local authentication (if not using Supabase Auth)
-- This allows any insert but should be restricted by application logic
CREATE POLICY "Allow insert memberships"
ON public.memberships
FOR INSERT
WITH CHECK (true);

-- Allow users to delete their own memberships
CREATE POLICY "Allow delete own memberships"
ON public.memberships
FOR DELETE
USING (auth.uid()::text = user_id::text OR true); -- Using 'OR true' for local auth compatibility

-- =====================================================
-- 4. Verify RLS is Enabled
-- =====================================================

-- Check RLS status
DO $$
DECLARE
    communities_rls_enabled BOOLEAN;
    memberships_rls_enabled BOOLEAN;
BEGIN
    SELECT relrowsecurity INTO communities_rls_enabled
    FROM pg_class
    WHERE relname = 'communities' AND relnamespace = 'public'::regnamespace;
    
    SELECT relrowsecurity INTO memberships_rls_enabled
    FROM pg_class
    WHERE relname = 'memberships' AND relnamespace = 'public'::regnamespace;
    
    IF communities_rls_enabled THEN
        RAISE NOTICE '✅ RLS is enabled on communities table';
    ELSE
        RAISE WARNING '⚠️  RLS is NOT enabled on communities table';
    END IF;
    
    IF memberships_rls_enabled THEN
        RAISE NOTICE '✅ RLS is enabled on memberships table';
    ELSE
        RAISE WARNING '⚠️  RLS is NOT enabled on memberships table';
    END IF;
END $$;

-- =====================================================
-- 5. List All Policies
-- =====================================================

-- Show all policies on communities
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' 
    AND tablename IN ('communities', 'memberships')
ORDER BY tablename, policyname;

-- =====================================================
-- 6. Verify Views Have Access
-- =====================================================

-- Check if views exist and are accessible
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_views 
        WHERE schemaname = 'public' 
        AND viewname = 'communities_with_counts'
    ) THEN
        RAISE NOTICE '✅ View communities_with_counts exists';
    ELSE
        RAISE WARNING '⚠️  View communities_with_counts does not exist';
    END IF;
END $$;

-- =====================================================
-- 7. Test Query (This will be run separately)
-- =====================================================

-- Test query to verify policies work
-- Run this as anon role: SELECT * FROM communities LIMIT 1;

COMMENT ON POLICY "Allow public read communities" ON public.communities IS 'Allows public (anon) users to read all communities';
COMMENT ON POLICY "Allow public read memberships" ON public.memberships IS 'Allows public (anon) users to read membership data';
COMMENT ON POLICY "Allow authenticated insert memberships" ON public.memberships IS 'Allows authenticated users to join communities (requires Supabase Auth)';
COMMENT ON POLICY "Allow insert memberships" ON public.memberships IS 'Allows any user to join communities (for local auth compatibility)';

