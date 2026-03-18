/**
 * Script to check which strategy filter options have matching guides
 * This ensures each filter option has service cards related to it
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Strategy filter options
const STRATEGY_TYPES = [
  { id: 'journey', name: 'Journey' },
  { id: 'history', name: 'History' }
]

const STRATEGY_FRAMEWORKS = [
  { id: 'ghc', name: 'GHC' },
  { id: '6xd', name: '6xD (Digital Framework)' }
]

function matchesStrategyType(guide, typeId) {
  const subDomain = (guide.sub_domain || '').toLowerCase()
  return subDomain.includes(typeId.toLowerCase()) || subDomain === typeId.toLowerCase()
}

function matchesFramework(guide, frameworkId) {
  const subDomain = (guide.sub_domain || '').toLowerCase()
  const domain = (guide.domain || '').toLowerCase()
  const guideType = (guide.guide_type || '').toLowerCase()
  const allText = `${subDomain} ${domain} ${guideType}`.toLowerCase()
  
  if (frameworkId === '6xd') {
    return allText.includes('6xd') || 
           allText.includes('digital-framework') ||
           allText.includes('digital framework')
  }
  if (frameworkId === 'ghc') {
    return allText.includes('ghc') || allText.includes('golden honeycomb')
  }
  return false
}

function printGuideList(guides, maxDisplay = 5) {
  if (guides.length === 0) return
  
  if (guides.length <= maxDisplay) {
    guides.forEach(g => console.log(`   - ${g.title} (${g.slug})`))
  } else {
    guides.slice(0, 3).forEach(g => console.log(`   - ${g.title} (${g.slug})`))
    console.log(`   ... and ${guides.length - 3} more`)
  }
}

function checkFilterCoverage(guides, filters, matchFn) {
  return filters.map(filter => {
    const matching = guides?.filter(g => matchFn(g, filter.id)) || []
    return { filter, matching, hasCards: matching.length > 0 }
  })
}

async function checkStrategyFilters() {
  console.log('🔍 Checking strategy filter coverage...\n')
  
  // Fetch all strategy guides
  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, slug, sub_domain, domain, guide_type')
    .or('domain.ilike.%Strategy%,guide_type.ilike.%Strategy%')
    .eq('status', 'Approved')
  
  if (error) {
    console.error('❌ Error fetching guides:', error)
    return
  }
  
  console.log(`📊 Total Strategy Guides: ${guides?.length || 0}\n`)
  
  // Check Strategy Type coverage
  console.log('📋 Strategy Type Filter Coverage:')
  console.log('─'.repeat(50))
  
  const typeResults = checkFilterCoverage(guides, STRATEGY_TYPES, matchesStrategyType)
  typeResults.forEach(({ filter, matching, hasCards }) => {
    const status = hasCards ? '✅' : '❌'
    console.log(`${status} ${filter.name} (${filter.id}): ${matching.length} guides`)
    printGuideList(matching)
  })
  
  console.log('\n')
  
  // Check Framework/Program coverage
  console.log('🔧 Framework/Program Filter Coverage:')
  console.log('─'.repeat(50))
  
  const frameworkResults = checkFilterCoverage(guides, STRATEGY_FRAMEWORKS, matchesFramework)
  frameworkResults.forEach(({ filter, matching, hasCards }) => {
    const status = hasCards ? '✅' : '❌'
    console.log(`${status} ${filter.name} (${filter.id}): ${matching.length} guides`)
    printGuideList(matching)
  })
  
  console.log('\n')
  
  // Summary
  console.log('📈 Summary:')
  console.log('─'.repeat(50))
  
  const typesWithCards = typeResults.filter(r => r.hasCards).length
  const frameworksWithCards = frameworkResults.filter(r => r.hasCards).length
  
  console.log(`Strategy Types with cards: ${typesWithCards}/${STRATEGY_TYPES.length}`)
  console.log(`Frameworks with cards: ${frameworksWithCards}/${STRATEGY_FRAMEWORKS.length}`)
  
  // Recommendations
  console.log('\n💡 Recommendations:')
  console.log('─'.repeat(50))
  
  const typesWithoutCards = typeResults.filter(r => r.hasCards === false)
  const frameworksWithoutCards = frameworkResults.filter(r => r.hasCards === false)
  
  if (typesWithoutCards.length > 0) {
    console.log(`⚠️  Remove Strategy Types without cards:`)
    typesWithoutCards.forEach(({ filter }) => console.log(`   - ${filter.name} (${filter.id})`))
  }
  
  if (frameworksWithoutCards.length > 0) {
    console.log(`⚠️  Remove Frameworks without cards:`)
    frameworksWithoutCards.forEach(({ filter }) => console.log(`   - ${filter.name} (${filter.id})`))
  }
  
  if (typesWithoutCards.length === 0 && frameworksWithoutCards.length === 0) {
    console.log('✅ All filter options have matching guides!')
  }
}

await checkStrategyFilters()

