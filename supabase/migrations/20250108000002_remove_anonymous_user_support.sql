-- Migration: Remove Anonymous User Support
-- Description: Removes all anonymous user support from Communities Marketplace.
--              All users must be authenticated with Supabase to join communities or interact.
-- Date: 2025-01-08

-- ============================================
-- 1. Remove Anonymous User Triggers
-- ============================================

-- Drop all triggers that auto-create anonymous users
DROP TRIGGER IF EXISTS handle_anonymous_user_posts ON community_posts;
DROP TRIGGER IF EXISTS handle_anonymous_user_comments ON community_comments;
DROP TRIGGER IF EXISTS handle_anonymous_user_reactions ON community_reactions;
DROP TRIGGER IF EXISTS handle_anonymous_user_assets ON community_assets;
DROP TRIGGER IF EXISTS handle_anonymous_user_memberships ON memberships;

-- Drop trigger functions
DROP FUNCTION IF EXISTS handle_anonymous_user() CASCADE;
DROP FUNCTION IF EXISTS ensure_user_exists(UUID) CASCADE;

-- ============================================
-- 2. Update RLS Policies for Memberships Table
-- ============================================

-- Enable RLS on memberships table if not already enabled
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on memberships (if any)
DROP POLICY IF EXISTS "Users can join communities" ON memberships;
DROP POLICY IF EXISTS "Users can leave communities" ON memberships;
DROP POLICY IF EXISTS "Anyone can view memberships" ON memberships;
DROP POLICY IF EXISTS "Authenticated users can join communities" ON memberships;

-- Create new policies requiring authentication

-- SELECT: Authenticated users can view memberships (for their own memberships or communities they're in)
CREATE POLICY "Authenticated users can view memberships"
  ON memberships FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM memberships m2
        WHERE m2.community_id = memberships.community_id
        AND m2.user_id = auth.uid()
      )
    )
  );

-- INSERT: Only authenticated users can join communities
CREATE POLICY "Authenticated users can join communities"
  ON memberships FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- DELETE: Only authenticated users can leave communities (their own memberships)
CREATE POLICY "Authenticated users can leave communities"
  ON memberships FOR DELETE
  USING (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
  );

-- ============================================
-- 3. Verify RLS Policies on Other Tables
-- ============================================
-- Note: The previous migration (20250108000001_require_auth_for_community_interactions.sql)
-- already updated policies for community_posts, community_comments, community_reactions,
-- and community_assets to require authentication. This migration focuses on memberships.

-- ============================================
-- 4. Clean Up Anonymous User Records (Optional)
-- ============================================
-- Uncomment the following if you want to remove existing anonymous user records
-- from users_local table. This is optional and should be done carefully.

-- DELETE FROM users_local
-- WHERE email LIKE 'anonymous-%@system.local'
-- OR username = 'Guest User'
-- OR role = 'guest';

-- ============================================
-- 5. Notes
-- ============================================
-- - All community interactions now require Supabase authentication
-- - Anonymous users cannot join communities
-- - Anonymous users cannot create posts, comments, or reactions
-- - The memberships table now enforces authentication via RLS
-- - User profiles are stored in users_local table with fields:
--   - id (UUID, references auth.users.id)
--   - email (TEXT)
--   - username (TEXT, nullable)
--   - role (TEXT, nullable)
--   - avatar_url (TEXT, nullable)
--   - created_at (TIMESTAMPTZ)


