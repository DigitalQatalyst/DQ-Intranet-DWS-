#!/usr/bin/env node
/**
 * Inspect existing Supabase tables to see what's actually there
 * This will help identify if tables exist with different names or structures
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env
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

async function inspectTables() {
  console.log('🔍 Inspecting your Supabase database...\n');

  // Try to query information_schema to see all tables
  // Note: This might not work with anon key, but we'll try
  console.log('📋 Checking for work directory related tables...\n');

  // Common table name variations
  const possibleTableNames = [
    'work_units',
    'work_positions', 
    'work_associates',
    'employee_profiles',
    'workunits',
    'workpositions',
    'workassociates',
    'employees',
    'associates',
    'positions',
    'units',
    'directory_units',
    'directory_positions',
    'directory_associates',
  ];

  const foundTables = [];
  const missingTables = [];

  for (const tableName of possibleTableNames) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })
        .limit(1);

      if (error) {
        if (error.code === 'PGRST116') {
          // Table doesn't exist
          missingTables.push(tableName);
        } else if (error.code === '42501' || error.message?.includes('permission denied')) {
          console.log(`  ⚠️  ${tableName} - EXISTS but access DENIED (RLS issue)`);
          foundTables.push({ name: tableName, accessible: false, error: 'Permission denied' });
        } else {
          // Other error - might exist but different issue
          console.log(`  ⚠️  ${tableName} - ${error.message}`);
        }
      } else {
        console.log(`  ✅ ${tableName} - EXISTS and accessible (${count || 0} records)`);
        foundTables.push({ name: tableName, accessible: true, count: count || 0 });
      }
    } catch (err) {
      // Skip errors
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:\n');

  if (foundTables.length > 0) {
    console.log('✅ Found Tables:');
    foundTables.forEach(t => {
      if (t.accessible) {
        console.log(`   - ${t.name}: ${t.count || 0} records`);
      } else {
        console.log(`   - ${t.name}: EXISTS but not accessible (check RLS policies)`);
      }
    });
  }

  // Check specifically for the tables we need
  console.log('\n🎯 Required Tables for Work Directory:');
  const required = ['work_units', 'work_positions', 'work_associates'];
  for (const req of required) {
    const found = foundTables.find(t => t.name === req && t.accessible);
    if (found) {
      console.log(`   ✅ ${req} - OK`);
    } else {
      console.log(`   ❌ ${req} - MISSING or NOT ACCESSIBLE`);
    }
  }

  // Test actual queries
  console.log('\n🧪 Testing actual queries...\n');
  
  const testQueries = [
    { name: 'work_units', query: () => supabase.from('work_units').select('*').limit(1) },
    { name: 'work_positions', query: () => supabase.from('work_positions').select('*').limit(1) },
    { name: 'work_associates', query: () => supabase.from('work_associates').select('*').limit(1) },
  ];

  for (const test of testQueries) {
    try {
      const { data, error } = await test.query();
      if (error) {
        console.log(`   ❌ ${test.name}: ${error.message}`);
        if (error.code === 'PGRST116') {
          console.log(`      → Table does not exist`);
        } else if (error.code === '42501') {
          console.log(`      → Permission denied - check RLS policies`);
        }
      } else {
        console.log(`   ✅ ${test.name}: OK (can query)`);
      }
    } catch (err) {
      console.log(`   ❌ ${test.name}: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n💡 Next Steps:');
  
  const missingRequired = required.filter(req => 
    !foundTables.find(t => t.name === req && t.accessible)
  );

  if (missingRequired.length > 0) {
    console.log('\n❌ Missing or inaccessible tables detected!');
    console.log('\nOption 1: If tables exist with different names:');
    console.log('   - Update the code to use your table names');
    console.log('   - Or rename your tables to match: work_units, work_positions, work_associates');
    
    console.log('\nOption 2: If tables don\'t exist:');
    console.log('   - Run the schema migration: supabase/work-directory-schema.sql');
    
    console.log('\nOption 3: If tables exist but access is denied:');
    console.log('   - Check RLS policies in Supabase dashboard');
    console.log('   - Ensure public SELECT access is enabled');
  } else {
    console.log('\n✅ All required tables are accessible!');
    console.log('   If you\'re still seeing errors, check:');
    console.log('   1. Column names match (snake_case vs camelCase)');
    console.log('   2. Data types match expected format');
    console.log('   3. Browser console for specific error messages');
  }
}

inspectTables().catch(console.error);

