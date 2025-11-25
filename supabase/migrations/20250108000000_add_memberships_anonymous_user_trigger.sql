-- Migration: Add Anonymous User Trigger for Memberships Table
-- Description: Ensures anonymous users are automatically created in users_local when joining communities
-- Date: 2025-01-08
-- 
-- This fixes the issue where new anonymous users trying to join a community would fail
-- with a foreign key constraint error if they don't exist in users_local yet.
--
-- The ensure_user_exists() function already exists from migration 20250104000002,
-- so we just need to add the trigger for the memberships table.

-- Create trigger for memberships table
-- This ensures that when a new anonymous user joins a community, they are
-- automatically created in users_local if they don't exist yet
DROP TRIGGER IF EXISTS handle_anonymous_user_memberships ON memberships;
CREATE TRIGGER handle_anonymous_user_memberships
  BEFORE INSERT ON memberships
  FOR EACH ROW
  EXECUTE FUNCTION handle_anonymous_user();

-- Note: Now all tables that reference users_local(id) have triggers to ensure
-- anonymous users are automatically created:
-- - community_posts (user_id, created_by)
-- - community_comments (user_id, created_by)
-- - community_reactions (user_id)
-- - community_assets (user_id, created_by)
-- - memberships (user_id) ← NEW


