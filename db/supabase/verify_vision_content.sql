-- Verify Vision content is correct and different from GHC
-- Run this to check if Vision has the correct content

SELECT 
  'dq-vision' as guide_slug,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  SUBSTRING(body, 1, 200) as body_preview,
  last_updated_at
FROM public.guides
WHERE slug = 'dq-vision'

UNION ALL

SELECT 
  'dq-ghc' as guide_slug,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  SUBSTRING(body, 1, 200) as body_preview,
  last_updated_at
FROM public.guides
WHERE slug = 'dq-ghc'

ORDER BY guide_slug;

-- Expected: Vision should start with "# Introduction" and mention "Vision comes in, your guiding star"
-- Expected: GHC should start with "# Introduction" but mention "Starting at DQ or even navigating your role"
