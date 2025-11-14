-- Migration: Create Community Interactions Schema
-- Description: Creates tables for community posts, comments, reactions, members, and assets
-- Date: 2024

-- ============================================
-- 1. Community Posts Table
-- ============================================
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for community_posts
CREATE INDEX IF NOT EXISTS idx_community_posts_community_id ON community_posts(community_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON community_posts(status);
CREATE INDEX IF NOT EXISTS idx_community_posts_post_type ON community_posts(post_type);

-- ============================================
-- 2. Community Comments Table (Threaded)
-- ============================================
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_html TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'flagged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for community_comments
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_parent_id ON community_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_created_at ON community_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_comments_status ON community_comments(status);

-- ============================================
-- 3. Community Reactions Table
-- ============================================
CREATE TABLE IF NOT EXISTS community_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Indexes for community_reactions
CREATE INDEX IF NOT EXISTS idx_community_reactions_post_id ON community_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_community_reactions_comment_id ON community_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_community_reactions_user_id ON community_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_community_reactions_type ON community_reactions(reaction_type);

-- ============================================
-- 4. Community Members Table
-- ============================================
CREATE TABLE IF NOT EXISTS community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at TIMESTAMPTZ,
  CONSTRAINT community_members_unique UNIQUE (community_id, user_id)
);

-- Indexes for community_members
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_role ON community_members(role);
CREATE INDEX IF NOT EXISTS idx_community_members_joined_at ON community_members(joined_at DESC);

-- ============================================
-- 5. Community Assets Table (for uploaded media)
-- ============================================
CREATE TABLE IF NOT EXISTS community_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Indexes for community_assets
CREATE INDEX IF NOT EXISTS idx_community_assets_community_id ON community_assets(community_id);
CREATE INDEX IF NOT EXISTS idx_community_assets_post_id ON community_assets(post_id);
CREATE INDEX IF NOT EXISTS idx_community_assets_comment_id ON community_assets(comment_id);
CREATE INDEX IF NOT EXISTS idx_community_assets_user_id ON community_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_community_assets_type ON community_assets(asset_type);

-- ============================================
-- 6. Update Triggers for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at
  BEFORE UPDATE ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. Views for aggregated data
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

-- View: Community members with counts
CREATE OR REPLACE VIEW community_members_with_counts AS
SELECT 
  c.id as community_id,
  COUNT(DISTINCT m.id) as member_count,
  COUNT(DISTINCT CASE WHEN m.role = 'owner' THEN m.id END) as owner_count,
  COUNT(DISTINCT CASE WHEN m.role = 'admin' THEN m.id END) as admin_count,
  COUNT(DISTINCT CASE WHEN m.role = 'moderator' THEN m.id END) as moderator_count
FROM communities c
LEFT JOIN community_members m ON m.community_id = c.id
GROUP BY c.id;

-- ============================================
-- 8. RLS Policies (Row Level Security)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_assets ENABLE ROW LEVEL SECURITY;

-- Community Posts Policies
CREATE POLICY "Anyone can view active community posts"
  ON community_posts FOR SELECT
  USING (status = 'active');

CREATE POLICY "Members can create posts in their communities"
  ON community_posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_id = community_posts.community_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own posts"
  ON community_posts FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own posts"
  ON community_posts FOR DELETE
  USING (user_id = auth.uid());

-- Community Comments Policies
CREATE POLICY "Anyone can view active comments"
  ON community_comments FOR SELECT
  USING (status = 'active');

CREATE POLICY "Members can create comments"
  ON community_comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_posts p
      JOIN community_members m ON m.community_id = p.community_id
      WHERE p.id = community_comments.post_id
      AND m.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own comments"
  ON community_comments FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON community_comments FOR DELETE
  USING (user_id = auth.uid());

-- Community Reactions Policies
CREATE POLICY "Anyone can view reactions"
  ON community_reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reactions"
  ON community_reactions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own reactions"
  ON community_reactions FOR DELETE
  USING (user_id = auth.uid());

-- Community Members Policies
CREATE POLICY "Anyone can view community members"
  ON community_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join communities"
  ON community_members FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can leave communities"
  ON community_members FOR DELETE
  USING (user_id = auth.uid());

-- Community Assets Policies
CREATE POLICY "Anyone can view community assets"
  ON community_assets FOR SELECT
  USING (true);

CREATE POLICY "Members can upload assets"
  ON community_assets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_id = community_assets.community_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own assets"
  ON community_assets FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- 9. Functions for common operations
-- ============================================

-- Function to get comment thread (recursive)
CREATE OR REPLACE FUNCTION get_comment_thread(parent_comment_id UUID)
RETURNS TABLE (
  id UUID,
  post_id UUID,
  user_id UUID,
  parent_id UUID,
  content TEXT,
  created_at TIMESTAMPTZ,
  depth INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE comment_tree AS (
    -- Base case: the parent comment
    SELECT 
      c.id,
      c.post_id,
      c.user_id,
      c.parent_id,
      c.content,
      c.created_at,
      0 as depth
    FROM community_comments c
    WHERE c.id = parent_comment_id AND c.status = 'active'
    
    UNION ALL
    
    -- Recursive case: child comments
    SELECT 
      c.id,
      c.post_id,
      c.user_id,
      c.parent_id,
      c.content,
      c.created_at,
      ct.depth + 1
    FROM community_comments c
    INNER JOIN comment_tree ct ON c.parent_id = ct.id
    WHERE c.status = 'active'
  )
  SELECT * FROM comment_tree ORDER BY depth, created_at;
END;
$$ LANGUAGE plpgsql;

-- Function to update last_active_at for members
CREATE OR REPLACE FUNCTION update_member_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE community_members
  SET last_active_at = NOW()
  WHERE community_id = NEW.community_id
  AND user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_member_activity_on_post
  AFTER INSERT ON community_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_member_last_active();

CREATE TRIGGER update_member_activity_on_comment
  AFTER INSERT ON community_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_member_last_active();

-- ============================================
-- 10. Disable RLS for Development (Temporary)
-- ============================================
-- WARNING: Only use in development! Re-enable RLS in production.
-- These statements disable RLS to allow easier seeding and testing.

ALTER TABLE communities DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_reactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE memberships DISABLE ROW LEVEL SECURITY;

