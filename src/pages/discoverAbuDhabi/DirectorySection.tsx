import React, { useMemo, useState } from "react";

const DirectorySection: React.FC = () => {
  const [query, setQuery] = useState("");

  const companies = useMemo(
    () => [
      {
        name: "Abu Dhabi Global Market",
        summary: "Capital markets powerhouse connecting investors with regulatory certainty.",
      },
      { name: "Masdar", summary: "Global renewable energy leader advancing net-zero solutions." },
      { name: "Hub71", summary: "Startup ecosystem offering incentives, mentorship, and venture access." },
      {
        name: "Cleveland Clinic Abu Dhabi",
        summary: "World-class healthcare complex delivering advanced treatment and research.",
      },
      { name: "Yas Mall", summary: "Destination retail hub blending luxury, lifestyle, and entertainment." },
      { name: "Emirates Palace", summary: "Iconic hospitality landmark hosting global events and cultural showcases." },
    ],
    []
  );

  const filtered = companies.filter((company) =>
    [company.name, company.summary].join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section style={{ padding: "72px 24px", background: "#ffffff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: "clamp(2rem, 2.4vw, 2.3rem)", color: "#0b1220" }}>
            Business Directory
          </h2>
          <p style={{ margin: "12px auto 0", maxWidth: 640, color: "#475569" }}>
            Connect with leading organizations shaping Abu Dhabi’s growth and discover partners to
            accelerate your market entry.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search businesses, services, or keywords…"
            style={{
              flex: "1 1 320px",
              minWidth: 280,
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid rgba(148, 163, 184, 0.6)",
            }}
          />
          <button
            type="button"
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
            Search
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gap: 20,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {filtered.map((company) => (
            <article
              key={company.name}
              style={{
                padding: 20,
                borderRadius: 16,
                border: "1px solid rgba(148, 163, 184, 0.4)",
                background: "#f8fafc",
                boxShadow: "0 10px 22px rgba(15, 23, 42, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 6px", color: "#111827" }}>{company.name}</h3>
                <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>{company.summary}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  style={{
                    padding: "10px 18px",
                    borderRadius: 12,
                    border: "1px solid rgba(29, 78, 216, 0.5)",
                    background: "#ffffff",
                    color: "#1d4ed8",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  View Profile
                </button>
              </div>
            </article>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            style={{
              padding: "10px 18px",
              borderRadius: 12,
              border: "1px solid rgba(29, 78, 216, 0.5)",
              background: "#ffffff",
              color: "#1d4ed8",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            View Full Directory
          </button>
        </div>
      </div>
    </section>
  );
};

export default DirectorySection;
