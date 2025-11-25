-- Migration: Make all pulse_feedback_responses fully anonymous
-- Description: Removes user identification requirements and allows anonymous submissions
-- Date: 2025-01-06

-- 1. Add session_id column for duplicate prevention
ALTER TABLE pulse_feedback_responses 
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- 2. Remove UNIQUE constraint that includes user_id
ALTER TABLE pulse_feedback_responses 
DROP CONSTRAINT IF EXISTS pulse_feedback_responses_event_id_question_id_user_id_key;

-- 3. Create partial unique index for session-based duplicate prevention
CREATE UNIQUE INDEX IF NOT EXISTS idx_pulse_feedback_responses_unique_session 
ON pulse_feedback_responses(event_id, question_id, session_id) 
WHERE session_id IS NOT NULL;

-- 4. Ensure user_id can be NULL (already is, but make it explicit)
ALTER TABLE pulse_feedback_responses 
ALTER COLUMN user_id DROP NOT NULL;

-- 5. Update RLS policies to allow anonymous inserts
DROP POLICY IF EXISTS "Users can insert their own feedback responses" ON pulse_feedback_responses;

CREATE POLICY "Anyone can insert anonymous feedback responses"
    ON pulse_feedback_responses FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        -- For fully anonymous: user_id must be NULL
        user_id IS NULL
    );

-- 6. Update update policy - anonymous responses are immutable
DROP POLICY IF EXISTS "Users can update their own feedback responses" ON pulse_feedback_responses;

CREATE POLICY "No updates allowed for anonymous feedback responses"
    ON pulse_feedback_responses FOR UPDATE
    TO authenticated
    USING (false)  -- Disable all updates
    WITH CHECK (false);

-- 7. Update select policy to allow viewing anonymous responses
DROP POLICY IF EXISTS "Users can view their own feedback responses" ON pulse_feedback_responses;

CREATE POLICY "Anyone can view feedback responses"
    ON pulse_feedback_responses FOR SELECT
    USING (true);

-- 8. Grant permissions to anonymous users
GRANT INSERT, SELECT ON pulse_feedback_responses TO anon;

-- 9. Add comment
COMMENT ON COLUMN pulse_feedback_responses.session_id IS 'Session identifier for anonymous duplicate prevention. NULL for legacy authenticated responses.';
COMMENT ON COLUMN pulse_feedback_responses.user_id IS 'Always NULL for anonymous responses. Legacy field for backward compatibility.';


