import React, { useMemo } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, HomeIcon } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Blueprint, getAllBlueprints } from "../utils/blueprintsData";
import clsx from "clsx";

const formatDate = (value?: string) => {
  if (!value) return "Updated recently";
  const date = new Date(value);
  return isNaN(date.getTime())
    ? "Updated recently"
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

const BlueprintDetailPage: React.FC = () => {
  const { blueprintId } = useParams<{ blueprintId: string }>();
  const location = useLocation() as { state?: { blueprint?: Blueprint } };
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState<
    "features" | "stack" | "architecture" | "bestPractices" | "maintenance"
  >("features");

  const blueprint = useMemo(() => {
    if (location.state?.blueprint) return location.state.blueprint;
    if (blueprintId) {
      const found = getAllBlueprints().find((bp) => bp.id === blueprintId);
      if (found) return found;
      // Last-resort stub when API data or id mismatch
      return {
        id: blueprintId,
        title: blueprintId.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) =>
          c.toUpperCase()
        ),
        description:
          "Blueprint details are unavailable right now. This offline stub is shown while the API is unreachable.",
        projectId: "standalone",
        projectName: "Blueprints",
        category: "design",
      } as Blueprint;
    }
    return getAllBlueprints()[0] || null;
  }, [blueprintId, location.state?.blueprint]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTocOpen(false);
    }
  };

  if (!blueprint) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center px-6 py-16 text-center">
          <div className="max-w-lg space-y-4">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
              Blueprint not found
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              We couldn&apos;t find that blueprint
            </h1>
            <p className="text-gray-600">
              The blueprint you are looking for may have been moved. Return to
              the library to browse all blueprints.
            </p>
            <div className="flex justify-center">
              <Link
                to="/blueprints"
                className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Back to Blueprints
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: "features" as const, label: "Features" },
    { id: "stack" as const, label: "Stack" },
    { id: "architecture" as const, label: "Architecture" },
    { id: "bestPractices" as const, label: "Best Practices" },
    { id: "maintenance" as const, label: "Maintenance & Support" },
  ];

  const getActiveContent = () => {
    switch (activeTab) {
      case "features":
        return (blueprint as any).features;
      case "stack":
        return (blueprint as any).stack;
      case "architecture":
        return (blueprint as any).architecture;
      case "bestPractices":
        return (blueprint as any).bestPractices;
      case "maintenance":
        return (blueprint as any).maintenance;
      default:
        return "";
    }
  };
  const activeContent = getActiveContent();
  const heroImage =
    (blueprint as any).heroImage ||
    (blueprint as any).heroImageUrl ||
    (blueprint as any).imageUrl ||
    (blueprint as any).image_url ||
    null;
  const heroSummary =
    (blueprint as any).summary ||
    blueprint.description ||
    "Supports teams with structured rollout, integrations, and documentation for this capability.";
  const categoryLabel = blueprint.category
    ? `${blueprint.category.charAt(0).toUpperCase()}${blueprint.category.slice(1)}`
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
          <nav className="flex items-center text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
            <Link to="/" className="inline-flex items-center hover:text-gray-800">
              <HomeIcon size={16} className="mr-1" />
              Home
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <Link to="/blueprints" className="hover:text-gray-800">
              Blueprints
            </Link>
            <span className="mx-2 text-gray-400">›</span>
            <span className="text-gray-800 font-medium truncate">{blueprint.title}</span>
          </nav>

          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#030F35] via-[#1A2E6E] to-[#4B61D1] text-white shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#030F35]/80 via-[#1A2E6E]/80 to-[#4B61D1]/75" aria-hidden="true" />
            {heroImage && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${heroImage})` }}
                aria-hidden="true"
              />
            )}
            <div className="relative px-6 sm:px-8 py-8 lg:py-10 flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-blue-100">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white">Blueprint</span>
                  {categoryLabel && <span className="px-3 py-1 rounded-full bg-white/10 text-white">{categoryLabel}</span>}
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white">{blueprint.projectName}</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white">Updated {formatDate(blueprint.lastUpdated)}</span>
                </div>
                <div>
                  <p className="text-sm text-blue-100 uppercase tracking-wide">Blueprint profile</p>
                  <h1 className="text-3xl sm:text-4xl font-bold mt-2">{blueprint.title}</h1>
                </div>
              </div>

              <div className="w-full lg:w-1/3 rounded-2xl bg-white/10 px-5 py-5 text-sm text-blue-50 space-y-4">
                <div className="space-y-2 text-right">
                  <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    Blueprint profile
                  </div>
                  <p className="text-sm leading-relaxed text-blue-50">
                    {heroSummary}
                  </p>
                  {categoryLabel && (
                    <div className="inline-flex px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white/90">
                      Category: {categoryLabel}
                    </div>
                  )}
                </div>
                {blueprint.url && (
                  <a
                    href={blueprint.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#030F35] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0F1A4F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030F35]"
                  >
                    View Blueprint
                  </a>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About this blueprint</h2>
              <p className="text-gray-700 leading-relaxed">
                {blueprint.description ||
                  "This blueprint captures the architecture, delivery patterns, and operational guidelines needed to execute successfully."}
              </p>
            </div>

            <section className="mx-auto mt-2 max-w-6xl px-0">
              <div className="rounded-2xl bg-white shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 border-b border-slate-100 px-4 pt-3 sm:px-6">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                          "relative pb-3 text-sm font-medium transition-colors",
                          isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                        )}
                      >
                        {tab.label}
                        {isActive && (
                          <span className="absolute inset-x-0 -bottom-[1px] h-[2px] rounded-full bg-[#2563EB]" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="px-4 py-4 sm:px-6 sm:py-6 text-sm leading-relaxed text-slate-800">
                  {activeContent ? (
                    <div
                      className="prose prose-sm max-w-none prose-ul:list-disc prose-li:marker:text-slate-500"
                      dangerouslySetInnerHTML={{ __html: activeContent }}
                    />
                  ) : (
                    <p className="text-slate-500 italic">No content provided for this section yet.</p>
                  )}
                </div>
              </div>
            </section>

            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Key responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Architecture and scope definition with clear success measures.</li>
                <li>Delivery milestones, owners, and readiness checkpoints.</li>
                <li>Integration patterns, data contracts, and security controls.</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Expectations</h2>
              <p className="text-gray-700 leading-relaxed">
                Ensure rollout is traceable, testable, and aligned to governance guardrails; keep templates and runbooks in sync with the latest version.
              </p>
            </div>

            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Blueprint context</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm text-gray-700">
                <div>
                  <div className="text-gray-500">Project</div>
                  <div className="font-semibold text-gray-900">{blueprint.projectName}</div>
                </div>
                <div>
                  <div className="text-gray-500">Category</div>
                  <div className="font-semibold text-gray-900 capitalize">{blueprint.category}</div>
                </div>
                <div>
                  <div className="text-gray-500">Author</div>
                  <div className="font-semibold text-gray-900">{blueprint.author || "Team"}</div>
                </div>
                <div>
                  <div className="text-gray-500">Status</div>
                  <div className="font-semibold text-gray-900">Active</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 py-2">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-indigo-700 hover:text-indigo-900 font-semibold"
              >
                <ArrowLeftIcon size={16} className="mr-1" />
                Back to Blueprints
              </button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlueprintDetailPage;
