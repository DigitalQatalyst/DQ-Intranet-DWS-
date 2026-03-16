import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getLessonProgress,
    getCourseLessonsProgress,
    getCourseProgress,
    getUserCoursesProgress,
    getUserInProgressCourses,
    getUserCompletedCourses,
    getUserProgressStats,
    markLessonStarted as markLessonStartedSvc,
    markLessonCompleted as markLessonCompletedSvc,
    updateLessonVideoProgress as updateLessonVideoProgressSvc,
    saveQuizSubmission as saveQuizSubmissionSvc,
} from '../services/lmsService';
import type {
    LmsLessonProgress,
    LmsCourseProgress,
    UserProgressStats,
    SaveQuizSubmissionInput,
} from '../types/lmsCourseProgress';
import { useAuth } from '../components/Header';

/**
 * Hook to fetch lesson progress for a specific lesson
 */
export function useLessonProgress(lessonId: string) {
    const { user } = useAuth();

    return useQuery<LmsLessonProgress | null, Error>({
        queryKey: ['lms-lesson-progress', lessonId, user?.id],
        queryFn: () => getLessonProgress(user!.id, lessonId),
        enabled: !!lessonId && !!user?.id,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook to fetch all lesson progress for a course
 */
export function useCourseLessonsProgress(courseId: string) {
    const { user } = useAuth();

    return useQuery<LmsLessonProgress[], Error>({
        queryKey: ['lms-course-lessons-progress', courseId, user?.id],
        queryFn: () => getCourseLessonsProgress(user!.id, courseId),
        enabled: !!courseId && !!user?.id,
        staleTime: 1000 * 60 * 2,
    });
}

/**
 * Hook to fetch course progress
 */
export function useCourseProgress(courseId: string) {
    const { user } = useAuth();

    return useQuery<LmsCourseProgress | null, Error>({
        queryKey: ['lms-course-progress', courseId, user?.id],
        queryFn: () => getCourseProgress(user!.id, courseId),
        enabled: !!courseId && !!user?.id,
        staleTime: 1000 * 60 * 2,
    });
}

/**
 * Hook to fetch all course progress for the current user
 */
export function useUserCoursesProgress() {
    const { user } = useAuth();

    return useQuery<LmsCourseProgress[], Error>({
        queryKey: ['lms-user-courses-progress', user?.id],
        queryFn: () => getUserCoursesProgress(user!.id),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 2,
    });
}

/**
 * Hook to fetch in-progress courses for the current user
 */
export function useUserInProgressCourses() {
    const { user } = useAuth();

    return useQuery<LmsCourseProgress[], Error>({
        queryKey: ['lms-user-in-progress-courses', user?.id],
        queryFn: () => getUserInProgressCourses(user!.id),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 2,
    });
}

/**
 * Hook to fetch completed courses for the current user
 */
export function useUserCompletedCourses() {
    const { user } = useAuth();

    return useQuery<LmsCourseProgress[], Error>({
        queryKey: ['lms-user-completed-courses', user?.id],
        queryFn: () => getUserCompletedCourses(user!.id),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 2,
    });
}

/**
 * Hook to fetch overall progress stats for the current user
 */
export function useUserProgressStats() {
    const { user } = useAuth();

    return useQuery<UserProgressStats, Error>({
        queryKey: ['lms-user-progress-stats', user?.id],
        queryFn: () => getUserProgressStats(user!.id),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

/**
 * Hook to mark a lesson as started
 */
export function useMarkLessonStarted() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({
            lessonId,
            courseId,
            courseSlug,
        }: {
            lessonId: string;
            courseId: string;
            courseSlug: string;
        }) => {
            if (!user) throw new Error('User not authenticated');
            return markLessonStartedSvc(user.id, lessonId, courseId, courseSlug);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lms-lesson-progress', variables.lessonId] });
            queryClient.invalidateQueries({ queryKey: ['lms-course-lessons-progress', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['lms-course-progress', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['lms-user-courses-progress'] });
            queryClient.invalidateQueries({ queryKey: ['lms-user-in-progress-courses'] });
            queryClient.invalidateQueries({ queryKey: ['lms-user-progress-stats'] });
        },
    });
}

/**
 * Hook to mark a lesson as completed
 */
export function useMarkLessonCompleted() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({
            lessonId,
            courseId,
            courseSlug,
            quizPassed,
            quizScore,
        }: {
            lessonId: string;
            courseId: string;
            courseSlug: string;
            quizPassed?: boolean;
            quizScore?: number;
        }) => {
            if (!user) throw new Error('User not authenticated');
            return markLessonCompletedSvc(user.id, lessonId, courseId, courseSlug, quizPassed, quizScore);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lms-lesson-progress', variables.lessonId] });
            queryClient.invalidateQueries({ queryKey: ['lms-course-lessons-progress', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['lms-course-progress', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['lms-user-courses-progress'] });
            queryClient.invalidateQueries({ queryKey: ['lms-user-in-progress-courses'] });
            queryClient.invalidateQueries({ queryKey: ['lms-user-completed-courses'] });
            queryClient.invalidateQueries({ queryKey: ['lms-user-progress-stats'] });
        },
    });
}

/**
 * Hook to update lesson video progress
 */
export function useUpdateLessonVideoProgress() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({
            lessonId,
            courseId,
            courseSlug,
            progressPercentage,
            hasQuiz,
            quizPassed,
        }: {
            lessonId: string;
            courseId: string;
            courseSlug: string;
            progressPercentage: number;
            hasQuiz?: boolean;
            quizPassed?: boolean;
        }) => {
            if (!user) throw new Error('User not authenticated');
            return updateLessonVideoProgressSvc(user.id, lessonId, courseId, courseSlug, progressPercentage, hasQuiz, quizPassed);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lms-lesson-progress', variables.lessonId] });
            queryClient.invalidateQueries({ queryKey: ['lms-course-lessons-progress', variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ['lms-course-progress', variables.courseId] });
        },
    });
}
/**
 * Hook to save a quiz submission
 */
export function useSaveQuizSubmission() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (input: SaveQuizSubmissionInput) => {
            if (!user) throw new Error('User not authenticated');
            return saveQuizSubmissionSvc(user.id, input);
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lms-user-progress-stats'] });
            queryClient.invalidateQueries({ queryKey: ['lms-lesson-progress', variables.lesson_id] });
        },
    });
}
