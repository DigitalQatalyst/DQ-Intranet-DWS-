-- Create course progress tracking tables
-- This migration creates tables for tracking user progress through LMS courses and lessons

-- ============================================
-- Lesson Progress Table
-- ============================================
-- Tracks individual lesson progress for each user
CREATE TABLE IF NOT EXISTS lms_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage NUMERIC(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  quiz_passed BOOLEAN DEFAULT false,
  quiz_score NUMERIC(5,2),
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Each user can only have one progress record per lesson
  CONSTRAINT unique_user_lesson_progress UNIQUE (user_id, lesson_id)
);

-- ============================================
-- Course Progress Table
-- ============================================
-- Tracks overall course progress for each user (aggregated from lesson progress)
CREATE TABLE IF NOT EXISTS lms_course_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  course_slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage NUMERIC(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  lessons_completed INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_time_spent_seconds INTEGER DEFAULT 0,
  certificate_earned BOOLEAN DEFAULT false,
  certificate_earned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Each user can only have one progress record per course
  CONSTRAINT unique_user_course_progress UNIQUE (user_id, course_id)
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON lms_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON lms_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_course_id ON lms_lesson_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_status ON lms_lesson_progress(status);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_last_accessed ON lms_lesson_progress(last_accessed_at DESC);

CREATE INDEX IF NOT EXISTS idx_course_progress_user_id ON lms_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_course_id ON lms_course_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_status ON lms_course_progress(status);
CREATE INDEX IF NOT EXISTS idx_course_progress_last_accessed ON lms_course_progress(last_accessed_at DESC);

-- ============================================
-- Auto-update triggers for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_lms_lesson_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_lms_lesson_progress_updated_at ON lms_lesson_progress;
CREATE TRIGGER trigger_update_lms_lesson_progress_updated_at
  BEFORE UPDATE ON lms_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_lms_lesson_progress_updated_at();

CREATE OR REPLACE FUNCTION update_lms_course_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_lms_course_progress_updated_at ON lms_course_progress;
CREATE TRIGGER trigger_update_lms_course_progress_updated_at
  BEFORE UPDATE ON lms_course_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_lms_course_progress_updated_at();

-- ============================================
-- Enable Row Level Security
-- ============================================
ALTER TABLE lms_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_course_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies for Lesson Progress
-- ============================================

-- Users can read their own lesson progress
CREATE POLICY "Users can read own lesson progress"
  ON lms_lesson_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own lesson progress
CREATE POLICY "Users can insert own lesson progress"
  ON lms_lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own lesson progress
CREATE POLICY "Users can update own lesson progress"
  ON lms_lesson_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own lesson progress
CREATE POLICY "Users can delete own lesson progress"
  ON lms_lesson_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- RLS Policies for Course Progress
-- ============================================

-- Users can read their own course progress
CREATE POLICY "Users can read own course progress"
  ON lms_course_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own course progress
CREATE POLICY "Users can insert own course progress"
  ON lms_course_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own course progress
CREATE POLICY "Users can update own course progress"
  ON lms_course_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own course progress
CREATE POLICY "Users can delete own course progress"
  ON lms_course_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- Comments for documentation
-- ============================================
COMMENT ON TABLE lms_lesson_progress IS 'Tracks individual lesson progress for each user in LMS courses';
COMMENT ON COLUMN lms_lesson_progress.status IS 'Current status of the lesson: not_started, in_progress, or completed';
COMMENT ON COLUMN lms_lesson_progress.progress_percentage IS 'Percentage of lesson content consumed (0-100)';
COMMENT ON COLUMN lms_lesson_progress.quiz_passed IS 'Whether the lesson quiz was passed (if applicable)';
COMMENT ON COLUMN lms_lesson_progress.time_spent_seconds IS 'Total time spent on this lesson in seconds';

COMMENT ON TABLE lms_course_progress IS 'Tracks overall course progress for each user (aggregated from lessons)';
COMMENT ON COLUMN lms_course_progress.status IS 'Current status of the course: not_started, in_progress, or completed';
COMMENT ON COLUMN lms_course_progress.progress_percentage IS 'Overall course completion percentage (0-100)';
COMMENT ON COLUMN lms_course_progress.certificate_earned IS 'Whether user has earned a certificate for this course';
