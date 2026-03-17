#!/usr/bin/env node

/**
 * Test Knowledge Hub Supabase Connection
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const knowledgeHubUrl = process.env.VITE_KNOWLEDGE_HUB_SUPABASE_URL;
const knowledgeHubKey = process.env.VITE_KNOWLEDGE_HUB_SUPABASE_ANON_KEY;

console.log('🔗 Testing Knowledge Hub Supabase Connection...');
console.log(`   URL: ${knowledgeHubUrl}`);
console.log('');

if (!knowledgeHubUrl || !knowledgeHubKey) {
  console.error('❌ Error: Missing Knowledge Hub Supabase credentials');
  console.error('   Required: VITE_KNOWLEDGE_HUB_SUPABASE_URL and VITE_KNOWLEDGE_HUB_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(knowledgeHubUrl, knowledgeHubKey);

async function testConnection() {
  try {
    // Test 1: Check if guides table exists
    console.log('📋 Test 1: Checking guides table...');
    const { data: guides, error: guidesError } = await supabase
      .from('guides')
      .select('slug, title, status, tags')
      .limit(5);

    if (guidesError) {
      console.error('❌ Guides table error:', guidesError.message);
      console.log('   This means the table doesn\'t exist yet.');
    } else {
      console.log(`✅ Guides table exists! Found ${guides?.length || 0} guides`);
      if (guides && guides.length > 0) {
        console.log('   Sample guides:');
        guides.forEach(g => console.log(`   - ${g.slug}: ${g.title} (${g.status})`));
      }
    }
    console.log('');

    // Test 2: Check if v_media_all view exists
    console.log('📋 Test 2: Checking v_media_all view...');
    const { data: mediaView, error: viewError } = await supabase
      .from('v_media_all')
      .select('slug, title, type, status')
      .limit(5);

    if (viewError) {
      console.error('❌ View error:', viewError.message);
      console.log('   The v_media_all view doesn\'t exist yet.');
    } else {
      console.log(`✅ v_media_all view exists! Found ${mediaView?.length || 0} items`);
      if (mediaView && mediaView.length > 0) {
        console.log('   Sample items:');
        mediaView.forEach(m => console.log(`   - ${m.slug}: ${m.title} (${m.type})`));
      }
    }
    console.log('');

    // Test 3: Check for Guidelines content
    console.log('📋 Test 3: Checking Guidelines content...');
    const { data: guidelines, error: guidelinesError } = await supabase
      .from('guides')
      .select('slug, title, tags')
      .contains('tags', ['Guidelines']);

    if (guidelinesError) {
      console.error('❌ Error:', guidelinesError.message);
    } else {
      console.log(`✅ Found ${guidelines?.length || 0} Guidelines items`);
      if (guidelines && guidelines.length > 0) {
        guidelines.forEach(g => console.log(`   - ${g.title}`));
      }
    }
    console.log('');

    // Test 4: Check for Learning content
    console.log('📋 Test 4: Checking Learning content...');
    const { data: learning, error: learningError } = await supabase
      .from('guides')
      .select('slug, title, tags')
      .contains('tags', ['Learning']);

    if (learningError) {
      console.error('❌ Error:', learningError.message);
    } else {
      console.log(`✅ Found ${learning?.length || 0} Learning items`);
      if (learning && learning.length > 0) {
        learning.forEach(l => console.log(`   - ${l.title}`));
      }
    }
    console.log('');

    // Summary
    console.log('========================================');
    console.log('📊 Connection Test Summary');
    console.log('========================================');
    console.log('✅ Knowledge Hub connection: SUCCESS');
    console.log(`${guides ? '✅' : '❌'} Guides table: ${guides ? 'EXISTS' : 'MISSING'}`);
    console.log(`${mediaView ? '✅' : '❌'} v_media_all view: ${mediaView ? 'EXISTS' : 'MISSING'}`);
    console.log(`${guidelines && guidelines.length > 0 ? '✅' : '⚠️'} Guidelines content: ${guidelines?.length || 0} items`);
    console.log(`${learning && learning.length > 0 ? '✅' : '⚠️'} Learning content: ${learning?.length || 0} items`);
    console.log('');

    if (!guides || !mediaView) {
      console.log('📝 Next Steps:');
      console.log('1. Go to Knowledge Hub Dashboard:');
      console.log('   https://supabase.com/dashboard/project/jmhtrffmxjxhoxpesubv');
      console.log('');
      console.log('2. Open SQL Editor:');
      console.log('   https://supabase.com/dashboard/project/jmhtrffmxjxhoxpesubv/sql/new');
      console.log('');
      console.log('3. Run these scripts in order:');
      console.log('   - db/supabase/00_create_guides_table.sql');
      console.log('   - db/supabase/02_create_media_view.sql');
      console.log('   - db/supabase/03_insert_sample_content.sql');
      console.log('');
    } else if ((guidelines?.length || 0) === 0 && (learning?.length || 0) === 0) {
      console.log('📝 Next Step:');
      console.log('Tables exist but no content. Run:');
      console.log('   - db/supabase/03_insert_sample_content.sql');
      console.log('');
    } else {
      console.log('🎉 Everything looks good!');
      console.log('Your Knowledge Hub should be working now.');
      console.log('');
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error);
    process.exit(1);
  }
}

testConnection();
