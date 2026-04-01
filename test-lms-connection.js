#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const lmsUrl = process.env.VITE_LMS_SUPABASE_URL;
const lmsKey = process.env.VITE_LMS_SUPABASE_ANON_KEY;

console.log('🔗 Testing LMS Supabase Connection...');
console.log(`   URL: ${lmsUrl}`);
console.log('');

if (!lmsUrl || !lmsKey) {
  console.error('❌ Error: Missing LMS Supabase credentials');
  process.exit(1);
}

const supabase = createClient(lmsUrl, lmsKey);

async function test() {
  try {
    // Test 1: Check for courses table
    console.log('📋 Test 1: Checking lms_courses table...');
    const { data: courses, error: coursesError } = await supabase
      .from('lms_courses')
      .select('slug, title, course_type, status')
      .limit(5);

    if (coursesError) {
      console.error('❌ Error:', coursesError.message);
    } else {
      console.log(`✅ Found ${courses?.length || 0} courses`);
      if (courses && courses.length > 0) {
        courses.forEach(c => console.log(`   - ${c.title} (${c.course_type})`));
      }
    }
    console.log('');

    // Test 2: Get sample course structure
    console.log('📋 Test 2: Getting course structure...');
    const { data: sampleCourse, error: sampleError } = await supabase
      .from('lms_courses')
      .select('*')
      .limit(1)
      .single();

    if (sampleError) {
      console.error('❌ Error:', sampleError.message);
    } else {
      console.log('✅ Sample course structure:');
      console.log(JSON.stringify(sampleCourse, null, 2));
    }
    console.log('');

    // Test 3: Check for approved courses
    console.log('📋 Test 3: Checking approved courses...');
    const { data: approved, error: approvedError } = await supabase
      .from('lms_courses')
      .select('slug, title, course_type')
      .eq('status', 'Published')
      .limit(10);

    if (approvedError) {
      console.error('❌ Error:', approvedError.message);
    } else {
      console.log(`✅ Found ${approved?.length || 0} published courses`);
      if (approved && approved.length > 0) {
        approved.forEach(c => console.log(`   - ${c.title}`));
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

test();
