import {
  Building2,
  Landmark,
  Network,
  Users2,
  Users,
  Clock,
  BookOpen,
  Award,
  Briefcase,
  type LucideIcon,
} from 'lucide-react';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  companyLogo: string;
  avatar: string;
  quote: string;
  fullQuote: string;
  rating: number;
  videoThumbnail: string;
  videoUrl: string;
  metric: string;
  metricLabel: string;
  metricColor: 'green' | 'blue' | 'orange';
}

export interface PartnerCategory {
  id: string;
  title: string;
  subtitle: string;
  iconComponent: LucideIcon;
  iconSize?: number;
  metric: string;
  color: string;
}

export interface FeaturedSector {
  id: string;
  name: string;
  logo: string;
}

export interface ImpactStat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  iconComponent: LucideIcon;
  iconSize?: number;
  iconClassName?: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  suggestionPills: string[];
}

export interface LeadApplyCard {
  id: string;
  iconComponent: LucideIcon;
  iconSize?: number;
  iconClassName?: string;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  ariaLabel?: string;
  testId?: string;
}

// ============================================
// TESTIMONIALS
// ============================================
export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Salem Wasike",
    position: "Product Owner - DQ Deploys",
    company: "Digital Qatalyst",
    companyLogo:
      "https://image2url.com/images/1760524231537-47b810dd-94eb-4571-a6a9-0a9c6fbfb390.jpg",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "Agile Essentials and DTMF learning paths reduced blockers by 40% and sped up feature delivery.",
    fullQuote:
      "Through the DQ LMS, our teams completed Agile Essentials and DTMF learning paths. The shared practices cut delivery blockers by 40% and improved flow, which helped us ship features faster and with clearer ownership.",
    rating: 5,
    videoThumbnail:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    metric: "40%",
    metricLabel: "Faster Task Completion",
    metricColor: "green",
  },
  {
    id: "2",
    name: "Sharavi Chander",
    position: "Head of DQ Deploys",
    company: "Digital Qatalyst",
    companyLogo:
      "https://image2url.com/images/1760524231537-47b810dd-94eb-4571-a6a9-0a9c6fbfb390.jpg",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "80+ team certifications built a learning culture that lifted consistency across releases.",
    fullQuote:
      "The LMS pathways and peer sessions led to 80+ certifications across Deploys. That shared foundation in tooling and governance raised our consistency and confidence from planning through release.",
    rating: 5,
    videoThumbnail:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    metric: "80+",
    metricLabel: "Team Certifications",
    metricColor: "orange",
  },
  {
    id: "3",
    name: "Mohamed Thameez",
    position: "Product Manager",
    company: "Digital Qatalyst",
    companyLogo:
      "https://image2url.com/images/1760524231537-47b810dd-94eb-4571-a6a9-0a9c6fbfb390.jpg",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    quote: "Cross-unit learning spaces cut our feature turnaround time by 30%.",
    fullQuote:
      "Standard playbooks, shared boards, and course-led upskilling created tighter handoffs between Design, Build, and Deploy. As a result, our feature turnaround time improved by 30% with fewer reworks.",
    rating: 4,
    videoThumbnail:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
    metric: "3x",
    metricLabel: "Collaboration Growth",
    metricColor: "red",
  },
];

// ============================================
// PARTNER CATEGORIES
// ============================================
export const partnerCategories: PartnerCategory[] = [
  {
    id: "government",
    title: "Governance Sector",
    subtitle:
      "Leadership, strategy, and value management for enterprise alignment",
    iconComponent: Building2,
    iconSize: 28,
    metric: "4+",
    color: "indigo-600",
  },
  {
    id: "financial",
    title: "Operations Sector",
    subtitle:
      "HR, Finance, and Deals support factories for day-to-day enablement",
    iconComponent: Landmark,
    iconSize: 28,
    metric: "5+",
    color: "yellow-500",
  },
  {
    id: "service",
    title: "Platform Sector",
    subtitle:
      "Intelligence, Solutions, Security, and Products driving digital platforms",
    iconComponent: Users2,
    iconSize: 28,
    metric: "6+",
    color: "blue-600",
  },
  {
    id: "network",
    title: "Delivery Sector",
    subtitle:
      "Design, Deploys, and Accounts teams ensuring outcomes and engagements",
    iconComponent: Network,
    iconSize: 28,
    metric: "3+",
    color: "orange-500",
  },
];

// ============================================
// FEATURED SECTORS
// ============================================
export const featuredSectors: FeaturedSector[] = [
  { id: 'ce', name: 'CE', logo: '/logo/prodev.png' },
  { id: 'soldev', name: 'Soldev', logo: '/logo/soldev.png' },
  { id: 'finance', name: 'Finance', logo: '/logo/finance.png' },
  { id: 'hra', name: 'HRA', logo: '/logo/hra.png' },
  { id: 'inteldev', name: 'IntelDev', logo: '/logo/inteldev.png' },
];

// ============================================
// IMPACT STATS
// ============================================
export const impactStats: ImpactStat[] = [
  {
    label: 'Faster Task Closure',
    value: 80,
    prefix: 'Over',
    suffix: '%',
    iconComponent: Users,
    iconSize: 20,
    iconClassName: "text-[#FB5535]",
  },
  {
    label: 'Focus Time Saved',
    value: 6,
    prefix: '+',
    suffix: 'hrs',
    iconComponent: Clock,
    iconSize: 20,
    iconClassName: "text-[#FB5535]",
  },
  {
    label: 'Concepts Learned Daily',
    value: 5,
    suffix: '+',
    iconComponent: BookOpen,
    iconSize: 20,
    iconClassName: "text-[#FB5535]",
  },
  {
    label: 'Collaboration Growth Rate',
    value: 87,
    suffix: '%',
    iconComponent: Award,
    iconSize: 20,
    iconClassName: "text-[#FB5535]",
  },
];

// ============================================
// HERO CONTENT
// ============================================
export const heroContent: HeroContent = {
  title: "Your Digital Workspace",
  subtitle: "One trusted hub for tools, requests, learning, and collaboration so every Qatalyst can move work forward, fast.",
  suggestionPills: [
    "Open an IT service request",
    "Where's the HR leave policy?",
    'Start "Day in DQ" onboarding',
    "Show this week's LMS courses",
  ],
};

// ============================================
// LEAD APPLY CARDS FACTORY
// ============================================
export const getLeadApplyCards = (navigate: (path: string) => void): LeadApplyCard[] => [
  {
    id: "card-1",
    iconComponent: Users,
    iconSize: 28,
    iconClassName: "text-[#FB5535]",
    title: "Open DQ Workspace",
    description:
      "Lead — access the right tools, services, and dashboards to drive progress every day.",
    cta: "Open Now →",
    onClick: () => navigate("/workspace"),
    ariaLabel: "Open DQ Workspace",
    testId: "open-dq-workspace-cta",
  },
  {
    id: "card-2",
    iconComponent: Briefcase,
    iconSize: 28,
    iconClassName: "text-[#FB5535]",
    title: "Become a Lead",
    description:
      "Co-work — take the next step in your DQ journey, mentor peers, and help shape how we grow.",
    cta: "Apply Now →",
    onClick: () => window.dispatchEvent(new Event("open-lead-popup")),
  },
];

