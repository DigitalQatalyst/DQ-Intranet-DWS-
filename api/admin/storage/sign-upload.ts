import { supabaseAdmin } from '../../lib/supabaseAdmin'

type AnyRequest = { method?: string; headers: Record<string,string|undefined>; url?: string; [k:string]: any }
type AnyResponse = { status?: (c:number)=>AnyResponse; json?: (b:any)=>void }

export default async function handler(req: AnyRequest, res: AnyResponse) {
  try {
    const host = req.headers.host || 'localhost'
    const proto = (req.headers as any)['x-forwarded-proto'] || 'https'
    const url = new URL(`${proto}://${host}${req.url}`)
    const bucket = url.searchParams.get('bucket') || 'guide-images'
    const object = url.searchParams.get('object') || `uploads/${Date.now()}`
    const seconds = parseInt(url.searchParams.get('expires') || '300', 10)
    const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUploadUrl(object, { expiresIn: seconds })
    if (error) throw error
    res.status?.(200); res.json?.(data)
  } catch (e: any) {
    res.status?.(500); res.json?.({ error: e?.message || 'Server error' })
  }
}

