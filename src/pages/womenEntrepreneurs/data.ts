import type { LucideIcon } from "lucide-react";

type Coordinates = [number, number];

export interface Campaign {
  id: number;
  title: string;
  image: string;
  tagline: string;
  partner: string;
  date: string;
  active?: boolean;
}

export const campaignsData: Campaign[] = [
  {
    id: 1,
    title: "Future Founders Summit",
    image:
      "https://images.unsplash.com/photo-1573164713712-03790c1aa4c7?auto=format&fit=crop&w=1800&q=80",
    tagline:
      "Two days of content, mentorship, and pitch reviews for UAE women founders.",
    partner: "Abu Dhabi Investment Office",
    date: "2025-01-24",
    active: true,
  },
  {
    id: 2,
    title: "SheTrades Marketplace",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=80",
    tagline:
      "Connect with regional buyers and accelerators focused on women-led SMEs.",
    partner: "Dubai Chamber",
    date: "2025-02-15",
  },
  {
    id: 3,
    title: "Impact Innovation Week",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1800&q=80",
    tagline:
      "Showcase of climate-tech and circular economy ventures led by women.",
    partner: "Ministry of Economy",
    date: "2025-03-12",
  },
];

type CommunityIcon =
  | "Users"
  | "ShoppingBag"
  | "Cpu"
  | "Palette"
  | "Building"
  | "Network"
  | "GraduationCap"
  | "BookOpen"
  | "Briefcase"
  | "BarChart"
  | "Star"
  | "FileText"
  | "Globe"
  | "DollarSign"
  | "Lightbulb"
  | "Scale"
  | "Rocket"
  | "Presentation"
  | "ShoppingCart"
  | "Leaf"
  | "Code"
  | "Image";

export interface ConnectLearnGrowTabItem {
  id: number;
  title: string;
  description: string;
  emirate: string;
  icon: CommunityIcon;
  link: string;
  womenFocused: boolean;
}

interface ConnectLearnGrowTab {
  id: string;
  title: string;
  items: ConnectLearnGrowTabItem[];
}

export interface ConnectLearnGrowData {
  tabs: ConnectLearnGrowTab[];
}

export const connectLearnGrowData: ConnectLearnGrowData = {
  tabs: [
    {
      id: "networks",
      title: "Networks",
      items: [
        {
          id: 1,
          title: "Female Fusion Network",
          description:
            "The UAE's largest peer network for women-led SMEs seeking market access and mentoring.",
          emirate: "Dubai",
          icon: "Users",
          link: "https://femalefusionnetwork.com/",
          womenFocused: true,
        },
        {
          id: 2,
          title: "Abu Dhabi Businesswomen Council",
          description:
            "Government-backed community offering advisory clinics and investment readiness.",
          emirate: "Abu Dhabi",
          icon: "Building",
          link: "https://adbc.gov.ae/",
          womenFocused: true,
        },
        {
          id: 3,
          title: "Sharjah Women in Business Collective",
          description:
            "Creative economy network connecting emerging designers with buyers across the region.",
          emirate: "Sharjah",
          icon: "Palette",
          link: "https://sheraa.ae/",
          womenFocused: true,
        },
      ],
    },
    {
      id: "resources",
      title: "Resources",
      items: [
        {
          id: 4,
          title: "SheTrades Academy",
          description:
            "On-demand learning paths covering export readiness, pricing, and supplier diversity.",
          emirate: "Nationwide",
          icon: "BookOpen",
          link: "https://shetrades.com/",
          womenFocused: true,
        },
        {
          id: 5,
          title: "Dubai SME Advisor Library",
          description:
            "Templates and policy guides tailored for businesses scaling in free zones.",
          emirate: "Dubai",
          icon: "FileText",
          link: "https://sme.ae/",
          womenFocused: false,
        },
      ],
    },
    {
      id: "programs",
      title: "Programs",
      items: [
        {
          id: 6,
          title: "NAMA Growth Lab",
          description:
            "Six-month incubator for impact-driven ventures tackling community challenges.",
          emirate: "Sharjah",
          icon: "Lightbulb",
          link: "https://namawomen.ae/",
          womenFocused: true,
        },
        {
          id: 7,
          title: "Hub71 SheTech",
          description:
            "Acceleration track for AI and climate tech founded by diverse teams.",
          emirate: "Abu Dhabi",
          icon: "Rocket",
          link: "https://hub71.com/",
          womenFocused: false,
        },
      ],
    },
  ],
};

export interface EmirateOverview {
  title: string;
  description: string;
}

export interface EmirateData {
  id: string;
  emirate: string;
  coordinates: Coordinates;
  zoomLevel: number;
  overview: EmirateOverview;
  boundingBox?: [[number, number], [number, number]];
}

export const emiratesData: EmirateData[] = [
  {
    id: "abu-dhabi",
    emirate: "Abu Dhabi",
    coordinates: [24.4539, 54.3773],
    zoomLevel: 9,
    overview: {
      title: "Innovation Capital of the UAE",
      description:
        "Abu Dhabi champions deep-tech ventures with incentives for scale-ups in AI, climate, and industry 4.0.",
    },
    boundingBox: [
      [23.9, 53.8],
      [24.9, 54.9],
    ],
  },
  {
    id: "dubai",
    emirate: "Dubai",
    coordinates: [25.2048, 55.2708],
    zoomLevel: 10,
    overview: {
      title: "Global Trade & Creative Hub",
      description:
        "Dubai accelerates high-growth sectors across fintech, commerce, and creative industries with global market access.",
    },
    boundingBox: [
      [24.8, 55.0],
      [25.5, 55.6],
    ],
  },
  {
    id: "sharjah",
    emirate: "Sharjah",
    coordinates: [25.3463, 55.4209],
    zoomLevel: 10,
    overview: {
      title: "Creative Economy Trailblazer",
      description:
        "Sharjah's ecosystem blends culture, education, and entrepreneurship to support emerging founders.",
    },
    boundingBox: [
      [25.1, 55.2],
      [25.5, 55.7],
    ],
  },
];

export interface Organization {
  id: string;
  name: string;
  category: keyof typeof categoryMapping;
  type: string;
  description: string;
  link: string;
  coordinates: Coordinates;
  emirateId: string;
}

export const categoryMapping = {
  federal_enabler: {
    label: "Federal Enabler",
    color: {
      marker: "#0030E3",
      border: "#001B7A",
      bg: "bg-blue-100",
      text: "text-blue-800",
      pill: "bg-blue-50 text-blue-700",
      active: "bg-blue-700 text-white",
    },
  },
  incubator: {
    label: "Incubator",
    color: {
      marker: "#C026D3",
      border: "#86198F",
      bg: "bg-purple-100",
      text: "text-purple-800",
      pill: "bg-purple-50 text-purple-700",
      active: "bg-purple-600 text-white",
    },
  },
  funding: {
    label: "Funding",
    color: {
      marker: "#059669",
      border: "#047857",
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      pill: "bg-emerald-50 text-emerald-700",
      active: "bg-emerald-600 text-white",
    },
  },
  community: {
    label: "Community",
    color: {
      marker: "#F97316",
      border: "#EA580C",
      bg: "bg-orange-100",
      text: "text-orange-800",
      pill: "bg-orange-50 text-orange-700",
      active: "bg-orange-600 text-white",
    },
  },
};

const organizations: Organization[] = [
  {
    id: "adgm-accelerator",
    name: "ADGM Growth Accelerator",
    category: "incubator",
    type: "Innovation Hub",
    description:
      "Acceleration programs for sustainable finance, climate tech, and industry 4.0 ventures.",
    link: "https://www.adgm.com/",
    coordinates: [24.4926, 54.3705],
    emirateId: "abu-dhabi",
  },
  {
    id: "hub71",
    name: "Hub71",
    category: "federal_enabler",
    type: "Tech Ecosystem",
    description:
      "Global tech ecosystem offering landing packages, venture builders, and mentorship.",
    link: "https://hub71.com/",
    coordinates: [24.4944, 54.3832],
    emirateId: "abu-dhabi",
  },
  {
    id: "namawomen",
    name: "NAMA Women Advancement",
    category: "community",
    type: "Advocacy Platform",
    description:
      "Programs supporting women-led enterprises with market access, funding, and policy influence.",
    link: "https://namawomen.ae/",
    coordinates: [25.3463, 55.4211],
    emirateId: "sharjah",
  },
  {
    id: "in5",
    name: "in5 Dubai",
    category: "incubator",
    type: "Incubation Hub",
    description:
      "Specialized innovation centers in media, design, and tech with prototyping labs and mentorship.",
    link: "https://infive.ae/",
    coordinates: [25.0903, 55.1588],
    emirateId: "dubai",
  },
  {
    id: "difc-fintech-hive",
    name: "DIFC FinTech Hive",
    category: "funding",
    type: "Innovation Hub",
    description:
      "Fintech accelerator connecting startups with investors and regulators.",
    link: "https://www.difc.ae/",
    coordinates: [25.2188, 55.2826],
    emirateId: "dubai",
  },
];

interface Program {
  program_name: string;
  organization: string;
  action_label: string;
  link: string;
  emirate?: string;
}

const programs: Program[] = [
  {
    program_name: "SheTech Accelerator",
    organization: "Hub71",
    action_label: "Apply",
    link: "https://hub71.com/programs/shetech",
    emirate: "abu-dhabi",
  },
  {
    program_name: "Creative Entrepreneurship Bootcamp",
    organization: "Dubai Culture",
    action_label: "Register",
    link: "https://dubaiculture.gov.ae/",
    emirate: "dubai",
  },
  {
    program_name: "Impact Growth Lab",
    organization: "Sheraa",
    action_label: "Learn more",
    link: "https://sheraa.ae/programs",
    emirate: "sharjah",
  },
];

export const emirateGeoJSON = {
  "abu-dhabi": {
    type: "Polygon",
    coordinates: [
      [
        [53.8, 23.9],
        [54.9, 23.9],
        [54.9, 24.9],
        [53.8, 24.9],
        [53.8, 23.9],
      ],
    ],
  },
  dubai: {
    type: "Polygon",
    coordinates: [
      [
        [55.0, 24.8],
        [55.6, 24.8],
        [55.6, 25.5],
        [55.0, 25.5],
        [55.0, 24.8],
      ],
    ],
  },
  sharjah: {
    type: "Polygon",
    coordinates: [
      [
        [55.2, 25.1],
        [55.7, 25.1],
        [55.7, 25.5],
        [55.2, 25.5],
        [55.2, 25.1],
      ],
    ],
  },
};

export const entityRegistry: Record<
  string,
  {
    title: string;
    summary: string;
    icon: LucideIcon | null;
  }
> = {};

export const getAllOrganizations = () => organizations;

export const getEmirateOrganizations = (emirateId: string) =>
  organizations.filter((org) => org.emirateId === emirateId);

export const getAllPrograms = () => programs;

export const getEmiratePrograms = (emirateId: string) =>
  programs.filter((program) => program.emirate === emirateId);

export const featuredStories = [
  {
    id: 1,
    name: "Leila Al Mansoori",
    category: "Climate Tech",
    region: "Abu Dhabi",
    sector: "Sustainability",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=80",
    story:
      "Leila is piloting an AI-powered desalination platform reducing energy consumption by 35% for coastal communities.",
  },
  {
    id: 2,
    name: "Huda Rahman",
    category: "Creative Economy",
    region: "Dubai",
    sector: "Design",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    story:
      "Huda launched a phygital marketplace connecting MENA designers to global buyers through immersive experiences.",
  },
  {
    id: 3,
    name: "Samira El Tayeb",
    category: "Advanced Manufacturing",
    region: "Sharjah",
    sector: "Industry 4.0",
    image:
      "https://images.unsplash.com/photo-1581092808361-1a04223b31c3?auto=format&fit=crop&w=1200&q=80",
    story:
      "Samira is building a bio-based materials venture providing circular packaging to agro exporters.",
  },
];

export const storyCategories = [
  { id: "all", title: "All stories" },
  { id: "Climate Tech", title: "Climate Tech" },
  { id: "Creative Economy", title: "Creative Economy" },
  { id: "Advanced Manufacturing", title: "Advanced Manufacturing" },
];

export const impactData = [
  {
    label: "Women-led ventures",
    value: 5200,
    trend: 18,
    description: "Registered and operating across the seven emirates.",
  },
  {
    label: "Investment secured",
    value: 2300000000,
    trend: 24,
    description: "Disclosed capital raised across seed to Series B rounds.",
  },
  {
    label: "Jobs created",
    value: 12000,
    trend: 14,
    description: "Roles across STEM, creative, and community sectors.",
  },
  {
    label: "Export-ready founders",
    value: 870,
    trend: 9,
    description: "Ventures prepared for international market expansion.",
  },
];

export const impactStats = [
  {
    id: "stat-1",
    iconName: "Users",
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-700",
    value: "5,200+",
    label: "Women-led Startups",
  },
  {
    id: "stat-2",
    iconName: "DollarSign",
    iconBgColor: "bg-emerald-100",
    iconColor: "text-emerald-700",
    value: "AED 2.3B",
    label: "Capital Raised",
  },
  {
    id: "stat-3",
    iconName: "Briefcase",
    iconBgColor: "bg-indigo-100",
    iconColor: "text-indigo-700",
    value: "12,000+",
    label: "Jobs Created",
  },
  {
    id: "stat-4",
    iconName: "UserPlus",
    iconBgColor: "bg-amber-100",
    iconColor: "text-amber-700",
    value: "3,100+",
    label: "Mentorship Matches",
  },
];

export const partnersData = [
  {
    id: 1,
    name: "Emirates Development Bank",
    headline: "Flexible venture debt and growth capital for women-led SMEs.",
    logo: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=60",
    link: "https://www.edb.gov.ae/",
  },
  {
    id: 2,
    name: "NAMA Women Advancement",
    headline: "Advocacy and acceleration for inclusive economic growth.",
    logo: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=60",
    link: "https://namawomen.ae/",
  },
  {
    id: 3,
    name: "DIFC Innovation Hub",
    headline: "Global fintech hub catalyzing women-led financial innovation.",
    logo: "https://images.unsplash.com/photo-1581091870622-3e09f83d5442?auto=format&fit=crop&w=800&q=60",
    link: "https://www.difc.ae/",
  },
  {
    id: 4,
    name: "Sheraa",
    headline: "Purpose-driven entrepreneurship programs across Sharjah.",
    logo: "https://images.unsplash.com/photo-1501556424050-d4816356b73e?auto=format&fit=crop&w=800&q=60",
    link: "https://sheraa.ae/",
  },
];

export const storiesData = [
  {
    id: 1,
    category: "Climate Tech",
    title: "Desalination for a Net Zero Coastline",
    author: "Leila Al Mansoori",
    image:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "How Leila scaled a clean-tech solution from Abu Dhabi's pilot zone and reached three markets in 18 months.",
    content:
      "Leila's venture decarbonises desalination by combining AI optimisation with solar thermal energy. After joining Hub71's SheTech, she unlocked $1.5M in venture funding and signed MoUs with two utilities.",
  },
  {
    id: 2,
    category: "Creative Economy",
    title: "Designing the Region's First Phygital Market",
    author: "Huda Rahman",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "Blending live pop-ups with digital activations, Huda built a platform powering 120+ female creatives.",
    content:
      "Huda's platform uses AI-assisted merchandising and storytelling to help designers expand to Saudi and Europe. With Dubai Culture, she runs quarterly showcases pairing retail buyers with emerging creatives.",
  },
  {
    id: 3,
    category: "Advanced Manufacturing",
    title: "Circular Packaging Made in Sharjah",
    author: "Samira El Tayeb",
    image:
      "https://images.unsplash.com/photo-1581093806997-124204d9fa9d?auto=format&fit=crop&w=1200&q=80",
    excerpt:
      "A biomaterials pioneer creating home-compostable packaging for agri-exporters across the Gulf.",
    content:
      "Samira's team repurposes palm waste into compostable films, reducing plastic packaging by 60%. Through Sheraa's accelerator, they secured strategic partnerships with UAE food exporters.",
  },
];

export const categories = [
  "All",
  "Climate Tech",
  "Creative Economy",
  "Advanced Manufacturing",
];

export const footerData = {
  title: "Ready to partner with the UAE's women-led innovation movement?",
  subtitle:
    "Sign up for the enterprise journey platform to meet founders, access resources, and co-create new growth.",
  buttonText: "Partner with the Community",
};

export const assistantData = [
  {
    question: "How do I access funding opportunities?",
    answer:
      "Explore the capital section of the platform to review venture debt, equity, and grant programs. You can also request a consultation with Emirates Development Bank.",
  },
  {
    question: "Where can I find mentorship?",
    answer:
      "Visit the mentorship directory to request a match with industry leaders across fintech, climate, or creative sectors. Matches are confirmed within five working days.",
  },
  {
    question: "How do I scale internationally?",
    answer:
      "Our export readiness lab consolidates trade accelerator programs, in-market partners, and regulatory checklists for priority markets including KSA, UK, and Singapore.",
  },
];

export interface ProgramCardData {
  id: string;
  title: string;
  provider: string;
  emirate: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaLink: string;
  keyInitiatives: string[];
}

export const featuredPrograms: ProgramCardData[] = [
  {
    id: "program1",
    title: "NAMA Growth Lab",
    provider: "NAMA Women Advancement",
    emirate: "Sharjah",
    description:
      "Incubator focused on women-led social enterprises addressing UAE community challenges.",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1400&q=80",
    ctaLabel: "Learn More",
    ctaLink: "https://namawomen.ae/",
    keyInitiatives: [
      "Social Enterprise Incubation",
      "Seed Funding Readiness",
      "Mentorship from Industry Leaders",
    ],
  },
  {
    id: "program2",
    title: "Creative Entrepreneurs Network",
    provider: "Dubai Culture",
    emirate: "Dubai",
    description:
      "Supporting women in creative industries through mentorship, retail showcases, and global exposure.",
    image:
      "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1400&q=80",
    ctaLabel: "Learn More",
    ctaLink: "https://dubaiculture.gov.ae/",
    keyInitiatives: [
      "Creative Industry Workshops",
      "International Exhibition Access",
      "Design Mentorship Circles",
    ],
  },
  {
    id: "program3",
    title: "SheTech Accelerator",
    provider: "Hub71",
    emirate: "Abu Dhabi",
    description:
      "Empowering female-led startups in AI, fintech, and sustainability with global scale support.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
    ctaLabel: "Learn More",
    ctaLink: "https://hub71.com/",
    keyInitiatives: [
      "Startup Acceleration Program",
      "Investment Access",
      "Global Market Expansion",
    ],
  },
  {
    id: "program4",
    title: "Female Founders Academy",
    provider: "Khalifa Fund",
    emirate: "Nationwide",
    description:
      "Entrepreneurship readiness and scaling program for UAE women innovators.",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1400&q=80",
    ctaLabel: "Learn More",
    ctaLink: "https://khalifafund.ae/",
    keyInitiatives: [
      "Business Planning",
      "Leadership Training",
      "Funding Preparation",
    ],
  },
];

export const regionalHighlights = [
  {
    id: "abu-dhabi",
    name: "Abu Dhabi",
    foundersCount: 1650,
    sector: "Deep Tech & Climate",
    image:
      "https://images.unsplash.com/photo-1584985598423-252c2b18087c?auto=format&fit=crop&w=1600&q=80",
    featuredFounder: "Leila Al Mansoori",
  },
  {
    id: "dubai",
    name: "Dubai",
    foundersCount: 2400,
    sector: "Fintech & Creative Economy",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    featuredFounder: "Huda Rahman",
  },
  {
    id: "sharjah",
    name: "Sharjah",
    foundersCount: 750,
    sector: "Culture & Circular Economy",
    image:
      "https://images.unsplash.com/photo-1505764706515-aa95265c5abc?auto=format&fit=crop&w=1600&q=80",
    featuredFounder: "Samira El Tayeb",
  },
];

