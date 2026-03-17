-- Debug: Check what content is actually in Supabase vs what you see on localhost
-- Run this to see the exact content stored in Supabase

-- 1. Check dq-persona content in Supabase
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 300) as body_preview,
  last_updated_at,
  created_at
FROM public.guides
WHERE slug = 'dq-persona';

-- 2. Compare with dq-ghc to see if they're different
SELECT 
  g1.slug as persona_slug,
  g2.slug as ghc_slug,
  LENGTH(COALESCE(g1.body, '')) as persona_body_length,
  LENGTH(COALESCE(g2.body, '')) as ghc_body_length,
  CASE 
    WHEN TRIM(COALESCE(g1.body, '')) = TRIM(COALESCE(g2.body, '')) THEN 'IDENTICAL - This is the problem!'
    ELSE 'DIFFERENT - Content is unique ✅'
  END as content_comparison,
  LEFT(g1.body, 100) as persona_preview,
  LEFT(g2.body, 100) as ghc_preview
FROM public.guides g1
CROSS JOIN public.guides g2
WHERE g1.slug = 'dq-persona'
  AND g2.slug = 'dq-ghc';

-- 3. Check all GHC guides and their content lengths
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  CASE 
    WHEN body IS NULL OR TRIM(body) = '' THEN 'EMPTY'
    ELSE 'HAS CONTENT'
  END as status,
  last_updated_at
FROM public.guides
WHERE slug IN (
  'dq-vision',
  'dq-hov',
  'dq-persona',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd',
  'dq-ghc'
)
ORDER BY slug;

-- 4. Check for any duplicate content
SELECT * FROM public.identify_ghc_duplicates();
