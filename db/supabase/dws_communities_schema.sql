-- =====================================================
-- DQ-Intranet-DWS- Communities Schema Migration
-- =====================================================
-- This script creates all tables, views, functions, RLS policies,
-- and storage buckets needed for the Communities feature.
-- 
-- IMPORTANT: Run this against a NEW Supabase project dedicated to DWS.
-- =====================================================

-- Drop existing objects if they exist (for clean reinstall)
DROP VIEW IF EXISTS communities_with_counts CASCADE;
DROP VIEW IF EXISTS posts_with_reactions CASCADE;
DROP VIEW IF EXISTS posts_with_meta CASCADE;
DROP VIEW IF EXISTS moderation_actions_with_details CASCADE;
DROP VIEW IF EXISTS reports_with_details CASCADE;

DROP FUNCTION IF EXISTS get_feed CASCADE;
DROP FUNCTION IF EXISTS get_trending_topics CASCADE;
DROP FUNCTION IF EXISTS get_community_members CASCADE;
DROP FUNCTION IF EXISTS get_mutual_communities CASCADE;
DROP FUNCTION IF EXISTS can_moderate CASCADE;
DROP FUNCTION IF EXISTS can_moderate_community CASCADE;
DROP FUNCTION IF EXISTS update_member_role CASCADE;
DROP FUNCTION IF EXISTS remove_community_member CASCADE;
DROP FUNCTION IF EXISTS increment_poll_vote CASCADE;
DROP FUNCTION IF EXISTS get_relationship_status CASCADE;
DROP FUNCTION IF EXISTS toggle_follow CASCADE;
DROP FUNCTION IF EXISTS create_report_secure CASCADE;
DROP FUNCTION IF EXISTS create_moderation_action_secure CASCADE;
DROP FUNCTION IF EXISTS update_report_status_secure CASCADE;
DROP FUNCTION IF EXISTS search_users CASCADE;
DROP FUNCTION IF EXISTS notify_moderators_on_report CASCADE;
DROP FUNCTION IF EXISTS notify_post_author_on_moderation CASCADE;
DROP FUNCTION IF EXISTS has_role CASCADE;
DROP FUNCTION IF EXISTS has_conversation_role CASCADE;
DROP FUNCTION IF EXISTS is_conversation_participant CASCADE;

-- =====================================================
-- ENUMS
-- =====================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM ('active', 'flagged', 'deleted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE conversation_type AS ENUM ('direct', 'group');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('reply', 'mention', 'comment', 'moderation_alert', 'community_update', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_status AS ENUM ('pending', 'resolved', 'dismissed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE report_type AS ENUM ('post', 'comment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE moderation_action_type AS ENUM ('approve', 'reject', 'hide', 'warn', 'ban', 'restore', 'delete');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- TABLES
-- =====================================================

-- Users table (local authentication)
CREATE TABLE IF NOT EXISTS users_local (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    username TEXT UNIQUE,
    avatar_url TEXT,
    role user_role DEFAULT 'member',
    notification_settings JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communities table
CREATE TABLE IF NOT EXISTS communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    imageurl TEXT,
    category TEXT,
    tags TEXT[],
    isprivate BOOLEAN DEFAULT false,
    membercount INTEGER DEFAULT 0,
    activemembers INTEGER DEFAULT 0,
    activitylevel TEXT,
    recentactivity TEXT,
    created_by UUID REFERENCES users_local(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memberships table (user-community relationships)
CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users_local(id) ON DELETE CASCADE,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, community_id)
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    content_html TEXT,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users_local(id) ON DELETE SET NULL,
    post_type TEXT DEFAULT 'text',
    status content_status DEFAULT 'active',
    tags TEXT[],
    image_url TEXT,
    link_url TEXT,
    attachments JSONB,
    metadata JSONB,
    event_date TIMESTAMPTZ,
    event_location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users_local(id) ON DELETE SET NULL,
    content TEXT,
    status content_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reactions table
CREATE TABLE IF NOT EXISTS reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users_local(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id, reaction_type)
);

-- Community roles table
CREATE TABLE IF NOT EXISTS community_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users_local(id) ON DELETE CASCADE,
    role TEXT,
    UNIQUE(community_id, user_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users_local(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    related_user_id UUID REFERENCES users_local(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type conversation_type NOT NULL,
    name TEXT,
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation participants
CREATE TABLE IF NOT EXISTS conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users_local(id) ON DELETE CASCADE NOT NULL,
    role TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES users_local(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES users_local(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
    reported_by UUID REFERENCES users_local(id) ON DELETE CASCADE NOT NULL,
    target_type TEXT NOT NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    report_type report_type NOT NULL,
    reason TEXT NOT NULL,
    status report_status DEFAULT 'pending',
    resolved_by UUID REFERENCES users_local(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moderation actions table
CREATE TABLE IF NOT EXISTS moderation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE NOT NULL,
    moderator_id UUID REFERENCES users_local(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID,
    description TEXT NOT NULL,
    reason TEXT,
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    created_by UUID REFERENCES users_local(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event RSVPs
CREATE TABLE IF NOT EXISTS event_rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users_local(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Poll options
CREATE TABLE IF NOT EXISTS poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    option_text TEXT NOT NULL,
    vote_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poll votes
CREATE TABLE IF NOT EXISTS poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users_local(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(poll_option_id, user_id)
);

-- Media files
CREATE TABLE IF NOT EXISTS media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users_local(id) ON DELETE CASCADE NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    caption TEXT,
    display_order INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Member relationships (following)
CREATE TABLE IF NOT EXISTS member_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES users_local(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES users_local(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- User roles
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users_local(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- =====================================================
-- VIEWS
-- =====================================================

-- Communities with member counts
CREATE OR REPLACE VIEW communities_with_counts AS
SELECT 
    c.id,
    c.name,
    c.description,
    c.imageurl,
    c.category,
    c.created_at,
    c.isprivate,
    COUNT(DISTINCT m.user_id) AS member_count
FROM communities c
LEFT JOIN memberships m ON c.id = m.community_id
GROUP BY c.id, c.name, c.description, c.imageurl, c.category, c.created_at, c.isprivate;

-- Posts with reactions and metadata
CREATE OR REPLACE VIEW posts_with_reactions AS
SELECT 
    p.id,
    p.title,
    p.content,
    p.community_id,
    p.created_by,
    p.created_at,
    p.status,
    p.tags,
    c.name AS community_name,
    u.username AS author_username,
    u.avatar_url AS author_avatar,
    COUNT(DISTINCT CASE WHEN r.reaction_type = 'helpful' THEN r.id END) AS helpful_count,
    COUNT(DISTINCT CASE WHEN r.reaction_type = 'insightful' THEN r.id END) AS insightful_count,
    COUNT(DISTINCT com.id) AS comment_count
FROM posts p
LEFT JOIN communities c ON p.community_id = c.id
LEFT JOIN users_local u ON p.created_by = u.id
LEFT JOIN reactions r ON p.id = r.post_id
LEFT JOIN comments com ON p.id = com.post_id
GROUP BY p.id, p.title, p.content, p.community_id, p.created_by, p.created_at, 
         p.status, p.tags, c.name, u.username, u.avatar_url;

-- Posts with basic metadata
CREATE OR REPLACE VIEW posts_with_meta AS
SELECT 
    p.id,
    p.title,
    p.content,
    p.community_id,
    p.created_at,
    c.name AS community_name,
    u.username AS author_username
FROM posts p
LEFT JOIN communities c ON p.community_id = c.id
LEFT JOIN users_local u ON p.created_by = u.id;

-- Moderation actions with details
CREATE OR REPLACE VIEW moderation_actions_with_details AS
SELECT 
    ma.id,
    ma.community_id,
    ma.moderator_id,
    ma.action_type,
    ma.target_type,
    ma.target_id,
    ma.description,
    ma.reason,
    ma.status,
    ma.created_at,
    c.name AS community_name,
    u.username AS moderator_username,
    u.email AS moderator_email,
    u.avatar_url AS moderator_avatar
FROM moderation_actions ma
LEFT JOIN communities c ON ma.community_id = c.id
LEFT JOIN users_local u ON ma.moderator_id = u.id;

-- Reports with details (DWS-only view)
CREATE OR REPLACE VIEW reports_with_details AS
SELECT 
    r.id,
    r.community_id,
    r.reported_by,
    r.target_type,
    r.post_id,
    r.comment_id,
    r.report_type,
    r.reason,
    r.status,
    r.resolved_by,
    r.resolved_at,
    r.created_at,
    c.name AS community_name,
    c.imageurl AS community_image,
    u.username AS reporter_username,
    u.email AS reporter_email,
    u.avatar_url AS reporter_avatar
FROM reports r
LEFT JOIN communities c ON r.community_id = c.id
LEFT JOIN users_local u ON r.reported_by = u.id;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Get feed posts (for /communities/feed)
CREATE OR REPLACE FUNCTION get_feed(
    feed_tab TEXT,
    sort_by TEXT DEFAULT 'recent',
    user_id_param UUID DEFAULT NULL,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    community_id UUID,
    community_name TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ,
    author_username TEXT,
    author_avatar TEXT,
    helpful_count BIGINT,
    insightful_count BIGINT,
    comment_count BIGINT,
    tags TEXT[],
    status content_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.content,
        p.community_id,
        c.name AS community_name,
        p.created_by,
        p.created_at,
        u.username AS author_username,
        u.avatar_url AS author_avatar,
        COUNT(DISTINCT CASE WHEN r.reaction_type = 'helpful' THEN r.id END) AS helpful_count,
        COUNT(DISTINCT CASE WHEN r.reaction_type = 'insightful' THEN r.id END) AS insightful_count,
        COUNT(DISTINCT com.id) AS comment_count,
        p.tags,
        p.status
    FROM posts p
    LEFT JOIN communities c ON p.community_id = c.id
    LEFT JOIN users_local u ON p.created_by = u.id
    LEFT JOIN reactions r ON p.id = r.post_id
    LEFT JOIN comments com ON p.id = com.post_id
    WHERE p.status = 'active'
    GROUP BY p.id, p.title, p.content, p.community_id, c.name, p.created_by, 
             p.created_at, u.username, u.avatar_url, p.tags, p.status
    ORDER BY 
        CASE WHEN sort_by = 'recent' THEN p.created_at END DESC,
        CASE WHEN sort_by = 'popular' THEN COUNT(DISTINCT r.id) END DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Get trending topics
CREATE OR REPLACE FUNCTION get_trending_topics(
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    tag TEXT,
    post_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        unnest(p.tags) AS tag,
        COUNT(*) AS post_count
    FROM posts p
    WHERE p.created_at > NOW() - INTERVAL '7 days'
        AND p.status = 'active'
        AND p.tags IS NOT NULL
    GROUP BY tag
    ORDER BY post_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Get community members
CREATE OR REPLACE FUNCTION get_community_members(
    p_community_id UUID
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    username TEXT,
    email TEXT,
    avatar_url TEXT,
    role TEXT,
    joined_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.user_id,
        u.username,
        u.email,
        u.avatar_url,
        m.role,
        m.joined_at
    FROM memberships m
    JOIN users_local u ON m.user_id = u.id
    WHERE m.community_id = p_community_id
    ORDER BY m.joined_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Get mutual communities
CREATE OR REPLACE FUNCTION get_mutual_communities(
    p_profile_id UUID,
    p_viewer_id UUID
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    category TEXT,
    imageurl TEXT,
    member_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.category,
        c.imageurl,
        COUNT(DISTINCT m.user_id) AS member_count
    FROM communities c
    INNER JOIN memberships m1 ON c.id = m1.community_id AND m1.user_id = p_profile_id
    INNER JOIN memberships m2 ON c.id = m2.community_id AND m2.user_id = p_viewer_id
    LEFT JOIN memberships m ON c.id = m.community_id
    GROUP BY c.id, c.name, c.category, c.imageurl;
END;
$$ LANGUAGE plpgsql;

-- Increment poll vote
CREATE OR REPLACE FUNCTION increment_poll_vote(
    option_id_param UUID
)
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
BEGIN
    UPDATE poll_options
    SET vote_count = vote_count + 1
    WHERE id = option_id_param
    RETURNING vote_count INTO new_count;
    
    RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- Get relationship status (follow)
CREATE OR REPLACE FUNCTION get_relationship_status(
    p_follower_id UUID,
    p_following_id UUID
)
RETURNS TEXT AS $$
DECLARE
    rel_status TEXT;
BEGIN
    SELECT status INTO rel_status
    FROM member_relationships
    WHERE follower_id = p_follower_id
        AND following_id = p_following_id;
    
    IF rel_status IS NULL THEN
        RETURN 'none';
    END IF;
    
    RETURN rel_status;
END;
$$ LANGUAGE plpgsql;

-- Toggle follow relationship
CREATE OR REPLACE FUNCTION toggle_follow(
    p_follower_id UUID,
    p_following_id UUID
)
RETURNS TEXT AS $$
DECLARE
    current_status TEXT;
    new_status TEXT;
BEGIN
    -- Get current status
    SELECT status INTO current_status
    FROM member_relationships
    WHERE follower_id = p_follower_id
        AND following_id = p_following_id;
    
    IF current_status IS NULL OR current_status = 'inactive' THEN
        -- Create or activate relationship
        INSERT INTO member_relationships (follower_id, following_id, status)
        VALUES (p_follower_id, p_following_id, 'active')
        ON CONFLICT (follower_id, following_id)
        DO UPDATE SET status = 'active';
        RETURN 'follow';
    ELSE
        -- Deactivate relationship
        UPDATE member_relationships
        SET status = 'inactive'
        WHERE follower_id = p_follower_id
            AND following_id = p_following_id;
        RETURN 'unfollow';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Search users
CREATE OR REPLACE FUNCTION search_users(
    query TEXT,
    current_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    username TEXT,
    email TEXT,
    avatar_url TEXT,
    role user_role,
    notification_settings JSONB,
    password TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.username,
        u.email,
        u.avatar_url,
        u.role,
        u.notification_settings,
        u.password,
        u.created_at
    FROM users_local u
    WHERE (
        u.username ILIKE '%' || query || '%'
        OR u.email ILIKE '%' || query || '%'
    )
    AND (current_user_id IS NULL OR u.id != current_user_id)
    ORDER BY u.username
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- Check if user can moderate
CREATE OR REPLACE FUNCTION can_moderate(
    user_id UUID,
    community_id_param UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    user_app_role user_role;
    user_community_role TEXT;
BEGIN
    -- Check app-level role
    SELECT role INTO user_app_role
    FROM users_local
    WHERE id = user_id;
    
    IF user_app_role IN ('admin', 'moderator') THEN
        RETURN TRUE;
    END IF;
    
    -- Check community-specific role if community_id provided
    IF community_id_param IS NOT NULL THEN
        SELECT role INTO user_community_role
        FROM community_roles
        WHERE user_id = user_id AND community_id = community_id_param;
        
        IF user_community_role IN ('admin', 'moderator') THEN
            RETURN TRUE;
        END IF;
    END IF;
    
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Check if user can moderate specific community
CREATE OR REPLACE FUNCTION can_moderate_community(
    user_id_param UUID,
    community_id_param UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN can_moderate(user_id_param, community_id_param);
END;
$$ LANGUAGE plpgsql;

-- Update member role
CREATE OR REPLACE FUNCTION update_member_role(
    p_community_id UUID,
    p_user_id UUID,
    p_new_role TEXT,
    p_current_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if current user can moderate
    IF NOT can_moderate(p_current_user_id, p_community_id) THEN
        RETURN FALSE;
    END IF;
    
    -- Update the role
    UPDATE memberships
    SET role = p_new_role
    WHERE community_id = p_community_id AND user_id = p_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Remove community member
CREATE OR REPLACE FUNCTION remove_community_member(
    p_community_id UUID,
    p_user_id UUID,
    p_current_user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if current user can moderate
    IF NOT can_moderate(p_current_user_id, p_community_id) THEN
        RETURN FALSE;
    END IF;
    
    -- Remove the membership
    DELETE FROM memberships
    WHERE community_id = p_community_id AND user_id = p_user_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create report securely
CREATE OR REPLACE FUNCTION create_report_secure(
    p_user_email TEXT,
    p_community_id UUID,
    p_target_type TEXT,
    p_target_id UUID,
    p_post_id UUID DEFAULT NULL,
    p_comment_id UUID DEFAULT NULL,
    p_reason TEXT
)
RETURNS JSON AS $$
DECLARE
    v_user_id UUID;
    v_report_id UUID;
BEGIN
    -- Get user ID from email
    SELECT id INTO v_user_id
    FROM users_local
    WHERE email = p_user_email;
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('error', 'User not found');
    END IF;
    
    -- Create report
    INSERT INTO reports (
        community_id,
        reported_by,
        target_type,
        post_id,
        comment_id,
        report_type,
        reason,
        status
    ) VALUES (
        p_community_id,
        v_user_id,
        p_target_type,
        p_post_id,
        p_comment_id,
        CASE WHEN p_post_id IS NOT NULL THEN 'post'::report_type ELSE 'comment'::report_type END,
        p_reason,
        'pending'::report_status
    )
    RETURNING id INTO v_report_id;
    
    -- Notify moderators
    PERFORM notify_moderators_on_report(
        p_community_id,
        p_reason,
        v_report_id,
        p_target_type
    );
    
    RETURN json_build_object('success', true, 'report_id', v_report_id);
END;
$$ LANGUAGE plpgsql;

-- Create moderation action securely
CREATE OR REPLACE FUNCTION create_moderation_action_secure(
    p_moderator_email TEXT,
    p_community_id UUID,
    p_target_type TEXT,
    p_target_id UUID,
    p_action_type TEXT,
    p_description TEXT,
    p_reason TEXT
)
RETURNS JSON AS $$
DECLARE
    v_moderator_id UUID;
    v_action_id UUID;
BEGIN
    -- Get moderator ID from email
    SELECT id INTO v_moderator_id
    FROM users_local
    WHERE email = p_moderator_email;
    
    IF v_moderator_id IS NULL THEN
        RETURN json_build_object('error', 'Moderator not found');
    END IF;
    
    -- Check if user can moderate
    IF NOT can_moderate(v_moderator_id, p_community_id) THEN
        RETURN json_build_object('error', 'User does not have moderation permissions');
    END IF;
    
    -- Create moderation action
    INSERT INTO moderation_actions (
        community_id,
        moderator_id,
        action_type,
        target_type,
        target_id,
        description,
        reason,
        status
    ) VALUES (
        p_community_id,
        v_moderator_id,
        p_action_type,
        p_target_type,
        p_target_id,
        p_description,
        p_reason,
        'completed'
    )
    RETURNING id INTO v_action_id;
    
    -- Notify post author
    PERFORM notify_post_author_on_moderation(
        p_action_type,
        p_community_id,
        p_reason,
        p_target_id,
        p_target_type
    );
    
    RETURN json_build_object('success', true, 'action_id', v_action_id);
END;
$$ LANGUAGE plpgsql;

-- Update report status securely
CREATE OR REPLACE FUNCTION update_report_status_secure(
    p_report_id UUID,
    p_resolved_by UUID,
    p_status report_status
)
RETURNS BOOLEAN AS $$
DECLARE
    v_community_id UUID;
BEGIN
    -- Get community_id from report
    SELECT community_id INTO v_community_id
    FROM reports
    WHERE id = p_report_id;
    
    IF v_community_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user can moderate
    IF NOT can_moderate(p_resolved_by, v_community_id) THEN
        RETURN FALSE;
    END IF;
    
    -- Update report status
    UPDATE reports
    SET status = p_status,
        resolved_by = p_resolved_by,
        resolved_at = NOW()
    WHERE id = p_report_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Notify moderators on report
CREATE OR REPLACE FUNCTION notify_moderators_on_report(
    p_community_id UUID,
    p_reason TEXT,
    p_report_id UUID,
    p_target_type TEXT
)
RETURNS VOID AS $$
DECLARE
    moderator_record RECORD;
BEGIN
    -- Get all moderators for the community
    FOR moderator_record IN
        SELECT DISTINCT u.id, u.email
        FROM users_local u
        WHERE u.role IN ('admin', 'moderator')
            OR EXISTS (
                SELECT 1 FROM community_roles cr
                WHERE cr.community_id = p_community_id
                    AND cr.user_id = u.id
                    AND cr.role IN ('admin', 'moderator')
            )
    LOOP
        -- Create notification for each moderator
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            link,
            community_id
        ) VALUES (
            moderator_record.id,
            'moderation_alert'::notification_type,
            'New Report',
            'A new ' || p_target_type || ' has been reported: ' || p_reason,
            '/communities/moderation/reports/' || p_report_id,
            p_community_id
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Notify post author on moderation
CREATE OR REPLACE FUNCTION notify_post_author_on_moderation(
    p_action_type TEXT,
    p_community_id UUID,
    p_reason TEXT,
    p_target_id UUID,
    p_target_type TEXT
)
RETURNS VOID AS $$
DECLARE
    v_author_id UUID;
    v_community_name TEXT;
BEGIN
    -- Get author ID and community name
    IF p_target_type = 'post' THEN
        SELECT created_by INTO v_author_id
        FROM posts
        WHERE id = p_target_id;
    ELSIF p_target_type = 'comment' THEN
        SELECT created_by INTO v_author_id
        FROM comments
        WHERE id = p_target_id;
    END IF;
    
    IF v_author_id IS NULL THEN
        RETURN;
    END IF;
    
    SELECT name INTO v_community_name
    FROM communities
    WHERE id = p_community_id;
    
    -- Create notification for author
    INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        link,
        community_id
    ) VALUES (
        v_author_id,
        'moderation_alert'::notification_type,
        'Moderation Action',
        'Your ' || p_target_type || ' in ' || COALESCE(v_community_name, 'community') || ' was ' || p_action_type || ': ' || p_reason,
        '/communities/' || p_community_id,
        p_community_id
    );
END;
$$ LANGUAGE plpgsql;

-- Check if user has role
CREATE OR REPLACE FUNCTION has_role(
    _user_id UUID,
    _role app_role
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM user_roles
        WHERE user_id = _user_id
            AND role = _role
    ) OR EXISTS (
        SELECT 1
        FROM users_local
        WHERE id = _user_id
            AND role::text = _role::text
    );
END;
$$ LANGUAGE plpgsql;

-- Check if user has conversation role
CREATE OR REPLACE FUNCTION has_conversation_role(
    _conversation_id UUID,
    _user_id UUID,
    _role TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM conversation_participants
        WHERE conversation_id = _conversation_id
            AND user_id = _user_id
            AND role = _role
    );
END;
$$ LANGUAGE plpgsql;

-- Check if user is conversation participant
CREATE OR REPLACE FUNCTION is_conversation_participant(
    _conversation_id UUID,
    _user_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM conversation_participants
        WHERE conversation_id = _conversation_id
            AND user_id = _user_id
            AND left_at IS NULL
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- INDEXES for performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_posts_community_id ON posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_by ON posts(created_by);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_community_id ON memberships(community_id);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

CREATE INDEX IF NOT EXISTS idx_reports_community_id ON reports(community_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reported_by ON reports(reported_by);

CREATE INDEX IF NOT EXISTS idx_moderation_actions_community_id ON moderation_actions(community_id);
CREATE INDEX IF NOT EXISTS idx_moderation_actions_moderator_id ON moderation_actions(moderator_id);

CREATE INDEX IF NOT EXISTS idx_member_relationships_follower ON member_relationships(follower_id);
CREATE INDEX IF NOT EXISTS idx_member_relationships_following ON member_relationships(following_id);

CREATE INDEX IF NOT EXISTS idx_poll_votes_user_id ON poll_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_option_id ON poll_votes(poll_option_id);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users_local ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_roles ENABLE ROW LEVEL SECURITY;

-- Users: Public read, authenticated write own data
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users_local;
CREATE POLICY "Users are viewable by everyone"
    ON users_local FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can update own data" ON users_local;
CREATE POLICY "Users can update own data"
    ON users_local FOR UPDATE
    USING (auth.uid()::text = id::text OR auth.role() = 'service_role');

-- Communities: Public read, authenticated create
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON communities;
CREATE POLICY "Communities are viewable by everyone"
    ON communities FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create communities" ON communities;
CREATE POLICY "Authenticated users can create communities"
    ON communities FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Community owners can update" ON communities;
CREATE POLICY "Community owners can update"
    ON communities FOR UPDATE
    USING (created_by::text = auth.uid()::text OR EXISTS (
        SELECT 1 FROM community_roles cr
        WHERE cr.community_id = communities.id
            AND cr.user_id::text = auth.uid()::text
            AND cr.role IN ('admin', 'moderator')
    ));

-- Posts: Public read active, members can create
DROP POLICY IF EXISTS "Active posts are viewable by everyone" ON posts;
CREATE POLICY "Active posts are viewable by everyone"
    ON posts FOR SELECT
    USING (status = 'active' OR created_by::text = auth.uid()::text);

DROP POLICY IF EXISTS "Members can create posts" ON posts;
CREATE POLICY "Members can create posts"
    ON posts FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM memberships
            WHERE memberships.user_id::text = auth.uid()::text
                AND memberships.community_id = posts.community_id
        )
    );

DROP POLICY IF EXISTS "Post authors can update own posts" ON posts;
CREATE POLICY "Post authors can update own posts"
    ON posts FOR UPDATE
    USING (created_by::text = auth.uid()::text);

-- Comments: Public read active, authenticated create
DROP POLICY IF EXISTS "Active comments are viewable" ON comments;
CREATE POLICY "Active comments are viewable"
    ON comments FOR SELECT
    USING (status = 'active' OR created_by::text = auth.uid()::text);

DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
CREATE POLICY "Authenticated users can create comments"
    ON comments FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Comment authors can update own comments" ON comments;
CREATE POLICY "Comment authors can update own comments"
    ON comments FOR UPDATE
    USING (created_by::text = auth.uid()::text);

-- Memberships: Public read, authenticated create
DROP POLICY IF EXISTS "Memberships are viewable" ON memberships;
CREATE POLICY "Memberships are viewable"
    ON memberships FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can join communities" ON memberships;
CREATE POLICY "Users can join communities"
    ON memberships FOR INSERT
    WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can leave communities" ON memberships;
CREATE POLICY "Users can leave communities"
    ON memberships FOR DELETE
    USING (user_id::text = auth.uid()::text);

-- Reactions: Public read, authenticated create/delete
DROP POLICY IF EXISTS "Reactions are viewable" ON reactions;
CREATE POLICY "Reactions are viewable"
    ON reactions FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can create reactions" ON reactions;
CREATE POLICY "Users can create reactions"
    ON reactions FOR INSERT
    WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete own reactions" ON reactions;
CREATE POLICY "Users can delete own reactions"
    ON reactions FOR DELETE
    USING (user_id::text = auth.uid()::text);

-- Notifications: Users can read own notifications
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
CREATE POLICY "Users can read own notifications"
    ON notifications FOR SELECT
    USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (user_id::text = auth.uid()::text);

-- Reports: Moderators can read, authenticated create
DROP POLICY IF EXISTS "Moderators can read reports" ON reports;
CREATE POLICY "Moderators can read reports"
    ON reports FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users_local u
            WHERE u.id::text = auth.uid()::text
                AND (u.role IN ('admin', 'moderator')
                    OR EXISTS (
                        SELECT 1 FROM community_roles cr
                        WHERE cr.community_id = reports.community_id
                            AND cr.user_id = u.id
                            AND cr.role IN ('admin', 'moderator')
                    ))
        )
    );

DROP POLICY IF EXISTS "Users can create reports" ON reports;
CREATE POLICY "Users can create reports"
    ON reports FOR INSERT
    WITH CHECK (reported_by::text = auth.uid()::text);

-- Moderation actions: Moderators can read/create
DROP POLICY IF EXISTS "Moderators can read moderation actions" ON moderation_actions;
CREATE POLICY "Moderators can read moderation actions"
    ON moderation_actions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users_local u
            WHERE u.id::text = auth.uid()::text
                AND (u.role IN ('admin', 'moderator')
                    OR EXISTS (
                        SELECT 1 FROM community_roles cr
                        WHERE cr.community_id = moderation_actions.community_id
                            AND cr.user_id = u.id
                            AND cr.role IN ('admin', 'moderator')
                    ))
        )
    );

-- Media files: Public read, authenticated create/delete own
DROP POLICY IF EXISTS "Media files are viewable" ON media_files;
CREATE POLICY "Media files are viewable"
    ON media_files FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can create media files" ON media_files;
CREATE POLICY "Users can create media files"
    ON media_files FOR INSERT
    WITH CHECK (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete own media files" ON media_files;
CREATE POLICY "Users can delete own media files"
    ON media_files FOR DELETE
    USING (user_id::text = auth.uid()::text);

-- Poll options: Public read, authenticated create
DROP POLICY IF EXISTS "Poll options are viewable" ON poll_options;
CREATE POLICY "Poll options are viewable"
    ON poll_options FOR SELECT
    USING (true);

-- Poll votes: Users can read/create own
DROP POLICY IF EXISTS "Users can read own poll votes" ON poll_votes;
CREATE POLICY "Users can read own poll votes"
    ON poll_votes FOR SELECT
    USING (user_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can create poll votes" ON poll_votes;
CREATE POLICY "Users can create poll votes"
    ON poll_votes FOR INSERT
    WITH CHECK (user_id::text = auth.uid()::text);

-- Member relationships: Users can read/create own
DROP POLICY IF EXISTS "Users can read own relationships" ON member_relationships;
CREATE POLICY "Users can read own relationships"
    ON member_relationships FOR SELECT
    USING (follower_id::text = auth.uid()::text OR following_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can create own relationships" ON member_relationships;
CREATE POLICY "Users can create own relationships"
    ON member_relationships FOR INSERT
    WITH CHECK (follower_id::text = auth.uid()::text);

DROP POLICY IF EXISTS "Users can update own relationships" ON member_relationships;
CREATE POLICY "Users can update own relationships"
    ON member_relationships FOR UPDATE
    USING (follower_id::text = auth.uid()::text);

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Note: Storage buckets must be created via Supabase Dashboard or API
-- This is a placeholder for documentation purposes
-- 
-- Required bucket: 'community-posts'
-- - Public: false (private bucket)
-- - Allowed MIME types: image/*, video/*, application/pdf
-- - File size limit: 10MB
-- - Policies:
--   - Users can upload files to their own folder: {user_id}/{filename}
--   - Users can read files from communities they're members of
--   - Users can delete their own files

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE communities IS 'Communities for /communities route';
COMMENT ON TABLE posts IS 'Posts for /communities/feed route';
COMMENT ON FUNCTION get_feed IS 'Main function for fetching feed data';
COMMENT ON VIEW communities_with_counts IS 'View used by /communities page';
COMMENT ON VIEW reports_with_details IS 'DWS-specific view for reports with details';

-- =====================================================
-- GRANTS (if using service role)
-- =====================================================

-- Grant necessary permissions to authenticated users
-- These are typically handled by RLS policies, but may need additional grants
-- GRANT USAGE ON SCHEMA public TO authenticated;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

