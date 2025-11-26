-- ============================================================================
-- Migration: Create job_applications table
-- Run this in Supabase SQL Editor to create the job_applications table
-- ============================================================================

-- Drop table if exists (for re-running migration)
DROP TABLE IF EXISTS public.job_applications CASCADE;

-- Create job_applications table
-- Only these columns: id, job_id, job_title, motivation, created_at, current_role, email, location, name, sfia_level
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

-- Create indexes
CREATE INDEX idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_email ON public.job_applications(email);
CREATE INDEX idx_job_applications_created_at ON public.job_applications(created_at DESC);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

-- Allow authenticated users to update (for HR/admin to update status)
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

-- Grant permissions
GRANT INSERT ON public.job_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.job_applications TO authenticated;

-- Add comments
COMMENT ON TABLE public.job_applications IS 'Job application submissions from internal candidates';
COMMENT ON COLUMN public.job_applications.job_title IS 'Denormalized job title for historical reference and easier querying';

