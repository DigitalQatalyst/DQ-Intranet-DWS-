import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ServiceDetailPage from '../src/pages/guides/ServiceDetailPage'

// Mock the auth context
vi.mock('../src/components/Header/context/AuthContext', () => ({
  useAuth: () => ({ user: null })
}))

// Mock the supabase client
vi.mock('../src/lib/supabaseClient', () => ({
  supabaseClient: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  }
}))

// Mock react-router-dom params
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: () => vi.fn()
  }
})

/**
 * Preservation Property Tests
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
 * 
 * IMPORTANT: Follow observation-first methodology
 * These tests observe behavior on UNFIXED code for non-GHC services
 * EXPECTED OUTCOME: Tests PASS (this confirms baseline behavior to preserve)
 * 
 * Property 2: Preservation - Non-GHC Service Behavior Unchanged
 * For any service ID that does NOT correspond to a GHC element, the fixed ServiceDetailPage 
 * SHALL produce exactly the same behavior as the original component
 */
describe('Property 2: Preservation - Non-GHC Service Behavior Unchanged', () => {
  const GHC_SERVICE_IDS = [
    'ghc',
    'dq-vision', 
    'dq-hov',
    'dq-persona',
    'dq-agile-tms',
    'dq-agile-sos',
    'dq-agile-flows',
    'dq-agile-6xd'
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * OBSERVATION-FIRST: Test the actual current behavior for non-GHC services
   * This captures what actually happens on unfixed code - services show "Service Not Found"
   * This test should PASS on unfixed code, establishing the baseline behavior to preserve
   */
  it('should preserve current "Not Found" behavior for non-existent non-GHC services (EXPECTED TO PASS)', async () => {
    const nonGHCServiceId = 'dq-associate-guidelines'
    const { useParams } = await import('react-router-dom')
    const { supabaseClient } = await import('../src/lib/supabaseClient')
    
    // Ensure this is NOT a GHC service
    expect(GHC_SERVICE_IDS).not.toContain(nonGHCServiceId)
    
    vi.mocked(useParams).mockReturnValue({ itemId: nonGHCServiceId })
    
    // Mock the actual current behavior - service not found (this is what happens in reality)
    vi.mocked(supabaseClient.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'No rows returned' }
          })
        })
      })
    } as any)

    render(
      <BrowserRouter>
        <ServiceDetailPage />
      </BrowserRouter>
    )

    // Wait for component to load
    await waitFor(() => {
      expect(screen.queryByText('Loading service details…')).not.toBeInTheDocument()
    })

    // PRESERVATION ASSERTION 1: Current error handling behavior is preserved (Requirement 3.1)
    expect(screen.getByText('Not Found')).toBeInTheDocument()
    expect(screen.getByText("We couldn't locate that service guideline.")).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /back to marketplace/i })).toBeInTheDocument()

    // PRESERVATION ASSERTION 2: Should NOT show any GHC-specific content or tabs
    expect(screen.queryByRole('button', { name: /overview/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /understand/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /learn & practice/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /other materials/i })).not.toBeInTheDocument()

    // PRESERVATION ASSERTION 3: Should NOT show service-specific tabs either
    expect(screen.queryByRole('button', { name: /service details/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /how to request/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /faq/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /contact & sla/i })).not.toBeInTheDocument()

    // PRESERVATION ASSERTION 4: Header and footer structure is preserved (Requirement 3.3)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  /**
   * Property-based test with multiple non-GHC service scenarios
   * This tests the actual current behavior - all non-existent services show "Service Not Found"
   */
  const nonGHCServiceScenarios = [
    'dq-associate-guidelines',
    'it-support-service', 
    'hr-onboarding-service',
    'finance-reporting-service',
    'legal-compliance-service'
  ]

  nonGHCServiceScenarios.forEach(serviceId => {
    it(`should preserve "Not Found" behavior for non-GHC service: ${serviceId} (EXPECTED TO PASS)`, async () => {
      const { useParams } = await import('react-router-dom')
      const { supabaseClient } = await import('../src/lib/supabaseClient')
      
      // Ensure this is NOT a GHC service
      expect(GHC_SERVICE_IDS).not.toContain(serviceId)
      
      vi.mocked(useParams).mockReturnValue({ itemId: serviceId })
      
      // Mock the actual current behavior - service not found
      vi.mocked(supabaseClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'No rows returned' }
            })
          })
        })
      } as any)

      render(
        <BrowserRouter>
          <ServiceDetailPage />
        </BrowserRouter>
      )

      await waitFor(() => {
        expect(screen.queryByText('Loading service details…')).not.toBeInTheDocument()
      })

      // PRESERVATION ASSERTION: All non-GHC services maintain the same "Not Found" behavior
      expect(screen.getByText('Not Found')).toBeInTheDocument()
      expect(screen.getByText("We couldn't locate that service guideline.")).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /back to marketplace/i })).toBeInTheDocument()
      
      // Should not show any service-specific content or tabs
      expect(screen.queryByRole('button', { name: /service details/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /understand/i })).not.toBeInTheDocument()
      expect(screen.queryByText('Service Summary')).not.toBeInTheDocument()
      expect(screen.queryByText('Related Services')).not.toBeInTheDocument()
    })
  })

  /**
   * Test for page layout and styling preservation in error state
   * This ensures the current responsive design and styling remain unchanged for error cases
   */
  it('should preserve page layout and styling for error state (EXPECTED TO PASS)', async () => {
    const nonGHCServiceId = 'non-existent-service'
    const { useParams } = await import('react-router-dom')
    const { supabaseClient } = await import('../src/lib/supabaseClient')
    
    vi.mocked(useParams).mockReturnValue({ itemId: nonGHCServiceId })
    
    vi.mocked(supabaseClient.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'No rows returned' }
          })
        })
      })
    } as any)

    render(
      <BrowserRouter>
        <ServiceDetailPage />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText('Loading service details…')).not.toBeInTheDocument()
    })

    // PRESERVATION ASSERTION 1: Header structure is preserved (Requirement 3.3)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()

    // PRESERVATION ASSERTION 2: Main content structure is preserved even in error state (Requirement 3.3)
    expect(screen.getByText('Not Found')).toBeInTheDocument()

    // PRESERVATION ASSERTION 3: Footer is preserved (Requirement 3.3)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()

    // PRESERVATION ASSERTION 4: Background styling is preserved
    const mainContainer = document.querySelector('.min-h-screen')
    expect(mainContainer).toBeInTheDocument()
  })
})