import { LOCATION_ALLOW, LEVELS, LevelCode } from '@/lms/config';
import {
  levelLabelFromCode,
  levelShortLabelFromCode
} from '@/lms/levels';

const allowedLocations = new Set<string>(LOCATION_ALLOW as readonly string[]);

const cleanLocations = (values?: string[]) => {
  const list = (values || []).filter(value => allowedLocations.has(value));
  return list.length ? list : ['Global'];
};

const LEVEL_CODE_SET = new Set<LevelCode>(LEVELS.map(level => level.code));

const L = (code: string): LevelCode => {
  const normalized = code.toUpperCase() as LevelCode;
  return LEVEL_CODE_SET.has(normalized) ? normalized : 'L1';
};

export type LmsDetail = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  courseCategory: string;
  deliveryMode: 'Video' | 'Guide' | 'Workshop' | 'Hybrid' | 'Online';
  duration: 'Bite-size' | 'Short' | 'Medium' | 'Long';
  levelCode: LevelCode;
  department: string[];
  locations: string[];
  audience: Array<'Associate' | 'Lead'>;
  status: 'live' | 'coming-soon';
  summary: string;
  highlights: string[];
  outcomes: string[];
};

const details: Omit<LmsDetail, 'locations'> & { locations: string[] }[] = [
  {
    id: 'dq-essentials',
    slug: 'dq-essentials',
    title: 'DQ Essentials: How DQ Works',
    provider: 'DQ LMS',
    courseCategory: 'Day in DQ',
    deliveryMode: 'Video',
    duration: 'Short',
    levelCode: L('L1'),
    department: ['DCO'],
    locations: ['Global'],
    audience: ['Associate', 'Lead'],
    status: 'live',
    summary:
      "Orientation to DQ's mission, structure, and the operating models that shape everyday work.",
    highlights: [
      "Understand DQ's vision, DNA, and operating rhythms",
      'See how GHC and 6xD connect to daily delivery',
      'Know where to find core guidelines and help'
    ],
    outcomes: [
      "Explain DQ's mission and how teams align to it",
      'Navigate Learning Center, Guidelines, and Requests',
      'Identify your next learning steps by role and level',
      'Apply essentials in your first projects'
    ]
  },
  {
    id: 'ghc-primer',
    slug: 'ghc-primer',
    title: 'GHC Primer: Collaboration & Delivery',
    provider: 'DQ LMS',
    courseCategory: 'GHC',
    deliveryMode: 'Guide',
    duration: 'Short',
    levelCode: L('L2'),
    department: ['DCO'],
    locations: ['Global'],
    audience: ['Associate'],
    status: 'live',
    summary:
      'Golden Honeycomb Competences (GHC) that enable teaming, agile delivery, and culture at DQ.',
    highlights: [
      'GHC overview: pillars and language',
      '7S, SoS, and DTMF at a glance',
      'Real examples from DQ initiatives'
    ],
    outcomes: [
      'Describe each GHC pillar and its intent',
      'Map 7S/SoS practices to your team rituals',
      'Use DTMF for planning and retros',
      'Choose the next GHC module to go deeper'
    ]
  },
  {
    id: 'sixx-digital',
    slug: 'sixx-digital',
    title: '6x Digital: Transformation Framework',
    provider: 'DQ LMS',
    courseCategory: '6x Digital',
    deliveryMode: 'Video',
    duration: 'Medium',
    levelCode: L('L3'),
    department: ['DBP'],
    locations: ['Global'],
    audience: ['Associate', 'Lead'],
    status: 'live',
    summary:
      'Explore D1–D6: the six perspectives we use to scope, govern, and deliver transformation.',
    highlights: [
      'D1–D6 overview with simple visuals',
      'Where DTMP/DTMB/DTMA fit',
      'Link 6xD to portfolio and delivery'
    ],
    outcomes: [
      'Explain the purpose of each D (D1–D6)',
      'Relate 6xD to your initiative lifecycle',
      'Pick the right artefacts for each phase',
      'Plan next learning in the D6 product set'
    ]
  },
  {
    id: 'dws-tools',
    slug: 'dws-tools',
    title: 'Working in DWS: Tools & Daily Flow',
    provider: 'DQ LMS',
    courseCategory: 'DWS',
    deliveryMode: 'Hybrid',
    duration: 'Long',
    levelCode: L('L4'),
    department: ['DBP'],
    locations: ['Remote'],
    audience: ['Associate'],
    status: 'live',
    summary:
      'Hands-on walkthrough of planners, dashboards, and request flows inside Digital Workspace Services.',
    highlights: [
      'Daily flow: plan → execute → review',
      'Requests hub, trackers, and dashboards',
      'Tips for speed and quality in DWS'
    ],
    outcomes: [
      'Run your day in DWS with confidence',
      'Use standardized requests and templates',
      'Read status from dashboards and reports',
      'Troubleshoot common blockers fast'
    ]
  },
  {
    id: 'dxp-basics',
    slug: 'dxp-basics',
    title: 'DXP Basics: Content & Components',
    provider: 'DQ LMS',
    courseCategory: 'DXP',
    deliveryMode: 'Guide',
    duration: 'Medium',
    levelCode: L('L2'),
    department: ['DBP'],
    locations: ['Dubai'],
    audience: ['Associate'],
    status: 'live',
    summary:
      'Composable content, blueprints, and product patterns in the DQ Experience Platform.',
    highlights: [
      'Core content types and relationships',
      'Reusable components and patterns',
      'Blueprint-first delivery approach'
    ],
    outcomes: [
      'Model content with the right types',
      'Assemble pages using approved components',
      'Follow blueprint conventions for reuse',
      'Plan a safe DXP change and release'
    ]
  },
  {
    id: 'git-vercel',
    slug: 'git-vercel',
    title: 'Key Tools: Git & Vercel for DQ Projects',
    provider: 'DQ LMS',
    courseCategory: 'Key Tools',
    deliveryMode: 'Video',
    duration: 'Short',
    levelCode: L('L5'),
    department: ['DBP'],
    locations: ['Dubai'],
    audience: ['Associate'],
    status: 'live',
    summary:
      "DQ's way of branching, committing, reviewing, and deploying with Vercel.",
    highlights: [
      'Branch strategy and commit hygiene',
      'PR reviews with guardrails',
      'Preview deployments on Vercel'
    ],
    outcomes: [
      'Create clean branches and atomic commits',
      'Run PR reviews with required checks',
      'Trigger preview/live deploys safely',
      'Rollback and hotfix with confidence'
    ]
  },
  {
    id: 'cursor-ai',
    slug: 'cursor-ai',
    title: 'Cursor AI for Daily Dev',
    provider: 'DQ LMS',
    courseCategory: 'Key Tools',
    deliveryMode: 'Video',
    duration: 'Short',
    levelCode: L('L3'),
    department: ['DBP'],
    locations: ['Remote'],
    audience: ['Associate'],
    status: 'live',
    summary:
      'Use Cursor AI to accelerate delivery with safe prompts, reviews, and automation.',
    highlights: [
      'Prompt patterns for code and tests',
      'Refactor and review with guardrails',
      'Generate docs and changelogs'
    ],
    outcomes: [
      'Write effective development prompts',
      'Scale reviews with AI responsibly',
      'Automate repetitive repo tasks',
      'Document changes as you code'
    ]
  },
  {
    id: 'first-7-days',
    slug: 'first-7-days',
    title: 'Your First 7 Days at DQ',
    provider: 'DQ LMS',
    courseCategory: 'Day in DQ',
    deliveryMode: 'Guide',
    duration: 'Medium',
    levelCode: L('L1'),
    department: ['DCO'],
    locations: ['Global'],
    audience: ['Associate'],
    status: 'live',
    summary:
      'Seven-day onboarding sprint that blends culture, delivery basics, and workspace tooling for every new joiner.',
    highlights: [
      'Day-by-day starter plan',
      'Core tools checklist',
      "Meetings and rituals you'll use"
    ],
    outcomes: [
      'Complete the onboarding sprint',
      'Set up tools and access correctly',
      'Deliver a small task with guidance',
      'Book your next learning modules'
    ]
  },
  {
    id: 'governance-lite',
    slug: 'governance-lite',
    title: 'Governance Lite: DCO & DBP Policies',
    provider: 'DQ LMS',
    courseCategory: 'GHC',
    deliveryMode: 'Guide',
    duration: 'Short',
    levelCode: L('L2'),
    department: ['DCO', 'DBP'],
    locations: ['Global'],
    audience: ['Associate', 'Lead'],
    status: 'live',
    summary:
      'Lead-level governance kit for running reviews, managing risk, and aligning delivery to the mission.',
    highlights: [
      "Lightweight governance you'll actually use",
      'Reviews, approvals, and exceptions',
      'Where to find official templates'
    ],
    outcomes: [
      'Apply the right review at the right time',
      'Document decisions and exceptions',
      'Use approved templates and trackers',
      'Reduce risk while keeping speed'
    ]
  }
];

export const LMS_COURSE_DETAILS: LmsDetail[] = details.map(detail => ({
  ...detail,
  locations: cleanLocations(detail.locations)
}));

export type LmsCard = {
  id: string;
  slug: string;
  title: string;
  provider: string;
  courseCategory: string;
  deliveryMode: string;
  duration: string;
  levelCode: LevelCode;
  levelLabel: string;
  levelShortLabel: string;
  locations: string[];
  audience: string[];
  status: string;
  summary: string;
  department: string[];
};

export const LMS_COURSES: LmsCard[] = LMS_COURSE_DETAILS.map(detail => ({
  id: detail.id,
  slug: detail.slug,
  title: detail.title,
  provider: detail.provider,
  courseCategory: detail.courseCategory,
  deliveryMode: detail.deliveryMode,
  duration: detail.duration,
  levelCode: detail.levelCode,
  levelLabel: levelLabelFromCode(detail.levelCode),
  levelShortLabel: levelShortLabelFromCode(detail.levelCode),
  locations: detail.locations,
  audience: detail.audience,
  status: detail.status,
  summary: detail.summary,
  department: detail.department
}));
