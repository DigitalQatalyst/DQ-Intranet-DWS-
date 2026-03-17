-- Verification script for GHC duplicate content migration
-- Run this after applying 20250117_fix_ghc_duplicate_content.sql

-- 1. Check if functions exist
SELECT 
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'identify_ghc_duplicates',
    'validate_ghc_uniqueness',
    'get_ghc_status_report',
    'check_ghc_content_uniqueness'
  )
ORDER BY routine_name;

-- 2. Check if trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name = 'trg_check_ghc_content_uniqueness';

-- 3. Test: Get GHC status report
SELECT * FROM public.get_ghc_status_report();

-- 4. Test: Check for duplicates (should return empty if no duplicates)
SELECT * FROM public.identify_ghc_duplicates();

-- 5. List all GHC guides
SELECT 
  id,
  slug,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  CASE 
    WHEN body IS NULL OR TRIM(body) = '' THEN 'EMPTY'
    ELSE 'HAS CONTENT'
  END as body_status
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
ORDER BY slug;
