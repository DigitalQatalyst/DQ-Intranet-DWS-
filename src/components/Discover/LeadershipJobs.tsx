import React from "react";

const CARD_BASE =
  "rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:ring-1 hover:ring-slate-200 transition";

type JobItem = {
  id: string;
  title: string;
  team: string;
  location: string;
  tags: string[];
  href: string;
};

const JOBS: JobItem[] = [
  {
    id: "job-team-lead",
    title: "Team Lead",
    team: "DXB Studio",
    location: "Dubai, UAE",
    tags: ["Delivery", "Full-time", "Onsite"],
    href: "#apply",
  },
  {
    id: "job-project-lead",
    title: "Project Lead",
    team: "Stream A",
    location: "Hybrid • UAE & KSA",
    tags: ["Program", "Hybrid", "12-month"],
    href: "#apply",
  },
  {
    id: "job-culture-champion",
    title: "Culture Champion",
    team: "Community Guild",
    location: "Nairobi, Kenya",
    tags: ["Community", "Part-time", "Hybrid"],
    href: "#apply",
  },
  {
    id: "job-practice-coach",
    title: "Practice Coach",
    team: "Experience & Craft",
    location: "Remote • GMT+3",
    tags: ["Coaching", "Contract", "Remote"],
    href: "#apply",
  },
];

const LeadershipJobs: React.FC = () => {
  return (
    <section
      id="jobs"
      className="py-16 md:py-20"
      style={{ backgroundColor: "#F9FAFB" }}
      aria-labelledby="jobs-heading"
    >
      <div className="max-w-[1240px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2
            id="jobs-heading"
            className="font-serif text-[32px] md:text-[40px] font-bold tracking-[0.04em] text-[#030F35]"
            style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
          >
            Opportunities
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-sm md:text-base text-slate-600">
            Open roles and opportunities to step in as a Lead.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {JOBS.map((job) => (
            <article key={job.id} className={`${CARD_BASE} p-6 flex flex-col`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                    {job.team}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{job.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{job.location}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={job.href}
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#030F35] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a1b4f]"
              >
                Apply / Learn more
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipJobs;
