/**
 * Target 2 — useCourseProgress hook (and related hooks)
 * Tests: not-started, in-progress, completed states; disabled when no user;
 *        useUserInProgressCourses, useUserCompletedCourses query keys
 * No production files changed — all deps mocked at module level.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ─── mocks ───────────────────────────────────────────────────────────────────

const mockGetCourseProgress = vi.fn()
const mockGetUserInProgressCourses = vi.fn()
const mockGetUserCompletedCourses = vi.fn()
const mockGetUserProgressStats = vi.fn()

vi.mock('@/services/lmsService', () => ({
  getLessonProgress: vi.fn(),
  getCourseLessonsProgress: vi.fn(),
  getCourseProgress: (...args: any[]) => mockGetCourseProgress(...args),
  getUserCoursesProgress: vi.fn(),
  getUserInProgressCourses: (...args: any[]) => mockGetUserInProgressCourses(...args),
  getUserCompletedCourses: (...args: any[]) => mockGetUserCompletedCourses(...args),
  getUserProgressStats: (...args: any[]) => mockGetUserProgressStats(...args),
  markLessonStarted: vi.fn(),
  markLessonCompleted: vi.fn(),
  updateLessonVideoProgress: vi.fn(),
  saveQuizSubmission: vi.fn(),
  getSaveForLater: vi.fn(),
  toggleSaveForLater: vi.fn(),
}))

let mockUser: { id: string } | null = { id: 'user-123' }

vi.mock('@/components/Header', () => ({
  useAuth: () => ({ user: mockUser }),
  Header: () => null,
}))

// ─── wrapper ─────────────────────────────────────────────────────────────────

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children)
}

import {
  useCourseProgress,
  useUserInProgressCourses,
  useUserCompletedCourses,
  useUserProgressStats,
} from '@/hooks/useCourseProgress'
import type { LmsCourseProgress, UserProgressStats } from '@/types/lmsCourseProgress'

const makeCourseProgress = (overrides: Partial<LmsCourseProgress> = {}): LmsCourseProgress => ({
  id: 'cp-1',
  user_id: 'user-123',
  course_id: 'course-1',
  course_slug: 'intro-to-ghc',
  status: 'not_started',
  progress_percentage: 0,
  lessons_completed: 0,
  total_lessons: 5,
  started_at: null,
  completed_at: null,
  last_accessed_at: new Date().toISOString(),
  total_time_spent_seconds: 0,
  certificate_earned: false,
  certificate_earned_at: null,
  saved_for_later: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

beforeEach(() => {
  vi.clearAllMocks()
  mockUser = { id: 'user-123' }
})

// ─── useCourseProgress — not started ─────────────────────────────────────────

describe('useCourseProgress — not_started state', () => {
  it('returns not_started progress', async () => {
    const progress = makeCourseProgress({ status: 'not_started', progress_percentage: 0 })
    mockGetCourseProgress.mockResolvedValue(progress)

    const { result } = renderHook(() => useCourseProgress('course-1'), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.status).toBe('not_started')
    expect(result.current.data?.progress_percentage).toBe(0)
  })
})

// ─── useCourseProgress — in_progress state ────────────────────────────────────

describe('useCourseProgress — in_progress state', () => {
  it('returns in_progress with partial completion', async () => {
    const progress = makeCourseProgress({
      status: 'in_progress',
      progress_percentage: 40,
      lessons_completed: 2,
      total_lessons: 5,
      started_at: new Date().toISOString(),
    })
    mockGetCourseProgress.mockResolvedValue(progress)

    const { result } = renderHook(() => useCourseProgress('course-1'), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.status).toBe('in_progress')
    expect(result.current.data?.progress_percentage).toBe(40)
    expect(result.current.data?.lessons_completed).toBe(2)
    expect(result.current.data?.started_at).not.toBeNull()
  })
})

// ─── useCourseProgress — completed state ─────────────────────────────────────

describe('useCourseProgress — completed state', () => {
  it('returns completed with 100% progress', async () => {
    const progress = makeCourseProgress({
      status: 'completed',
      progress_percentage: 100,
      lessons_completed: 5,
      total_lessons: 5,
      completed_at: new Date().toISOString(),
      certificate_earned: true,
    })
    mockGetCourseProgress.mockResolvedValue(progress)

    const { result } = renderHook(() => useCourseProgress('course-1'), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.status).toBe('completed')
    expect(result.current.data?.progress_percentage).toBe(100)
    expect(result.current.data?.certificate_earned).toBe(true)
    expect(result.current.data?.completed_at).not.toBeNull()
  })
})

// ─── useCourseProgress — disabled when no user ───────────────────────────────

describe('useCourseProgress — no user', () => {
  it('does not fetch when user is not authenticated', () => {
    mockUser = null

    const { result } = renderHook(() => useCourseProgress('course-1'), {
      wrapper: makeWrapper(),
    })

    // Query should be disabled — fetchStatus is 'idle', not 'fetching'
    expect(result.current.fetchStatus).toBe('idle')
    expect(mockGetCourseProgress).not.toHaveBeenCalled()
  })

  it('does not fetch when courseId is empty', () => {
    const { result } = renderHook(() => useCourseProgress(''), {
      wrapper: makeWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockGetCourseProgress).not.toHaveBeenCalled()
  })
})

// ─── useUserInProgressCourses ─────────────────────────────────────────────────

describe('useUserInProgressCourses', () => {
  it('returns list of in-progress courses', async () => {
    const courses = [
      makeCourseProgress({ course_id: 'c1', status: 'in_progress', progress_percentage: 30 }),
      makeCourseProgress({ course_id: 'c2', status: 'in_progress', progress_percentage: 60 }),
    ]
    mockGetUserInProgressCourses.mockResolvedValue(courses)

    const { result } = renderHook(() => useUserInProgressCourses(), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.every(c => c.status === 'in_progress')).toBe(true)
  })

  it('returns empty array when no courses in progress', async () => {
    mockGetUserInProgressCourses.mockResolvedValue([])

    const { result } = renderHook(() => useUserInProgressCourses(), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([])
  })
})

// ─── useUserCompletedCourses ──────────────────────────────────────────────────

describe('useUserCompletedCourses', () => {
  it('returns list of completed courses', async () => {
    const courses = [
      makeCourseProgress({ course_id: 'c1', status: 'completed', progress_percentage: 100 }),
    ]
    mockGetUserCompletedCourses.mockResolvedValue(courses)

    const { result } = renderHook(() => useUserCompletedCourses(), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].status).toBe('completed')
  })
})

// ─── useUserProgressStats ─────────────────────────────────────────────────────

describe('useUserProgressStats', () => {
  it('returns aggregated stats', async () => {
    const stats: UserProgressStats = {
      coursesStarted: 3,
      coursesCompleted: 1,
      lessonsCompleted: 12,
      totalTimeSpentHours: 4.5,
      certificatesEarned: 1,
      averageProgress: 55,
    }
    mockGetUserProgressStats.mockResolvedValue(stats)

    const { result } = renderHook(() => useUserProgressStats(), {
      wrapper: makeWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.coursesStarted).toBe(3)
    expect(result.current.data?.coursesCompleted).toBe(1)
    expect(result.current.data?.certificatesEarned).toBe(1)
  })

  it('does not fetch when user is not authenticated', () => {
    mockUser = null

    const { result } = renderHook(() => useUserProgressStats(), {
      wrapper: makeWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockGetUserProgressStats).not.toHaveBeenCalled()
  })
})
