import { supabaseAdmin } from '../lib/supabaseAdmin';

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
    const q = async (table: string) => {
      const { data, error } = await supabaseAdmin.from(table).select('id,name').order('id')
      if (error) throw error
      return data || []
    }
    const out = {
      guideType: await q('guide_type'),
      audience: await q('guide_audiences'),
      topic: await q('guide_topics'),
      format: await q('guide_formats'),
      language: await q('guide_languages'),
    } as any
    res.status?.(200); res.json?.(out);
  } catch (err: any) {
    console.error('api/guides/taxonomies error:', err);
    res.status?.(500); res.json?.({ error: err?.message || 'Server error' });
  }
}
