import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Helper function to convert content sections to tiles
function convertToTiles(body, title) {
  if (!body) return body
  
  // If already has feature-box tiles, return as is
  if (body.includes('<div class="feature-box">')) {
    return body
  }
  
  // Extract title
  const titleMatch = body.match(/^(# [^\n]+)/)
  const mainTitle = titleMatch ? titleMatch[1] : `# ${title}`
  let content = titleMatch ? body.replace(titleMatch[1], '').trim() : body.trim()
  
  // Split by major sections (## headings)
  const sections = content.split(/(?=## )/).filter(s => s.trim())
  
  if (sections.length === 0) {
    // If no sections, wrap entire content in one tile
    return `${mainTitle}\n\n<div class="feature-box">\n\n${content}\n\n</div>`
  }
  
  // Convert each section to a tile
  const tiles = sections.map(section => {
    const trimmed = section.trim()
    if (!trimmed) return ''
    return `<div class="feature-box">\n\n${trimmed}\n\n</div>`
  }).filter(t => t).join('\n\n')
  
  return `${mainTitle}\n\n${tiles}`
}

async function convertStrategyToTiles() {
  console.log('🔄 Converting all Strategy guides to tile format...\n')
  
  const { data: guides, error: fetchError } = await supabase
    .from('guides')
    .select('slug, title, body')
    .ilike('domain', '%strategy%')
  
  if (fetchError) {
    console.error('❌ Error fetching guides:', fetchError.message)
    return
  }
  
  console.log(`Found ${guides.length} Strategy guides to convert\n`)
  
  for (const guide of guides) {
    try {
      const newBody = convertToTiles(guide.body, guide.title)
      
      if (newBody === guide.body) {
        console.log(`⏭️  ${guide.title}: Already has tiles, skipping`)
        continue
      }
      
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
        console.log(`✅ Converted: ${guide.title}`)
      }
    } catch (err) {
      console.error(`❌ Error processing ${guide.title}:`, err.message)
    }
  }
  
  console.log('\n✅ Conversion complete!')
}

convertStrategyToTiles().catch(console.error)


