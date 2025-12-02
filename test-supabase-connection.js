/**
 * Test script to verify Supabase cloud connection
 * Run with: node test-supabase-connection.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env files
config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local') });

const url = process.env.VITE_SUPABASE_URL || '';
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('🔍 Testing Supabase Connection...\n');
console.log('Configuration:');
console.log(`  URL: ${url ? url.substring(0, 30) + '...' : '❌ NOT SET'}`);
console.log(`  Anon Key: ${anonKey ? anonKey.substring(0, 20) + '...' : '❌ NOT SET'}`);
console.log(`  Service Key: ${serviceKey ? serviceKey.substring(0, 20) + '...' : '❌ NOT SET'}\n`);

if (!url || !anonKey) {
  console.error('❌ Missing required environment variables!');
  console.error('\nPlease set in .env or .env.local:');
  console.error('  VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('  VITE_SUPABASE_ANON_KEY=your-anon-key');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (optional for admin operations)\n');
  process.exit(1);
}

// Test with anon key (client-side)
const supabaseClient = createClient(url, anonKey);

async function testConnection() {
  try {
    console.log('📡 Testing connection with anon key...');
    
    // Test 1: Check if we can connect
    const { data: healthCheck, error: healthError } = await supabaseClient
      .from('guides')
      .select('count')
      .limit(1);
    
    if (healthError && healthError.code !== 'PGRST116') {
      // PGRST116 = table doesn't exist, which is okay for testing
      console.log(`  ⚠️  Connection test: ${healthError.message}`);
    } else {
      console.log('  ✅ Connection successful!');
    }

    // Test 2: Check what tables exist
    console.log('\n📊 Checking available tables...');
    const tables = [
      'guides',
      'guide_attachments',
      'guide_templates',
      'guide_steps',
      'dq_lanes',
      'dq_tiles',
      'dq_dna_nodes',
    ];

    for (const table of tables) {
      const { data, error } = await supabaseClient
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`  ⚠️  ${table}: Table does not exist`);
        } else {
          console.log(`  ❌ ${table}: ${error.message}`);
        }
      } else {
        console.log(`  ✅ ${table}: Table exists`);
      }
    }

    // Test 3: Count guides if table exists
    console.log('\n📈 Counting records...');
    const { count, error: countError } = await supabaseClient
      .from('guides')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      if (countError.code === 'PGRST116') {
        console.log('  ⚠️  Guides table does not exist yet');
      } else {
        console.log(`  ❌ Error counting guides: ${countError.message}`);
      }
    } else {
      console.log(`  ✅ Found ${count || 0} guides in database`);
    }

    // Test 4: Check RLS policies (if we have service key)
    if (serviceKey) {
      console.log('\n🔐 Testing with service role key...');
      const supabaseAdmin = createClient(url, serviceKey);
      
      const { count: adminCount, error: adminError } = await supabaseAdmin
        .from('guides')
        .select('*', { count: 'exact', head: true });
      
      if (adminError) {
        console.log(`  ⚠️  Admin access: ${adminError.message}`);
      } else {
        console.log(`  ✅ Admin access works! Found ${adminCount || 0} guides`);
      }
    } else {
      console.log('\n⚠️  Service role key not set - skipping admin tests');
    }

    console.log('\n✅ Connection test complete!\n');
    
  } catch (error) {
    console.error('\n❌ Connection test failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();

