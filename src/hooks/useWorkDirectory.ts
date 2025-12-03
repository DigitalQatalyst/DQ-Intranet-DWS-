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

export function useWorkUnits(): UseWorkUnitsResult {
  const [units, setUnits] = useState<WorkUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabaseClient
          .from('work_units')
          .select('*')
          .order('unitName', { ascending: true });

        if (fetchError) throw fetchError;
        setUnits((data as WorkUnit[]) || []);
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
        prev.map((unit) => (unit.id === unitId ? (updatedData as WorkUnit) : unit))
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
        const { data, error: fetchError } = await supabaseClient
          .from('work_positions')
          .select('*')
          .order('positionName', { ascending: true });

        if (fetchError) throw fetchError;
        setPositions((data as WorkPosition[]) || []);
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
        const { data, error: fetchError } = await supabaseClient
          .from('work_associates')
          .select('*')
          .order('name', { ascending: true });

        if (fetchError) throw fetchError;
        setAssociates((data as WorkAssociate[]) || []);
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
      const { data, error: fetchError } = await supabaseClient
        .from('work_units')
        .select('*')
        .eq('slug', slug)
        .single();

      if (fetchError) throw fetchError;
      setUnit((data as WorkUnit) || null);
      setError(null);

      // Fetch related associates
      if (data) {
        setAssociatesLoading(true);
        const { data: associatesData, error: associatesError } = await supabaseClient
          .from('work_associates')
          .select('*')
          .eq('unit', (data as WorkUnit).unitName)
          .limit(20);

        if (!associatesError && associatesData) {
          setRelatedAssociates((associatesData as WorkAssociate[]) || []);
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

