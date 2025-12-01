import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function optimizeTable() {
  console.log('🔄 Optimizing Value Stream table format...\n')
  
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
  
  // Create a better organized table with clearer structure
  const optimizedValueStreamSection = `## Value Stream – Heartbeat of DQ Projects

To understand the true impact of delivery, we need to view the broader picture—the value streams. These are the end-to-end processes that ensure the project doesn't just reach completion but delivers continuous value. In DQ, value streams align with SAFe principles, guiding our efforts from inception to completion while ensuring consistency, agility, and client-centric outcomes.

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
  
  // Replace the old section with the optimized one
  body = body.replace(/(## Value Stream[^#]*)/s, optimizedValueStreamSection)
  
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
  
  console.log(`✅ Successfully optimized: ${updated.title}`)
  console.log('✅ Table now split into two clear sections (Operational & Development)')
  console.log('✅ Better organized and easier to read!')
}

optimizeTable().catch(console.error)


