import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeExtraBlueprints() {
  console.log('🗑️  Removing extra blueprints...\n')
  
  // Remove all blueprints that are not DWS Blueprint
  const blueprintsToRemove = [
    'blueprint-management-guidelines',
    'visual-assets-design-rules'
  ]
  
  let removed = 0
  let errors = 0
  
  for (const slug of blueprintsToRemove) {
    const { error } = await supabase
      .from('guides')
      .delete()
      .eq('slug', slug)
      .select('title')
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error(`❌ Error removing "${slug}":`, error.message)
      errors++
    } else {
      console.log(`✅ Removed: ${slug}`)
      removed++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Removed: ${removed}`)
  console.log(`   Errors: ${errors}`)
  console.log(`\n✅ Done! Extra blueprints removed.`)
  console.log(`\n⚠️  Note: DWS Blueprint needs to be created if it doesn't exist.`)
}

removeExtraBlueprints().catch(console.error)

