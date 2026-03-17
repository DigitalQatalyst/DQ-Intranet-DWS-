-- Comprehensive verification of all 7 GHC guides
-- Run this to get a complete status check

-- 1. Check all 7 GHC guides exist and show their details
SELECT 
  g.slug,
  guides.title,
  guides.status,
  guides.domain,
  LENGTH(COALESCE(guides.body, '')) as body_length,
  CASE 
    WHEN guides.slug IS NOT NULL THEN 'EXISTS'
    ELSE 'MISSING'
  END as existence_status,
  CASE 
    WHEN guides.body IS NULL OR TRIM(guides.body) = '' THEN 'EMPTY'
    ELSE 'HAS CONTENT'
  END as body_status
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

-- 2. Check for any duplicate content (should return empty if all unique)
SELECT * FROM public.identify_ghc_duplicates();

-- 3. Get comprehensive GHC status report
SELECT * FROM public.get_ghc_status_report();
