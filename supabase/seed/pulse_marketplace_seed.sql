-- Seed File: Pulse Marketplace
-- Description: Inserts sample data for pulse_surveys, survey_questions, survey_responses, and pulse_feedback
-- Note: Does NOT use users table - all user references have been removed

-- ============================================
-- STEP 1: Insert Pulse Surveys
-- ============================================

INSERT INTO pulse_surveys (
    id,
    title,
    description,
    status,
    survey_type,
    department,
    location_filter,
    launch_date,
    close_date,
    allow_anonymous,
    allow_multiple_responses,
    require_login,
    image_url,
    tags,
    is_featured,
    is_pinned,
    created_by_name,
    created_by_email,
    published_at,
    created_at
) VALUES
    -- Survey 1: Employee Satisfaction Survey
    (
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'Q1 2025 Employee Satisfaction Survey',
        'Help us understand your experience at Digital Qatalyst. Your feedback is valuable in shaping our workplace culture and improving employee experience.',
        'published',
        'multi_page',
        'HRA (People)',
        NULL,
        NOW() - INTERVAL '10 days',
        NOW() + INTERVAL '20 days',
        false,
        false,
        true,
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800',
        ARRAY['satisfaction', 'employee-experience', 'culture'],
        true,
        false,
        NULL,
        NULL,
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '15 days'
    ),
    -- Survey 2: Remote Work Preferences
    (
        'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'Remote Work Preferences & Productivity Survey',
        'Share your thoughts on remote work arrangements, productivity tools, and work-life balance preferences.',
        'published',
        'single_page',
        NULL,
        'Remote',
        NOW() - INTERVAL '5 days',
        NOW() + INTERVAL '15 days',
        true,
        false,
        true,
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
        ARRAY['remote-work', 'productivity', 'work-life-balance'],
        false,
        false,
        NULL,
        NULL,
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '8 days'
    ),
    -- Survey 3: Training & Development Needs
    (
        'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'Training & Development Needs Assessment',
        'Tell us what skills you want to develop and what training programs would be most valuable for your career growth.',
        'published',
        'multi_page',
        NULL,
        NULL,
        NOW() - INTERVAL '3 days',
        NOW() + INTERVAL '30 days',
        false,
        false,
        true,
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
        ARRAY['training', 'development', 'skills', 'career-growth'],
        true,
        true,
        NULL,
        NULL,
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '5 days'
    ),
    -- Survey 4: Office Facilities Feedback
    (
        'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'Office Facilities & Amenities Feedback',
        'Help us improve our office spaces. Share your feedback on facilities, amenities, and what you''d like to see added.',
        'published',
        'single_page',
        NULL,
        'Dubai',
        NOW() - INTERVAL '7 days',
        NOW() + INTERVAL '14 days',
        false,
        false,
        true,
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        ARRAY['facilities', 'office', 'amenities'],
        false,
        false,
        NULL,
        NULL,
        NOW() - INTERVAL '7 days',
        NOW() - INTERVAL '10 days'
    ),
    -- Survey 5: Technology Tools Survey
    (
        'a5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID,
        'Technology Tools & Software Preferences',
        'Which tools do you use daily? What software would make your work easier? Share your technology preferences.',
        'published',
        'single_page',
        'SecDevOps',
        NULL,
        NOW() - INTERVAL '2 days',
        NOW() + INTERVAL '25 days',
        false,
        false,
        true,
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
        ARRAY['technology', 'tools', 'software'],
        false,
        false,
        NULL,
        NULL,
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '4 days'
    ),
    -- Survey 6: Team Collaboration Survey
    (
        'a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::UUID,
        'Team Collaboration & Communication Survey',
        'How effective is team collaboration? What communication channels work best? Help us improve team dynamics.',
        'draft',
        'multi_page',
        NULL,
        NULL,
        NULL,
        NULL,
        false,
        false,
        true,
        NULL,
        ARRAY['collaboration', 'communication', 'team'],
        false,
        false,
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '1 day'
    );

-- ============================================
-- STEP 2: Insert Survey Questions
-- ============================================

-- Questions for Survey 1: Employee Satisfaction Survey
INSERT INTO survey_questions (
    id,
    survey_id,
    question_text,
    question_type,
    options,
    is_required,
    placeholder,
    help_text,
    display_order,
    created_at
) VALUES
    -- Survey 1 Questions
    (
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'How satisfied are you with your current role at Digital Qatalyst?',
        'rating',
        '{"min": 1, "max": 5, "labels": ["Very Dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very Satisfied"]}'::jsonb,
        true,
        NULL,
        'Rate your overall satisfaction with your role',
        1,
        NOW() - INTERVAL '15 days'
    ),
    (
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
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
        'Select the option that best describes your work-life balance',
        2,
        NOW() - INTERVAL '15 days'
    ),
    (
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'What aspects of the company culture do you value most? (Select all that apply)',
        'multiple_choice',
        '[
            {"id": "transparency", "text": "Transparency and open communication", "order": 1},
            {"id": "innovation", "text": "Innovation and creativity", "order": 2},
            {"id": "diversity", "text": "Diversity and inclusion", "order": 3},
            {"id": "growth", "text": "Professional growth opportunities", "order": 4},
            {"id": "teamwork", "text": "Collaborative teamwork", "order": 5},
            {"id": "recognition", "text": "Recognition and appreciation", "order": 6}
        ]'::jsonb,
        false,
        NULL,
        'Select all that apply',
        3,
        NOW() - INTERVAL '15 days'
    ),
    (
        'b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'What suggestions do you have to improve employee satisfaction?',
        'textarea',
        NULL,
        false,
        'Share your thoughts and suggestions...',
        'Your feedback helps us create a better workplace',
        4,
        NOW() - INTERVAL '15 days'
    ),
    -- Survey 2 Questions: Remote Work Preferences
    (
        'b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID,
        'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'How many days per week do you prefer to work remotely?',
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
        NOW() - INTERVAL '8 days'
    ),
    (
        'b6eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::UUID,
        'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'Which productivity tools do you find most helpful? (Select all that apply)',
        'multiple_choice',
        '[
            {"id": "slack", "text": "Slack", "order": 1},
            {"id": "teams", "text": "Microsoft Teams", "order": 2},
            {"id": "zoom", "text": "Zoom", "order": 3},
            {"id": "jira", "text": "Jira", "order": 4},
            {"id": "notion", "text": "Notion", "order": 5},
            {"id": "trello", "text": "Trello", "order": 6},
            {"id": "asana", "text": "Asana", "order": 7}
        ]'::jsonb,
        false,
        NULL,
        NULL,
        2,
        NOW() - INTERVAL '8 days'
    ),
    (
        'b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'::UUID,
        'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'What challenges do you face with remote work?',
        'textarea',
        NULL,
        false,
        'Describe any challenges you experience...',
        NULL,
        3,
        NOW() - INTERVAL '8 days'
    ),
    -- Survey 3 Questions: Training & Development
    (
        'b8eebc99-9c0b-4ef8-bb6d-6bb9bd380a18'::UUID,
        'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'What areas would you like to develop? (Select all that apply)',
        'multiple_choice',
        '[
            {"id": "technical", "text": "Technical skills", "order": 1},
            {"id": "leadership", "text": "Leadership skills", "order": 2},
            {"id": "communication", "text": "Communication skills", "order": 3},
            {"id": "project-management", "text": "Project management", "order": 4},
            {"id": "data-analysis", "text": "Data analysis", "order": 5},
            {"id": "design", "text": "Design skills", "order": 6},
            {"id": "business", "text": "Business acumen", "order": 7}
        ]'::jsonb,
        true,
        NULL,
        NULL,
        1,
        NOW() - INTERVAL '5 days'
    ),
    (
        'b9eebc99-9c0b-4ef8-bb6d-6bb9bd380a19'::UUID,
        'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'What is your preferred learning format?',
        'single_choice',
        '[
            {"id": "online-course", "text": "Online courses", "order": 1},
            {"id": "workshop", "text": "In-person workshops", "order": 2},
            {"id": "mentorship", "text": "Mentorship programs", "order": 3},
            {"id": "conference", "text": "Conferences and seminars", "order": 4},
            {"id": "certification", "text": "Professional certifications", "order": 5}
        ]'::jsonb,
        true,
        NULL,
        NULL,
        2,
        NOW() - INTERVAL '5 days'
    ),
    -- Survey 4 Questions: Office Facilities
    (
        'ba1eebc9-9c0b-4ef8-bb6d-6bb9bd380a21'::UUID,
        'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'How would you rate the office facilities?',
        'rating',
        '{"min": 1, "max": 5, "labels": ["Poor", "Fair", "Good", "Very Good", "Excellent"]}'::jsonb,
        true,
        NULL,
        NULL,
        1,
        NOW() - INTERVAL '10 days'
    ),
    (
        'bb1eebc9-9c0b-4ef8-bb6d-6bb9bd380a22'::UUID,
        'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'Which amenities are most important to you? (Select all that apply)',
        'multiple_choice',
        '[
            {"id": "parking", "text": "Parking facilities", "order": 1},
            {"id": "cafeteria", "text": "Cafeteria/Kitchen", "order": 2},
            {"id": "gym", "text": "Gym/Fitness center", "order": 3},
            {"id": "meeting-rooms", "text": "Meeting rooms", "order": 4},
            {"id": "quiet-spaces", "text": "Quiet spaces", "order": 5},
            {"id": "recreation", "text": "Recreation areas", "order": 6}
        ]'::jsonb,
        false,
        NULL,
        NULL,
        2,
        NOW() - INTERVAL '10 days'
    ),
    (
        'bc1eebc9-9c0b-4ef8-bb6d-6bb9bd380a23'::UUID,
        'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'What improvements would you like to see in the office?',
        'textarea',
        NULL,
        false,
        'Share your suggestions...',
        NULL,
        3,
        NOW() - INTERVAL '10 days'
    ),
    -- Survey 5 Questions: Technology Tools
    (
        'bd1eebc9-9c0b-4ef8-bb6d-6bb9bd380a24'::UUID,
        'a5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID,
        'Which development tools do you use regularly? (Select all that apply)',
        'multiple_choice',
        '[
            {"id": "vscode", "text": "VS Code", "order": 1},
            {"id": "git", "text": "Git/GitHub", "order": 2},
            {"id": "docker", "text": "Docker", "order": 3},
            {"id": "kubernetes", "text": "Kubernetes", "order": 4},
            {"id": "aws", "text": "AWS", "order": 5},
            {"id": "azure", "text": "Azure", "order": 6},
            {"id": "gcp", "text": "Google Cloud", "order": 7}
        ]'::jsonb,
        true,
        NULL,
        NULL,
        1,
        NOW() - INTERVAL '4 days'
    ),
    (
        'be1eebc9-9c0b-4ef8-bb6d-6bb9bd380a25'::UUID,
        'a5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID,
        'What new tools or software would improve your productivity?',
        'textarea',
        NULL,
        false,
        'Suggest tools or software...',
        NULL,
        2,
        NOW() - INTERVAL '4 days'
    );

-- ============================================
-- STEP 3: Insert Survey Responses
-- ============================================

-- Responses for Survey 1: Employee Satisfaction Survey
INSERT INTO survey_responses (
    id,
    survey_id,
    question_id,
    response_number,
    response_value,
    response_values,
    response_text,
    created_at
) VALUES
    -- Alex's responses to Survey 1
    (
        'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        4,
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '9 days'
    ),
    (
        'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        NULL,
        'good',
        NULL,
        NULL,
        NOW() - INTERVAL '9 days'
    ),
    (
        'c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        NULL,
        NULL,
        ARRAY['transparency', 'innovation', 'growth'],
        NULL,
        NOW() - INTERVAL '9 days'
    ),
    -- Brianna's responses to Survey 1
    (
        'c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        5,
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '8 days'
    ),
    (
        'c5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        NULL,
        'excellent',
        NULL,
        NULL,
        NOW() - INTERVAL '8 days'
    ),
    (
        'c6eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        NULL,
        NULL,
        ARRAY['diversity', 'teamwork', 'recognition'],
        NULL,
        NOW() - INTERVAL '8 days'
    ),
    (
        'c7eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'::UUID,
        'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        NULL,
        NULL,
        NULL,
        'More flexible working hours and better recognition programs would improve satisfaction.',
        NOW() - INTERVAL '8 days'
    ),
    -- Casey's responses to Survey 2: Remote Work
    (
        'c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a18'::UUID,
        'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID,
        NULL,
        '5',
        NULL,
        NULL,
        NOW() - INTERVAL '4 days'
    ),
    (
        'c9eebc99-9c0b-4ef8-bb6d-6bb9bd380a19'::UUID,
        'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'b6eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::UUID,
        NULL,
        NULL,
        ARRAY['slack', 'zoom', 'notion'],
        NULL,
        NOW() - INTERVAL '4 days'
    ),
    -- Dylan's responses to Survey 3: Training & Development
    (
        'ca0eebc9-9c0b-4ef8-bb6d-6bb9bd380a20'::UUID,
        'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'b8eebc99-9c0b-4ef8-bb6d-6bb9bd380a18'::UUID,
        NULL,
        NULL,
        ARRAY['technical', 'leadership', 'project-management'],
        NULL,
        NOW() - INTERVAL '2 days'
    ),
    (
        'cb0eebc9-9c0b-4ef8-bb6d-6bb9bd380a21'::UUID,
        'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'b9eebc99-9c0b-4ef8-bb6d-6bb9bd380a19'::UUID,
        NULL,
        'certification',
        NULL,
        NULL,
        NOW() - INTERVAL '2 days'
    ),
    -- Elin's responses to Survey 4: Office Facilities
    (
        'cc0eebc9-9c0b-4ef8-bb6d-6bb9bd380a22'::UUID,
        'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'ba1eebc9-9c0b-4ef8-bb6d-6bb9bd380a21'::UUID,
        4,
        NULL,
        NULL,
        NULL,
        NOW() - INTERVAL '6 days'
    ),
    (
        'cd0eebc9-9c0b-4ef8-bb6d-6bb9bd380a23'::UUID,
        'a4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'bb1eebc9-9c0b-4ef8-bb6d-6bb9bd380a22'::UUID,
        NULL,
        NULL,
        ARRAY['cafeteria', 'meeting-rooms', 'quiet-spaces'],
        NULL,
        NOW() - INTERVAL '6 days'
    ),
    -- Frank's responses to Survey 5: Technology Tools
    (
        'ce0eebc9-9c0b-4ef8-bb6d-6bb9bd380a24'::UUID,
        'a5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID,
        'bd1eebc9-9c0b-4ef8-bb6d-6bb9bd380a24'::UUID,
        NULL,
        NULL,
        ARRAY['vscode', 'git', 'docker', 'aws'],
        NULL,
        NOW() - INTERVAL '1 day'
    ),
    (
        'cf0eebc9-9c0b-4ef8-bb6d-6bb9bd380a25'::UUID,
        'a5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID,
        'be1eebc9-9c0b-4ef8-bb6d-6bb9bd380a25'::UUID,
        NULL,
        NULL,
        NULL,
        'I would like to see better CI/CD tools and improved monitoring solutions.',
        NOW() - INTERVAL '1 day'
    );

-- ============================================
-- STEP 4: Insert Pulse Feedback
-- ============================================

INSERT INTO pulse_feedback (
    id,
    title,
    feedback_text,
    feedback_type,
    rating,
    category,
    tags,
    department,
    location_filter,
    status,
    is_anonymous,
    is_public,
    created_at
) VALUES
    -- Feedback 1: Suggestion
    (
        'd1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::UUID,
        'Improve Office Wi-Fi Speed',
        'The Wi-Fi in the Dubai office has been slow recently, especially during peak hours. Could we upgrade the network infrastructure?',
        'suggestion',
        3,
        'Facilities',
        ARRAY['wifi', 'infrastructure', 'office'],
        NULL,
        'Dubai',
        'open',
        false,
        true,
        NOW() - INTERVAL '12 days'
    ),
    -- Feedback 2: Praise
    (
        'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a12'::UUID,
        'Great Team Collaboration',
        'I wanted to express my appreciation for the excellent collaboration in the recent project. The team communication was outstanding!',
        'praise',
        5,
        'Team',
        ARRAY['collaboration', 'team', 'appreciation'],
        'Solutions',
        NULL,
        'resolved',
        false,
        true,
        NOW() - INTERVAL '10 days'
    ),
    -- Feedback 3: Feature Request
    (
        'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a13'::UUID,
        'Add Dark Mode to Internal Portal',
        'It would be great to have a dark mode option for the internal portal. Many of us work late hours and this would reduce eye strain.',
        'feature_request',
        4,
        'Technology',
        ARRAY['dark-mode', 'ui', 'accessibility'],
        'Products',
        NULL,
        'in_review',
        false,
        true,
        NOW() - INTERVAL '8 days'
    ),
    -- Feedback 4: Complaint
    (
        'd4eebc99-9c0b-4ef8-bb6d-6bb9bd380a14'::UUID,
        'Meeting Room Booking Issues',
        'It''s difficult to book meeting rooms. The booking system often shows rooms as available but they''re already occupied.',
        'complaint',
        2,
        'Facilities',
        ARRAY['meeting-rooms', 'booking', 'system'],
        NULL,
        'Dubai',
        'open',
        false,
        true,
        NOW() - INTERVAL '6 days'
    ),
    -- Feedback 5: Question
    (
        'd5eebc99-9c0b-4ef8-bb6d-6bb9bd380a15'::UUID,
        'Question About Health Insurance',
        'I have a question about the health insurance coverage. Are dental procedures covered under our current plan?',
        'question',
        NULL,
        'HR',
        ARRAY['health-insurance', 'benefits'],
        'HRA (People)',
        NULL,
        'resolved',
        false,
        false,
        NOW() - INTERVAL '5 days'
    ),
    -- Feedback 6: Bug Report
    (
        'd6eebc99-9c0b-4ef8-bb6d-6bb9bd380a16'::UUID,
        'Portal Login Issue',
        'I''m experiencing intermittent login issues with the internal portal. Sometimes I get logged out unexpectedly.',
        'bug_report',
        2,
        'Technology',
        ARRAY['login', 'bug', 'portal'],
        'SecDevOps',
        NULL,
        'in_review',
        false,
        true,
        NOW() - INTERVAL '3 days'
    ),
    -- Feedback 7: General Feedback
    (
        'd7eebc99-9c0b-4ef8-bb6d-6bb9bd380a17'::UUID,
        'Lunch Options Feedback',
        'The cafeteria lunch options have been great lately! The variety and quality have improved significantly.',
        'general',
        5,
        'Facilities',
        ARRAY['cafeteria', 'food', 'positive'],
        NULL,
        'Dubai',
        'open',
        false,
        true,
        NOW() - INTERVAL '2 days'
    ),
    -- Feedback 8: Suggestion (Anonymous)
    (
        'd8eebc99-9c0b-4ef8-bb6d-6bb9bd380a18'::UUID,
        'Flexible Working Hours',
        'Could we consider implementing more flexible working hours? This would help employees with different schedules and time zones.',
        'suggestion',
        4,
        'HR',
        ARRAY['flexible-hours', 'work-life-balance'],
        'HRA (People)',
        NULL,
        'open',
        true,
        true,
        NOW() - INTERVAL '1 day'
    );

-- ============================================
-- STEP 5: Update survey response counts
-- ============================================

-- Update total_responses and total_completions for surveys
-- Note: Without user_id, we count total responses and estimate completions based on response patterns
UPDATE pulse_surveys
SET total_responses = (
    SELECT COUNT(*)
    FROM survey_responses
    WHERE survey_responses.survey_id = pulse_surveys.id
),
total_completions = (
    SELECT COUNT(*)
    FROM (
        SELECT survey_id, COUNT(DISTINCT question_id) as answered_questions
        FROM survey_responses
        WHERE survey_id = pulse_surveys.id
        GROUP BY survey_id, DATE_TRUNC('hour', created_at)
        HAVING COUNT(DISTINCT question_id) >= (
            SELECT COUNT(*)
            FROM survey_questions
            WHERE survey_id = pulse_surveys.id
        )
    ) completed_responses
);

