import React, { useEffect, useState, useRef } from 'react';
import {
  Star,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  AnimatedCounter,
  FadeInUpOnScroll,
  StaggeredFadeIn,
  HorizontalScrollReveal,
  useInView,
} from './AnimationUtils';
import {
  testimonials,
  partnerCategories,
  featuredSectors,
  impactStats,
  type Testimonial,
} from '../data/landingPageContent';

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

const VideoTestimonialCard = ({
  testimonial,
  onClick,
}: {
  testimonial: Testimonial;
  onClick: () => void;
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovering) {
        videoRef.current
          .play()
          .catch((error) => console.error("Video play error:", error));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovering]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-[300px] cursor-pointer group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
    >
      {/* Video/Thumbnail Background */}
      <div className="absolute inset-0 bg-gray-900 overflow-hidden">
        <img
          src={testimonial.videoThumbnail}
          alt={`${testimonial.name} from ${testimonial.company}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isHovering ? "opacity-0" : "opacity-100"
          }`}
        />
        <video
          ref={videoRef}
          src={testimonial.videoUrl}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
          muted
          playsInline
          loop
        />
      </div>

      {/* Overlay with content */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 p-6 flex flex-col transition-all duration-300 ${
          isHovering ? "bg-black/60" : ""
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden mb-4">
          <img
            src={testimonial.companyLogo}
            alt={testimonial.company}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-auto">
          <div
            className={`text-2xl font-bold mb-1 ${
              testimonial.metricColor === "green"
                ? "text-green-500"
                : testimonial.metricColor === "orange"
                ? "text-orange-500"
                : testimonial.metricColor === "red"
                ? "text-red-500"
                : "text-dq-coral"
            }`}
          >
            {testimonial.metric}{" "}
            <span className="text-white text-lg font-medium">
              {testimonial.metricLabel}
            </span>
          </div>

          <p className="text-white/90 text-sm line-clamp-2 mb-3">
            "{testimonial.quote}"
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-8 h-8 rounded-full mr-2 border border-white/30"
              />
              <div>
                <p className="text-white text-sm font-medium">
                  {testimonial.name}
                </p>
                <p className="text-white/70 text-xs">
                  {testimonial.position}, {testimonial.company}
                </p>
              </div>
            </div>
            <div
              className={`w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                isHovering ? "animate-pulse bg-white/50" : ""
              }`}
            >
              <Play size={18} className="text-white ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialModal = ({
  testimonial,
  isOpen,
  onClose,
}: {
  testimonial: Testimonial | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !testimonial) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl transform transition-all duration-300 animate-fadeIn flex flex-col overflow-hidden"
      >
        <div className="relative flex-shrink-0">
          <div className="w-full aspect-video bg-gray-900">
            <video
              src={testimonial.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-all"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <div className="flex items-center mb-4">
            <img
              src={testimonial.companyLogo}
              alt={testimonial.company}
              className="w-12 h-12 rounded-full object-cover mr-4"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                How {testimonial.company} scaled with Enterprise Journey
              </h3>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < testimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start mb-6">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-12 h-12 rounded-full object-cover mr-4 mt-1"
            />
            <div>
              <p className="text-gray-700 italic mb-3">
                "{testimonial.fullQuote}"
              </p>
              <div>
                <p className="font-medium text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">
                  {testimonial.position}, {testimonial.company}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {testimonial.metric} {testimonial.metricLabel}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Impact achieved through DQ Workspace
                </p>
              </div>
            </div>
          </div>
        </div>
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
    <div className="relative">
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth gap-6 pb-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {testimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="min-w-full sm:min-w-[calc(100%/2-12px)] lg:min-w-[calc(100%/3-16px)] flex-shrink-0 snap-center"
          >
            <FadeInUpOnScroll delay={index * 0.1}>
              <VideoTestimonialCard
                testimonial={testimonial}
                onClick={() => openModal(testimonial)}
              />
            </FadeInUpOnScroll>
          </div>
        ))}
      </div>

      <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center transform -translate-y-1/2 pointer-events-none px-4">
        <button
          className="p-0 bg-transparent shadow-none border-none backdrop-blur-0 hover:bg-transparent cursor-pointer text-white pointer-events-auto flex items-center justify-center transition-all"
          onClick={handlePrev}
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="p-0 bg-transparent shadow-none border-none backdrop-blur-0 hover:bg-transparent cursor-pointer text-white pointer-events-auto flex items-center justify-center transition-all"
          onClick={handleNext}
          aria-label="Next testimonial"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="flex justify-center mt-4 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              activeIndex === index ? "bg-dq-coral w-6" : "bg-gray-300"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      <TestimonialModal
        testimonial={selectedTestimonial}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
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
          {React.createElement(category.iconComponent, { size: category.iconSize || 28 })}
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
    <div className="relative h-auto pt-6 pb-2 md:pt-8 md:pb-3">
      <FadeInUpOnScroll className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Featured Sectors
        </h3>
        <p className="text-gray-600">
          Trusted core factories and streams across DQ
        </p>
      </FadeInUpOnScroll>

      <div className="relative h-auto overflow-visible">
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
                      {React.createElement(stat.iconComponent, {
                        size: stat.iconSize || 20,
                        strokeWidth: 2.5,
                        className: stat.iconClassName,
                      })}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-dq-navy mb-1 flex items-baseline justify-center">
                    {stat.prefix && <span className="mr-1">{stat.prefix}</span>}
                    <span className="inline-flex items-baseline tabular-nums">
                      <AnimatedCounter value={stat.value} />{stat.suffix ? (
                        <span>{stat.suffix}</span>
                      ) : null}
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
            <VideoTestimonialCarousel />
          </div>

        {/* Powered by Strategic Partnerships - NEW SECTION */}
        <div className="mb-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 overflow-visible relative">
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
