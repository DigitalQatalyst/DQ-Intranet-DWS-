/**
 * Feature 2 — DWS Landing (Onboarding Journey)
 * Tests: hero CTA → /onboarding/journey, Explore GHC → /ghc,
 *        Explore Agile 6xD → /6xd, coming-soon buttons disabled
 * Spec AC: all onboarding S00 pages public (no auth required)
 */
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// ─── mocks ───────────────────────────────────────────────────────────────────
vi.mock('@/components/Header', () => ({
  Header: ({ toggleSidebar }: any) => (
    <header>
      <button onClick={toggleSidebar}>menu</button>
    </header>
  ),
}))
vi.mock('@/components/Footer', () => ({ Footer: () => <footer /> }))
vi.mock('@/components/AnimationUtils', () => ({
  FadeInUpOnScroll: ({ children }: any) => <>{children}</>,
  StaggeredFadeIn: ({ children }: any) => <>{children}</>,
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

import { OnboardingLanding } from '@/pages/OnboardingLanding'

const renderPage = () =>
  render(
    <MemoryRouter>
      <OnboardingLanding />
    </MemoryRouter>
  )

describe('OnboardingLanding — hero CTA', () => {
  beforeEach(() => mockNavigate.mockClear())

  it('renders the primary CTA button', () => {
    renderPage()
    expect(screen.getByText(/view the 3-month onboarding guide/i)).toBeTruthy()
  })

  it('navigates to /onboarding/journey on primary CTA click', () => {
    renderPage()
    fireEvent.click(screen.getByText(/view the 3-month onboarding guide/i))
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding/journey')
  })
})

describe('OnboardingLanding — GHC and 6xD CTAs', () => {
  beforeEach(() => mockNavigate.mockClear())

  it('navigates to /ghc when "Explore GHC" is clicked', () => {
    renderPage()
    fireEvent.click(screen.getByText(/explore ghc/i))
    expect(mockNavigate).toHaveBeenCalledWith('/ghc')
  })

  it('navigates to /6xd when "Explore Agile 6xD" is clicked', () => {
    renderPage()
    fireEvent.click(screen.getByText(/explore agile 6xd/i))
    expect(mockNavigate).toHaveBeenCalledWith('/6xd')
  })
})

describe('OnboardingLanding — coming-soon disabled state', () => {
  it('renders at least one disabled "Coming Soon" button', () => {
    renderPage()
    const disabledBtns = screen
      .getAllByRole('button')
      .filter(b => b.hasAttribute('disabled'))
    expect(disabledBtns.length).toBeGreaterThan(0)
  })

  it('disabled buttons contain "Coming Soon" text', () => {
    renderPage()
    const comingSoonBtns = screen
      .getAllByRole('button')
      .filter(b => b.hasAttribute('disabled') && /coming soon/i.test(b.textContent ?? ''))
    expect(comingSoonBtns.length).toBeGreaterThan(0)
  })

  it('disabled buttons cannot be clicked to navigate', () => {
    renderPage()
    const disabledBtns = screen
      .getAllByRole('button')
      .filter(b => b.hasAttribute('disabled'))
    disabledBtns.forEach(btn => fireEvent.click(btn))
    // navigate should NOT have been called for disabled buttons
    const navigateCalls = mockNavigate.mock.calls.map(c => c[0])
    expect(navigateCalls).not.toContain('/support/people-partner')
    expect(navigateCalls).not.toContain('/support/communication-center')
  })
})
