import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Updated Vision content based on GHC document
const visionContent = `## The DQ Vision (Purpose)

> "People don't buy what you do, they buy why you do it." 
> 
> — Simon Sinek

Every organisation has a mission. But not every organisation is clear on _why_ it exists.

At DigitalQatalyst, our work is bold, technical, and complex — but it is rooted in something simple: A belief that the world moves forward when human needs and digital systems are designed to serve one another — intelligently, and consistently.

That belief is the heartbeat of everything we do.

It's what unifies hundreds of choices we make daily — in how we work, what we build, and where we focus.

Our **why** is this: **To perfect life's transactions.**

This vision is not powered by guesswork. It is driven by **Digital Blueprints** — modular frameworks and systems that guide organisations in their evolution from traditional structures to **Digital Cognitive Organisations (DCOs)**.

Because in a world that is rapidly digitising, the future will belong to organisations that can _**think**_, _**learn**_, and _**adapt**_— not just deploy tools, but deliver purpose through them.

Our vision gives us direction. It grounds every product, every playbook, every plan and it reminds us that we're not just building technology. We're building trust, momentum, and clarity — system by system, transaction by transaction, life by life.`

// Updated Culture (House of Values) content based on GHC document
const cultureContent = `## HoV (Culture)

At DQ, we believe culture is not something you hope for. It's something you **build**.

Every company has values — written on walls, buried in onboarding slides. But what matters is how those values show up when stakes are high, time is short, or no one is watching.

That's why we built a culture system. We call it the **House of Values (HoV).**

It's made up of **three Mantras** that guide how Qatalysts think, behave, and collaborate.

<div class="feature-box">

### 1. Self-Development

This mantra reinforces that growth is not passive — it's a daily responsibility.

> "We grow ourselves and others through every experience."

- **Emotional Intelligence** — We stay calm, present, and accountable under pressure
- **Growth Mindset** — We embrace feedback, learn from failure, and evolve fast

</div>

<div class="feature-box">

### 2. Lean Working

This is how we protect momentum and reduce waste.

> _"We pursue clarity, efficiency, and prompt outcomes in everything we do."_

- **Purpose** – We stay connected to why the work matters
- **Perceptive** – We anticipate needs and make thoughtful choices
- **Proactive** – We take initiative and move things forward
- **Perseverance** – We push through setbacks with focus
- **Precision** – We sweat the details that drive performance

</div>

<div class="feature-box">

### 3. Value Co-Creation

Collaboration isn't optional — it's how we scale intelligence.

> _"We partner with others to create greater impact together."_

- **Customer** – We design with empathy for those we serve
- **Learning** – We remain open, curious, and teachable
- **Collaboration** – We work as one, not in silos
- **Responsibility** – We own our decisions and their consequences
- **Trust** – We build it through honesty, clarity, and consistency

</div>

These are reinforced by **12 Guiding Values** — practical behaviors that help us lead with focus, collaborate with trust, and perform under pressure.

Whether in a sprint, a client engagement, or a tough feedback session — these principles give us direction.

They keep us aligned when things move fast. They raise the bar when standards slip. They make performance sustainable — because they're shared.

**At DQ, culture isn't an extra layer.** **It's the structure beneath everything we do.**`

// Updated 6xD Products content with each product in its own tile
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

async function updateStrategyGHCContent() {
  console.log('🔄 Updating Strategy guides with GHC content...\n')
  
  const updates = [
    {
      slug: 'dq-vision-and-mission',
      title: 'DQ Vision and Mission',
      content: visionContent,
      summary: "DQ's vision: To perfect life's transactions through Digital Blueprints that guide organisations to become Digital Cognitive Organisations."
    },
    {
      slug: 'agile-6xd-products',
      title: 'Agile 6xD (Products)',
      content: productsContent,
      summary: 'The Agile 6xD Framework: Six essential perspectives for designing, building, and scaling digital transformation.'
    }
  ]
  
  // Check if there's a Culture/HoV guide
  const { data: cultureGuide } = await supabase
    .from('guides')
    .select('slug, title')
    .or('slug.eq.dq-competencies,slug.eq.house-of-values,slug.eq.dq-culture')
    .limit(1)
    .single()
  
  if (cultureGuide) {
    updates.push({
      slug: cultureGuide.slug,
      title: cultureGuide.title || 'DQ Culture (House of Values)',
      content: cultureContent,
      summary: "DQ's House of Values (HoV): Three mantras and 12 guiding values that shape how Qatalysts think, behave, and collaborate."
    })
  } else {
    // Create new Culture guide if it doesn't exist
    console.log('⚠️  No Culture guide found. You may want to create one.')
  }
  
  for (const update of updates) {
    try {
      const { data: existing } = await supabase
        .from('guides')
        .select('id, title')
        .eq('slug', update.slug)
        .single()
      
      if (existing) {
        const { data, error } = await supabase
          .from('guides')
          .update({
            body: update.content,
            summary: update.summary,
            last_updated_at: new Date().toISOString()
          })
          .eq('slug', update.slug)
          .select('title, slug')
          .single()
        
        if (error) {
          console.error(`❌ Error updating ${update.slug}:`, error.message)
        } else {
          console.log(`✅ Updated: ${data.title} (${data.slug})`)
        }
      } else {
        console.log(`⚠️  Guide not found: ${update.slug}`)
      }
    } catch (err) {
      console.error(`❌ Error processing ${update.slug}:`, err.message)
    }
  }
  
  console.log('\n✅ Strategy guides update complete!')
}

updateStrategyGHCContent().catch(console.error)


