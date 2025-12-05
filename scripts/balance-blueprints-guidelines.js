// scripts/balance-blueprints-guidelines.js
// Balance guides between Blueprints and Guidelines
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

// Guides that should definitely be Blueprints (keep as Blueprints)
const KEEP_AS_BLUEPRINTS = [
  'Blueprint Management Guidelines',
  'Visual Assets for Social Media — Design Rules'
]

async function main() {
  const { data: allGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit, function_area')
    .eq('status', 'Approved')
  
  const blueprints = (allGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })
  
  console.log(`Current Blueprints: ${blueprints.length}`)
  
  // Convert some back to Guidelines (except the ones that should stay Blueprints)
  const toConvert = blueprints.filter(g => !KEEP_AS_BLUEPRINTS.includes(g.title))
  
  console.log(`\nConverting ${toConvert.length} guides back to Guidelines...\n`)
  
  const GUIDELINES_GUIDE_TYPES = ['Best Practice', 'Policy', 'Process', 'SOP']
  let index = 0
  
  for (const guide of toConvert.slice(0, 9)) { // Keep 2 as Blueprints, convert 9 to Guidelines
    const guideType = GUIDELINES_GUIDE_TYPES[index % GUIDELINES_GUIDE_TYPES.length]
    
    try {
      const { error } = await sb
        .from('guides')
        .update({
          domain: null,
          guide_type: guideType
        })
        .eq('id', guide.id)
      
      if (error) {
        console.error(`  ✗ ${guide.title}: ${error.message}`)
      } else {
        console.log(`  ✓ ${guide.title} → Guidelines (${guideType})`)
        index++
      }
    } catch (err) {
      console.error(`  ✗ ${guide.title}: ${err.message}`)
    }
  }
  
  // Final check
  const { data: finalGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit')
    .eq('status', 'Approved')
  
  const finalGuidelines = (finalGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return !d.includes('strategy') && !d.includes('blueprint') && !d.includes('testimonial') &&
           !gt.includes('strategy') && !gt.includes('blueprint') && !gt.includes('testimonial')
  })
  
  const finalBlueprints = (finalGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })
  
  console.log(`\n✓ Guidelines: ${finalGuidelines.length} guides`)
  console.log(`✓ Blueprints: ${finalBlueprints.length} guides`)
}

main().catch(console.error)

