import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useLmsCourse } from '../../hooks/useLmsCourses';
import { fetchQuizByCourseId } from '../../services/lmsService';
import type { LmsQuizRow } from '../../types/lmsSupabase';
import { CheckCircle2, X, Award, MessageSquare, ChevronRight } from 'lucide-react';
import { CourseReviewForm } from '../../components/lms/CourseReviewForm';
import { useCreateCourseReview, useUpdateCourseReview, useUserCourseReview } from '../../hooks/useCourseReviews';
import { useMarkLessonCompleted, useSaveQuizSubmission } from '../../hooks/useCourseProgress';
import { useAuth } from '../../components/Header';
import { Edit3 } from 'lucide-react';

const QUIZ_PASSING_SCORE = 80;

type AssessmentStage = 'quiz' | 'passed' | 'failed' | 'review' | 'complete';

export default function LmsCourseAssessmentPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { data: course, isLoading: courseLoading } = useLmsCourse(slug || '');

    const [quiz, setQuiz] = useState<LmsQuizRow | null>(null);
    const [loading, setLoading] = useState(true);

    // Wizard State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [score, setScore] = useState<{ score: number; total: number } | null>(null);

    // Stage management for the flow: quiz -> passed/failed -> review -> complete
    const [stage, setStage] = useState<AssessmentStage>('quiz');

    // Review mutations and queries
    const createReviewMutation = useCreateCourseReview();
    const updateReviewMutation = useUpdateCourseReview();
    const { data: existingUserReview } = useUserCourseReview(course?.id || '');
    const hasExistingReview = !!existingUserReview;

    // Progress hooks
    const { user } = useAuth();
    const markCompletedMutation = useMarkLessonCompleted();
    const saveSubmissionMutation = useSaveQuizSubmission();

    useEffect(() => {
        if (course?.id) {
            setLoading(true);
            fetchQuizByCourseId(course.id)
                .then(setQuiz)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [course?.id]);

    const handleOptionSelect = (index: number) => {
        if (isAnswerChecked || stage !== 'quiz') return;
        setSelectedOption(index);
    };

    const handleCheckAnswer = () => {
        if (!quiz || selectedOption === null) return;
        const currentQuestion = quiz.questions[currentQuestionIndex];
        const correct = currentQuestion.correct_answer === selectedOption;

        setIsAnswerCorrect(correct);
        setIsAnswerChecked(true);

        setQuizAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: selectedOption
        }));
    };

    const handleNextQuestion = () => {
        if (!quiz) return;
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            // Reset for next question
            setSelectedOption(null);
            setIsAnswerChecked(false);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        if (!quiz) return;

        let correctCount = 0;
        quiz.questions.forEach((q: any, i: number) => {
            if (quizAnswers[i] === q.correct_answer) {
                correctCount++;
            }
        });

        const passed = (correctCount / quiz.questions.length) * 100 >= QUIZ_PASSING_SCORE;
        const scorePercentage = (correctCount / quiz.questions.length) * 100;
        setScore({ score: correctCount, total: quiz.questions.length });
        setStage(passed ? 'passed' : 'failed');

        // Sync to Supabase if passed
        if (passed && user && course?.id) {
            markCompletedMutation.mutate({
                lessonId: `assessment_${course.id}`, // or whatever convention is used for final assessments
                courseId: course.id,
                courseSlug: slug || '',
                quizPassed: true,
                quizScore: scorePercentage,
            });
        }

        // Save quiz submission record
        if (user && course?.id && quiz) {
            saveSubmissionMutation.mutate({
                quiz_id: quiz.id,
                lesson_id: `assessment_${course.id}`,
                course_id: course.id,
                score_achieved: correctCount,
                total_questions: quiz.questions.length,
                score_percentage: scorePercentage,
                passed: passed,
                answers: quizAnswers,
            });
        }
    };

    const handleRetake = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswerChecked(false);
        setQuizAnswers({});
        setScore(null);
        setStage('quiz');
    };

    const handleProceedToReview = () => {
        setStage('review');
    };

    const handleSkipReview = () => {
        setStage('complete');
    };

    const handleReviewSubmitted = () => {
        setStage('complete');
    };

    if (courseLoading || loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (!course || !quiz) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
                <div className="flex-grow flex items-center justify-center p-4 text-center">
                    <h2 className="text-2xl font-bold mb-2">Assessment Not Found</h2>
                    <p className="text-gray-600 mb-6">There is no final assessment available for this course.</p>
                    <Link to={`/lms/${slug}`} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Back to Course</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

            <main className="flex-grow container mx-auto px-4 py-8">
                {stage === 'quiz' && (
                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h1 className="text-xl font-bold text-gray-900 mb-1">{quiz.title || 'Course Assessment'}</h1>
                            <p className="text-gray-500 text-sm">{course.title}</p>
                        </div>

                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm font-medium text-gray-500">Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                            </div>

                            <h3 className="text-xl font-medium text-gray-900 mb-6 leading-relaxed">
                                {quiz.questions[currentQuestionIndex].question || quiz.questions[currentQuestionIndex].text}
                            </h3>

                            <div className="space-y-3 mb-8">
                                {quiz.questions[currentQuestionIndex].options.map((option: string, index: number) => {
                                    const isSelected = selectedOption === index;
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleOptionSelect(index)}
                                            disabled={isAnswerChecked}
                                            className={`w-full text-left p-4 rounded-lg border-2 transition-all flex justify-between items-center ${isSelected
                                                ? isAnswerChecked
                                                    ? isAnswerCorrect
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-red-500 bg-red-50'
                                                    : 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                        >
                                            <span className={`${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>{option}</span>
                                            {isSelected && isAnswerChecked && (
                                                isAnswerCorrect
                                                    ? <CheckCircle2 className="text-green-500" size={20} />
                                                    : <X className="text-red-500" size={20} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {isAnswerChecked && (
                                <div className={`p-4 rounded-lg mb-6 ${isAnswerCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    <div className="flex items-center gap-2 font-bold mb-1">
                                        {isAnswerCorrect ? <CheckCircle2 size={20} /> : <X size={20} />}
                                        <span>{isAnswerCorrect ? 'Correct!' : 'Incorrect'}</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-6 border-t border-gray-100">
                                {!isAnswerChecked ? (
                                    <button
                                        onClick={handleCheckAnswer}
                                        disabled={selectedOption === null}
                                        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Check Answer
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNextQuestion}
                                        className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {stage === 'passed' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            {/* Success Header */}
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center text-white">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
                                    <Award size={40} className="text-white" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">🎉 Congratulations!</h2>
                                <p className="text-xl text-green-100">You've completed the course!</p>
                            </div>

                            <div className="p-8 text-center">
                                <div className="mb-6">
                                    <p className="text-lg text-gray-600 mb-2">Final Assessment Score</p>
                                    <p className="text-4xl font-bold text-gray-900">
                                        {score?.score} / {score?.total}
                                    </p>
                                    <p className="text-sm text-green-600 font-medium mt-1">
                                        {Math.round((score?.score || 0) / (score?.total || 1) * 100)}% - Passed!
                                    </p>
                                </div>

                                <div className="bg-blue-50 rounded-xl p-6 mb-6">
                                    {hasExistingReview ? <Edit3 className="w-8 h-8 text-blue-600 mx-auto mb-3" /> : <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-3" />}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {hasExistingReview ? 'Update Your Review' : 'Share Your Learning Experience'}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4">
                                        {hasExistingReview
                                            ? 'You\'ve already left a review. Would you like to update it based on your final assessment?'
                                            : 'Your feedback helps us improve courses for future learners. Take a moment to review this course.'}
                                    </p>
                                    <button
                                        onClick={handleProceedToReview}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#030F35] to-[#0A2463] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                                    >
                                        {hasExistingReview ? 'Edit Review' : 'Leave a Review'}
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleSkipReview}
                                    className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                                >
                                    Skip for now
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {stage === 'failed' && (
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 bg-red-100 text-red-600">
                                <X size={48} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment Not Passed</h2>
                            <p className="text-xl text-gray-600 mb-2">
                                You scored <span className="font-bold text-gray-900">{score?.score}</span> out of <span className="font-bold text-gray-900">{score?.total}</span>
                            </p>
                            <p className="text-gray-500 mb-8">
                                You need {QUIZ_PASSING_SCORE}% or higher to pass. Review the material and try again!
                            </p>

                            <div className="max-w-xs mx-auto space-y-3">
                                <button
                                    onClick={handleRetake}
                                    className="block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Retake Assessment
                                </button>
                                <Link to={`/lms/${slug}`} className="block text-gray-500 hover:text-gray-900 py-2">
                                    Review Course Material
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {stage === 'review' && (
                    <div className="max-w-3xl mx-auto">
                        <CourseReviewForm
                            courseId={course.id}
                            courseSlug={slug || ''}
                            courseTitle={course.title}
                            mode={hasExistingReview ? 'edit' : 'create'}
                            existingReview={existingUserReview}
                            isSubmitting={hasExistingReview ? updateReviewMutation.isPending : createReviewMutation.isPending}
                            onSubmit={async (input) => {
                                if (hasExistingReview && existingUserReview) {
                                    await updateReviewMutation.mutateAsync({
                                        reviewId: existingUserReview.id,
                                        input,
                                    });
                                } else {
                                    await createReviewMutation.mutateAsync(input);
                                }
                                handleReviewSubmitted();
                            }}
                            onSkip={handleSkipReview}
                        />
                    </div>
                )}

                {stage === 'complete' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            {/* Completion Header */}
                            <div className="bg-gradient-to-r from-[#030F35] to-[#0A2463] px-8 py-12 text-center text-white">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
                                    <CheckCircle2 size={40} className="text-white" />
                                </div>
                                <h2 className="text-3xl font-bold mb-2">Course Complete!</h2>
                                <p className="text-xl text-blue-200">{course.title}</p>
                            </div>

                            <div className="p-8 text-center">
                                <p className="text-gray-600 mb-8">
                                    You have successfully completed this course. Continue your learning journey by exploring more courses.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link
                                        to="/lms"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        Explore More Courses
                                    </Link>
                                    <Link
                                        to={`/lms/${slug}`}
                                        className="inline-flex items-center gap-2 px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                                    >
                                        Back to Course
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer isLoggedIn={false} />
        </div>
    );
}
