import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verifyAndFix6xDTiles() {
  console.log('🔍 Checking 6xD Products guide...\n')
  
  const { data: current, error: fetchError } = await supabase
    .from('guides')
    .select('body, title')
    .eq('slug', 'agile-6xd-products')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching:', fetchError.message)
    return
  }
  
  if (!current || !current.body) {
    console.log('⚠️  Guide not found or has no body')
    return
  }
  
  const body = current.body
  const featureBoxMatches = body.match(/<div class="feature-box">/g) || []
  const featureBoxCount = featureBoxMatches.length
  
  console.log(`Current feature boxes: ${featureBoxCount}`)
  console.log(`Title: ${current.title}\n`)
  
  // Check if we have exactly 6 boxes
  if (featureBoxCount === 6) {
    console.log('✅ All 6 products are already in their own tiles!')
    
    // Show what's in each box
    const boxSections = body.split('<div class="feature-box">').filter(s => s.trim())
    boxSections.forEach((section, index) => {
      const titleMatch = section.match(/###\s+(\d+\.\s+[^\n]+)/)
      if (titleMatch) {
        console.log(`   Box ${index + 1}: ${titleMatch[1]}`)
      }
    })
  } else {
    console.log(`⚠️  Found ${featureBoxCount} boxes, but expected 6. Updating...`)
    
    // Recreate with all 6 products in their own tiles
    const productsContent = `## Agile 6xD (Products)

Transformation isn't something we talk about. It's something we **build**.

The **Agile 6xD Framework** is how DQ designs, builds, and scales digital transformation — not as a one-time project, but as a living, evolving process.

It's built on **Six Essential Perspectives** — each answering a fundamental question every organisation must face on its path to relevance in the digital age.

<div class="feature-box">

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

</div>

Together, these six perspectives form a **transformation compass** — a blueprint that helps organisations move with clarity, discipline, and speed.

They help organisations not only design for change, but **live it** — continuously learning, adapting, and delivering value in rhythm with a fast-changing digital world.`
    
    const { data, error } = await supabase
      .from('guides')
      .update({
        body: productsContent,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', 'agile-6xd-products')
      .select('title, slug')
      .single()
    
    if (error) {
      console.error('❌ Error updating:', error.message)
      return
    }
    
    console.log(`✅ Updated: ${data.title}`)
    console.log('✅ All 6 products are now in their own tiles!')
  }
}

verifyAndFix6xDTiles().catch(console.error)


