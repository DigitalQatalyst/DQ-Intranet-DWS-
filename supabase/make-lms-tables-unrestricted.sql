-- Make LMS Tables Unrestricted (Disable RLS and Grant Permissions)
-- This matches the setup where tables work without policies

-- Step 1: Disable RLS on all LMS tables
ALTER TABLE IF EXISTS lms_courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lms_curriculum_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lms_topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lms_lessons DISABLE ROW LEVEL SECURITY;

-- Step 2: Grant all necessary permissions to anon role
-- This ensures the anon role can SELECT, INSERT, UPDATE, DELETE
GRANT ALL ON lms_courses TO anon;
GRANT ALL ON lms_curriculum_items TO anon;
GRANT ALL ON lms_topics TO anon;
GRANT ALL ON lms_lessons TO anon;

-- Also grant to authenticated role (if you use authentication later)
GRANT ALL ON lms_courses TO authenticated;
GRANT ALL ON lms_curriculum_items TO authenticated;
GRANT ALL ON lms_topics TO authenticated;
GRANT ALL ON lms_lessons TO authenticated;

-- Step 3: Grant usage on sequences (if you have auto-increment IDs)
-- This allows inserts to work properly
DO $$
BEGIN
    -- Grant on sequences if they exist
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'lms_courses_id_seq') THEN
        GRANT USAGE, SELECT ON SEQUENCE lms_courses_id_seq TO anon;
        GRANT USAGE, SELECT ON SEQUENCE lms_courses_id_seq TO authenticated;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'lms_curriculum_items_id_seq') THEN
        GRANT USAGE, SELECT ON SEQUENCE lms_curriculum_items_id_seq TO anon;
        GRANT USAGE, SELECT ON SEQUENCE lms_curriculum_items_id_seq TO authenticated;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'lms_topics_id_seq') THEN
        GRANT USAGE, SELECT ON SEQUENCE lms_topics_id_seq TO anon;
        GRANT USAGE, SELECT ON SEQUENCE lms_topics_id_seq TO authenticated;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'lms_lessons_id_seq') THEN
        GRANT USAGE, SELECT ON SEQUENCE lms_lessons_id_seq TO anon;
        GRANT USAGE, SELECT ON SEQUENCE lms_lessons_id_seq TO authenticated;
    END IF;
END $$;

-- Step 4: Verify the changes
SELECT 
    tablename,
    rowsecurity as "RLS Enabled",
    CASE 
        WHEN rowsecurity THEN '❌ Restricted (RLS ON)'
        ELSE '✅ Unrestricted (RLS OFF)'
    END as "Status"
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE 'lms_%'
ORDER BY tablename;

-- Check grants
SELECT 
    grantee as "Role",
    table_name as "Table",
    string_agg(privilege_type, ', ' ORDER BY privilege_type) as "Permissions"
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name LIKE 'lms_%'
  AND grantee IN ('anon', 'authenticated')
GROUP BY grantee, table_name
ORDER BY table_name, grantee;

