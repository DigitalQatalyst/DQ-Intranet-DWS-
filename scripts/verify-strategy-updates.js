import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function verifyUpdates() {
  console.log('🔍 Verifying Strategy guide updates...\n')
  
  const guides = [
    { slug: 'dq-vision-and-mission', name: 'Vision' },
    { slug: 'agile-6xd-products', name: '6xD Products' },
    { slug: 'dq-competencies', name: 'Culture' }
  ]
  
  for (const guide of guides) {
    const { data, error } = await supabase
      .from('guides')
      .select('title, body')
      .eq('slug', guide.slug)
      .single()
    
    if (error) {
      console.log(`❌ ${guide.name}: Error - ${error.message}`)
      continue
    }
    
    if (!data) {
      console.log(`⚠️  ${guide.name}: Not found`)
      continue
    }
    
    const body = data.body || ''
    const featureBoxes = (body.match(/<div class="feature-box">/g) || []).length
    
    console.log(`✅ ${guide.name} (${data.title}):`)
    console.log(`   Content length: ${body.length} chars`)
    console.log(`   Feature boxes: ${featureBoxes}`)
    
    if (guide.slug === 'agile-6xd-products') {
      const expectedBoxes = 6
      if (featureBoxes === expectedBoxes) {
        console.log(`   ✓ All ${expectedBoxes} products are in their own tiles`)
      } else {
        console.log(`   ⚠️  Expected ${expectedBoxes} boxes, found ${featureBoxes}`)
      }
    }
    
    if (guide.slug === 'dq-competencies') {
      const expectedBoxes = 3
      if (featureBoxes === expectedBoxes) {
        console.log(`   ✓ All ${expectedBoxes} mantras are in their own tiles`)
      } else {
        console.log(`   ⚠️  Expected ${expectedBoxes} boxes, found ${featureBoxes}`)
      }
    }
    
    console.log('')
  }
  
  console.log('✅ Verification complete!')
}

verifyUpdates().catch(console.error)


