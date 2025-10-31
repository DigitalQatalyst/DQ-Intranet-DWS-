export type StageServiceType = "Learning" | "Service" | "Non-financial";

export type StageService = {
  id: string;
  name: string;
  description: string;
  provider: string;
  type: StageServiceType;
  href: string;
};

export type DwsStage = {
  id: string;
  order: number;
  level: string;
  title: string;
  subtitle: string;
  about: string;
  keyBenefits: string[];
  ctaLabel: string;
  ctaHref: string;
  services: StageService[];
};

export const stageFilters = ["All", "Learning", "Service", "Non-financial"] as const;

export const dwsStages: DwsStage[] = [
  {
    id: "starting",
    order: 1,
    level: "L0",
    title: "Starting (Learning)",
    subtitle: "Build DQ foundations.",
    about:
      "Lay the groundwork for your DQ journey with guided onboarding resources and curated starter courses that help you understand the workspace quickly.",
    keyBenefits: ["Onboarding guides", "LMS starter courses", "Knowledge Hub access"],
    ctaLabel: "Start Learning",
    ctaHref: "#",
    services: [
      {
        id: "starting-lms-starter",
        name: "LMS Starter Path",
        description: "Complete curated learning modules that introduce DQ tools and ways of working.",
        provider: "DQ Academy",
        type: "Learning",
        href: "#",
      },
      {
        id: "starting-knowledge-hub",
        name: "Knowledge Hub",
        description: "Browse playbooks, FAQs, and quick references to stay oriented on day one.",
        provider: "DQ Knowledge Hub",
        type: "Service",
        href: "#",
      },
      {
        id: "starting-new-joiner-pack",
        name: "New Joiner Pack",
        description: "Download the essentials — team contacts, tools setup, and workplace norms.",
        provider: "People Ops",
        type: "Non-financial",
        href: "#",
      },
    ],
  },
  {
    id: "follow",
    order: 2,
    level: "L1",
    title: "Follow (Self Aware)",
    subtitle: "Practice with guidance.",
    about:
      "Strengthen awareness of DQ rhythms by pairing with mentors, applying daily rituals, and observing high-performing squads.",
    keyBenefits: ["Daily checklists", "Buddy system", "Workspace orientation"],
    ctaLabel: "Follow the Path",
    ctaHref: "#",
    services: [
      {
        id: "follow-buddy-program",
        name: "Mentor Buddy Program",
        description: "Get matched with an experienced lead to shadow ceremonies and gain feedback.",
        provider: "DQ Mentorship",
        type: "Service",
        href: "#",
      },
      {
        id: "follow-ritual-checklist",
        name: "Daily Ritual Checklist",
        description: "Adopt checklists that reinforce squad cadences and communication norms.",
        provider: "Product Ops",
        type: "Non-financial",
        href: "#",
      },
      {
        id: "follow-workspace-walkthrough",
        name: "Workspace Walkthrough",
        description: "Watch guided demos covering navigation, notifications, and quick actions.",
        provider: "DQ Academy",
        type: "Learning",
        href: "#",
      },
    ],
  },
  {
    id: "assist",
    order: 3,
    level: "L2",
    title: "Assist (Self Lead)",
    subtitle: "Contribute and collaborate.",
    about:
      "Own small deliverables, collaborate with your squad, and practice structured communication to unblock teammates.",
    keyBenefits: ["Agile boards", "Services & Requests", "Team deliverables"],
    ctaLabel: "Assist Your Team",
    ctaHref: "#",
    services: [
      {
        id: "assist-agile-board",
        name: "Agile Squad Board",
        description: "Track tasks, flag dependencies, and update status alongside your sprint lead.",
        provider: "Delivery Ops",
        type: "Service",
        href: "#",
      },
      {
        id: "assist-service-catalog",
        name: "Service Catalog",
        description: "Request IT, HR, or finance support without leaving the workspace context.",
        provider: "DQ Service Desk",
        type: "Service",
        href: "#",
      },
      {
        id: "assist-task-handoff-guide",
        name: "Task Handoff Guide",
        description: "Follow communication templates to ensure smooth handoffs and clear expectations.",
        provider: "Product Ops",
        type: "Non-financial",
        href: "#",
      },
    ],
  },
  {
    id: "apply",
    order: 4,
    level: "L3",
    title: "Apply (Drive Squad)",
    subtitle: "Own outcomes.",
    about:
      "Lead sprint rituals, track performance signals, and coach peers to deliver predictable squad outcomes.",
    keyBenefits: ["Productivity dashboards", "Specialized LMS", "Cross-unit projects"],
    ctaLabel: "Apply Your Skills",
    ctaHref: "#",
    services: [
      {
        id: "apply-sprint-lead-insights",
        name: "Sprint Lead Insights",
        description: "Analyze burndown, velocity, and blocker trends to steer sprint execution.",
        provider: "Delivery Insights",
        type: "Service",
        href: "#",
      },
      {
        id: "apply-advanced-lms",
        name: "Advanced Leadership Track",
        description: "Complete scenario-based courses on coaching, retros, and conflict resolution.",
        provider: "DQ Academy",
        type: "Learning",
        href: "#",
      },
      {
        id: "apply-cross-unit-projects",
        name: "Cross-Unit Projects",
        description: "Join high-impact initiatives that require coordination across squads.",
        provider: "Strategic Programs",
        type: "Non-financial",
        href: "#",
      },
    ],
  },
  {
    id: "enable",
    order: 5,
    level: "L4",
    title: "Enable (Drive Team)",
    subtitle: "Enable multi-squad alignment.",
    about:
      "Coordinate multiple squads, build shared rituals, and scale best practices that keep teams aligned.",
    keyBenefits: ["Team sync playbook", "Scaling ceremonies", "Coaching guides"],
    ctaLabel: "Enable Your Teams",
    ctaHref: "#",
    services: [
      {
        id: "enable-team-sync-playbook",
        name: "Team Sync Playbook",
        description: "Run alignment cadences backed by agendas, templates, and facilitation tips.",
        provider: "Product Ops",
        type: "Non-financial",
        href: "#",
      },
      {
        id: "enable-ritual-coaching",
        name: "Ritual Coaching Sessions",
        description: "Schedule coaching to adapt stand-ups, demos, and retros for larger teams.",
        provider: "Leadership Enablement",
        type: "Service",
        href: "#",
      },
      {
        id: "enable-team-analytics",
        name: "Team Analytics Dashboard",
        description: "Monitor throughput, quality, and engagement across squads.",
        provider: "Delivery Insights",
        type: "Service",
        href: "#",
      },
    ],
  },
  {
    id: "ensure",
    order: 6,
    level: "L5",
    title: "Ensure (Steer Org)",
    subtitle: "Steer organization outcomes.",
    about:
      "Orchestrate releases, manage risk, and ensure compliance by connecting delivery signals to governance frameworks.",
    keyBenefits: ["Governance playbooks", "Release discipline", "Risk & compliance flows"],
    ctaLabel: "Ensure at Org Level",
    ctaHref: "#",
    services: [
      {
        id: "ensure-governance-kit",
        name: "Governance Playbook",
        description: "Operationalize org-wide governance with checklists, runbooks, and templates.",
        provider: "Enterprise PMO",
        type: "Non-financial",
        href: "#",
      },
      {
        id: "ensure-release-control",
        name: "Release Control Center",
        description: "Coordinate releases, change windows, and approvals in one shared space.",
        provider: "Release Management",
        type: "Service",
        href: "#",
      },
      {
        id: "ensure-risk-desk",
        name: "Risk & Compliance Desk",
        description: "Log risks, assign mitigations, and track compliance status across initiatives.",
        provider: "Risk Office",
        type: "Service",
        href: "#",
      },
    ],
  },
  {
    id: "influence",
    order: 7,
    level: "L6",
    title: "Influence (Steer Cross)",
    subtitle: "Scale good practices.",
    about:
      "Establish communities of practice, design change programs, and share patterns across business units.",
    keyBenefits: ["Cross-unit playbooks", "Communities of practice", "Change toolkits"],
    ctaLabel: "Influence at Scale",
    ctaHref: "#",
    services: [
      {
        id: "influence-practice-forum",
        name: "Communities of Practice",
        description: "Host forums to exchange patterns, templates, and reusable assets.",
        provider: "Practice Office",
        type: "Service",
        href: "#",
      },
      {
        id: "influence-change-toolkit",
        name: "Change Enablement Toolkit",
        description: "Deploy communication plans, rollout guides, and adoption metrics.",
        provider: "Transformation Office",
        type: "Non-financial",
        href: "#",
      },
      {
        id: "influence-leadership-studio",
        name: "Leadership Studio",
        description: "Join workshops focused on storytelling, influencing, and executive alignment.",
        provider: "DQ Academy",
        type: "Learning",
        href: "#",
      },
    ],
  },
  {
    id: "inspire",
    order: 8,
    level: "L7",
    title: "Inspire (Inspire Market)",
    subtitle: "Shape the ecosystem.",
    about:
      "Drive market influence by sharing thought leadership, showcasing innovation, and cultivating external partnerships.",
    keyBenefits: ["Strategy hubs", "Innovation forums", "Thought leadership"],
    ctaLabel: "Inspire the Market",
    ctaHref: "#",
    services: [
      {
        id: "inspire-strategy-hub",
        name: "Strategy Collaboration Hub",
        description: "Align on long-term bets and share insights with executive sponsors.",
        provider: "Corporate Strategy",
        type: "Service",
        href: "#",
      },
      {
        id: "inspire-innovation-forum",
        name: "Innovation Forum Series",
        description: "Showcase new concepts, gather feedback, and build co-creation partnerships.",
        provider: "Innovation Office",
        type: "Non-financial",
        href: "#",
      },
      {
        id: "inspire-thought-leadership",
        name: "Thought Leadership Studio",
        description: "Publish articles, decks, and talks that highlight DQ differentiators.",
        provider: "Brand & Communications",
        type: "Learning",
        href: "#",
      },
    ],
  },
];
