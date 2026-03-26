-- =====================================================
-- Create Guides Table for DQ Knowledge Center
-- =====================================================
-- Run this FIRST in Supabase SQL Editor
-- =====================================================

-- Create guides table
CREATE TABLE IF NOT EXISTS public.guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  domain TEXT,
  guide_type TEXT,
  function_area TEXT,
  status TEXT DEFAULT 'Approved',
  complexity_level TEXT,
  document_url TEXT,
  image TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS guides_slug_idx ON public.guides (slug);
CREATE INDEX IF NOT EXISTS guides_domain_idx ON public.guides (domain);
CREATE INDEX IF NOT EXISTS guides_guide_type_idx ON public.guides (guide_type);
CREATE INDEX IF NOT EXISTS guides_function_area_idx ON public.guides (function_area);
CREATE INDEX IF NOT EXISTS guides_status_idx ON public.guides (status);

-- Enable Row Level Security
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to approved guides
DROP POLICY IF EXISTS guides_select_approved ON public.guides;
CREATE POLICY guides_select_approved ON public.guides
  FOR SELECT
  USING (status = 'Approved');

-- Create policy for authenticated users to insert/update
DROP POLICY IF EXISTS guides_insert_authenticated ON public.guides;
CREATE POLICY guides_insert_authenticated ON public.guides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS guides_update_authenticated ON public.guides;
CREATE POLICY guides_update_authenticated ON public.guides
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_guides_updated_at ON public.guides;
CREATE TRIGGER update_guides_updated_at
  BEFORE UPDATE ON public.guides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Guides table created successfully!';
  RAISE NOTICE 'Next: Run the sync scripts to populate data';
END $$;
