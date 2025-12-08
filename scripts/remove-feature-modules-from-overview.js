import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeFeatureModulesFromOverview() {
  console.log('🔄 Removing Feature Modules and everything after it from Overview section...\n')
  
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
  // Match from "## Overview" to the next "##" section, but remove everything from "Feature Modules" within it
  const overviewRegex = /(## Overview[\s\S]*?)(### Feature Modules[\s\S]*?)(?=\n## |\n### |$)/
  
  if (overviewRegex.test(newBody)) {
    // Replace the Overview section, keeping only the part before "Feature Modules"
    newBody = newBody.replace(overviewRegex, (match, overviewPart, featureModulesPart) => {
      // Remove "Feature Modules" and everything after it from Overview
      return overviewPart.replace(/### Feature Modules[\s\S]*$/, '').trim() + '\n\n'
    })
  } else {
    // Try a simpler approach - find Overview section and remove Feature Modules from it
    const overviewMatch = newBody.match(/(## Overview[\s\S]*?)(?=\n## |\n### |$)/)
    if (overviewMatch) {
      let overviewContent = overviewMatch[1]
      // Remove everything from "Feature Modules" onwards
      overviewContent = overviewContent.replace(/### Feature Modules[\s\S]*$/, '').trim()
      // Replace the Overview section
      newBody = newBody.replace(/(## Overview[\s\S]*?)(?=\n## |\n### |$)/, overviewContent + '\n\n')
    }
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
    console.log('✅ Successfully removed Feature Modules from Overview!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log('\n✅ Feature Modules and all content after it have been removed from Overview section.')
  }
}

removeFeatureModulesFromOverview().catch(console.error)

