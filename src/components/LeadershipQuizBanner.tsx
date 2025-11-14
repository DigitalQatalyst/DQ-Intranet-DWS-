import React from "react";
import { Link } from "react-router-dom";
import { FadeInUpOnScroll } from "./AnimationUtils";

export const LeadershipQuizBanner: React.FC = () => {
  return (
    <section id="leadership-quiz" className="pt-0 pb-16 md:pb-20 lg:pb-24 bg-[#F9FAFB] scroll-mt-[72px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUpOnScroll>
          <div className="mt-8 rounded-3xl bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-40">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80"
                alt="Leadership conversation"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative px-6 py-10 md:px-10 lg:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wide mb-3">
                  New in DQ Workspace
                </p>
                <h3 className="text-2xl md:text-3xl font-semibold mb-3">
                  Discover Your Leadership Identity
                </h3>
                <p className="text-sm md:text-base text-slate-100/90 max-w-xl">
                  Take our 60-second quiz to uncover your leadership archetype and explore deeper insights through the Persona marketplace.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/marketplace/persona/quiz"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-orange-500 text-sm font-semibold hover:bg-orange-600 transition"
                >
                  Take the 60-Second Quiz
                </Link>
                <Link
                  to="/marketplace/persona"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/10 text-sm font-semibold hover:bg-white/20 transition"
                >
                  Explore Persona Marketplace
                </Link>
              </div>
            </div>
          </div>
        </FadeInUpOnScroll>
      </div>
    </section>
  );
};

export default LeadershipQuizBanner;

