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
  imageUrl?: string; // Added image URL field
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
    provider: 'DQ DTMA',
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
    imageUrl: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Professional orientation
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
    imageUrl: 'https://images.pexels.com/photos/732103/pexels-photo-732103.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Abstract business/collaboration
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
    ],
    imageUrl: 'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Digital transformation/data flow
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
    imageUrl: 'https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Digital workspace/dashboard
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
    ],
    imageUrl: 'https://images.pexels.com/photos/5474291/pexels-photo-5474291.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Content modeling/digital design
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
    ],
    imageUrl: 'https://images.pexels.com/photos/1775985/pexels-photo-1775985.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Code/deployment pipeline
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
    ],
    imageUrl: 'https://images.pexels.com/photos/196656/pexels-photo-196656.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // AI / code integration
  },
  {
    id: 'first-7-days',
    slug: 'first-7-days',
    title: 'Your First 7 Days at DQ',
    provider: 'DQ DTMA',
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
    imageUrl: 'https://images.pexels.com/photos/3153198/pexels-photo-3153198.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Onboarding checklist/welcome
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
                description: 'Introduction to DQ and team setup',
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
    ],
    imageUrl: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Governance/Policy visual
  },
  {
    id: 'leadership-track',
    slug: 'leadership-track',
    title: 'Leadership Track',
    provider: 'DQ DTMA',
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
    imageUrl: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Leadership meeting/vision
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
    provider: 'DQ DTMA',
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
        answer: 'You will be assigned an onboarding buddy or mentor who can help answer questions and provide guidance. Additionally, each course includes support resources, and you can reach out to the DQ DTMA team for assistance at any time.'
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
    imageUrl: 'https://images.pexels.com/photos/3153198/pexels-photo-3153198.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Onboarding checklist/welcome
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

  // --- START OF NEW MS PLANNER LEARNING TRACK COURSES ---

// 1. The main MS Planner Track (Bundle)
{
  id: 'ms-planner-learning-track',
  slug: 'ms-planner-learning-track',
  title: 'Microsoft Planner help & Learning',
  provider: 'Tech (Microsoft)',
  courseCategory: 'DWS',
  deliveryMode: 'Guide',
  duration: 'Medium',
  levelCode: L('L2'),
  department: ['DBP', 'DCO'],
  locations: ['Remote'],
  audience: ['Associate', 'Lead'],
  status: 'live',
  courseType: 'Course (Bundles)',
  track: 'Microsoft Planner help & Learning',
  summary: 'A structured guide to using Microsoft Planner for team collaboration, project management, task creation, and progress tracking.',
  highlights: [
      'Learn to create and manage basic and premium plans',
      'Master task assignment, scheduling, and prioritization',
      'Effective use of charts and calendar views to track progress',
      'Tips for collaboration and notification management'
  ],
  outcomes: [
      'Set up a new plan and customize task buckets',
      'Efficiently manage team workload and task status',
      'Use visual tools for clear project oversight',
      'Collaborate securely using guest access and comments'
  ],
  imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Microsoft_Planner_2019.png', // Microsoft Planner logo/screenshot
  curriculum: [
      {
          id: 'course-planner-get-started-track',
          title: 'Ms Planner (Getting Started)',
          description: 'Introduction to Planner on the web and in Teams.',
          courseSlug: 'ms-planner-getting-started',
          order: 1,
          isLocked: false,
      },
      {
          id: 'course-planner-build-plan-track',
          title: 'Ms Planner (Build your plan)',
          description: 'Creating plans, managing membership, and setting up tasks.',
          courseSlug: 'ms-planner-build-your-plan',
          order: 2,
          isLocked: false,
      },
      {
          id: 'course-planner-stay-on-track-track',
          title: 'Ms Planner (Stay on track)',
          description: 'Monitoring progress through views and enabling team collaboration.',
          courseSlug: 'ms-planner-stay-on-track',
          order: 3,
          isLocked: false,
      }
  ]
},

// 2. Ms Planner (Getting Started) - Course
{
  id: 'ms-planner-getting-started',
  slug: 'ms-planner-getting-started',
  title: 'Ms Planner (Getting Started)',
  provider: 'Tech (Microsoft)',
  courseCategory: 'DWS',
  deliveryMode: 'Guide',
  duration: 'Bite-size',
  levelCode: L('L1'),
  department: ['DBP'],
  locations: ['Remote'],
  audience: ['Associate'],
  status: 'live',
  courseType: 'Course (Multi-Lessons)',
  track: 'Microsoft Planner help & Learning',
  summary: 'A quick introduction to accessing Microsoft Planner on different platforms to begin task management.',
  highlights: ['Access Planner via web browser', 'Integrate Planner directly into Teams'],
  outcomes: ['Locate and launch Planner successfully on any device', 'Understand the basic interface for both platforms'],
  imageUrl: 'https://images.pexels.com/photos/5668856/pexels-photo-5668856.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Getting started/teams interface
  curriculum: [
      {
          id: 'module-planner-access',
          title: 'Getting Started',
          order: 1,
          topics: [
              {
                  id: 'topic-planner-access',
                  title: 'Getting Started',
                  order: 1,
                  lessons: [
                      { id: 'lesson-pln-web', title: 'Planner for the web', type: 'guide', order: 1, isLocked: false },
                      { id: 'lesson-pln-teams', title: 'Planner in Teams', type: 'guide', order: 2, isLocked: false },
                  ]
              }
          ]
      }
  ]
},

// 3. Ms Planner (Build your plan) - Course
{
  id: 'ms-planner-build-your-plan',
  slug: 'ms-planner-build-your-plan',
  title: 'Ms Planner (Build your plan)',
  provider: 'Tech (Microsoft)',
  courseCategory: 'DWS',
  deliveryMode: 'Guide',
  duration: 'Medium',
  levelCode: L('L2'),
  department: ['DBP', 'DCO'],
  locations: ['Remote'],
  audience: ['Associate', 'Lead'],
  status: 'live',
  courseType: 'Course (Multi-Lessons)',
  track: 'Microsoft Planner help & Learning',
  summary: 'Detailed instructions on creating, configuring, and populating your plan with tasks, assignments, and key metadata.',
  highlights: ['Create new plans and manage plan settings', 'Assign priority and due dates to tasks', 'Use advanced features like labels and checklists'],
  outcomes: ['Structure a complex project plan effectively', 'Manage plan access and compare subscription features', 'Use task metadata to ensure clear execution'],
  imageUrl: 'https://images.pexels.com/photos/3183198/pexels-photo-3183198.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Project planning/Kanban
  curriculum: [
      {
          id: 'module-planner-plans',
          title: 'Plan Management',
          order: 1,
          topics: [
              {
                  id: 'topic-planner-plans',
                  title: 'Plans',
                  order: 1,
                  lessons: [
                      { id: 'lesson-pln-sign-in', title: 'Sign in to Microsoft Planner', type: 'guide', order: 1, isLocked: false },
                      { id: 'lesson-pln-create-plan', title: 'Create a plan in Microsoft Planner', type: 'guide', order: 2, isLocked: false },
                      { id: 'lesson-pln-create-buckets', title: 'Create buckets to sort your tasks', type: 'guide', order: 3, isLocked: false },
                      { id: 'lesson-pln-add-people', title: 'Add people to your plan', type: 'guide', order: 4, isLocked: false },
                      { id: 'lesson-pln-copy-plan', title: 'Copy a plan', type: 'guide', order: 5, isLocked: false },
                      { id: 'lesson-pln-pin-plans', title: 'Pin selected plans', type: 'guide', order: 6, isLocked: false },
                      { id: 'lesson-pln-portfolios', title: 'Manage multiple plans with portfolios', type: 'guide', order: 7, isLocked: false },
                      { id: 'lesson-pln-delete', title: 'Delete a task or plan', type: 'guide', order: 8, isLocked: false },
                      { id: 'lesson-pln-compare-plans', title: 'Compare Basic vs Premium Plans', type: 'guide', order: 9, isLocked: false },
                  ]
              },
              {
                  id: 'topic-planner-tasks',
                  title: 'Tasks',
                  order: 2,
                  lessons: [
                      { id: 'lesson-pln-add-tasks', title: 'Add tasks to a plan', type: 'guide', order: 1, isLocked: false },
                      { id: 'lesson-pln-add-dates', title: 'Add task start and due dates', type: 'guide', order: 2, isLocked: false },
                      { id: 'lesson-pln-priority', title: 'Assign task priority', type: 'guide', order: 3, isLocked: false },
                      { id: 'lesson-pln-assign-people', title: 'Assign people to tasks', type: 'guide', order: 4, isLocked: false },
                      { id: 'lesson-pln-attach-files', title: 'Attach files, photos, or links to a task', type: 'guide', order: 5, isLocked: false },
                      { id: 'lesson-pln-preview-picture', title: 'Set a preview picture for a task', type: 'guide', order: 6, isLocked: false },
                      { id: 'lesson-pln-labels', title: 'Flag your tasks with labels', type: 'guide', order: 7, isLocked: false },
                      { id: 'lesson-pln-copy-tasks', title: 'Copy Planner tasks', type: 'guide', order: 8, isLocked: false },
                      { id: 'lesson-pln-checklist', title: 'Add a checklist to a task', type: 'guide', order: 9, isLocked: false },
                  ]
              }
          ]
      }
  ]
},

// 4. Ms Planner (Stay on track) - Course
{
  id: 'ms-planner-stay-on-track',
  slug: 'ms-planner-stay-on-track',
  title: 'Ms Planner (Stay on track)',
  provider: 'Tech (Microsoft)',
  courseCategory: 'DWS',
  deliveryMode: 'Guide',
  duration: 'Short',
  levelCode: L('L2'),
  department: ['DBP', 'DCO'],
  locations: ['Remote'],
  audience: ['Associate', 'Lead'],
  status: 'live',
  courseType: 'Course (Multi-Lessons)',
  track: 'Microsoft Planner help & Learning',
  summary: 'Techniques for tracking team progress, visualizing workload, and maintaining smooth communication within your plans.',
  highlights: ['Visualize project status using Charts view', 'Manage notifications to stay informed without distraction', 'Enable and secure guest access for external collaborators'],
  outcomes: ['Accurately report on task completion and timelines', 'Use calendar view for scheduling visibility', 'Facilitate clear and immediate collaboration via task comments'],
  imageUrl: 'https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Tracking progress/charts
  curriculum: [
      {
          id: 'module-planner-progress',
          title: 'Tracking and Collaboration',
          order: 1,
          topics: [
              {
                  id: 'topic-planner-view-progress',
                  title: 'View progress',
                  order: 1,
                  lessons: [
                      { id: 'lesson-pln-update-progress', title: 'Set and update task progress', type: 'guide', order: 1, isLocked: false },
                      { id: 'lesson-pln-view-charts', title: "View charts of your plan's progress", type: 'guide', order: 2, isLocked: false },
                      { id: 'lesson-pln-view-calendar', title: "View your tasks on a calendar", type: 'guide', order: 3, isLocked: false },
                  ]
              },
              {
                  id: 'topic-planner-collaborate',
                  title: 'Collaborate',
                  order: 2,
                  lessons: [
                      { id: 'lesson-pln-comment', title: 'Comment on tasks in Microsoft Planner', type: 'guide', order: 1, isLocked: false },
                      { id: 'lesson-pln-notifications', title: 'Manage Planner notifications', type: 'guide', order: 2, isLocked: false },
                      { id: 'lesson-pln-guest-access', title: 'Guest access in Microsoft Planner', type: 'guide', order: 3, isLocked: false },
                  ]
              }
          ]
      }
  ]
  },
  // --- END OF MS PLANNER LEARNING TRACK COURSES ---
  // --- START OF NEW MICROSOFT TEAMS LEARNING TRACK COURSES ---
  
  // 1. The main MS Learning Track (Bundle)
  {
      id: 'ms-learning-track',
      slug: 'ms-learning-track',
      title: 'Microsoft Teams help & Learning',
      provider: 'Tech (Microsoft)',
      courseCategory: 'DWS',
      deliveryMode: 'Hybrid',
      duration: 'Long',
      levelCode: L('L2'),
      department: ['DBP', 'DCO'],
      locations: ['Remote'], 
      audience: ['Associate', 'Lead'],
      status: 'live',
      courseType: 'Course (Bundles)',
      track: 'Microsoft Teams help & Learning',
      summary: 'A comprehensive learning track covering essential Microsoft Teams features, from chat and meetings to team management and device integration.',
      highlights: [
          'Master chat, meetings, and team configuration',
          'Optimize notifications and status for focus',
          'Learn advanced calling and device management for hybrid work',
          'Efficient file collaboration techniques'
      ],
      outcomes: [
          'Utilize Teams for effective communication and collaboration',
          'Run efficient meetings and events (Webinars, Town Halls)',
          'Manage team membership and channel structure correctly',
          'Configure personal settings for optimal DWS workflow'
      ],
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Teams_logo.svg/800px-Microsoft_Teams_logo.svg.png', // Microsoft Teams Logo
      curriculum: [
          {
              id: 'course-teams-meetings-track',
              title: 'MS Teams (Meetings)',
              description: 'Everything you need to know about joining, scheduling, and running effective meetings and live events.',
              courseSlug: 'ms-teams-meetings',
              order: 1,
              isLocked: false,
          },
          {
              id: 'course-teams-chat-track',
              title: 'MS Teams (Chat)',
              description: 'Master one-on-one and group messaging, formatting, and file sharing in chat.',
              courseSlug: 'ms-teams-chat',
              order: 2,
              isLocked: false,
          },
          {
              id: 'course-teams-notifications-track',
              title: 'MS Teams (Notification & Setting)',
              description: 'Focus on personal configuration for productivity.',
              courseSlug: 'ms-teams-notifications-settings',
              order: 3,
              isLocked: false,
          },
          {
              id: 'course-teams-channels-track',
              title: 'Ms Teams (Teams & Channels)',
              description: 'Manage collaborative spaces and channel structure.',
              courseSlug: 'ms-teams-teams-channels',
              order: 4,
              isLocked: false,
          },
          {
              id: 'course-teams-calls-track',
              title: 'MS Teams (Calls & Devices)',
              description: 'Making calls, managing devices, and advanced calling features.',
              courseSlug: 'ms-teams-calls-devices',
              order: 5,
              isLocked: false,
          },
          {
              id: 'course-teams-files-track',
              title: 'Ms Teams (Files)',
              description: 'Efficiently work with, share, and manage files in Teams.',
              courseSlug: 'ms-teams-files',
              order: 6,
              isLocked: false,
          }
      ]
  },
  
  // 2. MS Teams (Meetings) - Course
  {
      id: 'ms-teams-meetings',
      slug: 'ms-teams-meetings',
      title: 'MS Teams (Meetings)',
      provider: 'Tech (Microsoft)',
      courseCategory: 'DWS',
      deliveryMode: 'Guide',
      duration: 'Medium',
      levelCode: L('L2'),
      department: ['DBP', 'DCO'],
      locations: ['Remote'], // Location set to Remote
      audience: ['Associate', 'Lead'],
      status: 'live',
      courseType: 'Course (Multi-Lessons)',
      track: 'Microsoft Teams help & Learning',
      summary: 'A deep dive into joining, scheduling, and running effective meetings, including advanced features like immersive experiences, live events, and premium options.',
      highlights: ['Master meeting controls, sharing, and multitasking', 'Schedule and manage live events, webinars, and town halls', 'Utilize recording, transcription, and language interpretation options'],
      outcomes: ['Run professional and engaging virtual events', 'Troubleshoot common audio/video issues', 'Leverage Teams Premium features for security and intelligence'],
      imageUrl: 'https://images.pexels.com/photos/7161048/pexels-photo-7161048.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Virtual meeting
      curriculum: [
          {
              id: 'module-meetings',
              title: 'Meetings and Events',
              order: 1,
              topics: [
                  {
                      id: 'topic-teams-login',
                      title: 'Teams login',
                      order: 1,
                      lessons: [
                          { id: 'lesson-meet-login', title: 'How to Login', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-meet-web', title: 'Use Teams on the web', type: 'guide', order: 2, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-join-meeting',
                      title: 'Join a meeting',
                      order: 2,
                      lessons: [
                          { id: 'lesson-meet-join-teams', title: 'Join a meeting in Teams', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-meet-join-no-account', title: 'Join without a Teams account', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-meet-join-outside-org', title: 'Join a meeting outside your org', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-meet-join-second-device', title: 'Join on a second device', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-meet-join-view-only', title: 'Join as a view-only attendee', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-meet-join-google', title: 'Join from Google', type: 'guide', order: 6, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-schedule-meeting',
                      title: 'Schedule a meeting',
                      order: 3,
                      lessons: [
                          { id: 'lesson-meet-schedule-teams', title: 'Schedule a meeting in Teams', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-meet-schedule-outlook', title: 'Schedule from Outlook', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-meet-schedule-google', title: 'Schedule from Google', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-meet-instant', title: 'Instant meeting', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-meet-templates', title: 'Personal meeting templates', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-meet-dial-in', title: 'Add a dial-in number', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-meet-invite', title: 'Invite people', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-meet-roles', title: 'Meeting roles', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-meet-co-organizers', title: 'Add co-organizers', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-meet-hide-names', title: 'Hide attendee names', type: 'guide', order: 10, isLocked: false },
                          { id: 'lesson-meet-lock', title: 'Lock a meeting', type: 'guide', order: 11, isLocked: false },
                          { id: 'lesson-meet-end', title: 'End a meeting', type: 'guide', order: 12, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-manage-calendar',
                      title: 'Manage your calendar',
                      order: 4,
                      lessons: [
                          { id: 'lesson-cal-manage', title: 'Manage your calendar', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-cal-see-all', title: 'See all your meetings', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-cal-new-calendar', title: 'Get started in new calendar', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-cal-customize', title: 'Customize your calendar', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-cal-multiple', title: 'View multiple calendars', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-cal-work-plans', title: 'Work plans', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-cal-share', title: 'Share your calendar', type: 'guide', order: 7, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-participate-meetings',
                      title: 'Participate in meetings',
                      order: 5,
                      lessons: [
                          { id: 'lesson-part-controls', title: 'Meeting controls', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-part-chat', title: 'Chat', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-part-present-content', title: 'Present content', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-part-presenter-modes', title: 'Presenter modes', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-part-share-slides', title: 'Share slides', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-part-share-sound', title: 'Share sound', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-part-use-video', title: 'Use video', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-part-video-filters', title: 'Apply video filters', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-part-mute', title: 'Mute and unmute', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-part-spotlight', title: 'Spotlight a video', type: 'guide', order: 10, isLocked: false },
                          { id: 'lesson-part-multitasking', title: 'Multitasking', type: 'guide', order: 11, isLocked: false },
                          { id: 'lesson-part-raise-hand', title: 'Raise your hand', type: 'guide', order: 12, isLocked: false },
                          { id: 'lesson-part-reactions', title: 'Live reactions', type: 'guide', order: 13, isLocked: false },
                          { id: 'lesson-part-notes', title: 'Take meeting notes', type: 'guide', order: 14, isLocked: false },
                          { id: 'lesson-part-breakout', title: 'Join a breakout room', type: 'guide', order: 15, isLocked: false },
                          { id: 'lesson-part-customize-view', title: 'Customize your view', type: 'guide', order: 16, isLocked: false },
                          { id: 'lesson-part-laser-pointer', title: 'Laser pointer', type: 'guide', order: 17, isLocked: false },
                          { id: 'lesson-part-cast', title: 'Cast from a desktop', type: 'guide', order: 18, isLocked: false },
                          { id: 'lesson-part-share-resources', title: 'Share physical resources', type: 'guide', order: 19, isLocked: false },
                          { id: 'lesson-part-green-screen', title: 'Use a green screen', type: 'guide', order: 20, isLocked: false },
                          { id: 'lesson-part-avatar-join', title: 'Join as an avatar', type: 'guide', order: 21, isLocked: false },
                          { id: 'lesson-part-avatar-customize', title: 'Customize your avatar', type: 'guide', order: 22, isLocked: false },
                          { id: 'lesson-part-emotes', title: 'Use emotes, gestures, and more', type: 'guide', order: 23, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-immersive-experiences',
                      title: 'Immersive experiences',
                      order: 6,
                      lessons: [
                          { id: 'lesson-imm-get-started', title: 'Get started with immersive events', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-imm-schedule-event', title: 'Schedule an immersive event', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-imm-customize-event', title: 'Customize an immersive event', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-imm-host-event', title: 'Host an immersive event', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-imm-attend-event', title: 'Attend an immersive event', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-imm-spaces-start', title: 'Get started with immersive spaces', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-imm-in-meeting-controls', title: 'Use in-meeting controls', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-imm-spatial-audio', title: 'Spatial audio', type: 'guide', order: 8, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-teams-premium',
                      title: 'Teams Premium',
                      order: 7,
                      lessons: [
                          { id: 'lesson-premium-overview', title: 'Overview of Microsoft Teams Premium', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-premium-productivity', title: 'Intelligent productivity', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-premium-protection', title: 'Advanced meeting protection', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-premium-engaging-events', title: 'Engaging event experiences', type: 'guide', order: 4, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-meeting-options',
                      title: 'Meeting options',
                      order: 8,
                      lessons: [
                          { id: 'lesson-opt-background', title: 'Change your background', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-opt-themes', title: 'Meeting themes', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-opt-audio-settings', title: 'Audio settings', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-opt-manage-av', title: 'Manage attendee audio and video', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-opt-attendee-view', title: 'Manage what attendees see', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-opt-green-room', title: 'Use the green room', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-opt-rtmp', title: 'Use RTMP-In', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-opt-noise-reduce', title: 'Reduce background noise', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-opt-voice-isolation', title: 'Voice isolation in Teams', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-opt-mute-notifications', title: 'Mute notifications', type: 'guide', order: 10, isLocked: false },
                          { id: 'lesson-opt-breakout-manage', title: 'Manage breakout rooms', type: 'guide', order: 11, isLocked: false },
                          { id: 'lesson-opt-live-transcription', title: 'Live transcription', type: 'guide', order: 12, isLocked: false },
                          { id: 'lesson-opt-language-interpret', title: 'Language interpretation', type: 'guide', order: 13, isLocked: false },
                          { id: 'lesson-opt-multilingual', title: 'Multilingual speech recognition', type: 'guide', order: 14, isLocked: false },
                          { id: 'lesson-opt-qna', title: 'Q&A', type: 'guide', order: 15, isLocked: false },
                          { id: 'lesson-opt-live-captions', title: 'Live captions', type: 'guide', order: 16, isLocked: false },
                          { id: 'lesson-opt-rtt', title: 'Real-Time Text', type: 'guide', order: 17, isLocked: false },
                          { id: 'lesson-opt-e2e', title: 'End-to-end encryption', type: 'guide', order: 18, isLocked: false },
                          { id: 'lesson-opt-watermark', title: 'Watermark', type: 'guide', order: 19, isLocked: false },
                          { id: 'lesson-opt-sensitive-content', title: 'Sensitive content detection', type: 'guide', order: 20, isLocked: false },
                          { id: 'lesson-opt-attendance-report', title: 'Meeting attendance reports', type: 'guide', order: 21, isLocked: false },
                          { id: 'lesson-opt-lobby', title: 'Using the lobby', type: 'guide', order: 22, isLocked: false },
                          { id: 'lesson-opt-meeting-options', title: 'Meeting options', type: 'guide', order: 23, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-recording-options',
                      title: 'Recording options',
                      order: 9,
                      lessons: [
                          { id: 'lesson-rec-record', title: 'Record a meeting', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-rec-recap', title: 'Recap', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-rec-play-share', title: 'Play and share a meeting recording', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-rec-delete', title: 'Delete a recording', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-rec-edit-transcript', title: 'Edit or delete a transcript', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-rec-customize-access', title: 'Customize access to recordings or transcripts', type: 'guide', order: 6, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-live-events',
                      title: 'Live events',
                      order: 10,
                      lessons: [
                          { id: 'lesson-live-town-halls', title: 'Switch to town halls', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-live-get-started', title: 'Get started', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-live-schedule', title: 'Schedule a live event', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-live-invite', title: 'Invite attendees', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-live-checklist', title: 'organizer checklist', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-live-tier1', title: 'For tier 1 events', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-live-produce', title: 'Produce a live event', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-live-encoder', title: 'Produce a live event with Teams Encoder', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-live-best-practices', title: 'Best practices', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-live-present', title: 'Present', type: 'guide', order: 10, isLocked: false },
                          { id: 'lesson-live-moderate-qna', title: 'Moderate a Q&A', type: 'guide', order: 11, isLocked: false },
                          { id: 'lesson-live-anonymous', title: 'Allow anonymous presenters', type: 'guide', order: 12, isLocked: false },
                          { id: 'lesson-live-engagement', title: 'Attendee engagement report', type: 'guide', order: 13, isLocked: false },
                          { id: 'lesson-live-reports', title: 'Recording and reports', type: 'guide', order: 14, isLocked: false },
                          { id: 'lesson-live-attend', title: 'Attend a live event in Teams', type: 'guide', order: 15, isLocked: false },
                          { id: 'lesson-live-participate-qna', title: 'Participate in a Q&A', type: 'guide', order: 16, isLocked: false },
                          { id: 'lesson-live-captions', title: 'Use live captions', type: 'guide', order: 17, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-webinars',
                      title: 'Webinars',
                      order: 11,
                      lessons: [
                          { id: 'lesson-web-get-started', title: 'Get started', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-web-schedule', title: 'Schedule a webinar', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-web-customize', title: 'Customize a webinar', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-web-publicize', title: 'Publicize a webinar', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-web-manage-registration', title: 'Manage webinar registration', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-web-change-details', title: 'Change webinar details', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-web-manage-emails', title: 'Manage webinar emails', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-web-cancel', title: 'Cancel a webinar', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-web-manage-recordings', title: 'Manage webinar recordings', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-web-attendance-report', title: 'Webinar attendance report', type: 'guide', order: 10, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-town-halls',
                      title: 'Town halls',
                      order: 12,
                      lessons: [
                          { id: 'lesson-hall-get-started', title: 'Get started with town hall', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-hall-schedule', title: 'Schedule a town hall', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-hall-manage-emails', title: 'Manage town hall emails', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-hall-customize', title: 'Customize a town hall', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-hall-host', title: 'Host a town hall', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-hall-control-production', title: 'Control production tools', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-hall-attend', title: 'Attend a town hall', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-hall-chat', title: 'Chat in a town hall', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-hall-insights', title: 'Town hall insights', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-hall-manage-recordings', title: 'Manage town hall recordings', type: 'guide', order: 10, isLocked: false },
                          { id: 'lesson-hall-cancel', title: 'Cancel a town hall', type: 'guide', order: 11, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-best-practices',
                      title: 'Best practices',
                      order: 13,
                      lessons: [
                          { id: 'lesson-bp-setting-up-large', title: 'Setting up large meetings and events', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-bp-presenting-large', title: 'Presenting in large meetings and events', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-bp-producing-large', title: 'Producing large meetings and events', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-bp-hybrid', title: 'Hosting hybrid meetings and events in Microsoft Teams Rooms', type: 'guide', order: 4, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-troubleshooting',
                      title: 'Troubleshooting',
                      order: 14,
                      lessons: [
                          { id: 'lesson-ts-cant-join', title: "Can't join a meeting", type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-ts-camera', title: "Camera isn't working", type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-ts-mic', title: "Microphone isn't working", type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-ts-speaker', title: 'My speaker isn’t working', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-ts-cant-record', title: "Can't record a meeting", type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-ts-cant-transcribe', title: "Can't transcribe a meeting", type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-ts-chat-access', title: 'Meeting chat access', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-ts-breakout', title: 'Breakout rooms issues', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-ts-immersive', title: 'Immersive spaces issues', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-ts-dropping', title: 'Meetings keep dropping', type: 'guide', order: 10, isLocked: false },
                          { id: 'lesson-ts-quality', title: 'Call and meeting quality', type: 'guide', order: 11, isLocked: false },
                      ]
                  },
              ]
          }
      ]
  },

  // 3. MS Teams (Chat) - Course
  {
      id: 'ms-teams-chat',
      slug: 'ms-teams-chat',
      title: 'Ms Teams (Chat)',
      provider: 'Tech (Microsoft)',
      courseCategory: 'DWS',
      deliveryMode: 'Guide',
      duration: 'Short',
      levelCode: L('L2'),
      department: ['DBP'],
      locations: ['Remote'], // Location set to Remote
      audience: ['Associate'],
      status: 'live',
      courseType: 'Course (Multi-Lessons)',
      track: 'Microsoft Teams help & Learning',
      summary: 'Learn the essentials of effective one-on-one and group messaging, formatting, file sharing, and chat management features in Teams.',
      highlights: ['Format messages using markdown and code blocks', 'Manage chat requests, hide, pin, and mute conversations', 'Collaborate with external users securely'],
      outcomes: ['Communicate clearly and professionally in chat', 'Use advanced features like scheduled messages and video clips', 'Keep your chat list organized and focused'],
      imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Chat/Messaging visual
      curriculum: [
          {
              id: 'module-chat',
              title: 'Messaging and Chat Management',
              order: 1,
              topics: [
                  {
                      id: 'topic-send-messages',
                      title: 'Send messages',
                      order: 1,
                      lessons: [
                          { id: 'lesson-chat-start', title: 'Start a chat with others', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-chat-send-read', title: 'Send and read', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-chat-send-file', title: 'Send a file, picture, or link', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-chat-send-emoji', title: 'Send an emoji, GIF, or sticker', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-chat-emoji-skin', title: 'Select your emoji skin tone', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-chat-custom-emoji', title: 'Use custom emoji', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-chat-read-receipts', title: 'Read receipts', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-chat-format', title: 'Format a message', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-chat-spelling', title: 'Check your spelling in multiple languages', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-chat-suggested-replies', title: 'Use suggested replies', type: 'guide', order: 10, isLocked: false },
                          { id: 'lesson-chat-react', title: 'Like or react to messages', type: 'guide', order: 11, isLocked: false },
                          { id: 'lesson-chat-copy-paste', title: 'Copy and paste', type: 'guide', order: 12, isLocked: false },
                          { id: 'lesson-chat-important', title: 'Mark a message as important or urgent', type: 'guide', order: 13, isLocked: false },
                          { id: 'lesson-chat-share-screen', title: 'Share your screen in a chat', type: 'guide', order: 14, isLocked: false },
                          { id: 'lesson-chat-share-contact', title: 'Share a contact', type: 'guide', order: 15, isLocked: false },
                          { id: 'lesson-chat-forward', title: 'Forward a message', type: 'guide', order: 16, isLocked: false },
                          { id: 'lesson-chat-report', title: 'Report messages', type: 'guide', order: 17, isLocked: false },
                          { id: 'lesson-chat-file-suggest', title: 'Use file suggestions', type: 'guide', order: 18, isLocked: false },
                          { id: 'lesson-chat-video-clip', title: 'Record a video clip', type: 'guide', order: 19, isLocked: false },
                          { id: 'lesson-chat-text-predict', title: 'Use text predictions', type: 'guide', order: 20, isLocked: false },
                          { id: 'lesson-chat-schedule', title: 'Schedule chat messages', type: 'guide', order: 21, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-chat-outside-team',
                      title: 'Chat outside a team',
                      order: 2,
                      lessons: [
                          { id: 'lesson-chat-ext-invite', title: 'Add or invite people outside your org to a chat', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-chat-ext-accept', title: 'Accept people outside your org', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-chat-ext-block', title: 'Block or unblock people outside your org', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-chat-ext-skype', title: 'Send messages to Skype for Business users', type: 'guide', order: 4, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-manage-messages',
                      title: 'Manage messages',
                      order: 3,
                      lessons: [
                          { id: 'lesson-mng-edit-delete', title: 'Edit or delete a message', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-mng-save', title: 'Save a message', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-mng-hide-leave', title: 'Hide a chat or leave a chat thread', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-mng-pin', title: 'Pin a chat message', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-mng-favorites', title: 'Hide, unhide, mute, add a chat to Favorites, or mark a chat as unread', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-mng-accept-block', title: 'Accept or block chat requests from people inside your org', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-mng-new-window', title: 'Open a chat in a new window', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-mng-spam', title: 'Prevent spam or phishing attempts from external chats', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-mng-search', title: 'Search for messages', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-mng-translate', title: 'Translate a message', type: 'guide', order: 10, isLocked: false },
                          { id: 'lesson-mng-spacing', title: 'Change the spacing', type: 'guide', order: 11, isLocked: false },
                          { id: 'lesson-mng-preview', title: 'Preview messages', type: 'guide', order: 12, isLocked: false },
                          { id: 'lesson-mng-show-info', title: 'Show chat info', type: 'guide', order: 13, isLocked: false },
                          { id: 'lesson-mng-mobile', title: 'Manage chats with the Teams mobile app', type: 'guide', order: 14, isLocked: false },
                          { id: 'lesson-mng-share-outlook', title: 'Share to Outlook from Teams', type: 'guide', order: 15, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-group-chat',
                      title: 'Group chat',
                      order: 4,
                      lessons: [
                          { id: 'lesson-group-leave-remove', title: 'Leave or remove someone from a group chat', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-group-personalize-image', title: 'Personalize your group chat image', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-group-dl-m365', title: 'Chat with members from distribution list or M365 group', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-group-share-link', title: 'Share a link to a specific message', type: 'guide', order: 4, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-chat-learn-more',
                      title: 'Learn more',
                      order: 5,
                      lessons: [
                          { id: 'lesson-lm-slash', title: 'Use slash commands', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-lm-praise', title: 'Send Praise to people', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-lm-code-blocks', title: 'Use code blocks', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-lm-code-snippets', title: 'Send code snippets in a message', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-lm-markdown', title: 'Use Markdown formatting', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-lm-reader', title: 'Use Immersive Reader', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-lm-one-on-ones', title: 'Do your one-on-ones with Teams chat', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-lm-storyline', title: 'Get started with storyline', type: 'guide', order: 8, isLocked: false },
                      ]
                  },
              ]
          }
      ]
  },
  
  // 4. MS Teams (Notification & Setting) - Course
  {
      id: 'ms-teams-notifications-settings',
      slug: 'ms-teams-notifications-settings',
      title: 'MS Teams (Notification & Setting)',
      provider: 'Tech (Microsoft)',
      courseCategory: 'DWS',
      deliveryMode: 'Guide',
      duration: 'Short',
      levelCode: L('L2'),
      department: ['DBP'],
      locations: ['Remote'], // Location set to Remote
      audience: ['Associate'],
      status: 'live',
      courseType: 'Course (Multi-Lessons)',
      track: 'Microsoft Teams help & Learning',
      summary: 'Master your personal Teams configuration for maximum focus and productivity by managing notifications, status, and accessibility features.',
      highlights: ['Fine-tune mobile and desktop notifications', 'Customize profile and general app settings', 'Set and manage your status effectively'],
      outcomes: ['Reduce digital distraction', 'Optimize Teams for personal workflow', 'Use Teams with screen readers and keyboard shortcuts'],
      imageUrl: 'https://images.pexels.com/photos/10368545/pexels-photo-10368545.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Notifications on phone/desktop
      curriculum: [
          {
              id: 'module-notification-settings',
              title: 'Teams Configuration',
              order: 1,
              topics: [
                  {
                      id: 'topic-notifications',
                      title: 'Notifications',
                      order: 1,
                      lessons: [
                          { id: 'lesson-ntf-manage', title: 'Manage notifications', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-ntf-troubleshoot', title: 'Troubleshoot mobile notifications', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-ntf-activity-feed', title: 'Explore the Activity feed', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-ntf-badge-count', title: 'Catch up with and manage badge count activity', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-ntf-missed-emails', title: 'Change how often you receive missed activity emails', type: 'guide', order: 5, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-settings',
                      title: 'Settings',
                      order: 2,
                      lessons: [
                          { id: 'lesson-set-profile-pic', title: 'Change your profile picture', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-set-name-pronunciation', title: 'Add name pronunciation to your profile', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-set-accounts', title: 'Manage accounts and organizations', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-set-location', title: 'Enable location sharing', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-set-update-app', title: 'Update Microsoft Teams', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-set-app-settings', title: 'Change app settings', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-set-device', title: 'Manage your device settings', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-set-music-mode', title: 'Use high fidelity music mode to play music in Teams', type: 'guide', order: 8, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-status',
                      title: 'Status',
                      order: 3,
                      lessons: [
                          { id: 'lesson-stat-change', title: 'Change your status', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-stat-message', title: 'Set your status message', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-stat-ooo', title: 'Schedule an out of office status', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-stat-notify-change', title: "Get notified when someone's status changes", type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-stat-work-location', title: 'Set your work location', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-stat-view-location', title: "View other people's work location", type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-stat-outlook-hours', title: 'Set your work hours and location in Outlook', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-stat-quick-actions', title: 'Take quick actions in Microsoft Teams', type: 'guide', order: 8, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-accessibility',
                      title: 'Accessibility',
                      order: 4,
                      lessons: [
                          { id: 'lesson-acc-screen-reader-support', title: 'Screen reader support for Microsoft Teams', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-acc-use-screen-reader', title: 'Use a screen reader', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-acc-shortcuts', title: 'Keyboard shortcuts', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-acc-answer-call', title: 'Answer a call with the keyboard', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-acc-navigate-convos', title: 'Navigate conversations with the keyboard', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-acc-zoom', title: 'Zoom in and out', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-acc-font-size', title: 'Change message font size', type: 'guide', order: 7, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-support-videos',
                      title: 'Support Videos',
                      order: 5,
                      lessons: [
                          { id: 'lesson-vid-notifications', title: 'Video: Manage notification settings', type: 'video', order: 1, isLocked: false },
                      ]
                  }
              ]
          }
      ]
  },
  
  // 5. MS Teams (Teams & Channels) - Course
  {
      id: 'ms-teams-teams-channels',
      slug: 'ms-teams-teams-channels',
      title: 'Ms Teams (Teams & Channels)',
      provider: 'Tech (Microsoft)',
      courseCategory: 'DWS',
      deliveryMode: 'Guide',
      duration: 'Medium',
      levelCode: L('L2'),
      department: ['DBP', 'DCO'],
      locations: ['Remote'], // Location set to Remote
      audience: ['Associate', 'Lead'],
      status: 'live',
      courseType: 'Course (Multi-Lessons)',
      track: 'Microsoft Teams help & Learning',
      summary: 'A deep dive into creating, managing, and collaborating within Teams, channels, and shared channels.',
      highlights: ['Team creation from scratch or template', 'Manage team membership, roles, and permissions', 'Channel types: Standard, Private, and Shared'],
      outcomes: ['Structure collaboration spaces effectively', 'Govern team access and maintain cleanliness (archive/delete)', 'Use shared channels for external collaboration'],
      imageUrl: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Teams/Channels structure
      curriculum: [
          {
              id: 'module-teams-management',
              title: 'Teams and Channels Management',
              order: 1,
              topics: [
                  {
                      id: 'topic-team-create',
                      title: 'Create a team',
                      order: 1,
                      lessons: [
                          { id: 'lesson-team-create-scratch', title: 'From scratch', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-team-create-existing', title: 'From an existing team or group', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-team-create-template', title: 'From a template', type: 'guide', order: 3, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-team-manage',
                      title: 'Manage a team',
                      order: 2,
                      lessons: [
                          { id: 'lesson-team-mng-settings', title: 'Manage team settings and permissions', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-team-mng-roles', title: 'Team member roles', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-team-mng-add-members', title: 'Add members to a team', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-team-mng-make-owner', title: 'Make someone a team owner', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-team-mng-remove-members', title: 'Remove members from a team', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-team-mng-add-guests', title: 'Add guests to a team', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-team-mng-change-picture', title: 'Change your team picture', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-team-mng-make-private', title: 'Make a team private', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-team-mng-delete', title: 'Delete a team', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-team-mng-archive', title: 'Archive or restore a team', type: 'guide', order: 10, isLocked: false },
                          { id: 'lesson-team-mng-renew', title: 'Renew a team', type: 'guide', order: 11, isLocked: false },
                          { id: 'lesson-team-mng-requests', title: 'Manage requests to join', type: 'guide', order: 12, isLocked: false },
                          { id: 'lesson-team-mng-analytics', title: 'View team analytics', type: 'guide', order: 13, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-team-join',
                      title: 'Join a team',
                      order: 3,
                      lessons: [
                          { id: 'lesson-team-join-find', title: 'Find a team to join', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-team-join-link-code', title: 'Use a link or code to join', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-team-join-invite', title: 'Invite people to join', type: 'guide', order: 3, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-team-learn-more',
                      title: 'Learn more about teams',
                      order: 4,
                      lessons: [
                          { id: 'lesson-team-lm-tags', title: 'Use tags', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-team-lm-content-notes', title: 'Add content and notes', type: 'guide', order: 2, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-channel-create',
                      title: 'Create a channel',
                      order: 5,
                      lessons: [
                          { id: 'lesson-channel-create-types', title: 'Create a standard, private, or shared channel', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-channel-create-layout', title: 'Choose your channel layout', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-channel-create-types-overview', title: 'Types of channels', type: 'guide', order: 3, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-channel-manage',
                      title: 'Manage a channel',
                      order: 6,
                      lessons: [
                          { id: 'lesson-channel-mng-info', title: 'Channel info', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-channel-mng-share-people', title: 'Share a channel with people', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-channel-mng-share-team', title: 'Share a channel with a team', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-channel-mng-shared-roles', title: 'Shared channel roles', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-channel-mng-shared-manage', title: 'Manage shared channels', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-channel-mng-archive', title: 'Archive or restore a channel', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-channel-mng-edit', title: 'Edit channel details', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-channel-mng-notifications', title: 'Manage channel notifications', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-channel-mng-delete', title: 'Delete a channel', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-channel-mng-rename-list', title: 'Rename or remove a list', type: 'guide', order: 10, isLocked: false },
                          { id: 'lesson-channel-mng-guest-permissions', title: 'Guest permissions', type: 'guide', order: 11, isLocked: false },
                          { id: 'lesson-channel-mng-moderator', title: 'Moderator roles and settings', type: 'guide', order: 12, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-channel-participate-1', 
                      title: 'Participate in a channel',
                      order: 7,
                      lessons: [
                          { id: 'lesson-channel-part-meetings', title: 'Channel meetings', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-channel-part-message', title: 'Send a message', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-channel-part-announcement', title: 'Send an announcement', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-channel-part-email', title: 'Send an email', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-channel-part-pages-loop', title: 'Manage pages and loop components', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-channel-part-schedule', title: 'Schedule channel messages', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-channel-part-follow', title: 'Follow threads', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-channel-part-cross-post', title: 'Cross-post', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-channel-part-share-outlook', title: 'Share to Outlook', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-channel-part-share-teams', title: 'Share to Teams', type: 'guide', order: 10, isLocked: false },
                          { id: 'lesson-channel-part-reply-outlook', title: 'Reply from Outlook', type: 'guide', order: 11, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-channel-participate-2', 
                      title: 'Participate in a channel (Advanced)',
                      order: 8,
                      lessons: [
                          { id: 'lesson-channel-part2-meetings', title: 'Channel meetings', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-channel-part2-message', title: 'Send a message', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-channel-part2-announcement', title: 'Send an announcement', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-channel-part2-email', title: 'Send an email', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-channel-part2-pages-loop', title: 'Manage pages and loop components', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-channel-part2-schedule', title: 'Schedule channel messages', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-channel-part2-follow', title: 'Follow threads', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-channel-part2-cross-post', title: 'Cross-post', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-channel-part2-share-outlook', title: 'Share to Outlook', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-channel-part2-share-teams', title: 'Share to Teams', type: 'guide', order: 10, isLocked: false },
                          { id: 'lesson-channel-part2-reply-outlook', title: 'Reply from Outlook', type: 'guide', order: 11, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-channel-learn-more',
                      title: 'Learn more about channels',
                      order: 9,
                      lessons: [
                          { id: 'lesson-channel-lm-new-chat', title: 'New chat and channels experience', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-channel-lm-discover-feed', title: 'First things to know about Teams Discover Feed', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-channel-lm-guests', title: 'Guests', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-channel-lm-shortcuts', title: 'Keyboard shortcuts', type: 'guide', order: 4, isLocked: false },
                      ]
                  },
              ]
          }
      ]
  },
  
  // 6. MS Teams (Calls & Devices) - Course
  {
      id: 'ms-teams-calls-devices',
      slug: 'ms-teams-calls-devices',
      title: 'MS Teams (Calls & Devices)',
      provider: 'Tech (Microsoft)',
      courseCategory: 'DWS',
      deliveryMode: 'Guide',
      duration: 'Medium',
      levelCode: L('L3'),
      department: ['DBP'],
      locations: ['Remote'], // Location set to Remote
      audience: ['Lead'],
      status: 'live',
      courseType: 'Course (Multi-Lessons)',
      track: 'Microsoft Teams help & Learning',
      summary: 'Everything about initiating, managing, and optimizing calls, including advanced features like intelligent speakers and Teams Rooms.',
      highlights: ['Standard and advanced calling features (transfer, merge, hold)', 'Teams Phone Mobile and data optimization', 'Configuration of Microsoft Teams Rooms and devices'],
      outcomes: ['Handle complex call scenarios efficiently', 'Set up and troubleshoot Teams Rooms', 'Utilize devices for high-quality audio/video broadcasting'],
      imageUrl: 'https://images.pexels.com/photos/7161073/pexels-photo-7161073.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // Calling screen/device focus
      curriculum: [
          {
              id: 'module-calls-devices',
              title: 'Calling and Device Management',
              order: 1,
              topics: [
                  {
                      id: 'topic-calls-make',
                      title: 'Make calls',
                      order: 1,
                      lessons: [
                          { id: 'lesson-call-make-basics', title: 'First things to know about calls', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-call-make-experience', title: 'Get to know the calling experience', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-call-make-from-chat', title: 'Start a call from a chat', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-call-make-dial-pad', title: 'Use the dial pad to make a call', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-call-make-answer', title: 'Answer a call', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-call-make-phone-mobile', title: 'Getting started with Teams Phone Mobile', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-call-make-optimize-data', title: 'Optimize mobile data usage', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-call-make-add-someone', title: 'Add someone to a call', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-call-make-multiple', title: 'Make multiple calls at the same time', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-call-make-hold', title: 'Put a call on hold', type: 'guide', order: 10, isLocked: false },
                          { id: 'lesson-call-make-transfer', title: 'Transfer a call', type: 'guide', order: 11, isLocked: false },
                          { id: 'lesson-call-make-second-device', title: 'Join a call on a second device', type: 'guide', order: 12, isLocked: false },
                          { id: 'lesson-call-make-queues', title: 'Use the Queues app', type: 'guide', order: 13, isLocked: false },
                          { id: 'lesson-call-make-queues-monitor', title: 'Monitor and assist team members in the Queues app', type: 'guide', order: 14, isLocked: false },
                          { id: 'lesson-call-make-sms', title: 'Send and receive SMS', type: 'guide', order: 15, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-calls-manage-1', 
                      title: 'Manage calls',
                      order: 2,
                      lessons: [
                          { id: 'lesson-call-mng-queues-greetings', title: 'Manage call queue and greetings', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-call-mng-manage-calls', title: 'Manage calls', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-call-mng-forwarding', title: 'Call forwarding, call groups, and simultaneous ring', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-call-mng-merge', title: 'Merge calls', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-call-mng-share-line', title: 'Share a phone line with a delegate', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-call-mng-voicemail', title: 'Check your voicemail', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-call-mng-contacts', title: 'Manage your contacts with the People app', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-call-mng-history', title: 'View your call history', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-call-mng-support-queue', title: 'Manage your support call queue', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-call-mng-e2e', title: 'Use end-to-end encryption', type: 'guide', order: 10, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-calls-manage-2', 
                      title: 'Manage calls (Advanced)',
                      order: 3,
                      lessons: [
                          { id: 'lesson-call-mng2-queues-greetings', title: 'Manage call queue and greetings', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-call-mng2-manage-calls', title: 'Manage calls', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-call-mng2-forwarding', title: 'Call forwarding, call groups, and simultaneous ring', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-call-mng2-merge', title: 'Merge calls', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-call-mng2-share-line', title: 'Share a phone line with a delegate', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-call-mng2-voicemail', title: 'Check your voicemail', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-call-mng2-contacts', title: 'Manage your contacts with the People app', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-call-mng2-history', title: 'View your call history', type: 'guide', order: 8, isLocked: false },
                          { id: 'lesson-call-mng2-support-queue', title: 'Manage your support call queue', type: 'guide', order: 9, isLocked: false },
                          { id: 'lesson-call-mng2-e2e', title: 'Use end-to-end encryption', type: 'guide', order: 10, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-teams-rooms',
                      title: 'Microsoft Teams Rooms',
                      order: 4,
                      lessons: [
                          { id: 'lesson-rooms-windows', title: 'Teams Rooms (Windows)', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-rooms-android', title: 'Teams Rooms (Android)', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-rooms-host-event', title: 'Host an event from a Teams Room', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-rooms-intelli-frame', title: 'IntelliFrame for Teams Rooms', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-rooms-recognition-profiles', title: 'Create recognition profiles', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-rooms-multiple-camera', title: 'Use multiple camera view', type: 'guide', order: 6, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-devices-learn-more',
                      title: 'Learn more about devices',
                      order: 5,
                      lessons: [
                          { id: 'lesson-dev-ndi', title: 'Broadcasting audio and video from Teams with NDI', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-dev-intelligent-speakers', title: 'Identify in-room participants with Teams Intelligent Speakers', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-dev-macbook-touch-bar', title: 'Use the MacBook Pro Touch Bar', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-dev-connect-third-party', title: 'Connect third-party devices to Teams', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-dev-room-remote', title: 'Use a room remote to control a Teams Room device', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-dev-connect-display-phone', title: 'Connect a Teams display or desk phone to Teams Windows desktop', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-dev-surface-hub', title: 'Use Surface Hub for a call', type: 'guide', order: 7, isLocked: false },
                          { id: 'lesson-dev-carplay', title: 'Use Apple CarPlay to make calls', type: 'guide', order: 8, isLocked: false },
                      ]
                  },
              ]
          }
      ]
  },
  
  // 7. Ms Teams (Files) - Course
  {
      id: 'ms-teams-files',
      slug: 'ms-teams-files',
      title: 'Ms Teams (Files)',
      provider: 'Tech (Microsoft)',
      courseCategory: 'DWS',
      deliveryMode: 'Guide',
      duration: 'Short',
      levelCode: L('L2'),
      department: ['DBP'],
      locations: ['Remote'], // Location set to Remote
      audience: ['Associate'],
      status: 'live',
      courseType: 'Course (Multi-Lessons)',
      track: 'Microsoft Teams help & Learning',
      summary: 'Learn how to manage, collaborate on, and share files effectively within Microsoft Teams and its connected cloud storage.',
      highlights: ['File management: move, copy, delete, recover', 'Collaborate on Office files in real-time', 'Sharing files and managing file storage options'],
      outcomes: ['Maintain a clean and organized file system in Teams', 'Use collaboration features to co-author documents', 'Integrate third-party cloud services for file access'],
      imageUrl: 'https://images.pexels.com/photos/313690/pexels-photo-313690.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2', // File management/folders
      curriculum: [
          {
              id: 'module-file-management',
              title: 'File Management and Sharing',
              order: 1,
              topics: [
                  {
                      id: 'topic-files-work-with',
                      title: 'Work With Files',
                      order: 1,
                      lessons: [
                          { id: 'lesson-files-explore', title: 'Explore the Files list', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-files-edit-office', title: 'Edit an Office file', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-files-download', title: 'Download a file', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-files-move-copy', title: 'Move or copy files', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-files-collaborate', title: 'Collaborate on files', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-files-delete-recover', title: 'Delete and recover files', type: 'guide', order: 6, isLocked: false },
                          { id: 'lesson-files-print', title: 'Print files', type: 'guide', order: 7, isLocked: false },
                      ]
                  },
                  {
                      id: 'topic-files-share',
                      title: 'Share files',
                      order: 2,
                      lessons: [
                          { id: 'lesson-files-share-basics', title: 'Share files', type: 'guide', order: 1, isLocked: false },
                          { id: 'lesson-files-share-link', title: 'Get a link to a file in Teams', type: 'guide', order: 2, isLocked: false },
                          { id: 'lesson-files-share-cloud', title: 'Share a file from cloud storage', type: 'guide', order: 3, isLocked: false },
                          { id: 'lesson-files-storage-teams', title: 'File storage in Teams', type: 'guide', order: 4, isLocked: false },
                          { id: 'lesson-files-add-cloud-service', title: 'Add a cloud storage service', type: 'guide', order: 5, isLocked: false },
                          { id: 'lesson-files-add-third-party', title: 'Add third-party apps to the Files app on iOS', type: 'guide', order: 6, isLocked: false },
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
  track: detail.track,
  imageUrl: detail.imageUrl // Ensure image URL is carried over
}));