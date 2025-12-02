// scripts/check-guidelines-files.js
// Check if specific guidelines exist in the database
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const GUIDELINES_TO_CHECK = [
  'Forum Guidelines',
  'DQ Forum Guidelines',
  'DQ Agenda & Scheduling Guidelines',
  'Agenda & Scheduling Guidelines',
  'Scheduling Guidelines',
  'DQ Functional Tracker Guidelines',
  'Functional Tracker Guidelines',
  'RAID Guidelines'
]

async function main() {
  const { data: allGuides } = await sb
    .from('guides')
    .select('id, title, summary, body, guide_type, domain, unit, location')
    .eq('status', 'Approved')
  
  console.log('Searching for guidelines...\n')
  
  for (const guidelineName of GUIDELINES_TO_CHECK) {
    const matching = (allGuides || []).filter(g => {
      const title = (g.title || '').toLowerCase()
      const searchTerm = guidelineName.toLowerCase()
      // Check if title contains the search term or vice versa
      return title.includes(searchTerm) || searchTerm.includes(title)
    })
    
    if (matching.length > 0) {
      console.log(`✓ Found "${guidelineName}":`)
      matching.forEach(g => {
        console.log(`  - ${g.title}`)
        console.log(`    Guide Type: ${g.guide_type || 'N/A'}`)
        console.log(`    Domain: ${g.domain || 'N/A'}`)
        console.log(`    Unit: ${g.unit || g.function_area || 'N/A'}`)
        console.log(`    Location: ${g.location || 'N/A'}`)
        console.log(`    Summary: ${g.summary ? (g.summary.substring(0, 150) + '...') : 'N/A'}`)
        console.log('')
      })
    } else {
      console.log(`✗ Not found: "${guidelineName}"\n`)
    }
  }
  
  // Also search for any guides with "Forum", "Agenda", "Scheduling", "Tracker", or "RAID" in title
  console.log('\nSearching for guides with related keywords...\n')
  const keywords = ['forum', 'agenda', 'scheduling', 'tracker', 'raid']
  const relatedGuides = (allGuides || []).filter(g => {
    const title = (g.title || '').toLowerCase()
    return keywords.some(keyword => title.includes(keyword))
  })
  
  if (relatedGuides.length > 0) {
    console.log(`Found ${relatedGuides.length} related guides:\n`)
    relatedGuides.forEach(g => {
      console.log(`  - ${g.title}`)
      console.log(`    Guide Type: ${g.guide_type || 'N/A'}`)
      console.log(`    Domain: ${g.domain || 'N/A'}`)
      console.log(`    Unit: ${g.unit || g.function_area || 'N/A'}`)
      console.log('')
    })
  } else {
    console.log('No guides found with related keywords')
  }
}

main().catch(console.error)


