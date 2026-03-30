/**
 * Feature 1 — DWS Landing (Home)
 * Tests: daily quote data integrity, getRandomQuote output
 */
import { describe, it, expect } from 'vitest'
import { dailyQuotes, getRandomQuote } from '@/data/dailyQuotes'

describe('dailyQuotes data', () => {
  it('contains at least one quote', () => {
    expect(dailyQuotes.length).toBeGreaterThan(0)
  })

  it('every quote has required fields', () => {
    dailyQuotes.forEach(q => {
      expect(q.id).toBeTruthy()
      expect(q.text.length).toBeGreaterThan(0)
      expect(q.author.length).toBeGreaterThan(0)
      expect(q.role.length).toBeGreaterThan(0)
    })
  })

  it('all quote ids are unique', () => {
    const ids = dailyQuotes.map(q => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getRandomQuote', () => {
  it('returns a quote from the dailyQuotes array', () => {
    const quote = getRandomQuote()
    expect(dailyQuotes.some(q => q.id === quote.id)).toBe(true)
  })

  it('returns a quote with all required fields', () => {
    const quote = getRandomQuote()
    expect(quote.text).toBeTruthy()
    expect(quote.author).toBeTruthy()
    expect(quote.role).toBeTruthy()
  })

  it('returns different quotes across multiple calls (probabilistic)', () => {
    const results = new Set(Array.from({ length: 20 }, () => getRandomQuote().id))
    // With 30 quotes and 20 calls, we expect more than 1 unique result
    expect(results.size).toBeGreaterThan(1)
  })
})
