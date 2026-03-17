import { LevelCode } from '@/lms/config';
import {
  levelLabelFromCode,
  levelShortLabelFromCode
} from '@/lms/levels';

export type DeliveryMode = 'Video' | 'Guide' | 'Workshop' | 'Hybrid' | 'Online';

export type DurationBucket = 'Bite-size' | 'Short' | 'Medium' | 'Long';

export type Department = 'DCO' | 'DBP' | 'HR' | 'IT' | 'Finance';

export type Audience = 'Associate' | 'Lead';

export type CourseLevel =
  | 'Foundation'
  | 'Practitioner'
  | 'Professional'
  | 'Specialist';

export type Location = 'Riyadh' | 'Dubai' | 'Nairobi' | 'Remote';

export type CourseCategory =
  | 'GHC'
  | '6xD'
  | 'DWS'
  | 'DXP'
  | 'Day in DQ'
  | 'Key Tools';

export type CourseStatus = 'Live' | 'Coming Soon';

export interface LmsItem {
  id: string;
  title: string;
  summary: string;
  provider: string;
  courseCategory: CourseCategory;
  deliveryMode: DeliveryMode;
  duration: DurationBucket;
  departments: Department[];
  audience: Audience[];
  legacyLevels?: CourseLevel[];
  levelCode: LevelCode;
  levelCodes?: LevelCode[];
  levelLabel?: string;
  levelShortLabel?: string;
  locations: Location[];
  status: CourseStatus;
  track?: string;
  lmsUrl: string;
  thumbnail?: string;
  slug?: string;
}

const defaultLogo = '/DWS-Logo.png';

const slugify = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

const unique = <T,>(values: T[]): T[] => Array.from(new Set(values));

const levelMap: Record<CourseLevel, LevelCode[]> = {
  Foundation: ['L1', 'L2'],
  Practitioner: ['L3', 'L4'],
  Professional: ['L5', 'L6'],
  Specialist: ['L7', 'L8']
};

const resolveLevelCodes = (item: LmsItem): LevelCode[] => {
  if (item.levelCodes && item.levelCodes.length) {
    return item.levelCodes;
  }
  if (item.legacyLevels?.length) {
    return item.legacyLevels.flatMap(level => levelMap[level] ?? []);
  }
  return [item.levelCode];
};

const metadataChips = (item: LmsItem) => {
  const chips: string[] = [
    item.courseCategory,
    item.deliveryMode,
    item.duration,
    item.levelShortLabel ?? levelShortLabelFromCode(item.levelCode)
  ];
  const locationChip = item.locations.find(location => location !== 'Riyadh');
  if (locationChip) {
    chips.push(locationChip);
  }
  const audienceIsLeadOnly =
    item.audience.length === 1 && item.audience[0] === 'Lead';
  if (audienceIsLeadOnly) {
    chips.push('Lead-only');
  }
  return chips.filter(Boolean);
};

export const lmsItemsSeed: LmsItem[] = [
  {
    id: 'dq-essentials',
    title: 'DQ Essentials: How DQ Works',
    summary:
      'Orientation to DQ, our mission, and expectations for every practitioner in their first quarter.',
    provider: 'DQ LMS',
    courseCategory: 'Day in DQ',
    deliveryMode: 'Video',
    duration: 'Short',
    departments: ['DCO'],
    audience: ['Associate', 'Lead'],
    legacyLevels: ['Foundation'],
    levelCode: 'L1',
    levelCodes: ['L1', 'L2'],
    levelLabel: levelLabelFromCode('L1'),
    levelShortLabel: levelShortLabelFromCode('L1'),
    locations: ['Riyadh'],
    status: 'Live',
    lmsUrl: '/lms?category=dayindq',
    slug: 'dq-essentials'
  },
  {
    id: 'ghc-primer',
    title: 'GHC Primer: Collaboration & Delivery',
    summary:
      'Golden Honeycomb principles, collaboration playbooks, and delivery scenarios steeped in real DQ casework.',
    provider: 'DQ LMS',
    courseCategory: 'GHC',
    deliveryMode: 'Guide',
    duration: 'Short',
    departments: ['DCO'],
    audience: ['Associate'],
    legacyLevels: ['Foundation'],
    levelCode: 'L2',
    levelCodes: ['L1', 'L2'],
    levelLabel: levelLabelFromCode('L2'),
    levelShortLabel: levelShortLabelFromCode('L2'),
    locations: ['Riyadh'],
    status: 'Live',
    lmsUrl: '/lms?category=ghc',
    slug: 'ghc-primer'
  },
  {
    id: 'sixx-digital',
    title: '6x Digital: Transformation Framework',
    summary:
      'The six digital frames we use to scope, govern, and deliver transformation programs across DQ portfolios.',
    provider: 'DQ LMS',
    courseCategory: '6xD',
    deliveryMode: 'Video',
    duration: 'Medium',
    departments: ['DBP'],
    audience: ['Associate', 'Lead'],
    legacyLevels: ['Practitioner'],
    levelCode: 'L3',
    levelCodes: ['L3', 'L4'],
    levelLabel: levelLabelFromCode('L3'),
    levelShortLabel: levelShortLabelFromCode('L3'),
    locations: ['Riyadh'],
    status: 'Coming Soon',
    lmsUrl: '/lms?category=6xd',
    slug: 'sixx-digital'
  },
  {
    id: 'dws-tools',
    title: 'Working in DWS: Tools & Daily Flow',
    summary:
      'Hands-on walkthrough of automation, dashboards, and request flows inside Digital Workspace Services.',
    provider: 'DQ LMS',
    courseCategory: 'DWS',
    deliveryMode: 'Hybrid',
    duration: 'Long',
    departments: ['DBP'],
    audience: ['Associate'],
    legacyLevels: ['Practitioner'],
    levelCode: 'L4',
    levelCodes: ['L3', 'L4'],
    levelLabel: levelLabelFromCode('L4'),
    levelShortLabel: levelShortLabelFromCode('L4'),
    locations: ['Remote'],
    status: 'Live',
    lmsUrl: '/lms?category=dws',
    slug: 'dws-tools'
  },
  {
    id: 'dxp-basics',
    title: 'DXP Basics: Content & Components',
    summary:
      'Composable platform fundamentals, blueprinting, and governance patterns for the DXP stack.',
    provider: 'DQ LMS',
    courseCategory: 'DXP',
    deliveryMode: 'Guide',
    duration: 'Medium',
    departments: ['DBP'],
    audience: ['Associate'],
    legacyLevels: ['Foundation'],
    levelCode: 'L2',
    levelCodes: ['L1', 'L2'],
    levelLabel: levelLabelFromCode('L2'),
    levelShortLabel: levelShortLabelFromCode('L2'),
    locations: ['Dubai'],
    status: 'Live',
    lmsUrl: '/lms?category=dxp',
    slug: 'dxp-basics'
  },
  {
    id: 'git-vercel',
    title: 'Key Tools: Git & Vercel for DQ Projects',
    summary:
      'Source control conventions, environment promotion, and delivery guardrails using Git and Vercel.',
    provider: 'DQ LMS',
    courseCategory: 'Key Tools',
    deliveryMode: 'Video',
    duration: 'Short',
    departments: ['DBP'],
    audience: ['Associate'],
    legacyLevels: ['Professional'],
    levelCode: 'L5',
    levelCodes: ['L5', 'L6'],
    levelLabel: levelLabelFromCode('L5'),
    levelShortLabel: levelShortLabelFromCode('L5'),
    locations: ['Dubai'],
    status: 'Live',
    lmsUrl: '/lms?category=key%20tools&level=professional',
    slug: 'git-vercel'
  },
  {
    id: 'cursor-ai',
    title: 'Cursor AI for Daily Dev',
    summary:
      'Using Cursor AI to accelerate delivery, establish review guardrails, and govern AI-generated code.',
    provider: 'DQ LMS',
    courseCategory: 'Key Tools',
    deliveryMode: 'Video',
    duration: 'Short',
    departments: ['DBP'],
    audience: ['Associate'],
    legacyLevels: ['Practitioner'],
    levelCode: 'L3',
    levelCodes: ['L3', 'L4'],
    levelLabel: levelLabelFromCode('L3'),
    levelShortLabel: levelShortLabelFromCode('L3'),
    locations: ['Remote'],
    status: 'Live',
    lmsUrl: '/lms?category=key%20tools&delivery=Video',
    slug: 'cursor-ai'
  },
  {
    id: 'first-7-days',
    title: 'Your First 7 Days at DQ',
    summary:
      'Seven-day onboarding sprint that blends culture, delivery basics, and workspace tooling for every new joiner.',
    provider: 'DQ LMS',
    courseCategory: 'Day in DQ',
    deliveryMode: 'Guide',
    duration: 'Medium',
    departments: ['DCO'],
    audience: ['Associate'],
    legacyLevels: ['Foundation'],
    levelCode: 'L1',
    levelCodes: ['L1', 'L2'],
    levelLabel: levelLabelFromCode('L1'),
    levelShortLabel: levelShortLabelFromCode('L1'),
    locations: ['Riyadh'],
    status: 'Live',
    track: 'newjoiner',
    lmsUrl: '/lms?track=newjoiner',
    slug: 'first-7-days'
  },
  {
    id: 'governance-lite',
    title: 'Governance Lite: DCO & DBP Policies',
    summary:
      'Lead-level governance kit for running reviews, managing risk, and aligning delivery to the mission.',
    provider: 'DQ LMS',
    courseCategory: 'GHC',
    deliveryMode: 'Guide',
    duration: 'Short',
    departments: ['DCO', 'DBP'],
    audience: ['Associate', 'Lead'],
    legacyLevels: ['Foundation'],
    levelCode: 'L2',
    levelCodes: ['L1', 'L2'],
    levelLabel: levelLabelFromCode('L2'),
    levelShortLabel: levelShortLabelFromCode('L2'),
    locations: ['Riyadh'],
    status: 'Live',
    lmsUrl: '/lms?category=ghc&level=lead',
    slug: 'governance-lite'
  }
];

const toIds = (values: string[]): string[] => unique(values.map(slugify));

export const mapLmsItemToMarketplace = (item: LmsItem) => {
  const levelCodes = resolveLevelCodes(item);
  const primaryLevelCode = item.levelCode ?? levelCodes[0];
  const levelLabel = item.levelLabel ?? levelLabelFromCode(primaryLevelCode);
  const levelShortLabel =
    item.levelShortLabel ?? levelShortLabelFromCode(primaryLevelCode);

  const courseCategoryIds = toIds([item.courseCategory]);
  const deliveryModeIds = toIds([item.deliveryMode]);
  const durationId = slugify(item.duration);
  const levelIds = toIds(levelCodes);
  const departmentIds = toIds(item.departments);
  const locationIds = toIds(item.locations);
  const audienceIds = toIds(item.audience);
  const statusId = slugify(item.status);
  const trackId = item.track ? slugify(item.track) : undefined;
  const locationLabel = item.locations.join(', ');

  return {
    id: item.id,
    title: item.title,
    description: item.summary,
    summary: item.summary,
    provider: {
      name: item.provider,
      logoUrl: item.thumbnail || defaultLogo,
      description: ''
    },
    type: 'course',
    courseCategory: [item.courseCategory],
    courseCategoryIds,
    category: [item.courseCategory],
    deliveryMode: [item.deliveryMode],
    deliveryModeIds,
    duration: item.duration,
    durationLabel: item.duration,
    durationId,
    levelCode: primaryLevelCode,
    levelCodes,
    levelLabel,
    levelShortLabel,
    level: levelCodes,
    levelIds,
    department: item.departments,
    departmentIds,
    location: item.locations,
    locationLabel,
    locationIds,
    audience: item.audience,
    audienceIds,
    status: item.status,
    statusId,
    track: item.track,
    trackId,
    lmsUrl: item.lmsUrl,
    slug: item.slug,
    startDate: 'Available Now',
    price: 'Free',
    tags: metadataChips(item),
    raw: item
  };
};
