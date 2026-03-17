SET QUOTED_IDENTIFIER ON;

-- Test Script for get_community_analytics Function
-- Run these queries in Supabase SQL Editor

-- ============================================
-- STEP 1: Get a real community ID
-- ============================================

-- List all communities with their IDs
SELECT 
  id,
  name,
  category,
  created_at
FROM communities
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- STEP 2: Test the function with a real UUID
-- ============================================

-- Replace 'YOUR_COMMUNITY_ID_HERE' with an actual UUID from step 1
-- Example:
SELECT * FROM get_community_analytics(
  'YOUR_COMMUNITY_ID_HERE'::UUID,  -- Replace with actual UUID
  30  -- days_back
);

-- ============================================
-- STEP 3: Alternative - Test with first community
-- ============================================

-- Get analytics for the first community (if you have one)
SELECT * FROM get_community_analytics(
  (SELECT id FROM communities LIMIT 1)::UUID,
  30
);

-- ============================================
-- STEP 4: Verify view_count column exists
-- ============================================

-- Check if view_count column exists in posts_v2
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'posts_v2' 
  AND column_name = 'view_count';

-- ============================================
-- STEP 5: Verify post_views table exists
-- ============================================

-- Check if post_views table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'post_views';

-- ============================================
-- STEP 6: Test posts_with_analytics view
-- ============================================

-- Test the view (should include view_count)
SELECT 
  id,
  title,
  view_count,
  comment_count,
  total_reactions
FROM posts_with_analytics
LIMIT 5;

-- ============================================
-- STEP 7: Verify emoji column in reactions
-- ============================================

-- Check if emoji column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'community_post_reactions_new' 
  AND column_name = 'emoji';
