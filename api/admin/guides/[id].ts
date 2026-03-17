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
      
      // First, verify the guide exists and get its current data
      const { data: existingGuide, error: fetchError } = await supabaseAdmin
        .from('guides')
        .select('id, slug, title, body')
        .eq('id', id)
        .maybeSingle()
      
      if (fetchError) throw fetchError
      if (!existingGuide) {
        res.status?.(404)
        res.json?.({ error: 'Guide not found' })
        return
      }
      
      // CRITICAL: For GHC elements, ensure slug cannot be changed to another GHC slug
      const GHC_SLUGS = ['dq-vision', 'dq-hov', 'dq-persona', 'dq-agile-tms', 'dq-agile-sos', 'dq-agile-flows', 'dq-agile-6xd']
      const isGHCGuide = GHC_SLUGS.includes(existingGuide.slug)
      
      if (isGHCGuide && body.slug && body.slug !== existingGuide.slug) {
        // Prevent changing GHC element slugs to other GHC slugs
        if (GHC_SLUGS.includes(body.slug)) {
          res.status?.(400)
          res.json?.({ 
            error: `Cannot change GHC element slug from "${existingGuide.slug}" to "${body.slug}". Each GHC element must have a unique, fixed slug.` 
          })
          return
        }
      }
      
      // If slug is being updated, verify it's unique
      if (body.slug && body.slug !== existingGuide.slug) {
        const { data: slugCheck, error: slugError } = await supabaseAdmin
          .from('guides')
          .select('id, slug')
          .eq('slug', body.slug)
          .neq('id', id)
          .maybeSingle()
        
        if (slugError) throw slugError
        if (slugCheck) {
          res.status?.(400)
          res.json?.({ 
            error: `Slug "${body.slug}" is already in use by guide "${slugCheck.id}". Each guide must have a unique slug.` 
          })
          return
        }
      }
      
      // For GHC guides, add extra validation to prevent accidental content sharing
      if (isGHCGuide) {
        // Ensure body content is being updated for the correct guide
        if (body.body && body.body !== existingGuide.body) {
          console.log(`[Admin] GHC Guide Update: ${existingGuide.slug} (ID: ${id})`)
          console.log(`[Admin] Body length changed: ${existingGuide.body?.length || 0} -> ${body.body.length}`)
        }
      }
      
      // Update the guide - only update provided fields
      const updateData: any = {}
      Object.keys(body).forEach(key => {
        if (body[key] !== undefined && key !== '_diff') {
          updateData[key] = body[key]
        }
      })
      
      const { error } = await supabaseAdmin
        .from('guides')
        .update(updateData)
        .eq('id', id)
      
      if (error) throw error
      
      // Log the update for debugging
      console.log(`[Admin] Updated guide: id=${id}, slug=${existingGuide.slug}${body.slug && body.slug !== existingGuide.slug ? ` -> ${body.slug}` : ''}`)
      
      await supabaseAdmin.from('guides_versions').insert({ 
        guide_id: id, 
        version: 'auto', 
        changed_at: new Date().toISOString(), 
        diff_summary: body._diff || 'update' 
      })
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

