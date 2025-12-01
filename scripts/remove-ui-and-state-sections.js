import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeUISections() {
  console.log('🔄 Removing UI Components & Styling and State Management & Data Fetching sections...\n')
  
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
  
  // Remove "### UI Components & Styling" section
  const uiComponentsRegex = /### UI Components & Styling[\s\S]*?(?=### |## )/
  newBody = newBody.replace(uiComponentsRegex, '')
  
  // Remove "### State Management & Data Fetching" section
  const stateManagementRegex = /### State Management & Data Fetching[\s\S]*?(?=### |## )/
  newBody = newBody.replace(stateManagementRegex, '')
  
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
    console.log('✅ Successfully removed UI Components & Styling and State Management sections!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log('\n✅ Both sections have been deleted from Technology Stack.')
  }
}

removeUISections().catch(console.error)

