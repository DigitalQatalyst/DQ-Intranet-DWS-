/**
 * LMS Service for fetching data from Supabase
 * Updated for new schema: learning_paths, courses, modules, lessons, quizzes
 */

import { lmsSupabaseClient } from '../lib/lmsSupabaseClient';
import type {
  LmsCourseRow,
  LmsCourseWithRelations,
  LmsModuleRow,
  LmsModuleWithRelations,
  LmsLessonRow,
  LmsQuizRow,
  LmsLearningPathRow,
} from '../types/lmsSupabase';
import type { LmsDetail, LmsCard } from '../data/lmsCourseDetails';
import { levelLabelFromCode, levelShortLabelFromCode } from '../lms/levels';
import { LOCATION_ALLOW, LevelCode } from '@/lms/config';
import { formatDurationFromMinutes } from '../utils/durationFormatter';

// Helper to normalize level code
function normalizeLevelCode(code: string | null): LevelCode {
  if (!code) return 'L1';

  const trimmed = code.trim();
  if (!trimmed) return 'L1';

  // 1. Try exact match with valid codes
  const LEVEL_CODE_SET = new Set<string>(['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8']);
  const upper = trimmed.toUpperCase() as LevelCode;
  if (LEVEL_CODE_SET.has(upper)) return upper;

  // 2. Try prefix match (e.g., "L0. Starting" or "L0 – Starting")
  const prefixMatch = trimmed.match(/^(L\d)/i);
  if (prefixMatch) {
    const normalized = prefixMatch[1].toUpperCase() as LevelCode;
    if (LEVEL_CODE_SET.has(normalized)) return normalized;
  }

  // 3. Try matching descriptive labels (case-insensitive)
  const lower = trimmed.toLowerCase();
  if (lower.includes('starting') || lower.includes('learning')) return 'L0';
  if (lower.includes('follow') || lower.includes('awareness')) return 'L1';
  if (lower.includes('assist')) return 'L2';
  if (lower.includes('apply')) return 'L3';
  if (lower.includes('enable')) return 'L4';
  if (lower.includes('ensure')) return 'L5';
  if (lower.includes('influence')) return 'L6';
  if (lower.includes('inspire')) return 'L7';

  return 'L1';
}

// Helper to convert status
function normalizeStatus(status: string): 'live' | 'coming-soon' {
  if (status === 'published') return 'live';
  if (status === 'draft') return 'coming-soon';
  return 'live';
}

// Helper to parse department/audience from TEXT to array
function parseTextToArray(text: string | null): string[] {
  if (!text) return [];
  // If it's already an array-like string, parse it
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [text];
  } catch {
    return text.split(',').map(s => s.trim()).filter(Boolean);
  }
}

/**
 * Transform Supabase course row to LmsDetail type
 */
function transformCourseToLmsDetail(
  course: LmsCourseWithRelations
): LmsDetail {
  // Transform modules and lessons into curriculum structure
  const curriculum: LmsDetail['curriculum'] = [];

  if (course.modules && course.modules.length > 0) {
    // Course has modules (Multi-Lessons course)
    curriculum.push(...course.modules.map((module) => {
      const curriculumItem: LmsDetail['curriculum'][0] = {
        id: module.id,
        title: module.title,
        description: module.description || undefined,
        duration: module.duration ? formatDurationFromMinutes(module.duration) : undefined,
        order: module.item_order,
        isLocked: module.is_locked,
      };

      // Add lessons from module
      if (module.lessons && module.lessons.length > 0) {
        curriculumItem.lessons = module.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description || undefined,
          duration: lesson.duration ? formatDurationFromMinutes(lesson.duration) : undefined,
          type: lesson.video_url ? 'video' : (lesson.content ? 'guide' : 'reading') as 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading',
          order: lesson.item_order,
          isLocked: lesson.is_locked,
          videoUrl: lesson.video_url || undefined,
          content: lesson.content || undefined,
        }));
      }

      return curriculumItem;
    }));
  } else if (course.lessons && course.lessons.length > 0) {
    // Course has lessons directly (Single Lesson course)
    curriculum.push({
      id: course.id,
      title: course.title,
      description: course.description || undefined,
      order: 0,
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || undefined,
        duration: lesson.duration ? formatDurationFromMinutes(lesson.duration) : undefined,
        type: lesson.video_url ? 'video' : (lesson.content ? 'guide' : 'reading') as 'video' | 'guide' | 'quiz' | 'workshop' | 'assignment' | 'reading',
        order: lesson.item_order,
        isLocked: lesson.is_locked,
        videoUrl: lesson.video_url || undefined,
        content: lesson.content || undefined,
      })),
    });
  }



  // Parse FAQ from JSONB
  const faq = Array.isArray(course.faq) ? course.faq.map((item: any) => ({
    question: item.question || '',
    answer: item.answer || '',
  })) : undefined;

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    provider: course.provider,
    courseCategory: course.category,
    deliveryMode: (course.delivery_mode === 'online' ? 'Online' : (course.delivery_mode === 'hybrid' ? 'Hybrid' : 'Online')) as 'Video' | 'Guide' | 'Workshop' | 'Hybrid' | 'Online',
    duration: formatDurationFromMinutes(course.duration),
    durationMinutes: course.duration, // Store actual minutes
    levelCode: normalizeLevelCode(course.level_code),
    department: parseTextToArray(course.department),
    locations: ['Riyadh'], // Default location since not in schema
    audience: parseTextToArray(course.audience) as Array<'Associate' | 'Lead'>,
    status: normalizeStatus(course.status),
    summary: course.description || course.title,
    courseDetails: course.course_details || undefined,
    highlights: course.highlights || [],
    outcomes: course.outcomes || [],
    courseType: course.course_type || undefined,
    track: course.track || undefined,
    rating: course.rating > 0 ? course.rating : undefined,
    reviewCount: course.review_count > 0 ? course.review_count : undefined,
    faq,
    imageUrl: course.image_url || undefined,
    curriculum: curriculum.length > 0 ? curriculum : undefined,
  };
}

/**
 * Transform Supabase course row to LmsCard type
 */
function transformCourseToLmsCard(course: LmsCourseRow): LmsCard {
  const levelCode = normalizeLevelCode(course.level_code);
  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    provider: course.provider,
    courseCategory: course.category,
    deliveryMode: course.delivery_mode || 'Online',
    duration: formatDurationFromMinutes(course.duration),
    durationMinutes: course.duration, // Store actual minutes
    levelCode,
    levelLabel: levelLabelFromCode(levelCode),
    levelShortLabel: levelShortLabelFromCode(levelCode),
    locations: ['Riyadh'], // Default location
    audience: parseTextToArray(course.audience),
    status: normalizeStatus(course.status),
    summary: course.description || course.title,
    department: parseTextToArray(course.department),
    courseType: course.course_type || undefined,
    track: course.track || undefined,
    imageUrl: course.image_url || undefined,
  };
}

/**
 * Fetch all courses (for listing page)
 */
export async function fetchAllCourses(): Promise<LmsCard[]> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_courses')
    .select('*')
    .neq('status', 'archived')
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
  // Fetch course
  const { data: course, error: courseError } = await lmsSupabaseClient
    .from('lms_courses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (courseError || !course) {
    console.error('Error fetching course:', courseError);
    return null;
  }

  // Fetch modules for this course
  const { data: modules } = await lmsSupabaseClient
    .from('lms_modules')
    .select('*')
    .eq('course_id', course.id)
    .order('item_order');

  // Fetch lessons for modules
  const modulesWithLessons: LmsModuleWithRelations[] = [];
  for (const module of modules || []) {
    const { data: lessons } = await lmsSupabaseClient
      .from('lms_lessons')
      .select('*')
      .eq('module_id', module.id)
      .order('item_order');

    modulesWithLessons.push({
      ...module,
      lessons: lessons || [],
    });
  }

  // Fetch lessons directly on course (not in modules)
  const { data: directLessons } = await lmsSupabaseClient
    .from('lms_lessons')
    .select('*')
    .eq('course_id', course.id)
    .is('module_id', null)
    .order('item_order');

  const courseWithRelations: LmsCourseWithRelations = {
    ...course,
    modules: modulesWithLessons.length > 0 ? modulesWithLessons : undefined,
    lessons: directLessons && directLessons.length > 0 ? directLessons : undefined,
    quiz: await fetchQuizByCourseId(course.id) // Fetch final assessment
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
  let query = lmsSupabaseClient
    .from('lms_courses')
    .select('*')
    .neq('status', 'archived');

  // Apply filters
  if (filters.category && filters.category.length > 0) {
    query = query.in('category', filters.category);
  }

  if (filters.provider && filters.provider.length > 0) {
    query = query.in('provider', filters.provider);
  }

  if (filters.courseType && filters.courseType.length > 0) {
    query = query.in('course_type', filters.courseType);
  }

  if (filters.audience && filters.audience.length > 0) {
    // Since audience is TEXT, we need to filter client-side
    // Or use text search if Supabase supports it
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

  // Apply client-side filters
  if (filters.audience && filters.audience.length > 0) {
    courses = courses.filter(course =>
      course.audience.some(aud => filters.audience!.includes(aud))
    );
  }

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
 * Note: Reviews are no longer in separate table, return empty array
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
  // Reviews are now stored in course.faq or testimonials JSONB
  // Return empty array for now - can be extended later
  return [];
}

/**
 * Create a new review
 * Note: Reviews are no longer in separate table
 */
export async function createReview(
  courseId: string,
  review: {
    author: string;
    role: string;
    text: string;
    rating: number;
  }
): Promise<any> {
  // Reviews are now stored in course JSONB fields
  // This would need to update the course record
  throw new Error('Review creation not implemented - reviews are stored in course JSONB');
}

/**
 * Fetch quiz for a lesson
 */
export async function fetchQuizByLessonId(lessonId: string): Promise<LmsQuizRow | null> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_quizzes')
    .select('*')
    .eq('lesson_id', lessonId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No quiz found for this lesson
      return null;
    }
    console.error('Error fetching quiz:', error);
    throw error;
  }

  return data;
}

/**
 * Fetch quiz for a course
 */
export async function fetchQuizByCourseId(courseId: string): Promise<LmsQuizRow | null> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_quizzes')
    .select('*')
    .eq('course_id', courseId)
    .is('lesson_id', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No quiz found for this course
      return null;
    }
    console.error('Error fetching quiz:', error);
    throw error;
  }

  return data;
}

/**
 * Fetch all learning paths
 */
export async function fetchAllLearningPaths(): Promise<LmsCard[]> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_learning_paths')
    .select('*')
    .neq('status', 'archived')
    .order('title');

  if (error) {
    console.error('Error fetching learning paths:', error);
    throw error;
  }

  return data.map((path) => ({
    id: path.id,
    slug: path.slug,
    title: path.title,
    provider: path.provider,
    courseCategory: path.category,
    deliveryMode: 'Online' as const,
    duration: formatDurationFromMinutes(path.duration),
    durationMinutes: path.duration,
    levelCode: normalizeLevelCode(path.level_code),
    levelLabel: levelLabelFromCode(normalizeLevelCode(path.level_code)),
    levelShortLabel: levelShortLabelFromCode(normalizeLevelCode(path.level_code)),
    locations: ['Riyadh'],
    audience: parseTextToArray(path.audience),
    status: normalizeStatus(path.status),
    summary: path.description || path.title,
    department: parseTextToArray(path.department),
    courseType: undefined,
    track: undefined,
    imageUrl: path.image_url || undefined,
    rating: path.rating > 0 ? path.rating : undefined,
    reviewCount: path.review_count > 0 ? path.review_count : undefined,
  }));
}

/**
 * Fetch learning path by slug with courses
 */
export async function fetchLearningPathBySlug(slug: string): Promise<LmsDetail | null> {
  // Fetch learning path
  const { data: path, error: pathError } = await lmsSupabaseClient
    .from('lms_learning_paths')
    .select('*')
    .eq('slug', slug)
    .single();

  if (pathError || !path) {
    console.error('Error fetching learning path:', pathError);
    return null;
  }

  // Fetch path items (courses in this path)
  const { data: pathItems } = await lmsSupabaseClient
    .from('lms_path_items')
    .select('*')
    .eq('path_id', path.id)
    .order('position');

  // Fetch course details for each course in the path
  const courseIds = pathItems?.map(item => item.course_id) || [];
  const courses: LmsCourseRow[] = [];

  if (courseIds.length > 0) {
    const { data: pathCourses } = await lmsSupabaseClient
      .from('lms_courses')
      .select('*')
      .in('id', courseIds);

    if (pathCourses) {
      // Sort courses by their position in the path
      const coursesMap = new Map(pathCourses.map(c => [c.id, c]));
      courses.push(...courseIds.map(id => coursesMap.get(id)).filter(Boolean) as LmsCourseRow[]);
    }
  }

  // Build curriculum structure from courses
  const curriculum = courses.map((course, index) => ({
    id: course.id,
    title: course.title,
    description: course.description || undefined,
    duration: formatDurationFromMinutes(course.duration),
    order: index,
    courseSlug: course.slug,
  }));

  // Parse FAQ from JSONB
  const faq = Array.isArray(path.faq) ? path.faq.map((item: any) => ({
    question: item.question || '',
    answer: item.answer || '',
  })) : undefined;

  return {
    id: path.id,
    slug: path.slug,
    title: path.title,
    provider: path.provider,
    courseCategory: path.category,
    deliveryMode: 'Online',
    duration: formatDurationFromMinutes(path.duration),
    durationMinutes: path.duration,
    levelCode: normalizeLevelCode(path.level_code),
    department: parseTextToArray(path.department),
    locations: ['Riyadh'],
    audience: parseTextToArray(path.audience) as Array<'Associate' | 'Lead'>,
    status: normalizeStatus(path.status),
    summary: path.description || path.title,
    highlights: path.highlights || [],
    outcomes: path.outcomes || [],
    courseType: 'Course (Bundles)' as const,
    track: undefined,
    rating: path.rating > 0 ? path.rating : undefined,
    reviewCount: path.review_count > 0 ? path.review_count : undefined,
    faq,
    imageUrl: path.image_url || undefined,
    curriculum: curriculum.length > 0 ? curriculum : undefined,
  };
}

/**
 * Find learning paths that contain a specific course
 */
export async function findLearningPathsForCourse(courseId: string): Promise<Array<{
  pathId: string;
  pathSlug: string;
  pathTitle: string;
  position: number;
}>> {
  const { data: pathItems, error } = await lmsSupabaseClient
    .from('lms_path_items')
    .select(`
      path_id,
      position,
      lms_learning_paths!inner (
        id,
        slug,
        title
      )
    `)
    .eq('course_id', courseId)
    .order('position');

  if (error) {
    console.error('Error finding learning paths for course:', error);
    return [];
  }

  return (pathItems || []).map((item: any) => ({
    pathId: item.path_id,
    pathSlug: item.lms_learning_paths?.slug || '',
    pathTitle: item.lms_learning_paths?.title || '',
    position: item.position,
  }));
}

/**
 * Fetch all courses in a learning path (for displaying "Part of Track" section)
 */
export async function fetchCoursesInLearningPath(pathId: string): Promise<Array<{
  id: string;
  slug: string;
  title: string;
  position: number;
}>> {
  const { data: pathItems, error } = await lmsSupabaseClient
    .from('lms_path_items')
    .select(`
      course_id,
      position,
      lms_courses!inner (
        id,
        slug,
        title
      )
    `)
    .eq('path_id', pathId)
    .order('position');

  if (error) {
    console.error('Error fetching courses in learning path:', error);
    return [];
  }

  return (pathItems || []).map((item: any) => ({
    id: item.lms_courses?.id || '',
    slug: item.lms_courses?.slug || '',
    title: item.lms_courses?.title || '',
    position: item.position,
  }));
}

// ============================================
// Course Review Functions
// ============================================

import type {
  LmsCourseReview,
  LmsCourseReviewWithCourse,
  CreateReviewInput,
  ReviewStats,
  EngagingPart,
} from '../types/lmsCourseReview';

/**
 * Fetch all published reviews (for /lms reviews tab)
 */
export async function fetchAllCourseReviews(): Promise<LmsCourseReviewWithCourse[]> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_course_reviews')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching course reviews:', error);
    throw error;
  }

  // Fetch course details for each review
  const courseIds = [...new Set(data.map(r => r.course_id))];
  const { data: courses } = await lmsSupabaseClient
    .from('lms_courses')
    .select('id, title, category, provider')
    .in('id', courseIds);

  const courseMap = new Map(courses?.map(c => [c.id, c]) || []);

  return data.map(review => ({
    ...review,
    course_title: courseMap.get(review.course_id)?.title,
    course_category: courseMap.get(review.course_id)?.category,
    course_provider: courseMap.get(review.course_id)?.provider,
  }));
}

/**
 * Fetch reviews for a specific course (for course detail reviews tab)
 */
export async function fetchCourseReviews(courseId: string): Promise<LmsCourseReview[]> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_course_reviews')
    .select('*')
    .eq('course_id', courseId)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching course reviews:', error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch reviews for a specific course by slug
 */
export async function fetchCourseReviewsBySlug(courseSlug: string): Promise<LmsCourseReview[]> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_course_reviews')
    .select('*')
    .eq('course_slug', courseSlug)
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching course reviews:', error);
    throw error;
  }

  return data || [];
}

/**
 * Check if a user has already reviewed a course
 */
export async function hasUserReviewedCourse(courseId: string, userId: string): Promise<boolean> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_course_reviews')
    .select('id')
    .eq('course_id', courseId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking user review:', error);
  }

  return !!data;
}

/**
 * Get user's review for a course (if exists)
 */
export async function getUserCourseReview(courseId: string, userId: string): Promise<LmsCourseReview | null> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_course_reviews')
    .select('*')
    .eq('course_id', courseId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No review found
    }
    console.error('Error fetching user review:', error);
    throw error;
  }

  return data;
}

/**
 * Create a new course review
 */
export async function createCourseReview(
  input: CreateReviewInput,
  user: { id: string; email: string; name?: string }
): Promise<LmsCourseReview> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_course_reviews')
    .insert({
      course_id: input.course_id,
      course_slug: input.course_slug,
      user_id: null, // Set to null since we use Azure AD auth, not Supabase auth
      user_email: user.email,
      user_name: user.name || null,
      star_rating: input.star_rating,
      key_learning: input.key_learning,
      engaging_part: input.engaging_part,
      general_feedback: input.general_feedback,
      is_published: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating course review:', error);
    throw error;
  }

  // Update course rating and review count
  await updateCourseReviewStats(input.course_id);

  return data;
}

/**
 * Update an existing course review
 */
export async function updateCourseReview(
  reviewId: string,
  input: Partial<CreateReviewInput>
): Promise<LmsCourseReview> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_course_reviews')
    .update({
      star_rating: input.star_rating,
      key_learning: input.key_learning,
      engaging_part: input.engaging_part,
      general_feedback: input.general_feedback,
    })
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    console.error('Error updating course review:', error);
    throw error;
  }

  // Update course rating stats
  if (data?.course_id) {
    await updateCourseReviewStats(data.course_id);
  }

  return data;
}

/**
 * Delete a course review
 */
export async function deleteCourseReview(reviewId: string): Promise<void> {
  // Get the course_id before deleting
  const { data: review } = await lmsSupabaseClient
    .from('lms_course_reviews')
    .select('course_id')
    .eq('id', reviewId)
    .single();

  const { error } = await lmsSupabaseClient
    .from('lms_course_reviews')
    .delete()
    .eq('id', reviewId);

  if (error) {
    console.error('Error deleting course review:', error);
    throw error;
  }

  // Update course rating stats
  if (review?.course_id) {
    await updateCourseReviewStats(review.course_id);
  }
}

/**
 * Calculate review statistics for a course
 */
export async function getCourseReviewStats(courseId: string): Promise<ReviewStats> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_course_reviews')
    .select('star_rating, engaging_part')
    .eq('course_id', courseId)
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching review stats:', error);
    throw error;
  }

  const reviews = data || [];
  const totalReviews = reviews.length;

  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      engagingPartDistribution: { Video: 0, Quiz: 0, Reading: 0, 'Interactive Lab': 0 },
    };
  }

  const averageRating = reviews.reduce((sum, r) => sum + r.star_rating, 0) / totalReviews;

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
  const engagingPartDistribution = { Video: 0, Quiz: 0, Reading: 0, 'Interactive Lab': 0 } as Record<EngagingPart, number>;

  reviews.forEach(r => {
    ratingDistribution[r.star_rating as 1 | 2 | 3 | 4 | 5]++;
    engagingPartDistribution[r.engaging_part as EngagingPart]++;
  });

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    ratingDistribution,
    engagingPartDistribution,
  };
}

/**
 * Update the course's rating and review_count after review changes
 */
async function updateCourseReviewStats(courseId: string): Promise<void> {
  const stats = await getCourseReviewStats(courseId);

  const { error } = await lmsSupabaseClient
    .from('lms_courses')
    .update({
      rating: stats.averageRating,
      review_count: stats.totalReviews,
    })
    .eq('id', courseId);

  if (error) {
    console.error('Error updating course review stats:', error);
  }
}

// ============================================
// Course Progress Functions
// ============================================

import type {
  LmsLessonProgress,
  LmsCourseProgress,
  UpsertLessonProgressInput,
  UpsertCourseProgressInput,
  UserProgressStats,
  LmsQuizSubmission,
  SaveQuizSubmissionInput,
} from '../types/lmsCourseProgress';

/**
 * Upsert lesson progress (insert or update)
 */
export async function upsertLessonProgress(
  userId: string,
  input: UpsertLessonProgressInput
): Promise<LmsLessonProgress> {
  const now = new Date().toISOString();

  const upsertData: any = {
    user_id: userId,
    lesson_id: input.lesson_id,
    course_id: input.course_id,
    course_slug: input.course_slug,
    last_accessed_at: now,
    updated_at: now,
  };

  // Set optional fields if provided
  if (input.status !== undefined) {
    upsertData.status = input.status;
    if (input.status === 'in_progress' && !upsertData.started_at) {
      upsertData.started_at = now;
    }
    if (input.status === 'completed') {
      upsertData.completed_at = now;
    }
  }
  if (input.progress_percentage !== undefined) {
    upsertData.progress_percentage = input.progress_percentage;
  }
  if (input.quiz_passed !== undefined) {
    upsertData.quiz_passed = input.quiz_passed;
  }
  if (input.quiz_score !== undefined) {
    upsertData.quiz_score = input.quiz_score;
  }
  if (input.time_spent_seconds !== undefined) {
    upsertData.time_spent_seconds = input.time_spent_seconds;
  }

  const { data, error } = await lmsSupabaseClient
    .from('lms_lesson_progress')
    .upsert(upsertData, {
      onConflict: 'user_id,lesson_id',
    })
    .select()
    .single();

  if (error) {
    console.error('Error upserting lesson progress:', error);
    throw error;
  }

  // Recalculate course progress
  await recalculateCourseProgress(userId, input.course_id, input.course_slug);

  return data;
}

/**
 * Get lesson progress for a user
 */
export async function getLessonProgress(
  userId: string,
  lessonId: string
): Promise<LmsLessonProgress | null> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching lesson progress:', error);
    throw error;
  }

  return data;
}

/**
 * Get all lesson progress for a user in a course
 */
export async function getCourseLessonsProgress(
  userId: string,
  courseId: string
): Promise<LmsLessonProgress[]> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .order('last_accessed_at', { ascending: false });

  if (error) {
    console.error('Error fetching course lessons progress:', error);
    throw error;
  }

  return data || [];
}

/**
 * Upsert course progress
 */
export async function upsertCourseProgress(
  userId: string,
  input: UpsertCourseProgressInput
): Promise<LmsCourseProgress> {
  const now = new Date().toISOString();

  const upsertData: any = {
    user_id: userId,
    course_id: input.course_id,
    course_slug: input.course_slug,
    last_accessed_at: now,
    updated_at: now,
  };

  // Set optional fields if provided
  if (input.status !== undefined) {
    upsertData.status = input.status;
    if (input.status === 'in_progress' && !upsertData.started_at) {
      upsertData.started_at = now;
    }
    if (input.status === 'completed') {
      upsertData.completed_at = now;
    }
  }
  if (input.progress_percentage !== undefined) {
    upsertData.progress_percentage = input.progress_percentage;
  }
  if (input.lessons_completed !== undefined) {
    upsertData.lessons_completed = input.lessons_completed;
  }
  if (input.total_lessons !== undefined) {
    upsertData.total_lessons = input.total_lessons;
  }
  if (input.certificate_earned !== undefined) {
    upsertData.certificate_earned = input.certificate_earned;
    if (input.certificate_earned) {
      upsertData.certificate_earned_at = now;
    }
  }

  const { data, error } = await lmsSupabaseClient
    .from('lms_course_progress')
    .upsert(upsertData, {
      onConflict: 'user_id,course_id',
    })
    .select()
    .single();

  if (error) {
    console.error('Error upserting course progress:', error);
    throw error;
  }

  return data;
}

/**
 * Get course progress for a user
 */
export async function getCourseProgress(
  userId: string,
  courseId: string
): Promise<LmsCourseProgress | null> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_course_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching course progress:', error);
    throw error;
  }

  return data;
}

/**
 * Get all course progress for a user
 */
export async function getUserCoursesProgress(
  userId: string
): Promise<LmsCourseProgress[]> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_course_progress')
    .select('*')
    .eq('user_id', userId)
    .order('last_accessed_at', { ascending: false });

  if (error) {
    console.error('Error fetching user courses progress:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get user's in-progress courses
 */
export async function getUserInProgressCourses(
  userId: string
): Promise<LmsCourseProgress[]> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_course_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .order('last_accessed_at', { ascending: false });

  if (error) {
    console.error('Error fetching in-progress courses:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get user's completed courses
 */
export async function getUserCompletedCourses(
  userId: string
): Promise<LmsCourseProgress[]> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_course_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Error fetching completed courses:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get overall progress stats for a user
 */
export async function getUserProgressStats(userId: string): Promise<UserProgressStats> {
  const { data: courses, error: coursesError } = await lmsSupabaseClient
    .from('lms_course_progress')
    .select('*')
    .eq('user_id', userId);

  if (coursesError) {
    console.error('Error fetching user progress stats:', coursesError);
    throw coursesError;
  }

  const allCourses = courses || [];
  const coursesStarted = allCourses.filter(c => c.status !== 'not_started').length;
  const coursesCompleted = allCourses.filter(c => c.status === 'completed').length;
  const certificatesEarned = allCourses.filter(c => c.certificate_earned).length;
  const totalTimeSpentSeconds = allCourses.reduce((sum, c) => sum + (c.total_time_spent_seconds || 0), 0);
  const totalProgress = allCourses.reduce((sum, c) => sum + (c.progress_percentage || 0), 0);
  const averageProgress = allCourses.length > 0 ? totalProgress / allCourses.length : 0;

  // Get total lessons completed
  const { data: lessons } = await lmsSupabaseClient
    .from('lms_lesson_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'completed');

  return {
    coursesStarted,
    coursesCompleted,
    lessonsCompleted: lessons?.length || 0,
    totalTimeSpentHours: Math.round((totalTimeSpentSeconds / 3600) * 10) / 10,
    certificatesEarned,
    averageProgress: Math.round(averageProgress),
  };
}

/**
 * Recalculate course progress based on lesson progress
 */
async function recalculateCourseProgress(
  userId: string,
  courseId: string,
  courseSlug: string
): Promise<void> {
  // Get all lesson progress for this course
  const lessonProgress = await getCourseLessonsProgress(userId, courseId);

  // Get total lessons from the course
  const { data: course } = await lmsSupabaseClient
    .from('lms_courses')
    .select('id')
    .eq('id', courseId)
    .single();

  if (!course) return;

  // Get total lessons count from modules and direct lessons
  const { data: modules } = await lmsSupabaseClient
    .from('lms_modules')
    .select('id')
    .eq('course_id', courseId);

  let totalLessons = 0;

  if (modules && modules.length > 0) {
    const { count } = await lmsSupabaseClient
      .from('lms_lessons')
      .select('id', { count: 'exact', head: true })
      .in('module_id', modules.map(m => m.id));
    totalLessons = count || 0;
  }

  // Also count direct lessons
  const { count: directLessonsCount } = await lmsSupabaseClient
    .from('lms_lessons')
    .select('id', { count: 'exact', head: true })
    .eq('course_id', courseId)
    .is('module_id', null);

  totalLessons += directLessonsCount || 0;

  const completedLessons = lessonProgress.filter(l => l.status === 'completed').length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const totalTimeSpent = lessonProgress.reduce((sum, l) => sum + (l.time_spent_seconds || 0), 0);

  let status: 'not_started' | 'in_progress' | 'completed' = 'not_started';
  if (completedLessons > 0 && completedLessons >= totalLessons) {
    status = 'completed';
  } else if (lessonProgress.length > 0) {
    status = 'in_progress';
  }

  await upsertCourseProgress(userId, {
    course_id: courseId,
    course_slug: courseSlug,
    status,
    progress_percentage: progressPercentage,
    lessons_completed: completedLessons,
    total_lessons: totalLessons,
  });
}

/**
 * Mark a lesson as started
 */
export async function markLessonStarted(
  userId: string,
  lessonId: string,
  courseId: string,
  courseSlug: string
): Promise<LmsLessonProgress> {
  return upsertLessonProgress(userId, {
    lesson_id: lessonId,
    course_id: courseId,
    course_slug: courseSlug,
    status: 'in_progress',
  });
}

/**
 * Mark a lesson as completed
 */
export async function markLessonCompleted(
  userId: string,
  lessonId: string,
  courseId: string,
  courseSlug: string,
  quizPassed?: boolean,
  quizScore?: number
): Promise<LmsLessonProgress> {
  return upsertLessonProgress(userId, {
    lesson_id: lessonId,
    course_id: courseId,
    course_slug: courseSlug,
    status: 'completed',
    progress_percentage: 100,
    quiz_passed: quizPassed,
    quiz_score: quizScore,
  });
}

/**
 * Update lesson video progress
 */
export async function updateLessonVideoProgress(
  userId: string,
  lessonId: string,
  courseId: string,
  courseSlug: string,
  progressPercentage: number,
  hasQuiz: boolean = false,
  quizPassed: boolean = false
): Promise<LmsLessonProgress> {
  let newStatus: 'in_progress' | 'completed' = 'in_progress';
  if (progressPercentage >= 90) {
    if (!hasQuiz || quizPassed) {
      newStatus = 'completed';
    }
  }

  return upsertLessonProgress(userId, {
    lesson_id: lessonId,
    course_id: courseId,
    course_slug: courseSlug,
    status: newStatus,
    progress_percentage: progressPercentage,
  });
}
/**
 * Save a quiz submission history record
 */
export async function saveQuizSubmission(
  userId: string,
  input: SaveQuizSubmissionInput
): Promise<LmsQuizSubmission> {
  // First, get the current attempt number for this quiz/user
  const { count } = await lmsSupabaseClient
    .from('lms_quiz_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('quiz_id', input.quiz_id);

  const attemptNumber = (count || 0) + 1;

  const { data, error } = await lmsSupabaseClient
    .from('lms_quiz_submissions')
    .insert({
      user_id: userId,
      quiz_id: input.quiz_id,
      lesson_id: input.lesson_id,
      course_id: input.course_id,
      score_achieved: input.score_achieved,
      total_questions: input.total_questions,
      score_percentage: input.score_percentage,
      passed: input.passed,
      answers: input.answers,
      attempt_number: attemptNumber,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving quiz submission:', error);
    throw error;
  }

  return data as LmsQuizSubmission;
}

// ============================================
// Save for Later Functions
// ============================================

/**
 * Toggle saved_for_later for a course. Creates a progress row if one doesn't exist yet.
 */
export async function toggleSaveForLater(
  userId: string,
  courseId: string,
  courseSlug: string,
  currentlySaved: boolean
): Promise<boolean> {
  const newValue = !currentlySaved;
  const { error } = await lmsSupabaseClient
    .from('lms_course_progress')
    .upsert(
      {
        user_id: userId,
        course_id: courseId,
        course_slug: courseSlug,
        status: 'not_started',
        saved_for_later: newValue,
      },
      { onConflict: 'user_id,course_id' }
    );
  if (error) {
    console.error('Error toggling save for later:', error);
    throw error;
  }
  return newValue;
}

/**
 * Get the saved_for_later status for a course.
 */
export async function getSaveForLater(
  userId: string,
  courseId: string
): Promise<boolean> {
  const { data, error } = await lmsSupabaseClient
    .from('lms_course_progress')
    .select('saved_for_later')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();
  if (error) {
    console.error('Error fetching save for later:', error);
    return false;
  }
  return data?.saved_for_later ?? false;
}
