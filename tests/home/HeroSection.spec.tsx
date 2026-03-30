/**
 * Feature 1 — DWS Landing (Home)
 * Tests: hero CTA navigation, AI search bar disabled/coming-soon state
 * Spec AC: "Start Your Onboarding Journey" → /onboarding/welcome
 *          AI search bar renders in disabled/coming-soon state
 */
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// ─── mock heavy deps ──────────────────────────────────────────────────────────
vi.mock('@/components/ParticleWaveBackground', () => ({
  default: () => <div data-testid="particle-bg" />,
}))
vi.mock('@/components/AnimationUtils', () => ({
  AnimatedText: ({ text }: { text: string }) => <span>{text}</span>,
  FadeInUpOnScroll: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  StaggeredFadeIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
vi.mock('@/components/Header', () => ({
  useAuth: () => ({ user: null, login: vi.fn() }),
  Header: () => <header />,
}))
vi.mock('@/data/landingPageContent', () => ({
  heroContent: { title: 'DWS Hero', subtitle: 'Subtitle text' },
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

import HeroSection from '@/components/HeroSection'

const renderHero = () =>
  render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>
  )

describe('HeroSection — AI search bar', () => {
  it('renders the search input in disabled state', () => {
    renderHero()
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('shows "Coming Soon" badge on the search bar', () => {
    renderHero()
    expect(screen.getByText(/coming soon/i)).toBeTruthy()
  })

  it('renders the lock button as disabled', () => {
    renderHero()
    const buttons = screen.getAllByRole('button')
    const lockBtn = buttons.find(b => b.hasAttribute('disabled') && !b.textContent?.includes('Browse'))
    expect(lockBtn).toBeTruthy()
  })
})

describe('HeroSection — CTA navigation', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  it('navigates to /onboarding/welcome when "Start Your Onboarding Journey" is clicked', () => {
    renderHero()
    const btn = screen.getByText(/start your onboarding journey/i)
    fireEvent.click(btn)
    expect(mockNavigate).toHaveBeenCalledWith('/onboarding/welcome')
  })

  it('"Browse Marketplaces" button is present', () => {
    renderHero()
    expect(screen.getByText(/browse marketplaces/i)).toBeTruthy()
  })
})
