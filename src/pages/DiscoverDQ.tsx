import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  XIcon,
} from "lucide-react";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { HeroDiscoverDQ } from "../components/Discover/HeroDiscoverDQ";
import { VisionMission } from "../components/Discover/VisionMission";
import { DQDNA } from "../components/Discover/DQDNA";
import { WorkspaceInsights } from "../components/Discover/WorkspaceInsights";
import { DQDirectory } from "../components/Discover/DQDirectory";
import type { DirectoryItem, AssociateItem } from "../components/Discover/DirectorySection";
import styles from "./DiscoverDQ.module.css";

const insightsData = [
  { name: "The Vision", value: 92, previousValue: 84 },
  { name: "The HoV", value: 88, previousValue: 81 },
  { name: "The Personas", value: 85, previousValue: 79 },
  { name: "Agile TMS", value: 78, previousValue: 68 },
  { name: "Agile SOS", value: 90, previousValue: 83 },
  { name: "Agile Flows", value: 86, previousValue: 80 },
  { name: "Agile DTMF", value: 82, previousValue: 75 },
];

// DQ2.0 Official Organizational Units (WIP25.08)
const directoryEntries: DirectoryItem[] = [
  // ========================================
  // DCO OPERATIONS SECTOR
  // ========================================
  
  // Factory: HRA (Human Resources & Admin)
  {
    id: "dco-hra-h2o",
    name: "H2O",
    description: "Hiring to Onboarding — Full-cycle recruitment, talent acquisition, and onboarding processes for DQ associates.",
    sector: "DCO Operations",
    factory: "HRA",
    region: "Anyshore",
    phone: "+1 (555) 100-1001",
    email: "h2o@dq.workforce",
    website: "hra.dq.workspace",
    href: "/directory/units/h2o",
  },
  {
    id: "dco-hra-q2p",
    name: "Q2P",
    description: "Qualification to Performance — Skills assessment, training, and performance management across all DQ teams.",
    sector: "DCO Operations",
    factory: "HRA",
    region: "Offshore",
    phone: "+1 (555) 100-1002",
    email: "q2p@dq.workforce",
    website: "hra.dq.workspace",
    href: "/directory/units/q2p",
  },
  {
    id: "dco-hra-smart-dws",
    name: "Smart DWS",
    description: "Smart Digital Workplace Services — Workspace optimization, tools, and associate experience programs.",
    sector: "DCO Operations",
    factory: "HRA",
    region: "Nearshore",
    phone: "+1 (555) 100-1003",
    email: "smart-dws@dq.workforce",
    website: "hra.dq.workspace",
    href: "/directory/units/smart-dws",
  },
  {
    id: "dco-hra-coshare",
    name: "Co-share DWS",
    description: "Collaborative workspace sharing — Cross-team collaboration tools, shared resources, and knowledge systems.",
    sector: "DCO Operations",
    factory: "HRA",
    region: "Anyshore",
    phone: "+1 (555) 100-1004",
    email: "coshare@dq.workforce",
    website: "hra.dq.workspace",
    href: "/directory/units/coshare-dws",
  },

  // Factory: Finance
  {
    id: "dco-fin-receivables",
    name: "Receivables",
    description: "Revenue collection, invoicing, and accounts receivable management for DQ projects and services.",
    sector: "DCO Operations",
    factory: "Finance",
    region: "Offshore",
    phone: "+1 (555) 100-2001",
    email: "receivables@dq.finance",
    website: "finance.dq.workspace",
    href: "/directory/units/receivables",
  },
  {
    id: "dco-fin-payables",
    name: "Payables",
    description: "Vendor payments, expense management, and accounts payable processing across DQ operations.",
    sector: "DCO Operations",
    factory: "Finance",
    region: "Nearshore",
    phone: "+1 (555) 100-2002",
    email: "payables@dq.finance",
    website: "finance.dq.workspace",
    href: "/directory/units/payables",
  },
  {
    id: "dco-fin-investment",
    name: "Investment",
    description: "Strategic investments, capital allocation, and portfolio management for DQ growth initiatives.",
    sector: "DCO Operations",
    factory: "Finance",
    region: "Anyshore",
    phone: "+1 (555) 100-2003",
    email: "investment@dq.finance",
    website: "finance.dq.workspace",
    href: "/directory/units/investment",
  },
  {
    id: "dco-fin-budget-gprc",
    name: "Budget | GPRC",
    description: "Budget planning and Governance, Planning, Risk & Compliance — Financial controls and oversight.",
    sector: "DCO Operations",
    factory: "Finance",
    region: "Nearshore",
    phone: "+1 (555) 100-2004",
    email: "budget-gprc@dq.finance",
    website: "finance.dq.workspace",
    href: "/directory/units/budget-gprc",
  },

  // Factory: Deals
  {
    id: "dco-deals-marcom",
    name: "MarCom",
    description: "Marketing & Communications — Brand positioning, campaigns, and market outreach for DQ solutions.",
    sector: "DCO Operations",
    factory: "Deals",
    region: "Anyshore",
    phone: "+1 (555) 100-3001",
    email: "marcom@dq.deals",
    website: "deals.dq.workspace",
    href: "/directory/units/marcom",
  },
  {
    id: "dco-deals-bd",
    name: "BD",
    description: "Business Development — Client acquisition, proposals, and deal structuring for DQ engagements.",
    sector: "DCO Operations",
    factory: "Deals",
    region: "Offshore",
    phone: "+1 (555) 100-3002",
    email: "bd@dq.deals",
    website: "deals.dq.workspace",
    href: "/directory/units/bd",
  },
  {
    id: "dco-deals-partners",
    name: "Partners",
    description: "Strategic partnerships, alliances, and ecosystem collaboration across the DQ network.",
    sector: "DCO Operations",
    factory: "Deals",
    region: "Nearshore",
    phone: "+1 (555) 100-3003",
    email: "partners@dq.deals",
    website: "deals.dq.workspace",
    href: "/directory/units/partners",
  },

  // Factory: Stories
  {
    id: "dco-stories-blueprints",
    name: "Blueprints",
    description: "Solution blueprints, technical documentation, and architecture frameworks for DQ products.",
    sector: "DCO Operations",
    factory: "Stories",
    region: "Anyshore",
    phone: "+1 (555) 100-4001",
    email: "blueprints@dq.stories",
    website: "stories.dq.workspace",
    href: "/directory/units/blueprints",
  },
  {
    id: "dco-stories-collaterals",
    name: "Collaterals",
    description: "Marketing collaterals, case studies, and sales enablement materials for DQ offerings.",
    sector: "DCO Operations",
    factory: "Stories",
    region: "Offshore",
    phone: "+1 (555) 100-4002",
    email: "collaterals@dq.stories",
    website: "stories.dq.workspace",
    href: "/directory/units/collaterals",
  },
  {
    id: "dco-stories-intranet-lms",
    name: "Intranet | LMS",
    description: "Internal communication hub and Learning Management System for DQ knowledge and training.",
    sector: "DCO Operations",
    factory: "Stories",
    region: "Nearshore",
    phone: "+1 (555) 100-4003",
    email: "intranet-lms@dq.stories",
    website: "stories.dq.workspace",
    href: "/directory/units/intranet-lms",
  },

  // ========================================
  // DBP PLATFORM SECTOR
  // ========================================

  // Factory: Intelligence
  {
    id: "dbp-intel-pipe-api",
    name: "Pipe | API",
    description: "Data pipelines and API orchestration — Integration layer for DQ platform services.",
    sector: "DBP Platform",
    factory: "Intelligence",
    region: "Anyshore",
    phone: "+1 (555) 200-1001",
    email: "pipe-api@dq.platform",
    website: "intelligence.dq.workspace",
    href: "/directory/units/pipe-api",
  },
  {
    id: "dbp-intel-ai",
    name: "AI",
    description: "Artificial Intelligence and machine learning solutions — Powering intelligent automation for DQ.",
    sector: "DBP Platform",
    factory: "Intelligence",
    region: "Offshore",
    phone: "+1 (555) 200-1002",
    email: "ai@dq.platform",
    website: "intelligence.dq.workspace",
    href: "/directory/units/ai",
  },
  {
    id: "dbp-intel-analytics",
    name: "Analytics",
    description: "Data analytics, insights, and reporting — Business intelligence for DQ decision-making.",
    sector: "DBP Platform",
    factory: "Intelligence",
    region: "Nearshore",
    phone: "+1 (555) 200-1003",
    email: "analytics@dq.platform",
    website: "intelligence.dq.workspace",
    href: "/directory/units/analytics",
  },
  {
    id: "dbp-intel-dtmp-plant4",
    name: "DTMP | Plant4.0",
    description: "Digital Twin Management Platform and Plant 4.0 — Next-gen factory and operational modeling.",
    sector: "DBP Platform",
    factory: "Intelligence",
    region: "Anyshore",
    phone: "+1 (555) 200-1004",
    email: "dtmp-plant4@dq.platform",
    website: "intelligence.dq.workspace",
    href: "/directory/units/dtmp-plant4",
  },

  // Factory: Solution
  {
    id: "dbp-sol-dxp-vendure",
    name: "DXP | Vendure",
    description: "Digital Experience Platform and Vendure commerce — Headless CMS and e-commerce solutions.",
    sector: "DBP Platform",
    factory: "Solution",
    region: "Offshore",
    phone: "+1 (555) 200-2001",
    email: "dxp-vendure@dq.platform",
    website: "solution.dq.workspace",
    href: "/directory/units/dxp-vendure",
  },
  {
    id: "dbp-sol-us-stack",
    name: "US Stack",
    description: "Universal Stack — Full-stack development frameworks and component libraries for DQ products.",
    sector: "DBP Platform",
    factory: "Solution",
    region: "Nearshore",
    phone: "+1 (555) 200-2002",
    email: "us-stack@dq.platform",
    website: "solution.dq.workspace",
    href: "/directory/units/us-stack",
  },
  {
    id: "dbp-sol-ms-stack",
    name: "MS Stack",
    description: "Microsoft Stack — Azure, .NET, and Microsoft ecosystem solutions for enterprise clients.",
    sector: "DBP Platform",
    factory: "Solution",
    region: "Anyshore",
    phone: "+1 (555) 200-2003",
    email: "ms-stack@dq.platform",
    website: "solution.dq.workspace",
    href: "/directory/units/ms-stack",
  },
  {
    id: "dbp-sol-p4-stack",
    name: "P4.0 Stack",
    description: "Plant 4.0 Stack — IoT, edge computing, and industrial automation technology stacks.",
    sector: "DBP Platform",
    factory: "Solution",
    region: "Offshore",
    phone: "+1 (555) 200-2004",
    email: "p4-stack@dq.platform",
    website: "solution.dq.workspace",
    href: "/directory/units/p4-stack",
  },

  // Factory: DevOps
  {
    id: "dbp-devops-test-debug",
    name: "Test | Debug",
    description: "Quality assurance, automated testing, and debugging services for all DQ solutions.",
    sector: "DBP Platform",
    factory: "DevOps",
    region: "Nearshore",
    phone: "+1 (555) 200-3001",
    email: "test-debug@dq.platform",
    website: "devops.dq.workspace",
    href: "/directory/units/test-debug",
  },
  {
    id: "dbp-devops-cicd",
    name: "CI/CD",
    description: "Continuous Integration and Continuous Deployment — Automated pipelines for rapid delivery.",
    sector: "DBP Platform",
    factory: "DevOps",
    region: "Anyshore",
    phone: "+1 (555) 200-3002",
    email: "cicd@dq.platform",
    website: "devops.dq.workspace",
    href: "/directory/units/cicd",
  },
  {
    id: "dbp-devops-host-secure",
    name: "Host | Secure",
    description: "Cloud hosting, infrastructure security, and compliance management for DQ platforms.",
    sector: "DBP Platform",
    factory: "DevOps",
    region: "Offshore",
    phone: "+1 (555) 200-3003",
    email: "host-secure@dq.platform",
    website: "devops.dq.workspace",
    href: "/directory/units/host-secure",
  },
  {
    id: "dbp-devops-support",
    name: "Support",
    description: "Technical support, incident management, and L1/L2/L3 support for DQ clients and users.",
    sector: "DBP Platform",
    factory: "DevOps",
    region: "Nearshore",
    phone: "+1 (555) 200-3004",
    email: "support@dq.platform",
    website: "devops.dq.workspace",
    href: "/directory/units/support",
  },

  // Factory: Products
  {
    id: "dbp-prod-manage",
    name: "Manage",
    description: "Product management, roadmaps, and portfolio governance for all DQ product lines.",
    sector: "DBP Platform",
    factory: "Products",
    region: "Anyshore",
    phone: "+1 (555) 200-4001",
    email: "manage@dq.platform",
    website: "products.dq.workspace",
    href: "/directory/units/manage",
  },
  {
    id: "dbp-prod-ux",
    name: "UX",
    description: "User experience design, research, and interaction design for DQ digital products.",
    sector: "DBP Platform",
    factory: "Products",
    region: "Offshore",
    phone: "+1 (555) 200-4002",
    email: "ux@dq.platform",
    website: "products.dq.workspace",
    href: "/directory/units/ux",
  },
  {
    id: "dbp-prod-patterns",
    name: "Patterns",
    description: "Design systems, UI patterns, and reusable components for consistent DQ experiences.",
    sector: "DBP Platform",
    factory: "Products",
    region: "Nearshore",
    phone: "+1 (555) 200-4003",
    email: "patterns@dq.platform",
    website: "products.dq.workspace",
    href: "/directory/units/patterns",
  },

  // ========================================
  // DBP DELIVERY SECTOR
  // ========================================

  // DQ Delivery: Deploys
  {
    id: "dbp-del-deploys-sm",
    name: "Deploys — Scrum Master",
    description: "Scrum Masters facilitating deployment cycles, sprint planning, and delivery coordination.",
    sector: "DBP Delivery",
    factory: "Deploys",
    region: "Anyshore",
    phone: "+1 (555) 300-1001",
    email: "deploys-sm@dq.delivery",
    website: "delivery.dq.workspace",
    href: "/directory/units/deploys-sm",
  },
  {
    id: "dbp-del-deploys-us",
    name: "Deploys — User Stories",
    description: "User story definition, backlog refinement, and story-level delivery management.",
    sector: "DBP Delivery",
    factory: "Deploys",
    region: "Offshore",
    phone: "+1 (555) 300-1002",
    email: "deploys-us@dq.delivery",
    website: "delivery.dq.workspace",
    href: "/directory/units/deploys-us",
  },

  // DQ Delivery: Designs
  {
    id: "dbp-del-designs-sm",
    name: "Designs — Scrum Master",
    description: "Scrum Masters for design sprints, creative workflows, and UX/UI delivery cycles.",
    sector: "DBP Delivery",
    factory: "Designs",
    region: "Nearshore",
    phone: "+1 (555) 300-2001",
    email: "designs-sm@dq.delivery",
    website: "delivery.dq.workspace",
    href: "/directory/units/designs-sm",
  },
  {
    id: "dbp-del-designs-us-features",
    name: "Designs — User Stories & Features",
    description: "Design-driven user stories and feature specifications for DQ product experiences.",
    sector: "DBP Delivery",
    factory: "Designs",
    region: "Anyshore",
    phone: "+1 (555) 300-2002",
    email: "designs-us@dq.delivery",
    website: "delivery.dq.workspace",
    href: "/directory/units/designs-us-features",
  },

  // DQ Delivery: Accounts
  {
    id: "dbp-del-accounts-sm",
    name: "Accounts — Scrum Master",
    description: "Scrum Masters managing client accounts, stakeholder engagement, and account delivery.",
    sector: "DBP Delivery",
    factory: "Accounts",
    region: "Offshore",
    phone: "+1 (555) 300-3001",
    email: "accounts-sm@dq.delivery",
    website: "delivery.dq.workspace",
    href: "/directory/units/accounts-sm",
  },
  {
    id: "dbp-del-accounts-engagements",
    name: "Accounts — Engagements",
    description: "Client engagement management, relationship building, and account growth strategies.",
    sector: "DBP Delivery",
    factory: "Accounts",
    region: "Nearshore",
    phone: "+1 (555) 300-3002",
    email: "accounts-eng@dq.delivery",
    website: "delivery.dq.workspace",
    href: "/directory/units/accounts-engagements",
  },
  {
    id: "dbp-del-accounts-stakeholders",
    name: "Accounts — Stakeholders",
    description: "Stakeholder communication, expectation management, and executive relationship coordination.",
    sector: "DBP Delivery",
    factory: "Accounts",
    region: "Anyshore",
    phone: "+1 (555) 300-3003",
    email: "accounts-sh@dq.delivery",
    website: "delivery.dq.workspace",
    href: "/directory/units/accounts-stakeholders",
  },
];

const associateEntries: AssociateItem[] = [
  {
    id: "a1",
    name: "Sarah Mitchell",
    role: "Strategy Lead",
    unit: "Vision & Strategy Team",
    email: "sarah.mitchell@dqworkspace.com",
    phone: "+1 (555) 100-0101",
    href: "/directory/associates/sarah-mitchell",
  },
  {
    id: "a2",
    name: "Marcus Chen",
    role: "Culture Architect",
    unit: "Culture & Values Team",
    email: "marcus.chen@dqworkspace.com",
    phone: "+1 (555) 100-0102",
    href: "/directory/associates/marcus-chen",
  },
  {
    id: "a3",
    name: "Priya Sharma",
    role: "Competency Designer",
    unit: "Roles & Competency Team",
    email: "priya.sharma@dqworkspace.com",
    phone: "+1 (555) 100-0103",
    href: "/directory/associates/priya-sharma",
  },
  {
    id: "a4",
    name: "James Rodriguez",
    role: "Delivery Manager",
    unit: "Task & Delivery Squad",
    email: "james.rodriguez@dqworkspace.com",
    phone: "+1 (555) 100-0104",
    href: "/directory/associates/james-rodriguez",
  },
  {
    id: "a5",
    name: "Emily Watson",
    role: "Governance Specialist",
    unit: "Governance & Leadership Team",
    email: "emily.watson@dqworkspace.com",
    phone: "+1 (555) 100-0105",
    href: "/directory/associates/emily-watson",
  },
  {
    id: "a6",
    name: "Alex Okafor",
    role: "Value Stream Coordinator",
    unit: "Value Streams Team",
    email: "alex.okafor@dqworkspace.com",
    phone: "+1 (555) 100-0106",
    href: "/directory/associates/alex-okafor",
  },
  {
    id: "a7",
    name: "Lisa Tanaka",
    role: "Product Owner",
    unit: "Product & Services Team",
    email: "lisa.tanaka@dqworkspace.com",
    phone: "+1 (555) 100-0107",
    href: "/directory/associates/lisa-tanaka",
  },
  {
    id: "a8",
    name: "David Kim",
    role: "Innovation Strategist",
    unit: "Innovation & Research Lab",
    email: "david.kim@dqworkspace.com",
    phone: "+1 (555) 100-0108",
    href: "/directory/associates/david-kim",
  },
  {
    id: "a9",
    name: "Rachel Anderson",
    role: "Learning Experience Designer",
    unit: "Learning & Development Hub",
    email: "rachel.anderson@dqworkspace.com",
    phone: "+1 (555) 100-0109",
    href: "/directory/associates/rachel-anderson",
  },
];

const DiscoverDQ: React.FC = () => {
  const navigate = useNavigate();
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
    <>
      <Header />
    <div className={`${styles.dwsDiscover} ${prefersReducedMotion ? styles.reducedMotion : ""}`}>
        {/* Section 1: Hero - White EJP Style */}
        <HeroDiscoverDQ />

        {/* Section 2: Vision & Mission - DWS Theme */}
        <VisionMission />

        {/* Section 3: DQ DNA - 7 Core Dimensions */}
        <DQDNA />

        {/* Section 4: Workspace Performance Insights */}
        <WorkspaceInsights data={insightsData} />

        {/* Section 5: DQ Directory - Full Directory with Search & Filters */}
        <DQDirectory />

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
      <Footer />
    </>
  );
};

export { DiscoverDQ };
export default DiscoverDQ;
