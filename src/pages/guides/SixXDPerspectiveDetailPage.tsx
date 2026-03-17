import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { 
  HomeIcon, 
  ChevronRightIcon, 
  ArrowLeft, 
  CheckCircle2, 
  Target, 
  Repeat, 
  Zap,
  Lightbulb,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../components/Header/context/AuthContext';
import { SIX_XD_PERSPECTIVE_CARDS, SixXDPerspectiveCard } from '../../components/guides/SixXDPerspectiveCards';
import { SIX_XD_PERSPECTIVES } from './glossaryFilters';
import { glossaryTerms } from './glossaryData';
import { GlossaryDetailAccordion } from '../../components/guides/GlossaryDetailAccordion';

interface DigitalEconomyDetailPageProps {
  perspective: SixXDPerspectiveCard;
  perspectiveFilter: { id: string; name: string } | undefined;
  relatedTerms: any[];
  user: any;
}

function DigitalEconomyDetailPage({ perspective, perspectiveFilter, relatedTerms, user }: DigitalEconomyDetailPageProps) {
  const navigate = useNavigate();

  // Get related perspectives for "See Also" section
  const relatedPerspectives = useMemo(() => {
    return SIX_XD_PERSPECTIVE_CARDS.filter(p => p.id !== perspective.id).slice(0, 3);
  }, [perspective.id]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="container mx-auto px-6 py-8 flex-grow max-w-[740px]">
        {/* Header: Breadcrumb */}
        <nav className="mb-4">
          <button
            onClick={() => navigate('/marketplace/guides?tab=glossary&glossary_knowledge_system=6xd')}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Glossary</span>
          </button>
        </nav>

        {/* Category Pill */}
        <div className="mb-3">
          <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-gray-200 text-gray-700">
            {perspectiveFilter?.name || '6xD'}
          </span>
        </div>

        {/* Term Title */}
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-1.5 leading-tight tracking-tight">
          {perspective.name}
        </h1>

        {/* Subtitle */}
        <p className="text-xs text-gray-500 mb-5 uppercase tracking-wider">
          Perspective
        </p>

        {/* Lead Definition - with left accent border */}
        <div className="border-l-2 border-orange-400 pl-5 py-3.5 mb-6">
          <p className="text-base text-gray-800 leading-relaxed">
            {perspective.description}
          </p>
        </div>

        {/* Core Sections */}
        <div className="space-y-6">
          {/* Why This Matters */}
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Why This Matters
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              Organizations need a structured way to address why change is necessary. Without this perspective, 
              transformation efforts risk becoming ad-hoc, reactive, or misaligned with market forces. This creates 
              confusion, wasted effort, and missed opportunities for meaningful transformation.
            </p>
          </section>

          {/* What This Means at DQ */}
          <section className="bg-blue-50/40 border-l-2 border-blue-300 rounded-r pl-5 py-3.5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              What This Means at DQ
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm">
              This perspective provides a shared lens for understanding why change is necessary and continuous. 
              It informs how priorities are set, how trade-offs are evaluated, and how transformation decisions 
              are grounded in long-term value rather than short-term fixes. By anchoring strategic thinking in 
              this perspective, DQ avoids reactive change and operates with clarity, intent, and consistency 
              across transformation initiatives.
            </p>
          </section>

          {/* Core Question - Inline Editorial Callout */}
          <section className="my-5">
            <p className="text-lg text-gray-800 leading-relaxed italic border-l-2 border-gray-400 pl-4">
              {perspective.question}
            </p>
          </section>

          {/* Examples / Contextual Use - Max 2 */}
          <section>
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Examples
            </h2>
            <div className="space-y-2.5">
              <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                <p className="text-gray-700 leading-relaxed italic text-xs">
                  "Organizations need a structured way to address why change is necessary. Without this perspective, 
                  transformation efforts risk becoming ad-hoc, reactive, or misaligned with market forces."
                </p>
              </div>
              <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                <p className="text-gray-700 leading-relaxed italic text-xs">
                  "The Digital Economy perspective helps leaders understand shifts in market logic, customer behavior, 
                  and value creation that drive transformation in the digital age."
                </p>
              </div>
            </div>
          </section>

          {/* Usage Insight */}
          <section className="bg-amber-50/60 border-l-2 border-amber-300 rounded-r pl-4 py-3">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-amber-900 leading-relaxed text-xs">
                This perspective exists because transformation without understanding market forces leads to misaligned 
                investments. It ensures decisions are grounded in market reality, not internal assumptions.
              </p>
            </div>
          </section>

          {/* Related Terms - Inline Links/Chips */}
          {relatedTerms.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Related Terms
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedTerms.map((term) => (
                  <Link
                    key={term.id}
                    to={`/marketplace/guides/glossary/${term.id}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition-colors border border-gray-200 hover:border-blue-300"
                  >
                    {term.term}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* See Also */}
          {relatedPerspectives.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                See Also
              </h2>
              <div className="flex flex-wrap gap-3">
                {relatedPerspectives.map((related) => (
                  <Link
                    key={related.id}
                    to={`/marketplace/guides/6xd-perspective/${related.id}`}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium underline decoration-blue-300 hover:decoration-blue-500 transition-colors"
                  >
                    {related.name}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer: Last Updated */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-right">
            Last updated {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </main>
      <Footer isLoggedIn={!!user} />
    </div>
  );
}

export function SixXDPerspectiveDetailPage() {
  const { perspectiveId } = useParams<{ perspectiveId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const perspective = useMemo(() => {
    return SIX_XD_PERSPECTIVE_CARDS.find(p => p.id === perspectiveId);
  }, [perspectiveId]);

  const perspectiveFilter = useMemo(() => {
    return SIX_XD_PERSPECTIVES.find(p => p.id === perspectiveId);
  }, [perspectiveId]);

  // Find related terms for this perspective
  const relatedTerms = useMemo(() => {
    return glossaryTerms
      .filter(term => term.knowledgeSystem === '6xd' && term.sixXdPerspective === perspectiveId)
      .slice(0, 5);
  }, [perspectiveId]);

  if (!perspective) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Perspective Not Found</h1>
            <p className="text-gray-600 mb-6">The 6xD perspective you're looking for doesn't exist.</p>
            <Link
              to="/marketplace/guides?tab=glossary&glossary_knowledge_system=6xd"
              className="px-4 py-2 bg-[var(--guidelines-primary)] text-white rounded-lg hover:bg-[var(--guidelines-primary-dark)] transition-colors inline-block"
            >
              Back to 6xD Framework
            </Link>
          </div>
        </main>
        <Footer isLoggedIn={!!user} />
      </div>
    );
  }

  // Content preparation for framework explainer layout
  const oneLineIntent = perspective.description;

  // Why this matters - Single concise paragraph (no bullets)
  const whyThisMatters = `The ${perspective.name} perspective exists because organizations need a clear, structured way to address the question "${perspective.question}". Without this lens, transformation efforts risk becoming ad-hoc, reactive, or misaligned. ${perspective.name} provides the frameworks, methods, and thinking patterns that make transformation repeatable, intentional, and outcome-driven at DQ.`;

  // What this means at DQ - Only for Digital Economy perspective
  const whatThisMeansAtDQ = perspectiveId === 'digital-economy' 
    ? 'At DQ, this perspective provides a shared lens for understanding why change is necessary and continuous. It informs how priorities are set, how trade-offs are evaluated, and how transformation decisions are grounded in long-term value rather than short-term fixes. By anchoring strategic thinking in this perspective, the organisation avoids reactive change and instead operates with clarity, intent, and consistency across transformation initiatives.'
    : null;

  // Core question
  const coreQuestion = perspective.question;

  // Core explanation paragraph
  const coreExplanationParagraph = `${perspective.name} provides a structured approach for organizations to navigate digital transformation. It focuses on ${perspective.description.toLowerCase()}, offering clear frameworks and methods that guide decision-making and execution. This perspective helps teams move from reactive problem-solving to intentional, repeatable transformation practices.`;

  // Key characteristics with icons (for two-column layout) - Perspective-specific
  const getKeyCharacteristics = (perspectiveId: string) => {
    const characteristics: Record<string, Array<{ icon: any; label: string; description: string }>> = {
      'dt2-0': [
        { icon: CheckCircle2, label: 'Designed, not improvised', description: 'Transformation follows intentional frameworks' },
        { icon: Target, label: 'Governed, not controlled', description: 'Clear structures without micromanagement' },
        { icon: Repeat, label: 'Repeatable, not reactive', description: 'Consistent approaches across initiatives' },
        { icon: Zap, label: 'Outcome-driven, not activity-driven', description: 'Focus on results, not just execution' },
      ],
      'digital-economy': [
        { icon: Target, label: 'Market-aware, not isolated', description: 'Understands external forces and opportunities' },
        { icon: Zap, label: 'Value-focused, not feature-driven', description: 'Prioritizes customer and market value' },
        { icon: CheckCircle2, label: 'Strategic, not tactical', description: 'Long-term thinking over short-term fixes' },
      ],
      'dco': [
        { icon: CheckCircle2, label: 'Intelligent, not manual', description: 'Leverages data and AI for decisions' },
        { icon: Repeat, label: 'Adaptive, not rigid', description: 'Learns and evolves continuously' },
        { icon: Target, label: 'Orchestrated, not siloed', description: 'Integrated systems and processes' },
      ],
      'dbp': [
        { icon: CheckCircle2, label: 'Modular, not monolithic', description: 'Composable architecture and services' },
        { icon: Repeat, label: 'Scalable, not limited', description: 'Designed for growth and expansion' },
        { icon: Target, label: 'Integrated, not fragmented', description: 'Unified operations and data flows' },
      ],
      'dw-ws': [
        { icon: CheckCircle2, label: 'Enabled, not constrained', description: 'Tools and environments that empower' },
        { icon: Target, label: 'Collaborative, not isolated', description: 'Connected teams and workflows' },
        { icon: Zap, label: 'Productive, not busy', description: 'Focus on meaningful work and outcomes' },
      ],
      'digital-accelerators': [
        { icon: Zap, label: 'Fast, not slow', description: 'Compresses time-to-value' },
        { icon: CheckCircle2, label: 'Aligned, not ad-hoc', description: 'Consistent tools and practices' },
        { icon: Target, label: 'Measurable, not assumed', description: 'Clear metrics and impact tracking' },
      ],
    };
    return characteristics[perspectiveId] || [
      { icon: CheckCircle2, label: 'Structured, not chaotic', description: 'Clear frameworks and approaches' },
      { icon: Target, label: 'Intentional, not reactive', description: 'Purpose-driven decision making' },
      { icon: Zap, label: 'Effective, not just efficient', description: 'Focus on meaningful outcomes' },
    ];
  };
  const keyCharacteristics = getKeyCharacteristics(perspectiveId || '');

  // How this is used - Short sentences (max 1 line each)
  const howThisIsUsed = [
    `Applied in strategic planning and transformation roadmaps`,
    `Structures delivery approaches and methodologies`,
    `Informs platform and architecture decisions`,
    `Guides team composition and capability development`,
  ];

  // Deeper thinking - Long-form narrative (in accordion)
  const deeperThinking = `The ${perspective.name} perspective is one of six essential lenses through which DQ views digital transformation. Each perspective answers a fundamental question that organizations must address on their path to becoming digitally transformed enterprises. ${perspective.name} specifically addresses: "${perspective.question}" This question guides how we think, plan, and execute transformation initiatives at DQ. By understanding and applying the ${perspective.name} perspective, teams can make more informed decisions, align their work with strategic objectives, and deliver transformation outcomes that create lasting value.`;

  // Special layout for Digital Economy
  if (perspectiveId === 'digital-economy') {
    return <DigitalEconomyDetailPage 
      perspective={perspective}
      perspectiveFilter={perspectiveFilter}
      relatedTerms={relatedTerms}
      user={user}
    />;
  }

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
                <Link to="/marketplace/guides?tab=glossary&glossary_knowledge_system=6xd" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                  6xD Framework
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">{perspective.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => navigate('/marketplace/guides?tab=glossary&glossary_knowledge_system=6xd')}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back to 6xD Framework</span>
        </button>

        {/* 1. Hero Section (Unboxed) - No large bordered containers */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-blue-100 text-blue-700 border-blue-200">
              6xD
            </span>
            {perspectiveFilter && (
              <span className="text-xs text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                {perspectiveFilter.name}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{perspective.name}</h1>
          {/* One-line intent below title (no card, no border) */}
          {oneLineIntent && (
            <p className="text-xl text-gray-700 leading-relaxed max-w-3xl">
              {oneLineIntent}
            </p>
          )}
        </div>

        {/* Content Sections - Increased vertical spacing, reduced cards */}
        <div className="space-y-12">
          {/* 2. Primary Anchor Section - "Why this matters" (Replaces "What this means at DQ") */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why this matters</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
              {whyThisMatters}
            </p>
          </section>

          {/* 2.5. "What this means at DQ" - Only for Digital Economy */}
          {whatThisMeansAtDQ && (
            <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What this means at DQ</h2>
              <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                {whatThisMeansAtDQ}
              </p>
            </section>
          )}

          {/* 3. Core Question Callout - Soft highlighted band (not a card) */}
          <div className="bg-blue-50 border-l-4 border-blue-500 py-4 px-6 rounded-r-lg">
            <p className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-2">
              The core question this perspective answers:
            </p>
            <p className="text-lg text-gray-900 font-medium italic">
              {coreQuestion}
            </p>
          </div>

          {/* 4. Core Explanation - Two-Column Layout */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Explanation</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Short explanatory paragraph */}
              <div>
                <p className="text-base text-gray-700 leading-relaxed">
                  {coreExplanationParagraph}
                </p>
              </div>
              {/* Right: Key characteristics with icons */}
              <div className="space-y-4">
                {keyCharacteristics.map((char, idx) => {
                  const Icon = char.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm mb-0.5">{char.label}</p>
                        <p className="text-sm text-gray-600">{char.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 5. How This Is Used - Lightweight, short sentences */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How this is used</h2>
            <div className="space-y-2 max-w-3xl">
              {howThisIsUsed.map((example, idx) => (
                <p key={idx} className="text-base text-gray-700 leading-relaxed">
                  {example}
                </p>
              ))}
            </div>
          </section>

          {/* 6. Deeper Thinking (Accordion) - Moved after "How this is used" */}
          <GlossaryDetailAccordion title="Explore the deeper thinking behind this">
            <div className="prose prose-sm max-w-3xl text-gray-700">
              <p className="leading-relaxed">{deeperThinking}</p>
            </div>
          </GlossaryDetailAccordion>

          {/* 7. Related Terms - Only if available */}
          {relatedTerms.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Terms</h2>
              <div className="flex flex-wrap gap-2">
                {relatedTerms.map((term) => (
                  <Link
                    key={term.id}
                    to={`/marketplace/guides/glossary/${term.id}`}
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-[var(--guidelines-primary)] text-white hover:bg-[var(--guidelines-primary-dark)] transition-colors"
                  >
                    {term.term}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 8. Related Perspectives - Small grid of linked cards (no descriptions) */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Perspectives</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SIX_XD_PERSPECTIVE_CARDS.filter(p => p.id !== perspectiveId).slice(0, 5).map((relatedPerspective) => (
                <Link
                  key={relatedPerspective.id}
                  to={`/marketplace/guides/6xd-perspective/${relatedPerspective.id}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                      6xD
                    </span>
                    <span className="text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full font-medium">
                      {relatedPerspective.code}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-[var(--guidelines-primary)] transition-colors">
                    {relatedPerspective.name}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Back to Glossary Link */}
        <div className="mt-8 text-center">
          <Link
            to="/marketplace/guides?tab=glossary&glossary_knowledge_system=6xd"
            className="inline-flex items-center gap-2 text-[var(--guidelines-primary)] hover:text-[var(--guidelines-primary-dark)] font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to 6xD Framework</span>
          </Link>
        </div>
      </main>
      <Footer isLoggedIn={!!user} />
    </div>
  );
}

export default SixXDPerspectiveDetailPage;

