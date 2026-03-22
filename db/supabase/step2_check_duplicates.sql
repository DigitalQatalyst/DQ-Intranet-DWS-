-- Step 2: Check for Duplicates and Missing Guides
-- Run this in Supabase SQL Editor

-- 1. Check for duplicate content
SELECT * FROM public.identify_ghc_duplicates();

-- 2. Get comprehensive status report
SELECT * FROM public.get_ghc_status_report();

-- 3. Check if dq-hov exists (we saw 6 guides, should be 7)
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
WHERE slug = 'dq-hov';

-- 4. List all 7 expected GHC guides
SELECT 
  g.slug,
  guides.title,
  CASE 
    WHEN guides.slug IS NOT NULL THEN 'EXISTS'
    ELSE 'MISSING'
  END as status
FROM (VALUES 
  ('dq-vision'),
  ('dq-hov'),
  ('dq-persona'),
  ('dq-agile-tms'),
  ('dq-agile-sos'),
  ('dq-agile-flows'),
  ('dq-agile-6xd')
) AS g(slug)
LEFT JOIN guides ON guides.slug = g.slug
ORDER BY g.slug;
