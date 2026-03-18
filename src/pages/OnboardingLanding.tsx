import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, MessageCircle, BookOpen, Users as UsersIcon, ChevronDown } from 'lucide-react';
import { FadeInUpOnScroll, StaggeredFadeIn } from '../components/AnimationUtils';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface SupportCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  buttonText: string;
  comingSoon?: boolean;
}

const supportOptions: SupportCard[] = [
  {
    icon: <User size={28} color="white" />,
    title: 'Contact Your People Partner',
    description: 'Onboarding support, role guidance, and people-related questions.',
    href: '/support/people-partner',
    buttonText: 'Get in Touch',
    comingSoon: true,
  },
  {
    icon: <MessageCircle size={28} color="white" />,
    title: 'DWS Communication Center',
    description: 'Updates, announcements, and what\'s changing across DQ.',
    href: '/support/communication-center',
    buttonText: 'Get in Touch',
    comingSoon: true,
  },
  {
    icon: <BookOpen size={28} color="white" />,
    title: 'FAQs & Glossary',
    description: 'Quick answers to common questions and DQ terms in one place.',
    href: '/support/faqs',
    buttonText: 'Get in Touch',
    comingSoon: true,
  },
  {
    icon: <UsersIcon size={28} color="white" />,
    title: 'Unit or Delivery Lead',
    description: 'Daily priorities, expectations, and delivery direction.',
    href: '/support/unit-or-delivery-lead',
    buttonText: 'Get in Touch',
  },
];

const HeroAnimatedBackground = () => (
  <>
    <div 
      className="absolute inset-0 z-0"
      style={{
        background: 'linear-gradient(135deg, #030F35 0%, #1A2E6E 30%, #030F35 60%, #1A2E6E 90%, #030F35 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientDrift 15s ease infinite'
      }}
    />

    <div className="absolute inset-0 opacity-[0.12] z-[1]">
      <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB5535" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#1A2E6E" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#030F35" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="meshGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A2E6E" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FB5535" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <g stroke="url(#meshGradient)" strokeWidth="1">
          {[...Array(15)].map((_, i) => ( // NOSONAR: Array() is intentional for creating empty array
            <line
              key={`v-${i}`} // NOSONAR: index is stable for static grid lines
              x1={i * 128}
              y1="0"
              x2={i * 128}
              y2="1080"
              opacity="0.4"
              style={{
                animation: `pulse ${6 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
          {[...Array(12)].map((_, i) => ( // NOSONAR: Array() is intentional for creating empty array
            <line
              key={`h-${i}`} // NOSONAR: index is stable for static grid lines
              x1="0"
              y1={i * 90}
              x2="1920"
              y2={i * 90}
              opacity="0.4"
              style={{
                animation: `pulse ${8 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </g>
      </svg>
    </div>

    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
      {[...Array(12)].map((_, i) => ( // NOSONAR: Array() is intentional for creating empty array
        <div
          key={i} // NOSONAR: index is stable for static floating elements
          className="absolute rounded-full"
          style={{
            width: `${60 + (i % 4) * 20}px`,
            height: `${60 + (i % 4) * 20}px`,
            left: `${5 + (i * 8)}%`,
            top: `${10 + (i % 5) * 18}%`,
            background: i % 3 === 0 
              ? 'radial-gradient(circle, rgba(251, 85, 53, 0.4) 0%, rgba(251, 85, 53, 0.1) 50%, transparent 80%)' 
              : 'radial-gradient(circle, rgba(26, 46, 110, 0.3) 0%, rgba(26, 46, 110, 0.1) 50%, transparent 80%)',
            animation: `floatSlow ${12 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
            filter: 'blur(20px)',
            boxShadow: i % 3 === 0 
              ? '0 0 60px rgba(251, 85, 53, 0.3)' 
              : '0 0 60px rgba(26, 46, 110, 0.2)',
          }}
        />
      ))}
    </div>

    <div className="absolute inset-0 z-[2] pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="shapeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB5535" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#1A2E6E" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="shapeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1A2E6E" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#030F35" stopOpacity="0.15" />
          </linearGradient>
          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <g style={{ animation: 'floatSlow 20s ease-in-out infinite' }} filter="url(#glowFilter)">
          <circle cx="300" cy="300" r="120" fill="url(#shapeGradient1)" opacity="0.4" />
          <circle cx="300" cy="300" r="80" fill="none" stroke="url(#shapeGradient2)" strokeWidth="2" opacity="0.5" />
        </g>
        
        <g style={{ animation: 'floatSlow 25s ease-in-out infinite reverse', animationDelay: '3s' }} filter="url(#glowFilter)">
          <circle cx="1600" cy="600" r="150" fill="url(#shapeGradient2)" opacity="0.35" />
          <circle cx="1600" cy="600" r="100" fill="none" stroke="url(#shapeGradient1)" strokeWidth="2" opacity="0.45" />
        </g>
        
        <g transform="translate(1000, 200)" style={{ animation: 'rotateSlow 40s linear infinite' }} filter="url(#glowFilter)">
          <polygon
            points="0,-70 60,-35 60,35 0,70 -60,35 -60,-35"
            fill="none"
            stroke="url(#shapeGradient1)"
            strokeWidth="2"
            opacity="0.4"
          />
          <polygon
            points="0,-50 43,-25 43,25 0,50 -43,25 -43,-25"
            fill="none"
            stroke="url(#shapeGradient2)"
            strokeWidth="1.5"
            opacity="0.5"
          />
        </g>
        
        <g transform="translate(500, 700)" style={{ animation: 'rotateSlow 35s linear infinite reverse' }} filter="url(#glowFilter)">
          <polygon
            points="0,-55 48,-27.5 48,27.5 0,55 -48,27.5 -48,-27.5"
            fill="none"
            stroke="url(#shapeGradient2)"
            strokeWidth="2"
            opacity="0.4"
          />
        </g>
        
        <path
          d="M 0 400 Q 400 300, 800 400 T 1600 400 T 1920 400"
          stroke="url(#shapeGradient1)"
          strokeWidth="3"
          fill="none"
          filter="url(#glowFilter)"
          opacity="0.5"
          style={{
            animation: 'floatSlow 30s ease-in-out infinite',
            strokeDasharray: '10,10'
          }}
        />
        <path
          d="M 0 600 Q 500 500, 1000 600 T 1920 600"
          stroke="url(#shapeGradient2)"
          strokeWidth="2.5"
          fill="none"
          filter="url(#glowFilter)"
          opacity="0.4"
          style={{
            animation: 'floatSlow 35s ease-in-out infinite reverse',
            animationDelay: '2s',
            strokeDasharray: '12,12'
          }}
        />
      </svg>
    </div>

    <div className="absolute inset-0 z-[1] pointer-events-none">
      <div
        className="absolute rounded-full"
        style={{
          width: '600px',
          height: '600px',
          left: '20%',
          top: '30%',
          background: 'radial-gradient(circle, rgba(251, 85, 53, 0.2) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'pulse 8s ease-in-out infinite'
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '700px',
          height: '700px',
          right: '15%',
          bottom: '25%',
          background: 'radial-gradient(circle, rgba(26, 46, 110, 0.25) 0%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'pulse 10s ease-in-out infinite',
          animationDelay: '4s'
        }}
      />
    </div>

    <div className="absolute inset-0 z-[1] pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="journeyStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FB5535" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#1A2E6E" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="journeyHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD0C0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7fb7ff" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          d="M-80 720 C 320 640, 640 820, 960 680 S 1580 520, 2000 660"
          fill="none"
          stroke="url(#journeyStroke)"
          strokeWidth="3"
          strokeDasharray="14 10"
          strokeLinecap="round"
          style={{ animation: 'dashMove 14s linear infinite' }}
          opacity="0.8"
        />
        <path
          d="M-80 720 C 320 640, 640 820, 960 680 S 1580 520, 2000 660"
          fill="none"
          stroke="url(#journeyHighlight)"
          strokeWidth="6"
          strokeDasharray="90 520"
          strokeLinecap="round"
          style={{ animation: 'shimmerDash 7s linear infinite' }}
          opacity="0.9"
        />
        <circle cx="260" cy="700" r="9" fill="#FB5535" opacity="0.75" style={{ animation: 'pulseDot 3.8s ease-in-out infinite' }} />
        <circle cx="720" cy="780" r="9" fill="#F2B9A3" opacity="0.75" style={{ animation: 'pulseDot 4.2s ease-in-out infinite', animationDelay: '0.4s' }} />
        <circle cx="1180" cy="640" r="9" fill="#8FB7FF" opacity="0.75" style={{ animation: 'pulseDot 3.5s ease-in-out infinite', animationDelay: '0.8s' }} />
        <circle cx="1640" cy="600" r="9" fill="#FFFFFF" opacity="0.8" style={{ animation: 'pulseDot 4.6s ease-in-out infinite', animationDelay: '1.2s' }} />
      </svg>
    </div>

    <div
      className="absolute inset-0 z-[1]"
      style={{
        background: 'radial-gradient(ellipse 900px 120% at 0% 50%, rgba(3, 15, 53, 0.6) 0%, rgba(3, 15, 53, 0.3) 45%, transparent 75%)',
      }}
    />
  </>
);

export function OnboardingLanding() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartOnboarding = () => {
    navigate('/onboarding/journey');
  };

  const handleExploreGHC = () => {
    navigate('/ghc');
  };

  const handleExplore6XD = () => {
    navigate('/6xd');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <style>{`
        @keyframes gradientDrift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-30px) translateX(15px) rotate(5deg); }
          50% { transform: translateY(-15px) translateX(-15px) rotate(-5deg); }
          75% { transform: translateY(15px) translateX(10px) rotate(3deg); }
        }
        @keyframes rotateSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes dashMove {
          to { stroke-dashoffset: -520; }
        }
        @keyframes pulseDot {
          0%, 100% { r: 8; opacity: 0.7; }
          50% { r: 11; opacity: 1; }
        }
        @keyframes shimmerDash {
          to { stroke-dashoffset: -260; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 85, 53, 0.3); }
          50% { box-shadow: 0 0 40px rgba(251, 85, 53, 0.6), 0 0 60px rgba(3, 15, 53, 0.3); }
        }
        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1); 
            opacity: 0.6;
          }
          25% { 
            transform: translateY(-40px) translateX(20px) scale(1.1); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-20px) translateX(-20px) scale(0.9); 
            opacity: 0.7;
          }
          75% { 
            transform: translateY(20px) translateX(15px) scale(1.05); 
            opacity: 0.75;
          }
        }
        @keyframes meshPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .cinematic-gradient {
          background: linear-gradient(135deg, #0B1C3F 0%, #0E2A5A 25%, #123A6F 50%, #0E2A5A 75%, #0B1C3F 100%);
          background-size: 200% 200%;
          animation: gradientDrift 12s ease infinite;
        }
        .animated-gradient {
          background: linear-gradient(135deg, #FB5535 0%, #FFFFFF 50%, #030F35 100%);
          background-size: 300% 300%;
          animation: gradientShift 15s ease infinite;
        }
        .floating-circle {
          animation: float 20s ease-in-out infinite;
        }
        .pulsing-circle {
          animation: pulse 4s ease-in-out infinite;
        }
        .premium-cta {
          position: relative;
          overflow: hidden;
        }
        .premium-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 3s infinite;
        }
        .premium-cta:hover::before {
          animation: shimmer 1.5s infinite;
        }
        .soft-panel {
          background: linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4));
          backdrop-filter: blur(20px);
        }
      `}</style>

      <Header 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        sidebarOpen={sidebarOpen} 
      />
      
      <main className="flex-grow">
        {/* SECTION 1 — HERO: Start Your Onboarding Journey */}
        <section 
          className="relative w-full overflow-hidden isolate min-h-[699px] flex items-center justify-center pt-24 pb-20"
        >
          <HeroAnimatedBackground />

          <div className="w-full flex items-center justify-center relative z-10">
            <div className="max-w-[2048px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
              <FadeInUpOnScroll>
                <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#F2B9A3] mb-3">Your Journey Starts Here</p>
                <h1 
                  className="text-white mb-4 text-center font-sans whitespace-nowrap"
                  style={{
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: '#FFFFFF',
                    fontSize: '72px'
                  }}
                >
                    Welcome to DQ Onboarding
                </h1>
                <p className="text-white/95 mb-6 font-normal leading-relaxed text-center max-w-4xl mx-auto" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}>
                  Your 3-month onboarding journey helps you integrate into DQ, adopt our DNA, and gain confidence in your role.
                </p>
              </FadeInUpOnScroll>

              {/* Primary CTA button */}
              <StaggeredFadeIn
                staggerDelay={0.1}
                className="mb-12 w-full"
              >
                <button
                  onClick={handleStartOnboarding}
                  className="px-8 py-3.5 bg-white text-[#030F35] font-semibold rounded-lg shadow-lg hover:shadow-xl hover:bg-white/95 transition-all duration-300 inline-flex items-center justify-center gap-2 text-base group mx-auto"
                >
                    <span>View the 3-Month Onboarding Guide</span>
                  <ArrowRight size={18} color="#FB5535" className="transition-transform group-hover:translate-x-1" />
                </button>
              </StaggeredFadeIn>

              {/* (Hero KPIs removed – hero now focuses only on welcome copy and primary CTA) */}
              </div>
          </div>
          </div>

          {/* Scroll-down arrow */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('onboarding-sections');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="absolute bottom-6 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/80 hover:shadow-lg"
            aria-label="Scroll to onboarding sections"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </section>

        {/* SECTION 2 — DQ Organization */}
        <section id="onboarding-sections" className="py-28 md:py-36 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
                <FadeInUpOnScroll className="md:col-span-6 lg:col-span-6">
                  <div className="flex items-start gap-6">
                    <span className="text-5xl md:text-6xl font-semibold text-[#F2B9A3] leading-none">01</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#E95139] mb-2">Getting Started</p>
                      <h2 className="text-[34px] md:text-[40px] font-bold text-[#0F1F3F] leading-tight mb-5">DQ Organization</h2>
                      <div className="flex gap-4">
                        <span className="w-[2px] bg-[#F2B9A3] rounded-full mt-1" aria-hidden="true"></span>
                        <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
                          <p>Before you dive in, get grounded in the organisation you’ve joined.</p>
                          <p>DQ is built for execution, not hierarchy — with clear units, roles, and decision paths.</p>
                          <p>Use this as your internal map to understand how work flows and who to involve.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled
                        className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-gray-300 text-gray-600 font-semibold rounded-full shadow-inner cursor-not-allowed opacity-80"
                      >
                        Coming Soon
                        <ArrowRight size={18} className="opacity-60" />
                      </button>
                    </div>
                  </div>
                </FadeInUpOnScroll>
                <FadeInUpOnScroll delay={0.1} className="md:col-span-6 lg:col-span-6">
                  <div className="relative w-full aspect-[4/3] md:aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/70">
                    <img 
                      src="https://image2url.com/r2/default/images/1770972456174-3432815c-ed3e-43c7-9a75-42aaa65db071.webp" 
                      alt="DQ associates collaborating in a global digital workspace" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                  </div>
                </FadeInUpOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — DQ GHC */}
        <section className="py-28 md:py-36 bg-[#f5f7fb]">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
                <FadeInUpOnScroll delay={0.1} className="md:col-span-6 lg:col-span-6 order-2 md:order-1">
                  <div className="relative w-full aspect-[4/3] md:aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60">
                    <img 
                      src="https://i.ibb.co/hR2rjJzY/Screenshot-2026-01-20-at-10-45-17-AM.png"
                      alt="Golden Honeycomb of Competence Framework"
                      className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('.png')) {
                          target.src = '/images/knowledge/ghc.svg';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
              </FadeInUpOnScroll>
                <FadeInUpOnScroll className="md:col-span-6 lg:col-span-6 order-1 md:order-2">
                  <div className="flex items-start gap-6">
                    <span className="text-5xl md:text-6xl font-semibold text-[#F2B9A3] leading-none">02</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#E95139] mb-2">DQ DNA</p>
                      <h2 className="text-[34px] md:text-[40px] font-bold text-[#0F1F3F] leading-tight mb-5">Golden Honeycomb of Competencies (GHC)</h2>
                      <div className="flex gap-4">
                        <span className="w-[2px] bg-[#F2B9A3] rounded-full mt-1" aria-hidden="true"></span>
                        <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
                          <p>At DQ, everything you do — how you think, collaborate, and make decisions — is guided by one shared system: GHC.</p>
                          <p>It connects our purpose, culture, leadership, and delivery into a single, clear way of working.</p>
                          <p>This helps you understand the standards we expect at DQ — and the impact you’re here to create.</p>
                        </div>
                      </div>
                      <button
                        onClick={handleExploreGHC}
                        className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-[#F35C1F] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-[#e34f16] transition-all duration-200 group"
                      >
                        Explore GHC
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </FadeInUpOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — DQ 6X Digitals (6XD) */}
        <section className="py-28 md:py-36 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
                <FadeInUpOnScroll className="md:col-span-6 lg:col-span-6">
                  <div className="flex items-start gap-6">
                    <span className="text-5xl md:text-6xl font-semibold text-[#F2B9A3] leading-none">03</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#E95139] mb-2">Operational System</p>
                      <h2 className="text-[34px] md:text-[40px] font-bold text-[#0F1F3F] leading-tight mb-5">DQ 6x Digitals</h2>
                      <div className="flex gap-4">
                        <span className="w-[2px] bg-[#F2B9A3] rounded-full mt-1" aria-hidden="true"></span>
                        <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
                          <p>6xD (6x Digitals) is how work actually happens at DQ.</p>
                          <p>It connects direction to delivery — showing how teams plan and execute in rhythm.</p>
                          <p>It’s the execution engine that turns vision into real outcomes.</p>
                        </div>
                      </div>
                      <button
                        onClick={handleExplore6XD}
                        className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-[#F35C1F] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-[#e34f16] transition-all duration-200 group"
                      >
                        Explore Agile 6xD
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </FadeInUpOnScroll>
                <FadeInUpOnScroll delay={0.1} className="md:col-span-6 lg:col-span-6">
                  <div className="relative w-full aspect-[4/3] md:aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/60">
                    <img 
                      src="https://image2url.com/r2/default/images/1770973586407-9eaf23f4-1e09-4b63-ac44-e3a28805c125.jpeg"
                      alt="Team collaborating in front of a digital board with agile plans"
                      className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Fallback image
                        target.src = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                  </div>
                </FadeInUpOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — Your Impact & Role */}
        <section className="py-28 md:py-36 bg-[#f3f4f7] text-[#676f7e]">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
                <FadeInUpOnScroll delay={0.05} className="md:col-span-6 lg:col-span-6 order-2 md:order-1">
                  <div className="relative w-full aspect-[4/3] md:aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/60">
                    <img 
                      src="https://i.ibb.co/Nn1m3yxD/IT-04.webp"
                      alt="Associates in a strategy discussion at sunrise"
                      className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
                  </div>
                </FadeInUpOnScroll>
                <FadeInUpOnScroll className="md:col-span-6 lg:col-span-6 order-1 md:order-2">
                  <div className="flex items-start gap-6">
                    <span className="text-5xl md:text-6xl font-semibold text-[#C27555] leading-none">04</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#E95139] mb-2">Your Impact</p>
                      <h2 className="text-[34px] md:text-[40px] font-bold text-[#151c2e] leading-tight mb-5">You Are the Qatalyst</h2>
                      <div className="flex gap-4">
                        <span className="w-[2px] bg-[#C27555] rounded-full mt-1" aria-hidden="true"></span>
                        <div className="space-y-4 text-lg text-[#676f7e] leading-relaxed">
                          <p>Your role isn’t just a title — it’s your lane in the system that moves execution forward.</p>
                          <p>At DQ, you’re empowered to take ownership of your work, collaborate with intent, and drive meaningful change from day one.</p>
                          <p>This is where your journey becomes uniquely yours — make it count.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled
                        className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-gray-300 text-gray-600 font-semibold rounded-full shadow-inner cursor-not-allowed opacity-80"
                      >
                        Coming Soon
                        <ArrowRight size={18} className="opacity-60" />
                      </button>
                    </div>
                  </div>
                </FadeInUpOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6 — Need Help */}
        <section className="relative py-28 md:py-36 overflow-hidden isolate">
          {/* Animated gradient background - DWS colors */}
          <div className="absolute inset-0 animated-gradient" />
          
          {/* Vector pattern background - Support/Help themed */}
          <div
            className="absolute inset-0 transition-transform duration-1000 ease-out"
            style={{
              transform: `translateY(${scrollY * 0.15}px)`,
              opacity: 0.3
            }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
            >
              {/* Abstract support/connection patterns */}
              <defs>
                <pattern id="supportPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <circle cx="50" cy="50" r="2" fill="rgba(255, 255, 255, 0.3)" />
                  <path d="M0,50 L100,50" stroke="rgba(251, 85, 53, 0.2)" strokeWidth="1" />
                  <path d="M50,0 L50,100" stroke="rgba(3, 15, 53, 0.2)" strokeWidth="1" />
                </pattern>
                <radialGradient id="supportGradient">
                  <stop offset="0%" stopColor="rgba(251, 85, 53, 0.15)" />
                  <stop offset="50%" stopColor="rgba(255, 255, 255, 0.1)" />
                  <stop offset="100%" stopColor="rgba(3, 15, 53, 0.15)" />
                </radialGradient>
              </defs>
              
              {/* Background pattern */}
              <rect width="100%" height="100%" fill="url(#supportPattern)" />
              
              {/* Abstract connection lines */}
              <path
                d="M0,200 Q300,100 600,200 T1200,200"
                stroke="rgba(251, 85, 53, 0.2)"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M0,400 Q300,500 600,400 T1200,400"
                stroke="rgba(3, 15, 53, 0.2)"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M0,600 Q300,500 600,600 T1200,600"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
              
              {/* Connection nodes */}
              <circle cx="200" cy="200" r="8" fill="rgba(251, 85, 53, 0.3)" />
              <circle cx="600" cy="400" r="8" fill="rgba(3, 15, 53, 0.3)" />
              <circle cx="1000" cy="600" r="8" fill="rgba(255, 255, 255, 0.2)" />
              <circle cx="400" cy="600" r="6" fill="rgba(251, 85, 53, 0.25)" />
              <circle cx="800" cy="200" r="6" fill="rgba(3, 15, 53, 0.25)" />
            </svg>
                    </div>
          
          {/* Secondary vector layer for depth */}
          <div
            className="absolute inset-0 transition-transform duration-1200 ease-out"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
              opacity: 0.2
            }}
          >
            <svg
              className="w-full h-full"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
            >
              <defs>
                <pattern id="dotsPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1.5" fill="rgba(255, 255, 255, 0.2)" />
                </pattern>
              </defs>
              
              <rect width="100%" height="100%" fill="url(#dotsPattern)" />
              
              {/* Geometric shapes */}
              <polygon
                points="100,100 150,50 200,100 150,150"
                fill="rgba(251, 85, 53, 0.1)"
                opacity="0.5"
              />
              <polygon
                points="900,300 950,250 1000,300 950,350"
                fill="rgba(3, 15, 53, 0.1)"
                opacity="0.5"
              />
              <polygon
                points="500,650 550,600 600,650 550,700"
                fill="rgba(255, 255, 255, 0.08)"
                opacity="0.5"
              />
            </svg>
              </div>
          
          {/* Animated floating circles - DWS main colors with rotation */}
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute w-64 h-64 rounded-full floating-circle transition-transform duration-700 ease-out"
              style={{
                background: 'radial-gradient(circle, rgba(251, 85, 53, 0.3) 0%, transparent 70%)',
                top: '10%',
                left: '5%',
                animationDelay: '0s',
                transform: `translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.05}deg)`
              }}
            />
            <div 
              className="absolute w-96 h-96 rounded-full floating-circle pulsing-circle transition-transform duration-700 ease-out"
              style={{
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)',
                top: '60%',
                right: '10%',
                animationDelay: '2s',
                transform: `translateY(${scrollY * 0.08}px) rotate(${-scrollY * 0.03}deg)`
              }}
            />
            <div 
              className="absolute w-80 h-80 rounded-full floating-circle transition-transform duration-700 ease-out"
              style={{
                background: 'radial-gradient(circle, rgba(3, 15, 53, 0.35) 0%, transparent 70%)',
                bottom: '15%',
                left: '20%',
                animationDelay: '4s',
                transform: `translateY(${scrollY * 0.12}px) rotate(${scrollY * 0.04}deg)`
              }}
            />
            <div 
              className="absolute w-72 h-72 rounded-full floating-circle pulsing-circle transition-transform duration-700 ease-out"
              style={{
                background: 'radial-gradient(circle, rgba(251, 85, 53, 0.25) 0%, transparent 70%)',
                top: '30%',
                right: '30%',
                animationDelay: '6s',
                transform: `translateY(${scrollY * 0.09}px) rotate(${-scrollY * 0.06}deg)`
              }}
            />
            <div 
              className="absolute w-56 h-56 rounded-full floating-circle transition-transform duration-700 ease-out"
              style={{
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                bottom: '25%',
                right: '5%',
                animationDelay: '8s',
                transform: `translateY(${scrollY * 0.11}px) rotate(${scrollY * 0.07}deg)`
              }}
            />
            <div 
              className="absolute w-88 h-88 rounded-full floating-circle transition-transform duration-700 ease-out"
              style={{
                background: 'radial-gradient(circle, rgba(3, 15, 53, 0.3) 0%, transparent 70%)',
                top: '50%',
                left: '50%',
                animationDelay: '10s',
                transform: `translateY(${scrollY * 0.07}px) rotate(${-scrollY * 0.04}deg)`
              }}
            />
                      </div>
          
          {/* Animated particles/glow effects */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => ( // NOSONAR: Array() is intentional for creating empty array
              <div
                key={i} // NOSONAR: index is stable for static floating elements
                className="absolute rounded-full floating-circle"
                style={{
                  width: `${20 + (i % 4) * 15}px`,
                  height: `${20 + (i % 4) * 15}px`,
                  background: (() => {
                    if (i % 3 === 0) return 'radial-gradient(circle, rgba(251, 85, 53, 0.6) 0%, transparent 70%)';
                    if (i % 3 === 1) return 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)';
                    return 'radial-gradient(circle, rgba(3, 15, 53, 0.5) 0%, transparent 70%)';
                  })(),
                  top: `${10 + (i * 7)}%`,
                  left: `${5 + (i * 8)}%`,
                  animationDelay: `${i * 0.5}s`,
                  animation: 'float 15s ease-in-out infinite',
                  transform: `translateY(${scrollY * (0.05 + (i % 3) * 0.02)}px)`
                }}
              />
              ))}
            </div>
          
          {/* Animated overlay for text readability with gradient */}
          <div 
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              background: 'linear-gradient(to bottom, rgba(3, 15, 53, 0.4) 0%, rgba(3, 15, 53, 0.2) 50%, rgba(3, 15, 53, 0.5) 100%)',
              backdropFilter: 'blur(1px)'
            }}
          />
          
          {/* Animated light rays effect */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div 
              className="absolute w-full h-full"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                animation: 'rotate 20s linear infinite',
                transformOrigin: 'center center'
              }}
            />
          </div>
          
          {/* Stylized bottom element - DWS colors with animation */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-40 md:h-56 transition-transform duration-700 ease-out"
            style={{
              transform: `translateY(${scrollY * 0.05}px)`,
              opacity: 0.6
            }}
          >
            <svg
              viewBox="0 0 1200 200"
              className="w-full h-full"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0,200 L0,180 L150,120 L300,140 L450,100 L600,130 L750,90 L900,110 L1050,80 L1200,100 L1200,200 Z"
                fill="#030F35"
                opacity="0.7"
              >
                <animate attributeName="opacity" values="0.6;0.8;0.6" dur="4s" repeatCount="indefinite" />
              </path>
              <path
                d="M0,200 L0,190 L200,150 L400,170 L600,130 L800,150 L1000,120 L1200,140 L1200,200 Z"
                fill="#FB5535"
                opacity="0.5"
              >
                <animate attributeName="opacity" values="0.4;0.6;0.4" dur="3s" repeatCount="indefinite" />
              </path>
            </svg>
              </div>

          <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
            <FadeInUpOnScroll>
              <div className="text-center mb-16">
                <p className="text-xs font-bold tracking-[0.18em] uppercase text-[#F2B9A3] mb-2">We're Here for You</p>
                <h2 className="text-[36px] font-bold text-white mb-4 leading-tight">
                  Need Help Along the Way?
                </h2>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                  You are not expected to do this alone. Support is available for HR questions, onboarding guidance, and day-to-day work priorities.
                </p>
              </div>
            </FadeInUpOnScroll>

            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {supportOptions.slice(0, 3).map((support, index) => { // NOSONAR: complexity acceptable for card rendering
                // DWS main colors: Orange, Dark Blue, White - enhanced for vector background
                const gradients = [
                  'linear-gradient(135deg, #FB5535 0%, #E95139 100%)', // Orange
                  'linear-gradient(135deg, #030F35 0%, #1A2E6E 100%)', // Dark Blue
                  'linear-gradient(135deg, #FB5535 0%, #030F35 100%)', // Orange to Dark Blue
                ];
                const iconGradients = [
                  'linear-gradient(135deg, #FB5535 0%, #E95139 100%)', // Orange
                  'linear-gradient(135deg, #030F35 0%, #1A2E6E 100%)', // Dark Blue
                  'linear-gradient(135deg, #FB5535 0%, #030F35 100%)', // Orange to Dark Blue
                ];
                const cardBorders = [
                  'rgba(251, 85, 53, 0.3)', // Orange border
                  'rgba(3, 15, 53, 0.3)', // Dark Blue border
                  'rgba(251, 85, 53, 0.2)', // Orange-Dark Blue border
                ];
                
                return (
                  <FadeInUpOnScroll key={index} delay={index * 0.1}> {/* NOSONAR: index is stable for static support cards */}
                    <div 
                      className="backdrop-blur-lg rounded-2xl shadow-2xl p-8 flex flex-col h-full hover:shadow-[0_25px_70px_-10px_rgba(0,0,0,0.5)] hover:scale-[1.03] transition-all duration-500 relative overflow-hidden group"
                      style={{
                        background: (() => {
                          if (index === 0) return 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 248, 248, 0.96) 100%)';
                          if (index === 1) return 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 248, 255, 0.96) 100%)';
                          return 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 248, 255, 0.96) 100%)';
                        })(),
                        border: `2px solid ${cardBorders[index]}`,
                        boxShadow: (() => {
                          let shadowColor;
                          if (index === 0) {
                            shadowColor = 'rgba(251, 85, 53, 0.2)';
                          } else if (index === 1) {
                            shadowColor = 'rgba(3, 15, 53, 0.2)';
                          } else {
                            shadowColor = 'rgba(251, 85, 53, 0.15)';
                          }
                          return `0 20px 50px -15px ${shadowColor}, 0 0 0 1px rgba(255, 255, 255, 0.1)`;
                        })()
                      }}
                    >
                      {support.comingSoon && (
                        <div className="absolute top-3 right-3 z-20">
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-[#030F35] border border-white/60 shadow-sm">
                            Coming Soon
                          </span>
                        </div>
                      )}
                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                            transform: 'translateX(-100%)',
                            animation: 'shimmer 2s infinite'
                          }}
                        />
                      </div>
                      
                      {/* Icon in colored circle with enhanced glow effect */}
                      <div className="flex items-center justify-center mb-6 relative z-10">
                        <div 
                          className="w-20 h-20 rounded-full flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110"
                          style={{
                            background: iconGradients[index % 3],
                            boxShadow: `0 10px 40px -5px ${index % 3 === 0 ? 'rgba(251, 85, 53, 0.5)' : index % 3 === 1 ? 'rgba(3, 15, 53, 0.5)' : 'rgba(251, 85, 53, 0.4)'}, 0 0 20px ${index % 3 === 0 ? 'rgba(251, 85, 53, 0.2)' : index % 3 === 1 ? 'rgba(3, 15, 53, 0.2)' : 'rgba(251, 85, 53, 0.15)'}` // NOSONAR: nested ternaries are clear for shadow selection
                          }}
                  >
                          <div className="text-white group-hover:scale-110 transition-transform duration-500">
                            {support.icon}
                          </div>
                        </div>
                      </div>
                      
                      {/* Title with subtle gradient text effect */}
                      <h3 
                        className="text-xl font-bold mb-4 text-center relative z-10"
                        style={{
                          color: '#030F35', // NOSONAR: simplified from ternary - all cases use same color
                          textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                        }}
                      >
                      {support.title}
                    </h3>
                      
                      {/* Description */}
                      <p className="text-gray-700 leading-relaxed mb-6 text-center flex-grow relative z-10">
                      {support.description}
                    </p>
                      
                      {/* CTA Button with enhanced premium effect */}
                      <button
                        type="button"
                        disabled={support.comingSoon}
                        onClick={() => {
                          if (support.comingSoon) return;
                          navigate(support.href);
                        }}
                        className={`w-full px-6 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 group/btn relative overflow-hidden ${
                          support.comingSoon
                            ? 'bg-gray-300 text-gray-700 cursor-not-allowed opacity-80'
                            : 'text-white hover:shadow-xl hover:scale-[1.02]'
                        }`}
                        style={
                          support.comingSoon
                            ? undefined
                            : {
                                background: gradients[index % 3],
                        boxShadow: (() => {
                          let shadowColor;
                          if (index % 3 === 0) {
                            shadowColor = 'rgba(251, 85, 53, 0.5)';
                          } else if (index % 3 === 1) {
                            shadowColor = 'rgba(3, 15, 53, 0.5)';
                          } else {
                            shadowColor = 'rgba(251, 85, 53, 0.4)';
                          }
                          return `0 4px 20px -3px ${shadowColor}`;
                        })(),
                              }
                        }
                      >
                        <span className="relative z-10">
                          {support.comingSoon ? 'Coming Soon' : support.buttonText}
                        </span>
                        <ArrowRight
                          size={18}
                          className={`transition-transform relative z-10 ${
                            support.comingSoon ? 'opacity-60' : 'group-hover/btn:translate-x-1'
                          }`}
                        />
                        {!support.comingSoon && (
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        )}
                  </button>
                    </div>
                </FadeInUpOnScroll>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
}

export default OnboardingLanding;
