import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { supabaseClient } from '../../lib/supabaseClient';
import { CheckCircle2, ArrowRight, Home, ChevronRight, Bookmark, BookOpen, PlayCircle } from 'lucide-react';
import { GUIDE_CONTENT, GuideContent } from '../../constants/guideContent';

/* ─────────────────────────────── Types ─────────────────────────────────── */

// GHC service IDs that should use GUIDE_CONTENT instead of Supabase data
const GHC_SERVICE_IDS = [
  'ghc',
  'dq-ghc', // Alternative URL format
  'dq-vision',
  'dq-hov',
  'dq-persona',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd'
];

// Helper function to detect if itemId is a GHC service
const isGHCService = (itemId: string): boolean => {
  return GHC_SERVICE_IDS.includes(itemId);
};

// Helper function to detect if this is a Digital Workspace guideline
const isDigitalWorkspaceGuideline = (guide: GuideRecord | null): boolean => {
  if (!guide) return false;
  const slug = (guide.slug || '').toLowerCase();
  const title = (guide.title || '').toLowerCase();
  
  // Check for Digital Workspace guidelines - specifically Associate Owned Asset Guidelines
  return slug.includes('associate-owned-asset') || 
         title.includes('associate owned asset') ||
         slug.includes('dq-ops');
};

// Helper function to map GHC itemId to GUIDE_CONTENT key
const getGHCContentKey = (itemId: string): string => {
  // Map dq-ghc to ghc for GUIDE_CONTENT lookup
  if (itemId === 'dq-ghc') {
    return 'ghc';
  }
  return itemId;
};

// Helper function to get related competencies for a GHC service
const getRelatedCompetencies = (currentItemId: string) => {
  const allCompetencies = [
    {
      id: 'ghc',
      title: 'The GHC (Golden Honeycomb of Competencies)',
      description: 'The Master Map that defines how work is organised at Digital Qatalyst.'
    },
    {
      id: 'dq-vision',
      title: 'The Vision (Purpose)',
      description: 'Understand the core mission that aligns our squads and brings real value to the systems we build.'
    },
    {
      id: 'dq-hov',
      title: 'The HoV (Culture)',
      description: 'The Culture That Powers Our Execution through shared principles and behaviors.'
    },
    {
      id: 'dq-persona',
      title: 'The Persona (Identity)',
      description: 'Discover the mindset, traits, and specific roles that define who succeeds at Digital Qatalyst.'
    },
    {
      id: 'dq-agile-tms',
      title: 'Agile TMS (Tasks)',
      description: 'Discover how our Task Management System turns high-level strategy into focused, structured action.'
    },
    {
      id: 'dq-agile-sos',
      title: 'Agile SoS (Governance)',
      description: 'Discover how our four pillars of governance enable intelligent, disciplined execution.'
    },
    {
      id: 'dq-agile-flows',
      title: 'Agile Flows (Value Streams)',
      description: 'How We Orchestrate Value through connected systems and structured streams.'
    },
    {
      id: 'dq-agile-6xd',
      title: 'Agile 6xD (Products)',
      description: 'Six Lenses for Digital Transformation to create true cognitive capabilities.'
    }
  ];

  // Filter out the current competency and return 3 others
  const otherCompetencies = allCompetencies.filter(comp => 
    comp.id !== currentItemId && comp.id !== getGHCContentKey(currentItemId)
  );
  
  // Return first 3 competencies
  return otherCompetencies.slice(0, 3);
};

interface GuideRecord {
  id: string;
  slug?: string;
  title: string;
  summary?: string;
  heroImageUrl?: string | null;
  domain?: string | null;
  guideType?: string | null;
  functionArea?: string | null;
  subDomain?: string | null;
  unit?: string | null;
  location?: string | null;
  status?: string | null;
  complexityLevel?: string | null;
  skillLevel?: string | null;
  estimatedTimeMin?: number | null;
  lastUpdatedAt?: string | null;
  authorName?: string | null;
  authorOrg?: string | null;
  downloadCount?: number | null;
  documentUrl?: string | null;
  body?: string | null;
}

type TabId = 'overview' | 'understand' | 'learn-practice' | 'other-materials' | 'purpose' | 'guideline' | 'application' | 'timing' | 'essentials' | 'practice' | 'usage';

const TABS: { id: TabId; label: string }[] = [
  { id: 'purpose',         label: 'Purpose' },
  { id: 'essentials',      label: 'Essentials' },
  { id: 'practice',        label: 'Practice' },
  { id: 'usage',           label: 'Usage' },
];

const NON_GHC_TABS: { id: TabId; label: string }[] = [
  { id: 'overview',        label: 'Overview' },
  { id: 'other-materials', label: 'Other Materials' },
];

const DIGITAL_WORKSPACE_TABS: { id: TabId; label: string }[] = [
  { id: 'purpose',         label: 'Purpose' },
  { id: 'guideline',       label: 'Guideline' },
  { id: 'application',     label: 'Application' },
  { id: 'timing',          label: 'Timing' },
];

/* ─────────────────────────────── Sub-components ────────────────────────── */

/** Heading block with left coloured accent bar — blue accent for service detail pages */
const Heading = ({ text }: { text: string }) => (
  <h2 className="flex items-center gap-3 text-xl font-semibold text-gray-900">
    <span className="h-6 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#030E31' }} />
    {text}
  </h2>
);

/** Sub-heading without accent bar */
const SubHeading = ({ text }: { text: string }) => (
  <h3 className="text-xl font-semibold text-gray-900 mb-6">
    {text}
  </h3>
);

/** Green check-circle checklist — exact Lovable pattern */
const Checklist = ({ items }: { items: string[] }) => (
  <ul className="space-y-3">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <CheckCircle2
          className="mt-0.5 h-5 w-5 flex-shrink-0"
          style={{ color: 'hsl(var(--success))' }}
        />
        <span className="text-gray-800 leading-relaxed">{item}</span>
      </li>
    ))}
  </ul>
);

/* ─────────────────────────────── Main Page ─────────────────────────────── */

export const ServiceDetailPage: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const [guide, setGuide] = useState<GuideRecord | null>(null);
  const [ghcContent, setGhcContent] = useState<GuideContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Check if this is a GHC service - use ghcContent state for accurate detection
  const isGHC = !!ghcContent;
  const isDigitalWorkspace = isDigitalWorkspaceGuideline(guide);
  
  // Memoize tab selection to ensure it updates when ghcContent changes
  const currentTabs = useMemo(() => {
    if (isGHC) return TABS;
    if (isDigitalWorkspace) return DIGITAL_WORKSPACE_TABS;
    return NON_GHC_TABS;
  }, [isGHC, isDigitalWorkspace]);

  // Force re-render when ghcContent or guide changes to update tabs
  useEffect(() => {
    if (ghcContent || guide) {
      // Set appropriate default tab based on guideline type
      if (isDigitalWorkspaceGuideline(guide)) {
        setActiveTab('purpose');
      } else if (ghcContent) {
        setActiveTab('purpose');
      } else {
        setActiveTab('overview');
      }
      setForceUpdate(prev => prev + 1);
    }
  }, [ghcContent, guide]);

  // Scroll to top immediately when itemId changes (for navigation between related competencies)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [itemId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      
      // Scroll to top when navigating to a new service
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      try {
        const key = String(itemId || '');
        
        // Check if this is a GHC service
        if (isGHCService(key)) {
          // Use GUIDE_CONTENT for GHC services
          const contentKey = getGHCContentKey(key);
          const content = GUIDE_CONTENT[contentKey];
          
          if (!content) {
            throw new Error('GHC content not found');
          }
          
          if (!cancelled) {
            setGhcContent(content);
            // Create a mock guide record for GHC services
            const mockGuide: GuideRecord = {
              id: key,
              slug: key,
              title: content.title,
              summary: content.subtitle,
              heroImageUrl: null,
              domain: 'GHC',
              guideType: 'competency',
              functionArea: 'All',
              subDomain: null,
              unit: 'All Units',
              location: null,
              status: 'active',
              complexityLevel: 'intermediate',
              skillLevel: 'all',
              estimatedTimeMin: null,
              lastUpdatedAt: new Date().toISOString(),
              authorName: 'DQ Admin',
              authorOrg: 'Digital Qatalyst',
              downloadCount: null,
              documentUrl: null,
              body: content.shortOverview,
            };
            setGuide(mockGuide);
          }
        } else {
          // Use Supabase for non-GHC services (existing logic)
          let { data: row, error: err1 } = await supabaseClient
            .from('guides').select('*').eq('slug', key).maybeSingle();

          if (err1 || !row) {
            const { data: row2, error: err2 } = await supabaseClient
              .from('guides').select('*').eq('id', key).maybeSingle();
            if (err2) throw err2;
            row = row2 as any;
          }
          if (!row) throw new Error('Not found');

          const mapped: GuideRecord = {
            id: row.id, slug: row.slug, title: row.title,
            summary: row.summary ?? undefined,
            heroImageUrl: row.hero_image_url ?? row.heroImageUrl ?? null,
            domain: row.domain ?? null,
            guideType: row.guide_type ?? row.guideType ?? null,
            functionArea: row.function_area ?? null,
            subDomain: row.sub_domain ?? row.subDomain ?? null,
            unit: row.unit ?? null, location: row.location ?? null,
            status: row.status ?? null,
            complexityLevel: row.complexity_level ?? row.complexityLevel ?? null,
            skillLevel: row.skill_level ?? row.skillLevel ?? null,
            estimatedTimeMin: row.estimated_time_min ?? row.estimatedTimeMin ?? null,
            lastUpdatedAt: row.last_updated_at ?? row.lastUpdatedAt ?? null,
            authorName: row.author_name ?? row.authorName ?? null,
            authorOrg: row.author_org ?? row.authorOrg ?? null,
            downloadCount: row.download_count ?? row.downloadCount ?? null,
            documentUrl: row.document_url ?? row.documentUrl ?? null,
            body: row.body ?? null,
          };
          if (!cancelled) setGuide(mapped);
        }
      } catch {
        if (!cancelled) setError('Service Guideline not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [itemId]);

  /* ── Loading / Error states ── */
  if (loading) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(p => !p)} sidebarOpen={sidebarOpen} />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading service details…</p>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );

  if (error || !guide) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(p => !p)} sidebarOpen={sidebarOpen} />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't locate that service guideline.</p>
          <button
            onClick={() => navigate('/marketplace/guides')}
            className="px-5 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: '#030E31' }}
          >Back to Marketplace</button>
        </div>
      </div>
      <Footer isLoggedIn={false} />
    </div>
  );

  /* ── Derived content ── */
  const fullGuidePath = `/marketplace/guides/${guide.slug || guide.id}`;

  const formattedDate = guide.lastUpdatedAt 
    ? new Date(guide.lastUpdatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : 'Unknown';

  const summaryRows: { label: string; value: string }[] = [
    { label: 'Date Uploaded',    value: formattedDate },
    { label: 'Uploaded By',      value: guide.authorName || 'Caleb' },
    { label: 'Unit',             value: guide.unit || 'All Units' },
  ];

  // Get the appropriate title and description based on whether it's GHC or not
  const displayTitle = isGHC && ghcContent ? ghcContent.title : guide.title;
  const displaySubtitle = isGHC && ghcContent ? 'GHC is the operating framework that connects direction, culture, and execution at DQ.' : 'Guidelines for transitioning to an associate-owned device model at DQ';
  const summaryTitle = isGHC && ghcContent ? `${ghcContent.title.split('(')[0].trim()} Summary` : 'Guideline summary';
  const relatedSectionTitle = isGHC ? 'Related GHC Components' : 'Related Guidelines';
  const browseAllText = isGHC ? 'Browse all competencies' : 'Browse all guidelines';
  const moreDetailButtonText = 'View Guidelines';

  // Dynamic button configuration for GHC services based on active tab
  const getGHCButtonConfig = () => {
    if (!isGHC || !itemId) return null;
    
    switch (activeTab) {
      case 'purpose':
        return {
          text: 'View Details',
          url: `/marketplace/guides/${itemId}/details` // Link to detailed guide page with body content
        };
      case 'essentials':
        return {
          text: 'Read More in Playbook',
          url: 'https://digital-qatalyst.shorthandstories.com/5e83bb73-0c29-4070-9a92-5ada3c3e6f69/index.html'
        };
      case 'practice':
        return {
          text: 'View Course',
          url: 'https://dq-intranet-pykepfa4x-digitalqatalysts-projects.vercel.app/lms/ghc-course/lesson/7191832f-d3ac-4577-9eb2-80c9a57e7e28'
        };
      case 'usage':
        return {
          text: 'View Implementation Guide',
          url: `/marketplace/guides/${itemId}/details`
        };
      default:
        return {
          text: 'View Details',
          url: `/marketplace/guides/${itemId}/details`
        };
    }
  };

  const ghcButtonConfig = getGHCButtonConfig();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header toggleSidebar={() => setSidebarOpen(p => !p)} sidebarOpen={sidebarOpen} />

      <main className="flex-1">
        {/* ── Hero Banner — glassmorphism, radial gradient mesh ── */}
        <div
          className="relative overflow-hidden pt-4 pb-20 px-6"
          style={{
            background: `linear-gradient(to right, #192D6C, #051139)`,
          }}
        >
          {/* Floating orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] left-[15%] w-48 h-48 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, hsl(var(--cta) / 0.6), transparent 70%)' }} />
            <div className="absolute top-[30%] right-[10%] w-64 h-64 rounded-full opacity-15"
              style={{ background: 'radial-gradient(circle, hsl(260 70% 60% / 0.5), transparent 70%)' }} />
            <div className="absolute bottom-[5%] left-[40%] w-56 h-56 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, hsl(200 80% 60% / 0.5), transparent 70%)' }} />
          </div>

          {/* Fade-to-white gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to top, white, transparent)' }} />

          <div className="container mx-auto relative z-10 max-w-7xl">
            {/* ── Breadcrumbs row — Lovable HeroBanner pattern ── */}
            <nav className="flex items-center justify-between pb-6">
              <ol className="flex items-center gap-1 text-sm">
                <li className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" style={{ color: 'hsl(var(--hero-foreground) / 0.5)' }} />
                  <Link
                    to="/"
                    className="transition-colors hover:opacity-80"
                    style={{ color: 'hsl(var(--hero-foreground) / 0.5)' }}
                  >
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-1" style={{ color: 'hsl(var(--hero-foreground) / 0.3)' }}>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <Link
                    to="/marketplace/guides"
                    className="transition-colors hover:opacity-80"
                    style={{ color: 'hsl(var(--hero-foreground) / 0.5)' }}
                  >
                    Guides
                  </Link>
                </li>
                <li className="flex items-center gap-1" style={{ color: 'hsl(var(--hero-foreground) / 0.3)' }}>
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span
                    className="font-medium max-w-[220px] truncate"
                    style={{ color: 'hsl(var(--hero-foreground) / 0.85)' }}
                  >
                    {guide.title}
                  </span>
                </li>
              </ol>
            </nav>

            {/* Glassmorphism content panel */}
            <div
              className="rounded-2xl p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(210,220,255,0.07)',
                border: '1px solid rgba(210,220,255,0.12)',
              }}
            >
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
                  style={{ color: 'hsl(var(--hero-foreground))' }}>
                  {displayTitle}
                </h1>

                <p className="max-w-2xl text-base md:text-lg leading-relaxed"
                  style={{ color: 'hsl(var(--hero-muted))' }}>
                  {displaySubtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Bar — bottom-line indicator style ── */}
        <div className="border-b border-gray-200 bg-white">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex gap-0 overflow-x-auto scrollbar-none">
              {currentTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative whitespace-nowrap px-5 py-4 text-sm font-medium transition-colors focus:outline-none"
                  style={{
                    color: activeTab === tab.id ? '#111827' : '#6B7280',
                  }}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main 2-col layout ── */}
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left — Tab content (2 cols) */}
            <div className="lg:col-span-2 space-y-8">

              {activeTab === 'overview' && !isDigitalWorkspace && (
                <>
                  <Heading text="Overview" />
                  {isGHC && ghcContent ? (
                    // GHC Overview content - rich formatting from detailed guide page
                    <div className="space-y-6">
                      {/* Main Description */}
                      <div className="prose prose-base max-w-none text-gray-700 leading-relaxed space-y-4">
                        {ghcContent.shortOverview.split('\n\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>

                      {/* Course Highlights Section */}
                      <div className="space-y-5">
                        <SubHeading text="Five Reasons To Work With The GHC" />
                        {ghcContent.highlights.map((highlight, index) => {
                          const [title, ...descParts] = highlight.split(':')
                          const description = descParts.join(':').trim()
                          return (
                            <div key={index} className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" />
                                </svg>
                              </div>
                              <p className="text-gray-700 text-base leading-relaxed">
                                <span className="font-semibold">{title}:</span> {description}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : isDigitalWorkspace ? (
                    // Digital Workspace Overview content - refined and comprehensive
                    <div className="space-y-6">
                      {/* Main Description */}
                      <div className="prose prose-base max-w-none text-gray-700 leading-relaxed space-y-4">
                        <p>
                          The Associate Owned Asset Initiative represents a strategic transformation in how DQ manages workplace technology. 
                          By shifting from traditional company-owned devices to associate-owned assets, we create a more flexible, 
                          cost-effective, and secure approach to device management.
                        </p>
                        <p>
                          These guidelines establish clear frameworks for three distinct programs—BYOD, FYOD, and HYOD—each designed 
                          to accommodate different associate needs while maintaining operational excellence and security standards.
                        </p>
                      </div>

                      {/* Key Objectives */}
                      <div className="space-y-5">
                        <SubHeading text="Strategic Objectives" />
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Mitigate Asset Theft</h4>
                              <p className="text-gray-700 text-sm">Reduce risk of device misappropriation through clear ownership structures and accountability measures.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Promote Accountability</h4>
                              <p className="text-gray-700 text-sm">Establish direct responsibility for device maintenance, security, and proper usage among associates.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Support Seamless Transitions</h4>
                              <p className="text-gray-700 text-sm">Ensure smooth onboarding and device management processes with minimal work disruption.</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">Optimize Operational Efficiency</h4>
                              <p className="text-gray-700 text-sm">Streamline IT operations and reduce administrative overhead through distributed device management.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Program Overview */}
                      <div className="space-y-5">
                        <SubHeading text="Available Programs" />
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-blue-600 font-bold">BYOD</span>
                            </div>
                            <h4 className="font-semibold text-blue-900 mb-2">Bring Your Own Device</h4>
                            <p className="text-blue-800 text-sm">Use your personal device for work with company security standards.</p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-green-600 font-bold">FYOD</span>
                            </div>
                            <h4 className="font-semibold text-green-900 mb-2">Finance Your Own Device</h4>
                            <p className="text-green-800 text-sm">Purchase a company device with salary deduction options.</p>
                          </div>
                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-orange-600 font-bold">HYOD</span>
                            </div>
                            <h4 className="font-semibold text-orange-900 mb-2">Hold Your Own Device</h4>
                            <p className="text-orange-800 text-sm">Temporary company device for emergency situations.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Non-GHC, Non-Digital Workspace Overview content (existing)
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>
                        The Associate Owned Asset Initiative is a strategic effort aimed at enhancing operational efficiency, 
                        reducing asset management costs, and improving the accountability of devices used for company work. 
                        As a result of this initiative, the Associate Owned Asset Guidelines have been developed to mitigate 
                        the risk of asset theft by departing associates, while ensuring secure management and compliance 
                        with company standards.
                      </p>
                      <p>
                        The main objective of the Associate Owned Asset Guidelines is to establish clear procedures for 
                        transitioning to an associate-owned device model at DQ. This initiative aims to:
                      </p>
                      <div className="pt-2">
                        <Checklist items={[
                          "Mitigate Asset Theft.",
                          "Promote Accountability.",
                          "Support Seamless Transitions.",
                          "Optimize Operational Efficiency."
                        ]} />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* GHC Service Tabs */}
              {activeTab === 'purpose' && isGHC && ghcContent && (
                <>
                  <div className="space-y-6">
                    <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                      <p>
                        {ghcContent.shortOverview.split('\n\n')[0] || 'This competency provides essential frameworks and practices for effective leadership and operational excellence at DQ.'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <SubHeading text="Key Benefits" />
                      <Checklist items={
                        ghcContent.highlights.slice(0, 4).map(highlight => {
                          const [title, ...descParts] = highlight.split(':')
                          const description = descParts.join(':').trim()
                          return `${title}: ${description}`
                        })
                      } />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'essentials' && isGHC && ghcContent && (
                <>
                  <div className="space-y-6">
                    <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                      <p>
                        {ghcContent.storybookIntro.split('\n\n')[0] || 'Essential concepts and frameworks you need to understand for this competency.'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <SubHeading text="Core Concepts" />
                      <Checklist items={
                        ghcContent.whatYouWillLearn.slice(0, 4).map(item => {
                          const [title, ...descParts] = item.split(':')
                          const description = descParts.join(':').trim()
                          return `${title}: ${description}`
                        })
                      } />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'practice' && isGHC && ghcContent && (
                <>
                  <div className="space-y-6">
                    <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                      <p>
                        {ghcContent.courseIntro?.split('\n\n')[0] || 'Practical exercises and learning opportunities to develop your skills in this competency area.'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <SubHeading text="Learning Activities" />
                      <Checklist items={
                        ghcContent.whatYouWillPractice?.slice(0, 4).map(item => {
                          const [title, ...descParts] = item.split(':')
                          const description = descParts.join(':').trim()
                          return `${title}: ${description}`
                        }) || [
                          "Interactive Learning: Engage with practical scenarios and case studies",
                          "Skill Development: Build competency through guided exercises",
                          "Knowledge Application: Apply concepts to real-world situations",
                          "Progress Tracking: Monitor your learning journey and achievements"
                        ]
                      } />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'usage' && isGHC && ghcContent && (
                <>
                  <div className="space-y-6">
                    <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                      <p>
                        Apply this competency in your daily work through practical implementation strategies and real-world scenarios that drive operational excellence.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <SubHeading text="Implementation Areas" />
                      <Checklist items={[
                        "Daily Operations: Integrate competency principles into routine work processes",
                        "Team Leadership: Apply frameworks when leading and managing team activities",
                        "Decision Making: Use competency guidelines for strategic and operational decisions",
                        "Continuous Improvement: Leverage insights for ongoing process enhancement"
                      ]} />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'understand' && isGHC && ghcContent && (
                <>
                  <Heading text="Understand" />
                  <div className="space-y-6">
                    {/* Storybook Description */}
                    <div className="prose prose-base max-w-none text-gray-700 leading-relaxed space-y-4">
                      {ghcContent.storybookIntro.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>

                    {/* What You Will Understand Section */}
                    <div className="space-y-5">
                      <SubHeading text="What You'll Understand" />
                      {ghcContent.whatYouWillLearn.map((item, index) => {
                        const [title, ...descParts] = item.split(':')
                        const description = descParts.join(':').trim()
                        return (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" />
                              </svg>
                            </div>
                            <p className="text-gray-700 text-base leading-relaxed">
                              <span className="font-semibold">{title}:</span> {description}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Open Storybook Button */}
                    <div className="pt-4">
                      <button
                        onClick={() => window.location.href = 'https://digital-qatalyst.shorthandstories.com/5e83bb73-0c29-4070-9a92-5ada3c3e6f69/index.html'}
                        className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: '#030E31' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#020A28' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#030E31' }}
                      >
                        <BookOpen className="h-4 w-4" />
                        Read more in the storybook
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'learn-practice' && isGHC && ghcContent && (
                <>
                  <Heading text="Learn & Practice" />
                  <div className="space-y-6">
                    {/* Course Description */}
                    <div className="prose prose-base max-w-none text-gray-700 leading-relaxed space-y-4">
                      {ghcContent.courseIntro?.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>

                    {/* What You'll Practice & Understand Section */}
                    <div className="space-y-5">
                      <SubHeading text="What You'll Learn & Practice" />
                      {ghcContent.whatYouWillPractice?.map((item, index) => {
                        const [title, ...descParts] = item.split(':')
                        const description = descParts.join(':').trim()
                        return (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" />
                              </svg>
                            </div>
                            <p className="text-gray-700 text-base leading-relaxed">
                              <span className="font-semibold">{title}:</span> {description}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {/* View Course Button */}
                    <div className="pt-4">
                      <button
                        onClick={() => window.location.href = 'https://dq-intranet-pykepfa4x-digitalqatalysts-projects.vercel.app/lms/ghc-course/lesson/7191832f-d3ac-4577-9eb2-80c9a57e7e28'}
                        className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: '#030E31' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#020A28' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#030E31' }}
                      >
                        <PlayCircle className="h-4 w-4" />
                        View Course
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'other-materials' && (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                  <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-500">
                    <Bookmark className="h-5 w-5" />
                  </div>
                  <Heading text="Other Materials" />
                  <p className="mt-2 text-gray-500 max-w-sm">
                    {isGHC 
                      ? 'Additional resources and materials for this competency will be coming soon.'
                      : 'Supplementary resources and templates for this guideline will be coming soon.'
                    }
                  </p>
                </div>
              )}

              {/* Digital Workspace Guideline Tabs */}
              {activeTab === 'purpose' && isDigitalWorkspace && (
                <>
                  <div className="space-y-6">
                    <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                      <p>
                        These guidelines address critical operational challenges by creating a more efficient, secure, and accountable device management system that reduces asset theft while empowering associates with flexible device ownership options.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <SubHeading text="Key Benefits" />
                      <Checklist items={[
                        "Enhanced Security: Clear ownership reduces risk of asset misappropriation",
                        "Cost Reduction: Lower procurement and maintenance expenses for the company", 
                        "Improved Accountability: Associates take direct responsibility for device care",
                        "Operational Flexibility: Multiple programs accommodate different associate needs"
                      ]} />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'guideline' && isDigitalWorkspace && (
                <>
                  <div className="space-y-6">
                    <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                      <p>
                        The Associate Owned Asset Guidelines establish three core programs (BYOD, FYOD, HYOD) that provide flexible device ownership options while maintaining security and operational standards for all DQ associates.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <SubHeading text="Available Programs" />
                      <Checklist items={[
                        "BYOD Program: Use personal devices that meet DQ technical specifications",
                        "FYOD Program: Purchase company devices with salary deduction options",
                        "HYOD Program: Temporary company devices for emergency situations",
                        "Compliance Standards: All programs ensure security and company policy adherence"
                      ]} />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'application' && isDigitalWorkspace && (
                <>
                  <div className="space-y-6">
                    <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                      <p>
                        Implementation involves assessing your device needs, checking technical requirements, submitting the appropriate program application, and maintaining ongoing compliance with security protocols and company policies.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <SubHeading text="Implementation Steps" />
                      <Checklist items={[
                        "Simple Process: Four-step implementation from assessment to compliance",
                        "Technical Support: IT assistance for device setup and requirements verification",
                        "Security Protocols: Clear guidelines for device maintenance and data protection",
                        "Ongoing Support: Regular compliance reviews and policy updates"
                      ]} />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'timing' && isDigitalWorkspace && (
                <>
                  <div className="space-y-6">
                    <div className="prose prose-base max-w-none text-gray-700 leading-relaxed">
                      <p>
                        Apply these guidelines during new employee onboarding, device replacement needs, emergency situations requiring temporary devices, or role changes that affect device requirements and technical specifications.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <SubHeading text="Key Scenarios" />
                      <Checklist items={[
                        "Onboarding Support: Seamless device setup within first week of employment",
                        "Emergency Response: Same-day temporary device access for critical situations",
                        "Planned Transitions: 30-day advance planning for device replacements",
                        "Role Flexibility: Easy program updates when job requirements change"
                      ]} />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right — Sticky metadata sidebar (1 col) */}
            <aside className="order-first lg:order-last">
              <div className="sticky top-6 space-y-4">
                {/* Summary card */}
                <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white">
                  {/* card header */}
                  <div className="px-5 pt-5 pb-3 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900">{summaryTitle}</h3>
                  </div>
                  {/* key-value rows */}
                  <div className="px-5 py-4 space-y-3">
                    {summaryRows.map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{label}</span>
                        <span className="font-medium text-gray-900 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                  {/* CTAs */}
                  <div className="px-5 pb-5 space-y-2.5">
                    {isGHC && ghcButtonConfig ? (
                      <button
                        onClick={() => {
                          // Check if it's an external URL
                          if (ghcButtonConfig.url.startsWith('http')) {
                            // External links navigate in same tab
                            window.location.href = ghcButtonConfig.url;
                          } else {
                            // Internal links navigate in same tab
                            navigate(ghcButtonConfig.url);
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#030E31' }}
                      >
                        {ghcButtonConfig.text} <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(fullGuidePath)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#030E31' }}
                      >
                        {moreDetailButtonText} <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>


              </div>
            </aside>
          </div>
        </div>

        {/* ── Related Services section ── */}
        <section className="border-t border-gray-100 bg-gray-50 px-6 py-12">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
              <Heading text={relatedSectionTitle} />
              <Link
                to="/marketplace/guides"
                className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {browseAllText} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {/* Related competencies cards */}
            {isGHC ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {getRelatedCompetencies(itemId || '').map((competency) => (
                  <Link
                    key={competency.id}
                    to={`/marketplace/guides/service/${competency.id}`}
                    className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-gray-200 h-full"
                  >
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full uppercase tracking-wide">
                        COMPETENCY
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 transition-colors">
                      {competency.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                      {competency.description}
                    </p>
                    <div className="flex items-center text-sm font-medium transition-colors mt-auto" style={{ color: '#FB5535' }}>
                      <span className="group-hover:text-orange-400">Read more</span> <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-gray-100 bg-white h-40 shadow-sm flex items-center justify-center"
                  >
                    <span className="text-gray-400 text-sm font-medium">Coming Soon</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default ServiceDetailPage;
