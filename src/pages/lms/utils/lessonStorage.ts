// Storage key prefixes
export const PROGRESS_STORAGE_PREFIX = 'lms_lesson_progress_';
export const COMPLETION_STORAGE_PREFIX = 'lms_lesson_completed_';
export const COURSE_STARTED_PREFIX = 'lms_course_started_';
export const QUIZ_STORAGE_PREFIX = 'lms_quiz_submission_';
export const QUIZ_PASSED_PREFIX = 'lms_quiz_passed_';

// Quiz passing threshold (80%)
export const QUIZ_PASSING_SCORE = 80;

export function getLessonProgress(lessonId: string): number {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(`${PROGRESS_STORAGE_PREFIX}${lessonId}`);
  return stored ? parseFloat(stored) : 0;
}

export function saveLessonProgress(lessonId: string, progress: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${PROGRESS_STORAGE_PREFIX}${lessonId}`, progress.toString());
}

export function isLessonCompleted(lessonId: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`${COMPLETION_STORAGE_PREFIX}${lessonId}`) === 'true';
}

export function markLessonCompleted(lessonId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${COMPLETION_STORAGE_PREFIX}${lessonId}`, 'true');
}

export function isQuizPassed(lessonId: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`${QUIZ_PASSED_PREFIX}${lessonId}`) === 'true';
}

export function markQuizPassed(lessonId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${QUIZ_PASSED_PREFIX}${lessonId}`, 'true');
}

export function arePreviousLessonsCompleted(
  allLessons: Array<{ id: string; order: number }>,
  currentLessonId: string
): boolean {
  const currentIndex = allLessons.findIndex(l => l.id === currentLessonId);
  if (currentIndex <= 0) return true;
  return allLessons.slice(0, currentIndex).every(l => isLessonCompleted(l.id));
}
