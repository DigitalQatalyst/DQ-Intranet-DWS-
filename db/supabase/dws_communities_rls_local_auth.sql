-- =====================================================
-- RLS Policies for Local Authentication
-- =====================================================
-- This file contains RLS policies that work with local authentication
-- (users_local table) instead of Supabase Auth.
-- 
-- IMPORTANT: These policies are more permissive and rely on application-level
-- authentication. For production, consider migrating to Supabase Auth.
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users_local;
DROP POLICY IF EXISTS "Users can update own data" ON users_local;
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON communities;
DROP POLICY IF EXISTS "Authenticated users can create communities" ON communities;
DROP POLICY IF EXISTS "Community owners can update" ON communities;
DROP POLICY IF EXISTS "Active posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Members can create posts" ON posts;
DROP POLICY IF EXISTS "Post authors can update own posts" ON posts;
DROP POLICY IF EXISTS "Active comments are viewable" ON comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
DROP POLICY IF EXISTS "Comment authors can update own comments" ON comments;
DROP POLICY IF EXISTS "Memberships are viewable" ON memberships;
DROP POLICY IF EXISTS "Users can join communities" ON memberships;
DROP POLICY IF EXISTS "Users can leave communities" ON memberships;
DROP POLICY IF EXISTS "Reactions are viewable" ON reactions;
DROP POLICY IF EXISTS "Users can create reactions" ON reactions;
DROP POLICY IF EXISTS "Users can delete own reactions" ON reactions;
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Moderators can read reports" ON reports;
DROP POLICY IF EXISTS "Users can create reports" ON reports;
DROP POLICY IF EXISTS "Moderators can read moderation actions" ON moderation_actions;
DROP POLICY IF EXISTS "Media files are viewable" ON media_files;
DROP POLICY IF EXISTS "Users can create media files" ON media_files;
DROP POLICY IF EXISTS "Users can delete own media files" ON media_files;
DROP POLICY IF EXISTS "Poll options are viewable" ON poll_options;
DROP POLICY IF EXISTS "Users can read own poll votes" ON poll_votes;
DROP POLICY IF EXISTS "Users can create poll votes" ON poll_votes;
DROP POLICY IF EXISTS "Users can read own relationships" ON member_relationships;
DROP POLICY IF EXISTS "Users can create own relationships" ON member_relationships;
DROP POLICY IF EXISTS "Users can update own relationships" ON member_relationships;

-- =====================================================
-- Permissive RLS Policies for Local Auth
-- =====================================================
-- These policies allow all operations for now.
-- Application-level authentication should be enforced in the code.
-- For production, consider using Supabase Auth with proper RLS policies.

-- Users: Allow all operations (application-level auth required)
CREATE POLICY "Users are viewable by everyone"
    ON users_local FOR SELECT
    USING (true);

CREATE POLICY "Users can insert"
    ON users_local FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update"
    ON users_local FOR UPDATE
    USING (true);

-- Communities: Allow all operations
CREATE POLICY "Communities are viewable by everyone"
    ON communities FOR SELECT
    USING (true);

CREATE POLICY "Users can create communities"
    ON communities FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update communities"
    ON communities FOR UPDATE
    USING (true);

-- Posts: Allow all operations
CREATE POLICY "Posts are viewable by everyone"
    ON posts FOR SELECT
    USING (true);

CREATE POLICY "Users can create posts"
    ON posts FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update posts"
    ON posts FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete posts"
    ON posts FOR DELETE
    USING (true);

-- Comments: Allow all operations
CREATE POLICY "Comments are viewable by everyone"
    ON comments FOR SELECT
    USING (true);

CREATE POLICY "Users can create comments"
    ON comments FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update comments"
    ON comments FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete comments"
    ON comments FOR DELETE
    USING (true);

-- Memberships: Allow all operations
CREATE POLICY "Memberships are viewable by everyone"
    ON memberships FOR SELECT
    USING (true);

CREATE POLICY "Users can create memberships"
    ON memberships FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update memberships"
    ON memberships FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete memberships"
    ON memberships FOR DELETE
    USING (true);

-- Reactions: Allow all operations
CREATE POLICY "Reactions are viewable by everyone"
    ON reactions FOR SELECT
    USING (true);

CREATE POLICY "Users can create reactions"
    ON reactions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update reactions"
    ON reactions FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete reactions"
    ON reactions FOR DELETE
    USING (true);

-- Notifications: Allow all operations
CREATE POLICY "Notifications are viewable by everyone"
    ON notifications FOR SELECT
    USING (true);

CREATE POLICY "Users can create notifications"
    ON notifications FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update notifications"
    ON notifications FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete notifications"
    ON notifications FOR DELETE
    USING (true);

-- Reports: Allow all operations
CREATE POLICY "Reports are viewable by everyone"
    ON reports FOR SELECT
    USING (true);

CREATE POLICY "Users can create reports"
    ON reports FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update reports"
    ON reports FOR UPDATE
    USING (true);

-- Moderation actions: Allow all operations
CREATE POLICY "Moderation actions are viewable by everyone"
    ON moderation_actions FOR SELECT
    USING (true);

CREATE POLICY "Users can create moderation actions"
    ON moderation_actions FOR INSERT
    WITH CHECK (true);

-- Media files: Allow all operations
CREATE POLICY "Media files are viewable by everyone"
    ON media_files FOR SELECT
    USING (true);

CREATE POLICY "Users can create media files"
    ON media_files FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update media files"
    ON media_files FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete media files"
    ON media_files FOR DELETE
    USING (true);

-- Poll options: Allow all operations
CREATE POLICY "Poll options are viewable by everyone"
    ON poll_options FOR SELECT
    USING (true);

CREATE POLICY "Users can create poll options"
    ON poll_options FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update poll options"
    ON poll_options FOR UPDATE
    USING (true);

-- Poll votes: Allow all operations
CREATE POLICY "Poll votes are viewable by everyone"
    ON poll_votes FOR SELECT
    USING (true);

CREATE POLICY "Users can create poll votes"
    ON poll_votes FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can delete poll votes"
    ON poll_votes FOR DELETE
    USING (true);

-- Member relationships: Allow all operations
CREATE POLICY "Member relationships are viewable by everyone"
    ON member_relationships FOR SELECT
    USING (true);

CREATE POLICY "Users can create member relationships"
    ON member_relationships FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update member relationships"
    ON member_relationships FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete member relationships"
    ON member_relationships FOR DELETE
    USING (true);

-- Community roles: Allow all operations
CREATE POLICY "Community roles are viewable by everyone"
    ON community_roles FOR SELECT
    USING (true);

CREATE POLICY "Users can create community roles"
    ON community_roles FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update community roles"
    ON community_roles FOR UPDATE
    USING (true);

CREATE POLICY "Users can delete community roles"
    ON community_roles FOR DELETE
    USING (true);

-- Conversations: Allow all operations
CREATE POLICY "Conversations are viewable by everyone"
    ON conversations FOR SELECT
    USING (true);

CREATE POLICY "Users can create conversations"
    ON conversations FOR INSERT
    WITH CHECK (true);

-- Conversation participants: Allow all operations
CREATE POLICY "Conversation participants are viewable by everyone"
    ON conversation_participants FOR SELECT
    USING (true);

CREATE POLICY "Users can create conversation participants"
    ON conversation_participants FOR INSERT
    WITH CHECK (true);

-- Messages: Allow all operations
CREATE POLICY "Messages are viewable by everyone"
    ON messages FOR SELECT
    USING (true);

CREATE POLICY "Users can create messages"
    ON messages FOR INSERT
    WITH CHECK (true);

-- Events: Allow all operations
CREATE POLICY "Events are viewable by everyone"
    ON events FOR SELECT
    USING (true);

CREATE POLICY "Users can create events"
    ON events FOR INSERT
    WITH CHECK (true);

-- Event RSVPs: Allow all operations
CREATE POLICY "Event RSVPs are viewable by everyone"
    ON event_rsvps FOR SELECT
    USING (true);

CREATE POLICY "Users can create event RSVPs"
    ON event_rsvps FOR INSERT
    WITH CHECK (true);

-- User roles: Allow all operations
CREATE POLICY "User roles are viewable by everyone"
    ON user_roles FOR SELECT
    USING (true);

CREATE POLICY "Users can create user roles"
    ON user_roles FOR INSERT
    WITH CHECK (true);

COMMENT ON POLICY "Users are viewable by everyone" ON users_local IS 'Permissive policy for local auth - application-level auth required';
COMMENT ON POLICY "Communities are viewable by everyone" ON communities IS 'Permissive policy for local auth - application-level auth required';

