import React from "react";
import { Check } from "lucide-react";

type PathCard = {
  key: string;
  title: string;
  description: string;
  bullets: string[];
  cta: { label: string; href: string };
};

const PATHS: PathCard[] = [
  {
    key: "squad",
    title: "Squad Lead",
    description:
      "Drive rituals, unblock delivery, and keep outcomes moving each sprint.",
    bullets: [
      "Stand-ups, Planning, Reviews, Retros",
      "Flow visibility with boards & dashboards",
      "Early risk identification & escalation",
    ],
    cta: { label: "Apply for Squad Lead", href: "#apply?role=squad" },
  },
  {
    key: "practice",
    title: "Practice Lead",
    description:
      "Raise craft quality and standards across a discipline (e.g., Data, UX, Engineering).",
    bullets: [
      "Playbooks, DoR/DoD, quality gates",
      "Mentor growth & feedback culture",
      "Chapter sessions and code reviews",
    ],
    cta: { label: "Apply for Practice Lead", href: "#apply?role=practice" },
  },
  {
    key: "community",
    title: "Community Lead",
    description:
      "Connect chapters and knowledge across locations to accelerate learning.",
    bullets: [
      "Knowledge sharing & facilitation",
      "Cross-studio collaboration",
      "Events, demos, and spotlights",
    ],
    cta: { label: "Apply for Community Lead", href: "#apply?role=community" },
  },
  {
    key: "stream",
    title: "Project/Stream Lead",
    description:
      "Orchestrate outcomes across teams for a time-boxed initiative or program.",
    bullets: [
      "OKRs, scope & dependency mapping",
      "Stakeholder comms & reporting",
      "Release planning & readiness",
    ],
    cta: { label: "Apply for Stream Lead", href: "#apply?role=stream" },
  },
];

const LeadPathsGrid: React.FC = () => {
  return (
    <section id="paths" className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            className="font-serif text-3xl font-bold tracking-[0.04em] text-[#030F35] sm:text-4xl"
            style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
          >
            Leadership Paths
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-base text-slate-600 sm:text-lg">
            Choose the path that fits your strengths. All roles start with a short shadow sprint and onboarding.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch mt-10">
          {PATHS.map((path) => (
            <div
              key={path.key}
              className="flex flex-col rounded-2xl bg-white shadow-md ring-1 ring-black/5 p-6 hover:shadow-lg transition min-h-[390px]"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{path.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{path.description}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
                  {path.bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <svg
                        className="mt-0.5 h-4 w-4 text-[#FB5535]"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M8.293 13.293L4.5 9.5l1.414-1.414L8.293 10.96l5.793-5.793L15.5 6.586z" />
                      </svg>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={path.cta.href}
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#030F35] px-4 text-sm font-semibold text-white hover:bg-[#0a1b4f] transition whitespace-nowrap"
              >
                {path.cta.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadPathsGrid;
