#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const lmsUrl = process.env.VITE_LMS_SUPABASE_URL;
const lmsKey = process.env.VITE_LMS_SUPABASE_ANON_KEY;
const lmsClient = createClient(lmsUrl, lmsKey);

console.log('🔍 Checking which courses should show on marketplace...');
console.log('');

async function check() {
  try {
    // Get all courses
    const { data: allCourses, error } = await lmsClient
      .from('lms_courses')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('❌ Error:', error.message);
      return;
    }

    console.log(`📊 Total courses in database: ${allCourses?.length || 0}`);
    console.log('');

    // Group by status
    const byStatus = {};
    allCourses?.forEach(course => {
      const status = course.status || 'unknown';
      if (!byStatus[status]) byStatus[status] = [];
      byStatus[status].push(course);
    });

    console.log('📋 Courses by status:');
    Object.keys(byStatus).forEach(status => {
      console.log(`\n${status.toUpperCase()}: ${byStatus[status].length} courses`);
      byStatus[status].forEach(c => {
        console.log(`   - ${c.title} (${c.category || 'No category'})`);
      });
    });

    console.log('');
    console.log('========================================');
    console.log('💡 Recommendation');
    console.log('========================================');
    
    // Check for GHC course
    const ghcCourse = allCourses?.find(c => 
      c.title.toLowerCase().includes('ghc') || 
      c.title.toLowerCase().includes('honeycomb') ||
      c.category?.toLowerCase() === 'ghc'
    );

    if (ghcCourse) {
      console.log('✅ Found GHC course:');
      console.log(`   Title: ${ghcCourse.title}`);
      console.log(`   Status: ${ghcCourse.status}`);
      console.log(`   Category: ${ghcCourse.category}`);
      console.log('');
      console.log('To show ONLY this course in Learning tab:');
      console.log('   Filter by: category === "GHC" OR status === "published"');
    }

    // Check what's "published"
    const published = allCourses?.filter(c => c.status === 'published');
    console.log('');
    console.log(`📌 Published courses: ${published?.length || 0}`);
    if (published && published.length > 0) {
      published.forEach(c => console.log(`   - ${c.title}`));
    }

  } catch (error) {
    console.error('❌ Failed:', error);
  }
}

check();
