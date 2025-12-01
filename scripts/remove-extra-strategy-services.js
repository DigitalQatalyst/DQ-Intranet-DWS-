import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// The 10 services that should exist
const allowedServices = [
  'dq-journey',
  'dq-beliefs',
  'dq-vision-and-mission',
  'dq-strategy-2021-2030',
  'dq-competencies',
  'dq-products',
  'agile-6xd-products',
  'product-strategy-overview',
  'solutions-strategy-framework',
  'product-roadmap-planning'
]

async function removeExtraStrategyServices() {
  console.log('🔍 Checking for extra strategy services...\n')
  
  // Get all strategy services from database
  const { data: allStrategyServices, error } = await supabase
    .from('guides')
    .select('id, slug, title, domain')
    .eq('domain', 'strategy')
  
  if (error) {
    console.error('❌ Error fetching strategy services:', error.message)
    return
  }
  
  if (!allStrategyServices || allStrategyServices.length === 0) {
    console.log('No strategy services found in database.')
    return
  }
  
  console.log(`Found ${allStrategyServices.length} strategy service(s) in database:\n`)
  
  const toRemove = []
  const toKeep = []
  
  for (const service of allStrategyServices) {
    if (allowedServices.includes(service.slug)) {
      toKeep.push(service)
      console.log(`✅ KEEP: "${service.title}" (${service.slug})`)
    } else {
      toRemove.push(service)
      console.log(`❌ REMOVE: "${service.title}" (${service.slug})`)
    }
  }
  
  if (toRemove.length === 0) {
    console.log('\n✅ All strategy services are in the allowed list. Nothing to remove.')
    return
  }
  
  console.log(`\n🗑️  Removing ${toRemove.length} extra service(s)...\n`)
  
  let removed = 0
  let errors = 0
  
  for (const service of toRemove) {
    const { error: deleteError } = await supabase
      .from('guides')
      .delete()
      .eq('id', service.id)
    
    if (deleteError) {
      console.error(`❌ Error removing "${service.title}":`, deleteError.message)
      errors++
    } else {
      console.log(`✅ Removed: "${service.title}" (${service.slug})`)
      removed++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Kept: ${toKeep.length}`)
  console.log(`   Removed: ${removed}`)
  console.log(`   Errors: ${errors}`)
  console.log(`\n✅ Done!`)
}

removeExtraStrategyServices().catch(console.error)

