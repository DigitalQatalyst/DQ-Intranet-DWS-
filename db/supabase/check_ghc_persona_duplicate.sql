-- Check if dq-persona and dq-ghc have duplicate content
-- Run this in Supabase SQL Editor

-- 1. Check dq-persona content
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 200) as body_preview
FROM public.guides
WHERE slug = 'dq-persona';

-- 2. Check dq-ghc content
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 200) as body_preview
FROM public.guides
WHERE slug = 'dq-ghc';

-- 3. Check if they have identical body content
SELECT 
  g1.slug as slug1,
  g2.slug as slug2,
  CASE 
    WHEN TRIM(COALESCE(g1.body, '')) = TRIM(COALESCE(g2.body, '')) THEN 'IDENTICAL'
    ELSE 'DIFFERENT'
  END as content_match
FROM public.guides g1
CROSS JOIN public.guides g2
WHERE g1.slug = 'dq-persona'
  AND g2.slug = 'dq-ghc'
  AND g1.body IS NOT NULL
  AND g2.body IS NOT NULL;

-- 4. Check all GHC guides for duplicate content
SELECT * FROM public.identify_ghc_duplicates();

-- 5. Get full status report
SELECT * FROM public.get_ghc_status_report();
