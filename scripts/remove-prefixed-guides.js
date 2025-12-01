// scripts/remove-prefixed-guides.js
// Remove guides with DXB/KSA prefixes that were incorrectly created
// Usage: node scripts/remove-prefixed-guides.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY envs. Aborting.')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

async function removePrefixedGuides() {
  console.log('Finding guides with DXB/KSA prefixes...\n')
  
  // Find guides with titles starting with DXB or KSA
  const { data, error } = await sb
    .from('guides')
    .select('id, title, slug, location')
    .or(`title.ilike.DXB%,title.ilike.KSA%`)
    .or(`domain.ilike.%Strategy%,guide_type.ilike.%Strategy%`)
  
  if (error) {
    console.error('Error fetching guides:', error)
    return
  }
  
  if (!data || data.length === 0) {
    console.log('No prefixed guides found.')
    return
  }
  
  console.log(`Found ${data.length} guides with prefixes:`)
  data.forEach(g => console.log(`  - ${g.title} (${g.location || 'No location'})`))
  
  console.log(`\nDeleting ${data.length} guides...`)
  
  const idsToDelete = data.map(g => g.id)
  const { error: deleteError } = await sb
    .from('guides')
    .delete()
    .in('id', idsToDelete)
  
  if (deleteError) {
    console.error('Error deleting guides:', deleteError)
    return
  }
  
  console.log(`✓ Successfully deleted ${data.length} prefixed guides.`)
}

removePrefixedGuides()

