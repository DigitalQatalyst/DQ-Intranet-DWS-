-- ============================================================================
-- Marketplace Services Schema
-- Stores financial and non-financial services for the marketplace
-- ============================================================================

-- ===== Services Table =====
-- Unified table for both financial and non-financial services
DROP TABLE IF EXISTS public.marketplace_services CASCADE;

CREATE TABLE public.marketplace_services (
  id text PRIMARY KEY,
  marketplace_type text NOT NULL CHECK (marketplace_type IN ('financial', 'non-financial')),
  title text NOT NULL,
  description text NOT NULL,
  category text,
  service_type text,
  business_stage text,
  delivery_mode text,
  
  -- Financial service specific fields
  amount text,
  duration text,
  interest_rate text,
  eligibility text,
  
  -- Non-financial service specific fields
  price text,
  
  -- Provider information (stored as JSONB for flexibility)
  provider jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  -- Common fields
  details text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  image_url text,
  
  -- Metadata
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived'))
);

-- ===== Indexes for Performance =====
CREATE INDEX idx_services_marketplace_type ON public.marketplace_services(marketplace_type);
CREATE INDEX idx_services_category ON public.marketplace_services(category) WHERE category IS NOT NULL;
CREATE INDEX idx_services_service_type ON public.marketplace_services(service_type) WHERE service_type IS NOT NULL;
CREATE INDEX idx_services_business_stage ON public.marketplace_services(business_stage) WHERE business_stage IS NOT NULL;
CREATE INDEX idx_services_status ON public.marketplace_services(status);
CREATE INDEX idx_services_tags ON public.marketplace_services USING gin(tags);
CREATE INDEX idx_services_provider ON public.marketplace_services USING gin(provider);

-- Full-text search index
CREATE INDEX idx_services_search ON public.marketplace_services 
  USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

-- ===== Functions =====
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===== Triggers =====
-- Auto-update updated_at
CREATE TRIGGER update_marketplace_services_updated_at
  BEFORE UPDATE ON public.marketplace_services
  FOR EACH ROW
  EXECUTE FUNCTION update_services_updated_at();

-- ===== Row Level Security (RLS) =====
ALTER TABLE public.marketplace_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow public read access for active services
CREATE POLICY services_select ON public.marketplace_services 
  FOR SELECT 
  USING (status = 'active');

-- Allow authenticated users to insert
CREATE POLICY services_insert ON public.marketplace_services 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY services_update ON public.marketplace_services 
  FOR UPDATE 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY services_delete ON public.marketplace_services 
  FOR DELETE 
  TO authenticated
  USING (true);

-- ===== Grants =====
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.marketplace_services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.marketplace_services TO authenticated;

-- ===== Comments for Documentation =====
COMMENT ON TABLE public.marketplace_services IS 'Financial and non-financial services for the marketplace';
COMMENT ON COLUMN public.marketplace_services.marketplace_type IS 'Type of marketplace: financial or non-financial';
COMMENT ON COLUMN public.marketplace_services.provider IS 'Provider information stored as JSONB: {name, logoUrl, description}';
COMMENT ON COLUMN public.marketplace_services.details IS 'Array of service details/features';
COMMENT ON COLUMN public.marketplace_services.tags IS 'Array of tags for categorization and filtering';


