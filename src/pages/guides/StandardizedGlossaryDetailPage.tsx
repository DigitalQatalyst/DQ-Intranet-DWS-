import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../components/Header/context/AuthContext';
import { glossaryTerms, GlossaryTerm } from './glossaryData';
import { GHC_DIMENSIONS, SIX_XD_PERSPECTIVES } from './glossaryFilters';
import { GlossaryDetailAccordion } from '../../components/guides/GlossaryDetailAccordion';

interface StandardizedGlossaryDetailPageProps {
  term: GlossaryTerm;
}

export const StandardizedGlossaryDetailPage: React.FC<StandardizedGlossaryDetailPageProps> = ({ term }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get badge labels
  const knowledgeSystemLabel = term.knowledgeSystem === 'ghc' ? 'GHC' : term.knowledgeSystem === '6xd' ? '6xD' : null;
  const perspectiveLabel = term.knowledgeSystem === '6xd' && term.sixXdPerspective
    ? SIX_XD_PERSPECTIVES.find(p => p.id === term.sixXdPerspective)?.name
    : term.knowledgeSystem === 'ghc' && term.ghcDimension
    ? GHC_DIMENSIONS.find(d => d.id === term.ghcDimension)?.name
    : null;


  // Format who uses it labels
  const whoUsesItLabels: Record<string, string> = {
    'leadership': 'Leadership',
    'delivery': 'Delivery',
    'agile-transformation': 'Agile / Transformation',
    'engineering': 'Engineering',
    'operations': 'Operations',
    'new-joiners': 'New Joiners',
  };

  // 1. Page Header - One concise one-line definition
  const oneLineDefinition = term.shortIntro || (term.explanation ? term.explanation.split('.')[0].trim() + '.' : '');

  // 2. "What this means at DQ" - 2-3 short bullet points + grounding sentence
  const whatItMeansBullets = (term.examples?.slice(0, 2) || term.useCases?.slice(0, 2) || []).filter(b => b && b.trim().length > 0);
  // If we need a third bullet, create from explanation context
  if (whatItMeansBullets.length < 3 && term.explanation) {
    const explanationParts = term.explanation.split('.');
    if (explanationParts.length > 1) {
      const secondSentence = explanationParts[1]?.trim();
      if (secondSentence && secondSentence.length > 20 && secondSentence.length < 120) {
        whatItMeansBullets.push(secondSentence);
      }
    }
  }
  // Grounding sentence - connect concept to DQ context (use explanation if available)
  const groundingSentence = term.explanation 
    ? term.explanation.split('.').slice(0, 2).join('.').trim() + '.' 
    : '';

  // 3. Core Explanation - What it is and how it works (avoid storytelling/philosophy)
  // Extract meaningful sentences from explanation, skip what's already used
  const explanationSentences = term.explanation 
    ? term.explanation.split(/[.!?]+/).filter(s => s.trim().length > 30).map(s => s.trim())
    : [];
  // Use sentences 2-4 (skip first which is in header, and what's in grounding)
  const coreExplanation = explanationSentences.slice(1, 4).filter(s => s.length > 0);

  // 4. Deep Story - Long-form narrative/philosophy (optional, collapsible)
  const deepStory = term.marketDefinition || (term.explanation && explanationSentences.length > 5 
    ? explanationSentences.slice(5).join('. ').trim() + '.' 
    : null);

  // 5. How this is used - 3-4 practical examples
  const howThisIsUsed = term.useCases || term.examples?.slice(0, 4) || [];

  // 7. Related Terms - Same system only
  const relatedTermsList = useMemo(() => {
    if (!term.relatedTerms || term.relatedTerms.length === 0) return [];
    return glossaryTerms
      .filter(t => 
        term.relatedTerms?.includes(t.id) && 
        t.knowledgeSystem === term.knowledgeSystem
      )
      .slice(0, 5);
  }, [term.relatedTerms, term.knowledgeSystem]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="container mx-auto px-4 py-8 flex-grow max-w-4xl">
        {/* 1. Page Header */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
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
                <Link to="/marketplace/guides?tab=glossary" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                  Glossary
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">{term.term}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate('/marketplace/guides?tab=glossary')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to Glossary</span>
        </button>

        {/* 1. Page Header (Orientation) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <div className="flex flex-wrap gap-2 items-center mb-4">
            {knowledgeSystemLabel && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                term.knowledgeSystem === 'ghc' 
                  ? 'bg-purple-100 text-purple-700 border-purple-200' 
                  : 'bg-blue-100 text-blue-700 border-blue-200'
              }`}>
                {knowledgeSystemLabel}
              </span>
            )}
            {perspectiveLabel && (
              <span className="text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                {perspectiveLabel}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{term.term}</h1>
          {/* One concise one-line definition - no long paragraphs */}
          {oneLineDefinition && (
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              {oneLineDefinition}
            </p>
          )}
        </div>

        {/* Content Sections - Increased spacing for clear separation */}
        <div className="space-y-8">
          {/* 2. "What this means at DQ" (Relevance) - Visually emphasized */}
          {(whatItMeansBullets.length > 0 || groundingSentence) && (
            <section className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">What this means at DQ</h2>
              {whatItMeansBullets.length > 0 && (
                <ul className="space-y-3 mb-5">
                  {whatItMeansBullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-blue-600 mt-1.5 font-bold">•</span>
                      <span className="text-gray-800 leading-relaxed flex-1 text-base">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              {/* One grounding sentence connecting to DQ context */}
              {groundingSentence && (
                <p className="text-gray-800 leading-relaxed font-medium text-base max-w-3xl">
                  {groundingSentence}
                </p>
              )}
            </section>
          )}

          {/* 3. Core Explanation (Understanding) - Must come directly after "What this means at DQ" */}
          {coreExplanation.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Core Explanation</h2>
              <div className="space-y-5 max-w-3xl">
                {coreExplanation.map((subsection, idx) => (
                  <div key={idx} className="pb-5 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {subsection + (subsection.endsWith('.') || subsection.endsWith('!') || subsection.endsWith('?') ? '' : '.')}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. Deep Story (Optional - Collapsible) - Hide by default */}
          {deepStory && (
            <GlossaryDetailAccordion title="Explore the deeper thinking behind this">
              <div className="prose prose-sm max-w-3xl text-gray-700">
                <p className="leading-relaxed mb-4">{deepStory}</p>
              </div>
            </GlossaryDetailAccordion>
          )}

          {/* 5. How this is used (Practical grounding) */}
          {howThisIsUsed.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">How this is used</h2>
              <ul className="space-y-3 max-w-3xl">
                {howThisIsUsed.map((example, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1.5">•</span>
                    <span className="text-gray-700 leading-relaxed flex-1 text-base">{example}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* 6. Who this is for (Context) - Compact and non-exclusive */}
          {term.whoUsesIt && term.whoUsesIt.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Who this is for</h2>
              <div className="flex flex-wrap gap-2">
                {term.whoUsesIt.map((who, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200"
                  >
                    {whoUsesItLabels[who] || who}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 7. Related Terms / Perspectives (Exploration) - Same system only */}
          {relatedTermsList.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-5">Related Terms</h2>
              <div className="flex flex-wrap gap-2">
                {relatedTermsList.map((relatedTerm) => (
                  <Link
                    key={relatedTerm.id}
                    to={`/marketplace/guides/glossary/${relatedTerm.id}`}
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-[var(--guidelines-primary)] text-white hover:bg-[var(--guidelines-primary-dark)] transition-colors"
                  >
                    {relatedTerm.term}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Back to Glossary Link */}
        <div className="mt-8 text-center">
          <Link
            to="/marketplace/guides?tab=glossary"
            className="inline-flex items-center gap-2 text-[var(--guidelines-primary)] hover:text-[var(--guidelines-primary-dark)] font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Glossary</span>
          </Link>
        </div>
      </main>
      <Footer isLoggedIn={!!user} />
    </div>
  );
};

export default StandardizedGlossaryDetailPage;

