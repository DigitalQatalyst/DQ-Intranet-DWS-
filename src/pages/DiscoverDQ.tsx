import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronRight, XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import VisionMission from "../components/Discover/VisionMission";
import DQDNA from "../components/Discover/DQDNA";
import WorkspaceInsights from "../components/Discover/WorkspaceInsights";
import DQDirectory from "../components/Discover/DQDirectory";
import DQ6xDigitalView from "../components/Discover/DQ6xDigitalView";
import { MapCard } from "../components/map/MapCard";
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

const heroStats = [
  { value: "5 000+", label: "Active Users" },
  { value: "120+", label: "Ongoing Projects" },
  { value: "90%", label: "Collaboration Satisfaction" },
];

const DiscoverDQ: React.FC = () => {
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportStatus, setSupportStatus] = useState<string | null>(null);
  const [isSubmittingSupport, setSubmittingSupport] = useState(false);
  const navigate = useNavigate();

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  const handleExploreClick = () => {
    navigate("/work-zones");
  };

  const handleGrowthClick = () => {
    navigate("/growth");
  };

  const scrollToZones = () => {
    const dnaSection = document.getElementById("dna");
    if (dnaSection) {
      dnaSection.scrollIntoView({ behavior: "smooth" });
    }
  };

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
        {/* Section 1: Hero */}
        <section className="relative w-full bg-white">
          <div className="mx-auto max-w-[1400px] px-6 py-16 lg:py-20 xl:py-24 2xl:py-28">
            <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_680px] xl:gap-14 xl:items-start">
              <div className="max-w-[640px] space-y-6 lg:space-y-8">
                <nav className="flex items-center gap-2 text-sm font-semibold text-gray-500" aria-label="Breadcrumb">
                  <span>Explore</span>
                  <span>›</span>
                  <span className="text-[#0E1446]">Discover DQ</span>
                </nav>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0E1446] leading-[1.05]">
                  Discover DQ
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-[54ch] leading-relaxed">
                  A unified workspace where teams connect, co-work, and grow through purpose-driven collaboration.
                </p>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <button
                    onClick={handleExploreClick}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-[#0E1446] text-white font-semibold rounded-full transition-all duration-200 hover:bg-[#1a2056] hover:shadow-lg hover:shadow-[#0E1446]/20 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E1446]/40 focus-visible:ring-offset-2"
                    aria-label="Explore Work Zones"
                  >
                    Explore Work Zones
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    onClick={handleGrowthClick}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#0E1446] font-semibold rounded-full border border-gray-300 transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0E1446]/40 focus-visible:ring-offset-2"
                    aria-label="View Growth Opportunities"
                  >
                    View Growth Opportunities
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4">
                  {heroStats.map((stat, index) => (
                    <div
                      key={index}
                      className="relative bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="text-2xl sm:text-3xl font-bold text-[#FB5535] mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="md:hidden">
                  <button
                    onClick={scrollToZones}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-50 to-blue-50 text-[#0E1446] font-semibold rounded-xl border border-gray-200 transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FB5535]/40"
                    aria-label="Browse DQ DNA dimensions"
                  >
                    Browse DQ DNA
                    <ChevronRight size={18} aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-10 xl:hidden">
                  <MapCard />
                </div>
              </div>

              <aside className="hidden xl:flex xl:items-start">
                <MapCard />
              </aside>
            </div>
          </div>
        </section>

        {/* Section 2: Vision & Mission - DWS Theme */}
        <VisionMission />

        {/* Section 3: DQ DNA - 7 Core Dimensions */}
        <DQDNA />

        {/* Section 4: DQ DNA Growth Potential */}
        <WorkspaceInsights data={insightsData} />

        {/* Section 5: DQ2.0 | Products (6x Digital View) */}
        <DQ6xDigitalView />

        {/* Section 6: DQ Directory - Full Directory with Search & Filters */}
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
