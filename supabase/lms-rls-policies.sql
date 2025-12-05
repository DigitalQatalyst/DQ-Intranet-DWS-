-- RLS Policies for LMS Tables
-- Run this in your Supabase SQL Editor to allow anonymous (anon) role to read LMS data

-- Enable RLS on all LMS tables (if not already enabled)
ALTER TABLE IF EXISTS lms_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lms_curriculum_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lms_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lms_lessons ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow anon to read lms_courses" ON lms_courses;
DROP POLICY IF EXISTS "Allow anon to read lms_curriculum_items" ON lms_curriculum_items;
DROP POLICY IF EXISTS "Allow anon to read lms_topics" ON lms_topics;
DROP POLICY IF EXISTS "Allow anon to read lms_lessons" ON lms_lessons;

-- Create policies to allow anon role to SELECT (read) from all LMS tables
CREATE POLICY "Allow anon to read lms_courses"
  ON lms_courses
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to read lms_curriculum_items"
  ON lms_curriculum_items
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to read lms_topics"
  ON lms_topics
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon to read lms_lessons"
  ON lms_lessons
  FOR SELECT
  TO anon
  USING (true);

-- Verify the policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename LIKE 'lms_%'
ORDER BY tablename, policyname;

