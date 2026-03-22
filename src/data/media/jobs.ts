export type JobItem = {
  id: string;
  title: string;
  department: string;
  roleType: 'Tech' | 'Design' | 'Ops' | 'Finance' | 'HR';
  location: 'Dubai' | 'Nairobi' | 'Riyadh' | 'Remote';
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  seniority: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  sfiaLevel: 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7';
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  postedOn: string;
  applyUrl?: string;
  image?: string;
};

export const SFIA_LEVELS: Record<JobItem['sfiaLevel'], { label: string; detail: string }> = {
  L0: { label: 'L0 · Starting', detail: 'Learning' },
  L1: { label: 'L1 · Follow', detail: 'Self Aware' },
  L2: { label: 'L2 · Assist', detail: 'Self Lead' },
  L3: { label: 'L3 · Apply', detail: 'Drive Squad' },
  L4: { label: 'L4 · Enable', detail: 'Drive Team' },
  L5: { label: 'L5 · Ensure', detail: 'Steer Org' },
  L6: { label: 'L6 · Influence', detail: 'Steer Cross' },
  L7: { label: 'L7 · Inspire', detail: 'Inspire Market' }
};

/*
 * Legacy hardcoded job data (now replaced by Supabase-backed public.jobs).
 * Keeping this block commented out for reference and potential future seeding.
 */
// export const JOBS: JobItem[] = [
//   {
//     id: 'hr-lead-o2p',
//     title: 'HR Lead O2P',
//     department: 'HRA (People)',
//     roleType: 'HR',
//     location: 'Dubai',
//     type: 'Full-time',
//     seniority: 'Lead',
//     sfiaLevel: 'L5',
//     summary: "Lead DQ's performance function from onboarding through probation and beyond, driving measurable improvement across the organization.",
//     description:
//       "Lead DQ's performance function from onboarding through probation and beyond, driving measurable improvement across the organization.",
//     responsibilities: [
//       'Manage onboarding, probation, and performance evaluation processes',
//       'Assess associates against SFIA guidelines',
//       'Own and manage ATP scanning and ADP programs',
//       'Deliver actionable insights and drive organization-wide performance improvement'
//     ],
//     requirements: [
//       '5+ years of experience in performance management or HR transformation',
//       'Proven experience in team leadership and talent development',
//       'Strong skills in frameworks, analytics, and data-driven insights',
//       'Excellent communication and stakeholder management skills'
//     ],
//     benefits: [
//       'High-impact role shaping performance culture',
//       'Direct coaching from HR leadership',
//       'Opportunity to own key initiatives and influence across DQ'
//     ],
//     postedOn: '2025-11-18',
//     applyUrl: 'https://dq.example.com/jobs/hr-lead-o2p',
//     image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'
//   }
// ];
