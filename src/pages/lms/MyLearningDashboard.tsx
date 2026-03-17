import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  TrendingUp,
  FileText,
  BarChart3,
  Calendar,
  ChevronRight,
  Play,
  Target,
  X,
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useLmsCourseDetails } from '../../hooks/useLmsCourses';
import { useUserCoursesProgress, useUserProgressStats } from '../../hooks/useCourseProgress';
import type { LmsDetail } from '../../data/lmsCourseDetails';
import { useAuth } from '../../components/Header';

// Storage keys
const PROGRESS_STORAGE_PREFIX = 'lms_lesson_progress_';
const COMPLETION_STORAGE_PREFIX = 'lms_lesson_completed_';
const QUIZ_STORAGE_PREFIX = 'lms_quiz_submission_';
const COURSE_STARTED_PREFIX = 'lms_course_started_';

// Helper functions
function getLessonProgress(lessonId: string): number {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(`${PROGRESS_STORAGE_PREFIX}${lessonId}`);
  return stored ? parseFloat(stored) : 0;
}

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

export const MyLearningDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const { data: allCourses } = useLmsCourseDetails();
  const { data: dbCoursesProgress, isLoading: progressLoading } = useUserCoursesProgress();
  const { data: dbProgressStats } = useUserProgressStats();

  const quizSubmissions = useMemo(() => getQuizSubmissions(), []);

  // Merge DB progress with course details
  const startedCourses = useMemo(() => {
    if (!allCourses || !dbCoursesProgress) return [];

    return dbCoursesProgress.map(progress => {
      const details = allCourses.find(c => c.id === progress.course_id || c.slug === progress.course_slug);
      return {
        ...details,
        progress_percentage: progress.progress_percentage,
        lessons_completed: progress.lessons_completed,
        total_lessons: progress.total_lessons,
        status: progress.status,
        slug: progress.course_slug,
        id: progress.course_id,
        title: details?.title || progress.course_slug,
        summary: details?.summary || '',
      };
    });
  }, [allCourses, dbCoursesProgress]);

  // Statistics
  const stats = useMemo(() => {
    if (dbProgressStats) {
      return {
        coursesCompleted: dbProgressStats.coursesCompleted,
        totalCourses: dbProgressStats.coursesStarted,
        completedLessons: dbProgressStats.lessonsCompleted,
        totalLessons: startedCourses.reduce((sum, c) => sum + (c.total_lessons || 0), 0),
        totalQuizzes: quizSubmissions.length,
        averageQuizScore: dbProgressStats.averageProgress, // Using average progress as a proxy or just keep local quiz stats
        coursesInProgress: startedCourses.filter(c => c.status === 'in_progress').length,
      };
    }

    // Fallback to local stats calculation if DB stats not available
    const totalLessons = startedCourses.reduce((sum, course) => {
      return sum + (course.total_lessons || getAllLessonIds(course as any).length);
    }, 0);

    const completedLessons = startedCourses.reduce((sum, course) => {
      return sum + (course.lessons_completed || 0);
    }, 0);

    return {
      totalLessons,
      completedLessons,
      totalQuizzes: quizSubmissions.length,
      averageQuizScore: quizSubmissions.length > 0
        ? Math.round(
          quizSubmissions.reduce((sum, q) => sum + (q.score / q.totalQuestions) * 100, 0) /
          quizSubmissions.length
        )
        : 0,
      coursesInProgress: startedCourses.filter(c => c.status === 'in_progress').length,
      coursesCompleted: startedCourses.filter(c => c.status === 'completed').length,
      totalCourses: startedCourses.length,
    };
  }, [startedCourses, quizSubmissions, dbProgressStats]);

  // Get recent activity (last 5 quiz submissions)
  const recentActivity = useMemo(() => {
    return quizSubmissions.slice(0, 5);
  }, [quizSubmissions]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <main className="flex-grow">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
                <p className="text-gray-600">Track your progress and achievements</p>
              </div>
              <Link
                to="/lms"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Courses Completed</h3>
                <Award className="text-blue-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.coursesCompleted}</p>
              <p className="text-sm text-gray-500 mt-1">out of {stats.totalCourses} started</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Lessons Completed</h3>
                <CheckCircle2 className="text-green-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.completedLessons}</p>
              <p className="text-sm text-gray-500 mt-1">out of {stats.totalLessons} total</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Quizzes Completed</h3>
                <FileText className="text-purple-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalQuizzes}</p>
              <p className="text-sm text-gray-500 mt-1">quizzes taken</p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Average Quiz Score</h3>
                <TrendingUp className="text-orange-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.averageQuizScore}%</p>
              <p className="text-sm text-gray-500 mt-1">across all quizzes</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Courses Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
                  <span className="text-sm text-gray-500">
                    {stats.coursesInProgress} in progress
                  </span>
                </div>

                {startedCourses.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 mb-4">You haven't started any courses yet.</p>
                    <Link
                      to="/lms"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {startedCourses.map((course) => {
                      const progress = course.progress_percentage || 0;
                      const completedCount = course.lessons_completed || 0;
                      const totalLessons = course.total_lessons || 0;

                      return (
                        <div
                          key={course.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigate(`/lms/${course.slug}`)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {course.title}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {course.summary}
                              </p>
                            </div>
                            <ChevronRight className="text-gray-400 ml-4 flex-shrink-0" size={20} />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {completedCount} of {totalLessons} lessons completed
                              </span>
                              <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                            {course.duration && (
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>{course.duration}</span>
                              </div>
                            )}
                            {course.levelCode && (
                              <div className="flex items-center gap-1">
                                <Target size={14} />
                                <span>{course.levelLabel}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Recent Activity & Quick Stats */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent quiz activity
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => {
                      const scorePercentage = Math.round(
                        (activity.score / activity.totalQuestions) * 100
                      );
                      const passed = activity.passed !== undefined ? activity.passed : scorePercentage >= 80;
                      return (
                        <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${passed ? 'bg-green-50' : 'bg-red-50'
                          }`}>
                          <div className="flex-shrink-0 mt-0.5">
                            {passed ? (
                              <CheckCircle2 className="text-green-600" size={18} />
                            ) : (
                              <X className="text-red-600" size={18} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${passed ? 'text-green-900' : 'text-red-900'
                              }`}>
                              Quiz {passed ? 'Passed' : 'Failed'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-600">
                                {new Date(activity.submittedAt).toLocaleDateString()}
                              </span>
                              <span className={`text-xs font-medium ${passed ? 'text-green-700' : 'text-red-700'
                                }`}>
                                {scorePercentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Learning Progress */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="font-medium text-gray-900">
                        {stats.totalLessons > 0
                          ? Math.round((stats.completedLessons / stats.totalLessons) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full transition-all"
                        style={{
                          width: `${stats.totalLessons > 0
                              ? (stats.completedLessons / stats.totalLessons) * 100
                              : 0
                            }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Courses in Progress</span>
                      <span className="font-medium text-gray-900">{stats.coursesInProgress}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Courses Completed</span>
                      <span className="font-medium text-gray-900">{stats.coursesCompleted}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <Link
                    to="/lms"
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <BookOpen size={18} />
                    <span>Browse All Courses</span>
                  </Link>
                  {startedCourses.length > 0 && (
                    <button
                      onClick={() => {
                        const firstCourse = startedCourses[0];
                        const lessonIds = getAllLessonIds(firstCourse);
                        const firstIncompleteLesson = lessonIds.find(
                          id => !isLessonCompleted(id)
                        );
                        if (firstIncompleteLesson) {
                          navigate(`/lms/${firstCourse.slug}/lesson/${firstIncompleteLesson}`);
                        } else {
                          navigate(`/lms/${firstCourse.slug}`);
                        }
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Play size={18} />
                      <span>Continue Learning</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default MyLearningDashboard;

