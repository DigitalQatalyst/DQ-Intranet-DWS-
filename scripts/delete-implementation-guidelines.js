import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function deleteImplementationGuidelines() {
  console.log('🔄 Deleting all Implementation Guidelines sections...\n')
  
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
  
  // Remove all "Implementation Guidelines:" sections
  // This regex matches "Implementation Guidelines:" followed by bullet points until the next heading or end
  const implementationGuidelinesRegex = /\*\*Implementation Guidelines:\*\*[\s\S]*?(?=\n\*\*|### |## |$)/
  
  // Remove all occurrences
  newBody = newBody.replace(implementationGuidelinesRegex, '')
  
  // Also handle variations without bold
  const implementationGuidelinesRegex2 = /Implementation Guidelines:[\s\S]*?(?=\n\*\*|### |## |$)/
  newBody = newBody.replace(implementationGuidelinesRegex2, '')
  
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
    console.log('✅ Successfully deleted all Implementation Guidelines sections!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log('\n✅ All Implementation Guidelines sections have been removed.')
  }
}

deleteImplementationGuidelines().catch(console.error)

