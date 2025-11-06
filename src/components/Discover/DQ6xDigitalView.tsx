import React from "react";
import {
  CalendarCheck,
  ClipboardList,
  LayoutDashboard,
  Target,
  AlertTriangle,
  BookOpen,
  ChartLine,
  ArrowRight,
} from "lucide-react";

type Item = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const RHYTHMS: Item[] = [
  {
    id: "standup",
    title: "Daily Stand-up",
    description: "Quick pulse on priorities, blockers, and flow.",
    icon: CalendarCheck,
  },
  {
    id: "planning",
    title: "Sprint Planning",
    description: "Align on outcomes and scope for the iteration.",
    icon: ClipboardList,
  },
  {
    id: "review",
    title: "Review & Demo",
    description: "Showcase progress and gather feedback.",
    icon: LayoutDashboard,
  },
  {
    id: "retro",
    title: "Retrospective",
    description: "Reflect, improve, and reset the cadence.",
    icon: Target,
  },
  {
    id: "risk",
    title: "Risk Review",
    description: "Surface issues early and plan mitigations.",
    icon: AlertTriangle,
  },
  {
    id: "coaching",
    title: "1:1 Coaching Sessions",
    description: "Focus on growth and feedback.",
    icon: BookOpen,
  },
  {
    id: "showcase",
    title: "Showcase or Sync",
    description: "Share learnings across squads and practices.",
    icon: ChartLine,
  },
];

const TOOLKIT: Item[] = [
  {
    id: "boards",
    title: "Boards & Dashboards",
    description: "Track progress, WIP, and flow metrics.",
    icon: LayoutDashboard,
  },
  {
    id: "okrs",
    title: "OKRs",
    description: "Keep focus on measurable outcomes.",
    icon: Target,
  },
  {
    id: "story-maps",
    title: "Story Maps",
    description: "Visualize user journeys and work slices.",
    icon: ClipboardList,
  },
  {
    id: "risk-log",
    title: "Risk Log",
    description: "Maintain transparency and accountability.",
    icon: AlertTriangle,
  },
  {
    id: "definitions",
    title: "Definitions (DoR / DoD)",
    description: "Ensure shared quality standards.",
    icon: BookOpen,
  },
  {
    id: "playbooks",
    title: "Playbooks & Checklists",
    description: "Follow proven DQ practices.",
    icon: CalendarCheck,
  },
  {
    id: "insights",
    title: "Insights Reports",
    description: "Share data and impact summaries.",
    icon: ChartLine,
  },
];

const IconBadge: React.FC<{ icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = ({
  icon: Icon,
}) => (
  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
    <Icon className="h-4 w-4" aria-hidden="true" />
  </span>
);

export default function LeadToolkitSection() {
  return (
    <section className="bg-white" id="toolkit" aria-labelledby="toolkit-heading">
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-8">
        <div className="text-center mb-6">
          <h2
            id="toolkit-heading"
            className="font-serif text-[28px] md:text-[32px] font-bold text-[#030F35] tracking-[0.04em]"
            style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
          >
            Lead Toolkit &amp; Operating Rhythm
          </h2>
          <p className="text-slate-500">
            Explore the core rhythms and tools that enable every DQ Lead to guide delivery, collaboration, and growth.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Rhythm & Ceremonies */}
          <div className="rounded-xl border border-dashed border-slate-300/80 bg-white shadow-sm p-4 md:p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 mb-3">
              Rhythm &amp; Ceremonies
            </h3>
            <div className="flex flex-col gap-3">
              {RHYTHMS.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 px-4 py-3 bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <IconBadge icon={item.icon} />
                    <div>
                      <p className="text-[14px] font-semibold text-slate-900">{item.title}</p>
                      <p className="text-[12.5px] text-slate-600 leading-snug">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Toolkit & Artifacts */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 shadow-sm p-5">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Toolkit &amp; Artifacts</h3>
              <p className="text-slate-600 text-[13.5px]">
                Core assets Leads use to keep delivery transparent, outcomes aligned, and teams supported.
              </p>
            </div>

            <div className="space-y-3">
              {TOOLKIT.map((tool) => (
                <div
                  key={tool.id}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:-translate-y-[1px] hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <IconBadge icon={tool.icon} />
                    <div>
                      <p className="text-[14px] font-semibold text-slate-900">{tool.title}</p>
                      <p className="text-[12.5px] text-slate-700 leading-snug">{tool.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <a href="#support" className="dws-btn-primary inline-flex items-center gap-2">
            Open Lead Toolkit Repository
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
