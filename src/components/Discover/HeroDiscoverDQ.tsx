import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedText, FadeInUpOnScroll, StaggeredFadeIn } from '../AnimationUtils';

const stats = [
  { value: '5 000+', label: 'Active Users' },
  { value: '120+', label: 'Ongoing Projects' },
  { value: '90%', label: 'Collaboration Satisfaction' },
];

export const HeroDiscoverDQ: React.FC = () => {
  return (
    <section className="relative isolate grid h-[clamp(560px,70vh,740px)] min-h-[560px] place-items-center overflow-hidden bg-[#030F35] text-white">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1583759604327-f9dcd23499d5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340"
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
            <AnimatedText text="Discover DQ" gap="0.6rem" className="inline-block" />
          </h1>
          <FadeInUpOnScroll delay={0.1}>
            <p className="mx-auto mb-3 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg md:mb-4">
              A unified workspace where teams connect, co-work, and grow through purpose-driven collaboration.
            </p>
          </FadeInUpOnScroll>

          <StaggeredFadeIn
            staggerDelay={0.12}
            className="mx-auto mt-4 grid w-full max-w-[1100px] grid-cols-1 items-stretch gap-5 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="col-span-1 box-border flex h-[148px] w-full flex-col items-center justify-center rounded-[22px] border border-white/25 bg-white/10 px-8 text-center shadow-[0_20px_40px_rgba(2,6,23,0.25)] backdrop-blur transition hover:bg-white/15 sm:h-[160px]"
              >
                <div className="text-4xl font-bold leading-none md:text-5xl">
                  {stat.value}
                </div>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/90">
                  {stat.label}
                </p>
              </div>
            ))}
          </StaggeredFadeIn>

          <StaggeredFadeIn staggerDelay={0.15} className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/explore/work-zones"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B1C3A] shadow-[0_18px_45px_rgba(9,20,45,0.35)] transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030F35]"
            >
              Explore Work Zones →
            </Link>
            <a
              href="#growth-opportunities"
              className="inline-flex items-center justify-center rounded-full border border-white/55 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(9,20,45,0.3)] transition hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030F35]"
            >
              View Growth Opportunities
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

export default HeroDiscoverDQ;
