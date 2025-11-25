import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HomeIcon, ChevronRightIcon, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { WorkUnitRow, WorkUnit } from "@/data/workDirectoryTypes";
import { getPerformanceStatusClasses } from "@/components/work-directory/unitStyles";
import { TagChip } from "@/components/Cards/TagChip";
import classNames from "clsx";
import { formatDistanceToNow } from "date-fns";

const UNIT_COLUMNS =
  "id, sector, unit_name, unit_type, mandate, location, banner_image_url, priority_scope, priority_level, performance_status, performance_score, performance_updated_at, focus_tags, slug, wi_areas, priorities, performance_summary, priorities_list, current_focus, performance_notes, created_at, updated_at";

const jsonToStringArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean) as string[];
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (Array.isArray(parsed)) return parsed.filter(Boolean) as string[];
  } catch {
    // ignore parsing errors
  }
  return [];
};

const mapUnit = (row: WorkUnitRow): WorkUnit => {
  const prioritiesList = jsonToStringArray(row.priorities_list);
  return {
    id: row.id,
    slug: row.slug,
    sector: row.sector,
    unitName: row.unit_name,
    unitType: row.unit_type,
    mandate: row.mandate,
    location: row.location,
    focusTags: jsonToStringArray(row.focus_tags),
    priorityScope: row.priority_scope ?? null,
    priorityLevel: row.priority_level ?? null,
    performanceStatus: row.performance_status ?? null,
    performanceScore: row.performance_score ?? null,
    performanceUpdatedAt: row.performance_updated_at ?? null,
    wiAreas: jsonToStringArray(row.wi_areas),
    bannerImageUrl: row.banner_image_url ?? null,
    priorities: row.priorities ?? null,
    performanceSummary: row.performance_summary ?? null,
    prioritiesList,
    currentFocus: row.current_focus ?? null,
    performanceNotes: row.performance_notes ?? null,
    updatedAt: row.updated_at ?? null,
  };
};

interface RelatedAssociate {
  id: string;
  name: string;
  current_role: string;
  avatar_url?: string | null;
}

const UnitProfilePage: React.FC = () => {
  const isAdmin = true;
  const { slug } = useParams<{ slug: string }>();
  const [unit, setUnit] = useState<WorkUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [relatedAssociates, setRelatedAssociates] = useState<RelatedAssociate[]>([]);
  const [associatesLoading, setAssociatesLoading] = useState(false);
  const [showPerformanceEditor, setShowPerformanceEditor] = useState(false);
  const [perfScoreInput, setPerfScoreInput] = useState<number | null>(null);
  const [perfStatusInput, setPerfStatusInput] = useState<string>("On track");
  const [perfSummaryInput, setPerfSummaryInput] = useState<string>("");
  const [perfNotesInput, setPerfNotesInput] = useState<string>("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
  const perfClasses = getPerformanceStatusClasses(performanceStatus);

  useEffect(() => {
    if (unit) {
      setPerfScoreInput(unit.performanceScore ?? null);
      setPerfStatusInput(unit.performanceStatus ?? "On track");
      setPerfSummaryInput(unit.performanceSummary ?? "");
      setPerfNotesInput(unit.performanceNotes ?? "");
    }
  }, [unit]);

  const loadUnit = async (unitSlug: string) => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("work_units")
      .select(UNIT_COLUMNS)
      .eq("slug", unitSlug)
      .single();

    if (fetchError) {
      console.error("Failed to load unit", fetchError);
      setError(fetchError.message);
      setUnit(null);
    } else if (data) {
      setUnit(mapUnit(data as WorkUnitRow));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!slug) return;
    loadUnit(slug);
  }, [slug]);

  useEffect(() => {
    const fetchRelatedAssociates = async () => {
      if (!slug || !unit) return;
      setAssociatesLoading(true);
      try {
        // Query work_associates where unit_slug matches the current unit's slug
        // If unit_slug doesn't exist, fall back to matching by unit name
        const { data, error: fetchError } = await supabase
          .from("work_associates")
          .select("id, name, current_role, avatar_url, unit_slug, unit")
          .or(`unit_slug.eq.${slug},unit.eq.${unit.unitName}`)
          .order("name", { ascending: true });

        if (fetchError) {
          console.error("Failed to load related associates", fetchError);
          setRelatedAssociates([]);
        } else {
          setRelatedAssociates((data || []).map((assoc) => ({
            id: assoc.id,
            name: assoc.name,
            current_role: assoc.current_role,
            avatar_url: assoc.avatar_url ?? null,
          })));
        }
      } catch (err) {
        console.error("Error fetching related associates", err);
        setRelatedAssociates([]);
      } finally {
        setAssociatesLoading(false);
      }
    };

    if (unit) {
      fetchRelatedAssociates();
    }
  }, [slug, unit]);

  const handleSavePerformance = async () => {
    if (!unit) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      await updateUnitPerformance(unit.id, {
        performanceScore: perfScoreInput,
        performanceStatus: perfStatusInput,
        performanceSummary: perfSummaryInput,
        performanceNotes: perfNotesInput,
      });
      setSaveMessage("Performance updated successfully.");
      setShowPerformanceEditor(false);
      if (slug) {
        await loadUnit(slug);
      }
    } catch (err) {
      console.error("Failed to update performance", err);
      setSaveMessage("Failed to update performance. Please try again.");
    } finally {
      setSaving(false);
    }
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

            <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-3">Unit Mandate</h2>
                  {unit.mandate ? (
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">{unit.mandate}</p>
                  ) : (
                    <p className="text-slate-500 italic">Not yet added.</p>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-3">Current Focus &amp; Priorities</h2>
                  {unit.currentFocus ? (
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line mb-3">{unit.currentFocus}</p>
                  ) : null}

                  {unit.prioritiesList && unit.prioritiesList.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {unit.prioritiesList.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  ) : unit.priorities ? (
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {unit.priorities.split(";").map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item.trim()}</li>
                      ))}
                    </ul>
                  ) : null}

                  {!unit.currentFocus && (!unit.prioritiesList || unit.prioritiesList.length === 0) && !unit.priorities && (
                    <p className="text-slate-500 italic">Not yet added.</p>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-3">Performance Summary</h2>
                  {unit.performanceSummary ? (
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">{unit.performanceSummary}</p>
                  ) : (
                    <p className="text-slate-500 italic">No performance summary available.</p>
                  )}
                  {unit.performanceNotes && (
                    <p className="text-sm text-slate-500 mt-2">
                      <span className="font-medium text-slate-600">Notes: </span>
                      {unit.performanceNotes}
                    </p>
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Unit Performance</h3>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowPerformanceEditor((prev) => !prev);
                        setSaveMessage(null);
                      }}
                      className="text-sm text-blue-600 font-medium hover:text-blue-700"
                    >
                      {showPerformanceEditor ? "Close" : "Edit performance"}
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {(() => {
                    const derived = getPerformanceStatus(unit.performanceScore);
                    const statusLabel = getPerformanceLabelFromStatus(unit.performanceStatus) || derived.label;
                    const badgeClasses = getPerformanceStatusClasses(statusLabel) || derived.colorClass;
                    return (
                      <span
                        className={classNames(
                          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border",
                          badgeClasses || derived.colorClass
                        )}
                      >
                        {statusLabel}
                        {unit.performanceScore != null && (
                          <span className="ml-1 font-normal text-slate-500">
                            ({unit.performanceScore} / 100)
                          </span>
                        )}
                      </span>
                    );
                  })()}
                  <p className="mt-2 text-sm text-slate-600">
                    This performance indicator reflects the latest functional tracker status for this unit
                    based on mandate delivery, priorities, and overall execution health.
                  </p>
                  {unit.performanceUpdatedAt && (
                    <p className="mt-1 text-xs text-slate-500">
                      Last updated: {formatDate(unit.performanceUpdatedAt)}
                    </p>
                  )}
                </div>

                {isAdmin && showPerformanceEditor && (
                  <div className="mt-3 space-y-3 border border-slate-100 rounded-lg p-3 bg-slate-50">
                    {saveMessage && (
                      <p className="text-sm text-slate-600">{saveMessage}</p>
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
                        disabled={saving}
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-[#030F35] text-white text-sm font-semibold hover:bg-[#051040] disabled:opacity-60"
                      >
                        {saving ? "Saving..." : "Save changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPerformanceEditor(false);
                          setSaveMessage(null);
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
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-sm text-slate-500">Performance</dt>
                    <dd className="flex flex-col items-end gap-1 text-sm">
                      <div className="flex flex-col gap-1 text-right">
                        <span
                          className={classNames(
                            "inline-flex px-3 py-1 rounded-full text-sm font-medium",
                            perfClasses.badgeClass
                          )}
                        >
                          {performanceStatus}
                        </span>

                        {performanceScore !== null && (
                          <span className="text-gray-700 text-sm">Score: {performanceScore} / 100</span>
                        )}

                        {performanceUpdatedAt && (
                          <span className="text-gray-400 text-xs">
                            Updated {formatDistanceToNow(new Date(performanceUpdatedAt), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </dd>
                  </div>
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedAssociates.map((associate) => (
                    <div
                      key={associate.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      {associate.avatar_url ? (
                        <img
                          src={associate.avatar_url}
                          alt={associate.name}
                          className="h-10 w-10 rounded-full object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FB5535] via-[#1A2E6E] to-[#030F35] flex items-center justify-center text-white font-semibold text-sm">
                          {associate.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{associate.name}</p>
                        <p className="text-xs text-slate-600 truncate">{associate.current_role}</p>
                      </div>
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
