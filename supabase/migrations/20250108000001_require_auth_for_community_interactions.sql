-- Migration: Require Authentication for Community Interactions
-- Description: Updates RLS policies to require Supabase authentication for all interactions
--              while keeping anonymous joins optional. Removes anonymous interaction triggers.
-- Date: 2025-01-08

-- ============================================
-- 1. Remove Anonymous User Interaction Triggers
-- ============================================

-- Drop triggers that auto-create anonymous users
DROP TRIGGER IF EXISTS handle_anonymous_user_posts ON community_posts;
DROP TRIGGER IF EXISTS handle_anonymous_user_comments ON community_comments;
DROP TRIGGER IF EXISTS handle_anonymous_user_reactions ON community_reactions;
DROP TRIGGER IF EXISTS handle_anonymous_user_assets ON community_assets;

-- Drop trigger functions (keep ensure_user_exists for potential future use)
DROP FUNCTION IF EXISTS handle_anonymous_user() CASCADE;

-- ============================================
-- 2. Enable RLS on All Tables (if not already enabled)
-- ============================================

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_assets ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. Drop Existing Policies
-- ============================================

-- Drop old policies on community_posts
DROP POLICY IF EXISTS "Anyone can view active community posts" ON community_posts;
DROP POLICY IF EXISTS "Members can create posts in their communities" ON community_posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON community_posts;

-- Drop old policies on community_comments
DROP POLICY IF EXISTS "Anyone can view active comments" ON community_comments;
DROP POLICY IF EXISTS "Members can create comments" ON community_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON community_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON community_comments;

-- Drop old policies on community_reactions
DROP POLICY IF EXISTS "Anyone can view reactions" ON community_reactions;
DROP POLICY IF EXISTS "Authenticated users can create reactions" ON community_reactions;
DROP POLICY IF EXISTS "Users can delete their own reactions" ON community_reactions;

-- Drop old policies on community_assets
DROP POLICY IF EXISTS "Anyone can view community assets" ON community_assets;
DROP POLICY IF EXISTS "Members can upload assets" ON community_assets;
DROP POLICY IF EXISTS "Users can delete their own assets" ON community_assets;

-- ============================================
-- 4. Create New RLS Policies Requiring Authentication
-- ============================================

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
    AND user_id = auth.uid()
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- DELETE: Only authenticated users can delete their own posts
CREATE POLICY "Authenticated users can delete their own posts"
  ON community_posts FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
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
CREATE POLICY "Authenticated members can upload assets"
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
CREATE POLICY "Authenticated users can delete their own assets"
  ON community_assets FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- ============================================
-- 5. Note on Anonymous Joins
-- ============================================
-- Anonymous users can still join communities via the memberships table.
-- The memberships table RLS policies should allow anonymous inserts if desired.
-- This migration only enforces authentication for interactions (posts, comments, reactions).


