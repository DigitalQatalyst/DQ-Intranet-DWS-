import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function moveToEnd() {
  console.log('🔄 Moving RAID and L24 guidelines to the end...\n')
  
  // Set to very old date so they appear at the end when sorted by date
  const oldDate = new Date('2020-01-01').toISOString()
  
  const guides = [
    { slug: 'raid-guidelines', title: 'DQ RAID Guidelines' },
    { slug: 'dq-l24-working-rooms-guidelines', title: 'DQ L24 Working Rooms Guidelines' }
  ]
  
  for (const guide of guides) {
    const { data, error } = await supabase
      .from('guides')
      .update({
        last_updated_at: oldDate
      })
      .eq('slug', guide.slug)
      .select('title, slug, last_updated_at')
      .single()
    
    if (error) {
      console.error(`❌ Error updating ${guide.title}:`, error.message)
    } else {
      console.log(`✅ Moved to end: ${data.title}`)
      console.log(`   Updated date: ${data.last_updated_at}`)
    }
  }
  
  console.log('\n✅ Both guides will now appear at the end when sorted by date!')
}

moveToEnd().catch(console.error)


