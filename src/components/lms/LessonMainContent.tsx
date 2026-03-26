import React from 'react';
import { CheckCircle2, HelpCircle, FileText, CheckCircle, MessageSquare, Edit3, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import MarkdownRenderer from '../guides/MarkdownRenderer';
import { CourseReviewForm } from './CourseReviewForm';
import { QuizWizardOverlay } from './QuizWizardOverlay';
import { isCourseCompleted } from '../../pages/lms/utils/lessonHelpers';
import { isLessonCompleted, QUIZ_PASSING_SCORE } from '../../pages/lms/utils/lessonStorage';
import type { LessonItem } from '../../pages/lms/hooks/useLessonCurriculum';
import type { LmsQuizRow } from '../../types/lmsSupabase';

interface LessonMainContentProps {
  course: any;
  currentLesson: LessonItem;
  courseSlug: string | undefined;
  allLessons: LessonItem[];
  nextLesson: any;
  quiz: LmsQuizRow | null;
  quizPassed: boolean;
  quizSubmitted: boolean;
  quizScore: { score: number; total: number } | null;
  courseQuiz: LmsQuizRow | null;
  isFinalAssessmentLesson: boolean;
  showQuizOverlay: boolean;
  currentQuestionIndex: number;
  selectedOption: number | null;
  isAnswerChecked: boolean;
  isAnswerCorrect: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  videoProgress: number;
  isVideoCompleted: boolean;
  existingUserReview: any;
  hasExistingReview: boolean;
  showReviewForm: boolean;
  reviewSubmitted: boolean;
  markLessonCompletedMutation: any;
  createReviewMutation: any;
  updateReviewMutation: any;
  navigate: (path: string) => void;
  onOptionSelect: (i: number) => void;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onRetryWizard: () => void;
  onCloseQuiz: () => void;
  onVideoTimeUpdate: () => void;
  onVideoEnded: () => void;
  onVideoPlay: () => void;
  onVideoPause: () => void;
  onMarkContentCompleted: () => void;
  onOpenQuizOverlay: () => void;
  onShowReviewForm: (v: boolean) => void;
  onReviewSubmitted: (v: boolean) => void;
}

export const LessonMainContent: React.FC<LessonMainContentProps> = (props) => {
  const {
    course, currentLesson, courseSlug, allLessons, nextLesson,
    quiz, quizPassed, quizSubmitted, quizScore, courseQuiz, isFinalAssessmentLesson,
    showQuizOverlay, currentQuestionIndex, selectedOption, isAnswerChecked, isAnswerCorrect,
    videoRef, videoProgress, isVideoCompleted, existingUserReview, hasExistingReview,
    showReviewForm, reviewSubmitted, markLessonCompletedMutation, createReviewMutation,
    updateReviewMutation, navigate, onOptionSelect, onCheckAnswer, onNextQuestion,
    onRetryWizard, onCloseQuiz, onVideoTimeUpdate, onVideoEnded, onVideoPlay, onVideoPause,
    onMarkContentCompleted, onOpenQuizOverlay, onShowReviewForm, onReviewSubmitted,
  } = props;

  const videoUrl = currentLesson.videoUrl || null;
  const lessonContent = currentLesson.content || null;
  const hasVideo = !!videoUrl;
  const hasContent = !!lessonContent;
  const completedCount = allLessons.filter(l => isLessonCompleted(l.id)).length;

  return (
    <div className={`${hasVideo ? 'bg-black' : 'bg-white'} flex-1 flex flex-col`}>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          <div className={`mb-4 ${hasVideo ? 'text-white' : 'text-gray-900'}`}>
            <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
            <h2 className={`text-xl ${hasVideo ? 'text-gray-300' : 'text-gray-700'}`}>{currentLesson.title}</h2>
          </div>
          <MainContentArea
            showQuizOverlay={showQuizOverlay} quiz={quiz} quizSubmitted={quizSubmitted}
            quizPassed={quizPassed} quizScore={quizScore} courseQuiz={courseQuiz}
            isFinalAssessmentLesson={isFinalAssessmentLesson}
            currentQuestionIndex={currentQuestionIndex} selectedOption={selectedOption}
            isAnswerChecked={isAnswerChecked} isAnswerCorrect={isAnswerCorrect}
            nextLesson={nextLesson} courseSlug={courseSlug}
            course={course} hasExistingReview={hasExistingReview}
            existingUserReview={existingUserReview} showReviewForm={showReviewForm}
            reviewSubmitted={reviewSubmitted} createReviewMutation={createReviewMutation}
            updateReviewMutation={updateReviewMutation}
            hasVideo={hasVideo} videoUrl={videoUrl} videoRef={videoRef}
            isVideoCompleted={isVideoCompleted} videoProgress={videoProgress}
            hasContent={hasContent} lessonContent={lessonContent}
            markLessonCompletedMutation={markLessonCompletedMutation}
            navigate={navigate} onOptionSelect={onOptionSelect} onCheckAnswer={onCheckAnswer}
            onNextQuestion={onNextQuestion} onRetryWizard={onRetryWizard} onCloseQuiz={onCloseQuiz}
            onVideoTimeUpdate={onVideoTimeUpdate} onVideoEnded={onVideoEnded}
            onVideoPlay={onVideoPlay} onVideoPause={onVideoPause}
            onMarkContentCompleted={onMarkContentCompleted} onOpenQuizOverlay={onOpenQuizOverlay}
            onShowReviewForm={onShowReviewForm} onReviewSubmitted={onReviewSubmitted}
          />
          <div className={`mt-4 ${hasVideo ? '' : 'bg-white p-4 rounded-lg border border-gray-200'}`}>
            <div className={`flex items-center justify-between text-sm mb-2 ${hasVideo ? 'text-gray-400' : 'text-gray-600'}`}>
              <span>Course Progress</span>
              <span>{completedCount} of {allLessons.length} lessons completed</span>
            </div>
            <div className={`w-full rounded-full h-2 ${hasVideo ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${(completedCount / allLessons.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MainContentAreaProps {
  showQuizOverlay: boolean; quiz: LmsQuizRow | null; quizSubmitted: boolean;
  quizPassed: boolean; quizScore: { score: number; total: number } | null;
  courseQuiz: LmsQuizRow | null; isFinalAssessmentLesson: boolean;
  currentQuestionIndex: number; selectedOption: number | null;
  isAnswerChecked: boolean; isAnswerCorrect: boolean;
  nextLesson: any; courseSlug: string | undefined;
  course: any; hasExistingReview: boolean; existingUserReview: any;
  showReviewForm: boolean; reviewSubmitted: boolean;
  createReviewMutation: any; updateReviewMutation: any;
  hasVideo: boolean; videoUrl: string | null; videoRef: React.RefObject<HTMLVideoElement>;
  isVideoCompleted: boolean; videoProgress: number;
  hasContent: boolean; lessonContent: string | null;
  markLessonCompletedMutation: any;
  navigate: (path: string) => void;
  onOptionSelect: (i: number) => void; onCheckAnswer: () => void;
  onNextQuestion: () => void; onRetryWizard: () => void; onCloseQuiz: () => void;
  onVideoTimeUpdate: () => void; onVideoEnded: () => void;
  onVideoPlay: () => void; onVideoPause: () => void;
  onMarkContentCompleted: () => void; onOpenQuizOverlay: () => void;
  onShowReviewForm: (v: boolean) => void; onReviewSubmitted: (v: boolean) => void;
}

const EmptyLessonView: React.FC<{ hasVideo: boolean }> = ({ hasVideo }) => (
  <div className={`w-full rounded-lg overflow-hidden ${hasVideo ? 'bg-gray-900 aspect-video' : 'bg-gray-50 border border-gray-200 p-8'}`}>
    <div className={`text-center ${hasVideo ? 'text-white' : 'text-gray-600'}`}>
      <FileText size={64} className={`mx-auto mb-4 ${hasVideo ? 'opacity-50' : 'text-gray-400'}`} />
      <p className={hasVideo ? 'text-gray-400' : 'text-gray-600'}>No content available for this lesson</p>
    </div>
  </div>
);

const MainContentArea: React.FC<MainContentAreaProps> = (props) => {
  const {
    showQuizOverlay, quiz, quizSubmitted, quizPassed, quizScore, courseQuiz, isFinalAssessmentLesson,
    currentQuestionIndex, selectedOption, isAnswerChecked, isAnswerCorrect,
    nextLesson, courseSlug, course, hasExistingReview, existingUserReview,
    showReviewForm, reviewSubmitted, createReviewMutation, updateReviewMutation,
    hasVideo, videoUrl, videoRef, isVideoCompleted, videoProgress,
    hasContent, lessonContent, markLessonCompletedMutation,
    navigate, onOptionSelect, onCheckAnswer, onNextQuestion, onRetryWizard, onCloseQuiz,
    onVideoTimeUpdate, onVideoEnded, onVideoPlay, onVideoPause,
    onMarkContentCompleted, onOpenQuizOverlay, onShowReviewForm, onReviewSubmitted,
  } = props;

  if (showQuizOverlay && quiz) {
    return (
      <QuizWizardOverlay
        quiz={quiz} quizSubmitted={quizSubmitted} quizPassed={quizPassed} quizScore={quizScore}
        currentQuestionIndex={currentQuestionIndex} selectedOption={selectedOption}
        isAnswerChecked={isAnswerChecked} isAnswerCorrect={isAnswerCorrect}
        nextLesson={nextLesson} courseSlug={courseSlug}
        onOptionSelect={onOptionSelect} onCheckAnswer={onCheckAnswer}
        onNextQuestion={onNextQuestion} onRetryWizard={onRetryWizard}
        onClose={onCloseQuiz} navigate={navigate}
      />
    );
  }
  if (isCourseCompleted(nextLesson, isVideoCompleted, quiz, quizPassed, courseQuiz, isFinalAssessmentLesson)) {
    return (
      <CourseCompletedView
        course={course} courseSlug={courseSlug} hasExistingReview={hasExistingReview}
        existingUserReview={existingUserReview} showReviewForm={showReviewForm}
        reviewSubmitted={reviewSubmitted} createReviewMutation={createReviewMutation}
        updateReviewMutation={updateReviewMutation} navigate={navigate}
        onShowReviewForm={onShowReviewForm} onReviewSubmitted={onReviewSubmitted}
      />
    );
  }
  if (hasVideo) {
    return (
      <VideoPlayerView
        videoUrl={videoUrl!} videoRef={videoRef} isVideoCompleted={isVideoCompleted}
        quiz={quiz} quizPassed={quizPassed} videoProgress={videoProgress}
        onTimeUpdate={onVideoTimeUpdate} onEnded={onVideoEnded}
        onPlay={onVideoPlay} onPause={onVideoPause} onOpenQuiz={onOpenQuizOverlay}
      />
    );
  }
  if (hasContent) {
    return (
      <ContentLessonView
        lessonContent={lessonContent!} isVideoCompleted={isVideoCompleted}
        quiz={quiz} quizPassed={quizPassed} markLessonCompletedMutation={markLessonCompletedMutation}
        onMarkCompleted={onMarkContentCompleted} onOpenQuiz={onOpenQuizOverlay}
      />
    );
  }
  if (isFinalAssessmentLesson) {
    return (
      <FinalAssessmentView
        quiz={quiz} quizSubmitted={quizSubmitted} quizPassed={quizPassed} quizScore={quizScore}
        onStart={onOpenQuizOverlay} onRetake={() => { onRetryWizard(); onOpenQuizOverlay(); }}
      />
    );
  }
  return <EmptyLessonView hasVideo={hasVideo} />;
};

const VideoPlayerView: React.FC<{
  videoUrl: string; videoRef: React.RefObject<HTMLVideoElement>; isVideoCompleted: boolean;
  quiz: any; quizPassed: boolean; videoProgress: number;
  onTimeUpdate: () => void; onEnded: () => void; onPlay: () => void; onPause: () => void; onOpenQuiz: () => void;
}> = ({ videoUrl, videoRef, isVideoCompleted, quiz, quizPassed, videoProgress, onTimeUpdate, onEnded, onPlay, onPause, onOpenQuiz }) => (
  <div className="flex flex-col gap-4">
    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
      <video ref={videoRef} src={videoUrl} className="w-full h-full" controls
        onTimeUpdate={onTimeUpdate} onEnded={onEnded} onPlay={onPlay} onPause={onPause} />
      {isVideoCompleted && (
        <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
          <CheckCircle2 size={24} className="text-white" />
        </div>
      )}
    </div>
    {quiz && !quizPassed && videoProgress >= 90 && (
      <div className="flex justify-start">
        <button onClick={onOpenQuiz} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          <HelpCircle size={20} /><span>Take Quiz to Complete Lesson</span>
        </button>
      </div>
    )}
  </div>
);

const ContentLessonView: React.FC<{
  lessonContent: string; isVideoCompleted: boolean; quiz: any; quizPassed: boolean;
  markLessonCompletedMutation: any; onMarkCompleted: () => void; onOpenQuiz: () => void;
}> = ({ lessonContent, isVideoCompleted, quiz, quizPassed, markLessonCompletedMutation, onMarkCompleted, onOpenQuiz }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 max-h-[70vh] overflow-y-auto">
    <MarkdownRenderer body={lessonContent} />
    {!isVideoCompleted && !quiz && (
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button onClick={onMarkCompleted} disabled={markLessonCompletedMutation.isPending}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
          <CheckCircle2 size={20} />
          <span>{markLessonCompletedMutation.isPending ? 'Saving...' : 'Mark as Completed'}</span>
        </button>
      </div>
    )}
    {!isVideoCompleted && quiz && !quizPassed && (
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button onClick={onOpenQuiz} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
          <HelpCircle size={20} /><span>Take Quiz to Complete Lesson</span>
        </button>
      </div>
    )}
    {isVideoCompleted && (
      <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-2 text-green-600">
        <CheckCircle2 size={20} /><span className="font-medium">Lesson Completed</span>
      </div>
    )}
  </div>
);

const FinalAssessmentView: React.FC<{
  quiz: any; quizSubmitted: boolean; quizPassed: boolean;
  quizScore: { score: number; total: number } | null;
  onStart: () => void; onRetake: () => void;
}> = ({ quiz, quizSubmitted, quizPassed, quizScore, onStart, onRetake }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 text-blue-600 rounded-full mb-6">
      <CheckCircle2 size={40} />
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Final Assessment</h2>
    <p className="text-gray-600 mb-8 max-w-lg mx-auto">
      You have reached the final assessment for this course. Complete this assessment to transform your knowledge into a verified achievement.
    </p>
    {quiz ? (
      <div className="space-y-4">
        <div className="flex justify-center gap-8 text-sm text-gray-500 mb-8">
          <div className="flex items-center gap-2"><HelpCircle size={18} /><span>{quiz.questions?.length || 0} Questions</span></div>
          <div className="flex items-center gap-2"><CheckCircle2 size={18} /><span>80% Passing Score</span></div>
        </div>
        {quizSubmitted && quizPassed ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto mb-6">
            <p className="text-green-800 font-medium flex items-center justify-center gap-2"><CheckCircle2 size={20} />Assessment Passed</p>
            <p className="text-green-600 text-sm mt-1">Score: {quizScore?.score}/{quizScore?.total}</p>
          </div>
        ) : quizSubmitted ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto mb-6">
            <p className="text-red-800 font-medium flex items-center justify-center gap-2"><X size={20} />Assessment Not Passed</p>
            <p className="text-red-600 text-sm mt-1">Score: {quizScore?.score}/{quizScore?.total}</p>
            <button onClick={onRetake} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Retake Assessment</button>
          </div>
        ) : (
          <button onClick={onStart} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Start Assessment
          </button>
        )}
      </div>
    ) : (
      <div className="text-gray-500">Loading assessment...</div>
    )}
  </div>
);

const CourseCompletedView: React.FC<{
  course: any; courseSlug: string | undefined; hasExistingReview: boolean;
  existingUserReview: any; showReviewForm: boolean; reviewSubmitted: boolean;
  createReviewMutation: any; updateReviewMutation: any;
  navigate: (path: string) => void;
  onShowReviewForm: (v: boolean) => void; onReviewSubmitted: (v: boolean) => void;
}> = ({ course, courseSlug, hasExistingReview, existingUserReview, showReviewForm, reviewSubmitted, createReviewMutation, updateReviewMutation, navigate, onShowReviewForm, onReviewSubmitted }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-[400px] flex flex-col justify-center">
    {!showReviewForm && !reviewSubmitted ? (
      <div className="text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">🎉 Congratulations!</h2>
        <p className="text-lg text-gray-700 mb-2">You've completed the course!</p>
        <p className="text-gray-600 mb-8">
          {hasExistingReview ? "You've already left a review for this course. You can update it anytime!" : 'Help us improve by sharing your learning experience. Your feedback is valuable!'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => onShowReviewForm(true)} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#030F35] to-[#0A2463] text-white font-semibold rounded-xl hover:shadow-lg transition-all">
            {hasExistingReview ? <><Edit3 size={20} />Edit Review</> : <><MessageSquare size={20} />Leave a Review</>}
          </button>
          <Link to={`/lms/${courseSlug}`} className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors">Back to Course</Link>
        </div>
      </div>
    ) : showReviewForm ? (
      <div className="max-w-2xl mx-auto w-full">
        <CourseReviewForm
          courseId={course?.id || ''} courseSlug={courseSlug || ''} courseTitle={course?.title || ''}
          mode={hasExistingReview ? 'edit' : 'create'} existingReview={existingUserReview}
          isSubmitting={hasExistingReview ? updateReviewMutation.isPending : createReviewMutation.isPending}
          onSubmit={async (input: any) => {
            if (hasExistingReview && existingUserReview) {
              await updateReviewMutation.mutateAsync({ reviewId: existingUserReview.id, input });
            } else {
              await createReviewMutation.mutateAsync(input);
            }
            onReviewSubmitted(true);
            onShowReviewForm(false);
          }}
          onSkip={() => { onShowReviewForm(false); navigate(`/lms/${courseSlug}`); }}
        />
      </div>
    ) : (
      <div className="text-center max-w-lg mx-auto">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{hasExistingReview ? 'Review Updated!' : 'Thank You for Your Feedback!'}</h2>
        <p className="text-gray-600 mb-8">{hasExistingReview ? 'Your review has been successfully updated.' : 'Your review helps us improve courses for future learners.'}</p>
        <Link to={`/lms/${courseSlug}`} className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#030F35] to-[#0A2463] text-white font-semibold rounded-xl hover:shadow-lg transition-all">
          Back to Course
        </Link>
      </div>
    )}
  </div>
);
