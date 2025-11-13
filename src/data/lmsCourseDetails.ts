import { LOCATION_ALLOW, LEVELS, LevelCode } from '@/lms/config';
import {
  levelLabelFromCode,
  levelShortLabelFromCode
} from '@/lms/levels';

const allowedLocations = new Set<string>(LOCATION_ALLOW as readonly string[]);

const cleanLocations = (values?: string[]) => {
  const list = (values || []).filter(value => allowedLocations.has(value));
  return list.length ? list : ['Riyadh'];
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
  faq?: Array<{
    question: string;
    answer: string;
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
    locations: ['Riyadh'],
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
    locations: ['Riyadh'],
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
    locations: ['Riyadh'],
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
    faq: [
      {
        question: 'What are the requirements for taking this track?',
        answer: 'This track is designed for team members who work with Digital Workspace Services (DWS). Basic familiarity with DQ tools and workflows is recommended. You should have access to DWS systems, which will be provided if needed.'
      },
      {
        question: 'How long does it take to complete the Working in DWS track?',
        answer: 'The Working in DWS track can be completed at your own pace. Most participants finish the core content within 2-4 weeks, depending on the time dedicated. The track includes hands-on exercises and practical applications.'
      },
      {
        question: 'Do I need prior experience with DWS?',
        answer: 'No prior experience is required. The track starts with DWS basics and progressively covers more advanced topics. However, having basic familiarity with DQ workflows will help you get the most out of the track.'
      },
      {
        question: 'What tools and systems are covered?',
        answer: 'The track covers planners, dashboards, request flows, trackers, and other essential DWS tools. You will learn how to navigate these systems and use them effectively in your daily work.'
      },
      {
        question: 'Is there support available if I encounter issues?',
        answer: 'Yes, each course includes support resources and documentation. You can also reach out to the Tech (Microsoft) team or your DWS administrator for assistance with specific issues or questions.'
      }
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
    locations: ['Riyadh'],
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
    locations: ['Riyadh'],
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
    locations: ['Riyadh'],
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
    faq: [
      {
        question: 'What are the requirements for taking this track?',
        answer: 'This track is designed for Lead-level team members. Prior experience with DQ fundamentals and basic understanding of GHC frameworks is recommended, though not required. The track is suitable for both new leaders and experienced leaders looking to enhance their skills.'
      },
      {
        question: 'How long does it take to complete the Leadership Track?',
        answer: 'The Leadership Track is designed as a comprehensive learning journey. While the duration varies based on your pace, most participants complete the track within 8-12 weeks when dedicating 5-10 hours per week to learning.'
      },
      {
        question: 'Can I take individual courses from this track?',
        answer: 'Yes, all courses within the Leadership Track can be taken individually. However, we recommend following the track sequence for the best learning experience, as each course builds upon the previous one.'
      },
      {
        question: 'What happens if I get stuck on a course?',
        answer: 'Each course includes access to support resources, discussion forums, and mentorship opportunities. You can also reach out to the course provider or your learning coordinator for assistance.'
      },
      {
        question: 'Do I receive a certificate upon completion?',
        answer: 'Yes, upon successful completion of all courses in the Leadership Track, you will receive a Leadership Track completion certificate that recognizes your achievement and skills development.'
      }
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
    locations: ['Riyadh'],
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
    faq: [
      {
        question: 'What are the requirements for taking this track?',
        answer: 'This track is designed for all new team members joining DQ. No prior experience is required. You will need access to DQ systems and tools, which will be provided during the onboarding process.'
      },
      {
        question: 'How long does the onboarding track take?',
        answer: 'The Onboarding Track is structured as a seven-day sprint, with guided activities and tasks for each day. Most new team members complete the core onboarding within the first week, with additional resources available for ongoing reference.'
      },
      {
        question: 'What tools do I need access to before starting?',
        answer: 'You will receive access to all necessary tools and systems as part of the onboarding process. The track includes setup guides and checklists to ensure you have everything you need to get started.'
      },
      {
        question: 'Can I skip certain parts of the onboarding?',
        answer: 'While the onboarding track is designed to be comprehensive, you can work with your manager or onboarding coordinator to customize your learning path based on your role and prior experience. However, we recommend completing all core modules for the best experience.'
      },
      {
        question: 'What support is available during onboarding?',
        answer: 'You will be assigned an onboarding buddy or mentor who can help answer questions and provide guidance. Additionally, each course includes support resources, and you can reach out to the DQ HRA team for assistance at any time.'
      },
      {
        question: 'What happens after I complete the onboarding track?',
        answer: 'After completing the onboarding track, you will have access to additional learning resources and can begin exploring other courses and tracks in the Learning Center. Your manager will also help you identify your next learning steps based on your role and career goals.'
      }
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
  },
  // Microsoft Teams Courses - Individual Courses
  {
    id: 'ms-teams-meetings',
    slug: 'ms-teams-meetings',
    title: 'Ms Teams (Meetings)',
    provider: 'Tech (Microsoft)',
    courseCategory: 'Key Tools',
    deliveryMode: 'Video',
    duration: 'Long',
    levelCode: L('L2'),
    department: ['DBP Platform'],
    locations: ['Riyadh'],
    audience: ['Associate', 'Lead'],
    status: 'live',
    courseType: 'Course (Multi-Lessons)',
    rating: 4.6,
    reviewCount: 28,
    summary:
      'Master Microsoft Teams meetings from joining and scheduling to advanced features like webinars, live events, and immersive experiences.',
    highlights: [
      'Join and schedule meetings with ease',
      'Advanced meeting controls and collaboration tools',
      'Live events, webinars, and town halls',
      'Immersive experiences and Teams Premium features'
    ],
    outcomes: [
      'Join and schedule Teams meetings effectively',
      'Use meeting controls and collaboration features',
      'Organize and host large-scale events',
      'Troubleshoot common meeting issues'
    ],
    testimonials: [
      {
        author: 'Mohammed Al-Rashid',
        role: 'Project Manager',
        text: 'This course transformed how I conduct meetings in Teams. The scheduling and collaboration features have made my team more productive.',
        rating: 5
      },
      {
        author: 'Sara Ahmed',
        role: 'Team Lead',
        text: 'Excellent coverage of Teams meeting features. The webinar and live event sections were particularly helpful for our organization.',
        rating: 4
      }
    ],
    curriculum: [
      {
        id: 'section-teams-login',
        title: 'Teams login',
        description: 'Learn how to access and use Microsoft Teams',
        order: 1,
        isLocked: false,
        topics: [
          {
            id: 'topic-teams-login',
            title: 'Teams login',
            description: 'Learn how to access and use Microsoft Teams',
            order: 1,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-login-1',
                title: 'How to Login',
                description: 'Step-by-step guide to logging into Microsoft Teams',
                duration: '5 min',
                type: 'video',
                order: 1,
                isLocked: false
              },
              {
                id: 'lesson-login-2',
                title: 'Use Teams on the web',
                description: 'Access Teams through web browser',
                duration: '3 min',
                type: 'guide',
                order: 2,
                isLocked: false
              }
            ]
          }
        ]
      },
      {
        id: 'section-join-meeting',
        title: 'Join a meeting',
        description: 'Various ways to join Teams meetings',
        order: 2,
        isLocked: false,
        topics: [
          {
            id: 'topic-join-meeting',
            title: 'Join a meeting',
            description: 'Various ways to join Teams meetings',
            order: 1,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-join-1',
                title: 'Join a meeting in Teams',
                description: 'Join meetings from within Teams app',
                duration: '5 min',
                type: 'video',
                order: 1,
                isLocked: false
              },
              {
                id: 'lesson-join-2',
                title: 'Join without a Teams account',
                description: 'Join as a guest without Teams account',
                duration: '4 min',
                type: 'video',
                order: 2,
                isLocked: false
              },
              {
                id: 'lesson-join-3',
                title: 'Join a meeting outside your org',
                description: 'Participate in external organization meetings',
                duration: '5 min',
                type: 'guide',
                order: 3,
                isLocked: false
              },
              {
                id: 'lesson-join-4',
                title: 'Join on a second device',
                description: 'Join same meeting from multiple devices',
                duration: '4 min',
                type: 'video',
                order: 4,
                isLocked: false
              },
              {
                id: 'lesson-join-5',
                title: 'Join as a view-only attendee',
                description: 'Attend meetings in view-only mode',
                duration: '3 min',
                type: 'guide',
                order: 5,
                isLocked: false
              },
              {
                id: 'lesson-join-6',
                title: 'Join from Google',
                description: 'Join Teams meetings from Google Calendar',
                duration: '4 min',
                type: 'video',
                order: 6,
                isLocked: false
              }
            ]
          }
        ]
      },
      {
        id: 'section-schedule-meeting',
        title: 'Schedule a meeting',
        description: 'Create and manage Teams meetings',
        order: 3,
        isLocked: false,
        topics: [
          {
            id: 'topic-schedule-meeting',
            title: 'Schedule a meeting',
            description: 'Create and manage Teams meetings',
            order: 1,
            isLocked: false,
            lessons: [
              {
                id: 'lesson-schedule-1',
                title: 'Schedule a meeting in Teams',
                description: 'Basic meeting scheduling in Teams',
                duration: '5 min',
                type: 'video',
                order: 1,
                isLocked: false
              },
              {
                id: 'lesson-schedule-2',
                title: 'Schedule from Outlook',
                description: 'Create Teams meetings from Outlook',
                duration: '4 min',
                type: 'video',
                order: 2,
                isLocked: false
              },
              {
                id: 'lesson-schedule-3',
                title: 'Schedule from Google',
                description: 'Schedule Teams meetings via Google Calendar',
                duration: '4 min',
                type: 'guide',
                order: 3,
                isLocked: false
              },
              {
                id: 'lesson-schedule-4',
                title: 'Instant meeting',
                description: 'Start an immediate meeting',
                duration: '3 min',
                type: 'video',
                order: 4,
                isLocked: false
              },
              {
                id: 'lesson-schedule-5',
                title: 'Personal meeting templates',
                description: 'Create and use meeting templates',
                duration: '5 min',
                type: 'guide',
                order: 5,
                isLocked: false
              },
              {
                id: 'lesson-schedule-6',
                title: 'Add a dial-in number',
                description: 'Include phone dial-in options',
                duration: '3 min',
                type: 'guide',
                order: 6,
                isLocked: false
              },
              {
                id: 'lesson-schedule-7',
                title: 'Invite people',
                description: 'Add participants to meetings',
                duration: '3 min',
                type: 'video',
                order: 7,
                isLocked: false
              },
              {
                id: 'lesson-schedule-8',
                title: 'Meeting roles',
                description: 'Understand organizer, presenter, and attendee roles',
                duration: '4 min',
                type: 'guide',
                order: 8,
                isLocked: false
              },
              {
                id: 'lesson-schedule-9',
                title: 'Add co-organizers',
                description: 'Share meeting organization responsibilities',
                duration: '4 min',
                type: 'video',
                order: 9,
                isLocked: false
              },
              {
                id: 'lesson-schedule-10',
                title: 'Hide attendee names',
                description: 'Privacy settings for meeting participants',
                duration: '3 min',
                type: 'guide',
                order: 10,
                isLocked: false
              },
              {
                id: 'lesson-schedule-11',
                title: 'Lock a meeting',
                description: 'Secure meetings by locking access',
                duration: '3 min',
                type: 'guide',
                order: 11,
                isLocked: false
              },
              {
                id: 'lesson-schedule-12',
                title: 'End a meeting',
                description: 'Properly conclude Teams meetings',
                duration: '2 min',
                type: 'video',
                order: 12,
                isLocked: false
              }
            ]
          }
        ]
      },
      {
        id: 'topic-manage-calendar',
        title: 'Manage your calendar',
        description: 'Calendar management in Teams',
        order: 4,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-calendar-1',
            title: 'Manage your calendar',
            description: 'Overview of calendar management',
            duration: '5 min',
            type: 'video',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-calendar-2',
            title: 'See all your meetings',
            description: 'View your complete meeting schedule',
            duration: '3 min',
            type: 'video',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-calendar-3',
            title: 'Get started in new calendar',
            description: 'Introduction to new calendar interface',
            duration: '4 min',
            type: 'guide',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-calendar-4',
            title: 'Customize your calendar',
            description: 'Personalize calendar settings and views',
            duration: '5 min',
            type: 'guide',
            order: 4,
            isLocked: false
          },
          {
            id: 'lesson-calendar-5',
            title: 'View multiple calendars',
            description: 'Manage multiple calendar views',
            duration: '4 min',
            type: 'video',
            order: 5,
            isLocked: false
          },
          {
            id: 'lesson-calendar-6',
            title: 'Work plans',
            description: 'Create and manage work plans',
            duration: '4 min',
            type: 'guide',
            order: 6,
            isLocked: false
          },
          {
            id: 'lesson-calendar-7',
            title: 'Share your calendar',
            description: 'Share calendar with colleagues',
            duration: '4 min',
            type: 'video',
            order: 7,
            isLocked: false
          }
        ]
      },
      {
        id: 'topic-participate-meetings',
        title: 'Participate in meetings',
        description: 'Active participation and collaboration in meetings',
        order: 5,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-participate-1',
            title: 'Meeting controls',
            description: 'Essential meeting controls and features',
            duration: '6 min',
            type: 'video',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-participate-2',
            title: 'Chat',
            description: 'Use chat during meetings',
            duration: '4 min',
            type: 'video',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-participate-3',
            title: 'Present content',
            description: 'Share your screen and content',
            duration: '5 min',
            type: 'video',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-participate-4',
            title: 'Presenter modes',
            description: 'Different presentation modes available',
            duration: '5 min',
            type: 'video',
            order: 4,
            isLocked: false
          },
          {
            id: 'lesson-participate-5',
            title: 'Share slides',
            description: 'Present PowerPoint slides in meetings',
            duration: '4 min',
            type: 'video',
            order: 5,
            isLocked: false
          },
          {
            id: 'lesson-participate-6',
            title: 'Share sound',
            description: 'Share computer audio during presentations',
            duration: '4 min',
            type: 'guide',
            order: 6,
            isLocked: false
          },
          {
            id: 'lesson-participate-7',
            title: 'Use video',
            description: 'Manage video settings and controls',
            duration: '4 min',
            type: 'video',
            order: 7,
            isLocked: false
          },
          {
            id: 'lesson-participate-8',
            title: 'Apply video filters',
            description: 'Use video filters and effects',
            duration: '4 min',
            type: 'video',
            order: 8,
            isLocked: false
          },
          {
            id: 'lesson-participate-9',
            title: 'Mute and unmute',
            description: 'Audio controls in meetings',
            duration: '3 min',
            type: 'video',
            order: 9,
            isLocked: false
          },
          {
            id: 'lesson-participate-10',
            title: 'Spotlight a video',
            description: 'Highlight specific participants',
            duration: '3 min',
            type: 'guide',
            order: 10,
            isLocked: false
          },
          {
            id: 'lesson-participate-11',
            title: 'Multitasking',
            description: 'Work on multiple tasks during meetings',
            duration: '4 min',
            type: 'guide',
            order: 11,
            isLocked: false
          },
          {
            id: 'lesson-participate-12',
            title: 'Raise your hand',
            description: 'Use hand raise feature to participate',
            duration: '2 min',
            type: 'video',
            order: 12,
            isLocked: false
          },
          {
            id: 'lesson-participate-13',
            title: 'Live reactions',
            description: 'Express reactions during meetings',
            duration: '3 min',
            type: 'video',
            order: 13,
            isLocked: false
          },
          {
            id: 'lesson-participate-14',
            title: 'Take meeting notes',
            description: 'Collaborate on meeting notes',
            duration: '5 min',
            type: 'guide',
            order: 14,
            isLocked: false
          },
          {
            id: 'lesson-participate-15',
            title: 'Join a breakout room',
            description: 'Participate in breakout sessions',
            duration: '5 min',
            type: 'video',
            order: 15,
            isLocked: false
          },
          {
            id: 'lesson-participate-16',
            title: 'Customize your view',
            description: 'Adjust meeting view settings',
            duration: '4 min',
            type: 'guide',
            order: 16,
            isLocked: false
          },
          {
            id: 'lesson-participate-17',
            title: 'Laser pointer',
            description: 'Use laser pointer during presentations',
            duration: '3 min',
            type: 'video',
            order: 17,
            isLocked: false
          },
          {
            id: 'lesson-participate-18',
            title: 'Cast from a desktop',
            description: 'Cast content from desktop to Teams',
            duration: '4 min',
            type: 'guide',
            order: 18,
            isLocked: false
          },
          {
            id: 'lesson-participate-19',
            title: 'Share physical resources',
            description: 'Share physical whiteboards and resources',
            duration: '4 min',
            type: 'video',
            order: 19,
            isLocked: false
          },
          {
            id: 'lesson-participate-20',
            title: 'Use a green screen',
            description: 'Virtual background with green screen',
            duration: '5 min',
            type: 'guide',
            order: 20,
            isLocked: false
          },
          {
            id: 'lesson-participate-21',
            title: 'Join as an avatar',
            description: 'Participate using personalized avatars',
            duration: '4 min',
            type: 'video',
            order: 21,
            isLocked: false
          },
          {
            id: 'lesson-participate-22',
            title: 'Customize your avatar',
            description: 'Create and customize your Teams avatar',
            duration: '5 min',
            type: 'guide',
            order: 22,
            isLocked: false
          },
          {
            id: 'lesson-participate-23',
            title: 'Use emotes, gestures, and more',
            description: 'Express yourself with avatars',
            duration: '4 min',
            type: 'video',
            order: 23,
            isLocked: false
          }
        ]
      },
      {
        id: 'topic-immersive-experiences',
        title: 'Immersive experiences',
        description: 'Advanced immersive meeting features',
        order: 6,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-immersive-1',
            title: 'Get started with immersive events',
            description: 'Introduction to immersive events',
            duration: '5 min',
            type: 'video',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-immersive-2',
            title: 'Schedule an immersive event',
            description: 'Plan and schedule immersive experiences',
            duration: '5 min',
            type: 'guide',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-immersive-3',
            title: 'Customize an immersive event',
            description: 'Personalize immersive event settings',
            duration: '6 min',
            type: 'guide',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-immersive-4',
            title: 'Host an immersive event',
            description: 'Lead immersive events effectively',
            duration: '6 min',
            type: 'video',
            order: 4,
            isLocked: false
          },
          {
            id: 'lesson-immersive-5',
            title: 'Attend an immersive event',
            description: 'Participate in immersive experiences',
            duration: '5 min',
            type: 'video',
            order: 5,
            isLocked: false
          },
          {
            id: 'lesson-immersive-6',
            title: 'Get started with immersive spaces',
            description: 'Introduction to immersive spaces',
            duration: '5 min',
            type: 'guide',
            order: 6,
            isLocked: false
          },
          {
            id: 'lesson-immersive-7',
            title: 'Use in-meeting controls',
            description: 'Control features during immersive meetings',
            duration: '5 min',
            type: 'video',
            order: 7,
            isLocked: false
          },
          {
            id: 'lesson-immersive-8',
            title: 'Spatial audio',
            description: 'Enhanced audio in immersive spaces',
            duration: '4 min',
            type: 'guide',
            order: 8,
            isLocked: false
          }
        ]
      },
      {
        id: 'topic-teams-premium',
        title: 'Teams Premium',
        description: 'Advanced Teams Premium features',
        order: 7,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-premium-1',
            title: 'Overview of Microsoft Teams Premium',
            description: 'Introduction to Teams Premium capabilities',
            duration: '6 min',
            type: 'video',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-premium-2',
            title: 'Intelligent productivity',
            description: 'AI-powered productivity features',
            duration: '5 min',
            type: 'video',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-premium-3',
            title: 'Advanced meeting protection',
            description: 'Enhanced security and protection',
            duration: '5 min',
            type: 'guide',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-premium-4',
            title: 'Engaging event experiences',
            description: 'Premium features for large events',
            duration: '5 min',
            type: 'video',
            order: 4,
            isLocked: false
          }
        ]
      },
      {
        id: 'topic-meeting-options',
        title: 'Meeting options',
        description: 'Advanced meeting configuration and settings',
        order: 8,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-options-1',
            title: 'Change your background',
            description: 'Customize virtual backgrounds',
            duration: '4 min',
            type: 'video',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-options-2',
            title: 'Meeting themes',
            description: 'Apply visual themes to meetings',
            duration: '4 min',
            type: 'guide',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-options-3',
            title: 'Audio settings',
            description: 'Configure audio preferences',
            duration: '5 min',
            type: 'video',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-options-4',
            title: 'Manage attendee audio and video',
            description: 'Control participant audio/video settings',
            duration: '5 min',
            type: 'guide',
            order: 4,
            isLocked: false
          },
          {
            id: 'lesson-options-5',
            title: 'Manage what attendees see',
            description: 'Control attendee view permissions',
            duration: '4 min',
            type: 'guide',
            order: 5,
            isLocked: false
          },
          {
            id: 'lesson-options-6',
            title: 'Use the green room',
            description: 'Prepare before joining main meeting',
            duration: '4 min',
            type: 'video',
            order: 6,
            isLocked: false
          },
          {
            id: 'lesson-options-7',
            title: 'Use RTMP-In',
            description: 'Stream into Teams using RTMP',
            duration: '5 min',
            type: 'guide',
            order: 7,
            isLocked: false
          },
          {
            id: 'lesson-options-8',
            title: 'Reduce background noise',
            description: 'Noise suppression features',
            duration: '4 min',
            type: 'video',
            order: 8,
            isLocked: false
          },
          {
            id: 'lesson-options-9',
            title: 'Voice isolation in Teams',
            description: 'Advanced audio isolation',
            duration: '4 min',
            type: 'guide',
            order: 9,
            isLocked: false
          },
          {
            id: 'lesson-options-10',
            title: 'Mute notifications',
            description: 'Manage notifications during meetings',
            duration: '3 min',
            type: 'guide',
            order: 10,
            isLocked: false
          },
          {
            id: 'lesson-options-11',
            title: 'Manage breakout rooms',
            description: 'Create and manage breakout sessions',
            duration: '6 min',
            type: 'video',
            order: 11,
            isLocked: false
          },
          {
            id: 'lesson-options-12',
            title: 'Live transcription',
            description: 'Enable and use live captions',
            duration: '4 min',
            type: 'video',
            order: 12,
            isLocked: false
          },
          {
            id: 'lesson-options-13',
            title: 'Language interpretation',
            description: 'Multi-language meeting support',
            duration: '5 min',
            type: 'guide',
            order: 13,
            isLocked: false
          },
          {
            id: 'lesson-options-14',
            title: 'Multilingual speech recognition',
            description: 'Speech recognition for multiple languages',
            duration: '5 min',
            type: 'guide',
            order: 14,
            isLocked: false
          },
          {
            id: 'lesson-options-15',
            title: 'Q&A',
            description: 'Manage questions and answers',
            duration: '4 min',
            type: 'video',
            order: 15,
            isLocked: false
          },
          {
            id: 'lesson-options-16',
            title: 'Live captions',
            description: 'Real-time captioning features',
            duration: '4 min',
            type: 'video',
            order: 16,
            isLocked: false
          },
          {
            id: 'lesson-options-17',
            title: 'Real-Time Text',
            description: 'Real-time text transcription',
            duration: '4 min',
            type: 'guide',
            order: 17,
            isLocked: false
          },
          {
            id: 'lesson-options-18',
            title: 'End-to-end encryption',
            description: 'Secure encrypted meetings',
            duration: '5 min',
            type: 'guide',
            order: 18,
            isLocked: false
          },
          {
            id: 'lesson-options-19',
            title: 'Watermark',
            description: 'Add watermarks to protect content',
            duration: '4 min',
            type: 'guide',
            order: 19,
            isLocked: false
          },
          {
            id: 'lesson-options-20',
            title: 'Sensitive content detection',
            description: 'Protect sensitive information',
            duration: '5 min',
            type: 'guide',
            order: 20,
            isLocked: false
          },
          {
            id: 'lesson-options-21',
            title: 'Meeting attendance reports',
            description: 'Track and review meeting attendance',
            duration: '5 min',
            type: 'video',
            order: 21,
            isLocked: false
          },
          {
            id: 'lesson-options-22',
            title: 'Using the lobby',
            description: 'Manage waiting room features',
            duration: '4 min',
            type: 'guide',
            order: 22,
            isLocked: false
          },
          {
            id: 'lesson-options-23',
            title: 'Meeting options',
            description: 'Complete overview of meeting settings',
            duration: '6 min',
            type: 'video',
            order: 23,
            isLocked: false
          }
        ]
      },
      {
        id: 'topic-recording-options',
        title: 'Recording options',
        description: 'Record and manage meeting recordings',
        order: 9,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-recording-1',
            title: 'Record a meeting',
            description: 'Start and stop meeting recordings',
            duration: '5 min',
            type: 'video',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-recording-2',
            title: 'Recap',
            description: 'AI-generated meeting summaries',
            duration: '4 min',
            type: 'video',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-recording-3',
            title: 'Play and share a meeting recording',
            description: 'Access and distribute recordings',
            duration: '5 min',
            type: 'guide',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-recording-4',
            title: 'Delete a recording',
            description: 'Remove meeting recordings',
            duration: '3 min',
            type: 'guide',
            order: 4,
            isLocked: false
          },
          {
            id: 'lesson-recording-5',
            title: 'Edit or delete a transcript',
            description: 'Manage meeting transcripts',
            duration: '4 min',
            type: 'guide',
            order: 5,
            isLocked: false
          },
          {
            id: 'lesson-recording-6',
            title: 'Customize access to recordings or transcripts',
            description: 'Control who can access recordings',
            duration: '5 min',
            type: 'guide',
            order: 6,
            isLocked: false
          }
        ]
      },
      {
        id: 'topic-live-events',
        title: 'Live events',
        description: 'Organize and produce live events',
        order: 10,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-live-1',
            title: 'Switch to town halls',
            description: 'Migrate from live events to town halls',
            duration: '5 min',
            type: 'guide',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-live-2',
            title: 'Get started',
            description: 'Introduction to live events',
            duration: '5 min',
            type: 'video',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-live-3',
            title: 'Schedule a live event',
            description: 'Plan and schedule live events',
            duration: '6 min',
            type: 'guide',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-live-4',
            title: 'Invite attendees',
            description: 'Manage live event invitations',
            duration: '4 min',
            type: 'video',
            order: 4,
            isLocked: false
          },
          {
            id: 'lesson-live-5',
            title: 'organizer checklist',
            description: 'Checklist for event organizers',
            duration: '5 min',
            type: 'guide',
            order: 5,
            isLocked: false
          },
          {
            id: 'lesson-live-6',
            title: 'For tier 1 events',
            description: 'Best practices for large-scale events',
            duration: '6 min',
            type: 'guide',
            order: 6,
            isLocked: false
          },
          {
            id: 'lesson-live-7',
            title: 'Produce a live event',
            description: 'Production workflow for live events',
            duration: '7 min',
            type: 'video',
            order: 7,
            isLocked: false
          },
          {
            id: 'lesson-live-8',
            title: 'Produce a live event with Teams Encoder',
            description: 'Advanced production with encoder',
            duration: '8 min',
            type: 'guide',
            order: 8,
            isLocked: false
          },
          {
            id: 'lesson-live-9',
            title: 'Best practices',
            description: 'Tips for successful live events',
            duration: '5 min',
            type: 'guide',
            order: 9,
            isLocked: false
          },
          {
            id: 'lesson-live-10',
            title: 'Present',
            description: 'Presentation tips for live events',
            duration: '5 min',
            type: 'video',
            order: 10,
            isLocked: false
          },
          {
            id: 'lesson-live-11',
            title: 'Moderate a Q&A',
            description: 'Manage Q&A during live events',
            duration: '5 min',
            type: 'guide',
            order: 11,
            isLocked: false
          },
          {
            id: 'lesson-live-12',
            title: 'Allow anonymous presenters',
            description: 'Enable anonymous participation',
            duration: '4 min',
            type: 'guide',
            order: 12,
            isLocked: false
          },
          {
            id: 'lesson-live-13',
            title: 'Attendee engagement report',
            description: 'Analyze event engagement metrics',
            duration: '5 min',
            type: 'video',
            order: 13,
            isLocked: false
          },
          {
            id: 'lesson-live-14',
            title: 'Recording and reports',
            description: 'Access recordings and analytics',
            duration: '5 min',
            type: 'guide',
            order: 14,
            isLocked: false
          },
          {
            id: 'lesson-live-15',
            title: 'Attend a live event in Teams',
            description: 'Participant guide for live events',
            duration: '4 min',
            type: 'video',
            order: 15,
            isLocked: false
          },
          {
            id: 'lesson-live-16',
            title: 'Participate in a Q&A',
            description: 'Submit questions during events',
            duration: '3 min',
            type: 'guide',
            order: 16,
            isLocked: false
          },
          {
            id: 'lesson-live-17',
            title: 'Use live captions',
            description: 'Access captions during live events',
            duration: '3 min',
            type: 'video',
            order: 17,
            isLocked: false
          }
        ]
      },
      {
        id: 'topic-webinars',
        title: 'Webinars',
        description: 'Create and manage Teams webinars',
        order: 11,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-webinar-1',
            title: 'Get started',
            description: 'Introduction to Teams webinars',
            duration: '5 min',
            type: 'video',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-webinar-2',
            title: 'Schedule a webinar',
            description: 'Plan and schedule webinars',
            duration: '6 min',
            type: 'guide',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-webinar-3',
            title: 'Customize a webinar',
            description: 'Personalize webinar settings',
            duration: '5 min',
            type: 'guide',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-webinar-4',
            title: 'Publicize a webinar',
            description: 'Promote and share webinars',
            duration: '4 min',
            type: 'video',
            order: 4,
            isLocked: false
          },
          {
            id: 'lesson-webinar-5',
            title: 'Manage webinar registration',
            description: 'Handle attendee registration',
            duration: '5 min',
            type: 'guide',
            order: 5,
            isLocked: false
          },
          {
            id: 'lesson-webinar-6',
            title: 'Change webinar details',
            description: 'Update webinar information',
            duration: '4 min',
            type: 'guide',
            order: 6,
            isLocked: false
          },
          {
            id: 'lesson-webinar-7',
            title: 'Manage webinar emails',
            description: 'Configure email notifications',
            duration: '4 min',
            type: 'guide',
            order: 7,
            isLocked: false
          },
          {
            id: 'lesson-webinar-8',
            title: 'Cancel a webinar',
            description: 'Cancel scheduled webinars',
            duration: '3 min',
            type: 'guide',
            order: 8,
            isLocked: false
          },
          {
            id: 'lesson-webinar-9',
            title: 'Manage webinar recordings',
            description: 'Access and manage webinar recordings',
            duration: '4 min',
            type: 'video',
            order: 9,
            isLocked: false
          },
          {
            id: 'lesson-webinar-10',
            title: 'Webinar attendance report',
            description: 'Review webinar participation data',
            duration: '4 min',
            type: 'guide',
            order: 10,
            isLocked: false
          }
        ]
      },
      {
        id: 'topic-town-halls',
        title: 'Town halls',
        description: 'Organize and host town hall meetings',
        order: 12,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-townhall-1',
            title: 'Get started with town hall',
            description: 'Introduction to town halls',
            duration: '5 min',
            type: 'video',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-townhall-2',
            title: 'Schedule a town hall',
            description: 'Plan and schedule town halls',
            duration: '6 min',
            type: 'guide',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-townhall-3',
            title: 'Manage town hall emails',
            description: 'Configure email communications',
            duration: '4 min',
            type: 'guide',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-townhall-4',
            title: 'Customize a town hall',
            description: 'Personalize town hall settings',
            duration: '5 min',
            type: 'guide',
            order: 4,
            isLocked: false
          },
          {
            id: 'lesson-townhall-5',
            title: 'Host a town hall',
            description: 'Best practices for hosting',
            duration: '6 min',
            type: 'video',
            order: 5,
            isLocked: false
          },
          {
            id: 'lesson-townhall-6',
            title: 'Control production tools',
            description: 'Use production features',
            duration: '5 min',
            type: 'guide',
            order: 6,
            isLocked: false
          },
          {
            id: 'lesson-townhall-7',
            title: 'Attend a town hall',
            description: 'Participant guide for town halls',
            duration: '4 min',
            type: 'video',
            order: 7,
            isLocked: false
          },
          {
            id: 'lesson-townhall-8',
            title: 'Chat in a town hall',
            description: 'Use chat features during town halls',
            duration: '4 min',
            type: 'guide',
            order: 8,
            isLocked: false
          },
          {
            id: 'lesson-townhall-9',
            title: 'Town hall insights',
            description: 'Analyze town hall engagement',
            duration: '5 min',
            type: 'video',
            order: 9,
            isLocked: false
          },
          {
            id: 'lesson-townhall-10',
            title: 'Manage town hall recordings',
            description: 'Access and manage recordings',
            duration: '4 min',
            type: 'guide',
            order: 10,
            isLocked: false
          },
          {
            id: 'lesson-townhall-11',
            title: 'Cancel a town hall',
            description: 'Cancel scheduled town halls',
            duration: '3 min',
            type: 'guide',
            order: 11,
            isLocked: false
          }
        ]
      },
      {
        id: 'topic-best-practices-meetings',
        title: 'Best practices',
        description: 'Best practices for Teams meetings',
        order: 13,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-best-1',
            title: 'Setting up large meetings and events',
            description: 'Best practices for large-scale meetings',
            duration: '6 min',
            type: 'guide',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-best-2',
            title: 'Presenting in large meetings and events',
            description: 'Presentation tips for large audiences',
            duration: '6 min',
            type: 'video',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-best-3',
            title: 'Producing large meetings and events',
            description: 'Production workflow best practices',
            duration: '7 min',
            type: 'guide',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-best-4',
            title: 'Hosting hybrid meetings and events in Microsoft Teams Rooms',
            description: 'Best practices for hybrid setups',
            duration: '7 min',
            type: 'video',
            order: 4,
            isLocked: false
          }
        ]
      },
      {
        id: 'topic-troubleshooting-meetings',
        title: 'Troubleshooting',
        description: 'Common issues and solutions for Teams meetings',
        order: 14,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-trouble-1',
            title: 'Can\'t join a meeting',
            description: 'Troubleshoot meeting join issues',
            duration: '5 min',
            type: 'guide',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-trouble-2',
            title: 'Camera isn\'t working',
            description: 'Fix camera issues in Teams',
            duration: '5 min',
            type: 'guide',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-trouble-3',
            title: 'Microphone isn\'t working',
            description: 'Resolve microphone problems',
            duration: '5 min',
            type: 'guide',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-trouble-4',
            title: 'My speaker isn\'t working',
            description: 'Fix audio output issues',
            duration: '4 min',
            type: 'guide',
            order: 4,
            isLocked: false
          },
          {
            id: 'lesson-trouble-5',
            title: 'Can\'t record a meeting',
            description: 'Troubleshoot recording problems',
            duration: '5 min',
            type: 'guide',
            order: 5,
            isLocked: false
          },
          {
            id: 'lesson-trouble-6',
            title: 'Can\'t transcribe a meeting',
            description: 'Fix transcription issues',
            duration: '4 min',
            type: 'guide',
            order: 6,
            isLocked: false
          },
          {
            id: 'lesson-trouble-7',
            title: 'Meeting chat access',
            description: 'Resolve chat access problems',
            duration: '4 min',
            type: 'guide',
            order: 7,
            isLocked: false
          },
          {
            id: 'lesson-trouble-8',
            title: 'Breakout rooms issues',
            description: 'Fix breakout room problems',
            duration: '5 min',
            type: 'guide',
            order: 8,
            isLocked: false
          },
          {
            id: 'lesson-trouble-9',
            title: 'Immersive spaces issues',
            description: 'Troubleshoot immersive space problems',
            duration: '5 min',
            type: 'guide',
            order: 9,
            isLocked: false
          },
          {
            id: 'lesson-trouble-10',
            title: 'Meetings keep dropping',
            description: 'Resolve connection stability issues',
            duration: '5 min',
            type: 'guide',
            order: 10,
            isLocked: false
          },
          {
            id: 'lesson-trouble-11',
            title: 'Call and meeting quality',
            description: 'Improve audio and video quality',
            duration: '6 min',
            type: 'guide',
            order: 11,
            isLocked: false
          }
        ]
      }
    ]
  },
  {
    id: 'ms-teams-chat',
    slug: 'ms-teams-chat',
    title: 'Ms Teams (Chat)',
    provider: 'Tech (Microsoft)',
    courseCategory: 'Key Tools',
    deliveryMode: 'Guide',
    duration: 'Medium',
    levelCode: L('L2'),
    department: ['DBP Platform'],
    locations: ['Riyadh'],
    audience: ['Associate', 'Lead'],
    status: 'live',
    courseType: 'Course (Multi-Lessons)',
    rating: 4.5,
    reviewCount: 22,
    summary:
      'Master Microsoft Teams chat features including messaging, file sharing, group chats, and advanced collaboration tools.',
    highlights: [
      'Send and manage messages effectively',
      'Share files, pictures, and links',
      'Organize group chats and conversations',
      'Use advanced chat features and commands'
    ],
    outcomes: [
      'Communicate effectively using Teams chat',
      'Share files and collaborate in conversations',
      'Manage chat threads and organize conversations',
      'Use productivity features and slash commands'
    ],
    testimonials: [
      {
        author: 'Fatima Al-Zahra',
        role: 'Communication Specialist',
        text: 'This course made me much more efficient with Teams chat. The file sharing and group chat features are now second nature.',
        rating: 5
      },
      {
        author: 'Khalid Hassan',
        role: 'Team Coordinator',
        text: 'Great overview of Teams chat capabilities. The advanced features and commands section was particularly useful.',
        rating: 4
      }
    ],
    curriculum: [
      {
        id: 'topic-send-messages',
        title: 'Send messages',
        description: 'Master messaging in Teams',
        order: 1,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-send-1',
            title: 'Start a chat with others',
            description: 'Initiate conversations in Teams',
            duration: '4 min',
            type: 'video',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-send-2',
            title: 'Send and read',
            description: 'Basic message sending and reading',
            duration: '3 min',
            type: 'video',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-send-3',
            title: 'Send a file, picture, or link',
            description: 'Share files and media in chats',
            duration: '5 min',
            type: 'video',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-send-4',
            title: 'Send an emoji, GIF, or sticker',
            description: 'Add emojis and media to messages',
            duration: '4 min',
            type: 'video',
            order: 4,
            isLocked: false
          },
          {
            id: 'lesson-send-5',
            title: 'Select your emoji skin tone',
            description: 'Customize emoji appearance',
            duration: '2 min',
            type: 'guide',
            order: 5,
            isLocked: false
          },
          {
            id: 'lesson-send-6',
            title: 'Use custom emoji',
            description: 'Create and use custom emojis',
            duration: '4 min',
            type: 'guide',
            order: 6,
            isLocked: false
          },
          {
            id: 'lesson-send-7',
            title: 'Read receipts',
            description: 'Understand message read status',
            duration: '3 min',
            type: 'guide',
            order: 7,
            isLocked: false
          },
          {
            id: 'lesson-send-8',
            title: 'Format a message',
            description: 'Apply formatting to messages',
            duration: '4 min',
            type: 'guide',
            order: 8,
            isLocked: false
          },
          {
            id: 'lesson-send-9',
            title: 'Check your spelling in multiple languages',
            description: 'Use spell check for different languages',
            duration: '4 min',
            type: 'guide',
            order: 9,
            isLocked: false
          },
          {
            id: 'lesson-send-10',
            title: 'Use suggested replies',
            description: 'Quick reply suggestions',
            duration: '3 min',
            type: 'video',
            order: 10,
            isLocked: false
          },
          {
            id: 'lesson-send-11',
            title: 'Like or react to messages',
            description: 'React to messages with emojis',
            duration: '3 min',
            type: 'video',
            order: 11,
            isLocked: false
          },
          {
            id: 'lesson-send-12',
            title: 'Copy and paste',
            description: 'Copy and paste content in Teams',
            duration: '2 min',
            type: 'guide',
            order: 12,
            isLocked: false
          },
          {
            id: 'lesson-send-13',
            title: 'Mark a message as important or urgent',
            description: 'Highlight important messages',
            duration: '3 min',
            type: 'guide',
            order: 13,
            isLocked: false
          },
          {
            id: 'lesson-send-14',
            title: 'Share your screen in a chat',
            description: 'Screen sharing in chat windows',
            duration: '4 min',
            type: 'video',
            order: 14,
            isLocked: false
          },
          {
            id: 'lesson-send-15',
            title: 'Share a contact',
            description: 'Share contact information',
            duration: '3 min',
            type: 'guide',
            order: 15,
            isLocked: false
          },
          {
            id: 'lesson-send-16',
            title: 'Forward a message',
            description: 'Forward messages to others',
            duration: '3 min',
            type: 'guide',
            order: 16,
            isLocked: false
          },
          {
            id: 'lesson-send-17',
            title: 'Report messages',
            description: 'Report inappropriate content',
            duration: '3 min',
            type: 'guide',
            order: 17,
            isLocked: false
          },
          {
            id: 'lesson-send-18',
            title: 'Use file suggestions',
            description: 'AI-powered file recommendations',
            duration: '4 min',
            type: 'video',
            order: 18,
            isLocked: false
          },
          {
            id: 'lesson-send-19',
            title: 'Record a video clip',
            description: 'Send video messages',
            duration: '5 min',
            type: 'video',
            order: 19,
            isLocked: false
          },
          {
            id: 'lesson-send-20',
            title: 'Use text predictions',
            description: 'AI text completion suggestions',
            duration: '4 min',
            type: 'video',
            order: 20,
            isLocked: false
          },
          {
            id: 'lesson-send-21',
            title: 'Schedule chat messages',
            description: 'Schedule messages for later',
            duration: '4 min',
            type: 'guide',
            order: 21,
            isLocked: false
          }
        ]
      },
      {
        id: 'topic-chat-outside-team',
        title: 'Chat outside a team',
        description: 'External communication features',
        order: 2,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-external-1',
            title: 'Add or invite people outside your org to a chat',
            description: 'Include external participants',
            duration: '5 min',
            type: 'guide',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-external-2',
            title: 'Accept people outside your org',
            description: 'Approve external participant requests',
            duration: '4 min',
            type: 'guide',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-external-3',
            title: 'Block or unblock people outside your org',
            description: 'Manage external contacts',
            duration: '4 min',
            type: 'guide',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-external-4',
            title: 'Send messages to Skype for Business users',
            description: 'Interoperability with Skype',
            duration: '4 min',
            type: 'guide',
            order: 4,
            isLocked: false
          }
        ]
      },
      {
        id: 'topic-manage-messages',
        title: 'Manage messages',
        description: 'Organize and manage your messages',
        order: 3,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-manage-1',
            title: 'Edit or delete a message',
            description: 'Modify sent messages',
            duration: '4 min',
            type: 'video',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-manage-2',
            title: 'Save a message',
            description: 'Bookmark important messages',
            duration: '3 min',
            type: 'guide',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-manage-3',
            title: 'Hide a chat or leave a chat thread',
            description: 'Organize your chat list',
            duration: '4 min',
            type: 'video',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-manage-4',
            title: 'Pin a chat message',
            description: 'Pin important messages',
            duration: '3 min',
            type: 'guide',
            order: 4,
            isLocked: false
          },
          {
            id: 'lesson-manage-5',
            title: 'Hide, unhide, mute, add a chat to Favorites, or mark a chat as unread',
            description: 'Chat organization options',
            duration: '5 min',
            type: 'guide',
            order: 5,
            isLocked: false
          },
          {
            id: 'lesson-manage-6',
            title: 'Accept or block chat requests from people inside your org',
            description: 'Manage internal chat requests',
            duration: '4 min',
            type: 'guide',
            order: 6,
            isLocked: false
          },
          {
            id: 'lesson-manage-7',
            title: 'Open a chat in a new window',
            description: 'Multi-window chat management',
            duration: '3 min',
            type: 'guide',
            order: 7,
            isLocked: false
          },
          {
            id: 'lesson-manage-8',
            title: 'Prevent spam or phishing attempts from external chats',
            description: 'Security and spam prevention',
            duration: '5 min',
            type: 'guide',
            order: 8,
            isLocked: false
          },
          {
            id: 'lesson-manage-9',
            title: 'Search for messages',
            description: 'Find messages using search',
            duration: '4 min',
            type: 'video',
            order: 9,
            isLocked: false
          },
          {
            id: 'lesson-manage-10',
            title: 'Translate a message',
            description: 'Translate messages to your language',
            duration: '4 min',
            type: 'video',
            order: 10,
            isLocked: false
          },
          {
            id: 'lesson-manage-11',
            title: 'Change the spacing',
            description: 'Adjust message spacing',
            duration: '2 min',
            type: 'guide',
            order: 11,
            isLocked: false
          },
          {
            id: 'lesson-manage-12',
            title: 'Preview messages',
            description: 'Message preview features',
            duration: '3 min',
            type: 'guide',
            order: 12,
            isLocked: false
          },
          {
            id: 'lesson-manage-13',
            title: 'Show chat info',
            description: 'View chat details and settings',
            duration: '3 min',
            type: 'guide',
            order: 13,
            isLocked: false
          },
          {
            id: 'lesson-manage-14',
            title: 'Manage chats with the Teams mobile app',
            description: 'Mobile chat management',
            duration: '4 min',
            type: 'video',
            order: 14,
            isLocked: false
          },
          {
            id: 'lesson-manage-15',
            title: 'Share to Outlook from Teams',
            description: 'Integration with Outlook',
            duration: '4 min',
            type: 'guide',
            order: 15,
            isLocked: false
          }
        ]
      },
      {
        id: 'topic-group-chat',
        title: 'Group chat',
        description: 'Manage group conversations',
        order: 4,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-group-1',
            title: 'Leave or remove someone from a group chat',
            description: 'Manage group membership',
            duration: '4 min',
            type: 'guide',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-group-2',
            title: 'Personalize your group chat image',
            description: 'Customize group appearance',
            duration: '3 min',
            type: 'guide',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-group-3',
            title: 'Chat with members from distribution list or M365 group',
            description: 'Create chats from groups',
            duration: '4 min',
            type: 'guide',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-group-4',
            title: 'Share a link to a specific message',
            description: 'Link to specific messages',
            duration: '3 min',
            type: 'guide',
            order: 4,
            isLocked: false
          }
        ]
      },
      {
        id: 'topic-learn-more-chat',
        title: 'Learn more',
        description: 'Advanced chat features and tips',
        order: 5,
        isLocked: false,
        lessons: [
          {
            id: 'lesson-learn-1',
            title: 'Use slash commands',
            description: 'Productivity commands in Teams',
            duration: '5 min',
            type: 'guide',
            order: 1,
            isLocked: false
          },
          {
            id: 'lesson-learn-2',
            title: 'Send Praise to people',
            description: 'Recognize team members',
            duration: '3 min',
            type: 'video',
            order: 2,
            isLocked: false
          },
          {
            id: 'lesson-learn-3',
            title: 'Use code blocks',
            description: 'Format code in messages',
            duration: '4 min',
            type: 'guide',
            order: 3,
            isLocked: false
          },
          {
            id: 'lesson-learn-4',
            title: 'Send code snippets in a message',
            description: 'Share code snippets',
            duration: '4 min',
            type: 'guide',
            order: 4,
            isLocked: false
          },
          {
            id: 'lesson-learn-5',
            title: 'Use Markdown formatting',
            description: 'Apply Markdown in messages',
            duration: '5 min',
            type: 'guide',
            order: 5,
            isLocked: false
          },
          {
            id: 'lesson-learn-6',
            title: 'Use Immersive Reader',
            description: 'Accessibility reading features',
            duration: '4 min',
            type: 'guide',
            order: 6,
            isLocked: false
          },
          {
            id: 'lesson-learn-7',
            title: 'Do your one-on-ones with Teams chat',
            description: 'Conduct one-on-one meetings',
            duration: '5 min',
            type: 'video',
            order: 7,
            isLocked: false
          },
          {
            id: 'lesson-learn-8',
            title: 'Get started with storyline',
            description: 'Introduction to storyline features',
            duration: '5 min',
            type: 'guide',
            order: 8,
            isLocked: false
          }
        ]
      }
    ]
  },
  // Microsoft Teams Bundle
  {
    id: 'microsoft-teams-help-learning',
    slug: 'microsoft-teams-help-learning',
    title: 'Microsoft Teams help & Learning',
    provider: 'Tech (Microsoft)',
    courseCategory: 'Key Tools',
    deliveryMode: 'Hybrid',
    duration: 'Long',
    levelCode: L('L2'),
    department: ['DBP Platform'],
    locations: ['Riyadh'],
    audience: ['Associate', 'Lead'],
    status: 'live',
    courseType: 'Course (Bundles)',
    track: 'Microsoft Teams help & Learning',
    rating: 4.6,
    reviewCount: 35,
    summary:
      'Comprehensive learning track for Microsoft Teams covering meetings, chat, collaboration, and advanced features to help you master Teams for effective communication and teamwork.',
    highlights: [
      'Master Teams meetings from basics to advanced events',
      'Learn chat, messaging, and collaboration features',
      'Organize webinars, live events, and town halls',
      'Troubleshoot common issues and optimize productivity'
    ],
    outcomes: [
      'Join, schedule, and manage Teams meetings effectively',
      'Communicate efficiently using Teams chat features',
      'Organize and host large-scale events and webinars',
      'Resolve common issues and use advanced features'
    ],
    faq: [
      {
        question: 'What are the requirements for taking this track?',
        answer: 'This track is designed for all team members who use Microsoft Teams. No prior experience is required, but having access to Microsoft Teams and a basic understanding of collaboration tools will be helpful. You should have access to Teams within your organization.'
      },
      {
        question: 'How long does it take to complete the Microsoft Teams help & Learning track?',
        answer: 'The Microsoft Teams track can be completed at your own pace. Most participants finish the core content within 4-6 weeks when dedicating 3-5 hours per week. The track includes comprehensive coverage of meetings and chat features.'
      },
      {
        question: 'Can I take individual courses from this track?',
        answer: 'Yes, all courses within the Microsoft Teams track can be taken individually. The "Ms Teams (Meetings)" and "Ms Teams (Chat)" courses are available as standalone courses, though we recommend taking the full track for complete Teams mastery.'
      },
      {
        question: 'What topics are covered in this track?',
        answer: 'The track covers Teams meetings (joining, scheduling, managing, webinars, live events), Teams chat (messaging, file sharing, group chats), collaboration features, and troubleshooting. It includes both beginner and advanced topics.'
      },
      {
        question: 'Do I need Teams Premium for all features?',
        answer: 'Many features work with standard Teams. Some advanced features like immersive experiences, advanced meeting protection, and certain event features require Teams Premium. The course clearly indicates which features require Premium.'
      },
      {
        question: 'What support is available if I encounter issues?',
        answer: 'Each course includes troubleshooting lessons and resources. You can also reach out to your IT support team or the Microsoft Teams administrator for assistance with technical issues or access problems.'
      }
    ],
    testimonials: [
      {
        author: 'Ahmad Al-Mansoori',
        role: 'Project Lead',
        text: 'This comprehensive track transformed how our team uses Microsoft Teams. The meetings and chat courses are both excellent, and we\'re now much more productive.',
        rating: 5
      },
      {
        author: 'Layla Al-Rashid',
        role: 'Operations Manager',
        text: 'The Microsoft Teams track is incredibly thorough. I especially appreciated the troubleshooting section and advanced features coverage.',
        rating: 4
      },
      {
        author: 'Omar Hassan',
        role: 'Team Coordinator',
        text: 'As someone new to Teams, this track was perfect. The step-by-step approach and comprehensive coverage helped me become proficient quickly.',
        rating: 5
      }
    ],
    // Track (Bundles) - contains courses with topics and lessons
    curriculum: [
      {
        id: 'course-ms-teams-meetings',
        title: 'Ms Teams (Meetings)',
        description: 'Master Microsoft Teams meetings from joining and scheduling to advanced features like webinars, live events, and immersive experiences.',
        courseSlug: 'ms-teams-meetings',
        order: 1,
        isLocked: false,
        topics: [
          {
            id: 'track-topic-meetings-overview',
            title: 'Meeting Fundamentals',
            description: 'Core meeting features and controls',
            order: 1,
            isLocked: false,
            lessons: [
              {
                id: 'track-lesson-join-basics',
                title: 'Joining and Scheduling Basics',
                description: 'Essential skills for participating in Teams meetings',
                duration: '10 min',
                type: 'video',
                order: 1,
                isLocked: false
              }
            ]
          },
          {
            id: 'track-topic-meetings-advanced',
            title: 'Advanced Meeting Features',
            description: 'Webinars, live events, and premium features',
            order: 2,
            isLocked: false,
            lessons: [
              {
                id: 'track-lesson-events',
                title: 'Large-Scale Events',
                description: 'Organizing webinars and town halls',
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
        id: 'course-ms-teams-chat',
        title: 'Ms Teams (Chat)',
        description: 'Master Microsoft Teams chat features including messaging, file sharing, group chats, and advanced collaboration tools.',
        courseSlug: 'ms-teams-chat',
        order: 2,
        isLocked: false,
        topics: [
          {
            id: 'track-topic-chat-basics',
            title: 'Chat Fundamentals',
            description: 'Core messaging and communication features',
            order: 1,
            isLocked: false,
            lessons: [
              {
                id: 'track-lesson-messaging',
                title: 'Effective Messaging',
                description: 'Send and manage messages in Teams',
                duration: '8 min',
                type: 'video',
                order: 1,
                isLocked: false
              }
            ]
          },
          {
            id: 'track-topic-chat-advanced',
            title: 'Advanced Chat Features',
            description: 'Group chats, commands, and productivity tools',
            order: 2,
            isLocked: false,
            lessons: [
              {
                id: 'track-lesson-productivity',
                title: 'Productivity Features',
                description: 'Slash commands and advanced collaboration',
                duration: '10 min',
                type: 'guide',
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
  imageUrl?: string;
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
