import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  User, 
  Users, 
  UserCheck, 
  Layers, 
  Network, 
  Building2,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { FadeInUpOnScroll, HorizontalScrollReveal } from './AnimationUtils';
import { KNOWLEDGE_CENTER_GROWTH_FRAMEWORK_URL } from '../constants/leadspaceLinks';

type LeadershipLevel = {
  code: string;
  title: string;
  description: string;
  benefits: string[];
  icon: React.ReactNode;
  ctaText: string;
  ctaHref: string;
};

const LEADERSHIP_LEVELS: LeadershipLevel[] = [
  {
    code: 'L0',
    title: 'Aspiring Leader',
    description: 'Begin your journey with foundational self-leadership skills.',
    benefits: [
      'Build self-awareness',
      'Develop curiosity',
      'Start influencing through small actions',
    ],
    icon: <Lightbulb size={24} className="transition-colors duration-300" />,
    ctaText: 'Start Your Journey',
    ctaHref: '/knowledge-center/leadership-framework?level=L0',
  },
  {
    code: 'L1',
    title: 'Lead Yourself',
    description: 'Practice accountability, discipline, and personal ownership.',
    benefits: [
      'Strengthen daily habits',
      'Improve self-management',
      'Build personal influence',
    ],
    icon: <User size={24} className="transition-colors duration-300" />,
    ctaText: 'Build Self-Leadership',
    ctaHref: '/knowledge-center/leadership-framework?level=L1',
  },
  {
    code: 'L2',
    title: 'Lead Others',
    description: 'Support peers and guide small initiatives.',
    benefits: [
      'Coaching basics',
      'Guiding conversations',
      'Collaboration skills',
    ],
    icon: <Users size={24} className="transition-colors duration-300" />,
    ctaText: 'Guide Others',
    ctaHref: '/knowledge-center/leadership-framework?level=L2',
  },
  {
    code: 'L3',
    title: 'Lead Teams',
    description: 'Enable collaboration and deliver results through others.',
    benefits: [
      'Goal-setting',
      'Planning rituals',
      'Team visibility',
    ],
    icon: <UserCheck size={24} className="transition-colors duration-300" />,
    ctaText: 'Lead a Team',
    ctaHref: '/knowledge-center/leadership-framework?level=L3',
  },
  {
    code: 'L4',
    title: 'Lead Functions',
    description: 'Coordinate multiple teams and align priorities.',
    benefits: [
      'Cross-team alignment',
      'Dependency management',
      'Scaling practices',
    ],
    icon: <Layers size={24} className="transition-colors duration-300" />,
    ctaText: 'Lead a Function',
    ctaHref: '/knowledge-center/leadership-framework?level=L4',
  },
  {
    code: 'L5',
    title: 'Lead Systems',
    description: 'Influence enterprise processes and system-wide performance.',
    benefits: [
      'Systems thinking',
      'Operating rhythms',
      'Cross-functional outcomes',
    ],
    icon: <Network size={24} className="transition-colors duration-300" />,
    ctaText: 'Drive System Outcomes',
    ctaHref: '/knowledge-center/leadership-framework?level=L5',
  },
  {
    code: 'L6/L7',
    title: 'Lead Enterprise',
    description: 'Shape long-term strategy, culture, and organizational vision.',
    benefits: [
      'Strategic planning',
      'Enterprise culture impact',
      'Vision leadership',
    ],
    icon: <Building2 size={24} className="transition-colors duration-300" />,
    ctaText: 'Lead the Enterprise',
    ctaHref: '/knowledge-center/leadership-framework?level=L6-L7',
  },
];

interface LevelCardProps {
  level: LeadershipLevel;
  index: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const LevelCard: React.FC<LevelCardProps> = ({
  level,
  index,
  activeIndex,
  setActiveIndex,
}) => {
  const isActive = index === activeIndex;

  return (
    <article
      className="flex flex-col h-full bg-white border border-[#E7EAF3] rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] relative"
      style={{ padding: '24px' }}
      onMouseEnter={() => setActiveIndex(index)}
    >
      {/* Level code pill - top right */}
      <div className="absolute top-4 right-4">
        <span 
          className="inline-flex items-center justify-center text-[11px] font-medium px-2 py-[3px] border border-[#E7EAF3]"
          style={{
            background: '#F5F6FA',
            color: '#030F35',
            borderRadius: '12px',
          }}
        >
          {level.code.split('/')[0]}
        </span>
      </div>

      {/* Card content wrapper - flex column h-full */}
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className="mb-4">
          <div 
            className="inline-flex items-center justify-center w-10 h-10 rounded-full"
            style={{
              background: '#F5F6FA',
            }}
          >
            <div style={{ color: '#030F35' }}>
              {level.icon}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold mb-2 pr-12" style={{ color: '#2A2A2A' }}>
          {level.title}
        </h3>

        {/* Description */}
        <p className="text-sm mb-4" style={{ color: '#616161' }}>
          {level.description}
        </p>

        {/* Key Benefits - flex-1 to push button to bottom */}
        <div className="mt-2 text-sm flex-1" style={{ color: '#616161' }}>
          <h4 className="font-semibold mb-2 text-xs uppercase tracking-wide" style={{ color: '#2A2A2A' }}>
            Key Benefits:
          </h4>
          <ul className="space-y-1.5">
            {level.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2" style={{ color: '#616161' }}>•</span>
                <span className="text-xs" style={{ color: '#616161' }}>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button - pinned to bottom */}
        <div className="mt-6">
          <Link
            to={level.ctaHref}
            className="inline-flex w-full items-center justify-center rounded-lg font-medium transition"
            style={{
              background: '#030F35',
              color: '#FFFFFF',
              borderRadius: '8px',
              height: '40px',
              fontSize: '14px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#08172C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#030F35';
            }}
          >
            {level.ctaText}
          </Link>
        </div>
      </div>
    </article>
  );
};

export const LeadershipGrowthJourney: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [page, setPage] = useState<0 | 1>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );
    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }
    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, []);

  const timelineLabels = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6/L7'];

  // Split cards into pages: first 6, then remaining
  const pages = useMemo(() => [LEADERSHIP_LEVELS.slice(0, 6), LEADERSHIP_LEVELS.slice(6)], []);
  const firstPageCount = pages[0].length;

  const handleSetLevelIndex = (index: number) => {
    setActiveIndex(index);
    if (index >= firstPageCount && pages[1].length) {
      setPage(1);
    } else {
      setPage(0);
    }
  };

  const showPrevPage = () => {
    if (page === 1) {
      setPage(0);
      handleSetLevelIndex(Math.min(activeIndex, firstPageCount - 1));
    }
  };

  const showNextPage = () => {
    if (page === 0 && pages[1].length) {
      setPage(1);
      handleSetLevelIndex(firstPageCount);
    }
  };

  return (
    <section id="leadership-in-practice" className="py-16 md:py-20 lg:py-24 bg-white scroll-mt-[72px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 mb-3">
            Leadership Growth Journey
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            Discover how leadership evolves across seven levels—from self-leadership to enterprise impact.
          </p>
        </div>

        {/* Horizontal Timeline */}
        <div className="mt-8 mb-8 hidden lg:block">
          <div className="mx-auto flex w-full max-w-[960px] px-0 justify-center items-center">
            <div className="flex-1">
              <div
                ref={timelineRef}
                className="journey-track relative h-2 w-full rounded-full bg-[#030F35]/20"
              >
                <div
                  className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-[#030F35] to-[#FB5535] transition-all duration-1000 ease-out"
                  style={{
                    width: isInView ? `${((activeIndex + 1) / LEADERSHIP_LEVELS.length) * 100}%` : '0%',
                  }}
                />
                {LEADERSHIP_LEVELS.map((_, index) => (
                  <div
                    key={index}
                    className={`absolute top-0 h-6 w-6 -translate-y-1/2 transform rounded-full transition-all duration-500 cursor-pointer ${
                      index <= activeIndex
                        ? 'bg-[#FB5535] border-2 border-white shadow-md'
                        : 'bg-gray-300'
                    }`}
                    style={{
                      left: `calc(${(index / (LEADERSHIP_LEVELS.length - 1)) * 100}% - 12px)`,
                    }}
                    onClick={() => handleSetLevelIndex(index)}
                    aria-label={`Go to ${timelineLabels[index]}`}
                  />
                ))}
              </div>
              {/* Timeline Labels */}
              <div className="relative w-full mt-4">
                {timelineLabels.map((label, index) => (
                  <div
                    key={index}
                    className="absolute text-xs font-medium text-slate-600 -translate-x-1/2"
                    style={{
                      left: `calc(${(index / (timelineLabels.length - 1)) * 100}%)`,
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mb-4 hidden justify-end space-x-2 md:flex">
          <button
            onClick={showPrevPage}
            className={`p-2 rounded-full bg-white shadow transition-colors duration-300 hover:bg-gray-100 ${
              page === 0 ? "pointer-events-none opacity-40" : ""
            }`}
            aria-label="Previous page"
            disabled={page === 0}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={showNextPage}
            className={`p-2 rounded-full bg-white shadow transition-colors duration-300 hover:bg-gray-100 ${
              page === 1 || pages[1].length === 0 ? "pointer-events-none opacity-40" : ""
            }`}
            aria-label="Next page"
            disabled={page === 1 || pages[1].length === 0}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Cards Grid - Same layout as Associate Growth Journey */}
        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex gap-6 overflow-x-auto pb-6 md:grid md:grid-cols-2 md:overflow-x-visible lg:grid-cols-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {pages[page].map((level, localIndex) => {
            const globalIndex = page === 0 ? localIndex : firstPageCount + localIndex;
            return (
              <HorizontalScrollReveal
                key={level.code}
                direction={globalIndex % 2 === 0 ? "left" : "right"}
                distance={50}
                threshold={0.2}
              >
                <LevelCard
                  level={level}
                  index={globalIndex}
                  activeIndex={activeIndex}
                  setActiveIndex={handleSetLevelIndex}
                />
              </HorizontalScrollReveal>
            );
          })}
        </div>

        {/* Mobile Timeline Indicators */}
        <div className="mt-4 flex justify-center md:hidden">
          <div className="flex space-x-1">
            {LEADERSHIP_LEVELS.map((_, index) => (
              <button
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'w-10 bg-[#FB5535]' : 'w-6 bg-gray-300'
                }`}
                onClick={() => handleSetLevelIndex(index)}
                aria-label={`Go to level ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 md:mt-16 flex justify-center">
          <Link
            to={KNOWLEDGE_CENTER_GROWTH_FRAMEWORK_URL}
            className="inline-flex items-center gap-2 rounded-full border border-[#FB5535]/30 bg-white px-6 py-3 text-sm font-semibold text-[#FB5535] shadow-sm hover:bg-[#FB5535] hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB5535] focus-visible:ring-offset-2"
            aria-label="Explore Full Leadership Framework"
          >
            Explore Full Leadership Framework
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LeadershipGrowthJourney;

