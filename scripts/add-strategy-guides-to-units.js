// scripts/add-strategy-guides-to-units.js
// Add strategy guides to units that don't have any guides
// Usage: node scripts/add-strategy-guides-to-units.js

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

// Unit mapping: filter ID -> database value
const UNIT_MAPPING = {
  'deals': 'Deals',
  'dq-delivery-accounts': 'DQ Delivery (Accounts)',
  'dq-delivery-deploys': 'DQ Delivery (Deploys)',
  'dq-delivery-designs': 'DQ Delivery (Designs)',
  'finance': 'Finance',
  'hra': 'HRA',
  'intelligence': 'Intelligence',
  'products': 'Products',
  'secdevops': 'SecDevOps',
  'solutions': 'Solutions',
  'stories': 'Stories'
}

// Strategy guide templates for each unit
const STRATEGY_GUIDE_TEMPLATES = {
  'deals': [
    { title: 'Deals Strategy Overview', summary: 'Strategic approach to deal management and execution' },
    { title: 'Deals Pipeline Management', summary: 'Best practices for managing and tracking deals pipeline' }
  ],
  'dq-delivery-accounts': [
    { title: 'Account Management Strategy', summary: 'Strategic framework for managing client accounts' },
    { title: 'Account Growth Planning', summary: 'Approach to growing and expanding account relationships' }
  ],
  'dq-delivery-deploys': [
    { title: 'Deployment Strategy Framework', summary: 'Strategic approach to deployment and delivery' },
    { title: 'Deployment Excellence Guide', summary: 'Best practices for successful deployments' }
  ],
  'dq-delivery-designs': [
    { title: 'Design Strategy Overview', summary: 'Strategic approach to design delivery and quality' },
    { title: 'Design Process Optimization', summary: 'Improving design processes and outcomes' }
  ],
  'finance': [
    { title: 'Financial Strategy Overview', summary: 'Strategic financial planning and management' },
    { title: 'Budget Planning Framework', summary: 'Approach to budget planning and allocation' }
  ],
  'hra': [
    { title: 'HRA Strategic Framework', summary: 'Strategic approach to HRA operations' },
    { title: 'HRA Process Excellence', summary: 'Best practices for HRA processes' }
  ],
  'intelligence': [
    { title: 'Intelligence Strategy', summary: 'Strategic approach to intelligence and analytics' },
    { title: 'Data-Driven Decision Making', summary: 'Framework for leveraging intelligence in decisions' }
  ],
  'products': [
    { title: 'Product Strategy Overview', summary: 'Strategic approach to product development' },
    { title: 'Product Roadmap Planning', summary: 'Framework for product roadmap and planning' }
  ],
  'secdevops': [
    { title: 'SecDevOps Strategy', summary: 'Strategic approach to security and DevOps integration' },
    { title: 'Security Best Practices', summary: 'Security framework and best practices' }
  ],
  'solutions': [
    { title: 'Solutions Strategy Framework', summary: 'Strategic approach to solution development' },
    { title: 'Solution Design Excellence', summary: 'Best practices for solution design and delivery' }
  ],
  'stories': [
    { title: 'Storytelling Strategy', summary: 'Strategic approach to storytelling and communication' },
    { title: 'Content Strategy Framework', summary: 'Framework for content and story development' }
  ]
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function checkUnitsWithGuides() {
  console.log('Checking which units have strategy guides...\n')
  
  const unitsWithGuides = {}
  const unitsWithoutGuides = []
  
  // Get all strategy guides once
  const { data: allStrategyGuides, error: strategyError } = await sb
    .from('guides')
    .select('id, unit, function_area')
    .or(`domain.ilike.%Strategy%,guide_type.ilike.%Strategy%`)
    .eq('status', 'Approved')
  
  if (strategyError) {
    console.error('Error fetching strategy guides:', strategyError)
    return []
  }
  
  for (const [unitId, unitName] of Object.entries(UNIT_MAPPING)) {
    // Check if any guide matches this unit (case-insensitive, normalized)
    const normalizedUnitName = unitName.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const normalizedUnitId = unitId.toLowerCase()
    
    const matches = allStrategyGuides && allStrategyGuides.some(guide => {
      const guideUnit = (guide.unit || '').toLowerCase().replace(/[^a-z0-9]/g, '-')
      const guideFunctionArea = (guide.function_area || '').toLowerCase().replace(/[^a-z0-9]/g, '-')
      return guideUnit === normalizedUnitId || 
             guideUnit === normalizedUnitName ||
             guideFunctionArea === normalizedUnitId ||
             guideFunctionArea === normalizedUnitName ||
             guideUnit.includes(normalizedUnitId) ||
             guideFunctionArea.includes(normalizedUnitId)
    })
    
    if (matches) {
      unitsWithGuides[unitId] = unitName
      console.log(`✓ ${unitName}: Has guides`)
    } else {
      unitsWithoutGuides.push({ unitId, unitName })
      console.log(`✗ ${unitName}: No guides found`)
    }
  }
  
  console.log(`\nSummary: ${Object.keys(unitsWithGuides).length} units have guides, ${unitsWithoutGuides.length} units need guides\n`)
  
  return unitsWithoutGuides
}

async function addGuidesToUnits(unitsToFill) {
  console.log('Adding strategy guides to empty units...\n')
  
  const now = new Date().toISOString()
  const guidesToAdd = []
  
  for (const { unitId, unitName } of unitsToFill) {
    const templates = STRATEGY_GUIDE_TEMPLATES[unitId] || []
    
    for (const template of templates) {
      const slug = slugify(`${template.title}-${unitId}`)
      
      // Check if guide with this slug already exists
      const { data: existing } = await sb
        .from('guides')
        .select('id')
        .eq('slug', slug)
        .single()
      
      if (existing) {
        console.log(`  ⚠ Guide "${template.title}" already exists, skipping...`)
        continue
      }
      
      guidesToAdd.push({
        slug,
        title: template.title,
        summary: template.summary,
        domain: 'Strategy',
        guide_type: 'Strategy',
        unit: unitName,
        function_area: unitName,
        status: 'Approved',
        last_updated_at: now,
        body: `# ${template.title}\n\n${template.summary}\n\nThis guide provides strategic insights and best practices for ${unitName}.`,
        download_count: 0,
        is_editors_pick: false
      })
      
      console.log(`  + Adding "${template.title}" for ${unitName}`)
    }
  }
  
  if (guidesToAdd.length === 0) {
    console.log('\nNo new guides to add.')
    return
  }
  
  console.log(`\nInserting ${guidesToAdd.length} guides...`)
  
  const { data, error } = await sb
    .from('guides')
    .insert(guidesToAdd)
    .select()
  
  if (error) {
    console.error('Error inserting guides:', error)
    return
  }
  
  console.log(`\n✓ Successfully added ${data.length} guides!`)
  
  // Verify the guides were added
  console.log('\nVerifying added guides...')
  for (const { unitId, unitName } of unitsToFill) {
    const { data: strategyData } = await sb
      .from('guides')
      .select('id, title, unit, function_area')
      .or(`domain.ilike.%Strategy%,guide_type.ilike.%Strategy%`)
      .eq('status', 'Approved')
    
    if (strategyData) {
      const normalizedUnitName = unitName.toLowerCase().replace(/[^a-z0-9]/g, '-')
      const normalizedUnitId = unitId.toLowerCase()
      
      const matchingGuides = strategyData.filter(guide => {
        const guideUnit = (guide.unit || '').toLowerCase().replace(/[^a-z0-9]/g, '-')
        const guideFunctionArea = (guide.function_area || '').toLowerCase().replace(/[^a-z0-9]/g, '-')
        return guideUnit === normalizedUnitId || 
               guideUnit === normalizedUnitName ||
               guideFunctionArea === normalizedUnitId ||
               guideFunctionArea === normalizedUnitName ||
               guideUnit.includes(normalizedUnitId) ||
               guideFunctionArea.includes(normalizedUnitId)
      })
      
      if (matchingGuides.length > 0) {
        console.log(`  ✓ ${unitName}: Now has ${matchingGuides.length} guide(s)`)
        matchingGuides.forEach(g => console.log(`    - ${g.title}`))
      }
    }
  }
}

async function main() {
  try {
    const unitsWithoutGuides = await checkUnitsWithGuides()
    
    if (unitsWithoutGuides.length === 0) {
      console.log('All units already have guides!')
      return
    }
    
    await addGuidesToUnits(unitsWithoutGuides)
    
    console.log('\n✓ Done!')
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

