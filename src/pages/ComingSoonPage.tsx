import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ComingSoonPage: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const label = params.get("label") ?? "Experience";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center text-slate-800">
      <div className="max-w-xl rounded-3xl bg-white p-10 shadow-2xl ring-1 ring-slate-100">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Coming Soon</p>
        <h1 className="mt-3 text-3xl font-serif font-bold text-[#030F35]">{label} is almost ready</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
          We&apos;re putting the final touches on this brief so it matches the DQ Digital Workspace experience. Check back shortly or
          drop us a note if you need an early preview.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#030F35] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b1445]"
          >
            Go Back
          </button>
          <a
            href="mailto:hello@digitalqatalyst.com"
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
          >
            Contact Team
          </a>
        </div>
      </div>
    </main>
  );
};

export default ComingSoonPage;
