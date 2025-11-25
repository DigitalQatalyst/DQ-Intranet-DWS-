-- Migration: Create type-specific response views
-- Description: Creates views to easily differentiate and query responses by type (poll, survey, feedback)
-- Date: 2025-01-06

-- =====================================================
-- 1. View for Poll Responses
-- =====================================================
CREATE OR REPLACE VIEW poll_responses AS
SELECT 
    pr.id,
    pr.pulse_item_id,
    pr.session_id,
    pr.response_data,
    pr.response_data->>'selected_options' as selected_options_json,
    pr.is_anonymous,
    pr.created_at,
    pr.updated_at,
    -- Poll item details
    pi.title as poll_title,
    pi.question as poll_question,
    pi.options as poll_options,
    pi.department,
    pi.location_filter,
    pi.total_responses,
    pi.published_at,
    pi.closes_at
FROM pulse_responses pr
JOIN pulse_items pi ON pr.pulse_item_id = pi.id
WHERE pi.type = 'poll';

COMMENT ON VIEW poll_responses IS 'View of all poll responses with poll item details. Works with anonymous responses via session_id.';

-- =====================================================
-- 2. View for Survey Responses
-- =====================================================
CREATE OR REPLACE VIEW survey_responses AS
SELECT 
    pr.id,
    pr.pulse_item_id,
    pr.session_id,
    pr.response_data,
    pr.response_data->'answers' as answers_json,
    pr.is_anonymous,
    pr.created_at,
    pr.updated_at,
    -- Survey item details
    pi.title as survey_title,
    pi.questions as survey_questions,
    pi.survey_type,
    pi.department,
    pi.location_filter,
    pi.total_responses,
    pi.published_at,
    pi.closes_at
FROM pulse_responses pr
JOIN pulse_items pi ON pr.pulse_item_id = pi.id
WHERE pi.type = 'survey';

COMMENT ON VIEW survey_responses IS 'View of all survey responses with survey item details. Works with anonymous responses via session_id.';

-- =====================================================
-- 3. View for Feedback Responses (from pulse_responses)
-- =====================================================
CREATE OR REPLACE VIEW feedback_responses_summary AS
SELECT 
    pr.id,
    pr.pulse_item_id,
    pr.session_id,
    pr.response_data,
    pr.response_data->'feedback' as feedback_json,
    pr.is_anonymous,
    pr.created_at,
    pr.updated_at,
    -- Feedback item details
    pi.title as feedback_title,
    pi.feedback_type,
    pi.category as feedback_category,
    pi.department,
    pi.location_filter,
    pi.total_responses,
    pi.published_at,
    pi.closes_at
FROM pulse_responses pr
JOIN pulse_items pi ON pr.pulse_item_id = pi.id
WHERE pi.type = 'feedback';

COMMENT ON VIEW feedback_responses_summary IS 'View of feedback responses stored in pulse_responses table. Works with anonymous responses via session_id.';

-- =====================================================
-- 4. View for Detailed Feedback Responses (from pulse_feedback_responses)
-- =====================================================
CREATE OR REPLACE VIEW feedback_responses_detailed AS
SELECT 
    pfr.id,
    pfr.question_id,
    pfr.event_id as pulse_item_id,
    pfr.session_id,
    pfr.response,
    pfr.user_id,
    pfr.created_at,
    pfr.updated_at,
    -- Question details
    pfq.category as question_category,
    pfq.question as question_text,
    pfq.question_type,
    pfq.scale_min,
    pfq.scale_max,
    pfq.display_order,
    -- Feedback item details
    pi.title as feedback_title,
    pi.feedback_type,
    pi.department,
    pi.location_filter,
    pi.total_responses,
    pi.published_at,
    pi.closes_at
FROM pulse_feedback_responses pfr
JOIN pulse_items pi ON pfr.event_id = pi.id
JOIN pulse_feedback_questions pfq ON pfr.question_id = pfq.id
WHERE pi.type = 'feedback';

COMMENT ON VIEW feedback_responses_detailed IS 'View of detailed feedback responses with individual question responses. Works with anonymous responses via session_id.';

-- =====================================================
-- 5. View for Response Statistics by Type
-- =====================================================
CREATE OR REPLACE VIEW response_statistics_by_type AS
SELECT 
    pi.type,
    pi.id as pulse_item_id,
    pi.title,
    COUNT(DISTINCT pr.id) as total_responses,
    COUNT(DISTINCT pr.session_id) as unique_sessions,
    COUNT(DISTINCT CASE WHEN pr.user_id IS NOT NULL THEN pr.user_id END) as authenticated_responses,
    COUNT(DISTINCT CASE WHEN pr.user_id IS NULL THEN pr.session_id END) as anonymous_sessions,
    MIN(pr.created_at) as first_response_at,
    MAX(pr.created_at) as last_response_at
FROM pulse_items pi
LEFT JOIN pulse_responses pr ON pi.id = pr.pulse_item_id
GROUP BY pi.type, pi.id, pi.title;

COMMENT ON VIEW response_statistics_by_type IS 'Statistics view showing response counts by pulse item type. Includes both authenticated and anonymous response counts.';

-- =====================================================
-- 6. Grant Permissions
-- =====================================================
GRANT SELECT ON poll_responses TO anon, authenticated;
GRANT SELECT ON survey_responses TO anon, authenticated;
GRANT SELECT ON feedback_responses_summary TO anon, authenticated;
GRANT SELECT ON feedback_responses_detailed TO anon, authenticated;
GRANT SELECT ON response_statistics_by_type TO anon, authenticated;

-- =====================================================
-- 7. Create Performance Indexes (if not exists)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_pulse_items_type_id 
ON pulse_items(type, id);

CREATE INDEX IF NOT EXISTS idx_pulse_responses_item_id_session 
ON pulse_responses(pulse_item_id, session_id) 
WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_pulse_feedback_responses_event_session 
ON pulse_feedback_responses(event_id, session_id) 
WHERE session_id IS NOT NULL;


