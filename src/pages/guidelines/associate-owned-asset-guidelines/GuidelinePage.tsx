import { useState, useEffect } from 'react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { knowledgeHubSupabase } from '../../../services/knowledgeHubClient'
import { HeroSection } from './HeroSection'
import { SideNav } from './SideNav'
import { HTMLProcessor } from '../../../components/guidelines/HTMLProcessor'

function GuidelinePage() {
  const { user } = useAuth()
  const [guideTitle, setGuideTitle] = useState<string>('DQ Associate Owned Asset Guidelines')
  const [guideHtml, setGuideHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Function to generate ID from heading text
  const generateId = (text: string): string => {
    return text
      .toLowerCase()
      .replaceAll(/[^\w\s-]/g, '')
      .replaceAll(' ', '-')
      .replaceAll('&nbsp;', '')
      .trim()
  }
  
  // Function to add IDs to headings in HTML
  const addIdsToHeadings = (html: string): string => {
    // Map of heading text to desired IDs (based on SideNav sections)
    const headingIdMap: Record<string, string> = {
      'context': 'context',
      'overview': 'overview',
      'purpose and scope': 'purpose-scope',
      'core components': 'core-components',
      'roles and responsibilities': 'roles-responsibilities',
      'byod bring your own device': 'byod',
      'procedure': 'byod-procedure', // First procedure is BYOD
      'responsibilities': 'byod-responsibilities', // First responsibilities is BYOD
      'fyod finance your own device': 'fyod',
      'hyod hold your own device': 'hyod',
      'guiding principles and controls': 'guiding-principles',
      'tools and resources': 'tools-resources',
      'key performance indicators kpis': 'kpis',
      'review and update schedule': 'review-schedule',
    }
    
    let procedureCount = 0
    let responsibilitiesCount = 0
    
    return html.replaceAll(/<(h[1-6])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, content) => { // NOSONAR - bounded HTML string from trusted DB
      // Clean the content for ID generation
      const cleanContent = content
        .replaceAll(/<[^>]+>/g, '') // NOSONAR - Remove HTML tags, bounded input
        .replaceAll('&nbsp;', ' ') // Replace &nbsp; with space
        .replaceAll('.', '') // Remove periods
        .trim()
        .toLowerCase()
      
      // Check if heading already has an id
      if (attrs.includes('id=')) {
        return match
      }
      
      // Generate ID based on content
      let id = headingIdMap[cleanContent] || generateId(cleanContent)
      
      // Handle duplicate "Procedure" and "Responsibilities" headings
      if (cleanContent === 'procedure') {
        procedureCount++
        if (procedureCount === 1) id = 'byod-procedure'
        else if (procedureCount === 2) id = 'fyod-procedure'
        else if (procedureCount === 3) id = 'hyod-procedure'
      } else if (cleanContent === 'responsibilities') {
        responsibilitiesCount++
        if (responsibilitiesCount === 1) id = 'byod-responsibilities'
        else if (responsibilitiesCount === 2) id = 'fyod-responsibilities'
        else if (responsibilitiesCount === 3) id = 'hyod-responsibilities'
      }
      
      return `<${tag}${attrs} id="${id}">${content}</${tag}>`
    })
  }
  
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const client = knowledgeHubSupabase ?? supabaseClient
        const { data, error } = await client
          .from('guides')
          .select('title, last_updated_at, body')
          .eq('slug', 'dq-associate-owned-asset-guidelines')
          .maybeSingle()
        
        if (error) throw error
        if (!cancelled && data) {
          setGuideTitle(data.title || 'DQ Associate Owned Asset Guidelines')
          if (data.last_updated_at) {
            // last_updated_at available for future use
          }
          
          // Store HTML directly (no JSON parsing)
          if (data.body) {
            // Replace literal \n with actual line breaks
            let processedHtml = (data.body as string).replaceAll(String.raw`\n`, '\n')
            
            // Strip leading pipe characters from headings (artifact from database content)
            processedHtml = processedHtml.replaceAll(/(<h[1-6][^>]*>)\s*\|\s*/gi, '$1')
            
            // Add IDs to headings for table of contents navigation
            processedHtml = addIdsToHeadings(processedHtml)
            
            setGuideHtml(processedHtml)
          }
        }
      } catch (error) {
        console.error('Error fetching guide:', error) // NOSONAR
        if (!cancelled) {
          setError('Failed to load guide')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-600">{error}</div>
        </div>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
      {/* Hero Section */}
      <HeroSection title={guideTitle} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Sidebar Navigation */}
            <div className="lg:col-span-1">
              <SideNav guideHtml={guideHtml} />
            </div>

            {/* Right Column - Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* HTML Content with Table Processing */}
              <HTMLProcessor 
                html={guideHtml}
                className="guideline-body max-w-none"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuidelinePage
