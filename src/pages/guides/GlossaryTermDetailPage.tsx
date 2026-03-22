import React, { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { useAuth } from '../../components/Header/context/AuthContext'
import { glossaryTerms } from './glossaryData'
import { StandardizedGlossaryDetailPage } from './StandardizedGlossaryDetailPage'

export function GlossaryTermDetailPage() {
  const { termId } = useParams<{ termId: string }>()
  const { user } = useAuth()

  const term = useMemo(() => {
    return glossaryTerms.find(t => t.id === termId || t.id === termId?.replace(/^glossary-/, ''))
  }, [termId])

  if (!term) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Term Not Found</h1>
            <p className="text-gray-600 mb-6">The glossary term you're looking for doesn't exist.</p>
            <Link
              to="/marketplace/guides?tab=glossary"
              className="px-4 py-2 bg-[var(--guidelines-primary)] text-white rounded-lg hover:bg-[var(--guidelines-primary-dark)] transition-colors inline-block"
            >
              Back to Glossary
            </Link>
          </div>
        </main>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  return <StandardizedGlossaryDetailPage term={term} />
}

export default GlossaryTermDetailPage
