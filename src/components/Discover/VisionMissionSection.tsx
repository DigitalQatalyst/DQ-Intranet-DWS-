import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const VisionMissionSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section
      id="vision-mission"
      className="bg-neutral-50 py-16 md:py-24"
      aria-labelledby="vm-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="vm-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#0E1446] mb-3"
          >
            Vision &amp; Mission
          </h2>
          <p className="text-base md:text-lg text-neutral-600 max-w-[780px] mx-auto leading-relaxed">
            The foundation that drives every associate's purpose, growth, and contribution to the DQ ecosystem.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Vision Card */}
          <div className="flex flex-col h-full rounded-2xl bg-white shadow-[0_10px_30px_rgba(14,20,70,0.08)] border border-neutral-200 p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-bold text-[#0E1446] mb-4 md:mb-6">
              DQ Vision – Perfecting Life's Transactions
            </h3>
            
            <div className="flex-1 space-y-4 mb-6">
              <p className="text-base md:text-lg leading-relaxed text-neutral-700 clamp-2">
                At DQ, we empower associates to create value through digital innovation, human experience, and operational excellence. We convert bold ideas into dependable workflows that keep collaboration effortless. That clarity helps every workspace achieve meaningful, seamless progress.
              </p>
            </div>

            <div className="mt-auto">
              <a
                href="/strategy"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/strategy');
                }}
                className="inline-flex items-center gap-2 bg-[#FB5535] text-white font-semibold rounded-full px-5 py-3 transition-all duration-200 hover:brightness-95 hover:shadow-lg hover:shadow-[#FB5535]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB5535] focus-visible:ring-offset-2"
                aria-label="Explore Strategy Center to learn more about DQ Vision"
              >
                Explore Strategy Center
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Mission Card */}
          <div className="flex flex-col h-full rounded-2xl bg-white shadow-[0_10px_30px_rgba(14,20,70,0.08)] border border-neutral-200 p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-bold text-[#0E1446] mb-4 md:mb-6">
              DQ Mission – Building a Smarter, Connected Future
            </h3>
            
            <div className="flex-1 space-y-4 mb-6">
              <p className="text-base md:text-lg leading-relaxed text-neutral-700 clamp-2">
                We connect people, processes, and platforms to build smarter, more agile work environments. We orchestrate the digital workspace so that context travels with the work and teams stay in sync. That alignment enables associates to learn faster, collaborate better, and lead with purpose.
              </p>
            </div>

            <div className="mt-auto">
              <a
                href="/mission"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/mission');
                }}
                className="inline-flex items-center gap-2 bg-[#FB5535] text-white font-semibold rounded-full px-5 py-3 transition-all duration-200 hover:brightness-95 hover:shadow-lg hover:shadow-[#FB5535]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB5535] focus-visible:ring-offset-2"
                aria-label="View Mission Brief to understand DQ Mission"
              >
                View Mission Brief
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;

