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
      const filters = { type: parseCsv('type'), skill: parseCsv('skill') };

      try {
        const { data, error } = await supabaseAdmin.rpc('rpc_guides_search', { q, filters, sort, page, page_size: pageSize });
        if (error) throw error;
        res.status?.(200); res.json?.(data || { items: [], total: 0, facets: {} }); return;
      } catch (e) {
        // Fallback: simple list of Published guides (no facets)
        let query = supabaseAdmin.from('guides').select('*', { count: 'exact' }).eq('status', 'Published');
        if (q) query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`);
        const from = (page - 1) * pageSize; const to = from + pageSize - 1;
        const { data: rows, error } = await query.range(from, to); if (error) throw error;
        let items = (rows || []).map((r: any) => ({
          id: r.id, slug: r.slug, title: r.title, summary: r.summary,
          heroImageUrl: r.hero_image_url ?? r.heroImageUrl,
          skillLevel: r.skill_level ?? r.skillLevel,
          estimatedTimeMin: r.estimated_time_min ?? r.estimatedTimeMin,
          lastUpdatedAt: r.last_updated_at ?? r.lastUpdatedAt,
          authorName: r.author_name ?? r.authorName,
          authorOrg: r.author_org ?? r.authorOrg,
          isEditorsPick: r.is_editors_pick ?? r.isEditorsPick,
          downloadCount: r.download_count ?? r.downloadCount,
          guideType: r.guide_type ?? r.guideType,
        }));
        if (filters.type?.length) items = items.filter((m: any) => filters.type.includes(m.guideType));
        if (filters.skill?.length) items = items.filter((m: any) => filters.skill.includes(m.skillLevel));
        if (sort === 'updated') items.sort((a:any,b:any)=> new Date(b.lastUpdatedAt||0).getTime()-new Date(a.lastUpdatedAt||0).getTime());
        else if (sort === 'downloads') items.sort((a:any,b:any)=> (b.downloadCount||0)-(a.downloadCount||0));
        else if (sort === 'editorsPick') items.sort((a:any,b:any)=> (Number(b.isEditorsPick)||0)-(Number(a.isEditorsPick)||0) || new Date(b.lastUpdatedAt||0).getTime()-new Date(a.lastUpdatedAt||0).getTime());
        else items.sort((a:any,b:any)=> (Number(b.isEditorsPick)||0)-(Number(a.isEditorsPick)||0) || (b.downloadCount||0)-(a.downloadCount||0) || new Date(b.lastUpdatedAt||0).getTime()-new Date(a.lastUpdatedAt||0).getTime());
        res.status?.(200); res.json?.({ items, total: items.length, facets: {} }); return;
      }
    }

    res.status?.(405); res.json?.({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('api/guides error:', err);
    res.status?.(500); res.json?.({ error: err?.message || 'Server error' });
  }
}

