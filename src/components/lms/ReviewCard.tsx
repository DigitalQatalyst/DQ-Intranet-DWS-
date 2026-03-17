import React from 'react';
import { Star, ChevronRight, User2, Calendar, Video, FileText, HelpCircle, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LmsCourseReview, LmsCourseReviewWithCourse, EngagingPart } from '../../types/lmsCourseReview';

interface ReviewCardProps {
    review: LmsCourseReview | LmsCourseReviewWithCourse;
    showCourseLink?: boolean;
    variant?: 'default' | 'compact';
}

const ENGAGING_ICONS: Record<EngagingPart, React.ReactNode> = {
    'Video': <Video size={14} />,
    'Quiz': <HelpCircle size={14} />,
    'Reading': <FileText size={14} />,
    'Interactive Lab': <Monitor size={14} />,
};

export const ReviewCard: React.FC<ReviewCardProps> = ({
    review,
    showCourseLink = false,
    variant = 'default',
}) => {
    const reviewWithCourse = review as LmsCourseReviewWithCourse;
    const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const displayName = review.user_name || review.user_email.split('@')[0];

    if (variant === 'compact') {
        return (
            <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User2 size={16} className="text-gray-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">{displayName}</p>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={12}
                                        className={i < review.star_rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <span className="text-xs text-gray-400">{formattedDate}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">{review.general_feedback}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            {/* Header */}
            <div className="p-5 pb-4 border-b border-gray-50">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <User2 size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{displayName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < review.star_rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar size={12} />
                                    {formattedDate}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* Engaging Part Badge */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full">
                        <span className="text-gray-500">{ENGAGING_ICONS[review.engaging_part as EngagingPart]}</span>
                        <span className="text-xs font-medium text-gray-600">{review.engaging_part}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                {/* General Feedback */}
                <div>
                    <p className="text-gray-700 leading-relaxed">{review.general_feedback}</p>
                </div>

                {/* Key Learning */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100/50">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                        Key Takeaway
                    </p>
                    <p className="text-sm text-gray-700 italic">"{review.key_learning}"</p>
                </div>
            </div>

            {/* Course Link Footer */}
            {showCourseLink && reviewWithCourse.course_title && (
                <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100">
                    <Link
                        to={`/lms/${review.course_slug}`}
                        className="flex items-center justify-between group"
                    >
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">Reviewed Course</p>
                            <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {reviewWithCourse.course_title}
                            </p>
                        </div>
                        <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                </div>
            )}
        </div>
    );
};

interface ReviewListProps {
    reviews: (LmsCourseReview | LmsCourseReviewWithCourse)[];
    showCourseLink?: boolean;
    variant?: 'default' | 'compact';
    emptyMessage?: string;
    columns?: 1 | 2;
}

export const ReviewList: React.FC<ReviewListProps> = ({
    reviews,
    showCourseLink = false,
    variant = 'default',
    emptyMessage = 'No reviews yet. Be the first to share your experience!',
    columns = 1,
}) => {
    if (reviews.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    const gridCols = columns === 2 ? 'md:grid-cols-2' : '';

    return (
        <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
            {reviews.map((review) => (
                <ReviewCard
                    key={review.id}
                    review={review}
                    showCourseLink={showCourseLink}
                    variant={variant}
                />
            ))}
        </div>
    );
};

export default ReviewCard;
