import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { GUIDE_CONTENT } from '../src/constants/guideContent'
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
 * Bug Condition Exploration Test
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * DO NOT attempt to fix the test or the code when it fails
 * 
 * This test encodes the expected behavior - it will validate the fix when it passes after implementation
 * GOAL: Surface counterexamples that demonstrate the bug exists
 */
describe('Property 1: Bug Condition - GHC Services Display Generic Content Instead of Specific Content', () => {
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
  // Mock generic service data that represents the current buggy behavior
  const mockGenericServiceData = {
    id: 'test-service',
    title: 'DQ Associate Owned Asset Guidelines',
    description: 'Generic guidelines content that appears for all GHC services',
    category: 'business',
    service_type: 'support',
    delivery_mode: 'online',
    provider: 'Digital Qatalyst',
    highlights: ['Generic highlight 1', 'Generic highlight 2']
  }

  /**
   * Property-based test that checks each GHC service ID
   * This test SHOULD FAIL on unfixed code because:
   * - GHC services currently display generic "DQ Associate Owned Asset Guidelines" content
   * - They should display specific content from GUIDE_CONTENT
   * - They should have 4 tabs instead of current tab structure
   * - They should show "[Element] Summary" instead of "Service Summary"
   */
  GHC_SERVICE_IDS.forEach(serviceId => {
    it(`should display specific content for GHC service: ${serviceId} (EXPECTED TO FAIL ON UNFIXED CODE)`, async () => {
      // Setup: Mock the service data fetch to return generic content (current buggy behavior)
      const { useParams } = await import('react-router-dom')
      const { supabaseClient } = await import('../src/lib/supabaseClient')
      
      vi.mocked(useParams).mockReturnValue({ itemId: serviceId })
      
      vi.mocked(supabaseClient.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { ...mockGenericServiceData, id: serviceId },
              error: null
            })
          })
        })
      } as any)

      // Get expected content from GUIDE_CONTENT
      const expectedContent = GUIDE_CONTENT[serviceId]
      expect(expectedContent).toBeDefined() // Ensure test data is valid

      // Render the component
      render(
        <BrowserRouter>
          <ServiceDetailPage />
        </BrowserRouter>
      )

      // Wait for component to load
      await waitFor(() => {
        expect(screen.queryByText('Loading service details…')).not.toBeInTheDocument()
      })

      // ASSERTION 1: Should display specific title from GUIDE_CONTENT, not generic title
      // This will FAIL on unfixed code because it shows "DQ Associate Owned Asset Guidelines"
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(expectedContent.title)

      // ASSERTION 2: Should display specific subtitle/description from GUIDE_CONTENT
      // This will FAIL on unfixed code because it shows generic description
      expect(screen.getByText(expectedContent.subtitle)).toBeInTheDocument()

      // ASSERTION 3: Should display 4 GHC-specific tabs: Overview, Understand, Learn & Practice, Other Materials
      // This will FAIL on unfixed code because it shows different tabs
      expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /understand/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /learn & practice/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /other materials/i })).toBeInTheDocument()

      // ASSERTION 4: Should NOT display the current generic tabs
      // This will FAIL on unfixed code because these tabs currently exist
      expect(screen.queryByRole('button', { name: /service details/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /how to request/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /faq/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /contact & sla/i })).not.toBeInTheDocument()
    })
  })

  /**
   * Scoped test for deterministic bug reproduction
   * Tests the concrete failing case to ensure reproducibility
   */
  it('should display Vision-specific content instead of generic guidelines (CONCRETE FAILING CASE)', async () => {
    const serviceId = 'dq-vision'
    const { useParams } = await import('react-router-dom')
    const { supabaseClient } = await import('../src/lib/supabaseClient')
    
    vi.mocked(useParams).mockReturnValue({ itemId: serviceId })
    
    vi.mocked(supabaseClient.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          maybeSingle: vi.fn().mockResolvedValue({
            data: mockGenericServiceData,
            error: null
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

    // Expected Vision content from GUIDE_CONTENT
    const visionContent = GUIDE_CONTENT['dq-vision']

    // These assertions will FAIL on unfixed code, proving the bug exists:
    
    // Should show "The Vision (Purpose)" not "DQ Associate Owned Asset Guidelines"
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(visionContent.title)
    
    // Should show Vision subtitle
    expect(screen.getByText(visionContent.subtitle)).toBeInTheDocument()
    
    // Should show Vision Summary in sidebar, not Service Summary
    expect(screen.getByText(/vision summary/i)).toBeInTheDocument()
    expect(screen.queryByText(/guideline summary/i)).not.toBeInTheDocument()
    
    // Should show Related Competencies, not Related Services
    expect(screen.getByText(/related competencies/i)).toBeInTheDocument()
    expect(screen.queryByText(/related services/i)).not.toBeInTheDocument()
  })
})