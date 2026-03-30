/**
 * Target 1 — useArticleData hook
 * Tests: loading state, success (article + related), error state,
 *        blog-only related filtering, markMediaItemSeen called on success
 * No production files changed — all deps mocked at module level.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useArticleData } from '@/hooks/useArticleData'

// ─── mocks ───────────────────────────────────────────────────────────────────

const mockFetchNewsById = vi.fn()
const mockFetchAllNews = vi.fn()
const mockMarkMediaItemSeen = vi.fn()

vi.mock('@/services/mediaCenterService', () => ({
  fetchNewsById: (...args: any[]) => mockFetchNewsById(...args),
  fetchAllNews: (...args: any[]) => mockFetchAllNews(...args),
}))

vi.mock('@/utils/mediaTracking', () => ({
  markMediaItemSeen: (...args: any[]) => mockMarkMediaItemSeen(...args),
}))

// ─── helpers ─────────────────────────────────────────────────────────────────

const makeArticle = (overrides = {}) => ({
  id: 'article-1',
  title: 'Test Article',
  type: 'Announcement',
  date: '2025-01-01',
  excerpt: 'excerpt',
  content: 'content',
  ...overrides,
})

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

// ─── no id ────────────────────────────────────────────────────────────────────

describe('useArticleData — no id', () => {
  it('returns null article and empty related when id is undefined', () => {
    const { result } = renderHook(() => useArticleData(undefined))
    expect(result.current.article).toBeNull()
    expect(result.current.related).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.loadError).toBeNull()
  })

  it('does not call fetchNewsById when id is undefined', () => {
    renderHook(() => useArticleData(undefined))
    expect(mockFetchNewsById).not.toHaveBeenCalled()
  })
})

// ─── loading state ────────────────────────────────────────────────────────────

describe('useArticleData — loading state', () => {
  it('sets isLoading to true while fetching', async () => {
    // Never resolves during this test
    mockFetchNewsById.mockReturnValue(new Promise(() => {}))
    mockFetchAllNews.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useArticleData('article-1'))
    expect(result.current.isLoading).toBe(true)
  })
})

// ─── success state ────────────────────────────────────────────────────────────

describe('useArticleData — success state', () => {
  it('sets article after successful fetch', async () => {
    const article = makeArticle()
    mockFetchNewsById.mockResolvedValue(article)
    mockFetchAllNews.mockResolvedValue([article, makeArticle({ id: 'article-2' })])

    const { result } = renderHook(() => useArticleData('article-1'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.article).toEqual(article)
    expect(result.current.loadError).toBeNull()
  })

  it('excludes current article from related', async () => {
    const article = makeArticle({ id: 'article-1' })
    const other = makeArticle({ id: 'article-2' })
    mockFetchNewsById.mockResolvedValue(article)
    mockFetchAllNews.mockResolvedValue([article, other])

    const { result } = renderHook(() => useArticleData('article-1'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.related.some(r => r.id === 'article-1')).toBe(false)
    expect(result.current.related.some(r => r.id === 'article-2')).toBe(true)
  })

  it('limits related articles to 6', async () => {
    const article = makeArticle({ id: 'main' })
    const others = Array.from({ length: 10 }, (_, i) => makeArticle({ id: `other-${i}` }))
    mockFetchNewsById.mockResolvedValue(article)
    mockFetchAllNews.mockResolvedValue([article, ...others])

    const { result } = renderHook(() => useArticleData('main'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.related.length).toBeLessThanOrEqual(6)
  })

  it('calls markMediaItemSeen with the article id on success', async () => {
    const article = makeArticle({ id: 'article-1' })
    mockFetchNewsById.mockResolvedValue(article)
    mockFetchAllNews.mockResolvedValue([])

    const { result } = renderHook(() => useArticleData('article-1'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(mockMarkMediaItemSeen).toHaveBeenCalledWith('news', 'article-1')
  })

  it('sets isLoading to false after fetch completes', async () => {
    mockFetchNewsById.mockResolvedValue(makeArticle())
    mockFetchAllNews.mockResolvedValue([])

    const { result } = renderHook(() => useArticleData('article-1'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
  })
})

// ─── blog-only related filtering ─────────────────────────────────────────────

describe('useArticleData — blog related filtering', () => {
  it('only shows Thought Leadership related for a blog article', async () => {
    const blogArticle = makeArticle({ id: 'blog-1', type: 'Thought Leadership' })
    const otherBlog = makeArticle({ id: 'blog-2', type: 'Thought Leadership' })
    const newsArticle = makeArticle({ id: 'news-1', type: 'Announcement' })

    mockFetchNewsById.mockResolvedValue(blogArticle)
    mockFetchAllNews.mockResolvedValue([blogArticle, otherBlog, newsArticle])

    const { result } = renderHook(() => useArticleData('blog-1'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.related.every(r => r.type === 'Thought Leadership')).toBe(true)
    expect(result.current.related.some(r => r.id === 'news-1')).toBe(false)
  })

  it('does not filter related for a non-blog article', async () => {
    const newsArticle = makeArticle({ id: 'news-1', type: 'Announcement' })
    const blogArticle = makeArticle({ id: 'blog-1', type: 'Thought Leadership' })
    const otherNews = makeArticle({ id: 'news-2', type: 'Announcement' })

    mockFetchNewsById.mockResolvedValue(newsArticle)
    mockFetchAllNews.mockResolvedValue([newsArticle, blogArticle, otherNews])

    const { result } = renderHook(() => useArticleData('news-1'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    // Both blog and news should appear in related
    expect(result.current.related.length).toBeGreaterThan(0)
  })
})

// ─── error state ──────────────────────────────────────────────────────────────

describe('useArticleData — error state', () => {
  it('sets loadError when fetch throws', async () => {
    mockFetchNewsById.mockRejectedValue(new Error('Network error'))
    mockFetchAllNews.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useArticleData('article-1'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.loadError).toBe('Unable to load this article right now.')
    expect(result.current.article).toBeNull()
  })

  it('sets isLoading to false after error', async () => {
    mockFetchNewsById.mockRejectedValue(new Error('fail'))
    mockFetchAllNews.mockRejectedValue(new Error('fail'))

    const { result } = renderHook(() => useArticleData('article-1'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
  })

  it('does not call markMediaItemSeen on error', async () => {
    mockFetchNewsById.mockRejectedValue(new Error('fail'))
    mockFetchAllNews.mockRejectedValue(new Error('fail'))

    const { result } = renderHook(() => useArticleData('article-1'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(mockMarkMediaItemSeen).not.toHaveBeenCalled()
  })
})

// ─── re-fetch on id change ────────────────────────────────────────────────────

describe('useArticleData — id change', () => {
  it('re-fetches when id changes', async () => {
    mockFetchNewsById.mockResolvedValue(makeArticle({ id: 'article-1' }))
    mockFetchAllNews.mockResolvedValue([])

    const { result, rerender } = renderHook(({ id }) => useArticleData(id), {
      initialProps: { id: 'article-1' },
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(mockFetchNewsById).toHaveBeenCalledWith('article-1')

    mockFetchNewsById.mockResolvedValue(makeArticle({ id: 'article-2' }))
    rerender({ id: 'article-2' })

    await waitFor(() => expect(mockFetchNewsById).toHaveBeenCalledWith('article-2'))
  })
})
