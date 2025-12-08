import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeArrows() {
  console.log('🔄 Removing arrows from all guides...\n')
  
  const guides = [
    { slug: 'dq-vision-and-mission', title: 'DQ Vision and Mission' },
    { slug: 'agile-6xd-products', title: 'Agile 6xD (Products)' },
    { slug: 'dq-competencies', title: 'DQ Competencies' }
  ]
  
  for (const guide of guides) {
    try {
      const { data, error: fetchError } = await supabase
        .from('guides')
        .select('body')
        .eq('slug', guide.slug)
        .single()
      
      if (fetchError) {
        console.error(`❌ Error fetching ${guide.title}:`, fetchError.message)
        continue
      }
      
      // Remove arrows from headings
      let body = data.body
      body = body.replace(/##\s+→\s+/g, '## ')
      body = body.replace(/###\s+→\s+/g, '### ')
      body = body.replace(/####\s+→\s+/g, '#### ')
      
      const { error: updateError } = await supabase
        .from('guides')
        .update({
          body: body,
          last_updated_at: new Date().toISOString()
        })
        .eq('slug', guide.slug)
      
      if (updateError) {
        console.error(`❌ Error updating ${guide.title}:`, updateError.message)
      } else {
        console.log(`✅ Removed arrows from: ${guide.title}`)
      }
    } catch (err) {
      console.error(`❌ Error processing ${guide.title}:`, err.message)
    }
  }
  
  console.log('\n✅ All arrows removed from all guides!')
}

removeArrows().catch(console.error)


