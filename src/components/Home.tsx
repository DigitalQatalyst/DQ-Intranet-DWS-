import React, { useMemo, useState, cloneElement } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Briefcase,
  Users,
  Newspaper,
  Lightbulb,
  TrendingUp,
  Briefcase as JobIcon,
  Globe,
  Calendar,
  Book as BookIcon,
  Award,
  MessageCircle,
  X,
  Clock,
  Compass,
  HeartHandshake,
  Building,
  Lock,
  GraduationCap,
  BarChart,
  CircleDot,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import {
  AnimatedCounter,
  FadeInUpOnScroll,
  useInView,
} from "./AnimationUtils.tsx";
import ServiceCarousel from "./marketplace/ServiceCarousel.tsx";

/* ----------------------------- AI Chatbot ----------------------------- */
const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[image:var(--dq-cta-gradient)] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 z-50 animate-pulse hover:animate-none hover:brightness-105"
        aria-label="Open AI Assistant"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200 animate-fade-in-up">
          <div className="bg-[image:var(--dq-cta-gradient)] p-4 text-white flex justify-between items-center">
            <h3 className="font-medium">AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close AI Assistant"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-4 h-80 overflow-y-auto bg-gray-50">
            <div className="bg-dq-navy/10 p-3 rounded-lg rounded-tl-none inline-block max-w-[85%] animate-fade-in">
              <p className="text-gray-800">
                Hi there! How can I help you navigate the Abu Dhabi Enterprise
                Journey Platform?
              </p>
            </div>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Type your question here..."
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dq-coral/40 transition-all duration-300"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ------------------------- Types & Defaults -------------------------- */
interface SectionStyle {
  cardClasses: string;
  headingClass: string;
  descriptionClass: string;
  iconClass: string;
  buttonClasses: string;
  hoverOverlayClass?: string;
  iconWrapperClass?: string;
  disabledCardClasses?: string;
}

const defaultSectionStyle: SectionStyle = {
  // not used directly; each row overrides
  cardClasses:
    "bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white",
  headingClass: "text-white",
  descriptionClass: "text-white/90",
  iconClass: "text-white",
  buttonClasses:
    "text-white bg-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.18)] border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent",
  hoverOverlayClass: "bg-white/10",
  iconWrapperClass: "w-10 h-10",
  disabledCardClasses:
    'bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed'
};

/* ---------------------------- Service Card --------------------------- */
const ServiceCard = ({
  service,
  onClick,
  isComingSoon = false,
  sectionStyle = defaultSectionStyle,
}: {
  service: any;
  onClick: () => void;
  isComingSoon?: boolean;
  sectionStyle?: SectionStyle;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const activeCardClasses = `${sectionStyle.cardClasses} hover:shadow-md hover:-translate-y-0.5 cursor-pointer`;
  const disabledClasses =
    sectionStyle.disabledCardClasses ??
    "bg-dqsec-tint text-white/70 opacity-70 cursor-not-allowed border border-transparent";

  const baseLayoutClasses =
    'rounded-2xl p-6 flex flex-col justify-between min-h-[260px] shadow-sm overflow-hidden transition-all duration-300 transform backdrop-blur-sm';
  const baseButtonClasses = 'mt-auto h-9 px-4 rounded-md font-medium w-full flex items-center justify-center';
  const disabledButtonClasses = `${baseButtonClasses} bg-white/70 text-gray-600 cursor-not-allowed transition-all duration-200`;

  const iconColorClass = isComingSoon ? 'text-gray-500' : (sectionStyle.iconClass ?? 'text-[#1A2E6E]');
  const hoverOverlayClass = sectionStyle.hoverOverlayClass ?? 'bg-white/10';
  const iconWrapperClasses = sectionStyle.iconWrapperClass ?? 'w-12 h-12';
  const descriptionClasses = `text-sm text-gray-600 leading-snug text-balance line-clamp-2 mt-3 mb-4 ${
    isComingSoon ? "text-white/70" : sectionStyle.descriptionClass
  }`;

  const iconNode = service.icon ? (
    service.icon
  ) : (
    <CircleDot aria-hidden="true" />
  );
  const iconElement = cloneElement(iconNode, {
    size: 20,
    "aria-hidden": true,
    className: `${iconColorClass} ${iconNode.props?.className ?? ""}`.trim(),
  });

  const wrapperClasses = `${
    isComingSoon ? disabledClasses : activeCardClasses
  } ${baseLayoutClasses}`;
  const titleClass = `${
    isComingSoon ? "text-white/80" : sectionStyle.headingClass
  } text-base font-semibold text-white mb-1 truncate`;

  return (
    <div
      className={wrapperClasses}
      onClick={isComingSoon ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      aria-disabled={isComingSoon}
    >
      {isComingSoon && (
        <div className="absolute top-3 right-3 bg-yellow-400 text-[10px] font-bold px-2 py-1 rounded-full text-gray-900 flex items-center">
          <Clock size={12} className="mr-1" />
          Coming Soon
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className={`${iconWrapperClasses} rounded-full bg-white border border-white/40 shadow-sm flex items-center justify-center mb-3`}
        >
          {iconElement}
        </div>
        <h2 className={titleClass}>{service.title}</h2>
      </div>

      <p className={descriptionClasses}>{service.description}</p>

      <button
        className={isComingSoon ? disabledButtonClasses : 'cta-ejp'}
        disabled={isComingSoon}
        onClick={(e) => {
          if (!isComingSoon) {
            e.stopPropagation();
            onClick();
          }
        }}
      >
        {isComingSoon ? (
          <>
            <Lock size={14} className="mr-2" /> Coming Soon
          </>
        ) : (
          <>
            Explore Now
            <span className="chev">›</span>
          </>
        )}
      </button>

      {!isComingSoon && (
        <div
          className={`absolute inset-0 ${hoverOverlayClass} opacity-0 transition-opacity duration-500 rounded-2xl`}
          style={{ opacity: isHovered ? 1 : 0 }}
        />
      )}
    </div>
  );
};

/* -------------------------- Category Header -------------------------- */
interface CategoryHeaderProps {
  icon: React.ReactNode;
  title: string;
  count?: number | null;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  icon,
  title,
  count = null,
}) => {
  const [ref] = useInView({ threshold: 0.1 });

  return (
    <div className="mb-6" ref={ref}>
      <div className="flex items-center mb-2">
        <div className={`w-10 h-10 rounded-full bg-dq-navy/10 flex items-center justify-center mr-3 text-dq-navy transition-all duration-300 ${isHovered ? 'scale-110 bg-dq-navy/15' : ''}`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 clamp-1">{title}</h2>
      </div>
      {count !== null && (
        <div className="ml-13 text-gray-600 clamp-2">
          <span className="font-semibold mr-1">
            <AnimatedCounter value={count} />+
          </span>
          services available in this category
        </div>
      )}
    </div>
  );
};

/* ------------------------------ HomePage ----------------------------- */
export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Services (unchanged)
  const allServices = useMemo(() => {
    return {
      finance: [
        {
          id: 'dq-lms-courses',
          title: 'DQ LMS Courses',
          description: "Access DQ's Learning Hub to grow skills and master courses that shape your professional journey",
          icon: <GraduationCap />,
          path: "/marketplace/courses",
          isActive: true,
        },
        {
          id: "dq-onboarding-flows",
          title: "DQ Onboarding Flows",
          description:
            "Navigate clear onboarding flows to connect faster and feel confident from your first day.",
          icon: <Compass />,
          path: '/onboarding',
          isActive: true
        },
        {
          id: 'dq-guideline-center-dco',
          title: 'DQ DCO Guidelines',
          description: 'Discover DQ’s core workflows, policies, and daily operational standards.',
          icon: <BookIcon />,
          path: "#",
          isActive: true,
        },
        {
          id: 'dq-guideline-center-dbp',
          title: 'DQ DBP Guidelines',
          description: 'Explore DQ’s build standards,templates, and development processes.',
          icon: <BookIcon />,
          path: '#',
          isActive: true
        }
      ],
      advisory: [
        {
          id: "dq-services-requests",
          title: "DQ Services & Requests",
          description:
            "Access HR, IT, and Finance services in one place. Track requests and manage workflows easily.",
          icon: <Briefcase />,
          path: "#",
          isActive: true,
        },
        {
          id: "self-service-center",
          title: "Self-Service Center",
          description:
            "Find templates and dashboards that empower independent, efficient daily work.",
          icon: <Globe />,
          path: "#",
          isActive: true,
        },
        {
          id: "self-service-tools",
          title: "Self-Service Tools",
          description:
            "Use smart digital shortcuts and assistants that simplify your everyday tasks.",
          icon: <Lightbulb />,
          path: "#",
          isActive: false,
        },
        {
          id: "service-integrations",
          title: "Service Integrations",
          description:
            "Connect your favorite DQ apps and automate workflows seamlessly.",
          icon: <TrendingUp />,
          path: "#",
          isActive: false,
        },
      ],
      growth: [
        {
          id: "units-directory",
          title: "Units & Associates Directory",
          description:
            "Explore people and units across DQ to connect, collaborate, and grow together.",
          icon: <Users />,
          path: "#",
          isActive: true,
        },
        {
          id: "communities-surveys",
          title: "Communities & Surveys",
          description:
            "Join conversations that shape DQ's culture and share feedback that drives improvement.",
          icon: <HeartHandshake />,
          path: '/communities',
          isActive: true,
        },
        {
          id: "events-calendars",
          title: "Events & Calendars",
          description:
            "Stay in sync with everything DQ, from weekly huddles to cultural events.",
          icon: <Calendar />,
          path: "/events",
          isActive: true,
        },
        {
          id: "dq-activities",
          title: "DQ Activities",
          description:
            "Track priorities, manage tasks, and collaborate seamlessly within DQ's workspaces.",
          icon: <ClipboardList />,
          path: "/marketplace/activities",
          isActive: true,
        },
        {
          id: "news-announcements",
          title: "News & Announcements",
          description:
            "See daily DQ updates, success stories, and highlights that keep every team informed and inspired.",
          icon: <Newspaper />,
          path: "#",
          isActive: true,
        },
      ],
      learning: [
        {
          id: 'dq-faqs',
          title: 'DQ FAQs',
          description: "Browse DQ's FAQ hub for quick answers and shared insights from across our teams.",
          icon: <MessageCircle />,
          path: '#',
          isActive: true
        },
        {
          id: 'asset-library',
          title: 'DQ Glossary',
          description: 'Decode DQ terminology with clear definitions updated by teams across the organization.',
          icon: <Building />,
          path: "#",
          isActive: true,
        },
        {
          id: 'blueprint-library',
          title: 'DQ DBP Blueprints Library',
          description: 'Access blueprint structures and delivery frameworks for DBP development.',
          icon: <Compass />,
          path: '#',
          isActive: true
        },
        {
          id: 'reference-library-products',
          title: 'DQ Product Library',
          description: 'Find product reference materials and documentation for ongoing builds.',
          icon: <Compass />,
          path: "/blueprints",
          isActive: true,
        },
        {
          id: "strategy-center",
          title: "Strategy Center",
          description:
            "Understand how DQ's initiatives align with its purpose, DNA, and vision.",
          icon: <BarChart />,
          path: "#",
          isActive: true,
        },
        {
          id: "job-center",
          title: "Job Center",
          description:
            "Find roles, mobility opportunities, and career paths to grow within DQ.",
          icon: <JobIcon />,
          path: "#",
          isActive: true,
        },
        {
          id: 'asset-libraey',
          title: 'Asset Library',
          description: 'Access logos, templates, and assets for consistent DQ communication and design.',
          icon: <BookOpen />,
          path: '#',
          isActive: true
        },
        {
          id: "knowledge-base",
          title: "Knowledge Base",
          description:
            "Follow step-by-step answers covering tools, governance, and support workflows across DQ.",
          icon: <BookIcon />,
          path: '#',
          isActive: true
        },
        {
          id: "research-hub",
          title: "Research Hub",
          description:
            "Explore insights, data, and reports powering DQ's continuous transformation and decision making.",
          icon: <Lightbulb />,
          path: "#",
          isActive: false,
        },
        {
          id: "template-library",
          title: "Template Library",
          description:
            "Download ready-to-use decks and documents to share DQ initiatives with polish and consistency.",
          icon: <Award />,
          path: "#",
          isActive: false,
        },
      ],
    };
  }, []);

  /* --------- ROW COLORS + EJP BUTTON/ICON TREATMENT (UPDATED) --------- */
  const sectionStyles: Record<string, SectionStyle> = {
    // ROW 1 — Navy gradient
    'Learning & Enablement': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white',
      headingClass: 'text-white',
      descriptionClass: 'text-white/90',
      iconClass: 'text-[#030F35]',
      buttonClasses:
        'text-white bg-[#030F35] hover:bg-[#13285A] ' +
        'border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200',
      hoverOverlayClass: 'bg-white/10',
      iconWrapperClass: 'w-10 h-10',
      disabledCardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed'
    },

    // ROW 2 — Navy gradient (matching Learning & Enablement)
    'Services & Requests': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white',
      headingClass: 'text-white',
      descriptionClass: 'text-white/90',
      iconClass: 'text-[#030F35]',
      buttonClasses:
        'text-white bg-[#030F35] hover:bg-[#13285A] ' +
        'border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200',
      hoverOverlayClass: 'bg-white/10',
      iconWrapperClass: 'w-10 h-10',
      disabledCardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed'
    },

    // ROW 3 — Navy gradient (matching Learning & Enablement)
    'Collaboration & Communities': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white',
      headingClass: 'text-white',
      descriptionClass: 'text-white/90',
      iconClass: 'text-[#030F35]',
      buttonClasses:
        'text-white bg-[#030F35] hover:bg-[#13285A] ' +
        'border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200',
      hoverOverlayClass: 'bg-white/10',
      iconWrapperClass: 'w-10 h-10',
      disabledCardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed'
    },

    // ROW 4 — Navy gradient (matching Learning & Enablement)
    'Resources & Libraries': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white',
      headingClass: 'text-white',
      descriptionClass: 'text-white/90',
      iconClass: 'text-[#030F35]',
      buttonClasses:
        'text-white bg-[#030F35] hover:bg-[#13285A] ' +
        'border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200',
      hoverOverlayClass: 'bg-white/10',
      iconWrapperClass: 'w-10 h-10',
      disabledCardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed'
    }
  };

  const handleServiceClick = (path: string) => navigate(path);

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Marketplaces by Category */}
        <div className="mb-16">
          <FadeInUpOnScroll className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 clamp-1">
              Services & Marketplaces
            </h2>
            <div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto clamp-2">
                Explore the tools, spaces, and learning paths that fuel growth
                and collaboration inside DQ.
              </p>
            </div>
          </FadeInUpOnScroll>

          {/* Row 1 */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<GraduationCap size={24} />}
                title="Learning & Enablement"
                count={4}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={allServices.finance}
              renderCard={(service) => {
                const index = allServices.finance.findIndex(
                  (item) => item.id === service.id
                );
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles["Learning & Enablement"]}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                );
              }}
            />
          </div>

          {/* Row 2 */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<Briefcase size={24} />}
                title="Services & Requests"
                count={4}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={allServices.advisory}
              renderCard={(service) => {
                const index = allServices.advisory.findIndex(
                  (item) => item.id === service.id
                );
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles["Services & Requests"]}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                );
              }}
            />
          </div>

          {/* Row 3 */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<Users size={24} />}
                title="Collaboration & Communities"
                count={5}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={allServices.growth}
              renderCard={(service) => {
                const index = allServices.growth.findIndex(
                  (item) => item.id === service.id
                );
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={
                        sectionStyles["Collaboration & Communities"]
                      }
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                );
              }}
            />
          </div>

          {/* Row 4 */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader icon={<BookOpen size={24} />} title="Resources & Libraries" count={10} />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={allServices.learning}
              renderCard={(service) => {
                const index = allServices.learning.findIndex(
                  (item) => item.id === service.id
                );
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles["Resources & Libraries"]}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                );
              }}
            />
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />

      {/* animations + EJP CTA styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        .animate-fade-in    { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-in   { animation: scale-in 0.3s ease-out forwards; }
        .animate-pulse      { animation: pulse 2s infinite; }
        .hover\\:scale-102:hover { transform: scale(1.02); }

        /* ---------- EJP-style CTA (dark translucent -> white on hover) ---------- */
        .cta-ejp{
          display:inline-flex; align-items:center; justify-content:center; width:100%;
          padding:14px 20px; border-radius:14px; font-weight:600; font-size:14.5px;
          color:white;
          background:rgba(255,255,255,0.14);
          border:1px solid rgba(255,255,255,0.22);
          box-shadow:0 2px 8px rgba(0,0,0,0.1);
          backdrop-filter:saturate(140%) blur(4px);
          -webkit-backdrop-filter:saturate(140%) blur(4px);
          transition:all 0.3s ease;
        }
        .cta-ejp:hover{
          color:#1A2E6E;
          background:rgba(255,255,255,0.95);
          border-color:rgba(255,255,255,0.9);
          box-shadow:0 4px 12px rgba(0,0,0,0.15);
          transform:translateY(-1px);
        }
        .cta-ejp .chev { transition: transform 0.3s ease; }
        .cta-ejp:hover .chev { transform: translateX(4px); }
      `}</style>
    </div>
  );
};

export default HomePage;