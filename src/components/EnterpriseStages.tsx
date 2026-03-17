import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Lightbulb, Rocket, TrendingUp, BarChart3, BadgeCheck, ShieldCheck, Globe, Sparkles, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { FadeInUpOnScroll, HorizontalScrollReveal } from './AnimationUtils';
import { dwsStages } from '../data/dwsStages';
interface StageCardProps {
  stageId: string;
  title: string;
  description: string;
  benefits: string[];
  icon: React.ReactNode;
  ctaText: string;
  onClick: () => void;
  index: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}
const StageCard: React.FC<StageCardProps> = ({
  stageId,
  title,
  description,
  benefits,
  icon,
  ctaText,
  onClick,
  index,
  activeIndex,
  setActiveIndex
}) => {
  const isActive = index === activeIndex;
  const baseClasses = 'bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 flex flex-col flex-shrink-0 relative h-[380px] w-full max-w-[485px] hover:shadow-md hover:border-gray-300';
  return <div className={`${baseClasses}`} onMouseEnter={() => setActiveIndex(index)}>
      <div className="p-6 flex flex-col h-full">
        {/* Header with icon and title */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-800 leading-tight">{title}</h3>
          </div>
          {/* Stage number badge */}
          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
            {index + 1}
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">{description}</p>
        
        {/* Key Benefits */}
        <div className="mb-6 flex-grow">
          <h4 className="text-sm font-bold text-gray-800 mb-2">At this level you will:</h4>
          <ul className="text-sm text-gray-700 space-y-1.5">
            {benefits.map((benefit, i) => <li key={i} className="flex items-start">
                <span className="mr-2 text-gray-600 text-xs">•</span>
                <span className="leading-relaxed">{benefit}</span>
              </li>)}
          </ul>
        </div>
        
        {/* CTA Button */}
        <button
          type="button"
          disabled
          className="mt-auto w-full rounded-lg bg-gray-200 text-gray-500 text-sm font-bold py-2.5 px-4 transition-all duration-300 flex items-center justify-center cursor-not-allowed"
        >
          <span className="flex items-center justify-center">
            <Lock size={16} className="mr-2" />
            {ctaText}
          </span>
        </button>
      </div>
    </div>;
};
const EnterpriseStages: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [page, setPage] = useState(0);

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

  const stages = useMemo(
    () => dwsStages.slice().sort((a, b) => a.order - b.order),
    []
  );

  const iconMap: Record<string, React.ReactNode> = useMemo(
    () => ({
      starting: <Lightbulb size={24} className="transition-colors duration-300" />,
      follow: <Rocket size={24} className="transition-colors duration-300" />,
      assist: <TrendingUp size={24} className="transition-colors duration-300" />,
      apply: <BarChart3 size={24} className="transition-colors duration-300" />,
      enable: <BadgeCheck size={24} className="transition-colors duration-300" />,
      ensure: <ShieldCheck size={24} className="transition-colors duration-300" />,
      influence: <Globe size={24} className="transition-colors duration-300" />,
      inspire: <Sparkles size={24} className="transition-colors duration-300" />,
    }),
    []
  );

  const pages = useMemo(() => [stages.slice(0, 6), stages.slice(6)], [stages]);
  const firstPageCount = pages[0].length;

  const handleSetStageIndex = (index: number) => {
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
      handleSetStageIndex(Math.min(activeIndex, firstPageCount - 1));
    }
  };

  const showNextPage = () => {
    if (page === 0 && pages[1].length) {
      setPage(1);
      handleSetStageIndex(firstPageCount);
    }
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll className="mb-8 text-center">
          <h2 className="clamp-1 mb-3 text-3xl font-bold text-gray-900">
            Your Growth Journey (SFIA+ Levels)
          </h2>
          <p className="mx-auto max-w-4xl text-lg text-gray-600 whitespace-nowrap">
            DQ uses SFIA+ to define autonomy, influence, and impact. Explore levels to understand expectations and progress confidently.
          </p>
        </FadeInUpOnScroll>

        <div className="my-12 hidden lg:block">
          <div className="mx-auto flex w-full max-w-[960px] px-0 justify-center md:max-w-[1100px]">
            <div
              ref={timelineRef}
              className="journey-track relative h-2 w-full rounded-full bg-dq-navy/20"
            >
              <div
                className="absolute top-0 left-0 h-2 rounded-full bg-[image:var(--dq-cta-gradient)] transition-all duration-1000 ease-out"
                style={{
                  width: isInView ? `${((activeIndex + 1) / stages.length) * 100}%` : "0%",
                }}
              />
              {stages.map((_, index) => (
                <div
                  key={index}
                  className={`absolute top-0 h-6 w-6 -translate-y-1/2 transform rounded-full transition-all duration-500 ${
                    index <= activeIndex ? "bg-dq-coral border-2 border-white" : "bg-gray-300"
                  }`}
                  style={{
                    left: `calc(${(index / (stages.length - 1)) * 100}% - 12px)`,
                  }}
                  onClick={() => handleSetStageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4 hidden justify-end space-x-2 md:flex">
          <button
            onClick={showPrevPage}
            className={`p-2 rounded-full bg-white shadow transition-colors duration-300 hover:bg-gray-100 ${
              page === 0 ? "pointer-events-none opacity-40" : ""
            }`}
            aria-label="Scroll left"
            disabled={page === 0}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={showNextPage}
            className={`p-2 rounded-full bg-white shadow transition-colors duration-300 hover:bg-gray-100 ${
              page === 1 || pages[1].length === 0 ? "pointer-events-none opacity-40" : ""
            }`}
            aria-label="Scroll right"
            disabled={page === 1 || pages[1].length === 0}
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex gap-6 overflow-x-auto pb-6 md:grid md:grid-cols-2 md:gap-6 md:overflow-x-visible lg:grid-cols-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {pages[page].map((stage) => {
            const stageIndex = stage.order - 1;
            const icon = iconMap[stage.id] ?? (
              <Sparkles size={24} className="transition-colors duration-300" />
            );
            return (
              <HorizontalScrollReveal
                key={stage.id}
                direction={stageIndex % 2 === 0 ? "left" : "right"}
                distance={50}
                threshold={0.2}
              >
                <StageCard
                  stageId={stage.id}
                  title={stage.title}
                  description={stage.subtitle}
                  benefits={stage.keyBenefits}
                  icon={icon}
                  ctaText={stage.ctaLabel}
                  onClick={() => {}}
                  index={stageIndex}
                  activeIndex={activeIndex}
                  setActiveIndex={handleSetStageIndex}
                />
              </HorizontalScrollReveal>
            );
          })}
        </div>

        <div className="mt-4 flex justify-center md:hidden">
          <div className="flex space-x-1">
            {stages.map((_, index) => (
              <button
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-10 bg-dq-coral" : "w-6 bg-gray-300"
                }`}
                onClick={() => handleSetStageIndex(index)}
                aria-label={`Go to stage ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 flex justify-center">
          <a
            href="https://sfia-online.org/en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-[#1A2E6E] hover:bg-[#152654] text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            Explore SFIA Framework
          </a>
        </div>
      </div>
    </div>
  );
};
export default EnterpriseStages;
