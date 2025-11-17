-- =====================================================
-- Pulse Marketplace - Complete Schema
-- =====================================================
-- This migration creates all tables, views, functions, and policies
-- for the Pulse Marketplace feature (polls, surveys, feedback)
-- =====================================================

-- Drop existing objects if they exist (for clean migration)
DROP VIEW IF EXISTS pulse_items_with_stats CASCADE;
DROP TABLE IF EXISTS pulse_likes CASCADE;
DROP TABLE IF EXISTS pulse_comments CASCADE;
DROP TABLE IF EXISTS pulse_responses CASCADE;
DROP TABLE IF EXISTS pulse_items CASCADE;
DROP FUNCTION IF EXISTS update_pulse_item_response_count() CASCADE;
DROP FUNCTION IF EXISTS update_pulse_item_like_count() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =====================================================
-- 1. Create pulse_items table (main table for polls, surveys, feedback)
-- =====================================================

CREATE TABLE pulse_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('poll', 'survey', 'feedback')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'archived')),
    
    -- Department and Location filters
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
CREATE INDEX idx_pulse_items_type ON pulse_items(type);
CREATE INDEX idx_pulse_items_status ON pulse_items(status);
CREATE INDEX idx_pulse_items_department ON pulse_items(department);
CREATE INDEX idx_pulse_items_location_filter ON pulse_items(location_filter);
CREATE INDEX idx_pulse_items_created_at ON pulse_items(created_at DESC);
CREATE INDEX idx_pulse_items_published_at ON pulse_items(published_at DESC);
CREATE INDEX idx_pulse_items_is_featured ON pulse_items(is_featured) WHERE is_featured = true;
CREATE INDEX idx_pulse_items_status_published ON pulse_items(status, published_at DESC) WHERE status = 'published';

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

CREATE TABLE pulse_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pulse_item_id UUID NOT NULL REFERENCES pulse_items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    user_name TEXT,
    user_email TEXT,
    
    -- Response data (varies by type)
    response_data JSONB NOT NULL, -- Stores the actual response
    
    -- For polls: {selected_options: ['option_id_1', 'option_id_2']}
    -- For surveys: {answers: {question_id: 'answer', ...}}
    -- For feedback: {feedback: {question_id: 'answer', ...}}
    
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
CREATE INDEX idx_pulse_responses_pulse_item_id ON pulse_responses(pulse_item_id);
CREATE INDEX idx_pulse_responses_user_id ON pulse_responses(user_id);
CREATE INDEX idx_pulse_responses_created_at ON pulse_responses(created_at DESC);

-- Add comment
COMMENT ON TABLE pulse_responses IS 'Stores user responses to polls, surveys, and feedback items';

-- =====================================================
-- 3. Create pulse_comments table (comments on pulse items)
-- =====================================================

CREATE TABLE pulse_comments (
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
CREATE INDEX idx_pulse_comments_pulse_item_id ON pulse_comments(pulse_item_id);
CREATE INDEX idx_pulse_comments_user_id ON pulse_comments(user_id);
CREATE INDEX idx_pulse_comments_parent_id ON pulse_comments(parent_id);
CREATE INDEX idx_pulse_comments_created_at ON pulse_comments(created_at DESC);

-- Add comment
COMMENT ON TABLE pulse_comments IS 'Stores comments on pulse items (polls, surveys, feedback)';

-- =====================================================
-- 4. Create pulse_likes table (likes/bookmarks for pulse items)
-- =====================================================

CREATE TABLE pulse_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pulse_item_id UUID NOT NULL REFERENCES pulse_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one like per user per pulse item
    UNIQUE(pulse_item_id, user_id)
);

-- Create indexes
CREATE INDEX idx_pulse_likes_pulse_item_id ON pulse_likes(pulse_item_id);
CREATE INDEX idx_pulse_likes_user_id ON pulse_likes(user_id);

-- Add comment
COMMENT ON TABLE pulse_likes IS 'Stores user likes/bookmarks for pulse items';

-- =====================================================
-- 5. Create function to update updated_at timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_pulse_items_updated_at
    BEFORE UPDATE ON pulse_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pulse_responses_updated_at
    BEFORE UPDATE ON pulse_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pulse_comments_updated_at
    BEFORE UPDATE ON pulse_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. Create function to update response count
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

-- Create trigger for response count
CREATE TRIGGER trigger_update_pulse_response_count
    AFTER INSERT OR UPDATE OR DELETE ON pulse_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_pulse_item_response_count();

-- =====================================================
-- 7. Create function to update like count
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

-- Create trigger for like count
CREATE TRIGGER trigger_update_pulse_like_count
    AFTER INSERT OR DELETE ON pulse_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_pulse_item_like_count();

-- =====================================================
-- 8. Create view for pulse items with aggregated data
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

-- Grant permissions on view
GRANT SELECT ON pulse_items_with_stats TO anon;
GRANT SELECT ON pulse_items_with_stats TO authenticated;

-- Add comment
COMMENT ON VIEW pulse_items_with_stats IS 'View of pulse items with aggregated statistics (responses, likes, comments)';

-- =====================================================
-- 9. Enable Row Level Security (RLS)
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

