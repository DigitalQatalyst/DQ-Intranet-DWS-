import React, { useEffect, useMemo, useState } from "react";
import { XIcon } from "lucide-react";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import VisionMission from "../components/Discover/VisionMission";
import LeadershipQuiz from "../components/Discover/LeadershipQuiz";
import CapabilityTiles from "../components/Discover/CapabilityTiles";
import LeadershipImpactDashboard from "../components/Discover/LeadershipImpactDashboard";
import LeadershipStories from "../components/Discover/LeadershipStories";
import LeadershipMedia from "../components/Discover/LeadershipMedia";
import LeadershipPrograms from "../components/Discover/LeadershipPrograms";
import LeadershipJobs from "../components/Discover/LeadershipJobs";
import VoicesMentors from "../components/Discover/VoicesMentors";
import DQ6xDigitalView from "../components/Discover/DQ6xDigitalView";
import LeadPathsGrid from "../components/Discover/LeadPathsGrid";
import HeroDiscoverLead from "../components/Discover/HeroDiscoverLead";
import styles from "./DiscoverDQ.module.css";

const DiscoverDQLead: React.FC = () => {
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportStatus, setSupportStatus] = useState<string | null>(null);
  const [isSubmittingSupport, setSubmittingSupport] = useState(false);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
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
      <main
        id="app-content"
        className={`${styles.dwsDiscover} ${prefersReducedMotion ? styles.reducedMotion : ""} relative z-0 bg-transparent`}
      >
        {/* Hero */}
        <HeroDiscoverLead />
        <LeadPathsGrid />

        {/* Vision & Mission */}
        <VisionMission />

        {/* Leadership Quiz */}
        <LeadershipQuiz />

        {/* Capability Playbook */}
        <CapabilityTiles />

        {/* Leadership Impact */}
        <LeadershipImpactDashboard />

        {/* Digital View */}
        <DQ6xDigitalView />

        {/* Voices & Mentors */}
        <VoicesMentors />

        {/* Stories */}
        <LeadershipStories />

        {/* Media */}
        <LeadershipMedia />

        {/* Programs */}
        <LeadershipPrograms />

        {/* Jobs */}
        <LeadershipJobs />

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
                  <button type="button" className={styles.closeButton} onClick={() => setSupportOpen(false)}>
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
      </main>
      <Footer />
    </>
  );
};

export default DiscoverDQLead;
