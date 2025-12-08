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

export const JOBS: JobItem[] = [
  /*
  {
    id: 'hr-lead-o2p',
    title: 'HR Lead O2P',
    department: 'HRA (People)',
    roleType: 'HR',
    location: 'Dubai',
    type: 'Full-time',
    seniority: 'Lead',
    sfiaLevel: 'L5',
    summary: "Lead DQ's performance function from onboarding through probation and beyond, driving measurable improvement across the organization.",
    description:
      "Lead DQ's performance function from onboarding through probation and beyond, driving measurable improvement across the organization.",
    responsibilities: [
      'Manage onboarding, probation, and performance evaluation processes',
      'Assess associates against SFIA guidelines',
      'Own and manage ATP scanning and ADP programs',
      'Deliver actionable insights and drive organization-wide performance improvement'
    ],
    requirements: [
      '5+ years of experience in performance management or HR transformation',
      'Proven experience in team leadership and talent development',
      'Strong skills in frameworks, analytics, and data-driven insights',
      'Excellent communication and stakeholder management skills'
    ],
    benefits: [
      'High-impact role shaping performance culture',
      'Direct coaching from HR leadership',
      'Opportunity to own key initiatives and influence across DQ'
    ],
    postedOn: '2025-11-18',
    applyUrl: 'https://dq.example.com/jobs/hr-lead-o2p',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'
  }
  */
  /*
  {
    id: 'senior-delivery-lead',
    title: 'Senior Delivery Lead – Riyadh Customer Squad',
    department: 'Delivery — Deploys',
    roleType: 'Ops',
    location: 'Dubai',
    type: 'Full-time',
    seniority: 'Senior',
    sfiaLevel: 'L5',
    summary: 'Lead multi-disciplinary squads delivering flagship public-sector programs across the region.',
    description:
      'You will coach squads, unblock delivery, and translate executive intent into actionable backlogs for our Riyadh portfolio.',
    responsibilities: [
      'Translate customer KPIs into delivery plans and roadmaps',
      'Facilitate weekly cadences with tech, design, and ops leads',
      'Coach delivery managers on rituals, artifacts, and stakeholder comms'
    ],
    requirements: [
      '8+ years leading digital programs',
      'Experience with agile at-scale practices',
      'Comfortable partnering with senior government stakeholders'
    ],
    benefits: [
      'Competitive compensation with quarterly bonus',
      'Hybrid work model (Dubai studio + remote)',
      'Learning stipend for certifications'
    ],
    postedOn: '2025-11-13',
    applyUrl: 'https://dq.example.com/jobs/senior-delivery-lead',
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'product-designer-mobility',
    title: 'Product Designer – Mobility Programs',
    department: 'Delivery — Designs',
    roleType: 'Design',
    location: 'Remote',
    type: 'Contract',
    seniority: 'Mid',
    sfiaLevel: 'L3',
    summary: 'Design journeys, prototypes, and UI systems for mobility pilots rolling out across DQ studios.',
    description:
      'Work alongside service designers, engineers, and researchers to translate insights into elegant, testable experiences.',
    responsibilities: [
      'Produce journey maps, low-fi flows, and high-fidelity UI screens',
      'Facilitate co-creation workshops with studio partners',
      'Measure outcomes and iterate quickly with delivery squads'
    ],
    requirements: [
      '4+ years product or service design experience',
      'Proficiency in Figma and rapid prototyping tools',
      'Comfortable presenting to senior stakeholders'
    ],
    benefits: [
      '6-month renewable contract',
      'Remote-first with travel stipends',
      'Embedded with multi-disciplinary squads'
    ],
    postedOn: '2025-11-13',
    applyUrl: 'https://dq.example.com/jobs/product-designer-mobility',
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'people-operations-generalist',
    title: 'People Operations Generalist – Colombo Studio',
    department: 'HRA (People)',
    roleType: 'HR',
    location: 'Nairobi',
    type: 'Full-time',
    seniority: 'Junior',
    sfiaLevel: 'L2',
    summary: 'Drive onboarding, rituals, and associate experience programs for our Colombo studio.',
    description:
      'Partner with People Leads to orchestrate onboarding, drive rituals, and support data hygiene for our associate lifecycle.',
    responsibilities: [
      'Coordinate onboarding schedules and buddy assignments',
      'Track associate experience metrics and follow-ups',
      'Support rituals, celebrations, and studio-wide broadcasts'
    ],
    requirements: [
      '2+ years in HR operations or people programs',
      'Strong communication and coordination skills',
      'Comfortable with Airtable, Notion, or similar tooling'
    ],
    benefits: [
      'Studio-based culture with flexible Fridays',
      'Healthcare and wellness coverage',
      'Annual growth stipend'
    ],
    postedOn: '2025-11-13',
    applyUrl: 'https://dq.example.com/jobs/people-operations-generalist',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'secdevops-engineer',
    title: 'SecDevOps Engineer – Platform Reliability',
    department: 'SecDevOps',
    roleType: 'Tech',
    location: 'Dubai',
    type: 'Full-time',
    seniority: 'Mid',
    sfiaLevel: 'L4',
    summary: 'Build guardrails, automation, and monitoring for the DQ Platform reliability stack.',
    description:
      'Join the platform engineering chapter to harden CICD, IaC, and monitoring pipelines that power every DQ product.',
    responsibilities: [
      'Design policy-as-code and automated compliance checks',
      'Improve observability dashboards and on-call response',
      'Partner with squads to uplift secure deployment practices'
    ],
    requirements: [
      '5+ years in DevOps/SRE roles',
      'Experience with Terraform, Kubernetes, and AWS',
      'Security mindset with familiarity in ISO/SOC controls'
    ],
    benefits: [
      'On-call rotation stipend',
      'Dedicated learning days each quarter',
      'Access to global platform guild'
    ],
    postedOn: '2025-11-13',
    applyUrl: 'https://dq.example.com/jobs/secdevops-engineer',
    image: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'studio-ops-lead-internal',
    title: 'Studio Operations Lead – Internal Mobility Pool',
    department: 'DCO Operations',
    roleType: 'Ops',
    location: 'Dubai',
    type: 'Full-time',
    seniority: 'Mid',
    sfiaLevel: 'L4',
    summary: 'Rotate into Studio Ops to run rituals, budgets, and people programs for a new studio without leaving DQ.',
    description:
      'Lead the makers behind each studio launch. You'll inherit an existing playbook and evolve it as you keep the studio humming.',
    responsibilities: [
      'Own the Studio Scorecard and cadence reviews',
      'Coach coordinators on rituals, playbooks, and governance',
      'Partner with Finance & HRA to land headcount and budgets'
    ],
    requirements: [
      '3+ years running internal programs or chapters',
      'Evidence of SFIA L4 behaviours in current role',
      'Confidence working across finance, delivery, and people partners'
    ],
    benefits: [
      'Internal move with personalized ramp plan',
      'Priority coaching support from DCO Ops guild',
      'Option to rotate back to previous craft after 12 months'
    ],
    postedOn: '2025-11-13',
    applyUrl: 'https://dq.example.com/jobs/studio-ops-lead',
    image: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'experience-strategist-internal',
    title: 'Experience Strategist – Culture & People',
    department: 'HRA (People)',
    roleType: 'Design',
    location: 'Remote',
    type: 'Part-time',
    seniority: 'Mid',
    sfiaLevel: 'L3',
    summary: 'Switch lanes into People Experience and help design rituals, comms, and toolkits for every team.',
    description:
      'Join the Experience Design pod inside HRA to map associate journeys, stand up campaigns, and bring clarity to every stage of the lifecycle.',
    responsibilities: [
      'Audit existing rituals and identify the pain points that matter most',
      'Prototype internal comms, toolkits, and facilitation guides',
      'Partner with operations to scale improvements across studios'
    ],
    requirements: [
      'Internal DQ experience in design, comms, or delivery',
      'Strong writing and facilitation skills',
      'Comfortable presenting concepts to leadership'
    ],
    benefits: [
      'Part-time rotation (60%) while staying in your current guild',
      'Access to HRA research library and coaching squad',
      'Option to extend to full-time after pilot period'
    ],
    postedOn: '2025-11-13',
    applyUrl: 'https://dq.example.com/jobs/experience-strategist-internal',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'platform-analyst-internal',
    title: 'Platform Analyst – DBP Internal Transfer',
    department: 'DBP Platform',
    roleType: 'Tech',
    location: 'Nairobi',
    type: 'Full-time',
    seniority: 'Junior',
    sfiaLevel: 'L2',
    summary: 'Move from delivery into platform to support automation, dashboards, and runbooks.',
    description:
      'Support the DBP Platform team with analytics, automation, and day-to-day enablement. Ideal for associates seeking to pair delivery experience with platform craft.',
    responsibilities: [
      'Maintain Notion and Airtable sources of truth for DBP',
      'Automate recurring updates and reporting cadences',
      'Document platform runbooks for future rotations'
    ],
    requirements: [
      '1-2 years inside DQ delivery or operations team',
      'Comfort with Airtable, automation scripts, or similar tools',
      'Strong appetite to learn SFIA L3 behaviours over time'
    ],
    benefits: [
      'On-the-job coaching from Platform Enablement leads',
      'Structured learning path to level up SFIA behaviours',
      'Access to DBP community events and guilds'
    ],
    postedOn: '2025-11-13',
    applyUrl: 'https://dq.example.com/jobs/platform-analyst-internal',
    image: 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'riyadh-customer-journey-lead',
    title: 'Customer Journey Lead – Riyadh Flagship Programs',
    department: 'Delivery — Deploys',
    roleType: 'Ops',
    location: 'Riyadh',
    type: 'Full-time',
    seniority: 'Senior',
    sfiaLevel: 'L4',
    summary: 'Rotate into the Riyadh flagship portfolio to orchestrate cross-functional squads and keep executive stakeholders aligned.',
    description:
      'This internal posting is for experienced Delivery Leads who want to relocate or embed in Riyadh for 12-18 months, guiding squads that ship citizen and enterprise services.',
    responsibilities: [
      'Translate executive OKRs into clear roadmaps with Product and Platform partners',
      'Coach squads on rituals, governance, and reporting cadences',
      'Interface with Riyadh-based regulators and partners to unblock delivery'
    ],
    requirements: [
      'Currently at SFIA L3+ with evidence of L4 behaviours',
      'Experience leading multi-squad programs inside DQ',
      'Ready to spend time onsite in Riyadh each quarter'
    ],
    benefits: [
      'Mobility support and relocation stipend',
      'Dedicated sponsor inside Riyadh leadership circle',
      'Return-to-studio reintegration plan after the rotation'
    ],
    postedOn: '2025-11-13',
    applyUrl: 'https://dq.example.com/jobs/riyadh-customer-journey-lead',
    image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80'
  }
  */
];
