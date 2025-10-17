import React, { useMemo, useState } from "react";

type Company = {
  name: string;
  summary: string;
};

const sectionStyle: React.CSSProperties = {
  background: "#ffffff",
  padding: "72px 24px 96px",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
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
  border: "1px solid rgba(148, 163, 184, 0.4)",
  borderRadius: "16px",
  padding: "20px",
  background: "#f9fafb",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: "12px",
  boxShadow: "0 8px 18px rgba(2,6,23,0.05)",
};

const DirectorySection: React.FC = () => {
  const [query, setQuery] = useState("");

  const companies: Company[] = useMemo(
    () => [
      {
        name: "Abu Dhabi Global Market",
        summary: "International financial centre enabling capital connectivity and regulatory excellence.",
      },
      {
        name: "Masdar",
        summary: "Global clean energy champion delivering renewable solutions across continents.",
      },
      {
        name: "Hub71",
        summary: "Tech ecosystem supporting founders with mentorship, incentives, and venture networks.",
      },
      {
        name: "Cleveland Clinic Abu Dhabi",
        summary: "World-class medical complex providing advanced care and research partnerships.",
      },
      {
        name: "Yas Mall",
        summary: "Flagship destination merging retail, entertainment, and experiential activations.",
      },
      {
        name: "Emirates Palace",
        summary: "Iconic hospitality landmark offering luxury events, tourism, and cultural experiences.",
      },
    ],
    []
  );

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(2rem, 2.5vw, 2.4rem)",
              color: "#0b1220",
            }}
          >
            Business Directory
          </h2>
          <p style={{ color: "#4b5563", maxWidth: "620px", margin: "12px auto 0" }}>
            Connect with leading organizations shaping Abu Dhabi’s dynamic business landscape.
            Discover strategic partners, investors, and innovators to accelerate your growth.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
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
              minWidth: "280px",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid rgba(148, 163, 184, 0.6)",
              fontSize: "1rem",
            }}
          />
          <button
            style={{
              padding: "12px 20px",
              borderRadius: "12px",
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
        <div style={gridStyle}>
          {filteredCompanies.map((company) => (
            <article key={company.name} style={cardStyle}>
              <div>
                <h3 style={{ margin: "0 0 6px", color: "#111827" }}>{company.name}</h3>
                <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.5 }}>{company.summary}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  style={{
                    padding: "10px 16px",
                    borderRadius: "12px",
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
      </div>
    </section>
  );
};

export default DirectorySection;
