/**
 * Check what's in the guides table
 * Run with: node check-guides-table.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env files
config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local') });

const url = process.env.VITE_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!url || !serviceKey) {
  console.error('❌ Missing credentials in .env');
  process.exit(1);
}

// Use service role to bypass RLS
const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function checkGuides() {
  console.log('🔍 Checking Guides Table...\n');

  try {
    // Get total count
    console.log('📊 Getting guides count...');
    const { count, error: countError } = await supabaseAdmin
      .from('guides')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error:', countError);
      console.error('   Code:', countError.code);
      console.error('   Message:', countError.message);
      process.exit(1);
    }

    console.log(`✅ Found ${count || 0} guides in database\n`);

    if (count === 0) {
      console.log('📝 Table exists but is empty. You may want to seed some data.\n');
      return;
    }

    // Get sample guides
    console.log('📋 Fetching sample guides...');
    const { data: guides, error: guidesError } = await supabaseAdmin
      .from('guides')
      .select('id, slug, title, status, guide_type, domain, created_at')
      .limit(10)
      .order('created_at', { ascending: false });

    if (guidesError) {
      console.error('❌ Error fetching guides:', guidesError);
      process.exit(1);
    }

    console.log(`\n📚 Sample Guides (showing ${guides?.length || 0} of ${count}):\n`);
    
    if (guides && guides.length > 0) {
      guides.forEach((guide, i) => {
        console.log(`${i + 1}. ${guide.title || guide.id}`);
        console.log(`   Slug: ${guide.slug || 'N/A'}`);
        console.log(`   Status: ${guide.status || 'N/A'}`);
        console.log(`   Type: ${guide.guide_type || 'N/A'}`);
        console.log(`   Domain: ${guide.domain || 'N/A'}`);
        console.log(`   Created: ${guide.created_at ? new Date(guide.created_at).toLocaleDateString() : 'N/A'}`);
        console.log('');
      });
    }

    // Check guide types distribution
    console.log('\n📊 Guide Types Distribution:');
    const { data: typeData, error: typeError } = await supabaseAdmin
      .from('guides')
      .select('guide_type');

    if (!typeError && typeData) {
      const typeCounts = {};
      typeData.forEach(g => {
        const type = g.guide_type || 'null';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
      Object.entries(typeCounts).forEach(([type, count]) => {
        console.log(`   ${type}: ${count}`);
      });
    }

    // Check domain distribution
    console.log('\n📊 Domain Distribution:');
    const { data: domainData, error: domainError } = await supabaseAdmin
      .from('guides')
      .select('domain');

    if (!domainError && domainData) {
      const domainCounts = {};
      domainData.forEach(g => {
        const domain = g.domain || 'null';
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
      });
      Object.entries(domainCounts).forEach(([domain, count]) => {
        console.log(`   ${domain}: ${count}`);
      });
    }

    // Check status distribution
    console.log('\n📊 Status Distribution:');
    const { data: statusData, error: statusError } = await supabaseAdmin
      .from('guides')
      .select('status');

    if (!statusError && statusData) {
      const statusCounts = {};
      statusData.forEach(g => {
        const status = g.status || 'null';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`   ${status}: ${count}`);
      });
    }

    console.log('\n✅ Check complete!\n');

  } catch (error) {
    console.error('\n❌ Error:');
    console.error(error);
    process.exit(1);
  }
}

checkGuides();


