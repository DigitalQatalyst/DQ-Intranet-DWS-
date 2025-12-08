// scripts/add-locations-to-guidelines.js
// Add location values to existing Guidelines guides
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const LOCATIONS = ['DXB', 'KSA', 'NBO']

async function main() {
  const { data: allGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, location, unit')
    .eq('status', 'Approved')
  
  const guidelines = (allGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return !d.includes('strategy') && !d.includes('blueprint') && !d.includes('testimonial') &&
           !gt.includes('strategy') && !gt.includes('blueprint') && !gt.includes('testimonial')
  })
  
  console.log(`Found ${guidelines.length} Guidelines guides\n`)
  
  // Distribute guides across locations
  for (let i = 0; i < guidelines.length; i++) {
    const guide = guidelines[i]
    const location = LOCATIONS[i % LOCATIONS.length]
    
    if (!guide.location) {
      try {
        const { error } = await sb
          .from('guides')
          .update({ location: location })
          .eq('id', guide.id)
        
        if (error) {
          console.error(`  ✗ ${guide.title}: ${error.message}`)
        } else {
          console.log(`  ✓ ${guide.title} → ${location}`)
        }
      } catch (err) {
        console.error(`  ✗ ${guide.title}: ${err.message}`)
      }
    } else {
      console.log(`  - ${guide.title}: Already has location (${guide.location})`)
    }
  }
  
  // Verify
  const { data: finalGuides } = await sb
    .from('guides')
    .select('id, title, location, unit, guide_type')
    .eq('status', 'Approved')
  
  const finalGuidelines = (finalGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return !d.includes('strategy') && !d.includes('blueprint') && !d.includes('testimonial') &&
           !gt.includes('strategy') && !gt.includes('blueprint') && !gt.includes('testimonial')
  })
  
  console.log(`\nFinal Guidelines by location:`)
  const byLocation = {}
  finalGuidelines.forEach(g => {
    const loc = g.location || 'None'
    if (!byLocation[loc]) byLocation[loc] = []
    byLocation[loc].push(g.title)
  })
  
  for (const loc of LOCATIONS) {
    const count = (byLocation[loc] || []).length
    console.log(`  ${loc}: ${count} guides`)
  }
}

main().catch(console.error)

