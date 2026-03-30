import { describe, it, expect } from 'vitest'
import { formatDurationFromMinutes } from '@/utils/durationFormatter'

describe('formatDurationFromMinutes', () => {
  it('returns 0 min for undefined', () => {
    expect(formatDurationFromMinutes(undefined)).toBe('0 min')
  })

  it('returns 0 min for null', () => {
    expect(formatDurationFromMinutes(null)).toBe('0 min')
  })

  it('returns 0 min for 0', () => {
    expect(formatDurationFromMinutes(0)).toBe('0 min')
  })

  it('returns singular "min" for 1 minute', () => {
    expect(formatDurationFromMinutes(1)).toBe('1 min')
  })

  it('returns plural "mins" for 2+ minutes', () => {
    expect(formatDurationFromMinutes(45)).toBe('45 mins')
  })

  it('returns singular "hr" for exactly 60 minutes', () => {
    expect(formatDurationFromMinutes(60)).toBe('1hr')
  })

  it('returns plural "hrs" for exactly 120 minutes', () => {
    expect(formatDurationFromMinutes(120)).toBe('2hrs')
  })

  it('returns hours and minutes for 70 minutes', () => {
    expect(formatDurationFromMinutes(70)).toBe('1hr 10mins')
  })

  it('returns hours and singular min for 61 minutes', () => {
    expect(formatDurationFromMinutes(61)).toBe('1hr 1min')
  })

  it('returns correct format for 90 minutes', () => {
    expect(formatDurationFromMinutes(90)).toBe('1hr 30mins')
  })

  it('returns correct format for 150 minutes', () => {
    expect(formatDurationFromMinutes(150)).toBe('2hrs 30mins')
  })
})
