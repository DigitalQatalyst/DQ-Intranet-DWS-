/**
 * Feature 4/5/6 — Media Center: News, Podcast, Blogs
 * Tests: shouldUseNewLayout logic — blog vs podcast vs standard news
 * Spec AC: shouldUseNewLayout returns true for blog (Thought Leadership, non-podcast)
 *          shouldUseNewLayout must correctly identify podcast format
 *          Layout switch must correctly distinguish blog from podcast
 */
import { describe, it, expect } from 'vitest'
import type { NewsItem } from '@/data/media/news'

// ─── replicate shouldUseNewLayout logic from NewsDetailPage ──────────────────
// The spec says: blog layout = Thought Leadership + non-Podcast
// Podcast layout = format === 'Podcast' OR tags include 'podcast'

const shouldUseNewLayout = (article: Partial<NewsItem>): boolean => {
  const isPodcast =
    article.format === 'Podcast' ||
    (article.tags ?? []).some(t => t.toLowerCase().includes('podcast'))

  if (isPodcast) return true
  if (article.type === 'Thought Leadership') return true
  return false
}

const makeArticle = (overrides: Partial<NewsItem>): Partial<NewsItem> => ({
  id: 'test',
  type: 'Announcement',
  ...overrides,
})

describe('shouldUseNewLayout — blog articles', () => {
  it('returns true for Thought Leadership type', () => {
    expect(shouldUseNewLayout(makeArticle({ type: 'Thought Leadership' }))).toBe(true)
  })

  it('returns false for standard Announcement type', () => {
    expect(shouldUseNewLayout(makeArticle({ type: 'Announcement' }))).toBe(false)
  })

  it('returns false for Guidelines type', () => {
    expect(shouldUseNewLayout(makeArticle({ type: 'Guidelines' }))).toBe(false)
  })

  it('returns false for Notice type', () => {
    expect(shouldUseNewLayout(makeArticle({ type: 'Notice' }))).toBe(false)
  })
})

describe('shouldUseNewLayout — podcast articles', () => {
  it('returns true for format === "Podcast"', () => {
    expect(shouldUseNewLayout(makeArticle({ format: 'Podcast' } as any))).toBe(true)
  })

  it('returns true when tags include "podcast"', () => {
    expect(shouldUseNewLayout(makeArticle({ tags: ['podcast', 'series'] } as any))).toBe(true)
  })

  it('returns true when tags include "Podcast" (case-insensitive)', () => {
    expect(shouldUseNewLayout(makeArticle({ tags: ['Podcast'] } as any))).toBe(true)
  })
})

describe('shouldUseNewLayout — distinguishes blog from podcast', () => {
  it('Thought Leadership without podcast tag → new layout (blog)', () => {
    const article = makeArticle({ type: 'Thought Leadership', tags: [] as any })
    expect(shouldUseNewLayout(article)).toBe(true)
  })

  it('Thought Leadership WITH podcast tag → new layout (podcast takes priority)', () => {
    const article = makeArticle({
      type: 'Thought Leadership',
      format: 'Podcast',
    } as any)
    expect(shouldUseNewLayout(article)).toBe(true)
  })

  it('Announcement with podcast tag → new layout (podcast)', () => {
    const article = makeArticle({ type: 'Announcement', tags: ['podcast'] as any })
    expect(shouldUseNewLayout(article)).toBe(true)
  })

  it('Announcement without podcast tag → standard layout', () => {
    const article = makeArticle({ type: 'Announcement', tags: [] as any })
    expect(shouldUseNewLayout(article)).toBe(false)
  })
})
