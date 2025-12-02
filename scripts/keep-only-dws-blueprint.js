import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function keepOnlyDWSBlueprint() {
  console.log('🔍 Finding all blueprints...\n')
  
  // Find all blueprints
  const { data: allBlueprints, error: fetchError } = await supabase
    .from('guides')
    .select('slug, title, domain')
    .or('domain.ilike.%blueprint%,title.ilike.%blueprint%')
  
  if (fetchError) {
    console.error('❌ Error fetching blueprints:', fetchError.message)
    return
  }
  
  console.log(`Found ${allBlueprints.length} blueprint(s):\n`)
  allBlueprints.forEach((b, i) => {
    console.log(`${i + 1}. ${b.title} (${b.slug})`)
  })
  
  // Find DWS Blueprint
  const dwsBlueprint = allBlueprints.find(b => 
    b.slug === 'dws-blueprint' || 
    b.title.toLowerCase().includes('dws blueprint') ||
    b.title.toLowerCase().includes('dws')
  )
  
  if (!dwsBlueprint) {
    console.log('\n⚠️  DWS Blueprint not found. Please create it first.')
    return
  }
  
  console.log(`\n✅ Keeping: "${dwsBlueprint.title}" (${dwsBlueprint.slug})\n`)
  
  // Remove all other blueprints
  const toRemove = allBlueprints.filter(b => b.slug !== dwsBlueprint.slug)
  
  if (toRemove.length === 0) {
    console.log('✅ Only DWS Blueprint exists. No changes needed.')
    return
  }
  
  console.log(`🗑️  Removing ${toRemove.length} blueprint(s):\n`)
  let removed = 0
  let errors = 0
  
  for (const blueprint of toRemove) {
    const { error } = await supabase
      .from('guides')
      .delete()
      .eq('slug', blueprint.slug)
    
    if (error) {
      console.error(`❌ Error removing "${blueprint.title}":`, error.message)
      errors++
    } else {
      console.log(`✅ Removed: "${blueprint.title}" (${blueprint.slug})`)
      removed++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Kept: 1 (DWS Blueprint)`)
  console.log(`   Removed: ${removed}`)
  console.log(`   Errors: ${errors}`)
  console.log(`\n✅ Done! Only DWS Blueprint remains.`)
}

keepOnlyDWSBlueprint().catch(console.error)

