import { supabaseClient } from '@/lib/supabaseClient';
import type { WorkPosition } from '@/data/workDirectoryTypes';

export async function getWorkPositionBySlug(slug: string): Promise<WorkPosition | null> {
  try {
    const { data, error } = await supabaseClient
      .from('work_positions')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching work position:', error);
      return null;
    }

    return (data as WorkPosition) || null;
  } catch (err) {
    console.error('Error fetching work position:', err);
    return null;
  }
}

