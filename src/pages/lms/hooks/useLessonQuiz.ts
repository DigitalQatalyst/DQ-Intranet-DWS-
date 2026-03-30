import { useState, useEffect } from 'react';
import { fetchQuizByLessonId, fetchQuizByCourseId } from '../../../services/lmsService';
import type { LmsQuizRow } from '../../../types/lmsSupabase';
import {
  QUIZ_STORAGE_PREFIX,
  QUIZ_PASSING_SCORE,
  isQuizPassed,
  markQuizPassed,
  markLessonCompleted,
} from '../utils/lessonStorage';

export function useLessonQuiz(params: {
  lessonId: string | undefined;
  courseId: string | undefined;
  courseSlug: string | undefined;
  allLessons: any[];
  course: any;
  user: any;
  markLessonCompletedMutation: any;
  saveQuizSubmissionMutation: any;
}) {
  const { lessonId, courseId, courseSlug, allLessons, course, user, markLessonCompletedMutation, saveQuizSubmissionMutation } = params;

  const [quiz, setQuiz] = useState<LmsQuizRow | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<{ score: number; total: number } | null>(null);
  const [quizPassed, setQuizPassed] = useState(false);
  const [courseQuiz, setCourseQuiz] = useState<LmsQuizRow | null>(null);

  // Quiz wizard state
  const [showQuizOverlay, setShowQuizOverlay] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  useEffect(() => {
    if (courseId) {
      fetchQuizByCourseId(courseId).then(setCourseQuiz).catch(console.error);
    }
  }, [courseId]);

  useEffect(() => {
    if (!lessonId) return;
    setQuizLoading(true);
    setShowQuizOverlay(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setQuizPassed(isQuizPassed(lessonId));
    setVideoEnded(false);

    const isFinalAssessment = allLessons.find(l => l.id === lessonId)?.type === 'final-assessment';
    const promise = isFinalAssessment && courseId
      ? fetchQuizByCourseId(courseId)
      : fetchQuizByLessonId(lessonId);

    promise
      .then(data => setQuiz(data))
      .catch(error => { console.error('[Quiz] fetch error:', lessonId, error); setQuiz(null); })
      .finally(() => setQuizLoading(false));
  }, [lessonId, courseId, allLessons]);

  useEffect(() => {
    if (videoEnded && quiz && !quizPassed) {
      setShowQuizOverlay(true);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    }
  }, [videoEnded, quiz, quizPassed]);

  const handleQuizSubmit = () => {
    if (!quiz || !lessonId || !courseSlug) return;
    const questions = quiz.questions || [];
    const correctAnswers = questions.reduce((count: number, question: any, index: number) => {
      return quizAnswers[index] === question.correct_answer ? count + 1 : count;
    }, 0);

    const score = { score: correctAnswers, total: questions.length };
    const scorePercentage = Math.round((correctAnswers / questions.length) * 100);
    const passed = scorePercentage >= QUIZ_PASSING_SCORE;

    setQuizScore(score);
    setQuizSubmitted(true);
    setQuizPassed(passed);

    if (globalThis.window !== undefined) {
      const submissionKey = `${QUIZ_STORAGE_PREFIX}${quiz.id}_${lessonId}`;
      localStorage.setItem(submissionKey, JSON.stringify({
        quizId: quiz.id, lessonId, courseId: course?.id || '',
        score: correctAnswers, totalQuestions: questions.length,
        submittedAt: new Date().toISOString(), passed,
      }));

      if (user && course?.id) {
        saveQuizSubmissionMutation.mutate({
          quiz_id: quiz.id, lesson_id: lessonId, course_id: course.id,
          score_achieved: correctAnswers, total_questions: questions.length,
          score_percentage: scorePercentage, passed, answers: quizAnswers,
        });
      }

      if (passed) {
        markQuizPassed(lessonId);
        markLessonCompleted(lessonId);
        if (user && course?.id) {
          markLessonCompletedMutation.mutate({
            lessonId, courseId: course.id, courseSlug: courseSlug || '',
            quizPassed: true, quizScore: scorePercentage,
          });
        }
      }
    }
  };

  const handleQuizRetake = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setQuizPassed(false);
  };

  const handleOptionSelect = (optIndex: number) => {
    if (!isAnswerChecked && !quizSubmitted) setSelectedOption(optIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null || !quiz) return;
    const correct = quiz.questions[currentQuestionIndex].correct_answer === selectedOption;
    setIsAnswerCorrect(correct);
    setIsAnswerChecked(true);
    setQuizAnswers(prev => ({ ...prev, [currentQuestionIndex]: selectedOption }));
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      const nextAnswer = quizAnswers[currentQuestionIndex + 1];
      setSelectedOption(nextAnswer !== undefined ? nextAnswer : null);
      setIsAnswerChecked(nextAnswer !== undefined);
    } else {
      handleQuizSubmit();
    }
  };

  const handleRetryWizard = () => {
    handleQuizRetake();
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
  };

  return {
    quiz, quizLoading, quizAnswers, quizSubmitted, quizScore, quizPassed,
    courseQuiz, showQuizOverlay, setShowQuizOverlay, videoEnded, setVideoEnded,
    currentQuestionIndex, selectedOption, isAnswerChecked, isAnswerCorrect,
    handleQuizSubmit, handleQuizRetake, handleOptionSelect, handleCheckAnswer,
    handleNextQuestion, handleRetryWizard,
  };
}
