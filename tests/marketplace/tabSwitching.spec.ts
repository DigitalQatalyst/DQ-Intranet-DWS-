/**
 * Target 4 — MarketplacePage tab switching
 * Tests: parseGuideTab defaults, valid tab parsing, buildTabChangeParams
 *        preserves/clears correct params, parseDesignSystemTab ordering
 * No production files changed — pure utility function tests.
 */
import { describe, it, expect } from 'vitest'
import {
  parseGuideTab,
  buildTabChangeParams,
  parseDesignSystemTab,
  parseServiceTab,
  VALID_GUIDE_TABS,
} from '@/components/marketplace/MarketplaceUtils'

// ─── parseGuideTab ────────────────────────────────────────────────────────────

describe('parseGuideTab', () => {
  it('defaults to "guidelines" when no tab param', () => {
    expect(parseGuideTab(new URLSearchParams())).toBe('guidelines')
  })

  it('defaults to "guidelines" for unknown tab value', () => {
    expect(parseGuideTab(new URLSearchParams('tab=unknown'))).toBe('guidelines')
  })

  it('returns "strategy" for tab=strategy', () => {
    expect(parseGuideTab(new URLSearchParams('tab=strategy'))).toBe('strategy')
  })

  it('returns "6xd" for tab=6xd', () => {
    expect(parseGuideTab(new URLSearchParams('tab=6xd'))).toBe('6xd')
  })

  it('returns "blueprints" for tab=blueprints', () => {
    expect(parseGuideTab(new URLSearchParams('tab=blueprints'))).toBe('blueprints')
  })

  it('returns "testimonials" for tab=testimonials', () => {
    expect(parseGuideTab(new URLSearchParams('tab=testimonials'))).toBe('testimonials')
  })

  it('returns "glossary" for tab=glossary', () => {
    expect(parseGuideTab(new URLSearchParams('tab=glossary'))).toBe('glossary')
  })

  it('returns "faqs" for tab=faqs', () => {
    expect(parseGuideTab(new URLSearchParams('tab=faqs'))).toBe('faqs')
  })

  it('all VALID_GUIDE_TABS are parseable', () => {
    VALID_GUIDE_TABS.forEach(tab => {
      expect(parseGuideTab(new URLSearchParams(`tab=${tab}`))).toBe(tab)
    })
  })
})

// ─── buildTabChangeParams ─────────────────────────────────────────────────────

describe('buildTabChangeParams', () => {
  it('removes "tab" param when switching to guidelines (default)', () => {
    const params = new URLSearchParams('tab=strategy&q=test')
    const result = buildTabChangeParams('guidelines', params)
    expect(result.has('tab')).toBe(false)
  })

  it('sets "tab" param for non-guidelines tabs', () => {
    const params = new URLSearchParams()
    const result = buildTabChangeParams('strategy', params)
    expect(result.get('tab')).toBe('strategy')
  })

  it('removes "page" param on tab change', () => {
    const params = new URLSearchParams('tab=strategy&page=3')
    const result = buildTabChangeParams('guidelines', params)
    expect(result.has('page')).toBe(false)
  })

  it('preserves search query "q" across tab changes', () => {
    const params = new URLSearchParams('q=ghc&tab=strategy')
    const result = buildTabChangeParams('guidelines', params)
    expect(result.get('q')).toBe('ghc')
  })

  it('switching to blueprints sets tab=blueprints', () => {
    const params = new URLSearchParams()
    const result = buildTabChangeParams('blueprints', params)
    expect(result.get('tab')).toBe('blueprints')
  })

  it('switching to faqs sets tab=faqs', () => {
    const params = new URLSearchParams()
    const result = buildTabChangeParams('faqs', params)
    expect(result.get('tab')).toBe('faqs')
  })

  it('switching away from blueprints removes blueprint filter keys', () => {
    const params = new URLSearchParams('tab=blueprints&product_type=platform&product_stage=mvp')
    const result = buildTabChangeParams('guidelines', params)
    expect(result.has('product_type')).toBe(false)
    expect(result.has('product_stage')).toBe(false)
  })
})

// ─── parseDesignSystemTab ─────────────────────────────────────────────────────

describe('parseDesignSystemTab', () => {
  it('defaults to "cids" when no tab param', () => {
    expect(parseDesignSystemTab(new URLSearchParams())).toBe('cids')
  })

  it('returns "vds" for tab=vds', () => {
    expect(parseDesignSystemTab(new URLSearchParams('tab=vds'))).toBe('vds')
  })

  it('returns "cds" for tab=cds', () => {
    expect(parseDesignSystemTab(new URLSearchParams('tab=cds'))).toBe('cds')
  })

  it('defaults to "cids" for unknown tab', () => {
    expect(parseDesignSystemTab(new URLSearchParams('tab=unknown'))).toBe('cids')
  })
})

// ─── parseServiceTab ──────────────────────────────────────────────────────────

describe('parseServiceTab', () => {
  it('defaults to "technology" when no tab param', () => {
    expect(parseServiceTab(new URLSearchParams())).toBe('technology')
  })

  it('returns "business" for tab=business', () => {
    expect(parseServiceTab(new URLSearchParams('tab=business'))).toBe('business')
  })

  it('returns "digital_worker" for tab=digital_worker', () => {
    expect(parseServiceTab(new URLSearchParams('tab=digital_worker'))).toBe('digital_worker')
  })

  it('defaults to "technology" for unknown tab', () => {
    expect(parseServiceTab(new URLSearchParams('tab=invalid'))).toBe('technology')
  })
})
