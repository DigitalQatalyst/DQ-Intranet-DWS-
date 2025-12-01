// scripts/create-blueprint-guides.js
// Create Blueprint guides for all required units and guide types
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const BLUEPRINT_GUIDES = [
  { title: 'Blueprint: Deals Process Framework', unit: 'Deals', guideType: 'Process', summary: 'Standardized process framework for deals management and execution.' },
  { title: 'Blueprint: Accounts Delivery Best Practices', unit: 'DQ Delivery (Accounts)', guideType: 'Best practice', summary: 'Best practices for account delivery and client management.' },
  { title: 'Blueprint: Deployment SOP', unit: 'DQ Delivery (Deploys)', guideType: 'SOP', summary: 'Standard operating procedures for deployment processes.' },
  { title: 'Blueprint: Design System Policy', unit: 'DQ Delivery (Designs)', guideType: 'Policy', summary: 'Policy guidelines for design system implementation.' },
  { title: 'Blueprint: Financial Process Guidelines', unit: 'Finance', guideType: 'Process', summary: 'Financial processes and procedures blueprint.' },
  { title: 'Blueprint: HRA Policy Framework', unit: 'HRA', guideType: 'Policy', summary: 'Human Resources Administration policy framework.' },
  { title: 'Blueprint: Intelligence Best Practices', unit: 'Intelligence', guideType: 'Best practice', summary: 'Best practices for intelligence and analytics.' },
  { title: 'Blueprint: Product Development SOP', unit: 'Products', guideType: 'SOP', summary: 'Standard operating procedures for product development.' },
  { title: 'Blueprint: SecDevOps Process', unit: 'SecDevOps', guideType: 'Process', summary: 'Security and DevOps process blueprint.' },
  { title: 'Blueprint: Solutions Architecture Best Practice', unit: 'Solutions', guideType: 'Best practice', summary: 'Best practices for solutions architecture.' },
  { title: 'Blueprint: Stories Framework', unit: 'Stories', guideType: 'Process', summary: 'Framework for story management and documentation.' }
]

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function main() {
  console.log('Creating Blueprint guides...\n')
  
  for (const guide of BLUEPRINT_GUIDES) {
    const slug = slugify(guide.title)
    
    try {
      const { error } = await sb
        .from('guides')
        .insert({
          slug: slug,
          title: guide.title,
          summary: guide.summary,
          domain: 'Blueprint',
          guide_type: guide.guideType,
          unit: guide.unit,
          function_area: guide.unit,
          status: 'Approved'
        })
      
      if (error) {
        if (error.code === '23505' || error.message.includes('unique')) {
          // Update existing
          const { error: updateError } = await sb
            .from('guides')
            .update({
              title: guide.title,
              summary: guide.summary,
              domain: 'Blueprint',
              guide_type: guide.guideType,
              unit: guide.unit,
              function_area: guide.unit,
              status: 'Approved'
            })
            .eq('slug', slug)
          
          if (updateError) {
            console.error(`  ✗ ${guide.title}: ${updateError.message}`)
          } else {
            console.log(`  ✓ Updated ${guide.title}`)
          }
        } else {
          console.error(`  ✗ ${guide.title}: ${error.message}`)
        }
      } else {
        console.log(`  ✓ Created ${guide.title}`)
      }
    } catch (err) {
      console.error(`  ✗ ${guide.title}: ${err.message}`)
    }
  }
  
  // Verify
  const { data } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit')
    .eq('status', 'Approved')
  
  const blueprints = (data || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })
  
  console.log(`\n✓ Total Blueprint guides: ${blueprints.length}`)
}

main().catch(console.error)

