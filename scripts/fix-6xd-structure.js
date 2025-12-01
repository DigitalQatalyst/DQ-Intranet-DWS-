import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fix6xDStructure() {
  console.log('🔄 Fixing structure - keeping only overview and empty tile...\n')
  
  const { data: current, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'agile-6xd-products')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching guide:', fetchError.message)
    return
  }
  
  // Correct structure: Title, Overview tile, Empty tile
  const correctBody = `# Agile 6xD (Products)

<div class="feature-box">

## Overview

Transformation isn't something we talk about. It's something we **build**. The Agile 6xD Framework is how DQ designs, builds, and scales digital transformation — not as a one-time project, but as a living, evolving process. It's built on **Six Essential Perspectives** — each answering a fundamental question every organisation must face on its path to relevance in the digital age. Together, these six perspectives form a **transformation compass** — a blueprint that helps organisations move with clarity, discipline, and speed. They help organisations not only design for change, but **live it** — continuously learning, adapting, and delivering value in rhythm with a fast-changing digital world.

</div>

<div class="feature-box">

</div>`
  
  // Update the guide
  const { data, error } = await supabase
    .from('guides')
    .update({
      body: correctBody,
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
  console.log('✅ Structure fixed: Title → Overview tile → Empty tile')
}

fix6xDStructure().catch(console.error)


