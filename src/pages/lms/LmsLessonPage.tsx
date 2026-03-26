import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FileText, Menu, X } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useLmsCourse } from '../../hooks/useLmsCourses';
import { useMarkLessonStarted, useMarkLessonCompleted, useUpdateLessonVideoProgress, useLessonProgress, useSaveQuizSubmission } from '../../hooks/useCourseProgress';
import { useCreateCourseReview, useUpdateCourseReview, useUserCourseReview } from '../../hooks/useCourseReviews';
import { useAuth } from '../../components/Header';
import { LessonSidebar } from '../../components/lms/LessonSidebar';
import { LessonMainContent } from '../../components/lms/LessonMainContent';
import { LessonBottomNav } from '../../components/lms/LessonBottomNav';
import { useLessonCurriculum } from './hooks/useLessonCurriculum';
import { useLessonQuiz } from './hooks/useLessonQuiz';
import { useVideoProgress } from './hooks/useVideoProgress';
import { arePreviousLessonsCompleted } from './utils/lessonStorage';

export const LmsLessonPage: React.FC = () => {
  const { courseSlug, lessonId } = useParams<{ courseSlug: string; lessonId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());



  const [activeTab, setActiveTab] = useState<TabType>('resources');
  const [quiz, setQuiz] = useState<LmsQuizRow | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [courseQuiz, setCourseQuiz] = useState<LmsQuizRow | null>(null);

  // Quiz Wizard State
  const [showQuizOverlay, setShowQuizOverlay] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const { data: course, isLoading: courseLoading } = useLmsCourse(courseSlug || '');
  const { user } = useAuth();
  const { data: existingUserReview } = useUserCourseReview(course?.id || '');

  const markLessonStartedMutation = useMarkLessonStarted();
  const markLessonCompletedMutation = useMarkLessonCompleted();
  const updateVideoProgressMutation = useUpdateLessonVideoProgress();
  const saveQuizSubmissionMutation = useSaveQuizSubmission();
  const createReviewMutation = useCreateCourseReview();
  const updateReviewMutation = useUpdateCourseReview();
  const { data: dbLessonProgress } = useLessonProgress(lessonId || '');

  const curriculum = useLessonCurriculum(course, lessonId, courseSlug, setExpandedModules);

  const quizState = useLessonQuiz({
    lessonId, courseId: course?.id, courseSlug,
    allLessons: curriculum.allLessons, course, user,
    markLessonCompletedMutation, saveQuizSubmissionMutation,
  });

  const videoState = useVideoProgress({
    currentLesson: curriculum.currentLesson, course, courseSlug, user,
    quiz: quizState.quiz, quizPassed: quizState.quizPassed,
    markLessonCompletedMutation, updateVideoProgressMutation,
    dbLessonProgress, lessonId,
    onVideoEnded: quizState.setVideoEnded,
  });

  React.useEffect(() => {
    if (user && lessonId && course?.id) {
      markLessonStartedMutation.mutate({ lessonId, courseId: course.id, courseSlug: courseSlug || '' });
    }
  }, [user?.id, lessonId, course?.id]);

  // Fetch quiz when lesson changes
  useEffect(() => {
    if (lessonId) {
      setQuizLoading(true);
      setShowQuizOverlay(false);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(null);
      setQuizPassed(isQuizPassed(lessonId));
      setVideoEnded(false);

      const isFinalAssessment = allLessons.find(l => l.id === lessonId)?.type === 'final-assessment';

      let promise;
      if (isFinalAssessment && course?.id) {
        promise = fetchQuizByCourseId(course.id);
      } else {
        promise = fetchQuizByLessonId(lessonId);
      }

      promise
        .then((data) => {
          console.log('[Quiz] fetched for lessonId:', lessonId, '→', data);
          setQuiz(data);
        })
        .catch((error) => {
          console.error('[Quiz] fetch error for lessonId:', lessonId, error);
          setQuiz(null);
        })
        .finally(() => setQuizLoading(false));
    }
  }, [lessonId, course?.id, allLessons]);

  // Handle quiz submission
  const handleQuizSubmit = () => {
    if (!quiz || !lessonId || !courseSlug) return;

    const questions = quiz.questions || [];
    let correctAnswers = 0;

    questions.forEach((question: any, index: number) => {
      const userAnswer = quizAnswers[index];
      const correctAnswerIndex = question.correct_answer;
      if (userAnswer === correctAnswerIndex) {
        correctAnswers++;
      }
    });

    const score = {
      score: correctAnswers,
      total: questions.length,
    };

    const scorePercentage = Math.round((correctAnswers / questions.length) * 100);
    const passed = scorePercentage >= QUIZ_PASSING_SCORE;

    setQuizScore(score);
    setQuizSubmitted(true);
    setQuizPassed(passed);

    // Store quiz submission in localStorage
    if (typeof window !== 'undefined') {
      const submissionKey = `${QUIZ_STORAGE_PREFIX}${quiz.id}_${lessonId}`;
      const submissionData = {
        quizId: quiz.id,
        lessonId: lessonId,
        courseId: course?.id || '',
        score: correctAnswers,
        totalQuestions: questions.length,
        submittedAt: new Date().toISOString(),
        passed: passed,
      };
      localStorage.setItem(submissionKey, JSON.stringify(submissionData));

      // Sync to Supabase
      if (user && course?.id && quiz) {
        saveQuizSubmissionMutation.mutate({
          quiz_id: quiz.id,
          lesson_id: lessonId,
          course_id: course.id,
          score_achieved: correctAnswers,
          total_questions: questions.length,
          score_percentage: scorePercentage,
          passed: passed,
          answers: quizAnswers,
        });
      }

      // Store quiz passed status
      if (passed) {
        markQuizPassed(lessonId);
        markLessonCompleted(lessonId);

        // Sync to Supabase
        if (user && course?.id) {
          markLessonCompletedMutation.mutate({
            lessonId,
            courseId: course.id,
            courseSlug: courseSlug || '',
            quizPassed: true,
            quizScore: scorePercentage,
          });
        }
      }
    }
  };

  // Handle quiz retake
  const handleQuizRetake = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setQuizPassed(false);
  };

  // Video event handlers
  const handleVideoTimeUpdate = () => {
    if (!videoRef.current || !currentLesson) return;
    const video = videoRef.current;
    const progress = (video.currentTime / video.duration) * 100;
    setVideoProgress(progress);
    saveLessonProgress(currentLesson.id, progress);

    // Mark as completed if watched >= 90% AND there is no quiz
    // If there is a quiz, completion depends on passing it.
    if (progress >= 90 && !isVideoCompleted && !quiz) {
      setIsVideoCompleted(true);
      markLessonCompleted(currentLesson.id);

      // Sync completion to Supabase
      if (user && course?.id) {
        markLessonCompletedMutation.mutate({
          lessonId: currentLesson.id,
          courseId: course.id,
          courseSlug: courseSlug || '',
        });
      }
    }

    // Periodically sync progress to Supabase (every 10 seconds or 5% progress)
    const now = Date.now();
    const timeDelta = now - lastProgressSyncRef.current;
    const progressDelta = Math.abs(progress - lastProgressValueRef.current);

    if (user && course?.id && (timeDelta > 10000 || progressDelta >= 5)) {
      updateVideoProgressMutation.mutate({
        lessonId: currentLesson.id,
        courseId: course.id,
        courseSlug: courseSlug || '',
        progressPercentage: progress,
        hasQuiz: !!quiz,
        quizPassed: !!quizPassed,
      });
      lastProgressSyncRef.current = now;
      lastProgressValueRef.current = progress;
    }
  };

  const handleVideoEnded = () => {
    if (currentLesson) {
      // If there is a quiz, do NOT mark complete just by finishing video.
      if (!quiz) {
        setIsVideoCompleted(true);
        markLessonCompleted(currentLesson.id);
      }
      setVideoProgress(100);
      saveLessonProgress(currentLesson.id, 100);

      // Mark video as ended; the useEffect below will show the quiz once quiz data is ready
      setVideoEnded(true);
    }
  };

  // Show quiz overlay once both video has ended AND quiz data is loaded
  useEffect(() => {
    if (videoEnded && quiz && !quizPassed) {
      setShowQuizOverlay(true);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    }
  }, [videoEnded, quiz, quizPassed]);

  // Quiz Wizard Handlers
  const handleOptionSelect = (optIndex: number) => {
    if (isAnswerChecked || quizSubmitted) return;
    setSelectedOption(optIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !quiz) return;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const correct = currentQuestion.correct_answer === selectedOption;

    setIsAnswerCorrect(correct);
    setIsAnswerChecked(true);

    // Save answer
    setQuizAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: selectedOption
    }));
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      // Reset state, but check if we already have an answer for the next one (if reviewing?)
      // For now, assuming linear forward progression
      const nextAnswer = quizAnswers[currentQuestionIndex + 1];
      setSelectedOption(nextAnswer !== undefined ? nextAnswer : null);
      setIsAnswerChecked(nextAnswer !== undefined);
    } else {
      // Finished
      handleQuizSubmit();
    }
  };

  const handleRetryWizard = () => {
    handleQuizRetake();
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  // Check if quiz is accessible (video/content must be completed)
  const isQuizAccessible = isVideoCompleted && !isLocked;

  // Check if quiz exists and is passed for current lesson
  const currentLessonQuizPassed = useMemo(() => {
    if (!quiz || !lessonId) return true; // No quiz means can proceed
    return quizPassed;
  }, [quiz, lessonId, quizPassed]);

  // Check if next lesson can be accessed (quiz must be passed if it exists)
  const canAccessNextLesson = useMemo(() => {
    if (!curriculum.nextLesson) return false;
    if (quizState.quiz && !quizState.quizPassed) return false;
    if (curriculum.nextLesson.isLocked) return arePreviousLessonsCompleted(curriculum.allLessons, curriculum.nextLesson.id);
    return true;
  }, [curriculum.nextLesson, quizState.quiz, quizState.quizPassed, curriculum.allLessons]);

  if (courseLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading lesson...</p>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  if (!course || !curriculum.currentLesson) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Lesson Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find the lesson you're looking for.</p>
            <button onClick={() => navigate(courseSlug ? `/lms/${courseSlug}` : '/lms')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Back to Course
            </button>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <main className="flex-grow flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="w-full flex items-center justify-between">
            <Link to={`/lms/${courseSlug}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group">
              <div className="p-1 rounded-full group-hover:bg-gray-100 transition-colors">
                <X size={20} className="rotate-180" />
              </div>
              <span className="font-medium">Back to Course</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/lms/my-learning" className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                <FileText size={18} /><span>My Learning</span>
              </Link>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-gray-600 hover:text-gray-900">
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow flex">
          <LessonSidebar
            course={course} lessonId={lessonId} courseSlug={courseSlug}
            allLessons={curriculum.allLessons} expandedModules={expandedModules}
            setExpandedModules={setExpandedModules} navigate={navigate}
            setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen}
          />
          <div className="flex-1 flex flex-col">
            <LessonMainContent
              course={course} currentLesson={curriculum.currentLesson} courseSlug={courseSlug}
              allLessons={curriculum.allLessons} nextLesson={curriculum.nextLesson}
              quiz={quizState.quiz} quizPassed={quizState.quizPassed}
              quizSubmitted={quizState.quizSubmitted} quizScore={quizState.quizScore}
              courseQuiz={quizState.courseQuiz} isFinalAssessmentLesson={curriculum.isFinalAssessmentLesson}
              showQuizOverlay={quizState.showQuizOverlay} currentQuestionIndex={quizState.currentQuestionIndex}
              selectedOption={quizState.selectedOption} isAnswerChecked={quizState.isAnswerChecked}
              isAnswerCorrect={quizState.isAnswerCorrect} videoRef={videoState.videoRef}
              videoProgress={videoState.videoProgress} isVideoCompleted={videoState.isVideoCompleted}
              existingUserReview={existingUserReview} hasExistingReview={!!existingUserReview}
              showReviewForm={showReviewForm} reviewSubmitted={reviewSubmitted}
              markLessonCompletedMutation={markLessonCompletedMutation}
              createReviewMutation={createReviewMutation} updateReviewMutation={updateReviewMutation}
              navigate={navigate}
              onOptionSelect={quizState.handleOptionSelect} onCheckAnswer={quizState.handleCheckAnswer}
              onNextQuestion={quizState.handleNextQuestion} onRetryWizard={quizState.handleRetryWizard}
              onCloseQuiz={() => quizState.setShowQuizOverlay(false)}
              onVideoTimeUpdate={videoState.handleVideoTimeUpdate}
              onVideoEnded={videoState.handleVideoEnded} onVideoPlay={videoState.handleVideoPlay}
              onVideoPause={videoState.handleVideoPause}
              onMarkContentCompleted={videoState.markContentCompleted}
              onOpenQuizOverlay={() => quizState.setShowQuizOverlay(true)}
              onShowReviewForm={setShowReviewForm} onReviewSubmitted={setReviewSubmitted}
            />

            {/* Resources Tab */}
            <div className="bg-white border-t border-gray-200">
              <div className="max-w-5xl mx-auto">
                <div className="flex border-b border-gray-200">
                  <button className="px-6 py-4 font-medium text-sm border-b-2 border-blue-600 text-blue-600">
                    <div className="flex items-center gap-2"><FileText size={18} /><span>Resources</span></div>
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Resources</h3>
                  {curriculum.currentLesson.description && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{curriculum.currentLesson.description}</p>
                    </div>
                  )}
                  {course.references && course.references.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">References</h4>
                      <ul className="space-y-2">
                        {course.references.map((ref: any, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <FileText size={16} className="text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-gray-900 font-medium">{ref.title}</p>
                              {ref.description && <p className="text-sm text-gray-600">{ref.description}</p>}
                              {ref.link && <a href={ref.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">View Resource</a>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <LessonBottomNav
              previousLesson={curriculum.previousLesson} nextLesson={curriculum.nextLesson}
              courseSlug={courseSlug} navigate={navigate} canAccessNextLesson={canAccessNextLesson}
              quiz={quizState.quiz} quizPassed={quizState.quizPassed} courseQuiz={quizState.courseQuiz}
              currentLessonIndex={curriculum.currentLessonIndex} allLessonsCount={curriculum.allLessons.length}
            />
          </div>
        </div>
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default LmsLessonPage;
