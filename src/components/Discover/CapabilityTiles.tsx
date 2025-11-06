import React from "react";
import {
  Users,
  Target,
  Workflow,
  AlertTriangle,
  ShieldCheck,
  Megaphone,
  Sparkles,
} from "lucide-react";

type CapTile = {
  key: string;
  icon: string;
  title: string;
  blurb: string;
  tags: string[];
  href: string;
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Target,
  Workflow,
  AlertTriangle,
  ShieldCheck,
  Megaphone,
  Sparkles,
};

const CAP_TILES: CapTile[] = [
  {
    key: "facilitation",
    icon: "Users",
    title: "Facilitation",
    blurb: "Guide rituals that end with clear next steps.",
    tags: ["Time-boxed", "Outcome-first", "Actions captured"],
    href: "#journey",
  },
  {
    key: "prioritization",
    icon: "Target",
    title: "Prioritization",
    blurb: "Keep focus on outcomes and cut noise early.",
    tags: ["OKRs visible", "Now/Next/Later", "Scope trade-offs"],
    href: "#journey",
  },
  {
    key: "flow",
    icon: "Workflow",
    title: "Flow & Visibility",
    blurb: "Make work transparent so blockers surface quickly.",
    tags: ["Board hygiene", "WIP limits", "Dashboards"],
    href: "#journey",
  },
  {
    key: "risk",
    icon: "AlertTriangle",
    title: "Risk & Escalation",
    blurb: "Escalate with context before blockers age.",
    tags: ["Risk owners", "Mitigations", "No surprises"],
    href: "#journey",
  },
  {
    key: "quality",
    icon: "ShieldCheck",
    title: "Quality & Standards",
    blurb: "Apply DoR/DoD and gates to protect excellence.",
    tags: ["Definitions", "Checks", "Fewer defects"],
    href: "#journey",
  },
  {
    key: "communication",
    icon: "Megaphone",
    title: "Communication",
    blurb: "Crisp updates and value-focused demos.",
    tags: ["One-page brief", "Stakeholder sync", "Async first"],
    href: "#journey",
  },
  {
    key: "coaching",
    icon: "Sparkles",
    title: "Coaching & Feedback",
    blurb: "Develop people faster with useful feedback.",
    tags: ["1:1s", "Pair & shadow", "Recognition"],
    href: "#journey",
  },
];

const CapabilityTiles: React.FC = () => {
  return (
    <section id="capabilities" className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2
            className="font-serif text-3xl font-bold tracking-[0.04em] text-[#030F35] sm:text-4xl"
            style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
          >
            Capability Playbook
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-base text-slate-600 sm:text-lg">
            Seven capabilities every DQ Lead demonstrates in practice.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAP_TILES.map((tile) => {
            const Icon = ICON_MAP[tile.icon] ?? Users;
            return (
              <div
                key={tile.key}
                tabIndex={0}
                className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB5535] focus-visible:ring-offset-2 md:p-6"
              >
                <div className="flex items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <h3 className="ml-3 text-base font-semibold text-slate-900 md:text-lg">
                    {tile.title}
                  </h3>
                </div>

                <p className="mt-2 text-sm text-slate-600">{tile.blurb}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={tile.href}
                  className="mt-4 inline-flex items-center text-sm font-medium text-[#0a1b4f] transition hover:text-[#FB5535]"
                >
                  See examples
                  <svg
                    className="ml-1 h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M7.5 5.5l5 4.5-5 4.5" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CapabilityTiles;
