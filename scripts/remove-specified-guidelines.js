import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const guidelinesToRemove = [
  { slug: 'meetings-optimization-guidelines', title: 'Meetings & Sessions Optimization' },
  { slug: 'stakeholder-catalog-guidelines', title: 'Stakeholder Catalog Guidelines' },
  { slug: 'proposal-commercial-guidelines', title: 'Proposal & Projects Commercial Guidelines' }
]

async function removeGuidelines() {
  console.log('🗑️  Removing specified guidelines...\n')
  
  let removed = 0
  let errors = 0
  
  for (const guide of guidelinesToRemove) {
    const { error } = await supabase
      .from('guides')
      .delete()
      .eq('slug', guide.slug)
    
    if (error) {
      console.error(`❌ Error removing "${guide.title}" (${guide.slug}):`, error.message)
      errors++
    } else {
      console.log(`✅ Removed: "${guide.title}" (${guide.slug})`)
      removed++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Removed: ${removed}`)
  console.log(`   Errors: ${errors}`)
  console.log(`\n✅ Done!`)
}

removeGuidelines().catch(console.error)

