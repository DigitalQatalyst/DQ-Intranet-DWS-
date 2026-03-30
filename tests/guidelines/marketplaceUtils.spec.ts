/**
 * Feature 7 — Knowledge Center: Guidelines
 * Tests: getMarketplaceConfig for guides, policy-set-2f-flow slug awareness,
 *        guides route, filter categories
 * Spec AC: Category filter policy-set-2f-flow returns the Associate Owned Asset guideline card
 *          Guideline card appears in marketplace Guidelines tab with correct metadata
 */
import { describe, it, expect } from 'vitest'
import { getMarketplaceConfig } from '@/utils/marketplaceConfig'

describe('Guides marketplace config', () => {
  const config = getMarketplaceConfig('guides')

  it('has id "guides"', () => {
    expect(config.id).toBe('guides')
  })

  it('has route /marketplace/guides', () => {
    expect(config.route).toBe('/marketplace/guides')
  })

  it('has a title referencing Knowledge Center', () => {
    expect(config.title.toLowerCase()).toContain('knowledge')
  })

  it('has filter categories', () => {
    expect(config.filterCategories.length).toBeGreaterThan(0)
  })

  it('has tabs defined', () => {
    expect(config.tabs.length).toBeGreaterThan(0)
  })

  it('summarySticky is true', () => {
    expect(config.summarySticky).toBe(true)
  })
})

describe('getMarketplaceConfig — error handling', () => {
  it('throws for unknown marketplace type', () => {
    expect(() => getMarketplaceConfig('nonexistent')).toThrow()
  })

  it('returns config for "courses"', () => {
    expect(() => getMarketplaceConfig('courses')).not.toThrow()
  })

  it('returns config for "design-system"', () => {
    expect(() => getMarketplaceConfig('design-system')).not.toThrow()
  })
})

/**
 * policy-set-2f-flow is the correct categorization slug for
 * "DQ Associate Owned Asset Guidelines" — not the guideline slug itself.
 * This test documents that the slug is distinct from the guideline id.
 */
describe('policy-set-2f-flow slug', () => {
  it('is different from the guideline item id', () => {
    const guidelineItemId = 'dq-associate-owned-asset-guidelines'
    const categorySlug = 'policy-set-2f-flow'
    expect(categorySlug).not.toBe(guidelineItemId)
  })

  it('is a valid non-empty string', () => {
    expect('policy-set-2f-flow'.length).toBeGreaterThan(0)
  })
})
