// scripts/verify-and-fix-unit-filtering.js
// Verify unit values match filter IDs and fix any issues
// Usage: node scripts/verify-and-fix-unit-filtering.js

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

const EXPECTED_UNITS = [
  { filterId: 'deals', displayName: 'Deals' },
  { filterId: 'dq-delivery-accounts', displayName: 'DQ Delivery (Accounts)' },
  { filterId: 'dq-delivery-deploys', displayName: 'DQ Delivery (Deploys)' },
  { filterId: 'dq-delivery-designs', displayName: 'DQ Delivery (Designs)' },
  { filterId: 'finance', displayName: 'Finance' },
  { filterId: 'hra', displayName: 'HRA' },
  { filterId: 'intelligence', displayName: 'Intelligence' },
  { filterId: 'products', displayName: 'Products' },
  { filterId: 'secdevops', displayName: 'SecDevOps' },
  { filterId: 'solutions', displayName: 'Solutions' },
  { filterId: 'stories', displayName: 'Stories' }
]

function slugify(value) {
  if (!value) return ''
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function main() {
  try {
    console.log('='.repeat(60))
    console.log('VERIFYING AND FIXING UNIT FILTERING')
    console.log('='.repeat(60))
    
    // Get all Guidelines guides
    let allGuides = []
    try {
      const { data, error } = await sb
        .from('guides')
        .select('id, title, unit, function_area, domain, guide_type')
        .eq('status', 'Approved')
      
      if (error) {
        console.error('Error:', error)
        return
      }
      allGuides = data || []
    } catch (err) {
      console.error('Network error:', err.message)
      return
    }
    
    // Filter Guidelines guides
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
    
    console.log(`\nFound ${guidelinesGuides.length} Guidelines guides`)
    
    // Check each guide's unit value
    console.log(`\n${'='.repeat(60)}`)
    console.log('CHECKING UNIT VALUES')
    console.log('='.repeat(60))
    
    const issues = []
    for (const guide of guidelinesGuides) {
      const unitValue = guide.unit || guide.function_area || ''
      const normalizedUnit = slugify(unitValue)
      
      // Find matching expected unit
      const matchingUnit = EXPECTED_UNITS.find(u => {
        return normalizedUnit === u.filterId ||
               normalizedUnit.includes(u.filterId) ||
               u.filterId.includes(normalizedUnit)
      })
      
      if (!matchingUnit) {
        console.log(`  ✗ "${guide.title}": Unit "${unitValue}" doesn't match any filter ID`)
        issues.push({ guide, unitValue, normalizedUnit })
      } else {
        // Check if the unit value matches the display name exactly
        if (unitValue !== matchingUnit.displayName) {
          console.log(`  ⚠ "${guide.title}": Unit "${unitValue}" should be "${matchingUnit.displayName}"`)
          issues.push({ guide, unitValue, expected: matchingUnit.displayName, normalizedUnit })
        } else {
          console.log(`  ✓ "${guide.title}": Unit "${unitValue}" matches`)
        }
      }
    }
    
    // Fix issues
    if (issues.length > 0) {
      console.log(`\n${'='.repeat(60)}`)
      console.log('FIXING UNIT VALUES')
      console.log('='.repeat(60))
      
      for (const issue of issues) {
        if (issue.expected) {
          // Fix unit value to match display name
          try {
            const { error: updateError } = await sb
              .from('guides')
              .update({ 
                unit: issue.expected,
                function_area: issue.expected
              })
              .eq('id', issue.guide.id)
            
            if (updateError) {
              console.error(`  ✗ Error fixing "${issue.guide.title}":`, updateError.message)
            } else {
              console.log(`  ✓ Fixed "${issue.guide.title}": "${issue.unitValue}" → "${issue.expected}"`)
            }
          } catch (err) {
            console.error(`  ✗ Network error:`, err.message)
          }
        } else {
          // Try to find the correct unit based on normalized value
          const matchingUnit = EXPECTED_UNITS.find(u => {
            return issue.normalizedUnit === u.filterId ||
                   issue.normalizedUnit.includes(u.filterId) ||
                   u.filterId.includes(issue.normalizedUnit)
          })
          
          if (matchingUnit) {
            try {
              const { error: updateError } = await sb
                .from('guides')
                .update({ 
                  unit: matchingUnit.displayName,
                  function_area: matchingUnit.displayName
                })
                .eq('id', issue.guide.id)
              
              if (updateError) {
                console.error(`  ✗ Error fixing "${issue.guide.title}":`, updateError.message)
              } else {
                console.log(`  ✓ Fixed "${issue.guide.title}": "${issue.unitValue}" → "${matchingUnit.displayName}"`)
              }
            } catch (err) {
              console.error(`  ✗ Network error:`, err.message)
            }
          } else {
            console.log(`  ⚠ Cannot auto-fix "${issue.guide.title}": No matching unit found`)
          }
        }
      }
    }
    
    // Final verification
    console.log(`\n${'='.repeat(60)}`)
    console.log('FINAL VERIFICATION')
    console.log('='.repeat(60))
    
    // Re-fetch
    let finalGuides = []
    try {
      const { data: finalData } = await sb
        .from('guides')
        .select('id, title, unit, function_area, domain, guide_type')
        .eq('status', 'Approved')
      
      finalGuides = finalData || []
    } catch (err) {
      console.error('Network error:', err.message)
      return
    }
    
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
    
    // Group by unit
    const byUnit = new Map()
    for (const guide of finalGuidelines) {
      const unit = guide.unit || guide.function_area || 'Unassigned'
      if (!byUnit.has(unit)) {
        byUnit.set(unit, [])
      }
      byUnit.get(unit).push(guide)
    }
    
    console.log(`\nGuidelines guides by unit:`)
    for (const [unit, guides] of byUnit.entries()) {
      const normalized = slugify(unit)
      const matchingFilter = EXPECTED_UNITS.find(u => slugify(u.displayName) === normalized)
      const status = matchingFilter ? '✓' : '✗'
      console.log(`  ${status} ${unit}: ${guides.length} guides (normalized: ${normalized})`)
      guides.forEach(g => console.log(`    - ${g.title}`))
    }
    
    // Test filtering logic
    console.log(`\n${'='.repeat(60)}`)
    console.log('TESTING FILTER MATCHING')
    console.log('='.repeat(60))
    
    for (const expectedUnit of EXPECTED_UNITS) {
      const matchingGuides = finalGuidelines.filter(g => {
        const unitValue = g.unit || g.function_area || ''
        const normalizedDbValue = slugify(unitValue)
        return normalizedDbValue === expectedUnit.filterId
      })
      
      if (matchingGuides.length > 0) {
        console.log(`  ✓ ${expectedUnit.displayName} (${expectedUnit.filterId}): ${matchingGuides.length} guides match`)
      } else {
        console.log(`  ✗ ${expectedUnit.displayName} (${expectedUnit.filterId}): No guides match`)
      }
    }
    
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

