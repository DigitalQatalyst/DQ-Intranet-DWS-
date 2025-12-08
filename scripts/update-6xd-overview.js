import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function update6xDOverview() {
  console.log('🔄 Updating overview section...\n')
  
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
  
  // Simplified overview - just the introductory text
  const newOverview = `## Overview

Transformation isn't something we talk about. It's something we **build**.

The **Agile 6xD Framework** is how DQ designs, builds, and scales digital transformation — not as a one-time project, but as a living, evolving process.

It's built on **Six Essential Perspectives** — each answering a fundamental question every organisation must face on its path to relevance in the digital age.

Together, these six perspectives form a **transformation compass** — a blueprint that helps organisations move with clarity, discipline, and speed.

They help organisations not only design for change, but **live it** — continuously learning, adapting, and delivering value in rhythm with a fast-changing digital world.

`
  
  // Replace the overview section
  let newBody = current.body
  const overviewRegex = /## Overview[\s\S]*?(?=\n<div class="feature-box">|$)/i
  
  if (overviewRegex.test(newBody)) {
    newBody = newBody.replace(overviewRegex, newOverview.trim())
    console.log('✅ Updated overview section')
  } else {
    console.log('⚠️  Overview section not found')
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
  console.log('✅ Overview section simplified!')
}

update6xDOverview().catch(console.error)


