import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Lightbulb, Rocket, TrendingUp, BarChart3, BadgeCheck, ShieldCheck, Globe, Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FadeInUpOnScroll, HorizontalScrollReveal } from './AnimationUtils';
interface StageCardProps {
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
        <button onClick={onClick} className={`mt-auto text-white font-medium py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center overflow-hidden group ${isActive ? 'bg-[image:var(--dq-cta-gradient)] hover:brightness-105' : 'bg-dq-navy hover:bg-dq-navy/90'}`}>
          {ctaText}
          <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
      {/* Stage number indicator */}
      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-dq-coral text-white' : 'bg-gray-200 text-gray-600'}`}>
        {index}
      </div>
    </div>;
};
const EnterpriseStages: React.FC = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  // Animate timeline when in view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, {
      threshold: 0.2
    });
    if (timelineRef.current) {
      observer.observe(timelineRef.current);
    }
    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current);
      }
    };
  }, []);
  const stages = [{
    id: 'learn',
    level: 'L0',
    order: 1,
    title: 'Starting (Learning)',
    description: 'Build DQ foundations.',
    benefits: ['Onboarding guides', 'LMS starter courses', 'Knowledge Hub access'],
    icon: <Lightbulb size={24} className="transition-colors duration-300" />,
    ctaText: 'Start Learning ',
    path: '/stages/learn'
  }, {
    id: 'follow',
    level: 'L1',
    order: 2,
    title: 'Follow (Self Aware)',
    description: 'Practice with guidance.',
    benefits: ['Daily checklists', 'Buddy system', 'Workspace orientation'],
    icon: <Rocket size={24} className="transition-colors duration-300" />,
    ctaText: 'Follow the Path ',
    path: '/stages/follow'
  }, {
    id: 'assist',
    level: 'L2',
    order: 3,
    title: 'Assist (Self Lead)',
    description: 'Contribute and collaborate.',
    benefits: ['Agile boards', 'Services & Requests', 'Team deliverables'],
    icon: <TrendingUp size={24} className="transition-colors duration-300" />,
    ctaText: 'Assist Your Team ',
    path: '/stages/assist'
  }, {
    id: 'apply',
    level: 'L3',
    order: 4,
    title: 'Apply (Drive Squad)',
    description: 'Own outcomes.',
    benefits: ['Productivity dashboards', 'Specialized LMS', 'Cross-unit projects'],
    icon: <BarChart3 size={24} className="transition-colors duration-300" />,
    ctaText: 'Apply Your Skills ',
    path: '/stages/apply'
  }, {
    id: 'enable',
    level: 'L4',
    order: 5,
    title: 'Enable (Drive Team)',
    description: 'Lead initiatives.',
    benefits: ['Leadership guides', 'Workflow automation', 'Collab workspaces'],
    icon: <BadgeCheck size={24} className="transition-colors duration-300" />,
    ctaText: 'Enable Others ',
    path: '/stages/enable'
  }, {
    id: 'ensure',
    level: 'L5',
    order: 6,
    title: 'Ensure (Steer Org)',
    description: 'Steer organization outcomes.',
    benefits: ['Governance playbooks', 'Release discipline', 'Risk & compliance flows'],
    icon: <ShieldCheck size={24} className="transition-colors duration-300" />,
    ctaText: 'Ensure at Org Level ',
    path: '/stages/ensure'
  }, {
    id: 'influence',
    level: 'L6',
    order: 7,
    title: 'Influence (Steer Cross)',
    description: 'Scale good practices.',
    benefits: ['Cross-unit playbooks', 'Communities of practice', 'Change toolkits'],
    icon: <Globe size={24} className="transition-colors duration-300" />,
    ctaText: 'Influence at Scale ',
    path: '/stages/influence'
  }, {
    id: 'inspire',
    level: 'L7',
    order: 8,
    title: 'Inspire (Inspire Market)',
    description: 'Shape the ecosystem.',
    benefits: ['Strategy hubs', 'Innovation forums', 'Thought leadership'],
    icon: <Sparkles size={24} className="transition-colors duration-300" />,
    ctaText: 'Inspire the Market ',
    path: '/stages/inspire'
  }];
  const [page, setPage] = useState(0);
  const pages = useMemo(() => [stages.slice(0, 6), stages.slice(6)], [stages]);
  const showPrevPage = () => {
    if (page === 1) {
      setPage(0);
      setActiveIndex(prev => (prev > 5 ? 0 : prev));
    }
  };
  const showNextPage = () => {
    if (page === 0 && pages[1].length) {
      setPage(1);
      setActiveIndex(6);
    }
  };
  return <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 clamp-1">
            Associate Growth Journey
          </h2>
          <div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto clamp-2">
              Every step of your journey matters — learn, collaborate, and grow to shape your success at DQ.
            </p>
          </div>
        </FadeInUpOnScroll>
        {/* Timeline connector (visible on desktop) */}
        <div ref={timelineRef} className="hidden lg:block relative max-w-6xl mx-auto h-2 bg-dq-navy/20 rounded-full my-12">
          <div className="absolute top-0 left-0 h-2 bg-[image:var(--dq-cta-gradient)] rounded-full transition-all duration-1000 ease-out" style={{
          width: isInView ? `${(activeIndex + 1) / stages.length * 100}%` : '0%'
        }}></div>
          {/* Stage markers */}
          {stages.map((_, index) => <div key={index} className={`absolute top-0 transform -translate-y-1/2 w-6 h-6 rounded-full transition-all duration-500 ${index <= activeIndex ? 'bg-dq-coral border-2 border-white' : 'bg-gray-300'}`} style={{
          left: `calc(${index / (stages.length - 1) * 100}% - 12px)`,
          transform: 'translateY(-50%)',
          transition: 'background-color 0.5s ease-out'
        }} onClick={() => setActiveIndex(index)}></div>)}
        </div>
        {/* Scroll Controls - Desktop */}
        <div className="hidden md:flex justify-end mb-4 space-x-2">
          <button onClick={showPrevPage} className={`p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors duration-300 ${page === 0 ? 'opacity-40 pointer-events-none' : ''}`} aria-label="Scroll left" disabled={page === 0}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={showNextPage} className={`p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors duration-300 ${page === 1 || pages[1].length === 0 ? 'opacity-40 pointer-events-none' : ''}`} aria-label="Scroll right" disabled={page === 1 || pages[1].length === 0}>
            <ChevronRight size={20} />
          </button>
        </div>
        {/* Scrollable Container */}
        <div ref={scrollContainerRef} className="flex overflow-x-auto pb-6 gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible scrollbar-hide" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
          {pages[page].map(stage => {
            const stageIndex = stage.order - 1;
            return (
              <HorizontalScrollReveal key={stage.id} direction={stageIndex % 2 === 0 ? 'left' : 'right'} distance={50} threshold={0.2}>
                <StageCard title={stage.title} description={stage.description} benefits={stage.benefits} icon={stage.icon} ctaText={stage.ctaText} onClick={() => navigate(stage.path)} index={stageIndex} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
              </HorizontalScrollReveal>
            );
          })}
        </div>
        {/* Mobile Scroll Indicator */}
        <div className="flex md:hidden justify-center mt-4">
          <div className="flex space-x-1">
            {stages.map((_, index) => <button key={index} className={`h-1 rounded-full w-6 transition-all duration-300 ${index === activeIndex ? 'bg-dq-coral w-10' : 'bg-gray-300'}`} onClick={() => setActiveIndex(index)} aria-label={`Go to stage ${index + 1}`} />)}
          </div>
        </div>
      </div>
    </div>;
};
export default EnterpriseStages;
