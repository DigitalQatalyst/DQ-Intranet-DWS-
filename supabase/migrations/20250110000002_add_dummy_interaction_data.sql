-- Migration: Add dummy content to new interaction tables
-- Description: Inserts sample comments and reactions for testing
-- Date: 2025-01-10

-- ============================================
-- STEP 1: Insert dummy comments
-- ============================================

-- Insert dummy comments for existing posts
-- Get posts and users, create comments for them
DO $$
DECLARE
  post_record RECORD;
  user_record RECORD;
  comment_texts TEXT[] := ARRAY[
    'Great post! Thanks for sharing this.',
    'This is really helpful. I''ll try this out!',
    'Interesting perspective. I have a similar experience.',
    'Could you provide more details on this?',
    'Thanks for the insights!',
    'Very informative. Bookmarking this for later.',
    'I agree with your points. Well said!',
    'This helped me understand the topic better.'
  ];
  comment_count INTEGER := 0;
BEGIN
  -- Loop through posts
  FOR post_record IN SELECT id FROM posts_v2 ORDER BY created_at DESC LIMIT 10 LOOP
    -- Loop through users
    FOR user_record IN SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 3 LOOP
      -- Insert a comment if we haven't reached the limit
      IF comment_count < 20 THEN
        INSERT INTO community_post_comments_new (post_id, user_id, content, status)
        VALUES (
          post_record.id,
          user_record.id,
          comment_texts[1 + (comment_count % array_length(comment_texts, 1))],
          'active'
        )
        ON CONFLICT DO NOTHING;
        
        comment_count := comment_count + 1;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- STEP 2: Insert dummy reactions
-- ============================================

DO $$
DECLARE
  post_record RECORD;
  user_record RECORD;
  reaction_types TEXT[] := ARRAY['helpful', 'insightful', 'like'];
  reaction_type TEXT;
  reaction_count INTEGER := 0;
BEGIN
  -- Loop through posts
  FOR post_record IN SELECT id FROM posts_v2 ORDER BY created_at DESC LIMIT 10 LOOP
    -- Loop through users
    FOR user_record IN SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 3 LOOP
      -- Loop through reaction types
      FOREACH reaction_type IN ARRAY reaction_types LOOP
        -- Insert reactions (up to 30 total)
        IF reaction_count < 30 THEN
          INSERT INTO community_post_reactions_new (post_id, user_id, reaction_type)
          VALUES (post_record.id, user_record.id, reaction_type)
          ON CONFLICT DO NOTHING;
          
          reaction_count := reaction_count + 1;
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- ============================================
-- STEP 3: Ensure Test User has interactions
-- ============================================

DO $$
DECLARE
  test_user_id UUID;
  post_record RECORD;
  comment_count INTEGER := 0;
  reaction_count INTEGER := 0;
BEGIN
  -- Find Test User
  SELECT id INTO test_user_id 
  FROM auth.users 
  WHERE email = 'testuser@example.com' 
  LIMIT 1;
  
  -- If Test User exists, add comments and reactions
  IF test_user_id IS NOT NULL THEN
    -- Add comments from Test User
    FOR post_record IN SELECT id FROM posts_v2 ORDER BY created_at DESC LIMIT 5 LOOP
      IF comment_count < 5 THEN
        INSERT INTO community_post_comments_new (post_id, user_id, content, status)
        VALUES (
          post_record.id,
          test_user_id,
          'Test User comment: This is a test comment to verify the interaction system is working correctly.',
          'active'
        )
        ON CONFLICT DO NOTHING;
        
        comment_count := comment_count + 1;
      END IF;
    END LOOP;
    
    -- Add reactions from Test User
    FOR post_record IN SELECT id FROM posts_v2 ORDER BY created_at DESC LIMIT 5 LOOP
      -- Add helpful reaction
      IF reaction_count < 3 THEN
        INSERT INTO community_post_reactions_new (post_id, user_id, reaction_type)
        VALUES (post_record.id, test_user_id, 'helpful')
        ON CONFLICT DO NOTHING;
        reaction_count := reaction_count + 1;
      END IF;
      
      -- Add insightful reaction
      IF reaction_count < 5 THEN
        INSERT INTO community_post_reactions_new (post_id, user_id, reaction_type)
        VALUES (post_record.id, test_user_id, 'insightful')
        ON CONFLICT DO NOTHING;
        reaction_count := reaction_count + 1;
      END IF;
      
      -- Add like reaction
      IF reaction_count < 9 THEN
        INSERT INTO community_post_reactions_new (post_id, user_id, reaction_type)
        VALUES (post_record.id, test_user_id, 'like')
        ON CONFLICT DO NOTHING;
        reaction_count := reaction_count + 1;
      END IF;
    END LOOP;
  END IF;
END $$;

