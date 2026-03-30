/**
 * Feature 4 — Media Center: News & Announcements
 * Tests: ErrorState renders loading vs not-found states, back button navigation
 * Spec AC: Error state renders gracefully when article ID is not found
 */
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ search: '' }),
  }
})

import { ErrorState } from '@/components/media-center/detail/ErrorState'

const renderError = (props: { isLoading: boolean; loadError: string | null }) =>
  render(
    <MemoryRouter>
      <ErrorState {...props} />
    </MemoryRouter>
  )

describe('ErrorState — loading state', () => {
  it('shows "Loading article" heading when isLoading is true', () => {
    renderError({ isLoading: true, loadError: null })
    expect(screen.getByText(/loading article/i)).toBeTruthy()
  })

  it('shows loading description text', () => {
    renderError({ isLoading: true, loadError: null })
    expect(screen.getByText(/fetching the latest details/i)).toBeTruthy()
  })

  it('does not show error message when loading', () => {
    renderError({ isLoading: true, loadError: 'some error' })
    expect(screen.queryByText(/some error/i)).toBeNull()
  })
})

describe('ErrorState — not found state', () => {
  it('shows "Article not found" heading when not loading', () => {
    renderError({ isLoading: false, loadError: null })
    expect(screen.getByText(/article not found/i)).toBeTruthy()
  })

  it('shows archived/unavailable description', () => {
    renderError({ isLoading: false, loadError: null })
    expect(screen.getByText(/unavailable or has been archived/i)).toBeTruthy()
  })

  it('shows loadError message when present and not loading', () => {
    renderError({ isLoading: false, loadError: 'Network error' })
    expect(screen.getByText(/network error/i)).toBeTruthy()
  })
})

describe('ErrorState — back button', () => {
  beforeEach(() => mockNavigate.mockClear())

  it('renders "Back to Media Center" button', () => {
    renderError({ isLoading: false, loadError: null })
    expect(screen.getByText(/back to media center/i)).toBeTruthy()
  })

  it('navigates to /marketplace/media-center on back click', () => {
    renderError({ isLoading: false, loadError: null })
    fireEvent.click(screen.getByText(/back to media center/i))
    expect(mockNavigate).toHaveBeenCalledWith('/marketplace/media-center')
  })
})
