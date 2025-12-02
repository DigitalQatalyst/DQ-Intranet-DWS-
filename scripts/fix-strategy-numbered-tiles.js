import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Fix DQ Vision and Mission - no numbered lists, but ensure proper tile structure
function fixVision(body) {
  const titleMatch = body.match(/^(# [^\n]+)/)
  const mainTitle = titleMatch ? titleMatch[1] : '# DQ Vision and Mission'
  let content = titleMatch ? body.replace(/^# [^\n]+\n*/, '').trim() : body.trim()
  
  // Remove existing feature-boxes
  content = content.replace(/<div class="feature-box">\s*<\/div>/g, '')
  content = content.replace(/<\/div>\s*<div class="feature-box">/g, '\n\n')
  
  // If content doesn't have feature-box, wrap it
  if (!content.includes('<div class="feature-box">')) {
    content = `<div class="feature-box">\n\n${content}\n\n</div>`
  }
  
  return `${mainTitle}\n\n${content}`
}

// Fix Agile 6xD - each of the 6 products should be in its own tile
function fix6xD(body) {
  const titleMatch = body.match(/^(# [^\n]+)/)
  const mainTitle = titleMatch ? titleMatch[1] : '# Agile 6xD (Products)'
  let content = titleMatch ? body.replace(/^# [^\n]+\n*/, '').trim() : body.trim()
  
  // Extract overview tile
  const overviewMatch = content.match(/<div class="feature-box">\s*## Overview[\s\S]*?<\/div>/i)
  const overviewTile = overviewMatch ? overviewMatch[0] : ''
  
  // Extract all numbered items (### 1., ### 2., etc.)
  const numberedItems = content.match(/### \d+\.\s+[^\n]+[\s\S]*?(?=### \d+\.|<\/div>|$)/g) || []
  
  // Create tiles for each numbered item
  const productTiles = numberedItems.map(item => {
    const cleaned = item.trim()
    if (!cleaned) return ''
    return `<div class="feature-box">\n\n${cleaned}\n\n</div>`
  }).filter(t => t).join('\n\n')
  
  // Combine overview + product tiles
  const tiles = overviewTile ? `${overviewTile}\n\n${productTiles}` : productTiles
  
  return `${mainTitle}\n\n${tiles}`
}

// Fix DQ Competencies - each of the 3 mantras should be in its own tile
function fixCompetencies(body) {
  const titleMatch = body.match(/^(# [^\n]+)/)
  const mainTitle = titleMatch ? titleMatch[1] : '# DQ Competencies'
  let content = titleMatch ? body.replace(/^# [^\n]+\n*/, '').trim() : body.trim()
  
  // Extract intro section (before mantras)
  const introMatch = content.match(/^([\s\S]*?)(?=<div class="feature-box">|### \d+\.)/i)
  const intro = introMatch ? introMatch[1].trim() : ''
  
  // Extract all numbered mantras (### 1., ### 2., ### 3.)
  const mantraMatches = content.match(/### \d+\.\s+[^\n]+[\s\S]*?(?=### \d+\.|<\/div>|$)/g) || []
  
  // Also check for existing feature-boxes with mantras
  const existingBoxes = content.match(/<div class="feature-box">[\s\S]*?<\/div>/g) || []
  
  let mantraTiles = []
  
  // If we have numbered items, use those
  if (mantraMatches.length > 0) {
    mantraTiles = mantraMatches.map(item => {
      const cleaned = item.trim()
      if (!cleaned) return ''
      return `<div class="feature-box">\n\n${cleaned}\n\n</div>`
    })
  } else if (existingBoxes.length > 0) {
    // Use existing boxes
    mantraTiles = existingBoxes
  }
  
  // Combine intro + mantra tiles
  const introTile = intro ? `<div class="feature-box">\n\n${intro}\n\n</div>` : ''
  const tiles = introTile ? `${introTile}\n\n${mantraTiles.join('\n\n')}` : mantraTiles.join('\n\n')
  
  return `${mainTitle}\n\n${tiles}`
}

async function fixStrategyNumberedTiles() {
  console.log('🔄 Fixing Strategy guides - putting numbered items in separate tiles...\n')
  
  const guides = [
    { slug: 'dq-vision-and-mission', title: 'DQ Vision and Mission', fixFn: fixVision },
    { slug: 'agile-6xd-products', title: 'Agile 6xD (Products)', fixFn: fix6xD },
    { slug: 'dq-competencies', title: 'DQ Competencies', fixFn: fixCompetencies }
  ]
  
  for (const guide of guides) {
    try {
      const { data, error: fetchError } = await supabase
        .from('guides')
        .select('body')
        .eq('slug', guide.slug)
        .single()
      
      if (fetchError) {
        console.error(`❌ Error fetching ${guide.title}:`, fetchError.message)
        continue
      }
      
      const newBody = guide.fixFn(data.body)
      
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
        console.log(`✅ Fixed: ${guide.title}`)
      }
    } catch (err) {
      console.error(`❌ Error processing ${guide.title}:`, err.message)
    }
  }
  
  console.log('\n✅ All Strategy guides fixed!')
}

fixStrategyNumberedTiles().catch(console.error)


