import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeDuplicateAITools() {
  console.log('🔄 Removing duplicate Cursor and Windsurf entries from AI Tools...\n')
  
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
  
  // Find the AI Tools section
  const aiToolsMatch = newBody.match(/(### AI Tools)([\s\S]*?)(?=### Model Provider|##)/)
  
  if (!aiToolsMatch) {
    console.log('⚠️  AI Tools section not found')
    return
  }
  
  const aiToolsContent = aiToolsMatch[2]
  
  // Extract unique Cursor and Windsurf sections (keep only the first occurrence of each)
  const cursorMatches = aiToolsContent.match(/(#### Cursor[\s\S]*?)(?=#### Windsurf|#### |$)/g)
  const windsurfMatches = aiToolsContent.match(/(#### Windsurf[\s\S]*?)(?=#### Cursor|#### |$)/g)
  
  // Get the introduction text (everything before the first ####)
  const introMatch = aiToolsContent.match(/^([\s\S]*?)(?=#### )/)
  const intro = introMatch ? introMatch[1].trim() : 'DWS leverages cutting-edge AI-powered development tools to enhance productivity and code quality throughout the software development lifecycle.\n\n'
  
  // Build clean AI Tools section with only one of each
  let cleanAITools = `### AI Tools

${intro}`
  
  // Add Cursor (first occurrence only)
  if (cursorMatches && cursorMatches.length > 0) {
    cleanAITools += cursorMatches[0].trim() + '\n\n'
  }
  
  // Add Windsurf (first occurrence only)
  if (windsurfMatches && windsurfMatches.length > 0) {
    cleanAITools += windsurfMatches[0].trim() + '\n\n'
  }
  
  // Replace the AI Tools section
  newBody = newBody.replace(/(### AI Tools)([\s\S]*?)(?=### Model Provider|##)/, cleanAITools.trim() + '\n\n')
  
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
    console.log('✅ Successfully removed duplicate Cursor and Windsurf entries!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log('\n✅ AI Tools section now has only one entry for each tool.')
  }
}

removeDuplicateAITools().catch(console.error)

