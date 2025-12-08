import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Missing guidelines to restore
const missingGuidelines = [
  {
    slug: 'dq-agenda-scheduling-guidelines',
    title: 'DQ Agenda & Scheduling Guidelines',
    summary: 'Guidelines for creating, managing, and optimizing agendas and scheduling processes.',
    domain: 'guidelines',
    guide_type: 'Guideline',
    function_area: 'Operations',
    status: 'Approved',
    complexity_level: 'Intermediate',
    authorName: 'Operations Team',
    authorOrg: 'Digital Qatalyst',
    heroImageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
    body: '# DQ Agenda & Scheduling Guidelines\n\nGuidelines for creating, managing, and optimizing agendas and scheduling processes.\n\n## Overview\n\nThis guideline covers best practices for agenda creation, meeting scheduling, and time management.\n\n## Key Principles\n\n- Clear agenda structure\n- Efficient scheduling practices\n- Time management optimization\n\n*Note: Full content to be added.*'
  },
  {
    slug: 'dq-functional-tracker-guidelines',
    title: 'DQ Functional Tracker Guidelines',
    summary: 'Guidelines for using and maintaining functional tracking systems and processes.',
    domain: 'guidelines',
    guide_type: 'Guideline',
    function_area: 'Operations',
    status: 'Approved',
    complexity_level: 'Intermediate',
    authorName: 'Operations Team',
    authorOrg: 'Digital Qatalyst',
    heroImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
    body: '# DQ Functional Tracker Guidelines\n\nGuidelines for using and maintaining functional tracking systems and processes.\n\n## Overview\n\nThis guideline covers best practices for functional tracking, monitoring, and reporting.\n\n## Key Principles\n\n- Accurate tracking\n- Regular updates\n- Data integrity\n\n*Note: Full content to be added.*'
  },
  {
    slug: 'dq-l24-working-rooms-guidelines',
    title: 'DQ L24 Working Rooms Guidelines',
    summary: 'Guidelines for managing and utilizing DQ Live24 working rooms effectively.',
    domain: 'guidelines',
    guide_type: 'Guideline',
    function_area: 'Digital Workspace',
    status: 'Approved',
    complexity_level: 'Basic',
    authorName: 'Digital Workspace Team',
    authorOrg: 'Digital Qatalyst',
    heroImageUrl: 'https://images.unsplash.com/photo-1521737854947-0b219b6c2c94?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
    body: '# DQ L24 Working Rooms Guidelines\n\nGuidelines for managing and utilizing DQ Live24 working rooms effectively.\n\n## Overview\n\nThis guideline covers best practices for using DQ Live24 working rooms for collaboration and productivity.\n\n## Key Principles\n\n- Room management\n- Collaboration best practices\n- Resource optimization\n\n*Note: Full content to be added.*'
  },
  {
    slug: 'dq-rescue-shift-guidelines',
    title: 'DQ Rescue Shift Guidelines',
    summary: 'Guidelines for managing rescue shifts and emergency response procedures.',
    domain: 'guidelines',
    guide_type: 'Guideline',
    function_area: 'Operations',
    status: 'Approved',
    complexity_level: 'Intermediate',
    authorName: 'Operations Team',
    authorOrg: 'Digital Qatalyst',
    heroImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
    body: '# DQ Rescue Shift Guidelines\n\nGuidelines for managing rescue shifts and emergency response procedures.\n\n## Overview\n\nThis guideline covers procedures for handling rescue shifts, emergency situations, and critical incidents.\n\n## Key Principles\n\n- Rapid response\n- Clear escalation\n- Effective communication\n\n*Note: Full content to be added.*'
  },
  {
    slug: 'dq-scrum-master-guidelines',
    title: 'DQ Scrum Master Guidelines',
    summary: 'Guidelines for Scrum Master roles, responsibilities, and best practices.',
    domain: 'guidelines',
    guide_type: 'Guideline',
    function_area: 'Products',
    status: 'Approved',
    complexity_level: 'Intermediate',
    authorName: 'Agile Office',
    authorOrg: 'Digital Qatalyst',
    heroImageUrl: 'https://images.unsplash.com/photo-1518085250887-2f903c200fee?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
    body: '# DQ Scrum Master Guidelines\n\nGuidelines for Scrum Master roles, responsibilities, and best practices.\n\n## Overview\n\nThis guideline covers the Scrum Master role, responsibilities, and best practices for effective agile delivery.\n\n## Key Principles\n\n- Servant leadership\n- Team facilitation\n- Process improvement\n\n*Note: Full content to be added.*'
  },
  {
    slug: 'raid-guidelines',
    title: 'RAID Guidelines',
    summary: 'Guidelines for managing Risks, Assumptions, Issues, and Dependencies (RAID) in projects.',
    domain: 'guidelines',
    guide_type: 'Guideline',
    function_area: 'Solutions',
    status: 'Approved',
    complexity_level: 'Intermediate',
    authorName: 'PMO',
    authorOrg: 'Digital Qatalyst',
    heroImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3',
    body: '# RAID Guidelines\n\nGuidelines for managing Risks, Assumptions, Issues, and Dependencies (RAID) in projects.\n\n## Overview\n\nThis guideline covers best practices for identifying, tracking, and managing Risks, Assumptions, Issues, and Dependencies throughout project lifecycles.\n\n## Key Components\n\n- **Risks:** Potential problems that could impact project success\n- **Assumptions:** Factors considered to be true without proof\n- **Issues:** Current problems that need resolution\n- **Dependencies:** Relationships between tasks or deliverables\n\n## Key Principles\n\n- Regular RAID reviews\n- Clear ownership and accountability\n- Proactive risk management\n\n*Note: Full content to be added.*'
  }
]

async function restoreMissingGuidelines() {
  console.log('🔄 Restoring missing guidelines...\n')
  
  let restored = 0
  let errors = 0
  
  for (const guideline of missingGuidelines) {
    // Check if it already exists
    const { data: existing } = await supabase
      .from('guides')
      .select('id, title')
      .eq('slug', guideline.slug)
      .single()
    
    if (existing) {
      console.log(`⚠️  "${guideline.title}" already exists, skipping...`)
      continue
    }
    
    // Insert the guideline
    const { data, error } = await supabase
      .from('guides')
      .insert({
        slug: guideline.slug,
        title: guideline.title,
        summary: guideline.summary,
        body: guideline.body,
        domain: guideline.domain,
        guide_type: guideline.guide_type,
        function_area: guideline.function_area,
        status: guideline.status,
        complexity_level: guideline.complexity_level,
        author_name: guideline.authorName,
        author_org: guideline.authorOrg,
        hero_image_url: guideline.heroImageUrl,
        last_updated_at: new Date().toISOString(),
        is_editors_pick: false,
        download_count: 0
      })
      .select()
      .single()
    
    if (error) {
      console.error(`❌ Error creating "${guideline.title}":`, error.message)
      errors++
    } else {
      console.log(`✅ Restored: "${guideline.title}"`)
      restored++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Restored: ${restored}`)
  console.log(`   Errors: ${errors}`)
  console.log(`   Total: ${missingGuidelines.length}`)
  console.log(`\n✅ Done!`)
  console.log(`\n💡 Note: These guidelines have placeholder content.`)
  console.log(`   Please update them with full content from the original documents.`)
}

restoreMissingGuidelines().catch(console.error)

