-- =====================================================
-- AUDIT QUERIES FOR EVENTS PERMISSIONS
-- =====================================================
-- Run these queries in your Supabase SQL Editor to diagnose permission issues

-- 1. Check if RLS is enabled on posts table
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'posts';

-- 2. List all RLS policies on posts table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'posts'
ORDER BY policyname;

-- 3. Check if the "Active posts are viewable by everyone" policy exists
SELECT 
    policyname,
    cmd as command,
    qual as using_expression
FROM pg_policies
WHERE tablename = 'posts'
    AND policyname LIKE '%Active posts%'
    OR policyname LIKE '%viewable by everyone%';

-- 4. Check table permissions for anon role
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants
WHERE table_name = 'posts'
    AND grantee = 'anon'
ORDER BY privilege_type;

-- 5. Check table permissions for authenticated role
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants
WHERE table_name = 'posts'
    AND grantee = 'authenticated'
ORDER BY privilege_type;

-- 6. Check if events table exists and its structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;

-- 7. Check if upcoming_events view exists
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_name = 'upcoming_events';

-- 8. Check RLS on events table (if it exists)
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'events';

-- 9. List all RLS policies on events table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'events'
ORDER BY policyname;

-- 10. Test query: Try to select from posts table as anon user
-- (This will show what the anon role can actually see)
-- Note: Run this in Supabase SQL Editor with "Run as anon" option
SELECT 
    id,
    title,
    post_type,
    status,
    event_date,
    event_location
FROM posts
WHERE post_type = 'event'
    AND status = 'active'
    AND event_date IS NOT NULL
LIMIT 5;

-- 11. Check if there are any events in posts table
SELECT 
    COUNT(*) as total_events,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_events,
    COUNT(CASE WHEN event_date IS NOT NULL THEN 1 END) as events_with_date,
    COUNT(CASE WHEN status = 'active' AND event_date IS NOT NULL THEN 1 END) as active_events_with_date
FROM posts
WHERE post_type = 'event';

-- 12. Check communities table permissions (needed for joins)
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants
WHERE table_name = 'communities'
    AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

-- 13. Check RLS on communities table
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'communities';

-- 14. List all RLS policies on communities table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'communities'
ORDER BY policyname;

-- =====================================================
-- FIX QUERIES (Run these to fix permission issues)
-- =====================================================

-- Fix 1: Ensure RLS is enabled on posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Fix 2: Create/Replace the "Active posts are viewable by everyone" policy
DROP POLICY IF EXISTS "Active posts are viewable by everyone" ON posts;

CREATE POLICY "Active posts are viewable by everyone"
    ON posts FOR SELECT
    USING (status = 'active');

-- Fix 3: Grant SELECT permission to anon role (if needed)
GRANT SELECT ON posts TO anon;
GRANT SELECT ON posts TO authenticated;

-- Fix 4: Ensure RLS is enabled on communities table
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

-- Fix 5: Create/Replace the "Communities are viewable by everyone" policy
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON communities;

CREATE POLICY "Communities are viewable by everyone"
    ON communities FOR SELECT
    USING (true);

-- Fix 6: Grant SELECT permission to anon role on communities
GRANT SELECT ON communities TO anon;
GRANT SELECT ON communities TO authenticated;

-- Fix 7: If events table exists, ensure it's accessible
-- First check if events table has RLS
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'events') THEN
        ALTER TABLE events ENABLE ROW LEVEL SECURITY;
        
        -- Create policy for events table
        DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
        
        CREATE POLICY "Events are viewable by everyone"
            ON events FOR SELECT
            USING (true);
        
        GRANT SELECT ON events TO anon;
        GRANT SELECT ON events TO authenticated;
    END IF;
END $$;

-- Fix 8: Create a view for upcoming events (optional, if you want a dedicated view)
-- This creates a view that combines events from both events table and posts table
CREATE OR REPLACE VIEW upcoming_events AS
SELECT 
    id,
    title,
    description,
    event_date::timestamp as start_time,
    (event_date::timestamp + INTERVAL '1 hour')::timestamp as end_time,
    'General' as category,
    COALESCE(event_location, 'TBA') as location,
    NULL::text as image_url,
    NULL::text as meeting_link,
    false as is_virtual,
    false as is_all_day,
    NULL::integer as max_attendees,
    false as registration_required,
    NULL::timestamp as registration_deadline,
    created_by as organizer_id,
    NULL::text as organizer_name,
    NULL::text as organizer_email,
    status,
    false as is_featured,
    tags,
    created_at,
    updated_at
FROM posts
WHERE post_type = 'event'
    AND status = 'active'
    AND event_date IS NOT NULL
    AND event_date >= CURRENT_DATE
UNION ALL
SELECT 
    id,
    title,
    description,
    (event_date::date + COALESCE(event_time::time, '00:00:00'::time))::timestamp as start_time,
    (event_date::date + COALESCE(event_time::time, '00:00:00'::time) + INTERVAL '1 hour')::timestamp as end_time,
    CASE 
        WHEN community_id IS NOT NULL THEN 'Community'
        ELSE 'General'
    END as category,
    'TBA' as location,
    NULL::text as image_url,
    NULL::text as meeting_link,
    false as is_virtual,
    false as is_all_day,
    NULL::integer as max_attendees,
    false as registration_required,
    NULL::timestamp as registration_deadline,
    created_by as organizer_id,
    NULL::text as organizer_name,
    NULL::text as organizer_email,
    'active' as status,
    false as is_featured,
    NULL::text[] as tags,
    created_at,
    created_at as updated_at
FROM events
WHERE event_date >= CURRENT_DATE
ORDER BY start_time ASC;

-- Grant access to the view
GRANT SELECT ON upcoming_events TO anon;
GRANT SELECT ON upcoming_events TO authenticated;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify 1: Check that policies are created correctly
SELECT 
    'posts' as table_name,
    COUNT(*) as policy_count
FROM pg_policies
WHERE tablename = 'posts'
UNION ALL
SELECT 
    'communities' as table_name,
    COUNT(*) as policy_count
FROM pg_policies
WHERE tablename = 'communities'
UNION ALL
SELECT 
    'events' as table_name,
    COUNT(*) as policy_count
FROM pg_policies
WHERE tablename = 'events';

-- Verify 2: Test if anon can query posts (should return results if policy works)
-- Note: This needs to be run with "Run as anon" in Supabase SQL Editor
SELECT 
    COUNT(*) as accessible_posts_count
FROM posts
WHERE status = 'active';

-- Verify 3: Test if anon can query events from posts
SELECT 
    COUNT(*) as accessible_events_count
FROM posts
WHERE post_type = 'event'
    AND status = 'active'
    AND event_date IS NOT NULL;
