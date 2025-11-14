import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Clock, Calendar, MapPin } from "lucide-react";
import { FadeInUpOnScroll } from "../AnimationUtils";

// Types
type TabId = "communities" | "resources" | "programs" | "events";

type ToolCard = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageSrc: string;
  badge?: string;
  meta?: {
    icon?: React.ReactNode;
    label: string;
  };
  tags: string[];
  primaryButton: {
    label: string;
    href: string;
  };
  secondaryButton?: {
    label: string;
    href: string;
  };
};

// Data - Each tab has exactly 3 cards
const COMMUNITIES: ToolCard[] = [
  {
    id: "squad-leads-circle",
    title: "Squad Leads Circle",
    subtitle: "Collaboration",
    description: "Peer learning circle where Squad Leads share practices, solve challenges, and grow together through regular meetups and knowledge exchange.",
    imageSrc: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    badge: "Very Active",
    meta: {
      icon: <Users size={16} />,
      label: "42 members",
    },
    tags: ["Collaboration", "Growth", "Leadership"],
    primaryButton: {
      label: "Join Community",
      href: "/leadspace/communities/squad-leads",
    },
  },
  {
    id: "practice-leads-network",
    title: "Practice Leads Network",
    subtitle: "Expertise",
    description: "Community for Leads responsible for building capability, frameworks, and standards across DQ. Share best practices and drive quality improvements.",
    imageSrc: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    meta: {
      icon: <Users size={16} />,
      label: "28 members",
    },
    tags: ["Knowledge Sharing", "Development"],
    primaryButton: {
      label: "Join Community",
      href: "/leadspace/communities/practice-leads",
    },
  },
  {
    id: "new-leads-onboarding",
    title: "New Leads Onboarding Group",
    subtitle: "Onboarding",
    description: "Support group for newly appointed Leads to navigate expectations, tools, and workflows. Get guidance from experienced Leads and build your network.",
    imageSrc: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    meta: {
      icon: <Users size={16} />,
      label: "63 members",
    },
    tags: ["Onboarding", "Support"],
    primaryButton: {
      label: "Start Here",
      href: "/leadspace/communities/new-leads",
    },
  },
];

const RESOURCES: ToolCard[] = [
  {
    id: "lead-playbook",
    title: "LeadPlaybook 1.0",
    subtitle: "Playbook",
    description: "Comprehensive guide covering roles, expectations, and workflows for all Lead positions at DQ. Essential reading for new and existing Leads.",
    imageSrc: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
    tags: ["Playbook", "Template"],
    primaryButton: {
      label: "View Resource",
      href: "/leadspace/resources/lead-playbook",
    },
  },
  {
    id: "dws-leadership-toolkit",
    title: "DWS Leadership Toolkit",
    subtitle: "Template",
    description: "Templates, checklists, and frameworks to help Leads operate effectively and consistently. Includes meeting agendas, decision frameworks, and planning tools.",
    imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    tags: ["Template", "Guide"],
    primaryButton: {
      label: "View Resource",
      href: "/leadspace/resources/leadership-toolkit",
    },
  },
  {
    id: "collaboration-toolkit",
    title: "Collaboration Toolkit",
    subtitle: "Guide",
    description: "Rituals, meeting flows, and decision systems to enhance team collaboration and alignment. Practical tools for running effective ceremonies.",
    imageSrc: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    tags: ["Template", "Guide"],
    primaryButton: {
      label: "View Resource",
      href: "/leadspace/resources/collaboration-toolkit",
    },
  },
];

const PROGRAMS: ToolCard[] = [
  {
    id: "leads-development-program",
    title: "Leads Development Program",
    subtitle: "Program",
    description: "A 12-week intensive program designed to develop core leadership capabilities through mentorship and hands-on practice. Build skills in facilitation, coaching, and delivery.",
    imageSrc: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    meta: {
      icon: <Clock size={16} />,
      label: "12 weeks",
    },
    tags: ["Mentorship", "Workshops"],
    primaryButton: {
      label: "Apply Now",
      href: "/leadspace/programs/leads-development",
    },
    secondaryButton: {
      label: "Learn More",
      href: "/leadspace/programs/leads-development/details",
    },
  },
  {
    id: "leadership-bootcamp",
    title: "Leadership Bootcamp",
    subtitle: "Bootcamp",
    description: "A 2-day intensive workshop focused on alignment, team dynamics, and practical leadership exercises. Perfect for new Leads or those looking to refresh their skills.",
    imageSrc: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    meta: {
      icon: <Clock size={16} />,
      label: "2 days",
    },
    tags: ["Alignment", "Exercises"],
    primaryButton: {
      label: "Register",
      href: "/leadspace/programs/bootcamp",
    },
  },
  {
    id: "mentorship-circles",
    title: "Mentorship Circles",
    subtitle: "Program",
    description: "Ongoing peer learning circles where Leads share experiences, challenges, and solutions in a supportive environment. Available globally with flexible participation.",
    imageSrc: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    meta: {
      icon: <MapPin size={16} />,
      label: "Global",
    },
    tags: ["Peer Learning"],
    primaryButton: {
      label: "Join Circle",
      href: "/leadspace/programs/mentorship-circles",
    },
  },
];

const EVENTS: ToolCard[] = [
  {
    id: "leading-teams-workshop",
    title: "Leading Teams Workshop",
    subtitle: "Workshop",
    description: "Monthly virtual workshop covering team dynamics, conflict resolution, and performance management. Learn practical techniques from experienced facilitators.",
    imageSrc: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    meta: {
      icon: <Calendar size={16} />,
      label: "Monthly · Virtual",
    },
    tags: ["Workshop", "Virtual"],
    primaryButton: {
      label: "Register",
      href: "/leadspace/events/leading-teams",
    },
  },
  {
    id: "dws-collaboration-sprint",
    title: "DWS Collaboration Sprint",
    subtitle: "Sprint",
    description: "Quarterly hybrid event bringing Leads together to share best practices and collaborate on common challenges. Network with peers and discover new approaches.",
    imageSrc: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80",
    meta: {
      icon: <Calendar size={16} />,
      label: "Quarterly · Hybrid",
    },
    tags: ["Sprint", "Collaboration"],
    primaryButton: {
      label: "Join Sprint",
      href: "/leadspace/events/collaboration-sprint",
    },
  },
  {
    id: "coaching-conversations-clinic",
    title: "Coaching Conversations Clinic",
    subtitle: "Clinic",
    description: "Monthly onsite clinic focused on developing coaching skills through practice sessions and peer feedback. Improve your 1:1 conversations and feedback delivery.",
    imageSrc: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    meta: {
      icon: <Calendar size={16} />,
      label: "Monthly · Onsite",
    },
    tags: ["Coaching", "Onsite"],
    primaryButton: {
      label: "Save a seat",
      href: "/leadspace/events/coaching-clinic",
    },
  },
];

const TABS: { id: TabId; label: string }[] = [
  { id: "communities", label: "Lead Communities" },
  { id: "resources", label: "Lead Resources" },
  { id: "programs", label: "Leadership Programs" },
  { id: "events", label: "Events & Workshops" },
];

const getCardsForTab = (tabId: TabId): ToolCard[] => {
  switch (tabId) {
    case "communities":
      return COMMUNITIES;
    case "resources":
      return RESOURCES;
    case "programs":
      return PROGRAMS;
    case "events":
      return EVENTS;
    default:
      return [];
  }
};

// Card Component
const ToolCard: React.FC<{ card: ToolCard; index: number }> = ({ card, index }) => {
  return (
    <FadeInUpOnScroll delay={index * 0.1}>
      <article className="flex h-full flex-col rounded-2xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden hover:shadow-md transition-all duration-300">
        {/* Image with 16:9 ratio */}
        <div className="relative w-full pt-[56.25%] overflow-hidden">
          <img
            src={card.imageSrc}
            alt={card.title}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
          />
          {/* Badge */}
          {card.badge && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#030F35]">
              {card.badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          {/* Title - limited to 2 lines */}
          <h3 className="text-lg font-semibold text-[#030F35] mb-1 line-clamp-2 min-h-[3.5rem]">
            {card.title}
          </h3>

          {/* Subtitle */}
          {card.subtitle && (
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">
              {card.subtitle}
            </p>
          )}

          {/* Meta Row */}
          {card.meta && (
            <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
              {card.meta.icon}
              <span>{card.meta.label}</span>
            </div>
          )}

          {/* Description - limited to 3 lines */}
          <p className="text-sm text-slate-700 mb-4 line-clamp-3 flex-1 min-h-[4.5rem]">
            {card.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer Buttons */}
          <div className="mt-auto flex flex-wrap gap-2">
            <Link
              to={card.primaryButton.href}
              className="inline-flex items-center justify-center rounded-lg bg-[#030F35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a1b4f] transition-all duration-200 flex-1 min-w-[100px]"
            >
              {card.primaryButton.label}
            </Link>
            {card.secondaryButton && (
              <Link
                to={card.secondaryButton.href}
                className="inline-flex items-center justify-center rounded-lg border border-[#030F35] bg-transparent px-4 py-2 text-sm font-semibold text-[#030F35] hover:bg-[#030F35]/5 transition-all duration-200"
              >
                {card.secondaryButton.label}
              </Link>
            )}
          </div>
        </div>
      </article>
    </FadeInUpOnScroll>
  );
};

// Main Component
export const LeadToolsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("communities");
  const cards = getCardsForTab(activeTab);

  return (
    <section id="lead-tools" className="py-16 md:py-20 lg:py-24 bg-white scroll-mt-[72px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 mb-3">
            Lead Tools & Opportunities
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            Access communities, playbooks, and tools that support your journey as a lead at DQ.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div
            className="inline-flex flex-wrap rounded-xl p-1 gap-1"
            role="tablist"
            style={{ backgroundColor: '#F9FAFB', border: '1px solid #E3E7F8' }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? '#fff' : 'transparent',
                  color: activeTab === tab.id ? '#030F35' : '#334266',
                  boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid - Exactly 3 cards per tab */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.slice(0, 3).map((card, index) => (
            <ToolCard key={card.id} card={card} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center rounded-full bg-[#030F35] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a1b4f] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Explore All Lead Opportunities
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LeadToolsSection;

