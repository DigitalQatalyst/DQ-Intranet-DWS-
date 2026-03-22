-- Diagnostic queries to check Supabase connection and data sync
-- Run these to verify your database state

-- 1. Check if dq-hov exists and when it was last updated
SELECT 
  id,
  slug,
  title,
  status,
  LENGTH(COALESCE(body, '')) as body_length,
  last_updated_at,
  created_at
FROM public.guides
WHERE slug = 'dq-hov';

-- 2. Check all GHC guides and their last update times
SELECT 
  slug,
  title,
  status,
  LENGTH(COALESCE(body, '')) as body_length,
  last_updated_at
FROM public.guides
WHERE slug IN (
  'dq-vision',
  'dq-hov',
  'dq-persona',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd'
)
ORDER BY last_updated_at DESC;

-- 3. Check RLS policies on guides table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'guides'
ORDER BY policyname;

-- 4. Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'guides';
