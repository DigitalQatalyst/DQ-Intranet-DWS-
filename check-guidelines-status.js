#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const khUrl = process.env.VITE_KNOWLEDGE_HUB_SUPABASE_URL;
const khKey = process.env.VITE_KNOWLEDGE_HUB_SUPABASE_ANON_KEY;
const khClient = createClient(khUrl, khKey);

console.log('🔍 Checking guideline items status...');
console.log('');

async function check() {
  try {
    // Get all guideline items
    const { data: guidelines, error } = await khClient
      .from('v_media_all')
      .select('*')
      .ilike('type', 'guideline%')
      .order('date', { ascending: false });

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    console.log(`📊 Total guideline items: ${guidelines?.length || 0}`);
    console.log('');

    guidelines?.forEach(item => {
      console.log(`📄 ${item.title}`);
      console.log(`   Status: ${item.status}`);
      console.log(`   Type: ${item.type}`);
      console.log(`   Category: ${item.category}`);
      console.log(`   Slug: ${item.slug}`);
      console.log('');
    });

    console.log('========================================');
    console.log('💡 Recommendation');
    console.log('========================================');
    
    const approved = guidelines?.filter(g => g.status === 'Approved');
    const published = guidelines?.filter(g => g.status === 'Published');
    const archived = guidelines?.filter(g => g.status === 'Archived');
    
    console.log(`✅ Approved: ${approved?.length || 0}`);
    approved?.forEach(g => console.log(`   - ${g.title}`));
    
    console.log(`\n📢 Published: ${published?.length || 0}`);
    published?.forEach(g => console.log(`   - ${g.title}`));
    
    console.log(`\n📦 Archived: ${archived?.length || 0}`);
    archived?.forEach(g => console.log(`   - ${g.title}`));
    
    console.log('\n💡 To show only active guidelines, filter by:');
    console.log('   type = "Guideline" AND status != "Archived"');

  } catch (error) {
    console.error('❌ Failed:', error);
  }
}

await check();
