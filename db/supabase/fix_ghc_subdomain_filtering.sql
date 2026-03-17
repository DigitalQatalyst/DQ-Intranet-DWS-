-- Fix GHC Filtering: Update all GHC guides to include 'ghc' in sub_domain
-- This ensures all GHC guides appear when filtering by "GHC" framework

-- GHC Core Elements (7 main guides)
UPDATE public.guides
SET sub_domain = 'ghc'
WHERE slug IN (
  'dq-ghc',           -- Overview
  'dq-vision',         -- Vision (Purpose)
  'dq-hov',            -- House of Values (Culture)
  'dq-persona',        -- Persona (Identity)
  'dq-agile-tms',      -- Agile TMS (Tasks)
  'dq-agile-sos',      -- Agile SoS (Governance)
  'dq-agile-flows',    -- Agile Flows (Value Streams)
  'dq-agile-6xd'       -- Agile 6xD (Products)
);

-- GHC Competencies (HOV values) - include 'ghc' so they appear in GHC filter
UPDATE public.guides
SET sub_domain = CASE 
  WHEN sub_domain IS NULL OR sub_domain = '' THEN 'ghc,competencies'
  WHEN sub_domain NOT LIKE '%ghc%' THEN sub_domain || ',ghc,competencies'
  WHEN sub_domain NOT LIKE '%competencies%' THEN sub_domain || ',competencies'
  ELSE sub_domain
END
WHERE slug IN (
  'dq-competencies-trust',
  'dq-competencies-customer',
  'dq-competencies-learning',
  'dq-competencies-responsibility',
  'dq-competencies-growth-mindset',
  'dq-competencies-precision',
  'dq-competencies-perseverance'
);

-- Verify the updates
SELECT 
  slug,
  title,
  sub_domain,
  domain,
  CASE 
    WHEN sub_domain LIKE '%ghc%' THEN '✅ Will show in GHC filter'
    ELSE '❌ Will NOT show in GHC filter'
  END as filter_status
FROM public.guides
WHERE slug IN (
  'dq-ghc',
  'dq-vision',
  'dq-hov',
  'dq-persona',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd',
  'dq-competencies-trust',
  'dq-competencies-customer',
  'dq-competencies-learning',
  'dq-competencies-responsibility',
  'dq-competencies-growth-mindset',
  'dq-competencies-precision',
  'dq-competencies-perseverance'
)
ORDER BY 
  CASE 
    WHEN slug = 'dq-ghc' THEN 1
    WHEN slug LIKE 'dq-competencies-%' THEN 3
    ELSE 2
  END,
  slug;
