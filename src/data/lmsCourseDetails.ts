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
  courseType?: 'Course (Single Lesson)' | 'Course (Multi-Lessons)' | 'Course (Bundles)';
  track?: string;
  rating?: number;
  reviewCount?: number;
  testimonials?: Array<{
    author: string;
    role: string;
    text: string;
    rating: number;
  }>;
  caseStudies?: Array<{
    title: string;
    description: string;
    link?: string;
  }>;
  references?: Array<{
    title: string;
    description: string;
    link?: string;
  }>;
  // Curriculum structure based on course type:
  // Track (Bundles): Contains courses, each course has topics, topics have lessons
  // Course (Multi-Lessons): Contains topics, topics have lessons
  // Single Lesson: Contains lessons directly
  curriculum?: Array<{
    id: string;
    title: string;
    description?: string;
    duration?: string;
    order: number;
    isLocked?: boolean;
    // For Track (Bundles): course slug to navigate to course page
    courseSlug?: string;
    // For Track (Bundles) and Course (Multi-Lessons): topics array
    topics?: Array<{
      id: string;
      title: string;
      description?: string;
      duration?: string;
      order: number;
      isLocked?: boolean;
      // Lessons within a topic
      lessons: Array<{
        id: string;
        title: string;
        description?: string;
        duration?: string;
        type: 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading';
        order: number;
        isLocked?: boolean;
      }>;
    }>;
    // For Single Lesson: lessons directly (no topics)
    lessons?: Array<{
      id: string;
      title: string;
      description?: string;
      duration?: string;
      type: 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading';
      order: number;
      isLocked?: boolean;
    }>;
  }>;
};

const details: Omit<LmsDetail, 'locations'> & { locations: string[] }[] = [
  {
    id: 'dq-essentials',
    slug: 'dq-essentials',
    title: 'DQ Essentials: How DQ Works',
    provider: 'DQ HRA',
    courseCategory: 'Day in DQ',
    deliveryMode: 'Video',
    duration: 'Short',
    levelCode: L('L1'),
    department: ['DCO'],
    locations: ['Global'],
    audience: ['Associate', 'Lead'],
    status: 'live',
    courseType: 'Course (Single Lesson)',
    track: 'Leadership Track',
    rating: 4.5,
    reviewCount: 24,
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
    ],
    testimonials: [
      {
        author: 'Sarah Johnson',
        role: 'Senior Developer',
        text: 'How DQ shaped my work ethic: This course provided excellent insights into how DQ operates. The mission and structure clarity helped me align my work with DQ\'s values from day one.',
        rating: 5
      },
      {
        author: 'Ahmed Al-Mansoori',
        role: 'Product Manager',
        text: 'Great orientation material for new team members. Understanding the operating models has been crucial for my role.',
        rating: 4
      },
      {
        author: 'Rachel Kim',
        role: 'Engineering Lead',
        text: 'The DQ Essentials course transformed my understanding of how teams work together. The GHC and 6xD frameworks are now central to how I lead.',
        rating: 5
      }
    ],
    caseStudies: [
      {
        title: 'DQ Transformation Case Study',
        description: 'How DQ essentials were applied in a real transformation project',
        link: '/case-studies/dq-transformation'
      }
    ],
    references: [
      {
        title: 'DQ Mission Statement',
        description: 'Official DQ mission and vision documentation',
        link: '/references/dq-mission'
      }
    ],
    // Single lesson - just show lessons directly (no topics)
    curriculum: [
      {
        id: 'lesson-1',
        title: 'Introduction to DQ',
        description: 'Overview of DQ\'s mission, vision, and core values',
        duration: '15 min',
        order: 1,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-1-content',
            title: 'Introduction to DQ',
            description: 'Overview of DQ\'s mission, vision, and core values',
            duration: '15 min',
            type: 'video',
            order: 1,
            isLocked: false
          }
        ]
      }
    ]
  },
  {
    id: 'ghc-primer',
    slug: 'ghc-primer',
    title: 'GHC Primer: Collaboration & Delivery',
    provider: 'DQ DTMB',
    courseCategory: 'GHC',
    deliveryMode: 'Guide',
    duration: 'Short',
    levelCode: L('L2'),
    department: ['DCO'],
    locations: ['Global'],
    audience: ['Associate'],
    status: 'live',
    courseType: 'Course (Multi-Lessons)',
    track: 'Leadership Track',
    rating: 4.8,
    reviewCount: 18,
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
    ],
    testimonials: [
      {
        author: 'Michael Chen',
        role: 'Product Lead',
        text: 'How DQ shaped my work ethic: The GHC framework completely transformed how I approach collaboration and delivery. The 7S practices are now part of my daily routine.',
        rating: 5
      },
      {
        author: 'Priya Patel',
        role: 'Senior Developer',
        text: 'This course gave me the tools to be a better leader. The DTMF framework for planning has been a game-changer for our team.',
        rating: 5
      }
    ],
    // Course (Multi-Lessons) - has topics with lessons
    curriculum: [
      {
        id: 'topic-ghc-foundations',
        title: 'Becoming a Leader Using GHC',
        description: 'Core GHC principles and frameworks',
        order: 1,
        isLocked: false,
        topics: [
          {
            id: 'topic-ghc-overview',
            title: 'GHC Fundamentals',
            description: 'Introduction to Golden Honeycomb Competences',
            order: 1,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-ghc-1',
                title: 'Introduction to 5Ps',
                description: 'Understanding the 5Ps framework',
                duration: '20 min',
                type: 'video',
                order: 1,
                isLocked: false
              },
              {
                id: 'lesson-ghc-2',
                title: 'Agile Practices',
                description: 'Agile methodologies in GHC context',
                duration: '25 min',
                type: 'guide',
                order: 2,
                isLocked: false
              }
            ]
          },
          {
            id: 'topic-ghc-pillars',
            title: 'The 7 Pillars',
            description: 'Deep dive into each of the 7 GHC pillars',
            order: 2,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-ghc-3',
                title: 'Pillar 1-3 Overview',
                description: 'First three pillars explained',
                duration: '30 min',
                type: 'video',
                order: 1,
                isLocked: false
              },
              {
                id: 'lesson-ghc-4',
                title: 'Pillar 4-7 Overview',
                description: 'Remaining pillars explained',
                duration: '30 min',
                type: 'guide',
                order: 2,
                isLocked: false
              }
            ]
          }
        ]
      },
      {
        id: 'topic-dq-products',
        title: 'DQ Products',
        description: 'Understanding DQ product ecosystem',
        order: 2,
        isLocked: false,
        topics: [
          {
            id: 'topic-7s-sos',
            title: '7S and SoS Practices',
            description: 'Understanding 7S framework and SoS methodologies',
            order: 1,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-7s-1',
                title: '7S Framework Introduction',
                description: 'Overview of the 7S framework',
                duration: '25 min',
                type: 'video',
                order: 1,
                isLocked: false
              },
              {
                id: 'lesson-7s-2',
                title: 'SoS Methodologies',
                description: 'Scrum of Scrums practices',
                duration: '20 min',
                type: 'guide',
                order: 2,
                isLocked: false
              }
            ]
          },
          {
            id: 'topic-dtmf',
            title: 'DTMF Framework',
            description: 'Learn about DTMF for planning and retrospectives',
            order: 2,
            isLocked: true,
            lessons: [
              {
                id: 'lesson-dtmf-1',
                title: 'DTMF Basics',
                description: 'Introduction to DTMF framework',
                duration: '20 min',
                type: 'guide',
                order: 1,
                isLocked: true
              },
              {
                id: 'lesson-dtmf-2',
                title: 'DTMF in Practice',
                description: 'Applying DTMF in real scenarios',
                duration: '25 min',
                type: 'workshop',
                order: 2,
                isLocked: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sixx-digital',
    slug: 'sixx-digital',
    title: '6x Digital: Transformation Framework',
    provider: 'DQ DTMA',
    courseCategory: '6x Digital',
    deliveryMode: 'Video',
    duration: 'Medium',
    levelCode: L('L3'),
    department: ['DBP'],
    locations: ['Global'],
    audience: ['Associate', 'Lead'],
    status: 'live',
    courseType: 'Course (Multi-Lessons)',
    track: 'Leadership Track',
    rating: 4.6,
    reviewCount: 15,
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
    ],
    testimonials: [
      {
        author: 'Thomas Brown',
        role: 'Transformation Lead',
        text: 'The 6x Digital framework has been instrumental in our transformation projects. The D1-D6 perspectives provide clear structure and governance.',
        rating: 5
      },
      {
        author: 'Sophie Williams',
        role: 'Senior Consultant',
        text: 'Excellent course on transformation frameworks. The practical examples and artefact guidance are very helpful.',
        rating: 4
      }
    ]
  },
  {
    id: 'dws-tools',
    slug: 'dws-tools',
    title: 'Working in DWS: Tools & Daily Flow',
    provider: 'Tech (Microsoft)',
    courseCategory: 'DWS',
    deliveryMode: 'Hybrid',
    duration: 'Long',
    levelCode: L('L4'),
    department: ['DBP'],
    locations: ['Remote'],
    audience: ['Associate'],
    status: 'live',
    courseType: 'Course (Bundles)',
    track: 'Working in DWS',
    rating: 4.7,
    reviewCount: 32,
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
    ],
    testimonials: [
      {
        author: 'James Wilson',
        role: 'Technical Lead',
        text: 'How DQ shaped my work ethic: Working in DWS taught me the importance of structured workflows and clear communication. The daily flow practices have made me more efficient and organized.',
        rating: 5
      },
      {
        author: 'Emma Thompson',
        role: 'Project Manager',
        text: 'The DWS tools course transformed how I manage projects. The dashboards and request flows have streamlined our entire workflow.',
        rating: 4
      }
    ],
    // Track (Bundles) - contains courses that can be clicked, each course has topics with lessons
    curriculum: [
      {
        id: 'course-dws-basics',
        title: 'DWS Basics',
        description: 'Introduction to Digital Workspace Services',
        courseSlug: 'dws-basics',
        order: 1,
        isLocked: false,
        topics: [
          {
            id: 'topic-dws-intro',
            title: 'Getting Started with DWS',
            description: 'Introduction to DWS tools and navigation',
            order: 1,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-dws-1',
                title: 'DWS Overview',
                description: 'Introduction to Digital Workspace Services',
                duration: '15 min',
                type: 'video',
                order: 1,
                isLocked: false
              },
              {
                id: 'lesson-dws-2',
                title: 'Navigation Basics',
                description: 'How to navigate the DWS interface',
                duration: '10 min',
                type: 'guide',
                order: 2,
                isLocked: false
              }
            ]
          }
        ]
      },
      {
        id: 'course-dws-advanced',
        title: 'Advanced DWS',
        description: 'Advanced features and workflows',
        courseSlug: 'dws-advanced',
        order: 2,
        isLocked: false,
        topics: [
          {
            id: 'topic-dws-advanced',
            title: 'Advanced Features',
            description: 'Advanced DWS capabilities',
            order: 1,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-dws-adv-1',
                title: 'Advanced Workflows',
                description: 'Complex workflow patterns',
                duration: '30 min',
                type: 'guide',
                order: 1,
                isLocked: false
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'dxp-basics',
    slug: 'dxp-basics',
    title: 'DXP Basics: Content & Components',
    provider: 'DQ DTMA',
    courseCategory: 'DXP',
    deliveryMode: 'Guide',
    duration: 'Medium',
    levelCode: L('L2'),
    department: ['DBP'],
    locations: ['Dubai'],
    audience: ['Associate'],
    status: 'live',
    courseType: 'Course (Single Lesson)',
    rating: 4.4,
    reviewCount: 12,
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
    ],
    testimonials: [
      {
        author: 'Alex Rivera',
        role: 'Frontend Developer',
        text: 'DXP Basics helped me understand the content modeling approach. The blueprint patterns are now part of my daily workflow.',
        rating: 4
      },
      {
        author: 'Jessica Taylor',
        role: 'Content Strategist',
        text: 'Great introduction to DXP content architecture. The composable content concepts are well explained.',
        rating: 5
      }
    ]
  },
  {
    id: 'git-vercel',
    slug: 'git-vercel',
    title: 'Key Tools: Git & Vercel for DQ Projects',
    provider: 'Tech (Microsoft)',
    courseCategory: 'Key Tools',
    deliveryMode: 'Video',
    duration: 'Short',
    levelCode: L('L5'),
    department: ['DBP'],
    locations: ['Dubai'],
    audience: ['Associate'],
    status: 'live',
    courseType: 'Course (Single Lesson)',
    rating: 4.7,
    reviewCount: 28,
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
    ],
    testimonials: [
      {
        author: 'Kevin Park',
        role: 'DevOps Engineer',
        text: 'How DQ shaped my work ethic: This course on Git and Vercel established best practices that I use in every project. The deployment workflow is now second nature.',
        rating: 5
      },
      {
        author: 'Maria Garcia',
        role: 'Full Stack Developer',
        text: 'Excellent guide to DQ\'s Git workflow. The branch strategy and PR process are clearly explained.',
        rating: 4
      }
    ]
  },
  {
    id: 'cursor-ai',
    slug: 'cursor-ai',
    title: 'Cursor AI for Daily Dev',
    provider: 'Tech (Ardoq)',
    courseCategory: 'Key Tools',
    deliveryMode: 'Video',
    duration: 'Short',
    levelCode: L('L3'),
    department: ['DBP'],
    locations: ['Remote'],
    audience: ['Associate'],
    status: 'live',
    courseType: 'Course (Single Lesson)',
    rating: 4.9,
    reviewCount: 35,
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
    ],
    testimonials: [
      {
        author: 'Daniel Lee',
        role: 'Software Engineer',
        text: 'How DQ shaped my work ethic: Cursor AI has transformed my development workflow. The prompt patterns and automation features have significantly increased my productivity.',
        rating: 5
      },
      {
        author: 'Nicole Chen',
        role: 'Tech Lead',
        text: 'This course on Cursor AI is a must for developers. The safe prompt patterns and review guardrails are essential for responsible AI use.',
        rating: 5
      },
      {
        author: 'Ryan O\'Connor',
        role: 'Senior Developer',
        text: 'Great course on AI-assisted development. The documentation generation features are a game-changer.',
        rating: 4
      }
    ]
  },
  {
    id: 'first-7-days',
    slug: 'first-7-days',
    title: 'Your First 7 Days at DQ',
    provider: 'DQ HRA',
    courseCategory: 'Day in DQ',
    deliveryMode: 'Guide',
    duration: 'Medium',
    levelCode: L('L1'),
    department: ['DCO'],
    locations: ['Global'],
    audience: ['Associate'],
    status: 'live',
    courseType: 'Course (Multi-Lessons)',
    track: 'Onboarding',
    rating: 4.9,
    reviewCount: 45,
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
    ],
    testimonials: [
      {
        author: 'David Martinez',
        role: 'New Associate',
        text: 'How DQ shaped my work ethic: The first 7 days program gave me everything I needed to hit the ground running. The structured approach and clear guidance made my transition seamless.',
        rating: 5
      },
      {
        author: 'Lisa Anderson',
        role: 'Software Engineer',
        text: 'This onboarding experience is the best I\'ve ever had. The day-by-day plan and tool setup checklist made it so easy to get started.',
        rating: 5
      }
    ],
    // Course (Multi-Lessons) - has topics with lessons
    curriculum: [
      {
        id: 'topic-week-1',
        title: 'Week 1: Getting Started',
        description: 'Initial setup, orientation, and tool configuration',
        order: 1,
        isLocked: false,
        topics: [
          {
            id: 'topic-days-1-3',
            title: 'Days 1-3: Orientation and Setup',
            description: 'Welcome, team introduction, and workspace setup',
            order: 1,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-day-1',
                title: 'Day 1: Welcome and Orientation',
                description: 'Introduction to DQ, meet your team, and set up your workspace',
                duration: '2 hours',
                type: 'workshop',
                order: 1,
                isLocked: false
              },
              {
                id: 'lesson-day-2',
                title: 'Day 2: Tools and Access',
                description: 'Set up all necessary tools and gain access to required systems',
                duration: '1.5 hours',
                type: 'guide',
                order: 2,
                isLocked: false
              },
              {
                id: 'lesson-day-3',
                title: 'Day 3: Core Processes',
                description: 'Learn about daily workflows and processes',
                duration: '2 hours',
                type: 'video',
                order: 3,
                isLocked: false
              }
            ]
          },
          {
            id: 'topic-days-4-7',
            title: 'Days 4-7: First Tasks and Integration',
            description: 'Complete first tasks and integrate into team workflows',
            order: 2,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-day-4',
                title: 'Day 4: First Task',
                description: 'Complete your first assigned task with mentor support',
                duration: '3 hours',
                type: 'assignment',
                order: 1,
                isLocked: false
              },
              {
                id: 'lesson-day-5',
                title: 'Day 5: Team Rituals',
                description: 'Participate in team meetings and understand rituals',
                duration: '1 hour',
                type: 'workshop',
                order: 2,
                isLocked: false
              },
              {
                id: 'lesson-day-6',
                title: 'Day 6: Review and Feedback',
                description: 'Review your progress and receive feedback',
                duration: '1 hour',
                type: 'workshop',
                order: 3,
                isLocked: true
              },
              {
                id: 'lesson-day-7',
                title: 'Day 7: Next Steps',
                description: 'Plan your learning path and next steps',
                duration: '1 hour',
                type: 'guide',
                order: 4,
                isLocked: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'governance-lite',
    slug: 'governance-lite',
    title: 'Governance Lite: DCO & DBP Policies',
    provider: 'DQ DTMB',
    courseCategory: 'GHC',
    deliveryMode: 'Guide',
    duration: 'Short',
    levelCode: L('L2'),
    department: ['DCO', 'DBP'],
    locations: ['Global'],
    audience: ['Associate', 'Lead'],
    status: 'live',
    courseType: 'Course (Single Lesson)',
    track: 'Leadership Track',
    rating: 4.5,
    reviewCount: 20,
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
    ],
    testimonials: [
      {
        author: 'Robert Kim',
        role: 'Engineering Manager',
        text: 'Governance Lite provides exactly what I need: practical governance tools without the overhead. The templates and review processes are invaluable.',
        rating: 5
      },
      {
        author: 'Amanda Foster',
        role: 'Project Lead',
        text: 'This course on governance has streamlined our review processes. The lightweight approach keeps us moving fast while maintaining quality.',
        rating: 4
      }
    ]
  },
  {
    id: 'leadership-track',
    slug: 'leadership-track',
    title: 'Leadership Track',
    provider: 'DQ HRA',
    courseCategory: 'GHC',
    deliveryMode: 'Hybrid',
    duration: 'Long',
    levelCode: L('L3'),
    department: ['DCO'],
    locations: ['Global'],
    audience: ['Lead'],
    status: 'live',
    courseType: 'Course (Bundles)',
    track: 'Leadership Track',
    summary:
      'Comprehensive leadership development track covering essential skills, frameworks, and practices for effective leadership at DQ.',
    highlights: [
      'Complete leadership journey from fundamentals to advanced',
      'GHC frameworks and collaboration practices',
      'DQ products and transformation methodologies',
      'Real-world case studies and practical exercises'
    ],
    outcomes: [
      'Master leadership fundamentals using GHC',
      'Understand DQ products and transformation frameworks',
      'Apply leadership principles in real scenarios',
      'Build a comprehensive leadership toolkit'
    ],
    // Track (Bundles) - contains courses with topics and lessons
    curriculum: [
      {
        id: 'course-dq-essentials-track',
        title: 'DQ Essentials: How DQ Works',
        description: 'Orientation to DQ\'s mission, structure, and operating models',
        courseSlug: 'dq-essentials',
        order: 1,
        isLocked: false,
        topics: [
          {
            id: 'topic-essentials-intro',
            title: 'DQ Fundamentals',
            description: 'Core DQ concepts and structure',
            order: 1,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-essentials-1',
                title: 'Introduction to DQ',
                description: 'Overview of DQ\'s mission, vision, and core values',
                duration: '15 min',
                type: 'video',
                order: 1,
                isLocked: false
              },
              {
                id: 'lesson-essentials-2',
                title: 'DQ Structure and Teams',
                description: 'Understanding DQ\'s organizational structure',
                duration: '20 min',
                type: 'video',
                order: 2,
                isLocked: false
              }
            ]
          }
        ]
      },
      {
        id: 'course-ghc-primer-track',
        title: 'GHC Primer: Collaboration & Delivery',
        description: 'Golden Honeycomb Competences for teaming and agile delivery',
        courseSlug: 'ghc-primer',
        order: 2,
        isLocked: false,
        topics: [
          {
            id: 'topic-ghc-leadership',
            title: 'Becoming a Leader Using GHC',
            description: 'Core GHC principles for leadership',
            order: 1,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-ghc-lead-1',
                title: 'Introduction to 5Ps',
                description: 'Understanding the 5Ps framework for leadership',
                duration: '20 min',
                type: 'video',
                order: 1,
                isLocked: false
              },
              {
                id: 'lesson-ghc-lead-2',
                title: 'Agile Leadership Practices',
                description: 'Agile methodologies in leadership context',
                duration: '25 min',
                type: 'guide',
                order: 2,
                isLocked: false
              }
            ]
          },
          {
            id: 'topic-dq-products-lead',
            title: 'DQ Products for Leaders',
            description: 'Understanding DQ product ecosystem from a leadership perspective',
            order: 2,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-dq-prod-lead-1',
                title: '7S Framework for Leaders',
                description: 'Applying 7S framework in leadership',
                duration: '25 min',
                type: 'video',
                order: 1,
                isLocked: false
              }
            ]
          }
        ]
      },
      {
        id: 'course-sixx-digital-track',
        title: '6x Digital: Transformation Framework',
        description: 'Six perspectives for scoping, governing, and delivering transformation',
        courseSlug: 'sixx-digital',
        order: 3,
        isLocked: true,
        topics: [
          {
            id: 'topic-6x-overview',
            title: '6x Digital Overview',
            description: 'Introduction to D1-D6 perspectives',
            order: 1,
            isLocked: true,
            lessons: [
              {
                id: 'lesson-6x-1',
                title: 'D1-D6 Introduction',
                description: 'Overview of the six transformation perspectives',
                duration: '30 min',
                type: 'video',
                order: 1,
                isLocked: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'onboarding-track',
    slug: 'onboarding-track',
    title: 'Onboarding',
    provider: 'DQ HRA',
    courseCategory: 'Day in DQ',
    deliveryMode: 'Hybrid',
    duration: 'Long',
    levelCode: L('L1'),
    department: ['DCO'],
    locations: ['Global'],
    audience: ['Associate'],
    status: 'live',
    courseType: 'Course (Bundles)',
    track: 'Onboarding',
    rating: 4.9,
    reviewCount: 58,
    summary:
      'Complete onboarding experience for new team members, covering culture, tools, processes, and first tasks.',
    highlights: [
      'Seven-day onboarding sprint',
      'Core tools and workspace setup',
      'DQ culture and values',
      'First task guidance and support'
    ],
    outcomes: [
      'Complete the onboarding sprint successfully',
      'Set up all necessary tools and access',
      'Understand DQ culture and operating models',
      'Deliver your first task with confidence'
    ],
    testimonials: [
      {
        author: 'Chris Anderson',
        role: 'New Team Member',
        text: 'How DQ shaped my work ethic: The Onboarding track made my transition into DQ seamless. The structured approach and supportive guidance helped me feel confident from day one.',
        rating: 5
      },
      {
        author: 'Sarah Mitchell',
        role: 'Recent Hire',
        text: 'Best onboarding experience I\'ve ever had. The seven-day sprint format and comprehensive tool setup made it easy to get started.',
        rating: 5
      },
      {
        author: 'Michael Chang',
        role: 'Software Engineer',
        text: 'The Onboarding track covers everything you need to know. The culture overview and first task guidance were particularly helpful.',
        rating: 5
      }
    ],
    // Track (Bundles) - contains courses with topics and lessons
    curriculum: [
      {
        id: 'course-first-7-days-track',
        title: 'Your First 7 Days at DQ',
        description: 'Seven-day onboarding sprint with day-by-day guidance',
        courseSlug: 'first-7-days',
        order: 1,
        isLocked: false,
        topics: [
          {
            id: 'topic-day-1-3',
            title: 'Days 1-3: Getting Started',
            description: 'Initial setup and orientation',
            order: 1,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-day-1',
                title: 'Day 1: Welcome and Orientation',
                description: 'Introduction to DQ and team setup',
                duration: '2 hours',
                type: 'workshop',
                order: 1,
                isLocked: false
              },
              {
                id: 'lesson-day-2',
                title: 'Day 2: Tools and Access',
                description: 'Set up necessary tools and gain access',
                duration: '1.5 hours',
                type: 'guide',
                order: 2,
                isLocked: false
              }
            ]
          },
          {
            id: 'topic-day-4-7',
            title: 'Days 4-7: First Tasks',
            description: 'Complete first tasks and establish workflows',
            order: 2,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-day-4',
                title: 'Day 4: First Task',
                description: 'Complete your first assigned task',
                duration: '3 hours',
                type: 'assignment',
                order: 1,
                isLocked: false
              }
            ]
          }
        ]
      },
      {
        id: 'course-dq-essentials-onboarding',
        title: 'DQ Essentials: How DQ Works',
        description: 'Orientation to DQ\'s mission and structure',
        courseSlug: 'dq-essentials',
        order: 2,
        isLocked: false,
        topics: [
          {
            id: 'topic-essentials-onboarding',
            title: 'DQ Fundamentals',
            description: 'Core DQ concepts for new team members',
            order: 1,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-essentials-onboarding-1',
                title: 'Introduction to DQ',
                description: 'Overview of DQ\'s mission and values',
                duration: '15 min',
                type: 'video',
                order: 1,
                isLocked: false
              }
            ]
          }
        ]
      }
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
  courseType?: 'Course (Single Lesson)' | 'Course (Multi-Lessons)' | 'Course (Bundles)';
  track?: string;
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
  department: detail.department,
  courseType: detail.courseType || 'Course (Single Lesson)',
  track: detail.track
}));
