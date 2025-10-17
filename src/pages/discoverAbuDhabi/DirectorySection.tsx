import React, { useMemo, useState } from "react";
import { UsersIcon, PhoneIcon, MailIcon, GlobeIcon } from "lucide-react";

type DirectoryEntry = {
  name: string;
  tag: string;
  summary: string;
  phone: string;
  email: string;
  website: string;
};

const DirectorySection: React.FC = () => {
  const [query, setQuery] = useState("");

  const entries: DirectoryEntry[] = useMemo(
    () => [
      {
        name: "Learning & Development Team",
        tag: "Learning & Development",
        summary: "Empowering growth through curated learning journeys and certifications.",
        phone: "+1 (555) 010-2200",
        email: "learning@dqworkspace.com",
        website: "learning",
      },
      {
        name: "Project Management Office",
        tag: "Project Delivery",
        summary: "Driving delivery excellence and agility across programmes and squads.",
        phone: "+1 (555) 010-2455",
        email: "pmo@dqworkspace.com",
        website: "projects",
      },
      {
        name: "Innovation Council",
        tag: "Innovation",
        summary: "Turning ideas into scalable solutions with playbooks, pilots, and funding.",
        phone: "+1 (555) 010-2870",
        email: "innovation@dqworkspace.com",
        website: "innovation",
      },
      {
        name: "Support & Service Desk",
        tag: "Support & Services",
        summary: "Always ready to assist you with workspace requests, access, and tooling.",
        phone: "+1 (555) 010-2000",
        email: "support@dqworkspace.com",
        website: "support",
      },
      {
        name: "Technology Squad",
        tag: "Technology",
        summary: "Building and integrating the systems that power the DQ workspace daily.",
        phone: "+1 (555) 010-3050",
        email: "technology@dqworkspace.com",
        website: "technology",
      },
      {
        name: "Communications Hub",
        tag: "Community",
        summary: "Connecting stories, announcements, and engagement across teams.",
        phone: "+1 (555) 010-2980",
        email: "communications@dqworkspace.com",
        website: "communications",
      },
    ],
    []
  );

  const filteredEntries = entries.filter((entry) =>
    [entry.name, entry.tag, entry.summary]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <section className="dq-directory">
      <style>
        {`
          .dq-directory {
            --dq-orange: #E85A3E;
            --dq-maroon: #6B3E5C;
            --dq-navy: #162356;
            --dq-bg: #F7F8FB;
            --dq-text: #0B1220;
            padding: 64px 0 72px;
            background: #ffffff;
            color: var(--dq-text);
          }
          .dq-directory-inner {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            display: flex;
            flex-direction: column;
            gap: 28px;
            text-align: center;
          }
          .dq-directory-title {
            margin: 0;
            font-size: clamp(2.1rem, 2.5vw, 2.5rem);
          }
          .dq-directory-subtitle {
            margin: 0 auto;
            max-width: 640px;
            color: rgba(11,18,32,0.7);
            line-height: 1.6;
          }
          .dq-directory-search {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
          }
          .dq-directory-input {
            flex: 1 1 320px;
            min-width: 280px;
            padding: 12px 16px;
            border-radius: 14px;
            border: 1px solid rgba(22,35,86,0.18);
            box-shadow: inset 0 1px 2px rgba(22,35,86,0.05);
            font-size: 1rem;
          }
          .dq-directory-search button {
            padding: 12px 22px;
            border-radius: 14px;
            border: none;
            font-weight: 600;
            cursor: pointer;
            color: #fff;
            background: linear-gradient(90deg, var(--dq-orange) 0%, var(--dq-maroon) 45%, var(--dq-navy) 100%);
            box-shadow: 0 12px 22px rgba(11,18,32,0.18);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .dq-directory-search button:hover {
            transform: translateY(-2px);
            box-shadow: 0 18px 30px rgba(11,18,32,0.22);
          }
          .dq-directory-grid {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            text-align: left;
          }
          .dq-directory-card {
            border-radius: 16px;
            padding: 22px 24px;
            border: 1px solid rgba(22,35,86,0.12);
            background: linear-gradient(145deg, rgba(247,248,251,0.9), #ffffff 65%);
            box-shadow: 0 14px 30px rgba(11,18,32,0.08);
            display: flex;
            flex-direction: column;
            gap: 14px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .dq-directory-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 34px rgba(11,18,32,0.12);
          }
          .dq-directory-card-header {
            display: flex;
            gap: 12px;
            align-items: center;
          }
          .dq-directory-avatar {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: rgba(232,90,62,0.12);
            color: var(--dq-orange);
            display: grid;
            place-items: center;
          }
          .dq-directory-tag {
            display: inline-block;
            margin-top: 4px;
            padding: 4px 10px;
            border-radius: 999px;
            background: rgba(22,35,86,0.08);
            color: rgba(22,35,86,0.75);
            font-size: 0.75rem;
            font-weight: 600;
          }
          .dq-directory-summary {
            margin: 0;
            color: rgba(11,18,32,0.68);
            line-height: 1.55;
            font-size: 0.95rem;
          }
          .dq-directory-meta {
            display: flex;
            flex-direction: column;
            gap: 10px;
            color: rgba(11,18,32,0.7);
            font-size: 0.9rem;
          }
          .dq-directory-meta-row {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .dq-directory-meta-row a {
            color: inherit;
            text-decoration: none;
          }
          .dq-directory-meta-row a:hover {
            text-decoration: underline;
          }
          .dq-directory-view {
            display: flex;
            justify-content: flex-end;
          }
          .dq-directory-view button {
            padding: 10px 18px;
            border-radius: 12px;
            border: 1px solid rgba(22,35,86,0.2);
            background: #ffffff;
            color: var(--dq-navy);
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
          }
          .dq-directory-view button:hover {
            background: rgba(232,90,62,0.08);
            border-color: rgba(232,90,62,0.5);
            color: var(--dq-orange);
          }
          .dq-directory-footer {
            margin-top: 12px;
          }
          .dq-directory-footer button {
            padding: 10px 20px;
            border-radius: 12px;
            border: 1px solid rgba(22,35,86,0.25);
            background: #ffffff;
            color: var(--dq-navy);
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
          }
          .dq-directory-footer button:hover {
            background: rgba(22,35,86,0.08);
            border-color: rgba(22,35,86,0.45);
            color: var(--dq-orange);
          }
        `}
      </style>
      <div className="dq-directory-inner">
        <header>
          <h2 className="dq-directory-title">People &amp; Teams Directory</h2>
          <p className="dq-directory-subtitle">
            Connect with DQ associates and teams driving workspace impact.
          </p>
        </header>
        <div className="dq-directory-search">
          <input
            className="dq-directory-input"
            placeholder="Search people, teams, or projects…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button">Search</button>
        </div>
        <div className="dq-directory-grid">
          {filteredEntries.map((entry) => (
            <article key={entry.email} className="dq-directory-card">
              <div className="dq-directory-card-header">
                <div className="dq-directory-avatar">
                  <UsersIcon size={20} />
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: "1.05rem" }}>{entry.name}</strong>
                  <span className="dq-directory-tag">{entry.tag}</span>
                </div>
              </div>
              <p className="dq-directory-summary">{entry.summary}</p>
              <div className="dq-directory-meta">
                <div className="dq-directory-meta-row">
                  <PhoneIcon size={16} color="var(--dq-orange)" />
                  <a href={`tel:${entry.phone}`}>{entry.phone}</a>
                </div>
                <div className="dq-directory-meta-row">
                  <MailIcon size={16} color="var(--dq-orange)" />
                  <a href={`mailto:${entry.email}`}>{entry.email}</a>
                </div>
                <div className="dq-directory-meta-row">
                  <GlobeIcon size={16} color="var(--dq-orange)" />
                  <a
                    href={`https://${entry.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {entry.website}
                  </a>
                </div>
              </div>
              <div className="dq-directory-view">
                <button type="button">View Profile</button>
              </div>
            </article>
          ))}
        </div>
        <div className="dq-directory-footer">
          <button type="button">View Full Directory</button>
        </div>
      </div>
    </section>
  );
};

export default DirectorySection;
