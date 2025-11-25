import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Associate, WorkUnitRow, WorkUnit, WorkPosition, WorkPositionRow, WorkAssociate } from "@/data/workDirectoryTypes";
import { WORK_POSITION_COLUMNS, mapWorkPositionRow } from "@/api/workDirectory";

// Helper to check if Supabase is configured
function checkSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!url || !anon) {
    console.error('❌ Supabase not configured!');
    console.error('   Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    console.error('   Create .env.local with these variables and restart dev server');
    return false;
  }
  
  if (import.meta.env.DEV) {
    console.log('✅ Supabase configured:', {
      url: url.substring(0, 30) + '...',
      hasKey: !!anon,
    });
  }
  
  return true;
}

// Helper function to derive department from unit_name
function deriveDepartmentFromUnitName(unitName: string): string {
  // "Factory – X" → "X"
  if (unitName.startsWith('Factory – ')) {
    return unitName.replace('Factory – ', '');
  }
  // "DQ Sector – X" → "X"
  if (unitName.startsWith('DQ Sector – ')) {
    return unitName.replace('DQ Sector – ', '');
  }
  // "DQ Delivery – X" → "Delivery — X" (note: long dash)
  if (unitName.startsWith('DQ Delivery – ')) {
    return 'Delivery — ' + unitName.replace('DQ Delivery – ', '');
  }
  // Fallback: return the unit name as-is
  return unitName;
}

const normalizeFocusTags = (tags: string[]): string[] => {
  const seen = new Set<string>();
  const normalized: string[] = [];
  for (const tag of tags) {
    const lower = tag?.toLowerCase() ?? '';
    const isUxUi =
      lower === 'ux' || lower === 'ui' || lower === 'ux/ui' || lower === 'ux / ui';
    const value = isUxUi ? 'UX/UI' : tag;
    const key = isUxUi ? 'ux/ui' : value.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      normalized.push(isUxUi ? 'UX/UI' : value);
    }
  }
  return normalized;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const UNIT_COLUMNS =
  "id, sector, unit_name, unit_type, mandate, location, banner_image_url, priority_scope, priority_level, performance_status, performance_score, performance_updated_at, focus_tags, slug, wi_areas, priorities, performance_summary, priorities_list, current_focus, performance_notes, created_at, updated_at";

const jsonToStringArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean) as string[];
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    if (Array.isArray(parsed)) return parsed.filter(Boolean) as string[];
  } catch {
    // ignore parse errors
  }
  return [];
};

// Mapper functions to convert snake_case DB fields to camelCase for UI
function mapWorkUnit(dbUnit: WorkUnitRow): WorkUnit {
  const fallbackSlug = slugify(dbUnit.unit_name);
  const focusTags = normalizeFocusTags(jsonToStringArray(dbUnit.focus_tags));
  const wiAreas = jsonToStringArray(dbUnit.wi_areas);
  const prioritiesList = jsonToStringArray(dbUnit.priorities_list);
  return {
    id: dbUnit.id,
    slug: dbUnit.slug || fallbackSlug,
    sector: dbUnit.sector,
    unitName: dbUnit.unit_name,
    unitType: dbUnit.unit_type,
    mandate: dbUnit.mandate,
    location: dbUnit.location,
    focusTags,
    priorityScope: dbUnit.priority_scope ?? null,
    priorityScopeRaw: dbUnit.priority_scope ?? null,
    priorityLevel: dbUnit.priority_level ?? null,
    performanceStatus: dbUnit.performance_status ?? null,
    performanceScore: dbUnit.performance_score ?? null,
    performanceUpdatedAt: dbUnit.performance_updated_at ?? null,
    wiAreas,
    bannerImageUrl: dbUnit.banner_image_url ?? null,
    department: deriveDepartmentFromUnitName(dbUnit.unit_name),
    priorities: dbUnit.priorities ?? null,
    performanceSummary: dbUnit.performance_summary ?? null,
    prioritiesList,
    currentFocus: dbUnit.current_focus ?? null,
    performanceNotes: dbUnit.performance_notes ?? null,
    updatedAt: dbUnit.updated_at ?? null,
  };
}

type UpdateUnitPerformancePayload = {
  performanceScore: number | null;
  performanceStatus: string | null;
  performanceSummary: string | null;
  performanceNotes: string | null;
};

type WorkAssociateRow = {
  id: string;
  name: string;
  current_role: string | null;
  unit: string | null;
  department: string | null;
  summary: string | null;
};

export async function updateUnitPerformance(unitId: string, payload: UpdateUnitPerformancePayload) {
  if (!checkSupabaseConfig()) {
    throw new Error("Supabase not configured. Check .env.local and restart dev server.");
  }

  if (!supabase) {
    throw new Error("Supabase client not initialized. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local");
  }

  const { data, error } = await supabase
    .from("work_units")
    .update({
      performance_score: payload.performanceScore ?? null,
      performance_status: payload.performanceStatus ?? null,
      performance_summary: payload.performanceSummary ?? null,
      performance_notes: payload.performanceNotes ?? null,
      performance_updated_at: new Date().toISOString(),
    })
    .eq("id", unitId)
    .select()
    .single();

  console.log("updateUnitPerformance result", { data, error });

  return { data, error };
}

function mapAssociate(dbAssociate: Associate) {
  return {
    id: dbAssociate.id,
    name: dbAssociate.name,
    currentRole: dbAssociate.current_role,
    department: dbAssociate.department,
    unit: dbAssociate.unit,
    location: dbAssociate.location,
    sfiaRating: dbAssociate.sfia_rating,
    status: dbAssociate.status,
    email: dbAssociate.email,
    phone: dbAssociate.phone ?? null,
    keySkills: dbAssociate.key_skills || [],
    bio: dbAssociate.bio,
    summary: dbAssociate.summary ?? null,
    avatarUrl: dbAssociate.avatar_url ?? null,
  };
}

const WORK_ASSOCIATE_COLUMNS =
  "id, name, current_role, department, unit, location, sfia_rating, status, email, key_skills, bio, avatar_url, phone, summary, created_at, updated_at";

const mapWorkAssociateRow = (row: WorkAssociateRow): WorkAssociate => ({
  id: row.id,
  name: row.name,
  currentRole: row.current_role ?? null,
  unit: row.unit ?? null,
  department: row.department ?? null,
  summary: row.summary ?? null,
});

export async function fetchAssociatesForUnit(unitName: string): Promise<WorkAssociate[]> {
  if (!unitName) return [];

  try {
    if (!checkSupabaseConfig()) {
      return [];
    }

    if (!supabase) {
      throw new Error("Supabase client not initialized. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local");
    }

    const { data, error } = await supabase
      .from("work_associates")
      .select("id, name, current_role, unit, department, summary")
      .eq("unit", unitName)
      .order("name", { ascending: true });

    if (error) {
      console.error("❌ Supabase error fetching associates for unit:", unitName, error);
      return [];
    }

    return (data || []).map((row) => mapWorkAssociateRow(row as WorkAssociateRow));
  } catch (err) {
    console.error("❌ Network/Connection error fetching associates for unit:", unitName, err);
    return [];
  }
}

export function useAssociates() {
  const [associates, setAssociates] = useState<ReturnType<typeof mapAssociate>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssociates = async () => {
      setLoading(true);
      setError(null);
      
      // Check configuration first
      if (!checkSupabaseConfig()) {
        setError("Supabase not configured. Check .env.local and restart dev server.");
        setLoading(false);
        return;
      }
      
      try {
        // Check if Supabase client is configured
        if (!supabase) {
          throw new Error("Supabase client not initialized. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local");
        }

        const { data, error: fetchError } = await supabase
          .from("work_associates")
          .select(WORK_ASSOCIATE_COLUMNS)
          .order("name", { ascending: true });

        if (fetchError) {
          // Log comprehensive error details
          console.error("❌ Supabase error fetching associates:", fetchError);
          console.error("📋 Error details:", {
            message: fetchError.message,
            code: fetchError.code,
            details: fetchError.details,
            hint: fetchError.hint,
          });
          console.error("🔍 Full error object:", JSON.stringify(fetchError, null, 2));
          
          // Build a user-friendly error message with all available details
          let errorMessage = fetchError.message || "Failed to fetch associates";
          
          if (fetchError.code) {
            errorMessage = `${errorMessage} (${fetchError.code})`;
          }
          
          if (fetchError.hint) {
            errorMessage = `${errorMessage}. ${fetchError.hint}`;
          }
          
          if (fetchError.details) {
            errorMessage = `${errorMessage}. Details: ${fetchError.details}`;
          }
          
          setError(errorMessage);
          setAssociates([]);
        } else {
          if (import.meta.env.DEV) {
            console.log(`[WorkAssociates] Fetched ${data?.length || 0} associates from Supabase`);
          }
          setAssociates((data || []).map(mapAssociate));
        }
      } catch (err) {
        // Handle network errors, CORS errors, and other fetch failures
        console.error("❌ Network/Connection error in useAssociates:", err);
        console.error("🔍 Error type:", err instanceof Error ? err.constructor.name : typeof err);
        console.error("🔍 Error message:", err instanceof Error ? err.message : String(err));
        console.error("🔍 Full error:", err);
        
        let errorMessage = "Failed to fetch associates";
        
        if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
          errorMessage = "Network error: Could not connect to Supabase. Check your internet connection and Supabase configuration.";
        } else if (err instanceof Error) {
          errorMessage = err.message;
        } else {
          errorMessage = String(err);
        }
        
        setError(errorMessage);
        setAssociates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssociates();
  }, []);

  return { associates, loading, error };
}

export function useWorkUnits() {
  const [units, setUnits] = useState<ReturnType<typeof mapWorkUnit>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      setError(null);
      
      // Check configuration first
      if (!checkSupabaseConfig()) {
        setError("Supabase not configured. Check .env.local and restart dev server.");
        setLoading(false);
        return;
      }
      
      try {
        // Check if Supabase client is configured
        if (!supabase) {
          throw new Error("Supabase client not initialized. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local");
        }

        const { data, error: fetchError } = await supabase
          .from("work_units")
          .select(UNIT_COLUMNS)
          .order("unit_name", { ascending: true });

        if (fetchError) {
          // Log comprehensive error details
          console.error("❌ Supabase error fetching work units:", fetchError);
          console.error("📋 Error details:", {
            message: fetchError.message,
            code: fetchError.code,
            details: fetchError.details,
            hint: fetchError.hint,
          });
          console.error("🔍 Full error object:", JSON.stringify(fetchError, null, 2));
          
          // Build a user-friendly error message with all available details
          let errorMessage = fetchError.message || "Failed to fetch work units";
          
          if (fetchError.code) {
            errorMessage = `${errorMessage} (${fetchError.code})`;
          }
          
          if (fetchError.hint) {
            errorMessage = `${errorMessage}. ${fetchError.hint}`;
          }
          
          if (fetchError.details) {
            errorMessage = `${errorMessage}. Details: ${fetchError.details}`;
          }
          
          setError(errorMessage);
          setUnits([]);
        } else {
          if (import.meta.env.DEV) {
            console.log(`[WorkUnits] Fetched ${data?.length || 0} units from Supabase`);
          }
          setUnits((data || []).map(mapWorkUnit));
        }
      } catch (err) {
        // Handle network errors, CORS errors, and other fetch failures
        console.error("❌ Network/Connection error in useWorkUnits:", err);
        console.error("🔍 Error type:", err instanceof Error ? err.constructor.name : typeof err);
        console.error("🔍 Error message:", err instanceof Error ? err.message : String(err));
        console.error("🔍 Full error:", err);
        
        let errorMessage = "Failed to fetch work units";
        
        if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
          errorMessage = "Network error: Could not connect to Supabase. Check your internet connection and Supabase configuration.";
        } else if (err instanceof Error) {
          errorMessage = err.message;
        } else {
          errorMessage = String(err);
        }
        
        setError(errorMessage);
        setUnits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  return { units, loading, error, updateUnitPerformance };
}

export function useWorkPositions() {
  const [positions, setPositions] = useState<WorkPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      setLoading(true);
      setError(null);
      
      // Check configuration first
      if (!checkSupabaseConfig()) {
        setError("Supabase not configured. Check .env.local and restart dev server.");
        setLoading(false);
        return;
      }
      
      try {
        // Check if Supabase client is configured
        if (!supabase) {
          throw new Error("Supabase client not initialized. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local");
        }

        const { data, error: fetchError } = await supabase
          .from("work_positions")
          .select(WORK_POSITION_COLUMNS)
          .order("position_name", { ascending: true });

        if (fetchError) {
          // Log comprehensive error details
          console.error("❌ Supabase error fetching work positions:", fetchError);
          console.error("📋 Error details:", {
            message: fetchError.message,
            code: fetchError.code,
            details: fetchError.details,
            hint: fetchError.hint,
          });
          console.error("🔍 Full error object:", JSON.stringify(fetchError, null, 2));
          
          // Build a user-friendly error message with all available details
          let errorMessage = fetchError.message || "Failed to fetch positions";
          
          // Add error code if available (e.g., PGRST301 for 401, PGRST301 for permission denied)
          if (fetchError.code) {
            errorMessage = `${errorMessage} (${fetchError.code})`;
          }
          
          // Add hint if available (often contains helpful guidance)
          if (fetchError.hint) {
            errorMessage = `${errorMessage}. ${fetchError.hint}`;
          }
          
          // Add details if available
          if (fetchError.details) {
            errorMessage = `${errorMessage}. Details: ${fetchError.details}`;
          }
          
          setError(errorMessage);
          setPositions([]);
        } else {
          // Defensive: handle null/empty data
          if (!data || data.length === 0) {
            if (import.meta.env.DEV) {
              console.warn("[WorkPositions] No positions returned from Supabase");
              console.warn("[WorkPositions] Query returned:", { data, count: data?.length || 0 });
            }
            setPositions([]);
          } else {
            if (import.meta.env.DEV) {
              console.log(`[WorkPositions] Fetched ${data.length} positions from Supabase`);
              console.log("[WorkPositions] Sample row:", data[0]);
            }
            // Map with null-safe handling
            const mapped = (data || [])
              .filter((row) => row != null) // Filter out null rows
              .map((row) => mapWorkPositionRow(row as WorkPositionRow))
              .filter((pos) => pos.id && pos.positionName); // Filter out invalid positions
            
            if (import.meta.env.DEV) {
              console.log(`[WorkPositions] Mapped ${mapped.length} valid positions`);
              if (mapped.length < data.length) {
                console.warn(`[WorkPositions] Filtered out ${data.length - mapped.length} invalid positions`);
              }
            }
            
            setPositions(mapped);
          }
        }
      } catch (err) {
        // Handle network errors, CORS errors, and other fetch failures
        console.error("❌ Network/Connection error in useWorkPositions:", err);
        console.error("🔍 Error type:", err instanceof Error ? err.constructor.name : typeof err);
        console.error("🔍 Error message:", err instanceof Error ? err.message : String(err));
        console.error("🔍 Full error:", err);
        
        // Extract detailed error information
        let errorMessage = "Failed to fetch positions";
        
        if (err instanceof TypeError && err.message.includes("Failed to fetch")) {
          // Network/CORS error
          errorMessage = "Network error: Could not connect to Supabase. Check your internet connection and Supabase configuration.";
        } else if (err instanceof Error) {
          errorMessage = err.message;
        } else {
          errorMessage = String(err);
        }
        
        setError(errorMessage);
        setPositions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  return { positions, loading, error };
}

export function useUnitProfile(unitSlug?: string) {
  const [unit, setUnit] = useState<WorkUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedAssociates, setRelatedAssociates] = useState<WorkAssociate[]>([]);
  const [associatesLoading, setAssociatesLoading] = useState(false);

  const fetchUnitData = useCallback(async (slug?: string) => {
    if (!slug) {
      setUnit(null);
      setRelatedAssociates([]);
      setLoading(false);
      setAssociatesLoading(false);
      return;
    }

    setLoading(true);
    setAssociatesLoading(true);
    setError(null);

    try {
      if (!checkSupabaseConfig()) {
        setError("Supabase not configured. Check .env.local and restart dev server.");
        setLoading(false);
        setAssociatesLoading(false);
        return;
      }

      if (!supabase) {
        throw new Error("Supabase client not initialized. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local");
      }

      const { data, error: fetchError } = await supabase
        .from("work_units")
        .select(UNIT_COLUMNS)
        .eq("slug", slug)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        setUnit(null);
        setRelatedAssociates([]);
      } else if (data) {
        const mappedUnit = mapWorkUnit(data as WorkUnitRow);
        setUnit(mappedUnit);
        const associates = await fetchAssociatesForUnit(mappedUnit.unitName);
        setRelatedAssociates(associates);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setUnit(null);
      setRelatedAssociates([]);
    } finally {
      setLoading(false);
      setAssociatesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnitData(unitSlug);
  }, [unitSlug, fetchUnitData]);

  const refresh = useCallback(() => fetchUnitData(unitSlug), [unitSlug, fetchUnitData]);

  return { unit, loading, error, relatedAssociates, associatesLoading, refresh };
}
