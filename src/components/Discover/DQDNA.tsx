import React, { useEffect, useState } from "react";
import { fetchDna, DqDnaNode, DqDnaCallout } from "../../services/dq";

/* ===== Visual tokens ===== */
const NAVY = "#131E42";
const LINE = NAVY;
const ORANGE = "#FF6A3D";

/* Hex geometry */
const HEX_W = 180;
const HEX_H = Math.round(HEX_W * 0.866);

/* Connector tuning */
const EDGE_INSET = 8;
const H_LEN = 170;
const V_LEN = 160;
const PAD_SIDE = 12;
const PAD_BOTTOM = 26;

/* Fixed canvas */
const CANVAS_W = 1200;
const CANVAS_H = 640;

/* Honeycomb positions */
const POS = {
  leftTop:  { x: -95,  y: -140 },
  rightTop: { x:  95,  y: -140 },
  leftMid:  { x: -190, y:    0 },
  center:   { x:    0, y:    0 },
  rightMid: { x:  190, y:    0 },
  leftBot:  { x: -95,  y:  140 },
  rightBot: { x:  95,  y:  140 },
} as const;

type Role = keyof typeof POS;
type Side = "left" | "right" | "bottom";

/* slight per-row slope */
const DY: Record<Role, number> = {
  leftTop:  -8,
  rightTop: -8,
  leftMid:   0,
  center:    0,
  rightMid:  0,
  leftBot:   8,
  rightBot:  8,
};

interface Node {
  id: number;
  role: Role;
  title: string;
  subtitle: string;
  fill: "navy" | "white";
  details?: string[];
  kbUrl: string;     // Knowledge marketplace
  lmsUrl: string;    // LMS marketplace
}

/* ===== Data (added URLs) ===== */
const NODES: Node[] = [
  {
    id: 6, role: "leftTop",
    title: "Agile Flows", subtitle: "(Value Streams)", fill: "white",
    kbUrl: "/marketplace/knowledge?dna=agile-flows",
    lmsUrl: "/lms/courses?dna=agile-flows"
  },
  {
    id: 5, role: "rightTop",
    title: "Agile SOS", subtitle: "(Governance)", fill: "white",
    kbUrl: "/marketplace/knowledge?dna=agile-sos",
    lmsUrl: "/lms/courses?dna=agile-sos"
  },
  {
    id: 7, role: "leftMid",
    title: "Agile 6xD", subtitle: "(Products)", fill: "white",
    kbUrl: "/marketplace/knowledge?dna=agile-dtmf",
    lmsUrl: "/lms/courses?dna=agile-dtmf"
  },
  {
    id: 1, role: "center",
    title: "The Vision", subtitle: "(Purpose)", fill: "navy",
    kbUrl: "/marketplace/knowledge?dna=vision",
    lmsUrl: "/lms/courses?dna=vision"
  },
  {
    id: 4, role: "rightMid",
    title: "Agile TMS", subtitle: "(Tasks)", fill: "white",
    kbUrl: "/marketplace/knowledge?dna=agile-tms",
    lmsUrl: "/lms/courses?dna=agile-tms"
  },
  {
    id: 2, role: "leftBot",
    title: "The HoV", subtitle: "(Culture)", fill: "navy",
    kbUrl: "/marketplace/knowledge?dna=hov",
    lmsUrl: "/lms/courses?dna=hov"
  },
  {
    id: 3, role: "rightBot",
    title: "The Personas", subtitle: "(Identity)", fill: "navy",
    kbUrl: "/marketplace/knowledge?dna=personas",
    lmsUrl: "/lms/courses?dna=personas"
  },
];

const CALLOUTS: { role: Role; text: string; side: Side }[] = [
  { role: "leftTop",  text: "How we orchestrate", side: "left"  },
  { role: "rightTop", text: "How we govern",      side: "right" },
  { role: "leftMid",  text: "What we offer",      side: "left"  },
  { role: "rightMid", text: "How we work",        side: "right" },
  { role: "leftBot",  text: "How we behave",      side: "left"  },
  { role: "rightBot", text: "Who we are",         side: "right" },
  { role: "center",   text: "Why we exist",       side: "bottom"},
];

/* ===== Hex (flat-top) ===== */
function Hex({ fill, id }: { fill: "navy" | "white"; id?: number }) {
  const w = HEX_W, h = HEX_H;
  const d = `M${w/2} 4 L${w-4} ${h*0.25} L${w-4} ${h*0.75} L${w/2} ${h-4} L4 ${h*0.75} L4 ${h*0.25} Z`;
  const uniqueId = id ?? Math.random().toString(36).substr(2, 9);
  
  if (fill === "white") {
    // Textured fill: subtle blend of blue, orange, and white
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
        <defs>
          <pattern id={`texture-${uniqueId}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="2" fill={NAVY} opacity="0.03" />
            <circle cx="30" cy="20" r="1.5" fill={ORANGE} opacity="0.04" />
            <circle cx="20" cy="30" r="1.5" fill={NAVY} opacity="0.02" />
          </pattern>
          <linearGradient id={`whiteHexGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f8f9fb" />
            <stop offset="100%" stopColor="#f0f3f7" />
          </linearGradient>
        </defs>
        <path
          d={d}
          fill={`url(#whiteHexGradient-${uniqueId})`}
          stroke={NAVY}
          strokeWidth={3}
        />
        <path
          d={d}
          fill={`url(#texture-${uniqueId})`}
          stroke="none"
        />
      </svg>
    );
  }
  
  // Solid navy for center hexagons
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path
        d={d}
        fill={NAVY}
        stroke="none"
        strokeWidth={0}
      />
    </svg>
  );
}

/* Anchors for connectors */
function anchor(role: Role, side: Side) {
  const { x, y } = POS[role];
  if (side === "left")  return { x: x - HEX_W/2 + EDGE_INSET, y };
  if (side === "right") return { x: x + HEX_W/2 - EDGE_INSET, y };
  return { x, y: y + HEX_H/2 - 4 };
}

/* Small UI helpers */
const Btn: React.FC<React.PropsWithChildren<{ href: string; variant?: "primary"|"ghost" }>> = ({ href, variant="primary", children }) => (
  <a
    href={href}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 14px",
      borderRadius: 10,
      fontWeight: 700,
      fontSize: 14,
      textDecoration: "none",
      border: variant === "ghost" ? `2px solid ${NAVY}` : "none",
      color: variant === "ghost" ? NAVY : "#fff",
      background: variant === "ghost" ? "#fff" : NAVY,
      boxShadow: variant === "ghost" ? "none" : "0 6px 16px rgba(19,30,66,.25)",
      transition: "transform .15s ease, box-shadow .15s ease"
    }}
    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
  >
    {children}
    <span style={{ fontSize: 16, lineHeight: 1 }}>↗</span>
  </a>
);

function DQDNA() {
  const [open, setOpen] = useState<number | null>(null);
  const [nodesDb, setNodesDb] = useState<DqDnaNode[] | null>(null);
  const [calloutsDb, setCalloutsDb] = useState<DqDnaCallout[] | null>(null);

  useEffect(() => {
    fetchDna()
      .then(({ nodes, callouts }) => {
        setNodesDb(nodes);
        setCalloutsDb(callouts);
      })
      .catch(() => {
        // fallback to hardcoded
      });
  }, []);

  return (
    <section style={{ background: "#fff", padding: "48px 0 80px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
        {/* Header (kept minimalist to avoid pushing DNA down) */}
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <h2 style={{ color: NAVY, fontWeight: 800, fontSize: 44, margin: "0 0 8px" }}>
            Growth Dimensions
          </h2>
          <p style={{ color: "#5b667a", margin: 0 }}>
            Seven connected dimensions shaping how DQ learns, collaborates, and delivers value.
          </p>
        </div>

        {/* Canvas */}
        <div style={{ position: "relative", width: CANVAS_W, height: CANVAS_H, margin: "0 auto" }}>
          {/* Connectors */}
          <svg
            width={CANVAS_W}
            height={CANVAS_H}
            viewBox={[-CANVAS_W/2, -CANVAS_H/2, CANVAS_W, CANVAS_H].join(" ")}
            preserveAspectRatio="xMidYMid meet"
            style={{ position: "absolute", left: 0, top: 0 }}
          >
            {(calloutsDb ?? CALLOUTS).map((c, i) => {
              const s = anchor(c.role, c.side);
              const yAnchor = c.side === "bottom" ? s.y : s.y + DY[c.role];

              let x1 = s.x, y1 = yAnchor, x2 = s.x, y2 = yAnchor, tx = x2, ty = y2;
              let ta: "start" | "end" | "middle" = "middle";

              if (c.side === "left") {
                x2 = x1 - H_LEN; y2 = y1;
                tx = x2 - PAD_SIDE; ty = y2 - 10; ta = "end";
              } else if (c.side === "right") {
                x2 = x1 + H_LEN; y2 = y1;
                tx = x2 + PAD_SIDE; ty = y2 - 10; ta = "start";
              } else {
                x2 = x1; y2 = s.y + V_LEN;
                tx = x2; ty = y2 + PAD_BOTTOM; ta = "middle";
              }

              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE} strokeWidth={2} strokeLinecap="round" />
                  <circle cx={x2} cy={y2} r={5} fill={LINE} />
                  <text x={tx} y={ty} textAnchor={ta} fontSize={14} fontWeight={700} fill={NAVY}>
                    {c.text}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hexes */}
          {(nodesDb
            ? nodesDb.map((n) => ({
                id: n.id,
                role: n.role as Role,
                title: n.title,
                subtitle: n.subtitle,
                fill: n.fill as "navy" | "white",
                kbUrl: n.kb_url,
                lmsUrl: n.lms_url,
              }))
            : NODES
          ).map((n) => {
            const left = CANVAS_W / 2 + POS[n.role].x;
            const top  = CANVAS_H / 2 + POS[n.role].y;

            return (
              <button
                key={n.id}
                onClick={() => setOpen(n.id)}
                style={{
                  position: "absolute",
                  left, top,
                  transform: "translate(-50%, -50%)",
                  background: "transparent", border: 0, padding: 0, cursor: "pointer",
                  transition: "transform .15s ease, filter .15s ease"
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-50%, -50%) scale(1.03)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-50%, -50%)"; }}
              >
                <div style={{ position: "relative" }}>
                  <Hex fill={n.fill} id={n.id} />
                  {/* number chip - dark blue circle with white number at top */}
                  <div style={{
                    position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
                    width: 32, height: 32, borderRadius: "50%", background: NAVY, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 14
                  }}>{n.id}</div>

                  {/* labels - navy text on hex 4,5,6,7 (white hexes), white text on navy hexes */}
                  <div style={{
                    position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", textAlign: "center",
                    padding: "0 14px", color: n.fill === "white" ? NAVY : "#fff"
                  }}>
                    <div style={{ 
                      fontWeight: 800, 
                      fontSize: 18, 
                      lineHeight: 1.1, 
                      textShadow: n.fill === "white" ? "none" : "0 1px 2px rgba(0,0,0,0.1)" 
                    }}>{n.title}</div>
                    <div style={{ 
                      marginTop: 4, 
                      fontSize: 13, 
                      opacity: 0.9, 
                      textShadow: n.fill === "white" ? "none" : "0 1px 2px rgba(0,0,0,0.1)" 
                    }}>{n.subtitle}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Marketplace Modal */}
        {open && (() => {
          const list = nodesDb
            ? nodesDb.map((n) => ({ id: n.id, title: n.title, subtitle: n.subtitle, kbUrl: n.kb_url, lmsUrl: n.lms_url, details: n.details || null }))
            : NODES.map((n) => ({ id: n.id, title: n.title, subtitle: n.subtitle, kbUrl: n.kbUrl, lmsUrl: n.lmsUrl, details: n.details ?? null }));
          const node = list.find(x => x.id === open)!;
          return (
            <div onClick={() => setOpen(null)} style={{
              position: "fixed", inset: 0, zIndex: 70,
              background: "rgba(9,12,28,0.45)", backdropFilter: "blur(4px)"
            }}>
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute", left: "50%", top: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 520, maxWidth: "92vw",
                  borderRadius: 16,
                  padding: 20,
                  background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.86))",
                  border: "1px solid rgba(19,30,66,0.12)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.25)"
                }}
              >
                {/* header */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, background: NAVY, color: "#fff",
                    display: "grid", placeItems: "center", fontWeight: 800
                  }}>
                    {node.id}
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, color: NAVY, fontSize: 20, lineHeight: 1.1 }}>{node.title}</div>
                    <div style={{ color: "#4B5563", fontSize: 13 }}>{node.subtitle}</div>
                  </div>
                  <button
                    onClick={() => setOpen(null)}
                    aria-label="Close"
                    style={{
                      marginLeft: "auto", background: "transparent", border: 0, cursor: "pointer",
                      fontSize: 24, lineHeight: 1, color: "#1F2937"
                    }}
                  >×</button>
                </div>

                {/* body */}
                <div style={{ color: "#1f2937", fontSize: 14, lineHeight: 1.55, marginBottom: 14 }}>
                  <p style={{ margin: "6px 0 10px" }}>
                    Explore resources and hands-on learning tracks related to <strong>{node.title}</strong>.
                  </p>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {(node.details ?? [
                      "Key concepts, frameworks, and anchor papers.",
                      "Practical templates, checklists, and playbooks.",
                      "Curated LMS paths to skill up quickly."
                    ]).map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>

                {/* actions */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <Btn href={node.kbUrl}>Knowledge Hub</Btn>
                  <Btn href={node.lmsUrl} variant="ghost">LMS Courses</Btn>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}

/* Support both import styles */
export default DQDNA;
export { DQDNA };
