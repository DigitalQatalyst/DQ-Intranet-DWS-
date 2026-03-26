import React, { useState } from 'react';
import { Star, Video, FileText, HelpCircle, Monitor, CheckCircle, Loader2, Edit3 } from 'lucide-react';
import type { EngagingPart, CreateReviewInput, LmsCourseReview } from '../../types/lmsCourseReview';

interface CourseReviewFormProps {
    courseId: string;
    courseSlug: string;
    courseTitle: string;
    onSubmit: (input: CreateReviewInput) => Promise<void>;
    onSkip?: () => void;
    isSubmitting?: boolean;
    /** Mode: 'create' for new review, 'edit' for updating existing */
    mode?: 'create' | 'edit';
    /** Existing review data for edit mode */
    existingReview?: LmsCourseReview | {
        star_rating: number;
        key_learning: string;
        engaging_part: EngagingPart;
        general_feedback: string;
    } | null;
}

const ENGAGING_OPTIONS: { value: EngagingPart; label: string; icon: React.ReactNode }[] = [
    { value: 'Video', label: 'Video', icon: <Video size={20} /> },
    { value: 'Quiz', label: 'Quiz', icon: <HelpCircle size={20} /> },
    { value: 'Reading', label: 'Reading', icon: <FileText size={20} /> },
    { value: 'Interactive Lab', label: 'Interactive Lab', icon: <Monitor size={20} /> },
];

export const CourseReviewForm: React.FC<CourseReviewFormProps> = ({
    courseId,
    courseSlug,
    courseTitle,
    onSubmit,
    onSkip,
    isSubmitting = false,
    mode = 'create',
    existingReview,
}) => {
    const [starRating, setStarRating] = useState(existingReview?.star_rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [keyLearning, setKeyLearning] = useState(existingReview?.key_learning || '');
    const [engagingPart, setEngagingPart] = useState<EngagingPart | ''>(existingReview?.engaging_part || '');
    const [generalFeedback, setGeneralFeedback] = useState(existingReview?.general_feedback || '');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isValid = starRating > 0 && keyLearning.trim() && engagingPart && generalFeedback.trim();
    const isEditMode = mode === 'edit';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || isSubmitting) return;

        setError(null);
        try {
            await onSubmit({
                course_id: courseId,
                course_slug: courseSlug,
                star_rating: starRating,
                key_learning: keyLearning.trim(),
                engaging_part: engagingPart as EngagingPart,
                general_feedback: generalFeedback.trim(),
            });
            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit review');
        }
    };

    if (submitted) {
        return (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isEditMode ? 'Review Updated!' : 'Thank You!'}
                </h3>
                <p className="text-gray-600 mb-4">
                    {isEditMode
                        ? 'Your review has been successfully updated.'
                        : 'Your feedback helps us improve the learning experience for everyone.'
                    }
                </p>
                <p className="text-sm text-gray-500">
                    Your review for <span className="font-medium">{courseTitle}</span> has been {isEditMode ? 'updated' : 'submitted'}.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#030F35] to-[#0A2463] px-6 py-6 text-white">
                <div className="flex items-center gap-3 mb-1">
                    {isEditMode && <Edit3 className="w-5 h-5 text-blue-200" />}
                    <h3 className="text-xl font-bold">
                        {isEditMode ? 'Edit Your Review' : 'Share Your Learning Experience'}
                    </h3>
                </div>
                <p className="text-blue-200 text-sm">
                    {isEditMode
                        ? 'Update your feedback to better reflect your learning experience.'
                        : 'Congratulations on completing the course! Your feedback helps improve future courses.'
                    }
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Star Rating */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Overall Satisfaction <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                type="button"
                                onClick={() => setStarRating(rating)}
                                onMouseEnter={() => setHoverRating(rating)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                            >
                                <Star
                                    size={32}
                                    className={`transition-colors ${rating <= (hoverRating || starRating)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                        }`}
                                />
                            </button>
                        ))}
                        {starRating > 0 && (
                            <span className="ml-3 text-sm text-gray-600">
                                {starRating === 1 && 'Poor'}
                                {starRating === 2 && 'Fair'}
                                {starRating === 3 && 'Good'}
                                {starRating === 4 && 'Very Good'}
                                {starRating === 5 && 'Excellent'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Key Learning */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        What is the #1 thing you learned that you plan to apply in your work this week? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={keyLearning}
                        onChange={(e) => setKeyLearning(e.target.value)}
                        placeholder="Share the most valuable insight or skill you gained from this course..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-shadow"
                    />
                </div>

                {/* Engaging Part - Multiple Choice */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        What was the most engaging part of the course? <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {ENGAGING_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setEngagingPart(option.value)}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${engagingPart === option.value
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <span className={engagingPart === option.value ? 'text-blue-600' : 'text-gray-400'}>
                                    {option.icon}
                                </span>
                                <span className="mt-2 text-sm font-medium">{option.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* General Feedback */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        General Feedback <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                        This overview will be displayed in the course reviews section.
                    </p>
                    <textarea
                        value={generalFeedback}
                        onChange={(e) => setGeneralFeedback(e.target.value)}
                        placeholder="Share your overall thoughts about the course content, delivery, and what could be improved..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-shadow"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {onSkip && (
                        <button
                            type="button"
                            onClick={onSkip}
                            className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                        >
                            {isEditMode ? 'Cancel' : 'Skip for now'}
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className={`ml-auto px-6 py-3 rounded-xl font-semibold text-white transition-all flex items-center gap-2 ${isValid && !isSubmitting
                            ? 'bg-gradient-to-r from-[#030F35] to-[#0A2463] hover:shadow-lg hover:-translate-y-0.5'
                            : 'bg-gray-300 cursor-not-allowed'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {isEditMode ? 'Updating...' : 'Submitting...'}
                            </>
                        ) : (
                            <>
                                {isEditMode && <Edit3 className="w-4 h-4" />}
                                {isEditMode ? 'Update Review' : 'Submit Review'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseReviewForm;

