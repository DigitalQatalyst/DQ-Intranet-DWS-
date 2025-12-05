import React from "react";
import { useNavigate } from "react-router-dom";
import { useCountdown } from "../hooks/useCountdown";

const countdownTarget = new Date("2025-12-31T00:00:00");

const GrowthSectorsComingSoon: React.FC = () => {
  const navigate = useNavigate();
  const countdown = useCountdown(countdownTarget);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-[#0F172A]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br from-[#E0E7FF] via-[#EEF2FF] to-white blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-[#FFE4D6] via-white to-white blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Coming Soon
        </div>

        <div className="mt-6 space-y-4">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-[#030F35] via-[#1452F0] to-[#FB5535] bg-clip-text text-transparent">
              Growth Sectors Space
            </span>
          </h1>
          <p className="text-base text-slate-600 sm:text-lg">
            We’re building something exciting. Stay tuned.
          </p>
        </div>

        <div className="mt-10 w-full max-w-3xl">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {([
              ["Days", countdown.days],
              ["Hours", countdown.hours],
              ["Minutes", countdown.minutes],
              ["Seconds", countdown.seconds],
            ] as const).map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-5 text-center shadow-sm backdrop-blur-sm"
              >
                <div className="text-3xl font-semibold text-[#030F35]">{value}</div>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3" aria-hidden="true">
            {[0, 1, 2, 3].map((dot) => (
              <span
                key={dot}
                className={`h-2.5 w-2.5 rounded-full ${
                  dot === 0 ? "bg-[#1452F0]" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-10">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-full bg-[#030F35] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0B1A52] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#99B2FF]"
          >
            ← Go back to Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default GrowthSectorsComingSoon;
