import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function shortenIntro() {
  console.log('🔄 Shortening Risk section introduction...\n')
  
  const { data, error: fetchError } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'raid-guidelines')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching:', fetchError.message)
    return
  }
  
  let body = data.body
  
  // Short, concise introduction
  const shortIntro = `## Risk Identification, Mitigation and Escalation

Effective risk management is essential for successful project delivery. Proactive identification, assessment, and escalation ensure obstacles are addressed before impacting project success or client satisfaction.`
  
  // Replace the long introduction with a short one
  body = body.replace(/(## Risk Identification, Mitigation and Escalation\n\n)[^\|]+(\n\n\|)/s, `$1${shortIntro.split('\n').slice(1).join('\n')}$2`)
  
  const { data: updated, error } = await supabase
    .from('guides')
    .update({
      body: body,
      last_updated_at: new Date().toISOString()
    })
    .eq('slug', 'raid-guidelines')
    .select('title, slug')
    .single()
  
  if (error) {
    console.error('❌ Error updating:', error.message)
    return
  }
  
  console.log(`✅ Successfully shortened: ${updated.title}`)
  console.log('✅ Introduction is now concise and to the point!')
}

shortenIntro().catch(console.error)


