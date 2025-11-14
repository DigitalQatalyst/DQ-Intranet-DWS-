import React from "react";
import { FadeInUpOnScroll } from "./AnimationUtils";

type LeaderPersonaStory = {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
};

const LEADER_PERSONA_STORIES: LeaderPersonaStory[] = [
  {
    id: "coach",
    name: "Coach",
    description: "You develop others through guidance, feedback, and support.",
    imageSrc: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "builder",
    name: "Builder",
    description: "You create systems, processes, and structures that enable growth.",
    imageSrc: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "visionary",
    name: "Visionary",
    description: "You inspire others with possibility and chart new directions.",
    imageSrc: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "driver",
    name: "Driver",
    description: "You execute with focus, accountability, and results.",
    imageSrc: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
  },
];

export const LeaderPersonasSection: React.FC = () => {
  return (
    <section id="leader-personas" className="py-16 md:py-20 lg:py-24 bg-[#F9FAFB] scroll-mt-[72px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-slate-900 mb-3">
            Who Are You as a Leader?
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
            Every leader brings a unique approach to inspiring others.
          </p>
        </div>

        {/* Personas Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {LEADER_PERSONA_STORIES.map((persona, index) => (
            <FadeInUpOnScroll key={persona.id} delay={index * 0.1}>
              <article className="rounded-2xl bg-white shadow-sm overflow-hidden border border-slate-100">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={persona.imageSrc}
                    alt={persona.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    {persona.name}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {persona.description}
                  </p>
                </div>
              </article>
            </FadeInUpOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeaderPersonasSection;

