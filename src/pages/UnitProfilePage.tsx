import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HomeIcon, ChevronRightIcon, MapPin } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TagChip } from "@/components/Cards/TagChip";
import { useUnitProfile, useWorkUnits } from "@/hooks/useWorkDirectory";
import { UnitPerformancePanel } from "@/components/units/UnitPerformancePanel";
import classNames from "clsx";
import { formatDistanceToNow } from "date-fns";

type UnitSectionCardProps = {
  title: string;
  children: React.ReactNode;
};

const UnitSectionCard: React.FC<UnitSectionCardProps> = ({ title, children }) => (
  <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6 space-y-3">
    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    <div className="text-sm text-slate-700">{children}</div>
  </div>
);

const renderRichTextSection = (value?: string | null) => {
  if (!value) return null;

  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  if (lines.length === 1) {
    return (
      <p className="mt-2 text-sm text-slate-700">
        {lines[0]}
      </p>
    );
  }

  return (
    <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-slate-700">
      {lines.map((line, idx) => (
        <li key={idx}>{line}</li>
      ))}
    </ul>
  );
};

const UnitProfilePage: React.FC = () => {
  const isAdmin = true;
  const { slug } = useParams<{ slug: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPerformanceEditor, setShowPerformanceEditor] = useState(false);
  const [perfScoreInput, setPerfScoreInput] = useState<number | null>(null);
  const [perfStatusInput, setPerfStatusInput] = useState<string>("On track");
  const [perfSummaryInput, setPerfSummaryInput] = useState<string>("");
  const [perfNotesInput, setPerfNotesInput] = useState<string>("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { updateUnitPerformance } = useWorkUnits();
  const { unit, loading, error, relatedAssociates, associatesLoading, refresh } = useUnitProfile(slug);

  const formatDate = (value?: string | null) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPerformanceStatus = (score: number | null | undefined) => {
    if (score == null) {
      return {
        label: "No data",
        colorClass: "bg-slate-100 text-slate-700 border border-slate-200",
      };
    }
    if (score >= 80) {
      return {
        label: "On Track",
        colorClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      };
    }
    if (score >= 50) {
      return {
        label: "Needs focus",
        colorClass: "bg-amber-50 text-amber-700 border border-amber-200",
      };
    }
    return {
      label: "At Risk",
      colorClass: "bg-rose-50 text-rose-700 border border-rose-200",
    };
  };

  const getPerformanceLabelFromStatus = (status?: string | null) => {
    if (!status) return null;
    const normalized = status.toLowerCase();
    if (normalized === "on_track" || normalized === "on track") return "On Track";
    if (normalized === "at_risk" || normalized === "at risk") return "At Risk";
    if (normalized === "off_track" || normalized === "off track") return "Off Track";
    return status;
  };

  const performanceScore = unit?.performanceScore ?? null;
  const performanceStatus = unit?.performanceStatus ?? "Unknown";
  const performanceUpdatedAt = unit?.performanceUpdatedAt ?? null;

  useEffect(() => {
    if (unit) {
      setPerfScoreInput(unit.performanceScore ?? null);
      setPerfStatusInput(unit.performanceStatus ?? "On track");
      setPerfSummaryInput(unit.performanceSummary ?? "");
      setPerfNotesInput(unit.performanceNotes ?? "");
    }
  }, [unit]);

  const handleSavePerformance = async () => {
    if (!unit) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const { error } = await updateUnitPerformance(unit.id, {
        performanceScore: perfScoreInput,
        performanceStatus: perfStatusInput,
        performanceSummary: perfSummaryInput || null,
        performanceNotes: perfNotesInput || null,
      });

      if (error) {
        console.error("Failed to update performance", error);
        setSaveError(error.message ?? "Unknown error");
        return;
      }

      await refresh();
      setShowPerformanceEditor(false);
    } catch (err: unknown) {
      console.error("Failed to update unit performance", err);
      const message = err instanceof Error ? err.message : "Failed to update performance. Please try again.";
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const normalizeStatus = (value?: string | null) => {
    const normalized = (value || "").toLowerCase();
    if (normalized === "leading") return "leading";
    if (normalized === "on track" || normalized === "on_track") return "on_track";
    if (normalized === "at risk" || normalized === "at_risk" || normalized === "off track" || normalized === "off_track") {
      return "at_risk";
    }
    return "on_track";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />
      <main className="container mx-auto px-4 py-10 flex-grow space-y-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm text-gray-600">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                <HomeIcon size={16} className="mr-1" />
                Home
              </Link>
            </li>
            <li className="inline-flex items-center text-gray-500">
              <ChevronRightIcon size={16} className="text-gray-400" />
              <Link to="/marketplace/work-directory" className="ml-1 hover:text-gray-800">
                DQ Work Directory
              </Link>
            </li>
            <li className="inline-flex items-center text-gray-500">
              <ChevronRightIcon size={16} className="text-gray-400" />
              <span className="ml-1">Units</span>
            </li>
            {unit && (
              <li className="inline-flex items-center text-gray-700">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1">{unit.unitName}</span>
              </li>
            )}
          </ol>
        </nav>

        {loading && <div className="text-sm text-gray-500">Loading unit profile…</div>}
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            Failed to load unit details. {error}
          </div>
        )}

        {unit && (
          <>
            <section className="rounded-3xl text-white shadow-xl overflow-hidden">
              <div
                className="relative p-6 sm:p-10 bg-gradient-to-br from-[#030F35] via-[#1A2E6E] to-[#4B61D1]"
              >
                {unit.bannerImageUrl && (
                  <div className="absolute inset-0">
                    <img
                      src={unit.bannerImageUrl}
                      alt={unit.unitName}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#030F35]/90 via-[#1A2E6E]/80 to-[#4B61D1]/80" />
                  </div>
                )}
                <div className="relative space-y-4">
                  <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-blue-100">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white">{unit.unitType}</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white">{unit.sector}</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white flex items-center gap-1">
                      <MapPin size={14} className="text-blue-200" />
                      {unit.location}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-3xl sm:text-4xl font-bold mt-2">{unit.unitName}</h1>
                    {unit.updatedAt && (
                      <span className="text-xs text-blue-100">Last updated: {formatDate(unit.updatedAt)}</span>
                    )}
                  </div>
                  {unit.focusTags && unit.focusTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {unit.focusTags.map((tag) => (
                        <TagChip key={tag} text={tag} variant="info" />
                      ))}
                    </div>
                  )}
                  {unit.wiAreas && unit.wiAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {unit.wiAreas.map((area) => (
                        <span key={area} className="px-2 py-1 rounded-full bg-white/10 text-white/90">
                          {area}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
              <div className="space-y-6">
                <UnitSectionCard title="Unit Mandate">
                  {renderRichTextSection(unit.mandate) || (
                    <p className="text-sm text-slate-500 italic">Not yet added.</p>
                  )}
                </UnitSectionCard>

                <UnitSectionCard title="Current Focus & Priorities">
                  {(() => {
                    const currentFocusContent = renderRichTextSection(unit.currentFocus);
                    const prioritiesContent = renderRichTextSection(unit.priorities);
                    const hasPrioritiesList = Array.isArray(unit.prioritiesList) && unit.prioritiesList.length > 0;
                    const hasContent = currentFocusContent || prioritiesContent || hasPrioritiesList;

                    if (!hasContent) {
                      return <p className="text-sm text-slate-500 italic">Not yet added.</p>;
                    }

                    return (
                      <div className="space-y-3">
                        {currentFocusContent}
                        {hasPrioritiesList && (
                          <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-slate-700">
                            {unit.prioritiesList!.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        )}
                        {prioritiesContent}
                      </div>
                    );
                  })()}
                </UnitSectionCard>

                <UnitSectionCard title="Performance Summary">
                  {(() => {
                    const performanceSummaryContent = renderRichTextSection(unit.performanceSummary);
                    const performanceNotesContent = renderRichTextSection(unit.performanceNotes);
                    const hasContent = performanceSummaryContent || performanceNotesContent;

                    if (!hasContent) {
                      return <p className="text-sm text-slate-500 italic">Not yet added.</p>;
                    }

                    return (
                      <div className="space-y-3">
                        {performanceSummaryContent}
                        {performanceNotesContent && (
                          <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-slate-800">Notes</h3>
                            {performanceNotesContent}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </UnitSectionCard>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Unit Performance</h3>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowPerformanceEditor((prev) => !prev);
                        setSaveError(null);
                      }}
                      className="text-sm text-blue-600 font-medium hover:text-blue-700"
                    >
                      {showPerformanceEditor ? "Close" : "Edit performance"}
                    </button>
                  )}
                </div>

                <UnitPerformancePanel
                  status={normalizeStatus(unit.performanceStatus)}
                  score={unit.performanceScore ?? 0}
                  lastUpdated={unit.performanceUpdatedAt ? formatDate(unit.performanceUpdatedAt) : undefined}
                  helperText="This performance indicator reflects the latest functional tracker status for this unit based on mandate delivery, priorities, and overall execution health."
                  showTitle={false}
                />

                {isAdmin && showPerformanceEditor && (
                  <div className="space-y-3 border border-slate-100 rounded-lg p-3 bg-slate-50">
                    {saveError && (
                      <div className="mb-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                        {saveError}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-700">Performance score</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={perfScoreInput ?? ""}
                          onChange={(e) => setPerfScoreInput(e.target.value === "" ? null : Number(e.target.value))}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-700">Performance status</label>
                        <select
                          value={perfStatusInput}
                          onChange={(e) => setPerfStatusInput(e.target.value)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Leading">Leading</option>
                          <option value="On track">On track</option>
                          <option value="At risk">At risk</option>
                          <option value="Off track">Off track</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-700">Performance summary</label>
                      <textarea
                        value={perfSummaryInput}
                        onChange={(e) => setPerfSummaryInput(e.target.value)}
                        rows={3}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-slate-700">Performance notes</label>
                      <textarea
                        value={perfNotesInput}
                        onChange={(e) => setPerfNotesInput(e.target.value)}
                        rows={3}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSavePerformance}
                        disabled={isSaving}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-[#030F35] text-white text-sm font-semibold hover:bg-[#051040] disabled:opacity-60"
                      >
                        {isSaving ? "Saving..." : "Save changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPerformanceEditor(false);
                          setSaveError(null);
                        }}
                        className="text-sm text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <h3 className="text-lg font-semibold text-slate-900">Unit Details</h3>
                <dl className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-slate-700">Sector</dt>
                    <dd>{unit.sector}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-slate-700">Unit type</dt>
                    <dd>{unit.unitType}</dd>
                  </div>
                  {unit.priorityLevel && (
                    <div className="flex justify-between gap-4">
                      <dt className="font-medium text-slate-700">Priority level</dt>
                      <dd>{unit.priorityLevel}</dd>
                    </div>
                  )}
                  {unit.priorityScope && (
                    <div className="flex justify-between gap-4">
                      <dt className="font-medium text-slate-700">Priority scope</dt>
                      <dd>{unit.priorityScope}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-slate-700">Location</dt>
                    <dd>{unit.location}</dd>
                  </div>
                  {(unit.performanceStatus || unit.performanceScore != null) && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-sm text-slate-500">Performance</dt>
                      <dd className="text-sm text-slate-600 text-right">
                        {unit.performanceStatus || "See Unit Performance above"}
                        {unit.performanceScore != null ? ` • ${unit.performanceScore} / 100` : ""}
                      </dd>
                    </div>
                  )}
                  {unit.wiAreas && unit.wiAreas.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <dt className="font-medium text-slate-700">WI areas</dt>
                      <dd className="flex flex-wrap gap-1.5">
                        {unit.wiAreas.map((area) => (
                          <span
                            key={area}
                            className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-xs"
                          >
                            {area}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Related Associates</h2>
              {associatesLoading ? (
                <div className="text-sm text-slate-500 py-4">Loading associates...</div>
              ) : relatedAssociates.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {relatedAssociates.map((associate) => (
                    <div key={associate.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3 space-y-1">
                      <p className="text-sm font-semibold text-slate-900">{associate.name}</p>
                      {associate.currentRole && <p className="text-xs text-slate-600">{associate.currentRole}</p>}
                      {associate.department && <p className="text-xs text-slate-500">{associate.department}</p>}
                      {associate.summary && (
                        <p className="text-xs text-slate-600 mt-1 whitespace-pre-line">{associate.summary}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No associates found for this unit.</p>
              )}
            </section>
          </>
        )}
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default UnitProfilePage;

