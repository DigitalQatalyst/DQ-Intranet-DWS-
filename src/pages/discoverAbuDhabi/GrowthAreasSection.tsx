import React from "react";

const growthAreas = [
  {
    title: "Technology",
    description: "AI, fintech, and digital ventures accelerate with global capital access.",
    accent: "linear-gradient(90deg,#93C5FD,#2563EB)",
  },
  {
    title: "Energy",
    description: "Clean energy transformation builds on legacy strengths in oil and gas.",
    accent: "linear-gradient(90deg,#99F6E4,#14B8A6)",
  },
  {
    title: "Finance",
    description: "International financial centre with progressive regulatory frameworks.",
    accent: "linear-gradient(90deg,#C4B5FD,#7C3AED)",
  },
  {
    title: "Tourism",
    description: "Culture and hospitality combine to create world-leading visitor experiences.",
    accent: "linear-gradient(90deg,#FDE68A,#F59E0B)",
  },
  {
    title: "Retail",
    description: "Destination retail and digital commerce fuel sustained consumer growth.",
    accent: "linear-gradient(90deg,#FBCFE8,#EC4899)",
  },
  {
    title: "Healthcare",
    description: "World-class facilities drive medical tourism and life sciences innovation.",
    accent: "linear-gradient(90deg,#BFDBFE,#1E40AF)",
  },
];

const GrowthAreasSection: React.FC = () => {
  return (
    <section style={{ padding: "56px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: "clamp(2rem, 2.5vw, 2.4rem)", color: "#0b1220" }}>
            Growth Areas
          </h2>
          <p style={{ margin: "12px auto 0", maxWidth: 620, color: "#475569" }}>
            Abu Dhabi offers exceptional opportunities across strategic sectors, supported by bold investment
            and a future-ready innovation ecosystem.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {growthAreas.map((area) => (
            <article
              key={area.title}
              style={{
                padding: 20,
                borderRadius: 16,
                border: "1px solid rgba(148, 163, 184, 0.35)",
                background: "#ffffff",
                boxShadow: "0 14px 28px rgba(15, 23, 42, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ width: 60, height: 6, borderRadius: 12, background: area.accent }} />
              <h3 style={{ margin: "0 0 4px", color: "#111827" }}>{area.title}</h3>
              <p style={{ margin: 0, color: "#64748b", lineHeight: 1.5 }}>{area.description}</p>
              <span style={{ color: "#1d4ed8", fontWeight: 600, cursor: "pointer" }}>Show More</span>
            </article>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: "none",
              background: "#1d4ed8",
              color: "#ffffff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Explore Growth Areas Marketplace
          </button>
        </div>
      </div>
    </section>
  );
};

export default GrowthAreasSection;
