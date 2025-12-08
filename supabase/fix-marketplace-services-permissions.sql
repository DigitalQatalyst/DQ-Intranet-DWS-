-- ============================================================================
-- Fix Marketplace Services Permissions
-- Run this after the main migration to allow service_role access
-- ============================================================================

-- Update RLS Policies to include service_role
DROP POLICY IF EXISTS services_insert ON public.marketplace_services;
DROP POLICY IF EXISTS services_update ON public.marketplace_services;
DROP POLICY IF EXISTS services_delete ON public.marketplace_services;

-- Allow authenticated users and service_role to insert
CREATE POLICY services_insert ON public.marketplace_services 
  FOR INSERT 
  TO authenticated, service_role
  WITH CHECK (true);

-- Allow authenticated users and service_role to update
CREATE POLICY services_update ON public.marketplace_services 
  FOR UPDATE 
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users and service_role to delete
CREATE POLICY services_delete ON public.marketplace_services 
  FOR DELETE 
  TO authenticated, service_role
  USING (true);

-- Update Grants to include service_role
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT ON public.marketplace_services TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.marketplace_services TO service_role;

