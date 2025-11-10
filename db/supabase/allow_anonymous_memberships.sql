-- =====================================================
-- Allow Anonymous Users to Join Communities
-- =====================================================
-- This script updates the RLS policy on the memberships
-- table to allow anonymous users to join communities
-- without requiring authentication.
-- 
-- IMPORTANT: This allows unauthenticated inserts, so
-- application-level validation should ensure data integrity.
-- =====================================================

-- =====================================================
-- 1. Drop Existing Insert Policy
-- =====================================================

DROP POLICY IF EXISTS "Allow authenticated insert memberships" ON public.memberships;
DROP POLICY IF EXISTS "Users can join communities" ON public.memberships;
DROP POLICY IF EXISTS "Users can create memberships" ON public.memberships;
DROP POLICY IF EXISTS "Allow insert memberships" ON public.memberships;
DROP POLICY IF EXISTS "Allow insert memberships local auth" ON public.memberships;

-- =====================================================
-- 2. Create New Policy Allowing Anonymous Inserts
-- =====================================================

-- Allow anonymous users to join communities (no authentication required)
-- Note: Application should validate user_id before inserting
CREATE POLICY "Allow authenticated insert memberships"
ON public.memberships
FOR INSERT
WITH CHECK (true);

-- =====================================================
-- 3. Grant INSERT Permission to Anon Role
-- =====================================================

-- Grant INSERT permission on memberships table to anon role
GRANT INSERT ON public.memberships TO anon;

-- Also grant to authenticated role (if using Supabase Auth)
GRANT INSERT ON public.memberships TO authenticated;

-- =====================================================
-- 4. Verify Policy Was Created
-- =====================================================

-- List all policies on memberships table
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
    AND tablename = 'memberships'
ORDER BY policyname;

-- =====================================================
-- 5. Test Query (Run this separately to verify)
-- =====================================================

-- Test query to verify anonymous users can insert:
-- INSERT INTO public.memberships (user_id, community_id)
-- VALUES ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001');
--
-- Expected result: Should succeed without authentication error
-- Note: Make sure the user_id and community_id exist in your database

-- =====================================================
-- 6. Comments
-- =====================================================

COMMENT ON POLICY "Allow authenticated insert memberships" ON public.memberships IS 
    'Allows anonymous and authenticated users to join communities - no authentication required. Application should validate user_id before inserting.';

-- =====================================================
-- 7. Security Notes
-- =====================================================

-- ⚠️  SECURITY CONSIDERATIONS:
-- 1. This policy allows ANY user (including anonymous) to insert memberships
-- 2. Application-level validation is REQUIRED to ensure:
--    - user_id is valid
--    - community_id exists
--    - User is not already a member
--    - Community allows anonymous membership (if applicable)
-- 3. Consider adding application-level checks:
--    - Rate limiting for anonymous joins
--    - Validation of user_id format
--    - Community-specific rules (e.g., private communities)
-- 4. For production, consider:
--    - Requiring authentication for certain communities
--    - Implementing a separate table for anonymous memberships
--    - Using a session-based approach for anonymous users

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Anonymous Membership Policy Applied!';
    RAISE NOTICE '';
    RAISE NOTICE 'Anonymous users can now join communities without authentication.';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Application-level validation is required:';
    RAISE NOTICE '   - Validate user_id before inserting';
    RAISE NOTICE '   - Check if user is already a member';
    RAISE NOTICE '   - Verify community exists';
    RAISE NOTICE '   - Implement rate limiting if needed';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Update application code to handle anonymous joins';
    RAISE NOTICE '2. Add validation logic in your application';
    RAISE NOTICE '3. Test anonymous membership flow';
    RAISE NOTICE '4. Consider community-specific rules';
    RAISE NOTICE '';
END $$;

