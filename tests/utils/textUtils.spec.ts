import { describe, it, expect } from 'vitest'
import { truncateWords, toTitleCase, buildShortTitle } from '@/utils/textUtils'

// ─── truncateWords ────────────────────────────────────────────────────────────

describe('truncateWords', () => {
  it('returns empty string for empty input', () => {
    expect(truncateWords('', 5)).toBe('')
  })

  it('returns empty string when maxWords is 0', () => {
    expect(truncateWords('hello world', 0)).toBe('')
  })

  it('returns full string when word count is within limit', () => {
    expect(truncateWords('hello world', 5)).toBe('hello world')
  })

  it('truncates to maxWords', () => {
    expect(truncateWords('one two three four five six', 3)).toBe('one two three')
  })

  it('trims leading/trailing whitespace', () => {
    expect(truncateWords('  hello world  ', 5)).toBe('hello world')
  })

  it('handles single word', () => {
    expect(truncateWords('hello', 1)).toBe('hello')
  })
})

// ─── toTitleCase ─────────────────────────────────────────────────────────────

describe('toTitleCase', () => {
  it('returns empty string for empty input', () => {
    expect(toTitleCase('')).toBe('')
  })

  it('capitalises first letter of each word', () => {
    expect(toTitleCase('hello world')).toBe('Hello World')
  })

  it('uppercases known acronyms', () => {
    expect(toTitleCase('dq team policy')).toContain('DQ')
    expect(toTitleCase('wfh guidelines')).toContain('WFH')
  })

  it('lowercases small words in the middle', () => {
    const result = toTitleCase('the art of the deal')
    // "the" at position 0 should be capitalised; middle "the" should be lowercase
    expect(result.startsWith('The')).toBe(true)
    expect(result).toContain(' the ')
  })

  it('handles mixed case input', () => {
    const result = toTitleCase('HELLO WORLD')
    expect(result).toBe('Hello World')
  })
})

// ─── buildShortTitle ─────────────────────────────────────────────────────────

describe('buildShortTitle', () => {
  it('returns empty string for empty input', () => {
    expect(buildShortTitle('')).toBe('')
  })

  it('returns full title when within maxWords', () => {
    expect(buildShortTitle('Short Title', 5)).toBe('Short Title')
  })

  it('strips content after pipe character', () => {
    const result = buildShortTitle('Main Title | Extra Info', 10)
    expect(result).not.toContain('Extra Info')
    expect(result).not.toContain('|')
  })

  it('strips content after colon', () => {
    const result = buildShortTitle('Main Title: Subtitle Here', 10)
    expect(result).not.toContain('Subtitle Here')
  })

  it('extracts content words and limits to maxWords', () => {
    const result = buildShortTitle('The Art of Building Great Software Systems', 3)
    const words = result.split(' ')
    expect(words.length).toBeLessThanOrEqual(3)
  })

  it('returns title-cased output', () => {
    const result = buildShortTitle('hello world example', 5)
    expect(result[0]).toBe(result[0].toUpperCase())
  })
})
