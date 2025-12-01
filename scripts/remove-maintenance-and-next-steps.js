import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeMaintenanceAndNextSteps() {
  console.log('🔄 Removing Maintenance & Support and Next Steps sections...\n')
  
  // Get current blueprint
  const { data: current, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'dws-blueprint')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching blueprint:', fetchError.message)
    return
  }
  
  if (!current || !current.body) {
    console.log('⚠️  DWS Blueprint not found')
    return
  }
  
  let newBody = current.body
  
  // Remove "## Maintenance & Support" section
  const maintenanceRegex = /## Maintenance & Support[\s\S]*?(?=\n## |$)/
  newBody = newBody.replace(maintenanceRegex, '')
  
  // Remove "## Next Steps" section
  const nextStepsRegex = /## Next Steps[\s\S]*?(?=\n## |$)/
  newBody = newBody.replace(nextStepsRegex, '')
  
  // Clean up any extra blank lines
  newBody = newBody.replace(/\n{3,}/g, '\n\n')
  
  // Update the blueprint
  const { data, error } = await supabase
    .from('guides')
    .update({
      body: newBody,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'dws-blueprint')
    .select('title, slug')
    .single()
  
  if (error) {
    console.error('❌ Error updating:', error.message)
    return
  }
  
  if (data) {
    console.log('✅ Successfully removed Maintenance & Support and Next Steps sections!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log('\n✅ Both sections and all their contents have been deleted.')
  }
}

removeMaintenanceAndNextSteps().catch(console.error)

