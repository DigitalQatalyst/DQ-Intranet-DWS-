/**
 * LMS Service for fetching data from Supabase
 */

import { supabaseClient } from '../lib/supabaseClient';
import type {
  LmsCourseRow,
  LmsCourseWithRelations,
  LmsReviewRow,
  LmsCaseStudyRow,
  LmsReferenceRow,
  LmsFaqRow,
  LmsCurriculumItemRow,
  LmsCurriculumTopicRow,
  LmsCurriculumLessonRow,
  LmsCurriculumItemWithRelations,
  LmsCurriculumTopicWithRelations,
} from '../types/lmsSupabase';
import type { LmsDetail, LmsCard } from '../data/lmsCourseDetails';
import { levelLabelFromCode, levelShortLabelFromCode } from '../lms/levels';

/**
 * Transform Supabase course row to LmsDetail type
 */
function transformCourseToLmsDetail(
  course: LmsCourseWithRelations
): LmsDetail {
  // Transform curriculum structure based on course type
  const curriculum: LmsDetail['curriculum'] = course.curriculum_items
    ?.map((item) => {
      const curriculumItem: LmsDetail['curriculum'][0] = {
        id: item.id,
        title: item.title,
        description: item.description || undefined,
        duration: item.duration || undefined,
        order: item.order_index,
        isLocked: item.is_locked,
        courseSlug: item.course_slug || undefined,
      };

      // If course has topics, add them
      if (item.topics && item.topics.length > 0) {
        curriculumItem.topics = item.topics.map((topic) => ({
          id: topic.id,
          title: topic.title,
          description: topic.description || undefined,
          duration: topic.duration || undefined,
          order: topic.order_index,
          isLocked: topic.is_locked,
          lessons: topic.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description || undefined,
            duration: lesson.duration || undefined,
            type: lesson.lesson_type,
            order: lesson.order_index,
            isLocked: lesson.is_locked,
          })),
        }));
      } else if (item.lessons && item.lessons.length > 0) {
        // If course has lessons directly (single lesson course)
        curriculumItem.lessons = item.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description || undefined,
          duration: lesson.duration || undefined,
          type: lesson.lesson_type,
          order: lesson.order_index,
          isLocked: lesson.is_locked,
        }));
      }

      return curriculumItem;
    })
    .sort((a, b) => a.order - b.order);

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    provider: course.provider,
    courseCategory: course.course_category,
    deliveryMode: course.delivery_mode,
    duration: course.duration,
    levelCode: course.level_code,
    department: course.department,
    locations: course.locations,
    audience: course.audience,
    status: course.status,
    summary: course.summary,
    highlights: course.highlights,
    outcomes: course.outcomes,
    courseType: course.course_type || undefined,
    track: course.track || undefined,
    rating: course.rating || undefined,
    reviewCount: course.review_count || undefined,
    testimonials: course.reviews?.map((review) => ({
      author: review.author,
      role: review.role,
      text: review.text,
      rating: review.rating,
    })),
    caseStudies: course.case_studies?.map((cs) => ({
      title: cs.title,
      description: cs.description,
      link: cs.link || undefined,
    })),
    references: course.references?.map((ref) => ({
      title: ref.title,
      description: ref.description,
      link: ref.link || undefined,
    })),
    faq: course.faqs
      ?.sort((a, b) => a.order_index - b.order_index)
      .map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      })),
    curriculum,
  };
}

/**
 * Transform Supabase course row to LmsCard type
 */
function transformCourseToLmsCard(course: LmsCourseRow): LmsCard {
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    provider: course.provider,
    courseCategory: course.course_category,
    deliveryMode: course.delivery_mode,
    duration: course.duration,
    levelCode: course.level_code,
    levelLabel: levelLabelFromCode(course.level_code),
    levelShortLabel: levelShortLabelFromCode(course.level_code),
    locations: course.locations,
    audience: course.audience,
    status: course.status,
    summary: course.summary,
    department: course.department,
    courseType: course.course_type || undefined,
    track: course.track || undefined,
  };
}

/**
 * Fetch all courses (for listing page)
 */
export async function fetchAllCourses(): Promise<LmsCard[]> {
  const { data, error } = await supabaseClient
    .from('lms_courses')
    .select('*')
    .eq('status', 'live')
    .order('title');

  if (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }

  return data.map(transformCourseToLmsCard);
}

/**
 * Fetch course by slug (for detail page)
 */
export async function fetchCourseBySlug(slug: string): Promise<LmsDetail | null> {
  // Fetch course with all related data
  const { data: course, error: courseError } = await supabaseClient
    .from('lms_courses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (courseError || !course) {
    console.error('Error fetching course:', courseError);
    return null;
  }

  // Fetch reviews
  const { data: reviews } = await supabaseClient
    .from('lms_reviews')
    .select('*')
    .eq('course_id', course.id)
    .order('created_at', { ascending: false });

  // Fetch case studies
  const { data: caseStudies } = await supabaseClient
    .from('lms_case_studies')
    .select('*')
    .eq('course_id', course.id)
    .order('created_at');

  // Fetch references
  const { data: references } = await supabaseClient
    .from('lms_references')
    .select('*')
    .eq('course_id', course.id)
    .order('created_at');

  // Fetch FAQs
  const { data: faqs } = await supabaseClient
    .from('lms_faqs')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index');

  // Fetch curriculum items
  const { data: curriculumItems } = await supabaseClient
    .from('lms_curriculum_items')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index');

  // Fetch curriculum topics and lessons
  const curriculumItemsWithRelations: LmsCurriculumItemWithRelations[] = [];

  for (const item of curriculumItems || []) {
    // Fetch topics for this curriculum item
    const { data: topics } = await supabaseClient
      .from('lms_curriculum_topics')
      .select('*')
      .eq('curriculum_item_id', item.id)
      .order('order_index');

    // Fetch lessons for topics
    const topicsWithLessons: LmsCurriculumTopicWithRelations[] = [];
    for (const topic of topics || []) {
      const { data: lessons } = await supabaseClient
        .from('lms_curriculum_lessons')
        .select('*')
        .eq('curriculum_topic_id', topic.id)
        .order('order_index');

      topicsWithLessons.push({
        ...topic,
        lessons: lessons || [],
      });
    }

    // Fetch lessons directly for curriculum item (if no topics)
    const { data: directLessons } = await supabaseClient
      .from('lms_curriculum_lessons')
      .select('*')
      .eq('curriculum_item_id', item.id)
      .is('curriculum_topic_id', null)
      .order('order_index');

    curriculumItemsWithRelations.push({
      ...item,
      topics: topicsWithLessons.length > 0 ? topicsWithLessons : undefined,
      lessons: directLessons && directLessons.length > 0 ? directLessons : undefined,
    });
  }

  const courseWithRelations: LmsCourseWithRelations = {
    ...course,
    reviews: reviews || [],
    case_studies: caseStudies || [],
    references: references || [],
    faqs: faqs || [],
    curriculum_items: curriculumItemsWithRelations,
  };

  return transformCourseToLmsDetail(courseWithRelations);
}

/**
 * Fetch courses by filter criteria
 */
export async function fetchCoursesByFilters(filters: {
  category?: string[];
  provider?: string[];
  courseType?: string[];
  location?: string[];
  audience?: string[];
  sfiaRating?: string[];
  searchQuery?: string;
}): Promise<LmsCard[]> {
  let query = supabaseClient
    .from('lms_courses')
    .select('*')
    .eq('status', 'live');

  // Apply filters
  if (filters.category && filters.category.length > 0) {
    query = query.in('course_category', filters.category);
  }

  if (filters.provider && filters.provider.length > 0) {
    query = query.in('provider', filters.provider);
  }

  if (filters.courseType && filters.courseType.length > 0) {
    query = query.in('course_type', filters.courseType);
  }

  if (filters.location && filters.location.length > 0) {
    query = query.overlaps('locations', filters.location);
  }

  if (filters.audience && filters.audience.length > 0) {
    query = query.overlaps('audience', filters.audience);
  }

  if (filters.sfiaRating && filters.sfiaRating.length > 0) {
    query = query.in('level_code', filters.sfiaRating);
  }

  const { data, error } = await query.order('title');

  if (error) {
    console.error('Error fetching filtered courses:', error);
    throw error;
  }

  let courses = data.map(transformCourseToLmsCard);

  // Apply search query filter (client-side for text search)
  if (filters.searchQuery) {
    const searchLower = filters.searchQuery.toLowerCase();
    courses = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchLower) ||
        course.summary.toLowerCase().includes(searchLower) ||
        course.provider.toLowerCase().includes(searchLower)
    );
  }

  return courses;
}

/**
 * Fetch all reviews (for reviews tab)
 */
export async function fetchAllReviews(): Promise<
  Array<{
    id: string;
    author: string;
    role: string;
    text: string;
    rating: number;
    courseId: string;
    courseSlug: string;
    courseTitle: string;
    courseType?: string;
    provider?: string;
    audience?: string[];
  }>
> {
  const { data, error } = await supabaseClient
    .from('lms_reviews')
    .select(`
      *,
      course:lms_courses (
        id,
        slug,
        title,
        course_type,
        provider,
        audience
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }

  return (
    data?.map((review) => ({
      id: review.id,
      author: review.author,
      role: review.role,
      text: review.text,
      rating: review.rating,
      courseId: (review.course as any)?.id || '',
      courseSlug: (review.course as any)?.slug || '',
      courseTitle: (review.course as any)?.title || '',
      courseType: (review.course as any)?.course_type || undefined,
      provider: (review.course as any)?.provider || undefined,
      audience: (review.course as any)?.audience || undefined,
    })) || []
  );
}

/**
 * Create a new review
 */
export async function createReview(
  courseId: string,
  review: {
    author: string;
    role: string;
    text: string;
    rating: number;
  }
): Promise<LmsReviewRow> {
  const { data, error } = await supabaseClient
    .from('lms_reviews')
    .insert({
      course_id: courseId,
      ...review,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating review:', error);
    throw error;
  }

  return data;
}

