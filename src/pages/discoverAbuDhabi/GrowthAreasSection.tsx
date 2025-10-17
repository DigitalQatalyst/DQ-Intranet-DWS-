import React from "react";

type GrowthArea = {
  title: string;
  description: string;
  accent: string;
};

const sectionStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 24px 16px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "20px",
};

const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: "16px",
  border: "1px solid rgba(148, 163, 184, 0.4)",
  padding: "20px",
  boxShadow: "0 10px 18px rgba(2, 6, 23, 0.06)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const accentStyle = (color: string): React.CSSProperties => ({
  width: "64px",
  height: "6px",
  borderRadius: "12px",
  background: color,
});

const linkStyle: React.CSSProperties = {
  marginTop: "8px",
  fontWeight: 600,
  color: "#1d4ed8",
  textDecoration: "none",
  cursor: "pointer",
};

const growthAreas: GrowthArea[] = [
  {
    title: "Technology",
    description: "AI, fintech, and digital platform ventures scale with global capital access.",
    accent: "linear-gradient(90deg,#93C5FD,#2563EB)",
  },
  {
    title: "Energy",
    description: "Transitioning to clean energy while leveraging legacy expertise in oil and gas.",
    accent: "linear-gradient(90deg,#99F6E4,#14B8A6)",
  },
  {
    title: "Finance",
    description: "Progressive regulatory frameworks attract banks, PE funds, and fintech leaders.",
    accent: "linear-gradient(90deg,#C4B5FD,#7C3AED)",
  },
  {
    title: "Tourism",
    description: "Cultural landmarks paired with luxury hospitality drive global visitor growth.",
    accent: "linear-gradient(90deg,#FDE68A,#F59E0B)",
  },
  {
    title: "Retail",
    description: "Omnichannel retail experiences and destination shopping transform the region.",
    accent: "linear-gradient(90deg,#FBCFE8,#EC4899)",
  },
  {
    title: "Healthcare",
    description: "World-class facilities and medical research attract global healthcare brands.",
    accent: "linear-gradient(90deg,#BFDBFE,#1E40AF)",
  },
];

const GrowthAreasSection: React.FC = () => {
  return (
    <section>
      <div style={sectionStyle}>
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(2rem, 2.6vw, 2.4rem)",
              color: "#0b1220",
            }}
          >
            Growth Areas
          </h2>
          <p style={{ color: "#4b5563", maxWidth: "620px", margin: "12px auto 0" }}>
            Abu Dhabi offers exceptional opportunities across diverse sectors backed by strategic
            investment, world-class infrastructure, and a thriving innovation ecosystem.
          </p>
        </div>
        <div style={gridStyle}>
          {growthAreas.map((area) => (
            <article key={area.title} style={cardStyle}>
              <div style={accentStyle(area.accent)} />
              <h3 style={{ margin: "0 0 4px", color: "#111827" }}>{area.title}</h3>
              <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.5 }}>{area.description}</p>
              <span style={linkStyle}>Show More</span>
            </article>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "12px" }}>
          <button
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
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
