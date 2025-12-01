import React, { useEffect, useState, useRef } from 'react';
import {
  Award,
  Users,
  ChevronLeft,
  ChevronRight,
  Building2,
  Landmark,
  Network,
  Users2,
  Clock,
  BookOpen,
} from 'lucide-react';
import {
  AnimatedCounter,
  FadeInUpOnScroll,
  StaggeredFadeIn,
  HorizontalScrollReveal,
  useInView,
} from './AnimationUtils';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  context: string;
  quote: string;
  avatar: string;
  note?: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Salem Wasike",
    role: "Product Owner - DQ Deploys",
    context: "DQ teammate since 2018",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "Agile Essentials and DTMF learning paths reduced blockers by 40% and sped up feature delivery.",
  },
  {
    id: "2",
    name: "Sharavi Chander",
    role: "Head of DQ Deploys",
    context: "Leading teams since 2019",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "80+ team certifications built a learning culture that lifted consistency across releases.",
  },
  {
    id: "3",
    name: "Mohamed Thameez",
    role: "Product Manager",
    context: "DQ teammate since 2021",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    quote:
      "Cross-unit learning spaces cut our feature turnaround time by 30% and kept teams in sync.",
  },
  {
    id: "dfsa",
    name: "Waleed Saeed Al Awadhi",
    role: "Chief Operating Officer",
    context: "DFSA",
    avatar:
      "https://ui-avatars.com/api/?name=Waleed+Saeed+Al+Awadhi&background=003049&color=ffffff",
    quote:
      "DQ was able to establish a practical transformation design and to realise this through an agile implementation. The results are moving DFSA towards a provider of intuitive services and provide a basis for AI and data-driven regulation.",
    note: "Not approved for external publication",
  },
  {
    id: "adib",
    name: "Kamran Sheikh",
    role: "Head of Enterprise Architecture & Analytics",
    context: "ADIB",
    avatar:
      "https://ui-avatars.com/api/?name=Kamran+Sheikh&background=002b5b&color=ffffff",
    quote:
      "We worked with DQ to bring the ADIB EA function back into the heart of business technology decision making. DQ was able to bring a whole set of new perspectives on practical approaches to EA-driven transformation.",
    note: "Not approved for external publication",
  },
  {
    id: "khalifa-fund",
    name: "Ali Al Jasmi",
    role: "Head of Technology",
    context: "Khalifa Fund",
    avatar:
      "https://ui-avatars.com/api/?name=Ali+Al+Jasmi&background=014f86&color=ffffff",
    quote:
      "DQ designed and implemented a multi-sided marketplace concept that stands to revitalise SME growth and expansion in Abu Dhabi. The approach was highly distinctive and enabled us to connect business vision with practical reality through one integrated transformation strategy.",
    note: "Not approved for external publication",
  },
];

// Partner categories for the grid
const partnerCategories = [
  {
    id: "government",
    title: "Governance Sector",
    subtitle:
      "Leadership, strategy, and value management for enterprise alignment",
    icon: <Building2 size={28} />,
    metric: "4+",
    color: "indigo-600",
  },
  {
    id: "financial",
    title: "Operations Sector",
    subtitle:
      "HR, Finance, and Deals support factories for day-to-day enablement",
    icon: <Landmark size={28} />,
    metric: "5+",
    color: "yellow-500",
  },
  {
    id: "service",
    title: "Platform Sector",
    subtitle:
      "Intelligence, Solutions, Security, and Products driving digital platforms",
    icon: <Users2 size={28} />,
    metric: "6+",
    color: "blue-600",
  },
  {
    id: "network",
    title: "Delivery Sector",
    subtitle:
      "Design, Deploys, and Accounts teams ensuring outcomes and engagements",
    icon: <Network size={28} />,
    metric: "3+",
    color: "orange-500",
  },
];

const featuredSectors = [
  { id: 'ce', name: 'CE', logo: '/logo/prodev.png' },
  { id: 'soldev', name: 'Soldev', logo: '/logo/soldev.png' },
  { id: 'finance', name: 'Finance', logo: '/logo/finance.png' },
  { id: 'hra', name: 'HRA', logo: '/logo/hra.png' },
  { id: 'inteldev', name: 'IntelDev', logo: '/logo/inteldev.png' },
];

/* =========================
   ✅ UPDATED KPI CONTENT
   ========================= */
const impactStats = [
  {
    label: 'Faster Task Closure',
    value: 80,
    prefix: 'Over',
    suffix: '%',
    icon: <Users size={20} strokeWidth={2.5} className="text-[#FB5535]" />,
  },
  {
    label: 'Focus Time Saved',
    value: 6,
    prefix: '+',
    suffix: 'hrs',
    icon: <Clock size={20} strokeWidth={2.5} className="text-[#FB5535]" />,
  },
  {
    label: 'Concepts Learned Daily',
    value: 5,
    prefix: '+',
    icon: <BookOpen size={20} strokeWidth={2.5} className="text-[#FB5535]" />,
  },
  {
    label: 'Collaboration Growth Rate',
    value: 87,
    suffix: '%',
    icon: <Award size={20} strokeWidth={2.5} className="text-[#FB5535]" />,
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const disclaimer = '(not approved for external publication)'
  const initials =
    testimonial.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?";

  return (
    <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-600"
          >
            <path
              d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
              fill="currentColor"
            />
            <path
              d="M12 14C7.58172 14 4 16.6863 4 20V22H20V20C20 16.6863 16.4183 14 12 14Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900">
            {testimonial.name}
          </p>
          <p className="text-sm text-gray-500">{testimonial.context}</p>
          <p className="text-sm text-gray-400">{testimonial.role}</p>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed text-base">
        "{testimonial.quote}"
        <span className="block text-xs text-gray-500 italic mt-2">{disclaimer}</span>
      </p>
      {testimonial.note && testimonial.note.toLowerCase().trim() !== disclaimer.replace(/[()]/g, '').toLowerCase() && (
        <p className="text-xs text-amber-600 mt-4">
          {testimonial.note}
        </p>
      )}
    </div>
  );
};

const TestimonialsShowcase = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial, index) => (
          <FadeInUpOnScroll key={testimonial.id} delay={index * 0.08}>
            <TestimonialCard testimonial={testimonial} />
          </FadeInUpOnScroll>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          type="button"
          className="px-5 py-2 text-sm font-semibold text-[var(--guidelines-primary-dark)] border border-gray-200 rounded-full bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-ring-color)]"
        >
          Show more stories
        </button>
      </div>
    </div>
  );
};

const VideoTestimonialCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount =
        activeIndex * (carouselRef.current.scrollWidth / testimonials.length);
      carouselRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  }, [activeIndex]);

  const handlePrev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const openModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial, index) => (
          <FadeInUpOnScroll key={testimonial.id} delay={index * 0.08}>
            <TestimonialCard testimonial={testimonial} />
          </FadeInUpOnScroll>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          type="button"
          className="px-5 py-2 text-sm font-semibold text-[var(--guidelines-primary-dark)] border border-gray-200 rounded-full bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-ring-color)]"
        >
          Show more stories
        </button>
      </div>
    </div>
  );
};

// Partner Category Card component
const PartnerCategoryCard = ({ category }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [ref, isInView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (isInView && !hasAnimated) setHasAnimated(true);
  }, [isInView, hasAnimated]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-xl p-6 transition-all duration-500 ease-out transform ${
        isHovered ? "shadow-md scale-[1.02]" : "shadow-sm"
      }`}
      style={{
        background: isHovered
          ? `linear-gradient(to bottom right, #f9fafb, #ffffff)`
          : "#ffffff",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${
          isHovered ? "scale-110" : ""
        }`}
        style={{
          backgroundColor: `rgba(var(--color-${category.color}-rgb), 0.1)`,
          color: `var(--color-${category.color})`,
        }}
      >
        <div
          className={`transition-transform duration-500 ${
            isHovered ? "animate-bounce-subtle" : ""
          }`}
        >
          {category.icon}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {category.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4">{category.subtitle}</p>

      <div
        className={`text-3xl font-bold transition-all duration-300 ${
          isHovered ? `text-${category.color}` : `text-${category.color}`
        }`}
      >
        {hasAnimated && <AnimatedCounter value={parseInt(category.metric)} />}
        {!hasAnimated && "0"}
        {category.metric.includes("+") && "+"}
      </div>
    </div>
  );
};

// Partner Logo
const PartnerLogo = ({ sector }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`relative mx-4 my-1 transition-all duration-300 ease-out transform ${
        isHovered ? 'scale-110' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={sector.logo}
        alt={sector.name}
        className="h-12 object-contain transition-all duration-500"
        style={{
          filter: isHovered ? "none" : "grayscale(100%)",
          opacity: isHovered ? 1 : 0.7,
          width: "auto",
          maxWidth: "120px",
        }}
      />
    </div>
  );
};

// Featured Partners Carousel
const FeaturedPartnersCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const sectors = featuredSectors;

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const maxScroll =
          carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        const currentScroll = carouselRef.current.scrollLeft;
        if (currentScroll >= maxScroll - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollTo({
            left: currentScroll + 200,
            behavior: "smooth",
          });
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    if (carouselRef.current)
      carouselRef.current.scrollTo({
        left: carouselRef.current.scrollLeft - 300,
        behavior: "smooth",
      });
  };
  const handleNext = () => {
    if (carouselRef.current)
      carouselRef.current.scrollTo({
        left: carouselRef.current.scrollLeft + 300,
        behavior: "smooth",
      });
  };

  return (
    <div className="relative pt-6 pb-4 md:pt-8 md:pb-6">
      <FadeInUpOnScroll className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Featured Sectors
        </h3>
        <p className="text-gray-600">
          Trusted core factories and streams across DQ
        </p>
      </FadeInUpOnScroll>

      <div className="relative overflow-hidden">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto py-2 scrollbar-hide gap-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[...sectors, ...sectors].map((sector, index) => (
            <PartnerLogo key={`${sector.id}-${index}`} sector={sector} />
          ))}
        </div>

        <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center transform -translate-y-1/2 pointer-events-none px-4">
          <button
            className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-all pointer-events-auto"
            onClick={handlePrev}
            aria-label="Previous partners"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className="w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-all pointer-events-auto"
            onClick={handleNext}
            aria-label="Next partners"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

const ProofAndTrust: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Why Abu Dhabi / Platform Impact */}
        <div className="mb-16">
          <FadeInUpOnScroll className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 clamp-1">
              Why Agile Working Accelerates Growth
            </h2>
            <div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 text-balance clamp-2">
                Agile working empowers teams to adapt, collaborate, and grow
                faster together.
              </p>
            </div>
          </FadeInUpOnScroll>

          <StaggeredFadeIn
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
            staggerDelay={0.15}
          >
            {impactStats.map((stat, index) => {
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-[#F6F7F9] p-6 md:p-8 text-center shadow-sm hover:shadow-md transition-all duration-300 min-h-[220px] h-full flex flex-col items-center"
                >
                  <div className="flex justify-center mb-4">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FB5535]/10 text-[#FB5535]">
                      {stat.icon}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-dq-navy mb-1 flex items-baseline justify-center">
                    {stat.prefix && <span className="mr-1">{stat.prefix}</span>}
                    <span className="inline-flex items-baseline tabular-nums">
                      <AnimatedCounter value={stat.value} />
                      <span>{stat.suffix ?? ""}</span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 text-center leading-tight mt-1 whitespace-normal break-words [text-overflow:clip] [overflow:visible] [display:block]">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </StaggeredFadeIn>
        </div>

        {/* Success Stories */}
        <div className="mb-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 overflow-hidden relative">
          <FadeInUpOnScroll className="text-center mb-10 relative z-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 clamp-1">
              Success Stories from DQ Employees
            </h2>
            <div>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto clamp-2">
                Discover how DQ teams work smarter and collaborate better every
                day.
              </p>
            </div>
          </FadeInUpOnScroll>
            <TestimonialsShowcase />
          </div>

        {/* Powered by Strategic Partnerships - NEW SECTION */}
        <div className="mb-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 overflow-hidden relative">
          <HorizontalScrollReveal
            direction="left"
            className="text-center mb-10 relative z-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3 clamp-1">
              Our Four Pillars of Success
            </h2>
            <div className="relative">
              <p className="text-lg text-gray-600 max-w-3xl mx-auto clamp-2">
                Governance, Operations, Platforms, and Delivery — the four
                pillars driving DQ’s success.
              </p>
            </div>
          </HorizontalScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {partnerCategories.map((category, index) => (
              <FadeInUpOnScroll key={category.id} delay={index * 0.15}>
                <PartnerCategoryCard category={category} />
              </FadeInUpOnScroll>
            ))}
          </div>

          <FeaturedPartnersCarousel />
        </div>

        {/* Animations + CSS vars */}
        <style>{`
          @keyframes animate-gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          @keyframes ping-slow { 0% { transform: scale(1); opacity: 0.8; } 70%,100% { transform: scale(2); opacity: 0; } }
          @keyframes bounce-subtle { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
          @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes expand-line { 0% { width: 0; } 100% { width: 100%; } }
          .animate-ping-slow { animation: ping-slow 2s cubic-bezier(0,0,0.2,1) infinite; }
          .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-expand-line { animation: expand-line 1.5s ease-out forwards; }
          .animate-gradient-shift { background-size: 200% 200%; animation: animate-gradient-shift 15s ease infinite; }
        `}</style>

        <style>{`
          :root {
            --color-indigo-600: #4f46e5; --color-indigo-600-rgb: 79, 70, 229;
            --color-yellow-500: #eab308; --color-yellow-500-rgb: 234, 179, 8;
            --color-blue-600: #2563eb; --color-blue-600-rgb: 37, 99, 235;
            --color-orange-500: #f97316; --color-orange-500-rgb: 249, 115, 22;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProofAndTrust;
