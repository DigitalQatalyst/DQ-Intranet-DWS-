-- Migration: Create posts_v2 table
-- Description: Creates a new simplified posts table to replace community_posts
-- Date: 2025-01-08

-- ============================================
-- STEP 1: Create posts_v2 table
-- ============================================

CREATE TABLE IF NOT EXISTS posts_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- STEP 2: Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_posts_v2_community_id ON posts_v2(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_v2_user_id ON posts_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_v2_created_at ON posts_v2(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_v2_updated_at ON posts_v2(updated_at DESC);

-- ============================================
-- STEP 3: Create update trigger for updated_at
-- ============================================

-- Function for updating updated_at column
CREATE OR REPLACE FUNCTION update_posts_v2_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for posts_v2 updated_at
DROP TRIGGER IF EXISTS update_posts_v2_updated_at ON posts_v2;
CREATE TRIGGER update_posts_v2_updated_at
  BEFORE UPDATE ON posts_v2
  FOR EACH ROW
  EXECUTE FUNCTION update_posts_v2_updated_at();

-- ============================================
-- STEP 4: Set up RLS (Row Level Security)
-- ============================================

ALTER TABLE posts_v2 ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view posts_v2" ON posts_v2;
DROP POLICY IF EXISTS "Authenticated users can create posts_v2" ON posts_v2;
DROP POLICY IF EXISTS "Users can update their own posts_v2" ON posts_v2;
DROP POLICY IF EXISTS "Users can delete their own posts_v2" ON posts_v2;

-- SELECT: Anyone can view posts
CREATE POLICY "Anyone can view posts_v2"
  ON posts_v2 FOR SELECT
  USING (true);

-- INSERT: Authenticated users can create posts (membership check should be done in application)
CREATE POLICY "Authenticated users can create posts_v2"
  ON posts_v2 FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- UPDATE: Users can update their own posts
CREATE POLICY "Users can update their own posts_v2"
  ON posts_v2 FOR UPDATE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- DELETE: Users can delete their own posts
CREATE POLICY "Users can delete their own posts_v2"
  ON posts_v2 FOR DELETE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- ============================================
-- STEP 5: Grant permissions
-- ============================================

-- Grant SELECT permissions to anon and authenticated users
GRANT SELECT ON posts_v2 TO anon, authenticated;

-- Grant INSERT/UPDATE/DELETE permissions to authenticated users
GRANT INSERT, UPDATE, DELETE ON posts_v2 TO authenticated;

-- ============================================
-- STEP 6: Add comments
-- ============================================

COMMENT ON TABLE posts_v2 IS 'Simplified posts table for community posts with id, community_id, user_id, title, content, and timestamps';


