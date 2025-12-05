/**
 * Test script to verify Supabase connection and table access
 * Run this in browser console or call from a component
 */

import { supabaseClient } from '@/lib/supabaseClient';

export async function testSupabaseConnection() {
  console.log('=== Testing Supabase Connection ===');
  
  // Test 1: Check if Supabase client is configured
  console.log('1. Testing Supabase client...');
  if (!supabaseClient) {
    console.error('❌ Supabase client is not initialized');
    return;
  }
  console.log('✅ Supabase client initialized');

  // Test 2: Try to fetch from courses table
  console.log('2. Testing courses table...');
  try {
    const { data, error } = await supabaseClient
      .from('courses')
      .select('id, title, slug')
      .limit(5);

    if (error) {
      console.error('❌ Error fetching from courses:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
    } else {
      console.log(`✅ Successfully fetched ${data?.length || 0} courses`);
      console.log('Sample courses:', data);
    }
  } catch (err) {
    console.error('❌ Exception fetching courses:', err);
  }

  // Test 3: Try alternative table name (lms_courses)
  console.log('3. Testing lms_courses table (alternative)...');
  try {
    const { data, error } = await supabaseClient
      .from('lms_courses')
      .select('id, title, slug')
      .limit(5);

    if (error) {
      console.error('❌ Error fetching from lms_courses:', error);
    } else {
      console.log(`✅ Successfully fetched ${data?.length || 0} courses from lms_courses`);
      console.log('Sample courses:', data);
    }
  } catch (err) {
    console.error('❌ Exception fetching lms_courses:', err);
  }

  // Test 4: List all tables
  console.log('4. Testing table access...');
  const tables = ['courses', 'lms_courses', 'curriculum_items', 'topics', 'lessons'];
  for (const table of tables) {
    try {
      const { data, error, count } = await supabaseClient
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ Table "${table}": ${error.message}`);
      } else {
        console.log(`✅ Table "${table}": accessible (${count || 0} rows)`);
      }
    } catch (err) {
      console.log(`❌ Table "${table}": exception - ${err}`);
    }
  }

  console.log('=== Test Complete ===');
}

// Also export a function to check environment variables
export function checkEnvVars() {
  console.log('=== Checking Environment Variables ===');
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('VITE_SUPABASE_URL:', url ? '✅ Set' : '❌ Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', key ? '✅ Set' : '❌ Missing');
  
  if (url) {
    console.log('URL value:', url.substring(0, 30) + '...');
  }
  if (key) {
    console.log('Key value:', key.substring(0, 30) + '...');
  }
}

