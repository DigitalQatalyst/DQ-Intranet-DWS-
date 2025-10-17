import React from "react";

const stats = [
  { value: "200+", label: "Global Companies" },
  { value: "$400B", label: "GDP" },
  { value: "#1", label: "Ease of Business" },
];

const HeroSection: React.FC = () => {
  return (
    <section style={{ padding: "72px 24px", background: "#f8fafc" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ color: "#1d4ed8", fontWeight: 600 }}>Abu Dhabi Business Gateway</span>
          <h1 style={{ margin: 0, fontSize: "clamp(2.6rem, 3vw, 3.4rem)", color: "#0b1220" }}>
            Discover Abu Dhabi
          </h1>
          <p style={{ margin: 0, maxWidth: 580, color: "#475569", lineHeight: 1.6 }}>
            A global business hub connecting East and West, offering unparalleled opportunities
            for innovation, investment, and long-term growth.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button
              style={{
                padding: "12px 20px",
                borderRadius: 12,
                border: "none",
                background: "#1d4ed8",
                color: "#ffffff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Browse Business Directory
            </button>
            <button
              style={{
                padding: "12px 20px",
                borderRadius: 12,
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  flex: "1 1 160px",
                  padding: "16px 18px",
                  borderRadius: 14,
                  background: "#ffffff",
                  boxShadow: "0 12px 25px rgba(15, 23, 42, 0.08)",
                }}
              >
                <strong style={{ display: "block", marginBottom: 6, fontSize: 22 }}>{stat.value}</strong>
                <span style={{ color: "#64748b" }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            minHeight: 320,
            borderRadius: 20,
            border: "1px solid rgba(37, 99, 235, 0.2)",
            background:
              "radial-gradient(circle at 20% 20%, rgba(96,165,250,0.35), transparent 60%), #ffffff",
            boxShadow: "0 35px 45px rgba(15, 23, 42, 0.15)",
          }}
          aria-label="Map preview of Abu Dhabi"
        />
      </div>
    </section>
  );
};

export default HeroSection;
