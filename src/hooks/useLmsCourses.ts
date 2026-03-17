/**
 * React hooks for fetching LMS courses from Supabase
 */

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
  getLmsCourses,
  getLmsCourseDetails,
} from '../data/lmsCourseDetails';
import {
  fetchAllReviews,
  createReview,
  fetchAllLearningPaths,
  fetchLearningPathBySlug,
} from '../services/lmsService';
import type { LmsCard, LmsDetail } from '../data/lmsCourseDetails';

/**
 * Hook to fetch all courses
 */
export function useLmsCourses() {
  return useQuery<LmsCard[], Error>({
    queryKey: ['lms', 'courses'],
    queryFn: getLmsCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all course details
 */
export function useLmsCourseDetails() {
  return useQuery<LmsDetail[], Error>({
    queryKey: ['lms', 'course-details'],
    queryFn: getLmsCourseDetails,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single course by slug
 */
export function useLmsCourse(slug: string) {
  return useQuery<LmsDetail | null, Error>({
    queryKey: ['lms', 'courses', slug],
    queryFn: async () => {
      const searchSlug = slug.trim();
      console.log('[LMS] useLmsCourse: Searching for course with slug:', searchSlug);
      const courses = await getLmsCourseDetails();
      console.log('[LMS] useLmsCourse: Total courses available:', courses.length);
      console.log('[LMS] useLmsCourse: Available slugs:', courses.map(c => c.slug));
      
      // Try exact match first
      let found = courses.find(c => c.slug === searchSlug) || null;
      
      // If not found, try case-insensitive match
      if (!found) {
        found = courses.find(c => c.slug.toLowerCase() === searchSlug.toLowerCase()) || null;
        if (found) {
          console.log('[LMS] useLmsCourse: Found course with case-insensitive match');
        }
      }
      
      // If still not found, try learning paths
      if (!found) {
        console.log('[LMS] useLmsCourse: Course not found, checking learning paths...');
        found = await fetchLearningPathBySlug(searchSlug);
        if (found) {
          console.log('[LMS] useLmsCourse: Found learning path:', { slug: found.slug, title: found.title });
        }
      }
      
      if (!found) {
        console.warn('[LMS] useLmsCourse: Course or learning path not found with slug:', searchSlug);
        console.warn('[LMS] useLmsCourse: Available slugs:', courses.map(c => ({ slug: c.slug, title: c.title })));
      } else {
        console.log('[LMS] useLmsCourse: Found:', { slug: found.slug, title: found.title });
      }
      
      return found;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: true, // Always refetch when component mounts with new slug
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
}

/**
 * Hook to fetch filtered courses
 */
export function useLmsCoursesFiltered(filters: {
  category?: string[];
  provider?: string[];
  courseType?: string[];
  location?: string[];
  audience?: string[];
  sfiaRating?: string[];
  searchQuery?: string;
}) {
  return useQuery<LmsCard[], Error>({
    queryKey: ['lms', 'courses', 'filtered', filters],
    queryFn: async () => {
      const allCourses = await getLmsCourses();
      
      // Apply filters client-side
      let filtered = allCourses;
      
      if (filters.category && filters.category.length > 0) {
        filtered = filtered.filter(c => filters.category!.includes(c.courseCategory));
      }
      
      if (filters.provider && filters.provider.length > 0) {
        filtered = filtered.filter(c => filters.provider!.includes(c.provider));
      }
      
      if (filters.courseType && filters.courseType.length > 0) {
        filtered = filtered.filter(c => c.courseType && filters.courseType!.includes(c.courseType));
      }
      
      if (filters.location && filters.location.length > 0) {
        filtered = filtered.filter(c => 
          c.locations.some(loc => filters.location!.includes(loc))
        );
      }
      
      if (filters.audience && filters.audience.length > 0) {
        filtered = filtered.filter(c => 
          c.audience.some(aud => filters.audience!.includes(aud))
        );
      }
      
      if (filters.sfiaRating && filters.sfiaRating.length > 0) {
        filtered = filtered.filter(c => filters.sfiaRating!.includes(c.levelCode));
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(c =>
          c.title.toLowerCase().includes(query) ||
          c.summary.toLowerCase().includes(query) ||
          c.provider.toLowerCase().includes(query)
        );
      }
      
      return filtered;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all reviews
 */
export function useLmsReviews() {
  return useQuery<
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
    }>,
    Error
  >({
    queryKey: ['lms', 'reviews'],
    queryFn: fetchAllReviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a review
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      review,
    }: {
      courseId: string;
      review: {
        author: string;
        role: string;
        text: string;
        rating: number;
      };
    }) => createReview(courseId, review),
    onSuccess: (data, variables) => {
      // Invalidate and refetch course data
      queryClient.invalidateQueries({ queryKey: ['lms', 'courses', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['lms', 'reviews'] });
    },
  });
}

/**
 * Hook to fetch all learning paths
 */
export function useLmsLearningPaths() {
  return useQuery<LmsCard[], Error>({
    queryKey: ['lms', 'learning-paths'],
    queryFn: fetchAllLearningPaths,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

