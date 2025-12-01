/**
 * Migration script to convert TypeScript LMS data to Supabase SQL inserts
 * 
 * Usage: node scripts/migrate-lms-data.js > db/supabase/lms_migrated_data.sql
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the TypeScript data file
const dataFile = resolve(__dirname, '../src/data/lmsCourseDetails.ts');
const dataContent = readFileSync(dataFile, 'utf-8');

// Extract the course data (this is a simplified version - you may need to adjust)
// Note: This script assumes the data structure matches LmsDetail type

console.log('-- =====================================================');
console.log('-- Migrated LMS Data from TypeScript');
console.log('-- Generated:', new Date().toISOString());
console.log('-- =====================================================\n');

// Function to escape SQL strings
function escapeSql(str) {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

// Function to format array for SQL
function formatArray(arr) {
  if (!arr || arr.length === 0) return 'ARRAY[]::text[]';
  return "ARRAY[" + arr.map(item => escapeSql(item)).join(', ') + "]";
}

// Function to format enum array
function formatEnumArray(arr, enumType) {
  if (!arr || arr.length === 0) return `ARRAY[]::${enumType}[]`;
  return `ARRAY[${arr.map(item => escapeSql(item)).join(', ')}]::${enumType}[]`;
}

// Function to format highlights/outcomes array
function formatTextArray(arr) {
  if (!arr || arr.length === 0) return 'ARRAY[]::text[]';
  return "ARRAY[" + arr.map(item => escapeSql(item)).join(', ') + "]";
}

// Parse the TypeScript file and extract course data
// This is a simplified parser - you may need to adjust based on your data structure
try {
  // For now, this script outputs a template
  // You'll need to manually extract the data or use a TypeScript parser
  
  console.log('-- Note: This script requires manual data extraction');
  console.log('-- Please use the seed data template in lms_seed_data.sql');
  console.log('-- Or manually convert your TypeScript data to SQL inserts\n');
  
  console.log('-- Example INSERT statement:');
  console.log(`
INSERT INTO lms_courses (
    id, slug, title, provider, course_category, delivery_mode, duration,
    level_code, department, locations, audience, status, summary,
    highlights, outcomes, course_type, track, rating, review_count
) VALUES (
    'course-id',
    'course-slug',
    'Course Title',
    'DQ HRA',
    'GHC',
    'Video',
    'Short',
    'L1',
    ARRAY['DCO'],
    ARRAY['Global'],
    ARRAY['Associate', 'Lead']::lms_audience_type[],
    'live',
    'Course summary',
    ARRAY['Highlight 1', 'Highlight 2'],
    ARRAY['Outcome 1', 'Outcome 2'],
    'Course (Single Lesson)',
    NULL,
    4.5,
    10
) ON CONFLICT (id) DO NOTHING;
  `);
  
  console.log('\n-- To properly migrate data:');
  console.log('-- 1. Export your course data from lmsCourseDetails.ts');
  console.log('-- 2. Convert each course to SQL INSERT statements');
  console.log('-- 3. Include all related data (reviews, case studies, curriculum, etc.)');
  console.log('-- 4. Run the SQL in Supabase SQL Editor');
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

