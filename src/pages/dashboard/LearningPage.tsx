import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BookOpen,
    CheckCircle2,
    Clock,
    Award,
    TrendingUp,
    FileText,
    ChevronRight,
    Target,
    X,
    Search,
    Filter,
    MoreHorizontal,
} from 'lucide-react';
import { useLmsCourseDetails } from '../../hooks/useLmsCourses';
import type { LmsDetail } from '../../data/lmsCourseDetails';
import { levelLabelFromCode } from '../../lms/levels';

// Storage keys
const COMPLETION_STORAGE_PREFIX = 'lms_lesson_completed_';
const QUIZ_STORAGE_PREFIX = 'lms_quiz_submission_';
const COURSE_STARTED_PREFIX = 'lms_course_started_';

// Helper functions
function isLessonCompleted(lessonId: string): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`${COMPLETION_STORAGE_PREFIX}${lessonId}`) === 'true';
}

function getQuizSubmissions(): Array<{
    quizId: string;
    lessonId: string;
    courseId: string;
    score: number;
    totalQuestions: number;
    submittedAt: string;
    passed?: boolean;
}> {
    if (typeof window === 'undefined') return [];
    const submissions: Array<{
        quizId: string;
        lessonId: string;
        courseId: string;
        score: number;
        totalQuestions: number;
        submittedAt: string;
        passed?: boolean;
    }> = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(QUIZ_STORAGE_PREFIX)) {
            try {
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                submissions.push(data);
            } catch (e) {
                // Skip invalid entries
            }
        }
    }

    return submissions.sort((a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
}

function getStartedCourses(): string[] {
    if (typeof window === 'undefined') return [];
    const courses: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(COURSE_STARTED_PREFIX)) {
            const courseSlug = key.replace(COURSE_STARTED_PREFIX, '');
            if (localStorage.getItem(key) === 'true') {
                courses.push(courseSlug);
            }
        }
    }
    return courses;
}

function getAllLessonIds(course: LmsDetail): string[] {
    const lessonIds: string[] = [];
    course.curriculum?.forEach((item) => {
        if (item.lessons) {
            item.lessons.forEach((lesson) => {
                lessonIds.push(lesson.id);
            });
        }
        if (item.topics) {
            item.topics.forEach((topic) => {
                if (topic.lessons) {
                    topic.lessons.forEach((lesson) => {
                        lessonIds.push(lesson.id);
                    });
                }
            });
        }
    });
    return lessonIds;
}

function calculateCourseProgress(course: LmsDetail): number {
    const lessonIds = getAllLessonIds(course);
    if (lessonIds.length === 0) return 0;
    const completedCount = lessonIds.filter(id => isLessonCompleted(id)).length;
    return Math.round((completedCount / lessonIds.length) * 100);
}

export const LearningPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'courses' | 'quizzes'>('courses');
    const [searchQuery, setSearchQuery] = useState("");
    const { data: allCourses } = useLmsCourseDetails();
    const quizSubmissions = useMemo(() => getQuizSubmissions(), []);
    const startedCourseSlugs = useMemo(() => getStartedCourses(), []);

    // Get courses that user has started
    const startedCourses = useMemo(() => {
        if (!allCourses) return [];
        let filtered = allCourses.filter(course => startedCourseSlugs.includes(course.slug));
        if (searchQuery) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.summary?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return filtered;
    }, [allCourses, startedCourseSlugs, searchQuery]);

    const filteredQuizSubmissions = useMemo(() => {
        if (!searchQuery) return quizSubmissions;
        // Search by course name would be better, but we only have courseId/slug in quizSubmissions
        // For now, simple date/score search or just return if not possible to search by title easily without map
        return quizSubmissions;
    }, [quizSubmissions, searchQuery]);

    // Calculate statistics
    const stats = useMemo(() => {
        const totalLessons = startedCourses.reduce((sum, course) => {
            return sum + getAllLessonIds(course).length;
        }, 0);

        const completedLessons = startedCourses.reduce((sum, course) => {
            const lessonIds = getAllLessonIds(course);
            return sum + lessonIds.filter(id => isLessonCompleted(id)).length;
        }, 0);

        const totalQuizzes = quizSubmissions.length;
        const averageQuizScore = quizSubmissions.length > 0
            ? Math.round(
                quizSubmissions.reduce((sum, q) => sum + (q.score / q.totalQuestions) * 100, 0) /
                quizSubmissions.length
            )
            : 0;

        const coursesInProgress = startedCourses.filter(course => {
            const progress = calculateCourseProgress(course);
            return progress > 0 && progress < 100;
        }).length;

        const coursesCompleted = startedCourses.filter(course => {
            return calculateCourseProgress(course) === 100;
        }).length;

        return {
            totalLessons,
            completedLessons,
            totalQuizzes,
            averageQuizScore,
            coursesInProgress,
            coursesCompleted,
            totalCourses: startedCourses.length,
        };
    }, [startedCourses, quizSubmissions]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#030F35] via-[#1A2E6E] to-[#2A3F7E] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                                Learning & Enablement
                            </h1>
                            <p className="mt-1 text-blue-200/80 text-sm md:text-base">
                                Track your learning progress, courses, and quiz results
                            </p>
                        </div>
                        <Link
                            to="/lms"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FB5535] hover:bg-[#e24a2d] 
                         text-white font-semibold rounded-lg shadow-lg shadow-orange-500/25 
                         transition-all duration-200 hover:shadow-orange-500/40 hover:-translate-y-0.5"
                        >
                            <BookOpen size={18} />
                            <span>Browse Courses</span>
                        </Link>
                    </div>

                    {/* Tabs */}
                    <div className="mt-6 flex gap-1 overflow-x-auto pb-1">
                        <button
                            onClick={() => setActiveTab('courses')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium text-sm
                           transition-all duration-200 whitespace-nowrap
                           ${activeTab === 'courses'
                                    ? "bg-white text-[#030F35] shadow-lg"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            <BookOpen size={18} />
                            <span>My Courses</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('quizzes')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium text-sm
                           transition-all duration-200 whitespace-nowrap
                           ${activeTab === 'quizzes'
                                    ? "bg-white text-[#030F35] shadow-lg"
                                    : "text-white/70 hover:text-white hover:bg-white/10"
                                }`}
                        >
                            <FileText size={18} />
                            <span>Quiz Results</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab === 'courses' ? 'courses' : 'quizzes'}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                         text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 
                           bg-white hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700
                           transition-colors"
                            >
                                <Filter size={16} />
                                <span>Filter</span>
                            </button>
                            <button
                                className="inline-flex items-center justify-center p-2.5 border border-gray-200
                           bg-white hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
                            >
                                <MoreHorizontal size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Statistics Cards inside content */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            label: "Completed",
                            value: stats.coursesCompleted,
                            subLabel: `of ${stats.totalCourses} started`,
                            color: "bg-gradient-to-br from-green-500 to-emerald-600",
                            icon: Award
                        },
                        {
                            label: "Lessons",
                            value: stats.completedLessons,
                            subLabel: `of ${stats.totalLessons} total`,
                            color: "bg-gradient-to-br from-blue-500 to-cyan-600",
                            icon: CheckCircle2
                        },
                        {
                            label: "Quizzes",
                            value: stats.totalQuizzes,
                            subLabel: "completed",
                            color: "bg-gradient-to-br from-purple-500 to-indigo-600",
                            icon: FileText
                        },
                        {
                            label: "Avg. Score",
                            value: `${stats.averageQuizScore}%`,
                            subLabel: "all quizzes",
                            color: "bg-gradient-to-br from-orange-500 to-red-600",
                            icon: TrendingUp
                        }
                    ].map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="relative overflow-hidden rounded-xl bg-white border border-gray-100 
                       shadow-sm p-4"
                            >
                                <div
                                    className={`absolute top-0 left-0 w-1 h-full ${stat.color}`}
                                />
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        {stat.label}
                                    </p>
                                    <Icon size={16} className="text-gray-300" />
                                </div>
                                <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-[10px] text-gray-500">{stat.subLabel}</p>
                            </div>
                        );
                    })}
                </div>

                {/* My Courses Content */}
                {activeTab === 'courses' && (
                    <div className="space-y-6">
                        {startedCourses.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20 px-4">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <BookOpen className="text-blue-600" size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                    {searchQuery
                                        ? "Try adjusting your search to find what you're looking for."
                                        : "Browse our learning center to start your first course."}
                                </p>
                                <Link
                                    to="/lms"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#030F35] text-white rounded-xl hover:bg-[#0a1a4a] transition-all font-semibold shadow-lg shadow-blue-900/10"
                                >
                                    <BookOpen size={20} />
                                    Browse Learning Center
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {startedCourses.map((course) => {
                                    const progress = calculateCourseProgress(course);
                                    const lessonIds = getAllLessonIds(course);
                                    const completedCount = lessonIds.filter(id => isLessonCompleted(id)).length;
                                    const isComplete = progress === 100;

                                    return (
                                        <div
                                            key={course.id}
                                            className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm 
                                                     hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden cursor-pointer"
                                            onClick={() => navigate(`/lms/${course.slug}`)}
                                        >
                                            <div className={`h-1.5 ${isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} />

                                            <div className="p-5">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {isComplete ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                                                <CheckCircle2 size={12} />
                                                                Completed
                                                            </span>
                                                        ) : progress > 0 ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                                                <Clock size={12} />
                                                                In Progress
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                                                Not Started
                                                            </span>
                                                        )}
                                                        {course.levelCode && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                                                <Target size={12} />
                                                                {levelLabelFromCode(course.levelCode)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors text-gray-400">
                                                        <ChevronRight size={18} />
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                                    {course.title}
                                                </h3>

                                                <p className="text-sm text-gray-500 line-clamp-2 mb-6">
                                                    {course.summary}
                                                </p>

                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between text-xs font-semibold">
                                                        <span className="text-gray-400">
                                                            {completedCount} of {lessonIds.length} lessons
                                                        </span>
                                                        <span className={`${isComplete ? 'text-green-600' : 'text-blue-600'}`}>
                                                            {progress}%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {course.duration && (
                                                    <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-2 text-xs font-medium text-gray-400">
                                                        <Clock size={14} />
                                                        <span>{course.duration} total duration</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Quiz Results Tab */}
                {activeTab === 'quizzes' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {filteredQuizSubmissions.length === 0 ? (
                            <div className="text-center py-20 px-4">
                                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FileText className="text-indigo-600" size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No quiz results found</h3>
                                <p className="text-gray-500 mb-0 max-w-sm mx-auto">
                                    Complete lessons with assessments to track your achievement here.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Result</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredQuizSubmissions.map((quiz, index) => {
                                            const scorePercentage = Math.round((quiz.score / quiz.totalQuestions) * 100);
                                            const passed = quiz.passed !== undefined ? quiz.passed : scorePercentage >= 80;

                                            return (
                                                <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                {new Date(quiz.submittedAt).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 mt-0.5">
                                                                {new Date(quiz.submittedAt).toLocaleTimeString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-gray-900">
                                                                    {scorePercentage}%
                                                                </span>
                                                                <span className="text-[10px] text-gray-500">
                                                                    {quiz.score}/{quiz.totalQuestions} Correct
                                                                </span>
                                                            </div>
                                                            <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                                                                <div
                                                                    className={`h-full rounded-full ${passed ? 'bg-green-500' : 'bg-red-500'}`}
                                                                    style={{ width: `${scorePercentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${passed
                                                            ? 'bg-green-50 text-green-700'
                                                            : 'bg-red-50 text-red-700'
                                                            }`}>
                                                            {passed ? (
                                                                <>
                                                                    <CheckCircle2 size={14} />
                                                                    Passed
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <X size={14} />
                                                                    Failed
                                                                </>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                        <button className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                                            Review
                                                            <ChevronRight size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LearningPage;
