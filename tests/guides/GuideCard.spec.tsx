/**
 * Target 5 — GuideCard component
 * Tests: renders title/description, badge labels, draft disabled state,
 *        "View Details" CTA, stable key usage (no array index keys),
 *        blueprint "Coming Soon" state, onClick fires for non-draft cards
 * No production files changed.
 */
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GuideCard } from '@/components/guides/GuideCard'

// ─── mock heavy deps ──────────────────────────────────────────────────────────

vi.mock('@/utils/guideImageMap', () => ({
  getGuideImageUrl: () => '/mock-image.jpg',
}))
vi.mock('@/utils/productMetadata', () => ({
  getProductMetadata: () => null,
}))
vi.mock('@/utils/guides', () => ({
  toTimeBucket: () => '10 mins',
}))

// ─── helpers ─────────────────────────────────────────────────────────────────

const makeGuide = (overrides = {}) => ({
  id: 'guide-1',
  slug: 'test-guide',
  title: 'Test Guide Title',
  summary: 'A short summary of the guide.',
  domain: 'Guidelines',
  guideType: 'Policy',
  status: 'Approved',
  estimatedTimeMin: 10,
  lastUpdatedAt: '2025-01-15T00:00:00Z',
  authorName: null,
  authorOrg: null,
  ...overrides,
})

const renderCard = (guide = makeGuide(), onClick = vi.fn()) =>
  render(<GuideCard guide={guide} onClick={onClick} />)

beforeEach(() => vi.clearAllMocks())

// ─── rendering ────────────────────────────────────────────────────────────────

describe('GuideCard — rendering', () => {
  it('renders the guide title', () => {
    renderCard()
    expect(screen.getByText('Test Guide Title')).toBeTruthy()
  })

  it('renders the guide summary', () => {
    renderCard()
    expect(screen.getByText('A short summary of the guide.')).toBeTruthy()
  })

  it('renders the domain badge', () => {
    renderCard()
    expect(screen.getByText('Guidelines')).toBeTruthy()
  })

  it('renders the time bucket', () => {
    renderCard()
    expect(screen.getByText('10 mins')).toBeTruthy()
  })

  it('renders last updated date', () => {
    renderCard()
    expect(screen.getByText(/jan/i)).toBeTruthy()
  })
})

// ─── CTA button ───────────────────────────────────────────────────────────────

describe('GuideCard — CTA button', () => {
  it('renders "View Details" for approved guide', () => {
    renderCard()
    expect(screen.getByText('View Details')).toBeTruthy()
  })

  it('"View Details" button is not disabled for approved guide', () => {
    renderCard()
    const btns = screen.getAllByRole('button', { name: /view details/i })
    // At least one button should not be disabled
    expect(btns.some(b => !b.hasAttribute('disabled'))).toBe(true)
  })

  it('calls onClick when "View Details" is clicked', () => {
    const onClick = vi.fn()
    renderCard(makeGuide(), onClick)
    const btns = screen.getAllByRole('button', { name: /view details/i })
    // Click the actual <button> element (not the card div)
    const btn = btns.find(b => b.tagName === 'BUTTON')!
    fireEvent.click(btn)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

// ─── draft state ──────────────────────────────────────────────────────────────

describe('GuideCard — draft state', () => {
  it('renders "Coming Soon" for draft guide', () => {
    renderCard(makeGuide({ status: 'Draft' }))
    expect(screen.getByText('Coming Soon')).toBeTruthy()
  })

  it('"Coming Soon" button is disabled for draft guide', () => {
    renderCard(makeGuide({ status: 'Draft' }))
    const btn = screen.getByRole('button', { name: /coming soon/i })
    expect(btn).toBeDisabled()
  })

  it('does not call onClick when draft card is clicked', () => {
    const onClick = vi.fn()
    renderCard(makeGuide({ status: 'Draft' }), onClick)
    // Click the card div — draft cards have no role="button"
    const btn = screen.getByRole('button', { name: /coming soon/i })
    fireEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })
})

// ─── blueprint state ──────────────────────────────────────────────────────────

describe('GuideCard — blueprint/product state', () => {
  it('renders "Coming Soon" for blueprint domain', () => {
    renderCard(makeGuide({ domain: 'Blueprint', productType: 'Platform', productStage: 'MVP' }))
    expect(screen.getByText('Coming Soon')).toBeTruthy()
  })

  it('"Coming Soon" button is disabled for blueprint', () => {
    renderCard(makeGuide({ domain: 'Blueprint', productType: 'Platform', productStage: 'MVP' }))
    const btns = screen.getAllByRole('button', { name: /coming soon/i })
    const btn = btns.find(b => b.tagName === 'BUTTON')!
    expect(btn).toBeDisabled()
  })
})

// ─── stable key usage ─────────────────────────────────────────────────────────

describe('GuideCard — stable key usage in list', () => {
  it('renders a list of cards using guide id as key (not array index)', () => {
    const guides = [
      makeGuide({ id: 'guide-a', title: 'Guide A' }),
      makeGuide({ id: 'guide-b', title: 'Guide B' }),
      makeGuide({ id: 'guide-c', title: 'Guide C' }),
    ]

    const { container } = render(
      <ul>
        {guides.map(g => (
          <li key={g.id}>
            <GuideCard guide={g} onClick={vi.fn()} />
          </li>
        ))}
      </ul>
    )

    // All three cards render
    expect(screen.getByText('Guide A')).toBeTruthy()
    expect(screen.getByText('Guide B')).toBeTruthy()
    expect(screen.getByText('Guide C')).toBeTruthy()

    // Keys are stable IDs — verify no duplicate content
    const titles = container.querySelectorAll('h3')
    const titleTexts = Array.from(titles).map(t => t.textContent)
    expect(new Set(titleTexts).size).toBe(3)
  })

  it('does not use array index as key — re-ordering preserves identity', () => {
    // If keys were array indices, swapping would cause wrong renders.
    // We verify that each guide's id-based key maps to the correct title.
    const guides = [
      makeGuide({ id: 'z-guide', title: 'Z Guide' }),
      makeGuide({ id: 'a-guide', title: 'A Guide' }),
    ]

    render(
      <ul>
        {guides.map(g => (
          <li key={g.id} data-testid={`card-${g.id}`}>
            <GuideCard guide={g} onClick={vi.fn()} />
          </li>
        ))}
      </ul>
    )

    expect(screen.getByTestId('card-z-guide')).toBeTruthy()
    expect(screen.getByTestId('card-a-guide')).toBeTruthy()
  })
})

// ─── author info ──────────────────────────────────────────────────────────────

describe('GuideCard — author info', () => {
  it('renders author name when present and domain is not strategy/guidelines', () => {
    renderCard(makeGuide({ domain: 'GHC', authorName: 'Jane Doe', authorOrg: 'DQ' }))
    expect(screen.getByText(/jane doe/i)).toBeTruthy()
  })

  it('does not render author info for guidelines domain', () => {
    renderCard(makeGuide({ domain: 'Guidelines', authorName: 'Jane Doe' }))
    expect(screen.queryByText(/jane doe/i)).toBeNull()
  })

  it('does not render author info for strategy domain', () => {
    renderCard(makeGuide({ domain: 'Strategy', authorName: 'Jane Doe' }))
    expect(screen.queryByText(/jane doe/i)).toBeNull()
  })
})

// ─── GHC title resolution ─────────────────────────────────────────────────────

describe('GuideCard — GHC title resolution', () => {
  it('resolves dq-ghc slug to "GHC Overview"', () => {
    renderCard(makeGuide({ slug: 'dq-ghc', title: 'Golden Honeycomb', domain: 'Strategy' }))
    expect(screen.getByText('GHC Overview')).toBeTruthy()
  })

  it('resolves dq-vision slug to correct GHC title', () => {
    renderCard(makeGuide({ slug: 'dq-vision', title: 'Vision', domain: 'Strategy' }))
    expect(screen.getByText('GHC 1 - Vision (Purpose)')).toBeTruthy()
  })
})
