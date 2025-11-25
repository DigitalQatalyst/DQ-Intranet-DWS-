-- Migration: Ensure Memberships Table Exists
-- Description: Creates memberships table if it doesn't exist, with proper structure
-- Date: 2025-01-08

-- ============================================
-- STEP 1: Create memberships table if it doesn't exist
-- ============================================

CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT memberships_unique_user_community UNIQUE (user_id, community_id)
);

-- ============================================
-- STEP 2: Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_community_id ON memberships(community_id);
CREATE INDEX IF NOT EXISTS idx_memberships_joined_at ON memberships(joined_at DESC);

-- ============================================
-- STEP 3: Set up RLS (Row Level Security)
-- ============================================

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view membership counts" ON memberships;
DROP POLICY IF EXISTS "Users can view their own memberships" ON memberships;
DROP POLICY IF EXISTS "Authenticated users can create memberships" ON memberships;
DROP POLICY IF EXISTS "Users can delete their own memberships" ON memberships;

-- SELECT: Anyone can view memberships (needed for member counts and RLS checks)
CREATE POLICY "Anyone can view membership counts"
  ON memberships FOR SELECT
  USING (true);

-- INSERT: Authenticated users can create memberships (join communities)
CREATE POLICY "Authenticated users can create memberships"
  ON memberships FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- DELETE: Users can delete their own memberships (leave communities)
CREATE POLICY "Users can delete their own memberships"
  ON memberships FOR DELETE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- ============================================
-- STEP 4: Grant permissions
-- ============================================

-- Grant SELECT permissions to anon and authenticated users
GRANT SELECT ON memberships TO anon, authenticated;

-- Grant INSERT/DELETE permissions to authenticated users
GRANT INSERT, DELETE ON memberships TO authenticated;

-- ============================================
-- STEP 5: Add comment
-- ============================================

COMMENT ON TABLE memberships IS 'Table storing community memberships with user_id referencing auth.users(id) and community_id referencing communities(id)';


