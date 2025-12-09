-- ============================================================================
-- Work Directory Seed Data
-- Sample data for testing the Work Directory marketplace
-- ============================================================================

-- ===== Sample Work Units =====
INSERT INTO public.work_units (
  id, slug, sector, unit_name, unit_type, mandate, location, 
  focus_tags, department, banner_image_url
) VALUES
(
  'hra-factory',
  'hra-factory',
  'People & Operations',
  'HRA Factory',
  'Factory',
  'Sourcing, onboarding, and developing associates so DQ has the right people, tools, and spaces to perform.',
  'Global',
  ARRAY['Hiring & Onboarding', 'Smart Workplace', 'Performance & QPMS', 'Learning & Growth'],
  'Operations',
  NULL
),
(
  'finance-factory',
  'finance-factory',
  'Operations',
  'Finance Factory',
  'Factory',
  'Driving growth while safeguarding compliance and financial health across DQ.',
  'Global',
  ARRAY['Payroll & Benefits', 'Payables & Receivables', 'Budgeting & Investments'],
  'Operations',
  NULL
),
(
  'deals-factory',
  'deals-factory',
  'Growth & Pipeline',
  'Deals Factory',
  'Factory',
  'Orchestrating the DQ deals pipeline – from campaigns and opportunities to bids and proposals.',
  'Global',
  ARRAY['LeadGen & Campaigns', 'Opportunities & Bids', 'Proposals & Designs'],
  'Operations',
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- ===== Sample Work Positions =====
INSERT INTO public.work_positions (
  id, slug, position_name, hero_title, role_family, unit, unit_slug,
  location, sfia_level, sfia_rating, summary, status, department
) VALUES
(
  'hr-specialist-001',
  'hr-specialist',
  'HR Specialist',
  'Enable Talent Excellence',
  'People & Operations',
  'HRA Factory',
  'hra-factory',
  'Nairobi',
  'L4',
  'L4',
  'Managing associate enablement and workforce performance. Leads talent acquisition and onboarding processes.',
  'Active',
  'Operations'
),
(
  'partner-manager-001',
  'partner-manager',
  'Partner Manager',
  'Build Strategic Alliances',
  'Business Development',
  'Deals Factory',
  'deals-factory',
  'Nairobi',
  'L5',
  'L5',
  'Leading DQ partnerships, business development, and communication growth. Builds strategic alliances that scale impact.',
  'Active',
  'Operations'
)
ON CONFLICT (id) DO NOTHING;

-- ===== Sample Work Associates =====
INSERT INTO public.work_associates (
  id, name, current_role, department, unit, location, sfia_rating,
  status, level, email, key_skills, bio
) VALUES
(
  'assoc-001',
  'Irene Mwangi',
  'HR Specialist',
  'Operations',
  'HRA Factory',
  'Nairobi',
  'L4',
  'Active',
  'L4',
  'irene@dq.workspace',
  ARRAY['Workforce Planning', 'Talent Management', 'Onboarding'],
  'Managing associate enablement and workforce performance. Leads talent acquisition and onboarding processes.'
),
(
  'assoc-002',
  'John Kamau',
  'HR Specialist',
  'Operations',
  'HRA Factory',
  'Nairobi',
  'L4',
  'Active',
  'L4',
  'john@dq.workspace',
  ARRAY['Associate Enablement', 'Performance Management', 'HR Operations'],
  'Drives performance management and workforce operations. Ensures associates thrive through structured enablement.'
),
(
  'assoc-003',
  'SK Omondi',
  'Partner Manager',
  'Operations',
  'Deals Factory',
  'Nairobi',
  'L5',
  'Active',
  'L5',
  'sk@dq.workspace',
  ARRAY['Partnerships', 'Business Development', 'Strategy'],
  'Leading DQ partnerships, business development, and communication growth. Builds strategic alliances that scale impact.'
)
ON CONFLICT (id) DO NOTHING;

