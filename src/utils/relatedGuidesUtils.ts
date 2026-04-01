import { knowledgeHubSupabase } from "../services/knowledgeHubClient";

export interface RelatedGuide {
  id: string;
  slug?: string;
  title: string;
  summary?: string;
  heroImageUrl?: string | null;
  domain?: string | null;
  guideType?: string | null;
  lastUpdatedAt?: string | null;
  downloadCount?: number | null;
  isEditorsPick?: boolean | null;
  estimatedTimeMin?: number | null;
}

const SELECT_COLS =
  "id,slug,title,summary,hero_image_url,guide_type,domain,last_updated_at,download_count,is_editors_pick,estimated_time_min";

export function mergeUnique(existing: any[], incoming: any[]): any[] {
  const map = new Map<string, any>();
  for (const r of existing) map.set(r.slug || r.id, r);
  for (const r of incoming) {
    const k = r.slug || r.id;
    if (!map.has(k)) map.set(k, r);
  }
  return Array.from(map.values()).slice(0, 6);
}

export function mapToRelatedGuide(r: any): RelatedGuide {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    heroImageUrl: r.hero_image_url,
    domain: r.domain,
    guideType: r.guide_type,
    lastUpdatedAt: r.last_updated_at,
    downloadCount: r.download_count,
    isEditorsPick: r.is_editors_pick,
    estimatedTimeMin: r.estimated_time_min,
  };
}

async function queryGuides(
  filter: { field: string; value: string },
  currentSlug: string,
): Promise<any[]> {
  const { data } = await knowledgeHubSupabase!
    .from("guides")
    .select(SELECT_COLS)
    .eq(filter.field, filter.value)
    .neq("slug", currentSlug)
    .eq("status", "Approved")
    .order("is_editors_pick", { ascending: false, nullsFirst: false })
    .order("download_count", { ascending: false, nullsFirst: false })
    .order("last_updated_at", { ascending: false, nullsFirst: false })
    .limit(6);
  return data || [];
}

export async function fetchRelatedGuides(
  currentGuide: { domain?: string | null; guideType?: string | null },
  currentSlug: string,
): Promise<any[]> {
  let results: any[] = [];

  if (currentGuide.domain) {
    results = await queryGuides(
      { field: "domain", value: currentGuide.domain },
      currentSlug,
    );
  }

  if (results.length < 6 && currentGuide.guideType) {
    const rows2 = await queryGuides(
      { field: "guide_type", value: currentGuide.guideType },
      currentSlug,
    );
    results = mergeUnique(results, rows2);
  }

  if (results.length < 6 && !currentGuide.domain && !currentGuide.guideType) {
    const { data: rows3 } = await knowledgeHubSupabase!
      .from("guides")
      .select(SELECT_COLS)
      .ilike("domain", "%guideline%")
      .neq("slug", currentSlug)
      .eq("status", "Approved")
      .order("is_editors_pick", { ascending: false, nullsFirst: false })
      .order("download_count", { ascending: false, nullsFirst: false })
      .order("last_updated_at", { ascending: false, nullsFirst: false })
      .limit(6);
    results = mergeUnique(results, rows3 || []);
  }

  return results;
}
