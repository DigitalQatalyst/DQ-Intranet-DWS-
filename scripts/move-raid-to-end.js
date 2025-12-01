import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function moveToEnd() {
  console.log('🔄 Moving RAID Guidelines to the end of the list...\n')
  
  // Set a very old date so it appears at the end when sorted by date
  // Or we can use a future date approach - set it to an old date
  const oldDate = new Date('2020-01-01').toISOString()
  
  const { data, error } = await supabase
    .from('guides')
    .update({
      last_updated_at: oldDate
    })
    .eq('slug', 'raid-guidelines')
    .select('title, slug, last_updated_at')
    .single()
  
  if (error) {
    console.error('❌ Error updating:', error.message)
    return
  }
  
  console.log(`✅ Successfully moved: ${data.title}`)
  console.log(`✅ Updated date to: ${data.last_updated_at}`)
  console.log('✅ RAID Guidelines will now appear at the end when sorted by date!')
}

moveToEnd().catch(console.error)


