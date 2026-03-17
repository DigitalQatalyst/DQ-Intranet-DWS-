import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XIcon } from "lucide-react";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import Discover_HeroSection from "../components/Discover/Discover_HeroSection";
import styles from "./DiscoverDQ.module.css";

const DiscoverDQ: React.FC = () => {
  const navigate = useNavigate();
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
        <Discover_HeroSection />
        <div className="sticky top-16 z-[110] bg-[#030F35] border-b border-slate-800/80 backdrop-blur-sm">
          <nav
            className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-6 py-3 text-xs text-slate-100 sm:px-10 sm:text-sm lg:px-12"
            aria-label="On this page"
          >
            <span className="mr-1 hidden whitespace-nowrap text-slate-300 sm:inline">On this page:</span>
            {[
              { href: '#growth-areas', label: 'DQ in 90 seconds' },
              { href: '#dq-dna', label: 'DNA & language' },
              { href: '#dq-timeline', label: "What's changed & frameworks" },
              { href: '#dq-voices', label: 'Voices & moments' },
              { href: '#dq-actions', label: 'Quick actions & signals' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full px-3 py-1 font-medium text-slate-100/80 transition-colors duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        {/* Identity snapshot: DQ in 90 seconds */}
        <section
          id="growth-areas"
          className="bg-white py-16 scroll-mt-[72px] border-t border-gray-100"
        >
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12 text-left">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Identity snapshot</span>
                  <span className="text-emerald-700/80">Always updated</span>
                </div>
                <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-[#162862]">
                  DQ in 90 seconds
                </h2>
                <p className="mt-3 text-sm sm:text-base text-gray-700">
                  DigitalQatalyst is DWS's backbone for digital transformation, connecting DNA, frameworks, platforms
                  and services into one coherent way of working.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 min-w-[260px]">
                {[
                  { label: "Digital programs", value: "120+" },
                  { label: "Active associates", value: "100+" },
                  { label: "Years in practice", value: "10+" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-slate-50 px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="text-xl font-semibold text-[#162862]">{stat.value}</div>
                    <div className="mt-1 text-xs font-medium text-slate-500 uppercase tracking-[0.14em]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="text-sm font-semibold text-[#162862] tracking-[0.16em] uppercase">
                  Big idea
                </h3>
                <p className="mt-3 text-sm text-slate-700">
                  Discover DQ is the living mirror of who we are, how we evolve and how every associate stays aligned
                  from day one and beyond.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="text-sm font-semibold text-[#162862] tracking-[0.16em] uppercase">
                  For new joiners
                </h3>
                <p className="mt-3 text-sm text-slate-700">
                  Use this page as your starting point to understand the DQ story, language and the work it enables
                  across DWS.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="text-sm font-semibold text-[#162862] tracking-[0.16em] uppercase">
                  For existing associates
                </h3>
                <p className="mt-3 text-sm text-slate-700">
                  Come back here to see what has changed, which frameworks matter now and where DQ is heading next.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DNA and orientation */}
        <section id="dq-dna" className="bg-slate-50 py-16 scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12 text-left">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#162862]">Our DNA, explained simply</h2>
                <p className="mt-3 text-sm sm:text-base text-slate-700">
                  These are the behaviours and design principles that make DQ feel different in day-to-day work.
                </p>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
                Each block comes from real engagements; use them as prompts to spot DQ in action around you.
              </p>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
              {/* Left: core DNA behaviours, spread across the width */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <h3 className="text-sm font-semibold text-[#162862]">Client-outcome obsession</h3>
                  <p className="mt-2 text-sm text-slate-700">
                    We start from the outcomes our clients and DWS are trying to achieve, then design backwards.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <h3 className="text-sm font-semibold text-[#162862]">Deliberate simplicity</h3>
                  <p className="mt-2 text-sm text-slate-700">
                    We strip language and visuals back to the essentials so teams can reuse them without a
                    facilitator.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <h3 className="text-sm font-semibold text-[#162862]">Enterprise-wide framing</h3>
                  <p className="mt-2 text-sm text-slate-700">
                    Strategy, operating model and delivery are always connected on one map, not treated as separate
                    tracks.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <h3 className="text-sm font-semibold text-[#162862]">Built with associates</h3>
                  <p className="mt-2 text-sm text-slate-700">
                    DQ evolves through feedback from squads, work zones and clients, not just from a central team.
                  </p>
                </div>
              </div>

              {/* Right: orientation and language helpers */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-900 p-5 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <h3 className="text-sm font-semibold tracking-[0.16em] uppercase text-white/80">
                    If you are new, start here
                  </h3>
                  <ol className="mt-3 space-y-2 text-sm text-white/90">
                    <li>1. Read the identity snapshot above and tell the DQ story in your own words.</li>
                    <li>2. Pick one DNA block and notice where it shows up in your current work.</li>
                    <li>3. Revisit this page each month to scan the timeline and signals.</li>
                  </ol>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <h3 className="text-sm font-semibold text-[#162862]">Common DQ language</h3>
                  <dl className="mt-2 space-y-2 text-sm text-slate-700">
                    <div>
                      <dt className="font-semibold">DQ DNA</dt>
                      <dd>Our shared behaviours and design principles for how we transform.</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Frameworks</dt>
                      <dd>Reusable lenses and maps that structure complex transformation work.</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Work zones</dt>
                      <dd>Spaces where associates plug into DQ based on the work they do.</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline and frameworks */}
        <section id="dq-timeline" className="bg-white py-16 border-t border-gray-100 scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12 text-left">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#162862]">What has changed at DQ?</h2>
                <p className="mt-3 text-sm sm:text-base text-slate-700">
                  A quick timeline of shifts that matter so you can catch up at a glance.
                </p>
                <ol className="mt-6 space-y-4 border-l border-slate-200 pl-4">
                  {[
                    {
                      period: "2023",
                      title: "From initiative to operating system",
                      body:
                        "DQ expanded from a set of tools into an end-to-end way of working across strategy, design and delivery.",
                    },
                    {
                      period: "2024",
                      title: "Work zones introduced",
                      body: "Associates now discover DQ through work zones that match their day-to-day focus.",
                    },
                    {
                      period: "2025",
                      title: "Identity hub goes live",
                      body: "This page became the single source of truth for what DQ is right now.",
                    },
                  ].map((item) => (
                    <li key={item.title} className="relative pl-4">
                      <span className="absolute left-[-9px] top-2 h-3 w-3 rounded-full border-2 border-white bg-[#FB5535] shadow" />
                      <p className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-500">{item.period}</p>
                      <h3 className="mt-1 text-sm font-semibold text-[#162862]">{item.title}</h3>
                      <p className="mt-1 text-sm text-slate-700">{item.body}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-[#162862]">DQ frameworks spotlight</h2>
                  <p className="mt-2 text-sm text-slate-700">
                    Highlighting the lenses most used across current engagements.
                  </p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      {
                        name: "DQ Strategy Map",
                        use: "When you need to connect vision, outcomes and change initiatives on one page.",
                      },
                      {
                        name: "Operating Model Canvas",
                        use: "When clarifying how people, process and technology need to shift together.",
                      },
                      {
                        name: "Delivery Wave Planner",
                        use: "When sequencing transformation work into realistic, value-based waves.",
                      },
                    ].map((framework) => (
                      <article
                        key={framework.name}
                        className="rounded-2xl bg-slate-50 p-4 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <h3 className="text-sm font-semibold text-[#162862]">{framework.name}</h3>
                        <p className="mt-2 text-xs sm:text-sm text-slate-700">{framework.use}</p>
                      </article>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-[#162862]">Inside DQ: then vs now</h2>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2 text-sm text-slate-700">
                    <div className="rounded-2xl bg-slate-50 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Before</p>
                      <ul className="mt-2 space-y-1">
                        <li>Separate decks for every client story.</li>
                        <li>Inconsistent language across teams.</li>
                        <li>Hard to see how work fits the bigger picture.</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0E1446]">Now with DQ</p>
                      <ul className="mt-2 space-y-1">
                        <li>One shared narrative and visual backbone.</li>
                        <li>Common language across squads and zones.</li>
                        <li>Clear line of sight from strategy to delivery.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Human stories and signals */}
        <section id="dq-voices" className="bg-slate-900 py-16 text-white scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12 text-left">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold">DQ voices and moments</h2>
                <p className="mt-3 text-sm sm:text-base text-white/80">
                  Short reflections and milestones that keep this space human and alive.
                </p>
              </div>
              <p className="text-xs sm:text-sm text-white/60 max-w-sm">
                New quotes and moments are rotated regularly so the page reflects what is really happening across DQ.
              </p>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-[0.16em] uppercase text-white/80">DQ voices</h3>
                <ul className="space-y-3 text-sm text-white/90">
                  <li className="rounded-2xl bg-white/5 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10">
                    "DQ gives us a single story to explain why our portfolio looks the way it does."
                    <span className="block text-xs text-white/70 mt-2">Engagement Lead</span>
                  </li>
                  <li className="rounded-2xl bg-white/5 p-4">
                    "As a new joiner, this page helped me connect my project work to the bigger DQ narrative."
                    <span className="block text-xs text-white/70 mt-2">Associate, 3 months in</span>
                  </li>
                  <li className="rounded-2xl bg-white/5 p-4">
                    "We now start leadership forums by scrolling this page together for five minutes."
                    <span className="block text-xs text-white/70 mt-2">Practice Lead</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-[0.16em] uppercase text-white/80">Moments that define DQ</h3>
                <ul className="space-y-3 text-sm text-white/90">
                  <li className="rounded-2xl bg-white/5 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                      First cross-practice DQ program
                    </p>
                    <p className="mt-1">
                      Multiple practices used the same DQ story and frameworks on a single client portfolio.
                    </p>
                  </li>
                  <li className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Work zones launched</p>
                    <p className="mt-1">
                      Associates could finally see how their role connects into DQ without reading a long deck.
                    </p>
                  </li>
                  <li className="rounded-2xl bg-white/5 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                      Identity hub adopted as source of truth
                    </p>
                    <p className="mt-1">
                      Leadership agreed that this page is the entry point for all DQ communications.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Utility and quick actions */}
        <section id="dq-actions" className="bg-white py-16 border-t border-gray-100 scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12 text-left">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#162862]">Quick jump actions</h2>
                <p className="mt-3 text-sm sm:text-base text-slate-700">
                  Move from understanding to action in just a few clicks.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-full bg-[#0E1446] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1a2056] transition-colors"
                    onClick={() => navigate("/work-zones")}
                  >
                    Explore DQ work zones
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-[#0E1446] hover:bg-slate-50 transition-colors"
                    onClick={() =>
                      navigate(
                        "/resource-coming-soon?title=DQ%20Learning%20Center%20(Courses%20%26%20Curricula)",
                      )
                    }
                  >
                    Visit DQ learning center
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-[#0E1446] hover:bg-slate-50 transition-colors"
                    onClick={() =>
                      navigate(
                        "/insight-coming-soon?title=DQ%20Knowledge%20Center%20(Work%20Guide%20-%20Strategy)",
                      )
                    }
                  >
                    Open DQ knowledge center
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-semibold text-[#162862]">Living signals</h2>
                <p className="mt-2 text-sm text-slate-700">
                  A compact view of what has just changed, what is in motion and what is coming next.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <h3 className="text-sm font-semibold text-[#162862]">Pulse updates</h3>
                    <ul className="mt-2 space-y-1 text-xs sm:text-sm text-slate-700">
                      <li>New narrative framing for enterprise programs published.</li>
                      <li>Updated visuals for DQ DNA blocks shared with zones.</li>
                      <li>Two new client case stories added to the library.</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                    <h3 className="text-sm font-semibold text-[#162862]">What we are building next</h3>
                    <ul className="mt-2 space-y-1 text-xs sm:text-sm text-slate-700">
                      <li>Self-serve playbooks mapped to each DQ work zone.</li>
                      <li>Lightweight DQ onboarding journeys per practice.</li>
                      <li>Clearer story for how DQ connects to DWS strategy.</li>
                    </ul>
                    <p className="mt-3 text-xs text-slate-500">
                      If you want to contribute, speak to your practice lead or the DQ team.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
