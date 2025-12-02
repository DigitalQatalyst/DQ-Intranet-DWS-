import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeDWSSections() {
  console.log('🔄 Removing What is the DWS Blueprint and How it\'s Different sections...\n')
  
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
  
  // Remove "What is the DWS Blueprint?" section
  // This section starts with "## What is the DWS Blueprint?" and ends before "## How it's Different"
  const whatIsSectionRegex = /## What is the DWS Blueprint\?[\s\S]*?(?=## How it's Different from Standard Documentation|## Blueprint Structure)/
  newBody = newBody.replace(whatIsSectionRegex, '')
  
  // Remove "How it's Different from Standard Documentation" section
  // This section starts with "## How it's Different from Standard Documentation" and ends before "## Blueprint Structure"
  const howDifferentSectionRegex = /## How it's Different from Standard Documentation[\s\S]*?(?=## Blueprint Structure)/
  newBody = newBody.replace(howDifferentSectionRegex, '')
  
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
    console.log('✅ Successfully removed both sections!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log('\n✅ The two sections have been removed from the DWS Blueprint.')
  }
}

removeDWSSections().catch(console.error)

