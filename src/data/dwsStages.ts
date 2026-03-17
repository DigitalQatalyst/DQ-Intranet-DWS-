export type StageServiceType = "Learning" | "Service";

export type StageService = {
  id: string;
  name: string;
  description: string;
  provider: string;
  type: StageServiceType;
  href: string;
  icon?: string;
};

export type DwsStage = {
  id: string;
  order: number;
  level: string;
  title: string;
  subtitle: string;
  about: string;
  keyBenefits: string[];
  levelSummary: string;
  growthExpectations: string[];
  whatGoodLooksLike: string[];
  ctaLabel: string;
  ctaHref: string;
  services: StageService[];
};

export const stageFilters = ["All", "Learning", "Service"] as const;

export const dwsStages: DwsStage[] = [
  {
    id: "starting",
    order: 1,
    level: "L00",
    title: "Level 00 (Foundation)",
    subtitle: "Work with close guidance to learn DQ basics, follow routines, and build confidence before SFIA Level 1.",
    about:
      "At this level you will complete onboarding essentials and learn DQ ways of working, use core tools correctly and ask early when blocked, and contribute small tasks reliably while sharing progress frequently.",
    keyBenefits: [
      "Complete onboarding essentials and learn DQ ways of working",
      "Use core tools correctly and ask early when blocked",
      "Contribute small tasks reliably and share progress frequently"
    ],
    levelSummary: "Work with close guidance to learn DQ basics and build confidence.",
    growthExpectations: [
      "Complete onboarding essentials and learn DQ ways of working",
      "Use core tools correctly and ask early when blocked",
      "Contribute small tasks reliably and share progress frequently"
    ],
    whatGoodLooksLike: [],
    ctaLabel: "Learn More",
    ctaHref: "#",
    services: [
      {
        id: "starting-courses",
        name: "Courses",
        description: "Explore core and advanced DQ learning programs tailored to your role.",
        provider: "DQ Academy",
        type: "Learning",
        href: "#",
        icon: "GraduationCap",
      },
      {
        id: "starting-onboarding",
        name: "Onboarding",
        description: "Follow guided onboarding tracks to get productive from day one.",
        provider: "People Ops",
        type: "Learning",
        href: "#",
        icon: "Flag",
      },
      {
        id: "starting-strategy-guide",
        name: "Strategy Guide",
        description: "Access strategic briefs and alignment resources.",
        provider: "DQ Knowledge Hub",
        type: "Learning",
        href: "#",
        icon: "Compass",
      },
      {
        id: "starting-operational-guide",
        name: "Operational Guide",
        description: "Browse SOPs, playbooks, and daily execution guidelines.",
        provider: "Product Ops",
        type: "Service",
        href: "#",
        icon: "FileText",
      },
      {
        id: "starting-knowledge-library",
        name: "Knowledge Library",
        description: "Find glossaries, FAQs, and quick references for everyday work.",
        provider: "DQ Knowledge Hub",
        type: "Learning",
        href: "#",
        icon: "BookOpen",
      },
    ],
  },
  {
    id: "follow",
    order: 2,
    level: "L1",
    title: "Level 1 (Follow)",
    subtitle: "Follow instructions and learn the basics with close guidance. Build confidence through routine tasks and clear feedback.",
    about:
      "At this level you will complete guided tasks and learn DQ ways of working, communicate progress early and ask for support, and build foundational knowledge and good habits.",
    keyBenefits: [
      "Complete guided tasks and learn DQ ways of working",
      "Communicate progress early and ask for support",
      "Build foundational knowledge and good habits"
    ],
    levelSummary: "Follow instructions and learn the basics with close guidance.",
    growthExpectations: [
      "Complete guided tasks and learn DQ ways of working",
      "Communicate progress early and ask for support",
      "Build foundational knowledge and good habits"
    ],
    whatGoodLooksLike: [],
    ctaLabel: "Learn More",
    ctaHref: "#",
    services: [
      {
        id: "follow-onboarding",
        name: "Onboarding",
        description: "Step-by-step orientation with buddy support and workspace guidance.",
        provider: "People Ops",
        type: "Learning",
        href: "#",
        icon: "Flag",
      },
      {
        id: "follow-courses",
        name: "Courses",
        description: "Starter-level learning modules to build foundational DQ skills.",
        provider: "DQ Academy",
        type: "Learning",
        href: "#",
        icon: "GraduationCap",
      },
      {
        id: "follow-checklists",
        name: "Checklists",
        description: "Daily task and orientation checklists to build routine.",
        provider: "Product Ops",
        type: "Service",
        href: "#",
        icon: "CheckSquare",
      },
      {
        id: "follow-knowledge-library",
        name: "Knowledge Library",
        description: "Quick references to help answer questions as you learn.",
        provider: "DQ Knowledge Hub",
        type: "Learning",
        href: "#",
        icon: "BookOpen",
      },
    ],
  },
  {
    id: "assist",
    order: 3,
    level: "L2",
    title: "Level 2 (Assist)",
    subtitle: "Support defined tasks under routine direction. Contribute reliably, improve consistency, and collaborate with your immediate team.",
    about:
      "At this level you will deliver assigned tasks with regular review, work confidently within a defined routine, and strengthen communication and execution discipline.",
    keyBenefits: [
      "Deliver assigned tasks with regular review",
      "Work confidently within a defined routine",
      "Strengthen communication and execution discipline"
    ],
    levelSummary: "Support defined tasks under routine direction.",
    growthExpectations: [
      "Deliver assigned tasks with regular review",
      "Work confidently within a defined routine",
      "Strengthen communication and execution discipline"
    ],
    whatGoodLooksLike: [],
    ctaLabel: "Learn More",
    ctaHref: "#",
    services: [
      {
        id: "assist-work-sessions",
        name: "Work Sessions",
        description: "Join daily and weekly sessions to collaborate and stay aligned.",
        provider: "Delivery Ops",
        type: "Service",
        href: "#",
        icon: "Users",
      },
      {
        id: "assist-projects-tasks",
        name: "Projects & Tasks",
        description: "Manage tasks, deliverables, and work progress.",
        provider: "Delivery Ops",
        type: "Service",
        href: "#",
        icon: "ListCheck",
      },
      {
        id: "assist-task-trackers",
        name: "Task Trackers",
        description: "Track status, categories, and updates across your work.",
        provider: "Delivery Ops",
        type: "Service",
        href: "#",
        icon: "ClipboardList",
      },
      {
        id: "assist-team-discussions",
        name: "Team Discussions",
        description: "Engage in collaborative discussions to solve blockers.",
        provider: "Work Communities",
        type: "Service",
        href: "#",
        icon: "MessageSquare",
      },
      {
        id: "assist-pulse-insights",
        name: "Pulse Insights",
        description: "Share feedback through lightweight surveys.",
        provider: "Work Communities",
        type: "Service",
        href: "#",
        icon: "BarChart3",
      },
    ],
  },
  {
    id: "apply",
    order: 4,
    level: "L3",
    title: "Level 3 (Apply)",
    subtitle: "Work under general direction to complete assigned tasks. Use judgment on non-routine work and share progress at milestones.",
    about:
      "At this level you will own standard deliverables end-to-end, solve familiar problems and escalate smartly, and collaborate across the squad to keep work moving.",
    keyBenefits: [
      "Own standard deliverables end-to-end",
      "Solve familiar problems and escalate smartly",
      "Collaborate across the squad and keep work moving"
    ],
    levelSummary: "Work under general direction to complete assigned tasks.",
    growthExpectations: [
      "Own standard deliverables end-to-end",
      "Solve familiar problems and escalate smartly",
      "Collaborate across the squad and keep work moving"
    ],
    whatGoodLooksLike: [],
    ctaLabel: "Learn More",
    ctaHref: "#",
    services: [
      {
        id: "apply-projects-tasks",
        name: "Projects & Tasks",
        description: "Own your squad's work execution and delivery.",
        provider: "Delivery Ops",
        type: "Service",
        href: "#",
        icon: "ListCheck",
      },
      {
        id: "apply-performance-trackers",
        name: "Performance Trackers",
        description: "Monitor outcomes, timelines, and productivity dashboards.",
        provider: "Delivery Insights",
        type: "Service",
        href: "#",
        icon: "TrendingUp",
      },
      {
        id: "apply-work-sessions",
        name: "Work Sessions",
        description: "Coordinate work with your squad through regular sessions.",
        provider: "Delivery Ops",
        type: "Service",
        href: "#",
        icon: "Users",
      },
      {
        id: "apply-team-discussions",
        name: "Team Discussions",
        description: "Strengthen collaboration and communication within the squad.",
        provider: "Work Communities",
        type: "Service",
        href: "#",
        icon: "MessageSquare",
      },
    ],
  },
  {
    id: "enable",
    order: 5,
    level: "L4",
    title: "Level 4 (Enable)",
    subtitle: "Operate with general direction within clear accountability, exercising autonomy to plan, coordinate work, and occasionally delegate tasks to others.",
    about:
      "At this level you will take responsibility for outcomes and quality, coordinate tasks, timelines, and dependencies, and improve how the team delivers (not just what).",
    keyBenefits: [
      "Take responsibility for outcomes and quality",
      "Coordinate tasks, timelines, and dependencies",
      "Improve how the team delivers (not just what)"
    ],
    levelSummary: "Operate with general direction within clear accountability, exercising autonomy to plan, coordinate work, and occasionally delegate tasks to others.",
    growthExpectations: [
      "Take responsibility for outcomes and quality",
      "Coordinate tasks, timelines, and dependencies",
      "Improve how the team delivers (not just what)"
    ],
    whatGoodLooksLike: [],
    ctaLabel: "Learn More",
    ctaHref: "#",
    services: [
      {
        id: "enable-team-sync-playbook",
        name: "Team Sync Playbook",
        description: "Guides for running effective multi-squad syncs.",
        provider: "Product Ops",
        type: "Service",
        href: "#",
        icon: "Workflow",
      },
      {
        id: "enable-coaching-guides",
        name: "Coaching Guides",
        description: "Leadership and coaching guides for developing teams.",
        provider: "Leadership Enablement",
        type: "Learning",
        href: "#",
        icon: "UserCog",
      },
      {
        id: "enable-scaling-ceremonies",
        name: "Scaling Ceremonies",
        description: "Frameworks for scaling delivery across teams.",
        provider: "Product Ops",
        type: "Service",
        href: "#",
        icon: "Layers",
      },
      {
        id: "enable-projects-tasks",
        name: "Projects & Tasks",
        description: "Coordinate work streams across multiple squads.",
        provider: "Delivery Ops",
        type: "Service",
        href: "#",
        icon: "ListCheck",
      },
      {
        id: "enable-blueprint-library",
        name: "Blueprint Library",
        description: "Access delivery frameworks for 6xD, DevOps, DBP, DXP, and DWS.",
        provider: "Product Ops",
        type: "Learning",
        href: "#",
        icon: "Boxes",
      },
    ],
  },
  {
    id: "ensure",
    order: 6,
    level: "L5",
    title: "Level 5 (Ensure, advise)",
    subtitle: "Work under broad direction and lead through expertise. Ensure effective practices and advise others to raise delivery standards.",
    about:
      "At this level you will guide others and strengthen delivery consistency, make sound decisions across risk, quality, and value, and promote good working practices and culture.",
    keyBenefits: [
      "Guide others and strengthen delivery consistency",
      "Make sound decisions across risk, quality, and value",
      "Promote good working practices and culture"
    ],
    levelSummary: "Work under broad direction and lead through expertise.",
    growthExpectations: [
      "Guide others and strengthen delivery consistency",
      "Make sound decisions across risk, quality, and value",
      "Promote good working practices and culture"
    ],
    whatGoodLooksLike: [],
    ctaLabel: "Learn More",
    ctaHref: "#",
    services: [
      {
        id: "ensure-blueprint-library",
        name: "Blueprint Library",
        description: "Use delivery frameworks to support governance and org execution.",
        provider: "Enterprise PMO",
        type: "Learning",
        href: "#",
        icon: "Boxes",
      },
      {
        id: "ensure-digital-worker-tools",
        name: "Digital Worker Tools",
        description: "Leverage AI writers, prompting kits, and automation agents.",
        provider: "DQ Service Desk",
        type: "Service",
        href: "#",
        icon: "Bot",
      },
      {
        id: "ensure-technology-services",
        name: "Technology Services",
        description: "Request tech environments, access, and support.",
        provider: "Technology Services",
        type: "Service",
        href: "#",
        icon: "Cpu",
      },
      {
        id: "ensure-business-services",
        name: "Business Services",
        description: "Submit admin, finance, and operational service requests.",
        provider: "Business Services",
        type: "Service",
        href: "#",
        icon: "Briefcase",
      },
    ],
  },
  {
    id: "influence",
    order: 7,
    level: "L6",
    title: "Level 6 (Initiate, influence)",
    subtitle: "Own a significant area of work with defined authority and accountability. Influence strategy and drive cross-organisation initiatives.",
    about:
      "At this level you will lead major initiatives and shape direction, influence decisions, priorities, and resource choices, and drive transformation outcomes across teams.",
    keyBenefits: [
      "Lead major initiatives and shape direction",
      "Influence decisions, priorities, and resource choices",
      "Drive transformation outcomes across teams"
    ],
    levelSummary: "Own a significant area of work with defined authority.",
    growthExpectations: [
      "Lead major initiatives and shape direction",
      "Influence decisions, priorities, and resource choices",
      "Drive transformation outcomes across teams"
    ],
    whatGoodLooksLike: [],
    ctaLabel: "Learn More",
    ctaHref: "#",
    services: [
      {
        id: "influence-communities-of-practice",
        name: "Communities of Practice",
        description: "Lead knowledge-sharing forums across units.",
        provider: "Practice Office",
        type: "Service",
        href: "#",
        icon: "UsersRound",
      },
      {
        id: "influence-change-enable-toolkit",
        name: "Change Enablement Toolkit",
        description: "Deploy change plans, rollout guides, and templates.",
        provider: "Transformation Office",
        type: "Service",
        href: "#",
        icon: "Repeat",
      },
      {
        id: "influence-events-calendars",
        name: "Events & Calendars",
        description: "Coordinate events and cross-unit engagements.",
        provider: "Work Communities",
        type: "Service",
        href: "#",
        icon: "Calendar",
      },
      {
        id: "influence-blogs-stories",
        name: "Blogs & Stories",
        description: "Share insights and stories across the organization.",
        provider: "Brand & Communications",
        type: "Learning",
        href: "#",
        icon: "FileText",
      },
      {
        id: "influence-news-announcements",
        name: "News & Announcements",
        description: "Stay updated on cross-unit changes and updates.",
        provider: "Brand & Communications",
        type: "Service",
        href: "#",
        icon: "Megaphone",
      },
    ],
  },
  {
    id: "inspire",
    order: 8,
    level: "L7",
    title: "Level 7 (Set strategy, inspire, mobilise)",
    subtitle: "Set organisational strategy and mobilise the system to deliver it. Inspire leadership alignment and authorise resources at scale.",
    about:
      "At this level you will define strategic direction and long-range outcomes, inspire and align leaders across the organisation, and mobilise resources to execute at scale.",
    keyBenefits: [
      "Define strategic direction and long-range outcomes",
      "Inspire and align leaders across the organisation",
      "Mobilise resources to execute at scale"
    ],
    levelSummary: "Set organisational strategy and mobilise the system.",
    growthExpectations: [
      "Define strategic direction and long-range outcomes",
      "Inspire and align leaders across the organisation",
      "Mobilise resources to execute at scale"
    ],
    whatGoodLooksLike: [],
    ctaLabel: "Learn More",
    ctaHref: "#",
    services: [
      {
        id: "inspire-strategy-hubs",
        name: "Strategy Hubs",
        description: "Access strategic insight centers and leadership narratives.",
        provider: "Corporate Strategy",
        type: "Service",
        href: "#",
        icon: "Target",
      },
      {
        id: "inspire-innovation-forums",
        name: "Innovation Forums",
        description: "Join innovation discussions and ecosystem shaping sessions.",
        provider: "Innovation Office",
        type: "Service",
        href: "#",
        icon: "Lightbulb",
      },
      {
        id: "inspire-leadership-content",
        name: "Leadership Content",
        description: "Explore thought-leadership materials and advanced guides.",
        provider: "Brand & Communications",
        type: "Learning",
        href: "#",
        icon: "Crown",
      },
      {
        id: "inspire-blogs-stories",
        name: "Blogs & Stories",
        description: "Share and discover inspiring stories across DQ.",
        provider: "Brand & Communications",
        type: "Learning",
        href: "#",
        icon: "FileText",
      },
      {
        id: "inspire-events-calendars",
        name: "Events & Calendars",
        description: "Engage with key events that shape the ecosystem.",
        provider: "Work Communities",
        type: "Service",
        href: "#",
        icon: "Calendar",
      },
    ],
  },
];
