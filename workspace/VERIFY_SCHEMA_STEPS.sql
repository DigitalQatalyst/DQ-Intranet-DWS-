-- ============================================
-- VERIFICATION STEPS FOR VIVA ENGAGE SCHEMA
-- Run these in Supabase SQL Editor, one at a time
-- ============================================

-- ============================================
-- STEP 1: Get a Real Community ID
-- ============================================
-- Run this first to see your actual community IDs

SELECT 
  id,
  name,
  category,
  created_at
FROM communities
ORDER BY created_at DESC
LIMIT 10;

-- Copy one of the IDs from the results above
-- Example UUID format: '123e4567-e89b-12d3-a456-426614174000'

-- ============================================
-- STEP 2: Test Analytics Function with Real UUID
-- ============================================
-- Replace 'YOUR_COMMUNITY_ID_HERE' with an actual UUID from Step 1

SELECT * FROM get_community_analytics(
  'YOUR_COMMUNITY_ID_HERE'::UUID,  -- ⚠️ Replace with real UUID from Step 1
  30  -- days_back
);

-- ============================================
-- ALTERNATIVE: Test with First Community (Auto)
-- ============================================
-- This automatically uses the first community ID

SELECT * FROM get_community_analytics(
  (SELECT id FROM communities LIMIT 1)::UUID,
  30
);

-- ============================================
-- STEP 3: Verify view_count Column Exists
-- ============================================

SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'posts_v2' 
  AND column_name = 'view_count';

-- Expected result: Should show view_count with data_type = 'integer'

-- ============================================
-- STEP 4: Verify post_views Table Exists
-- ============================================

SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'post_views'
ORDER BY ordinal_position;

-- Expected result: Should show columns: id, post_id, user_id, created_at

-- ============================================
-- STEP 5: Verify emoji Column in Reactions
-- ============================================

SELECT 
  column_name, 
  data_type
FROM information_schema.columns
WHERE table_name = 'community_post_reactions_new' 
  AND column_name = 'emoji';

-- Expected result: Should show emoji with data_type = 'text'

-- ============================================
-- STEP 6: Test posts_with_analytics View
-- ============================================

SELECT 
  id,
  title,
  view_count,
  comment_count,
  total_reactions,
  unique_view_count
FROM posts_with_analytics
LIMIT 5;

-- Expected result: Should show posts with aggregated analytics

-- ============================================
-- STEP 7: Check if Functions Exist
-- ============================================

SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('get_post_analytics', 'get_community_analytics', 'track_post_view')
ORDER BY routine_name;

-- Expected result: Should show all three functions

-- ============================================
-- STEP 8: Test Single Post Analytics
-- ============================================
-- First get a post ID

SELECT id, title FROM posts_v2 LIMIT 1;

-- Then test the function (replace with actual post ID)

SELECT * FROM get_post_analytics(
  (SELECT id FROM posts_v2 LIMIT 1)::UUID
);

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If get_community_analytics doesn't exist, check if migration ran:
SELECT * FROM supabase_migrations.schema_migrations 
ORDER BY version DESC 
LIMIT 5;

-- If view_count column doesn't exist, run this:
-- (Only if migration didn't run)
-- ALTER TABLE posts_v2 ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;

