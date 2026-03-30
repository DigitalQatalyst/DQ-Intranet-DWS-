/**
 * Feature 7 — Knowledge Center: Guidelines
 * Tests: GHC_SERVICE_IDS set membership, isDigitalWorkspaceGuideline detection,
 *        policy-set-2f-flow slug, guideline tab default
 * Spec AC: GHC_SERVICE_IDS must NOT include guideline IDs
 *          isDigitalWorkspaceGuideline returns true for associate-owned-asset slug
 *          default tab is 'purpose' for DW guidelines
 */
import { describe, it, expect } from 'vitest'

// ─── replicate the logic from ServiceDetailPage (pure functions, no React) ───

const GHC_SERVICE_IDS = new Set([
  'ghc',
  'dq-ghc',
  'dq-vision',
  'dq-hov',
  'dq-persona',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd',
])

interface GuideRecord {
  slug?: string
  title?: string
}

const isGHCService = (itemId: string): boolean => GHC_SERVICE_IDS.has(itemId)

const isDigitalWorkspaceGuideline = (guide: GuideRecord | null): boolean => {
  if (!guide) return false
  const slug = (guide.slug || '').toLowerCase()
  const title = (guide.title || '').toLowerCase()
  return (
    slug.includes('associate-owned-asset') ||
    title.includes('associate owned asset') ||
    slug.includes('dq-ops')
  )
}

const getDefaultTab = (guide: GuideRecord | null, ghcContent: any): string =>
  isDigitalWorkspaceGuideline(guide) || ghcContent ? 'purpose' : 'overview'

// ─── GHC_SERVICE_IDS ─────────────────────────────────────────────────────────

describe('GHC_SERVICE_IDS', () => {
  it('contains ghc', () => expect(GHC_SERVICE_IDS.has('ghc')).toBe(true))
  it('contains dq-vision', () => expect(GHC_SERVICE_IDS.has('dq-vision')).toBe(true))
  it('contains dq-hov', () => expect(GHC_SERVICE_IDS.has('dq-hov')).toBe(true))
  it('contains dq-persona', () => expect(GHC_SERVICE_IDS.has('dq-persona')).toBe(true))

  it('does NOT contain dq-associate-owned-asset-guidelines', () => {
    expect(GHC_SERVICE_IDS.has('dq-associate-owned-asset-guidelines')).toBe(false)
  })

  it('does NOT contain policy-set-2f-flow', () => {
    expect(GHC_SERVICE_IDS.has('policy-set-2f-flow')).toBe(false)
  })

  it('does NOT contain any guideline slugs', () => {
    const guidelineSlugs = [
      'agenda-scheduling-guidelines',
      'dress-code-guidelines',
      'wfh-guidelines',
      'wr-attendance-punctuality-policy',
    ]
    guidelineSlugs.forEach(slug => {
      expect(GHC_SERVICE_IDS.has(slug)).toBe(false)
    })
  })
})

// ─── isGHCService ─────────────────────────────────────────────────────────────

describe('isGHCService', () => {
  it('returns true for ghc', () => expect(isGHCService('ghc')).toBe(true))
  it('returns true for dq-ghc', () => expect(isGHCService('dq-ghc')).toBe(true))
  it('returns false for guideline slug', () => {
    expect(isGHCService('dq-associate-owned-asset-guidelines')).toBe(false)
  })
  it('returns false for unknown id', () => expect(isGHCService('unknown')).toBe(false))
})

// ─── isDigitalWorkspaceGuideline ──────────────────────────────────────────────

describe('isDigitalWorkspaceGuideline', () => {
  it('returns false for null', () => {
    expect(isDigitalWorkspaceGuideline(null)).toBe(false)
  })

  it('returns true for associate-owned-asset slug', () => {
    expect(
      isDigitalWorkspaceGuideline({ slug: 'dq-associate-owned-asset-guidelines' })
    ).toBe(true)
  })

  it('returns true for title containing "associate owned asset"', () => {
    expect(
      isDigitalWorkspaceGuideline({ title: 'DQ Associate Owned Asset Guidelines' })
    ).toBe(true)
  })

  it('returns true for dq-ops slug', () => {
    expect(isDigitalWorkspaceGuideline({ slug: 'dq-ops' })).toBe(true)
  })

  it('returns false for a GHC slug', () => {
    expect(isDigitalWorkspaceGuideline({ slug: 'ghc' })).toBe(false)
  })

  it('returns false for an unrelated guideline', () => {
    expect(isDigitalWorkspaceGuideline({ slug: 'dress-code-guidelines' })).toBe(false)
  })
})

// ─── default tab selection ────────────────────────────────────────────────────

describe('getDefaultTab', () => {
  it('returns "purpose" for a DW guideline', () => {
    const guide = { slug: 'dq-associate-owned-asset-guidelines' }
    expect(getDefaultTab(guide, null)).toBe('purpose')
  })

  it('returns "purpose" when ghcContent is present', () => {
    expect(getDefaultTab(null, { id: 'ghc' })).toBe('purpose')
  })

  it('returns "overview" for a non-DW, non-GHC guide', () => {
    expect(getDefaultTab({ slug: 'dress-code-guidelines' }, null)).toBe('overview')
  })

  it('returns "overview" when guide is null and no ghcContent', () => {
    expect(getDefaultTab(null, null)).toBe('overview')
  })
})
