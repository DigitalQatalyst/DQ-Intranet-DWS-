-- Fix schema-level permissions for Supabase
-- Run this in Supabase SQL Editor

-- Grant usage on schema to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- Grant all on guides table
GRANT ALL ON public.guides TO anon;
GRANT ALL ON public.guides TO authenticated;
GRANT ALL ON public.guides TO service_role;

-- Grant on related tables if they exist
GRANT ALL ON public.guide_attachments TO anon, authenticated, service_role;
GRANT ALL ON public.guide_templates TO anon, authenticated, service_role;
GRANT ALL ON public.guide_steps TO anon, authenticated, service_role;

-- Verify the RLS policy exists and is correct
DO $$
BEGIN
  -- Drop and recreate to ensure it's correct
  DROP POLICY IF EXISTS guides_select_approved ON public.guides;
  
  CREATE POLICY guides_select_approved ON public.guides
    FOR SELECT 
    USING (status = 'Approved');
    
  RAISE NOTICE 'Policy guides_select_approved created/updated';
END $$;

-- Check current policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'guides';

