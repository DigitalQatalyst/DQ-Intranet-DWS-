-- Seed File: Community Interactions
-- Description: Inserts sample data for community_posts, community_comments, and community_reactions
-- Uses existing seeded users only

-- ============================================
-- Seeded User IDs
-- ============================================
-- a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11  alex
-- b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12  brianna
-- c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13  casey
-- d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14  dylan
-- e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15  elin
-- f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16  frank

-- ============================================
-- STEP 1: Insert 15 Posts
-- ============================================

-- Note: Replace 'YOUR_COMMUNITY_ID_1' through 'YOUR_COMMUNITY_ID_5' with actual community UUIDs
-- You may need to query existing communities first or create them separately

INSERT INTO community_posts (id, community_id, user_id, content, media_url, created_at)
VALUES
  -- Post 1
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 0),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Welcome to our community! Excited to have everyone here. Let''s build something amazing together. What projects are you working on?',
    NULL,
    NOW() - INTERVAL '5 days'
  ),
  -- Post 2
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 0),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Just finished reading an amazing article about AI trends. The future of technology is fascinating! What are your thoughts on the latest developments?',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    NOW() - INTERVAL '4 days'
  ),
  -- Post 3
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 0),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'Sharing some code review best practices I''ve learned. Always be constructive, focus on the code not the person, and provide actionable feedback.',
    NULL,
    NOW() - INTERVAL '3 days'
  ),
  -- Post 4
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 1),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'Just completed a new design project! Would love to get feedback from the community. Check out the case study and let me know your thoughts.',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    NOW() - INTERVAL '6 days'
  ),
  -- Post 5
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 1),
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'Planning a color theory workshop next week. We''ll cover color harmony, contrast, and practical applications. Who''s interested in joining?',
    NULL,
    NOW() - INTERVAL '2 days'
  ),
  -- Post 6
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 1),
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'Here are 5 typography tips that changed my design game. Proper font pairing, hierarchy, and spacing can make all the difference in your designs.',
    NULL,
    NOW() - INTERVAL '7 days'
  ),
  -- Post 7
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 2),
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    'Let''s review our Q1 performance and discuss strategies for Q2. What worked well? What can we improve? Looking forward to your insights.',
    NULL,
    NOW() - INTERVAL '8 days'
  ),
  -- Post 8
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 2),
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
    'Recent market trends show interesting patterns in the tech sector. Sharing my analysis here - would love to hear your perspectives on this.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    NOW() - INTERVAL '9 days'
  ),
  -- Post 9
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 2),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Join us for a networking event next month! Great opportunity to meet industry professionals, share experiences, and build meaningful connections.',
    NULL,
    NOW() - INTERVAL '10 days'
  ),
  -- Post 10
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 3),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Starting a daily morning meditation group. All are welcome! We''ll meet virtually every morning at 7 AM for a 15-minute session.',
    NULL,
    NOW() - INTERVAL '11 days'
  ),
  -- Post 11
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 3),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'How do you maintain work-life balance? Sharing some strategies that work for me: time blocking, setting boundaries, and taking regular breaks.',
    NULL,
    NOW() - INTERVAL '12 days'
  ),
  -- Post 12
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 3),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'Found this amazing healthy recipe for a quinoa salad! It''s quick, nutritious, and delicious. Thought I''d share it with everyone.',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    NOW() - INTERVAL '13 days'
  ),
  -- Post 13
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 4),
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'What online courses have you taken recently? Looking for recommendations on data science and machine learning courses. Any suggestions?',
    NULL,
    NOW() - INTERVAL '14 days'
  ),
  -- Post 14
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 4),
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'Forming a study group for the upcoming AWS certification exam. We''ll meet weekly to review materials and practice. Interested?',
    NULL,
    NOW() - INTERVAL '15 days'
  ),
  -- Post 15
  (
    gen_random_uuid(),
    (SELECT id FROM communities LIMIT 1 OFFSET 4),
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    'Created a shared library of learning resources including books, articles, and video tutorials. Feel free to add your favorites!',
    NULL,
    NOW() - INTERVAL '16 days'
  );

-- ============================================
-- STEP 2: Insert 20 Comments
-- ============================================

INSERT INTO community_comments (id, post_id, user_id, content, created_at)
VALUES
  -- Comments for Post 1
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 0),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Great post! Looking forward to more discussions in this community.',
    NOW() - INTERVAL '4 days'
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 0),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'Thanks for starting this community! Excited to be here.',
    NOW() - INTERVAL '4 days'
  ),
  -- Comments for Post 2
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 1),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'AI is definitely changing everything. Exciting times ahead!',
    NOW() - INTERVAL '3 days'
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 1),
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'I''ve been experimenting with ChatGPT API. It''s incredibly powerful!',
    NOW() - INTERVAL '3 days'
  ),
  -- Comments for Post 3
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 2),
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'These are excellent tips. Code reviews are so important for quality.',
    NOW() - INTERVAL '2 days'
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 2),
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    'I''d add: always be constructive and kind in feedback. Great article!',
    NOW() - INTERVAL '2 days'
  ),
  -- Comments for Post 4
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 3),
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
    'Love your work! The color choices are perfect. Great job!',
    NOW() - INTERVAL '5 days'
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 3),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Could you share more about your design process? I''m curious!',
    NOW() - INTERVAL '5 days'
  ),
  -- Comments for Post 5
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 4),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'I''m interested! When exactly is the workshop happening?',
    NOW() - INTERVAL '1 day'
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 4),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'Count me in! Color theory is fascinating. Looking forward to it.',
    NOW() - INTERVAL '1 day'
  ),
  -- Comments for Post 6
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 5),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'Typography makes such a difference. These tips are really helpful!',
    NOW() - INTERVAL '6 days'
  ),
  -- Comments for Post 7
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 6),
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'Q1 was strong. Let''s keep the momentum going into Q2!',
    NOW() - INTERVAL '7 days'
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 6),
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'Agreed. What are our top priorities for Q2? Let''s discuss.',
    NOW() - INTERVAL '7 days'
  ),
  -- Comments for Post 8
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 7),
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    'Very insightful analysis. Thanks for sharing your perspective!',
    NOW() - INTERVAL '8 days'
  ),
  -- Comments for Post 9
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 8),
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
    'I''ll be there! Looking forward to networking with everyone.',
    NOW() - INTERVAL '9 days'
  ),
  -- Comments for Post 10
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 9),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Meditation has changed my life. Great initiative! I''ll join.',
    NOW() - INTERVAL '10 days'
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 9),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'What time do you usually meet? I''m in a different timezone.',
    NOW() - INTERVAL '10 days'
  ),
  -- Comments for Post 11
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 10),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'Work-life balance is so important. Thanks for sharing these tips!',
    NOW() - INTERVAL '11 days'
  ),
  -- Comments for Post 12
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 11),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'This recipe looks delicious! Can''t wait to try it this weekend.',
    NOW() - INTERVAL '12 days'
  ),
  -- Comments for Post 13
  (
    gen_random_uuid(),
    (SELECT id FROM community_posts LIMIT 1 OFFSET 12),
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'I recommend Coursera''s Machine Learning course! It''s excellent.',
    NOW() - INTERVAL '13 days'
  );

-- ============================================
-- STEP 3: Insert 20 Reactions
-- ============================================

INSERT INTO community_reactions (id, target_type, target_id, user_id, reaction_type, created_at)
VALUES
  -- Reactions on Posts (12 reactions)
  (
    gen_random_uuid(),
    'post',
    (SELECT id FROM community_posts LIMIT 1 OFFSET 0),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'like',
    NOW() - INTERVAL '4 days'
  ),
  (
    gen_random_uuid(),
    'post',
    (SELECT id FROM community_posts LIMIT 1 OFFSET 0),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'insightful',
    NOW() - INTERVAL '4 days'
  ),
  (
    gen_random_uuid(),
    'post',
    (SELECT id FROM community_posts LIMIT 1 OFFSET 1),
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'like',
    NOW() - INTERVAL '3 days'
  ),
  (
    gen_random_uuid(),
    'post',
    (SELECT id FROM community_posts LIMIT 1 OFFSET 1),
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'insightful',
    NOW() - INTERVAL '3 days'
  ),
  (
    gen_random_uuid(),
    'post',
    (SELECT id FROM community_posts LIMIT 1 OFFSET 2),
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    'like',
    NOW() - INTERVAL '2 days'
  ),
  (
    gen_random_uuid(),
    'post',
    (SELECT id FROM community_posts LIMIT 1 OFFSET 3),
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
    'like',
    NOW() - INTERVAL '5 days'
  ),
  (
    gen_random_uuid(),
    'post',
    (SELECT id FROM community_posts LIMIT 1 OFFSET 4),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'insightful',
    NOW() - INTERVAL '1 day'
  ),
  (
    gen_random_uuid(),
    'post',
    (SELECT id FROM community_posts LIMIT 1 OFFSET 5),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'like',
    NOW() - INTERVAL '6 days'
  ),
  (
    gen_random_uuid(),
    'post',
    (SELECT id FROM community_posts LIMIT 1 OFFSET 6),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'like',
    NOW() - INTERVAL '7 days'
  ),
  (
    gen_random_uuid(),
    'post',
    (SELECT id FROM community_posts LIMIT 1 OFFSET 7),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'insightful',
    NOW() - INTERVAL '8 days'
  ),
  (
    gen_random_uuid(),
    'post',
    (SELECT id FROM community_posts LIMIT 1 OFFSET 8),
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'like',
    NOW() - INTERVAL '9 days'
  ),
  (
    gen_random_uuid(),
    'post',
    (SELECT id FROM community_posts LIMIT 1 OFFSET 9),
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'like',
    NOW() - INTERVAL '10 days'
  ),
  -- Reactions on Comments (8 reactions)
  (
    gen_random_uuid(),
    'comment',
    (SELECT id FROM community_comments LIMIT 1 OFFSET 0),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'like',
    NOW() - INTERVAL '4 days'
  ),
  (
    gen_random_uuid(),
    'comment',
    (SELECT id FROM community_comments LIMIT 1 OFFSET 1),
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'like',
    NOW() - INTERVAL '3 days'
  ),
  (
    gen_random_uuid(),
    'comment',
    (SELECT id FROM community_comments LIMIT 1 OFFSET 2),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'insightful',
    NOW() - INTERVAL '3 days'
  ),
  (
    gen_random_uuid(),
    'comment',
    (SELECT id FROM community_comments LIMIT 1 OFFSET 3),
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'like',
    NOW() - INTERVAL '2 days'
  ),
  (
    gen_random_uuid(),
    'comment',
    (SELECT id FROM community_comments LIMIT 1 OFFSET 4),
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    'like',
    NOW() - INTERVAL '2 days'
  ),
  (
    gen_random_uuid(),
    'comment',
    (SELECT id FROM community_comments LIMIT 1 OFFSET 5),
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
    'insightful',
    NOW() - INTERVAL '5 days'
  ),
  (
    gen_random_uuid(),
    'comment',
    (SELECT id FROM community_comments LIMIT 1 OFFSET 6),
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
    'like',
    NOW() - INTERVAL '1 day'
  ),
  (
    gen_random_uuid(),
    'comment',
    (SELECT id FROM community_comments LIMIT 1 OFFSET 7),
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
    'like',
    NOW() - INTERVAL '1 day'
  );

