import { Link } from 'react-router-dom'
import { HomeIcon, ChevronRightIcon } from 'lucide-react'
import { Header } from '../../../components/Header'
import { Footer } from '../../../components/Footer'
import { useAuth } from '../../../components/Header/context/AuthContext'
import { HeroSection } from './HeroSection'
import { SideNav } from './SideNav'
import { GuidelineSection } from './GuidelineSection'

function GuidelinePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <nav className="flex" aria-label="Breadcrumb">
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
                  <Link to="/marketplace/guides?tab=strategy" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                    GHC
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Vision & Mission</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      
      {/* Hero Section */}
      <HeroSection />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Overview Section */}
              <GuidelineSection id="overview" title="Overview">
                <p className="mb-6">
                  The <strong>DQ GHC</strong> is a comprehensive framework that informs all aspects of the DigitalQatalyst Organisation—from strategy to execution. It integrates seven core elements that express unique perspectives underpinning the DQ story: our purpose, our choices, and the approach we bring to everything we do.
                </p>
                <p className="mb-6">
                  At the center of the GHC lies <strong>The DQ Vision</strong>—a powerful articulation of why we exist. It explains why we think differently, why we act boldly, and why we are unwavering in our methods. Some may find us unconventional—perhaps even strange. Others may resist our model—until they begin to grasp the <strong>scale of the mission we are on</strong>.
                </p>
                <p className="mb-6">
                  This explainer explores the DQ Vision and its significance. It all starts with a fresh worldview—one committed to better interactions and better living for all humans.
                </p>
                
                {/* GHC Link - Positioned on right like table buttons */}
                <div className="mt-6 text-right">
                  <Link
                    to="/marketplace/guides/dq-ghc"
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: '#030E31'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#020A28'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#030E31'
                    }}
                  >
                    <span>View GHC Framework</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </GuidelineSection>

              {/* The DQ Vision - The World we live in */}
              <GuidelineSection id="the-world-we-live-in" title="The DQ Vision - The World we live in">
                <p className="mb-6">
                  We begin with something simple—and almost invisible: a <strong>transaction</strong>. A person pays a bill, checks their health records, fills out a form, submits an application, or tracks a delivery.
                </p>
                <p className="mb-6">
                  These moments may seem small. Fleeting. Ordinary. But if you look closer, you'll see they are not. They are the <strong>threads that hold daily life together</strong>.
                </p>
                <p className="mb-6">
                  Each transaction is a point of contact between people and the systems meant to serve them. And in that contact, a truth is revealed:
                </p>
                <p className="mb-6">
                  When systems are clear, connected, and thoughtful — life moves forward with less resistance. When they're not — people feel it. The delays. The confusion. The sense that something so simple shouldn't be so difficult.
                </p>
                <p className="mb-6">
                  Nearly all that friction can be traced back to one thing: <strong>poorly designed and mal-orchestrated data flows across organisational systems</strong>.
                </p>
              </GuidelineSection>

              {/* The DQ Vision - A World of Possibilities */}
              <GuidelineSection id="a-world-of-possibilities" title="The DQ Vision - A World of Possibilities">
                <p className="mb-6">
                  At DQ, we pay attention to those moments. Not because they're dramatic — but because they're <strong>everywhere</strong>. They make up much of the time we spend on Earth. And we ask ourselves:
                </p>
                <ul className="list-disc list-inside space-y-3 mb-6 text-gray-700">
                  <li>What if organisations could <strong>think better</strong>?</li>
                  <li>What if they could <strong>learn, adapt, and improve</strong> — not by accident, but by design?</li>
                  <li>What if systems could be made <strong>intelligent</strong>, not just digital?</li>
                </ul>
                <p className="mb-6">
                  This is the heart of our work. We are enabling a <strong>new kind of organisation</strong>—one that learns, adapts, and delivers value with clarity and scale. An organisation that doesn't just react to change, but <strong>anticipates it</strong>.
                </p>
                <p className="mb-6">
                  One that integrates people and systems, intelligence and intent. A living system that thinks, connects, and evolves. A <strong>Digital Cognitive Organisation (DCO)</strong>.
                </p>
              </GuidelineSection>

              {/* The DQ Vision - Our aspiration */}
              <GuidelineSection id="our-aspiration" title="The DQ Vision - Our Aspiration">
                <div className="mb-6 p-6 rounded-lg border-l-4" style={{ backgroundColor: 'var(--guidelines-primary-surface)', borderColor: 'var(--guidelines-primary)' }}>
                  <p className="text-xl font-semibold italic text-gray-800 mb-4">
                    "The DQ Vision is 'To perfect life's transactions'"
                  </p>
                </div>
                <p className="mb-6">
                  Organisations exist to shorten the value supply chain to the segments of customer they serve. Yet, <strong>opportunity cost pressures</strong> and legacy constraints have created shortcut-driven systems that erode real value.
                </p>
                <p className="mb-6">
                  But now, the <strong>scale of data</strong> and the <strong>rise of machine intelligence</strong> open a new era. The era of the <strong>Digital Cognitive Organisation (DCO)</strong>. Through this lens, we pursue a vision both <strong>ambitious and clear</strong>: <strong>To perfect life's transactions</strong>.
                </p>
              </GuidelineSection>

              {/* The DQ Vision - Our enabling beliefs */}
              <GuidelineSection id="our-enabling-beliefs" title="The DQ Vision - Our Enabling Beliefs">
                <p className="mb-6">
                  <em>We believe the <strong>systematic orchestration</strong> of human and machine intelligence will improve lives—not only within organisations, but across the communities they serve</em>.
                </p>
                <p className="mb-6">
                  We believe, such orchestration is most optimal when the organisation operation is undertaken over a unified system; a <strong>Digital Business Platform (DBP)</strong>.
                </p>
                <p className="mb-6">
                  And we believe something else—something quietly urgent: <em>The organisations that make the transition to become <strong>DCOs</strong> will define the next chapter of the global digital economy</em>.
                </p>
                <p className="mb-6">
                  These beliefs are not just aspirational. They are our <strong>gut substance</strong>. Our <strong>internal compass</strong>. The <strong>unseen logic</strong> that shapes everything we do.
                </p>
              </GuidelineSection>

              {/* The DQ Mission - Our Raison D'être */}
              <GuidelineSection id="our-raison-detre" title="The DQ Mission - Our Raison D'être">
                <div className="mb-6 p-6 rounded-lg border-l-4" style={{ backgroundColor: 'var(--guidelines-primary-surface)', borderColor: 'var(--guidelines-primary)' }}>
                  <p className="text-xl font-semibold italic text-gray-800 mb-4">
                    "Our Mission is 'to accelerate the realisation of Digital Business Platform, using easy to implement blueprints'"
                  </p>
                </div>
                <p className="mb-6">
                  We equip people and organisations with the <strong>thinking, tools</strong>, and <strong>capabilities</strong> to operate effectively and quickly adapt the dynamic of the <strong>digital economy</strong>.
                </p>
                <p className="mb-6">
                  Because change is no longer a one-time event. It's a condition of survival. And for transformation to be real — it must be structured and adaptive. It must connect vision to design, design to execution and execution to something that lasts.
                </p>
              </GuidelineSection>

              {/* The DQ Mission - How We Make It Real */}
              <GuidelineSection id="how-we-make-it-real" title="The DQ Mission - How We Make It Real">
                <p className="mb-6">
                  We build <strong>Digital Business Platforms (DBP) Blueprints</strong>—modular, adaptable systems that help organisations shift not just <strong>what they do</strong>, but <strong>how they do it</strong>.
                </p>
                <ul className="list-disc list-inside space-y-3 mb-6 text-gray-700">
                  <li>They bring <strong>shape to change</strong></li>
                  <li>They bring <strong>clarity to chaos</strong></li>
                  <li>They give leaders, teams, and clients <strong>confidence</strong> that what they're building will hold</li>
                </ul>
                <p className="mb-6">
                  These are not templates. They are <strong>thinking systems</strong>—crafted to guide transformation, but flexible enough to evolve with it.
                </p>
              </GuidelineSection>

              {/* The DQ Mission - Why does this matter */}
              <GuidelineSection id="why-does-this-matter" title="The DQ Mission - Why does this matter">
                <p className="mb-6">
                  <strong>If you're a Qatalyst</strong>, perhaps you've felt it — the friction that lives in the small things.
                </p>
                <ul className="list-disc list-inside space-y-3 mb-6 text-gray-700">
                  <li>A process that doesn't fit</li>
                  <li>A decision made in isolation or;</li>
                  <li>The time spent chasing clarity instead of creating value</li>
                </ul>
                <p className="mb-6">
                  Now imagine what happens when the system around you begins to think — not in place of you, but with you. When the tools, the structures, the rhythms of work begin to feel coherent — aligned to purpose, shaped to how you move, not just what you produce.
                </p>
                <p className="mb-6">
                  That is what this vision offers: not just a better way to deliver, but a clearer reason for <strong>why</strong> it matters.
                </p>
                <p className="mb-6">
                  <strong>If you're a client</strong>, you've likely seen the patterns:
                </p>
                <ul className="list-disc list-inside space-y-3 mb-6 text-gray-700">
                  <li>Momentum lost in handoffs</li>
                  <li>Energy spent bridging silos</li>
                  <li>Ambitions slowly thinned by the systems meant to support them</li>
                </ul>
                <p className="mb-6">
                  But what if transformation didn't mean starting from scratch? What if it meant:
                </p>
                <ul className="list-disc list-inside space-y-3 mb-6 text-gray-700">
                  <li>Stepping into something already designed for adaptability</li>
                  <li>Where learning isn't an afterthought, but part of the architecture?</li>
                  <li>What if delivery felt less like effort, and more like alignment?</li>
                </ul>
                <p className="mb-6">
                  That is what this vision makes possible: a future you don't have to force — because it fits.
                </p>
                <p className="mb-6">
                  <strong>And if you're an investor</strong>, you're not just looking for growth — you're looking for coherence. A signal that this isn't a company reacting to change, but one that understands it, anticipates it, and builds accordingly.
                </p>
                <p className="mb-6">
                  What you'll find here is not a strategy written for the market of today — but a model engineered for the economy of what's next. A system that knows how to scale not just output, but intelligence.
                </p>
              </GuidelineSection>

              {/* In the End… */}
              <GuidelineSection id="in-the-end" title="In the End…">
                <p className="mb-6">
                  The vision isn't just about where we're going. It's about how we get there — together, with systems that support clarity, with tools that scale intent, and with people who know why their work matters.
                </p>
              </GuidelineSection>
            </div>

            <aside className="lg:col-span-1">
              <SideNav />
            </aside>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default GuidelinePage

