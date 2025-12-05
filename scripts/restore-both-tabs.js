// scripts/restore-both-tabs.js
// Ensure both Guidelines and Blueprints have guides
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

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
  
  // Convert half back to Guidelines
  const toConvert = blueprints.slice(0, Math.floor(blueprints.length / 2))
  
  console.log(`Converting ${toConvert.length} Blueprints back to Guidelines...\n`)
  
  const GUIDELINES_GUIDE_TYPES = ['Best Practice', 'Policy', 'Process', 'SOP']
  
  for (let i = 0; i < toConvert.length; i++) {
    const guide = toConvert[i]
    const guideType = GUIDELINES_GUIDE_TYPES[i % GUIDELINES_GUIDE_TYPES.length]
    
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
        console.log(`  ✓ ${guide.title} → Guidelines`)
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

