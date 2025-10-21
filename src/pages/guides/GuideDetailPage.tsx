import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { ChevronRightIcon, HomeIcon, CheckCircle } from 'lucide-react'

interface Guide {
  id: string
  slug?: string
  title: string
  summary?: string
  heroImageUrl?: string
  skillLevel?: string
  estimatedTimeMin?: number
  lastUpdatedAt?: string
  authorName?: string
  authorOrg?: string
  isEditorsPick?: boolean
  downloadCount?: number
  steps?: Array<{ id?: string; position?: number; title?: string; content?: string }>
  attachments?: Array<{ id?: string; type?: string; title?: string; url?: string; size?: string }>
  templates?: Array<{ id?: string; title?: string; url?: string; size?: string }>
  relatedToolSlugs?: string[]
}

const GuideDetailPage: React.FC = () => {
  const { itemId } = useParams()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      setLoading(true); setError(null)
      try {
        const res = await fetch(`/api/guides/${encodeURIComponent(itemId || '')}`)
        if (res.status === 404) { setError('Guide not found'); setGuide(null); return }
        const data = await res.json()
        setGuide(data)
      } catch (e: any) {
        setError('Failed to load guide')
      } finally { setLoading(false) }
    })()
  }, [itemId])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center flex-grow"><div>Loading…</div></div>
        <Footer isLoggedIn={false} />
      </div>
    )
  }
  if (error || !guide) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center"><Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center"><HomeIcon size={16} className="mr-1" /><span>Home</span></Link></li>
              <li><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><Link to="/marketplace/guides" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">Guides</Link></div></li>
              <li aria-current="page"><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><span className="ml-1 text-gray-500 md:ml-2">Details</span></div></li>
            </ol>
          </nav>
          <div className="bg-white rounded shadow p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">{error || 'Not Found'}</h2>
            <Link to="/marketplace/guides" className="text-blue-600">Back to Guides</Link>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center"><Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center"><HomeIcon size={16} className="mr-1" /><span>Home</span></Link></li>
            <li><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><Link to="/marketplace/guides" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">Guides</Link></div></li>
            <li aria-current="page"><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><span className="ml-1 text-gray-500 md:ml-2">{guide.title}</span></div></li>
          </ol>
        </nav>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          {guide.heroImageUrl && <img src={guide.heroImageUrl} alt="" className="w-full h-60 object-cover rounded mb-4" loading="lazy" />}
          <h1 className="text-2xl font-bold mb-2">{guide.title}</h1>
          {guide.summary && <p className="text-gray-600">{guide.summary}</p>}
        </div>
        {/* Steps */}
        {guide.steps && guide.steps.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Steps</h2>
            <ol className="space-y-3">
              {guide.steps.map((s, idx) => (
                <li key={s.id || idx} className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">{s.title || `Step ${s.position || idx+1}`}</div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">{s.content}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
        {/* Attachments / Templates */}
        {(guide.attachments && guide.attachments.length > 0) || (guide.templates && guide.templates.length > 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {guide.attachments && guide.attachments.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3">Attachments</h3>
                <ul className="list-disc ml-4">
                  {guide.attachments.map((a, i) => (
                    <li key={a.id || i}><a href={a.url} className="text-blue-600" target="_blank" rel="noreferrer">{a.title || a.url}</a>{a.size ? ` (${a.size})` : ''}</li>
                  ))}
                </ul>
              </div>
            )}
            {guide.templates && guide.templates.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3">Templates</h3>
                <ul className="list-disc ml-4">
                  {guide.templates.map((t, i) => (
                    <li key={t.id || i}><a href={t.url} className="text-blue-600" target="_blank" rel="noreferrer">{t.title || t.url}</a>{t.size ? ` (${t.size})` : ''}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}
        <div className="text-right">
          <Link to="/marketplace/guides" className="text-blue-600">Back to Guides</Link>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  )
}

export default GuideDetailPage

