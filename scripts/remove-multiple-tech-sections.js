import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeMultipleTechSections() {
  console.log('🔄 Removing multiple Technology Stack sections...\n')
  
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
  
  // List of sections to remove
  const sectionsToRemove = [
    'Forms & Validation',
    'Content & Rich Text',
    'Maps & Location Services',
    'Data Visualization',
    'Calendars & Scheduling',
    'Development Tools',
    'Additional Libraries'
  ]
  
  // Remove each section
  sectionsToRemove.forEach(section => {
    const regex = new RegExp(`### ${section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?(?=### |## )`, 'g')
    newBody = newBody.replace(regex, '')
    console.log(`   ✓ Removed: ${section}`)
  })
  
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
    console.log('\n✅ Successfully removed all specified Technology Stack sections!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log(`\n✅ Removed ${sectionsToRemove.length} sections from Technology Stack.`)
  }
}

removeMultipleTechSections().catch(console.error)

