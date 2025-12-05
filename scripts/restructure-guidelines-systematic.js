import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Helper function to convert content into systematic tile format
function convertToTileFormat(body, title) {
  if (!body || !body.trim()) return body
  
  // If already has feature-box divs, preserve structure but ensure format
  if (body.includes('<div class="feature-box">')) {
    // Clean up and ensure consistent formatting
    let cleaned = body
    // Remove arrows if present
    cleaned = cleaned.replace(/##\s+→\s+/g, '## ')
    cleaned = cleaned.replace(/###\s+→\s+/g, '### ')
    // Ensure proper spacing
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n')
    return cleaned
  }
  
  // If no tiles, try to structure it systematically
  // Split by major headings (## or ###)
  const lines = body.split('\n')
  const sections = []
  let currentSection = { heading: '', content: [] }
  
  for (const line of lines) {
    if (line.match(/^#{2,3}\s+/)) {
      // New heading found
      if (currentSection.heading || currentSection.content.length > 0) {
        sections.push(currentSection)
      }
      currentSection = { heading: line, content: [] }
    } else {
      currentSection.content.push(line)
    }
  }
  if (currentSection.heading || currentSection.content.length > 0) {
    sections.push(currentSection)
  }
  
  // If we found sections, convert to tiles
  if (sections.length > 0) {
    const titleLine = body.match(/^#\s+.+$/m)?.[0] || `# ${title}`
    const tiles = sections.map(section => {
      const content = section.content.join('\n').trim()
      if (!content) return ''
      return `<div class="feature-box">\n\n${section.heading}\n\n${content}\n\n</div>`
    }).filter(t => t).join('\n\n')
    
    return `${titleLine}\n\n${tiles}`
  }
  
  // Fallback: wrap entire content in a tile if it's substantial
  const trimmed = body.trim()
  if (trimmed.length > 100) {
    const titleLine = body.match(/^#\s+.+$/m)?.[0] || `# ${title}`
    const content = trimmed.replace(/^#\s+.+$/m, '').trim()
    return `${titleLine}\n\n<div class="feature-box">\n\n${content}\n\n</div>`
  }
  
  return body
}

async function restructureGuidelines() {
  console.log('🔄 Restructuring Guidelines into systematic tile format...\n')
  
  // Get all guidelines
  const { data: guides, error: fetchError } = await supabase
    .from('guides')
    .select('slug, title, body')
    .ilike('domain', '%guideline%')
    .limit(20)
  
  if (fetchError) {
    console.error('❌ Error fetching guidelines:', fetchError.message)
    return
  }
  
  console.log(`Found ${guides.length} guidelines to process\n`)
  
  for (const guide of guides) {
    try {
      const newBody = convertToTileFormat(guide.body, guide.title)
      
      // Only update if content changed
      if (newBody !== guide.body) {
        const { error: updateError } = await supabase
          .from('guides')
          .update({
            body: newBody,
            last_updated_at: new Date().toISOString()
          })
          .eq('slug', guide.slug)
        
        if (updateError) {
          console.error(`❌ Error updating ${guide.title}:`, updateError.message)
        } else {
          const tileCount = (newBody.match(/<div class="feature-box">/g) || []).length
          console.log(`✅ Updated: ${guide.title} (${tileCount} tiles)`)
        }
      } else {
        console.log(`⏭️  Skipped: ${guide.title} (already formatted)`)
      }
    } catch (err) {
      console.error(`❌ Error processing ${guide.title}:`, err.message)
    }
  }
  
  console.log('\n✅ Guidelines restructuring complete!')
}

restructureGuidelines().catch(console.error)


