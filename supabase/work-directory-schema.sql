-- ============================================================================
-- Work Directory Schema for DQ Work Directory Marketplace
-- Creates tables for work_units, work_positions, and work_associates
-- 
-- SAFE TO RUN: This script uses CREATE TABLE IF NOT EXISTS, so it won't
-- delete existing tables or data. It will only create tables if they don't exist.
-- ============================================================================

-- ===== Work Units Table =====
-- Use CREATE TABLE IF NOT EXISTS to avoid dropping existing data
CREATE TABLE IF NOT EXISTS public.work_units (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  sector text NOT NULL,
  unit_name text NOT NULL,
  unit_type text NOT NULL,
  mandate text,
  location text NOT NULL,
  focus_tags text[] DEFAULT '{}',
  priority_level text,
  priority_scope text,
  performance_status text,
  performance_score numeric,
  performance_summary text,
  performance_notes text,
  performance_updated_at timestamptz,
  wi_areas text[] DEFAULT '{}',
  banner_image_url text,
  department text,
  current_focus text,
  priorities text,
  priorities_list text[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- ===== Work Positions Table =====
-- Use CREATE TABLE IF NOT EXISTS to avoid dropping existing data
CREATE TABLE IF NOT EXISTS public.work_positions (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  position_name text NOT NULL,
  hero_title text,
  role_family text,
  unit text,
  unit_slug text,
  location text,
  sfia_level text,
  sfia_rating text,
  summary text,
  description text,
  responsibilities text[] DEFAULT '{}',
  expectations text,
  status text,
  image_url text,
  banner_image_url text,
  department text,
  contract_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===== Work Associates Table =====
-- Use CREATE TABLE IF NOT EXISTS to avoid dropping existing data
CREATE TABLE IF NOT EXISTS public.work_associates (
  id text PRIMARY KEY,
  name text NOT NULL,
  current_role text NOT NULL,
  department text NOT NULL,
  unit text NOT NULL,
  location text NOT NULL,
  sfia_rating text NOT NULL,
  status text NOT NULL,
  level text,
  email text NOT NULL,
  phone text,
  teams_link text,
  key_skills text[] DEFAULT '{}',
  bio text NOT NULL,
  summary text,
  avatar_url text,
  hobbies text[] DEFAULT '{}',
  technical_skills text[] DEFAULT '{}',
  functional_skills text[] DEFAULT '{}',
  soft_skills text[] DEFAULT '{}',
  key_competencies text[] DEFAULT '{}',
  languages text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===== Employee Profiles Table (if it doesn't exist) =====
CREATE TABLE IF NOT EXISTS public.employee_profiles (
  id text PRIMARY KEY,
  full_name text,
  email text,
  phone text,
  department text,
  unit text,
  role text,
  location text,
  avatar_url text,
  bio text,
  summary text,
  key_skills text[] DEFAULT '{}',
  sfia_rating text,
  status text,
  hobbies text[] DEFAULT '{}',
  technical_skills text[] DEFAULT '{}',
  functional_skills text[] DEFAULT '{}',
  soft_skills text[] DEFAULT '{}',
  key_competencies text[] DEFAULT '{}',
  languages text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ===== Indexes for Performance =====
CREATE INDEX IF NOT EXISTS idx_work_units_sector ON public.work_units(sector);
CREATE INDEX IF NOT EXISTS idx_work_units_location ON public.work_units(location);
CREATE INDEX IF NOT EXISTS idx_work_units_slug ON public.work_units(slug);

CREATE INDEX IF NOT EXISTS idx_work_positions_unit ON public.work_positions(unit);
CREATE INDEX IF NOT EXISTS idx_work_positions_location ON public.work_positions(location);
CREATE INDEX IF NOT EXISTS idx_work_positions_slug ON public.work_positions(slug);

CREATE INDEX IF NOT EXISTS idx_work_associates_unit ON public.work_associates(unit);
CREATE INDEX IF NOT EXISTS idx_work_associates_department ON public.work_associates(department);
CREATE INDEX IF NOT EXISTS idx_work_associates_email ON public.work_associates(email);

CREATE INDEX IF NOT EXISTS idx_employee_profiles_email ON public.employee_profiles(email);
CREATE INDEX IF NOT EXISTS idx_employee_profiles_full_name ON public.employee_profiles(full_name);

-- ===== Row Level Security (RLS) Policies =====
-- Enable RLS on all tables (safe to run multiple times)
ALTER TABLE IF EXISTS public.work_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.work_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.work_associates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.employee_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access (adjust based on your security requirements)
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to work_units" ON public.work_units;
DROP POLICY IF EXISTS "Allow public read access to work_positions" ON public.work_positions;
DROP POLICY IF EXISTS "Allow public read access to work_associates" ON public.work_associates;
DROP POLICY IF EXISTS "Allow public read access to employee_profiles" ON public.employee_profiles;

CREATE POLICY "Allow public read access to work_units"
  ON public.work_units
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to work_positions"
  ON public.work_positions
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to work_associates"
  ON public.work_associates
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to employee_profiles"
  ON public.employee_profiles
  FOR SELECT
  USING (true);

-- ===== Comments for Documentation =====
COMMENT ON TABLE public.work_units IS 'Organizational units within DQ (factories, teams, etc.)';
COMMENT ON TABLE public.work_positions IS 'Job positions and roles available at DQ';
COMMENT ON TABLE public.work_associates IS 'DQ associates/employees directory';
COMMENT ON TABLE public.employee_profiles IS 'Extended employee profile information';

