import React from "react";
import {
  LayersIcon,
  UsersIcon,
  LightbulbIcon,
  LifeBuoyIcon,
  MessageSquareIcon,
  LineChartIcon,
} from "lucide-react";

const areas = [
  {
    title: "Learning Hub",
    description: "Skills, certifications, and guided pathways for every associate.",
    Icon: LayersIcon,
  },
  {
    title: "Project Center",
    description: "Shared boards, roadmaps, and sprints to keep delivery on track.",
    Icon: UsersIcon,
  },
  {
    title: "Innovation Lab",
    description: "Rapid experiments, pilots, and incubation for bold ideas.",
    Icon: LightbulbIcon,
  },
  {
    title: "Service Desk",
    description: "Unified intake, tracking, and knowledge articles for support.",
    Icon: LifeBuoyIcon,
  },
  {
    title: "Community Forum",
    description: "Stories, shout-outs, and discussions from across the workspace.",
    Icon: MessageSquareIcon,
  },
  {
    title: "Insights Gallery",
    description: "Dashboards, KPIs, and data stories to guide better decisions.",
    Icon: LineChartIcon,
  },
];

const GrowthAreasSection: React.FC = () => {
  return (
    <section className="dq-growth">
      <style>
        {`
          .dq-growth {
            --dq-orange: #E85A3E;
            --dq-maroon: #6B3E5C;
            --dq-navy: #162356;
            --dq-bg: #F7F8FB;
            --dq-text: #0B1220;
            padding: 64px 0;
            background: var(--dq-bg);
          }
          .dq-growth-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            display: flex;
            flex-direction: column;
            gap: 28px;
            text-align: center;
            color: var(--dq-text);
          }
          .dq-growth-title {
            margin: 0;
            font-size: clamp(2.2rem, 2.6vw, 2.6rem);
            color: var(--dq-text);
          }
          .dq-growth-subtitle {
            margin: 0 auto;
            max-width: 620px;
            color: rgba(11,18,32,0.68);
            line-height: 1.6;
          }
          .dq-growth-grid {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          }
          .dq-growth-card {
            position: relative;
            border-radius: 16px;
            padding: 22px 24px;
            background: #ffffff;
            border: 1px solid rgba(22,35,86,0.12);
            box-shadow: 0 12px 26px rgba(11,18,32,0.08);
            text-align: left;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            overflow: hidden;
          }
          .dq-growth-card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, var(--dq-orange) 0%, var(--dq-maroon) 50%, var(--dq-navy) 100%);
          }
          .dq-growth-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 18px 36px rgba(11,18,32,0.12);
          }
          .dq-growth-icon {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            display: grid;
            place-items: center;
            margin-bottom: 14px;
            background: rgba(232,90,62,0.12);
            color: var(--dq-orange);
          }
          .dq-growth-card h3 {
            margin: 0 0 6px;
            font-size: 1.05rem;
            color: var(--dq-text);
          }
          .dq-growth-card p {
            margin: 0;
            color: rgba(11,18,32,0.68);
            font-size: 0.95rem;
            line-height: 1.55;
          }
          .dq-growth-cta {
            align-self: center;
            margin-top: 8px;
          }
          .dq-growth-button {
            padding: 12px 24px;
            border-radius: 14px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            color: #fff;
            background: linear-gradient(90deg, var(--dq-orange) 0%, var(--dq-maroon) 45%, var(--dq-navy) 100%);
            box-shadow: 0 12px 24px rgba(11,18,32,0.18);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .dq-growth-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 18px 36px rgba(11,18,32,0.22);
          }
        `}
      </style>
      <div className="dq-growth-container">
        <header>
          <h2 className="dq-growth-title">Zones of Growth and Productivity</h2>
          <p className="dq-growth-subtitle">
            Each DQ Zone connects people, tools, and knowledge to drive performance and growth.
          </p>
        </header>
        <div className="dq-growth-grid">
          {areas.map(({ title, description, Icon }) => (
            <article key={title} className="dq-growth-card">
              <div className="dq-growth-icon">
                <Icon size={20} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <div className="dq-growth-cta">
          <button type="button" className="dq-growth-button">
            Explore Work Zones
          </button>
        </div>
      </div>
    </section>
  );
};

export default GrowthAreasSection;
