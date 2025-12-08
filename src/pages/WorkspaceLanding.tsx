import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/Button";
import { useCountdown } from "../hooks/useCountdown";

const workspaceTools = [
  {
    title: "My Dashboard",
    description: "Track goals, performance, and delivery progress in one place.",
  },
  {
    title: "Projects & Tasks",
    description: "Open sprint boards to prioritize work and ship on time.",
  },
  {
    title: "Collaboration Hub",
    description: "Chat, share updates, and co-work with your squad in real-time.",
  },
  {
    title: "Learning Paths",
    description: "Launch DQ LMS tracks and develop the skills that move work forward.",
  },
];

const workspaceServices = [
  {
    title: "Service Center",
    description: "Request support, open tickets, and follow up on resolution.",
  },
  {
    title: "Blueprint Library",
    description: "Grab templates, playbooks, and best-practice guides.",
  },
  {
    title: "Mentor Access",
    description: "Connect with coaches and leads to unblock and grow.",
  },
];

const workspaceDashboards = [
  {
    title: "Team KPIs",
    description: "Visualize performance trends and celebrate wins.",
  },
  {
    title: "Delivery Health",
    description: "Monitor capacity, dependencies, and sprint health.",
  },
  {
    title: "Learning Progress",
    description: "See adoption across key DQ learning paths.",
  },
];

const quickActions = [
  { label: "Create Task", href: "#" },
  { label: "Join Stand-up", href: "#" },
  { label: "View Reports", href: "#" },
];

const comingSoonDefault = (() => {
  const raw = import.meta.env.VITE_WORKSPACE_COMING_SOON;
  if (typeof raw === "string") {
    return raw.toLowerCase() !== "false";
  }
  return true;
})();

const countdownTarget = (() => {
  const target = new Date();
  target.setDate(target.getDate() + 30);
  return target;
})();

const WorkspaceLanding = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const isComingSoon = comingSoonDefault;
  const countdown = useCountdown(countdownTarget);

  const handleBackHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleScrollToTools = useCallback(() => {
    const toolsSection = document.getElementById("workspace-tools");
    toolsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const heroCTAProps = {
    "data-testid": "workspace-hero-cta",
    onClick: handleScrollToTools,
    className:
      "!bg-[#FB5535] hover:!bg-[#e24a2d] focus-visible:!ring-[#FB5535] shadow-lg",
    icon: <ArrowRight className="h-4 w-4" aria-hidden="true" />,
    iconPosition: "right" as const,
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <main className="flex-1">
        {isComingSoon ? (
          <section className="relative overflow-hidden bg-gradient-to-br from-[#030F35] via-[#1A2E6E] to-[#FB5535] py-20 sm:py-24">
            <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
            <div className="relative mx-auto flex max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="w-full rounded-3xl border border-white/15 bg-white/10 p-8 text-center text-white shadow-2xl backdrop-blur-lg sm:p-12">
                <div className="flex justify-center">
                  <img
                    src="/dq_logo8.png"
                    alt="DQ Digital Workspace"
                    className="h-16 w-auto sm:h-20"
                  />
                </div>

                <div className="mt-8 space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
                    Coming Soon
                  </p>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    DQ Digital Workspace
                  </h1>
                  <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                    We’re building the space where teams lead, co-work, and grow together. Check back
                    soon to launch straight into your DQ experience.
                  </p>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {([
                    ["Days", countdown.days],
                    ["Hours", countdown.hours],
                    ["Minutes", countdown.minutes],
                    ["Seconds", countdown.seconds],
                  ] as const).map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/20 bg-white/10 px-4 py-5 shadow-lg"
                    >
                      <div className="text-3xl font-semibold text-white">{value}</div>
                      <p className="mt-1 text-xs uppercase tracking-wide text-white/70">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={handleBackHome}
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20 focus-visible:ring-white/50"
                    icon={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}
                  >
                    Go Back Home
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="relative overflow-hidden bg-gradient-to-br from-[#030F35] via-[#1A2E6E] to-[#FB5535] py-20 text-white sm:py-24">
              <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
              <div className="relative mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl space-y-6">
                  <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                    Digital Workspace
                  </span>
                  <h1 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                    Welcome to Your DQ Workspace
                  </h1>
                  <p className="text-lg text-white/85">
                    Lead — access the right tools, services, and dashboards to drive progress every
                    day.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button {...heroCTAProps}>
                      Explore Workspace
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-white hover:bg-white/10 focus-visible:ring-white/60"
                      icon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}
                      iconPosition="right"
                    >
                      View Updates
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section
              id="workspace-tools"
              aria-labelledby="workspace-tools-heading"
              className="py-16 md:py-20"
            >
              <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
                <div className="space-y-4 text-center">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#FB5535]">
                    Section A
                  </p>
                  <h2
                    id="workspace-tools-heading"
                    className="text-3xl font-semibold text-[#030F35] sm:text-4xl"
                  >
                    Your Daily Tools
                  </h2>
                  <p className="mx-auto max-w-3xl text-base text-slate-600">
                    Launch the essentials that keep work moving — dashboards, collaboration, and learning all at your fingertips.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {workspaceTools.map((tool) => (
                    <a
                      key={tool.title}
                      href="#"
                      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FB5535]/50"
                      aria-label={tool.title}
                    >
                      <span className="text-sm font-semibold uppercase tracking-wide text-[#FB5535]/80">
                        Tool
                      </span>
                      <h3 className="mt-3 text-xl font-semibold text-[#030F35]">{tool.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{tool.description}</p>
                      <span className="mt-6 inline-flex items-center text-sm font-semibold text-[#FB5535] transition group-hover:translate-x-1">
                        Explore
                        <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            <section
              aria-labelledby="workspace-services-heading"
              className="bg-[#F1F5F9] py-16 md:py-20"
            >
              <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
                <div className="space-y-3 text-center">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#FB5535]">
                    Section B
                  </p>
                  <h2
                    id="workspace-services-heading"
                    className="text-3xl font-semibold text-[#030F35] sm:text-4xl"
                  >
                    Services That Support You
                  </h2>
                  <p className="mx-auto max-w-3xl text-base text-slate-600">
                    Tap into help, guides, and mentoring so you can stay focused on delivery.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {workspaceServices.map((service) => (
                    <a
                      key={service.title}
                      href="#"
                      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FB5535]/50"
                      aria-label={service.title}
                    >
                      <h3 className="text-xl font-semibold text-[#030F35]">{service.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{service.description}</p>
                      <span className="mt-auto inline-flex items-center text-sm font-semibold text-[#FB5535] transition group-hover:translate-x-1">
                        Open Service
                        <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            <section
              aria-labelledby="workspace-dashboards-heading"
              className="py-16 md:py-20"
            >
              <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
                <div className="space-y-3 text-center">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#FB5535]">
                    Section C
                  </p>
                  <h2
                    id="workspace-dashboards-heading"
                    className="text-3xl font-semibold text-[#030F35] sm:text-4xl"
                  >
                    Dashboards At a Glance
                  </h2>
                  <p className="mx-auto max-w-3xl text-base text-slate-600">
                    Monitor delivery, learning, and team KPIs in a single view.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {workspaceDashboards.map((dashboard) => (
                    <a
                      key={dashboard.title}
                      href="#"
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FB5535]/50"
                      aria-label={dashboard.title}
                    >
                      <div className="h-40 w-full bg-gradient-to-br from-[#030F35]/90 via-[#1A2E6E]/80 to-[#FB5535]/70 opacity-80 transition group-hover:opacity-100" />
                      <div className="flex flex-1 flex-col space-y-3 px-6 py-5">
                        <h3 className="text-xl font-semibold text-[#030F35]">{dashboard.title}</h3>
                        <p className="text-sm leading-relaxed text-slate-600">{dashboard.description}</p>
                        <span className="mt-auto inline-flex items-center text-sm font-semibold text-[#FB5535] transition group-hover:translate-x-1">
                          View Dashboard
                          <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            <section
              aria-labelledby="workspace-actions-heading"
              className="bg-[#F1F5F9] py-16 md:py-20"
            >
              <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
                <div className="space-y-3 text-center">
                  <p className="text-sm font-semibold uppercase tracking-wide text-[#FB5535]">
                    Section D
                  </p>
                  <h2
                    id="workspace-actions-heading"
                    className="text-3xl font-semibold text-[#030F35] sm:text-4xl"
                  >
                    Quick Actions
                  </h2>
                  <p className="mx-auto max-w-2xl text-base text-slate-600">
                    Jump straight into the tasks that keep teams aligned and shipping.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  {quickActions.map((action) => (
                    <Button
                      key={action.label}
                      type="button"
                      variant="outline"
                      size="lg"
                      className="border-[#030F35]/20 text-[#030F35] hover:bg-[#030F35]/5 focus-visible:ring-[#FB5535]"
                      onClick={() => {}}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default WorkspaceLanding;
