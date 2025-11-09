-- =====================================================
-- Test RLS Policies with Anon Role
-- =====================================================
-- This script tests that RLS policies allow anon role
-- to read data without 401 errors
-- =====================================================

-- Note: This should be run from Supabase SQL Editor
-- Make sure you're testing as the 'anon' role or using
-- the Supabase client with anon key

-- =====================================================
-- Test 1: Select from communities (should work)
-- =====================================================

SELECT * FROM public.communities LIMIT 1;

-- Expected: Should return 1 row (or 0 if no data) without 401 error

-- =====================================================
-- Test 2: Select from memberships (should work)
-- =====================================================

SELECT * FROM public.memberships LIMIT 1;

-- Expected: Should return data without 401 error

-- =====================================================
-- Test 3: Select from communities_with_counts view (should work)
-- =====================================================

SELECT * FROM public.communities_with_counts LIMIT 1;

-- Expected: Should return data without 401 error

-- =====================================================
-- Test 4: Test RPC function get_community_members (should work)
-- =====================================================

-- First, get a community ID
DO $$
DECLARE
    test_community_id UUID;
BEGIN
    SELECT id INTO test_community_id
    FROM public.communities
    LIMIT 1;
    
    IF test_community_id IS NOT NULL THEN
        -- Test the RPC function
        PERFORM public.get_community_members(test_community_id);
        RAISE NOTICE '✅ RPC function get_community_members works';
    ELSE
        RAISE NOTICE '⚠️  No communities found to test RPC function';
    END IF;
END $$;

-- =====================================================
-- Test 5: Test RPC function get_feed (should work)
-- =====================================================

SELECT * FROM public.get_feed('trending', 'recent', NULL, 10, 0) LIMIT 1;

-- Expected: Should return data without 401 error

-- =====================================================
-- Test 6: Verify Insert Policy (should fail for anon without auth)
-- =====================================================

-- This should fail for anon role (expected behavior)
-- Uncomment to test:
-- INSERT INTO public.memberships (user_id, community_id) 
-- VALUES ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001');

-- Expected: Should fail with permission error (this is correct behavior)

-- =====================================================
-- Summary
-- =====================================================

-- If all SELECT queries work without 401 errors, RLS policies are correctly configured
-- If you get 401 errors, check:
-- 1. RLS is enabled on the tables
-- 2. Policies exist and are correctly defined
-- 3. You're using the anon key (not service role key)
-- 4. Views and RPCs have proper permissions

