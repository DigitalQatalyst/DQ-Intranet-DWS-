import React, { useState } from "react";

const LANES = {
  d1: "#4E72FF",
  d2: "#22C495",
  d3: "#8A63FF",
  d4: "#2EB6E9",
  d5: "#FFB84A",
};

type Tool = {
  id: string;
  title: string;
  sub: string;
  desc: string;
};

const TOOLS: Tool[] = [
  {
    id: "dtmp",
    title: "DTMP",
    sub: "Digital Transformation Management Platform",
    desc:
      "Supports the design, deployment, and governance of digital transformation initiatives across the DQ network — enabling structured workflows, performance tracking, and capability development.",
  },
  {
    id: "tmaas",
    title: "TMaaS",
    sub: "Transformation Management as a Service",
    desc:
      "A flexible, on-demand marketplace offering affordable digital transformation services, enhanced with AI-driven customization to meet organizational needs.",
  },
  {
    id: "dto4t",
    title: "DTO4T",
    sub: "Digital Twin of Organization for Transformation",
    desc:
      "A digital toolkit that equips training and transformation teams with templates, resources, and interactive modules for learning and change enablement.",
  },
  {
    id: "dtmb",
    title: "DTMB",
    sub: "Content & Creative for the DQ ecosystem",
    desc:
      "Focuses on the creation, design, and delivery of digital content and creative assets — from visuals and copy to multimedia used across DQ platforms.",
  },
  {
    id: "dtmi",
    title: "DTMI",
    sub: "AI-powered insights & perspectives",
    desc:
      "An AI-powered online magazine offering expert perspectives on Digital Cognitive Organizations, combining research-based articles and curated resources.",
  },
  {
    id: "dtma",
    title: "DTMA",
    sub: "Academy for data-driven dashboards & skills",
    desc:
      "Provides data-driven insights, dashboards, and learning paths focused on talent metrics and operational performance for strategic decision-making.",
  },
  {
    id: "dcocc",
    title: "DCO.CC",
    sub: "D6 Collab Centers (HI & AI)",
    desc:
      "Hybrid intelligence and AI collaboration hubs that connect human expertise with AI systems to accelerate innovation and transformation execution.",
  },
];

const Arrow = ({ className = "" }) => (
  <svg
    className={`inline-block ml-2 -mr-0.5 h-[14px] w-[14px] ${className}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M12.293 4.293a1 1 0 011.414 0l4 4.001a1 1 0 010 1.414l-4 4.001a1 1 0 11-1.414-1.415L14.586 10H4a1 1 0 110-2h10.586l-2.293-2.293a1 1 0 010-1.414z" />
  </svg>
);

function ToolModal({
  open,
  onClose,
  tool,
}: {
  open: boolean;
  onClose: () => void;
  tool: Tool | null;
}) {
  if (!open || !tool) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative z-[61] w-[min(720px,92vw)] rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 md:p-7">
        <div className="flex justify-between items-start">
          <div className="pr-6">
            <h4 className="text-2xl font-semibold text-slate-900">{tool.title}</h4>
            <p className="text-slate-600 mt-2 text-[15px]">{tool.sub}</p>
            <p className="text-slate-500 mt-3 text-[14px] leading-relaxed">
              {tool.desc}
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full grid place-items-center border border-slate-200 hover:bg-slate-50"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="#product-library"
            className="group inline-flex items-center justify-between rounded-xl bg-slate-900 text-white px-4 py-3 font-medium shadow-sm hover:shadow-md transition-all"
          >
            <span>Product Library</span>
            <Arrow className="group-hover:translate-x-0.5 transition-transform" />
          </a>

          <a
            href="#knowledge-base"
            className="group inline-flex items-center justify-between rounded-xl bg-white text-slate-900 px-4 py-3 font-medium border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <span>Knowledge Base</span>
            <Arrow className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function DQ6xArchitecture() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<Tool | null>(null);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-8">
        <div className="text-center mb-6">
          <h2 className="text-[28px] md:text-[32px] font-bold text-slate-900">
            DQ | 6x Digital Architecture
          </h2>
          <p className="text-slate-500">
            Explore the six digital layers powering DQ’s transformation framework.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* D1–D5 Left Stack */}
          <div className="rounded-xl border border-dashed border-slate-300/80 bg-white shadow-sm p-4 md:p-5">
            <div className="flex flex-col gap-3">
              {[
                { id: "d1", title: "D1 – Digital Economy", sub: "Why should organisations change?", icon: "🌍" },
                { id: "d2", title: "D2 – Digital Cognitive Organisation", sub: "Where are organisations headed?", icon: "🧠" },
                { id: "d3", title: "D3 – Digital Business Platform", sub: "What is your value orchestration engine?", icon: "🧩" },
                { id: "d4", title: "D4 – Digital Transformation", sub: "How do we design & deploy the target?", icon: "⚙️" },
                { id: "d5", title: "D5 – Digital Worker & Workspace", sub: "Who are orchestrators?", icon: "👷‍♂️" },
              ].map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg border border-slate-200 px-4 py-3 bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{c.icon}</span>
                    <div>
                      <p className="text-[14px] font-semibold text-slate-900">{c.title}</p>
                      <p className="text-[12.5px] text-slate-600 leading-snug">{c.sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D6 Right Tools Stack */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 shadow-sm p-5">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                D6 (Digital Accelerators — Tools)
              </h3>
              <ul className="mt-2 space-y-1 text-slate-600 text-[13.5px]">
                <li>• Fastest Timescales (DBP)</li>
                <li>• Best-practices aligned (DBP &amp; DCO)</li>
                <li>• Cost-effective implementations (DBP &amp; DCO)</li>
              </ul>
            </div>

            <div className="space-y-3">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTool(t);
                    setModalOpen(true);
                  }}
                  className={`group w-full text-left rounded-lg border px-4 py-3 bg-white transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                    t.id === "dcocc" ? "bg-emerald-50 border-emerald-200" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-semibold text-slate-900">{t.title}</p>
                    <Arrow className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[12.5px] text-slate-700 leading-snug">{t.sub}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ToolModal open={modalOpen} onClose={() => setModalOpen(false)} tool={activeTool} />
    </section>
  );
}