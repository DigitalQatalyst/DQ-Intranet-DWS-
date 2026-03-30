import { describe, it, expect, beforeEach } from 'vitest'
import {
  getLessonProgress,
  saveLessonProgress,
  isLessonCompleted,
  markLessonCompleted,
  isQuizPassed,
  markQuizPassed,
  arePreviousLessonsCompleted,
  QUIZ_PASSING_SCORE,
} from '@/pages/lms/utils/lessonStorage'

// ─── setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear()
})

// ─── constants ───────────────────────────────────────────────────────────────

describe('QUIZ_PASSING_SCORE', () => {
  it('is 80', () => {
    expect(QUIZ_PASSING_SCORE).toBe(80)
  })
})

// ─── getLessonProgress / saveLessonProgress ───────────────────────────────────

describe('getLessonProgress', () => {
  it('returns 0 when no progress stored', () => {
    expect(getLessonProgress('lesson-1')).toBe(0)
  })

  it('returns stored progress after save', () => {
    saveLessonProgress('lesson-1', 0.75)
    expect(getLessonProgress('lesson-1')).toBe(0.75)
  })

  it('returns 0 for a different lesson id', () => {
    saveLessonProgress('lesson-1', 0.5)
    expect(getLessonProgress('lesson-2')).toBe(0)
  })

  it('overwrites previous progress', () => {
    saveLessonProgress('lesson-1', 0.3)
    saveLessonProgress('lesson-1', 0.9)
    expect(getLessonProgress('lesson-1')).toBe(0.9)
  })
})

// ─── isLessonCompleted / markLessonCompleted ──────────────────────────────────

describe('isLessonCompleted', () => {
  it('returns false when lesson not marked', () => {
    expect(isLessonCompleted('lesson-1')).toBe(false)
  })

  it('returns true after marking complete', () => {
    markLessonCompleted('lesson-1')
    expect(isLessonCompleted('lesson-1')).toBe(true)
  })

  it('does not affect other lessons', () => {
    markLessonCompleted('lesson-1')
    expect(isLessonCompleted('lesson-2')).toBe(false)
  })
})

// ─── isQuizPassed / markQuizPassed ────────────────────────────────────────────

describe('isQuizPassed', () => {
  it('returns false when quiz not passed', () => {
    expect(isQuizPassed('lesson-1')).toBe(false)
  })

  it('returns true after marking quiz passed', () => {
    markQuizPassed('lesson-1')
    expect(isQuizPassed('lesson-1')).toBe(true)
  })

  it('does not affect other lessons', () => {
    markQuizPassed('lesson-1')
    expect(isQuizPassed('lesson-2')).toBe(false)
  })
})

// ─── arePreviousLessonsCompleted ─────────────────────────────────────────────

describe('arePreviousLessonsCompleted', () => {
  const lessons = [
    { id: 'l1', order: 1 },
    { id: 'l2', order: 2 },
    { id: 'l3', order: 3 },
  ]

  it('returns true for the first lesson (no previous)', () => {
    expect(arePreviousLessonsCompleted(lessons, 'l1')).toBe(true)
  })

  it('returns false when previous lesson is not completed', () => {
    expect(arePreviousLessonsCompleted(lessons, 'l2')).toBe(false)
  })

  it('returns true when all previous lessons are completed', () => {
    markLessonCompleted('l1')
    markLessonCompleted('l2')
    expect(arePreviousLessonsCompleted(lessons, 'l3')).toBe(true)
  })

  it('returns false when only some previous lessons are completed', () => {
    markLessonCompleted('l1')
    // l2 not completed
    expect(arePreviousLessonsCompleted(lessons, 'l3')).toBe(false)
  })

  it('returns true for unknown lesson id (not found → index -1 → treated as first)', () => {
    expect(arePreviousLessonsCompleted(lessons, 'unknown')).toBe(true)
  })
})
