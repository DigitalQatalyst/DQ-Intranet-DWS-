import { supabaseAdmin } from '../lib/supabaseAdmin';

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
      const select = 'id,slug,title,summary,heroImageUrl,skillLevel,estimatedTimeMin,lastUpdatedAt,status,authorName,authorOrg,isEditorsPick,downloadCount,guideType:guide_type(name),topics:guide_topics(name),audiences:guide_audiences(name),formats:guide_formats(name),languages:guide_languages(name),tags'
      const gq = isUuid
        ? supabaseAdmin.from('guides').select(select).eq('id', id).maybeSingle()
        : supabaseAdmin.from('guides').select(select).eq('slug', id).maybeSingle()
      const { data: guide, error } = await gq
      if (error) throw error
      if (!guide) { res.status?.(404); res.json?.({ error: 'Not found' }); return }
      // Fetch sub-content
      const [{ data: steps }, { data: attachments }, { data: templates }, { data: tools }] = await Promise.all([
        supabaseAdmin.from('guide_steps').select('id,position,title,body').eq('guide_id', guide.id).order('position', { ascending: true }),
        supabaseAdmin.from('guide_attachments').select('id,kind,title,url,size').eq('guide_id', guide.id),
        supabaseAdmin.from('guide_templates').select('id,title,url,size').eq('guide_id', guide.id),
        supabaseAdmin.from('guide_tool_xref').select('tool:guide_tools(name,slug)').eq('guide_id', guide.id),
      ])
      const out = {
        ...guide,
        steps: (steps || []).map(s => ({ id: s.id, position: s.position, title: s.title, content: s.body })),
        attachments: (attachments || []).map(a => ({ id: a.id, type: a.kind === 'file' ? 'file' : 'link', title: a.title, url: a.url, size: a.size })),
        templates: (templates || []).map(t => ({ id: t.id, title: t.title, url: t.url, size: t.size })),
        relatedToolSlugs: (tools || []).map((t: any) => t.tool?.slug).filter(Boolean),
      }
      res.status?.(200); res.json?.(out); return
    }

    res.status?.(405); res.json?.({ error: 'Method not allowed' });
  } catch (err: any) {
    console.error('api/guides/[id] error:', err);
    res.status?.(500); res.json?.({ error: err?.message || 'Server error' });
  }
}
