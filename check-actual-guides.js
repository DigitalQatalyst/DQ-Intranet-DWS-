#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const knowledgeHubUrl = process.env.VITE_KNOWLEDGE_HUB_SUPABASE_URL;
const knowledgeHubKey = process.env.VITE_KNOWLEDGE_HUB_SUPABASE_ANON_KEY;

const supabase = createClient(knowledgeHubUrl, knowledgeHubKey);

async function checkGuides() {
  console.log('🔍 Checking all guides in database...\n');
  
  const { data, error } = await supabase
    .from('guides')
    .select('*')
    .eq('status', 'Approved')
    .order('last_updated_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`Found ${data?.length || 0} approved guides:\n`);
  
  data?.forEach((guide, index) => {
    console.log(`${index + 1}. ${guide.title}`);
    console.log(`   Slug: ${guide.slug}`);
    console.log(`   Status: ${guide.status}`);
    console.log(`   Type: ${guide.type || 'N/A'}`);
    console.log(`   Guide Type: ${guide.guide_type || 'N/A'}`);
    console.log(`   Domain: ${guide.domain || 'N/A'}`);
    console.log(`   Category: ${guide.category || 'N/A'}`);
    console.log(`   Tags: ${guide.tags || 'N/A'}`);
    console.log('');
  });
}

checkGuides();
