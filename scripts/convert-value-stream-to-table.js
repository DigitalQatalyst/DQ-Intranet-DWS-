import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function convertToTable() {
  console.log('🔄 Converting Value Stream section to table format...\n')
  
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
  
  // Find the Value Stream section
  const valueStreamMatch = body.match(/(## Value Stream[^#]*)/s)
  if (!valueStreamMatch) {
    console.log('❌ Value Stream section not found')
    return
  }
  
  // Create a clean table format
  const newValueStreamSection = `## Value Stream – Heartbeat of DQ Projects

To understand the true impact of delivery, we need to view the broader picture—the value streams. These are the end-to-end processes that ensure the project doesn't just reach completion but delivers continuous value. In DQ, value streams align with SAFe principles, guiding our efforts from inception to completion while ensuring consistency, agility, and client-centric outcomes.

| Value Stream | Type | Description |
|--------------|------|-------------|
| Client Acquisition | Operational | Attract and onboard clients, resulting in signed contracts and clear needs |
| Solution Design & Proposal | Development | Define problems, ideate solutions, and create proposals, leading to validated concepts and approved proposals |
| Agile Delivery | Development | Develop and deploy solutions in agile increments, achieving working software and PI objectives |
| Client Success | Operational | Drive adoption and support, ensuring client satisfaction and meeting KPIs |
| Continuous Integration & Deployment | Development | Explore market needs, integrate code, and release updates, ensuring fast, stable, and low-risk releases |
| Client Retention | Operational | Strengthen relationships and upsell, increasing lifetime value and revenue |
| Capability Development | Development | Build agile teams and practices, leading to certified teams and faster delivery |
| Governance & Risk | Operational | Ensure alignment, compliance, and risk control, reducing risks |
| Value Measurement | Development | Measure value, gather feedback, and improve delivery and increase innovation`
  
  // Replace the old section with the new one
  body = body.replace(/(## Value Stream[^#]*)/s, newValueStreamSection)
  
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
  
  console.log(`✅ Successfully converted: ${updated.title}`)
  console.log('✅ Value Stream section now uses a clean table format!')
  console.log('✅ Much easier to read and scan!')
}

convertToTable().catch(console.error)


