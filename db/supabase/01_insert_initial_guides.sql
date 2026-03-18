-- =====================================================
-- Insert Initial Guide Records
-- =====================================================
-- Run this AFTER creating the guides table
-- This creates the base records that sync scripts will update
-- =====================================================

-- Insert base guide records (empty content, will be populated by sync scripts)
INSERT INTO public.guides (slug, title, status, guide_type, domain)
VALUES
  ('dq-vision', 'DQ Vision & Mission', 'Approved', 'Strategy', 'GHC'),
  ('dq-hov', 'House of Values', 'Approved', 'Strategy', 'GHC'),
  ('dq-persona', 'DQ Persona', 'Approved', 'Strategy', 'GHC'),
  ('dq-ghc-overview', 'GHC Overview', 'Approved', 'Strategy', 'GHC'),
  ('dq-agile-tms', 'Agile TMS', 'Approved', 'Strategy', 'Agile'),
  ('dq-agile-sos', 'Agile SoS', 'Approved', 'Strategy', 'Agile'),
  ('dq-agile-flows', 'Agile Flows', 'Approved', 'Strategy', 'Agile'),
  ('dq-agile-6xd', 'Agile 6xD', 'Approved', 'Strategy', 'Agile')
ON CONFLICT (slug) DO NOTHING;

-- Verify insertion
SELECT slug, title, status, guide_type, domain
FROM public.guides
WHERE slug IN (
  'dq-vision',
  'dq-hov',
  'dq-persona',
  'dq-ghc-overview',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd'
)
ORDER BY slug;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Initial guide records created!';
  RAISE NOTICE 'Next: Run the sync scripts to populate content';
  RAISE NOTICE '  - sync_dq_vision_to_supabase.sql';
  RAISE NOTICE '  - sync_dq_hov_to_supabase.sql';
  RAISE NOTICE '  - sync_dq_persona_to_supabase.sql';
  RAISE NOTICE '  - sync_dq_ghc_overview_to_supabase.sql';
  RAISE NOTICE '  - sync_dq_agile_tms_to_supabase.sql';
  RAISE NOTICE '  - sync_dq_agile_sos_to_supabase.sql';
  RAISE NOTICE '  - sync_dq_agile_flows_to_supabase.sql';
  RAISE NOTICE '  - sync_dq_agile_6xd_to_supabase.sql';
END $$;
