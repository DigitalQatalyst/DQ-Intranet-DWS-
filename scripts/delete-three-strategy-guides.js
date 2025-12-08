import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function deleteThreeStrategyGuides() {
  console.log('🔄 Deleting 3 strategy guides...\n')
  
  const guidesToDelete = [
    'solutions-strategy-framework',
    'product-roadmap-planning',
    'product-strategy-overview'
  ]
  
  for (const slug of guidesToDelete) {
    const { data: guide, error: fetchError } = await supabase
      .from('guides')
      .select('title, slug')
      .eq('slug', slug)
      .single()
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error(`❌ Error fetching ${slug}:`, fetchError.message)
      continue
    }
    
    if (!guide) {
      console.log(`⚠️  Guide not found: ${slug}`)
      continue
    }
    
    const { error: deleteError } = await supabase
      .from('guides')
      .delete()
      .eq('slug', slug)
    
    if (deleteError) {
      console.error(`❌ Error deleting ${slug}:`, deleteError.message)
    } else {
      console.log(`✅ Deleted: ${guide.title} (${guide.slug})`)
    }
  }
  
  console.log('\n✅ Deletion complete!')
}

deleteThreeStrategyGuides().catch(console.error)


