import React from "react";
import { useNavigate } from "react-router-dom";

const DiscoverDQComingSoon: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center text-slate-800">
      <div className="max-w-xl rounded-3xl bg-white p-10 shadow-2xl ring-1 ring-slate-100">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Coming Soon</p>
        <h1 className="mt-3 text-3xl font-serif font-bold text-[#030F35]">Discover DQ is almost ready</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
          We&apos;re putting the final touches on this experience so it matches the DQ Digital Workspace standards. 
          Check back shortly or drop us a note if you need an early preview.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate('/')}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#030F35] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b1445]"
          >
            Go to Homepage
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

export default DiscoverDQComingSoon;
