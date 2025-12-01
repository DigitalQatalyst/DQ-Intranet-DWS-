import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Helper to convert long paragraphs to bullet points
function convertToBullets(text) {
  if (!text || text.trim().length < 50) return text
  
  // If already has bullets, return as is
  if (text.includes('- ') || text.includes('* ')) return text
  
  // Split by sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  
  // If only 1-2 sentences, keep as paragraph
  if (sentences.length <= 2) return text
  
  // Convert to bullets
  return sentences
    .map(s => s.trim())
    .filter(s => s.length > 10)
    .map(s => `- ${s}`)
    .join('\n')
}

async function convertToBulletPoints() {
  console.log('🔄 Converting long paragraphs to bullet points for readability...\n')
  
  const { data, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'raid-guidelines')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching:', fetchError.message)
    return
  }
  
  let body = data.body
  
  // Split into sections
  const parts = body.split(/(?=^##\s+)/m)
  const title = parts[0].trim()
  const sections = parts.slice(1)
  
  const optimizedSections = []
  
  for (const section of sections) {
    const lines = section.split('\n')
    const heading = lines[0].trim()
    const content = lines.slice(1).join('\n').trim()
    
    // Skip if it's a table (contains |)
    if (content.includes('|') && content.split('\n').some(l => l.includes('|'))) {
      optimizedSections.push(section.trim())
      continue
    }
    
    // Process paragraphs
    let optimizedContent = content
    
    // Split by double newlines (paragraphs)
    const paragraphs = optimizedContent.split(/\n\n+/)
    const processedParagraphs = paragraphs.map(para => {
      const trimmed = para.trim()
      
      // If it's a short paragraph (< 100 chars), keep it
      if (trimmed.length < 100) return trimmed
      
      // If it starts with a bullet or is a list, keep it
      if (trimmed.match(/^[-*•]\s/) || trimmed.match(/^\d+\.\s/)) return trimmed
      
      // If it's a table, keep it
      if (trimmed.includes('|')) return trimmed
      
      // Convert long paragraphs to bullets
      return convertToBullets(trimmed)
    })
    
    optimizedContent = processedParagraphs.join('\n\n')
    
    optimizedSections.push(`${heading}\n\n${optimizedContent}`.trim())
  }
  
  // Rebuild with feature-box tiles
  const tiles = optimizedSections.map(section => {
    return `<div class="feature-box">\n\n${section}\n\n</div>`
  })
  
  const newBody = `${title}\n\n${tiles.join('\n\n')}`
  
  const { data: updated, error } = await supabase
    .from('guides')
    .update({
      body: newBody,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'raid-guidelines')
    .select('title, slug')
    .single()
  
  if (error) {
    console.error('❌ Error updating:', error.message)
    return
  }
  
  console.log(`✅ Successfully optimized: ${updated.title}`)
  console.log('✅ Long paragraphs converted to bullet points')
  console.log('✅ Content is now more readable and scannable!')
}

convertToBulletPoints().catch(console.error)


