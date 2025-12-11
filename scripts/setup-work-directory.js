#!/usr/bin/env node
/**
 * Interactive script to set up Work Directory tables in Supabase
 * This will guide you through the setup process
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Load .env
config({ path: resolve(process.cwd(), '.env') });

async function setup() {
  console.log('🚀 Work Directory Setup\n');
  console.log('This script will help you set up the Work Directory tables in Supabase.\n');

  // Check if credentials are set
  const url = process.env.VITE_SUPABASE_URL || '';
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

  if (!url || !anonKey) {
    console.log('❌ Supabase credentials not found in .env file\n');
    console.log('Please add your Supabase credentials first:');
    console.log('1. Go to https://app.supabase.com');
    console.log('2. Select your project → Settings → API');
    console.log('3. Copy your Project URL and anon key');
    console.log('4. Add them to your .env file:\n');
    console.log('   VITE_SUPABASE_URL=https://your-project.supabase.co');
    console.log('   VITE_SUPABASE_ANON_KEY=your-anon-key\n');
    rl.close();
    return;
  }

  console.log('✅ Supabase credentials found\n');
  console.log('📋 Next steps:');
  console.log('1. I will check if the tables exist');
  console.log('2. If they don\'t exist, I will provide the SQL to run\n');

  const supabase = createClient(url, anonKey);

  // Check tables
  const tables = ['work_units', 'work_positions', 'work_associates', 'employee_profiles'];
  const missingTables = [];

  console.log('🔍 Checking tables...\n');

  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`  ❌ ${table} - does not exist`);
        missingTables.push(table);
      } else {
        console.log(`  ⚠️  ${table} - ${error.message}`);
      }
    } else {
      console.log(`  ✅ ${table} - exists`);
    }
  }

  if (missingTables.length === 0) {
    console.log('\n✅ All tables exist! Your Work Directory should be working.');
    rl.close();
    return;
  }

  console.log(`\n❌ ${missingTables.length} table(s) are missing\n`);

  // Read the schema file
  const schemaPath = resolve(process.cwd(), 'supabase/work-directory-schema.sql');
  let schemaSQL = '';
  
  try {
    schemaSQL = readFileSync(schemaPath, 'utf-8');
    console.log('📄 Schema file found: supabase/work-directory-schema.sql\n');
  } catch (err) {
    console.log('❌ Could not read schema file. Please check that supabase/work-directory-schema.sql exists.\n');
    rl.close();
    return;
  }

  console.log('📝 To create the missing tables:\n');
  console.log('1. Go to your Supabase Dashboard: https://app.supabase.com');
  console.log('2. Select your project');
  console.log('3. Go to SQL Editor → New Query');
  console.log('4. Copy and paste the SQL below');
  console.log('5. Click "Run" to execute\n');
  console.log('─'.repeat(70));
  console.log(schemaSQL);
  console.log('─'.repeat(70));

  const addSeed = await question('\n❓ Do you want to add sample data? (y/n): ');
  
  if (addSeed.toLowerCase() === 'y') {
    const seedPath = resolve(process.cwd(), 'supabase/work-directory-seed.sql');
    try {
      const seedSQL = readFileSync(seedPath, 'utf-8');
      console.log('\n📄 Sample data SQL:\n');
      console.log('─'.repeat(70));
      console.log(seedSQL);
      console.log('─'.repeat(70));
      console.log('\n💡 Run this after creating the tables to add sample data.\n');
    } catch (err) {
      console.log('\n⚠️  Could not read seed file. You can add data manually later.\n');
    }
  }

  console.log('\n✅ After running the SQL, refresh your Work Directory page!\n');
  rl.close();
}

setup().catch(console.error);

