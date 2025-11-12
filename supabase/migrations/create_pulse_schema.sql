-- Migration: Create Pulse (Polls, Surveys, Feedback) Schema
-- Created: 2025-01-XX
-- Description: Creates tables for Pulse feature - interactive community engagement (polls, surveys, feedback)

-- =====================================================
-- 1. Create pulse_items table (main table for polls, surveys, feedback)
-- =====================================================

CREATE TABLE IF NOT EXISTS pulse_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('poll', 'survey', 'feedback')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'archived')),
    
    -- Department and Location filters (same as events)
    department TEXT,
    location_filter TEXT,
    
    -- Poll/Survey specific fields
    question TEXT, -- Main question for polls
    options JSONB, -- For polls: array of option objects {id, text, votes}
    allow_multiple BOOLEAN DEFAULT false, -- For polls: allow multiple selections
    anonymous BOOLEAN DEFAULT false, -- Whether responses are anonymous
    
    -- Survey specific fields
    questions JSONB, -- For surveys: array of question objects
    survey_type TEXT CHECK (survey_type IN ('single_page', 'multi_page')),
    
    -- Feedback specific fields
    feedback_type TEXT CHECK (feedback_type IN ('suggestion', 'complaint', 'praise', 'general')),
    category TEXT, -- Feedback category
    
    -- Engagement metrics
    total_responses INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    
    -- Metadata
    tags TEXT[],
    image_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_by_name TEXT,
    created_by_email TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    closes_at TIMESTAMPTZ, -- When poll/survey closes
    
    -- Settings
    is_featured BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    allow_comments BOOLEAN DEFAULT true,
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'department', 'location', 'private'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pulse_items_type ON pulse_items(type);
CREATE INDEX IF NOT EXISTS idx_pulse_items_status ON pulse_items(status);
CREATE INDEX IF NOT EXISTS idx_pulse_items_department ON pulse_items(department);
CREATE INDEX IF NOT EXISTS idx_pulse_items_location_filter ON pulse_items(location_filter);
CREATE INDEX IF NOT EXISTS idx_pulse_items_created_at ON pulse_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pulse_items_published_at ON pulse_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_pulse_items_is_featured ON pulse_items(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_pulse_items_status_published ON pulse_items(status, published_at DESC) WHERE status = 'published';

-- Add comments
COMMENT ON TABLE pulse_items IS 'Main table for Pulse feature - stores polls, surveys, and feedback items';
COMMENT ON COLUMN pulse_items.type IS 'Type of pulse item: poll, survey, or feedback';
COMMENT ON COLUMN pulse_items.department IS 'Department filter: HRA (People), Finance, Deals, Stories, Intelligence, Solutions, SecDevOps, Products, Delivery — Deploys, Delivery — Designs, DCO Operations, DBP Platform, DBP Delivery';
COMMENT ON COLUMN pulse_items.location_filter IS 'Location filter: Dubai, Nairobi, Riyadh, Remote';
COMMENT ON COLUMN pulse_items.options IS 'For polls: JSON array of options with votes count';
COMMENT ON COLUMN pulse_items.questions IS 'For surveys: JSON array of questions and their responses';

-- =====================================================
-- 2. Create pulse_responses table (user responses to polls/surveys/feedback)
-- =====================================================

CREATE TABLE IF NOT EXISTS pulse_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pulse_item_id UUID NOT NULL REFERENCES pulse_items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    user_name TEXT,
    user_email TEXT,
    
    -- Response data (varies by type)
    response_data JSONB NOT NULL, -- Stores the actual response
    
    -- For polls: {selected_options: ['option_id_1', 'option_id_2']}
    -- For surveys: {answers: [{question_id: 'q1', answer: '...'}, ...]}
    -- For feedback: {message: '...', rating: 5}
    
    -- Metadata
    is_anonymous BOOLEAN DEFAULT false,
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one response per user per pulse item (unless anonymous)
    UNIQUE(pulse_item_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pulse_responses_pulse_item_id ON pulse_responses(pulse_item_id);
CREATE INDEX IF NOT EXISTS idx_pulse_responses_user_id ON pulse_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_pulse_responses_created_at ON pulse_responses(created_at DESC);

-- Add comment
COMMENT ON TABLE pulse_responses IS 'Stores user responses to polls, surveys, and feedback items';

-- =====================================================
-- 3. Create pulse_comments table (comments on pulse items)
-- =====================================================

CREATE TABLE IF NOT EXISTS pulse_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pulse_item_id UUID NOT NULL REFERENCES pulse_items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    user_name TEXT NOT NULL,
    user_email TEXT,
    user_avatar_url TEXT,
    
    content TEXT NOT NULL,
    parent_id UUID REFERENCES pulse_comments(id) ON DELETE CASCADE, -- For nested comments
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    
    -- Moderation
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pulse_comments_pulse_item_id ON pulse_comments(pulse_item_id);
CREATE INDEX IF NOT EXISTS idx_pulse_comments_user_id ON pulse_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_pulse_comments_parent_id ON pulse_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_pulse_comments_created_at ON pulse_comments(created_at DESC);

-- Add comment
COMMENT ON TABLE pulse_comments IS 'Stores comments on pulse items (polls, surveys, feedback)';

-- =====================================================
-- 4. Create pulse_likes table (likes/bookmarks for pulse items)
-- =====================================================

CREATE TABLE IF NOT EXISTS pulse_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pulse_item_id UUID NOT NULL REFERENCES pulse_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one like per user per pulse item
    UNIQUE(pulse_item_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pulse_likes_pulse_item_id ON pulse_likes(pulse_item_id);
CREATE INDEX IF NOT EXISTS idx_pulse_likes_user_id ON pulse_likes(user_id);

-- Add comment
COMMENT ON TABLE pulse_likes IS 'Stores user likes/bookmarks for pulse items';

-- =====================================================
-- 5. Create view for pulse items with aggregated data
-- =====================================================

CREATE OR REPLACE VIEW pulse_items_with_stats AS
SELECT 
    pi.*,
    COUNT(DISTINCT pr.id) as response_count,
    COUNT(DISTINCT pl.id) as like_count,
    COUNT(DISTINCT pc.id) as comment_count,
    CASE 
        WHEN pi.closes_at IS NOT NULL AND pi.closes_at < NOW() THEN true
        ELSE false
    END as is_closed
FROM pulse_items pi
LEFT JOIN pulse_responses pr ON pi.id = pr.pulse_item_id
LEFT JOIN pulse_likes pl ON pi.id = pl.pulse_item_id
LEFT JOIN pulse_comments pc ON pi.id = pc.pulse_item_id AND pc.is_deleted = false
GROUP BY pi.id;

-- Grant permissions
GRANT SELECT ON pulse_items_with_stats TO anon;
GRANT SELECT ON pulse_items_with_stats TO authenticated;

-- Add comment
COMMENT ON VIEW pulse_items_with_stats IS 'View of pulse items with aggregated statistics (responses, likes, comments)';

-- =====================================================
-- 6. Add filter_options entries for Pulse
-- =====================================================

-- Insert Department filter options for Pulse
INSERT INTO filter_options (filter_type, filter_category, option_value, option_label, display_order) VALUES
('department', 'pulse', 'HRA (People)', 'HRA (People)', 1),
('department', 'pulse', 'Finance', 'Finance', 2),
('department', 'pulse', 'Deals', 'Deals', 3),
('department', 'pulse', 'Stories', 'Stories', 4),
('department', 'pulse', 'Intelligence', 'Intelligence', 5),
('department', 'pulse', 'Solutions', 'Solutions', 6),
('department', 'pulse', 'SecDevOps', 'SecDevOps', 7),
('department', 'pulse', 'Products', 'Products', 8),
('department', 'pulse', 'Delivery — Deploys', 'Delivery — Deploys', 9),
('department', 'pulse', 'Delivery — Designs', 'Delivery — Designs', 10),
('department', 'pulse', 'DCO Operations', 'DCO Operations', 11),
('department', 'pulse', 'DBP Platform', 'DBP Platform', 12),
('department', 'pulse', 'DBP Delivery', 'DBP Delivery', 13)
ON CONFLICT (filter_type, filter_category, option_value) DO NOTHING;

-- Insert Location filter options for Pulse
INSERT INTO filter_options (filter_type, filter_category, option_value, option_label, display_order) VALUES
('location', 'pulse', 'Dubai', 'Dubai', 1),
('location', 'pulse', 'Nairobi', 'Nairobi', 2),
('location', 'pulse', 'Riyadh', 'Riyadh', 3),
('location', 'pulse', 'Remote', 'Remote', 4)
ON CONFLICT (filter_type, filter_category, option_value) DO NOTHING;

-- =====================================================
-- 7. Enable Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE pulse_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pulse_items
-- Anyone can read published items
CREATE POLICY "Anyone can view published pulse items"
    ON pulse_items FOR SELECT
    USING (status = 'published');

-- Authenticated users can create items
CREATE POLICY "Authenticated users can create pulse items"
    ON pulse_items FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Users can update their own items
CREATE POLICY "Users can update their own pulse items"
    ON pulse_items FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

-- Users can delete their own items
CREATE POLICY "Users can delete their own pulse items"
    ON pulse_items FOR DELETE
    TO authenticated
    USING (auth.uid() = created_by);

-- RLS Policies for pulse_responses
-- Anyone can read responses (respecting anonymous flag)
CREATE POLICY "Anyone can view pulse responses"
    ON pulse_responses FOR SELECT
    USING (true);

-- Authenticated users can create responses
CREATE POLICY "Authenticated users can create pulse responses"
    ON pulse_responses FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Users can update their own responses
CREATE POLICY "Users can update their own pulse responses"
    ON pulse_responses FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for pulse_comments
-- Anyone can read comments
CREATE POLICY "Anyone can view pulse comments"
    ON pulse_comments FOR SELECT
    USING (is_deleted = false);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create pulse comments"
    ON pulse_comments FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Users can update their own comments
CREATE POLICY "Users can update their own pulse comments"
    ON pulse_comments FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own pulse comments"
    ON pulse_comments FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- RLS Policies for pulse_likes
-- Anyone can read likes
CREATE POLICY "Anyone can view pulse likes"
    ON pulse_likes FOR SELECT
    USING (true);

-- Authenticated users can create/delete likes
CREATE POLICY "Authenticated users can manage pulse likes"
    ON pulse_likes FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- 8. Create function to update response count
-- =====================================================

CREATE OR REPLACE FUNCTION update_pulse_item_response_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE pulse_items
    SET total_responses = (
        SELECT COUNT(*) 
        FROM pulse_responses 
        WHERE pulse_item_id = COALESCE(NEW.pulse_item_id, OLD.pulse_item_id)
    )
    WHERE id = COALESCE(NEW.pulse_item_id, OLD.pulse_item_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_pulse_response_count
    AFTER INSERT OR UPDATE OR DELETE ON pulse_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_pulse_item_response_count();

-- =====================================================
-- 9. Create function to update like count
-- =====================================================

CREATE OR REPLACE FUNCTION update_pulse_item_like_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE pulse_items
    SET total_likes = (
        SELECT COUNT(*) 
        FROM pulse_likes 
        WHERE pulse_item_id = COALESCE(NEW.pulse_item_id, OLD.pulse_item_id)
    )
    WHERE id = COALESCE(NEW.pulse_item_id, OLD.pulse_item_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_pulse_like_count
    AFTER INSERT OR DELETE ON pulse_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_pulse_item_like_count();

-- =====================================================
-- 10. Grant permissions
-- =====================================================

-- Grant SELECT on tables
GRANT SELECT ON pulse_items TO anon;
GRANT SELECT ON pulse_items TO authenticated;
GRANT SELECT ON pulse_responses TO anon;
GRANT SELECT ON pulse_responses TO authenticated;
GRANT SELECT ON pulse_comments TO anon;
GRANT SELECT ON pulse_comments TO authenticated;
GRANT SELECT ON pulse_likes TO anon;
GRANT SELECT ON pulse_likes TO authenticated;

-- Grant INSERT/UPDATE/DELETE for authenticated users
GRANT INSERT, UPDATE, DELETE ON pulse_items TO authenticated;
GRANT INSERT, UPDATE, DELETE ON pulse_responses TO authenticated;
GRANT INSERT, UPDATE, DELETE ON pulse_comments TO authenticated;
GRANT INSERT, DELETE ON pulse_likes TO authenticated;

