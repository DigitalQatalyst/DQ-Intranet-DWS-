import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeAllImplementationGuidelines() {
  console.log('🔄 Removing all Implementation Guidelines sections...\n')
  
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
  
  // Remove all "Implementation Guidelines:" sections with their bullet points
  // Match "Implementation Guidelines:" followed by any content until the next heading, bold text, or end of line
  // Handle both with and without bold markdown
  const patterns = [
    /\*\*Implementation Guidelines:\*\*[\s\S]*?(?=\n\*\*|### |## |\n\n\n|$)/g,
    /Implementation Guidelines:[\s\S]*?(?=\n\*\*|### |## |\n\n\n|$)/g,
    /\*\*Implementation Guidelines:\*\*\s*\n[\s\S]*?(?=\n\*\*|### |## |$)/g,
    /Implementation Guidelines:\s*\n[\s\S]*?(?=\n\*\*|### |## |$)/g
  ]
  
  patterns.forEach(pattern => {
    newBody = newBody.replace(pattern, '')
  })
  
  // Also try to match lines that start with bullet points after "Implementation Guidelines:"
  // Remove lines that are bullet points immediately following "Implementation Guidelines:"
  const lines = newBody.split('\n')
  const cleanedLines = []
  let skipNextBullets = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    if (line.includes('Implementation Guidelines:')) {
      skipNextBullets = true
      continue // Skip the "Implementation Guidelines:" line
    }
    
    // Skip bullet points that follow "Implementation Guidelines:"
    if (skipNextBullets && (line.trim().startsWith('-') || line.trim().startsWith('*'))) {
      continue
    }
    
    // Stop skipping when we hit a non-bullet, non-empty line or a heading
    if (skipNextBullets && line.trim() && !line.trim().startsWith('-') && !line.trim().startsWith('*') && !line.trim().startsWith('**')) {
      skipNextBullets = false
    }
    
    // Stop skipping on headings
    if (skipNextBullets && (line.startsWith('###') || line.startsWith('##'))) {
      skipNextBullets = false
    }
    
    if (!skipNextBullets) {
      cleanedLines.push(line)
    }
  }
  
  newBody = cleanedLines.join('\n')
  
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
    console.log('✅ Successfully removed all Implementation Guidelines sections!')
    console.log(`   Title: ${data.title}`)
    console.log(`   Slug: ${data.slug}`)
    console.log('\n✅ All Implementation Guidelines sections and their bullet points have been removed.')
  }
}

removeAllImplementationGuidelines().catch(console.error)

