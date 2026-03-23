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

function extractRequestMeta(req: AnyRequest) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || 'localhost';
  const urlObj = new URL(`${proto}://${host}${req.url || ''}`);
  const id = urlObj.pathname.split('/').pop() as string;
  const isUuid = /^[0-9a-z-]+$/i.test(id);
  return { urlObj, id, isUuid };
}

function mapRowToGuide(row: any, includeBody: boolean) {
  return {
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
  };
}

function extractSettled<T>(result: PromiseSettledResult<{ data: T | null; error: any }>): T[] {
  return result.status === 'fulfilled' && !result.value.error ? (result.value.data ?? []) as T[] : [];
}

async function fetchSubContent(guideId: string) {
  try {
    const [stepsResult, attachmentsResult, templatesResult] = await Promise.allSettled([
      supabaseAdmin.from('guide_steps').select('id,position,title,body').eq('guide_id', guideId).order('position', { ascending: true }),
      supabaseAdmin.from('guide_attachments').select('id,kind,title,url,size').eq('guide_id', guideId),
      supabaseAdmin.from('guide_templates').select('id,title,url,size').eq('guide_id', guideId),
    ]);
    return {
      steps: extractSettled(stepsResult),
      attachments: extractSettled(attachmentsResult),
      templates: extractSettled(templatesResult),
    };
  } catch (err) {
    console.warn('api/guides/[id] warning: Error fetching sub-content:', err);
    return { steps: [], attachments: [], templates: [] };
  }
}

async function handleGet(id: string, isUuid: boolean, urlObj: URL, req: AnyRequest, res: AnyResponse) {
  const include = (urlObj.searchParams.get('include') || '').toLowerCase();
  const includeBody = include === 'body' || include === 'all' || include === '1';

  const gq = isUuid
    ? supabaseAdmin.from('guides').select('*').eq('id', id).maybeSingle()
    : supabaseAdmin.from('guides').select('*').eq('slug', id).maybeSingle();
  const { data: row, error } = await gq;
  if (error) throw error;
  if (!row) { res.status?.(404); res.json?.({ error: 'Not found' }); return; }

  const guide = mapRowToGuide(row, includeBody);
  const { steps, attachments, templates } = await fetchSubContent(guide.id);

  const out = {
    ...guide,
    steps: steps.map((s: any) => ({ id: s.id, position: s.position, title: s.title, content: s.body })),
    attachments: attachments.map((a: any) => ({ id: a.id, type: a.kind === 'file' ? 'file' : 'link', title: a.title, url: a.url, size: a.size })),
    templates: templates.map((t: any) => ({ id: t.id, title: t.title, url: t.url, size: t.size })),
  };

  const json = JSON.stringify(out);
  const etag = 'W/"' + createHash('sha1').update(json).digest('hex') + '"';
  res.setHeader?.('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.setHeader?.('ETag', etag);
  if (req.headers['if-none-match'] === etag) { res.status?.(304); res.end?.(); return; }
  res.status?.(200); res.end?.(json);
}

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    const { urlObj, id, isUuid } = extractRequestMeta(req);
    if (req.method === 'GET') { await handleGet(id, isUuid, urlObj, req, res); return; }
    res.status?.(405); res.json?.({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('api/guides/[id] error:', err);
    res.status?.(500); res.json?.({ error: err?.message || 'Server error' });
  }
}
