import { describe, it, expect } from 'vitest'
import { getLessonTypeLabel, isCourseCompleted } from '@/pages/lms/utils/lessonHelpers'

// ─── getLessonTypeLabel ───────────────────────────────────────────────────────

describe('getLessonTypeLabel', () => {
  const cases: [string, string][] = [
    ['video', 'Video'],
    ['guide', 'Guide'],
    ['quiz', 'Quiz'],
    ['workshop', 'Workshop'],
    ['assignment', 'Assignment'],
    ['reading', 'Reading'],
    ['final-assessment', 'Final Assessment'],
  ]

  it.each(cases)('returns "%s" label for type "%s"', (type, expected) => {
    expect(getLessonTypeLabel(type)).toBe(expected)
  })

  it('returns the raw type string for unknown types', () => {
    expect(getLessonTypeLabel('custom-type')).toBe('custom-type')
  })
})

// ─── isCourseCompleted ────────────────────────────────────────────────────────

describe('isCourseCompleted', () => {
  it('returns true when all conditions are met', () => {
    expect(isCourseCompleted(null, true, null, false, null, false)).toBe(true)
  })

  it('returns false when there is a next lesson', () => {
    expect(isCourseCompleted({ id: 'next' }, true, null, false, null, false)).toBe(false)
  })

  it('returns false when video is not completed', () => {
    expect(isCourseCompleted(null, false, null, false, null, false)).toBe(false)
  })

  it('returns false when quiz exists but not passed', () => {
    expect(isCourseCompleted(null, true, { id: 'quiz' }, false, null, false)).toBe(false)
  })

  it('returns true when quiz exists and is passed', () => {
    expect(isCourseCompleted(null, true, { id: 'quiz' }, true, null, false)).toBe(true)
  })

  it('returns false when courseQuiz is present', () => {
    expect(isCourseCompleted(null, true, null, false, { id: 'cq' }, false)).toBe(false)
  })

  it('returns false when it is a final assessment lesson', () => {
    expect(isCourseCompleted(null, true, null, false, null, true)).toBe(false)
  })
})
