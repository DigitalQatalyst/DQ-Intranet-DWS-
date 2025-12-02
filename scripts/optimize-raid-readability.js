import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Convert long paragraphs to concise bullet points
function paraphraseToBullets(text) {
  if (!text || text.trim().length < 50) return text
  
  // Skip if already formatted (has bullets, numbers, or is a table)
  if (text.includes('- ') || text.includes('* ') || text.includes('1. ') || text.includes('|')) {
    return text
  }
  
  // Split into sentences
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15)
  
  if (sentences.length <= 1) return text
  
  // Convert to concise bullet points
  return sentences.map(s => {
    // Make it concise - remove filler words
    let concise = s
      .replace(/\b(that|which|who|where|when)\s+/gi, '')
      .replace(/\b(is|are|was|were)\s+/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
    
    // Capitalize first letter
    if (concise.length > 0) {
      concise = concise.charAt(0).toUpperCase() + concise.slice(1)
    }
    
    return `- ${concise}`
  }).join('\n')
}

async function optimizeReadability() {
  console.log('🔄 Optimizing RAID Guidelines for readability...\n')
  
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
  
  // Split by feature-box divs
  const tiles = body.split('<div class="feature-box">')
  const title = tiles[0].trim()
  const sections = tiles.slice(1)
  
  const optimizedSections = []
  
  for (const section of sections) {
    const content = section.replace('</div>', '').trim()
    
    // Split by headings and paragraphs
    const lines = content.split('\n')
    let optimizedContent = []
    let currentPara = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // If it's a heading, table, or list, keep as is
      if (line.match(/^#{1,6}\s+/) || line.includes('|') || line.match(/^[-*•]\s/) || line.match(/^\d+\.\s/)) {
        // Process accumulated paragraph
        if (currentPara.length > 0) {
          const para = currentPara.join(' ').trim()
          if (para.length > 100) {
            optimizedContent.push(paraphraseToBullets(para))
          } else {
            optimizedContent.push(para)
          }
          currentPara = []
        }
        optimizedContent.push(line)
      } else if (line.trim() === '') {
        // Empty line - process accumulated paragraph
        if (currentPara.length > 0) {
          const para = currentPara.join(' ').trim()
          if (para.length > 100) {
            optimizedContent.push(paraphraseToBullets(para))
          } else {
            optimizedContent.push(para)
          }
          currentPara = []
        }
        optimizedContent.push('')
      } else {
        currentPara.push(line)
      }
    }
    
    // Process last paragraph
    if (currentPara.length > 0) {
      const para = currentPara.join(' ').trim()
      if (para.length > 100) {
        optimizedContent.push(paraphraseToBullets(para))
      } else {
        optimizedContent.push(para)
      }
    }
    
    optimizedSections.push(optimizedContent.join('\n').trim())
  }
  
  // Rebuild with feature-box tiles
  const newTiles = optimizedSections.map(section => {
    return `<div class="feature-box">\n\n${section}\n\n</div>`
  })
  
  const newBody = `${title}\n\n${newTiles.join('\n\n')}`
  
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
  console.log('✅ Content paraphrased for better readability')
  console.log('✅ Tables and existing lists preserved!')
}

optimizeReadability().catch(console.error)


