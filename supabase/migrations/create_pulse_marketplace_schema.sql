-- Migration: Create Pulse Marketplace Schema
-- Description: Creates tables for Pulse Marketplace functionality - surveys, questions, responses, and feedback
-- Date: 2025-01-XX

-- =====================================================
-- 0. Drop existing tables (if they exist)
-- =====================================================

DROP TABLE IF EXISTS survey_responses CASCADE;
DROP TABLE IF EXISTS survey_questions CASCADE;
DROP TABLE IF EXISTS pulse_feedback CASCADE;
DROP TABLE IF EXISTS pulse_surveys CASCADE;

-- =====================================================
-- 1. Create pulse_surveys table
-- =====================================================

CREATE TABLE IF NOT EXISTS pulse_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    
    -- Survey metadata
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'archived')),
    survey_type TEXT NOT NULL DEFAULT 'single_page' CHECK (survey_type IN ('single_page', 'multi_page')),
    
    -- Department and Location filters (same as events and pulse_items)
    department TEXT,
    location_filter TEXT,
    
    -- Launch and close dates
    launch_date TIMESTAMPTZ,
    close_date TIMESTAMPTZ,
    
    -- Survey settings
    allow_anonymous BOOLEAN DEFAULT false,
    allow_multiple_responses BOOLEAN DEFAULT false,
    require_login BOOLEAN DEFAULT true,
    
    -- Engagement metrics
    total_responses INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    
    -- Visual and organization
    image_url TEXT,
    tags TEXT[],
    is_featured BOOLEAN DEFAULT false,
    is_pinned BOOLEAN DEFAULT false,
    
    -- Creator information (optional - can be anonymous)
    created_by_name TEXT,
    created_by_email TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for pulse_surveys
CREATE INDEX IF NOT EXISTS idx_pulse_surveys_status ON pulse_surveys(status);
CREATE INDEX IF NOT EXISTS idx_pulse_surveys_department ON pulse_surveys(department);
CREATE INDEX IF NOT EXISTS idx_pulse_surveys_location_filter ON pulse_surveys(location_filter);
CREATE INDEX IF NOT EXISTS idx_pulse_surveys_created_at ON pulse_surveys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pulse_surveys_published_at ON pulse_surveys(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_pulse_surveys_launch_date ON pulse_surveys(launch_date);
CREATE INDEX IF NOT EXISTS idx_pulse_surveys_close_date ON pulse_surveys(close_date);
CREATE INDEX IF NOT EXISTS idx_pulse_surveys_is_featured ON pulse_surveys(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_pulse_surveys_status_published ON pulse_surveys(status, published_at DESC) WHERE status = 'published';

-- Add comments
COMMENT ON TABLE pulse_surveys IS 'Main table for Pulse Marketplace surveys';
COMMENT ON COLUMN pulse_surveys.department IS 'Department filter: HRA (People), Finance, Deals, Stories, Intelligence, Solutions, SecDevOps, Products, Delivery — Deploys, Delivery — Designs, DCO Operations, DBP Platform, DBP Delivery';
COMMENT ON COLUMN pulse_surveys.location_filter IS 'Location filter: Dubai, Nairobi, Riyadh, Remote';
COMMENT ON COLUMN pulse_surveys.survey_type IS 'Type of survey: single_page (all questions on one page) or multi_page (questions spread across multiple pages)';

-- =====================================================
-- 2. Create survey_questions table
-- =====================================================

CREATE TABLE IF NOT EXISTS survey_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES pulse_surveys(id) ON DELETE CASCADE,
    
    -- Question details
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN (
        'text',           -- Short text answer
        'textarea',       -- Long text answer
        'single_choice',  -- Radio buttons (one selection)
        'multiple_choice', -- Checkboxes (multiple selections)
        'dropdown',       -- Dropdown select
        'rating',         -- Rating scale (1-5, 1-10, etc.)
        'date',           -- Date picker
        'email',          -- Email input
        'number',         -- Number input
        'yes_no',         -- Yes/No question
        'matrix'          -- Matrix/Grid question
    )),
    
    -- Question options (for choice-based questions)
    options JSONB, -- Array of option objects: [{"id": "opt1", "text": "Option 1"}, ...]
    
    -- Question settings
    is_required BOOLEAN DEFAULT false,
    placeholder TEXT,
    help_text TEXT,
    
    -- Display order
    display_order INTEGER NOT NULL DEFAULT 0,
    
    -- Conditional logic (if answer to previous question is X, show this question)
    conditional_logic JSONB, -- {"depends_on": "question_id", "condition": "equals", "value": "option_id"}
    
    -- Validation rules
    validation_rules JSONB, -- {"min_length": 10, "max_length": 500, "pattern": "regex"}
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for survey_questions
CREATE INDEX IF NOT EXISTS idx_survey_questions_survey_id ON survey_questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_questions_display_order ON survey_questions(survey_id, display_order);
CREATE INDEX IF NOT EXISTS idx_survey_questions_question_type ON survey_questions(question_type);

-- Add comments
COMMENT ON TABLE survey_questions IS 'Stores questions for surveys in Pulse Marketplace';
COMMENT ON COLUMN survey_questions.options IS 'JSON array of options for choice-based questions: [{"id": "opt1", "text": "Option 1", "order": 1}, ...]';
COMMENT ON COLUMN survey_questions.conditional_logic IS 'JSON object for conditional question display: {"depends_on": "question_id", "condition": "equals|not_equals|contains", "value": "value"}';

-- =====================================================
-- 3. Create survey_responses table
-- =====================================================

CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES pulse_surveys(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
    
    -- Response data
    response_text TEXT, -- For text, textarea, email, date, number responses
    response_value TEXT, -- For single choice, dropdown, yes_no responses
    response_values TEXT[], -- For multiple choice responses
    response_number NUMERIC, -- For number and rating responses
    response_json JSONB, -- For complex responses (matrix, etc.)
    
    -- Response metadata
    is_anonymous BOOLEAN DEFAULT false,
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Note: No unique constraint on user_id since we don't track users
);

-- Create indexes for survey_responses
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_question_id ON survey_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at DESC);

-- Add comments
COMMENT ON TABLE survey_responses IS 'Stores individual question responses for surveys';
COMMENT ON COLUMN survey_responses.response_text IS 'Text-based responses (text, textarea, email, date)';
COMMENT ON COLUMN survey_responses.response_value IS 'Single value responses (single_choice, dropdown, yes_no)';
COMMENT ON COLUMN survey_responses.response_values IS 'Multiple value responses (multiple_choice)';
COMMENT ON COLUMN survey_responses.response_number IS 'Numeric responses (number, rating)';
COMMENT ON COLUMN survey_responses.response_json IS 'Complex structured responses (matrix questions)';

-- =====================================================
-- 4. Create pulse_feedback table
-- =====================================================

CREATE TABLE IF NOT EXISTS pulse_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Feedback content
    title TEXT,
    feedback_text TEXT NOT NULL,
    feedback_type TEXT NOT NULL DEFAULT 'general' CHECK (feedback_type IN (
        'suggestion',
        'complaint',
        'praise',
        'question',
        'general',
        'bug_report',
        'feature_request'
    )),
    
    -- Rating (if applicable)
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    
    -- Category and tags
    category TEXT,
    tags TEXT[],
    
    -- Department and Location filters
    department TEXT,
    location_filter TEXT,
    
    -- Feedback status
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'closed', 'archived')),
    
    -- Response/Resolution
    admin_response TEXT,
    resolved_by_name TEXT,
    resolved_at TIMESTAMPTZ,
    
    -- Engagement metrics
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    
    -- Privacy
    is_anonymous BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for pulse_feedback
CREATE INDEX IF NOT EXISTS idx_pulse_feedback_feedback_type ON pulse_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_pulse_feedback_status ON pulse_feedback(status);
CREATE INDEX IF NOT EXISTS idx_pulse_feedback_department ON pulse_feedback(department);
CREATE INDEX IF NOT EXISTS idx_pulse_feedback_location_filter ON pulse_feedback(location_filter);
CREATE INDEX IF NOT EXISTS idx_pulse_feedback_created_at ON pulse_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pulse_feedback_category ON pulse_feedback(category);
CREATE INDEX IF NOT EXISTS idx_pulse_feedback_rating ON pulse_feedback(rating);

-- Add comments
COMMENT ON TABLE pulse_feedback IS 'Stores user feedback, suggestions, complaints, and praise in Pulse Marketplace';
COMMENT ON COLUMN pulse_feedback.rating IS 'Rating from 1 to 5 stars';
COMMENT ON COLUMN pulse_feedback.feedback_type IS 'Type of feedback: suggestion, complaint, praise, question, general, bug_report, feature_request';

-- =====================================================
-- 5. Create views for aggregated data
-- =====================================================

-- View: Surveys with question count and response statistics
CREATE OR REPLACE VIEW pulse_surveys_with_stats AS
SELECT 
    ps.id,
    ps.title,
    ps.description,
    ps.status,
    ps.survey_type,
    ps.department,
    ps.location_filter,
    ps.launch_date,
    ps.close_date,
    ps.allow_anonymous,
    ps.allow_multiple_responses,
    ps.require_login,
    ps.image_url,
    ps.tags,
    ps.is_featured,
    ps.is_pinned,
    ps.created_by_name,
    ps.created_by_email,
    ps.created_at,
    ps.updated_at,
    ps.published_at,
    ps.metadata,
    -- Calculated statistics (exclude cached columns total_responses, total_views, total_completions)
    COUNT(DISTINCT sq.id) as question_count,
    COUNT(DISTINCT sr.id) as total_responses,
    ps.total_views, -- Keep cached view count
    ps.total_completions, -- Keep cached completion count
    CASE 
        WHEN ps.close_date IS NOT NULL AND ps.close_date < NOW() THEN true
        ELSE false
    END as is_closed,
    CASE 
        WHEN ps.launch_date IS NOT NULL AND ps.launch_date <= NOW() 
        AND (ps.close_date IS NULL OR ps.close_date > NOW()) THEN true
        ELSE false
    END as is_active
FROM pulse_surveys ps
LEFT JOIN survey_questions sq ON ps.id = sq.survey_id
LEFT JOIN survey_responses sr ON ps.id = sr.survey_id
GROUP BY ps.id;

-- View: Survey questions with response counts
CREATE OR REPLACE VIEW survey_questions_with_stats AS
SELECT 
    sq.*,
    COUNT(DISTINCT sr.id) as response_count
FROM survey_questions sq
LEFT JOIN survey_responses sr ON sq.id = sr.question_id
GROUP BY sq.id;

-- Grant permissions on views
GRANT SELECT ON pulse_surveys_with_stats TO anon;
GRANT SELECT ON pulse_surveys_with_stats TO authenticated;
GRANT SELECT ON survey_questions_with_stats TO anon;
GRANT SELECT ON survey_questions_with_stats TO authenticated;

-- Add comments
COMMENT ON VIEW pulse_surveys_with_stats IS 'View of surveys with aggregated statistics (question count, response count)';
COMMENT ON VIEW survey_questions_with_stats IS 'View of survey questions with response statistics';

-- =====================================================
-- 6. Create triggers for updated_at
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_pulse_surveys_updated_at
    BEFORE UPDATE ON pulse_surveys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_survey_questions_updated_at
    BEFORE UPDATE ON survey_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_survey_responses_updated_at
    BEFORE UPDATE ON survey_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pulse_feedback_updated_at
    BEFORE UPDATE ON pulse_feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. Create functions for common operations
-- =====================================================

-- Function to update survey response count
CREATE OR REPLACE FUNCTION update_survey_response_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE pulse_surveys
    SET total_responses = (
        SELECT COUNT(*) 
        FROM survey_responses 
        WHERE survey_id = COALESCE(NEW.survey_id, OLD.survey_id)
    ),
    total_completions = (
        SELECT COUNT(DISTINCT survey_id || '-' || question_id)
        FROM survey_responses
        WHERE survey_id = COALESCE(NEW.survey_id, OLD.survey_id)
    )
    WHERE id = COALESCE(NEW.survey_id, OLD.survey_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for response count
CREATE TRIGGER trigger_update_survey_response_count
    AFTER INSERT OR UPDATE OR DELETE ON survey_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_survey_response_count();

-- =====================================================
-- 8. Enable Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE pulse_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pulse_surveys
-- Anyone can read published surveys
CREATE POLICY "Anyone can view published surveys"
    ON pulse_surveys FOR SELECT
    USING (status = 'published');

-- Anyone can create surveys
CREATE POLICY "Anyone can create surveys"
    ON pulse_surveys FOR INSERT
    WITH CHECK (true);

-- Anyone can update surveys
CREATE POLICY "Anyone can update surveys"
    ON pulse_surveys FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Anyone can delete surveys
CREATE POLICY "Anyone can delete surveys"
    ON pulse_surveys FOR DELETE
    USING (true);

-- RLS Policies for survey_questions
-- Anyone can read questions for published surveys
CREATE POLICY "Anyone can view questions for published surveys"
    ON survey_questions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pulse_surveys
            WHERE id = survey_questions.survey_id
            AND status = 'published'
        )
    );

-- Anyone can create questions
CREATE POLICY "Anyone can create questions"
    ON survey_questions FOR INSERT
    WITH CHECK (true);

-- Anyone can update questions
CREATE POLICY "Anyone can update questions"
    ON survey_questions FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Anyone can delete questions
CREATE POLICY "Anyone can delete questions"
    ON survey_questions FOR DELETE
    USING (true);

-- RLS Policies for survey_responses
-- Anyone can view responses
CREATE POLICY "Anyone can view survey responses"
    ON survey_responses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM pulse_surveys
            WHERE id = survey_responses.survey_id
            AND status = 'published'
        )
    );

-- Anyone can create responses
CREATE POLICY "Anyone can create survey responses"
    ON survey_responses FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pulse_surveys
            WHERE id = survey_responses.survey_id
            AND status = 'published'
        )
    );

-- Anyone can update responses
CREATE POLICY "Anyone can update responses"
    ON survey_responses FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Anyone can delete responses
CREATE POLICY "Anyone can delete responses"
    ON survey_responses FOR DELETE
    USING (true);

-- RLS Policies for pulse_feedback
-- Anyone can view public feedback
CREATE POLICY "Anyone can view public feedback"
    ON pulse_feedback FOR SELECT
    USING (is_public = true);

-- Anyone can create feedback
CREATE POLICY "Anyone can create feedback"
    ON pulse_feedback FOR INSERT
    WITH CHECK (true);

-- Anyone can update feedback
CREATE POLICY "Anyone can update feedback"
    ON pulse_feedback FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Anyone can delete feedback
CREATE POLICY "Anyone can delete feedback"
    ON pulse_feedback FOR DELETE
    USING (true);

-- =====================================================
-- 9. Grant permissions
-- =====================================================

-- Grant SELECT on tables
GRANT SELECT ON pulse_surveys TO anon;
GRANT SELECT ON pulse_surveys TO authenticated;
GRANT SELECT ON survey_questions TO anon;
GRANT SELECT ON survey_questions TO authenticated;
GRANT SELECT ON survey_responses TO anon;
GRANT SELECT ON survey_responses TO authenticated;
GRANT SELECT ON pulse_feedback TO anon;
GRANT SELECT ON pulse_feedback TO authenticated;

-- Grant INSERT/UPDATE/DELETE for authenticated users
GRANT INSERT, UPDATE, DELETE ON pulse_surveys TO authenticated;
GRANT INSERT, UPDATE, DELETE ON survey_questions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON survey_responses TO authenticated;
GRANT INSERT, UPDATE, DELETE ON pulse_feedback TO authenticated;

