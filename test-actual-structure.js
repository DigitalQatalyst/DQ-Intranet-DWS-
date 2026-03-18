#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const knowledgeHubUrl = process.env.VITE_KNOWLEDGE_HUB_SUPABASE_URL;
const knowledgeHubKey = process.env.VITE_KNOWLEDGE_HUB_SUPABASE_ANON_KEY;

console.log('🔗 Testing with actual table structure...');
console.log('');

const supabase = createClient(knowledgeHubUrl, knowledgeHubKey);

async function test() {
  try {
    // Test 1: Get all columns from guides table
    console.log('📋 Test 1: Fetching guides (all columns)...');
    const { data: guides, error: guidesError } = await supabase
      .from('guides')
      .select('*')
      .limit(3);

    if (guidesError) {
      console.error('❌ Error:', guidesError.message);
    } else {
      console.log(`✅ Found ${guides?.length || 0} guides`);
      if (guides && guides.length > 0) {
        console.log('Sample guide structure:');
        console.log(JSON.stringify(guides[0], null, 2));
      }
    }
    console.log('');

    // Test 2: Check if v_media_all view exists
    console.log('📋 Test 2: Checking v_media_all view...');
    const { data: viewData, error: viewError } = await supabase
      .from('v_media_all')
      .select('*')
      .limit(3);

    if (viewError) {
      console.error('❌ View error:', viewError.message);
      console.log('   The view needs to be created.');
    } else {
      console.log(`✅ View exists! Found ${viewData?.length || 0} items`);
      if (viewData && viewData.length > 0) {
        console.log('Sample view structure:');
        console.log(JSON.stringify(viewData[0], null, 2));
      }
    }
    console.log('');

    // Test 3: Try to get Guidelines-type content
    console.log('📋 Test 3: Fetching Guidelines content...');
    const { data: guidelines, error: guidelinesError } = await supabase
      .from('guides')
      .select('id, title, guide_type, status')
      .eq('status', 'Approved')
      .limit(5);

    if (guidelinesError) {
      console.error('❌ Error:', guidelinesError.message);
    } else {
      console.log(`✅ Found ${guidelines?.length || 0} approved guides`);
      if (guidelines && guidelines.length > 0) {
        guidelines.forEach(g => console.log(`   - ${g.title} (${g.guide_type})`));
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

test();
