import React from 'react';
import { ArrowRight } from 'lucide-react';

export const VisionMission: React.FC = () => {
  return (
    <section className="bg-gray-50 py-16 md:py-24" id="leadership-principles" aria-labelledby="vm-heading">
      <div className="dws-container max-w-[1200px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="vm-heading"
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.04em] text-[#030F35] mb-3"
            style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
          >
            Leadership Principles
          </h2>
          <p
            className="text-base md:text-lg max-w-[780px] mx-auto leading-relaxed clamp-2"
            style={{ color: 'var(--dws-text-dim)' }}
          >
            The mindset and habits we expect from every DQ Lead.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Vision Card */}
          <div className="dws-card bg-white flex flex-col h-full p-8 md:p-10" style={{ border: '1px solid var(--dws-line)' }}>
            <h3
              className="font-serif text-2xl md:text-3xl font-bold tracking-[0.03em] text-[#030F35] mb-4 md:mb-6"
              style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif', letterSpacing: '0.5px' }}
            >
              Lead with Clarity
            </h3>
            
            <div className="flex-1 mb-6">
              <ul className="space-y-3 text-base md:text-lg leading-relaxed" style={{ color: 'var(--dws-text)' }}>
                <li>Help teams see priorities, outcomes, and the next right move.</li>
                <li>Make work visible (boards, dashboards, brief updates).</li>
                <li>Align OKRs, scope, and cadence; cut noise fast.</li>
              </ul>
            </div>

            <div className="mt-auto">
              <a
                href="#capabilities"
                className="dws-btn-primary inline-flex items-center gap-2"
                aria-label="View role expectations"
              >
                View Role Expectations
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Mission Card */}
          <div className="dws-card bg-white flex flex-col h-full p-8 md:p-10" style={{ border: '1px solid var(--dws-line)' }}>
            <h3
              className="font-serif text-2xl md:text-3xl font-bold tracking-[0.03em] text-[#030F35] mb-4 md:mb-6"
              style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif', letterSpacing: '0.5px' }}
            >
              Grow People, Grow Value
            </h3>
            
            <div className="flex-1 mb-6">
              <ul className="space-y-3 text-base md:text-lg leading-relaxed" style={{ color: 'var(--dws-text)' }}>
                <li>Coach, unblock, and create conditions where work—and people—thrive.</li>
                <li>Guard standards (DoR/DoD, quality gates) and feedback culture.</li>
                <li>Communicate early; celebrate learning and progress.</li>
              </ul>
            </div>

            <div className="mt-auto">
              <a
                href="#support"
                className="dws-btn-primary inline-flex items-center gap-2"
                aria-label="See coaching playbook"
              >
                See Coaching Playbook
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
