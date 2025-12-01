// scripts/check-it-policies.js
// Check if specific IT policies exist in database
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

const POLICY_NAMES = [
  'IT Security Management Policy',
  'IT Risk Management',
  'IT Operation Security Policy',
  'DQ IT Security Management Policy',
  'DQ IT Operation Security Policy',
  'Risk Management Policy'
]

async function main() {
  const { data: allGuides } = await sb
    .from('guides')
    .select('id, title, guide_type, domain, unit, location, document_url')
    .eq('status', 'Approved')
  
  console.log('Searching for IT policies...\n')
  
  // Search for policies by title keywords
  const foundPolicies = []
  const searchTerms = ['IT Security', 'IT Risk', 'IT Operation', 'Risk Management', 'Security Management', 'Operation Security']
  
  for (const guide of allGuides || []) {
    const title = (guide.title || '').toLowerCase()
    for (const term of searchTerms) {
      if (title.includes(term.toLowerCase())) {
        foundPolicies.push(guide)
        break
      }
    }
  }
  
  if (foundPolicies.length === 0) {
    console.log('❌ No IT policies found in database')
  } else {
    console.log(`✅ Found ${foundPolicies.length} IT policy-related guides:\n`)
    foundPolicies.forEach((g, i) => {
      console.log(`${i + 1}. ${g.title}`)
      console.log(`   Guide Type: ${g.guide_type || 'N/A'}`)
      console.log(`   Domain: ${g.domain || 'N/A'}`)
      console.log(`   Unit: ${g.unit || g.function_area || 'N/A'}`)
      console.log(`   Location: ${g.location || 'N/A'}`)
      console.log(`   Document URL: ${g.document_url || 'N/A'}`)
      console.log('')
    })
    
    // Check for specific policy names
    console.log('\nChecking for specific policy names:\n')
    for (const policyName of POLICY_NAMES) {
      const found = (allGuides || []).find(g => 
        (g.title || '').toLowerCase().includes(policyName.toLowerCase())
      )
      if (found) {
        console.log(`  ✓ Found: "${found.title}"`)
      } else {
        console.log(`  ✗ Not found: "${policyName}"`)
      }
    }
  }
  
  // Also search by document_url for PDF files
  console.log('\n\nSearching for PDF documents...\n')
  const pdfGuides = (allGuides || []).filter(g => {
    const docUrl = (g.document_url || '').toLowerCase()
    return docUrl.includes('.pdf') || docUrl.includes('25.10')
  })
  
  if (pdfGuides.length > 0) {
    console.log(`Found ${pdfGuides.length} guides with PDF documents:\n`)
    pdfGuides.forEach(g => {
      console.log(`  - ${g.title}`)
      console.log(`    Document: ${g.document_url || 'N/A'}`)
    })
  } else {
    console.log('No guides with PDF document URLs found')
  }
}

main().catch(console.error)

