import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function compareGuidelines() {
  console.log('🔍 Comparing guidelines services...\n')
  
  // Get guidelines from database
  const { data: dbGuides, error: dbError } = await supabase
    .from('guides')
    .select('slug, title, domain, guide_type')
    .or('domain.ilike.%guideline%,guide_type.ilike.%guideline%')
    .order('title')
  
  if (dbError) {
    console.error('❌ Error fetching database guides:', dbError.message)
    return
  }
  
  // Get guidelines from seed file
  const seedPath = path.resolve(root, 'data', 'seed-guides.json')
  let seedGuides = []
  try {
    const fileContent = await fs.readFile(seedPath, 'utf8')
    // Try to parse, but handle JSON errors
    try {
      seedGuides = JSON.parse(fileContent)
    } catch (parseError) {
      console.error('❌ Error parsing seed file JSON:', parseError.message)
      // Try to extract just the titles/slugs manually
      const guidelineMatches = fileContent.match(/"title":\s*"([^"]*[Gg]uideline[^"]*)"/g)
      if (guidelineMatches) {
        console.log('\nFound guideline titles in seed file (manual extraction):')
        guidelineMatches.forEach((match, i) => {
          const title = match.match(/"title":\s*"([^"]*)"/)[1]
          console.log(`${i + 1}. ${title}`)
        })
      }
      return
    }
  } catch (fileError) {
    console.error('❌ Error reading seed file:', fileError.message)
    return
  }
  
  // Filter seed file for guidelines
  const seedGuidelines = seedGuides.filter(g => {
    const title = (g.title || '').toLowerCase()
    const domain = (g.domain || '').toLowerCase()
    const guideType = (g.guide_type || '').toLowerCase()
    return title.includes('guideline') || domain.includes('guideline') || guideType.includes('guideline')
  })
  
  console.log(`📊 Database: ${dbGuides?.length || 0} guidelines`)
  console.log(`📄 Seed file: ${seedGuidelines.length} guidelines\n`)
  
  // Find missing ones
  const dbSlugs = new Set((dbGuides || []).map(g => g.slug))
  const seedSlugs = new Set(seedGuidelines.map(g => g.slug))
  
  const missingFromDb = seedGuidelines.filter(g => !dbSlugs.has(g.slug))
  const extraInDb = (dbGuides || []).filter(g => !seedSlugs.has(g.slug))
  
  if (missingFromDb.length > 0) {
    console.log('❌ Missing from database (in seed file but not in DB):')
    missingFromDb.forEach((g, i) => {
      console.log(`   ${i + 1}. ${g.title} (${g.slug})`)
      console.log(`      Domain: ${g.domain || 'N/A'}`)
      console.log(`      Type: ${g.guide_type || 'N/A'}\n`)
    })
  } else {
    console.log('✅ All seed file guidelines are in the database')
  }
  
  if (extraInDb.length > 0) {
    console.log('\n⚠️  Extra in database (in DB but not in seed file):')
    extraInDb.forEach((g, i) => {
      console.log(`   ${i + 1}. ${g.title} (${g.slug})`)
    })
  }
  
  console.log('\n📋 All guidelines in database:')
  ;(dbGuides || []).forEach((g, i) => {
    console.log(`${i + 1}. ${g.title} (${g.slug})`)
  })
}

compareGuidelines().catch(console.error)

