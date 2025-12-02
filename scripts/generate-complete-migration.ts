/**
 * Generate Complete LMS Migration SQL File
 * 
 * This script generates a complete SQL file with both DDL and INSERT statements
 * that can be run directly in Supabase SQL Editor.
 * 
 * Usage:
 *   npx tsx scripts/generate-complete-migration.ts > db/supabase/complete_lms_migration.sql
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { LMS_COURSE_DETAILS } from '../src/data/lmsCourseDetails';

// SQL escaping helpers
function escapeSQLString(str: string | null | undefined): string {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
}

function escapeSQLArray(arr: string[] | null | undefined): string {
  if (!Array.isArray(arr) || arr.length === 0) return "'{}'";
  const escaped = arr.map(item => escapeSQLString(item).replace(/^'|'$/g, '')).join(',');
  return `'{${escaped}}'`;
}

function escapeJSONB(obj: any): string {
  if (obj === null || obj === undefined || (Array.isArray(obj) && obj.length === 0)) {
    return 'NULL';
  }
  return escapeSQLString(JSON.stringify(obj));
}

// Read DDL
const ddlPath = resolve(process.cwd(), 'db/supabase/migrate_lms_data.sql');
const ddl = readFileSync(ddlPath, 'utf-8');

console.log('-- ============================================');
console.log('-- Complete LMS Migration SQL');
console.log('-- Generated from lmsCourseDetails.ts');
console.log('-- Run this entire file in Supabase SQL Editor');
console.log('-- ============================================\n');

// Output DDL
console.log(ddl);

// Generate INSERT statements
console.log('\n-- ============================================');
console.log('-- INSERT COURSES');
console.log('-- ============================================\n');

LMS_COURSE_DETAILS.forEach(course => {
  const values = [
    escapeSQLString(course.id),
    escapeSQLString(course.slug),
    escapeSQLString(course.title),
    escapeSQLString(course.provider),
    escapeSQLString(course.courseCategory),
    escapeSQLString(course.deliveryMode),
    escapeSQLString(course.duration),
    escapeSQLString(course.levelCode),
    escapeSQLArray(course.department || []),
    escapeSQLArray(course.locations || []),
    escapeSQLArray(course.audience || []),
    escapeSQLString(course.status),
    escapeSQLString(course.summary || ''),
    escapeSQLArray(course.highlights || []),
    escapeSQLArray(course.outcomes || []),
    course.courseType ? escapeSQLString(course.courseType) : 'NULL',
    course.track ? escapeSQLString(course.track) : 'NULL',
    course.rating !== undefined ? course.rating.toString() : 'NULL',
    course.reviewCount !== undefined ? course.reviewCount.toString() : 'NULL',
    escapeJSONB(course.testimonials || null),
    escapeJSONB(course.caseStudies || null),
    escapeJSONB(course.references || null),
    escapeJSONB(course.faq || null)
  ];
  
  console.log(`INSERT INTO courses (
  id, slug, title, provider, category, delivery_mode, duration, level_code,
  department, locations, audience, status, summary, highlights, outcomes,
  course_type, track, rating, review_count, testimonials, case_studies,
  references, faq
) VALUES (${values.join(', ')});`);
});

console.log('\n-- ============================================');
console.log('-- INSERT CURRICULUM ITEMS');
console.log('-- ============================================\n');

LMS_COURSE_DETAILS.forEach(course => {
  if (!course.curriculum || !Array.isArray(course.curriculum)) return;
  
  course.curriculum.forEach((item, index) => {
    const values = [
      escapeSQLString(item.id),
      escapeSQLString(course.id),
      escapeSQLString(item.title),
      item.description ? escapeSQLString(item.description) : 'NULL',
      item.duration ? escapeSQLString(item.duration) : 'NULL',
      (item.order || index + 1).toString(),
      (item.isLocked || false).toString(),
      item.courseSlug ? escapeSQLString(item.courseSlug) : 'NULL'
    ];
    
    console.log(`INSERT INTO curriculum_items (
  id, course_id, title, description, duration, item_order, is_locked, course_slug
) VALUES (${values.join(', ')});`);
  });
});

console.log('\n-- ============================================');
console.log('-- INSERT TOPICS');
console.log('-- ============================================\n');

LMS_COURSE_DETAILS.forEach(course => {
  if (!course.curriculum || !Array.isArray(course.curriculum)) return;
  
  course.curriculum.forEach(curriculumItem => {
    if (!curriculumItem.topics || !Array.isArray(curriculumItem.topics)) return;
    
    curriculumItem.topics.forEach((topic, index) => {
      const values = [
        escapeSQLString(topic.id),
        escapeSQLString(curriculumItem.id),
        escapeSQLString(topic.title),
        topic.description ? escapeSQLString(topic.description) : 'NULL',
        topic.duration ? escapeSQLString(topic.duration) : 'NULL',
        (topic.order || index + 1).toString(),
        (topic.isLocked || false).toString()
      ];
      
      console.log(`INSERT INTO topics (
  id, curriculum_item_id, title, description, duration, topic_order, is_locked
) VALUES (${values.join(', ')});`);
    });
  });
});

console.log('\n-- ============================================');
console.log('-- INSERT LESSONS');
console.log('-- ============================================\n');

LMS_COURSE_DETAILS.forEach(course => {
  if (!course.curriculum || !Array.isArray(course.curriculum)) return;
  
  course.curriculum.forEach(curriculumItem => {
    // Lessons directly under curriculum_item
    if (curriculumItem.lessons && Array.isArray(curriculumItem.lessons) && (!curriculumItem.topics || curriculumItem.topics.length === 0)) {
      curriculumItem.lessons.forEach((lesson, index) => {
        const values = [
          escapeSQLString(lesson.id),
          'NULL',
          escapeSQLString(curriculumItem.id),
          escapeSQLString(lesson.title),
          lesson.description ? escapeSQLString(lesson.description) : 'NULL',
          lesson.duration ? escapeSQLString(lesson.duration) : 'NULL',
          escapeSQLString(lesson.type),
          (lesson.order || index + 1).toString(),
          (lesson.isLocked || false).toString()
        ];
        
        console.log(`INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES (${values.join(', ')});`);
      });
    }
    
    // Lessons under topics
    if (curriculumItem.topics && Array.isArray(curriculumItem.topics)) {
      curriculumItem.topics.forEach(topic => {
        if (!topic.lessons || !Array.isArray(topic.lessons)) return;
        
        topic.lessons.forEach((lesson, index) => {
          const values = [
            escapeSQLString(lesson.id),
            escapeSQLString(topic.id),
            'NULL',
            escapeSQLString(lesson.title),
            lesson.description ? escapeSQLString(lesson.description) : 'NULL',
            lesson.duration ? escapeSQLString(lesson.duration) : 'NULL',
            escapeSQLString(lesson.type),
            (lesson.order || index + 1).toString(),
            (lesson.isLocked || false).toString()
          ];
          
          console.log(`INSERT INTO lessons (
  id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
) VALUES (${values.join(', ')});`);
        });
      });
    }
  });
});

console.log('\n-- ============================================');
console.log('-- VERIFICATION QUERY');
console.log('-- ============================================\n');
console.log(`SELECT 
  (SELECT COUNT(*) FROM courses) as courses,
  (SELECT COUNT(*) FROM curriculum_items) as curriculum_items,
  (SELECT COUNT(*) FROM topics) as topics,
  (SELECT COUNT(*) FROM lessons) as lessons;`);

