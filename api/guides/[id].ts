import { supabaseAdmin } from '../lib/supabaseAdmin.js';
import { createHash } from 'crypto';

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

function parseJSONBody(req: AnyRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: any) => (data += chunk));
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'localhost';
    const reqUrl = `${proto}://${host}${req.url || ''}`;
    const urlObj = new URL(reqUrl);
    const id = urlObj.pathname.split('/').pop() as string;
    const isUuid = /^[0-9a-z\-]+$/i.test(id);

    if (req.method === 'GET') {
      const include = (urlObj.searchParams.get('include') || '').toLowerCase();
      const includeBody = include === 'body' || include === 'all' || include === '1';
      // Select columns from simplified schema (direct text columns)
      const select = '*';
      const gq = isUuid
        ? supabaseAdmin.from('guides').select(select).eq('id', id).maybeSingle()
        : supabaseAdmin.from('guides').select(select).eq('slug', id).maybeSingle()
      const { data: row, error } = await gq
      if (error) throw error
      if (!row) { res.status?.(404); res.json?.({ error: 'Not found' }); return }
      // Map to API shape
      const guide = {
        id: row.id,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        heroImageUrl: row.hero_image_url ?? row.heroImageUrl,
        skillLevel: row.skill_level ?? row.skillLevel,
        estimatedTimeMin: row.estimated_time_min ?? row.estimatedTimeMin,
        lastUpdatedAt: row.last_updated_at ?? row.lastUpdatedAt,
        status: row.status,
        authorName: row.author_name ?? row.authorName,
        authorOrg: row.author_org ?? row.authorOrg,
        isEditorsPick: row.is_editors_pick ?? row.isEditorsPick,
        downloadCount: row.download_count ?? row.downloadCount,
        guideType: row.guide_type ?? row.guideType,
        domain: row.domain ?? null,
        functionArea: row.function_area ?? null,
        complexityLevel: row.complexity_level ?? null,
        documentUrl: row.document_url ?? row.documentUrl ?? null,
        body: includeBody ? (row.body ?? null) : null,
      } as any
      // Fetch sub-content (still supported)
      const [{ data: steps }, { data: attachments }, { data: templates }] = await Promise.all([
        supabaseAdmin.from('guide_steps').select('id,position,title,body').eq('guide_id', guide.id).order('position', { ascending: true }),
        supabaseAdmin.from('guide_attachments').select('id,kind,title,url,size').eq('guide_id', guide.id),
        supabaseAdmin.from('guide_templates').select('id,title,url,size').eq('guide_id', guide.id),
      ])
      const out = {
        ...guide,
        steps: (steps || []).map(s => ({ id: s.id, position: s.position, title: s.title, content: s.body })),
        attachments: (attachments || []).map(a => ({ id: a.id, type: a.kind === 'file' ? 'file' : 'link', title: a.title, url: a.url, size: a.size })),
        templates: (templates || []).map(t => ({ id: t.id, title: t.title, url: t.url, size: t.size })),
      }
      const json = JSON.stringify(out)
      const etag = 'W/"' + createHash('sha1').update(json).digest('hex') + '"'
      const inm = req.headers['if-none-match']
      res.setHeader?.('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
      res.setHeader?.('ETag', etag)
      if (inm && inm === etag) { res.status?.(304); res.end?.(); return }
      res.status?.(200); res.end?.(json); return
    }

    res.status?.(405); res.json?.({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('api/guides/[id] error:', err);
    res.status?.(500); res.json?.({ error: err?.message || 'Server error' });
  }
}
