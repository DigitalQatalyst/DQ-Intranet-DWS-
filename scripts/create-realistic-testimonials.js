// scripts/create-realistic-testimonials.js
// Create realistic testimonial guides for all categories
// Usage: node scripts/create-realistic-testimonials.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import { randomUUID } from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

const SUPABASE_URL = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY envs. Aborting.')
  process.exit(1)
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } })

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const TESTIMONIALS = [
  {
    category: 'Journey / Transformation Story',
    title: 'Digital Transformation Journey: From Legacy Systems to Cloud-First',
    summary: 'A comprehensive account of how DQ helped a major client transition from legacy infrastructure to a modern, cloud-first architecture, resulting in 40% cost reduction and improved scalability.',
    body: 'This transformation story details the 18-month journey of migrating critical business systems to the cloud. Key milestones included stakeholder alignment, phased migration strategy, and comprehensive change management. The result was not just a technical upgrade, but a complete organizational transformation that enabled new business capabilities.'
  },
  {
    category: 'Case Study',
    title: 'E-Commerce Platform Optimization: 300% Growth in 12 Months',
    summary: 'Case study documenting how DQ\'s solutions architecture and performance optimization strategies helped an e-commerce client achieve unprecedented growth while maintaining system stability.',
    body: 'This detailed case study examines the technical and strategic interventions that led to a 300% increase in transaction volume. Key focus areas included database optimization, caching strategies, microservices architecture, and automated scaling. The study includes metrics, challenges overcome, and lessons learned.'
  },
  {
    category: 'Leadership Reflection',
    title: 'Leading Through Change: Building Resilient Teams in Uncertain Times',
    summary: 'A leadership perspective on navigating organizational change, building team resilience, and maintaining delivery excellence during periods of transformation and uncertainty.',
    body: 'This reflection shares insights from leading teams through significant organizational changes. Topics covered include communication strategies, maintaining team morale, balancing delivery pressure with transformation needs, and the importance of transparent leadership. Practical lessons for leaders facing similar challenges.'
  },
  {
    category: 'Client / Partner Reference',
    title: 'Client Success Story: Financial Services Digital Innovation',
    summary: 'A client testimonial highlighting how DQ\'s partnership approach and technical expertise delivered measurable business outcomes in the financial services sector.',
    body: 'This reference showcases a successful partnership with a leading financial services organization. The collaboration resulted in improved customer experience, reduced operational costs, and faster time-to-market for new products. The client shares their perspective on what made the partnership successful and the value delivered.'
  },
  {
    category: 'Team / Employee Experience',
    title: 'Growing as a Developer: My Journey at DQ',
    summary: 'A team member shares their experience of professional growth, learning opportunities, and the collaborative culture that defines working at DQ.',
    body: 'This personal account highlights the growth journey of a team member, from joining as a junior developer to becoming a technical lead. It covers mentorship opportunities, challenging projects, learning culture, and how the organization supports professional development. A genuine reflection on the employee experience.'
  },
  {
    category: 'Milestone / Achievement',
    title: 'Celebrating 100 Successful Deployments: A Milestone in Excellence',
    summary: 'A celebration of reaching 100 consecutive successful production deployments, highlighting the processes, practices, and team commitment that made this achievement possible.',
    body: 'This milestone story celebrates a significant achievement in delivery excellence. It details the practices that enabled this success: comprehensive testing, CI/CD pipelines, code review processes, and a culture of quality. The story includes statistics, team reflections, and the impact on client confidence and team morale.'
  }
]

async function main() {
  try {
    console.log('='.repeat(60))
    console.log('CREATING REALISTIC TESTIMONIALS')
    console.log('='.repeat(60))
    
    // First, remove the incorrectly converted guides (those that were guidelines)
    console.log('\nCleaning up incorrectly converted guides...')
    const { data: existingTestimonials } = await sb
      .from('guides')
      .select('id, title, guide_type')
      .eq('status', 'Approved')
      .or('domain.eq.Testimonial,guide_type.ilike.%Testimonial%')
    
    const incorrectGuides = (existingTestimonials || []).filter(g => {
      const title = (g.title || '').toLowerCase()
      return title.includes('guidelines') || title.includes('guideline')
    })
    
    console.log(`Found ${incorrectGuides.length} incorrectly converted guides to clean up`)
    
    for (const guide of incorrectGuides) {
      // Convert them back to Guidelines
      try {
        const { error } = await sb
          .from('guides')
          .update({ 
            domain: null,
            guide_type: 'Best Practice'
          })
          .eq('id', guide.id)
        
        if (error) {
          console.error(`  ✗ Error cleaning "${guide.title}":`, error.message)
        } else {
          console.log(`  ✓ Cleaned "${guide.title}"`)
        }
      } catch (err) {
        console.error(`  ✗ Network error:`, err.message)
      }
    }
    
    // Now create realistic testimonials
    console.log(`\n${'='.repeat(60)}`)
    console.log('CREATING NEW TESTIMONIAL GUIDES')
    console.log('='.repeat(60))
    
    for (const testimonial of TESTIMONIALS) {
      const slug = slugify(testimonial.title)
      
      try {
        const { data, error } = await sb
          .from('guides')
          .insert({
            slug: slug,
            title: testimonial.title,
            summary: testimonial.summary,
            body: testimonial.body,
            domain: 'Testimonial',
            guide_type: testimonial.category,
            status: 'Approved'
          })
          .select()
          .single()
        
        if (error) {
          // If slug exists, try to update instead
          if (error.code === '23505' || error.message.includes('unique')) {
            console.log(`  ⚠ "${testimonial.title}" already exists, updating...`)
            const { error: updateError } = await sb
              .from('guides')
              .update({
                title: testimonial.title,
                summary: testimonial.summary,
                body: testimonial.body,
                domain: 'Testimonial',
                guide_type: testimonial.category,
                status: 'Approved'
              })
              .eq('slug', slug)
            
            if (updateError) {
              console.error(`    ✗ Error updating:`, updateError.message)
            } else {
              console.log(`    ✓ Updated "${testimonial.title}"`)
            }
          } else {
            console.error(`  ✗ Error creating "${testimonial.title}":`, error.message)
          }
        } else {
          console.log(`  ✓ Created "${testimonial.title}" (${testimonial.category})`)
        }
      } catch (err) {
        console.error(`  ✗ Network error creating "${testimonial.title}":`, err.message)
      }
    }
    
    // Final verification
    console.log(`\n${'='.repeat(60)}`)
    console.log('FINAL TESTIMONIAL STATUS')
    console.log('='.repeat(60))
    
    const { data: finalGuides } = await sb
      .from('guides')
      .select('id, title, guide_type, domain')
      .eq('status', 'Approved')
      .or('domain.eq.Testimonial,guide_type.ilike.%Testimonial%')
    
    const finalTestimonials = (finalGuides || []).filter(g => {
      const domain = (g.domain || '').toLowerCase()
      const guideType = (g.guide_type || '').toLowerCase()
      return domain.includes('testimonial') || guideType.includes('testimonial')
    })
    
    const categories = [
      'Journey / Transformation Story',
      'Case Study',
      'Leadership Reflection',
      'Client / Partner Reference',
      'Team / Employee Experience',
      'Milestone / Achievement'
    ]
    
    for (const category of categories) {
      const matching = finalTestimonials.filter(g => {
        const guideType = (g.guide_type || '').toLowerCase().trim()
        return guideType === category.toLowerCase().trim() ||
               guideType.includes(category.toLowerCase())
      })
      
      if (matching.length > 0) {
        console.log(`  ✓ ${category}: ${matching.length} guides`)
        matching.forEach(g => console.log(`    - ${g.title}`))
      } else {
        console.log(`  ✗ ${category}: No guides`)
      }
    }
    
    console.log(`\n✓ Done!`)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()

