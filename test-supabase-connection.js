#!/usr/bin/env node

/**
 * Test Supabase Connection
 * This script tests if we can connect to Supabase and query the guides table
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env file');
  console.error('   Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('🔗 Testing Supabase Connection...');
console.log(`   URL: ${supabaseUrl}`);
console.log('');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check if guides table exists
    console.log('📋 Test 1: Checking guides table...');
    const { data: guides, error: guidesError } = await supabase
      .from('guides')
      .select('slug, title, status')
      .limit(5);

    if (guidesError) {
      console.error('❌ Guides table error:', guidesError.message);
      console.log('   This might mean the table doesn\'t exist yet.');
      console.log('   You need to run the schema migration scripts.');
    } else {
      console.log(`✅ Guides table exists! Found ${guides?.length || 0} guides`);
      if (guides && guides.length > 0) {
        console.log('   Sample guides:');
        guides.forEach(g => console.log(`   - ${g.slug}: ${g.title}`));
      }
    }
    console.log('');

    // Test 2: Check for GHC guides specifically
    console.log('📋 Test 2: Checking for GHC guides...');
    const ghcSlugs = [
      'dq-vision',
      'dq-hov',
      'dq-persona',
      'dq-agile-tms',
      'dq-agile-sos',
      'dq-agile-flows',
      'dq-agile-6xd'
    ];

    const { data: ghcGuides, error: ghcError } = await supabase
      .from('guides')
      .select('slug, title, status')
      .in('slug', ghcSlugs);

    if (ghcError) {
      console.error('❌ Error fetching GHC guides:', ghcError.message);
    } else {
      console.log(`✅ Found ${ghcGuides?.length || 0} GHC guides out of ${ghcSlugs.length}`);
      if (ghcGuides && ghcGuides.length > 0) {
        ghcGuides.forEach(g => console.log(`   ✓ ${g.slug}`));
      }
      
      const missing = ghcSlugs.filter(slug => 
        !ghcGuides?.some(g => g.slug === slug)
      );
      if (missing.length > 0) {
        console.log('   Missing guides:');
        missing.forEach(slug => console.log(`   ✗ ${slug}`));
      }
    }
    console.log('');

    // Test 3: Check news table
    console.log('📋 Test 3: Checking news table...');
    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('id, title, type')
      .limit(5);

    if (newsError) {
      console.error('❌ News table error:', newsError.message);
      console.log('   News table might not exist yet.');
    } else {
      console.log(`✅ News table exists! Found ${news?.length || 0} items`);
      if (news && news.length > 0) {
        console.log('   Sample news:');
        news.forEach(n => console.log(`   - ${n.title} (${n.type})`));
      }
    }
    console.log('');

    // Summary
    console.log('========================================');
    console.log('📊 Connection Test Summary');
    console.log('========================================');
    console.log('✅ Supabase connection: SUCCESS');
    console.log(`${guides ? '✅' : '❌'} Guides table: ${guides ? 'EXISTS' : 'MISSING'}`);
    console.log(`${ghcGuides && ghcGuides.length > 0 ? '✅' : '⚠️'} GHC guides: ${ghcGuides?.length || 0}/${ghcSlugs.length}`);
    console.log(`${news ? '✅' : '❌'} News table: ${news ? 'EXISTS' : 'MISSING'}`);
    console.log('');

    if (!guides || (ghcGuides && ghcGuides.length === 0)) {
      console.log('📝 Next Steps:');
      console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard');
      console.log('2. Open SQL Editor');
      console.log('3. Run the sync scripts from db/supabase/ folder:');
      console.log('   - sync_dq_vision_to_supabase.sql');
      console.log('   - sync_dq_hov_to_supabase.sql');
      console.log('   - sync_dq_persona_to_supabase.sql');
      console.log('   - sync_dq_agile_tms_to_supabase.sql');
      console.log('   - sync_dq_agile_sos_to_supabase.sql');
      console.log('   - sync_dq_agile_flows_to_supabase.sql');
      console.log('   - sync_dq_agile_6xd_to_supabase.sql');
      console.log('');
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error);
    process.exit(1);
  }
}

testConnection();
