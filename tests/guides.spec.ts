import { describe, it, expect } from 'vitest'
import { toTimeBucket, fromBucketToRange, parseCsv, toCsv } from '../src/utils/guides'

describe('guides utils', () => {
  it('maps time to buckets', () => {
    expect(toTimeBucket(5)).toBe('Quick')
    expect(toTimeBucket(15)).toBe('Short')
    expect(toTimeBucket(45)).toBe('Medium')
    expect(toTimeBucket(90)).toBe('Deep Dive')
    expect(toTimeBucket(undefined)).toBeNull()
  })
  it('maps bucket to range', () => {
    expect(fromBucketToRange('Quick')).toEqual([0,9])
  })
  it('csv helpers', () => {
    expect(parseCsv('a,b, c')).toEqual(['a','b','c'])
    expect(toCsv(['x','y'])).toBe('x,y')
  })
})

