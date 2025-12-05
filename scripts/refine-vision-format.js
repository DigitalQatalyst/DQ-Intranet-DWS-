import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function refineFormat() {
  console.log('🔄 Refining DQ Vision format to match WFH structure...\n')
  
  // Format similar to WFH with clear headings and bullet points
  const body = `# DQ Vision and Mission

<div class="feature-box">

## → The DQ Vision (Purpose)

> "People don't buy what you do, they buy why you do it." 
> 
> — Simon Sinek

- Every organisation has a mission, but not every organisation is clear on _why_ it exists
- At DigitalQatalyst, our work is bold, technical, and complex — but it is rooted in something simple
- A belief that the world moves forward when human needs and digital systems are designed to serve one another — intelligently, and consistently

</div>

<div class="feature-box">

## → Our Core Belief

- The world moves forward when human needs and digital systems are designed to serve one another
- This belief is the heartbeat of everything we do
- It unifies hundreds of choices we make daily — in how we work, what we build, and where we focus

</div>

<div class="feature-box">

## → Our Why

- **To perfect life's transactions**
- This vision is not powered by guesswork
- It is driven by **Digital Blueprints** — modular frameworks and systems that guide organisations in their evolution from traditional structures to **Digital Cognitive Organisations (DCOs)**

</div>

<div class="feature-box">

## → The Future We Build

- Organisations that can _**think**_, _**learn**_, and _**adapt**_
- Not just deploy tools, but deliver purpose through them
- In a world that is rapidly digitising, the future will belong to organisations that can think, learn, and adapt

</div>

<div class="feature-box">

## → Our Vision in Action

- Grounds every product, every playbook, every plan
- Reminds us that we're not just building technology
- We're building trust, momentum, and clarity — system by system, transaction by transaction, life by life

</div>`
  
  const { data, error } = await supabase
    .from('guides')
    .update({
      body: body,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'dq-vision-and-mission')
    .select('title, slug')
    .single()
  
  if (error) {
    console.error('❌ Error updating:', error.message)
    return
  }
  
  console.log(`✅ Successfully refined: ${data.title} (${data.slug})`)
  console.log('✅ Format matches WFH structure with arrow headings and bullet points!')
}

refineFormat().catch(console.error)


