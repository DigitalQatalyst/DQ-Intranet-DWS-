import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function restructureCompetencies() {
  console.log('🔄 Restructuring DQ Competencies into tiles with arrow format...\n')
  
  // Format similar to Vision and Mission with arrow headings and bullet points
  const body = `# DQ Competencies

<div class="feature-box">

## → HoV (Culture)

- At DQ, we believe culture is not something you hope for. It's something you **build**
- Every company has values — written on walls, buried in onboarding slides. But what matters is how those values show up when stakes are high, time is short, or no one is watching
- That's why we built a culture system. We call it the **House of Values (HoV)**
- It's made up of **three Mantras** that guide how Qatalysts think, behave, and collaborate

</div>

<div class="feature-box">

## → 1. Self-Development

This mantra reinforces that growth is not passive — it's a daily responsibility.

> "We grow ourselves and others through every experience."

- **Emotional Intelligence** — We stay calm, present, and accountable under pressure
- **Growth Mindset** — We embrace feedback, learn from failure, and evolve fast

</div>

<div class="feature-box">

## → 2. Lean Working

This is how we protect momentum and reduce waste.

> "We pursue clarity, efficiency, and prompt outcomes in everything we do."

- **Purpose** – We stay connected to why the work matters
- **Perceptive** – We anticipate needs and make thoughtful choices
- **Proactive** – We take initiative and move things forward
- **Perseverance** – We push through setbacks with focus
- **Precision** – We sweat the details that drive performance

</div>

<div class="feature-box">

## → 3. Value Co-Creation

Collaboration isn't optional — it's how we scale intelligence.

> "We partner with others to create greater impact together."

- **Customer** – We design with empathy for those we serve
- **Learning** – We remain open, curious, and teachable
- **Collaboration** – We work as one, not in silos
- **Responsibility** – We own our decisions and their consequences
- **Trust** – We build it through honesty, clarity, and consistency

</div>`
  
  const { data, error } = await supabase
    .from('guides')
    .update({
      body: body,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'dq-competencies')
    .select('title, slug')
    .single()
  
  if (error) {
    console.error('❌ Error updating:', error.message)
    return
  }
  
  console.log(`✅ Successfully restructured: ${data.title} (${data.slug})`)
  console.log('✅ Content organized into 4 separate tiles with arrow format!')
  console.log('✅ Format matches Vision and Mission structure!')
}

restructureCompetencies().catch(console.error)


