import React from "react";

const CARD_BASE =
  "rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:ring-1 hover:ring-slate-200 transition";

type Program = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  cta: { label: string; href: string };
};

const PROGRAMS: Program[] = [
  {
    id: "program-ldp",
    title: "Leads Development Program",
    description: "Cohort-based learning with coaching, peer forums, and live practice briefs.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    tags: ["Cohort", "Coaching", "Playbooks"],
    cta: { label: "Apply to Cohort", href: "#apply" },
  },
  {
    id: "program-proximity",
    title: "Lead Proximity Initiative",
    description: "Short shadowing stints with active Leads to learn rituals and decision flow.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    tags: ["Shadow", "Mentors", "Live Work"],
    cta: { label: "Start Shadowing", href: "#journey" },
  },
  {
    id: "program-bootcamp",
    title: "Leadership Bootcamp",
    description: "A focused sprint to master ceremonies, flow dashboards, and risk reviews.",
    image: "https://images.unsplash.com/photo-1515169067865-5387ec356754?auto=format&fit=crop&w=900&q=80",
    tags: ["Sprint", "Rituals", "Flow"],
    cta: { label: "Join the Bootcamp", href: "#apply" },
  },
];

const LeadershipPrograms: React.FC = () => {
  return (
    <section
      id="programs"
      className="py-16 md:py-20"
      style={{ backgroundColor: "#F9FAFB" }}
      aria-labelledby="programs-heading"
    >
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="programs-heading"
            className="font-serif text-[32px] md:text-[40px] font-bold tracking-[0.04em] text-[#030F35]"
            style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
          >
            Programs That Build Leaders
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-sm md:text-base text-slate-600">
            Explore the learning experiences designed to grow DQ Leads from shadowing to sprint mastery.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PROGRAMS.map((program) => (
            <article key={program.id} className={`${CARD_BASE} overflow-hidden`}>
              <div className="h-44 w-full overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{program.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{program.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {program.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={program.cta.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#030F35] transition hover:text-[#0a1b4f]"
                >
                  {program.cta.label}
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M7.5 5.5l5 4.5-5 4.5" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipPrograms;
