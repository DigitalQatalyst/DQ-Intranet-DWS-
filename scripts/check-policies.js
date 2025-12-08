// scripts/check-policies.js
// Check if specific policies exist in the database
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const POLICIES_TO_CHECK = [
  'DQ IT Security Management Policy',
  'IT Risk Management Document Policy',
  'IT Risk Management Policy',
  'Risk Management Policy',
  'DQ IT Operation Security Policy',
  'DQ IT Operation Security Policy Document'
]

async function main() {
  const { data: allGuides } = await sb
    .from('guides')
    .select('id, title, summary, body, guide_type, domain, unit, location')
    .eq('status', 'Approved')
  
  console.log('Searching for policies...\n')
  
  for (const policyName of POLICIES_TO_CHECK) {
    const matching = (allGuides || []).filter(g => {
      const title = (g.title || '').toLowerCase()
      const searchTerm = policyName.toLowerCase()
      return title.includes(searchTerm) || searchTerm.includes(title)
    })
    
    if (matching.length > 0) {
      console.log(`✓ Found "${policyName}":`)
      matching.forEach(g => {
        console.log(`  - ${g.title}`)
        console.log(`    Guide Type: ${g.guide_type || 'N/A'}`)
        console.log(`    Domain: ${g.domain || 'N/A'}`)
        console.log(`    Unit: ${g.unit || g.function_area || 'N/A'}`)
        console.log(`    Location: ${g.location || 'N/A'}`)
        console.log(`    Summary: ${g.summary || 'N/A'}`)
        console.log(`    Body: ${g.body ? (g.body.substring(0, 100) + '...') : 'N/A'}`)
        console.log('')
      })
    } else {
      console.log(`✗ Not found: "${policyName}"\n`)
    }
  }
  
  // Also search for any guides with "Security" or "Risk Management" in title
  console.log('\nSearching for guides with "Security" or "Risk" in title...\n')
  const securityGuides = (allGuides || []).filter(g => {
    const title = (g.title || '').toLowerCase()
    return title.includes('security') || title.includes('risk')
  })
  
  if (securityGuides.length > 0) {
    console.log(`Found ${securityGuides.length} related guides:\n`)
    securityGuides.forEach(g => {
      console.log(`  - ${g.title}`)
      console.log(`    Guide Type: ${g.guide_type || 'N/A'}`)
      console.log(`    Domain: ${g.domain || 'N/A'}`)
      console.log('')
    })
  } else {
    console.log('No guides found with "Security" or "Risk" in title')
  }
}

main().catch(console.error)


