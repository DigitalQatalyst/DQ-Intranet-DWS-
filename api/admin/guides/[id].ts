import { supabaseAdmin } from '../../lib/supabaseAdmin'

type AnyRequest = { method?: string; headers: Record<string,string|undefined>; url?: string; [k:string]: any }
type AnyResponse = { status?: (c:number)=>AnyResponse; json?: (b:any)=>void }

function parseJSONBody(req: AnyRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c: any) => (data += c))
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}) } catch (e) { reject(e) } })
    req.on('error', reject)
  })
}

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    const host = req.headers.host || 'localhost'
    const proto = (req.headers as any)['x-forwarded-proto'] || 'https'
    const url = new URL(`${proto}://${host}${req.url}`)
    const id = url.pathname.split('/').pop() as string

    if (req.method === 'PUT') {
      const body = await parseJSONBody(req)
      const { error } = await supabaseAdmin.from('guides').update(body).eq('id', id)
      if (error) throw error
      await supabaseAdmin.from('guides_versions').insert({ guide_id: id, version: 'auto', changed_at: new Date().toISOString(), diff_summary: body._diff || 'update' })
      res.status?.(200); res.json?.({ ok: true }); return
    }
    if (req.method === 'DELETE') {
      const { error } = await supabaseAdmin.from('guides').delete().eq('id', id)
      if (error) throw error
      res.status?.(200); res.json?.({ ok: true }); return
    }
    res.status?.(405); res.json?.({ error: 'Method not allowed' })
  } catch (e: any) {
    res.status?.(500); res.json?.({ error: e?.message || 'Server error' })
  }
}

