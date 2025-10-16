import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import {
  ArrowRightIcon,
  LayersIcon,
  UsersIcon,
  LightbulbIcon,
  LifeBuoyIcon,
  MessageSquareIcon,
  LineChartIcon,
  PhoneIcon,
  MailIcon,
  GlobeIcon,
  XIcon,
} from "lucide-react";
import styles from "./DiscoverDQ.module.css";

const heroStats = [
  { value: "5 000+", label: "Active Users" },
  { value: "120+", label: "Ongoing Projects" },
  { value: "90%", label: "Collaboration Satisfaction" },
];

const workspaceNodes = [
  { title: "Learning Hub", caption: "Skills & certifications", icon: <LayersIcon size={18} /> },
  { title: "Project Center", caption: "Boards & sprints", icon: <UsersIcon size={18} /> },
  { title: "Innovation Lab", caption: "Prototype & pilots", icon: <LightbulbIcon size={18} /> },
  { title: "Service Desk", caption: "Requests & tickets", icon: <LifeBuoyIcon size={18} /> },
  { title: "Community Forum", caption: "Stories & shout-outs", icon: <MessageSquareIcon size={18} /> },
  { title: "Insights Gallery", caption: "Dashboards & KPIs", icon: <LineChartIcon size={18} /> },
];

const zoneCards = [
  {
    title: "Learning Hub",
    description: "Build skills and certifications aligned to DQ competences.",
    highlights: [
      "Role-based pathways and DTMA guides",
      "Live cohort sessions with coaches",
      "Certification checkpoints and reminders",
    ],
  },
  {
    title: "Project Center",
    description: "Plan and deliver projects using shared boards and sprints.",
    highlights: [
      "Unified kanban, roadmap, and sprint views",
      "Cross-team visibility on risks and milestones",
      "Automated signals for delivery health",
    ],
  },
  {
    title: "Innovation Lab",
    description: "Co-create and test digital ideas that transform how we work.",
    highlights: [
      "Rapid prototype kits and playbooks",
      "Innovation challenges with scoring",
      "Launch tracking from idea to impact",
    ],
  },
  {
    title: "Service Desk",
    description: "Get support, submit requests, and track resolutions seamlessly.",
    highlights: [
      "Unified intake across tools and services",
      "Real-time status and SLA tracking",
      "Embedded knowledge articles for self-help",
    ],
  },
  {
    title: "Community Forum",
    description: "Engage in debates, share stories, and celebrate wins.",
    highlights: [
      "Workspace-wide discussions and polls",
      "Spotlights and celebration hubs",
      "Communities of practice for every craft",
    ],
  },
  {
    title: "Insights Gallery",
    description: "Explore dashboards and performance analytics.",
    highlights: [
      "Executive dashboards and scorecards",
      "AI prompts for next-best actions",
      "Downloadable reports and data stories",
    ],
  },
];

const performanceData = [
  { name: "Learning Progress", value: 92, previousValue: 84 },
  { name: "Project Completion Rate", value: 88, previousValue: 81 },
  { name: "Collaboration Index", value: 85, previousValue: 79 },
  { name: "Support Requests Closed", value: 94, previousValue: 88 },
  { name: "Innovation Launches", value: 72, previousValue: 60 },
];

const directoryEntries = [
  {
    name: "Learning & Development Team",
    tag: "Learning & Development",
    description: "Empowering growth through curated learning journeys and certifications.",
    phone: "+1 (555) 010-2200",
    email: "learning@dqworkspace.com",
    website: "learning",
  },
  {
    name: "Project Management Office",
    tag: "Project Delivery",
    description: "Driving delivery excellence and agility across programmes and squads.",
    phone: "+1 (555) 010-2455",
    email: "pmo@dqworkspace.com",
    website: "projects",
  },
  {
    name: "Innovation Council",
    tag: "Innovation",
    description: "Turning ideas into scalable solutions with playbooks, pilots, and funding.",
    phone: "+1 (555) 010-2870",
    email: "innovation@dqworkspace.com",
    website: "innovation",
  },
  {
    name: "Support & Service Desk",
    tag: "Support & Services",
    description: "Always ready to assist you with workspace requests, access, and tooling.",
    phone: "+1 (555) 010-2000",
    email: "support@dqworkspace.com",
    website: "support",
  },
  {
    name: "Technology Squad",
    tag: "Technology",
    description: "Building and integrating the systems that power the DQ workspace daily.",
    phone: "+1 (555) 010-3050",
    email: "technology@dqworkspace.com",
    website: "technology",
  },
  {
    name: "Communications Hub",
    tag: "Community",
    description: "Connecting stories, announcements, and engagement across teams.",
    phone: "+1 (555) 010-2980",
    email: "communications@dqworkspace.com",
    website: "communications",
  },
];

type DirectoryEntry = (typeof directoryEntries)[number];

type ZoneCard = (typeof zoneCards)[number];

const DiscoverDQ: React.FC = () => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [showComparison, setShowComparison] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProfile, setActiveProfile] = useState<DirectoryEntry | null>(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportStatus, setSupportStatus] = useState<string | null>(null);
  const [isSubmittingSupport, setSubmittingSupport] = useState(false);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (!supportOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSupportOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [supportOpen]);

  useEffect(() => {
    if (!activeProfile) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveProfile(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [activeProfile]);

  const filteredDirectory = useMemo(() => {
    if (!searchQuery.trim()) return directoryEntries;
    const lower = searchQuery.toLowerCase();
    return directoryEntries.filter((entry) =>
      [entry.name, entry.tag, entry.description]
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );
  }, [searchQuery]);

  const toggleCard = (card: ZoneCard) => {
    setExpandedCards((prev) => ({ ...prev, [card.title]: !prev[card.title] }));
  };

  const handleSupportSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (isSubmittingSupport) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) {
      setSupportStatus("Please complete all fields.");
      return;
    }
    setSubmittingSupport(true);
    setSupportStatus(null);
    setTimeout(() => {
      setSubmittingSupport(false);
      setSupportStatus("Thanks! A DQ specialist will reply shortly.");
      event.currentTarget.reset();
    }, 900);
  };

  return (
    <div className={`${styles.dwsDiscover} ${prefersReducedMotion ? styles.reducedMotion : ""}`}>
      <section className={`${styles.hero} ${styles.dqGradient}`}>
        <div className={`${styles.container} ${styles.heroLayout}`}>
          <div>
            <div className={styles.breadcrumb}>
              <span>Explore</span>
              <span>›</span>
              <span>Discover DQ</span>
            </div>
            <h1 className={styles.heroTitle}>Discover DQ</h1>
            <p className={styles.heroSubtitle}>
              A unified workspace where teams connect, co-work, and grow through purpose-driven collaboration.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.btnPrimary}>
                Explore Work Zones
                <ArrowRightIcon size={18} style={{ marginLeft: "0.55rem" }} />
              </button>
              <button className={styles.btnGhost}>View Growth Opportunities</button>
            </div>
            <div className={styles.heroStats}>
              {heroStats.map((stat) => (
                <div key={stat.label} className={styles.statChip}>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.mapCanvas}>
              <div className={styles.mapGrid} />
              <div className={styles.mapNodes}>
                {workspaceNodes.map((node) => (
                  <div key={node.title} className={styles.mapNode}>
                    <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", fontWeight: 600 }}>
                      {node.icon}
                      {node.title}
                    </div>
                    <div style={{ marginTop: "0.35rem", opacity: 0.85 }}>{node.caption}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.container}`}>
        <h2 className={styles.sectionTitle}>Zones of Growth and Productivity</h2>
        <p className={styles.sectionSubtitle}>
          Each DQ Zone connects people, tools, and knowledge to drive performance and growth.
        </p>
        <div className={styles.cardGrid}>
          {zoneCards.map((card) => {
            const expanded = expandedCards[card.title];
            return (
              <article key={card.title} className={styles.card}>
                <div className={styles.cardTop} />
                <div className={styles.cardTitle}>{card.title}</div>
                <p className={styles.cardBody}>{card.description}</p>
                <ul className={styles.metricsList}>
                  {(expanded ? card.highlights : card.highlights.slice(0, 2)).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <button className={styles.showMore} onClick={() => toggleCard(card)}>
                  {expanded ? "Show less" : "Show more"}
                </button>
              </article>
            );
          })}
        </div>

        <div className={styles.chartPanel}>
          <div className={styles.chartHeader}>
            <div>
              <h3 className={styles.chartTitle}>Workspace Performance Insights</h3>
              <p className={styles.chartSubtitle}>
                Data-driven signals of how DQ teams learn, deliver, and collaborate.
              </p>
            </div>
            <label className={styles.toggleRow}>
              <input
                type="checkbox"
                checked={showComparison}
                onChange={() => setShowComparison((prev) => !prev)}
              />
              Show YoY comparison
            </label>
          </div>
          <div style={{ width: "100%", height: 360 }}>
            <ResponsiveContainer>
              <BarChart data={performanceData} margin={{ top: 20, right: 24, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="dwsBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--dws-orange)" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="var(--dws-navy)" stopOpacity={0.95} />
                  </linearGradient>
                  <linearGradient id="dwsPrevious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(22,35,86,0.35)" />
                    <stop offset="100%" stopColor="rgba(22,35,86,0.15)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(22,35,86,0.12)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--dws-navy)", fontWeight: 600 }}
                  axisLine={{ stroke: "var(--dws-border)" }}
                  tickLine={false}
                  interval={0}
                  angle={-12}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fill: "var(--dws-navy)", fontWeight: 600 }}
                  axisLine={{ stroke: "var(--dws-border)" }}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  cursor={{ fill: "rgba(22,35,86,0.08)" }}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const current = payload[0].payload as { value: number; previousValue: number };
                    return (
                      <div
                        style={{
                          background: "var(--dws-white)",
                          border: "1px solid var(--dws-border)",
                          padding: "0.85rem 1rem",
                          borderRadius: "0.75rem",
                          color: "var(--dws-text)",
                          minWidth: "180px",
                        }}
                      >
                        <div style={{ fontWeight: 700, marginBottom: "0.4rem" }}>{label}</div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>Current</span>
                          <span>{current.value}</span>
                        </div>
                        {showComparison && (
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Previous</span>
                            <span>{current.previousValue}</span>
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                {showComparison && <Bar dataKey="previousValue" fill="url(#dwsPrevious)" barSize={24} radius={[6, 6, 0, 0]} />}
                <Bar dataKey="value" fill="url(#dwsBar)" barSize={showComparison ? 28 : 46} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ textAlign: "center", marginTop: "2.4rem" }}>
            <button className={styles.btnPrimary}>
              Explore Work Zones
              <ArrowRightIcon size={18} style={{ marginLeft: "0.55rem" }} />
            </button>
          </div>
        </div>
      </section>

      <section className={`${styles.directorySection} ${styles.container}`}>
        <h2 className={styles.sectionTitle}>People &amp; Teams Directory</h2>
        <p className={styles.sectionSubtitle}>
          Connect with DQ associates and teams driving workspace impact.
        </p>
        <div className={styles.searchBar}>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search people, teams, or projects…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
        {filteredDirectory.length === 0 ? (
          <div className={styles.emptyState}>No teams found. Try a different search.</div>
        ) : (
          <div className={styles.directoryGrid}>
            {filteredDirectory.map((entry) => (
              <article key={entry.email} className={styles.card}>
                <div className={styles.cardTop} />
                <div className={styles.directoryHeader}>
                  <div className={styles.avatar}>
                    <UsersIcon size={20} color="var(--dws-orange)" />
                  </div>
                  <div>
                    <div className={styles.cardTitle} style={{ marginBottom: "0.35rem" }}>
                      {entry.name}
                    </div>
                    <span className={styles.tag}>{entry.tag}</span>
                  </div>
                </div>
                <p className={styles.directoryBody}>{entry.description}</p>
                <div className={styles.contactList}>
                  <div className={styles.contactRow}>
                    <PhoneIcon size={16} color="var(--dws-orange)" />
                    <a href={`tel:${entry.phone}`}>{entry.phone}</a>
                  </div>
                  <div className={styles.contactRow}>
                    <MailIcon size={16} color="var(--dws-orange)" />
                    <a href={`mailto:${entry.email}`}>{entry.email}</a>
                  </div>
                  <div className={styles.contactRow}>
                    <GlobeIcon size={16} color="var(--dws-orange)" />
                    <a href={`https://${entry.website}`} target="_blank" rel="noopener noreferrer">
                      {entry.website}
                    </a>
                  </div>
                </div>
                <button className={`${styles.btnPrimary}`} onClick={() => setActiveProfile(entry)}>
                  View Profile
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className={styles.supportBand}>
        <div className={styles.supportContent}>
          <h3 style={{ fontSize: "clamp(2rem, 2.6vw, 2.8rem)", fontWeight: 700 }}>Need Help?</h3>
          <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "1.1rem" }}>
            Get quick support or connect with our workspace team to keep every initiative moving.
          </p>
          <button className={styles.btnPrimary} onClick={() => setSupportOpen(true)}>
            Get Support
          </button>
        </div>
      </section>

      <footer className={styles.footerBand}>
        <div className={styles.footerContent}>
          <div style={{ fontWeight: 700, fontSize: "1.35rem" }}>
            Every DQ associate — One Workspace, One Vision.
          </div>
          <div className={styles.footerLinks}>
            {["Learning Hub", "Projects", "Community", "Insights"].map((item) => (
              <a key={item} href="#">
                {item}
              </a>
            ))}
          </div>
          <div style={{ opacity: 0.7 }}>© {new Date().getFullYear()} DQ Digital Workspace</div>
        </div>
      </footer>

      {activeProfile && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.25rem" }}>
                  {activeProfile.name}
                </div>
                <span className={styles.tag}>{activeProfile.tag}</span>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => setActiveProfile(null)}
                aria-label="Close profile"
              >
                <XIcon size={18} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>{activeProfile.description}</p>
              <div>
                <div><strong>Phone:</strong> {activeProfile.phone}</div>
                <div><strong>Email:</strong> {activeProfile.email}</div>
                <div><strong>Website:</strong> https://{activeProfile.website}</div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnPrimary} onClick={() => setActiveProfile(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {supportOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.25rem" }}>
                  DQ Support
                </div>
                <div style={{ color: "var(--dws-muted)" }}>
                  Our support desk responds within one business day.
                </div>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => setSupportOpen(false)}
                aria-label="Close support form"
              >
                <XIcon size={18} />
              </button>
            </div>
            <form className={styles.modalBody} onSubmit={handleSupportSubmit}>
              <label>
                <span style={{ color: "var(--dws-muted)" }}>Name</span>
                <input
                  name="name"
                  type="text"
                  required
                  style={{
                    width: "100%",
                    padding: "0.9rem 1rem",
                    borderRadius: "12px",
                    border: `1px solid var(--dws-border)`
                  }}
                />
              </label>
              <label>
                <span style={{ color: "var(--dws-muted)" }}>Work Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  style={{
                    width: "100%",
                    padding: "0.9rem 1rem",
                    borderRadius: "12px",
                    border: `1px solid var(--dws-border)`
                  }}
                />
              </label>
              <label>
                <span style={{ color: "var(--dws-muted)" }}>How can we help?</span>
                <textarea
                  name="message"
                  rows={4}
                  required
                  style={{
                    width: "100%",
                    padding: "0.9rem 1rem",
                    borderRadius: "12px",
                    border: `1px solid var(--dws-border)`
                  }}
                />
              </label>
              {supportStatus && <div style={{ color: "var(--dws-muted)" }}>{supportStatus}</div>}
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={() => setSupportOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={isSubmittingSupport}>
                  {isSubmittingSupport ? "Sending…" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { DiscoverDQ };
export default DiscoverDQ;
