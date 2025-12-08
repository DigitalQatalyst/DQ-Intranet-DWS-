import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function deleteAIToolsSection() {
  console.log('🔄 Deleting entire AI Tools section with all contents...\n')
  
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
  
  // Remove the entire AI Tools section from "### AI Tools" to the next "###" or "##" section
  const aiToolsRegex = /### AI Tools[\s\S]*?(?=\n### |\n## |$)/
  
  newBody = newBody.replace(aiToolsRegex, '')
  
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
    console.log('✅ Successfully deleted AI Tools section!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log('\n✅ The entire AI Tools section and all its contents have been deleted.')
  }
}

deleteAIToolsSection().catch(console.error)

