import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import type { WorkUnit, WorkPosition, WorkAssociate } from '@/data/workDirectoryTypes';

export interface UseWorkUnitsResult {
  units: WorkUnit[];
  loading: boolean;
  error: string | null;
  updateUnitPerformance: (unitId: string, data: {
    performanceScore?: number | null;
    performanceStatus?: string | null;
    performanceSummary?: string | null;
    performanceNotes?: string | null;
  }) => Promise<{ error: Error | null }>;
}

export interface UseWorkPositionsResult {
  positions: WorkPosition[];
  loading: boolean;
  error: string | null;
}

export interface UseAssociatesResult {
  associates: WorkAssociate[];
  loading: boolean;
  error: string | null;
}

export interface UseUnitProfileResult {
  unit: WorkUnit | null;
  loading: boolean;
  error: string | null;
  relatedAssociates: WorkAssociate[];
  associatesLoading: boolean;
  refresh: () => Promise<void>;
}

// Helper function to map database row to WorkUnit
function mapUnitRow(row: any): WorkUnit {
  return {
    id: row.id,
    slug: row.slug,
    sector: row.sector,
    unitName: row.unit_name || row.unitName,
    unitType: row.unit_type || row.unitType,
    mandate: row.mandate,
    location: row.location,
    focusTags: row.focus_tags || row.focusTags || null,
    priorityLevel: row.priority_level || row.priorityLevel || null,
    priorityScope: row.priority_scope || row.priorityScope || null,
    performanceStatus: row.performance_status || row.performanceStatus || null,
    performanceScore: row.performance_score ?? row.performanceScore ?? null,
    performanceSummary: row.performance_summary || row.performanceSummary || null,
    performanceNotes: row.performance_notes || row.performanceNotes || null,
    performanceUpdatedAt: row.performance_updated_at || row.performanceUpdatedAt || null,
    wiAreas: row.wi_areas || row.wiAreas || null,
    bannerImageUrl: row.banner_image_url || row.bannerImageUrl || null,
    department: row.department || null,
    currentFocus: row.current_focus || row.currentFocus || null,
    priorities: row.priorities || null,
    prioritiesList: row.priorities_list || row.prioritiesList || null,
    updatedAt: row.updated_at || row.updatedAt || null,
  };
}

// Helper function to map database row to WorkPosition
function mapPositionRow(row: any): WorkPosition {
  return {
    id: row.id,
    slug: row.slug,
    positionName: row.position_name || row.positionName,
    heroTitle: row.hero_title || row.heroTitle || null,
    roleFamily: row.role_family || row.roleFamily || null,
    unit: row.unit || null,
    unitSlug: row.unit_slug || row.unitSlug || null,
    location: row.location || null,
    sfiaLevel: row.sfia_level || row.sfiaLevel || null,
    sfiaRating: row.sfia_rating || row.sfiaRating || null,
    summary: row.summary || null,
    description: row.description || null,
    responsibilities: row.responsibilities || null,
    expectations: row.expectations || null,
    status: row.status || null,
    imageUrl: row.image_url || row.imageUrl || null,
    bannerImageUrl: row.banner_image_url || row.bannerImageUrl || null,
    department: row.department || null,
    contractType: row.contract_type || row.contractType || null,
  };
}

// Helper function to map database row to WorkAssociate
function mapAssociateRow(row: any): WorkAssociate {
  return {
    id: row.id,
    name: row.name,
    currentRole: row.current_role || row.currentRole,
    department: row.department,
    unit: row.unit,
    location: row.location,
    sfiaRating: row.sfia_rating || row.sfiaRating,
    status: row.status,
    level: row.level || null,
    email: row.email,
    phone: row.phone || null,
    teams_link: row.teams_link || row.teamsLink || null,
    keySkills: row.key_skills || row.keySkills || [],
    bio: row.bio,
    summary: row.summary || null,
    avatarUrl: row.avatar_url || row.avatarUrl || null,
    hobbies: row.hobbies || null,
    technicalSkills: row.technical_skills || row.technicalSkills || null,
    functionalSkills: row.functional_skills || row.functionalSkills || null,
    softSkills: row.soft_skills || row.softSkills || null,
    keyCompetencies: row.key_competencies || row.keyCompetencies || null,
    languages: row.languages || null,
  };
}

export function useWorkUnits(): UseWorkUnitsResult {
  const [units, setUnits] = useState<WorkUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        
        if (!supabaseClient) {
          throw new Error('Supabase client is not initialized. Please check your environment variables.');
        }
        
        const { data, error: fetchError } = await supabaseClient
          .from('work_units')
          .select('*')
          .order('unit_name', { ascending: true });

        if (fetchError) {
          console.error('Error fetching work units:', fetchError);
          // Provide more helpful error message
          if (fetchError.code === 'PGRST116' || fetchError.message?.includes('does not exist')) {
            throw new Error('work_units table does not exist. Please run the schema migration in Supabase. See supabase/work-directory-schema.sql');
          }
          if (fetchError.code === '42501' || fetchError.message?.includes('permission denied') || fetchError.message?.includes('row-level security')) {
            throw new Error('Permission denied accessing work_units. Please check RLS policies. Run supabase/fix-work-directory-rls.sql to fix this.');
          }
          throw fetchError;
        }

        console.log('UNITS (raw):', data);
        
        const mappedUnits = (data || []).map(mapUnitRow);
        console.log('UNITS (mapped):', mappedUnits);
        
        setUnits(mappedUnits);
        setError(null);
      } catch (err) {
        console.error('Error fetching work units:', err);
        setError(err instanceof Error ? err.message : 'Failed to load units');
        setUnits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  const updateUnitPerformance = async (
    unitId: string,
    data: {
      performanceScore?: number | null;
      performanceStatus?: string | null;
      performanceSummary?: string | null;
      performanceNotes?: string | null;
    }
  ): Promise<{ error: Error | null }> => {
    try {
      const updateData: Record<string, unknown> = {
        performance_updated_at: new Date().toISOString(),
      };

      if (data.performanceScore !== undefined) {
        updateData.performance_score = data.performanceScore;
      }
      if (data.performanceStatus !== undefined) {
        updateData.performance_status = data.performanceStatus;
      }
      if (data.performanceSummary !== undefined) {
        updateData.performance_summary = data.performanceSummary;
      }
      if (data.performanceNotes !== undefined) {
        updateData.performance_notes = data.performanceNotes;
      }

      if (!supabaseClient) {
        return { error: new Error('Supabase client is not initialized. Please check your environment variables.') };
      }

      const { error: updateError } = await supabaseClient
        .from('work_units')
        .update(updateData)
        .eq('id', unitId);

      if (updateError) {
        return { error: updateError };
      }

      // Refresh units
      const { data: updatedData, error: fetchError } = await supabaseClient
        .from('work_units')
        .select('*')
        .eq('id', unitId)
        .single();

      if (fetchError) {
        return { error: fetchError };
      }

      setUnits((prev) =>
        prev.map((unit) => (unit.id === unitId ? mapUnitRow(updatedData) : unit))
      );

      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to update performance'),
      };
    }
  };

  return { units, loading, error, updateUnitPerformance };
}

export function useWorkPositions(): UseWorkPositionsResult {
  const [positions, setPositions] = useState<WorkPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoading(true);
        
        if (!supabaseClient) {
          throw new Error('Supabase client is not initialized. Please check your environment variables.');
        }
        
        const { data, error: fetchError } = await supabaseClient
          .from('work_positions')
          .select('*')
          .order('position_name', { ascending: true });

        if (fetchError) {
          console.error('Error fetching work positions:', fetchError);
          // Provide more helpful error message
          if (fetchError.code === 'PGRST116' || fetchError.message?.includes('does not exist')) {
            throw new Error('work_positions table does not exist. Please run the schema migration in Supabase. See supabase/work-directory-schema.sql');
          }
          if (fetchError.code === '42501' || fetchError.message?.includes('permission denied') || fetchError.message?.includes('row-level security')) {
            throw new Error('Permission denied accessing work_positions. Please check RLS policies. Run supabase/fix-work-directory-rls.sql to fix this.');
          }
          throw fetchError;
        }

        console.log('POSITIONS (raw):', data);
        
        const mappedPositions = (data || []).map(mapPositionRow);
        console.log('POSITIONS (mapped):', mappedPositions);
        
        setPositions(mappedPositions);
        setError(null);
      } catch (err) {
        console.error('Error fetching work positions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load positions');
        setPositions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  return { positions, loading, error };
}

export function useAssociates(): UseAssociatesResult {
  const [associates, setAssociates] = useState<WorkAssociate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssociates = async () => {
      try {
        setLoading(true);
        
        if (!supabaseClient) {
          throw new Error('Supabase client is not initialized. Please check your environment variables.');
        }
        
        const { data, error: fetchError } = await supabaseClient
          .from('work_associates')
          .select('*')
          .order('name', { ascending: true });

        if (fetchError) {
          console.error('Error fetching work associates:', fetchError);
          // Provide more helpful error message
          if (fetchError.code === 'PGRST116' || fetchError.message?.includes('does not exist')) {
            throw new Error('work_associates table does not exist. Please run the schema migration in Supabase. See supabase/work-directory-schema.sql');
          }
          if (fetchError.code === '42501' || fetchError.message?.includes('permission denied') || fetchError.message?.includes('row-level security')) {
            throw new Error('Permission denied accessing work_associates. Please check RLS policies. Run supabase/fix-work-directory-rls.sql to fix this.');
          }
          throw fetchError;
        }

        console.log('ASSOCIATES (raw):', data);
        
        const mappedAssociates = (data || []).map(mapAssociateRow);
        console.log('ASSOCIATES (mapped):', mappedAssociates);
        
        setAssociates(mappedAssociates);
        setError(null);
      } catch (err) {
        console.error('Error fetching associates:', err);
        setError(err instanceof Error ? err.message : 'Failed to load associates');
        setAssociates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssociates();
  }, []);

  return { associates, loading, error };
}

export function useUnitProfile(slug: string | undefined): UseUnitProfileResult {
  const [unit, setUnit] = useState<WorkUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedAssociates, setRelatedAssociates] = useState<WorkAssociate[]>([]);
  const [associatesLoading, setAssociatesLoading] = useState(false);

  const fetchUnit = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      if (!supabaseClient) {
        throw new Error('Supabase client is not initialized. Please check your environment variables.');
      }
      
      const { data, error: fetchError } = await supabaseClient
        .from('work_units')
        .select('*')
        .eq('slug', slug)
        .single();

      if (fetchError) {
        // Provide more helpful error message for missing table
        if (fetchError.code === 'PGRST116' || fetchError.message?.includes('does not exist')) {
          throw new Error('work_units table does not exist. Please run the schema migration in Supabase. See supabase/work-directory-schema.sql');
        }
        throw fetchError;
      }
      
      const mappedUnit = data ? mapUnitRow(data) : null;
      setUnit(mappedUnit);
      setError(null);

      // Fetch related associates
      if (mappedUnit && supabaseClient) {
        setAssociatesLoading(true);
        const { data: associatesData, error: associatesError } = await supabaseClient
          .from('work_associates')
          .select('*')
          .eq('unit', mappedUnit.unitName)
          .limit(20);

        if (!associatesError && associatesData) {
          const mappedAssociates = associatesData.map(mapAssociateRow);
          setRelatedAssociates(mappedAssociates);
        }
        setAssociatesLoading(false);
      }
    } catch (err) {
      console.error('Error fetching unit profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load unit');
      setUnit(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnit();
  }, [slug]);

  const refresh = async () => {
    await fetchUnit();
  };

  return { unit, loading, error, relatedAssociates, associatesLoading, refresh };
}
