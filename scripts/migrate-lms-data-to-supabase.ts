/**
 * Supabase LMS Data Migration Script (TypeScript)
 * 
 * This script reads from src/data/lmsCourseDetails.ts and generates
 * SQL INSERT statements to populate the Supabase LMS tables.
 * 
 * Usage:
 *   npx tsx scripts/migrate-lms-data-to-supabase.ts > db/supabase/migrate_lms_data_inserts.sql
 *   Or: npm run migrate:lms
 */

import { LMS_COURSE_DETAILS } from '../src/data/lmsCourseDetails';

// SQL escaping helper
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

// Generate SQL INSERT statements
function generateInserts(courses: typeof LMS_COURSE_DETAILS): string {
  const sqlStatements: string[] = [];
  
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
console.log('-- LMS Data Migration Script');
console.log('-- Generated SQL INSERT statements');
console.log(`-- Total courses: ${LMS_COURSE_DETAILS.length}\n`);

const sqlOutput = generateInserts(LMS_COURSE_DETAILS);
console.log(sqlOutput);

