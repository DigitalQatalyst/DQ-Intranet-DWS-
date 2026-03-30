import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { QUIZ_PASSING_SCORE } from '../../pages/lms/utils/lessonStorage';
import type { LmsQuizRow } from '../../types/lmsSupabase';

interface QuizWizardOverlayProps {
  quiz: LmsQuizRow;
  quizSubmitted: boolean;
  quizPassed: boolean;
  quizScore: { score: number; total: number } | null;
  currentQuestionIndex: number;
  selectedOption: number | null;
  isAnswerChecked: boolean;
  isAnswerCorrect: boolean;
  nextLesson: any;
  courseSlug: string | undefined;
  onOptionSelect: (i: number) => void;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onRetryWizard: () => void;
  onClose: () => void;
  navigate: (path: string) => void;
}

export const QuizWizardOverlay: React.FC<QuizWizardOverlayProps> = ({
  quiz, quizSubmitted, quizPassed, quizScore, currentQuestionIndex,
  selectedOption, isAnswerChecked, isAnswerCorrect, nextLesson, courseSlug,
  onOptionSelect, onCheckAnswer, onNextQuestion, onRetryWizard, onClose, navigate,
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-8 min-h-[400px] flex flex-col justify-center overflow-y-auto">
    {!quizSubmitted ? (
      <QuizQuestion
        quiz={quiz}
        currentQuestionIndex={currentQuestionIndex}
        selectedOption={selectedOption}
        isAnswerChecked={isAnswerChecked}
        isAnswerCorrect={isAnswerCorrect}
        onOptionSelect={onOptionSelect}
        onCheckAnswer={onCheckAnswer}
        onNextQuestion={onNextQuestion}
        onClose={onClose}
      />
    ) : (
      <QuizResult
        quizPassed={quizPassed}
        quizScore={quizScore}
        nextLesson={nextLesson}
        courseSlug={courseSlug}
        onRetry={onRetryWizard}
        onClose={onClose}
        navigate={navigate}
      />
    )}
  </div>
);

const QuizQuestion: React.FC<{
  quiz: LmsQuizRow;
  currentQuestionIndex: number;
  selectedOption: number | null;
  isAnswerChecked: boolean;
  isAnswerCorrect: boolean;
  onOptionSelect: (i: number) => void;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onClose: () => void;
}> = ({ quiz, currentQuestionIndex, selectedOption, isAnswerChecked, isAnswerCorrect, onOptionSelect, onCheckAnswer, onNextQuestion, onClose }) => {
  const question = quiz.questions[currentQuestionIndex];
  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
      </div>
      <div className="mb-6">
        <h4 className="text-xl font-medium text-gray-900 mb-6">{question.question || question.text}</h4>
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => {
            const isSelected = selectedOption === index;
            const optionClass = isAnswerChecked
              ? isSelected
                ? isAnswerCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                : 'border-gray-200 opacity-60'
              : isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300';
            return (
              <label key={`opt-${index}`} className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${optionClass} ${isAnswerChecked ? 'pointer-events-none' : ''}`}>
                <input type="radio" name="quiz-option" checked={isSelected} onChange={() => onOptionSelect(index)} disabled={isAnswerChecked} className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" />
                <span className={`flex-1 ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>{option}</span>
                {isSelected && isAnswerChecked && (isAnswerCorrect ? <CheckCircle2 className="text-green-500" size={20} /> : <X className="text-red-500" size={20} />)}
              </label>
            );
          })}
        </div>
      </div>
      {isAnswerChecked && (
        <div className={`p-4 rounded-lg mb-6 ${isAnswerCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <div className="flex items-center gap-2 font-bold mb-1">
            {isAnswerCorrect ? <CheckCircle2 size={20} /> : <X size={20} />}
            <span>{isAnswerCorrect ? 'Correct!' : 'Incorrect'}</span>
          </div>
          {isAnswerCorrect && question.explanation && <p className="mt-2 text-green-700">{question.explanation}</p>}
          {isAnswerCorrect && !question.explanation && <p>Great job!</p>}
        </div>
      )}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        {!isAnswerChecked ? (
          <button onClick={onCheckAnswer} disabled={selectedOption === null} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Submit Answer
          </button>
        ) : (
          <button onClick={onNextQuestion} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
};

const QuizResult: React.FC<{
  quizPassed: boolean;
  quizScore: { score: number; total: number } | null;
  nextLesson: any;
  courseSlug: string | undefined;
  onRetry: () => void;
  onClose: () => void;
  navigate: (path: string) => void;
}> = ({ quizPassed, quizScore, nextLesson, courseSlug, onRetry, onClose, navigate }) => (
  <div className="max-w-md mx-auto text-center">
    <h3 className="text-2xl font-bold mb-4">{quizPassed ? 'Quiz Passed!' : 'Quiz Not Passed'}</h3>
    <div className="mb-6">
      <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${quizPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {quizPassed ? <CheckCircle2 size={48} /> : <X size={48} />}
      </div>
      <p className="text-xl">You scored <span className="font-bold">{quizScore?.score}</span> out of <span className="font-bold">{quizScore?.total}</span></p>
      <p className={`text-sm mt-2 ${quizPassed ? 'text-green-600' : 'text-red-600'}`}>
        {quizPassed
          ? 'Congratulations! You can proceed to the next lesson.'
          : `Score: ${Math.round((quizScore?.score || 0) / (quizScore?.total || 1) * 100)}% (Requires ${QUIZ_PASSING_SCORE}%)`}
      </p>
    </div>
    <div className="flex flex-col gap-3">
      {quizPassed ? (
        nextLesson ? (
          <button onClick={() => navigate(`/lms/${courseSlug}/lesson/${nextLesson.id}`)} className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">Next Lesson</button>
        ) : (
          <button onClick={() => navigate(`/lms/${courseSlug}`)} className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">Back to Course</button>
        )
      ) : (
        <button onClick={onRetry} className="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">Retake Quiz</button>
      )}
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm mt-2">Close Quiz</button>
    </div>
  </div>
);
