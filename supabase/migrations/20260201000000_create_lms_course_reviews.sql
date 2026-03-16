-- Create the lms_course_reviews table for storing course reviews
-- This table stores user feedback and ratings for LMS courses

CREATE TABLE IF NOT EXISTS lms_course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  star_rating INTEGER NOT NULL CHECK (star_rating >= 1 AND star_rating <= 5),
  key_learning TEXT NOT NULL,
  engaging_part TEXT NOT NULL CHECK (engaging_part IN ('Video', 'Quiz', 'Reading', 'Interactive Lab')),
  general_feedback TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true,
  
  -- Prevent duplicate reviews from the same user for the same course
  CONSTRAINT unique_user_course_review UNIQUE (course_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_course_id ON lms_course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_course_slug ON lms_course_reviews(course_slug);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON lms_course_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_published ON lms_course_reviews(is_published);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON lms_course_reviews(created_at DESC);

-- Create trigger to auto-update the updated_at column
CREATE OR REPLACE FUNCTION update_lms_course_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_lms_course_reviews_updated_at ON lms_course_reviews;
CREATE TRIGGER trigger_update_lms_course_reviews_updated_at
  BEFORE UPDATE ON lms_course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_lms_course_reviews_updated_at();

-- Enable Row Level Security
ALTER TABLE lms_course_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policy: Anyone can read published reviews
CREATE POLICY "Anyone can read published reviews"
  ON lms_course_reviews
  FOR SELECT
  USING (is_published = true);

-- Policy: Authenticated users can insert their own reviews
CREATE POLICY "Authenticated users can insert own reviews"
  ON lms_course_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON lms_course_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON lms_course_reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add columns to lms_courses for aggregate rating if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lms_courses' AND column_name = 'rating') THEN
    ALTER TABLE lms_courses ADD COLUMN rating NUMERIC(3,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'lms_courses' AND column_name = 'review_count') THEN
    ALTER TABLE lms_courses ADD COLUMN review_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Comments for documentation
COMMENT ON TABLE lms_course_reviews IS 'Stores user reviews and ratings for LMS courses';
COMMENT ON COLUMN lms_course_reviews.star_rating IS 'User rating from 1-5 stars';
COMMENT ON COLUMN lms_course_reviews.key_learning IS 'The #1 thing the user learned that they plan to apply in their work';
COMMENT ON COLUMN lms_course_reviews.engaging_part IS 'Which part of the course was most engaging: Video, Quiz, Reading, or Interactive Lab';
COMMENT ON COLUMN lms_course_reviews.general_feedback IS 'Open-ended feedback displayed in the reviews section';
