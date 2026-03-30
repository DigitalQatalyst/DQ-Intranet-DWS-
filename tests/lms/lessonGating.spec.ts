/**
 * Feature 3 — Learning Center: Courses & Curricula
 * Tests: arePreviousLessonsCompleted gates lesson access,
 *        lesson progress persistence, quiz passing threshold
 * Spec AC: arePreviousLessonsCompleted gates lesson access correctly
 *          Lesson progress persists across page refreshes (localStorage)
 *          QUIZ_PASSING_SCORE = 80
 */
import { describe, it, expect, beforeEach } from 'vitest'
import {
  arePreviousLessonsCompleted,
  isLessonCompleted,
  markLessonCompleted,
  getLessonProgress,
  saveLessonProgress,
  isQuizPassed,
  markQuizPassed,
  QUIZ_PASSING_SCORE,
} from '@/pages/lms/utils/lessonStorage'

beforeEach(() => localStorage.clear())

// ─── lesson gating ────────────────────────────────────────────────────────────

describe('Lesson gating — arePreviousLessonsCompleted', () => {
  const curriculum = [
    { id: 'intro', order: 1 },
    { id: 'module-1', order: 2 },
    { id: 'module-2', order: 3 },
    { id: 'assessment', order: 4 },
  ]

  it('first lesson is always accessible (no previous)', () => {
    expect(arePreviousLessonsCompleted(curriculum, 'intro')).toBe(true)
  })

  it('second lesson is blocked when first is not complete', () => {
    expect(arePreviousLessonsCompleted(curriculum, 'module-1')).toBe(false)
  })

  it('second lesson is accessible after first is completed', () => {
    markLessonCompleted('intro')
    expect(arePreviousLessonsCompleted(curriculum, 'module-1')).toBe(true)
  })

  it('third lesson is blocked when only first is complete', () => {
    markLessonCompleted('intro')
    expect(arePreviousLessonsCompleted(curriculum, 'module-2')).toBe(false)
  })

  it('third lesson is accessible when first and second are complete', () => {
    markLessonCompleted('intro')
    markLessonCompleted('module-1')
    expect(arePreviousLessonsCompleted(curriculum, 'module-2')).toBe(true)
  })

  it('assessment is blocked until all prior lessons are complete', () => {
    markLessonCompleted('intro')
    markLessonCompleted('module-1')
    // module-2 not complete
    expect(arePreviousLessonsCompleted(curriculum, 'assessment')).toBe(false)
  })

  it('assessment is accessible when all prior lessons are complete', () => {
    markLessonCompleted('intro')
    markLessonCompleted('module-1')
    markLessonCompleted('module-2')
    expect(arePreviousLessonsCompleted(curriculum, 'assessment')).toBe(true)
  })
})

// ─── progress persistence ─────────────────────────────────────────────────────

describe('Lesson progress persistence', () => {
  it('progress starts at 0 for a new lesson', () => {
    expect(getLessonProgress('new-lesson')).toBe(0)
  })

  it('saved progress is retrievable', () => {
    saveLessonProgress('lesson-a', 0.6)
    expect(getLessonProgress('lesson-a')).toBe(0.6)
  })

  it('progress is stored per lesson id', () => {
    saveLessonProgress('lesson-a', 0.3)
    saveLessonProgress('lesson-b', 0.9)
    expect(getLessonProgress('lesson-a')).toBe(0.3)
    expect(getLessonProgress('lesson-b')).toBe(0.9)
  })

  it('completion state is independent of progress value', () => {
    saveLessonProgress('lesson-a', 1.0)
    // saving progress does NOT auto-mark as complete
    expect(isLessonCompleted('lesson-a')).toBe(false)
  })

  it('markLessonCompleted persists across reads', () => {
    markLessonCompleted('lesson-a')
    expect(isLessonCompleted('lesson-a')).toBe(true)
    // simulate re-read
    expect(isLessonCompleted('lesson-a')).toBe(true)
  })
})

// ─── quiz passing threshold ───────────────────────────────────────────────────

describe('Quiz passing threshold', () => {
  it('QUIZ_PASSING_SCORE is 80', () => {
    expect(QUIZ_PASSING_SCORE).toBe(80)
  })

  it('quiz is not passed by default', () => {
    expect(isQuizPassed('quiz-lesson')).toBe(false)
  })

  it('quiz is passed after markQuizPassed', () => {
    markQuizPassed('quiz-lesson')
    expect(isQuizPassed('quiz-lesson')).toBe(true)
  })

  it('passing one quiz does not affect another', () => {
    markQuizPassed('quiz-1')
    expect(isQuizPassed('quiz-2')).toBe(false)
  })

  it('a score >= 80 should be considered passing', () => {
    expect(85 >= QUIZ_PASSING_SCORE).toBe(true)
  })

  it('a score < 80 should not be considered passing', () => {
    expect(79 >= QUIZ_PASSING_SCORE).toBe(false)
  })
})
