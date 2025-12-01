import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Guidelines from the image
const guidelinesToCheck = [
  { slug: 'forum-guidelines', title: 'Forum Guidelines' },
  { slug: 'dq-agenda-scheduling-guidelines', title: 'DQ Agenda & Scheduling Guidelines' },
  { slug: 'dq-functional-tracker-guidelines', title: 'DQ Functional Tracker Guidelines' },
  { slug: 'dq-l24-working-rooms-guidelines', title: 'DQ L24 Working Rooms Guidelines' },
  { slug: 'dq-rescue-shift-guidelines', title: 'DQ Rescue Shift Guidelines' },
  { slug: 'dq-scrum-master-guidelines', title: 'DQ Scrum Master Guidelines' },
  { slug: 'raid-guidelines', title: 'RAID Guidelines' }
]

async function checkMissingGuidelines() {
  console.log('🔍 Checking for missing guidelines...\n')
  
  const slugs = guidelinesToCheck.map(g => g.slug)
  const { data: existing, error } = await supabase
    .from('guides')
    .select('slug, title')
    .in('slug', slugs)
  
  if (error) {
    console.error('❌ Error:', error.message)
    return
  }
  
  const existingSlugs = new Set((existing || []).map(g => g.slug))
  
  console.log('Status of guidelines:\n')
  const missing = []
  
  guidelinesToCheck.forEach(guideline => {
    if (existingSlugs.has(guideline.slug)) {
      console.log(`✅ ${guideline.title} (${guideline.slug})`)
    } else {
      console.log(`❌ ${guideline.title} (${guideline.slug}) - MISSING`)
      missing.push(guideline)
    }
  })
  
  if (missing.length > 0) {
    console.log(`\n📊 Summary: ${missing.length} guideline(s) missing`)
    console.log('\nMissing guidelines:')
    missing.forEach((g, i) => console.log(`${i + 1}. ${g.title} (${g.slug})`))
  } else {
    console.log('\n✅ All guidelines are present in the database')
  }
}

checkMissingGuidelines().catch(console.error)

