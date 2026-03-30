import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon, Search, ChevronRight, ChevronDown } from 'lucide-react';
import { useAuth } from '../../components/Header/context/AuthContext';

interface GlossaryTerm {
  id: string;
  title: string;
  shortDescription: string;
  dimension: 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6';
  contentType: 'Definition' | 'Principle' | 'Application';
  whatItMeans: string;
  whyItMatters: string;
  whereApplied: string[];
}

// Sample 6×D glossary data - structure ready for Supabase connection
const SAMPLE_6XD_TERMS: GlossaryTerm[] = [
  {
    id: 'digital-economy',
    title: 'Digital Economy (DE)',
    shortDescription: 'The economic landscape shaped by digital technologies, data, and platform-based business models.',
    dimension: 'D1',
    contentType: 'Definition',
    whatItMeans: 'At DQ, Digital Economy refers to the fundamental shift in how value is created, captured, and distributed through digital means. We help leaders understand market logic shifts, customer behavior evolution, and new value creation mechanisms.',
    whyItMatters: 'Understanding the digital economy is critical for identifying transformation drivers and making strategic decisions that align with market realities.',
    whereApplied: ['Strategic Planning', 'Portfolio Prioritization', 'Client Advisory']
  },
  {
    id: 'dco',
    title: 'Digital Cognitive Organisation (DCO)',
    shortDescription: 'An intelligent, adaptive enterprise that seamlessly integrates human intelligence with AI and digital systems.',
    dimension: 'D2',
    contentType: 'Definition',
    whatItMeans: 'DCO represents DQ\'s vision for the future enterprise—one that learns, responds, and coordinates across people, systems, and decisions. It\'s about creating organizations that think and adapt.',
    whyItMatters: 'DCO provides the destination for transformation efforts, ensuring we build toward intelligent, responsive organizations rather than just digitizing existing processes.',
    whereApplied: ['Target Architecture Design', 'Capability Roadmaps', 'Governance Models']
  },
  {
    id: 'dbp',
    title: 'Digital Business Platform (DBP)',
    shortDescription: 'Modular, integrated, data-driven architectures that unify operations and enable scalable transformation.',
    dimension: 'D3',
    contentType: 'Application',
    whatItMeans: 'At DQ, DBP is our approach to building the technical and operational foundation for transformation. It\'s about creating platforms that are modular, integrated, and data-driven.',
    whyItMatters: 'DBPs make transformation scalable and resilient. They provide the "engine" that enables consistent value delivery across the organization.',
    whereApplied: ['Platform Architecture', 'Integration Strategy', 'Data Strategy']
  },
  {
    id: 'dt2',
    title: 'Digital Transformation 2.0 (DT2.0)',
    shortDescription: 'The discipline of designing and deploying transformation as a repeatable, outcome-driven practice.',
    dimension: 'D4',
    contentType: 'Principle',
    whatItMeans: 'DT2.0 at DQ means treating transformation as a design discipline, not a one-time project. It introduces methods, flows, and governance to make change repeatable and outcome-driven.',
    whyItMatters: 'DT2.0 ensures transformation is systematic and sustainable, moving from ad-hoc initiatives to a continuous capability.',
    whereApplied: ['Transformation Programs', 'Change Management', 'Portfolio Governance']
  },
  {
    id: 'dw-ws',
    title: 'Digital Worker & Workspace (DW:WS)',
    shortDescription: 'People and environments redesigned for digital transformation delivery and sustainability.',
    dimension: 'D5',
    contentType: 'Application',
    whatItMeans: 'DW:WS focuses on the people delivering transformation—their roles, skills, and digitally enabled work environments. It\'s about ensuring teams can deliver and sustain change effectively.',
    whyItMatters: 'People are the agents of transformation. Without the right skills, roles, and environments, even the best strategies fail.',
    whereApplied: ['Role Design', 'Upskilling Programs', 'Workspace Enablement', 'DWS']
  },
  {
    id: 'digital-accelerators',
    title: 'Digital Accelerators (Tools)',
    shortDescription: 'Tools, systems, and strategies that compress time-to-value and scale measurable impact.',
    dimension: 'D6',
    contentType: 'Application',
    whatItMeans: 'Digital Accelerators are DQ\'s tools and systems that drive execution speed and alignment. They compress time-to-value and scale measurable impact across transformation initiatives.',
    whyItMatters: 'Accelerators determine how fast and effectively value is realized. They\'re the practical enablers that make transformation tangible.',
    whereApplied: ['DTMP', 'Automation Tools', 'Dashboards', 'Delivery Tools']
  }
];

const DIMENSIONS = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6'] as const;
const CONTENT_TYPES = ['Definition', 'Principle', 'Application'] as const;

const DIMENSION_INFO = {
  D1: { title: 'Digital Economy (DE)', question: 'Why should organisations change?', color: '#fb923c' },
  D2: { title: 'Digital Cognitive Organisation (DCO)', question: 'Where are organisations headed?', color: '#22c55e' },
  D3: { title: 'Digital Business Platform (DBP)', question: 'What must be built?', color: '#a855f7' },
  D4: { title: 'Digital Transformation 2.0 (DT2.0)', question: 'How should transformation be designed?', color: '#6366f1' },
  D5: { title: 'Digital Worker & Workspace (DW:WS)', question: 'Who delivers the change?', color: '#3b82f6' },
  D6: { title: 'Digital Accelerators (Tools)', question: 'When will value be realized?', color: '#06b6d4' }
};

export function Glossary6xDPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDimension, setSelectedDimension] = useState<string>('all');
  const [selectedContentType, setSelectedContentType] = useState<string>('all');
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

  const filteredTerms = useMemo(() => {
    return SAMPLE_6XD_TERMS.filter(term => {
      const matchesSearch = searchQuery === '' || 
        term.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.whatItMeans.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDimension = selectedDimension === 'all' || term.dimension === selectedDimension;
      const matchesContentType = selectedContentType === 'all' || term.contentType === selectedContentType;

      return matchesSearch && matchesDimension && matchesContentType;
    });
  }, [searchQuery, selectedDimension, selectedContentType]);

  const toggleTerm = (termId: string) => {
    setExpandedTerms(prev => {
      const next = new Set(prev);
      if (next.has(termId)) {
        next.delete(termId);
      } else {
        next.add(termId);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white guidelines-theme">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="container mx-auto px-4 py-8 flex-grow max-w-7xl">
        {/* Breadcrumbs */}
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
                <Link to="/marketplace/guides?tab=resources" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                  Resources
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <Link to="/marketplace/guides/glossary" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                  Glossary
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-500 md:ml-2">6×D</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            6×D Digital View — Glossary
          </h1>
          <p className="text-lg text-gray-600">
            Core dimensions that define DQ's digital transformation approach
          </p>
        </div>

        {/* 6×D Dimensions Visual */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">The Six Dimensions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {DIMENSIONS.map((dim) => {
              const info = DIMENSION_INFO[dim];
              return (
                <div
                  key={dim}
                  className="bg-white rounded-lg border-2 p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
                  style={{ borderColor: info.color }}
                  onClick={() => setSelectedDimension(selectedDimension === dim ? 'all' : dim)}
                >
                  <div className="text-2xl font-bold mb-1" style={{ color: info.color }}>{dim}</div>
                  <div className="text-xs text-gray-600 font-medium">{info.title.split('(')[0].trim()}</div>
                  <div className="text-xs text-gray-500 mt-1">{info.question}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search 6×D terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-primary)] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedDimension}
                onChange={(e) => setSelectedDimension(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-primary)] focus:border-transparent"
              >
                <option value="all">All Dimensions</option>
                {DIMENSIONS.map(dim => (
                  <option key={dim} value={dim}>{dim} - {DIMENSION_INFO[dim].title.split('(')[0].trim()}</option>
                ))}
              </select>

              <select
                value={selectedContentType}
                onChange={(e) => setSelectedContentType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-primary)] focus:border-transparent"
              >
                <option value="all">All Content Types</option>
                {CONTENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Glossary Terms */}
        <div className="space-y-4">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">No terms found matching your criteria.</p>
            </div>
          ) : (
            filteredTerms.map((term) => {
              const isExpanded = expandedTerms.has(term.id);
              const dimInfo = DIMENSION_INFO[term.dimension];

              return (
                <div
                  key={term.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleTerm(term.id)}
                    className="w-full p-6 text-left flex items-start justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="px-2 py-1 text-xs font-semibold text-white rounded"
                          style={{ backgroundColor: dimInfo.color }}
                        >
                          {term.dimension}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                          {term.contentType}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{term.title}</h3>
                      <p className="text-gray-600">{term.shortDescription}</p>
                    </div>
                    <div className="ml-4">
                      {isExpanded ? (
                        <ChevronDown size={24} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={24} className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-0 border-t border-gray-100 bg-gray-50">
                      <div className="pt-6 space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">What it means at DQ</h4>
                          <p className="text-gray-700">{term.whatItMeans}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Why it matters</h4>
                          <p className="text-gray-700">{term.whyItMatters}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Where it's applied</h4>
                          <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {term.whereApplied.map((place, idx) => (
                              <li key={idx}>{place}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
      <Footer isLoggedIn={!!user} />
    </div>
  );
}

export default Glossary6xDPage;

