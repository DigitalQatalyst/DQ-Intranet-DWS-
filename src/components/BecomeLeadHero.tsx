import React from "react";
import { FadeInUpOnScroll, StaggeredFadeIn } from "./AnimationUtils";

type LeadHeroStat = {
  key: string;
  value: string;
  label: string;
};

const LEAD_HERO_STATS: LeadHeroStat[] = [
  { key: "initiatives", value: "120+", label: "Initiatives with appointed Leads" },
  { key: "leads", value: "50+", label: "Active Leads & mentors" },
  { key: "time", value: "20–30%", label: "Typical time alongside your role" },
  { key: "locations", value: "DXB & NBO", label: "Locations supported" },
];

export const BecomeLeadHero: React.FC = () => {
  return (
    <section className="relative overflow-hidden text-white min-h-screen flex items-center">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(26,46,110,0.9) 0%, rgba(251,85,53,0.8) 100%), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative flex flex-col items-start text-left px-6 lg:px-10 pt-28 pb-36 max-w-5xl mx-auto w-full">
        <div className="max-w-[480px] ml-8 lg:ml-16">
          <h1 className="font-display text-4xl md:text-5xl lg:text-[48px] font-bold leading-[1.2] tracking-tight text-white">
            Become a Lead
            <br />
            at DQ
          </h1>
          <FadeInUpOnScroll delay={0.2}>
            <p className="mt-6 text-base md:text-lg text-white max-w-3xl">
              Discover your leadership style, explore paths, and step into roles that move DQ forward.
            </p>
          </FadeInUpOnScroll>
          <FadeInUpOnScroll delay={0.3}>
            <div className="mt-10 flex flex-row gap-3 items-center">
              <a
                href="#apply"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("apply");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="px-6 py-3 rounded-full text-sm font-semibold text-white shadow-lg shadow-black/30 bg-[linear-gradient(135deg,_#FB5535_0%,_#1A2E6E_100%)] hover:scale-[1.02] transition-all"
              >
                Apply to Become a Lead
              </a>
              <a
                href="#paths"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("paths");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
                className="px-6 py-3 rounded-full text-sm font-semibold text-white bg-white/5 border border-white/70 backdrop-blur-sm hover:bg-white/10 hover:scale-[1.02] transition-all"
              >
                Explore Leadership Paths
              </a>
            </div>
          </FadeInUpOnScroll>
        </div>
        <StaggeredFadeIn
          staggerDelay={0.1}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
        >
          {LEAD_HERO_STATS.map((stat) => (
            <div
              key={stat.key}
              className="min-w-[220px] h-[110px] rounded-xl bg-white/10 backdrop-blur-xl ring-1 ring-white/15 p-4 shadow-lg flex flex-col items-center justify-center text-center"
            >
              <p className="text-2xl md:text-3xl font-display font-semibold text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-xs md:text-sm text-white/85 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </StaggeredFadeIn>
      </div>
      <div className="absolute bottom-0 left-0 right-0 opacity-35">
        <svg
          viewBox="0 0 1440 120"
          fill="currentColor"
          className="w-full h-full text-[#180D66]"
          aria-hidden="true"
        >
          <path d="M0,120 L0,90 L30,90 L30,80 L60,80 L60,70 L90,70 L90,80 L120,80 L120,60 L150,60 L150,50 L180,50 L180,70 L210,70 L210,80 L240,80 L240,60 L270,60 L270,40 L300,40 L300,50 L330,50 L330,40 L360,40 L360,20 L390,20 L390,40 L420,40 L420,30 L450,30 L450,20 L480,20 L480,10 L510,10 L510,0 L540,0 L540,10 L570,10 L570,20 L600,20 L600,30 L630,30 L630,40 L660,40 L660,30 L690,30 L690,20 L720,20 L720,10 L750,10 L750,20 L780,20 L780,10 L810,10 L810,30 L840,30 L840,50 L870,50 L870,60 L900,60 L900,70 L930,70 L930,80 L960,80 L960,70 L990,70 L990,50 L1020,50 L1020,40 L1050,40 L1050,50 L1080,50 L1080,60 L1110,60 L1110,40 L1140,40 L1140,30 L1170,30 L1170,40 L1200,40 L1200,50 L1230,50 L1230,60 L1260,60 L1260,50 L1290,50 L1290,40 L1320,40 L1320,30 L1350,30 L1350,20 L1380,20 L1380,10 L1410,10 L1410,20 L1440,20 L1440,120 Z" />
        </svg>
      </div>
    </section>
  );
};

export default BecomeLeadHero;

