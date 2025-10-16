import { supabaseAdmin } from '../lib/supabaseAdmin.js';

type AnyRequest = {
  method?: string;
  headers: Record<string, string | undefined> & { host?: string; 'x-forwarded-proto'?: string };
  url?: string;
  [key: string]: any;
};

type AnyResponse = {
  status?: (code: number) => AnyResponse;
  json?: (body: any) => void;
  setHeader?: (k: string, v: string) => void;
  end?: (body?: any) => void;
  [key: string]: any;
};

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    if (req.method !== 'GET') { res.status?.(405); res.json?.({ error: 'Method not allowed' }); return; }
    // Pull distinct values from guides for simplified facets
    const { data, error } = await supabaseAdmin
      .from('guides')
      .select('domain,guide_type,function_area,status');
    if (error) throw error;
    const uniq = (arr: any[], key: 'domain'|'guide_type'|'function_area'|'status') => {
      const set = new Set<string>();
      for (const r of arr || []) { const v = (r as any)[key]; if (v) set.add(String(v)); }
      return Array.from(set).sort().map((name, i) => ({ id: i + 1, name }));
    };
    const out = {
      domain: uniq(data || [], 'domain'),
      guideType: uniq(data || [], 'guide_type'),
      functionArea: uniq(data || [], 'function_area'),
      status: uniq(data || [], 'status'),
    } as any;
    res.status?.(200); res.json?.(out);
  } catch (err: any) {
    console.error('api/guides/taxonomies error:', err);
    res.status?.(500); res.json?.({ error: err?.message || 'Server error' });
  }
}
