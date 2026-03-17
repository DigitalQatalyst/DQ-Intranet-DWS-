import { supabaseAdmin } from './lib/supabaseAdmin'

type AnyRequest = { 
  method?: string; 
  headers: Record<string,string|undefined>; 
  url?: string; 
  [k:string]: any 
}

type AnyResponse = { 
  status?: (c:number)=>AnyResponse; 
  json?: (b:any)=>void 
}

function parseJSONBody(req: AnyRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c: any) => (data += c))
    req.on('end', () => { 
      try { 
        resolve(data ? JSON.parse(data) : {}) 
      } catch (e) { 
        reject(e) 
      } 
    })
    req.on('error', reject)
  })
}

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    const host = req.headers.host || 'localhost'
    const proto = (req.headers as any)['x-forwarded-proto'] || 'https'
    const url = new URL(`${proto}://${host}${req.url}`)
    const pathParts = url.pathname.split('/').filter(Boolean)
    const lastPart = pathParts[pathParts.length - 1]
    
    // Route: POST /api/admin-guides (create new guide)
    if (req.method === 'POST' && lastPart === 'admin-guides') {
      const body = await parseJSONBody(req)
      const { data, error } = await supabaseAdmin.from('guides').insert(body).select('id').single()
      if (error) throw error
      res.status?.(201)
      res.json?.({ id: data.id })
      return
    }
    
    // Route: PUT /api/admin-guides/:id (update guide)
    if (req.method === 'PUT' && lastPart !== 'admin-guides') {
      const id = lastPart
      const body = await parseJSONBody(req)
      const { error } = await supabaseAdmin.from('guides').update(body).eq('id', id)
      if (error) throw error
      await supabaseAdmin.from('guides_versions').insert({ 
        guide_id: id, 
        version: 'auto', 
        changed_at: new Date().toISOString(), 
        diff_summary: body._diff || 'update' 
      })
      res.status?.(200)
      res.json?.({ ok: true })
      return
    }
    
    // Route: DELETE /api/admin-guides/:id (delete guide)
    if (req.method === 'DELETE' && lastPart !== 'admin-guides') {
      const id = lastPart
      const { error } = await supabaseAdmin.from('guides').delete().eq('id', id)
      if (error) throw error
      res.status?.(200)
      res.json?.({ ok: true })
      return
    }
    
    res.status?.(405)
    res.json?.({ error: 'Method not allowed' })
  } catch (e: any) {
    console.error('api/admin-guides error:', e)
    res.status?.(500)
    res.json?.({ error: e?.message || 'Server error' })
  }
}
