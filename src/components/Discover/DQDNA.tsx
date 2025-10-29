import { useEffect, useState } from "react";

/* ===== Visual tokens ===== */
const NAVY = "#131E42";
const LINE = NAVY;
const ORANGE = "#FB5535"; // accent for 4/5/6/7

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

/* Positions (keep structure) */
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
  href?: string; // for "View more details"
}

/* You can feed real details/hrefs here later */
const NODES: Node[] = [
  { id: 6, role: "leftTop",  title: "Agile Flows",  subtitle: "(Value Streams)", fill: "white",
    details: ["Define value stream architecture", "Map upstream/downstream dependencies", "Optimize flow efficiency"],
    href: "/discover/agile-flows"
  },
  { id: 5, role: "rightTop", title: "Agile SOS",   subtitle: "(Governance)",    fill: "white",
    details: ["Lightweight governance cadence", "Decision logs & audit trail", "Risk & policy controls"],
    href: "/discover/agile-sos"
  },
  { id: 7, role: "leftMid",  title: "Agile DTMF",  subtitle: "(Products)",      fill: "white",
    details: ["Product roadmap → value links", "Release trains & increments", "Customer feedback loop"],
    href: "/discover/agile-dtmf"
  },
  { id: 1, role: "center",   title: "The Vision",  subtitle: "(Purpose)",       fill: "navy",
    details: ["North-star narrative", "Measurable outcomes", "Strategic guardrails"],
    href: "/discover/vision"
  },
  { id: 4, role: "rightMid", title: "Agile TMS",   subtitle: "(Tasks)",         fill: "white",
    details: ["Task taxonomy & states", "SLA & WIP limits", "Automation hooks"],
    href: "/discover/agile-tms"
  },
  { id: 2, role: "leftBot",  title: "The HoV",     subtitle: "(Culture)",       fill: "navy",
    details: ["Behavioral norms", "Communication comfort", "Rituals & recognition"],
    href: "/discover/hov"
  },
  { id: 3, role: "rightBot", title: "The Personas",subtitle: "(Identity)",      fill: "navy",
    details: ["Primary personas", "Needs & pain points", "Value propositions"],
    href: "/discover/personas"
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

/* ===== Hex (flat-top) with custom stroke ===== */
function Hex({ fill, stroke = LINE }: { fill: "navy" | "white"; stroke?: string }) {
  const w = HEX_W, h = HEX_H;
  const d = `M${w/2} 4 L${w-4} ${h*0.25} L${w-4} ${h*0.75} L${w/2} ${h-4} L4 ${h*0.75} L4 ${h*0.25} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <path d={d} fill={fill === "navy" ? NAVY : "#fff"} stroke={stroke} strokeWidth={3} />
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

/* ---------- Fancy Modal Card ---------- */
function DNAOverlay({
  node,
  onClose,
}: {
  node: Node;
  onClose: () => void;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 10);
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);

  const textOnHeader = node.fill === "navy" ? "#fff" : "#fff";
  const headerBg =
    node.fill === "navy"
      ? `linear-gradient(135deg, ${NAVY} 0%, #0B1538 100%)`
      : `linear-gradient(135deg, #0E1A46 0%, ${NAVY} 100%)`;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10,16,35,0.45)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          zIndex: 60,
          opacity: entered ? 1 : 0,
          transition: "opacity 220ms ease",
        }}
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dna-title"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${entered ? 1 : 0.96})`,
          width: 520,
          maxWidth: "calc(100vw - 32px)",
          background: "#fff",
          borderRadius: 16,
          boxShadow:
            "0 30px 80px rgba(3,15,53,0.35), 0 8px 24px rgba(3,15,53,0.25)",
          overflow: "hidden",
          zIndex: 70,
          transition: "transform 220ms cubic-bezier(.2,.8,.2,1), opacity 220ms",
          opacity: entered ? 1 : 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: headerBg,
            color: textOnHeader,
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                background: "#ffffff22",
                border: "1px solid #ffffff33",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
              }}
            >
              {node.id}
            </div>
            <div>
              <div id="dna-title" style={{ fontWeight: 800, fontSize: 18 }}>
                {node.title}
              </div>
              <div style={{ opacity: 0.9, fontSize: 12 }}>{node.subtitle}</div>
            </div>
          </div>

          <button
            aria-label="Close"
            onClick={onClose}
            style={{
              background: "transparent",
              border: 0,
              color: "#fff",
              fontSize: 22,
              lineHeight: 1,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 18 }}>
          {/* Pills row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#EEF2FF",
                color: NAVY,
                border: `1px solid #E3E7F8`,
              }}
            >
              DNA • {node.title}
            </span>
            <span
              style={{
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#FFF7F1",
                color: "#8A3C1E",
                border: "1px solid #F8E1D3",
              }}
            >
              {node.subtitle.replace(/[()]/g, "")}
            </span>
          </div>

          {/* Details list */}
          <ul style={{ margin: "0 0 12px 18px", padding: 0, color: "#0F172A" }}>
            {(node.details ?? ["Add details here"]).map((d, i) => (
              <li key={i} style={{ marginBottom: 6, fontSize: 14 }}>
                {d}
              </li>
            ))}
          </ul>

          {/* CTA row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginTop: 6,
            }}
          >
            <a
              href={node.href ?? "#"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: NAVY,
                color: "#fff",
                borderRadius: 10,
                padding: "10px 14px",
                fontWeight: 700,
                textDecoration: "none",
                border: "1px solid #0E1A46",
                boxShadow: "0 6px 14px rgba(19,30,66,0.25)",
              }}
            >
              View more details →
            </a>

            <button
              onClick={onClose}
              style={{
                background: "#fff",
                color: NAVY,
                border: `1px solid #E3E7F8`,
                borderRadius: 10,
                padding: "10px 12px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Main Component ───────────────────────────────────────── */
function DQDNA() {
  const [open, setOpen] = useState<number | null>(null);

  const current = open ? NODES.find((x) => x.id === open) ?? null : null;

  return (
    <section style={{ background: "#fff", padding: "40px 0 64px" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h2 style={{ color: NAVY, fontWeight: 800, fontSize: 44, margin: "0 0 6px" }}>
            DQ DNA Growth Dimensions
          </h2>
          <p style={{ color: "#5b667a", margin: 0 }}>
            The framework that defines how DQ learns, grows, and delivers value across every dimension of transformation.
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
            {CALLOUTS.map((c, i) => {
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
          {NODES.map((n) => {
            const left = CANVAS_W / 2 + POS[n.role].x;
            const top  = CANVAS_H / 2 + POS[n.role].y;
            const textColor = n.fill === "navy" ? "#fff" : NAVY;

            const isOrangeBorder = n.id === 4 || n.id === 5 || n.id === 6 || n.id === 7;
            const isWhiteBadge   = n.id === 1 || n.id === 2 || n.id === 3;

            return (
              <button
                key={n.id}
                onClick={() => setOpen(n.id)}
                style={{
                  position: "absolute",
                  left, top,
                  transform: "translate(-50%, -50%)",
                  background: "transparent", border: 0, padding: 0, cursor: "pointer",
                  transition: "transform 160ms ease, filter 160ms ease",
                  filter: open && open !== n.id ? "grayscale(0.2) opacity(0.8)" : "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translate(-50%, -50%) scale(1.035)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translate(-50%, -50%)")}
              >
                <div style={{ position: "relative" }}>
                  <Hex fill={n.fill} stroke={isOrangeBorder ? ORANGE : LINE} />
                  <div style={{
                    position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
                    width: 28, height: 28, borderRadius: 9999,
                    background: isWhiteBadge ? "#fff" : NAVY,
                    color: isWhiteBadge ? NAVY : "#fff",
                    border: isWhiteBadge ? `2px solid ${NAVY}` : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 13
                  }}>{n.id}</div>
                  <div style={{
                    position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", textAlign: "center",
                    padding: "0 14px", color: textColor
                  }}>
                    <div style={{ fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}>{n.title}</div>
                    <div style={{ marginTop: 4, fontSize: 13, opacity: 0.85 }}>{n.subtitle}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Animated pop-up */}
        {current && <DNAOverlay node={current} onClose={() => setOpen(null)} />}
      </div>
    </section>
  );
}

/* Support both import styles */
export default DQDNA;
export { DQDNA };
