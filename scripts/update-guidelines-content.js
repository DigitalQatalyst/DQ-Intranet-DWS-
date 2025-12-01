import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Template for updating guidelines with actual content
// Replace the placeholder content below with actual content from SharePoint documents

const guidelinesContent = {
  'dq-agenda-scheduling-guidelines': {
    summary: '', // Short summary (1-2 sentences)
    body: '' // Full content in Markdown format
  },
  'dq-functional-tracker-guidelines': {
    summary: '',
    body: ''
  },
  'dq-l24-working-rooms-guidelines': {
    summary: '',
    body: ''
  },
  'dq-rescue-shift-guidelines': {
    summary: '',
    body: ''
  },
  'dq-scrum-master-guidelines': {
    summary: '',
    body: ''
  },
  'raid-guidelines': {
    summary: '',
    body: ''
  }
}

async function updateGuidelinesContent() {
  console.log('🔄 Updating guidelines with actual content...\n')
  
  let updated = 0
  let errors = 0
  
  for (const [slug, content] of Object.entries(guidelinesContent)) {
    if (!content.summary || !content.body) {
      console.log(`⚠️  Skipping "${slug}" - content not provided`)
      continue
    }
    
    const { data, error } = await supabase
      .from('guides')
      .update({
        summary: content.summary,
        body: content.body,
        last_updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select('title')
      .single()
    
    if (error) {
      console.error(`❌ Error updating "${slug}":`, error.message)
      errors++
    } else if (data) {
      console.log(`✅ Updated: "${data.title}"`)
      updated++
    } else {
      console.log(`⚠️  Guideline not found: ${slug}`)
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Errors: ${errors}`)
  console.log(`\n✅ Done!`)
}

// Uncomment to run:
// updateGuidelinesContent().catch(console.error)

console.log('📝 Template ready. Fill in the content and uncomment the update function call.')

