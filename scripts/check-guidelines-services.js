import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkGuidelinesServices() {
  console.log('🔍 Checking guidelines services...\n')
  
  // Check for domain = 'guidelines' or guide_type = 'Guideline'
  const { data: domainGuides, error: domainError } = await supabase
    .from('guides')
    .select('slug, title, domain, guide_type')
    .ilike('domain', '%guideline%')
    .order('title')
  
  const { data: typeGuides, error: typeError } = await supabase
    .from('guides')
    .select('slug, title, domain, guide_type')
    .ilike('guide_type', '%guideline%')
    .order('title')
  
  // Combine and deduplicate
  const allGuides = new Map()
  
  if (domainGuides) {
    domainGuides.forEach(g => {
      allGuides.set(g.slug, g)
    })
  }
  
  if (typeGuides) {
    typeGuides.forEach(g => {
      allGuides.set(g.slug, g)
    })
  }
  
  const uniqueGuides = Array.from(allGuides.values())
  
  console.log(`Found ${uniqueGuides.length} guidelines service(s):\n`)
  
  uniqueGuides.forEach((g, i) => {
    console.log(`${i + 1}. ${g.title}`)
    console.log(`   Slug: ${g.slug}`)
    console.log(`   Domain: ${g.domain}`)
    console.log(`   Type: ${g.guide_type}\n`)
  })
  
  // Also check seed file
  console.log('\n📄 Checking seed file for guidelines...\n')
  const fs = await import('fs/promises')
  const path = await import('path')
  const { fileURLToPath } = await import('url')
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const seedPath = path.resolve(__dirname, '..', 'data', 'seed-guides.json')
  
  try {
    const seedContent = await fs.readFile(seedPath, 'utf8')
    const seedGuides = JSON.parse(seedContent)
    const seedGuidelines = seedGuides.filter(g => 
      (g.domain && g.domain.toLowerCase().includes('guideline')) ||
      (g.guide_type && g.guide_type.toLowerCase().includes('guideline'))
    )
    
    console.log(`Found ${seedGuidelines.length} guidelines in seed file:\n`)
    seedGuidelines.forEach((g, i) => {
      console.log(`${i + 1}. ${g.title} (${g.slug})`)
    })
  } catch (err) {
    console.error('Error reading seed file:', err.message)
  }
}

checkGuidelinesServices().catch(console.error)

