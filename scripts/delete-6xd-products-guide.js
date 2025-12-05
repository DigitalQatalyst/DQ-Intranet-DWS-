import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function delete6xDProductsGuide() {
  console.log('🔄 Deleting Agile 6xD (Products) guide...\n')
  
  const { data: guide, error: fetchError } = await supabase
    .from('guides')
    .select('id, title, slug')
    .eq('slug', 'agile-6xd-products')
    .single()
  
  if (fetchError) {
    console.error('❌ Error fetching guide:', fetchError.message)
    return
  }
  
  if (!guide) {
    console.log('⚠️  Guide not found')
    return
  }
  
  console.log(`Found guide: ${guide.title} (${guide.slug})`)
  console.log(`ID: ${guide.id}\n`)
  
  const { error: deleteError } = await supabase
    .from('guides')
    .delete()
    .eq('slug', 'agile-6xd-products')
  
  if (deleteError) {
    console.error('❌ Error deleting guide:', deleteError.message)
    return
  }
  
  console.log('✅ Successfully deleted Agile 6xD (Products) guide!')
  console.log(`   Deleted: ${guide.title}`)
}

delete6xDProductsGuide().catch(console.error)


