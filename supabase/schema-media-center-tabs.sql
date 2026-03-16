-- ============================================================================
-- Media Center Tab Views Schema
-- Defines tab-specific views on top of public.news and public.jobs
-- Tabs: News & Announcements, Blogs, Podcasts, Job Openings
-- ============================================================================

-- View: news_announcements (News & Announcements tab)
-- Includes Announcements, Guidelines, and Notices
CREATE OR REPLACE VIEW public.news_announcements AS
SELECT *
FROM public.news
WHERE type IN ('Announcement', 'Guidelines', 'Notice');

-- View: news_blogs (Blogs / Insights tab)
-- Includes Thought Leadership items that are not podcasts
CREATE OR REPLACE VIEW public.news_blogs AS
SELECT *
FROM public.news
WHERE type = 'Thought Leadership'
  AND (format IS NULL OR format <> 'Podcast');

-- View: news_podcasts (Podcasts tab)
-- Includes items explicitly marked as podcasts or tagged as podcasts
CREATE OR REPLACE VIEW public.news_podcasts AS
SELECT *
FROM public.news
WHERE format = 'Podcast'
   OR EXISTS (
        SELECT 1
        FROM unnest(COALESCE(tags, ARRAY[]::TEXT[])) AS t(tag)
        WHERE lower(t.tag) LIKE '%podcast%'
     );

-- View: job_openings (Job Openings / Opportunities tab)
CREATE OR REPLACE VIEW public.job_openings AS
SELECT *
FROM public.jobs;
