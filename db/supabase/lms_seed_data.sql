-- =====================================================
-- Learning Management System (LMS) Seed Data
-- =====================================================
-- This script seeds the LMS tables with sample data
-- =====================================================

-- Note: This is a template. You'll need to insert your actual course data.
-- The data structure matches the TypeScript LmsDetail type.

-- Example: Insert a course
INSERT INTO lms_courses (
    id, slug, title, provider, course_category, delivery_mode, duration,
    level_code, department, locations, audience, status, summary,
    highlights, outcomes, course_type, track, rating, review_count
) VALUES (
    'dq-essentials',
    'dq-essentials',
    'DQ Essentials: How DQ Works',
    'DQ HRA',
    'DWS',
    'Video',
    'Short',
    'L1',
    ARRAY['DCO'],
    ARRAY['Global'],
    ARRAY['Associate', 'Lead']::lms_audience_type[],
    'live',
    'Get started with DQ essentials and understand how DQ operates.',
    ARRAY[
        'Understand DQ''s vision, DNA, and operating rhythms',
        'See how GHC and 6xD connect to daily delivery',
        'Know where to find core guidelines and help'
    ],
    ARRAY[
        'Explain DQ''s mission and how teams align to it',
        'Navigate Learning Center, Guidelines, and Requests',
        'Identify your next learning steps by role and level',
        'Apply essentials in your first projects'
    ],
    'Course (Single Lesson)',
    NULL,
    4.67,
    3
) ON CONFLICT (id) DO NOTHING;

-- Example: Insert reviews for the course
INSERT INTO lms_reviews (course_id, author, role, text, rating) VALUES
    ('dq-essentials', 'Sarah Johnson', 'Senior Developer', 'How DQ shaped my work ethic: This course provided excellent insights into how DQ operates. The mission and structure clarity helped me align my work with DQ''s values from day one.', 5),
    ('dq-essentials', 'Ahmed Al-Mansoori', 'Product Manager', 'Great orientation material for new team members. Understanding the operating models has been crucial for my role.', 4),
    ('dq-essentials', 'Rachel Kim', 'Engineering Lead', 'The DQ Essentials course transformed my understanding of how teams work together. The GHC and 6xD frameworks are now central to how I lead.', 5)
ON CONFLICT DO NOTHING;

-- Example: Insert case studies
INSERT INTO lms_case_studies (course_id, title, description, link) VALUES
    ('dq-essentials', 'DQ Transformation Case Study', 'How DQ essentials were applied in a real transformation project', '/case-studies/dq-transformation')
ON CONFLICT DO NOTHING;

-- Example: Insert references
INSERT INTO lms_references (course_id, title, description, link) VALUES
    ('dq-essentials', 'DQ Mission Statement', 'Official DQ mission and vision documentation', '/references/dq-mission')
ON CONFLICT DO NOTHING;

-- Example: Insert curriculum for a single lesson course
INSERT INTO lms_curriculum_items (id, course_id, title, description, duration, order_index, is_locked) VALUES
    ('lesson-1', 'dq-essentials', 'Introduction to DQ', 'Overview of DQ''s mission and values', '15 min', 1, false)
ON CONFLICT (id) DO NOTHING;

-- Example: Insert lessons directly (for single lesson course)
INSERT INTO lms_curriculum_lessons (
    id, curriculum_item_id, title, description, duration, lesson_type, order_index, is_locked
) VALUES
    ('lesson-1-video', 'lesson-1', 'Introduction to DQ', 'Overview of DQ''s mission and values', '15 min', 'video', 1, false)
ON CONFLICT (id) DO NOTHING;

-- Example: Insert a multi-lesson course with topics
INSERT INTO lms_courses (
    id, slug, title, provider, course_category, delivery_mode, duration,
    level_code, department, locations, audience, status, summary,
    highlights, outcomes, course_type, track, rating, review_count
) VALUES (
    'ghc-primer',
    'ghc-primer',
    'GHC Primer: Getting Started',
    'DQ HRA',
    'GHC',
    'Video',
    'Medium',
    'L2',
    ARRAY['DCO'],
    ARRAY['Global'],
    ARRAY['Associate', 'Lead']::lms_audience_type[],
    'live',
    'Learn the fundamentals of GHC methodology.',
    ARRAY['Understand GHC principles', 'Apply GHC in practice'],
    ARRAY['Master GHC basics', 'Apply GHC in projects'],
    'Course (Multi-Lessons)',
    NULL,
    4.5,
    2
) ON CONFLICT (id) DO NOTHING;

-- Example: Insert curriculum items (topics) for multi-lesson course
INSERT INTO lms_curriculum_items (id, course_id, title, description, duration, order_index, is_locked) VALUES
    ('topic-1', 'ghc-primer', 'GHC Fundamentals', 'Introduction to GHC principles', '30 min', 1, false),
    ('topic-2', 'ghc-primer', 'GHC Practice', 'Applying GHC in practice', '45 min', 2, false)
ON CONFLICT (id) DO NOTHING;

-- Example: Insert topics
INSERT INTO lms_curriculum_topics (id, curriculum_item_id, title, description, duration, order_index, is_locked) VALUES
    ('topic-1-sub', 'topic-1', 'GHC Basics', 'Core GHC concepts', '20 min', 1, false),
    ('topic-1-advanced', 'topic-1', 'Advanced GHC', 'Advanced GHC techniques', '10 min', 2, false)
ON CONFLICT (id) DO NOTHING;

-- Example: Insert lessons within topics
INSERT INTO lms_curriculum_lessons (
    id, curriculum_topic_id, title, description, duration, lesson_type, order_index, is_locked
) VALUES
    ('lesson-topic-1', 'topic-1-sub', 'Introduction to GHC', 'GHC basics', '20 min', 'video', 1, false),
    ('lesson-topic-2', 'topic-1-advanced', 'Advanced GHC Techniques', 'Advanced concepts', '10 min', 'guide', 1, false)
ON CONFLICT (id) DO NOTHING;

-- Example: Insert a track (bundle) course
INSERT INTO lms_courses (
    id, slug, title, provider, course_category, delivery_mode, duration,
    level_code, department, locations, audience, status, summary,
    highlights, outcomes, course_type, track, rating, review_count
) VALUES (
    'leadership-track',
    'leadership-track',
    'Leadership Track',
    'DQ HRA',
    'GHC',
    'Hybrid',
    'Long',
    'L4',
    ARRAY['DCO'],
    ARRAY['Global'],
    ARRAY['Lead']::lms_audience_type[],
    'live',
    'Complete leadership development track.',
    ARRAY['Develop leadership skills', 'Master team management'],
    ARRAY['Lead teams effectively', 'Drive organizational change'],
    'Course (Bundles)',
    NULL,
    4.8,
    5
) ON CONFLICT (id) DO NOTHING;

-- Example: Insert FAQs for tracks
INSERT INTO lms_faqs (course_id, question, answer, order_index) VALUES
    ('leadership-track', 'What are the requirements for taking this track?', 'This track is designed for Lead-level employees who want to develop their leadership skills.', 1),
    ('leadership-track', 'How long does it take to complete?', 'The track typically takes 8-10 weeks to complete, depending on your pace.', 2),
    ('leadership-track', 'Can I take individual courses from the track?', 'Yes, all courses in the track can be taken individually.', 3)
ON CONFLICT DO NOTHING;

-- Example: Insert curriculum items (courses) for track
INSERT INTO lms_curriculum_items (id, course_id, title, description, duration, order_index, is_locked, course_slug) VALUES
    ('course-1', 'leadership-track', 'Becoming a Leader Using GHC', 'Learn leadership with GHC', '2 hours', 1, false, 'ghc-primer'),
    ('course-2', 'leadership-track', 'DQ Products Leadership', 'Leadership with DQ products', '3 hours', 2, false, 'dq-products-leadership')
ON CONFLICT (id) DO NOTHING;

-- Example: Insert topics within track courses
INSERT INTO lms_curriculum_topics (id, curriculum_item_id, title, description, duration, order_index, is_locked) VALUES
    ('topic-course-1', 'course-1', 'Leadership Fundamentals', 'Core leadership concepts', '1 hour', 1, false),
    ('topic-course-2', 'course-1', 'GHC for Leaders', 'Applying GHC in leadership', '1 hour', 2, false)
ON CONFLICT (id) DO NOTHING;

-- Example: Insert lessons within topics in track courses
INSERT INTO lms_curriculum_lessons (
    id, curriculum_topic_id, title, description, duration, lesson_type, order_index, is_locked
) VALUES
    ('lesson-leadership-1', 'topic-course-1', 'Introduction to Leadership', 'Leadership basics', '30 min', 'video', 1, false),
    ('lesson-leadership-2', 'topic-course-1', 'Leadership Styles', 'Different leadership approaches', '30 min', 'guide', 2, false),
    ('lesson-ghc-leadership-1', 'topic-course-2', 'GHC for Leaders', 'Applying GHC', '30 min', 'video', 1, false),
    ('lesson-ghc-leadership-2', 'topic-course-2', 'Advanced GHC Leadership', 'Advanced techniques', '30 min', 'workshop', 2, false)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. This is a template with example data
-- 2. You'll need to migrate your existing course data from lmsCourseDetails.ts
-- 3. For production, create a script to convert TypeScript data to SQL inserts
-- 4. Make sure to handle all course types:
--    - Course (Single Lesson): curriculum_items with lessons directly
--    - Course (Multi-Lessons): curriculum_items with topics, topics with lessons
--    - Course (Bundles): curriculum_items (courses) with topics, topics with lessons
-- 5. Review counts and ratings are automatically updated via triggers
-- 6. Use ON CONFLICT to prevent duplicate inserts when re-running the script

