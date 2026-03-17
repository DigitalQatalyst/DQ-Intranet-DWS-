#!/usr/bin/env node

/**
 * Script to delete DQ L24 Working Rooms Guidelines from Supabase
 * This will completely remove the guide from the database
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env', override: true })

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  console.error('   Looking for: VITE_SUPABASE_URL or SUPABASE_URL')
  console.error('   Looking for: SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

async function main() {
  console.log('🗑️  Deleting DQ L24 Working Rooms Guidelines from Supabase...\n')
  
  try {
    // First, check if the guide exists
    const { data: existingGuide, error: findError } = await supabase
      .from('guides')
      .select('id, slug, title')
      .eq('slug', 'dq-l24-working-rooms-guidelines')
      .single()

    if (findError || !existingGuide) {
      console.log('ℹ️  Guide not found. It may have already been deleted.')
      return
    }

    console.log(`✓ Found guide: ${existingGuide.title} (ID: ${existingGuide.id})\n`)

    // Delete the guide
    const { error: deleteError } = await supabase
      .from('guides')
      .delete()
      .eq('id', existingGuide.id)

    if (deleteError) {
      console.error('❌ Error deleting guide:', deleteError.message)
      process.exit(1)
    }

    console.log('✅ Successfully deleted DQ L24 Working Rooms Guidelines from Supabase!')
    console.log('\n📋 Deleted:')
    console.log(`   - Guide ID: ${existingGuide.id}`)
    console.log(`   - Slug: ${existingGuide.slug}`)
    console.log(`   - Title: ${existingGuide.title}`)
    console.log('\n✨ The guide has been completely removed from the database.')

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    process.exit(1)
  }
}

main()
