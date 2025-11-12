-- =====================================================
-- Complete RLS Policy Setup for DWS Communities
-- =====================================================
-- This script sets up all required RLS policies for
-- the DWS Communities Supabase project.
-- 
-- Run this script in Supabase SQL Editor after
-- running the schema migration (dws_communities_schema.sql)
-- =====================================================

-- =====================================================
-- 1. Enable RLS on Required Tables
-- =====================================================

-- Enable RLS on communities table
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- Enable RLS on memberships table
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. Drop Existing Policies (Clean Slate)
-- =====================================================

-- Drop all existing policies on communities
DROP POLICY IF EXISTS "Allow public read communities" ON public.communities;
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON public.communities;
DROP POLICY IF EXISTS "Communities are viewable" ON public.communities;
DROP POLICY IF EXISTS "Authenticated users can create communities" ON public.communities;
DROP POLICY IF EXISTS "Community owners can update" ON public.communities;

-- Drop all existing policies on memberships
DROP POLICY IF EXISTS "Allow public read memberships" ON public.memberships;
DROP POLICY IF EXISTS "Allow authenticated insert memberships" ON public.memberships;
DROP POLICY IF EXISTS "Memberships are viewable" ON public.memberships;
DROP POLICY IF EXISTS "Users can join communities" ON public.memberships;
DROP POLICY IF EXISTS "Users can create memberships" ON public.memberships;
DROP POLICY IF EXISTS "Users can leave communities" ON public.memberships;
DROP POLICY IF EXISTS "Allow delete own memberships" ON public.memberships;
DROP POLICY IF EXISTS "Allow insert memberships local auth" ON public.memberships;

-- =====================================================
-- 3. Create Required RLS Policies (As Requested)
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
CREATE POLICY "Allow authenticated insert memberships"
ON public.memberships
FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

-- =====================================================
-- 4. Grant Permissions to Anon Role
-- =====================================================

-- Grant SELECT permission on tables to anon role
GRANT SELECT ON public.communities TO anon;
GRANT SELECT ON public.memberships TO anon;

-- Grant SELECT permission on views to anon role
GRANT SELECT ON public.communities_with_counts TO anon;
GRANT SELECT ON public.posts_with_meta TO anon;
GRANT SELECT ON public.posts_with_reactions TO anon;

-- =====================================================
-- 5. Grant Execute Permission on RPC Functions
-- =====================================================

-- Grant execute permission on RPC functions to anon role
DO $$
BEGIN
    -- get_feed
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_feed') THEN
        GRANT EXECUTE ON FUNCTION public.get_feed TO anon;
        RAISE NOTICE '✅ Granted EXECUTE on get_feed to anon';
    END IF;
    
    -- get_community_members
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_community_members') THEN
        GRANT EXECUTE ON FUNCTION public.get_community_members TO anon;
        RAISE NOTICE '✅ Granted EXECUTE on get_community_members to anon';
    END IF;
    
    -- get_mutual_communities
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_mutual_communities') THEN
        GRANT EXECUTE ON FUNCTION public.get_mutual_communities TO anon;
        RAISE NOTICE '✅ Granted EXECUTE on get_mutual_communities to anon';
    END IF;
    
    -- get_trending_topics
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_trending_topics') THEN
        GRANT EXECUTE ON FUNCTION public.get_trending_topics TO anon;
        RAISE NOTICE '✅ Granted EXECUTE on get_trending_topics to anon';
    END IF;
    
    -- can_moderate
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'can_moderate') THEN
        GRANT EXECUTE ON FUNCTION public.can_moderate TO anon;
        RAISE NOTICE '✅ Granted EXECUTE on can_moderate to anon';
    END IF;
    
    -- can_moderate_community
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'can_moderate_community') THEN
        GRANT EXECUTE ON FUNCTION public.can_moderate_community TO anon;
        RAISE NOTICE '✅ Granted EXECUTE on can_moderate_community to anon';
    END IF;
    
    -- update_member_role
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_member_role') THEN
        GRANT EXECUTE ON FUNCTION public.update_member_role TO anon;
        RAISE NOTICE '✅ Granted EXECUTE on update_member_role to anon';
    END IF;
    
    -- remove_community_member
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'remove_community_member') THEN
        GRANT EXECUTE ON FUNCTION public.remove_community_member TO anon;
        RAISE NOTICE '✅ Granted EXECUTE on remove_community_member to anon';
    END IF;
    
    -- increment_poll_vote
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'increment_poll_vote') THEN
        GRANT EXECUTE ON FUNCTION public.increment_poll_vote TO anon;
        RAISE NOTICE '✅ Granted EXECUTE on increment_poll_vote to anon';
    END IF;
    
    -- get_relationship_status
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_relationship_status') THEN
        GRANT EXECUTE ON FUNCTION public.get_relationship_status TO anon;
        RAISE NOTICE '✅ Granted EXECUTE on get_relationship_status to anon';
    END IF;
    
    -- toggle_follow
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'toggle_follow') THEN
        GRANT EXECUTE ON FUNCTION public.toggle_follow TO anon;
        RAISE NOTICE '✅ Granted EXECUTE on toggle_follow to anon';
    END IF;
    
    -- search_users
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'search_users') THEN
        GRANT EXECUTE ON FUNCTION public.search_users TO anon;
        RAISE NOTICE '✅ Granted EXECUTE on search_users to anon';
    END IF;
END $$;

-- =====================================================
-- 6. Verify RLS is Enabled
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
-- 7. List All Policies
-- =====================================================

-- Show all policies on communities and memberships
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' 
    AND tablename IN ('communities', 'memberships')
ORDER BY tablename, policyname;

-- =====================================================
-- 8. Test Query (Run this separately to verify)
-- =====================================================

-- Test query to verify policies work:
-- SELECT * FROM communities LIMIT 1;
--
-- Expected result: Should return data without 401 error
-- If you get a 401 error, check:
-- 1. RLS is enabled on the table
-- 2. Policy exists and is correctly defined
-- 3. GRANT SELECT was executed successfully
-- 4. You're using the anon key (not service role key)

-- =====================================================
-- 9. Comments
-- =====================================================

COMMENT ON POLICY "Allow public read communities" ON public.communities IS 
    'Allows anon role to read all communities - required for public Communities directory';

COMMENT ON POLICY "Allow public read memberships" ON public.memberships IS 
    'Allows anon role to read membership data - required for member counts in views';

COMMENT ON POLICY "Allow authenticated insert memberships" ON public.memberships IS 
    'Allows authenticated users to join communities - requires Supabase Auth (auth.uid())';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ RLS Policies Setup Complete!';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Test the query: SELECT * FROM communities LIMIT 1;';
    RAISE NOTICE '2. Verify views are accessible: SELECT * FROM communities_with_counts LIMIT 1;';
    RAISE NOTICE '3. Test RPC functions: SELECT * FROM get_feed(...);';
    RAISE NOTICE '4. Run the verification script: node scripts/verify-supabase-rls.js';
    RAISE NOTICE '';
END $$;

