import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HomeIcon, ChevronRightIcon, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { WorkUnitRow, WorkUnit } from "@/data/workDirectoryTypes";
import { getPerformanceStatusClasses } from "@/components/work-directory/unitStyles";

const UNIT_COLUMNS =
  "id, sector, unit_name, unit_type, mandate, location, banner_image_url, priority_scope, performance_status, focus_tags, slug, wi_areas, priorities, performance_summary, priorities_list, current_focus, performance_notes, created_at, updated_at";

const mapUnit = (row: WorkUnitRow): WorkUnit => {
  const prioritiesList = Array.isArray(row.priorities_list) ? row.priorities_list : [];
  return {
    id: row.id,
    slug: row.slug,
    sector: row.sector,
    unitName: row.unit_name,
    unitType: row.unit_type,
    mandate: row.mandate,
    location: row.location,
    focusTags: Array.isArray(row.focus_tags) ? row.focus_tags : [],
    priorityScope: row.priority_scope ?? null,
    performanceStatus: row.performance_status ?? null,
    wiAreas: Array.isArray(row.wi_areas) ? row.wi_areas : [],
    bannerImageUrl: row.banner_image_url ?? null,
    priorities: row.priorities ?? null,
    performanceSummary: row.performance_summary ?? null,
    prioritiesList,
    currentFocus: row.current_focus ?? null,
    performanceNotes: row.performance_notes ?? null,
  };
};

interface RelatedAssociate {
  id: string;
  name: string;
  current_role: string;
  avatar_url?: string | null;
}

const UnitProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [unit, setUnit] = useState<WorkUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [relatedAssociates, setRelatedAssociates] = useState<RelatedAssociate[]>([]);
  const [associatesLoading, setAssociatesLoading] = useState(false);

  useEffect(() => {
    const fetchUnit = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("work_units")
        .select(UNIT_COLUMNS)
        .eq("slug", slug)
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

    fetchUnit();
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

  const performanceClasses = getPerformanceStatusClasses(unit?.performanceStatus);

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
            <section className="rounded-3xl bg-gradient-to-br from-[#030F35] via-[#1A2E6E] to-[#4B61D1] text-white shadow-xl p-6 sm:p-10 space-y-4">
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-blue-100">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white">{unit.unitType}</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white">{unit.sector}</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white flex items-center gap-1">
                  <MapPin size={14} className="text-blue-200" />
                  {unit.location}
                </span>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold mt-2">{unit.unitName}</h1>
              </div>
              {unit.wiAreas && unit.wiAreas.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {unit.wiAreas.map((area) => (
                    <span key={area} className="px-2 py-1 rounded-full bg-white/10 text-white/90">
                      {area}
                    </span>
                  ))}
                </div>
              )}
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
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">{unit.currentFocus}</p>
                  ) : (
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
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-4">
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
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-slate-700">Location</dt>
                    <dd>{unit.location}</dd>
                  </div>
                  {unit.wiAreas && unit.wiAreas.length > 0 && (
                    <div className="flex justify-between gap-4">
                      <dt className="font-medium text-slate-700">WI areas</dt>
                      <dd>{unit.wiAreas.length}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-slate-700">Performance</dt>
                    <dd className="text-right">
                      {unit.performanceNotes ? (
                        <span className="text-slate-700">{unit.performanceNotes}</span>
                      ) : (
                        <span className="text-slate-400 italic">Not yet added</span>
                      )}
                    </dd>
                  </div>
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
