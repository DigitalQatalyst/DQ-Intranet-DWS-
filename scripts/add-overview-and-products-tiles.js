import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function addOverviewAndProductsTiles() {
  console.log('🔄 Adding overview tile and product tiles to Agile 6xD (Products)...\n')
  
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
  
  // Rephrased and summarized overview
  const overviewTile = `<div class="feature-box">

## Overview

The Agile 6xD Framework transforms digital transformation from a one-time project into a **living, evolving process**. Built on **Six Essential Perspectives**, it answers the fundamental questions every organisation faces on their path to digital relevance. Together, these perspectives form a **transformation compass** that guides organisations to move with clarity, discipline, and speed — not just designing for change, but **living it** through continuous learning, adaptation, and value delivery.

</div>

`
  
  // The 6 product tiles
  const productTiles = `<div class="feature-box">

### 1. Digital Economy (DE)

_Why should organisations change?_

Helps leaders understand shifts in market logic, customer behaviour, and value creation — identifying the forces that drive transformation.

</div>

<div class="feature-box">

### 2. Digital Cognitive Organisation (DCO)

_Where are organisations headed?_

Defines the future enterprise — intelligent, adaptive, and orchestrated — capable of learning, responding, and coordinating seamlessly across people, systems, and decisions.

</div>

<div class="feature-box">

### 3. Digital Business Platforms (DBP)

_What must be built to enable transformation?_

Focuses on the modular, integrated, and data-driven architectures that unify operations and make transformation scalable and resilient.

</div>

<div class="feature-box">

### 4. Digital Transformation 2.0 (DT2.0)

_How should transformation be designed and deployed?_

Positions transformation as a discipline of design and orchestration, introducing the methods, flows, and governance needed to make change repeatable and outcome-driven.

</div>

<div class="feature-box">

### 5. Digital Worker & Workspace (DW:WS)

_Who delivers the change, and how do they work?_

Centers on people and their environments — redefining roles, skills, and digitally enabled workplaces so teams can deliver and sustain transformation effectively.

</div>

<div class="feature-box">

### 6. Digital Accelerators (Tools)

_When will value be realised, and how fast, effective, and aligned will it be?_

Drives execution speed and alignment through tools, systems, and strategies that compress time-to-value and scale measurable impact.

</div>`
  
  // Build the new body - keep the title, add overview tile, then product tiles
  let newBody = current.body
  
  // Remove any existing feature boxes
  newBody = newBody.replace(/<div class="feature-box">[\s\S]*?<\/div>\s*/gi, '')
  
  // Find the title
  const titleMatch = newBody.match(/^(# [^\n]+\n)/)
  if (titleMatch) {
    // Insert overview and products after title
    newBody = newBody.replace(titleMatch[0], titleMatch[0] + '\n' + overviewTile + productTiles)
  } else {
    // If no title, prepend everything
    newBody = overviewTile + productTiles + '\n\n' + newBody
  }
  
  // Clean up extra blank lines
  newBody = newBody.replace(/\n{3,}/g, '\n\n')
  newBody = newBody.trim()
  
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
  console.log('✅ Overview tile added above product tiles!')
  console.log('✅ All 6 product tiles restored!')
}

addOverviewAndProductsTiles().catch(console.error)


