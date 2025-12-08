import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

function extractListItems(md) {
  const out = []
  const lines = String(md||'').split('\n')
  for (let i=0;i<lines.length;i++) {
    const raw = lines[i]
    const l = raw.trim()
    if (/^[-*+]\s+/.test(l)) {
      out.push(l.replace(/^[-*+]\s+/, '').trim())
      continue
    }
    // HTML list fallback
    const m = l.match(/^<li[^>]*>([\s\S]*?)<\/li>\s*$/i)
    if (m) {
      const text = m[1].replace(/<[^>]+>/g,'').trim()
      if (text) out.push(text)
    }
  }
  return out
}

async function main() {
  const title = 'DWS Blueprint'
  const { data, error } = await sb
    .from('guides')
    .select('id,title,domain,guide_type,body')
    .eq('status','Approved')
    .eq('title', title)
    .maybeSingle()
  if (error) throw error
  if (!data) { console.log('⚠️ Not found:', title); return }
  const items = extractListItems(data.body || '')
  console.log(JSON.stringify({ count: items.length, items }, null, 2))
}

main().catch(err => { console.error('❌ Error:', err?.message || err); process.exit(1) })
