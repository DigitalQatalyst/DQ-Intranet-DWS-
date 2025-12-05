/**
 * TypeScript types for Supabase LMS tables
 * These types match the database schema in db/supabase/lms_schema.sql
 */

import { Database } from './database.types';

// Re-export database types if they exist
export type LmsCourse = Database['public']['Tables']['lms_courses']['Row'];
export type LmsCourseInsert = Database['public']['Tables']['lms_courses']['Insert'];
export type LmsCourseUpdate = Database['public']['Tables']['lms_courses']['Update'];

export type LmsReview = Database['public']['Tables']['lms_reviews']['Row'];
export type LmsReviewInsert = Database['public']['Tables']['lms_reviews']['Insert'];
export type LmsReviewUpdate = Database['public']['Tables']['lms_reviews']['Update'];

export type LmsCaseStudy = Database['public']['Tables']['lms_case_studies']['Row'];
export type LmsCaseStudyInsert = Database['public']['Tables']['lms_case_studies']['Insert'];

export type LmsReference = Database['public']['Tables']['lms_references']['Row'];
export type LmsReferenceInsert = Database['public']['Tables']['lms_references']['Insert'];

export type LmsFaq = Database['public']['Tables']['lms_faqs']['Row'];
export type LmsFaqInsert = Database['public']['Tables']['lms_faqs']['Insert'];

export type LmsCurriculumItem = Database['public']['Tables']['lms_curriculum_items']['Row'];
export type LmsCurriculumItemInsert = Database['public']['Tables']['lms_curriculum_items']['Insert'];

export type LmsCurriculumTopic = Database['public']['Tables']['lms_curriculum_topics']['Row'];
export type LmsCurriculumTopicInsert = Database['public']['Tables']['lms_curriculum_topics']['Insert'];

export type LmsCurriculumLesson = Database['public']['Tables']['lms_curriculum_lessons']['Row'];
export type LmsCurriculumLessonInsert = Database['public']['Tables']['lms_curriculum_lessons']['Insert'];

// Manual type definitions (fallback if database.types.ts doesn't exist)
export type DeliveryMode = 'Video' | 'Guide' | 'Workshop' | 'Hybrid' | 'Online';
export type Duration = 'Bite-size' | 'Short' | 'Medium' | 'Long';
export type LevelCode = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8';
export type AudienceType = 'Associate' | 'Lead';
export type CourseStatus = 'live' | 'coming-soon';
export type CourseType = 'Course (Single Lesson)' | 'Course (Multi-Lessons)' | 'Course (Bundles)';
export type LessonType = 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading';

export interface LmsCourseRow {
  id: string;
  slug: string;
  title: string;
  provider: string;
  course_category: string;
  delivery_mode: DeliveryMode;
  duration: Duration;
  level_code: LevelCode;
  department: string[];
  locations: string[];
  audience: AudienceType[];
  status: CourseStatus;
  summary: string;
  highlights: string[];
  outcomes: string[];
  course_type: CourseType | null;
  track: string | null;
  rating: number | null;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface LmsReviewRow {
  id: string;
  course_id: string;
  author: string;
  role: string;
  text: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface LmsCaseStudyRow {
  id: string;
  course_id: string;
  title: string;
  description: string;
  link: string | null;
  created_at: string;
}

export interface LmsReferenceRow {
  id: string;
  course_id: string;
  title: string;
  description: string;
  link: string | null;
  created_at: string;
}

export interface LmsFaqRow {
  id: string;
  course_id: string;
  question: string;
  answer: string;
  order_index: number;
  created_at: string;
}

export interface LmsCurriculumItemRow {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  duration: string | null;
  order_index: number;
  is_locked: boolean;
  course_slug: string | null;
  parent_item_id: string | null;
  created_at: string;
}

export interface LmsCurriculumTopicRow {
  id: string;
  curriculum_item_id: string;
  title: string;
  description: string | null;
  duration: string | null;
  order_index: number;
  is_locked: boolean;
  created_at: string;
}

export interface LmsCurriculumLessonRow {
  id: string;
  curriculum_item_id: string | null;
  curriculum_topic_id: string | null;
  title: string;
  description: string | null;
  duration: string | null;
  lesson_type: LessonType;
  order_index: number;
  is_locked: boolean;
  created_at: string;
}

// Nested types for API responses
export interface LmsCourseWithRelations extends LmsCourseRow {
  reviews?: LmsReviewRow[];
  case_studies?: LmsCaseStudyRow[];
  references?: LmsReferenceRow[];
  faqs?: LmsFaqRow[];
  curriculum_items?: LmsCurriculumItemWithRelations[];
}

export interface LmsCurriculumItemWithRelations extends LmsCurriculumItemRow {
  topics?: LmsCurriculumTopicWithRelations[];
  lessons?: LmsCurriculumLessonRow[];
}

export interface LmsCurriculumTopicWithRelations extends LmsCurriculumTopicRow {
  lessons: LmsCurriculumLessonRow[];
}

