// scripts/restore-guidelines.js
// Restore some guides to Guidelines (but keep original Blueprints)
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const GUIDELINES_GUIDE_TYPES = ['Best Practice', 'Policy', 'Process', 'SOP']

// Guides that should be Guidelines (not Blueprints)
const GUIDELINES_GUIDES = [
  { title: 'Meetings & Sessions Optimization', unit: 'Deals', guideType: 'Best Practice' },
  { title: 'Stakeholder Catalog Guidelines', unit: 'Stories', guideType: 'Best Practice' },
  { title: 'Client Session Guidelines', unit: 'Solutions', guideType: 'Best Practice' },
  { title: 'ATP Guidelines', unit: 'DQ Delivery (Deploys)', guideType: 'Best Practice' },
  { title: 'Agile Working Guidelines', unit: 'DQ Delivery (Designs)', guideType: 'Policy' },
  { title: 'DBP Support Guidelines', unit: 'Finance', guideType: 'Process' },
  { title: 'Proposal & Projects Commercial Guidelines', unit: 'HRA', guideType: 'SOP' },
  { title: 'Task | Azure DevOps Guidelines', unit: 'SecDevOps', guideType: 'Best Practice' },
  { title: 'DQ Forum Guidelines', unit: 'DQ Delivery (Accounts)', guideType: 'Best Practice' }
]

async function main() {
  console.log('Restoring Guidelines guides...\n')
  
  // Get all guides
  const { data: allGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit, function_area')
    .eq('status', 'Approved')
  
  // Find guides by title and convert to Guidelines
  for (const targetGuide of GUIDELINES_GUIDES) {
    const guide = (allGuides || []).find(g => g.title === targetGuide.title)
    
    if (guide) {
      try {
        const { error } = await sb
          .from('guides')
          .update({
            domain: null, // Clear domain to make it Guidelines
            guide_type: targetGuide.guideType,
            unit: targetGuide.unit,
            function_area: targetGuide.unit
          })
          .eq('id', guide.id)
        
        if (error) {
          console.error(`  ✗ ${targetGuide.title}: ${error.message}`)
        } else {
          console.log(`  ✓ Restored ${targetGuide.title} to Guidelines`)
        }
      } catch (err) {
        console.error(`  ✗ ${targetGuide.title}: ${err.message}`)
      }
    } else {
      console.log(`  ⚠ ${targetGuide.title}: Not found`)
    }
  }
  
  // Verify
  const { data: finalGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit')
    .eq('status', 'Approved')
  
  const guidelines = (finalGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return !d.includes('strategy') && !d.includes('blueprint') && !d.includes('testimonial') &&
           !gt.includes('strategy') && !gt.includes('blueprint') && !gt.includes('testimonial')
  })
  
  const blueprints = (finalGuides || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })
  
  console.log(`\n✓ Guidelines guides: ${guidelines.length}`)
  console.log(`✓ Blueprint guides: ${blueprints.length}`)
}

main().catch(console.error)

