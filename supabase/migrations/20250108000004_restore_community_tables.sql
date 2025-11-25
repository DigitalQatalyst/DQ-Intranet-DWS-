-- Migration: Restore Community Tables
-- Description: Restores the original community_posts, community_comments, and community_reactions tables
--              This is a rollback migration to undo the simplified table structure
-- Date: 2025-01-08

-- ============================================
-- STEP 1: Drop new tables if they exist
-- ============================================

DROP TABLE IF EXISTS reactions CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;

-- ============================================
-- STEP 2: Drop any views that might reference new tables
-- ============================================

DROP VIEW IF EXISTS community_posts_with_counts CASCADE;

-- ============================================
-- STEP 3: Recreate community_posts table
-- ============================================

CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users_local(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  content_html TEXT,
  post_type TEXT NOT NULL DEFAULT 'text' CHECK (post_type IN ('text', 'media', 'poll', 'event', 'article', 'announcement')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted', 'flagged')),
  tags TEXT[],
  metadata JSONB,
  event_date TIMESTAMPTZ,
  event_location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Add created_by column for compatibility with code that uses this field
  created_by UUID REFERENCES users_local(id) ON DELETE CASCADE,
  
  -- Ensure at least one of user_id or created_by is set
  CONSTRAINT community_posts_user_check CHECK (user_id IS NOT NULL OR created_by IS NOT NULL)
);

-- ============================================
-- STEP 4: Recreate community_comments table
-- ============================================

CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_local(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_html TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'flagged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- STEP 5: Recreate community_reactions table
-- ============================================

CREATE TABLE IF NOT EXISTS community_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users_local(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'helpful', 'insightful', 'love', 'celebrate')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT community_reactions_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR 
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),
  CONSTRAINT community_reactions_unique_user_target UNIQUE (user_id, post_id, comment_id, reaction_type)
);

-- ============================================
-- STEP 6: Recreate community_assets table
-- ============================================

CREATE TABLE IF NOT EXISTS community_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users_local(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('image', 'video', 'document', 'link')),
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT community_assets_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR 
    (post_id IS NULL AND comment_id IS NOT NULL) OR
    (post_id IS NULL AND comment_id IS NULL)
  )
);

-- ============================================
-- STEP 7: Create indexes for performance
-- ============================================

-- Community Posts indexes
CREATE INDEX IF NOT EXISTS idx_community_posts_community_id ON community_posts(community_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_by ON community_posts(created_by);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_posts_post_type ON community_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_updated_at ON community_posts(updated_at DESC);

-- Community Comments indexes
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_parent_id ON community_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_created_at ON community_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_comments_status ON community_comments(status);

-- Community Reactions indexes
CREATE INDEX IF NOT EXISTS idx_community_reactions_post_id ON community_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_community_reactions_comment_id ON community_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_community_reactions_user_id ON community_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_community_reactions_type ON community_reactions(reaction_type);

-- Community Assets indexes
CREATE INDEX IF NOT EXISTS idx_community_assets_community_id ON community_assets(community_id);
CREATE INDEX IF NOT EXISTS idx_community_assets_post_id ON community_assets(post_id);
CREATE INDEX IF NOT EXISTS idx_community_assets_comment_id ON community_assets(comment_id);
CREATE INDEX IF NOT EXISTS idx_community_assets_user_id ON community_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_community_assets_type ON community_assets(asset_type);

-- ============================================
-- STEP 8: Create update triggers
-- ============================================

-- Function for updating updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to sync created_by and user_id bidirectionally
CREATE OR REPLACE FUNCTION sync_created_by_from_user_id()
RETURNS TRIGGER AS $$
BEGIN
  -- If created_by is set but user_id is not, use created_by for user_id
  IF NEW.created_by IS NOT NULL AND NEW.user_id IS NULL THEN
    NEW.user_id = NEW.created_by;
  -- If user_id is set but created_by is not, use user_id for created_by
  ELSIF NEW.user_id IS NOT NULL AND NEW.created_by IS NULL THEN
    NEW.created_by = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for community_posts updated_at
DROP TRIGGER IF EXISTS update_community_posts_updated_at ON community_posts;
CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to sync created_by with user_id
DROP TRIGGER IF EXISTS sync_community_posts_created_by ON community_posts;
CREATE TRIGGER sync_community_posts_created_by
  BEFORE INSERT ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION sync_created_by_from_user_id();

-- Trigger for community_comments
DROP TRIGGER IF EXISTS update_community_comments_updated_at ON community_comments;
CREATE TRIGGER update_community_comments_updated_at
  BEFORE UPDATE ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STEP 9: Recreate views
-- ============================================

-- View: Community posts with reaction and comment counts
CREATE OR REPLACE VIEW community_posts_with_counts AS
SELECT 
  p.*,
  COALESCE(COUNT(DISTINCT r.id) FILTER (WHERE r.reaction_type = 'like'), 0) as like_count,
  COALESCE(COUNT(DISTINCT r.id) FILTER (WHERE r.reaction_type = 'helpful'), 0) as helpful_count,
  COALESCE(COUNT(DISTINCT r.id) FILTER (WHERE r.reaction_type = 'insightful'), 0) as insightful_count,
  COALESCE(COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'active'), 0) as comment_count
FROM community_posts p
LEFT JOIN community_reactions r ON r.post_id = p.id
LEFT JOIN community_comments c ON c.post_id = p.id
WHERE p.status = 'active'
GROUP BY p.id;

-- ============================================
-- STEP 10: Grant Permissions
-- ============================================

-- Grant SELECT permissions to anon and authenticated users
GRANT SELECT ON community_posts TO anon, authenticated;
GRANT SELECT ON community_comments TO anon, authenticated;
GRANT SELECT ON community_reactions TO anon, authenticated;
GRANT SELECT ON community_assets TO anon, authenticated;

-- Grant INSERT/UPDATE/DELETE permissions to authenticated users
GRANT INSERT, UPDATE, DELETE ON community_posts TO authenticated;
GRANT INSERT, UPDATE, DELETE ON community_comments TO authenticated;
GRANT INSERT, UPDATE, DELETE ON community_reactions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON community_assets TO authenticated;

-- Grant permissions on the view
GRANT SELECT ON community_posts_with_counts TO anon, authenticated;

-- ============================================
-- STEP 11: Set up RLS (Row Level Security)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_assets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view active community posts" ON community_posts;
DROP POLICY IF EXISTS "Authenticated members can create posts" ON community_posts;
DROP POLICY IF EXISTS "Authenticated users can update their own posts" ON community_posts;
DROP POLICY IF EXISTS "Authenticated users can delete their own posts" ON community_posts;
DROP POLICY IF EXISTS "Anyone can view active comments" ON community_comments;
DROP POLICY IF EXISTS "Authenticated members can create comments" ON community_comments;
DROP POLICY IF EXISTS "Authenticated users can update their own comments" ON community_comments;
DROP POLICY IF EXISTS "Authenticated users can delete their own comments" ON community_comments;
DROP POLICY IF EXISTS "Anyone can view reactions" ON community_reactions;
DROP POLICY IF EXISTS "Authenticated members can create reactions" ON community_reactions;
DROP POLICY IF EXISTS "Authenticated users can delete their own reactions" ON community_reactions;
DROP POLICY IF EXISTS "Anyone can view community assets" ON community_assets;
DROP POLICY IF EXISTS "Members can upload assets" ON community_assets;
DROP POLICY IF EXISTS "Users can delete their own assets" ON community_assets;

-- Community Posts Policies
-- SELECT: Anyone can view active posts
CREATE POLICY "Anyone can view active community posts"
  ON community_posts FOR SELECT
  USING (status = 'active');

-- INSERT: Only authenticated members can create posts
CREATE POLICY "Authenticated members can create posts"
  ON community_posts FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM memberships
      WHERE community_id = community_posts.community_id
      AND user_id = auth.uid()
    )
  );

-- UPDATE: Only authenticated users can update their own posts
CREATE POLICY "Authenticated users can update their own posts"
  ON community_posts FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND (user_id = auth.uid() OR created_by = auth.uid())
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (user_id = auth.uid() OR created_by = auth.uid())
  );

-- DELETE: Only authenticated users can delete their own posts
CREATE POLICY "Authenticated users can delete their own posts"
  ON community_posts FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND (user_id = auth.uid() OR created_by = auth.uid())
  );

-- Community Comments Policies
-- SELECT: Anyone can view active comments
CREATE POLICY "Anyone can view active comments"
  ON community_comments FOR SELECT
  USING (status = 'active');

-- INSERT: Only authenticated members can create comments
CREATE POLICY "Authenticated members can create comments"
  ON community_comments FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM community_posts p
      JOIN memberships m ON m.community_id = p.community_id
      WHERE p.id = community_comments.post_id
      AND m.user_id = auth.uid()
    )
  );

-- UPDATE: Only authenticated users can update their own comments
CREATE POLICY "Authenticated users can update their own comments"
  ON community_comments FOR UPDATE
  USING (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- DELETE: Only authenticated users can delete their own comments
CREATE POLICY "Authenticated users can delete their own comments"
  ON community_comments FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- Community Reactions Policies
-- SELECT: Anyone can view reactions
CREATE POLICY "Anyone can view reactions"
  ON community_reactions FOR SELECT
  USING (true);

-- INSERT: Only authenticated members can create reactions
CREATE POLICY "Authenticated members can create reactions"
  ON community_reactions FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      -- For post reactions, check membership via post's community
      (post_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM community_posts p
        JOIN memberships m ON m.community_id = p.community_id
        WHERE p.id = community_reactions.post_id
        AND m.user_id = auth.uid()
      ))
      OR
      -- For comment reactions, check membership via comment's post's community
      (comment_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM community_comments c
        JOIN community_posts p ON p.id = c.post_id
        JOIN memberships m ON m.community_id = p.community_id
        WHERE c.id = community_reactions.comment_id
        AND m.user_id = auth.uid()
      ))
    )
  );

-- DELETE: Only authenticated users can delete their own reactions
CREATE POLICY "Authenticated users can delete their own reactions"
  ON community_reactions FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- Community Assets Policies
-- SELECT: Anyone can view community assets
CREATE POLICY "Anyone can view community assets"
  ON community_assets FOR SELECT
  USING (true);

-- INSERT: Only authenticated members can upload assets
CREATE POLICY "Members can upload assets"
  ON community_assets FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM memberships
      WHERE community_id = community_assets.community_id
      AND user_id = auth.uid()
    )
  );

-- DELETE: Only authenticated users can delete their own assets
CREATE POLICY "Users can delete their own assets"
  ON community_assets FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- ============================================
-- STEP 12: Add comments
-- ============================================

COMMENT ON TABLE community_posts IS 'Table storing community posts with full feature set including title, content, post_type, status, tags, and metadata';
COMMENT ON TABLE community_comments IS 'Table storing comments on posts with support for nested comments via parent_id';
COMMENT ON TABLE community_reactions IS 'Table storing reactions (like, love, etc.) on posts or comments';
COMMENT ON TABLE community_assets IS 'Table storing media assets (images, videos, documents) associated with posts, comments, or communities';


