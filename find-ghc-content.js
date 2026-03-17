#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Searching for GHC Content...');
console.log('');

// Knowledge Hub
const khUrl = process.env.VITE_KNOWLEDGE_HUB_SUPABASE_URL;
const khKey = process.env.VITE_KNOWLEDGE_HUB_SUPABASE_ANON_KEY;
const khClient = createClient(khUrl, khKey);

// LMS
const lmsUrl = process.env.VITE_LMS_SUPABASE_URL;
const lmsKey = process.env.VITE_LMS_SUPABASE_ANON_KEY;
const lmsClient = createClient(lmsUrl, lmsKey);

async function search() {
  try {
    // Search in Knowledge Hub
    console.log('📋 Searching Knowledge Hub database...');
    const { data: khData, error: khError } = await khClient
      .from('guides')
      .select('*')
      .or('title.ilike.%ghc%,title.ilike.%golden%,title.ilike.%honeycomb%,title.ilike.%competenc%')
      .eq('status', 'Approved');

    if (khError) {
      console.error('❌ Error:', khError.message);
    } else {
      console.log(`✅ Found ${khData?.length || 0} GHC items in Knowledge Hub`);
      if (khData && khData.length > 0) {
        khData.forEach(item => {
          console.log(`\n   📄 ${item.title}`);
          console.log(`      Slug: ${item.slug}`);
          console.log(`      Type: ${item.guide_type}`);
          console.log(`      Domain: ${item.domain}`);
          console.log(`      Status: ${item.status}`);
        });
      }
    }
    console.log('');

    // Search in LMS
    console.log('📋 Searching LMS database...');
    const { data: lmsData, error: lmsError } = await lmsClient
      .from('lms_courses')
      .select('*')
      .or('title.ilike.%ghc%,title.ilike.%golden%,title.ilike.%honeycomb%,title.ilike.%competenc%');

    if (lmsError) {
      console.error('❌ Error:', lmsError.message);
    } else {
      console.log(`✅ Found ${lmsData?.length || 0} GHC items in LMS`);
      if (lmsData && lmsData.length > 0) {
        lmsData.forEach(item => {
          console.log(`\n   📚 ${item.title}`);
          console.log(`      Slug: ${item.slug}`);
          console.log(`      Type: ${item.course_type}`);
          console.log(`      Category: ${item.category}`);
          console.log(`      Status: ${item.status}`);
        });
      }
    }
    console.log('');

    // Summary
    console.log('========================================');
    console.log('📊 Summary');
    console.log('========================================');
    console.log(`Knowledge Hub: ${khData?.length || 0} GHC items`);
    console.log(`LMS: ${lmsData?.length || 0} GHC items`);
    console.log('');

    if ((khData?.length || 0) > 0 || (lmsData?.length || 0) > 0) {
      console.log('💡 To show these in Learning tab, they need:');
      console.log('   - Type: "Thought Leadership" OR');
      console.log('   - Tags/Category containing: learning, course, training');
      console.log('');
    }

  } catch (error) {
    console.error('❌ Search failed:', error);
  }
}

search();
