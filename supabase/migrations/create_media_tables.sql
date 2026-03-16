-- ============================================================================
-- Media Center Tables: News and Jobs
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Create news table
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
  content TEXT,
  format TEXT CHECK (format IN ('Blog', 'Article', 'Research Report', 'Podcast')),
  source TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create jobs table
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

-- Create indexes for better performance (only if tables were created)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'news') THEN
    CREATE INDEX IF NOT EXISTS idx_news_date ON public.news(date DESC);
    CREATE INDEX IF NOT EXISTS idx_news_type ON public.news(type);
    CREATE INDEX IF NOT EXISTS idx_news_department ON public.news(department);
    CREATE INDEX IF NOT EXISTS idx_news_location ON public.news(location);
    CREATE INDEX IF NOT EXISTS idx_news_news_type ON public.news(news_type);
    CREATE INDEX IF NOT EXISTS idx_news_tags ON public.news USING GIN(tags);
  END IF;

  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'jobs') THEN
    CREATE INDEX IF NOT EXISTS idx_jobs_posted_on ON public.jobs(posted_on DESC);
    CREATE INDEX IF NOT EXISTS idx_jobs_department ON public.jobs(department);
    CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
    CREATE INDEX IF NOT EXISTS idx_jobs_role_type ON public.jobs(role_type);
    CREATE INDEX IF NOT EXISTS idx_jobs_sfia_level ON public.jobs(sfia_level);
  END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read access
CREATE POLICY "Allow public read access to news" ON public.news
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to jobs" ON public.jobs
  FOR SELECT USING (true);

-- Optional: Allow authenticated users to insert/update (adjust as needed)
CREATE POLICY "Allow authenticated insert to news" ON public.news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert to jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
