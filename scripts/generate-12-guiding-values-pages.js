import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const guidingValues = [
  { slug: 'dq-competencies-emotional-intelligence', title: 'Emotional Intelligence' },
  { slug: 'dq-competencies-growth-mindset', title: 'Growth Mindset' },
  { slug: 'dq-competencies-purpose', title: 'Purpose' },
  { slug: 'dq-competencies-perceptive', title: 'Perceptive' },
  { slug: 'dq-competencies-proactive', title: 'Proactive' },
  { slug: 'dq-competencies-perseverance', title: 'Perseverance' },
  { slug: 'dq-competencies-precision', title: 'Precision' },
  { slug: 'dq-competencies-customer', title: 'Customer' },
  { slug: 'dq-competencies-learning', title: 'Learning' },
  { slug: 'dq-competencies-collaboration', title: 'Collaboration' },
  { slug: 'dq-competencies-responsibility', title: 'Responsibility' },
  { slug: 'dq-competencies-trust', title: 'Trust' },
];

const template = `import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { supabaseClient } from '../../../lib/supabaseClient'
import { HeroSection } from '../shared/HeroSection'
import { SideNav } from '../shared/SideNav'
import { GuidelineSection } from '../shared/GuidelineSection'
import MarkdownRenderer from '../../../components/guides/MarkdownRenderer'

function GuidelinePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const currentSlug = '{{SLUG}}'
  
  const [guide, setGuide] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabaseClient
          .from('guides')
          .select('*')
          .eq('slug', currentSlug)
          .maybeSingle()
        
        if (fetchError) throw fetchError
        
        if (!cancelled) {
          if (data) {
            setGuide(data)
          } else {
            setError('Guide not found')
          }
          setLoading(false)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Failed to load guide')
          setLoading(false)
        }
      }
    })()
    return () => { cancelled = true }
  }, [currentSlug])

  // Parse markdown body into sections
  const parseSections = (body: string) => {
    const sections: { id: string; title: string; content: string }[] = []
    if (!body) return sections
    
    const lines = body.split('\\n')
    let currentSection: { id: string; title: string; content: string } | null = null
    
    for (const line of lines) {
      // Check for level 1 or level 2 headings
      if (line.startsWith('# ') || line.startsWith('## ')) {
        if (currentSection) {
          sections.push(currentSection)
        }
        const title = line.replace(/^#+\\s+/, '').trim()
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        currentSection = { id, title, content: '' }
      } else if (currentSection) {
        currentSection.content += line + '\\n'
      } else {
        // If we have content before any heading, create a default section
        if (!currentSection) {
          currentSection = { id: 'overview', title: 'Overview', content: '' }
        }
        currentSection.content += line + '\\n'
      }
    }
    
    if (currentSection) {
      sections.push(currentSection)
    }
    
    return sections
  }

  const sections = guide?.body ? parseSections(guide.body) : []
  const navSections = sections.filter(s => s.title !== 'Learn More').map(s => ({ id: s.id, label: s.title }))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Guide not found'}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                  <HomeIcon size={16} className="mr-1" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <Link to="/marketplace/guides?tab=strategy" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                    Strategy
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <Link to="/marketplace/guides/dq-competencies" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                    DQ Competencies
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">{guide.title}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <HeroSection 
        title={guide.title}
        subtitle="DQ Leadership • Digital Qatalyst"
        imageUrl={guide.hero_image_url || undefined}
      />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {sections.length === 0 ? (
                guide?.body ? (
                  <GuidelineSection id="overview" title="Overview">
                    <MarkdownRenderer body={guide.body} />
                  </GuidelineSection>
                ) : (
                  <div className="text-gray-600">No content available.</div>
                )
              ) : (
                sections.map((section, index) => {
                  // Skip "Learn More" section - we'll add it manually
                  if (section.title === 'Learn More') return null
                  
                  return (
                    <GuidelineSection key={section.id} id={section.id} title={section.title}>
                      <MarkdownRenderer body={section.content.trim()} />
                    </GuidelineSection>
                  )
                })
              )}
              
              {/* Links to DQ Competencies and GHC */}
              <div className="mt-12 flex flex-col gap-4 items-end">
                <Link
                  to="/marketplace/guides/dq-competencies"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: '#030E31'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#020A28'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#030E31'
                  }}
                >
                  <span>View DQ Competencies (HoV)</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  to="/marketplace/guides/dq-ghc"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-lg transition-colors"
                  style={{ 
                    backgroundColor: '#030E31'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#020A28'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#030E31'
                  }}
                >
                  <span>View Full GHC Framework</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <SideNav sections={navSections} />
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuidelinePage
`;

guidingValues.forEach(({ slug, title }) => {
  const dirPath = path.join(__dirname, '..', 'src', 'pages', 'strategy', slug);
  const filePath = path.join(dirPath, 'GuidelinePage.tsx');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  // Generate page content
  const pageContent = template.replace(/\{\{SLUG\}\}/g, slug);
  
  // Write file
  fs.writeFileSync(filePath, pageContent, 'utf8');
  console.log(`✅ Created: ${filePath}`);
});

console.log(`\n✅ Generated ${guidingValues.length} page components!`);



