import { describe, it, expect } from 'vitest'
import { parseFacets, applyFilters } from '@/lms/filters'

// ─── parseFacets ──────────────────────────────────────────────────────────────

describe('parseFacets', () => {
  it('returns empty facets (empty arrays) for empty URLSearchParams', () => {
    const facets = parseFacets(new URLSearchParams())
    // parseFacets returns [] for level when no params are set (normalizeLevels returns [])
    expect(facets.category).toBeUndefined()
    expect(facets.delivery).toBeUndefined()
    expect(facets.level).toEqual([])
  })

  it('parses a single category', () => {
    const facets = parseFacets(new URLSearchParams('category=GHC'))
    expect(facets.category).toEqual(['GHC'])
  })

  it('parses multiple comma-separated categories', () => {
    const facets = parseFacets(new URLSearchParams('category=GHC,6xD'))
    expect(facets.category).toEqual(['GHC', '6xD'])
  })

  it('parses delivery mode', () => {
    const facets = parseFacets(new URLSearchParams('delivery=Online'))
    expect(facets.delivery).toEqual(['Online'])
  })

  it('filters out disallowed locations', () => {
    // Only allowed locations should pass through
    const facets = parseFacets(new URLSearchParams('location=InvalidCity'))
    expect(facets.location).toEqual([])
  })
})

// ─── applyFilters ─────────────────────────────────────────────────────────────

describe('applyFilters', () => {
  const courses = [
    { id: '1', courseCategory: 'GHC', deliveryMode: 'Online', levelCode: 'L1', locations: ['Dubai'] },
    { id: '2', courseCategory: '6xD', deliveryMode: 'In-Person', levelCode: 'L2', locations: ['Riyadh'] },
    { id: '3', courseCategory: 'GHC', deliveryMode: 'Online', levelCode: 'L3', locations: ['Nairobi'] },
  ]

  it('returns all items when no facets applied', () => {
    expect(applyFilters(courses, {})).toHaveLength(3)
  })

  it('filters by category', () => {
    const result = applyFilters(courses, { category: ['GHC'] })
    expect(result).toHaveLength(2)
    result.forEach(c => expect(c.courseCategory).toBe('GHC'))
  })

  it('filters by delivery mode', () => {
    const result = applyFilters(courses, { delivery: ['Online'] })
    expect(result).toHaveLength(2)
  })

  it('filters by level', () => {
    const result = applyFilters(courses, { level: ['L1'] as any })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })

  it('combines multiple filters (AND logic)', () => {
    const result = applyFilters(courses, { category: ['GHC'], delivery: ['Online'] })
    expect(result).toHaveLength(2)
  })

  it('returns empty array when no items match', () => {
    const result = applyFilters(courses, { category: ['NonExistent'] })
    expect(result).toHaveLength(0)
  })

  it('Riyadh courses match any selected location', () => {
    // Course 2 has locations: ['Riyadh'] — should match Dubai filter due to Riyadh rule
    const result = applyFilters(courses, { location: ['Dubai'] })
    const ids = result.map(c => c.id)
    expect(ids).toContain('2') // Riyadh matches any location
    expect(ids).toContain('1') // Dubai matches Dubai
  })
})
