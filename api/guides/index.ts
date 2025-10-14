type AnyRequest = {
  method?: string;
  headers: Record<string, string | undefined> & { host?: string; 'x-forwarded-proto'?: string };
  url?: string;
  body?: any;
  [key: string]: any;
};

type AnyResponse = {
  status?: (code: number) => AnyResponse;
  json?: (body: any) => void;
  setHeader?: (k: string, v: string) => void;
  end?: (body?: any) => void;
  [key: string]: any;
};

import { supabaseAdmin } from '../lib/supabaseAdmin';

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'localhost';
    const reqUrl = `${proto}://${host}${req.url || ''}`;
    const urlObj = new URL(reqUrl);

    if (req.method === 'GET') {
      const q = urlObj.searchParams.get('q') || '';
      const page = Math.max(1, parseInt(urlObj.searchParams.get('page') || '1', 10));
      const pageSize = Math.min(50, Math.max(1, parseInt(urlObj.searchParams.get('pageSize') || '12', 10)));
      const sort = (urlObj.searchParams.get('sort') || 'relevance') as string;
      const parseCsv = (k: string) => (urlObj.searchParams.get(k) || '').split(',').map(v => v.trim()).filter(Boolean);
      // New simplified filter dimensions
      const filters = {
        domain: parseCsv('domain'),
        guide_type: parseCsv('guide_type'),
        function_area: parseCsv('function_area'),
        status: parseCsv('status'),
      } as Record<string, string[]>;

      // Note: Even though service role bypasses RLS, we intentionally only expose Approved in this endpoint
      const enforcedStatus = (filters.status && filters.status.length > 0)
        ? filters.status.filter(s => s === 'Approved')
        : ['Approved'];

      // Build base query
      let query = supabaseAdmin.from('guides').select('*', { count: 'exact' });
      // Search
      if (q) query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`);
      // Filters (AND between groups, OR within group)
      if (enforcedStatus.length) query = query.in('status', enforcedStatus);
      if (filters.domain && filters.domain.length) query = query.in('domain', filters.domain);
      if (filters.guide_type && filters.guide_type.length) query = query.in('guide_type', filters.guide_type);
      if (filters.function_area && filters.function_area.length) query = query.in('function_area', filters.function_area);

      // Sorting
      if (sort === 'updated') query = query.order('last_updated_at', { ascending: false, nullsFirst: false });
      else if (sort === 'downloads') query = query.order('download_count', { ascending: false, nullsFirst: false });
      else if (sort === 'editorsPick') query = query.order('is_editors_pick', { ascending: false, nullsFirst: false }).order('last_updated_at', { ascending: false, nullsFirst: false });
      else query = query.order('is_editors_pick', { ascending: false, nullsFirst: false }).order('download_count', { ascending: false, nullsFirst: false }).order('last_updated_at', { ascending: false, nullsFirst: false });

      const from = (page - 1) * pageSize; const to = from + pageSize - 1;
      const { data: rows, count, error } = await query.range(from, to);
      if (error) throw error;

      const items = (rows || []).map((r: any) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        summary: r.summary,
        heroImageUrl: r.hero_image_url ?? r.heroImageUrl,
        skillLevel: r.skill_level ?? r.skillLevel,
        estimatedTimeMin: r.estimated_time_min ?? r.estimatedTimeMin,
        lastUpdatedAt: r.last_updated_at ?? r.lastUpdatedAt,
        authorName: r.author_name ?? r.authorName,
        authorOrg: r.author_org ?? r.authorOrg,
        isEditorsPick: r.is_editors_pick ?? r.isEditorsPick,
        downloadCount: r.download_count ?? r.downloadCount,
        guideType: r.guide_type ?? r.guideType,
        domain: r.domain ?? null,
        functionArea: r.function_area ?? null,
        status: r.status ?? null,
        complexityLevel: r.complexity_level ?? null,
      }));

      // Compute facets from matching set (without pagination)
      let facetBase = supabaseAdmin.from('guides').select('domain,guide_type,function_area,status');
      if (q) facetBase = facetBase.or(`title.ilike.%${q}%,summary.ilike.%${q}%`);
      if (enforcedStatus.length) facetBase = facetBase.in('status', enforcedStatus);
      if (filters.domain && filters.domain.length) facetBase = facetBase.in('domain', filters.domain);
      if (filters.guide_type && filters.guide_type.length) facetBase = facetBase.in('guide_type', filters.guide_type);
      if (filters.function_area && filters.function_area.length) facetBase = facetBase.in('function_area', filters.function_area);
      const { data: facetRows, error: facetErr } = await facetBase;
      if (facetErr) throw facetErr;

      const countBy = (arr: any[], key: 'domain'|'guide_type'|'function_area'|'status') => {
        const m = new Map<string, number>();
        for (const r of arr || []) {
          const v = (r as any)[key];
          if (!v) continue;
          m.set(v, (m.get(v) || 0) + 1);
        }
        return Array.from(m.entries()).map(([id, cnt]) => ({ id, name: id, count: cnt })).sort((a,b)=> a.name.localeCompare(b.name));
      };

      const facets = {
        domain: countBy(facetRows || [], 'domain'),
        guide_type: countBy(facetRows || [], 'guide_type'),
        function_area: countBy(facetRows || [], 'function_area'),
        status: countBy(facetRows || [], 'status'),
      } as any;

      res.status?.(200); res.json?.({ items, total: count || items.length, facets }); return;
    }

    res.status?.(405); res.json?.({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('api/guides error:', err);
    res.status?.(500); res.json?.({ error: err?.message || 'Server error' });
  }
}
