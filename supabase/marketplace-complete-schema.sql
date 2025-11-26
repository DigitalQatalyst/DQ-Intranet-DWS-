-- ============================================================================
-- Complete Marketplace Schema for News and Jobs
-- Based on hardcoded data structure from src/data/media/news.ts and jobs.ts
-- ============================================================================

-- ===== News Table =====
-- Matches NewsItem type structure exactly
DROP TABLE IF EXISTS public.news CASCADE;

CREATE TABLE public.news (
  id text PRIMARY KEY,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('Announcement', 'Guidelines', 'Notice', 'Thought Leadership')),
  date date NOT NULL,
  author text NOT NULL,
  byline text,
  views integer NOT NULL DEFAULT 0,
  excerpt text NOT NULL,
  image text,
  department text,
  location text CHECK (location IN ('Dubai', 'Nairobi', 'Riyadh', 'Remote')),
  domain text CHECK (domain IN ('Technology', 'Business', 'People', 'Operations')),
  theme text CHECK (theme IN ('Leadership', 'Delivery', 'Culture', 'DTMF')),
  tags text[] DEFAULT '{}',
  "readingTime" text CHECK ("readingTime" IN ('<5', '5–10', '10–20', '20+')),
  "newsType" text CHECK ("newsType" IN ('Corporate Announcements', 'Product / Project Updates', 'Events & Campaigns', 'Digital Tech News')),
  "newsSource" text CHECK ("newsSource" IN ('DQ Leadership', 'DQ Operations', 'DQ Communications')),
  "focusArea" text CHECK ("focusArea" IN ('GHC', 'DWS', 'Culture & People')),
  content text, -- Full article content for detail pages (supports markdown)
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ===== Jobs Table =====
-- Matches JobItem type structure exactly
DROP TABLE IF EXISTS public.jobs CASCADE;

CREATE TABLE public.jobs (
  id text PRIMARY KEY,
  title text NOT NULL,
  department text,
  "roleType" text CHECK ("roleType" IN ('Tech', 'Design', 'Ops', 'Finance', 'HR')),
  location text CHECK (location IN ('Dubai', 'Nairobi', 'Riyadh', 'Remote')),
  type text CHECK (type IN ('Full-time', 'Part-time', 'Contract', 'Intern')), -- contract type
  seniority text CHECK (seniority IN ('Junior', 'Mid', 'Senior', 'Lead')),
  "sfiaLevel" text CHECK ("sfiaLevel" IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7')),
  summary text NOT NULL,
  description text,
  responsibilities text[] DEFAULT '{}',
  requirements text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  "postedOn" date NOT NULL,
  "applyUrl" text,
  image text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ===== Job Applications Table =====
-- Stores job application submissions from the application form
DROP TABLE IF EXISTS public.job_applications CASCADE;

CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id text NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  job_title text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  current_role text NOT NULL,
  location text NOT NULL CHECK (location IN ('Dubai', 'Nairobi', 'Riyadh', 'Remote')),
  sfia_level text NOT NULL CHECK (sfia_level IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7')),
  motivation text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ===== Indexes for Performance =====
-- News indexes
CREATE INDEX idx_news_type ON public.news(type);
CREATE INDEX idx_news_date ON public.news(date DESC);
CREATE INDEX idx_news_department ON public.news(department) WHERE department IS NOT NULL;
CREATE INDEX idx_news_location ON public.news(location) WHERE location IS NOT NULL;
CREATE INDEX idx_news_domain ON public.news(domain) WHERE domain IS NOT NULL;
CREATE INDEX idx_news_news_type ON public.news("newsType") WHERE "newsType" IS NOT NULL;
CREATE INDEX idx_news_news_source ON public.news("newsSource") WHERE "newsSource" IS NOT NULL;
CREATE INDEX idx_news_focus_area ON public.news("focusArea") WHERE "focusArea" IS NOT NULL;
CREATE INDEX idx_news_author ON public.news(author);
CREATE INDEX idx_news_tags ON public.news USING gin(tags); -- GIN index for array searches

-- Full-text search index for news
CREATE INDEX idx_news_search ON public.news 
  USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, '')));

-- Jobs indexes
CREATE INDEX idx_jobs_posted_on ON public.jobs("postedOn" DESC);
CREATE INDEX idx_jobs_department ON public.jobs(department) WHERE department IS NOT NULL;
CREATE INDEX idx_jobs_location ON public.jobs(location) WHERE location IS NOT NULL;
CREATE INDEX idx_jobs_role_type ON public.jobs("roleType") WHERE "roleType" IS NOT NULL;
CREATE INDEX idx_jobs_type ON public.jobs(type) WHERE type IS NOT NULL;
CREATE INDEX idx_jobs_seniority ON public.jobs(seniority) WHERE seniority IS NOT NULL;
CREATE INDEX idx_jobs_sfia_level ON public.jobs("sfiaLevel") WHERE "sfiaLevel" IS NOT NULL;

-- Full-text search index for jobs
CREATE INDEX idx_jobs_search ON public.jobs 
  USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(description, '')));

-- Job applications indexes
CREATE INDEX idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_email ON public.job_applications(email);
CREATE INDEX idx_job_applications_created_at ON public.job_applications(created_at DESC);

-- ===== Functions =====
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to increment news views
CREATE OR REPLACE FUNCTION increment_news_views(news_id text)
RETURNS void AS $$
BEGIN
  UPDATE public.news
  SET views = views + 1
  WHERE id = news_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== Triggers =====
-- Auto-update updated_at on news
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at on jobs
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===== Row Level Security (RLS) =====
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for News
-- Allow public read access (anyone can view news)
CREATE POLICY news_select ON public.news 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to insert (for admin/content creators)
CREATE POLICY news_insert ON public.news 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update (for admin/content creators)
CREATE POLICY news_update ON public.news 
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete (for admin only - adjust as needed)
CREATE POLICY news_delete ON public.news 
  FOR DELETE 
  TO authenticated
  USING (true);

-- RLS Policies for Jobs
-- Allow public read access (anyone can view jobs)
CREATE POLICY jobs_select ON public.jobs 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to insert (for admin/HR)
CREATE POLICY jobs_insert ON public.jobs 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update (for admin/HR)
CREATE POLICY jobs_update ON public.jobs 
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete (for admin/HR)
CREATE POLICY jobs_delete ON public.jobs 
  FOR DELETE 
  TO authenticated
  USING (true);

-- RLS Policies for Job Applications
-- Allow public insert (anyone can submit an application)
CREATE POLICY job_applications_insert ON public.job_applications 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to select (for HR/admin to view applications)
CREATE POLICY job_applications_select ON public.job_applications 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Allow authenticated users to update (for HR/admin)
CREATE POLICY job_applications_update ON public.job_applications 
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete (for admin/HR)
CREATE POLICY job_applications_delete ON public.job_applications 
  FOR DELETE 
  TO authenticated
  USING (true);

-- ===== Helper Views =====
-- View for news with computed fields (useful for aggregations)
CREATE OR REPLACE VIEW public.news_summary AS
SELECT 
  id,
  title,
  type,
  date,
  author,
  views,
  excerpt,
  image,
  department,
  location,
  domain,
  tags,
  "readingTime",
  "newsType",
  "newsSource",
  "focusArea",
  CASE 
    WHEN content IS NOT NULL THEN true 
    ELSE false 
  END as has_content,
  created_at,
  updated_at
FROM public.news;

-- View for jobs with computed fields
CREATE OR REPLACE VIEW public.jobs_summary AS
SELECT 
  id,
  title,
  department,
  "roleType",
  location,
  type,
  seniority,
  "sfiaLevel",
  summary,
  "postedOn",
  "applyUrl",
  image,
  array_length(responsibilities, 1) as responsibilities_count,
  array_length(requirements, 1) as requirements_count,
  array_length(benefits, 1) as benefits_count,
  created_at,
  updated_at
FROM public.jobs;

-- ===== Grants =====
-- Grant permissions to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.news TO anon, authenticated;
GRANT SELECT ON public.jobs TO anon, authenticated;
GRANT SELECT ON public.news_summary TO anon, authenticated;
GRANT SELECT ON public.jobs_summary TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.news TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT INSERT ON public.job_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.job_applications TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION increment_news_views(text) TO anon, authenticated;

-- ===== Comments for Documentation =====
COMMENT ON TABLE public.news IS 'News articles, announcements, guidelines, notices, and thought leadership content';
COMMENT ON TABLE public.jobs IS 'Job openings and opportunities at DQ';
COMMENT ON TABLE public.job_applications IS 'Job application submissions from internal candidates';
COMMENT ON COLUMN public.news.tags IS 'Array of tags for categorization and filtering';
COMMENT ON COLUMN public.news.content IS 'Full article content in markdown format';
COMMENT ON COLUMN public.jobs.responsibilities IS 'Array of job responsibilities';
COMMENT ON COLUMN public.jobs.requirements IS 'Array of job requirements';
COMMENT ON COLUMN public.jobs.benefits IS 'Array of job benefits';
COMMENT ON COLUMN public.job_applications.job_title IS 'Denormalized job title for historical reference and easier querying';

