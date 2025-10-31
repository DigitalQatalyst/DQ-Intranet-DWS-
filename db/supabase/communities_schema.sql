-- =====================================================
-- Communities Schema Migration for Supabase
-- =====================================================
-- This script creates all tables, views, and functions needed for
-- /communities and /communities/feed routes
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
DROP FUNCTION IF EXISTS can_moderate CASCADE;
DROP FUNCTION IF EXISTS can_moderate_community CASCADE;
DROP FUNCTION IF EXISTS update_member_role CASCADE;
DROP FUNCTION IF EXISTS remove_community_member CASCADE;

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
    COUNT(DISTINCT m.user_id) AS member_count
FROM communities c
LEFT JOIN memberships m ON c.id = m.community_id
GROUP BY c.id, c.name, c.description, c.imageurl, c.category, c.created_at;

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

-- Reports with details
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

-- Check if user can moderate
CREATE OR REPLACE FUNCTION can_moderate(
    user_id UUID,
    community_id_param UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    user_app_role app_role;
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

-- =====================================================
-- Row Level Security (RLS) - Basic setup
-- =====================================================

ALTER TABLE users_local ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Allow public read access to communities
CREATE POLICY "Communities are viewable by everyone"
    ON communities FOR SELECT
    USING (true);

-- Allow public read access to active posts
CREATE POLICY "Active posts are viewable by everyone"
    ON posts FOR SELECT
    USING (status = 'active');

-- Allow users to create posts in communities they're members of
CREATE POLICY "Members can create posts"
    ON posts FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM memberships
            WHERE memberships.user_id = created_by
            AND memberships.community_id = posts.community_id
        )
    );

-- Allow users to read their own data
CREATE POLICY "Users can view own data"
    ON users_local FOR SELECT
    USING (true);

-- Allow users to join communities
CREATE POLICY "Users can join communities"
    ON memberships FOR INSERT
    WITH CHECK (true);

-- Allow users to view memberships
CREATE POLICY "Memberships are viewable"
    ON memberships FOR SELECT
    USING (true);

COMMENT ON TABLE communities IS 'Communities for /communities route';
COMMENT ON TABLE posts IS 'Posts for /communities/feed route';
COMMENT ON FUNCTION get_feed IS 'Main function for fetching feed data';
COMMENT ON VIEW communities_with_counts IS 'View used by /communities page';
