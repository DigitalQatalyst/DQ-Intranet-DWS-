import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

import { FadeInUpOnScroll } from '../components/AnimationUtils';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

interface AcceleratorSection {
  id: string;
  number: string;
  subtitle: string;
  title: string;
  question: string;
  supportingLines: string[];
  imageSrc?: string;
  imageAlt?: string;
  primaryCtaText?: string;
  primaryRoute?: string;
  secondaryCtaText?: string;
  secondaryRoute?: string;
}

const acceleratorSections: AcceleratorSection[] = [
  {
    id: 'overview',
    number: '01',
    subtitle: 'Products',
    title: 'Digital Transformation Management Platform (DTMP)',
    question: 'How does DQ manage transformation execution?',
    supportingLines: [
      'DTMP is DQ’s core platform for planning, tracking, and governing digital transformation initiatives across the organisation consistently securely.',
      'It connects strategy, data, delivery workflows, and governance into one system, giving teams visibility, ownership, and execution control.',
      'By standardising repositories, analytics, portals, and documentation, DTMP helps teams execute change predictably, collaboratively, and at scale enterprise-wide safely.',
    ],
    imageSrc: 'https://i.ibb.co/5hcV7c4Q/dtmp-image.png',
    imageAlt: 'DTMP overview visual',
    primaryCtaText: 'View Platform',
    primaryRoute: '/marketplace/directory/products',
    secondaryCtaText: 'Explore Courses',
    secondaryRoute: '/marketplace/courses',
  },
  {
    id: 'portfolio',
    number: '02',
    subtitle: 'Products',
    title: 'Transformation Management as a Service (TMaaS)',
    question: 'How does DQ execute transformation as a service?',
    supportingLines: [
      'TMaaS is DQ\'s service-based model for delivering digital transformation through modular, execution-ready capabilities rather than rigid programmes.',
      'It enables organisations to start small, adapt continuously, and scale transformation initiatives only when real value is proven.',
      'By treating transformation as a service, TMaaS improves speed, reduces delivery risk, and increases the likelihood of successful outcomes.',
    ],
    imageSrc: 'https://i.ibb.co/NgTVgKKd/tmaas-image.png',
    imageAlt: 'Accelerator portfolio visual',
    primaryCtaText: 'View Platform',
    primaryRoute: '/marketplace/directory/products',
    secondaryCtaText: 'Explore Courses',
    secondaryRoute: '/marketplace/courses',
  },
  {
    id: 'delivery-flow',
    number: '03',
    subtitle: 'Products',
    title: 'Plant 4.0 (Plant 4.0)',
    question: 'How does DQ transform industrial operations?',
    supportingLines: [
      "Plant 4.0 is DQ's platform for managing digital transformation in asset-intensive industries such as manufacturing, utilities, and energy.",
      'It helps teams monitor assets, optimise performance, and improve operational decisions using real-time data and automation.',
      'By combining operational efficiency and sustainability, Plant 4.0 supports safer, more resilient, and future-ready industrial environments.',
    ],
    imageSrc: 'https://i.ibb.co/CK60cQxP/plant4-0-image.png',
    imageAlt: 'Plant 4.0 delivery flow visual',
    primaryCtaText: 'View Platform',
    primaryRoute: '/knowledge-center/products/digital-accelerators',
    secondaryCtaText: 'Explore Courses',
    secondaryRoute: '/marketplace/courses',
  },
  {
    id: 'alignment',
    number: '04',
    subtitle: 'Products',
    title: 'Digital Transformation Management Book (DTMB)',
    question: 'How does DQ share transformation thinking?',
    supportingLines: [
      "DTMB is DQ's series of concise books that explain digital transformation concepts for leaders and decision-makers.",
      'They translate complex ideas into clear frameworks, real-world examples, and practical guidance that supports informed decision-making.',
      'By making transformation knowledge accessible, DTMB helps organisations align strategy, execution, and leadership in the digital economy.',
    ],
    imageSrc: 'https://i.ibb.co/gMmx1t7S/photo-1495446815901-a7297e633e8d-1.jpg',
    imageAlt: 'DTMB visual',
    primaryCtaText: 'View Platform',
    primaryRoute: '/marketplace/directory/products',
    secondaryCtaText: 'Explore Courses',
    secondaryRoute: '/marketplace/courses',
  },
  {
    id: 'automation',
    number: '05',
    subtitle: 'Products',
    title: 'Digital Transformation Management Academy (DTMA)',
    question: 'How does DQ build transformation capability?',
    supportingLines: [
      "DTMA is DQ's learning platform for building digital transformation knowledge and skills across individuals, teams, and organisations.",
      'It provides structured courses, certifications, and practical learning aligned to Economy 4.0 and real transformation challenges.',
      'By combining learning with application, DTMA helps professionals confidently plan, lead, and deliver digital transformation initiatives.',
    ],
    imageSrc: 'https://i.ibb.co/FL82B5q5/photo-1523240795612-9a054b0db644.jpg',
    imageAlt: 'DTMA visual',
    primaryCtaText: 'View Platform',
    primaryRoute: '/marketplace/courses',
    secondaryCtaText: 'Explore Courses',
    secondaryRoute: '/marketplace/courses',
  },
  {
    id: 'dws',
    number: '06',
    subtitle: 'Products',
    title: 'Digital Working Studios (DWS)',
    question: 'How do digital workers collaborate effectively with AI in Economy 4.0?',
    supportingLines: [
      'Digital Working Studios (DWS) are DQ\'s purpose-built environments for AI-augmented work and collaboration.',
      'They provide the physical and digital infrastructure where professionals combine human intelligence with machine intelligence to deliver outcomes faster and smarter.',
      'Starting in Nairobi (Babadogo) and expanding globally, DWS enables the next generation of digital workers to thrive.',
    ],
    imageSrc: 'https://i.ibb.co/YrMFv7w/photo-1497366216548-37526070297c.jpg',
    imageAlt: 'Digital Working Studios visual',
    primaryCtaText: 'View Platform',
    primaryRoute: '/dws/waitlist',
    secondaryCtaText: 'Explore Courses',
    secondaryRoute: '/marketplace/courses',
  },
];

const dataStreamDots = Array.from({ length: 10 }, (_, i) => ({
  id: `data-${i}`,
  cx: 250 + i * 150,
  cy: 400 + (i % 4) * 120,
  radius: 4,
  duration: 4 + i * 0.3,
  delay: i * 0.4,
}));

const dataStreamDotsSecondary = Array.from({ length: 8 }, (_, i) => ({
  id: `data2-${i}`,
  cx: 300 + i * 180,
  cy: 500 + (i % 3) * 100,
  radius: 3,
  duration: 5 + i * 0.3,
  delay: i * 0.5,
}));

const accelerationLines = Array.from({ length: 6 }, (_, i) => ({
  id: `accel-${i}`,
  x1: 300 + i * 250,
  y1: 250 + (i % 2) * 150,
  x2: 500 + i * 250,
  y2: 250 + (i % 2) * 150,
  duration: 3 + i * 0.4,
  delay: i * 0.6,
}));

const gridVerticals = Array.from({ length: 10 }, (_, i) => ({
  id: `v-${i}`,
  x: i * 192,
  duration: 7 + i * 0.3,
  delay: i * 0.2,
}));

const gridHorizontals = Array.from({ length: 8 }, (_, i) => ({
  id: `h-${i}`,
  y: i * 135,
  duration: 9 + i * 0.3,
  delay: i * 0.3,
}));

function SectionImage({ src, alt }: { readonly src?: string; readonly alt?: string }) {
  if (!src) {
    return (
      <div className="w-full max-w-full lg:w-[736px] h-[416px] rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm" />
    );
  }

  return (
    <div className="w-full max-w-full lg:w-[736px] h-[416px] overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg">
      <img src={src} alt={alt ?? ''} className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}

export function DigitalAcceleratorsLanding() {
  const navigate = useNavigate();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <style>{`
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
        @keyframes gradientDrift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes accelerate {
          0% { transform: translateX(-200px) translateY(0) scale(0.8); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(200px) translateY(0) scale(1.2); opacity: 0; }
        }
        @keyframes speedLine {
          0% { transform: translateX(-100px) scaleX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100px) scaleX(1); opacity: 0; }
        }
        @keyframes platformPulse {
          0%, 100% { opacity: 0.3; transform: scale(1) translateY(0); }
          50% { opacity: 0.6; transform: scale(1.1) translateY(-10px); }
        }
        @keyframes deliveryFlow {
          0% { transform: translateY(-100px) translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100px) translateX(0); opacity: 0; }
        }
        @keyframes velocityStreak {
          0% { transform: translateX(-150px) skewX(-20deg); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateX(150px) skewX(-20deg); opacity: 0; }
        }
        @keyframes productModule {
          0%, 100% { opacity: 0.4; transform: scale(1) translateY(0); }
          50% { opacity: 0.7; transform: scale(1.05) translateY(-5px); }
        }
        @keyframes dataStream {
          0% { transform: translateX(-100px) translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100px) translateY(0); opacity: 0; }
        }
        @keyframes serviceFlow {
          0% { stroke-dashoffset: 0; opacity: 0.3; }
          50% { stroke-dashoffset: -30; opacity: 0.6; }
          100% { stroke-dashoffset: -60; opacity: 0.3; }
        }
        @keyframes toolPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
      `}</style>

      <Header />

      <main className="flex-grow">
        {/* SECTION 1 — HERO: Digital Accelerators */}
        <section className="relative w-full overflow-hidden flex flex-col isolate h-auto md:h-[600px] lg:h-[700px] pt-24 pb-20 md:pt-24 md:pb-20">
          {/* Animated DWS Gradient Base */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              background: 'linear-gradient(135deg, #030F35 0%, #1A2E6E 30%, #030F35 60%, #1A2E6E 90%, #030F35 100%)',
              backgroundSize: '300% 300%',
              animation: 'gradientDrift 16s ease infinite'
            }}
          />

          {/* Digital Accelerators Products - Platform & Tool Visualizations */}
          <div className="absolute inset-0 z-[2] pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="productGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB5535" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1A2E6E" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="productGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1A2E6E" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#030F35" stopOpacity="0.25" />
                </linearGradient>
                <linearGradient id="serviceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FB5535" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FB5535" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FB5535" stopOpacity="0" />
                </linearGradient>
                <filter id="productGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Product Platform Modules - Representing DTMP, TMaaS, Plant4.0 */}
              <g opacity="0.5">
                {/* DTMP Platform Module */}
                <g transform="translate(300, 350)">
                  <rect x="0" y="0" width="200" height="80" rx="6" fill="url(#productGradient1)" style={{ animation: 'productModule 6s ease-in-out infinite' }} filter="url(#productGlow)" />
                  <rect x="0" y="0" width="200" height="80" rx="6" fill="none" stroke="url(#productGradient2)" strokeWidth="2.5" opacity="0.6" />
                  {/* Internal panel lines */}
                  <line x1="20" y1="25" x2="180" y2="25" stroke="url(#productGradient2)" strokeWidth="1.5" opacity="0.4" />
                  <line x1="20" y1="45" x2="140" y2="45" stroke="url(#productGradient2)" strokeWidth="1.5" opacity="0.4" />
                  <line x1="20" y1="65" x2="160" y2="65" stroke="url(#productGradient2)" strokeWidth="1.5" opacity="0.4" />
                </g>
                
                {/* TMaaS Service Module */}
                <g transform="translate(700, 450)">
                  <rect x="0" y="0" width="220" height="90" rx="6" fill="url(#productGradient1)" style={{ animation: 'productModule 6.5s ease-in-out infinite', animationDelay: '1s' }} filter="url(#productGlow)" />
                  <rect x="0" y="0" width="220" height="90" rx="6" fill="none" stroke="url(#productGradient2)" strokeWidth="2.5" opacity="0.6" />
                  {/* Service flow indicators */}
                  <circle cx="30" cy="30" r="8" fill="url(#productGradient2)" opacity="0.5" style={{ animation: 'toolPulse 3s ease-in-out infinite' }} />
                  <circle cx="30" cy="60" r="8" fill="url(#productGradient2)" opacity="0.5" style={{ animation: 'toolPulse 3.5s ease-in-out infinite', animationDelay: '0.5s' }} />
                  <path d="M 50 30 L 190 30" stroke="url(#serviceGradient)" strokeWidth="2" opacity="0.4" strokeDasharray="4,4" style={{ animation: 'serviceFlow 4s ease-in-out infinite' }} />
                  <path d="M 50 60 L 190 60" stroke="url(#serviceGradient)" strokeWidth="2" opacity="0.4" strokeDasharray="4,4" style={{ animation: 'serviceFlow 4.5s ease-in-out infinite', animationDelay: '0.5s' }} />
                </g>
                
                {/* Plant4.0 Industrial Module */}
                <g transform="translate(1200, 500)">
                  <rect x="0" y="0" width="240" height="100" rx="6" fill="url(#productGradient1)" style={{ animation: 'productModule 7s ease-in-out infinite', animationDelay: '2s' }} filter="url(#productGlow)" />
                  <rect x="0" y="0" width="240" height="100" rx="6" fill="none" stroke="url(#productGradient2)" strokeWidth="2.5" opacity="0.6" />
                  {/* Industrial connection nodes */}
                  <circle cx="40" cy="30" r="6" fill="#FB5535" opacity="0.6" style={{ animation: 'toolPulse 2.5s ease-in-out infinite' }} />
                  <circle cx="40" cy="50" r="6" fill="#FB5535" opacity="0.6" style={{ animation: 'toolPulse 2.8s ease-in-out infinite', animationDelay: '0.3s' }} />
                  <circle cx="40" cy="70" r="6" fill="#FB5535" opacity="0.6" style={{ animation: 'toolPulse 3s ease-in-out infinite', animationDelay: '0.6s' }} />
                  <line x1="55" y1="30" x2="200" y2="30" stroke="url(#productGradient2)" strokeWidth="2" opacity="0.4" />
                  <line x1="55" y1="50" x2="200" y2="50" stroke="url(#productGradient2)" strokeWidth="2" opacity="0.4" />
                  <line x1="55" y1="70" x2="200" y2="70" stroke="url(#productGradient2)" strokeWidth="2" opacity="0.4" />
                </g>
                
                {/* DTMA Learning Module */}
                <g transform="translate(500, 700)">
                  <rect x="0" y="0" width="180" height="70" rx="6" fill="url(#productGradient1)" style={{ animation: 'productModule 6.8s ease-in-out infinite', animationDelay: '3s' }} filter="url(#productGlow)" />
                  <rect x="0" y="0" width="180" height="70" rx="6" fill="none" stroke="url(#productGradient2)" strokeWidth="2.5" opacity="0.6" />
                  {/* Learning progress indicators */}
                  <rect x="20" y="20" width="140" height="8" rx="4" fill="url(#productGradient2)" opacity="0.3" />
                  <rect x="20" y="20" width="100" height="8" rx="4" fill="#FB5535" opacity="0.6" style={{ animation: 'serviceFlow 5s ease-in-out infinite' }} />
                  <rect x="20" y="35" width="140" height="8" rx="4" fill="url(#productGradient2)" opacity="0.3" />
                  <rect x="20" y="35" width="80" height="8" rx="4" fill="#FB5535" opacity="0.6" style={{ animation: 'serviceFlow 5.5s ease-in-out infinite', animationDelay: '0.5s' }} />
                </g>
              </g>
              
              {/* Service Delivery Flows - TMaaS Service Connections */}
              <g stroke="url(#serviceGradient)" strokeWidth="2.5" fill="none" opacity="0.5" strokeDasharray="10,5">
                <path
                  d="M 400 390 L 700 495"
                  style={{
                    animation: 'serviceFlow 8s ease-in-out infinite'
                  }}
                />
                <path
                  d="M 920 495 L 1200 550"
                  style={{
                    animation: 'serviceFlow 8.5s ease-in-out infinite',
                    animationDelay: '1s'
                  }}
                />
                <path
                  d="M 680 540 L 500 735"
                  style={{
                    animation: 'serviceFlow 9s ease-in-out infinite',
                    animationDelay: '2s'
                  }}
                />
                <path
                  d="M 1440 550 L 1200 600"
                  style={{
                    animation: 'serviceFlow 9.5s ease-in-out infinite',
                    animationDelay: '3s'
                  }}
                />
              </g>
              
              {/* Data Streams - Platform Data Flow */}
              <g opacity="0.6">
                {dataStreamDots.map((dot) => (
                  <circle
                    key={dot.id}
                    cx={dot.cx}
                    cy={dot.cy}
                    r={dot.radius}
                    fill="#FB5535"
                    style={{
                      animation: `dataStream ${dot.duration}s ease-in-out infinite`,
                      animationDelay: `${dot.delay}s`
                    }}
                    filter="url(#productGlow)"
                  />
                ))}
                {dataStreamDotsSecondary.map((dot) => (
                  <circle
                    key={dot.id}
                    cx={dot.cx}
                    cy={dot.cy}
                    r={dot.radius}
                    fill="#1A2E6E"
                    style={{
                      animation: `dataStream ${dot.duration}s ease-in-out infinite reverse`,
                      animationDelay: `${dot.delay}s`
                    }}
                    filter="url(#productGlow)"
                  />
                ))}
              </g>
              
              {/* Tool Icons - Representing Product Tools */}
              <g opacity="0.4">
                {/* Tool 1 - Management Tool */}
                <g transform="translate(150, 250)" style={{ animation: 'toolPulse 4s ease-in-out infinite' }}>
                  <rect x="0" y="0" width="40" height="40" rx="4" fill="url(#productGradient1)" filter="url(#productGlow)" />
                  <line x1="10" y1="10" x2="30" y2="10" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
                  <line x1="10" y1="20" x2="25" y2="20" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
                  <line x1="10" y1="30" x2="30" y2="30" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
                </g>
                
                {/* Tool 2 - Service Tool */}
                <g transform="translate(1600, 300)" style={{ animation: 'toolPulse 4.5s ease-in-out infinite', animationDelay: '1s' }}>
                  <circle cx="20" cy="20" r="18" fill="url(#productGradient1)" filter="url(#productGlow)" />
                  <path d="M 20 8 L 20 32 M 8 20 L 32 20" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.6" />
                </g>
                
                {/* Tool 3 - Industrial Tool */}
                <g transform="translate(200, 750)" style={{ animation: 'toolPulse 5s ease-in-out infinite', animationDelay: '2s' }}>
                  <polygon points="20,5 35,15 30,35 10,35 5,15" fill="url(#productGradient1)" filter="url(#productGlow)" />
                  <circle cx="20" cy="20" r="3" fill="#FFFFFF" opacity="0.6" />
                </g>
                
                {/* Tool 4 - Learning Tool */}
                <g transform="translate(1500, 750)" style={{ animation: 'toolPulse 4.8s ease-in-out infinite', animationDelay: '3s' }}>
                  <rect x="5" y="5" width="30" height="30" rx="2" fill="url(#productGradient1)" filter="url(#productGlow)" />
                  <path d="M 15 15 L 25 20 L 15 25 Z" fill="#FFFFFF" opacity="0.6" />
                </g>
              </g>
              
              {/* Acceleration Indicators - Speed Lines */}
              {accelerationLines.map((line) => (
                <line
                  key={line.id}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="url(#serviceGradient)"
                  strokeWidth="2"
                  opacity="0.4"
                  style={{
                    animation: `velocityStreak ${line.duration}s ease-in-out infinite`,
                    animationDelay: `${line.delay}s`
                  }}
                  filter="url(#productGlow)"
                />
              ))}
            </svg>
          </div>

          {/* Animated Platform Grid */}
          <div className="absolute inset-0 opacity-[0.12] z-[1]">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB5535" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#1A2E6E" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#030F35" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Platform Grid Lines */}
              <g stroke="url(#gridGradient)" strokeWidth="0.8">
                {gridVerticals.map((line) => (
                  <line
                    key={line.id}
                    x1={line.x}
                    y1="0"
                    x2={line.x}
                    y2="1080"
                    opacity="0.3"
                    style={{
                      animation: `pulse ${line.duration}s ease-in-out infinite`,
                      animationDelay: `${line.delay}s`
                    }}
                  />
                ))}
                {gridHorizontals.map((line) => (
                  <line
                    key={line.id}
                    x1="0"
                    y1={line.y}
                    x2="1920"
                    y2={line.y}
                    opacity="0.3"
                    style={{
                      animation: `pulse ${line.duration}s ease-in-out infinite`,
                      animationDelay: `${line.delay}s`
                    }}
                  />
                ))}
              </g>
            </svg>
          </div>

          {/* Pulsing Acceleration Glows */}
          <div className="absolute inset-0 z-[1] pointer-events-none">
            <div
              className="absolute rounded-full"
              style={{
                width: '600px',
                height: '600px',
                left: '25%',
                top: '30%',
                background: 'radial-gradient(circle, rgba(251, 85, 53, 0.25) 0%, transparent 70%)',
                filter: 'blur(80px)',
                animation: 'pulse 7s ease-in-out infinite'
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '700px',
                height: '700px',
                right: '20%',
                bottom: '25%',
                background: 'radial-gradient(circle, rgba(26, 46, 110, 0.3) 0%, transparent 70%)',
                filter: 'blur(90px)',
                animation: 'pulse 9s ease-in-out infinite',
                animationDelay: '3s'
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '550px',
                height: '550px',
                left: '60%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(251, 85, 53, 0.2) 0%, transparent 65%)',
                filter: 'blur(70px)',
                animation: 'pulse 8s ease-in-out infinite',
                animationDelay: '5s'
              }}
            />
          </div>

          {/* Animated Light Sweeps - Speed Effect */}
          <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
            <div
              className="absolute w-full h-full"
              style={{
                background: 'linear-gradient(20deg, transparent 20%, rgba(251, 85, 53, 0.1) 50%, transparent 80%)',
                animation: 'rotate 22s linear infinite',
                transformOrigin: 'center center',
                opacity: 0.7
              }}
            />
            <div
              className="absolute w-full h-full"
              style={{
                background: 'linear-gradient(-20deg, transparent 20%, rgba(26, 46, 110, 0.1) 50%, transparent 80%)',
                animation: 'rotate 26s linear infinite reverse',
                transformOrigin: 'center center',
                opacity: 0.6,
                animationDelay: '2s'
              }}
            />
          </div>

          {/* High Contrast Area on Left for Text Readability */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background: 'radial-gradient(ellipse 1000px 130% at 0% 50%, rgba(3, 15, 53, 0.7) 0%, rgba(3, 15, 53, 0.35) 50%, transparent 80%)',
            }}
          />

          <div className="w-full flex items-center relative z-10">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
              <div className="max-w-3xl">
                <FadeInUpOnScroll>
                  <h1
                    className="text-[76px] text-white mb-6 text-left font-sans"
                    style={{ fontWeight: 700, lineHeight: 1.1 }}
                  >
                    Accelerating Digital Transformation at DQ
                  </h1>
                  <p
                    className="text-lg md:text-xl text-white/95 mb-10 font-normal leading-relaxed text-left max-w-2xl"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    Explore DQ's products and platforms designed to support how we plan, execute, and scale digital transformation across organisations.
                  </p>
                </FadeInUpOnScroll>
              </div>
            </div>
          </div>

          {/* Scroll-down arrow */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('da-sections');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="absolute bottom-6 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:border-white/80 hover:shadow-lg"
            aria-label="Scroll to Digital Accelerators sections"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </section>

        {/* SECTIONS — Products-focused capability chapters */}
        {acceleratorSections.map((section, index) => {
          const isEven = index % 2 === 0;

          return (
            <section
              key={section.id}
              id={index === 0 ? 'da-sections' : undefined}
              className={`py-16 md:py-24 ${isEven ? 'bg-white' : 'bg-[#F7FAFF]'}`}
            >
              <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                  <FadeInUpOnScroll>
                    <div
                      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start ${
                        isEven ? '' : 'lg:flex-row-reverse'
                      }`}
                    >
                      <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
                        <SectionImage src={section.imageSrc} alt={section.imageAlt} />
                      </div>

                      <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'} flex flex-col justify-center max-w-2xl`}>
                        <div className="mb-6">
                          <span className="text-sm font-bold tracking-wider text-[#FB5535] uppercase mb-4 block">
                            {section.number} · {section.subtitle.toUpperCase()}
                          </span>
                          <h2 className="text-[36px] font-bold text-[#030F35] mb-6 leading-tight">
                            {section.title}
                          </h2>
                        </div>

                        <div className="mb-10 space-y-4">
                          <div className="border-l-4 border-[#FB5535] pl-4 mb-6">
                            <p className="text-[20px] font-semibold text-[#030F35] max-w-2xl">
                              {section.question}
                            </p>
                          </div>

                          <div className="space-y-2">
                            {section.supportingLines.map((line) => (
                              <p key={line} className="text-[18px] leading-relaxed text-gray-700 max-w-2xl">
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>

                        {(section.primaryRoute || section.secondaryRoute) ? (
                          <div className="flex flex-col sm:flex-row gap-4">
                            {section.primaryRoute && (
                              <button
                                type="button"
                                onClick={() => handleNavigate(section.primaryRoute ?? '/marketplace/directory/products')}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FB5535] text-white font-semibold rounded-lg hover:bg-[#E95139] transition-all duration-200 group shadow-md"
                              >
                                <span>{section.primaryCtaText ?? 'View Products'}</span>
                              </button>
                            )}
                            {section.secondaryRoute && (
                              <button
                                type="button"
                                onClick={() => handleNavigate(section.secondaryRoute ?? '/marketplace/courses')}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#030F35] text-[#030F35] font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                              >
                                <span>{section.secondaryCtaText ?? 'Explore Courses'}</span>
                              </button>
                            )}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </FadeInUpOnScroll>
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
}

export default DigitalAcceleratorsLanding;
