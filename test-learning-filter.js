#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const lmsUrl = process.env.VITE_LMS_SUPABASE_URL;
const lmsKey = process.env.VITE_LMS_SUPABASE_ANON_KEY;

console.log('🔗 Testing Learning Tab Data...');
console.log('');

const lmsClient = createClient(lmsUrl, lmsKey);

async function test() {
  try {
    // Fetch courses like the component does
    console.log('📋 Fetching courses from LMS...');
    const { data: lmsData, error: lmsError } = await lmsClient
      .from('lms_courses')
      .select('*')
      .in('status', ['Published', 'archived'])
      .order('updated_at', { ascending: false })
      .limit(10);

    if (lmsError) {
      console.error('❌ Error:', lmsError.message);
      return;
    }

    console.log(`✅ Found ${lmsData?.length || 0} courses`);
    console.log('');

    // Transform like the component does
    const transformedLMS = lmsData.map((course) => ({
      id: course.id,
      slug: course.slug,
      title: course.title,
      excerpt: course.excerpt || course.description || '',
      date: course.updated_at,
      image: course.image_url,
      tags: ['Learning', 'Course', course.category].filter(Boolean),
      type: 'Thought Leadership',
      category: course.category || 'Learning',
      newsType: 'Course',
      focusArea: 'Learning',
      department: course.department || 'Learning',
      newsSource: course.provider || 'DQ Learning',
    }));

    console.log('📊 Transformed courses:');
    transformedLMS.forEach((course, i) => {
      console.log(`\n${i + 1}. ${course.title}`);
      console.log(`   Type: ${course.type}`);
      console.log(`   Tags: ${course.tags.join(', ')}`);
      console.log(`   Category: ${course.category}`);
      console.log(`   Department: ${course.department}`);
    });

    console.log('');
    console.log('========================================');
    console.log('📋 Filter Test');
    console.log('========================================');

    // Test the filter logic from getLearningData
    const filtered = transformedLMS.filter((item) => {
      // Check for Thought Leadership items
      if (item.type === 'Thought Leadership') {
        const title = item.title.toLowerCase();
        const excerpt = item.excerpt.toLowerCase();
        const tags = (item.tags || []).join(' ').toLowerCase();
        
        const learningKeywords = ['leadership', 'execution', 'learning', 'course', 'training', 'skill', 'growth', 'development'];
        const hasKeyword = learningKeywords.some(keyword => 
          title.includes(keyword) || excerpt.includes(keyword) || tags.includes(keyword)
        );
        
        if (hasKeyword) {
          console.log(`✅ MATCH: ${item.title}`);
          console.log(`   Reason: Found keyword in ${
            learningKeywords.find(k => title.includes(k) || excerpt.includes(k) || tags.includes(k))
          }`);
          return true;
        }
      }
      
      // Check tags array
      if (item.tags && Array.isArray(item.tags)) {
        const tagString = item.tags.join(' ').toLowerCase();
        const learningTags = ['learning', 'course', 'training', 'education', 'skill', 'development'];
        if (learningTags.some(tag => tagString.includes(tag))) {
          console.log(`✅ MATCH: ${item.title}`);
          console.log(`   Reason: Found in tags`);
          return true;
        }
      }
      
      console.log(`❌ NO MATCH: ${item.title}`);
      return false;
    });

    console.log('');
    console.log(`📊 Result: ${filtered.length} out of ${transformedLMS.length} courses will show in Learning tab`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

test();
