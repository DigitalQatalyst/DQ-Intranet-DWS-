import { supabase } from "@/lib/supabaseClient";
import type { WorkPositionRow, WorkPosition, WorkUnitRow, WorkUnit } from "@/data/workDirectoryTypes";

export const WORK_POSITION_COLUMNS =
  "id, slug, position_name, role_family, department, unit, unit_slug, location, sfia_rating, sfia_level, contract_type, summary, description, responsibilities, expectations, image_url, status, created_at, updated_at";

export const WORK_UNIT_COLUMNS =
  "id, slug, sector, unit_name, unit_type, mandate, location, focus_tags, wi_areas, priority_level, priority_scope, current_focus, priorities, priorities_list, performance_status, performance_score, performance_summary, performance_notes, performance_updated_at, banner_image_url, created_at, updated_at";

export const mapWorkUnitRow = (row: WorkUnitRow): WorkUnit => ({
  id: row?.id || "",
  slug: row?.slug || "",
  sector: row?.sector || "",
  unitName: row?.unit_name || "",
  unitType: row?.unit_type || "",
  mandate: row?.mandate || "",
  location: row?.location || "",
  focusTags: Array.isArray(row?.focus_tags) ? row.focus_tags : [],
  wiAreas: Array.isArray(row?.wi_areas) ? row.wi_areas : [],
  priorityLevel: row?.priority_level ?? null,
  priorityScope: row?.priority_scope ?? null,
  priorityScopeRaw: row?.priority_scope ?? null,
  currentFocus: row?.current_focus ?? null,
  priorities: row?.priorities ?? null,
  prioritiesList: Array.isArray(row?.priorities_list) ? row.priorities_list : [],
  performanceStatus: row?.performance_status ?? null,
  performanceScore: row?.performance_score ?? null,
  performanceSummary: row?.performance_summary ?? null,
  performanceNotes: row?.performance_notes ?? null,
  performanceUpdatedAt: row?.performance_updated_at ?? null,
  bannerImageUrl: row?.banner_image_url ?? null,
  updatedAt: row?.updated_at ?? null,
});

export async function updateUnitPerformance(
  id: string,
  updates: {
    performance_score?: number | null;
    performance_status?: string | null;
    performance_summary?: string | null;
    performance_notes?: string | null;
  }
) {
  const { data, error } = await supabase
    .from("work_units")
    .update({
      performance_score: updates.performance_score,
      performance_status: updates.performance_status,
      performance_summary: updates.performance_summary,
      performance_notes: updates.performance_notes,
      performance_updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error updating unit performance:", error);
    throw error;
  }

  return data as WorkUnitRow | null;
}

export const mapWorkPositionRow = (row: WorkPositionRow): WorkPosition => {
  // Debug logging in development only
  if (import.meta.env.DEV) {
    const missingFields: string[] = [];
    if (!row?.id) missingFields.push('id');
    if (!row?.slug) missingFields.push('slug');
    if (!row?.position_name) missingFields.push('position_name');
    
    if (missingFields.length > 0) {
      console.warn(`[WorkPosition] Missing fields for position ${row?.id || 'unknown'}:`, missingFields);
    }
  }

  return {
    id: row?.id || '',
    slug: row?.slug || '',
    positionName: row?.position_name || 'TBC',
    roleFamily: row?.role_family ?? null,
    department: row?.department ?? null,
    unit: row?.unit ?? null,
    unitSlug: row?.unit_slug ?? null,
    location: row?.location ?? null,
    sfiaRating: row?.sfia_rating ?? null,
    sfiaLevel: row?.sfia_level ?? null,
    contractType: row?.contract_type ?? null,
    summary: row?.summary ?? null,
    description: row?.description ?? null,
    responsibilities: Array.isArray(row?.responsibilities) ? row.responsibilities : [],
    expectations: typeof row?.expectations === 'string' ? row.expectations : (row?.expectations ?? null), // Handle as string
    imageUrl: row?.image_url ?? null,
    status: row?.status ?? null,
    createdAt: row?.created_at,
    updatedAt: row?.updated_at,
  };
};

export async function getWorkPositionBySlug(slug: string): Promise<WorkPosition | null> {
  try {
    if (!slug) {
      if (import.meta.env.DEV) {
        console.warn("[WorkPosition] getWorkPositionBySlug called with empty slug");
      }
      return null;
    }

    const { data, error } = await supabase
      .from("work_positions")
      .select(WORK_POSITION_COLUMNS)
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("❌ Failed to fetch work position by slug:", slug);
      console.error("📋 Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      console.error("🔍 Full error:", JSON.stringify(error, null, 2));
      return null;
    }

    if (!data) {
      if (import.meta.env.DEV) {
        console.warn("[WorkPosition] No data returned for slug:", slug);
      }
      return null;
    }

    return mapWorkPositionRow(data as WorkPositionRow);
  } catch (err) {
    console.error("❌ Unexpected error fetching work position by slug:", slug);
    console.error("🔍 Error:", err);
    console.error("🔍 Error type:", err instanceof Error ? err.constructor.name : typeof err);
    console.error("🔍 Error message:", err instanceof Error ? err.message : String(err));
    return null;
  }
}
