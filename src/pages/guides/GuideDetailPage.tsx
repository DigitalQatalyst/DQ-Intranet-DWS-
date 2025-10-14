import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { ChevronRightIcon, HomeIcon, CheckCircle, Share2, Printer, ExternalLink, Download, AlertTriangle } from 'lucide-react'
import { supabaseClient } from '../../lib/supabaseClient'
import { getGuideImageUrl } from '../../utils/guideImageMap'
import { track } from '../../utils/analytics'
import { useAuth } from '../../components/Header/context/AuthContext'

interface GuideRecord {
  id: string
  slug?: string
  title: string
  summary?: string
  heroImageUrl?: string | null
  domain?: string | null
  guideType?: string | null
  functionArea?: string | null
  status?: string | null
  complexityLevel?: string | null
  skillLevel?: string | null
  estimatedTimeMin?: number | null
  lastUpdatedAt?: string | null
  authorName?: string | null
  authorOrg?: string | null
  isEditorsPick?: boolean | null
  downloadCount?: number | null
  documentUrl?: string | null
  steps?: Array<{ id?: string; position?: number; title?: string; content?: string }>
  attachments?: Array<{ id?: string; type?: string; title?: string; url?: string; size?: string }>
  templates?: Array<{ id?: string; title?: string; url?: string; size?: string }>
}

const GuideDetailPage: React.FC = () => {
  const { itemId } = useParams()
  const location = useLocation() as any
  const navigate = useNavigate()
  const { user } = useAuth()
  const [guide, setGuide] = useState<GuideRecord | null>(null)
  const [related, setRelated] = useState<GuideRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({})

  const backQuery = (location?.state && location.state.fromQuery) ? String(location.state.fromQuery) : ''
  const backHref = `/marketplace/guides${backQuery ? `?${backQuery}` : ''}`

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        // Prefer server API (service role) for details to include attachments/templates
        const res = await fetch(`/api/guides/${encodeURIComponent(itemId || '')}`)
        const ct = res.headers.get('content-type') || ''
        if (res.ok && ct.includes('application/json')) {
          const data = await res.json()
          if (!cancelled) setGuide(data)
        } else {
          // Fallback: query Supabase anon (RLS enforces public visibility)
          const key = String(itemId || '')
          let { data: row, error: err1 } = await supabaseClient.from('guides').select('*').eq('slug', key).maybeSingle()
          if (err1) throw err1
          if (!row) {
            const { data: row2, error: err2 } = await supabaseClient.from('guides').select('*').eq('id', key).maybeSingle()
            if (err2) throw err2
            row = row2 as any
          }
          if (!row) { throw new Error('Not found') }
          const mapped: GuideRecord = {
            id: row.id,
            slug: row.slug,
            title: row.title,
            summary: row.summary ?? undefined,
            heroImageUrl: row.hero_image_url ?? row.heroImageUrl ?? null,
            domain: row.domain ?? null,
            guideType: row.guide_type ?? row.guideType ?? null,
            functionArea: row.function_area ?? null,
            status: row.status ?? null,
            complexityLevel: row.complexity_level ?? null,
            skillLevel: row.skill_level ?? row.skillLevel ?? null,
            estimatedTimeMin: row.estimated_time_min ?? row.estimatedTimeMin ?? null,
            lastUpdatedAt: row.last_updated_at ?? row.lastUpdatedAt ?? null,
            authorName: row.author_name ?? row.authorName ?? null,
            authorOrg: row.author_org ?? row.authorOrg ?? null,
            isEditorsPick: row.is_editors_pick ?? row.isEditorsPick ?? null,
            downloadCount: row.download_count ?? row.downloadCount ?? null,
            documentUrl: row.document_url ?? row.documentUrl ?? null,
            steps: [], attachments: [], templates: [],
          }
          if (!cancelled) setGuide(mapped)
        }
      } catch (e: any) {
        if (!cancelled) setError('Guide not found')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [itemId])

  // Track view
  useEffect(() => {
    if (guide?.slug) track('Guides.ViewDetail', { slug: guide.slug })
  }, [guide?.slug])

  // Fetch related guides (public-only via RLS). Domain first, fallback to guideType.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!guide) return
      const selectCols = 'id,slug,title,summary,hero_image_url,guide_type,domain,last_updated_at,download_count,is_editors_pick'
      let first: any[] = []
      try {
        if (guide.domain) {
          const q = supabaseClient
            .from('guides')
            .select(selectCols)
            .eq('domain', guide.domain)
            .neq('slug', guide.slug || '')
            .eq('status', 'Approved')
            .order('is_editors_pick', { ascending: false, nullsFirst: false })
            .order('download_count', { ascending: false, nullsFirst: false })
            .order('last_updated_at', { ascending: false, nullsFirst: false })
            .limit(6)
          const { data: rows } = await q
          first = rows || []
        }
        let results = first
        if ((results?.length || 0) < 6 && guide.guideType) {
          const q2 = supabaseClient
            .from('guides')
            .select(selectCols)
            .eq('guide_type', guide.guideType)
            .neq('slug', guide.slug || '')
            .eq('status', 'Approved')
            .order('is_editors_pick', { ascending: false, nullsFirst: false })
            .order('download_count', { ascending: false, nullsFirst: false })
            .order('last_updated_at', { ascending: false, nullsFirst: false })
            .limit(6)
          const { data: rows2 } = await q2
          const map = new Map<string, any>()
          for (const r of (first || [])) map.set(r.slug || r.id, r)
          for (const r of (rows2 || [])) { const k = r.slug || r.id; if (!map.has(k)) map.set(k, r) }
          results = Array.from(map.values()).slice(0, 6)
        }
        if (!cancelled) setRelated((results || []).map((r: any) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          summary: r.summary,
          heroImageUrl: r.hero_image_url ?? null,
          guideType: r.guide_type ?? null,
          domain: r.domain ?? null,
          lastUpdatedAt: r.last_updated_at ?? null,
          isEditorsPick: r.is_editors_pick ?? null,
          downloadCount: r.download_count ?? null,
        } as GuideRecord)))
      } catch {
        if (!cancelled) setRelated([])
      }
    })()
    return () => { cancelled = true }
  }, [guide?.id, guide?.domain, guide?.guideType, guide?.slug])

  const imageUrl = useMemo(() => getGuideImageUrl({ heroImageUrl: guide?.heroImageUrl || undefined, domain: guide?.domain || undefined, guideType: guide?.guideType || undefined }), [guide?.heroImageUrl, guide?.domain, guide?.guideType])

  const openPrimaryUrl = () => {
    if (!guide) return
    const url = guide.documentUrl || guide.templates?.[0]?.url || guide.attachments?.[0]?.url
    if (url) {
      track('Guides.OpenGuide', { slug: guide.slug || guide.id, url })
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleDownload = (category: 'attachment' | 'template', item: any) => {
    if (!item?.url) return
    track('Guides.Download', { slug: guide?.slug || guide?.id, category, id: item.id || item.url, title: item.title || undefined })
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = guide?.title || 'Guide'
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title, url })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        alert('Link copied to clipboard')
      }
    } finally {
      track('Guides.Share', { slug: guide?.slug || guide?.id })
    }
  }

  const handlePrint = () => {
    track('Guides.Print', { slug: guide?.slug || guide?.id })
    window.print()
  }

  // Non-approved: if user not logged in, show 404; else show banner
  const isApproved = (guide?.status || 'Approved') === 'Approved'
  if (!loading && (!guide || (!isApproved && !user))) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="container mx-auto px-4 py-8 flex-grow" role="main">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center"><Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center"><HomeIcon size={16} className="mr-1" /><span>Home</span></Link></li>
              <li><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><Link to={backHref} className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">Guides</Link></div></li>
              <li aria-current="page"><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><span className="ml-1 text-gray-500 md:ml-2">Not Found</span></div></li>
            </ol>
          </nav>
          <div className="bg-white rounded shadow p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">Guide not available</h2>
            <p className="text-gray-600 mb-4">This guide is not publicly accessible.</p>
            <Link to={backHref} className="text-blue-600">Back to Guides</Link>
          </div>
        </main>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="container mx-auto px-4 py-8 flex-grow" role="main">
          <div className="bg-white rounded shadow p-8 text-center" aria-busy="true">Loading…</div>
        </main>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="container mx-auto px-4 py-8 flex-grow" role="main">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center"><Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center"><HomeIcon size={16} className="mr-1" /><span>Home</span></Link></li>
              <li><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><Link to={backHref} className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">Guides</Link></div></li>
              <li aria-current="page"><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><span className="ml-1 text-gray-500 md:ml-2">Details</span></div></li>
            </ol>
          </nav>
          <div className="bg-white rounded shadow p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-2">{error || 'Not Found'}</h2>
            <Link to={backHref} className="text-blue-600">Back to Guides</Link>
          </div>
        </main>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  const type = (guide.guideType || '').toLowerCase()
  const showSteps = (guide.steps && guide.steps.length > 0) || ['process', 'sop', 'procedure', 'checklist', 'best practice', 'best-practice'].includes(type)
  const showTemplates = (guide.templates && guide.templates.length > 0) || type === 'template'
  const showAttachments = (guide.attachments && guide.attachments.length > 0)
  const primaryCtaLabel = type === 'template' ? 'Use Template' : type === 'checklist' ? 'Open Checklist' : 'Open Guide'
  const lastUpdated = guide.lastUpdatedAt ? new Date(guide.lastUpdatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="container mx-auto px-4 py-8 flex-grow" role="main">
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center"><Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center"><HomeIcon size={16} className="mr-1" /><span>Home</span></Link></li>
            <li><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><Link to={backHref} className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">Guides</Link></div></li>
            <li aria-current="page"><div className="flex items-center"><ChevronRightIcon size={16} className="text-gray-400" /><span className="ml-1 text-gray-500 md:ml-2">{guide.title}</span></div></li>
          </ol>
        </nav>

        {!isApproved && (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800 flex items-start gap-2" role="alert">
            <AlertTriangle size={18} className="mt-0.5" />
            <div>
              <div className="font-semibold">This guide is not approved</div>
              <div className="text-sm">Status: {guide.status}</div>
            </div>
          </div>
        )}

        {/* Header card */}
        <header className="bg-white rounded-lg shadow p-6 mb-6" aria-labelledby="guide-title">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              {imageUrl && (
                <img src={imageUrl} alt={guide.title} className="w-full h-60 object-cover rounded mb-4" loading="lazy" />
              )}
              <h1 id="guide-title" className="text-2xl font-bold mb-2">{guide.title}</h1>
              {guide.summary && <p className="text-gray-700 mb-3">{guide.summary}</p>}
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                {guide.domain && <span className="px-2 py-0.5 bg-gray-100 rounded-full">{guide.domain}</span>}
                {guide.guideType && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{guide.guideType}</span>}
                {guide.functionArea && <span className="px-2 py-0.5 bg-gray-100 rounded-full">{guide.functionArea}</span>}
                {guide.complexityLevel && <span className="px-2 py-0.5 bg-gray-100 rounded-full">{guide.complexityLevel}</span>}
                {lastUpdated && <span className="px-2 py-0.5 bg-gray-100 rounded-full">Updated {lastUpdated}</span>}
              </div>
            </div>
            <aside className="lg:col-span-1">
              <div className="rounded-lg border border-gray-200 p-4 sticky top-24">
                <div className="flex gap-2 mb-3">
                  <button onClick={openPrimaryUrl} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <ExternalLink size={16} /> {primaryCtaLabel}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleShare} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none">
                    <Share2 size={16} /> Share
                  </button>
                  <button onClick={handlePrint} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none">
                    <Printer size={16} /> Print
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </header>

        {/* Dynamic layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Policy emphasis: metadata */}
            {type === 'policy' && (
              <section aria-labelledby="policy-meta" className="bg-white rounded-lg shadow p-6" id="metadata">
                <h2 id="policy-meta" className="text-xl font-semibold mb-4">Policy Details</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {guide.authorName && <div><dt className="text-gray-500 text-sm">Author</dt><dd className="text-gray-900">{guide.authorName}</dd></div>}
                  {guide.authorOrg && <div><dt className="text-gray-500 text-sm">Organization</dt><dd className="text-gray-900">{guide.authorOrg}</dd></div>}
                  {guide.functionArea && <div><dt className="text-gray-500 text-sm">Function Area</dt><dd className="text-gray-900">{guide.functionArea}</dd></div>}
                  {guide.complexityLevel && <div><dt className="text-gray-500 text-sm">Complexity</dt><dd className="text-gray-900">{guide.complexityLevel}</dd></div>}
                  {guide.status && <div><dt className="text-gray-500 text-sm">Status</dt><dd className="text-gray-900">{guide.status}</dd></div>}
                  {lastUpdated && <div><dt className="text-gray-500 text-sm">Effective Date</dt><dd className="text-gray-900">{lastUpdated}</dd></div>}
                </dl>
              </section>
            )}

            {/* Steps / Process / Checklist / Best Practice */}
            {(showSteps) && (
              <section aria-labelledby="steps-title" className="bg-white rounded-lg shadow p-6" id="content">
                <h2 id="steps-title" className="text-xl font-semibold mb-4">{type === 'process' || type === 'sop' || type === 'procedure' ? 'Process' : type === 'checklist' ? 'Checklist' : type === 'best practice' || type === 'best-practice' ? 'Recommended Actions' : 'Steps'}</h2>
                <ol className="space-y-3">
                  {(guide.steps && guide.steps.length > 0 ? guide.steps : []).map((s, idx) => (
                    <li key={(s.id || `${idx}`) as string} className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium">{s.title || `Step ${s.position || idx + 1}`}</div>
                        {type === 'checklist' ? (
                          <div className="mt-1 flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              aria-label={`Mark ${s.title || `Step ${idx + 1}`} as complete`}
                              checked={!!checklistState[String(idx)]}
                              onChange={(e) => setChecklistState(prev => ({ ...prev, [String(idx)]: e.target.checked }))}
                            />
                            <span className="text-sm text-gray-700 whitespace-pre-wrap">{s.content}</span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-700 whitespace-pre-wrap">{s.content}</div>
                        )}
                      </div>
                    </li>
                  ))}
                  {(!guide.steps || guide.steps.length === 0) && (
                    <li className="text-gray-600 text-sm">No structured steps available; open the guide for full details.</li>
                  )}
                </ol>
              </section>
            )}

            {/* Templates emphasized for Template type */}
            {showTemplates && (
              <section aria-labelledby="templates-title" className="bg-white rounded-lg shadow p-6" id="templates">
                <h2 id="templates-title" className="text-xl font-semibold mb-4">Templates</h2>
                {(guide.templates && guide.templates.length > 0) ? (
                  <ul className="divide-y divide-gray-100">
                    {guide.templates!.map((t, i) => (
                      <li key={t.id || i} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{t.title || t.url}</div>
                          {t.size && <div className="text-xs text-gray-500">{t.size}</div>}
                        </div>
                        <button onClick={() => handleDownload('template', t)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm">
                          <Download size={16} /> Download
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No templates provided.</p>
                )}
              </section>
            )}

            {/* Attachments */}
            {showAttachments && (
              <section aria-labelledby="attachments-title" className="bg-white rounded-lg shadow p-6" id="attachments">
                <h2 id="attachments-title" className="text-xl font-semibold mb-4">Attachments</h2>
                {(guide.attachments && guide.attachments.length > 0) ? (
                  <ul className="divide-y divide-gray-100">
                    {guide.attachments!.map((a, i) => (
                      <li key={a.id || i} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{a.title || a.url}</div>
                          {a.size && <div className="text-xs text-gray-500">{a.size}</div>}
                        </div>
                        <button onClick={() => handleDownload('attachment', a)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm">
                          <Download size={16} /> Download
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600">No attachments provided.</p>
                )}
              </section>
            )}

            {/* Related Guides */}
            {related && related.length > 0 && (
              <section aria-labelledby="related-title" className="bg-white rounded-lg shadow p-6" id="related">
                <h2 id="related-title" className="text-xl font-semibold mb-4">Related Guides</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {related.map((r) => (
                    <Link
                      key={r.slug || r.id}
                      to={`/marketplace/guides/${encodeURIComponent(r.slug || r.id)}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      onClick={() => track('Guides.RelatedClick', { from: guide.slug || guide.id, to: r.slug || r.id })}
                    >
                      <div className="flex gap-3">
                        <img src={getGuideImageUrl({ heroImageUrl: r.heroImageUrl || undefined, domain: r.domain || undefined, guideType: r.guideType || undefined })} alt={r.title} className="w-20 h-20 object-cover rounded" loading="lazy" />
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate" title={r.title}>{r.title}</div>
                          {r.summary && <div className="text-sm text-gray-600 line-clamp-2">{r.summary}</div>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
          {/* Sidebar secondary only shows if there are templates or attachments but not both already shown in main */}
          <aside className="lg:col-span-1 space-y-6" aria-label="Secondary">
            {!showTemplates && (guide.templates && guide.templates.length > 0) && (
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-3">Templates</h2>
                <ul className="space-y-2">
                  {guide.templates!.map((t, i) => (
                    <li key={t.id || i}>
                      <button onClick={() => handleDownload('template', t)} className="text-blue-600 hover:underline text-left">{t.title || t.url}</button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {!showAttachments && (guide.attachments && guide.attachments.length > 0) && (
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-3">Attachments</h2>
                <ul className="space-y-2">
                  {guide.attachments!.map((a, i) => (
                    <li key={a.id || i}>
                      <button onClick={() => handleDownload('attachment', a)} className="text-blue-600 hover:underline text-left">{a.title || a.url}</button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </section>

        <div className="mt-6 text-right">
          <Link to={backHref} className="text-blue-600">Back to Guides</Link>
        </div>
      </main>
      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuideDetailPage

