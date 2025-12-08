import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeAddedGuides() {
  console.log('Removing guides that were added by the seed script...\n')
  
  // Remove WFH Guideline and DWS Blueprint that I added
  const slugsToRemove = ['wfh-guideline', 'dws-blueprint']
  
  for (const slug of slugsToRemove) {
    const { data, error } = await supabase
      .from('guides')
      .select('id, title')
      .eq('slug', slug)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error(`Error finding ${slug}:`, error)
      continue
    }
    
    if (data) {
      const { error: delError } = await supabase
        .from('guides')
        .delete()
        .eq('slug', slug)
      
      if (delError) {
        console.error(`Error deleting ${slug}:`, delError)
      } else {
        console.log(`✓ Removed: ${data.title} (${slug})`)
      }
    } else {
      console.log(`⚠ ${slug} not found (may have been removed already)`)
    }
  }
  
  console.log('\nDone.')
}

removeAddedGuides()

