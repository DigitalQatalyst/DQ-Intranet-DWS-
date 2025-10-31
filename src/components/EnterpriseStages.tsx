import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Lightbulb, Rocket, TrendingUp, BarChart3, BadgeCheck, ShieldCheck, Globe, Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { FadeInUpOnScroll, HorizontalScrollReveal } from './AnimationUtils';
import { dwsStages } from '../data/dwsStages';
import StageModal from './journey/StageModal';
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
  const baseClasses = 'bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 min-w-[300px] flex flex-col flex-shrink-0 md:min-w-0 relative h-full min-h-[420px]';
  const activeClasses = 'ring-2 ring-blue-500 shadow-lg';
  const inactiveClasses = 'hover:shadow-lg hover:-translate-y-1';
  return <div className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`} onMouseEnter={() => setActiveIndex(index)}>
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-full mr-4 transition-colors duration-300 ${isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
            {icon}
          </div>
          <h3 className="text-xl font-bold text-gray-800 clamp-1">{title}</h3>
        </div>
        <p className="text-gray-600 mb-4 clamp-2">{description}</p>
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Key Benefits:</h4>
          <ul className="text-gray-600 space-y-1">
            {benefits.map((benefit, i) => <li key={i} className="flex items-start">
                <span className={`mr-2 transition-colors duration-300 ${isActive ? 'text-dq-coral' : 'text-dq-navy'}`}>
                  •
                </span>
                <span>{benefit}</span>
              </li>)}
          </ul>
        </div>
        <button
          type="button"
          onClick={onClick}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onClick();
            }
          }}
          data-stage-trigger={stageId}
          className="mt-auto text-white font-medium py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center overflow-hidden group bg-[#131E42] hover:bg-[#0F1A4F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#99B2FF]"
        >
          {ctaText}
          <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
      {/* Stage number indicator */}
      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-dq-coral text-white' : 'bg-gray-200 text-gray-600'}`}>
        {index + 1}
      </div>
    </div>;
};
const EnterpriseStages: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
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

  const selectedStage = useMemo(
    () => stages.find((stage) => stage.id === selectedStageId) ?? null,
    [stages, selectedStageId]
  );

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

  const handleOpenStage = (stageId: string, order: number) => {
    setSelectedStageId(stageId);
    setActiveIndex(order - 1);
  };

  const handleCloseStage = () => {
    setSelectedStageId(null);
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll className="mb-8 text-center">
          <h2 className="clamp-1 mb-3 text-3xl font-bold text-gray-900">
            Associate Growth Journey
          </h2>
          <p className="clamp-2 mx-auto max-w-3xl text-lg text-gray-600">
            Every step of your journey matters — learn, collaborate, and grow to shape your success at DQ.
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
          className="scrollbar-hide flex gap-6 overflow-x-auto pb-6 md:grid md:grid-cols-2 md:overflow-x-visible lg:grid-cols-3"
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
                  onClick={() => handleOpenStage(stage.id, stage.order)}
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
      </div>

      <StageModal
        stage={selectedStage}
        isOpen={selectedStageId !== null}
        onClose={handleCloseStage}
      />
    </div>
  );
};
export default EnterpriseStages;
