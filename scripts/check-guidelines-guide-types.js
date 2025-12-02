// scripts/check-guidelines-guide-types.js
// Check guide types for Guidelines guides and ensure all have guides
// Usage: node scripts/check-guidelines-guide-types.js

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

const REQUIRED_GUIDE_TYPES = ['Best Practice', 'Policy', 'Process', 'SOP']

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

async function main() {
  try {
    // Get all guidelines guides
    const { data: allGuides, error } = await sb
      .from('guides')
      .select('id, title, guide_type, domain')
      .eq('status', 'Approved')
    
    if (error) {
      console.error('Error fetching guides:', error)
      return
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
    
    console.log(`Found ${guidelinesGuides.length} guidelines guides\n`)
    console.log('='.repeat(60))
    console.log('GUIDE TYPE DISTRIBUTION')
    console.log('='.repeat(60))
    
    const guidesByType = {}
    const guidesWithoutType = []
    
    for (const guide of guidelinesGuides) {
      const guideType = guide.guide_type || ''
      if (!guideType) {
        guidesWithoutType.push(guide)
      } else {
        if (!guidesByType[guideType]) {
          guidesByType[guideType] = []
        }
        guidesByType[guideType].push(guide)
      }
    }
    
    console.log('\nCurrent guide types in database:')
    for (const [type, guides] of Object.entries(guidesByType)) {
      console.log(`  ${type}: ${guides.length} guides`)
      guides.forEach(g => console.log(`    - ${g.title}`))
    }
    
    if (guidesWithoutType.length > 0) {
      console.log(`\nGuides without guide type: ${guidesWithoutType.length}`)
      guidesWithoutType.forEach(g => console.log(`  - ${g.title}`))
    }
    
    console.log(`\n${'='.repeat(60)}`)
    console.log('REQUIRED GUIDE TYPES')
    console.log('='.repeat(60))
    
    const missingTypes = []
    for (const requiredType of REQUIRED_GUIDE_TYPES) {
      const normalizedRequired = normalizeValue(requiredType)
      const hasGuides = Object.keys(guidesByType).some(dbType => {
        const normalizedDb = normalizeValue(dbType)
        return normalizedDb === normalizedRequired || 
               normalizedDb.includes(normalizedRequired) ||
               normalizedRequired.includes(normalizedDb)
      })
      
      if (hasGuides) {
        const matchingType = Object.keys(guidesByType).find(dbType => {
          const normalizedDb = normalizeValue(dbType)
          return normalizedDb === normalizedRequired || 
                 normalizedDb.includes(normalizedRequired) ||
                 normalizedRequired.includes(normalizedDb)
        })
        const count = guidesByType[matchingType].length
        console.log(`  ✓ ${requiredType}: ${count} guides (as "${matchingType}")`)
      } else {
        console.log(`  ✗ ${requiredType}: No guides`)
        missingTypes.push(requiredType)
      }
    }
    
    if (missingTypes.length > 0 || guidesWithoutType.length > 0) {
      console.log(`\n${'='.repeat(60)}`)
      console.log('ASSIGNING GUIDES TO MISSING GUIDE TYPES')
      console.log('='.repeat(60))
      
      // Distribute guides to missing types
      let typeIndex = 0
      const guidesToAssign = [...guidesWithoutType]
      
      // Also check if we need to reassign some guides to fill missing types
      for (const missingType of missingTypes) {
        // Find guides that can be assigned to this type
        const availableGuides = guidelinesGuides.filter(g => {
          const currentType = (g.guide_type || '').toLowerCase().trim()
          const normalizedMissing = normalizeValue(missingType)
          return currentType !== normalizedMissing && 
                 !currentType.includes(normalizedMissing) &&
                 !normalizedMissing.includes(currentType)
        })
        
        // Assign 2-3 guides to this missing type
        const guidesToAssignToType = availableGuides.slice(0, 3)
        
        for (const guide of guidesToAssignToType) {
          const { error: updateError } = await sb
            .from('guides')
            .update({ guide_type: missingType })
            .eq('id', guide.id)
          
          if (updateError) {
            console.error(`  ✗ Error updating "${guide.title}":`, updateError.message)
          } else {
            console.log(`  ✓ Assigned "${guide.title}" to ${missingType}`)
          }
        }
      }
      
      // Assign guides without types
      for (const guide of guidesToAssign) {
        const targetType = REQUIRED_GUIDE_TYPES[typeIndex % REQUIRED_GUIDE_TYPES.length]
        
        const { error: updateError } = await sb
          .from('guides')
          .update({ guide_type: targetType })
          .eq('id', guide.id)
        
        if (updateError) {
          console.error(`  ✗ Error updating "${guide.title}":`, updateError.message)
        } else {
          console.log(`  ✓ Assigned "${guide.title}" to ${targetType}`)
        }
        
        typeIndex++
      }
    }
    
    // Final verification
    console.log(`\n${'='.repeat(60)}`)
    console.log('FINAL VERIFICATION')
    console.log('='.repeat(60))
    
    const { data: finalGuides } = await sb
      .from('guides')
      .select('id, title, guide_type, domain')
      .eq('status', 'Approved')
    
    const finalGuidelines = (finalGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return !domain.includes('strategy') && 
             !domain.includes('blueprint') && 
             !domain.includes('testimonial') &&
             !guideType.includes('strategy') &&
             !guideType.includes('blueprint') &&
             !guideType.includes('testimonial')
    })
    
    const finalByType = {}
    for (const guide of finalGuidelines) {
      const type = guide.guide_type || 'None'
      if (!finalByType[type]) finalByType[type] = []
      finalByType[type].push(guide)
    }
    
    for (const requiredType of REQUIRED_GUIDE_TYPES) {
      const normalizedRequired = normalizeValue(requiredType)
      const matchingType = Object.keys(finalByType).find(dbType => {
        const normalizedDb = normalizeValue(dbType)
        return normalizedDb === normalizedRequired || 
               normalizedDb.includes(normalizedRequired) ||
               normalizedRequired.includes(normalizedDb)
      })
      
      if (matchingType) {
        const count = finalByType[matchingType].length
        console.log(`  ✓ ${requiredType}: ${count} guides`)
        finalByType[matchingType].slice(0, 3).forEach(g => console.log(`    - ${g.title}`))
        if (finalByType[matchingType].length > 3) {
          console.log(`    ... and ${finalByType[matchingType].length - 3} more`)
        }
      } else {
        console.log(`  ✗ ${requiredType}: Still no guides`)
      }
    }
    
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

