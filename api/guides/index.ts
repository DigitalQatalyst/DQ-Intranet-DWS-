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

import { supabaseAdmin } from '../lib/supabaseAdmin.js';
import { createHash } from 'crypto';

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'localhost';
    const reqUrl = `${proto}://${host}${req.url || ''}`;
    const urlObj = new URL(reqUrl);

    if (req.method === 'GET') {
      const q = urlObj.searchParams.get('q') || '';
      const sortParam = (urlObj.searchParams.get('sort') || 'relevance') as string;
      const sort = sortParam === 'downloads' || sortParam === 'relevance' ? 'downloads' : (sortParam === 'updated' ? 'updated' : 'updated');
      const pageSize = Math.min(50, Math.max(1, parseInt(urlObj.searchParams.get('pageSize') || '12', 10)));
      const cursor = urlObj.searchParams.get('cursor') || '';
      const parseCsv = (k: string) => (urlObj.searchParams.get(k) || '').split(',').map(v => v.trim()).filter(Boolean);
      const domains = parseCsv('domain');
      const types = parseCsv('guide_type');
      const functions = parseCsv('function_area');
      const status = (urlObj.searchParams.get('status') || 'Approved');

      // RPC search (cursor-based)
      const { data, error } = await supabaseAdmin.rpc('rpc_guides_search', {
        q: q || null,
        domains: domains.length ? domains : null,
        types: types.length ? types : null,
        functions: functions.length ? functions : null,
        status_filter: status || null,
        sort,
        limit_count: pageSize,
        after: cursor || null,
      });
      if (error) throw error;
      const rows = (data as any[]) || [];
      const items = rows.map((r: any) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        summary: r.summary,
        heroImageUrl: r.hero_image_url ?? null,
        lastUpdatedAt: r.updated_at ?? null,
        downloadCount: r.download_count ?? null,
        guideType: r.guide_type ?? null,
        domain: r.domain ?? null,
        functionArea: r.function_area ?? null,
        status: r.status ?? null,
      }));
      const last = rows[rows.length - 1];
      const hasMore = !!(last && last.has_more);
      const nextCursor = last ? String(last.cursor || '') : null;

      // Facets projection (lightweight)
      let facetBase = supabaseAdmin.from('guides').select('domain,guide_type,function_area,status');
      if (q) facetBase = facetBase.or(`title.ilike.%${q}%,summary.ilike.%${q}%`);
      if (status) facetBase = facetBase.eq('status', status);
      if (domains.length) facetBase = facetBase.in('domain', domains);
      if (types.length) facetBase = facetBase.in('guide_type', types);
      if (functions.length) facetBase = facetBase.in('function_area', functions);
      const { data: facetRows, error: facetErr } = await facetBase;
      if (facetErr) throw facetErr;
      const countBy = (arr: any[], key: 'domain'|'guide_type'|'function_area'|'status') => {
        const m = new Map<string, number>();
        for (const r of arr || []) { const v = (r as any)[key]; if (!v) continue; m.set(v, (m.get(v)||0)+1); }
        return Array.from(m.entries()).map(([id, cnt]) => ({ id, name: id, count: cnt })).sort((a,b)=> a.name.localeCompare(b.name));
      };
      const facets = {
        domain: countBy(facetRows || [], 'domain'),
        guide_type: countBy(facetRows || [], 'guide_type'),
        function_area: countBy(facetRows || [], 'function_area'),
        status: countBy(facetRows || [], 'status'),
      } as any;

      const body = { items, total: items.length, facets, cursor: nextCursor, has_more: hasMore };
      const json = JSON.stringify(body);
      const etag = 'W/"' + createHash('sha1').update(json).digest('hex') + '"';
      const inm = req.headers['if-none-match'];
      res.setHeader?.('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
      res.setHeader?.('ETag', etag);
      if (inm && inm === etag) { res.status?.(304); res.end?.(); return; }
      res.status?.(200); res.end?.(json); return;
    }

    res.status?.(405); res.json?.({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('api/guides error:', err);
    res.status?.(500); res.json?.({ error: err?.message || 'Server error' });
  }
}
