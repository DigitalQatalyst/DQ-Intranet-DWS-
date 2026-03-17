#!/usr/bin/env node
/**
 * Check if Work Directory tables exist in Supabase
 * Run with: node scripts/check-work-directory-tables.js
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env files
config({ path: resolve(process.cwd(), '.env') });
config({ path: resolve(process.cwd(), '.env.local') });

const url = process.env.VITE_SUPABASE_URL || '';
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!url || !anonKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(url, anonKey);

async function checkTables() {
  console.log('🔍 Checking Work Directory tables...\n');

  const tables = [
    { name: 'work_units', description: 'Organizational units' },
    { name: 'work_positions', description: 'Job positions' },
    { name: 'work_associates', description: 'Associates/employees' },
    { name: 'employee_profiles', description: 'Employee profiles' },
  ];

  const results = [];

  for (const table of tables) {
    try {
      console.log(`Checking ${table.name}...`);
      
      // Try to query the table
      const { data, error, count } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true })
        .limit(1);

      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`  ❌ Table "${table.name}" does NOT exist\n`);
          results.push({ table: table.name, exists: false, error: 'Table does not exist' });
        } else if (error.code === '42501' || error.message?.includes('permission denied')) {
          console.log(`  ⚠️  Table "${table.name}" exists but access is DENIED (RLS policy issue)\n`);
          results.push({ table: table.name, exists: true, error: 'Permission denied - RLS policy issue' });
        } else {
          console.log(`  ❌ Error accessing "${table.name}": ${error.message}\n`);
          results.push({ table: table.name, exists: false, error: error.message });
        }
      } else {
        console.log(`  ✅ Table "${table.name}" exists (${count || 0} records)\n`);
        results.push({ table: table.name, exists: true, count: count || 0 });
      }
    } catch (err) {
      console.log(`  ❌ Unexpected error: ${err.message}\n`);
      results.push({ table: table.name, exists: false, error: err.message });
    }
  }

  // Summary
  console.log('\n📊 Summary:');
  console.log('='.repeat(50));
  
  const missingTables = results.filter(r => !r.exists);
  const existingTables = results.filter(r => r.exists && !r.error);
  const permissionIssues = results.filter(r => r.exists && r.error);

  if (missingTables.length > 0) {
    console.log('\n❌ Missing Tables:');
    missingTables.forEach(r => {
      console.log(`   - ${r.table}: ${r.error}`);
    });
    console.log('\n💡 Solution: Run the schema migration:');
    console.log('   1. Go to Supabase SQL Editor');
    console.log('   2. Copy contents of supabase/work-directory-schema.sql');
    console.log('   3. Run the migration');
  }

  if (permissionIssues.length > 0) {
    console.log('\n⚠️  Permission Issues:');
    permissionIssues.forEach(r => {
      console.log(`   - ${r.table}: ${r.error}`);
    });
    console.log('\n💡 Solution: Check RLS policies in Supabase dashboard');
  }

  if (existingTables.length > 0) {
    console.log('\n✅ Existing Tables:');
    existingTables.forEach(r => {
      console.log(`   - ${r.table}: ${r.count || 0} records`);
    });
  }

  console.log('\n' + '='.repeat(50));
}

checkTables().catch(console.error);

