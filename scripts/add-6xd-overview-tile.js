import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function add6xDOverviewTile() {
  console.log('🔄 Adding overview tile to Agile 6xD (Products)...\n')
  
  const { data: current, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'agile-6xd-products')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching guide:', fetchError.message)
    return
  }
  
  if (!current || !current.body) {
    console.log('⚠️  Guide not found or has no body')
    return
  }
  
  // Overview tile content
  const overviewTile = `<div class="feature-box">

## Overview

Transformation isn't something we talk about. It's something we **build**. The Agile 6xD Framework is how DQ designs, builds, and scales digital transformation — not as a one-time project, but as a living, evolving process. It's built on **Six Essential Perspectives** — each answering a fundamental question every organisation must face on its path to relevance in the digital age. Together, these six perspectives form a **transformation compass** — a blueprint that helps organisations move with clarity, discipline, and speed. They help organisations not only design for change, but **live it** — continuously learning, adapting, and delivering value in rhythm with a fast-changing digital world.

</div>

`
  
  // Add overview tile at the beginning, after the main title
  let newBody = current.body
  
  // Check if overview tile already exists
  if (newBody.includes('<div class="feature-box">') && newBody.includes('## Overview')) {
    console.log('⚠️  Overview tile may already exist')
    // Replace existing overview tile
    const overviewTileRegex = /<div class="feature-box">\s*## Overview[\s\S]*?<\/div>\s*/i
    if (overviewTileRegex.test(newBody)) {
      newBody = newBody.replace(overviewTileRegex, overviewTile)
      console.log('✅ Replaced existing overview tile')
    }
  } else {
    // Insert after the main title (# Agile 6xD (Products))
    const titleMatch = newBody.match(/^(# [^\n]+\n)/)
    if (titleMatch) {
      newBody = newBody.replace(titleMatch[0], titleMatch[0] + '\n' + overviewTile)
      console.log('✅ Added overview tile after title')
    } else {
      // If no title match, prepend it
      newBody = overviewTile + '\n' + newBody
      console.log('✅ Added overview tile at the beginning')
    }
  }
  
  // Clean up extra blank lines
  newBody = newBody.replace(/\n{3,}/g, '\n\n')
  
  // Update the guide
  const { data, error } = await supabase
    .from('guides')
    .update({
      body: newBody,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'agile-6xd-products')
    .select('title, slug')
    .single()
  
  if (error) {
    console.error('❌ Error updating:', error.message)
    return
  }
  
  console.log(`✅ Successfully updated: ${data.title} (${data.slug})`)
  console.log('✅ Overview tile added!')
}

add6xDOverviewTile().catch(console.error)


