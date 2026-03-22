import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon, ArrowLeft, ExternalLink } from 'lucide-react';
import { useAuth } from '../../components/Header/context/AuthContext';
import { GuidelineSection } from '../guidelines/l24-working-rooms/GuidelineSection';

interface GlossaryTerm {
  id: string;
  title: string;
  meaning: string;
  level: 'Awareness' | 'Practitioner' | 'Leadership';
  description: string;
  expectedBehaviors: string[];
  whereApplies: string[];
  imageUrl?: string;
  longDescription?: string;
  examples?: string[];
  relatedTerms?: string[];
  category?: string;
  definition?: string;
  inSimpleTerms?: string;
  whatItMeans?: string;
  learnMoreLink?: string;
}

// GHC glossary data - all 7 Golden Honeycomb Components
const SAMPLE_GHC_TERMS: GlossaryTerm[] = [
  {
    id: 'dq-vision-purpose',
    title: 'The DQ Vision (Purpose)',
    meaning: 'Defines why DQ exists and the outcomes digital transformation must deliver.',
    level: 'Leadership',
    description: 'Defines why DQ exists and the outcomes digital transformation must deliver.',
    longDescription: 'The DQ Vision establishes the fundamental purpose and strategic intent of DQ. It defines why DQ exists and articulates the outcomes that digital transformation must deliver. This component ensures strategic intent and purpose are clearly understood, drives outcome-driven transformation across all initiatives, and maintains alignment across organizational initiatives.',
    expectedBehaviors: [
      'Strategic intent & purpose',
      'Outcome-driven transformation',
      'Alignment across initiatives'
    ],
    whereApplies: ['Vision', 'Purpose', 'Outcomes'],
    examples: [],
    relatedTerms: ['HoV — House of Value (Culture)', 'Agile SoS (Governance)'],
    category: 'DQ GHC — Purpose & Identity',
    definition: 'The DQ Vision is the core purpose of DigitalQatalyst — our fundamental belief about the world we operate in and the future we aim to create. It defines why we exist and guides how decisions are made, systems are designed, and solutions are delivered across the organisation.',
    inSimpleTerms: 'The DQ Vision explains why DQ thinks differently, acts boldly, and builds systems the way we do.',
    whatItMeans: `At its heart, the DQ Vision focuses on the small, everyday transactions that shape human life — paying a bill, submitting a form, checking a record, tracking a delivery.

These moments may appear simple, but they often fail because organisational systems are fragmented, poorly designed, or misaligned.

The DQ Vision recognises that:

Every transaction reflects the quality of the systems behind it

When systems are clear, connected, and intelligently orchestrated, life moves with less friction

When they are not, people experience delay, confusion, and breakdown

This perspective drives DQ's commitment to redesign how organisations think, learn, and operate.`,
    learnMoreLink: 'https://digital-qatalyst.shorthandstories.com/5d87ac25-6eb5-439e-a861-845787aa8e59/index.html'
  },
  {
    id: 'hov-house-of-value-culture',
    title: 'HoV — House of Value (Culture)',
    meaning: 'Establishes how value is created, measured, and sustained through culture.',
    level: 'Leadership',
    description: 'Establishes how value is created, measured, and sustained through culture.',
    longDescription: 'The House of Value (HoV) establishes how value is created, measured, and sustained through organizational culture. It defines value dimensions that guide decision-making, ensures cultural alignment across the organization, and provides frameworks for decision prioritization that reflect DQ\'s core values.',
    expectedBehaviors: [
      'Value dimensions',
      'Cultural alignment',
      'Decision prioritization'
    ],
    whereApplies: ['Culture', 'Value', 'Alignment'],
    examples: [],
    relatedTerms: ['The DQ Vision (Purpose)', 'Persona (Identity)']
  },
  {
    id: 'persona-identity',
    title: 'Persona (Identity)',
    meaning: 'Defines roles, responsibilities, and identity across the DQ ecosystem.',
    level: 'Practitioner',
    description: 'Defines roles, responsibilities, and identity across the DQ ecosystem.',
    longDescription: 'Persona defines roles, responsibilities, and identity across the DQ ecosystem. It establishes clear associate personas that reflect different roles and contributions, sets capability expectations for each persona type, and ensures role clarity so individuals understand their responsibilities and contributions to DQ\'s mission.',
    expectedBehaviors: [
      'Associate personas',
      'Capability expectations',
      'Role clarity'
    ],
    whereApplies: ['Identity', 'Roles', 'Capability'],
    examples: [],
    relatedTerms: ['HoV — House of Value (Culture)', 'Agile TMS (Ways of Working)']
  },
  {
    id: 'agile-tms-ways-of-working',
    title: 'Agile TMS (Ways of Working)',
    meaning: 'Defines how work is structured, executed, and continuously improved at DQ.',
    level: 'Practitioner',
    description: 'Defines how work is structured, executed, and continuously improved at DQ.',
    longDescription: 'Agile TMS defines how work is structured, executed, and continuously improved at DQ. It establishes task and sprint models that organize work delivery, defines Working Rooms (WRs) as collaborative spaces for execution, and establishes collaboration rituals that enable effective teamwork and continuous improvement.',
    expectedBehaviors: [
      'Task & sprint models',
      'Working Rooms (WRs)',
      'Collaboration rituals'
    ],
    whereApplies: ['Ways of Working', 'Execution', 'Delivery'],
    examples: [],
    relatedTerms: ['Persona (Identity)', 'Agile Flows (Value Streams)']
  },
  {
    id: 'agile-sos-governance',
    title: 'Agile SoS (Governance)',
    meaning: 'Ensures governance, discipline, and alignment without slowing execution.',
    level: 'Leadership',
    description: 'Ensures governance, discipline, and alignment without slowing execution.',
    longDescription: 'Agile SoS ensures governance, discipline, and alignment without slowing execution. It establishes systems of governance that maintain quality and consistency, enforces quality and discipline standards across all work, and manages risk and compliance requirements while maintaining agility and speed.',
    expectedBehaviors: [
      'Systems of Governance',
      'Quality & discipline',
      'Risk & compliance'
    ],
    whereApplies: ['Governance', 'Discipline', 'Quality'],
    examples: [],
    relatedTerms: ['The DQ Vision (Purpose)', 'Agile Flows (Value Streams)']
  },
  {
    id: 'agile-flows-value-streams',
    title: 'Agile Flows (Value Streams)',
    meaning: 'Designs how value flows from idea to delivery across DQ.',
    level: 'Practitioner',
    description: 'Designs how value flows from idea to delivery across DQ.',
    longDescription: 'Agile Flows designs how value flows from idea to delivery across DQ. It employs value stream mapping to visualize and optimize flow, focuses on flow efficiency to reduce waste and delays, and ensures outcome alignment so that value streams deliver the intended outcomes.',
    expectedBehaviors: [
      'Value stream mapping',
      'Flow efficiency',
      'Outcome alignment'
    ],
    whereApplies: ['Value Streams', 'Flow', 'Outcomes'],
    examples: [],
    relatedTerms: ['Agile TMS (Ways of Working)', 'Agile 6×D (Products)']
  },
  {
    id: 'agile-6xd-products',
    title: 'Agile 6×D (Products)',
    meaning: 'Defines how digital products are designed, built, and scaled at DQ.',
    level: 'Practitioner',
    description: 'Defines how digital products are designed, built, and scaled at DQ.',
    longDescription: 'Agile 6×D defines how digital products are designed, built, and scaled at DQ. It establishes product lifecycle processes from conception to retirement, defines platforms and architecture standards for scalability, and enables continuous delivery practices that allow rapid iteration and deployment.',
    expectedBehaviors: [
      'Product lifecycle',
      'Platforms & architecture',
      'Continuous delivery'
    ],
    whereApplies: ['Products', 'Platforms', '6×D'],
    examples: [],
    relatedTerms: ['Agile Flows (Value Streams)', 'Agile TMS (Ways of Working)']
  }
];

const LEVEL_COLORS = {
  'Awareness': '#fbbf24', // amber
  'Practitioner': '#3b82f6', // blue
  'Leadership': '#8b5cf6' // purple
};

// SideNav component for Glossary
function GlossarySideNav({ term }: { term: GlossaryTerm }) {
  const sections = useMemo(() => [
    ...(term.definition ? [{ id: 'definition', label: 'Definition' }] : []),
    ...(term.inSimpleTerms ? [{ id: 'in-simple-terms', label: 'In Simple Terms' }] : []),
    ...(term.whatItMeans ? [{ id: 'what-it-means', label: `What ${term.title.split(' (')[0]} Means` }] : []),
    ...(term.learnMoreLink ? [{ id: 'learn-more', label: 'Learn More' }] : []),
  ], [term]);
  const [currentSection, setCurrentSection] = useState(sections[0]?.id || 'definition');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          if (sectionId) {
            setCurrentSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  const handleClick = (sectionId: string) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
      <div className="pr-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Contents
        </h3>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => handleClick(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  currentSection === section.id
                    ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// Hero Section for Glossary
function GlossaryHeroSection({ term, levelColor }: { term: GlossaryTerm; levelColor: string }) {
  const imageUrl = term.imageUrl || '/images/guidelines-content.PNG';
  
  // Force refresh by adding timestamp
  const timestampedImageUrl = imageUrl.includes('?') ? imageUrl : `${imageUrl}?t=${Date.now()}`;
  
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* Background Image with Dark Navy Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${timestampedImageUrl})` }}
      >
        <div className="absolute inset-0 bg-[#030E31] bg-opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 text-white">
        <div className="max-w-4xl">
          {/* Pill Tag */}
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
            Glossary Entry
          </span>

          {/* Category */}
          {term.category && (
            <div className="text-sm text-white/90 mb-2 font-inter">
              {term.category}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight font-inter">
            {term.title.split(' (')[0]}
          </h1>

          {/* Meaning */}
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-4">
            {term.meaning}
          </p>

          {/* Level Badge */}
          <div className="flex items-center gap-3 mt-4">
            <span
              className="px-4 py-2 text-sm font-semibold text-white rounded-full"
              style={{ backgroundColor: levelColor }}
            >
              {term.level}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20"></div>
    </div>
  );
}

export function GHCGlossaryDetailPage() {
  const { termId } = useParams<{ termId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const term = SAMPLE_GHC_TERMS.find(t => t.id === termId);

  if (!term) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Term Not Found</h1>
            <p className="text-gray-600 mb-6">The glossary term you're looking for doesn't exist.</p>
            <Link
              to="/marketplace/guides/glossary/ghc"
              className="px-4 py-2 bg-[var(--guidelines-primary)] text-white rounded-lg hover:bg-[var(--guidelines-primary-dark)] transition-colors inline-block"
            >
              Back to GHC Glossary
            </Link>
          </div>
        </main>
        <Footer isLoggedIn={!!user} />
      </div>
    );
  }

  const levelColor = LEVEL_COLORS[term.level];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
      {/* Hero Section */}
      <GlossaryHeroSection term={term} levelColor={levelColor} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Definition Section */}
              {term.definition && (
                <GuidelineSection id="definition" title="Definition">
                  <p>{term.definition}</p>
                </GuidelineSection>
              )}

              {/* In Simple Terms Section */}
              {term.inSimpleTerms && (
                <GuidelineSection id="in-simple-terms" title="In Simple Terms">
                  <p>{term.inSimpleTerms}</p>
                </GuidelineSection>
              )}

              {/* What It Means Section */}
              {term.whatItMeans && (
                <GuidelineSection id="what-it-means" title={`What ${term.title.split(' (')[0]} Means`}>
                  <div className="space-y-4">
                    {term.whatItMeans.split('\n\n').map((paragraph, idx) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return null;
                      
                      // Check if paragraph contains bullet-like content
                      if (trimmed.includes('The DQ Vision recognises that:') || 
                          trimmed.includes('recognises that:') ||
                          (trimmed.includes('\n') && (trimmed.includes('Every transaction') || trimmed.includes('When systems')))) {
                        // Split into intro and bullets
                        const parts = trimmed.split('\n');
                        const intro = parts[0];
                        const bullets = parts.slice(1).filter(line => line.trim());
                        
                        return (
                          <div key={idx} className="space-y-3">
                            {intro && <p className="font-medium">{intro}</p>}
                            {bullets.length > 0 && (
                              <ul className="space-y-2 list-none pl-0">
                                {bullets.map((line, lineIdx) => (
                                  <li key={lineIdx} className="flex items-start">
                                    <span className="text-blue-600 mr-3 mt-1.5 flex-shrink-0">•</span>
                                    <span className="flex-1">{line.trim()}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      }
                      
                      // Regular paragraph
                      return (
                        <p key={idx} className="leading-relaxed">{trimmed}</p>
                      );
                    })}
                  </div>
                </GuidelineSection>
              )}

              {/* Fallback to Overview if new format not available */}
              {!term.definition && !term.inSimpleTerms && !term.whatItMeans && (
                <GuidelineSection id="overview" title="Overview">
                  <p className="mb-4">
                    {term.longDescription || term.description}
                  </p>
                </GuidelineSection>
              )}

              {/* Learn More Section */}
              {term.learnMoreLink && (
                <GuidelineSection id="learn-more" title="Learn More">
                  <p className="mb-6 text-gray-700 leading-relaxed">
                    Read the full DQ GHC Storybook for a comprehensive exploration of {term.title.split(' (')[0]}.
                  </p>
                  {term.learnMoreLink !== '#' && (
                    <a
                      href={term.learnMoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#030E31] text-white font-semibold rounded-lg transition-all duration-200 hover:bg-[#020A28] hover:shadow-lg hover:shadow-[#030E31]/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#030E31] focus:ring-offset-2"
                    >
                      <span>Read the Full Storybook</span>
                      <ExternalLink size={18} className="flex-shrink-0" />
                    </a>
                  )}
                </GuidelineSection>
              )}
            </div>

            {/* Right Column - Sticky Side Navigation */}
            <aside className="lg:col-span-1">
              <GlossarySideNav term={term} />
            </aside>
          </div>
        </div>
      </main>

      {/* Related Guidelines Section */}
      <section className="bg-white border-t border-gray-200 py-16 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#0A1A3B' }}>
              Related Competences
            </h2>
            <p className="text-gray-600">
              Explore other GHC competences that might be helpful
            </p>
          </div>
          
          {term.relatedTerms && term.relatedTerms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {term.relatedTerms.map((relatedTermTitle, idx) => {
                const related = SAMPLE_GHC_TERMS.find(t => t.title === relatedTermTitle);
                if (!related) return null;
                return (
                  <Link
                    key={idx}
                    to={`/marketplace/guides/glossary/ghc/${related.id}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6 border border-gray-200"
                  >
                    <div className="mb-3">
                      <span
                        className="px-3 py-1 text-xs font-semibold text-white rounded-full"
                        style={{ backgroundColor: LEVEL_COLORS[related.level] }}
                      >
                        {related.level}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{related.title.split(' (')[0]}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{related.meaning}</p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No related competences found at this time.</p>
            </div>
          )}
        </div>
      </section>

      {/* Need Help Section */}
      <section className="bg-white border-t border-gray-200 py-12 px-6 md:px-12 lg:px-24">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left side - Title */}
            <div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#0A1A3B' }}>
                Need Help?
              </h3>
              <p className="text-gray-600 text-sm">
                Contact the team for assistance
              </p>
            </div>

            {/* Right side - Contact info can be added here if needed */}
          </div>
        </div>
      </section>

      <Footer isLoggedIn={!!user} />
    </div>
  );
}

export default GHCGlossaryDetailPage;
