/**
 * LMS Course Progress Types
 */

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';

/**
 * Individual lesson progress tracking
 */
export interface LmsLessonProgress {
    id: string;
    user_id: string;
    lesson_id: string;
    course_id: string;
    course_slug: string;
    status: ProgressStatus;
    progress_percentage: number;
    started_at: string | null;
    completed_at: string | null;
    last_accessed_at: string;
    quiz_passed: boolean;
    quiz_score: number | null;
    time_spent_seconds: number;
    created_at: string;
    updated_at: string;
}

/**
 * Overall course progress tracking
 */
export interface LmsCourseProgress {
    id: string;
    user_id: string;
    course_id: string;
    course_slug: string;
    status: ProgressStatus;
    progress_percentage: number;
    lessons_completed: number;
    total_lessons: number;
    started_at: string | null;
    completed_at: string | null;
    last_accessed_at: string;
    total_time_spent_seconds: number;
    certificate_earned: boolean;
    certificate_earned_at: string | null;
    saved_for_later: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Input for upserting lesson progress
 */
export interface UpsertLessonProgressInput {
    lesson_id: string;
    course_id: string;
    course_slug: string;
    status?: ProgressStatus;
    progress_percentage?: number;
    quiz_passed?: boolean;
    quiz_score?: number;
    time_spent_seconds?: number;
}

/**
 * Input for upserting course progress
 */
export interface UpsertCourseProgressInput {
    course_id: string;
    course_slug: string;
    status?: ProgressStatus;
    progress_percentage?: number;
    lessons_completed?: number;
    total_lessons?: number;
    certificate_earned?: boolean;
    saved_for_later?: boolean;
}

/**
 * Aggregated progress stats for a user
 */
export interface UserProgressStats {
    coursesStarted: number;
    coursesCompleted: number;
    lessonsCompleted: number;
    totalTimeSpentHours: number;
    certificatesEarned: number;
    averageProgress: number;
}

/**
 * Course with progress info
 */
/**
 * Quiz submission record
 */
export interface LmsQuizSubmission {
    id: string;
    user_id: string;
    quiz_id: string;
    lesson_id: string;
    course_id: string;
    score_achieved: number;
    total_questions: number;
    score_percentage: number;
    passed: boolean;
    answers?: any;
    attempt_number: number;
    completed_at: string;
}

/**
 * Input for saving a quiz submission
 */
export interface SaveQuizSubmissionInput {
    quiz_id: string;
    lesson_id: string;
    course_id: string;
    score_achieved: number;
    total_questions: number;
    score_percentage: number;
    passed: boolean;
    answers?: any;
}

export interface CourseWithProgress {
    course_id: string;
    course_slug: string;
    course_title: string;
    course_thumbnail?: string;
    course_provider?: string;
    progress: LmsCourseProgress | null;
}
