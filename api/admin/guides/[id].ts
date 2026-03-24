import { supabaseAdmin } from '../../lib/supabaseAdmin'

type AnyRequest = { method?: string; headers: Record<string,string|undefined>; url?: string; [k:string]: any }
type AnyResponse = { status?: (c:number)=>AnyResponse; json?: (b:any)=>void }

// Constants for GHC slugs
const GHC_SLUGS = ['dq-vision', 'dq-hov', 'dq-persona', 'dq-agile-tms', 'dq-agile-sos', 'dq-agile-flows', 'dq-agile-6xd']

function parseJSONBody(req: AnyRequest): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c: any) => (data += c))
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}) } catch (e) { reject(e) } })
    req.on('error', reject)
  })
}

// Helper function to extract guide ID from URL
const extractGuideId = (req: AnyRequest): string => {
  const host = req.headers.host || 'localhost'
  const proto = (req.headers as any)['x-forwarded-proto'] || 'https'
  const url = new URL(`${proto}://${host}${req.url}`)
  return url.pathname.split('/').pop() as string
}

// Helper function to fetch existing guide
const fetchExistingGuide = async (id: string) => {
  const { data: existingGuide, error: fetchError } = await supabaseAdmin
    .from('guides')
    .select('id, slug, title, body')
    .eq('id', id)
    .maybeSingle()
  
  if (fetchError) throw fetchError
  if (!existingGuide) {
    throw new Error('Guide not found')
  }
  
  return existingGuide
}

// Helper function to validate GHC slug changes
const validateGHCSlugChange = (existingGuide: any, body: any) => {
  const isGHCGuide = GHC_SLUGS.includes(existingGuide.slug)
  
  if (isGHCGuide && body.slug && body.slug !== existingGuide.slug) {
    if (GHC_SLUGS.includes(body.slug)) {
      throw new Error(`Cannot change GHC element slug from "${existingGuide.slug}" to "${body.slug}". Each GHC element must have a unique, fixed slug.`)
    }
  }
  
  return isGHCGuide
}

// Helper function to validate slug uniqueness
const validateSlugUniqueness = async (id: string, existingSlug: string, newSlug: string) => {
  if (!newSlug || newSlug === existingSlug) return
  
  const { data: slugCheck, error: slugError } = await supabaseAdmin
    .from('guides')
    .select('id, slug')
    .eq('slug', newSlug)
    .neq('id', id)
    .maybeSingle()
  
  if (slugError) throw slugError
  if (slugCheck) {
    throw new Error(`Slug "${newSlug}" is already in use by guide "${slugCheck.id}". Each guide must have a unique slug.`)
  }
}

// Helper function to log GHC guide updates
const logGHCGuideUpdate = (existingGuide: any, body: any, id: string) => {
  if (body.body && body.body !== existingGuide.body) {
    console.log(`[Admin] GHC Guide Update: ${existingGuide.slug} (ID: ${id})`)
    console.log(`[Admin] Body length changed: ${existingGuide.body?.length || 0} -> ${body.body.length}`)
  }
}

// Helper function to prepare update data
const prepareUpdateData = (body: any): any => {
  const updateData: any = {}
  Object.keys(body).forEach(key => {
    if (body[key] !== undefined && key !== '_diff') {
      updateData[key] = body[key]
    }
  })
  return updateData
}

// Helper function to log guide update
const logGuideUpdate = (id: string, existingSlug: string, newSlug?: string) => {
  const slugChange = newSlug && newSlug !== existingSlug ? ` -> ${newSlug}` : ''
  console.log(`[Admin] Updated guide: id=${id}, slug=${existingSlug}${slugChange}`)
}

// Helper function to create version record
const createVersionRecord = async (id: string, diff?: string) => {
  await supabaseAdmin.from('guides_versions').insert({ 
    guide_id: id, 
    version: 'auto', 
    changed_at: new Date().toISOString(), 
    diff_summary: diff || 'update' 
  })
}

// Helper function to handle PUT requests
const handlePutRequest = async (req: AnyRequest, res: AnyResponse, id: string) => {
  const body = await parseJSONBody(req)
  
  // Fetch and validate existing guide
  const existingGuide = await fetchExistingGuide(id)
  
  // Validate GHC slug changes
  const isGHCGuide = validateGHCSlugChange(existingGuide, body)
  
  // Validate slug uniqueness
  await validateSlugUniqueness(id, existingGuide.slug, body.slug)
  
  // Log GHC guide updates if applicable
  if (isGHCGuide) {
    logGHCGuideUpdate(existingGuide, body, id)
  }
  
  // Prepare and execute update
  const updateData = prepareUpdateData(body)
  const { error } = await supabaseAdmin
    .from('guides')
    .update(updateData)
    .eq('id', id)
  
  if (error) throw error
  
  // Log update and create version record
  logGuideUpdate(id, existingGuide.slug, body.slug)
  await createVersionRecord(id, body._diff)
  
  res.status?.(200)
  res.json?.({ ok: true })
}

// Helper function to handle DELETE requests
const handleDeleteRequest = async (req: AnyRequest, res: AnyResponse, id: string) => {
  const { error } = await supabaseAdmin.from('guides').delete().eq('id', id)
  if (error) throw error
  
  res.status?.(200)
  res.json?.({ ok: true })
}

// Helper function to send error response
const sendErrorResponse = (res: AnyResponse, status: number, message: string) => {
  res.status?.(status)
  res.json?.({ error: message })
}

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    const id = extractGuideId(req)

    if (req.method === 'PUT') {
      await handlePutRequest(req, res, id)
      return
    }
    
    if (req.method === 'DELETE') {
      await handleDeleteRequest(req, res, id)
      return
    }
    
    sendErrorResponse(res, 405, 'Method not allowed')
  } catch (e: any) {
    if (e.message === 'Guide not found') {
      sendErrorResponse(res, 404, e.message)
    } else {
      sendErrorResponse(res, 400, e.message)
    }
  }
}

