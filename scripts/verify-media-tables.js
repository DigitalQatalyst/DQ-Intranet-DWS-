#!/usr/bin/env node

/**
 * Verify that news and jobs tables exist in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTables() {
  console.log('🔍 Verifying Media Center tables...\n');
  
  // Check news table
  console.log('Checking news table...');
  const { data: newsData, error: newsError } = await supabase
    .from('news')
    .select('count')
    .limit(1);
  
  if (newsError) {
    if (newsError.code === 'PGRST205') {
      console.log('❌ News table does NOT exist');
      console.log('   Run the SQL in supabase/migrations/create_media_tables.sql\n');
    } else {
      console.log('⚠️  News table error:', newsError.message, '\n');
    }
  } else {
    console.log('✅ News table exists\n');
  }
  
  // Check jobs table
  console.log('Checking jobs table...');
  const { data: jobsData, error: jobsError } = await supabase
    .from('jobs')
    .select('count')
    .limit(1);
  
  if (jobsError) {
    if (jobsError.code === 'PGRST205') {
      console.log('❌ Jobs table does NOT exist');
      console.log('   Run the SQL in supabase/migrations/create_media_tables.sql\n');
    } else {
      console.log('⚠️  Jobs table error:', jobsError.message, '\n');
    }
  } else {
    console.log('✅ Jobs table exists\n');
  }
  
  if (!newsError && !jobsError) {
    console.log('🎉 All Media Center tables are set up correctly!');
    console.log('   You can now add news and jobs data through the Supabase dashboard.');
  }
}

verifyTables().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
