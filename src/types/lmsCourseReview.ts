/**
 * LMS Course Review Types
 */

export type EngagingPart = 'Video' | 'Quiz' | 'Reading' | 'Interactive Lab';

export interface LmsCourseReview {
    id: string;
    course_id: string;
    course_slug: string;
    user_id: string | null;
    user_email: string;
    user_name: string | null;
    star_rating: number; // 1-5
    key_learning: string; // "What is the #1 thing you learned..."
    engaging_part: EngagingPart; // Multiple choice
    general_feedback: string; // Open text shown in reviews
    created_at: string;
    updated_at: string;
    is_published: boolean;
}

export interface LmsCourseReviewWithCourse extends LmsCourseReview {
    course_title?: string;
    course_category?: string;
    course_provider?: string;
}

export interface CreateReviewInput {
    course_id: string;
    course_slug: string;
    star_rating: number;
    key_learning: string;
    engaging_part: EngagingPart;
    general_feedback: string;
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
    engagingPartDistribution: {
        Video: number;
        Quiz: number;
        Reading: number;
        'Interactive Lab': number;
    };
}
