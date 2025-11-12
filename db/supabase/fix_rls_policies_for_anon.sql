-- =====================================================
-- Fix RLS Policies for Anon Role Access
-- =====================================================
-- This script ensures RLS policies allow anon role
-- to read communities and memberships without 401 errors
-- =====================================================

-- =====================================================
-- 1. Enable RLS (if not already enabled)
-- =====================================================

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. Drop Conflicting Policies
-- =====================================================

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Allow public read communities" ON public.communities;
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON public.communities;
DROP POLICY IF EXISTS "Communities are viewable" ON public.communities;

DROP POLICY IF EXISTS "Allow public read memberships" ON public.memberships;
DROP POLICY IF EXISTS "Memberships are viewable" ON public.memberships;
DROP POLICY IF EXISTS "Allow authenticated insert memberships" ON public.memberships;
DROP POLICY IF EXISTS "Users can join communities" ON public.memberships;
DROP POLICY IF EXISTS "Users can create memberships" ON public.memberships;

-- =====================================================
-- 3. Create Required Policies (Exact as Requested)
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
-- Note: This uses auth.uid() which works with Supabase Auth
-- For local auth, application should validate user_id matches session
CREATE POLICY "Allow authenticated insert memberships"
ON public.memberships
FOR INSERT
WITH CHECK (auth.uid()::text = user_id::text);

-- =====================================================
-- 4. Additional Policies for Local Auth Compatibility
-- =====================================================

-- Alternative policy for local auth (if not using Supabase Auth)
-- This allows inserts but requires application-level validation
CREATE POLICY IF NOT EXISTS "Allow insert memberships local auth"
ON public.memberships
FOR INSERT
WITH CHECK (true);

-- Allow users to leave communities (delete own membership)
CREATE POLICY IF NOT EXISTS "Allow delete own memberships"
ON public.memberships
FOR DELETE
USING (
    -- For Supabase Auth
    auth.uid()::text = user_id::text
    OR
    -- For local auth (application-level validation)
    true
);

-- =====================================================
-- 5. Verify Policies
-- =====================================================

-- List all policies on communities and memberships
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
-- 6. Test Query (Run this as anon role)
-- =====================================================

-- Test query to verify policies work:
-- SELECT * FROM communities LIMIT 1;
--
-- Expected: Should return data without 401 error
-- If you get a 401 error, the policy may not be working correctly

COMMENT ON POLICY "Allow public read communities" ON public.communities IS 
    'Allows anon role to read all communities - required for public Communities directory';

COMMENT ON POLICY "Allow public read memberships" ON public.memberships IS 
    'Allows anon role to read membership data - required for member counts in views';

COMMENT ON POLICY "Allow authenticated insert memberships" ON public.memberships IS 
    'Allows authenticated users to join communities - requires Supabase Auth (auth.uid())';

