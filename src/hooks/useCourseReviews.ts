import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchAllCourseReviews,
    fetchCourseReviews,
    fetchCourseReviewsBySlug,
    createCourseReview,
    updateCourseReview,
    deleteCourseReview,
    getCourseReviewStats,
    hasUserReviewedCourse,
    getUserCourseReview,
} from '../services/lmsService';
import type { CreateReviewInput, LmsCourseReview, LmsCourseReviewWithCourse, ReviewStats } from '../types/lmsCourseReview';
import { useAuth } from '../components/Header';

/**
 * Hook to fetch all course reviews (for /lms reviews tab)
 */
export function useAllCourseReviews() {
    return useQuery<LmsCourseReviewWithCourse[], Error>({
        queryKey: ['lms-course-reviews', 'all'],
        queryFn: fetchAllCourseReviews,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Hook to fetch reviews for a specific course by ID
 */
export function useCourseReviews(courseId: string) {
    return useQuery<LmsCourseReview[], Error>({
        queryKey: ['lms-course-reviews', courseId],
        queryFn: () => fetchCourseReviews(courseId),
        enabled: !!courseId,
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Hook to fetch reviews for a specific course by slug
 */
export function useCourseReviewsBySlug(courseSlug: string) {
    return useQuery<LmsCourseReview[], Error>({
        queryKey: ['lms-course-reviews', 'slug', courseSlug],
        queryFn: () => fetchCourseReviewsBySlug(courseSlug),
        enabled: !!courseSlug,
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Hook to fetch review statistics for a course
 */
export function useCourseReviewStats(courseId: string) {
    return useQuery<ReviewStats, Error>({
        queryKey: ['lms-course-review-stats', courseId],
        queryFn: () => getCourseReviewStats(courseId),
        enabled: !!courseId,
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Hook to check if current user has reviewed a course
 */
export function useHasUserReviewed(courseId: string) {
    const { user } = useAuth();

    return useQuery<boolean, Error>({
        queryKey: ['lms-user-reviewed', courseId, user?.id],
        queryFn: () => hasUserReviewedCourse(courseId, user!.id),
        enabled: !!courseId && !!user?.id,
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Hook to get the current user's review for a course
 */
export function useUserCourseReview(courseId: string) {
    const { user } = useAuth();

    return useQuery<LmsCourseReview | null, Error>({
        queryKey: ['lms-user-review', courseId, user?.id],
        queryFn: () => getUserCourseReview(courseId, user!.id),
        enabled: !!courseId && !!user?.id,
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Hook to create a new course review
 */
export function useCreateCourseReview() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (input: CreateReviewInput) => {
            if (!user) throw new Error('User not authenticated');
            return createCourseReview(input, {
                id: user.id,
                email: user.email || '',
                name: user.user_metadata?.full_name || user.user_metadata?.name || undefined,
            });
        },
        onSuccess: (_data, variables) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['lms-course-reviews'] });
            queryClient.invalidateQueries({ queryKey: ['lms-course-review-stats', variables.course_id] });
            queryClient.invalidateQueries({ queryKey: ['lms-user-reviewed', variables.course_id] });
            queryClient.invalidateQueries({ queryKey: ['lms-user-review', variables.course_id] });
        },
    });
}

/**
 * Hook to update an existing course review
 */
export function useUpdateCourseReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ reviewId, input }: { reviewId: string; input: Partial<CreateReviewInput> }) => {
            return updateCourseReview(reviewId, input);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['lms-course-reviews'] });
            if (data.course_id) {
                queryClient.invalidateQueries({ queryKey: ['lms-course-review-stats', data.course_id] });
                queryClient.invalidateQueries({ queryKey: ['lms-user-review', data.course_id] });
            }
        },
    });
}

/**
 * Hook to delete a course review
 */
export function useDeleteCourseReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (reviewId: string) => {
            return deleteCourseReview(reviewId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lms-course-reviews'] });
            queryClient.invalidateQueries({ queryKey: ['lms-course-review-stats'] });
            queryClient.invalidateQueries({ queryKey: ['lms-user-reviewed'] });
            queryClient.invalidateQueries({ queryKey: ['lms-user-review'] });
        },
    });
}
