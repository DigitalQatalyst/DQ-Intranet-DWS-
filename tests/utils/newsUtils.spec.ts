import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatDateShort,
  formatTime,
  formatDuration,
  formatListens,
  toTitleCase,
  getFallbackImage,
  getNewsTypeDisplay,
  getNewsImageSrc,
  generateTitle,
} from '@/utils/newsUtils'
import type { NewsItem } from '@/data/media/news'

// ─── helpers ────────────────────────────────────────────────────────────────

const makeItem = (overrides: Partial<NewsItem> = {}): NewsItem =>
  ({
    id: 'test-item',
    title: 'Test Title',
    type: 'Announcement',
    date: '2025-01-15',
    excerpt: '',
    content: '',
    ...overrides,
  } as NewsItem)

// ─── formatDate ─────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('')
  })

  it('formats a valid ISO date to long format', () => {
    const result = formatDate('2025-01-15')
    expect(result).toContain('January')
    expect(result).toContain('15')
    expect(result).toContain('2025')
  })

  it('returns "Invalid Date" for invalid date string (browser behaviour)', () => {
    // The function does not throw — toLocaleDateString returns 'Invalid Date' for bad input
    expect(formatDate('not-a-date')).toBe('Invalid Date')
  })
})

// ─── formatDateShort ─────────────────────────────────────────────────────────

describe('formatDateShort', () => {
  it('returns empty string for empty input', () => {
    expect(formatDateShort('')).toBe('')
  })

  it('formats a valid date to short format', () => {
    const result = formatDateShort('2025-12-19')
    expect(result).toContain('Dec')
    expect(result).toContain('19')
    expect(result).toContain('2025')
  })
})

// ─── formatTime ─────────────────────────────────────────────────────────────

describe('formatTime', () => {
  it('returns 0:00 for 0 seconds', () => {
    expect(formatTime(0)).toBe('0:00')
  })

  it('returns 0:00 for NaN', () => {
    expect(formatTime(NaN)).toBe('0:00')
  })

  it('returns 0:00 for negative values', () => {
    expect(formatTime(-5)).toBe('0:00')
  })

  it('formats seconds under a minute correctly', () => {
    expect(formatTime(45)).toBe('0:45')
  })

  it('formats exactly 1 minute', () => {
    expect(formatTime(60)).toBe('1:00')
  })

  it('pads seconds with leading zero', () => {
    expect(formatTime(65)).toBe('1:05')
  })

  it('formats longer durations', () => {
    expect(formatTime(3661)).toBe('61:01')
  })
})

// ─── formatDuration ──────────────────────────────────────────────────────────

describe('formatDuration', () => {
  it('returns default when undefined', () => {
    expect(formatDuration(undefined)).toBe('12 min')
  })

  it('maps <5 to 5 min', () => {
    expect(formatDuration('<5')).toBe('5 min')
  })

  it('maps 5–10 to 8 min', () => {
    expect(formatDuration('5–10')).toBe('8 min')
  })

  it('maps 10–20 to 15 min', () => {
    expect(formatDuration('10–20')).toBe('15 min')
  })

  it('maps 20+ to 20 min', () => {
    expect(formatDuration('20+')).toBe('20 min')
  })

  it('returns default for unknown value', () => {
    expect(formatDuration('unknown')).toBe('12 min')
  })
})

// ─── formatListens ───────────────────────────────────────────────────────────

describe('formatListens', () => {
  it('shows raw count under 1000', () => {
    expect(formatListens(500)).toBe('500 listens')
  })

  it('shows k notation for 1000', () => {
    expect(formatListens(1000)).toBe('1k listens')
  })

  it('shows k notation for 1500', () => {
    expect(formatListens(1500)).toBe('1.5k listens')
  })

  it('removes trailing .0 from k notation', () => {
    expect(formatListens(2000)).toBe('2k listens')
  })
})

// ─── toTitleCase ─────────────────────────────────────────────────────────────

describe('toTitleCase', () => {
  it('returns empty string for empty input', () => {
    expect(toTitleCase('')).toBe('')
  })

  it('converts all-caps string to title case', () => {
    const result = toTitleCase('HELLO WORLD')
    expect(result).toBe('Hello World')
  })

  it('preserves known acronyms in all-caps input', () => {
    const result = toTitleCase('DQ TEAM WFH POLICY')
    expect(result).toContain('DQ')
    expect(result).toContain('WFH')
  })

  it('returns mixed-case string as-is', () => {
    expect(toTitleCase('Already Title Case')).toBe('Already Title Case')
  })
})

// ─── getFallbackImage ─────────────────────────────────────────────────────────

describe('getFallbackImage', () => {
  const images = ['/img1.jpg', '/img2.jpg', '/img3.jpg']

  it('returns first image when itemId is empty', () => {
    expect(getFallbackImage('', images)).toBe('/img1.jpg')
  })

  it('returns first image when fallbackImages is empty', () => {
    expect(getFallbackImage('some-id', [])).toBe('')
  })

  it('returns a consistent image for the same id', () => {
    const result1 = getFallbackImage('abc', images)
    const result2 = getFallbackImage('abc', images)
    expect(result1).toBe(result2)
  })

  it('returns a value from the provided images array', () => {
    const result = getFallbackImage('my-item', images)
    expect(images).toContain(result)
  })
})

// ─── getNewsTypeDisplay ───────────────────────────────────────────────────────

describe('getNewsTypeDisplay', () => {
  it('returns Blog label for Thought Leadership type', () => {
    const item = makeItem({ type: 'Thought Leadership' })
    const { label } = getNewsTypeDisplay(item)
    expect(label).toBe('Blog')
  })

  it('returns Podcast label for podcast format', () => {
    const item = makeItem({ format: 'Podcast' } as any)
    const { label } = getNewsTypeDisplay(item)
    expect(label).toBe('Podcast')
  })

  it('returns Podcast label when tags include podcast', () => {
    const item = makeItem({ tags: ['podcast', 'series'] } as any)
    const { label } = getNewsTypeDisplay(item)
    expect(label).toBe('Podcast')
  })

  it('returns correct label for Policy Update newsType', () => {
    const item = makeItem({ newsType: 'Policy Update' } as any)
    const { label } = getNewsTypeDisplay(item)
    expect(label).toBe('Policy Update')
  })

  it('returns correct label for Company News newsType', () => {
    const item = makeItem({ newsType: 'Company News' } as any)
    const { label } = getNewsTypeDisplay(item)
    expect(label).toBe('Company News')
  })

  it('falls back to Company News for Announcement type', () => {
    const item = makeItem({ type: 'Announcement' })
    const { label } = getNewsTypeDisplay(item)
    expect(label).toBe('Company News')
  })

  it('returns a color string for every type', () => {
    const item = makeItem({ type: 'Announcement' })
    const { color } = getNewsTypeDisplay(item)
    expect(color).toBeTruthy()
    expect(color.startsWith('#')).toBe(true)
  })
})

// ─── getNewsImageSrc ──────────────────────────────────────────────────────────

describe('getNewsImageSrc', () => {
  const fallbacks = ['/fallback1.jpg', '/fallback2.jpg']

  it('returns blog image for Thought Leadership type', () => {
    const item = makeItem({ type: 'Thought Leadership' })
    expect(getNewsImageSrc(item, fallbacks)).toBe('/image (7).jpg')
  })

  it('returns podcast image for Podcast format', () => {
    const item = makeItem({ format: 'Podcast' } as any)
    expect(getNewsImageSrc(item, fallbacks)).toBe('/image (12).png')
  })

  it('returns announcement image for Announcement type', () => {
    const item = makeItem({ type: 'Announcement' })
    expect(getNewsImageSrc(item, fallbacks)).toBe('/image (6).jpg')
  })

  it('returns announcement image for Policy Update newsType (type=Announcement takes priority)', () => {
    // makeItem sets type: 'Announcement' — that branch fires before newsType check
    const item = makeItem({ newsType: 'Policy Update' } as any)
    expect(getNewsImageSrc(item, fallbacks)).toBe('/image (6).jpg')
  })

  it('returns announcement image for Notice type (Notice maps to /image (6).jpg)', () => {
    // Notice type hits the type === 'Notice' branch → returns /image (6).jpg
    const item = makeItem({ type: 'Notice', newsType: 'Policy Update' } as any)
    expect(getNewsImageSrc(item, fallbacks)).toBe('/image (6).jpg')
  })

  it('returns item.image when set and no type match', () => {
    const item = makeItem({ image: '/custom.jpg' } as any)
    // Override type so it falls through to item.image
    item.type = undefined as any
    expect(getNewsImageSrc(item, fallbacks)).toBe('/custom.jpg')
  })
})

// ─── generateTitle ────────────────────────────────────────────────────────────

describe('generateTitle', () => {
  it('returns override title for known id', () => {
    const item = makeItem({ id: 'dq-scrum-master-structure-update', title: '' })
    expect(generateTitle(item)).toBe('Updated Scrum Master Structure')
  })

  it('returns item title when present', () => {
    const item = makeItem({ title: 'My Article Title' })
    expect(generateTitle(item)).toBe('My Article Title')
  })

  it('generates a title from excerpt when title is empty', () => {
    const item = makeItem({
      title: '',
      excerpt: 'This is a long enough excerpt to generate a title from',
    })
    const result = generateTitle(item)
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns a non-empty string even with minimal data', () => {
    const item = makeItem({ title: '', excerpt: '', content: '' })
    expect(generateTitle(item).length).toBeGreaterThan(0)
  })
})
