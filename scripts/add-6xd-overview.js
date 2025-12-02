import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function add6xDOverview() {
  console.log('🔄 Adding overview section to DQ Products guide...\n')
  
  const { data: current, error: fetchError } = await supabase
    .from('guides')
    .select('body, title')
    .eq('slug', 'dq-products')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching guide:', fetchError.message)
    return
  }
  
  if (!current || !current.body) {
    console.log('⚠️  Guide not found or has no body')
    return
  }
  
  // Check if overview already exists
  if (current.body.includes('## Overview') || current.body.includes('Agile 6xD Framework')) {
    console.log('⚠️  Overview section may already exist. Checking...')
  }
  
  // Overview content based on GHC document
  const overviewSection = `## Overview

Transformation isn't something we talk about. It's something we **build**.

The **Agile 6xD Framework** is how DQ designs, builds, and scales digital transformation — not as a one-time project, but as a living, evolving process.

It's built on **Six Essential Perspectives** — each answering a fundamental question every organisation must face on its path to relevance in the digital age.

Together, these six perspectives form a **transformation compass** — a blueprint that helps organisations move with clarity, discipline, and speed.

They help organisations not only design for change, but **live it** — continuously learning, adapting, and delivering value in rhythm with a fast-changing digital world.

`
  
  // Insert overview at the beginning, after the main title
  let newBody = current.body
  
  // If there's already an Overview section, replace it
  const overviewRegex = /## Overview[\s\S]*?(?=\n## |$)/
  if (overviewRegex.test(newBody)) {
    newBody = newBody.replace(overviewRegex, overviewSection.trim())
    console.log('✅ Replaced existing Overview section')
  } else {
    // Insert after the main title (# DQ Products)
    const titleMatch = newBody.match(/^(# [^\n]+\n)/)
    if (titleMatch) {
      newBody = newBody.replace(titleMatch[0], titleMatch[0] + '\n' + overviewSection.trim() + '\n')
      console.log('✅ Added Overview section after title')
    } else {
      // If no title match, prepend it
      newBody = overviewSection.trim() + '\n\n' + newBody
      console.log('✅ Added Overview section at the beginning')
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
    .eq('slug', 'dq-products')
    .select('title, slug')
    .single()
  
  if (error) {
    console.error('❌ Error updating:', error.message)
    return
  }
  
  console.log(`✅ Successfully updated: ${data.title} (${data.slug})`)
  console.log('✅ Overview section added!')
}

add6xDOverview().catch(console.error)


