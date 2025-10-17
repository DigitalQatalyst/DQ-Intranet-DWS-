import React from "react";

const heroSectionStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "80px 24px 40px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "32px",
};

const heroContentStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const statRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "18px",
};

const statStyle: React.CSSProperties = {
  flex: "1 1 160px",
  padding: "16px 18px",
  borderRadius: "14px",
  background: "#ffffff",
  boxShadow: "0 10px 24px rgba(3, 15, 53, 0.08)",
};

const mapCardStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "300px",
  borderRadius: "18px",
  border: "1px solid rgba(29, 78, 216, 0.15)",
  background:
    "radial-gradient(circle at 20% 20%, rgba(96, 165, 250, 0.35), transparent 55%), #ffffff",
  boxShadow: "0 30px 45px rgba(17, 24, 39, 0.12)",
};

const stats = [
  { value: "200+", label: "Global Companies" },
  { value: "$400B", label: "GDP" },
  { value: "#1", label: "Ease of Business" },
];

const HeroSection: React.FC = () => {
  return (
    <section style={{ background: "linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%)" }}>
      <div style={heroSectionStyle}>
        <div style={heroContentStyle}>
          <span style={{ color: "#2563eb", fontWeight: 600 }}>Abu Dhabi Business Gateway</span>
          <h1
            style={{
              fontSize: "clamp(2.6rem, 3vw, 3.4rem)",
              margin: 0,
              color: "#0b1220",
              lineHeight: 1.1,
            }}
          >
            Discover Abu Dhabi
          </h1>
          <p style={{ color: "#4b5563", maxWidth: "560px", margin: 0, fontSize: "1.05rem" }}>
            A global business hub connecting East and West, offering unmatched access to capital,
            innovation, and thriving communities ready for the next wave of growth.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "none",
                background: "#1d4ed8",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Browse Business Directory
            </button>
            <button
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "1px solid #1d4ed8",
                background: "#ffffff",
                color: "#1d4ed8",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Discover Growth Opportunities
            </button>
          </div>
          <div style={statRowStyle}>
            {stats.map((stat) => (
              <div key={stat.label} style={statStyle}>
                <strong style={{ fontSize: "1.25rem", display: "block", color: "#0b1220" }}>
                  {stat.value}
                </strong>
                <span style={{ color: "#6b7280" }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={mapCardStyle} aria-label="Map preview of Abu Dhabi" />
      </div>
    </section>
  );
};

export default HeroSection;
