import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { DQMap } from '../DQMap';

interface HeroDiscoverDQProps {
  onExploreClick?: () => void;
  onGrowthClick?: () => void;
}

const stats = [
  { value: '5 000+', label: 'Active Users' },
  { value: '120+', label: 'Ongoing Projects' },
  { value: '90%', label: 'Collaboration Satisfaction' },
];

export const HeroDiscoverDQ: React.FC<HeroDiscoverDQProps> = ({
  onExploreClick,
  onGrowthClick,
}) => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      navigate('/work-zones');
    }
  };

  const handleGrowthClick = () => {
    if (onGrowthClick) {
      onGrowthClick();
    } else {
      navigate('/growth');
    }
  };

  const scrollToZones = () => {
    const dnaSection = document.getElementById('dna');
    if (dnaSection) {
      dnaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-white"
    >

      <div className="relative max-w-[1280px] mx-auto px-6 py-16 lg:py-20 xl:py-24 2xl:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Content */}
          <div className="space-y-6 lg:space-y-8 max-w-[560px]">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm font-semibold text-gray-500" aria-label="Breadcrumb">
              <span>Explore</span>
              <span>›</span>
              <span className="text-[#0E1446]">Discover DQ</span>
            </nav>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0E1446] leading-[1.05]">
              Discover DQ
            </h1>

            {/* Body */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-[54ch] leading-relaxed">
              A unified workspace where teams connect, co-work, and grow through purpose-driven collaboration.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={handleExploreClick}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[#0E1446] text-white font-semibold rounded-full transition-all duration-200 hover:bg-[#1a2056] hover:shadow-lg hover:shadow-[#0E1446]/20 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E1446]/40 focus-visible:ring-offset-2"
                aria-label="Explore Work Zones"
              >
                Explore Work Zones
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>

              <button
                onClick={handleGrowthClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0E1446] font-semibold rounded-full border border-gray-300 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E1446]/40 focus-visible:ring-offset-2"
                aria-label="View Growth Opportunities"
              >
                View Growth Opportunities
              </button>
            </div>

            {/* Stats Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-[#FB5535] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Interactive Map (Desktop/Tablet) */}
          <div className="hidden md:block">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg ring-1 ring-slate-200 h-[600px]">
              <DQMap />
            </div>
          </div>

          {/* Mobile - Browse Zones Button */}
          <div className="md:hidden">
            <button
              onClick={scrollToZones}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-50 to-blue-50 text-[#0E1446] font-semibold rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB5535]/40"
              aria-label="Browse DQ DNA dimensions"
            >
              Browse DQ DNA
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroDiscoverDQ;

