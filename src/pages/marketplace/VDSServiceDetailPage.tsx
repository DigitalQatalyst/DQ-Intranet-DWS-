import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, ChevronRight, CheckCircle } from 'lucide-react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';

export default function VDSServiceDetailPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'details' | 'outcomes' | 'curriculum' | 'reviews'>('details');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10" />
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-white/60 text-sm pt-5 pb-6">
              <Home size={14} />
              <ChevronRight size={14} />
              <Link to="/marketplace/design-system" className="hover:text-white transition-colors">Design Systems</Link>
              <ChevronRight size={14} />
              <span className="text-white/90">V.DS Framework</span>
            </nav>
            {/* Hero card */}
            <div className="pb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 px-10 py-14 w-full min-h-[256px] flex flex-col justify-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  Video Design System (V.DS)
                </h1>
                <p className="text-base text-white/80 max-w-xl leading-relaxed">
                  V.DS defines DQ's cinematic system for creating strategic, scalable, high-impact video content.
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
                        activeTab === t.id ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
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

              {/* Overview */}
              {activeTab === 'details' && (
                <div className="space-y-8">
                  <p className="text-gray-600 leading-relaxed">
                    V.DS is the video design system that helps teams plan, produce, review, and distribute video content consistently across DQ. It brings structure to how videos are shaped, designed, and delivered while ensuring cinematic quality, storytelling clarity, and brand consistency across every channel.
                  </p>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-5 rounded-full inline-block" style={{ backgroundColor: '#de4f3c' }} />
                      V.DS Highlights
                    </h2>
                    <div className="space-y-3">
                      {[
                        'Brings a unified system for creating high-impact video content across DQ',
                        'Strengthens storytelling, visual quality, and brand consistency in every video',
                        'Supports collaboration across creative, technical, and strategic teams',
                        'Improves production clarity from concept through release and performance tracking',
                      ].map((text) => (
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
                  {[
                    'Establish a consistent and structured approach to planning, producing, and distributing video content across DQ',
                    'Improve cinematic quality, storytelling clarity, and brand consistency across every video output',
                    "Ensure video content aligns with DQ's standards, strategic intent, and audience expectations",
                    'Enable teams to produce video content more efficiently with greater creative clarity and production control',
                  ].map((text) => (
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
                  {[
                    'Uses a structured production workflow to guide video content from concept through delivery and distribution',
                    'Defines clear roles, review stages, and quality checkpoints across the video production lifecycle',
                    'Supports consistency through shared visual standards, templates, and brand guidelines',
                    'Helps teams manage video production more effectively across different formats, channels, and use cases',
                  ].map((text) => (
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
                  {[
                    'Used when teams are planning, producing, reviewing, or distributing video content across DQ',
                    'Applies to educational, thought leadership, social media, and client-facing video outputs',
                    'Supports use across creative, technical, and strategic teams working on video production',
                    'Helps ensure video content remains consistent, on-brand, and aligned from concept to release',
                  ].map((text) => (
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
                className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Browse all →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  title: 'Content Intelligence Design System (CI.DS)',
                  desc: "CI.DS is DQ's intelligent system for turning ideas into consistent, high-impact content at scale.",
                  route: '/marketplace/cids-service-detail',
                },
                {
                  title: 'Campaign Design System (CDS)',
                  desc: "CDS defines DQ's unified operating system for designing strategic, scalable, high-impact marketing campaigns.",
                  route: '/marketplace/cds-service-detail',
                },
              ].map((ds) => (
                <div
                  key={ds.title}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(ds.route)}
                >
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3 block">Design System</span>
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
}
