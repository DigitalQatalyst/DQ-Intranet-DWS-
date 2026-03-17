import {
  Building2,
  Landmark,
  Network,
  Users2,
  Zap,
  Target,
  TrendingUp,
  Rocket,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { assetPath } from '../utils/assetPath';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Testimonial {
  id: string;
  name: string;
  context?: string;
  role?: string;
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
  metricColor: 'green' | 'blue' | 'orange' | 'red';
  modalTitle?: string;
  mediaType?: 'video' | 'image';
  imageUrl?: string;
  impactDescription?: string;
  note?: string;
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
  description?: string;
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
  comingSoon?: boolean;
}

// ============================================
// TESTIMONIALS
// ============================================
export const testimonials: Testimonial[] = [
  {
    id: "4",
    name: "Jerry Ashie",
    position: "Accounts Manager & Scrum Master",
    company: "Digital Qatalyst",
    companyLogo:
      "https://image2url.com/images/1760524231537-47b810dd-94eb-4571-a6a9-0a9c6fbfb390.jpg",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    quote:
      "Digital Qatalyst’s values encouraged continuous learning, ownership, and resilience—helping me grow professionally and personally.",
    fullQuote:
      "Digital Qatalyst’s values encouraged continuous learning, ownership, and resilience—helping me grow professionally and personally. That growth mindset made me more confident in navigating change, collaborating, and taking the lead when it counts.",
    rating: 5,
    modalTitle: "Growth Mindset in Action",
    videoThumbnail:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
    videoUrl:
      "https://image2url.com/r2/default/videos/1769501439433-33dd5a03-3a45-426d-b9ac-3576c139cde4.mp4",
    metric: "5/5",
    metricLabel: "Growth Mindset Impact",
    metricColor: "blue",
  },
  {
    id: "2",
    name: "Vishnu Chandran",
    position: "CoE Analyst",
    company: "Digital Qatalyst",
    companyLogo:
      "https://image2url.com/images/1760524231537-47b810dd-94eb-4571-a6a9-0a9c6fbfb390.jpg",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "DigitalQatalyst’s values helped me focus on creating real impact, not just completing tasks.",
    fullQuote:
      "DigitalQatalyst’s values helped me focus on creating real impact, not just completing tasks. They pushed me to take ownership, think clearly about outcomes, and stay open to continuous learning. Over time, this shifted how I approach my work: I plan with intent, communicate with purpose, and follow through with accountability. I’ve become more confident in making decisions, raising risks early, and supporting the team when challenges come up. These values also shaped me personally, helping me stay disciplined, curious, and responsible every day.",
    rating: 5,
    modalTitle: "How Digital Qatalyst Builds Real Impact Through Values",
    videoThumbnail:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    videoUrl: "https://image2url.com/r2/default/videos/1769504724502-2c4a3377-abd5-4c9e-ae26-a887beb46de8.mp4",
    metric: "",
    metricLabel: "",
    metricColor: "blue",
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
    metricColor: "orange",
  },
  {
    id: "5",
    name: "Vishnu Chandran",
    position: "CoE Analyst",
    company: "Digital Qatalyst",
    companyLogo:
      "https://image2url.com/images/1760524231537-47b810dd-94eb-4571-a6a9-0a9c6fbfb390.jpg",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "DigitalQatalyst’s values helped me focus on creating real impact, not just completing tasks.",
    fullQuote:
      "DigitalQatalyst’s values helped me focus on creating real impact, not just completing tasks. They pushed me to take ownership, think clearly about outcomes, and stay open to continuous learning. Over time, this shifted how I approach my work: I plan with intent, communicate with purpose, and follow through with accountability. I’ve become more confident in making decisions, raising risks early, and supporting the team when challenges come up. These values also shaped me personally, helping me stay disciplined, curious, and responsible every day.",
    rating: 5,
    modalTitle: "Real Impact Through Ownership",
    videoThumbnail:
      "https://i.ibb.co/XkGXwk4Z/Screenshot-2026-01-27-at-3-39-28-PM.png",
    videoUrl: "",
    metric: "5/5",
    metricLabel: "Growth Through Ownership and Accountability",
    metricColor: "blue",
    mediaType: "image",
    imageUrl:
      "https://i.ibb.co/XkGXwk4Z/Screenshot-2026-01-27-at-3-39-28-PM.png",
    impactDescription:
      "Impact achieved through DQ values and ways of working",
  },
];

// ============================================
// PARTNER CATEGORIES
// ============================================
export const partnerCategories: PartnerCategory[] = [
  {
    id: "government",
    title: "Governance",
    subtitle:
      "Direction, priorities, and decision-making that keep work aligned.",
    iconComponent: Building2,
    iconSize: 28,
    metric: "4+",
    color: "indigo-600",
  },
  {
    id: "financial",
    title: "Operations",
    subtitle:
      "HR, Finance, and enablement that remove friction day to day.",
    iconComponent: Landmark,
    iconSize: 28,
    metric: "5+",
    color: "yellow-500",
  },
  {
    id: "service",
    title: "Platform",
    subtitle:
      "Products, security, and solutions that power digital execution.",
    iconComponent: Users2,
    iconSize: 28,
    metric: "6+",
    color: "blue-600",
  },
  {
    id: "network",
    title: "Delivery",
    subtitle:
      "Design, deployments, and accounts that deliver outcomes.",
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
  { id: 'ce', name: 'CE', logo: assetPath('logo/prodev.png') },
  { id: 'soldev', name: 'Soldev', logo: assetPath('logo/soldev.png') },
  { id: 'finance', name: 'Finance', logo: assetPath('logo/finance.png') },
  { id: 'hra', name: 'HRA', logo: assetPath('logo/hra.png') },
  { id: 'inteldev', name: 'IntelDev', logo: assetPath('logo/inteldev.png') },
];

// ============================================
// IMPACT STATS
// ============================================
export const impactStats: ImpactStat[] = [
  {
    label: 'Fast Delivery',
    value: 0,
    description: 'Short cycles, fewer blockers.',
    iconComponent: Zap,
    iconSize: 20,
    iconClassName: "text-[#FB5535]",
  },
  {
    label: 'Clear Alignment',
    value: 0,
    description: 'Everyone knows what matters now.',
    iconComponent: Target,
    iconSize: 20,
    iconClassName: "text-[#FB5535]",
  },
  {
    label: 'Continuous Improvement',
    value: 0,
    description: 'Learn, reflect, and get better weekly.',
    iconComponent: TrendingUp,
    iconSize: 20,
    iconClassName: "text-[#FB5535]",
  },
];

// ============================================
// HERO CONTENT
// ============================================
export const heroContent: HeroContent = {
  title: "Welcome to Digital Workspace",
  subtitle:
    "Start here to execute with clarity: find tools, updates, and actions fast. Search or choose a path below.",
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
    id: "card-2",
    iconComponent: Rocket,
    iconSize: 28,
    iconClassName: "text-[#FB5535]",
    title: "Start Your DQ Journey",
    description:
      "Discover how DQ works, what we build, and how the Digital Workspace supports your role from day one.",
    cta: "Begin Onboarding →",
    onClick: () => navigate("/onboarding/welcome"),
    ariaLabel: "Start Your DQ Journey",
    testId: "start-dq-journey-cta",
  },
  {
    id: "card-4",
    iconComponent: Sparkles,
    iconSize: 28,
    iconClassName: "text-[#FB5535]",
    title: "AI Prompting Page",
    description:
      "Learn how AI prompting is used across DQ to improve thinking, delivery, and everyday digital work.",
    cta: "Coming Soon",
    onClick: () => {}, // Disabled for coming soon
    ariaLabel: "AI Prompting Page - Coming Soon",
    testId: "ai-prompting-cta",
    comingSoon: true,
  },
];
