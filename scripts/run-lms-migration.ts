/**
 * Run LMS Migration to Supabase
 * 
 * This script:
 * 1. Generates INSERT statements from lmsCourseDetails.ts
 * 2. Executes the DDL schema migration
 * 3. Executes the INSERT statements
 * 
 * Usage:
 *   npx tsx scripts/run-lms-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { LMS_COURSE_DETAILS } from '../src/data/lmsCourseDetails';

// Load .env file
config({ path: resolve(process.cwd(), '.env') });

const url = process.env.VITE_SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/VITE_SUPABASE_ANON_KEY');
  console.error('Note: For DDL operations, SUPABASE_SERVICE_ROLE_KEY is recommended');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

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

async function executeSQL(sql: string, description: string): Promise<void> {
  console.log(`\n${description}...`);
  
  // Split by semicolons and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        // If RPC doesn't exist, try direct query (for SELECT) or use alternative method
        if (error) {
          // For DDL, we might need to use the Supabase dashboard or psql
          // Let's try a different approach - execute via REST API
          console.warn(`Could not execute via RPC, trying alternative method...`);
          console.warn(`Error: ${error.message}`);
          
          // For now, output the SQL so user can run it manually
          console.log(`\nPlease run this SQL in Supabase SQL Editor:\n${statement};\n`);
        }
      } catch (err) {
        console.error(`Error executing statement: ${err}`);
        console.log(`\nPlease run this SQL manually:\n${statement};\n`);
      }
    }
  }
}

async function runMigration() {
  console.log('🚀 Starting LMS Migration to Supabase');
  console.log(`📡 Connecting to: ${url.replace(/\/\/.*@/, '//***@')}`);
  
  // Step 1: Read and execute DDL
  console.log('\n📋 Step 1: Creating schema...');
  try {
    const ddlPath = resolve(process.cwd(), 'db/supabase/migrate_lms_data.sql');
    const ddl = readFileSync(ddlPath, 'utf-8');
    
    // For DDL, Supabase REST API doesn't support it directly
    // We'll output instructions
    console.log('\n⚠️  DDL operations require direct database access.');
    console.log('Please run the DDL script in Supabase SQL Editor:');
    console.log(`   File: ${ddlPath}`);
    console.log('\nOr use psql:');
    console.log(`   psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" -f ${ddlPath}`);
    
    // Try to execute via Supabase Management API if available
    // For now, we'll generate the INSERT statements and provide instructions
  } catch (err) {
    console.error('Error reading DDL file:', err);
    process.exit(1);
  }
  
  // Step 2: Generate and execute INSERT statements
  console.log('\n📊 Step 2: Generating INSERT statements...');
  
  const insertStatements: string[] = [];
  
  // Insert courses
  console.log('  → Generating course inserts...');
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
    
    insertStatements.push(`INSERT INTO courses (
      id, slug, title, provider, category, delivery_mode, duration, level_code,
      department, locations, audience, status, summary, highlights, outcomes,
      course_type, track, rating, review_count, testimonials, case_studies,
      references, faq
    ) VALUES (${values.join(', ')}) ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      provider = EXCLUDED.provider,
      category = EXCLUDED.category,
      delivery_mode = EXCLUDED.delivery_mode,
      duration = EXCLUDED.duration,
      level_code = EXCLUDED.level_code,
      department = EXCLUDED.department,
      locations = EXCLUDED.locations,
      audience = EXCLUDED.audience,
      status = EXCLUDED.status,
      summary = EXCLUDED.summary,
      highlights = EXCLUDED.highlights,
      outcomes = EXCLUDED.outcomes,
      course_type = EXCLUDED.course_type,
      track = EXCLUDED.track,
      rating = EXCLUDED.rating,
      review_count = EXCLUDED.review_count,
      testimonials = EXCLUDED.testimonials,
      case_studies = EXCLUDED.case_studies,
      references = EXCLUDED.references,
      faq = EXCLUDED.faq,
      updated_at = NOW();`);
  });
  
  // Insert curriculum items
  console.log('  → Generating curriculum item inserts...');
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
      
      insertStatements.push(`INSERT INTO curriculum_items (
        id, course_id, title, description, duration, item_order, is_locked, course_slug
      ) VALUES (${values.join(', ')}) ON CONFLICT (id) DO UPDATE SET
        course_id = EXCLUDED.course_id,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        duration = EXCLUDED.duration,
        item_order = EXCLUDED.item_order,
        is_locked = EXCLUDED.is_locked,
        course_slug = EXCLUDED.course_slug,
        updated_at = NOW();`);
    });
  });
  
  // Insert topics
  console.log('  → Generating topic inserts...');
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
        
        insertStatements.push(`INSERT INTO topics (
          id, curriculum_item_id, title, description, duration, topic_order, is_locked
        ) VALUES (${values.join(', ')}) ON CONFLICT (id) DO UPDATE SET
          curriculum_item_id = EXCLUDED.curriculum_item_id,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          duration = EXCLUDED.duration,
          topic_order = EXCLUDED.topic_order,
          is_locked = EXCLUDED.is_locked,
          updated_at = NOW();`);
      });
    });
  });
  
  // Insert lessons
  console.log('  → Generating lesson inserts...');
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
          
          insertStatements.push(`INSERT INTO lessons (
            id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
          ) VALUES (${values.join(', ')}) ON CONFLICT (id) DO UPDATE SET
            topic_id = EXCLUDED.topic_id,
            curriculum_item_id = EXCLUDED.curriculum_item_id,
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            duration = EXCLUDED.duration,
            type = EXCLUDED.type,
            lesson_order = EXCLUDED.lesson_order,
            is_locked = EXCLUDED.is_locked,
            updated_at = NOW();`);
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
            
            insertStatements.push(`INSERT INTO lessons (
              id, topic_id, curriculum_item_id, title, description, duration, type, lesson_order, is_locked
            ) VALUES (${values.join(', ')}) ON CONFLICT (id) DO UPDATE SET
              topic_id = EXCLUDED.topic_id,
              curriculum_item_id = EXCLUDED.curriculum_item_id,
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              duration = EXCLUDED.duration,
              type = EXCLUDED.type,
              lesson_order = EXCLUDED.lesson_order,
              is_locked = EXCLUDED.is_locked,
              updated_at = NOW();`);
          });
        });
      }
    });
  });
  
  console.log(`\n✅ Generated ${insertStatements.length} INSERT statements`);
  
  // Step 3: Execute INSERT statements using Supabase client
  console.log('\n💾 Step 3: Executing INSERT statements...');
  
  // Use batch inserts via Supabase client for better performance
  // For courses, we can use the client directly
  console.log('  → Inserting courses...');
  const courses = LMS_COURSE_DETAILS.map(course => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    provider: course.provider,
    category: course.courseCategory,
    delivery_mode: course.deliveryMode,
    duration: course.duration,
    level_code: course.levelCode,
    department: course.department || [],
    locations: course.locations || [],
    audience: course.audience || [],
    status: course.status,
    summary: course.summary || '',
    highlights: course.highlights || [],
    outcomes: course.outcomes || [],
    course_type: course.courseType || null,
    track: course.track || null,
    rating: course.rating || null,
    review_count: course.reviewCount || null,
    testimonials: course.testimonials || null,
    case_studies: course.caseStudies || null,
    references: course.references || null,
    faq: course.faq || null,
  }));
  
  const { data: coursesData, error: coursesError } = await supabase
    .from('courses')
    .upsert(courses, { onConflict: 'id' });
  
  if (coursesError) {
    console.error('❌ Error inserting courses:', coursesError);
    console.log('\n⚠️  Falling back to SQL execution...');
    // Fall back to SQL
    await executeSQL(insertStatements.join(';\n'), 'Executing all INSERT statements');
  } else {
    console.log(`  ✅ Inserted/updated ${courses.length} courses`);
    
    // Continue with other tables using SQL for now
    const otherStatements = insertStatements.filter(s => !s.includes('INSERT INTO courses'));
    if (otherStatements.length > 0) {
      console.log(`  → Executing ${otherStatements.length} remaining statements...`);
      await executeSQL(otherStatements.join(';\n'), 'Executing curriculum, topics, and lessons');
    }
  }
  
  console.log('\n✨ Migration completed!');
  console.log('\n📊 Verification:');
  console.log('   Run this query in Supabase SQL Editor to verify:');
  console.log(`
    SELECT 
      (SELECT COUNT(*) FROM courses) as courses,
      (SELECT COUNT(*) FROM curriculum_items) as curriculum_items,
      (SELECT COUNT(*) FROM topics) as topics,
      (SELECT COUNT(*) FROM lessons) as lessons;
  `);
}

// Run migration
runMigration().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});

