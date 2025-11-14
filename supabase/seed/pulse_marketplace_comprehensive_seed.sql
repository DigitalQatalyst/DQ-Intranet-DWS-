-- Seed File: Pulse Marketplace Comprehensive
-- Description: Creates sample polls, surveys, and feedback forms with questions, options, and responses
-- Date: 2025-01-XX
-- Note: Does NOT use users table - all entries are anonymous

-- ============================================
-- STEP 1: Insert Polls (as single-question surveys)
-- ============================================

INSERT INTO pulse_surveys (
    id, title, description, status, survey_type, department, location_filter,
    launch_date, close_date, allow_anonymous, allow_multiple_responses, require_login,
    image_url, tags, is_featured, is_pinned, created_by_name, created_by_email,
    published_at, created_at, metadata
) VALUES
    -- Poll 1: Favorite Programming Language
    (
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'What is your favorite programming language?',
        'Quick poll to understand the team''s preferred programming languages for upcoming projects.',
        'published',
        'single_page',
        'SecDevOps',
        NULL,
        NOW() - INTERVAL '5 days',
        NOW() + INTERVAL '10 days',
        false,
        false,
        true,
        NULL,
        ARRAY['poll', 'programming', 'technology'],
        true,
        false,
        'Alex Johnson',
        'alex.johnson@digitalqatalyst.com',
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '6 days',
        '{"type": "poll"}'::jsonb
    ),
    -- Poll 2: Preferred Meeting Time
    (
        'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'What time works best for team meetings?',
        'Help us schedule team meetings at a time that works for everyone.',
        'published',
        'single_page',
        NULL,
        NULL,
        NOW() - INTERVAL '3 days',
        NOW() + INTERVAL '7 days',
        false,
        false,
        true,
        NULL,
        ARRAY['poll', 'meetings', 'scheduling'],
        false,
        false,
        'Brianna Smith',
        'brianna.smith@digitalqatalyst.com',
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '4 days',
        '{"type": "poll"}'::jsonb
    ),
    -- Poll 3: Office Snack Preferences
    (
        'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'What snacks should we stock in the office?',
        'Vote for your favorite office snacks!',
        'published',
        'single_page',
        NULL,
        'Dubai',
        NOW() - INTERVAL '2 days',
        NOW() + INTERVAL '8 days',
        true,
        true,
        false,
        NULL,
        ARRAY['poll', 'snacks', 'office'],
        false,
        false,
        'Casey Williams',
        'casey.williams@digitalqatalyst.com',
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '3 days',
        '{"type": "poll"}'::jsonb
    );

-- ============================================
-- STEP 2: Insert Surveys
-- ============================================

INSERT INTO pulse_surveys (
    id, title, description, status, survey_type, department, location_filter,
    launch_date, close_date, allow_anonymous, allow_multiple_responses, require_login,
    image_url, tags, is_featured, is_pinned, created_by_name, created_by_email,
    published_at, created_at, metadata
) VALUES
    -- Survey 1: Employee Satisfaction
    (
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'Q1 2025 Employee Satisfaction Survey',
        'Help us understand your experience and improve our workplace culture.',
        'published',
        'multi_page',
        'HRA (People)',
        NULL,
        NOW() - INTERVAL '7 days',
        NOW() + INTERVAL '20 days',
        false,
        false,
        true,
        NULL,
        ARRAY['survey', 'satisfaction', 'employee-experience'],
        true,
        false,
        'Dylan Brown',
        'dylan.brown@digitalqatalyst.com',
        NOW() - INTERVAL '7 days',
        NOW() - INTERVAL '8 days',
        '{"type": "survey"}'::jsonb
    ),
    -- Survey 2: Remote Work Experience
    (
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'Remote Work Experience Survey',
        'Share your thoughts on remote work arrangements and productivity.',
        'published',
        'single_page',
        NULL,
        'Remote',
        NOW() - INTERVAL '4 days',
        NOW() + INTERVAL '15 days',
        false,
        false,
        true,
        NULL,
        ARRAY['survey', 'remote-work', 'productivity'],
        false,
        false,
        'Elin Davis',
        'elin.davis@digitalqatalyst.com',
        NOW() - INTERVAL '4 days',
        NOW() - INTERVAL '5 days',
        '{"type": "survey"}'::jsonb
    ),
    -- Survey 3: Training Needs Assessment
    (
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'Training & Development Needs Assessment',
        'Tell us what skills you want to develop and training programs you need.',
        'published',
        'multi_page',
        NULL,
        NULL,
        NOW() - INTERVAL '1 day',
        NOW() + INTERVAL '30 days',
        false,
        false,
        true,
        NULL,
        ARRAY['survey', 'training', 'development'],
        true,
        true,
        'Frank Miller',
        'frank.miller@digitalqatalyst.com',
        NOW() - INTERVAL '1 day',
        NOW() - INTERVAL '2 days',
        '{"type": "survey"}'::jsonb
    );

-- ============================================
-- STEP 3: Insert Questions for Polls
-- ============================================

-- Poll 1 Questions (single question - it's a poll)
INSERT INTO survey_questions (
    id, survey_id, question_text, question_type, options, is_required,
    placeholder, help_text, display_order, created_at
) VALUES
    (
        'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'What is your favorite programming language?',
        'single_choice',
        '[
            {"id": "javascript", "text": "JavaScript", "order": 1},
            {"id": "python", "text": "Python", "order": 2},
            {"id": "typescript", "text": "TypeScript", "order": 3},
            {"id": "java", "text": "Java", "order": 4},
            {"id": "go", "text": "Go", "order": 5},
            {"id": "rust", "text": "Rust", "order": 6},
            {"id": "other", "text": "Other", "order": 7}
        ]'::jsonb,
        true,
        NULL,
        'Select your favorite programming language',
        1,
        NOW() - INTERVAL '6 days'
    );

-- Poll 2 Questions
INSERT INTO survey_questions (
    id, survey_id, question_text, question_type, options, is_required,
    placeholder, help_text, display_order, created_at
) VALUES
    (
        'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'What time works best for team meetings?',
        'single_choice',
        '[
            {"id": "morning", "text": "Morning (9-11 AM)", "order": 1},
            {"id": "midday", "text": "Midday (11 AM - 2 PM)", "order": 2},
            {"id": "afternoon", "text": "Afternoon (2-5 PM)", "order": 3},
            {"id": "evening", "text": "Evening (5-7 PM)", "order": 4}
        ]'::jsonb,
        true,
        NULL,
        NULL,
        1,
        NOW() - INTERVAL '4 days'
    );

-- Poll 3 Questions
INSERT INTO survey_questions (
    id, survey_id, question_text, question_type, options, is_required,
    placeholder, help_text, display_order, created_at
) VALUES
    (
        'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'What snacks should we stock in the office? (Select all that apply)',
        'multiple_choice',
        '[
            {"id": "chips", "text": "Chips & Crisps", "order": 1},
            {"id": "nuts", "text": "Nuts & Trail Mix", "order": 2},
            {"id": "chocolate", "text": "Chocolate & Candy", "order": 3},
            {"id": "fruit", "text": "Fresh Fruit", "order": 4},
            {"id": "yogurt", "text": "Yogurt", "order": 5},
            {"id": "granola", "text": "Granola Bars", "order": 6}
        ]'::jsonb,
        false,
        NULL,
        'Select all snacks you would like',
        1,
        NOW() - INTERVAL '3 days'
    );

-- ============================================
-- STEP 4: Insert Questions for Surveys
-- ============================================

-- Survey 1 Questions (Employee Satisfaction - 5 questions)
INSERT INTO survey_questions (
    id, survey_id, question_text, question_type, options, is_required,
    placeholder, help_text, display_order, created_at
) VALUES
    (
        'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'How satisfied are you with your current role?',
        'rating',
        '{"min": 1, "max": 5, "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]}'::jsonb,
        true,
        NULL,
        'Rate your overall satisfaction',
        1,
        NOW() - INTERVAL '8 days'
    ),
    (
        'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'How would you rate your work-life balance?',
        'single_choice',
        '[
            {"id": "excellent", "text": "Excellent", "order": 1},
            {"id": "good", "text": "Good", "order": 2},
            {"id": "fair", "text": "Fair", "order": 3},
            {"id": "poor", "text": "Poor", "order": 4}
        ]'::jsonb,
        true,
        NULL,
        NULL,
        2,
        NOW() - INTERVAL '8 days'
    ),
    (
        'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'What aspects of company culture do you value most? (Select all that apply)',
        'multiple_choice',
        '[
            {"id": "transparency", "text": "Transparency", "order": 1},
            {"id": "innovation", "text": "Innovation", "order": 2},
            {"id": "diversity", "text": "Diversity & Inclusion", "order": 3},
            {"id": "growth", "text": "Growth Opportunities", "order": 4},
            {"id": "teamwork", "text": "Teamwork", "order": 5}
        ]'::jsonb,
        false,
        NULL,
        NULL,
        3,
        NOW() - INTERVAL '8 days'
    ),
    (
        'd4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'How many years have you been with the company?',
        'number',
        NULL,
        true,
        'Enter number of years',
        NULL,
        4,
        NOW() - INTERVAL '8 days'
    ),
    (
        'd5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'What suggestions do you have to improve employee satisfaction?',
        'textarea',
        NULL,
        false,
        'Share your thoughts...',
        'Your feedback is valuable',
        5,
        NOW() - INTERVAL '8 days'
    );

-- Survey 2 Questions (Remote Work - 4 questions)
INSERT INTO survey_questions (
    id, survey_id, question_text, question_type, options, is_required,
    placeholder, help_text, display_order, created_at
) VALUES
    (
        'd6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'How many days per week do you work remotely?',
        'single_choice',
        '[
            {"id": "0", "text": "0 days (Fully office-based)", "order": 1},
            {"id": "1-2", "text": "1-2 days", "order": 2},
            {"id": "3-4", "text": "3-4 days", "order": 3},
            {"id": "5", "text": "5 days (Fully remote)", "order": 4}
        ]'::jsonb,
        true,
        NULL,
        NULL,
        1,
        NOW() - INTERVAL '5 days'
    ),
    (
        'd7eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'Which productivity tools do you use? (Select all that apply)',
        'multiple_choice',
        '[
            {"id": "slack", "text": "Slack", "order": 1},
            {"id": "teams", "text": "Microsoft Teams", "order": 2},
            {"id": "zoom", "text": "Zoom", "order": 3},
            {"id": "jira", "text": "Jira", "order": 4},
            {"id": "notion", "text": "Notion", "order": 5}
        ]'::jsonb,
        false,
        NULL,
        NULL,
        2,
        NOW() - INTERVAL '5 days'
    ),
    (
        'd8eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'Rate your remote work productivity (1-10)',
        'rating',
        '{"min": 1, "max": 10, "labels": ["Very Low", "", "", "", "", "", "", "", "", "Very High"]}'::jsonb,
        true,
        NULL,
        NULL,
        3,
        NOW() - INTERVAL '5 days'
    ),
    (
        'd9eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'What challenges do you face with remote work?',
        'textarea',
        NULL,
        false,
        'Describe any challenges...',
        NULL,
        4,
        NOW() - INTERVAL '5 days'
    );

-- Survey 3 Questions (Training Needs - 3 questions)
INSERT INTO survey_questions (
    id, survey_id, question_text, question_type, options, is_required,
    placeholder, help_text, display_order, created_at
) VALUES
    (
        'da1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'What areas would you like to develop? (Select all that apply)',
        'multiple_choice',
        '[
            {"id": "technical", "text": "Technical Skills", "order": 1},
            {"id": "leadership", "text": "Leadership", "order": 2},
            {"id": "communication", "text": "Communication", "order": 3},
            {"id": "project-management", "text": "Project Management", "order": 4},
            {"id": "data-analysis", "text": "Data Analysis", "order": 5}
        ]'::jsonb,
        true,
        NULL,
        NULL,
        1,
        NOW() - INTERVAL '2 days'
    ),
    (
        'db1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'What is your preferred learning format?',
        'single_choice',
        '[
            {"id": "online", "text": "Online Courses", "order": 1},
            {"id": "workshop", "text": "In-person Workshops", "order": 2},
            {"id": "mentorship", "text": "Mentorship", "order": 3},
            {"id": "conference", "text": "Conferences", "order": 4}
        ]'::jsonb,
        true,
        NULL,
        NULL,
        2,
        NOW() - INTERVAL '2 days'
    ),
    (
        'dc1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'What specific training programs would you like to see?',
        'textarea',
        NULL,
        false,
        'List specific programs...',
        NULL,
        3,
        NOW() - INTERVAL '2 days'
    );

-- ============================================
-- STEP 5: Insert Feedback Forms
-- ============================================

INSERT INTO pulse_feedback (
    id, title, feedback_text, feedback_type, rating, category, tags,
    department, location_filter,
    status, is_anonymous, is_public, created_at
) VALUES
    -- Feedback Form 1: Suggestion
    (
        'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'Improve Office Wi-Fi',
        'The Wi-Fi in the Dubai office has been slow. Could we upgrade the network infrastructure?',
        'suggestion',
        3,
        'Facilities',
        ARRAY['wifi', 'infrastructure'],
        NULL,
        'Dubai',
        'open',
        false,
        true,
        NOW() - INTERVAL '10 days'
    ),
    -- Feedback Form 2: Feature Request
    (
        'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'Add Dark Mode to Portal',
        'It would be great to have a dark mode option for the internal portal to reduce eye strain.',
        'feature_request',
        4,
        'Technology',
        ARRAY['dark-mode', 'ui'],
        'Products',
        NULL,
        'in_review',
        false,
        true,
        NOW() - INTERVAL '8 days'
    ),
    -- Feedback Form 3: Complaint
    (
        'f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'Meeting Room Booking Issues',
        'The booking system shows rooms as available but they are already occupied.',
        'complaint',
        2,
        'Facilities',
        ARRAY['meeting-rooms', 'booking'],
        NULL,
        'Dubai',
        'open',
        false,
        true,
        NOW() - INTERVAL '6 days'
    );

-- ============================================
-- STEP 6: Insert Responses for Polls
-- ============================================

-- Poll 1 Responses (5 responses)
INSERT INTO survey_responses (
    id, survey_id, question_id,
    response_value, response_values, response_number, response_text, created_at
) VALUES
    (
        'e1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'typescript',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '4 days'
    ),
    (
        'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'python',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '4 days'
    ),
    (
        'e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'javascript',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '3 days'
    ),
    (
        'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'typescript',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '3 days'
    ),
    (
        'e5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'go',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '2 days'
    );

-- Poll 2 Responses (4 responses)
INSERT INTO survey_responses (
    id, survey_id, question_id,
    response_value, response_values, response_number, response_text, created_at
) VALUES
    (
        'e6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'Alex Johnson',
        'alex.johnson@digitalqatalyst.com',
        'morning',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '2 days'
    ),
    (
        'e7eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'Brianna Smith',
        'brianna.smith@digitalqatalyst.com',
        'midday',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '2 days'
    ),
    (
        'e8eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'Casey Williams',
        'casey.williams@digitalqatalyst.com',
        'afternoon',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '1 day'
    ),
    (
        'e9eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'Dylan Brown',
        'dylan.brown@digitalqatalyst.com',
        'morning',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '1 day'
    );

-- Poll 3 Responses (3 responses - multiple choice)
INSERT INTO survey_responses (
    id, survey_id, question_id,
    response_value, response_values, response_number, response_text, created_at
) VALUES
    (
        'ea1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        NULL,
        NULL,
        NULL,
        NULL,
        ARRAY['chips', 'chocolate', 'fruit'],
        NULL,
        NULL,
        NOW() - INTERVAL '1 day'
    ),
    (
        'eb1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        NULL,
        NULL,
        NULL,
        NULL,
        ARRAY['nuts', 'yogurt', 'granola'],
        NULL,
        NULL,
        NOW() - INTERVAL '1 day'
    ),
    (
        'ec1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        NULL,
        NULL,
        NULL,
        NULL,
        ARRAY['fruit', 'granola'],
        NULL,
        NULL,
        NOW()
    );

-- ============================================
-- STEP 7: Insert Responses for Surveys
-- ============================================

-- Survey 1 Responses (3 complete submissions)
INSERT INTO survey_responses (
    id, survey_id, question_id,
    response_value, response_values, response_number, response_text, created_at
) VALUES
    -- User 1: Alex - Complete submission
    (
        'f1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        NULL,
        NULL,
        4,
        NULL,
        NOW() - INTERVAL '6 days'
    ),
    (
        'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'good',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '6 days'
    ),
    (
        'f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        NULL,
        ARRAY['transparency', 'innovation', 'growth'],
        NULL,
        NULL,
        NOW() - INTERVAL '6 days'
    ),
    (
        'f4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'd4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        NULL,
        NULL,
        3,
        NULL,
        NOW() - INTERVAL '6 days'
    ),
    (
        'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'd5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID,
        NULL,
        NULL,
        NULL,
        'More flexible working hours would improve satisfaction.',
        NOW() - INTERVAL '6 days'
    ),
    -- User 2: Brianna - Complete submission
    (
        'f6eebc99-9c0b-4ef8-bb6d-6bb9bd380a21'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        NULL,
        NULL,
        5,
        NULL,
        NOW() - INTERVAL '5 days'
    ),
    (
        'f7eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'excellent',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '5 days'
    ),
    (
        'f8eebc99-9c0b-4ef8-bb6d-6bb9bd380a23'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        NULL,
        ARRAY['diversity', 'teamwork'],
        NULL,
        NULL,
        NOW() - INTERVAL '5 days'
    ),
    (
        'f9eebc99-9c0b-4ef8-bb6d-6bb9bd380a24'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'd4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        NULL,
        NULL,
        2,
        NULL,
        NOW() - INTERVAL '5 days'
    ),
    (
        'fa1eebc99-9c0b-4ef8-bb6d-6bb9bd380a25'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'd5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID,
        NULL,
        NULL,
        NULL,
        'Better recognition programs would be great!',
        NOW() - INTERVAL '5 days'
    ),
    -- User 3: Casey - Partial submission (only 3 questions)
    (
        'fb1eebc99-9c0b-4ef8-bb6d-6bb9bd380a31'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        NULL,
        NULL,
        3,
        NULL,
        NOW() - INTERVAL '4 days'
    ),
    (
        'fc1eebc99-9c0b-4ef8-bb6d-6bb9bd380a32'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'fair',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '4 days'
    ),
    (
        'fd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a33'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        NULL,
        ARRAY['innovation'],
        NULL,
        NULL,
        NOW() - INTERVAL '4 days'
    );

-- Survey 2 Responses (4 submissions)
INSERT INTO survey_responses (
    id, survey_id, question_id,
    response_value, response_values, response_number, response_text, created_at
) VALUES
    -- User 1: Dylan - Complete
    (
        'fe1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'd6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        '5',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '3 days'
    ),
    (
        'ff1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'd7eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        NULL,
        ARRAY['slack', 'zoom', 'jira'],
        NULL,
        NULL,
        NOW() - INTERVAL '3 days'
    ),
    (
        '120eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'd8eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        NULL,
        NULL,
        8,
        NULL,
        NOW() - INTERVAL '3 days'
    ),
    (
        '121eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'd9eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        NULL,
        NULL,
        NULL,
        'Sometimes hard to stay focused at home.',
        NOW() - INTERVAL '3 days'
    ),
    -- User 2: Elin - Complete
    (
        '122eebc99-9c0b-4ef8-bb6d-6bb9bd380a21'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'd6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        '3-4',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '2 days'
    ),
    (
        '123eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'd7eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        NULL,
        ARRAY['teams', 'notion'],
        NULL,
        NULL,
        NOW() - INTERVAL '2 days'
    ),
    (
        '124eebc99-9c0b-4ef8-bb6d-6bb9bd380a23'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'd8eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        NULL,
        NULL,
        9,
        NULL,
        NOW() - INTERVAL '2 days'
    ),
    (
        '125eebc99-9c0b-4ef8-bb6d-6bb9bd380a24'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'd9eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        NULL,
        NULL,
        NULL,
        'No major challenges, remote work is great!',
        NOW() - INTERVAL '2 days'
    ),
    -- User 3: Frank - Partial (2 questions)
    (
        '126eebc99-9c0b-4ef8-bb6d-6bb9bd380a31'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'd6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        '5',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '1 day'
    ),
    (
        '127eebc99-9c0b-4ef8-bb6d-6bb9bd380a32'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'd7eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        NULL,
        ARRAY['slack', 'jira'],
        NULL,
        NULL,
        NOW() - INTERVAL '1 day'
    ),
    -- User 4: Alex - Complete
    (
        '128eebc99-9c0b-4ef8-bb6d-6bb9bd380a41'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'd6eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        '1-2',
        NULL,
        NULL,
        NULL,
        NOW()
    ),
    (
        '129eebc99-9c0b-4ef8-bb6d-6bb9bd380a42'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'd7eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        NULL,
        ARRAY['zoom'],
        NULL,
        NULL,
        NOW()
    ),
    (
        '12aeebc99-9c0b-4ef8-bb6d-6bb9bd380a43'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'd8eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        NULL,
        NULL,
        7,
        NULL,
        NOW()
    ),
    (
        '12beebc99-9c0b-4ef8-bb6d-6bb9bd380a44'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'd9eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        NULL,
        NULL,
        NULL,
        'Need better video call quality.',
        NOW()
    );

-- Survey 3 Responses (2 submissions)
INSERT INTO survey_responses (
    id, survey_id, question_id,
    response_value, response_values, response_number, response_text, created_at
) VALUES
    -- User 1: Brianna - Complete
    (
        '12ceebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'da1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        NULL,
        ARRAY['leadership', 'communication', 'project-management'],
        NULL,
        NULL,
        NOW() - INTERVAL '1 day'
    ),
    (
        '12deebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'db1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'mentorship',
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '1 day'
    ),
    (
        '12eeebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'dc1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        NULL,
        NULL,
        NULL,
        'Leadership workshops and public speaking courses.',
        NOW() - INTERVAL '1 day'
    ),
    -- User 2: Casey - Complete
    (
        '12feebc99-9c0b-4ef8-bb6d-6bb9bd380a21'::UUID,
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'da1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        NULL,
        ARRAY['technical', 'data-analysis'],
        NULL,
        NULL,
        NOW()
    ),
    (
        '130eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'::UUID,
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'db1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'online',
        NULL,
        NULL,
        NULL,
        NOW()
    ),
    (
        '131eebc99-9c0b-4ef8-bb6d-6bb9bd380a23'::UUID,
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'dc1eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        NULL,
        NULL,
        NULL,
        'Python data science bootcamp and SQL advanced courses.',
        NOW()
    );

-- ============================================
-- STEP 8: Update survey response counts
-- ============================================

UPDATE pulse_surveys
SET total_responses = (
    SELECT COUNT(*)
    FROM survey_responses
    WHERE survey_responses.survey_id = pulse_surveys.id
),
total_completions = (
    SELECT COUNT(DISTINCT question_id)
    FROM survey_responses
    WHERE survey_id = pulse_surveys.id
);

