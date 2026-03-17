-- Check what's currently in Supabase for dq-vision
SELECT 
  slug,
  title,
  summary,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 300) as body_preview
FROM public.guides
WHERE slug = 'dq-vision';

-- Also check dq-ghc to compare
SELECT 
  slug,
  title,
  LENGTH(COALESCE(body, '')) as body_length,
  LEFT(body, 300) as body_preview
FROM public.guides
WHERE slug = 'dq-ghc';
