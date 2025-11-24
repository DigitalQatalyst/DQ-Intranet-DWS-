-- Migration: Create comments and reactions tables
-- Description: Creates simplified comments and reactions tables for posts_v2
--              Only creates tables if they don't already exist
-- Date: 2025-01-08

-- ============================================
-- STEP 1: Check if tables exist and create comments table
-- ============================================

-- Create comments table only if it doesn't exist
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts_v2(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users_local(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'flagged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- STEP 2: Create reactions table only if it doesn't exist
-- ============================================

-- Create reactions table only if it doesn't exist
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts_v2(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'helpful', 'insightful', 'love', 'celebrate')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reactions_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR 
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),
  CONSTRAINT reactions_unique_user_target UNIQUE (user_id, post_id, comment_id, reaction_type)
);

-- ============================================
-- STEP 3: Create indexes for performance
-- ============================================

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_by ON comments(created_by);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

-- Reactions indexes
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_comment_id ON reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_type ON reactions(reaction_type);

-- ============================================
-- STEP 4: Create update triggers
-- ============================================

-- Function for updating updated_at column (reuse if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for comments updated_at
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 5: Set up RLS (Row Level Security)
-- ============================================

-- Enable RLS on comments table
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Enable RLS on reactions table
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (comments)
DROP POLICY IF EXISTS "Anyone can view active comments" ON comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

-- Drop existing policies if they exist (reactions)
DROP POLICY IF EXISTS "Anyone can view reactions" ON reactions;
DROP POLICY IF EXISTS "Authenticated users can create reactions" ON reactions;
DROP POLICY IF EXISTS "Users can delete their own reactions" ON reactions;

-- Comments Policies
-- SELECT: Anyone can view active comments
CREATE POLICY "Anyone can view active comments"
  ON comments FOR SELECT
  USING (status = 'active');

-- INSERT: Authenticated users can create comments (membership check should be done in application)
CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE: Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() IS NOT NULL AND created_by = auth.uid())
  WITH CHECK (auth.uid() IS NOT NULL AND created_by = auth.uid());

-- DELETE: Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (auth.uid() IS NOT NULL AND created_by = auth.uid());

-- Reactions Policies
-- SELECT: Anyone can view reactions
CREATE POLICY "Anyone can view reactions"
  ON reactions FOR SELECT
  USING (true);

-- INSERT: Authenticated users can create reactions (membership check should be done in application)
CREATE POLICY "Authenticated users can create reactions"
  ON reactions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- DELETE: Users can delete their own reactions
CREATE POLICY "Users can delete their own reactions"
  ON reactions FOR DELETE
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- ============================================
-- STEP 6: Grant permissions
-- ============================================

-- Grant SELECT permissions to anon and authenticated users
GRANT SELECT ON comments TO anon, authenticated;
GRANT SELECT ON reactions TO anon, authenticated;

-- Grant INSERT/UPDATE/DELETE permissions to authenticated users
GRANT INSERT, UPDATE, DELETE ON comments TO authenticated;
GRANT INSERT, UPDATE, DELETE ON reactions TO authenticated;

-- ============================================
-- STEP 7: Add comments
-- ============================================

COMMENT ON TABLE comments IS 'Table storing comments on posts_v2 with support for status tracking';
COMMENT ON TABLE reactions IS 'Table storing reactions (like, helpful, insightful, etc.) on posts_v2 or comments';

COMMENT ON COLUMN comments.post_id IS 'Foreign key to posts_v2.id';
COMMENT ON COLUMN comments.created_by IS 'Foreign key to users_local.id - the user who created the comment';
COMMENT ON COLUMN reactions.post_id IS 'Foreign key to posts_v2.id - optional, must have either post_id or comment_id';
COMMENT ON COLUMN reactions.comment_id IS 'Foreign key to comments.id - optional, must have either post_id or comment_id';
COMMENT ON COLUMN reactions.user_id IS 'Foreign key to auth.users.id - the user who created the reaction';

