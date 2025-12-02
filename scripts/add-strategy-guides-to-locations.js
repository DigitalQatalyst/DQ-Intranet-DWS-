// scripts/add-strategy-guides-to-locations.js
// Add strategy guides to DXB and KSA locations
// Usage: node scripts/add-strategy-guides-to-locations.js

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

// Unit mapping
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

// Strategy guides to add for each location
const LOCATION_GUIDES = {
  'DXB': [
    { unit: 'deals', title: 'DXB Deals Strategy', summary: 'Strategic approach to deal management in Dubai' },
    { unit: 'dq-delivery-accounts', title: 'DXB Account Management', summary: 'Account management strategy for Dubai operations' },
    { unit: 'finance', title: 'DXB Financial Planning', summary: 'Financial strategy and planning for Dubai' },
    { unit: 'products', title: 'DXB Product Strategy', summary: 'Product development strategy for Dubai market' },
    { unit: 'solutions', title: 'DXB Solutions Framework', summary: 'Solutions strategy for Dubai clients' },
    { unit: 'intelligence', title: 'DXB Intelligence Strategy', summary: 'Intelligence and analytics strategy for Dubai' }
  ],
  'KSA': [
    { unit: 'deals', title: 'KSA Deals Strategy', summary: 'Strategic approach to deal management in Saudi Arabia' },
    { unit: 'dq-delivery-accounts', title: 'KSA Account Management', summary: 'Account management strategy for KSA operations' },
    { unit: 'finance', title: 'KSA Financial Planning', summary: 'Financial strategy and planning for Saudi Arabia' },
    { unit: 'products', title: 'KSA Product Strategy', summary: 'Product development strategy for KSA market' },
    { unit: 'solutions', title: 'KSA Solutions Framework', summary: 'Solutions strategy for KSA clients' },
    { unit: 'intelligence', title: 'KSA Intelligence Strategy', summary: 'Intelligence and analytics strategy for KSA' }
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

async function checkLocationGuides(location) {
  console.log(`\nChecking strategy guides for ${location}...`)
  
  const { data, error } = await sb
    .from('guides')
    .select('id, title, location, unit, function_area')
    .or(`domain.ilike.%Strategy%,guide_type.ilike.%Strategy%`)
    .eq('status', 'Approved')
    .ilike('location', location)
  
  if (error) {
    console.error(`Error checking ${location}:`, error)
    return []
  }
  
  return data || []
}

async function addGuidesToLocation(location, guides) {
  console.log(`\nAdding ${guides.length} strategy guides to ${location}...`)
  
  const now = new Date().toISOString()
  const guidesToAdd = []
  
  for (const guideTemplate of guides) {
    const unitName = UNIT_MAPPING[guideTemplate.unit] || guideTemplate.unit
    const slug = slugify(`${guideTemplate.title}-${location.toLowerCase()}`)
    
    // Check if guide with this slug already exists
    const { data: existing } = await sb
      .from('guides')
      .select('id')
      .eq('slug', slug)
      .single()
    
    if (existing) {
      console.log(`  ⚠ Guide "${guideTemplate.title}" already exists, skipping...`)
      continue
    }
    
    guidesToAdd.push({
      slug,
      title: guideTemplate.title,
      summary: guideTemplate.summary,
      domain: 'Strategy',
      guide_type: 'Strategy',
      unit: unitName,
      function_area: unitName,
      location: location,
      status: 'Approved',
      last_updated_at: now,
      body: `# ${guideTemplate.title}\n\n${guideTemplate.summary}\n\nThis guide provides strategic insights and best practices for ${location} operations.`,
      download_count: 0,
      is_editors_pick: false
    })
    
    console.log(`  + Adding "${guideTemplate.title}" for ${location} (${unitName})`)
  }
  
  if (guidesToAdd.length === 0) {
    console.log(`\nNo new guides to add for ${location}.`)
    return 0
  }
  
  console.log(`\nInserting ${guidesToAdd.length} guides for ${location}...`)
  
  const { data, error } = await sb
    .from('guides')
    .insert(guidesToAdd)
    .select()
  
  if (error) {
    console.error(`Error inserting guides for ${location}:`, error)
    return 0
  }
  
  console.log(`✓ Successfully added ${data.length} guides for ${location}!`)
  return data.length
}

async function main() {
  try {
    // Check existing guides for each location
    const dxbGuides = await checkLocationGuides('DXB')
    const ksaGuides = await checkLocationGuides('KSA')
    const nboGuides = await checkLocationGuides('NBO')
    
    console.log(`\nCurrent guide counts:`)
    console.log(`  DXB: ${dxbGuides.length} guides`)
    console.log(`  KSA: ${ksaGuides.length} guides`)
    console.log(`  NBO: ${nboGuides.length} guides`)
    
    // Add guides to DXB
    if (dxbGuides.length === 0) {
      console.log(`\n${'='.repeat(50)}`)
      console.log(`Adding guides to DXB...`)
      console.log(`${'='.repeat(50)}`)
      await addGuidesToLocation('DXB', LOCATION_GUIDES.DXB)
    } else {
      console.log(`\nDXB already has ${dxbGuides.length} guides. Skipping.`)
    }
    
    // Add guides to KSA
    if (ksaGuides.length === 0) {
      console.log(`\n${'='.repeat(50)}`)
      console.log(`Adding guides to KSA...`)
      console.log(`${'='.repeat(50)}`)
      await addGuidesToLocation('KSA', LOCATION_GUIDES.KSA)
    } else {
      console.log(`\nKSA already has ${ksaGuides.length} guides. Skipping.`)
    }
    
    // Verify final counts
    console.log(`\n${'='.repeat(50)}`)
    console.log(`Final verification:`)
    console.log(`${'='.repeat(50)}`)
    
    const finalDxb = await checkLocationGuides('DXB')
    const finalKsa = await checkLocationGuides('KSA')
    const finalNbo = await checkLocationGuides('NBO')
    
    console.log(`  DXB: ${finalDxb.length} guides`)
    if (finalDxb.length > 0) {
      finalDxb.forEach(g => console.log(`    - ${g.title} (${g.unit || g.function_area || 'N/A'})`))
    }
    
    console.log(`  KSA: ${finalKsa.length} guides`)
    if (finalKsa.length > 0) {
      finalKsa.forEach(g => console.log(`    - ${g.title} (${g.unit || g.function_area || 'N/A'})`))
    }
    
    console.log(`  NBO: ${finalNbo.length} guides`)
    
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

