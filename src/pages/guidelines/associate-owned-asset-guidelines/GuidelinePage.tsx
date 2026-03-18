import { useState, useEffect } from 'react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { knowledgeHubSupabase } from '../../../services/knowledgeHubClient'
import { HeroSection } from './HeroSection'
import { SideNav } from './SideNav'
import { AccentHeading } from '../../../components/shared/AccentHeading'
import { HTMLProcessor } from '../../../components/guidelines/HTMLProcessor'

function GuidelinePage() {
  const { user } = useAuth()
  const [guideTitle, setGuideTitle] = useState<string>('DQ Associate Owned Asset Guidelines')
  const [lastUpdated, setLastUpdated] = useState<string>('Version 1.8 • December 19, 2025')
  const [guideHtml, setGuideHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Function to generate ID from heading text
  const generateId = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/&nbsp;/g, '') // Remove &nbsp;
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
    
    return html.replace(/<(h[1-6])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, content) => {
      // Clean the content for ID generation
      const cleanContent = content
        .replace(/<[^>]+>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
        .replace(/\./g, '') // Remove periods
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
        const { data, error } = await knowledgeHubSupabase
          .from('guides')
          .select('title, last_updated_at, body')
          .eq('slug', 'dq-associate-owned-asset-guidelines')
          .maybeSingle()
        
        if (error) throw error
        if (!cancelled && data) {
          setGuideTitle(data.title || 'DQ Associate Owned Asset Guidelines')
          if (data.last_updated_at) {
            const date = new Date(data.last_updated_at)
            setLastUpdated(`Version 1.8 • ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`)
          }
          
          // Store HTML directly (no JSON parsing)
          if (data.body) {
            console.log('✅ [DATABASE] Loaded HTML content from database')
            console.log(`📄 [DATABASE] Content length: ${data.body.length} characters`)
            
            // Replace literal \n with actual line breaks
            let processedHtml = data.body.replace(/\\n/g, '\n')
            
            // Add IDs to headings for table of contents navigation
            processedHtml = addIdsToHeadings(processedHtml)
            console.log('🔧 [DATABASE] Added IDs to headings for navigation')
            
            setGuideHtml(processedHtml)
          }
        }
      } catch (error) {
        console.error('Error fetching guide:', error)
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
      <HeroSection title={guideTitle} date={lastUpdated} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Sidebar Navigation */}
            <div className="lg:col-span-1">
              <SideNav />
            </div>

            {/* Right Column - Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* HTML Content with Table Processing */}
              <HTMLProcessor 
                html={guideHtml}
                className="prose prose-lg max-w-none accent-headers
                           prose-headings:font-bold prose-headings:text-gray-900
                           prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6 prose-h1:first:mt-0
                           prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                           prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                           prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                           prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
                           prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
                           prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
                           prose-li:mb-2
                           prose-strong:font-semibold prose-strong:text-gray-900"
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
