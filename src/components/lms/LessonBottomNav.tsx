import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { QUIZ_PASSING_SCORE } from '../../pages/lms/utils/lessonStorage';

interface LessonBottomNavProps {
  previousLesson: any;
  nextLesson: any;
  courseSlug: string | undefined;
  navigate: (path: string) => void;
  canAccessNextLesson: boolean;
  quiz: any;
  quizPassed: boolean;
  courseQuiz: any;
  currentLessonIndex: number;
  allLessonsCount: number;
}

export const LessonBottomNav: React.FC<LessonBottomNavProps> = ({
  previousLesson, nextLesson, courseSlug, navigate, canAccessNextLesson,
  quiz, quizPassed, courseQuiz, currentLessonIndex, allLessonsCount,
}) => (
  <div className="bg-white border-t border-gray-200 px-6 py-4">
    <div className="max-w-5xl mx-auto flex items-center justify-between">
      <button
        onClick={() => previousLesson && navigate(`/lms/${courseSlug}/lesson/${previousLesson.id}`)}
        disabled={!previousLesson}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${previousLesson ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400 cursor-not-allowed'}`}
      >
        <ChevronLeft size={20} /><span>Previous</span>
      </button>

      <div className="text-sm text-gray-600">Lesson {currentLessonIndex + 1} of {allLessonsCount}</div>

      <div className="flex flex-col items-end gap-1">
        {nextLesson ? (
          <button
            onClick={() => navigate(`/lms/${courseSlug}/lesson/${nextLesson.id}`)}
            disabled={!canAccessNextLesson}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${canAccessNextLesson ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            <span>Next Lesson</span><ChevronRight size={20} />
          </button>
        ) : courseQuiz ? (
          <button
            onClick={() => navigate(`/lms/${courseSlug}/assessment`)}
            disabled={!!(quiz && !quizPassed)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${(!quiz || quizPassed) ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          >
            <span>Final Assessment</span><ChevronRight size={20} />
          </button>
        ) : null}

        {nextLesson && !canAccessNextLesson && quiz && !quizPassed && (
          <p className="text-xs text-red-600 mt-1 text-right">Pass the quiz ({QUIZ_PASSING_SCORE}%+) to continue</p>
        )}
        {!nextLesson && courseQuiz && quiz && !quizPassed && (
          <p className="text-xs text-red-600 mt-1 text-right">Pass the quiz ({QUIZ_PASSING_SCORE}%+) to unlock assessment</p>
        )}
      </div>
    </div>
  </div>
);
