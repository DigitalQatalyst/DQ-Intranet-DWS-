-- =====================================================
-- Enable Anonymous Users to Join Communities
-- =====================================================
-- This script updates RLS policies to allow anonymous
-- users to insert into the memberships table without
-- requiring authentication.
-- =====================================================

-- Re-enable RLS for memberships table (if not already enabled)
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- Remove the existing authentication check policy
DROP POLICY IF EXISTS "Allow authenticated insert memberships" ON public.memberships;
DROP POLICY IF EXISTS "Allow public insert memberships" ON public.memberships;
DROP POLICY IF EXISTS "Users can join communities" ON public.memberships;
DROP POLICY IF EXISTS "Users can create memberships" ON public.memberships;
DROP POLICY IF EXISTS "Allow insert memberships local auth" ON public.memberships;

-- Create new policy to allow public insertions (no authentication required)
CREATE POLICY "Allow public insert memberships"
ON public.memberships
FOR INSERT
WITH CHECK (true);  -- No check for authentication

-- Grant permissions for public insert
GRANT INSERT ON public.memberships TO anon;
GRANT INSERT ON public.memberships TO authenticated;

-- Keep existing read and delete policies
-- (These should already exist, but we'll verify they're there)

-- Verify policies were created
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
-- Comments
-- =====================================================

COMMENT ON POLICY "Allow public insert memberships" ON public.memberships IS 
    'Allows anonymous and authenticated users to join communities without authentication. Application should validate user_id and community_id before inserting.';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Anonymous Join Policy Applied!';
    RAISE NOTICE '';
    RAISE NOTICE 'Anonymous users can now join communities without authentication.';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Application-level validation is required:';
    RAISE NOTICE '   - Validate user_id format (UUID)';
    RAISE NOTICE '   - Verify community_id exists';
    RAISE NOTICE '   - Check for duplicate memberships';
    RAISE NOTICE '   - Implement rate limiting if needed';
    RAISE NOTICE '';
END $$;

