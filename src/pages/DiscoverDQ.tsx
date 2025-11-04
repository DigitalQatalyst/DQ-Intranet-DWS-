import React, { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import VisionMission from "../components/Discover/VisionMission";
import DQDNA from "../components/Discover/DQDNA";
import WorkspaceInsights from "../components/Discover/WorkspaceInsights";
import DQDirectory from "../components/Discover/DQDirectory";
import DQ6xDigitalView from "../components/Discover/DQ6xDigitalView";
import MapCard from "../components/map/MapCard";
import {
  DQ_LOCATIONS,
  LOCATION_FILTERS,
  type LocationCategory,
  type LocationItem,
} from "../api/MAPAPI";
import HeroDiscoverDQ from "../components/Discover/HeroDiscoverDQ";
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

const DiscoverDQ: React.FC = () => {
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportStatus, setSupportStatus] = useState<string | null>(null);
  const [isSubmittingSupport, setSubmittingSupport] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<Set<LocationCategory>>(new Set());
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

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

  const filteredLocations = useMemo(() => {
    if (!selectedTypes.size) return DQ_LOCATIONS;
    return DQ_LOCATIONS.filter((location) => selectedTypes.has(location.type));
  }, [selectedTypes]);

  useEffect(() => {
    if (!selectedLocationId) return;
    if (!filteredLocations.some((location) => location.id === selectedLocationId)) {
      setSelectedLocationId(null);
    }
  }, [filteredLocations, selectedLocationId]);

  const toggleType = (type: LocationCategory) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const clearTypes = () => {
    setSelectedTypes(new Set());
    setSelectedLocationId(null);
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
    <>
      <Header />
      <main
        id="app-content"
        className={`${styles.dwsDiscover} ${prefersReducedMotion ? styles.reducedMotion : ""} relative z-0 bg-transparent`}
      >
        {/* Hero */}
        <HeroDiscoverDQ />

        {/* Map Section */}
        <section id="growth-areas" className="bg-[#F6FAFB] py-20 scroll-mt-[72px]">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-center sm:px-10 lg:px-12">
            <h2
              className="font-serif text-3xl font-bold tracking-[0.04em] text-[#030F35] sm:text-4xl"
              style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
            >
              Discover the DQ Ecosystem
            </h2>
            <p className="mx-auto max-w-2xl text-dws-text-dim text-slate-600">
              Explore DQ’s transformation network across UAE, KSA, and Kenya offices, clients, and partners.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
              {LOCATION_FILTERS.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleType(label)}
                  className={clsx(
                    "px-3 py-1 rounded-full text-sm font-semibold transition",
                    selectedTypes.has(label)
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white ring-1 ring-slate-200 text-slate-700 hover:bg-slate-50",
                  )}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={clearTypes}
                className="px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-600 ring-1 ring-slate-200 hover:bg-white"
              >
                × Clear
              </button>
            </div>

            <div className="relative z-0 h-[520px] sm:h-[520px] md:h-[560px] lg:h-[560px] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
              <MapCard
                className="h-full w-full"
                locations={filteredLocations}
                selectedId={selectedLocationId}
                onSelect={(location: LocationItem) => setSelectedLocationId(location.id)}
                onClearFilters={selectedTypes.size ? clearTypes : undefined}
              />
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <VisionMission />

        {/* DQ DNA */}
        <DQDNA />

        {/* Growth Potential */}
        <WorkspaceInsights data={insightsData} />

        {/* Digital View */}
        <DQ6xDigitalView />

        {/* Directory */}
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

export default DiscoverDQ;
