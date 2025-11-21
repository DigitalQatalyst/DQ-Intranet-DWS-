-- Migration: Fix Communities Display Issue
-- Description: Ensures communities table and related views are accessible for display
--              while maintaining authentication requirements
-- Date: 2025-01-08

-- ============================================
-- 1. Enable RLS on Communities with Proper Policies
-- ============================================
-- Note: We enable RLS but allow SELECT for all users (authenticated or anonymous)
--       to display communities, while INSERT/UPDATE/DELETE require authentication

ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view communities" ON communities;
DROP POLICY IF EXISTS "Authenticated users can create communities" ON communities;
DROP POLICY IF EXISTS "Users can update their own communities" ON communities;
DROP POLICY IF EXISTS "Users can delete their own communities" ON communities;

-- SELECT: Anyone can view communities (for display purposes)
CREATE POLICY "Anyone can view communities"
  ON communities FOR SELECT
  USING (true);

-- INSERT: Only authenticated users can create communities
CREATE POLICY "Authenticated users can create communities"
  ON communities FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE: Only authenticated users can update communities (can be restricted further if needed)
-- For now, any authenticated user can update (you may want to restrict to creators/admins)
CREATE POLICY "Authenticated users can update communities"
  ON communities FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- DELETE: Only authenticated users can delete communities (can be restricted further if needed)
CREATE POLICY "Authenticated users can delete communities"
  ON communities FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- ============================================
-- 2. Ensure RLS is Enabled on Memberships with Proper Policies
-- ============================================
-- Note: Migration 20250108000002 already sets up RLS on memberships.
--       We ensure it's enabled and add a SELECT policy that allows reading
--       for membership checks in other RLS policies.

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Drop and recreate the SELECT policy to ensure it allows reading for RLS checks
-- The SELECT policy needs to allow reading so that EXISTS() checks in other policies work
DROP POLICY IF EXISTS "Authenticated users can view memberships" ON memberships;
DROP POLICY IF EXISTS "Anyone can view membership counts" ON memberships;

-- SELECT: Allow reading memberships for:
-- 1. Users viewing their own memberships
-- 2. Members viewing other members of their communities (for member counts)
-- 3. Anyone can view membership counts (needed for EXISTS() checks in RLS policies)
CREATE POLICY "Anyone can view membership counts"
  ON memberships FOR SELECT
  USING (true);
  
-- Alternative: More restrictive policy (if you want to limit who can see memberships)
-- CREATE POLICY "Users can view relevant memberships"
--   ON memberships FOR SELECT
--   USING (
--     user_id = auth.uid()
--     OR EXISTS (
--       SELECT 1 FROM memberships m2
--       WHERE m2.community_id = memberships.community_id
--       AND m2.user_id = auth.uid()
--     )
--   );

-- ============================================
-- 3. Create/Update communities_with_counts View
-- ============================================

CREATE OR REPLACE VIEW communities_with_counts AS
SELECT 
  c.id,
  c.name,
  c.description,
  c.imageurl,
  c.category,
  c.department,
  c.location_filter,
  c.isprivate,
  c.activitylevel,
  c.created_at,
  c.created_by,
  COALESCE(COUNT(DISTINCT m.user_id), 0) as member_count
FROM communities c
LEFT JOIN memberships m ON m.community_id = c.id
GROUP BY c.id;

-- Grant access to the view
GRANT SELECT ON communities_with_counts TO anon, authenticated;

-- ============================================
-- 4. Grant Permissions
-- ============================================

-- Grant SELECT to both anon and authenticated for communities
GRANT SELECT ON communities TO anon, authenticated;

-- Grant SELECT to both anon and authenticated for memberships (for member counts)
GRANT SELECT ON memberships TO anon, authenticated;

-- Grant SELECT to both anon and authenticated for the view
GRANT SELECT ON communities_with_counts TO anon, authenticated;

-- ============================================
-- 5. Add Comment
-- ============================================
COMMENT ON VIEW communities_with_counts IS 'View of communities with aggregated member counts. Accessible to all users for display purposes. RLS is enabled on both communities and memberships tables with SELECT policies allowing public read access.';

