-- Migration: Make all pulse_responses fully anonymous
-- Description: Removes user identification requirements and allows anonymous submissions
-- Date: 2025-01-06

-- 1. Add session_id column for duplicate prevention
ALTER TABLE pulse_responses 
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- 2. Remove UNIQUE constraint that includes user_id
ALTER TABLE pulse_responses 
DROP CONSTRAINT IF EXISTS pulse_responses_pulse_item_id_user_id_key;

-- 3. Create partial unique index for session-based duplicate prevention
-- This prevents multiple responses per session, but allows unlimited sessions
CREATE UNIQUE INDEX IF NOT EXISTS idx_pulse_responses_unique_session 
ON pulse_responses(pulse_item_id, session_id) 
WHERE session_id IS NOT NULL;

-- 4. Ensure user fields can be NULL (they already are, but make it explicit)
ALTER TABLE pulse_responses 
ALTER COLUMN user_id DROP NOT NULL,
ALTER COLUMN user_name DROP NOT NULL,
ALTER COLUMN user_email DROP NOT NULL;

-- 5. Update RLS policies to allow anonymous inserts
DROP POLICY IF EXISTS "Authenticated users can create pulse responses" ON pulse_responses;

CREATE POLICY "Anyone can create anonymous pulse responses"
    ON pulse_responses FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        -- For fully anonymous: user_id, user_name, user_email must be NULL
        user_id IS NULL 
        AND user_name IS NULL 
        AND user_email IS NULL
    );

-- 6. Update update policy - anonymous responses are immutable
DROP POLICY IF EXISTS "Users can update their own pulse responses" ON pulse_responses;

CREATE POLICY "No updates allowed for anonymous responses"
    ON pulse_responses FOR UPDATE
    TO authenticated
    USING (false)  -- Disable all updates
    WITH CHECK (false);

-- 7. Grant permissions to anonymous users
GRANT INSERT ON pulse_responses TO anon;

-- 8. Add comment
COMMENT ON COLUMN pulse_responses.session_id IS 'Session identifier for anonymous duplicate prevention. NULL for legacy authenticated responses.';
COMMENT ON COLUMN pulse_responses.user_id IS 'Always NULL for anonymous responses. Legacy field for backward compatibility.';


