import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function listDWSFeatures() {
  console.log('📋 DWS (Digital Workspace) contains:\n')
  
  const { data, error } = await supabase
    .from('guides')
    .select('body')
    .eq('slug', 'dws-blueprint')
    .single()
  
  if (error) {
    console.error('❌ Error:', error.message)
    return
  }
  
  if (!data || !data.body) {
    console.log('⚠️  DWS Blueprint not found')
    return
  }
  
  const body = data.body
  
  // Extract the Feature Modules section
  const featureSectionMatch = body.match(/### Feature Modules([\s\S]*?)(?=### AI Tools|##)/)
  
  if (!featureSectionMatch) {
    console.log('⚠️  Feature Modules section not found')
    return
  }
  
  const featureSection = featureSectionMatch[1]
  
  // Extract each feature module (#### headings)
  const featureMatches = featureSection.matchAll(/#### ([\w\s&]+)\n\n([\s\S]*?)(?=\n#### |$)/g)
  
  const features = []
  for (const match of featureMatches) {
    const title = match[1].trim()
    const content = match[2]
    
    // Extract Components list
    const componentsMatch = content.match(/\*\*Components:\*\*([\s\S]*?)(?=\*\*Deployment|$)/)
    const components = componentsMatch 
      ? componentsMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().replace(/^-\s*\*\*/, '').replace(/\*\*:.*$/, '').trim())
      : []
    
    features.push({ title, components })
  }
  
  console.log('🎯 10 Core Feature Modules:\n')
  features.forEach((feature, index) => {
    console.log(`${index + 1}. ${feature.title}`)
    if (feature.components.length > 0) {
      feature.components.forEach(comp => {
        console.log(`   • ${comp}`)
      })
    }
    console.log('')
  })
  
  console.log('\n📚 Additional Sections:')
  console.log('   • AI Tools (Cursor, Windsurf)')
  console.log('   • Model Provider Management')
  console.log('   • Technology Stack')
  console.log('   • Architecture')
  console.log('   • Best Practices')
  console.log('   • Maintenance & Support')
}

listDWSFeatures().catch(console.error)

