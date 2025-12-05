// scripts/create-blueprints-from-existing.js
// Create Blueprint guides using existing guides (duplicate them, don't convert)
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import { randomUUID } from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const BLUEPRINT_GUIDE_TYPES = ['Best practice', 'Policy', 'Process', 'SOP']
const REQUIRED_UNITS = [
  'Deals', 'DQ Delivery (Accounts)', 'DQ Delivery (Deploys)', 'DQ Delivery (Designs)',
  'Finance', 'HRA', 'Intelligence', 'Products', 'SecDevOps', 'Solutions', 'Stories'
]
const REQUIRED_LOCATIONS = ['DXB', 'KSA', 'NBO']

function slugify(text) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function main() {
  // Get existing guides to use as templates
  const { data: existingGuides } = await sb
    .from('guides')
    .select('id, title, summary, body, slug')
    .eq('status', 'Approved')
    .limit(20)
  
  console.log(`Found ${existingGuides?.length || 0} existing guides to use as templates\n`)
  
  // Create Blueprint guides for each unit
  const blueprintsToCreate = []
  
  for (let i = 0; i < REQUIRED_UNITS.length; i++) {
    const unit = REQUIRED_UNITS[i]
    const guideType = BLUEPRINT_GUIDE_TYPES[i % BLUEPRINT_GUIDE_TYPES.length]
    const location = REQUIRED_LOCATIONS[i % REQUIRED_LOCATIONS.length]
    
    // Use an existing guide as template
    const template = existingGuides?.[i % (existingGuides?.length || 1)]
    const title = template 
      ? `Blueprint: ${template.title.replace(/^Blueprint: /i, '')}`
      : `Blueprint: ${unit} ${guideType}`
    
    blueprintsToCreate.push({
      title,
      unit,
      guideType,
      location,
      summary: template?.summary || `Blueprint guide for ${unit} - ${guideType}`,
      body: template?.body || `This is a blueprint guide for ${unit} following ${guideType} standards.`
    })
  }
  
  console.log(`Creating ${blueprintsToCreate.length} Blueprint guides...\n`)
  
  for (const bp of blueprintsToCreate) {
    const slug = `blueprint-${slugify(bp.title)}-${randomUUID().substring(0, 8)}`
    
    try {
      const { error } = await sb
        .from('guides')
        .insert({
          slug: slug,
          title: bp.title,
          summary: bp.summary,
          body: bp.body,
          domain: 'Blueprint',
          guide_type: bp.guideType,
          unit: bp.unit,
          function_area: bp.unit,
          location: bp.location,
          status: 'Approved'
        })
      
      if (error) {
        console.error(`  ✗ ${bp.title}: ${error.message}`)
      } else {
        console.log(`  ✓ Created: ${bp.title} (${bp.unit}, ${bp.location}, ${bp.guideType})`)
      }
    } catch (err) {
      console.error(`  ✗ ${bp.title}: ${err.message}`)
    }
  }
  
  // Verify
  const { data: finalBlueprints } = await sb
    .from('guides')
    .select('id, title, guide_type, unit, location')
    .eq('status', 'Approved')
  
  const blueprints = (finalBlueprints || []).filter(g => {
    const d = (g.domain || '').toLowerCase()
    const gt = (g.guide_type || '').toLowerCase()
    return d.includes('blueprint') || gt.includes('blueprint')
  })
  
  console.log(`\n✅ Final Blueprint guides: ${blueprints.length}`)
  
  // Summary
  const byType = {}
  blueprints.forEach(g => {
    const type = g.guide_type || 'None'
    if (!byType[type]) byType[type] = []
    byType[type].push(g.title)
  })
  
  console.log('\nBy Guide Type:')
  for (const type of BLUEPRINT_GUIDE_TYPES) {
    const count = (byType[type] || []).length
    console.log(`  ${type}: ${count} guides`)
  }
  
  const byUnit = {}
  blueprints.forEach(g => {
    const unit = g.unit || g.function_area || 'None'
    if (!byUnit[unit]) byUnit[unit] = []
    byUnit[unit].push(g.title)
  })
  
  console.log('\nBy Unit:')
  for (const unit of REQUIRED_UNITS) {
    const count = (byUnit[unit] || []).length
    console.log(`  ${unit}: ${count} guides`)
  }
  
  const byLocation = {}
  blueprints.forEach(g => {
    const loc = g.location || 'None'
    if (!byLocation[loc]) byLocation[loc] = []
    byLocation[loc].push(g.title)
  })
  
  console.log('\nBy Location:')
  for (const loc of REQUIRED_LOCATIONS) {
    const count = (byLocation[loc] || []).length
    console.log(`  ${loc}: ${count} guides`)
  }
}

main().catch(console.error)

