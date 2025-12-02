/**
 * Supabase LMS Data Migration Script
 * 
 * This script reads from src/data/lmsCourseDetails.ts and generates
 * SQL INSERT statements to populate the Supabase LMS tables.
 * 
 * Usage:
 *   node scripts/migrate-lms-data-to-supabase.js > db/supabase/migrate_lms_data_inserts.sql
 *   Then run: psql -h <host> -U <user> -d <database> -f db/supabase/migrate_lms_data_inserts.sql
 */

const fs = require('fs');
const path = require('path');

// SQL escaping helper
function escapeSQLString(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
}

function escapeSQLArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "'{}'";
  const escaped = arr.map(item => escapeSQLString(item).replace(/^'|'$/g, '')).join(',');
  return `'{${escaped}}'`;
}

function escapeJSONB(obj) {
  if (obj === null || obj === undefined || (Array.isArray(obj) && obj.length === 0)) {
    return 'NULL';
  }
  return escapeSQLString(JSON.stringify(obj));
}

// Read the TypeScript file and extract the details array
function readLmsCourseDetails() {
  const filePath = path.join(__dirname, '../src/data/lmsCourseDetails.ts');
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract the details array using regex
  // This is a simplified approach - in production you might want to use a TS parser
  const detailsMatch = content.match(/const details[^=]*=\s*(\[[\s\S]*?\])\s*;?\s*export const LMS_COURSE_DETAILS/);
  
  if (!detailsMatch) {
    throw new Error('Could not find details array in lmsCourseDetails.ts');
  }
  
  // Evaluate the array (safe in this context since we control the file)
  const detailsArrayString = detailsMatch[1];
  
  // We'll need to process this differently - let's use a safer approach
  // For now, return a placeholder that shows the structure needed
  return null; // Will be populated by actual parsing
}

// Generate SQL INSERT statements
function generateInserts(courses) {
  const sqlStatements = [];
  
  sqlStatements.push('-- ============================================');
  sqlStatements.push('-- INSERT COURSES');
  sqlStatements.push('-- ============================================\n');
  
  courses.forEach(course => {
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
    
    sqlStatements.push(`INSERT INTO courses (
      id, slug, title, provider, category, delivery_mode, duration, level_code,
      department, locations, audience, status, summary, highlights, outcomes,
      course_type, track, rating, review_count, testimonials, case_studies,
      references, faq
    ) VALUES (${values.join(', ')});`);
  });
  
  sqlStatements.push('\n-- ============================================');
  sqlStatements.push('-- INSERT CURRICULUM ITEMS');
  sqlStatements.push('-- ============================================\n');
  
  courses.forEach(course => {
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
      
      sqlStatements.push(`INSERT INTO curriculum_items (
        id, course_id, title, description, duration, item_order, is_locked, course_slug
      ) VALUES (${values.join(', ')});`);
    });
  });
  
  sqlStatements.push('\n-- ============================================');
  sqlStatements.push('-- INSERT TOPICS');
  sqlStatements.push('-- ============================================\n');
  
  courses.forEach(course => {
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
        
        sqlStatements.push(`INSERT INTO topics (
          id, curriculum_item_id, title, description, duration, topic_order, is_locked
        ) VALUES (${values.join(', ')});`);
      });
    });
  });
  
  sqlStatements.push('\n-- ============================================');
  sqlStatements.push('-- INSERT LESSONS');
  sqlStatements.push('-- ============================================\n');
  
  courses.forEach(course => {
    if (!course.curriculum || !Array.isArray(course.curriculum)) return;
    
    course.curriculum.forEach(curriculumItem => {
      // Lessons directly under curriculum_item (Single Lesson courses)
      if (curriculumItem.lessons && Array.isArray(curriculumItem.lessons) && (!curriculumItem.topics || curriculumItem.topics.length === 0)) {
        curriculumItem.lessons.forEach((lesson, index) => {
          const values = [
            escapeSQLString(lesson.id),
            'NULL', // topic_id
            escapeSQLString(curriculumItem.id), // curriculum_item_id
            escapeSQLString(lesson.title),
            lesson.description ? escapeSQLString(lesson.description) : 'NULL',
            lesson.duration ? escapeSQLString(lesson.duration) : 'NULL',
            escapeSQLString(lesson.type),
            (lesson.order || index + 1).toString(),
            (lesson.isLocked || false).toString()
          ];
          
          sqlStatements.push(`INSERT INTO lessons (
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
              escapeSQLString(topic.id), // topic_id
              'NULL', // curriculum_item_id
              escapeSQLString(lesson.title),
              lesson.description ? escapeSQLString(lesson.description) : 'NULL',
              lesson.duration ? escapeSQLString(lesson.duration) : 'NULL',
              escapeSQLString(lesson.type),
              (lesson.order || index + 1).toString(),
              (lesson.isLocked || false).toString()
            ];
            
            sqlStatements.push(`INSERT INTO lessons (
              id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
            ) VALUES (${values.join(', ')});`);
          });
        });
      }
    });
  });
  
  return sqlStatements.join('\n');
}

// Main execution
// Note: This is a template. You'll need to import the actual data from the TypeScript file
// For a production version, you might want to:
// 1. Use ts-node to import the TypeScript file directly
// 2. Or compile the TypeScript to JavaScript first
// 3. Or use a TypeScript parser to extract the data statically

console.log('-- LMS Data Migration Script');
console.log('-- Generated SQL INSERT statements');
console.log('-- Note: This file requires the actual course data to be passed in\n');
console.log('-- To use this script properly:');
console.log('-- 1. Import LMS_COURSE_DETAILS from the TypeScript file');
console.log('-- 2. Pass it to generateInserts()');
console.log('-- 3. Output the SQL statements\n');

// Example structure - replace with actual data import
const exampleCourses = [];
const sqlOutput = generateInserts(exampleCourses);
console.log(sqlOutput);

