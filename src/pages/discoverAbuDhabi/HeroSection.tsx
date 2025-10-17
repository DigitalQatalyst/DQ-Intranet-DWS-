import React from "react";

const stats = [
  { value: "5 000+", label: "Active Users" },
  { value: "120+", label: "Ongoing Projects" },
  { value: "90%", label: "Collaboration Satisfaction" },
];

const HeroSection: React.FC = () => {
  return (
    <section className="dq-hero">
      <style>
        {`
          .dq-hero {
            --dq-orange: #E85A3E;
            --dq-maroon: #6B3E5C;
            --dq-navy: #162356;
            --dq-bg: #F7F8FB;
            --dq-text: #0B1220;
            padding: 72px 0;
            background: linear-gradient(150deg, rgba(232,90,62,0.22) 0%, rgba(22,35,86,0.28) 100%);
            position: relative;
            overflow: hidden;
          }
          .dq-hero::before {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, rgba(232,90,62,0.42) 0%, rgba(107,62,92,0.3) 45%, rgba(22,35,86,0.48) 100%);
            opacity: 0.8;
          }
          .dq-hero-content {
            position: relative;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            display: grid;
            gap: 40px;
            align-items: center;
            grid-template-columns: minmax(0, 1fr);
            color: var(--dq-text);
          }
          .dq-hero-title {
            font-size: clamp(2.7rem, 3.2vw, 3.6rem);
            line-height: 1.05;
            margin: 0 0 8px;
            color: #fff;
          }
          .dq-hero-subtitle {
            margin: 0;
            max-width: 560px;
            font-size: 1.12rem;
            color: rgba(255,255,255,0.9);
            line-height: 1.6;
          }
          .dq-hero-cta {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 18px;
          }
          .dq-btn {
            padding: 12px 22px;
            border-radius: 14px;
            border: 1px solid transparent;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          }
          .dq-btn:focus-visible {
            outline: 2px solid rgba(255,255,255,0.7);
            outline-offset: 2px;
          }
          .dq-btn-primary {
            background: linear-gradient(90deg, var(--dq-orange) 0%, var(--dq-maroon) 45%, var(--dq-navy) 100%);
            color: #fff;
            box-shadow: 0 12px 25px rgba(11,18,32,0.25);
          }
          .dq-btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 16px 32px rgba(11,18,32,0.28);
          }
          .dq-btn-ghost {
            background: rgba(255,255,255,0.08);
            color: #fff;
            border-color: rgba(255,255,255,0.4);
          }
          .dq-btn-ghost:hover {
            transform: translateY(-2px);
            background: rgba(255,255,255,0.16);
          }
          .dq-hero-stats {
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
            margin-top: 28px;
          }
          .dq-stat-chip {
            flex: 1 1 180px;
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.25);
            padding: 18px 20px;
            border-radius: 16px;
            color: #fff;
            backdrop-filter: blur(10px);
            box-shadow: 0 18px 32px rgba(11,18,32,0.22);
          }
          .dq-stat-chip strong {
            display: block;
            font-size: 1.4rem;
            margin-bottom: 6px;
          }
          .dq-hero-visual {
            position: relative;
            background: linear-gradient(150deg, rgba(255,255,255,0.22) 0%, rgba(22,35,86,0.55) 80%);
            border-radius: 22px;
            padding: 32px;
            min-height: 320px;
            border: 1px solid rgba(255,255,255,0.25);
            box-shadow: 0 45px 60px rgba(11,18,32,0.35);
            overflow: hidden;
          }
          .dq-hero-visual::after {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 20% 20%, rgba(232,90,62,0.45), transparent 55%);
            opacity: 0.75;
          }
          .dq-hero-grid {
            position: relative;
            z-index: 1;
            width: 100%;
            height: 100%;
            border-radius: 18px;
            border: 1px dashed rgba(255,255,255,0.35);
            display: grid;
            place-items: center;
            text-align: center;
            color: #fff;
            font-weight: 600;
          }
          .dq-hero-grid span {
            display: block;
            font-size: 1.1rem;
          }
          @media (min-width: 960px) {
            .dq-hero-content {
              grid-template-columns: 1.15fr 0.95fr;
            }
          }
        `}
      </style>
      <div className="dq-hero-content">
        <div>
          <h1 className="dq-hero-title">Discover DQ</h1>
          <p className="dq-hero-subtitle">
            A unified workspace where teams connect, co-work, and grow through purpose-driven collaboration.
          </p>
          <div className="dq-hero-cta">
            <button type="button" className="dq-btn dq-btn-primary">
              Explore Work Zones
            </button>
            <button type="button" className="dq-btn dq-btn-ghost">
              View Growth Opportunities
            </button>
          </div>
          <div className="dq-hero-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="dq-stat-chip">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="dq-hero-visual" aria-label="Workspace map preview">
          <div className="dq-hero-grid">
            <div>
              <span>Workspace Map</span>
              <small style={{ opacity: 0.8, fontWeight: 400 }}>Zones • Teams • Signals</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
