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

// Helper function to extract guide ID from URL
const extractGuideId = (req: AnyRequest): { id: string; isUuid: boolean } => {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || 'localhost';
  const reqUrl = `${proto}://${host}${req.url || ''}`;
  const urlObj = new URL(reqUrl);
  const id = urlObj.pathname.split('/').pop() as string;
  const isUuid = /^[0-9a-z-]+$/i.test(id);

  return { id, isUuid };
};

// Helper function to check if body should be included
const shouldIncludeBody = (urlObj: URL): boolean => {
  const include = (urlObj.searchParams.get('include') || '').toLowerCase();
  return include === 'body' || include === 'all' || include === '1';
};

// Helper function to fetch guide by ID or slug
const fetchGuide = async (id: string, isUuid: boolean) => {
  const select = '*';
  const query = isUuid
    ? supabaseAdmin.from('guides').select(select).eq('id', id).maybeSingle()
    : supabaseAdmin.from('guides').select(select).eq('slug', id).maybeSingle();

  const { data: row, error } = await query;
  if (error) throw error;
  if (!row) throw new Error('Not found');

  return row;
};

// Helper function to map database row to API shape
const mapRowToGuide = (row: any, includeBody: boolean) => {
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
  } as any;
};

// Helper function to fetch sub-content with error handling
const fetchSubContent = async (guideId: string) => {
  let steps: any[] = [];
  let attachments: any[] = [];
  let templates: any[] = [];

  try {
    const [stepsResult, attachmentsResult, templatesResult] = await Promise.allSettled([
      supabaseAdmin.from('guide_steps').select('id,position,title,body').eq('guide_id', guideId).order('position', { ascending: true }),
      supabaseAdmin.from('guide_attachments').select('id,kind,title,url,size').eq('guide_id', guideId),
      supabaseAdmin.from('guide_templates').select('id,title,url,size').eq('guide_id', guideId),
    ]);

    if (stepsResult.status === 'fulfilled' && !stepsResult.value.error) {
      steps = stepsResult.value.data || [];
    }
    if (attachmentsResult.status === 'fulfilled' && !attachmentsResult.value.error) {
      attachments = attachmentsResult.value.data || [];
    }
    if (templatesResult.status === 'fulfilled' && !templatesResult.value.error) {
      templates = templatesResult.value.data || [];
    }
  } catch (err) {
    console.warn('api/guides/[id] warning: Error fetching sub-content:', err);
  }

  return { steps, attachments, templates };
};

// Helper function to format output response
const formatOutput = (guide: any, steps: any[], attachments: any[], templates: any[]) => {
  return {
    ...guide,
    steps: (steps || []).map(s => ({ id: s.id, position: s.position, title: s.title, content: s.body })),
    attachments: (attachments || []).map(a => ({ id: a.id, type: a.kind === 'file' ? 'file' : 'link', title: a.title, url: a.url, size: a.size })),
    templates: (templates || []).map(t => ({ id: t.id, title: t.title, url: t.url, size: t.size })),
  };
};

// Helper function to handle caching and response
const handleCacheAndResponse = (res: AnyResponse, output: any, req: AnyRequest) => {
  const json = JSON.stringify(output);
  const etag = 'W/"' + createHash('sha1').update(json).digest('hex') + '"';
  const inm = req.headers['if-none-match'];

  res.setHeader?.('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.setHeader?.('ETag', etag);

  if (inm && inm === etag) {
    res.status?.(304);
    res.end?.();
    return true; // Response sent
  }

  res.status?.(200);
  res.end?.(json);
  return true; // Response sent
};

// Helper function to handle GET requests
const handleGetRequest = async (req: AnyRequest, res: AnyResponse, urlObj: URL) => {
  const { id, isUuid } = extractGuideId(req);
  const includeBody = shouldIncludeBody(urlObj);

  // Fetch and validate guide
  const row = await fetchGuide(id, isUuid);

  // Map to API shape
  const guide = mapRowToGuide(row, includeBody);

  // Fetch sub-content
  const { steps, attachments, templates } = await fetchSubContent(guide.id);

  // Format output
  const output = formatOutput(guide, steps, attachments, templates);

  // Handle caching and send response
  return handleCacheAndResponse(res, output, req);
};

// Helper function to send error response
const sendErrorResponse = (res: AnyResponse, status: number, message: string) => {
  res.status?.(status);
  res.json?.({ error: message });
};

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'localhost';
    const reqUrl = `${proto}://${host}${req.url || ''}`;
    const urlObj = new URL(reqUrl);

    if (req.method === 'GET') {
      await handleGetRequest(req, res, urlObj);
      return;
    }

    sendErrorResponse(res, 405, 'Method not allowed');
  } catch (err: any) {
    console.error('api/guides/[id] error:', err);
    
    if (err.message === 'Not found') {
      sendErrorResponse(res, 404, err.message);
    } else {
      sendErrorResponse(res, 500, err?.message || 'Server error');
    }
  }
}
