import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeAllFeatureModulesContent() {
  console.log('🔄 Removing all Feature Modules content from Overview section...\n')
  
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
  
  // Find the Overview section and remove everything from "Feature Modules" onwards
  // Match the Overview section and remove everything from "Feature Modules" to the next ## section
  const overviewMatch = newBody.match(/(## Overview[\s\S]*?)(?=\n## |\n### |$)/)
  
  if (overviewMatch) {
    let overviewContent = overviewMatch[1]
    
    // Remove everything from "Feature Modules" (case insensitive) onwards
    // This will remove:
    // - "Feature Modules" heading (### or ##)
    // - The introduction text
    // - All 10 numbered features
    // - All detailed feature sections with Components and Deployment Considerations
    overviewContent = overviewContent.replace(/###?\s*Feature Modules[\s\S]*$/i, '').trim()
    
    // Replace the Overview section in the body
    newBody = newBody.replace(/(## Overview[\s\S]*?)(?=\n## |\n### |$)/, overviewContent + '\n\n')
  }
  
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
    console.log('✅ Successfully removed all Feature Modules content from Overview!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log('\n✅ All Feature Modules content (heading, list, and detailed sections) has been removed from Overview.')
  }
}

removeAllFeatureModulesContent().catch(console.error)

