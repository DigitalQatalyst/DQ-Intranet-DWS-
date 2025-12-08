import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function restructure6xD() {
  console.log('🔄 Restructuring Agile 6xD into tiles with arrow format...\n')
  
  // Format similar to Vision and Mission with arrow headings and bullet points
  const body = `# Agile 6xD (Products)

<div class="feature-box">

## → Overview

- Transformation isn't something we talk about. It's something we **build**
- The **Agile 6xD Framework** is how DQ designs, builds, and scales digital transformation — not as a one-time project, but as a living, evolving process
- It's built on **Six Essential Perspectives** — each answering a fundamental question every organisation must face on its path to relevance in the digital age
- Together, these six perspectives form a **transformation compass** — a blueprint that helps organisations move with clarity, discipline, and speed
- They help organisations not only design for change, but **live it** — continuously learning, adapting, and delivering value in rhythm with a fast-changing digital world

</div>

<div class="feature-box">

## → 1. Digital Economy (DE)

**Why should organisations change?**

- Helps leaders understand shifts in market logic, customer behaviour, and value creation
- Identifies the forces that drive transformation

</div>

<div class="feature-box">

## → 2. Digital Cognitive Organisation (DCO)

**Where are organisations headed?**

- Defines the future enterprise — intelligent, adaptive, and orchestrated
- Capable of learning, responding, and coordinating seamlessly across people, systems, and decisions

</div>

<div class="feature-box">

## → 3. Digital Business Platforms (DBP)

**What must be built to enable transformation?**

- Focuses on the modular, integrated, and data-driven architectures that unify operations
- Makes transformation scalable and resilient

</div>

<div class="feature-box">

## → 4. Digital Transformation 2.0 (DT2.0)

**How should transformation be designed and deployed?**

- Positions transformation as a discipline of design and orchestration
- Introduces the methods, flows, and governance needed to make change repeatable and outcome-driven

</div>

<div class="feature-box">

## → 5. Digital Worker & Workspace (DW:WS)

**Who delivers the change, and how do they work?**

- Centers on people and their environments
- Redefines roles, skills, and digitally enabled workplaces so teams can deliver and sustain transformation effectively

</div>

<div class="feature-box">

## → 6. Digital Accelerators (Tools)

**When will value be realised, and how fast, effective, and aligned will it be?**

- Drives execution speed and alignment through tools, systems, and strategies
- Compresses time-to-value and scales measurable impact

</div>`
  
  const { data, error } = await supabase
    .from('guides')
    .update({
      body: body,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'agile-6xd-products')
    .select('title, slug')
    .single()
  
  if (error) {
    console.error('❌ Error updating:', error.message)
    return
  }
  
  console.log(`✅ Successfully restructured: ${data.title} (${data.slug})`)
  console.log('✅ Content organized into 7 separate tiles with arrow format!')
  console.log('✅ Format matches Vision and Mission structure!')
}

restructure6xD().catch(console.error)


