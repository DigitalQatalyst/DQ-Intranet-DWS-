export type FlowPhase = "Discover" | "Set Up" | "Connect" | "Grow";
export type FlowFormat = "Checklist" | "Interactive" | "Video" | "Guide";
export type FlowPopularity = "Most used" | "New";

export type OnboardingFlowStep = {
  id: string;
  title: string;
  action: string;
  link?: string;
};

export type OnboardingFlowTool = {
  label: string;
  href: string;
};

export type OnboardingFlow = {
  id: string;
  title: string;
  phase: FlowPhase;
  roles: string[];
  time: number;
  format: FlowFormat;
  popularity?: FlowPopularity;
  description: string;
  outcomes: string[];
  prerequisites?: string[];
  tools?: OnboardingFlowTool[];
  steps: OnboardingFlowStep[];
  usage?: number;
};

export const ONBOARDING_FLOWS: OnboardingFlow[] = [
  {
    id: "discover-culture",
    title: "Discover DQ Culture",
    phase: "Discover",
    roles: ["All"],
    time: 15,
    format: "Guide",
    popularity: "New",
    description: "Get to know how we work, our values, and collaboration norms.",
    outcomes: ["Understand values", "Know communication channels"],
    tools: [{ label: "Teams Intro", href: "#" }],
    steps: [
      { id: "s1", title: "Values & Ways of Working", action: "Read the culture brief." },
      { id: "s2", title: "Comms Overview", action: "Join core Teams channels.", link: "#" },
    ],
    usage: 86,
  },
  {
    id: "discover-marketplace",
    title: "Explore Marketplaces",
    phase: "Discover",
    roles: ["Product", "Design", "Engineering", "Marketing"],
    time: 20,
    format: "Interactive",
    description: "Learn how internal marketplaces streamline requests, learning, and community.",
    outcomes: ["Know key marketplaces", "Understand request routing"],
    prerequisites: ["Digital Workspace login"],
    tools: [
      { label: "Service Marketplace", href: "#" },
      { label: "Learning Marketplace", href: "#" },
    ],
    steps: [
      { id: "s1", title: "Marketplace Tour", action: "Walk through key marketplaces in the workspace." },
      { id: "s2", title: "Bookmark Essentials", action: "Pin the services you’ll use most frequently." },
      { id: "s3", title: "Join Community", action: "Follow the #marketplaces channel for updates.", link: "#" },
    ],
    usage: 120,
  },
  {
    id: "setup-tooling",
    title: "Set Up Engineering Tooling",
    phase: "Set Up",
    roles: ["Engineering"],
    time: 45,
    format: "Checklist",
    popularity: "Most used",
    description: "Run through the automated script to configure repos, pipelines, and dev tools.",
    outcomes: ["Local environment ready", "Pipelines configured"],
    prerequisites: ["Laptop provisioned"],
    tools: [
      { label: "Environment Script", href: "#" },
      { label: "Azure DevOps", href: "#" },
      { label: "GitHub Enterprise", href: "#" },
    ],
    steps: [
      { id: "s1", title: "Bootstrap", action: "Run the environment bootstrap script.", link: "#" },
      { id: "s2", title: "Auth Setup", action: "Configure SSH keys and single sign-on." },
      { id: "s3", title: "Pipeline Test", action: "Trigger a sample build in Azure DevOps.", link: "#" },
      { id: "s4", title: "Workspace Check", action: "Verify access to repos and documentation." },
    ],
    usage: 342,
  },
  {
    id: "setup-product-tools",
    title: "Product Tools Checklist",
    phase: "Set Up",
    roles: ["Product"],
    time: 25,
    format: "Checklist",
    description: "Enable product planning, feedback, and analytics integrations.",
    outcomes: ["Boards access", "Feedback channels ready"],
    tools: [
      { label: "Azure Boards", href: "#" },
      { label: "Product Analytics", href: "#" },
    ],
    steps: [
      { id: "s1", title: "Backlog Access", action: "Request access to the squad backlog.", link: "#" },
      { id: "s2", title: "Analytics Overview", action: "Watch the analytics tooling walkthrough.", link: "#" },
      { id: "s3", title: "Feedback Intake", action: "Subscribe to the product feedback channels." },
    ],
    usage: 211,
  },
  {
    id: "connect-mentor",
    title: "Connect with Your Mentor",
    phase: "Connect",
    roles: ["All"],
    time: 20,
    format: "Interactive",
    description: "Build momentum with mentor check-ins and shared expectations.",
    outcomes: ["Scheduled mentor sync", "Shared onboarding plan"],
    tools: [
      { label: "Mentor Directory", href: "#" },
      { label: "Teams Mentorship Channel", href: "#" },
    ],
    steps: [
      { id: "s1", title: "Intro Message", action: "Send your mentor a welcome note.", link: "#" },
      { id: "s2", title: "Schedule Sync", action: "Book your first 30-minute session." },
      { id: "s3", title: "Share Goals", action: "Review the onboarding plan template together.", link: "#" },
    ],
    usage: 198,
  },
  {
    id: "connect-team-sync",
    title: "Run Your First Team Sync",
    phase: "Connect",
    roles: ["Operations", "Engineering", "Product"],
    time: 30,
    format: "Interactive",
    description: "Host a team alignment session using the DQ ceremony starter kit.",
    outcomes: ["Clarity on goals", "Action items owned"],
    tools: [{ label: "Meeting Agenda Template", href: "#" }],
    steps: [
      { id: "s1", title: "Agenda Prep", action: "Customize the DQ agenda template.", link: "#" },
      { id: "s2", title: "Run the Sync", action: "Host the session focusing on blockers and wins." },
      { id: "s3", title: "Share Notes", action: "Post minutes and next steps in Teams.", link: "#" },
    ],
    usage: 156,
  },
  {
    id: "grow-learning-path",
    title: "Curated Learning Sprint",
    phase: "Grow",
    roles: ["Design", "Engineering", "Product"],
    time: 60,
    format: "Video",
    popularity: "Most used",
    description: "Complete the week-one learning sprint tailored to your craft.",
    outcomes: ["Complete LMS modules", "Applied learning reflection"],
    prerequisites: ["Learning Hub access"],
    tools: [
      { label: "Learning Hub Playlist", href: "#" },
      { label: "Reflection Template", href: "#" },
    ],
    steps: [
      { id: "s1", title: "Module Kickoff", action: "Watch the overview videos.", link: "#" },
      { id: "s2", title: "Hands-on Exercise", action: "Complete the applied assignment." },
      { id: "s3", title: "Reflection", action: "Capture takeaways and share with your mentor.", link: "#" },
    ],
    usage: 402,
  },
  {
    id: "grow-marketplace-contribution",
    title: "Contribute to Marketplaces",
    phase: "Grow",
    roles: ["Marketing", "Operations", "Design"],
    time: 35,
    format: "Guide",
    description: "Learn how to publish offerings and updates to internal marketplaces.",
    outcomes: ["Contributed listing", "Update cadence defined"],
    tools: [
      { label: "Contribution Guide", href: "#" },
      { label: "Marketplace Publisher", href: "#" },
    ],
    steps: [
      { id: "s1", title: "Review Guidelines", action: "Read the publisher handbook.", link: "#" },
      { id: "s2", title: "Draft Listing", action: "Create your first marketplace entry." },
      { id: "s3", title: "Submit for Review", action: "Share with the marketplace team for approval.", link: "#" },
    ],
    usage: 90,
  },
  {
    id: "setup-design-kit",
    title: "Design System Kickoff",
    phase: "Set Up",
    roles: ["Design"],
    time: 25,
    format: "Interactive",
    popularity: "New",
    description: "Install the DQ design system libraries and understand contribution workflow.",
    outcomes: ["Libraries synced", "Contribution workflow known"],
    tools: [
      { label: "Figma Libraries", href: "#" },
      { label: "Contribution Checklist", href: "#" },
    ],
    steps: [
      { id: "s1", title: "Library Sync", action: "Add DQ UI and icon libraries to your workspace.", link: "#" },
      { id: "s2", title: "Design Tokens", action: "Review token usage and accessibility guidance." },
      { id: "s3", title: "Contribution Flow", action: "Walk through merge process for new components.", link: "#" },
    ],
    usage: 134,
  },
  {
    id: "connect-marketing-network",
    title: "Marketing Collaboration Loop",
    phase: "Connect",
    roles: ["Marketing"],
    time: 30,
    format: "Checklist",
    description: "Sync with brand, analytics, and copy partners to co-create campaigns.",
    outcomes: ["Established collaboration cadence", "Shared campaign brief"],
    tools: [
      { label: "Campaign Brief Template", href: "#" },
      { label: "Analytics Dashboard", href: "#" },
    ],
    steps: [
      { id: "s1", title: "Kickoff Brief", action: "Draft your first campaign outline.", link: "#" },
      { id: "s2", title: "Partner Sync", action: "Host a triad sync with brand and analytics." },
      { id: "s3", title: "Publish Plan", action: "Share your campaign plan in the marketing channel.", link: "#" },
    ],
    usage: 78,
  },
];
