import React from 'react';
import { TrendingUp, Clock, MapPin } from 'lucide-react';
import { AnimatedText, FadeInUpOnScroll, StaggeredFadeIn } from '../AnimationUtils';

const metrics = [
  { icon: TrendingUp, value: '120+', label: 'Initiatives with appointed Leads' },
  { icon: Clock, value: '20–30%', label: 'Typical time alongside role' },
  { icon: MapPin, value: 'DXB & NBO', label: 'Locations supported' },
];

export const HeroDiscoverLead: React.FC = () => {
  return (
    <section className="relative isolate grid h-[clamp(560px,70vh,740px)] min-h-[560px] place-items-center overflow-hidden bg-[#030F35] text-white">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1681949215173-fe0d15c790c1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340"
          alt="Dubai skyline"
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center top' }}
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,15,53,0.65)_0%,rgba(3,15,53,0.1)_100%)]"
          style={{ animation: 'pulse-gradient 8s ease-in-out infinite alternate' }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-col items-center px-6 text-center sm:px-10 lg:px-12">
        <div className="flex w-full flex-col items-center gap-3 text-center md:gap-4">
          <h1
            className="font-serif text-4xl font-bold tracking-[0.04em] text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
          >
            <AnimatedText text="Become a Lead at DQ" gap="0.6rem" className="inline-block" />
          </h1>
          <FadeInUpOnScroll delay={0.1}>
            <p className="mx-auto mb-3 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg md:mb-4">
              Guide squads, grow people, and accelerate value delivery across DQ.
            </p>
          </FadeInUpOnScroll>

          <StaggeredFadeIn staggerDelay={0.12} className="mx-auto mt-4 flex w-full max-w-[1100px] flex-wrap items-center justify-center gap-3 md:gap-4">
            {metrics.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                tabIndex={0}
                className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 md:px-5 md:py-2.5 backdrop-blur ring-1 ring-white/15 transition hover:ring-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030F35]"
              >
                <Icon aria-hidden="true" className="h-6 w-6 text-white/85" />
                <div className="flex flex-col items-start">
                  <span className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                    {value}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80 md:text-xs">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </StaggeredFadeIn>

          <StaggeredFadeIn staggerDelay={0.15} className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="#apply"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B1C3A] shadow-[0_18px_45px_rgba(9,20,45,0.35)] transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030F35]"
            >
              Apply to Become a Lead
            </a>
            <a
              href="#paths"
              className="inline-flex items-center justify-center rounded-full border border-white/55 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(9,20,45,0.3)] transition hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030F35]"
            >
              Explore Leadership Paths
            </a>
          </StaggeredFadeIn>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-gradient {
          0% {
            opacity: 0.45;
          }
          50% {
            opacity: 0.65;
          }
          100% {
            opacity: 0.45;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroDiscoverLead;
