import { supabaseAdmin } from '../../lib/supabaseAdmin'

type AnyRequest = { method?: string; headers: Record<string,string|undefined>; url?: string; [k:string]: any }
type AnyResponse = { status?: (c:number)=>AnyResponse; json?: (b:any)=>void }

const GHC_SLUGS = new Set(['dq-vision', 'dq-hov', 'dq-persona', 'dq-agile-tms', 'dq-agile-sos', 'dq-agile-flows', 'dq-agile-6xd'])

function parseJSONBody(req: AnyRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c: any) => (data += c))
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}) } catch (e) { reject(e) } })
    req.on('error', reject)
  })
}

function extractId(req: AnyRequest): string {
  const proto = (req.headers as any)['x-forwarded-proto'] || 'https'
  const host = req.headers.host || 'localhost'
  return new URL(`${proto}://${host}${req.url}`).pathname.split('/').pop() as string
}

function buildUpdateData(body: any): Record<string, any> {
  return Object.fromEntries(
    Object.entries(body).filter(([key, value]) => value !== undefined && key !== '_diff')
  )
}

async function validateSlugChange(existingGuide: any, newSlug: string, id: string, res: AnyResponse): Promise<boolean> {
  if (GHC_SLUGS.has(existingGuide.slug) && GHC_SLUGS.has(newSlug)) {
    res.status?.(400)
    res.json?.({ error: `Cannot change GHC element slug from "${existingGuide.slug}" to "${newSlug}". Each GHC element must have a unique, fixed slug.` })
    return false
  }

  const { data: conflict, error } = await supabaseAdmin
    .from('guides')
    .select('id')
    .eq('slug', newSlug)
    .neq('id', id)
    .maybeSingle()

  if (error) throw error
  if (conflict) {
    res.status?.(400)
    res.json?.({ error: `Slug "${newSlug}" is already in use by guide "${conflict.id}". Each guide must have a unique slug.` })
    return false
  }

  return true
}

async function handlePut(id: string, req: AnyRequest, res: AnyResponse): Promise<void> {
  const body = await parseJSONBody(req)

  const { data: existingGuide, error: fetchError } = await supabaseAdmin
    .from('guides')
    .select('id, slug, title, body')
    .eq('id', id)
    .maybeSingle()

  if (fetchError) throw fetchError
  if (!existingGuide) {
    res.status?.(404); res.json?.({ error: 'Guide not found' }); return
  }

  const isSlugChanging = body.slug && body.slug !== existingGuide.slug
  if (isSlugChanging) {
    const valid = await validateSlugChange(existingGuide, body.slug, id, res)
    if (!valid) return
  }

  // Log GHC body changes for auditing
  if (GHC_SLUGS.has(existingGuide.slug) && body.body && body.body !== existingGuide.body) {
    console.log(`[Admin] GHC Guide Update: ${existingGuide.slug} (ID: ${id})`)
    console.log(`[Admin] Body length changed: ${existingGuide.body?.length || 0} -> ${body.body.length}`)
  }

  const { error } = await supabaseAdmin.from('guides').update(buildUpdateData(body)).eq('id', id)
  if (error) throw error

  const slugChange = isSlugChanging ? ` -> ${body.slug}` : ''
  console.log(`[Admin] Updated guide: id=${id}, slug=${existingGuide.slug}${slugChange}`)

  await supabaseAdmin.from('guides_versions').insert({
    guide_id: id,
    version: 'auto',
    changed_at: new Date().toISOString(),
    diff_summary: body._diff || 'update'
  })
  res.status?.(200); res.json?.({ ok: true })
}

async function handleDelete(id: string, res: AnyResponse): Promise<void> {
  const { error } = await supabaseAdmin.from('guides').delete().eq('id', id)
  if (error) throw error
  res.status?.(200); res.json?.({ ok: true })
}

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    const id = extractId(req)
    if (req.method === 'PUT') { await handlePut(id, req, res); return }
    if (req.method === 'DELETE') { await handleDelete(id, res); return }
    res.status?.(405); res.json?.({ error: 'Method not allowed' })
  } catch (e: any) {
    if (e.message === 'Guide not found') {
      sendErrorResponse(res, 404, e.message)
    } else {
      sendErrorResponse(res, 400, e.message)
    }
  }
}
