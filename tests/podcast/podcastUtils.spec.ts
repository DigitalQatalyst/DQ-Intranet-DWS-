import { describe, it, expect } from 'vitest'
import {
  filterSeriesEpisodes,
  matchesDurationFilter,
  sortEpisodes,
  filterEpisodes,
  ACTION_SOLVER_EPISODE_ORDER,
} from '@/pages/marketplace/utils/podcastUtils'
import type { NewsItem } from '@/data/media/news'

// ─── helpers ─────────────────────────────────────────────────────────────────

const makeEpisode = (overrides: Partial<NewsItem> = {}): NewsItem =>
  ({
    id: 'ep-1',
    title: 'Episode 1',
    type: 'Announcement',
    date: '2025-01-01',
    format: 'Podcast',
    audioUrl: '/Podcasts/ep1.mp3',
    views: 0,
    ...overrides,
  } as unknown as NewsItem)

// ─── filterSeriesEpisodes ─────────────────────────────────────────────────────

describe('filterSeriesEpisodes', () => {
  it('returns only podcast items', () => {
    const news: NewsItem[] = [
      makeEpisode({ id: 'ep-1', audioUrl: '/Podcasts/ep1.mp3' }),
      { id: 'article-1', type: 'Announcement', format: undefined } as any,
    ]
    const result = filterSeriesEpisodes(news, false)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('ep-1')
  })

  it('filters out episodes without audioUrl', () => {
    const news: NewsItem[] = [
      makeEpisode({ id: 'ep-no-audio', audioUrl: undefined }),
    ]
    expect(filterSeriesEpisodes(news, false)).toHaveLength(0)
  })

  it('filters execution mindset series by audioUrl path', () => {
    const news: NewsItem[] = [
      makeEpisode({ id: 'series1-ep', audioUrl: '/Podcasts/ep1.mp3' }),
      makeEpisode({ id: 'series2-ep', audioUrl: '/02. Series 02 - The Execution Mindset/ep1.mp3' }),
    ]
    const series2 = filterSeriesEpisodes(news, true)
    expect(series2).toHaveLength(1)
    expect(series2[0].id).toBe('series2-ep')
  })

  it('filters action solver series (non-execution mindset)', () => {
    const news: NewsItem[] = [
      makeEpisode({ id: 'series1-ep', audioUrl: '/Podcasts/ep1.mp3' }),
      makeEpisode({ id: 'series2-ep', audioUrl: '/02. Series 02 - The Execution Mindset/ep1.mp3' }),
    ]
    const series1 = filterSeriesEpisodes(news, false)
    expect(series1).toHaveLength(1)
    expect(series1[0].id).toBe('series1-ep')
  })

  it('includes items tagged as podcast even without format field', () => {
    const news: NewsItem[] = [
      { id: 'tagged', type: 'Announcement', tags: ['podcast'], audioUrl: '/Podcasts/ep.mp3' } as any,
    ]
    expect(filterSeriesEpisodes(news, false)).toHaveLength(1)
  })
})

// ─── matchesDurationFilter ────────────────────────────────────────────────────

describe('matchesDurationFilter', () => {
  it('matches 10–20 range for 10 minutes', () => {
    expect(matchesDurationFilter(10, ['10–20'])).toBe(true)
  })

  it('matches 10–20 range for 19 minutes', () => {
    expect(matchesDurationFilter(19, ['10–20'])).toBe(true)
  })

  it('does not match 10–20 range for 20 minutes', () => {
    expect(matchesDurationFilter(20, ['10–20'])).toBe(false)
  })

  it('matches 20+ range for 20 minutes', () => {
    expect(matchesDurationFilter(20, ['20+'])).toBe(true)
  })

  it('matches 20+ range for 60 minutes', () => {
    expect(matchesDurationFilter(60, ['20+'])).toBe(true)
  })

  it('returns false for unknown filter', () => {
    expect(matchesDurationFilter(15, ['unknown'])).toBe(false)
  })

  it('returns true when any filter matches', () => {
    expect(matchesDurationFilter(25, ['10–20', '20+'])).toBe(true)
  })
})

// ─── sortEpisodes ─────────────────────────────────────────────────────────────

describe('sortEpisodes', () => {
  it('sorts by ACTION_SOLVER_EPISODE_ORDER for "latest"', () => {
    const episodes: NewsItem[] = [
      makeEpisode({ id: ACTION_SOLVER_EPISODE_ORDER[2], date: '2025-01-03' }),
      makeEpisode({ id: ACTION_SOLVER_EPISODE_ORDER[0], date: '2025-01-01' }),
      makeEpisode({ id: ACTION_SOLVER_EPISODE_ORDER[1], date: '2025-01-02' }),
    ]
    const sorted = sortEpisodes([...episodes], 'latest')
    expect(sorted[0].id).toBe(ACTION_SOLVER_EPISODE_ORDER[0])
    expect(sorted[1].id).toBe(ACTION_SOLVER_EPISODE_ORDER[1])
    expect(sorted[2].id).toBe(ACTION_SOLVER_EPISODE_ORDER[2])
  })

  it('sorts by views descending for "most-listened"', () => {
    const episodes: NewsItem[] = [
      makeEpisode({ id: 'ep-a', views: 100 }),
      makeEpisode({ id: 'ep-b', views: 500 }),
      makeEpisode({ id: 'ep-c', views: 250 }),
    ]
    const sorted = sortEpisodes([...episodes], 'most-listened')
    expect(sorted[0].id).toBe('ep-b')
    expect(sorted[1].id).toBe('ep-c')
    expect(sorted[2].id).toBe('ep-a')
  })

  it('returns episodes unchanged for unknown sort', () => {
    const episodes = [makeEpisode({ id: 'ep-1' }), makeEpisode({ id: 'ep-2' })]
    const result = sortEpisodes([...episodes], 'unknown' as any)
    expect(result).toHaveLength(2)
  })
})

// ─── filterEpisodes ───────────────────────────────────────────────────────────

describe('filterEpisodes', () => {
  const durations = new Map<string, number>([
    ['ep-short', 600],   // 10 min
    ['ep-long', 1500],   // 25 min
  ])

  it('returns all episodes when no filters applied', () => {
    const episodes = [makeEpisode({ id: 'ep-short' }), makeEpisode({ id: 'ep-long' })]
    expect(filterEpisodes(episodes, {}, durations)).toHaveLength(2)
  })

  it('filters by domain', () => {
    const episodes: NewsItem[] = [
      makeEpisode({ id: 'ep-1', domain: 'GHC' } as any),
      makeEpisode({ id: 'ep-2', domain: 'LMS' } as any),
    ]
    const result = filterEpisodes(episodes, { domain: ['GHC'] }, durations)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('ep-1')
  })

  it('filters by duration range', () => {
    const episodes = [makeEpisode({ id: 'ep-short' }), makeEpisode({ id: 'ep-long' })]
    const result = filterEpisodes(episodes, { readingTime: ['20+'] }, durations)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('ep-long')
  })
})
