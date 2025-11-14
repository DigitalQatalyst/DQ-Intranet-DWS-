import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Calendar, MapPin, Clock } from "lucide-react";
import { FadeInUpOnScroll } from "../AnimationUtils";

// Types
type TabId = "communities" | "resources" | "programs" | "events" | "mentorship";

type OpportunityCard = {
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

// Data
const COMMUNITIES: OpportunityCard[] = [
  {
    id: "squad-leads-circle",
    title: "Squad Leads Circle",
    subtitle: "Collaboration",
    description: "Peer learning circle where Squad Leads share practices, solve challenges, and grow together.",
    imageSrc: "/assets/leadspace/squad-leads-circle.jpg",
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
    description: "Community for Leads responsible for building capability, frameworks, and standards across DQ.",
    imageSrc: "/assets/leadspace/practice-leads-network.jpg",
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
    description: "Support group for newly appointed Leads to navigate expectations, tools, and workflows.",
    imageSrc: "/assets/leadspace/new-leads-onboarding.jpg",
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
  {
    id: "lead-coaches-forum",
    title: "Lead Coaches Forum",
    subtitle: "Coaching",
    description: "A community of leads who coach teams and individuals to unlock growth and performance.",
    imageSrc: "/assets/leadspace/lead-coaches-forum.jpg",
    meta: {
      icon: <Users size={16} />,
      label: "17 members",
    },
    tags: ["Coaching", "People"],
    primaryButton: {
      label: "Join Forum",
      href: "/leadspace/communities/coaches",
    },
  },
];

const RESOURCES: OpportunityCard[] = [
  {
    id: "lead-playbook",
    title: "LeadPlaybook 1.0",
    subtitle: "Playbook",
    description: "Comprehensive guide covering roles, expectations, and workflows for all Lead positions at DQ.",
    imageSrc: "/assets/leadspace/lead-playbook.jpg",
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
    description: "Templates, checklists, and frameworks to help Leads operate effectively and consistently.",
    imageSrc: "/assets/leadspace/dws-leadership-toolkit.jpg",
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
    description: "Rituals, meeting flows, and decision systems to enhance team collaboration and alignment.",
    imageSrc: "/assets/leadspace/collaboration-toolkit.jpg",
    tags: ["Template", "Guide"],
    primaryButton: {
      label: "View Resource",
      href: "/leadspace/resources/collaboration-toolkit",
    },
  },
  {
    id: "feedback-coaching-guide",
    title: "Feedback & Coaching Guide",
    subtitle: "Guide",
    description: "Practical frameworks for having growth conversations, creating development plans, and conducting assessments.",
    imageSrc: "/assets/leadspace/feedback-coaching-guide.jpg",
    tags: ["Guide", "Template"],
    primaryButton: {
      label: "View Resource",
      href: "/leadspace/resources/feedback-coaching",
    },
  },
];

const PROGRAMS: OpportunityCard[] = [
  {
    id: "leads-development-program",
    title: "Leads Development Program",
    subtitle: "Program",
    description: "A 12-week intensive program designed to develop core leadership capabilities through mentorship and hands-on practice.",
    imageSrc: "/assets/leadspace/leads-development-program.jpg",
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
    description: "A 2-day intensive workshop focused on alignment, team dynamics, and practical leadership exercises.",
    imageSrc: "/assets/leadspace/leadership-bootcamp.jpg",
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
    description: "Ongoing peer learning circles where Leads share experiences, challenges, and solutions in a supportive environment.",
    imageSrc: "/assets/leadspace/mentorship-circles.jpg",
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

const EVENTS: OpportunityCard[] = [
  {
    id: "leading-teams-workshop",
    title: "Leading Teams Workshop",
    subtitle: "Workshop",
    description: "Monthly virtual workshop covering team dynamics, conflict resolution, and performance management.",
    imageSrc: "/assets/leadspace/leading-teams-workshop.jpg",
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
    description: "Quarterly hybrid event bringing Leads together to share best practices and collaborate on common challenges.",
    imageSrc: "/assets/leadspace/dws-collaboration-sprint.jpg",
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
    description: "Monthly onsite clinic focused on developing coaching skills through practice sessions and peer feedback.",
    imageSrc: "/assets/leadspace/coaching-conversations-clinic.jpg",
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

const MENTORSHIP: OpportunityCard[] = [
  {
    id: "one-on-one-coaching",
    title: "One-on-One Lead Coaching",
    subtitle: "Mentorship",
    description: "Get matched with a senior lead who can provide personalized guidance, feedback, and support for your leadership journey.",
    imageSrc: "/assets/leadspace/one-on-one-coaching.jpg",
    tags: ["Mentorship", "1:1"],
    primaryButton: {
      label: "Request Coach",
      href: "/leadspace/mentorship/request-coach",
    },
  },
  {
    id: "peer-accountability-partnerships",
    title: "Peer Accountability Partnerships",
    subtitle: "Partnership",
    description: "Bi-weekly support partnerships where Leads hold each other accountable and share progress on leadership goals.",
    imageSrc: "/assets/leadspace/peer-accountability.jpg",
    meta: {
      icon: <Calendar size={16} />,
      label: "Bi-weekly support",
    },
    tags: ["Peer Learning", "Accountability"],
    primaryButton: {
      label: "Pair Me",
      href: "/leadspace/mentorship/peer-partnership",
    },
  },
];

const TABS: { id: TabId; label: string }[] = [
  { id: "communities", label: "Communities" },
  { id: "resources", label: "Resources" },
  { id: "programs", label: "Programs" },
  { id: "events", label: "Events & Workshops" },
  { id: "mentorship", label: "Mentorship" },
];

const getCardsForTab = (tabId: TabId): OpportunityCard[] => {
  switch (tabId) {
    case "communities":
      return COMMUNITIES;
    case "resources":
      return RESOURCES;
    case "programs":
      return PROGRAMS;
    case "events":
      return EVENTS;
    case "mentorship":
      return MENTORSHIP;
    default:
      return [];
  }
};

// Card Component
const OpportunityCard: React.FC<{ card: OpportunityCard; index: number }> = ({ card, index }) => {
  return (
    <FadeInUpOnScroll delay={index * 0.1}>
      <article className="flex h-full flex-col rounded-2xl bg-white shadow-md ring-1 ring-black/5 overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Image with 16:9 ratio */}
        <div className="relative w-full pt-[56.25%] overflow-hidden">
          <img
            src={card.imageSrc}
            alt={card.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {/* Badge */}
          {card.badge && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-[#030F35]">
              {card.badge}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-6">
          {/* Title */}
          <h3 className="text-xl font-semibold text-[#030F35] mb-1">
            {card.title}
          </h3>

          {/* Subtitle */}
          {card.subtitle && (
            <p className="text-sm text-slate-600 mb-3">
              {card.subtitle}
            </p>
          )}

          {/* Meta Row */}
          {card.meta && (
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
              {card.meta.icon}
              <span>{card.meta.label}</span>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-slate-700 mb-4 line-clamp-3 flex-1">
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
          <div className="mt-auto flex flex-wrap gap-3">
            <Link
              to={card.primaryButton.href}
              className="inline-flex items-center justify-center rounded-lg bg-[#030F35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a1b4f] transition-all duration-200 flex-1 min-w-[120px]"
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
export const LeadOpportunitiesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("communities");
  const cards = getCardsForTab(activeTab);

  return (
    <section id="lead-opportunities" className="py-20 md:py-24 bg-[#F9FAFB] scroll-mt-[72px]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#030F35] text-center">
            Discover What LeadSpace Offers
          </h2>
          <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-600 text-center mx-auto leading-relaxed">
            Explore the communities you can join, the resources you can access, and the programs that develop you as a Lead.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
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
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
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

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {cards.map((card, index) => (
            <OpportunityCard key={card.id} card={card} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link
            to="/leadspace/opportunities"
            className="inline-flex items-center justify-center rounded-full bg-[#030F35] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a1b4f] transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Explore All Lead Opportunities
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LeadOpportunitiesSection;

