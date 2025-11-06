import React from "react";

const IMPACT_METRICS = [
  { key: "cycle", title: "Cycle Time ↓", value: "18% faster", desc: "Average story completion speed", trend: "Improved" },
  { key: "throughput", title: "Throughput ↑", value: "+22%", desc: "Stories completed per sprint", trend: "Improved" },
  { key: "predictability", title: "Predictability ↑", value: "+34%", desc: "Sprint goals achieved", trend: "Improved" },
  { key: "blockers", title: "Blocker Age ↓", value: "-27%", desc: "Average blocker duration", trend: "Improved" },
  { key: "clarity", title: "Team Clarity ↑", value: "+32%", desc: "Associates clear on priorities", trend: "Improved" },
  { key: "defects", title: "Defects Escaped ↓", value: "-16%", desc: "Post-release bugs", trend: "Improved" },
];

const trendStyles: Record<string, string> = {
  Improved: "bg-green-100 text-green-700",
  Stable: "bg-orange-100 text-orange-700",
  "Needs focus": "bg-red-100 text-red-700",
};

const LeadershipImpactDashboard: React.FC = () => {
  return (
    <section id="impact" className="bg-[#F8FAFC] py-16 md:py-24" aria-labelledby="impact-heading">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(14,20,70,0.08)] border border-neutral-200 p-8 md:p-10">
          <div className="text-center mb-8 md:mb-10">
            <h2
              id="impact-heading"
              className="font-serif text-3xl md:text-4xl font-bold tracking-[0.04em] text-[#030F35]"
              style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
            >
              Leadership Impact Dashboard
            </h2>
            <p className="text-neutral-600 mt-3 text-sm md:text-base max-w-2xl mx-auto">
              Data-driven signals of how new Leads accelerate delivery, collaboration, and clarity within their teams.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {IMPACT_METRICS.map((metric) => (
              <div
                key={metric.key}
                className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:shadow-md md:p-6 flex flex-col justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                  <p className="text-2xl font-semibold text-[#030F35] mt-1 md:text-3xl">{metric.value}</p>
                  <p className="text-xs text-slate-500 mt-2">{metric.desc}</p>
                </div>
                <span
                  className={`mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${trendStyles[metric.trend] || trendStyles.Improved}`}
                >
                  {metric.trend}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href="#support"
              className="inline-flex items-center rounded-lg bg-[#030F35] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0a1b4f]"
            >
              See the Metrics Playbook
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadershipImpactDashboard;
