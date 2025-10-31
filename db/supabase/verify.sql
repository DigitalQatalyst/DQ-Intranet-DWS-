-- =====================================================
-- Verification Script
-- =====================================================
-- Run this after setup to verify everything is working
-- =====================================================

-- Check if all tables exist
SELECT 
    'Tables Check' as test_category,
    CASE 
        WHEN COUNT(*) >= 20 THEN '✓ PASS'
        ELSE '✗ FAIL - Missing tables'
    END as status,
    COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE';

-- Check if views exist
SELECT 
    'Views Check' as test_category,
    CASE 
        WHEN COUNT(*) >= 4 THEN '✓ PASS'
        ELSE '✗ FAIL - Missing views'
    END as status,
    COUNT(*) as view_count
FROM information_schema.views 
WHERE table_schema = 'public';

-- Check if functions exist
SELECT 
    'Functions Check' as test_category,
    CASE 
        WHEN COUNT(*) >= 5 THEN '✓ PASS'
        ELSE '✗ FAIL - Missing functions'
    END as status,
    COUNT(*) as function_count
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';

-- Check if data was seeded
SELECT 
    'Data Seeding Check' as test_category,
    CASE 
        WHEN (SELECT COUNT(*) FROM users_local) >= 8
         AND (SELECT COUNT(*) FROM communities) >= 6
         AND (SELECT COUNT(*) FROM posts) >= 10
        THEN '✓ PASS'
        ELSE '✗ FAIL - Incomplete seed data'
    END as status,
    json_build_object(
        'users', (SELECT COUNT(*) FROM users_local),
        'communities', (SELECT COUNT(*) FROM communities),
        'posts', (SELECT COUNT(*) FROM posts),
        'memberships', (SELECT COUNT(*) FROM memberships),
        'comments', (SELECT COUNT(*) FROM comments),
        'reactions', (SELECT COUNT(*) FROM reactions)
    ) as counts;

-- Check if RLS is enabled
SELECT 
    'RLS Check' as test_category,
    CASE 
        WHEN COUNT(*) >= 3 THEN '✓ PASS'
        ELSE '⚠ WARNING - RLS not enabled on all tables'
    END as status,
    COUNT(*) as tables_with_rls
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;

-- Check if indexes exist
SELECT 
    'Indexes Check' as test_category,
    CASE 
        WHEN COUNT(*) >= 8 THEN '✓ PASS'
        ELSE '⚠ WARNING - Some indexes may be missing'
    END as status,
    COUNT(*) as index_count
FROM pg_indexes 
WHERE schemaname = 'public';

-- Test get_feed function
SELECT 
    'get_feed() Function Test' as test_category,
    CASE 
        WHEN COUNT(*) > 0 THEN '✓ PASS'
        ELSE '✗ FAIL - get_feed() not working'
    END as status,
    COUNT(*) as posts_returned
FROM get_feed('global', 'recent', NULL, 10, 0);

-- Test communities_with_counts view
SELECT 
    'communities_with_counts View Test' as test_category,
    CASE 
        WHEN COUNT(*) >= 6 THEN '✓ PASS'
        ELSE '✗ FAIL - View not working'
    END as status,
    COUNT(*) as communities_count
FROM communities_with_counts;

-- Detailed data summary
SELECT 
    '=== DATA SUMMARY ===' as section,
    '' as details
UNION ALL
SELECT 
    'Users',
    COUNT(*)::text || ' users created'
FROM users_local
UNION ALL
SELECT 
    'Communities',
    COUNT(*)::text || ' communities created'
FROM communities
UNION ALL
SELECT 
    'Posts',
    COUNT(*)::text || ' posts created'
FROM posts
UNION ALL
SELECT 
    'Memberships',
    COUNT(*)::text || ' memberships created'
FROM memberships
UNION ALL
SELECT 
    'Comments',
    COUNT(*)::text || ' comments created'
FROM comments
UNION ALL
SELECT 
    'Reactions',
    COUNT(*)::text || ' reactions created'
FROM reactions;

-- Sample data preview
SELECT 
    '=== SAMPLE COMMUNITIES ===' as section,
    '' as details
UNION ALL
SELECT 
    name,
    member_count::text || ' members'
FROM communities_with_counts
ORDER BY member_count DESC
LIMIT 5;

-- Recent posts preview
SELECT 
    '=== RECENT POSTS ===' as section,
    '' as details
UNION ALL
SELECT 
    title,
    'by ' || author_username || ' in ' || community_name
FROM posts_with_reactions
ORDER BY created_at DESC
LIMIT 5;

-- Final status
SELECT 
    '=== SETUP STATUS ===' as section,
    CASE 
        WHEN (SELECT COUNT(*) FROM users_local) >= 8
         AND (SELECT COUNT(*) FROM communities) >= 6
         AND (SELECT COUNT(*) FROM posts) >= 10
         AND EXISTS (SELECT 1 FROM get_feed('global', 'recent', NULL, 1, 0))
        THEN '✓✓✓ ALL CHECKS PASSED - Setup Complete! ✓✓✓'
        ELSE '✗✗✗ SOME CHECKS FAILED - Review errors above ✗✗✗'
    END as status;
