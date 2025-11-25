-- Seed File: Add Dummy Interactions to New Tables
-- Description: Inserts sample comments and reactions for testing
-- Usage: Run this file directly in your Supabase SQL editor or via psql
-- Date: 2025-01-10

-- ============================================
-- STEP 1: Insert dummy comments
-- ============================================

-- Insert dummy comments for existing posts
-- This will add comments from existing users to existing posts
WITH comment_data AS (
  SELECT 
    p.id as post_id,
    u.id as user_id,
    (ARRAY[
      'Great post! Thanks for sharing this.',
      'This is really helpful. I''ll try this out!',
      'Interesting perspective. I have a similar experience.',
      'Could you provide more details on this?',
      'Thanks for the insights!',
      'Very informative. Bookmarking this for later.',
      'I agree with your points. Well said!',
      'This helped me understand the topic better.',
      'Excellent work! Keep it up.',
      'Looking forward to more content like this.'
    ])[1 + (row_number() OVER () % 10)] as content
  FROM posts_v2 p
  CROSS JOIN LATERAL (
    SELECT id FROM auth.users 
    ORDER BY created_at DESC 
    LIMIT 3
  ) u
  WHERE NOT EXISTS (
    SELECT 1 FROM community_post_comments_new c 
    WHERE c.post_id = p.id AND c.user_id = u.id
  )
  LIMIT 20
)
INSERT INTO community_post_comments_new (post_id, user_id, content, status)
SELECT post_id, user_id, content, 'active'
FROM comment_data
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 2: Insert dummy reactions
-- ============================================

-- Insert helpful reactions
INSERT INTO community_post_reactions_new (post_id, user_id, reaction_type)
SELECT 
  p.id as post_id,
  u.id as user_id,
  'helpful' as reaction_type
FROM posts_v2 p
CROSS JOIN LATERAL (
  SELECT id FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 3
) u
WHERE NOT EXISTS (
  SELECT 1 FROM community_post_reactions_new r 
  WHERE r.post_id = p.id AND r.user_id = u.id AND r.reaction_type = 'helpful'
)
LIMIT 10
ON CONFLICT DO NOTHING;

-- Insert insightful reactions
INSERT INTO community_post_reactions_new (post_id, user_id, reaction_type)
SELECT 
  p.id as post_id,
  u.id as user_id,
  'insightful' as reaction_type
FROM posts_v2 p
CROSS JOIN LATERAL (
  SELECT id FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 3
) u
WHERE NOT EXISTS (
  SELECT 1 FROM community_post_reactions_new r 
  WHERE r.post_id = p.id AND r.user_id = u.id AND r.reaction_type = 'insightful'
)
LIMIT 8
ON CONFLICT DO NOTHING;

-- Insert like reactions
INSERT INTO community_post_reactions_new (post_id, user_id, reaction_type)
SELECT 
  p.id as post_id,
  u.id as user_id,
  'like' as reaction_type
FROM posts_v2 p
CROSS JOIN LATERAL (
  SELECT id FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 3
) u
WHERE NOT EXISTS (
  SELECT 1 FROM community_post_reactions_new r 
  WHERE r.post_id = p.id AND r.user_id = u.id AND r.reaction_type = 'like'
)
LIMIT 12
ON CONFLICT DO NOTHING;

-- ============================================
-- STEP 3: Ensure Test User has interactions
-- ============================================

-- Add comments from Test User if they exist
INSERT INTO community_post_comments_new (post_id, user_id, content, status)
SELECT 
  p.id as post_id,
  au.id as user_id,
  'Test User comment: This is a test comment to verify the interaction system is working correctly.' as content,
  'active' as status
FROM posts_v2 p
CROSS JOIN auth.users au
WHERE au.email = 'testuser@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM community_post_comments_new c 
    WHERE c.post_id = p.id AND c.user_id = au.id
  )
LIMIT 5
ON CONFLICT DO NOTHING;

-- Add helpful reactions from Test User
INSERT INTO community_post_reactions_new (post_id, user_id, reaction_type)
SELECT 
  p.id as post_id,
  au.id as user_id,
  'helpful' as reaction_type
FROM posts_v2 p
CROSS JOIN auth.users au
WHERE au.email = 'testuser@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM community_post_reactions_new r 
    WHERE r.post_id = p.id AND r.user_id = au.id AND r.reaction_type = 'helpful'
  )
LIMIT 3
ON CONFLICT DO NOTHING;

-- Add insightful reactions from Test User
INSERT INTO community_post_reactions_new (post_id, user_id, reaction_type)
SELECT 
  p.id as post_id,
  au.id as user_id,
  'insightful' as reaction_type
FROM posts_v2 p
CROSS JOIN auth.users au
WHERE au.email = 'testuser@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM community_post_reactions_new r 
    WHERE r.post_id = p.id AND r.user_id = au.id AND r.reaction_type = 'insightful'
  )
LIMIT 2
ON CONFLICT DO NOTHING;

-- Add like reactions from Test User
INSERT INTO community_post_reactions_new (post_id, user_id, reaction_type)
SELECT 
  p.id as post_id,
  au.id as user_id,
  'like' as reaction_type
FROM posts_v2 p
CROSS JOIN auth.users au
WHERE au.email = 'testuser@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM community_post_reactions_new r 
    WHERE r.post_id = p.id AND r.user_id = au.id AND r.reaction_type = 'like'
  )
LIMIT 4
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES (Optional - run to check results)
-- ============================================

-- Check comment count
-- SELECT COUNT(*) as total_comments FROM community_post_comments_new;

-- Check reaction count by type
-- SELECT reaction_type, COUNT(*) as count 
-- FROM community_post_reactions_new 
-- GROUP BY reaction_type;

-- Check Test User interactions
-- SELECT 
--   'comments' as type, COUNT(*) as count
-- FROM community_post_comments_new c
-- JOIN auth.users u ON c.user_id = u.id
-- WHERE u.email = 'testuser@example.com'
-- UNION ALL
-- SELECT 
--   'reactions' as type, COUNT(*) as count
-- FROM community_post_reactions_new r
-- JOIN auth.users u ON r.user_id = u.id
-- WHERE u.email = 'testuser@example.com';

