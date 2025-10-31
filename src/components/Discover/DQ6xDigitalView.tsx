import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ========================================
   DQ | 6x Digital Architecture
   - Portrait left board (fixed width, tall)
   - Vertical lanes as columns (icons on bottom baseline)
   - Connectors to D6 tiles on the right
   ======================================== */

type Lane = { id: string; title: string; sub: string; icon: string; color: string };
type Tile = { id: string; title: string; sub: string };

const LANES: Lane[] = [
  { id: "d1", title: "D1 – Digital Economy",               sub: "Why should organisations change?",             icon: "🌍", color: "#7c9aff" },
  { id: "d2", title: "D2 – Digital Cognitive Organisation", sub: "Where are organisations headed?",              icon: "🧠", color: "#80e0b7" },
  { id: "d3", title: "D3 – Digital Business Platform",      sub: "What is your value orchestration engine?",     icon: "🧩", color: "#b892ff" },
  { id: "d4", title: "D4 – Digital Transformation",         sub: "How do we design & deploy the target?",        icon: "⚙️", color: "#81d4fa" },
  { id: "d5", title: "D5 – Digital Worker & Workspace",     sub: "Who are orchestrators?",                       icon: "👩‍💻", color: "#ffd27f" },
];

const TILES: Tile[] = [
  { id: "dtmp",   title: "DTMP",   sub: "Digital Transformation Management Platform" },
  { id: "dtmaas", title: "TMaaS",  sub: "Transformation Management as a Service" },
  { id: "dtq4t",  title: "DTO4T",  sub: "Digital Twin of Organization for Transformation" },
  { id: "dtmb",   title: "DTMB",   sub: "Content & Creative for the DQ ecosystem" },
  { id: "dtmi",   title: "DTMI",   sub: "AI-powered insights & perspectives" },
  { id: "dtma",   title: "DTMA",   sub: "Academy for data-driven dashboards & skills" },
  { id: "dcocc",  title: "DCO.CC", sub: "D6 Collab Centers (HI & AI)" },
];

const MAP: Record<string, string> = {
  d1: "dtmp",
  d2: "dtmaas",
  d3: "dtq4t",
  d4: "dtmb",
  d5: "dcocc",
};
const REV = Object.fromEntries(Object.entries(MAP).map(([k, v]) => [v, k]));

const buildSmoothPath = (points: Array<[number, number]>, baseRadius = 34) => {
  if (points.length < 2) return '';

  let d = `M ${points[0][0]} ${points[0][1]}`;
  let prevPoint = points[0];

  for (let i = 1; i < points.length; i++) {
    const current = points[i];
    const next = points[i + 1];

    if (!next) {
      d += ` L ${current[0]} ${current[1]}`;
      prevPoint = current;
      continue;
    }

    const prevVector: [number, number] = [current[0] - prevPoint[0], current[1] - prevPoint[1]];
    const nextVector: [number, number] = [next[0] - current[0], next[1] - current[1]];

    const prevLength = Math.hypot(prevVector[0], prevVector[1]);
    const nextLength = Math.hypot(nextVector[0], nextVector[1]);

    if (prevLength === 0 || nextLength === 0) {
      prevPoint = current;
      continue;
    }

    const radius = Math.min(baseRadius, prevLength / 2, nextLength / 2);
    const prevUnit: [number, number] = [prevVector[0] / prevLength, prevVector[1] / prevLength];
    const nextUnit: [number, number] = [nextVector[0] / nextLength, nextVector[1] / nextLength];

    const cornerStart: [number, number] = [
      current[0] - prevUnit[0] * radius,
      current[1] - prevUnit[1] * radius,
    ];

    const cornerEnd: [number, number] = [
      current[0] + nextUnit[0] * radius,
      current[1] + nextUnit[1] * radius,
    ];

    d += ` L ${cornerStart[0]} ${cornerStart[1]} Q ${current[0]} ${current[1]} ${cornerEnd[0]} ${cornerEnd[1]}`;
    prevPoint = cornerEnd;
  }

  return d;
};

export default function DQ6xDigitalArchitecture() {
  const [hoverLane, setHoverLane] = useState<string | null>(null);
  const [hoverTile, setHoverTile] = useState<string | null>(null);
  const [selectedTile, setSelectedTile] = useState<{ id: string; title: string; sub: string } | null>(null);

  const wrapRef  = useRef<HTMLDivElement>(null);
  const leftRef  = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const laneRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tileRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [paths, setPaths] = useState<
    { key: string; d: string; from: string; to: string }[]
  >([]);

  useLayoutEffect(() => {
    const recompute = () => {
      const wrap  = wrapRef.current?.getBoundingClientRect();
      const left  = leftRef.current?.getBoundingClientRect();
      const right = rightRef.current?.getBoundingClientRect();
      if (!wrap || !left || !right) return;

      // Top “bus” line inside the left board (just under the header space)
      const BUS_Y   = left.top - wrap.top + 26;
      // Vertical spine at the left edge of the D6 board
      const SPINE_X = right.left - wrap.left;
      const STUB    = 18;

      const next: typeof paths = [];

      LANES.forEach((lane, i) => {
        const lb = laneRefs.current[lane.id]?.getBoundingClientRect();
        const tId = MAP[lane.id];
        const tb  = tileRefs.current[tId]?.getBoundingClientRect();
        if (!lb || !tb) return;

        // start point: around the upper area of the lane card to match the ref image
        const x1 = lb.right - wrap.left - 10;
        const y1 = lb.top   - wrap.top  + 42 + i * 2; // small offset gradation like ref

        // end point: mid-left of the D6 tile
        const x2 = tb.left  - wrap.left + 10;
        const y2 = tb.top   - wrap.top  + tb.height / 2;

        const points: Array<[number, number]> = [
          [x1, y1],
          [x1 + STUB, y1],
          [x1 + STUB, BUS_Y],
          [SPINE_X, BUS_Y],
          [SPINE_X, y2],
          [x2, y2],
        ];
        const d = buildSmoothPath(points, 36);
        next.push({ key: `${lane.id}->${tId}`, d, from: lane.id, to: tId });
      });

      setPaths(next);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    [wrapRef.current, leftRef.current, rightRef.current].forEach((n) => n && ro.observe(n));
    return () => ro.disconnect();
  }, []);

  const activeLane = hoverLane ?? (hoverTile ? REV[hoverTile] : null);
  const activeTile = hoverTile ?? (hoverLane ? MAP[hoverLane] : null);

  return (
    <section className="relative bg-white py-10 px-6 md:px-10">
      <div className="relative mx-auto max-w-[1280px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">DQ | 6x Digital Architecture</h1>
          <p className="text-slate-500 mt-2">
            Explore the six digital layers powering DQ’s transformation framework.
          </p>
        </div>

        <div
          ref={wrapRef}
          className="relative flex items-stretch justify-center gap-10 w-full"
          style={{ minHeight: 700 }} // ensure tall canvas so connectors have space
        >
          {/* LEFT: portrait board */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full rounded-2xl border border-dashed border-slate-300 bg-white/50 shadow-sm p-4">
              <div
                ref={leftRef}
                className="relative w-full h-full min-h-[660px] rounded-2xl bg-white/70 ring-1 ring-slate-200 shadow-[0_10px_40px_rgba(2,8,23,.06)] p-5 backdrop-blur-sm overflow-hidden"
              >
                {/* outer dashed frames like your reference */}
                <div className="absolute inset-3 rounded-2xl border-2 border-dashed border-rose-300/50 pointer-events-none" />
                <div className="absolute inset-8 rounded-2xl border-2 border-dashed border-rose-300/25 pointer-events-none" />

                {/* lanes as vertical columns, icons baseline bottom */}
                <div className="absolute inset-0 p-6">
                  <div className="grid grid-cols-5 h-full gap-4 items-end">
                    {LANES.map((lane, idx) => {
                      const hot = activeLane === lane.id;
                      return (
                        <motion.div
                          key={lane.id}
                          ref={(el) => (laneRefs.current[lane.id] = el)}
                          onMouseEnter={() => setHoverLane(lane.id)}
                          onMouseLeave={() => setHoverLane(null)}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04, type: "spring", stiffness: 220, damping: 22 }}
                          className={[
                            "relative flex flex-col justify-between rounded-xl",
                            "ring-1 ring-slate-200 bg-white shadow-sm",
                            "px-3 pt-6 pb-8 min-h-[520px]", // tall card look
                            hot ? "ring-2 ring-[#030F35]/40 shadow-lg" : "",
                          ].join(" ")}
                        >
                          {/* lane content (vertical label like your current design) */}
                          <div className="mx-auto select-none text-center" style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)" }}>
                            <div className="text-[12.5px] font-semibold text-slate-900 tracking-tight">
                              {lane.title}
                            </div>
                            <div className="text-[11px] text-slate-700/85 italic mt-1">
                              {lane.sub}
                            </div>
                          </div>

                          {/* bottom icon pill on shared baseline */}
                          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white ring-1 ring-slate-200 shadow">
                              <span className="text-[14px]">{lane.icon}</span>
                            </span>
                          </div>

                          {/* subtle top cap in lane color */}
                          <div
                            className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                            style={{ background: `linear-gradient(90deg, ${lane.color}, transparent)` }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: D6 accelerator board */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-full rounded-2xl border border-slate-200 bg-slate-50 shadow-sm p-4">
              <div
                ref={rightRef}
                className="relative w-full h-full min-h-[660px] rounded-2xl bg-slate-50 ring-1 ring-slate-200 shadow-[0_10px_40px_rgba(2,8,23,.06)] p-6"
              >
                <div className="mb-5">
                  <div className="text-[16px] font-extrabold text-slate-900 tracking-tight">
                    D6 (Digital Accelerators — Tools)
                  </div>
                  <div className="text-[13px] text-slate-700 mt-0.5">› When will you get there</div>
                  <div className="mt-3 text-[12.5px] leading-6 text-slate-700">
                    Accelerator products & services must provide quick & precise pathways to DBPs realisation.
                    <ul className="list-disc ml-5 mt-1">
                      <li>Fastest Timescales (DBP)</li>
                      <li>Best-practices aligned (DBP &amp; DCO)</li>
                      <li>Cost-effective implementations (DBP &amp; DCO)</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  {TILES.map((t, i) => {
                    const hot = activeTile === t.id;
                    const isGreen = t.id === "dcocc";
                    return (
                      <motion.button
                        type="button"
                        key={t.id}
                        ref={(el) => (tileRefs.current[t.id] = el)}
                        onMouseEnter={() => setHoverTile(t.id)}
                        onMouseLeave={() => setHoverTile(null)}
                        onClick={() => setSelectedTile(t)}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.05, type: "spring", stiffness: 260, damping: 22 }}
                        className={[
                          "w-full text-left rounded-md px-4 py-3 min-h-[66px] border shadow-sm transition focus:outline-none",
                          isGreen
                            ? "bg-green-100/75 border-green-400 hover:border-green-500"
                            : "bg-white border-slate-200 hover:border-slate-300",
                          hot ? "ring-2 ring-[#030F35]/25 shadow-md" : "",
                        ].join(" ")}
                      >
                        <div className="font-semibold text-slate-900">{t.title}</div>
                        <div className="text-[13px] text-slate-600">{t.sub}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* CONNECTOR LINES */}
          <svg
            className="pointer-events-none absolute inset-0"
            width="100%"
            height="100%"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs>
              <filter id="conn-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.3" floodColor="#e45a5a" floodOpacity="0.45" />
              </filter>
              <filter id="conn-glow-strong" x="-60%" y="-60%" width="220%" height="220%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.2" floodColor="#e45a5a" floodOpacity="0.55" />
              </filter>

              <linearGradient id="grad-d1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c9aff" />
                <stop offset="100%" stopColor="#4e72ff" />
              </linearGradient>
              <linearGradient id="grad-d2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#80e0b7" />
                <stop offset="100%" stopColor="#3acb8c" />
              </linearGradient>
              <linearGradient id="grad-d3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#b892ff" />
                <stop offset="100%" stopColor="#8a63ff" />
              </linearGradient>
              <linearGradient id="grad-d4" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#81d4fa" />
                <stop offset="100%" stopColor="#33b2f0" />
              </linearGradient>
              <linearGradient id="grad-d5" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd27f" />
                <stop offset="100%" stopColor="#ffb84a" />
              </linearGradient>
            </defs>

            {paths.map((p, idx) => {
              const gradId =
                p.from === "d1"
                  ? "grad-d1"
                  : p.from === "d2"
                  ? "grad-d2"
                  : p.from === "d3"
                  ? "grad-d3"
                  : p.from === "d4"
                  ? "grad-d4"
                  : "grad-d5";

              const isActive = p.from === (hoverLane ?? "") || p.to === (hoverTile ?? "");
              const strokeW = isActive ? 2.8 : 2.1;
              const dash = isActive ? "12 7" : "10 8";
              const id = `conn-${p.key}`;

              return (
                <g key={p.key} filter={isActive ? "url(#conn-glow-strong)" : undefined}>
                  <path
                    d={p.d}
                    fill="none"
                    stroke="rgba(226,86,86,.25)"
                    strokeWidth={strokeW + 1.2}
                    strokeLinecap="round"
                  />
                  <path
                    id={id}
                    d={p.d}
                    fill="none"
                    stroke={`url(#${gradId})`}
                    strokeWidth={strokeW}
                    strokeLinecap="round"
                    strokeDasharray={dash}
                    style={{
                      animation: `march ${isActive ? 2.2 : 3.2}s cubic-bezier(0.4,0,0.2,1) infinite`,
                      filter: isActive ? "drop-shadow(0 0 8px rgba(228,90,90,.35))" : "none",
                    }}
                  />
                  <circle r={isActive ? 3.2 : 2.6} fill={`url(#${gradId})`} opacity={0.95}>
                    <animateMotion
                      dur={`${4 + idx * 0.4}s`}
                      begin={`${0.15 * idx}s`}
                      repeatCount="indefinite"
                      rotate="auto"
                    >
                      <mpath xlinkHref={`#${id}`} />
                    </animateMotion>
                  </circle>
                </g>
              );
            })}
          </svg>
          <style>{`
            @keyframes march {
              to { stroke-dashoffset: -60; }
            }
          `}</style>
        </div>
      </div>

      <AnimatePresence>
        {selectedTile && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTile(null)}
            />
            <motion.div
              className="fixed inset-0 z-[61] grid place-items-center px-4"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              <div className="w-full max-w-lg rounded-2xl bg-white ring-1 ring-slate-200 shadow-xl">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{selectedTile.title}</h3>
                      <p className="mt-1 text-[14.5px] leading-6 text-slate-700">{selectedTile.sub}</p>
                    </div>
                    <button
                      onClick={() => setSelectedTile(null)}
                      className="shrink-0 h-9 w-9 rounded-lg border border-slate-200 hover:bg-slate-50"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {/* Product Library */}
                    <a
                      href={`/library/${selectedTile.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#030F35] px-4 py-2.5 text-white hover:opacity-90"
                    >
                      Product Library
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>

                    {/* Knowledge Base */}
                    <a
                      href={`/kb/${selectedTile.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-slate-800 hover:bg-slate-50"
                    >
                      Knowledge Base
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
