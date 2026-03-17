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
    if (req.method === 'POST') {
      const body = await parseJSONBody(req)
      const { data, error } = await supabaseAdmin.from('guides').insert(body).select('id').single()
      if (error) throw error
      res.status?.(201); res.json?.({ id: data.id }); return
    }
    res.status?.(405); res.json?.({ error: 'Method not allowed' });
  } catch (e: any) {
    res.status?.(500); res.json?.({ error: e?.message || 'Server error' })
  }
}

