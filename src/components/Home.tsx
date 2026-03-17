import React, { cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { toTitleCase } from "../utils/textUtils";
import {
  BookOpen,
  Briefcase,
  Users,
  Newspaper,
  Lightbulb,
  Globe,
  Calendar,
  Book as BookIcon,
  MessageCircle,
  Clock,
  Compass,
  Building,
  Lock,
  GraduationCap,
  CircleDot,
  ClipboardList,
  ScrollText,
  Wand2,
  Bot,
} from 'lucide-react';
import {
  AnimatedCounter,
  FadeInUpOnScroll,
  useInView,
} from './AnimationUtils';
import ServiceCarousel from './marketplace/ServiceCarousel';


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
    "bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed",
};

/* --------------------- Approved Marketplace Structure --------------------- */
const approvedSections = {
  // 1) Learning Center & DQ Knowledge Hub
  learningHub: [
    {
      id: 'learning-center',
      title: 'Learning Center',
      description:
        'Designed for your continuous growth. Access the upskilling and certification tools you need to deliver excellence.',
      icon: <BookOpen />,
      path: '/lms',
      isActive: true,
    },
    {
      id: 'ghc',
      title: 'GHC',
      description:
        'Explore the Golden Honeycomb of Competencies (GHC), the system behind how DQ works and delivers value.',
      icon: <GraduationCap />,
      path: '/marketplace/guides?tab=strategy&collapsed=guide_type%2Csub_domain%2Cunit%2Clocation%2Ctestimonial_category%2Cproduct_type%2Cproduct_stage%2Cguidelines_category%2Ccategorization%2Cattachments%2Cstrategy_framework%2Cglossary_knowledge_system%2Cglossary_ghc_dimension%2Cglossary_6xd_perspective%2Cglossary_letter%2Cfaq_category',
      isActive: true,
    },
    {
      id: 'dq-guidelines',
      title: 'DQ Guidelines',
      description:
        'Official standards, governance models, and ways of working that guide execution across DQ.',
      icon: <ScrollText />,
      path: '/marketplace/guides?collapsed=guide_type%2Csub_domain%2Cunit%2Clocation%2Ctestimonial_category%2Cproduct_type%2Cproduct_stage%2Cguidelines_category%2Ccategorization%2Cattachments%2Cstrategy_framework%2Cglossary_knowledge_system%2Cglossary_ghc_dimension%2Cglossary_6xd_perspective%2Cglossary_letter%2Cfaq_category',
      isActive: true,
    },
    {
      id: 'ai-prompt-library',
      title: 'AI Prompt Library',
      description:
        'Curated, reusable AI prompts and patterns to accelerate delivery and decision-making.',
      icon: <Wand2 />,
      path: '/marketplace/services-center?tab=prompt_library',
      isActive: false,
    },
    {
      id: 'devops-knowledge-center',
      title: 'DevOps Knowledge Center',
      description:
        'Apply delivery blueprints for 6xD design, DevOps, DBP, DXP, and DWS execution.',
      icon: <Compass />,
      path: '/marketplace/guides?tab=blueprints',
      isActive: false,
    },
  ],

  // 2) Media & Communications Hub
  mediaHub: [
    {
      id: 'news-announcements',
      title: 'News & Announcements',
      description:
        'Discover what is happening in DQ, including important announcements, and what teams are building.',
      icon: <Newspaper />,
      path: '/marketplace/opportunities',
      isActive: true,
    },
    {
      id: 'podcasts',
      title: 'Podcasts',
      description: 'Tune in to conversations, stories, and expert insights from DQ leaders and associates.',
      icon: <MessageCircle />,
      path: '/marketplace/opportunities?tab=podcasts',
      isActive: true,
    },
    {
      id: 'blogs',
      title: 'Blogs',
      description:
        'Dive into thought leadership, personal stories, and expert insights written by colleagues across DQ.',
      icon: <BookIcon />,
      path: '/marketplace/opportunities?tab=insights',
      isActive: true,
    },
    {
      id: 'events',
      title: 'Events',
      description:
        'Discover upcoming events, townhalls, and experience sessions across DQ.',
      icon: <Calendar />,
      path: '/communities/events',
      isActive: false,
    },
  ],

  // 3) Service Requests & Enablement Hub
  serviceEnablementHub: [
    {
      id: 'technology',
      title: 'Technology',
      description:
        'Request environments, access, support, and tooling for DQ technology platforms.',
      icon: <Globe />,
      path: '/marketplace/services-center?tab=technology',
      isActive: false,
    },
    {
      id: 'employee-service',
      title: 'Employee Service',
      description:
        'Submit finance, HR, and admin requests through a single, trackable console.',
      icon: <Briefcase />,
      path: '/marketplace/services-center?tab=business',
      isActive: false,
    },
    {
      id: 'ai-tools',
      title: 'AI Tools',
      description:
        'AI-powered tools and copilots that support execution, automation, and delivery across DQ.',
      icon: <Bot />,
      path: '/marketplace/services-center?tab=ai_tools',
      isActive: false,
    },
    {
      id: 'digital-worker',
      title: 'Digital Worker',
      description:
        'Use Doc Writers, prompting kits, AI tools, agents, and BPM helpers to speed up delivery.',
      icon: <Lightbulb />,
      path: '/marketplace/services-center?tab=digital_worker',
      isActive: false,
    },
  ],

  // 4) Organization, Roles & People
  orgRolesPeople: [
    {
      id: 'units',
      title: 'Units',
      description:
        'Explore sectors, units, mandates, priorities, and performance metrics.',
      icon: <Building />,
      path: '/marketplace/work-directory?tab=units',
      isActive: false,
    },
    {
      id: 'task-template',
      title: 'Task Template',
      description:
        'Organize projects, tasks, and boards so work stays visible and on track.',
      icon: <ClipboardList />,
      path: '/activities/projects',
      isActive: false,
    },
    {
      id: 'planner-template',
      title: 'Planner Template',
      description:
        'Plan and run daily and weekly work sessions, reviews, retros, and check-ins.',
      icon: <Calendar />,
      path: '/activities/sessions',
      isActive: false,
    },
    {
      id: 'associates-directory',
      title: 'Associates Directory',
      description:
        'View associate profiles, contacts, skills, and performance details.',
      icon: <Users />,
      path: '/marketplace/work-directory?tab=associates',
      isActive: false,
    },
  ],
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
  const activeCardClasses = `${sectionStyle.cardClasses} hover:shadow-md hover:-translate-y-0.5 cursor-pointer`;
  const disabledClasses =
    sectionStyle.disabledCardClasses ??
    "bg-dqsec-tint text-white/70 opacity-70 cursor-not-allowed border border-transparent";

  const baseLayoutClasses =
    "rounded-2xl p-6 flex flex-col justify-between min-h-[260px] shadow-sm overflow-hidden transition-all duration-300 transform backdrop-blur-sm";
  const baseButtonClasses =
    "mt-auto h-9 px-4 rounded-md font-medium w-full flex items-center justify-center";
  const disabledButtonClasses = `${baseButtonClasses} bg-white/70 text-gray-600 cursor-not-allowed transition-all duration-200`;

  const iconColorClass = isComingSoon
    ? "text-gray-500"
    : sectionStyle.iconClass ?? "text-[#1A2E6E]";
  const iconWrapperClasses = sectionStyle.iconWrapperClass ?? "w-12 h-12";
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
  const displayTitle = toTitleCase(service.title);

  return (
    <div
      className={wrapperClasses}
      onClick={isComingSoon ? undefined : onClick}
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
        <h2 className={titleClass} title={displayTitle}>{displayTitle}</h2>
      </div>

      <p className={descriptionClasses}>{service.description}</p>

      <button
        className={isComingSoon ? disabledButtonClasses : "cta-dq"}
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
    </div>
  );
};

/* -------------------------- Category Header -------------------------- */
interface CategoryHeaderProps {
  icon: React.ReactNode;
  title: string;
  count?: number | null;
  description?: string;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  icon,
  title,
  count = null,
  description,
}) => {
  const [ref] = useInView({ threshold: 0.1 });
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="mb-6" ref={ref}>
      <div className="flex items-center mb-2">
        <div
          className={`w-10 h-10 rounded-full bg-dq-navy/10 flex items-center justify-center mr-3 text-dq-navy transition-all duration-300 ${
            isHovered ? "scale-110 bg-dq-navy/15" : ""
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 clamp-1">{title}</h2>
      </div>
      {description && (
        <div className="ml-13 text-gray-600 text-base mb-2">
          {description}
        </div>
      )}
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

  const homeSections = approvedSections;

  /* --------- ROW COLORS + DQ BUTTON/ICON TREATMENT (UPDATED) --------- */
  const navySectionStyle: SectionStyle = {
    cardClasses:
      "bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white",
    headingClass: "text-white",
    descriptionClass: "text-white/90",
    iconClass: "text-[#030F35]",
    buttonClasses:
      "text-white bg-[#030F35] hover:bg-[#13285A] " +
      "border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200",
    hoverOverlayClass: "bg-white/10",
    iconWrapperClass: "w-10 h-10",
    disabledCardClasses:
      "bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed",
  };

  const sectionStyles: Record<string, SectionStyle> = {
    'Learning Center & DQ Knowledge': navySectionStyle,
    'Media & Communications': navySectionStyle,
    'Service Requests & Enablement': navySectionStyle,
    'Organization, Roles & People': navySectionStyle,
  };

  const handleServiceClick = (path: string) => navigate(path);

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Marketplaces by Category */}
        <div className="mb-16" id="tools-resources-services">
          <FadeInUpOnScroll className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 clamp-1">
              Tools, Resources & Services
            </h2>
            <div>
              <p className="text-base sm:text-lg text-gray-600 mx-auto leading-relaxed max-w-4xl whitespace-nowrap">
                Access tools, learning, and guidelines designed to help you work smarter and act confidently all in one place.
              </p>
            </div>
          </FadeInUpOnScroll>

          {/* 1. Learning Center & DQ Knowledge Hub */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<BookOpen size={24} />}
                title="Learning Center & DQ Knowledge"
                description="Learn, reference standards, and access knowledge that guides delivery."
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.learningHub}
              renderCard={(service) => {
                const index = homeSections.learningHub.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Learning Center & DQ Knowledge']}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                );
              }}
            />
          </div>

          {/* 2. Media & Communications Hub */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<Newspaper size={24} />}
                title="Media & Communications"
                description="Stay aligned with what's happening — news, stories, and internal updates."
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.mediaHub}
              renderCard={(service) => {
                const index = homeSections.mediaHub.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Media & Communications']}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                );
              }}
            />
          </div>

          {/* 3. Service Requests & Enablement Hub */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<Briefcase size={24} />}
                title="Service Requests & Enablement"
                description="Request support and enablement services — tracked and visible."
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.serviceEnablementHub}
              renderCard={(service) => {
                const index = homeSections.serviceEnablementHub.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Service Requests & Enablement']}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                );
              }}
            />
          </div>

          {/* 4. Organization, Roles & People */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<Users size={24} />}
                title="Organization, Roles & People"
                description="Understand teams, roles, and who to contact."
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.orgRolesPeople}
              renderCard={(service) => {
                const index = homeSections.orgRolesPeople.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Organization, Roles & People']}
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

      {/* animations + DQ CTA styles */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

        /* ---------- DQ-style CTA (dark translucent -> white on hover) ---------- */
        .cta-dq {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 14px 20px;
          border-radius: 14px;
          font-weight: 600;
          font-size: 14.5px;
          color: white;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.22);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          backdrop-filter: saturate(140%) blur(4px);
          -webkit-backdrop-filter: saturate(140%) blur(4px);
          transition: all 0.3s ease;
        }
        .cta-dq:hover {
          color: #1a2e6e;
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(255, 255, 255, 0.9);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
        }
        .cta-dq .chev {
          transition: transform 0.3s ease;
        }
        .cta-dq:hover .chev {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
