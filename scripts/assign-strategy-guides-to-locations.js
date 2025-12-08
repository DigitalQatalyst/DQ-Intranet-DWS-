// scripts/assign-strategy-guides-to-locations.js
// Assign existing strategy guides to DXB and KSA locations
// Usage: node scripts/assign-strategy-guides-to-locations.js

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

async function getStrategyGuides() {
  console.log('Fetching all strategy guides from database...\n')
  
  const { data, error } = await sb
    .from('guides')
    .select('id, title, slug, location, unit, function_area, domain, guide_type')
    .or(`domain.ilike.%Strategy%,guide_type.ilike.%Strategy%`)
    .eq('status', 'Approved')
    .order('title')
  
  if (error) {
    console.error('Error fetching strategy guides:', error)
    return []
  }
  
  return data || []
}

async function checkLocationGuides(location) {
  const { data, error } = await sb
    .from('guides')
    .select('id, title, location')
    .or(`domain.ilike.%Strategy%,guide_type.ilike.%Strategy%`)
    .eq('status', 'Approved')
    .ilike('location', location)
  
  if (error) {
    console.error(`Error checking ${location}:`, error)
    return []
  }
  
  return data || []
}

async function assignGuidesToLocation(guides, location, excludeIds = []) {
  console.log(`\nAssigning guides to ${location}...`)
  
  // Filter guides that don't already have a location assigned and aren't in the exclude list
  const guidesToUpdate = guides.filter(g => {
    const currentLocation = (g.location || '').trim()
    const hasLocation = currentLocation && currentLocation.toUpperCase() !== ''
    const isExcluded = excludeIds.includes(g.id)
    return !hasLocation && !isExcluded
  })
  
  if (guidesToUpdate.length === 0) {
    console.log(`  No guides available to assign to ${location} (all already have locations or are excluded).`)
    return { assigned: 0, assignedIds: [] }
  }
  
  // Assign up to 6 guides that don't have any location
  const guidesToAssign = guidesToUpdate.slice(0, 6)
  
  console.log(`  Assigning ${guidesToAssign.length} guides to ${location}:`)
  
  const assignedIds = []
  for (const guide of guidesToAssign) {
    const { error } = await sb
      .from('guides')
      .update({ location: location })
      .eq('id', guide.id)
    
    if (error) {
      console.error(`    ✗ Error updating "${guide.title}":`, error.message)
    } else {
      console.log(`    ✓ Assigned "${guide.title}" to ${location}`)
      assignedIds.push(guide.id)
    }
  }
  
  return { assigned: assignedIds.length, assignedIds }
}

async function main() {
  try {
    // Get all strategy guides
    const allGuides = await getStrategyGuides()
    console.log(`Found ${allGuides.length} strategy guides in database\n`)
    
    if (allGuides.length === 0) {
      console.log('No strategy guides found in database.')
      return
    }
    
    // Show current distribution
    const dxbGuides = await checkLocationGuides('DXB')
    const ksaGuides = await checkLocationGuides('KSA')
    const nboGuides = await checkLocationGuides('NBO')
    const noLocationGuides = allGuides.filter(g => !g.location || g.location.trim() === '')
    
    console.log('Current location distribution:')
    console.log(`  DXB: ${dxbGuides.length} guides`)
    console.log(`  KSA: ${ksaGuides.length} guides`)
    console.log(`  NBO: ${nboGuides.length} guides`)
    console.log(`  No location: ${noLocationGuides.length} guides`)
    
    // Show some example guides
    if (allGuides.length > 0) {
      console.log(`\nExample strategy guides in database:`)
      allGuides.slice(0, 10).forEach(g => {
        console.log(`  - ${g.title} (Location: ${g.location || 'None'}, Unit: ${g.unit || g.function_area || 'N/A'})`)
      })
      if (allGuides.length > 10) {
        console.log(`  ... and ${allGuides.length - 10} more`)
      }
    }
    
    // Assign guides to DXB first
    console.log(`\n${'='.repeat(50)}`)
    const dxbResult = await assignGuidesToLocation(allGuides, 'DXB')
    
    // Assign guides to KSA, excluding the ones already assigned to DXB
    console.log(`\n${'='.repeat(50)}`)
    const ksaResult = await assignGuidesToLocation(allGuides, 'KSA', dxbResult.assignedIds)
    
    // Verify final distribution
    console.log(`\n${'='.repeat(50)}`)
    console.log('Final location distribution:')
    console.log(`${'='.repeat(50)}`)
    
    const finalDxb = await checkLocationGuides('DXB')
    const finalKsa = await checkLocationGuides('KSA')
    const finalNbo = await checkLocationGuides('NBO')
    
    console.log(`  DXB: ${finalDxb.length} guides`)
    if (finalDxb.length > 0) {
      finalDxb.slice(0, 5).forEach(g => console.log(`    - ${g.title}`))
      if (finalDxb.length > 5) console.log(`    ... and ${finalDxb.length - 5} more`)
    }
    
    console.log(`  KSA: ${finalKsa.length} guides`)
    if (finalKsa.length > 0) {
      finalKsa.slice(0, 5).forEach(g => console.log(`    - ${g.title}`))
      if (finalKsa.length > 5) console.log(`    ... and ${finalKsa.length - 5} more`)
    }
    
    console.log(`  NBO: ${finalNbo.length} guides`)
    
    console.log(`\n✓ Done! Assigned ${dxbResult.assigned} guides to DXB and ${ksaResult.assigned} guides to KSA.`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

