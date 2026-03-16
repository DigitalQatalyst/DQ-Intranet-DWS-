-- ============================================================================
-- Seed Data: Job Openings (Job Openings / Opportunities tab)
-- Populates public.jobs with items from src/data/media/jobs.ts.
-- Structure matches JobItem type and public.jobs schema.
-- ============================================================================

INSERT INTO public.jobs (
  id, title, department, role_type, location, type, seniority, sfia_level,
  summary, description, responsibilities, requirements, benefits,
  posted_on, apply_url, image
) VALUES
-- Example job: HR Lead O2P
(
  'hr-lead-o2p',
  'HR Lead O2P',
  'HRA (People)',
  'HR',
  'Dubai',
  'Full-time',
  'Lead',
  'L5',
  'Lead DQ''s performance function from onboarding through probation and beyond, driving measurable improvement across the organization.',
  'Lead DQ''s performance function from onboarding through probation and beyond, driving measurable improvement across the organization.',
  ARRAY[
    'Manage onboarding, probation, and performance evaluation processes',
    'Assess associates against SFIA guidelines',
    'Own and manage ATP scanning and ADP programs',
    'Deliver actionable insights and drive organization-wide performance improvement'
  ],
  ARRAY[
    '5+ years of experience in performance management or HR transformation',
    'Proven experience in team leadership and talent development',
    'Strong skills in frameworks, analytics, and data-driven insights',
    'Excellent communication and stakeholder management skills'
  ],
  ARRAY[
    'High-impact role shaping performance culture',
    'Direct coaching from HR leadership',
    'Opportunity to own key initiatives and influence across DQ'
  ],
  '2025-11-18',
  'https://dq.example.com/jobs/hr-lead-o2p',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  department = EXCLUDED.department,
  role_type = EXCLUDED.role_type,
  location = EXCLUDED.location,
  type = EXCLUDED.type,
  seniority = EXCLUDED.seniority,
  sfia_level = EXCLUDED.sfia_level,
  summary = EXCLUDED.summary,
  description = EXCLUDED.description,
  responsibilities = EXCLUDED.responsibilities,
  requirements = EXCLUDED.requirements,
  benefits = EXCLUDED.benefits,
  posted_on = EXCLUDED.posted_on,
  apply_url = EXCLUDED.apply_url,
  image = EXCLUDED.image,
  updated_at = NOW();

-- TODO: Add additional INSERT statements here for any future job openings
-- that should appear under the Job Openings / Opportunities tab.
