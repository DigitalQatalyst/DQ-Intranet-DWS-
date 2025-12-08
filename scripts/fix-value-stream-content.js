import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixValueStream() {
  console.log('🔄 Fixing Value Stream section - making it concise and clear...\n')
  
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
  
  // Create a clear, concise Value Stream section
  const optimizedValueStream = `## Value Stream – Heartbeat of DQ Projects

Value streams are end-to-end processes that ensure projects deliver continuous value, not just completion. DQ value streams align with SAFe principles, guiding efforts from inception to completion while ensuring consistency, agility, and client-centric outcomes.

### Operational Value Streams

| Value Stream | Description |
|--------------|-------------|
| **Client Acquisition** | Attract and onboard clients, resulting in signed contracts and clear needs |
| **Client Success** | Drive adoption and support, ensuring client satisfaction and meeting KPIs |
| **Client Retention** | Strengthen relationships and upsell, increasing lifetime value and revenue |
| **Governance & Risk** | Ensure alignment, compliance, and risk control, reducing risks |

### Development Value Streams

| Value Stream | Description |
|--------------|-------------|
| **Solution Design & Proposal** | Define problems, ideate solutions, and create proposals, leading to validated concepts and approved proposals |
| **Agile Delivery** | Develop and deploy solutions in agile increments, achieving working software and PI objectives |
| **Continuous Integration & Deployment** | Explore market needs, integrate code, and release updates, ensuring fast, stable, and low-risk releases |
| **Capability Development** | Build agile teams and practices, leading to certified teams and faster delivery |
| **Value Measurement** | Measure value, gather feedback, and improve delivery and increase innovation`
  
  // Replace the Value Stream section
  body = body.replace(/(## Value Stream[^#]*?)(?=##|$)/s, optimizedValueStream)
  
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
  
  console.log(`✅ Successfully fixed: ${updated.title}`)
  console.log('✅ Value Stream section is now concise and clear!')
  console.log('✅ Introduction shortened, tables organized!')
}

fixValueStream().catch(console.error)


