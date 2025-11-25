-- Migration: Create pulse_feedback_responses table
-- Description: Creates table to store individual feedback question responses
-- Date: 2025-01-06

-- Check if table exists before creating
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'pulse_feedback_responses'
  ) THEN
    -- Create pulse_feedback_responses table
    CREATE TABLE pulse_feedback_responses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      question_id UUID NOT NULL REFERENCES pulse_feedback_questions(id) ON DELETE CASCADE,
      event_id UUID NOT NULL REFERENCES pulse_items(id) ON DELETE CASCADE,
      user_id UUID REFERENCES auth.users(id),
      response TEXT NOT NULL, -- Store response as text (can be JSON for complex responses)
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      
      -- Ensure one response per user per question per event
      UNIQUE(event_id, question_id, user_id)
    );

    -- Create indexes
    CREATE INDEX idx_pulse_feedback_responses_question_id ON pulse_feedback_responses(question_id);
    CREATE INDEX idx_pulse_feedback_responses_event_id ON pulse_feedback_responses(event_id);
    CREATE INDEX idx_pulse_feedback_responses_user_id ON pulse_feedback_responses(user_id);
    CREATE INDEX idx_pulse_feedback_responses_created_at ON pulse_feedback_responses(created_at DESC);

    -- Add comments
    COMMENT ON TABLE pulse_feedback_responses IS 'Stores individual responses to feedback questions';
    COMMENT ON COLUMN pulse_feedback_responses.response IS 'The response text or JSON for complex responses';
    COMMENT ON COLUMN pulse_feedback_responses.event_id IS 'The pulse_item/event this response is for';

    -- Create trigger for updated_at
    CREATE TRIGGER update_pulse_feedback_responses_updated_at
      BEFORE UPDATE ON pulse_feedback_responses
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();

    -- Enable RLS
    ALTER TABLE pulse_feedback_responses ENABLE ROW LEVEL SECURITY;

    -- RLS Policies
    CREATE POLICY "Users can view their own feedback responses"
      ON pulse_feedback_responses FOR SELECT
      USING (
        auth.uid() = user_id 
        OR auth.uid() IN (SELECT created_by FROM pulse_items WHERE id = event_id)
      );

    CREATE POLICY "Users can insert their own feedback responses"
      ON pulse_feedback_responses FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own feedback responses"
      ON pulse_feedback_responses FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    -- Grant permissions
    GRANT SELECT ON pulse_feedback_responses TO authenticated;
    GRANT INSERT, UPDATE ON pulse_feedback_responses TO authenticated;
  END IF;
END $$;


