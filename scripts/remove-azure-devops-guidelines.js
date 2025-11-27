import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function removeAzureDevOpsGuidelines() {
  console.log('🗑️  Removing "Task | Azure DevOps Guidelines"...\n')
  
  // Try to find by title
  const { data: guide, error: fetchError } = await supabase
    .from('guides')
    .select('id, slug, title, domain')
    .ilike('title', '%Azure DevOps%')
    .maybeSingle()
  
  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('❌ Error fetching guide:', fetchError.message)
    return
  }
  
  if (guide) {
    console.log(`Found: "${guide.title}" (${guide.slug})`)
    
    const { error: deleteError } = await supabase
      .from('guides')
      .delete()
      .eq('slug', guide.slug)
    
    if (deleteError) {
      console.error(`❌ Error removing "${guide.title}":`, deleteError.message)
    } else {
      console.log(`✅ Successfully removed: "${guide.title}"`)
    }
  } else {
    // Try common slug variations
    const possibleSlugs = [
      'task-azure-devops-guidelines',
      'azure-devops-guidelines',
      'task-azure-devops',
      'azure-devops-task-guidelines'
    ]
    
    console.log('Guide not found by title. Trying common slug variations...\n')
    
    for (const slug of possibleSlugs) {
      const { data: foundGuide, error: slugError } = await supabase
        .from('guides')
        .select('id, slug, title')
        .eq('slug', slug)
        .maybeSingle()
      
      if (foundGuide) {
        console.log(`Found by slug: "${foundGuide.title}" (${foundGuide.slug})`)
        
        const { error: deleteError } = await supabase
          .from('guides')
          .delete()
          .eq('slug', slug)
        
        if (deleteError) {
          console.error(`❌ Error removing "${foundGuide.title}":`, deleteError.message)
        } else {
          console.log(`✅ Successfully removed: "${foundGuide.title}"`)
        }
        return
      }
    }
    
    console.log('⚠️  Guide not found. It may have already been removed.')
  }
  
  console.log('\n✅ Done!')
}

removeAzureDevOpsGuidelines().catch(console.error)

