    -- Migration: Create pulse_feedback_questions table
    -- Description: Creates table to store feedback questions organized by category
    -- Date: 2025-01-06

    -- Check if table exists before creating
    DO $$ 
    BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'pulse_feedback_questions'
    ) THEN
        -- Create pulse_feedback_questions table
        CREATE TABLE pulse_feedback_questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        category TEXT NOT NULL,
        question TEXT NOT NULL,
        event_id UUID, -- Optional: link to specific event/pulse_item
        question_type TEXT DEFAULT 'text' CHECK (question_type IN ('text', 'scale', 'rating')),
        scale_min INTEGER,
        scale_max INTEGER,
        display_order INTEGER DEFAULT 0,
        is_required BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Create indexes
        CREATE INDEX idx_pulse_feedback_questions_category ON pulse_feedback_questions(category);
        CREATE INDEX idx_pulse_feedback_questions_event_id ON pulse_feedback_questions(event_id);
        CREATE INDEX idx_pulse_feedback_questions_display_order ON pulse_feedback_questions(display_order);

        -- Add comments
        COMMENT ON TABLE pulse_feedback_questions IS 'Stores feedback questions organized by category for events';
        COMMENT ON COLUMN pulse_feedback_questions.category IS 'Question category/group (e.g., Event Content & Value, Engagement & Interaction)';
        COMMENT ON COLUMN pulse_feedback_questions.question_type IS 'Type of question: text (textarea), scale (rating scale), rating (star rating)';
        COMMENT ON COLUMN pulse_feedback_questions.event_id IS 'Optional: Link to specific pulse_item/event. NULL means available for all feedback forms';

        -- Create trigger for updated_at
        CREATE TRIGGER update_pulse_feedback_questions_updated_at
        BEFORE UPDATE ON pulse_feedback_questions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

        -- Enable RLS
        ALTER TABLE pulse_feedback_questions ENABLE ROW LEVEL SECURITY;

        -- RLS Policies
        CREATE POLICY "Anyone can view feedback questions"
        ON pulse_feedback_questions FOR SELECT
        USING (true);

        CREATE POLICY "Authenticated users can insert feedback questions"
        ON pulse_feedback_questions FOR INSERT
        TO authenticated
        WITH CHECK (true);

        CREATE POLICY "Authenticated users can update feedback questions"
        ON pulse_feedback_questions FOR UPDATE
        TO authenticated
        USING (true)
        WITH CHECK (true);

        -- Grant permissions
        GRANT SELECT ON pulse_feedback_questions TO anon;
        GRANT SELECT ON pulse_feedback_questions TO authenticated;
        GRANT INSERT, UPDATE, DELETE ON pulse_feedback_questions TO authenticated;
    END IF;
    END $$;


