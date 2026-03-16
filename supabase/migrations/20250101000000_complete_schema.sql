-- ============================================================================
-- Complete Schema for DWS News & Announcements Marketplace
-- This schema supports: News/Announcements, Jobs, Work Directory, Marketplace Services
-- Generated for seamless Supabase integration with hardcoded data
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- NEWS & ANNOUNCEMENTS TABLES
-- ============================================================================

-- News articles table (matches NewsItem type from src/data/media/news.ts)
CREATE TABLE IF NOT EXISTS public.news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Announcement', 'Guidelines', 'Notice', 'Thought Leadership')),
  date DATE NOT NULL,
  author TEXT NOT NULL,
  byline TEXT,
  views INTEGER DEFAULT 0,
  excerpt TEXT NOT NULL,
  image TEXT,
  department TEXT,
  location TEXT CHECK (location IN ('Dubai', 'Nairobi', 'Riyadh', 'Remote')),
  domain TEXT CHECK (domain IN ('Technology', 'Business', 'People', 'Operations')),
  theme TEXT CHECK (theme IN ('Leadership', 'Delivery', 'Culture', 'DTMF')),
  tags TEXT[] DEFAULT '{}',
  reading_time TEXT CHECK (reading_time IN ('<5', '5–10', '10–20', '20+')),
  news_type TEXT CHECK (news_type IN ('Policy Update', 'Upcoming Events', 'Company News', 'Holidays')),
  news_source TEXT CHECK (news_source IN ('DQ Leadership', 'DQ Operations', 'DQ Communications')),
  focus_area TEXT CHECK (focus_area IN ('GHC', 'DWS', 'Culture & People')),
  content TEXT, -- Full article content (Markdown)
  format TEXT CHECK (format IN ('Blog', 'Article', 'Research Report', 'Podcast')),
  source TEXT, -- Provider name
  audio_url TEXT, -- Audio file URL for podcasts
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for news
CREATE INDEX IF NOT EXISTS idx_news_date ON public.news(date DESC);
CREATE INDEX IF NOT EXISTS idx_news_type ON public.news(type);
CREATE INDEX IF NOT EXISTS idx_news_department ON public.news(department);
CREATE INDEX IF NOT EXISTS idx_news_location ON public.news(location);
CREATE INDEX IF NOT EXISTS idx_news_news_type ON public.news(news_type);
CREATE INDEX IF NOT EXISTS idx_news_tags ON public.news USING GIN(tags);

-- ============================================================================
-- JOBS TABLES
-- ============================================================================

-- Jobs table (matches JobItem type from src/data/media/jobs.ts)
CREATE TABLE IF NOT EXISTS public.jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  role_type TEXT NOT NULL CHECK (role_type IN ('Tech', 'Design', 'Ops', 'Finance', 'HR')),
  location TEXT NOT NULL CHECK (location IN ('Dubai', 'Nairobi', 'Riyadh', 'Remote')),
  type TEXT NOT NULL CHECK (type IN ('Full-time', 'Part-time', 'Contract', 'Intern')),
  seniority TEXT NOT NULL CHECK (seniority IN ('Junior', 'Mid', 'Senior', 'Lead')),
  sfia_level TEXT CHECK (sfia_level IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7')),
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  posted_on DATE NOT NULL,
  apply_url TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for jobs
CREATE INDEX IF NOT EXISTS idx_jobs_posted_on ON public.jobs(posted_on DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_department ON public.jobs(department);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_role_type ON public.jobs(role_type);
CREATE INDEX IF NOT EXISTS idx_jobs_sfia_level ON public.jobs(sfia_level);

-- ============================================================================
-- WORK DIRECTORY TABLES
-- ============================================================================

-- Work units table (matches WorkUnit type)
CREATE TABLE IF NOT EXISTS public.work_units (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  sector TEXT NOT NULL,
  unit_name TEXT NOT NULL,
  unit_type TEXT NOT NULL,
  mandate TEXT,
  location TEXT NOT NULL,
  focus_tags TEXT[] DEFAULT '{}',
  priority_level TEXT,
  priority_scope TEXT,
  performance_status TEXT,
  performance_score NUMERIC,
  performance_summary TEXT,
  performance_notes TEXT,
  performance_updated_at TIMESTAMPTZ,
  wi_areas TEXT[] DEFAULT '{}',
  banner_image_url TEXT,
  department TEXT,
  current_focus TEXT,
  priorities TEXT,
  priorities_list TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work positions table (matches WorkPosition type)
CREATE TABLE IF NOT EXISTS public.work_positions (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  position_name TEXT NOT NULL,
  hero_title TEXT,
  role_family TEXT,
  unit TEXT,
  unit_slug TEXT,
  location TEXT,
  sfia_level TEXT CHECK (sfia_level IN ('L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7')),
  sfia_rating TEXT,
  summary TEXT,
  description TEXT,
  responsibilities TEXT[] DEFAULT '{}',
  expectations TEXT,
  status TEXT DEFAULT 'Active',
  image_url TEXT,
  banner_image_url TEXT,
  department TEXT,
  contract_type TEXT,
  reports_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work associates table (matches WorkAssociate type)
CREATE TABLE IF NOT EXISTS public.work_associates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  current_role TEXT NOT NULL,
  department TEXT NOT NULL,
  unit TEXT NOT NULL,
  location TEXT NOT NULL,
  sfia_rating TEXT NOT NULL,
  status TEXT NOT NULL,
  level TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  teams_link TEXT,
  key_skills TEXT[] DEFAULT '{}',
  bio TEXT NOT NULL,
  summary TEXT,
  avatar_url TEXT,
  hobbies TEXT[] DEFAULT '{}',
  technical_skills TEXT[] DEFAULT '{}',
  functional_skills TEXT[] DEFAULT '{}',
  soft_skills TEXT[] DEFAULT '{}',
  key_competencies TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee profiles table (matches EmployeeProfile type)
CREATE TABLE IF NOT EXISTS public.employee_profiles (
  id TEXT PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  department TEXT,
  unit TEXT,
  role TEXT,
  location TEXT,
  avatar_url TEXT,
  bio TEXT,
  summary TEXT,
  key_skills TEXT[] DEFAULT '{}',
  sfia_rating TEXT,
  status TEXT,
  hobbies TEXT[] DEFAULT '{}',
  technical_skills TEXT[] DEFAULT '{}',
  functional_skills TEXT[] DEFAULT '{}',
  soft_skills TEXT[] DEFAULT '{}',
  key_competencies TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for work directory
CREATE INDEX IF NOT EXISTS idx_work_units_sector ON public.work_units(sector);
CREATE INDEX IF NOT EXISTS idx_work_units_location ON public.work_units(location);
CREATE INDEX IF NOT EXISTS idx_work_units_slug ON public.work_units(slug);
CREATE INDEX IF NOT EXISTS idx_work_positions_unit ON public.work_positions(unit);
CREATE INDEX IF NOT EXISTS idx_work_positions_location ON public.work_positions(location);
CREATE INDEX IF NOT EXISTS idx_work_positions_slug ON public.work_positions(slug);
CREATE INDEX IF NOT EXISTS idx_work_positions_status ON public.work_positions(status);
CREATE INDEX IF NOT EXISTS idx_work_associates_unit ON public.work_associates(unit);
CREATE INDEX IF NOT EXISTS idx_work_associates_department ON public.work_associates(department);
CREATE INDEX IF NOT EXISTS idx_work_associates_email ON public.work_associates(email);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_email ON public.employee_profiles(email);

-- ============================================================================
-- MARKETPLACE SERVICES TABLES
-- ============================================================================

-- Marketplace services table (for courses, financial services, etc.)
CREATE TABLE IF NOT EXISTS public.marketplace_services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  service_type TEXT, -- 'course', 'financial', 'non-financial', 'guide', 'onboarding'
  delivery_mode TEXT,
  business_stage TEXT,
  provider_name TEXT,
  provider_logo_url TEXT,
  provider_description TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  date TEXT, -- Publication/posting date
  start_date TEXT,
  price TEXT,
  amount TEXT, -- For financial services
  interest_rate TEXT, -- For financial services
  duration TEXT,
  location TEXT,
  details TEXT[], -- Array of detail strings
  eligibility TEXT,
  learning_outcomes TEXT[] DEFAULT '{}',
  duration_type TEXT,
  time_to_complete TEXT,
  journey_phase TEXT,
  roles TEXT[] DEFAULT '{}',
  popularity TEXT,
  download_count INTEGER DEFAULT 0,
  file_size TEXT,
  format TEXT,
  phase TEXT,
  role TEXT,
  metadata JSONB, -- For flexible additional data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for marketplace services
CREATE INDEX IF NOT EXISTS idx_marketplace_services_category ON public.marketplace_services(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_service_type ON public.marketplace_services(service_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_tags ON public.marketplace_services USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_marketplace_services_business_stage ON public.marketplace_services(business_stage);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_associates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to news" ON public.news;
DROP POLICY IF EXISTS "Allow public read access to jobs" ON public.jobs;
DROP POLICY IF EXISTS "Allow public read access to work_units" ON public.work_units;
DROP POLICY IF EXISTS "Allow public read access to work_positions" ON public.work_positions;
DROP POLICY IF EXISTS "Allow public read access to work_associates" ON public.work_associates;
DROP POLICY IF EXISTS "Allow public read access to employee_profiles" ON public.employee_profiles;
DROP POLICY IF EXISTS "Allow public read access to marketplace_services" ON public.marketplace_services;

-- Public read access policies (adjust based on your security requirements)
CREATE POLICY "Allow public read access to news"
  ON public.news FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to jobs"
  ON public.jobs FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to work_units"
  ON public.work_units FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to work_positions"
  ON public.work_positions FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to work_associates"
  ON public.work_associates FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to employee_profiles"
  ON public.employee_profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to marketplace_services"
  ON public.marketplace_services FOR SELECT
  USING (true);

-- ============================================================================
-- GRANTS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.news TO anon, authenticated;
GRANT SELECT ON public.jobs TO anon, authenticated;
GRANT SELECT ON public.work_units TO anon, authenticated;
GRANT SELECT ON public.work_positions TO anon, authenticated;
GRANT SELECT ON public.work_associates TO anon, authenticated;
GRANT SELECT ON public.employee_profiles TO anon, authenticated;
GRANT SELECT ON public.marketplace_services TO anon, authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.news IS 'News articles and announcements for DQ Intranet';
COMMENT ON TABLE public.jobs IS 'Job postings and opportunities at DQ';
COMMENT ON TABLE public.work_units IS 'Organizational units within DQ (factories, teams, etc.)';
COMMENT ON TABLE public.work_positions IS 'Job positions and roles available at DQ';
COMMENT ON TABLE public.work_associates IS 'DQ associates/employees directory';
COMMENT ON TABLE public.employee_profiles IS 'Extended employee profile information';
COMMENT ON TABLE public.marketplace_services IS 'Marketplace services including courses, financial services, guides, and onboarding flows';

