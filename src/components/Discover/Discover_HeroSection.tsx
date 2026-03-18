import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedText, FadeInUpOnScroll, StaggeredFadeIn } from '../AnimationUtils';

const stats = [
  { value: '100+', label: 'Active Employees' },
  { value: '2015', label: 'Founded in UAE' },
];

// EJP-style layered hero with background image and mountain layers
const DigitalLandscape: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Layer 1: Base navy/blue gradient - darkest, at the bottom */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#030F35] via-[#030F35] to-[#030F35]" />

      {/* Layer 2: Background image - clearly visible, atmospheric */}
      <img
        src="https://image2url.com/images/1765950877424-d6a2581f-24ac-410f-9ecb-f672c5b3a76b.jpg"
        alt=""
        className="absolute inset-0 z-[1] h-full w-full object-cover"
        style={{
          filter: 'blur(1px)',
          opacity: 0.75,
        }}
        onError={(e) => {
          console.error('Background image failed to load');
          e.currentTarget.style.display = 'none';
        }}
      />

      {/* Layer 3: Light gradient overlay - tints the image, doesn't hide it */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#030F35]/40 via-[#030F35]/35 to-[#030F35]/30" />

      {/* Layer 4: Mountain Layer 3 - Deepest background (very low opacity, heavy blur) */}
      <svg
        className="absolute bottom-0 left-0 w-full z-[3]"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        style={{ 
          opacity: 0.2,
          filter: 'blur(40px)',
        }}
      >
        <defs>
          <linearGradient id="mountainDeep" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          d="M0,500 Q200,480 400,490 Q600,500 800,485 Q1000,470 1200,495 L1200,600 L0,600 Z"
          fill="url(#mountainDeep)"
        />
      </svg>

      {/* Layer 5: Mountain Layer 2 - Mid layer (low opacity, medium blur) */}
      <svg
        className="absolute bottom-0 left-0 w-full z-[4]"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        style={{ 
          opacity: 0.3,
          filter: 'blur(25px)',
        }}
      >
        <defs>
          <linearGradient id="mountainMid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M0,540 Q250,520 500,530 Q750,540 1000,525 Q1100,515 1200,530 L1200,600 L0,600 Z"
          fill="url(#mountainMid)"
        />
      </svg>

      {/* Layer 6: Mountain Layer 1 - Foreground layer (subtle opacity, light blur) */}
      <svg
        className="absolute bottom-0 left-0 w-full z-[5]"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        style={{ 
          opacity: 0.4,
          filter: 'blur(12px)',
        }}
      >
        <defs>
          <linearGradient id="mountainFore" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <path
          d="M0,560 Q200,545 400,555 Q600,565 800,550 Q1000,535 1200,555 L1200,600 L0,600 Z"
          fill="url(#mountainFore)"
        />
      </svg>

      {/* Layer 7: Foreground mountain silhouettes - EJP style, geometric/stepped, clearly visible and prominent */}
      <svg
        className="absolute bottom-0 left-0 w-full z-[6]"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        style={{ 
          height: '35%',
          opacity: 0.85,
        }}
      >
        <defs>
          <linearGradient id="silhouetteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0A1A3F" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#030F35" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Main geometric stepped silhouette - pixelated/stepped effect, clearly visible */}
        <path
          d="M0,220 L0,300 L200,300 L200,240 L380,240 L380,200 L560,200 L560,170 L740,170 L740,150 L920,150 L920,180 L1100,180 L1100,210 L1200,210 L1200,300 Z"
          fill="url(#silhouetteGrad)"
        />
        {/* Secondary stepped layer for depth */}
        <path
          d="M0,240 L0,300 L180,300 L180,250 L360,250 L360,215 L540,215 L540,185 L720,185 L720,165 L900,165 L900,195 L1080,195 L1080,225 L1200,225 L1200,300 Z"
          fill="url(#silhouetteGrad)"
          opacity="0.9"
        />
        {/* Tertiary layer for additional depth */}
        <path
          d="M0,255 L0,300 L160,300 L160,260 L340,260 L340,230 L520,230 L520,200 L700,200 L700,180 L880,180 L880,210 L1060,210 L1060,240 L1200,240 L1200,300 Z"
          fill="url(#silhouetteGrad)"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};

export const Discover_HeroSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="relative isolate grid min-h-[90vh] place-items-center overflow-hidden bg-[#030F35] text-white font-sans py-12">
      {/* EJP-style layered hero background */}
      <DigitalLandscape />

      {/* Layer 8: Soft reflection of mountain silhouettes below hero - subtle and atmospheric */}
      <div className="absolute bottom-0 left-0 right-0 h-[35%] overflow-hidden pointer-events-none z-[7]">
        <div 
          className="absolute inset-x-0 bottom-0 h-full"
          style={{ 
            transform: 'scaleY(-1)',
            opacity: 0.18,
          }}
        >
          {/* Reflected mountain silhouettes with strong blur */}
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
            style={{ 
              height: '100%',
              filter: 'blur(30px)',
            }}
          >
            <defs>
              <linearGradient id="silhouetteReflect" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0A1A3F" stopOpacity="0.5" />
                <stop offset="40%" stopColor="#030F35" stopOpacity="0.25" />
                <stop offset="70%" stopColor="#030F35" stopOpacity="0.12" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,220 L0,300 L200,300 L200,240 L380,240 L380,200 L560,200 L560,170 L740,170 L740,150 L920,150 L920,180 L1100,180 L1100,210 L1200,210 L1200,300 Z"
              fill="url(#silhouetteReflect)"
            />
          </svg>
        </div>
        {/* Gradient fade-out - reflection disappears quickly */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030F35]/60 to-[#030F35]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-col items-center justify-center px-6 text-center sm:px-10 lg:px-12 py-8">
        <div className="flex w-full flex-col items-center text-center" style={{ gap: 0 }}>
          <h1 
            className="discover-hero-title text-white text-center"
            style={{
              fontFamily: 'inherit',
              fontSize: '72px',
              fontWeight: 700,
              fontStyle: 'normal',
              color: '#FFFFFF',
              letterSpacing: 'normal',
              lineHeight: '1.15',
              marginBottom: '40px',
              marginTop: 0,
              padding: 0,
            }}
          >
            <AnimatedText 
              text="Discover DigitalQatalyst" 
              gap="0.6rem" 
              className="inline-block"
            />
          </h1>
          <style>{`
            .discover-hero-title,
            .discover-hero-title span,
            .discover-hero-title span span {
              font-family: inherit !important;
              font-size: 72px !important;
              font-weight: 700 !important;
              font-style: normal !important;
              color: #FFFFFF !important;
              letter-spacing: normal !important;
              line-height: 1.15 !important;
            }
          `}</style>
          <FadeInUpOnScroll delay={0.1}>
            <p 
              className="mx-auto max-w-2xl"
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: '24px',
                fontWeight: 400,
                fontStyle: 'normal',
                textAlign: 'center',
                textTransform: 'none',
                color: '#FFFFFF',
                background: 'transparent',
                marginTop: 0,
                marginBottom: 0,
                padding: 0,
              }}
            >
              This page helps you understand how DQ drives digital transformation with strategic frameworks and expert services.
            </p>
          </FadeInUpOnScroll>

          <StaggeredFadeIn
            staggerDelay={0.12}
            className="mx-auto mt-4 flex w-full max-w-[1100px] flex-wrap items-center justify-center gap-8"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="kpi-card flex h-[115px] w-[290px] flex-col items-center justify-center rounded-xl bg-white/[0.03] px-6 text-center transition-all duration-300 hover:bg-white/[0.04]"
                style={{
                  backdropFilter: 'blur(16px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(140%)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                }}
              >
                <div className="text-4xl md:text-5xl font-semibold leading-none text-white">
                  {stat.value}
                </div>
                <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/75">
                  {stat.label}
                </p>
              </div>
            ))}
          </StaggeredFadeIn>

          <StaggeredFadeIn staggerDelay={0.15} className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="#growth-areas"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('growth-areas');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#030F35] shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:bg-white/95 hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030F35]"
            >
              Explore DQ GHC
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </StaggeredFadeIn>
        </div>
      </div>

      <style>{`
        .kpi-card:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </section>
  );
};

export default Discover_HeroSection;

