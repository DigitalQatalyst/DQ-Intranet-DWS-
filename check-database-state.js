/**
 * Check what's currently in the Supabase database
 * Run with: node check-database-state.js
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
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

// Use service role to bypass RLS
const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function checkDatabase() {
  console.log('🔍 Checking Database State...\n');

  try {
    // Check what tables exist by querying information_schema
    console.log('📊 Checking existing tables...');
    const { data: tables, error: tablesError } = await supabaseAdmin
      .rpc('exec_sql', {
        sql: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
          ORDER BY table_name;
        `
      });

    if (tablesError) {
      // Try alternative method - direct query
      console.log('  ⚠️  Cannot query information_schema directly');
      console.log('  Trying to query known tables...\n');
      
      // Test known tables
      const knownTables = [
        'guides',
        'guide_attachments',
        'guide_templates',
        'guide_steps',
        'dq_lanes',
        'dq_tiles',
        'dq_dna_nodes',
        'dq_dna_callouts',
        'dq_lane_tile_map',
        'dq_6x_page_copy'
      ];

      for (const table of knownTables) {
        const { data, error, count } = await supabaseAdmin
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          if (error.code === 'PGRST116') {
            console.log(`  ❌ ${table}: Table does not exist`);
          } else {
            console.log(`  ⚠️  ${table}: ${error.message}`);
          }
        } else {
          console.log(`  ✅ ${table}: Exists (${count || 0} records)`);
        }
      }
    } else {
      console.log('  Found tables:', tables);
    }

    // Try to get guides data if table exists
    console.log('\n📈 Checking guides table...');
    const { data: guides, error: guidesError, count } = await supabaseAdmin
      .from('guides')
      .select('*', { count: 'exact' })
      .limit(5);

    if (guidesError) {
      if (guidesError.code === 'PGRST116') {
        console.log('  ❌ Guides table does not exist');
        console.log('  💡 You need to run the schema migration');
      } else {
        console.log(`  ⚠️  Error: ${guidesError.message}`);
      }
    } else {
      console.log(`  ✅ Found ${count || 0} guides`);
      if (guides && guides.length > 0) {
        console.log('  Sample guides:');
        guides.forEach((g, i) => {
          console.log(`    ${i + 1}. ${g.title || g.id} (${g.status || 'no status'})`);
        });
      }
    }

    // Check DQ tables
    console.log('\n🎯 Checking DQ tables...');
    const dqTables = ['dq_lanes', 'dq_tiles', 'dq_dna_nodes'];
    for (const table of dqTables) {
      const { count, error } = await supabaseAdmin
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`  ❌ ${table}: Does not exist`);
        } else {
          console.log(`  ⚠️  ${table}: ${error.message}`);
        }
      } else {
        console.log(`  ✅ ${table}: ${count || 0} records`);
      }
    }

    console.log('\n✅ Database check complete!\n');
    console.log('📝 Next Steps:');
    console.log('  1. If tables don\'t exist, run the schema migration');
    console.log('  2. If tables exist but are empty, run the seed script');
    console.log('  3. Check supabase/schema.sql and supabase/seed.sql\n');

  } catch (error) {
    console.error('\n❌ Error checking database:');
    console.error(error);
    process.exit(1);
  }
}

checkDatabase();

