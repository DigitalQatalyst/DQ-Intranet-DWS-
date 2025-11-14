import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FadeInUpOnScroll } from "./AnimationUtils";

type LeadershipLevel = {
  code: string;
  title: string;
  description: string;
};

const LEADERSHIP_LEVELS: LeadershipLevel[] = [
  {
    code: "L0",
    title: "Aspiring Leader",
    description: "Beginning your journey. Building self-leadership and influence through small actions.",
  },
  {
    code: "L1",
    title: "Lead Yourself",
    description: "Practice accountability, discipline, and self-awareness.",
  },
  {
    code: "L2",
    title: "Lead Others",
    description: "Support peers, guide small initiatives, and share knowledge.",
  },
  {
    code: "L3",
    title: "Lead Teams",
    description: "Enable collaboration, set goals, and deliver results through others.",
  },
  {
    code: "L4",
    title: "Lead Functions",
    description: "Manage priorities, coordinate multiple teams, and align outcomes.",
  },
  {
    code: "L5",
    title: "Lead Systems",
    description: "Influence cross-functional processes, people, and system-wide decisions.",
  },
  {
    code: "L6",
    title: "Lead Business Areas",
    description: "Translate strategy into action and drive innovation across systems.",
  },
  {
    code: "L7",
    title: "Lead Enterprise",
    description: "Shape strategy, culture, and the long-term vision of the organization.",
  },
];

export const LeadershipInPracticeSection: React.FC = () => {
  return (
    <section id="leadership-in-practice" className="py-20 md:py-24 bg-white scroll-mt-[72px]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#0A1630] text-center">
            Leadership in Practice
          </h2>
          <p className="mt-3 max-w-2xl text-sm md:text-base text-[#0A1630]/70 text-center mx-auto leading-relaxed">
            Leadership growth at DQ follows the SFIA framework—from early self-leadership to enterprise-level influence.
            Each level reflects how your impact, accountability, and perspective expand over time.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="mt-12 md:mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 items-start">
            {/* Left: Timeline */}
            <div className="flex flex-col items-center lg:items-start relative">
              {/* Timeline line - only visible on desktop */}
              <div className="hidden lg:block absolute left-[13px] top-[14px] bottom-[14px] w-0.5 bg-[#E5E7EB]" />
              
              {/* Timeline nodes */}
              <div className="flex flex-col gap-10 md:gap-12 lg:gap-14">
                {LEADERSHIP_LEVELS.map((level, index) => (
                  <div key={level.code} className="flex items-center lg:items-start gap-4 lg:gap-6">
                    {/* Timeline circle */}
                    <div className="relative flex-shrink-0">
                      <div 
                        className="w-7 h-7 rounded-full border-2 border-[#0A1630] bg-white flex items-center justify-center shadow-sm z-10 relative"
                        style={{
                          background: index === 0 
                            ? 'linear-gradient(135deg, #0A1630 0%, #1A2E6E 100%)'
                            : index === LEADERSHIP_LEVELS.length - 1
                            ? 'linear-gradient(135deg, #FB5535 0%, #F97316 100%)'
                            : 'white'
                        }}
                      >
                        <div 
                          className={`w-3 h-3 rounded-full ${
                            index === 0 || index === LEADERSHIP_LEVELS.length - 1
                              ? 'bg-white'
                              : 'bg-[#0A1630]'
                          }`}
                        />
                      </div>
                    </div>
                    
                    {/* Level code - visible on mobile */}
                    <div className="lg:hidden">
                      <span className="text-xs font-semibold text-[#FB5535] tracking-wide">
                        {level.code}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Content */}
            <div className="flex flex-col gap-10 md:gap-12 lg:gap-14">
              {LEADERSHIP_LEVELS.map((level, index) => (
                <FadeInUpOnScroll key={level.code} delay={index * 0.1}>
                  <div className="max-w-[450px]">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-xs font-semibold text-[#FB5535] tracking-wide">
                        {level.code}
                      </span>
                      <h3 className="text-lg md:text-xl font-semibold text-[#0A1630] leading-tight">
                        {level.title}
                      </h3>
                    </div>
                    <p className="text-sm md:text-base text-[#0A1630]/70 leading-relaxed">
                      {level.description}
                    </p>
                  </div>
                </FadeInUpOnScroll>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 md:mt-20 flex justify-center">
          <Link
            to="/knowledge-center/leadership-framework"
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

export default LeadershipInPracticeSection;

