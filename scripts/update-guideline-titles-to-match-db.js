/**
 * Script to update all GuidelinePage components to fetch titles from database
 * and pass them to HeroSection components
 * 
 * This ensures titles on cards match titles on detail pages
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Map of slug to expected title (for verification)
const guidelineSlugs = [
  'dq-avr-awards-guidelines',
  'dq-wfh-guidelines',
  'dq-asset-maintenance-repair-disposal-guidelines',
  'dq-dress-code-guideline',
  'dq-deals-bd-guidelines',
  'dq-atp-stop-scans-guidelines',
  'dq-azure-devops-task-guidelines',
  'dq-biometric-system-guidelines',
  'dq-wr-attendance-punctuality-policy',
  'dq-associate-owned-asset-guidelines',
  'dq-l24-working-rooms-guidelines',
  'dq-rescue-shift-guidelines',
  'dq-raid-guidelines',
  'dq-agenda-scheduling-guidelines',
  'dq-functional-tracker-guidelines',
  'dq-scrum-master-guidelines',
  'dq-forum-guidelines',
]

async function getGuideTitles() {
  console.log('📋 Fetching guide titles from database...\n')
  
  const { data, error } = await supabase
    .from('guides')
    .select('slug, title, last_updated_at')
    .in('slug', guidelineSlugs)
    .order('title')
  
  if (error) {
    console.error('❌ Error fetching guides:', error)
    return []
  }
  
  return data || []
}

async function main() {
  const guides = await getGuideTitles()
  
  console.log(`Found ${guides.length} guides:\n`)
  guides.forEach((guide, idx) => {
    const date = guide.last_updated_at 
      ? new Date(guide.last_updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'N/A'
    console.log(`${idx + 1}. ${guide.title}`)
    console.log(`   Slug: ${guide.slug}`)
    console.log(`   Last Updated: ${date}\n`)
  })
  
  console.log('\n✅ Use these titles in HeroSection and GuidelinePage components')
  console.log('   Update HeroSection to accept title prop')
  console.log('   Update GuidelinePage to fetch title from database')
  console.log('   Pass title to HeroSection and use in breadcrumb')
}

main().catch(console.error)

