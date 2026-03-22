-- =====================================================
-- Create Media View for Knowledge Hub
-- =====================================================
-- This view provides a unified interface for fetching
-- guides, news, and learning content
-- =====================================================

-- Create a view that combines guides with metadata for the Knowledge Hub
CREATE OR REPLACE VIEW public.v_media_all AS
SELECT 
  id,
  slug,
  title,
  summary as description,
  body as content,
  hero_image_url as image_url,
  ARRAY[]::text[] as tags, -- Empty array since tags column doesn't exist
  guide_type as type,
  domain as category,
  status,
  last_updated_at as date,
  last_updated_at as updated_at,
  -- Additional fields for compatibility
  slug as source,
  domain as focus_area,
  guide_type as news_type,
  author_name,
  author_org
FROM public.guides
WHERE status = 'Approved';

-- Grant access to anonymous users
GRANT SELECT ON public.v_media_all TO anon;
GRANT SELECT ON public.v_media_all TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Media view created successfully!';
  RAISE NOTICE 'View name: v_media_all';
  RAISE NOTICE 'This view can now be used by the KnowledgeHub component';
END $$;

-- Test the view
SELECT 
  slug,
  title,
  type,
  category,
  status,
  date
FROM public.v_media_all
LIMIT 5;
