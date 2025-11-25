-- Migration: Reset Community Tables
-- Description: Drops and recreates community_posts, community_comments, and community_reactions tables
-- Date: 2025-01-01

-- ============================================
-- STEP 1: Drop existing tables (if they exist)
-- ============================================

DROP TABLE IF EXISTS community_reactions CASCADE;
DROP TABLE IF EXISTS community_comments CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;

-- ============================================
-- STEP 2: Create community_posts table
-- ============================================

CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users_local(id) ON DELETE CASCADE
);

-- ============================================
-- STEP 3: Create community_comments table
-- ============================================

CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users_local(id) ON DELETE CASCADE
);

-- ============================================
-- STEP 4: Create community_reactions table
-- ============================================

CREATE TABLE community_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'insightful')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 5: Create indexes for performance
-- ============================================

CREATE INDEX idx_community_posts_community_id ON community_posts(community_id);
CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);

CREATE INDEX idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX idx_community_comments_user_id ON community_comments(user_id);
CREATE INDEX idx_community_comments_created_at ON community_comments(created_at DESC);

CREATE INDEX idx_community_reactions_target ON community_reactions(target_type, target_id);
CREATE INDEX idx_community_reactions_user_id ON community_reactions(user_id);
CREATE INDEX idx_community_reactions_created_at ON community_reactions(created_at DESC);

-- ============================================
-- STEP 6: Disable RLS for Development
-- ============================================

ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_reactions DISABLE ROW LEVEL SECURITY;



