import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function recreate6xDWithOverview() {
  console.log('🔄 Creating Agile 6xD (Products) guide with overview...\n')
  
  // Content based on GHC document
  const body = `# Agile 6xD (Products)

## Overview

Transformation isn't something we talk about. It's something we **build**.

The **Agile 6xD Framework** is how DQ designs, builds, and scales digital transformation — not as a one-time project, but as a living, evolving process.

It's built on **Six Essential Perspectives** — each answering a fundamental question every organisation must face on its path to relevance in the digital age.

Together, these six perspectives form a **transformation compass** — a blueprint that helps organisations move with clarity, discipline, and speed.

They help organisations not only design for change, but **live it** — continuously learning, adapting, and delivering value in rhythm with a fast-changing digital world.

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

</div>`
  
  const summary = 'The Agile 6xD Framework: Six essential perspectives for designing, building, and scaling digital transformation.'
  
  const { data, error } = await supabase
    .from('guides')
    .insert({
      slug: 'agile-6xd-products',
      title: 'Agile 6xD (Products)',
      summary: summary,
      body: body,
      domain: 'Strategy',
      guide_type: 'Framework',
      status: 'Approved',
      last_updated_at: new Date().toISOString(),
      hero_image_url: 'https://images.unsplash.com/photo-1553877522-25bcdc54f2de?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    })
    .select('title, slug')
    .single()
  
  if (error) {
    console.error('❌ Error creating guide:', error.message)
    return
  }
  
  console.log(`✅ Successfully created: ${data.title} (${data.slug})`)
  console.log('✅ Overview section added at the beginning!')
  console.log('✅ All 6 products are in their own tiles!')
}

recreate6xDWithOverview().catch(console.error)


