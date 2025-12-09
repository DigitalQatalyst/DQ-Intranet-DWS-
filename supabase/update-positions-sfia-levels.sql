-- ============================================================================
-- Update SFIA Levels for All Work Positions
-- Based on the provided SFIA level mapping
-- ============================================================================

-- Leadership / Delivery Roles
UPDATE public.work_positions SET sfia_level = 'L7' WHERE position_name = 'Tower Lead';
UPDATE public.work_positions SET sfia_level = 'L6' WHERE position_name = 'Factory Lead';
UPDATE public.work_positions SET sfia_level = 'L6' WHERE position_name = 'Sector Lead';
UPDATE public.work_positions SET sfia_level = 'L5' WHERE position_name = 'Unit Lead';
UPDATE public.work_positions SET sfia_level = 'L4' WHERE position_name = 'Delivery Lead';
UPDATE public.work_positions SET sfia_level = 'L4' WHERE position_name = 'Project Manager';
UPDATE public.work_positions SET sfia_level = 'L3' WHERE position_name = 'Section Scrum Master';

-- Scrum Masters (all L3)
UPDATE public.work_positions SET sfia_level = 'L3' WHERE position_name = 'Scrum Master';

-- Product & Analysis Roles
UPDATE public.work_positions SET sfia_level = 'L3' WHERE position_name = 'Product Owner'; -- L3 / L4, using L3 as primary
UPDATE public.work_positions SET sfia_level = 'L2' WHERE position_name = 'Business Analyst'; -- L2 / L3, using L2 as primary
UPDATE public.work_positions SET sfia_level = 'L2' WHERE position_name = 'Insight Specialist';
UPDATE public.work_positions SET sfia_level = 'L2' WHERE position_name = 'Operations Analyst'; -- L2 / L3, using L2 as primary

-- Engineering / Developers (all L2 except where specified)
UPDATE public.work_positions SET sfia_level = 'L2' WHERE position_name = 'Frontend Developer';
UPDATE public.work_positions SET sfia_level = 'L2' WHERE position_name = 'Backend Developer';
UPDATE public.work_positions SET sfia_level = 'L2' WHERE position_name = 'Full-Stack Developer';
UPDATE public.work_positions SET sfia_level = 'L2' WHERE position_name = 'Feature Developer';
UPDATE public.work_positions SET sfia_level = 'L2' WHERE position_name = 'Functionality Developer';
UPDATE public.work_positions SET sfia_level = 'L1' WHERE position_name = 'Endpoint Developer';
UPDATE public.work_positions SET sfia_level = 'L1' WHERE position_name = 'CRM Engineer';
UPDATE public.work_positions SET sfia_level = 'L1' WHERE position_name = 'AI Developer';
UPDATE public.work_positions SET sfia_level = 'L1' WHERE position_name = 'Automation Engineer'; -- L1 / L2, using L1 as primary
UPDATE public.work_positions SET sfia_level = 'L2' WHERE position_name = 'Solution Engineer';
UPDATE public.work_positions SET sfia_level = 'L4' WHERE position_name = 'Enterprise Architect';

-- Operations / Support / Platform
UPDATE public.work_positions SET sfia_level = 'L1' WHERE position_name = 'TechOps Analyst';
UPDATE public.work_positions SET sfia_level = 'L1' WHERE position_name = 'Support Analyst';
UPDATE public.work_positions SET sfia_level = 'L2' WHERE position_name = 'Operations Analyst'; -- L2 / L3, using L2 as primary
UPDATE public.work_positions SET sfia_level = 'L1' WHERE position_name = 'IT Support Analyst';
UPDATE public.work_positions SET sfia_level = 'L1' WHERE position_name = 'Platforms & Operations Developer'; -- L1 / L2, using L1 as primary
UPDATE public.work_positions SET sfia_level = 'L0' WHERE position_name = 'Admin Analyst'; -- L0 / L1, using L0 as primary

-- Data Roles
UPDATE public.work_positions SET sfia_level = 'L0' WHERE position_name = 'Data Analyst'; -- L0 / L1, using L0 as primary
UPDATE public.work_positions SET sfia_level = 'L1' WHERE position_name = 'Data Engineer'; -- L1 / L2, using L1 as primary
UPDATE public.work_positions SET sfia_level = 'L2' WHERE position_name = 'Insight Specialist'; -- Already set above, but this is the Intelligence Analyst equivalent

-- Business / Marketing / HR
UPDATE public.work_positions SET sfia_level = 'L1' WHERE position_name = 'BD Analyst';
UPDATE public.work_positions SET sfia_level = 'L2' WHERE position_name = 'BD Executive'; -- L2 / L3, using L2 as primary
UPDATE public.work_positions SET sfia_level = 'L0' WHERE position_name = 'Digital Marketer'; -- L0 / L1, using L0 as primary
UPDATE public.work_positions SET sfia_level = 'L1' WHERE position_name = 'Content Analyst';
UPDATE public.work_positions SET sfia_level = 'L1' WHERE position_name = 'Content Specialist';
UPDATE public.work_positions SET sfia_level = 'L1' WHERE position_name = 'HR Analyst';

-- Additional positions that might exist
UPDATE public.work_positions SET sfia_level = 'L2' WHERE position_name = 'Business Development Lead'; -- Assuming L2 / L3 like BD Executive

-- Verify updates
SELECT 
  position_name,
  sfia_level,
  role_family
FROM public.work_positions
WHERE sfia_level IS NOT NULL
ORDER BY 
  CASE sfia_level
    WHEN 'L0' THEN 0
    WHEN 'L1' THEN 1
    WHEN 'L2' THEN 2
    WHEN 'L3' THEN 3
    WHEN 'L4' THEN 4
    WHEN 'L5' THEN 5
    WHEN 'L6' THEN 6
    WHEN 'L7' THEN 7
    ELSE 99
  END,
  position_name;

-- Count by level
SELECT 
  sfia_level,
  COUNT(*) as position_count
FROM public.work_positions
WHERE sfia_level IS NOT NULL
GROUP BY sfia_level
ORDER BY sfia_level;

