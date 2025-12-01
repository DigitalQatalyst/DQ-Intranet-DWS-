// scripts/fill-empty-filters-guidelines-blueprints.js
// Check and fill empty filters for Guidelines and Blueprints using existing guides from database
// Usage: node scripts/fill-empty-filters-guidelines-blueprints.js

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

// Filter mappings
const BLUEPRINT_GUIDE_TYPES = ['best-practice', 'policy', 'process', 'sop']
const BLUEPRINT_GUIDE_TYPE_NAMES = {
  'best-practice': 'Best Practice',
  'policy': 'Policy',
  'process': 'Process',
  'sop': 'SOP'
}

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

const LOCATIONS = ['DXB', 'KSA', 'NBO']

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeValue(value) {
  if (!value) return ''
  return value.toLowerCase().replace(/[^a-z0-9]/g, '-')
}

async function checkGuidelinesFilters() {
  console.log('\n' + '='.repeat(60))
  console.log('CHECKING GUIDELINES FILTERS')
  console.log('='.repeat(60))
  
  // Get all guidelines guides
  const { data: allGuides, error } = await sb
    .from('guides')
    .select('id, title, guide_type, unit, function_area, location, domain')
    .eq('status', 'Approved')
  
  if (error) {
    console.error('Error fetching guides:', error)
    return { emptyUnits: [], emptyLocations: [] }
  }
  
  // Filter guidelines (not Strategy, Blueprint, or Testimonial)
  const guidelinesGuides = (allGuides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase()
    const guideType = (g.guide_type || '').toLowerCase()
    return !domain.includes('strategy') && 
           !domain.includes('blueprint') && 
           !domain.includes('testimonial') &&
           !guideType.includes('strategy') &&
           !guideType.includes('blueprint') &&
           !guideType.includes('testimonial')
  })
  
  console.log(`\nFound ${guidelinesGuides.length} guidelines guides in database`)
  
  // Check Units
  console.log('\n--- Checking Units ---')
  const emptyUnits = []
  for (const [unitId, unitName] of Object.entries(UNIT_MAPPING)) {
    const normalizedUnitId = normalizeValue(unitId)
    const normalizedUnitName = normalizeValue(unitName)
    
    const hasGuides = guidelinesGuides.some(g => {
      const guideUnit = normalizeValue(g.unit || g.function_area || '')
      return guideUnit === normalizedUnitId || 
             guideUnit === normalizedUnitName ||
             guideUnit.includes(normalizedUnitId) ||
             normalizedUnitName.includes(guideUnit)
    })
    
    if (hasGuides) {
      const count = guidelinesGuides.filter(g => {
        const guideUnit = normalizeValue(g.unit || g.function_area || '')
        return guideUnit === normalizedUnitId || 
               guideUnit === normalizedUnitName ||
               guideUnit.includes(normalizedUnitId) ||
               normalizedUnitName.includes(guideUnit)
      }).length
      console.log(`  ✓ ${unitName}: ${count} guides`)
    } else {
      console.log(`  ✗ ${unitName}: No guides`)
      emptyUnits.push({ unitId, unitName })
    }
  }
  
  // Check Locations
  console.log('\n--- Checking Locations ---')
  const emptyLocations = []
  for (const location of LOCATIONS) {
    const hasGuides = guidelinesGuides.some(g => 
      (g.location || '').toUpperCase() === location
    )
    
    if (hasGuides) {
      const count = guidelinesGuides.filter(g => 
        (g.location || '').toUpperCase() === location
      ).length
      console.log(`  ✓ ${location}: ${count} guides`)
    } else {
      console.log(`  ✗ ${location}: No guides`)
      emptyLocations.push(location)
    }
  }
  
  return { emptyUnits, emptyLocations, guidelinesGuides }
}

async function checkBlueprintsFilters() {
  console.log('\n' + '='.repeat(60))
  console.log('CHECKING BLUEPRINTS FILTERS')
  console.log('='.repeat(60))
  
  // Get all blueprint guides
  const { data: allGuides, error } = await sb
    .from('guides')
    .select('id, title, guide_type, unit, function_area, location, domain')
    .eq('status', 'Approved')
  
  if (error) {
    console.error('Error fetching guides:', error)
    return { emptyGuideTypes: [], emptyUnits: [], emptyLocations: [] }
  }
  
  // Filter blueprints
  const blueprintGuides = (allGuides || []).filter(g => {
    const domain = (g.domain || '').toLowerCase()
    const guideType = (g.guide_type || '').toLowerCase()
    return domain.includes('blueprint') || guideType.includes('blueprint')
  })
  
  console.log(`\nFound ${blueprintGuides.length} blueprint guides in database`)
  
  // Check Guide Types
  console.log('\n--- Checking Guide Types ---')
  const emptyGuideTypes = []
  for (const guideTypeId of BLUEPRINT_GUIDE_TYPES) {
    const normalizedTypeId = normalizeValue(guideTypeId)
    const typeName = BLUEPRINT_GUIDE_TYPE_NAMES[guideTypeId]
    
    const hasGuides = blueprintGuides.some(g => {
      const guideType = normalizeValue(g.guide_type || '')
      return guideType === normalizedTypeId || 
             guideType.includes(normalizedTypeId) ||
             normalizedTypeId.includes(guideType)
    })
    
    if (hasGuides) {
      const count = blueprintGuides.filter(g => {
        const guideType = normalizeValue(g.guide_type || '')
        return guideType === normalizedTypeId || 
               guideType.includes(normalizedTypeId) ||
               normalizedTypeId.includes(guideType)
      }).length
      console.log(`  ✓ ${typeName}: ${count} guides`)
    } else {
      console.log(`  ✗ ${typeName}: No guides`)
      emptyGuideTypes.push({ guideTypeId, typeName })
    }
  }
  
  // Check Units
  console.log('\n--- Checking Units ---')
  const emptyUnits = []
  for (const [unitId, unitName] of Object.entries(UNIT_MAPPING)) {
    const normalizedUnitId = normalizeValue(unitId)
    const normalizedUnitName = normalizeValue(unitName)
    
    const hasGuides = blueprintGuides.some(g => {
      const guideUnit = normalizeValue(g.unit || g.function_area || '')
      return guideUnit === normalizedUnitId || 
             guideUnit === normalizedUnitName ||
             guideUnit.includes(normalizedUnitId) ||
             normalizedUnitName.includes(guideUnit)
    })
    
    if (hasGuides) {
      const count = blueprintGuides.filter(g => {
        const guideUnit = normalizeValue(g.unit || g.function_area || '')
        return guideUnit === normalizedUnitId || 
               guideUnit === normalizedUnitName ||
               guideUnit.includes(normalizedUnitId) ||
               normalizedUnitName.includes(guideUnit)
      }).length
      console.log(`  ✓ ${unitName}: ${count} guides`)
    } else {
      console.log(`  ✗ ${unitName}: No guides`)
      emptyUnits.push({ unitId, unitName })
    }
  }
  
  // Check Locations
  console.log('\n--- Checking Locations ---')
  const emptyLocations = []
  for (const location of LOCATIONS) {
    const hasGuides = blueprintGuides.some(g => 
      (g.location || '').toUpperCase() === location
    )
    
    if (hasGuides) {
      const count = blueprintGuides.filter(g => 
        (g.location || '').toUpperCase() === location
      ).length
      console.log(`  ✓ ${location}: ${count} guides`)
    } else {
      console.log(`  ✗ ${location}: No guides`)
      emptyLocations.push(location)
    }
  }
  
  return { emptyGuideTypes, emptyUnits, emptyLocations, blueprintGuides }
}

async function assignGuidesToEmptyFilters(category, emptyFilters, availableGuides) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`ASSIGNING GUIDES TO EMPTY ${category.toUpperCase()} FILTERS`)
  console.log('='.repeat(60))
  
  let totalAssigned = 0
  
  // Assign guides to empty units
  if (emptyFilters.emptyUnits && emptyFilters.emptyUnits.length > 0) {
    console.log(`\nAssigning guides to empty units...`)
    for (const { unitId, unitName } of emptyFilters.emptyUnits) {
      // Find guides without this unit that can be assigned
      const guidesToAssign = availableGuides
        .filter(g => {
          const currentUnit = normalizeValue(g.unit || g.function_area || '')
          const normalizedUnitId = normalizeValue(unitId)
          const normalizedUnitName = normalizeValue(unitName)
          return currentUnit !== normalizedUnitId && 
                 currentUnit !== normalizedUnitName &&
                 !currentUnit.includes(normalizedUnitId) &&
                 !normalizedUnitName.includes(currentUnit)
        })
        .slice(0, 2) // Assign 2 guides per empty unit
      
      if (guidesToAssign.length === 0) {
        console.log(`  ⚠ No guides available for ${unitName}`)
        continue
      }
      
      for (const guide of guidesToAssign) {
        const unitValue = UNIT_MAPPING[unitId] || unitName
        const { error } = await sb
          .from('guides')
          .update({ 
            unit: unitValue,
            function_area: unitValue
          })
          .eq('id', guide.id)
        
        if (error) {
          console.error(`    ✗ Error updating "${guide.title}":`, error.message)
        } else {
          console.log(`    ✓ Assigned "${guide.title}" to ${unitName}`)
          totalAssigned++
        }
      }
    }
  }
  
  // Assign guides to empty locations
  if (emptyFilters.emptyLocations && emptyFilters.emptyLocations.length > 0) {
    console.log(`\nAssigning guides to empty locations...`)
    for (const location of emptyFilters.emptyLocations) {
      // Find guides without this location
      const guidesToAssign = availableGuides
        .filter(g => (g.location || '').toUpperCase() !== location)
        .slice(0, 3) // Assign 3 guides per empty location
      
      if (guidesToAssign.length === 0) {
        console.log(`  ⚠ No guides available for ${location}`)
        continue
      }
      
      for (const guide of guidesToAssign) {
        const { error } = await sb
          .from('guides')
          .update({ location: location })
          .eq('id', guide.id)
        
        if (error) {
          console.error(`    ✗ Error updating "${guide.title}":`, error.message)
        } else {
          console.log(`    ✓ Assigned "${guide.title}" to ${location}`)
          totalAssigned++
        }
      }
    }
  }
  
  // Assign guides to empty guide types (for blueprints)
  if (emptyFilters.emptyGuideTypes && emptyFilters.emptyGuideTypes.length > 0) {
    console.log(`\nAssigning guides to empty guide types...`)
    for (const { guideTypeId, typeName } of emptyFilters.emptyGuideTypes) {
      // Find blueprint guides without this guide type
      const guidesToAssign = availableGuides
        .filter(g => {
          const currentType = normalizeValue(g.guide_type || '')
          const normalizedTypeId = normalizeValue(guideTypeId)
          return currentType !== normalizedTypeId && 
                 !currentType.includes(normalizedTypeId) &&
                 !normalizedTypeId.includes(currentType)
        })
        .slice(0, 2) // Assign 2 guides per empty guide type
      
      if (guidesToAssign.length === 0) {
        console.log(`  ⚠ No guides available for ${typeName}`)
        continue
      }
      
      for (const guide of guidesToAssign) {
        const typeValue = typeName
        const { error } = await sb
          .from('guides')
          .update({ guide_type: typeValue })
          .eq('id', guide.id)
        
        if (error) {
          console.error(`    ✗ Error updating "${guide.title}":`, error.message)
        } else {
          console.log(`    ✓ Assigned "${guide.title}" to ${typeName}`)
          totalAssigned++
        }
      }
    }
  }
  
  return totalAssigned
}

async function main() {
  try {
    // Check Guidelines
    const guidelinesResult = await checkGuidelinesFilters()
    
    // Check Blueprints
    const blueprintsResult = await checkBlueprintsFilters()
    
    // Summary
    console.log(`\n${'='.repeat(60)}`)
    console.log('SUMMARY')
    console.log('='.repeat(60))
    console.log(`\nGuidelines:`)
    console.log(`  Empty Units: ${guidelinesResult.emptyUnits.length}`)
    console.log(`  Empty Locations: ${guidelinesResult.emptyLocations.length}`)
    console.log(`\nBlueprints:`)
    console.log(`  Empty Guide Types: ${blueprintsResult.emptyGuideTypes.length}`)
    console.log(`  Empty Units: ${blueprintsResult.emptyUnits.length}`)
    console.log(`  Empty Locations: ${blueprintsResult.emptyLocations.length}`)
    
    // Assign guides to fill empty filters
    if (guidelinesResult.emptyUnits.length > 0 || guidelinesResult.emptyLocations.length > 0) {
      const assigned = await assignGuidesToEmptyFilters('guidelines', guidelinesResult, guidelinesResult.guidelinesGuides)
      console.log(`\n✓ Assigned ${assigned} guides to fill empty Guidelines filters`)
    }
    
    if (blueprintsResult.emptyGuideTypes.length > 0 || 
        blueprintsResult.emptyUnits.length > 0 || 
        blueprintsResult.emptyLocations.length > 0) {
      const assigned = await assignGuidesToEmptyFilters('blueprints', blueprintsResult, blueprintsResult.blueprintGuides)
      console.log(`\n✓ Assigned ${assigned} guides to fill empty Blueprints filters`)
    }
    
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

