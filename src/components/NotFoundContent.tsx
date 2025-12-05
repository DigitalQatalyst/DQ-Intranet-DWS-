import React from "react";
import { Link } from "react-router-dom";

const NotFoundContent: React.FC = () => {
  return (
    <div className="relative max-w-[420px] w-full text-center">
      <div className="rounded-[36px] border border-white/40 bg-white/95 px-8 py-10 shadow-[0_40px_80px_rgba(15,23,42,0.45)] backdrop-blur-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-400">404</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-500">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
          >
            Go Home
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
          >
            Dashboard
          </Link>
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-10 right-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/60 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.35)]">
        <span className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-600">DQ</span>
      </div>
      <div className="absolute inset-y-0 -right-10 hidden w-5 items-center justify-center rounded-l-full bg-slate-900 shadow-[0_15px_30px_rgba(0,0,0,0.4)] md:flex">
        <span className="h-14 w-px bg-white/60" />
      </div>
    </div>
  );
};

export default NotFoundContent;
