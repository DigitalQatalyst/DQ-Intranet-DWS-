import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const fail = (msg) => { console.error(msg); process.exit(1) }

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) fail('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY envs. Aborting.')

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

async function main() {
  console.log('Finding blueprint guide...')
  
  // Find the DWS Blueprint guide
  const { data: guides, error: findError } = await sb
    .from('guides')
    .select('id, slug, title, body')
    .or('domain.ilike.%blueprint%,guide_type.ilike.%blueprint%')
    .limit(5)

  if (findError) {
    console.error('Error finding guides:', findError)
    process.exit(1)
  }

  if (!guides || guides.length === 0) {
    console.log('No blueprint guide found.')
    process.exit(0)
  }

  for (const guide of guides) {
    if (!guide.body) continue
    
    let body = guide.body
    
    // Remove sections that might be in different formats:
    // 1. As H3 headers (###)
    // 2. Inside <details> tags
    // 3. As H2 headers (##)
    
    const sectionsToRemove = [
      'State Management & Data Fetching',
      'State Management',
      'Forms & Validation',
      'Forms and Validation',
      'Content & Rich Text',
      'Content and Rich Text',
      'Maps & Location Services',
      'Maps and Location Services',
      'Data Visualization',
      'Calendars & Scheduling',
      'Calendars and Scheduling',
      'Additional Libraries'
    ]
    
    for (const sectionTitle of sectionsToRemove) {
      // Remove as H3 (###)
      body = body.replace(new RegExp(`###\\s+${sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?(?=###|##|$)`, 'gi'), '')
      
      // Remove inside <details> tags
      body = body.replace(new RegExp(`<details><summary>${sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/summary>[\\s\\S]*?<\\/details>`, 'gi'), '')
      
      // Remove as H2 (##)
      body = body.replace(new RegExp(`##\\s+${sectionTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?(?=##|$)`, 'gi'), '')
    }
    
    // Clean up multiple consecutive newlines
    body = body.replace(/\n{3,}/g, '\n\n')
    
    // Update the guide
    console.log(`Updating guide: ${guide.title} (${guide.slug})`)
    const { data, error } = await sb
      .from('guides')
      .update({ body: body.trim(), last_updated_at: new Date().toISOString() })
      .eq('id', guide.id)
      .select('id')
      .single()
    
    if (error) {
      console.error(`Error updating guide ${guide.slug}:`, error)
    } else {
      console.log(`✓ Updated guide with ID: ${data.id}`)
    }
  }
  
  console.log('Done!')
}

main().catch(err => {
  console.error('Script failed:', err?.message || err)
  process.exit(1)
})

