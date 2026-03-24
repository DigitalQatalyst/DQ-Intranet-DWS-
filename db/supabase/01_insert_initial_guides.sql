-- =====================================================
-- Insert Initial Guide Records
-- =====================================================
-- Run this AFTER creating the guides table
-- This creates the base records that sync scripts will update
-- =====================================================

-- Define constants to avoid string duplication
DO $$
DECLARE
  v_strategy_status CONSTANT VARCHAR := 'Approved';
  v_strategy_type CONSTANT VARCHAR := 'Strategy';
BEGIN
  -- Insert base guide records (empty content, will be populated by sync scripts)
  INSERT INTO public.guides (slug, title, status, guide_type, domain)
  VALUES
    ('dq-vision', 'DQ Vision & Mission', v_strategy_status, v_strategy_type, 'GHC'),
    ('dq-hov', 'House of Values', v_strategy_status, v_strategy_type, 'GHC'),
    ('dq-persona', 'DQ Persona', v_strategy_status, v_strategy_type, 'GHC'),
    ('dq-ghc-overview', 'GHC Overview', v_strategy_status, v_strategy_type, 'GHC'),
    ('dq-agile-tms', 'Agile TMS', v_strategy_status, v_strategy_type, 'Agile'),
    ('dq-agile-sos', 'Agile SoS', v_strategy_status, v_strategy_type, 'Agile'),
    ('dq-agile-flows', 'Agile Flows', v_strategy_status, v_strategy_type, 'Agile'),
    ('dq-agile-6xd', 'Agile 6xD', v_strategy_status, v_strategy_type, 'Agile')
  ON CONFLICT (slug) DO NOTHING;
END $$;

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
