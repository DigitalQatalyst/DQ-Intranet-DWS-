import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verifyAndRemove() {
  console.log('🔍 Verifying and removing Blueprint Structure section completely...\n')
  
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
  
  // Check if Blueprint Structure exists
  if (newBody.includes('## Blueprint Structure')) {
    console.log('⚠️  Blueprint Structure section still exists. Removing it completely...\n')
    
    // Remove the entire Blueprint Structure section including all its content
    // This regex matches from "## Blueprint Structure" to the next "##" or "###" section
    const blueprintStructureRegex = /## Blueprint Structure[\s\S]*?(?=\n## |\n### |$)/
    
    newBody = newBody.replace(blueprintStructureRegex, '')
    
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
      console.log('✅ Successfully removed Blueprint Structure section completely!')
      console.log(`   Title: ${data.title}`)
      console.log(`   Slug: ${data.slug}`)
      console.log('\n✅ Blueprint Structure section and all its contents have been deleted.')
    }
  } else {
    console.log('✅ Blueprint Structure section is already removed.')
  }
}

verifyAndRemove().catch(console.error)

