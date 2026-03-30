/**
 * Feature 2 — DWS Landing (Onboarding Journey)
 * Tests: 3 journey phases render, side nav sections present,
 *        "Back to Overview" → /onboarding/welcome
 * Spec AC: all 3 phases (Integrate, Apply, Amplify) render with correct content
 */
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// ─── mocks ───────────────────────────────────────────────────────────────────
vi.mock('@/components/Header', () => ({ Header: () => <header /> }))
vi.mock('@/components/Footer', () => ({ Footer: () => <footer /> }))
vi.mock('@/components/OnboardingChatbot', () => ({ OnboardingChatbot: () => null }))
vi.mock('@/pages/strategy/shared/GuidelineSection', () => ({
  GuidelineSection: ({ id, title, children }: any) => (
    <section id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

import { OnboardingJourney } from '@/pages/OnboardingJourney'

const renderPage = () =>
  render(
    <MemoryRouter>
      <OnboardingJourney />
    </MemoryRouter>
  )

describe('OnboardingJourney — 3 phases render', () => {
  it('renders Month 1 — Integrate', () => {
    renderPage()
    expect(screen.getAllByText(/integrate/i).length).toBeGreaterThan(0)
  })

  it('renders Month 2 — Apply', () => {
    renderPage()
    expect(screen.getAllByText(/apply/i).length).toBeGreaterThan(0)
  })

  it('renders Month 3 — Amplify', () => {
    renderPage()
    expect(screen.getAllByText(/amplify/i).length).toBeGreaterThan(0)
  })
})

describe('OnboardingJourney — side nav sections', () => {
  it('renders "Overall Philosophy" section', () => {
    renderPage()
    expect(screen.getAllByText(/overall philosophy/i).length).toBeGreaterThan(0)
  })

  it('renders "Progress Tracking" section', () => {
    renderPage()
    expect(screen.getAllByText(/progress tracking/i).length).toBeGreaterThan(0)
  })

  it('renders "Getting Started" section', () => {
    renderPage()
    expect(screen.getAllByText(/getting started/i).length).toBeGreaterThan(0)
  })
})

describe('OnboardingJourney — Back to Overview CTA', () => {
  beforeEach(() => mockNavigate.mockClear())

  it('renders "Back to Overview" button', () => {
    renderPage()
    expect(screen.getByText(/back to overview/i)).toBeTruthy()
  })

  it('navigates to /onboarding/welcome on "Back to Overview" click', () => {
    renderPage()
    fireEvent.click(screen.getByText(/back to overview/i))
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding/welcome')
  })
})

describe('OnboardingJourney — phase content', () => {
  it('renders primary question for Month 1', () => {
    renderPage()
    expect(
      screen.getByText(/do i understand how dq works/i)
    ).toBeTruthy()
  })

  it('renders theme for Month 2', () => {
    renderPage()
    expect(screen.getByText(/execution, consistency, confidence/i)).toBeTruthy()
  })

  it('renders Month 3 ownership theme', () => {
    renderPage()
    expect(screen.getByText(/ownership, impact, influence/i)).toBeTruthy()
  })
})
