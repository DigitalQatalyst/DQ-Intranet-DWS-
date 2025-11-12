-- =====================================================
-- Verify Views and RPCs Have Proper RLS Access
-- =====================================================
-- This script verifies that views and RPC functions
-- are accessible to the anon role
-- =====================================================

-- =====================================================
-- 1. Verify Views Exist
-- =====================================================

-- Check if communities_with_counts view exists
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

-- Check if posts_with_meta view exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_views 
        WHERE schemaname = 'public' 
        AND viewname = 'posts_with_meta'
    ) THEN
        RAISE NOTICE '✅ View posts_with_meta exists';
    ELSE
        RAISE WARNING '⚠️  View posts_with_meta does not exist';
    END IF;
END $$;

-- Check if posts_with_reactions view exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_views 
        WHERE schemaname = 'public' 
        AND viewname = 'posts_with_reactions'
    ) THEN
        RAISE NOTICE '✅ View posts_with_reactions exists';
    ELSE
        RAISE WARNING '⚠️  View posts_with_reactions does not exist';
    END IF;
END $$;

-- =====================================================
-- 2. Verify RPC Functions Exist
-- =====================================================

-- Check if get_feed function exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname = 'get_feed'
    ) THEN
        RAISE NOTICE '✅ RPC function get_feed exists';
    ELSE
        RAISE WARNING '⚠️  RPC function get_feed does not exist';
    END IF;
END $$;

-- Check if get_community_members function exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname = 'get_community_members'
    ) THEN
        RAISE NOTICE '✅ RPC function get_community_members exists';
    ELSE
        RAISE WARNING '⚠️  RPC function get_community_members does not exist';
    END IF;
END $$;

-- Check if get_mutual_communities function exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.proname = 'get_mutual_communities'
    ) THEN
        RAISE NOTICE '✅ RPC function get_mutual_communities exists';
    ELSE
        RAISE WARNING '⚠️  RPC function get_mutual_communities does not exist';
    END IF;
END $$;

-- =====================================================
-- 3. Grant Execute Permission on RPC Functions
-- =====================================================

-- Grant execute permission on RPC functions to anon role
-- This allows the anon role to call these functions
GRANT EXECUTE ON FUNCTION public.get_feed TO anon;
GRANT EXECUTE ON FUNCTION public.get_feed TO authenticated;

GRANT EXECUTE ON FUNCTION public.get_community_members TO anon;
GRANT EXECUTE ON FUNCTION public.get_community_members TO authenticated;

GRANT EXECUTE ON FUNCTION public.get_mutual_communities TO anon;
GRANT EXECUTE ON FUNCTION public.get_mutual_communities TO authenticated;

GRANT EXECUTE ON FUNCTION public.get_trending_topics TO anon;
GRANT EXECUTE ON FUNCTION public.get_trending_topics TO authenticated;

GRANT EXECUTE ON FUNCTION public.can_moderate TO anon;
GRANT EXECUTE ON FUNCTION public.can_moderate TO authenticated;

GRANT EXECUTE ON FUNCTION public.can_moderate_community TO anon;
GRANT EXECUTE ON FUNCTION public.can_moderate_community TO authenticated;

GRANT EXECUTE ON FUNCTION public.update_member_role TO anon;
GRANT EXECUTE ON FUNCTION public.update_member_role TO authenticated;

GRANT EXECUTE ON FUNCTION public.remove_community_member TO anon;
GRANT EXECUTE ON FUNCTION public.remove_community_member TO authenticated;

GRANT EXECUTE ON FUNCTION public.increment_poll_vote TO anon;
GRANT EXECUTE ON FUNCTION public.increment_poll_vote TO authenticated;

GRANT EXECUTE ON FUNCTION public.get_relationship_status TO anon;
GRANT EXECUTE ON FUNCTION public.get_relationship_status TO authenticated;

GRANT EXECUTE ON FUNCTION public.toggle_follow TO anon;
GRANT EXECUTE ON FUNCTION public.toggle_follow TO authenticated;

GRANT EXECUTE ON FUNCTION public.search_users TO anon;
GRANT EXECUTE ON FUNCTION public.search_users TO authenticated;

-- =====================================================
-- 4. Verify View Access
-- =====================================================

-- Views inherit RLS from underlying tables
-- Since we have public read policies on communities and memberships,
-- the views should be accessible to anon role

-- Test query for communities_with_counts view
-- Run this as anon role: SELECT * FROM communities_with_counts LIMIT 1;
-- Expected: Should return data without 401 error

-- =====================================================
-- 5. Summary
-- =====================================================

-- Views are accessible if:
-- 1. The underlying tables have public read policies
-- 2. The view definition is correct
-- 3. RLS is properly configured on underlying tables

-- RPC functions are accessible if:
-- 1. EXECUTE permission is granted to anon role
-- 2. The function definition is correct
-- 3. The function doesn't access tables without proper RLS policies

COMMENT ON FUNCTION public.get_feed IS 'RPC function for fetching feed - accessible to anon role';
COMMENT ON FUNCTION public.get_community_members IS 'RPC function for fetching community members - accessible to anon role';
COMMENT ON FUNCTION public.get_mutual_communities IS 'RPC function for fetching mutual communities - accessible to anon role';

