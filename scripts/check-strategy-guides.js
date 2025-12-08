import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs/promises'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkStrategyGuides() {
  console.log('Checking strategy services...\n')
  
  // Get current strategy guides from database
  const { data: dbGuides, error } = await supabase
    .from('guides')
    .select('slug, title, domain')
    .eq('domain', 'strategy')
    .order('title')
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  console.log(`Strategy services in DATABASE: ${dbGuides.length}`)
  dbGuides.forEach((g, i) => {
    console.log(`${i + 1}. ${g.title} (${g.slug})`)
  })
  
  // Get strategy guides from seed file
  const seedData = JSON.parse(await fs.readFile('data/seed-guides.json', 'utf8'))
  const seedStrategies = seedData.filter(g => 
    g.domain && (g.domain.toLowerCase() === 'strategy' || g.domain.toLowerCase().includes('strategy'))
  )
  
  console.log(`\nStrategy services in SEED FILE: ${seedStrategies.length}`)
  seedStrategies.forEach((g, i) => {
    console.log(`${i + 1}. ${g.title} (${g.slug})`)
  })
  
  // Find what's in DB but not in seed
  const seedSlugs = new Set(seedStrategies.map(g => g.slug))
  const missingFromSeed = dbGuides.filter(g => !seedSlugs.has(g.slug))
  
  if (missingFromSeed.length > 0) {
    console.log(`\n⚠️  Strategy services in DATABASE but NOT in seed file (may have been deleted):`)
    missingFromSeed.forEach((g, i) => {
      console.log(`${i + 1}. ${g.title} (${g.slug})`)
    })
  }
}

checkStrategyGuides()
