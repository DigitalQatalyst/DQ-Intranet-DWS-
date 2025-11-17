-- =====================================================
-- Pulse Marketplace - Seed Data
-- =====================================================
-- This file inserts sample Pulse items (surveys, polls, feedback)
-- converted from the original mock data
-- =====================================================

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE pulse_responses CASCADE;
-- TRUNCATE TABLE pulse_comments CASCADE;
-- TRUNCATE TABLE pulse_likes CASCADE;
-- TRUNCATE TABLE pulse_items CASCADE;

-- =====================================================
-- 1. Employee Satisfaction Survey (Survey)
-- =====================================================

INSERT INTO pulse_items (
    id,
    title,
    description,
    type,
    status,
    department,
    location_filter,
    questions,
    survey_type,
    anonymous,
    allow_comments,
    visibility,
    tags,
    image_url,
    created_by_name,
    total_responses,
    total_views,
    total_likes,
    published_at,
    closes_at,
    is_featured,
    is_pinned,
    created_at,
    updated_at
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    'Employee Satisfaction Survey',
    'We''d love to hear your thoughts on your workplace experience. Help us improve by sharing your feedback in this quick survey.',
    'survey',
    'published',
    'HRA (People)',
    'Remote',
    '[
        {
            "id": "q1",
            "question": "How satisfied are you with your current role?",
            "type": "scale",
            "scale_min": 1,
            "scale_max": 5
        },
        {
            "id": "q2",
            "question": "What aspects of your job do you enjoy most?",
            "type": "text"
        },
        {
            "id": "q3",
            "question": "How likely are you to recommend this company to a friend?",
            "type": "scale",
            "scale_min": 1,
            "scale_max": 10
        }
    ]'::jsonb,
    'single_page',
    false,
    true,
    'public',
    ARRAY['Employee', 'Feedback'],
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'HR Team',
    320,
    500,
    45,
    '2025-11-14 00:00:00+00'::timestamptz,
    '2025-11-21 23:59:59+00'::timestamptz,
    false,
    false,
    '2025-11-14 00:00:00+00'::timestamptz,
    '2025-11-14 00:00:00+00'::timestamptz
);

-- =====================================================
-- 2. Product Feedback Poll (Poll)
-- =====================================================

INSERT INTO pulse_items (
    id,
    title,
    description,
    type,
    status,
    department,
    location_filter,
    question,
    options,
    allow_multiple,
    anonymous,
    allow_comments,
    visibility,
    tags,
    image_url,
    created_by_name,
    total_responses,
    total_views,
    total_likes,
    published_at,
    closes_at,
    is_featured,
    is_pinned,
    created_at,
    updated_at
) VALUES (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901'::uuid,
    'Product Feedback Poll',
    'Your feedback helps us shape the next version of our product. Please take a few moments to share your thoughts!',
    'poll',
    'published',
    'Products',
    'Dubai',
    'Which feature would you like to see in the next product update?',
    '[
        {
            "id": "opt1",
            "text": "Enhanced Security Features",
            "votes": 85
        },
        {
            "id": "opt2",
            "text": "Improved User Interface",
            "votes": 120
        },
        {
            "id": "opt3",
            "text": "Mobile App Support",
            "votes": 110
        }
    ]'::jsonb,
    false,
    false,
    true,
    'public',
    ARRAY['Product', 'Feedback'],
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'Product Team',
    315,
    450,
    67,
    '2025-11-15 00:00:00+00'::timestamptz,
    '2025-11-20 23:59:59+00'::timestamptz,
    true,
    false,
    '2025-11-15 00:00:00+00'::timestamptz,
    '2025-11-15 00:00:00+00'::timestamptz
);

-- =====================================================
-- 3. Event Feedback: Digital Qatalyst Town Hall (Feedback)
-- =====================================================

INSERT INTO pulse_items (
    id,
    title,
    description,
    type,
    status,
    department,
    location_filter,
    questions,
    feedback_type,
    anonymous,
    allow_comments,
    visibility,
    tags,
    image_url,
    created_by_name,
    total_responses,
    total_views,
    total_likes,
    published_at,
    closes_at,
    is_featured,
    is_pinned,
    created_at,
    updated_at
) VALUES (
    'c3d4e5f6-a7b8-9012-cdef-123456789012'::uuid,
    'Event Feedback: Digital Qatalyst Town Hall',
    'We''d love to hear your thoughts on the Digital Qatalyst Town Hall. Your feedback helps us improve future events!',
    'feedback',
    'published',
    'Stories',
    'Nairobi',
    '[
        {
            "id": "f1",
            "question": "What did you like most about the event?",
            "type": "text"
        },
        {
            "id": "f2",
            "question": "What could be improved?",
            "type": "text"
        },
        {
            "id": "f3",
            "question": "Rate your overall experience (1-5)",
            "type": "scale",
            "scale_min": 1,
            "scale_max": 5
        }
    ]'::jsonb,
    'general',
    false,
    true,
    'public',
    ARRAY['Event', 'Feedback'],
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'Events Team',
    450,
    600,
    89,
    '2025-11-16 00:00:00+00'::timestamptz,
    '2025-11-19 23:59:59+00'::timestamptz,
    false,
    false,
    '2025-11-16 00:00:00+00'::timestamptz,
    '2025-11-16 00:00:00+00'::timestamptz
);

-- =====================================================
-- 4. Customer Satisfaction Survey (Survey)
-- =====================================================

INSERT INTO pulse_items (
    id,
    title,
    description,
    type,
    status,
    department,
    location_filter,
    questions,
    survey_type,
    anonymous,
    allow_comments,
    visibility,
    tags,
    image_url,
    created_by_name,
    total_responses,
    total_views,
    total_likes,
    published_at,
    closes_at,
    is_featured,
    is_pinned,
    created_at,
    updated_at
) VALUES (
    'd4e5f6a7-b8c9-0123-def0-234567890123'::uuid,
    'Customer Satisfaction Survey',
    'Help us improve your customer experience! Share your thoughts and help us serve you better.',
    'survey',
    'published',
    'Solutions',
    'Riyadh',
    '[
        {
            "id": "q1",
            "question": "How satisfied are you with our service?",
            "type": "scale",
            "scale_min": 1,
            "scale_max": 5
        },
        {
            "id": "q2",
            "question": "What features do you find most valuable?",
            "type": "text"
        },
        {
            "id": "q3",
            "question": "How can we improve your experience?",
            "type": "text"
        },
        {
            "id": "q4",
            "question": "Would you recommend our services to others?",
            "type": "scale",
            "scale_min": 1,
            "scale_max": 10
        }
    ]'::jsonb,
    'single_page',
    false,
    true,
    'public',
    ARRAY['Customer', 'Feedback', 'Satisfaction'],
    'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'Customer Success Team',
    100,
    250,
    12,
    '2025-11-18 00:00:00+00'::timestamptz,
    '2025-11-30 23:59:59+00'::timestamptz,
    false,
    false,
    '2025-11-18 00:00:00+00'::timestamptz,
    '2025-11-18 00:00:00+00'::timestamptz
);

-- =====================================================
-- 5. Marketing Campaign Feedback (Survey)
-- =====================================================

INSERT INTO pulse_items (
    id,
    title,
    description,
    type,
    status,
    department,
    location_filter,
    questions,
    survey_type,
    anonymous,
    allow_comments,
    visibility,
    tags,
    image_url,
    created_by_name,
    total_responses,
    total_views,
    total_likes,
    published_at,
    closes_at,
    is_featured,
    is_pinned,
    created_at,
    updated_at
) VALUES (
    'e5f6a7b8-c9d0-1234-ef01-345678901234'::uuid,
    'Marketing Campaign Feedback',
    'We''d like your input on our latest marketing campaign. Let us know how we can improve!',
    'survey',
    'published',
    'Intelligence',
    'Remote',
    '[
        {
            "id": "q1",
            "question": "How effective was the marketing campaign?",
            "type": "scale",
            "scale_min": 1,
            "scale_max": 5
        },
        {
            "id": "q2",
            "question": "What did you like about the campaign?",
            "type": "text"
        },
        {
            "id": "q3",
            "question": "What could be improved?",
            "type": "text"
        },
        {
            "id": "q4",
            "question": "Did the campaign influence your decision?",
            "type": "scale",
            "scale_min": 1,
            "scale_max": 5
        }
    ]'::jsonb,
    'single_page',
    false,
    true,
    'public',
    ARRAY['Marketing', 'Feedback', 'Campaign'],
    'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    'Marketing Team',
    180,
    320,
    28,
    '2025-11-19 00:00:00+00'::timestamptz,
    '2025-11-25 23:59:59+00'::timestamptz,
    false,
    false,
    '2025-11-19 00:00:00+00'::timestamptz,
    '2025-11-19 00:00:00+00'::timestamptz
);

-- =====================================================
-- Verification Query
-- =====================================================
-- Run this to verify all items were inserted correctly:
-- SELECT id, title, type, status, department, location_filter, published_at 
-- FROM pulse_items 
-- ORDER BY published_at DESC;
