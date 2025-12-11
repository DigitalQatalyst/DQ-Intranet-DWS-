import React, { useEffect, useState, cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  Users,
  Newspaper,
  Lightbulb,
  Briefcase as JobIcon,
  Globe,
  Calendar,
  Book as BookIcon,
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
} from 'lucide-react';
import {
  AnimatedCounter,
  FadeInUpOnScroll,
  useInView,
} from './AnimationUtils';
import ServiceCarousel from './marketplace/ServiceCarousel';
import { fetchServicesByCategory } from '../services/homeContentService';
import type { ServiceCard as ServiceCardRecord } from '../services/homeContentService';

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
    "bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed",
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
    "rounded-2xl p-6 flex flex-col justify-between min-h-[260px] shadow-sm overflow-hidden transition-all duration-300 transform backdrop-blur-sm";
  const baseButtonClasses =
    "mt-auto h-9 px-4 rounded-md font-medium w-full flex items-center justify-center";
  const disabledButtonClasses = `${baseButtonClasses} bg-white/70 text-gray-600 cursor-not-allowed transition-all duration-200`;

  const iconColorClass = isComingSoon
    ? "text-gray-500"
    : sectionStyle.iconClass ?? "text-[#1A2E6E]";
  const hoverOverlayClass = sectionStyle.hoverOverlayClass ?? "bg-white/10";
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

  const fallbackSections = {
    learningWorkGuides: [
      {
        id: 'courses-curricula',
        title: 'Courses',
        description: 'Explore LMS courses across GHC, 6xD, DWS, DXP, and core curricula.',
        icon: <GraduationCap />,
        path: '/learning/courses',
        isActive: true
      },
      {
        id: 'onboarding-flows',
        title: 'Onboarding',
        description: 'Follow onboarding tracks to complete role-based learning and setup.',
        icon: <Compass />,
        path: '/learning/onboarding-flows',
        isActive: true
      },
      {
        id: 'work-guide-strategy',
        title: 'Strategy Guide',
        description: "Understand DQ's journey, history, 6xD, initiatives, clients, and operating models.",
        icon: <BarChart />,
        path: '/work-guides/strategy',
        isActive: true
      },
      {
        id: 'work-guide-guidelines',
        title: 'Operational Guide',
        description: 'Access operational guidelines, policies, templates, and governance playbooks.',
        icon: <ClipboardList />,
        path: '/work-guides/guidelines',
        isActive: true
      },
      {
        id: 'knowledge-library',
        title: 'Knowledge Library',
        description: 'Browse glossaries, FAQs, and reference resources for everyday work.',
        icon: <BookIcon />,
        path: '/knowledge/library',
        isActive: true
      }
    ],
    servicesDigitalWorkforce: [
      {
        id: 'services-center-technology',
        title: 'Technology Services',
        description: 'Submit technology requests: queries, support, environments, and self-service tools.',
        icon: <Globe />,
        path: '/services/technology',
        isActive: true
      },
      {
        id: 'services-center-business',
        title: 'Business Services',
        description: 'Submit business, finance, and admin requests through a unified console.',
        icon: <Briefcase />,
        path: '/services/business',
        isActive: true
      },
      {
        id: 'digital-worker-tools',
        title: 'Digital Worker Tools',
        description: 'Use Doc Writers, prompting kits, AI tools, agents, and BPM helpers for delivery.',
        icon: <Lightbulb />,
        path: '/services/digital-worker-tools',
        isActive: true
      },
      {
        id: 'blueprints-library',
        title: 'Blueprint Library',
        description: 'Access blueprint packs for 6xD design, DevOps, DBP, DXP, and DWS delivery.',
        icon: <Compass />,
        path: '/resources/blueprints-library',
        isActive: true
      }
    ],
    workManagementHub: [
      {
        id: 'activities-sessions',
        title: 'Work Sessions',
        description: 'Run daily and weekly work sessions, reviews, retros, and collaborator touchpoints.',
        icon: <Calendar />,
        path: '/activities/sessions',
        isActive: true
      },
      {
        id: 'activities-projects-tasks',
        title: 'Projects & Tasks',
        description: 'Manage tasks, planners, chat threads, and ATP delivery activities.',
        icon: <ClipboardList />,
        path: '/activities/projects',
        isActive: true
      },
      {
        id: 'activities-trackers',
        title: 'Performance Trackers',
        description: 'Track statuses, categories, descriptions, and live workflow updates.',
        icon: <BarChart />,
        path: '/activities/trackers',
        isActive: true
      },
      {
        id: 'communities-discussion',
        title: 'Team Discussions',
        description: 'Join forums on topics, DNA practices, learnings, and team conversations.',
        icon: <MessageCircle />,
        path: '/communities/discussion',
        isActive: true
      },
      {
        id: 'communities-pulse',
        title: 'Pulse Insights',
        description: 'Share insights through polls, surveys, and feedback loops.',
        icon: <HeartHandshake />,
        path: '/communities/pulse',
        isActive: true
      }
    ],
    cultureEventsNetworking: [
      {
        id: 'news-announcements',
        title: 'DQ Media Center',
        description: 'View DQ updates, corporate news, trends, and essential announcements.',
        icon: <Newspaper />,
        path: '/marketplace/guides',
        isActive: true
      },
      {
        id: 'jobs-openings',
        title: 'Career Opportunities',
        description: 'Browse new job postings and internal career opportunities.',
        icon: <JobIcon />,
        path: '/updates/jobs',
        isActive: true
      },
      {
        id: 'blogs',
        title: 'Blogs & Stories',
        description: 'Read stories, updates, and insights from teams across DQ.',
        icon: <BookIcon />,
        path: '/updates/blogs',
        isActive: true
      },
      {
        id: 'communities-events-calendars',
        title: 'Events & Calendars',
        description: 'Stay aligned with scheduled huddles, events, calendars, and logistics.',
        icon: <Calendar />,
        path: '/communities/events',
        isActive: true
      }
    ],
    peopleDirectory: [
      {
        id: 'directory-units',
        title: 'Units Directory',
        description: 'Explore sectors, units, mandates, priorities, and performance data.',
        icon: <Building />,
        path: '/marketplace/work-directory?tab=units',
        isActive: true
      },
      {
        id: 'directory-positions',
        title: 'Positions Directory',
        description: 'Browse DQ positions, role descriptions, and key responsibilities.',
        icon: <Briefcase />,
        path: '/marketplace/work-directory?tab=positions',
        isActive: true
      },
      {
        id: 'directory-associates',
        title: 'Associates Directory',
        description: 'View associate profiles, contacts, skills, and performance details.',
        icon: <Users />,
        path: '/marketplace/work-directory?tab=associates',
        isActive: true
      },
      {
        id: 'client-testimonials',
        title: 'Client Testimonials',
        description: 'Explore client stories, cases, achievements, and leadership references.',
        icon: <HeartHandshake />,
        path: '/resources/testimonials',
        isActive: true
      }
    ]
  };

  const [homeSections, setHomeSections] = useState(fallbackSections);

  useEffect(() => {
    const mapServiceToCard = (service: ServiceCardRecord) => ({
      id: service.id,
      title: service.title,
      description: service.description ?? '',
      icon: <CircleDot />,
      path: service.path ?? '#',
      isActive: service.is_active ?? true
    });

    async function loadSections() {
      try {
        const [
          learning,
          servicesDigital,
          work,
          culture,
          people
        ] = await Promise.all([
          fetchServicesByCategory('Learning & Work Knowledge Hub'),
          fetchServicesByCategory('Services & Digital Enablement'),
          fetchServicesByCategory('Work Execution & Collaboration'),
          fetchServicesByCategory('Culture, Events & Communications'),
          fetchServicesByCategory('People & Organization Hub')
        ]);

        setHomeSections(prev => ({
          learningWorkGuides: learning.length ? learning.map(mapServiceToCard) : prev.learningWorkGuides,
          servicesDigitalWorkforce: servicesDigital.length ? servicesDigital.map(mapServiceToCard) : prev.servicesDigitalWorkforce,
          workManagementHub: work.length ? work.map(mapServiceToCard) : prev.workManagementHub,
          cultureEventsNetworking: culture.length ? culture.map(mapServiceToCard) : prev.cultureEventsNetworking,
          peopleDirectory: people.length ? people.map(mapServiceToCard) : prev.peopleDirectory
        }));
      } catch (err) {
        console.error('Failed to load home sections from Supabase', err);
      }
    }

    loadSections();
  }, []);

  /* --------- ROW COLORS + DQ BUTTON/ICON TREATMENT (UPDATED) --------- */
  const sectionStyles: Record<string, SectionStyle> = {
    // ROW 1 — Navy gradient
    'Learning & Work Knowledge Hub': {
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
    },

    // ROW 2 — Navy gradient (matching primary style)
    'Services & Digital Enablement': {
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
    },

    // ROW 3 — Navy gradient
    'Work Execution & Collaboration': {
      cardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.95)0%,rgba(3,15,53,0.80)100%)] border border-[rgba(255,255,255,0.18)] text-white',
      headingClass: 'text-white',
      descriptionClass: 'text-white/90',
      iconClass: 'text-[#030F35]',
      buttonClasses:
        "text-white bg-[#030F35] hover:bg-[#13285A] " +
        "border border-[rgba(255,255,255,0.22)] focus:ring-[#030F35] focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200",
      hoverOverlayClass: "bg-white/10",
      iconWrapperClass: "w-10 h-10",
      disabledCardClasses:
        'bg-[linear-gradient(90deg,rgba(3,15,53,0.65)0%,rgba(3,15,53,0.55)100%)] border border-[rgba(255,255,255,0.12)] text-white/50 cursor-not-allowed'
    },

    // ROW 4 — Navy gradient (matching primary style)
    'Culture, Events & Communications': {
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

    // ROW 5 — Navy gradient
    'People & Organization Hub': {
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
    },
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
                title="Learning & Work Knowledge Hub"
                count={homeSections.learningWorkGuides.length}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.learningWorkGuides}
              renderCard={service => {
                const index = homeSections.learningWorkGuides.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Learning & Work Knowledge Hub']}
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
                title="Services & Digital Enablement"
                count={homeSections.servicesDigitalWorkforce.length}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.servicesDigitalWorkforce}
              renderCard={service => {
                const index = homeSections.servicesDigitalWorkforce.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Services & Digital Enablement']}
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
                title="Work Execution & Collaboration"
                count={homeSections.workManagementHub.length}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.workManagementHub}
              renderCard={service => {
                const index = homeSections.workManagementHub.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Work Execution & Collaboration']}
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
              <CategoryHeader
                icon={<Newspaper size={24} />}
                title="Culture, Events & Communications"
                count={homeSections.cultureEventsNetworking.length}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.cultureEventsNetworking}
              renderCard={service => {
                const index = homeSections.cultureEventsNetworking.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['Culture, Events & Communications']}
                      onClick={() => handleServiceClick(service.path)}
                      isComingSoon={!service.isActive}
                    />
                  </FadeInUpOnScroll>
                );
              }}
            />
          </div>

          {/* Row 5 */}
          <div className="mb-10">
            <FadeInUpOnScroll>
              <CategoryHeader
                icon={<BookOpen size={24} />}
                title="People & Organization Hub"
                count={homeSections.peopleDirectory.length}
              />
            </FadeInUpOnScroll>
            <ServiceCarousel
              services={homeSections.peopleDirectory}
              renderCard={service => {
                const index = homeSections.peopleDirectory.findIndex(item => item.id === service.id);
                return (
                  <FadeInUpOnScroll key={service.id} delay={index * 0.1}>
                    <ServiceCard
                      service={service}
                      sectionStyle={sectionStyles['People & Organization Hub']}
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
