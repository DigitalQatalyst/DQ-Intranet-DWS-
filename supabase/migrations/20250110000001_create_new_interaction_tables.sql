-- Migration: Create new interaction tables for Communities Marketplace
-- Description: Creates clean new tables for comments and reactions, drops old ones
-- Date: 2025-01-10

-- ============================================
-- STEP 1: Drop old tables (if they exist)
-- ============================================

DROP TABLE IF EXISTS reactions CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

-- ============================================
-- STEP 2: Create new comments table
-- ============================================

CREATE TABLE community_post_comments_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts_v2(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'flagged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- STEP 3: Create new reactions table
-- ============================================

CREATE TABLE community_post_reactions_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts_v2(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'helpful', 'insightful')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reactions_unique_user_post_type UNIQUE (user_id, post_id, reaction_type)
);

-- ============================================
-- STEP 4: Create indexes for performance
-- ============================================

-- Comments indexes
CREATE INDEX idx_community_post_comments_new_post_id ON community_post_comments_new(post_id);
CREATE INDEX idx_community_post_comments_new_user_id ON community_post_comments_new(user_id);
CREATE INDEX idx_community_post_comments_new_created_at ON community_post_comments_new(created_at DESC);
CREATE INDEX idx_community_post_comments_new_status ON community_post_comments_new(status);

-- Reactions indexes
CREATE INDEX idx_community_post_reactions_new_post_id ON community_post_reactions_new(post_id);
CREATE INDEX idx_community_post_reactions_new_user_id ON community_post_reactions_new(user_id);
CREATE INDEX idx_community_post_reactions_new_type ON community_post_reactions_new(reaction_type);
CREATE INDEX idx_community_post_reactions_new_post_type ON community_post_reactions_new(post_id, reaction_type);

-- ============================================
-- STEP 5: Create update triggers
-- ============================================

-- Function for updating updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for comments updated_at
DROP TRIGGER IF EXISTS update_community_post_comments_new_updated_at ON community_post_comments_new;
CREATE TRIGGER update_community_post_comments_new_updated_at
  BEFORE UPDATE ON community_post_comments_new
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 6: Set up RLS (Row Level Security)
-- ============================================

-- Enable RLS on new tables
ALTER TABLE community_post_comments_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_reactions_new ENABLE ROW LEVEL SECURITY;

-- Comments Policies
-- SELECT: Anyone can view active comments
CREATE POLICY "Anyone can view active comments"
  ON community_post_comments_new FOR SELECT
  USING (status = 'active');

-- INSERT: Authenticated users can create comments (must use auth.uid())
CREATE POLICY "Authenticated users can create comments"
  ON community_post_comments_new FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- UPDATE: Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON community_post_comments_new FOR UPDATE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- DELETE: Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON community_post_comments_new FOR DELETE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Reactions Policies
-- SELECT: Anyone can view reactions
CREATE POLICY "Anyone can view reactions"
  ON community_post_reactions_new FOR SELECT
  USING (true);

-- INSERT: Authenticated users can create reactions (must use auth.uid())
CREATE POLICY "Authenticated users can create reactions"
  ON community_post_reactions_new FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- DELETE: Users can delete their own reactions
CREATE POLICY "Users can delete their own reactions"
  ON community_post_reactions_new FOR DELETE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- ============================================
-- STEP 7: Grant permissions
-- ============================================

-- Grant SELECT permissions to anon and authenticated users
GRANT SELECT ON community_post_comments_new TO anon, authenticated;
GRANT SELECT ON community_post_reactions_new TO anon, authenticated;

-- Grant INSERT/UPDATE/DELETE permissions to authenticated users
GRANT INSERT, UPDATE, DELETE ON community_post_comments_new TO authenticated;
GRANT INSERT, UPDATE, DELETE ON community_post_reactions_new TO authenticated;

-- ============================================
-- STEP 8: Add comments
-- ============================================

COMMENT ON TABLE community_post_comments_new IS 'New table storing comments on posts_v2 - uses auth.uid() for user_id';
COMMENT ON TABLE community_post_reactions_new IS 'New table storing reactions (like, helpful, insightful) on posts_v2 - uses auth.uid() for user_id';

COMMENT ON COLUMN community_post_comments_new.post_id IS 'Foreign key to posts_v2.id';
COMMENT ON COLUMN community_post_comments_new.user_id IS 'Foreign key to auth.users.id - must match auth.uid()';
COMMENT ON COLUMN community_post_reactions_new.post_id IS 'Foreign key to posts_v2.id';
COMMENT ON COLUMN community_post_reactions_new.user_id IS 'Foreign key to auth.users.id - must match auth.uid()';


