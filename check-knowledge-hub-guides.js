#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const khUrl = process.env.VITE_KNOWLEDGE_HUB_SUPABASE_URL;
const khKey = process.env.VITE_KNOWLEDGE_HUB_SUPABASE_ANON_KEY;
const khClient = createClient(khUrl, khKey);

console.log('🔍 Checking Knowledge Hub database for guidelines...');
console.log('');

async function check() {
  try {
    // Get all items from v_media_all view
    const { data: allItems, error } = await khClient
      .from('v_media_all')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    console.log(`📊 Total items in v_media_all: ${allItems?.length || 0}`);
    console.log('');

    // Group by status
    const byStatus = {};
    allItems?.forEach(item => {
      const status = item.status || 'unknown';
      if (!byStatus[status]) byStatus[status] = [];
      byStatus[status].push(item);
    });

    console.log('📋 Items by status:');
    Object.keys(byStatus).forEach(status => {
      console.log(`\n${status.toUpperCase()}: ${byStatus[status].length} items`);
      byStatus[status].forEach(item => {
        console.log(`   - ${item.title}`);
        console.log(`     Type: ${item.type || 'N/A'}, Category: ${item.category || 'N/A'}`);
      });
    });

    console.log('');
    console.log('========================================');
    console.log('💡 Analysis');
    console.log('========================================');
    
    // Check for the specific guideline
    const assetGuideline = allItems?.find(item => 
      item.title.toLowerCase().includes('associate owned asset')
    );

    if (assetGuideline) {
      console.log('✅ Found "DQ Associate Owned Asset Guidelines":');
      console.log(`   Title: ${assetGuideline.title}`);
      console.log(`   Status: ${assetGuideline.status}`);
      console.log(`   Type: ${assetGuideline.type}`);
      console.log(`   Category: ${assetGuideline.category}`);
      console.log('');
    }

    // Check what has status "Approved"
    const approved = allItems?.filter(item => item.status === 'Approved');
    console.log(`📌 Approved items: ${approved?.length || 0}`);
    if (approved && approved.length > 0) {
      approved.forEach(item => {
        console.log(`   - ${item.title} (Type: ${item.type}, Category: ${item.category})`);
      });
    }

  } catch (error) {
    console.error('❌ Failed:', error);
  }
}

await check();
