-- =====================================================
-- Add News/Media Columns to Guides Table
-- =====================================================
-- Run this in Knowledge Hub Supabase SQL Editor
-- This adds columns needed for news, announcements, and blog posts
-- =====================================================

-- Add missing columns for news/media items
ALTER TABLE public.guides 
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS summary TEXT,
  ADD COLUMN IF NOT EXISTS type TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS date DATE,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT,
  ADD COLUMN IF NOT EXISTS author_name TEXT,
  ADD COLUMN IF NOT EXISTS news_type TEXT,
  ADD COLUMN IF NOT EXISTS focus_area TEXT,
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS reading_time TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS format TEXT,
  ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS guides_type_idx ON public.guides (type);
CREATE INDEX IF NOT EXISTS guides_category_idx ON public.guides (category);
CREATE INDEX IF NOT EXISTS guides_date_idx ON public.guides (date);
CREATE INDEX IF NOT EXISTS guides_news_type_idx ON public.guides (news_type);
CREATE INDEX IF NOT EXISTS guides_focus_area_idx ON public.guides (focus_area);

-- Update the view to include new columns
DROP VIEW IF EXISTS public.v_media_all;
CREATE OR REPLACE VIEW public.v_media_all AS
SELECT 
  id,
  slug,
  title,
  description,
  summary,
  excerpt,
  body,
  content,
  type,
  category,
  domain,
  guide_type,
  function_area,
  status,
  complexity_level,
  date,
  image_url,
  image,
  source,
  author_name,
  tags,
  news_type,
  focus_area,
  reading_time,
  location,
  format,
  audio_url,
  document_url,
  created_at,
  updated_at,
  last_updated_at
FROM public.guides
WHERE status = 'Approved'
ORDER BY date DESC NULLS LAST, created_at DESC;

-- Grant access to the view
GRANT SELECT ON public.v_media_all TO anon, authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ News columns added successfully!';
  RAISE NOTICE '✅ View v_media_all updated!';
  RAISE NOTICE 'Next: Run migrate-news-to-supabase.js to import news data';
END $$;
