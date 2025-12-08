import { supabaseClient } from '@/lib/supabaseClient';
import type { WorkPosition } from '@/data/workDirectoryTypes';

// Helper function to map database row to WorkPosition
function mapPositionRow(row: any): WorkPosition {
  // Handle responsibilities - can be JSONB array or text array
  let responsibilities: string[] | null = null;
  if (row.responsibilities) {
    if (Array.isArray(row.responsibilities)) {
      responsibilities = row.responsibilities;
    } else if (typeof row.responsibilities === 'string') {
      try {
        const parsed = JSON.parse(row.responsibilities);
        responsibilities = Array.isArray(parsed) ? parsed : null;
      } catch {
        // If not valid JSON, treat as single string
        responsibilities = [row.responsibilities];
      }
    }
  }

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
    responsibilities: responsibilities,
    expectations: row.expectations || null,
    status: row.status || null,
    imageUrl: row.image_url || row.imageUrl || null,
    bannerImageUrl: row.banner_image_url || row.bannerImageUrl || null,
    department: row.department || null,
    contractType: row.contract_type || row.contractType || null,
    reportsTo: row.reports_to || row.reportsTo || null,
  };
}

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

    if (!data) {
      return null;
    }

    return mapPositionRow(data);
  } catch (err) {
    console.error('Error fetching work position:', err);
    return null;
  }
}

