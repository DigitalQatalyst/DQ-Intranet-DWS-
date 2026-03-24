import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ChevronRight, CheckCircle } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { getDesignSystemItemById } from '../../utils/designSystemData';

const OVERVIEW_DESCRIPTIONS: Record<string, string> = {
  vds: 'V.DS is the video design system that helps teams plan, produce, review, and distribute video content consistently across DQ. It brings structure to how videos are shaped, designed, and delivered while ensuring cinematic quality, storytelling clarity, and brand consistency across every channel.',
  cds: 'CDS is the marketing campaigns design system that helps teams plan, design, deploy, and review campaigns consistently across DQ. It brings structure to how campaigns are shaped, aligned, and delivered across channels and stakeholders.',
  default: 'CI.CD is the content item design system that helps teams structure, create, review, and manage content consistently across DQ. It brings clarity to how content is designed, governed, and delivered across the organization.'
};

const HIGHLIGHTS: Record<string, string[]> = {
  vds: [
    'Brings a unified system for creating high-impact video content across DQ',
    'Strengthens storytelling, visual quality, and brand consistency in every video',
    'Supports collaboration across creative, technical, and strategic teams',
    'Improves production clarity from concept through release and performance tracking',
  ],
  cds: [
    'Standardizes how marketing campaigns are conceived, executed, and governed',
    "Aligns campaign activity with DQ's vision, values, voice, and content pillars",
    'Supports stronger collaboration across creative, technical, strategic, and data teams',
    'Improves campaign consistency, quality, and effectiveness across channels',
  ],
  default: [
    'Standardizes how content items are created and managed',
    'Improves consistency across teams, channels, and outputs',
    'Supports clearer review, approval, and governance workflows',
    'Aligns content delivery with DQ standards and strategic intent',
  ]
};

const WHY_IT_MATTERS: Record<string, string[]> = {
  vds: [
    'Establish a clear and consistent way to conceptualize, produce, and distribute video content across DQ',
    'Ensure every video delivers cinematic quality, narrative coherence, and strong brand expression',
    'Improve collaboration between scriptwriters, editors, designers, reviewers, and marketers',
    'Strengthen audience engagement and video performance through a more structured production system',
  ],
  cds: [
    'Establish a clear and consistent way to manage marketing campaigns across DQ',
    "Ensure campaigns reflect DQ's brand identity, strategic direction, and narrative clarity",
    'Improve campaign quality, repeatability, and cross-team alignment',
    'Accelerate production while strengthening campaign effectiveness and impact',
  ],
  default: [
    'Establish a clear and consistent way to design, create, review, and manage content across DQ',
    'Improve quality, governance, and alignment across all content items and delivery teams',
    "Ensure content is structured to support DQ's standards, brand logic, and strategic intent",
    'Enable teams to produce content more efficiently with greater clarity, consistency, and control',
  ]
};

const HOW_IT_WORKS: Record<string, string[]> = {
  vds: [
    'Uses a structured lifecycle from strategy and ideation to production, review, and publishing',
    "Aligns each video to DQ's narrative, audience, format, and channel before production begins",
    'Supports consistency through shared templates, planning tools, milestones, and review checkpoints',
    'Combines creative direction, production discipline, and performance readiness into one operating system',
  ],
  cds: [
    'Uses a structured campaign lifecycle covering planning, design, execution, and governance',
    "Organizes campaigns around DQ's five content pillars to maintain message consistency and strategic fit",
    'Guides teams through campaign briefs, messaging frameworks, asset templates, and review checkpoints',
    'Combines creative production, channel planning, deployment discipline, and performance learning into one system',
  ],
  default: [
    'Uses a structured workflow to guide content from planning through creation, review, and delivery',
    'Defines clear stages, responsibilities, and review points across the content lifecycle',
    'Supports consistency through shared standards, templates, and governance practices',
    'Helps teams manage content more effectively across different channels, formats, and use cases',
  ]
};

const WHERE_IT_APPLIES: Record<string, string[]> = {
  vds: [
    'Used for instructional, promotional, strategic, and storytelling videos across DQ',
    'Applies to internal communications, learning content, social media, and thought leadership videos',
    'Supports video use across marketing, HRA, DTMA, DQ Stories, and other contributing teams',
    'Ensures every video remains aligned, high-quality, and consistent regardless of format, length, or platform',
  ],
  cds: [
    'Used when DQ teams are creating, launching, managing, or reviewing marketing campaigns',
    'Applies across brand, product, education, community, and thought-leadership campaigns',
    'Supports campaign delivery across website, LinkedIn, YouTube, Instagram, email, and other relevant channels',
    'Helps ensure campaigns stay aligned, measurable, and consistent from strategy through execution and review',
  ],
  default: [
    'Used when teams are creating, reviewing, publishing, or updating content across DQ',
    'Applies to internal, external, learning, and client-facing content items',
    'Supports use across different teams, channels, platforms, and delivery contexts',
    'Helps ensure content remains consistent, governed, and aligned from creation to release',
  ]
};

export const DesignSystemDetailPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'details' | 'outcomes' | 'curriculum' | 'reviews'>('details');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const item = cardId ? getDesignSystemItemById(cardId) : null;

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Design System Not Found</h1>
            <p className="text-gray-600 mb-6">The design system you're looking for doesn't exist.</p>
            <Link
              to="/marketplace/design-system"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a1628] text-white rounded-lg hover:bg-[#162238] transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Design Systems
            </Link>
          </div>
        </main>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  const getFrameworkName = (type: string) => {
    switch (type) {
      case 'cids': return 'Content Intelligence Design System';
      case 'vds': return 'Video Design System';
      case 'cds': return 'Campaign Design System';
      default: return 'Design System';
    }
  };

  const getFrameworkShortName = (type: string) => {
    switch (type) {
      case 'cids': return 'CI.DS';
      case 'vds': return 'V.DS';
      case 'cds': return 'C.DS';
      default: return 'DS';
    }
  };

  const handleViewDetails = () => {
    switch (item.type) {
      case 'vds': navigate('/marketplace/vds-service-detail'); break;
      case 'cds': navigate('/marketplace/cds-service-detail'); break;
      case 'cids': navigate('/marketplace/cids-service-detail'); break;
      default: navigate(`/marketplace/design-system/${cardId}/framework`); break;
    }
  };

  const tabs = [
    { id: 'details', label: 'Overview' },
    { id: 'outcomes', label: 'Purpose' },
    { id: 'curriculum', label: 'Approach' },
    { id: 'reviews', label: 'Application' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <main className="flex-1">
        {/* ── Hero ── */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(to right, #192D6C, #051139)' }}>
          {/* soft bottom fade into page bg */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10" />

          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-white/60 text-sm pt-5 pb-6">
              <Home size={14} />
              <ChevronRight size={14} />
              <Link to="/marketplace/design-system" className="hover:text-white transition-colors">
                Design Systems
              </Link>
              <ChevronRight size={14} />
              <span className="text-white/90">{item.title}</span>
            </nav>

            {/* Hero content — card box on gradient */}
            <div className="pb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 px-10 py-14 w-full min-h-[256px] flex flex-col justify-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {getFrameworkName(item.type)} ({getFrameworkShortName(item.type)})
                </h1>

                <p className="text-base text-white/80 max-w-xl leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Left: tabs + content ── */}
            <div className="flex-1 min-w-0">
              {/* Tab bar */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex gap-0">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`relative py-3 px-5 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === t.id
                          ? 'text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {t.label}
                      {activeTab === t.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Course Details */}
              {activeTab === 'details' && (
                <div className="space-y-8">
                  <p className="text-gray-600 leading-relaxed">
                    {OVERVIEW_DESCRIPTIONS[item.type] || OVERVIEW_DESCRIPTIONS.default}
                  </p>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full inline-block" style={{ backgroundColor: '#de4f3c' }} />
                      {item.type === 'vds' ? 'V.DS Highlights' : item.type === 'cds' ? 'CDS Highlights' : 'CI.CD Highlights'}
                    </h2>
                    <div className="space-y-3">
                      {(HIGHLIGHTS[item.type] || HIGHLIGHTS.default).map((text) => (
                        <div key={text} className="flex items-start gap-3">
                          <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                          <p className="text-gray-700 text-sm">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Purpose */}
              {activeTab === 'outcomes' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Why It Matters</h2>
                  {(WHY_IT_MATTERS[item.type] || WHY_IT_MATTERS.default).map((text) => (
                    <div key={text} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                      <p className="text-gray-700">{text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Approach */}
              {activeTab === 'curriculum' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">How It Works</h2>
                  {(HOW_IT_WORKS[item.type] || HOW_IT_WORKS.default).map((text) => (
                    <div key={text} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                      <p className="text-gray-700">{text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Application */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Where It Applies</h2>
                  {(WHERE_IT_APPLIES[item.type] || WHERE_IT_APPLIES.default).map((text) => (
                    <div key={text} className="flex items-start gap-3">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={18} />
                      <p className="text-gray-700">{text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: sidebar ── */}
            <div className="lg:w-72 xl:w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6 overflow-hidden">
                <div className="px-5 pt-5 pb-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Design System Summary</h3>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {[
                    { label: 'Uploaded Date', value: '16 March 2026' },
                    { label: 'Created by', value: 'Helen' },
                    { label: 'Unit', value: 'Stories' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{row.label}</span>
                      <span className="font-medium text-gray-900">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 pb-5">
                  <button
                    onClick={handleViewDetails}
                    className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                    style={{ backgroundColor: '#051139' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0a1f5c')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#051139')}
                  >
                  Read More
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Related Design Systems ── */}
          <section className="mt-16 pt-10 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Related Design Systems</h2>
              <button
                onClick={() => navigate('/marketplace/design-system')}
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1"
              >
                Browse all →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                item.type !== 'cids' && {
                  title: 'Content Intelligence Design System (CI.DS)',
                  desc: "CI.DS is DQ's intelligent system for turning ideas into consistent, high-impact content at scale.",
                  route: '/marketplace/design-system/cids-introduction',
                },
                item.type !== 'vds' && {
                  title: 'Video Design System (V.DS)',
                  desc: "V.DS defines DQ's cinematic system for creating strategic, scalable, high-impact video content.",
                  route: '/marketplace/design-system/vds-framework',
                },
                item.type !== 'cds' && {
                  title: 'Campaign Design System (CDS)',
                  desc: "CDS defines DQ's unified operating system for designing strategic, scalable, high-impact marketing campaigns.",
                  route: '/marketplace/design-system/cds-campaigns-design-system',
                },
              ]
                .filter(Boolean)
                .slice(0, 2)
                .map((ds: any) => (
                  <div
                    key={ds.title}
                    className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(ds.route)}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3 block">
                      Design System
                    </span>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">{ds.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">{ds.desc}</p>
                    <button className="text-xs font-medium flex items-center gap-1 transition-colors" style={{ color: '#de4f3c' }}>
                      Read more →
                    </button>
                  </div>
                ))}
            </div>
          </section>
        </div>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default DesignSystemDetailPage;
