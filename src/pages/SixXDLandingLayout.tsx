import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ProductShowcase } from '@/components/ProductShowcase';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Hexagon,
  GraduationCap,
  BookOpen,
  Lock,
  ArrowRight,
  Users,
  Briefcase,
  Zap,
  Target,
  Heart,
  User,
  Shield,
  GitBranch,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const IconGlyph = ({ glyph, className }: { glyph: string; className?: string }) => (
  <span className={`inline-flex items-center justify-center leading-none font-semibold ${className ?? ''}`}>
    {glyph}
  </span>
);

const IconOne = (props: { className?: string }) => <IconGlyph glyph="1" {...props} />;
const IconInfinity = (props: { className?: string }) => <IconGlyph glyph="∞" {...props} />;
const IconSeven = (props: { className?: string }) => <IconGlyph glyph="7" {...props} />;

/* -----------------------------------------
   Types & data
   ----------------------------------------- */

interface CompetencyCard {
  id: string;
  number: number;
  category: string;
  title: string;
  lensLine1?: string;
  lensLine2?: string;
  executionQuestion?: string;
  executionBlocker?: string;
  executionLens?: string;
  story: string;
  problem: string;
  response: string;
  situation?: string;
  changes?: string[];
  impact?: string;
  route: string;
  icon: LucideIcon;
  gradient: string; // Tailwind gradient classes
  accent: string; // Hex or hsl string for highlights
  image: string;
  ctaLabel?: string;
}

interface ActionCard {
  title: string;
  icon: LucideIcon;
  badge: string;
  description: string;
  tags: string[];
  cta: string;
  path: string;
  bg: string;
  accent: string;
  badgeColor: string;
  iconColor: string;
  variant?: 'primary' | 'secondary';
}

const COMPETENCY_CARDS_DEFAULT: CompetencyCard[] = [
  {
    id: 'purpose',
    number: 1,
    category: 'Vision',
    title: 'Vision',
    story: 'Problem: When pressure hit, priorities blurred and teams pulled in different directions. Response: Vision re-anchored daily decisions to purpose, keeping direction stable under stress.',
    problem: 'When pressure hit, priorities blurred and teams pulled in different directions.',
    response: 'Vision re-anchored daily decisions to purpose, keeping direction stable under stress.',
    situation: 'Critical launches piled up and priorities collided; teams lost the thread of purpose.',
    changes: [
      'Reframed goals into one north star statement',
      'Aligned weekly decisions to the stated purpose',
      'Stopped workstreams that did not serve the purpose',
    ],
    impact: 'Decisions converged and teams moved in one direction under pressure.',
    route: '/marketplace/guides/dq-vision',
    icon: Target,
    gradient: 'bg-gradient-to-br from-[#131e42] via-[#1d2f64] to-[#e1513b]',
    accent: '#f0f6ff',
    image: 'https://image2url.com/r2/default/images/1770035368667-bfe10133-4bed-44c7-aefa-c6fed9c807f5.webp',
  },
  {
    id: 'culture',
    number: 2,
    category: 'House of Values',
    title: 'House of Values',
    story: 'Problem: Incentives split teams and slowed decisions. Response: Shared values restored a common rulebook, allowing speed and trust to hold.',
    problem: 'Incentives split teams and slowed decisions.',
    response: 'Shared values restored a common rulebook, allowing speed and trust to hold.',
    situation: 'Sales pushed speed, delivery pushed quality, and teams argued over what “good” meant.',
    changes: [
      'Agreed three behavioural guardrails for all decisions',
      'Embedded values into approval checklists',
      'Held weekly value-based retros on tough calls',
    ],
    impact: 'Debates shortened and teams trusted decisions made against the shared rulebook.',
    route: '/marketplace/guides/dq-hov',
    icon: Heart,
    gradient: 'bg-gradient-to-br from-[#1b2553] via-[#243a75] to-[#e1513b]',
    accent: '#f0f6ff',
    image: 'https://image2url.com/r2/default/images/1770021175279-eacca42a-60ed-4c4d-9d14-e724a3e76cd6.png',
  },
  {
    id: 'identity',
    number: 3,
    category: 'Persona',
    title: 'Persona',
    story:
      'Problem: Roles shifted constantly and individual impact became unclear. Response: Persona clarified the value each person contributes, regardless of role or squad.',
    problem: 'Roles shifted constantly and individual impact became unclear.',
    response: 'Persona clarified the value each person contributes, regardless of role or squad.',
    situation: 'Escalations bounced between managers because no one owned customer onboarding.',
    changes: [
      'Named a single accountable owner for onboarding',
      'Mapped DRI for every decision point',
      'Published a simple “who decides / who delivers” chart',
    ],
    impact: 'Escalations stopped and onboarding cycle time dropped because owners were clear.',
    route: '/marketplace/guides/dq-persona',
    icon: User,
    gradient: 'bg-gradient-to-br from-[#131e42] via-[#30478a] to-[#f0f6ff]',
    accent: '#f0f6ff',
    image: 'https://image2url.com/r2/default/images/1770021424913-1f4da872-0e43-488d-b842-a0e724f6c2c4.png',
  },
  {
    id: 'execution',
    number: 4,
    category: 'Agile TMS',
    title: 'Agile TMS',
    story:
      'Problem: Strategy changed faster than plans could adapt. Response: Agile TMS translated direction into adaptive missions and execution rhythm.',
    problem: 'Strategy changed faster than plans could adapt.',
    response: 'Agile TMS translated direction into adaptive missions and execution rhythm.',
    situation: 'Strategy changed monthly but teams were stuck on quarterly plans with mismatched cadences.',
    changes: [
      'Shifted to six-week missions with weekly checkpoints',
      'Synced rituals and demos across teams',
      'Retired stale backlog items each mission',
    ],
    impact: 'Execution cadence matched strategy shifts and handoffs became predictable.',
    route: '/marketplace/guides/dq-agile-tms',
    icon: Zap,
    gradient: 'bg-gradient-to-br from-[#1f2c63] via-[#2d3f80] to-[#e1513b]',
    accent: '#f0f6ff',
    image: 'https://image2url.com/r2/default/images/1770034932697-4c5808eb-ce02-4b4f-bb98-d02e0c693303.png',
  },
  {
    id: 'governance',
    number: 5,
    category: 'Agile SoS',
    title: 'Agile SoS',
    story:
      'Problem: Traditional governance slowed teams when speed mattered most. Response: Agile SoS introduced light guardrails that enabled pace without losing control.',
    problem: 'Traditional governance slowed teams when speed mattered most.',
    response: 'Agile SoS introduced light guardrails that enabled pace without losing control.',
    situation: 'Teams duplicated data across tools and couldn’t see blockers until too late.',
    changes: [
      'Standardised one delivery board per team with shared fields',
      'Integrated alerts into daily channels instead of email',
      'Trimmed tools down to a single source for status and risk',
    ],
    impact: 'Risks surfaced earlier and delivery sped up because tools matched daily flow.',
    route: '/marketplace/guides/dq-agile-sos',
    icon: Shield,
    gradient: 'bg-gradient-to-br from-[#131e42] via-[#1b2553] to-[#e1513b]',
    accent: '#f0f6ff',
    image: 'https://image2url.com/r2/default/images/1770021849077-fe5f09ea-4467-4e4c-b1da-a46420d40712.png',
  },
  {
    id: 'flow',
    number: 6,
    category: 'Agile Flows',
    title: 'Agile Flows',
    story:
      'Problem: Value broke down in handoffs and feedback arrived too late. Response: Agile Flows connected intent to outcomes end-to-end so feedback moved faster than blockers.',
    problem: 'Value broke down in handoffs and feedback arrived too late.',
    response: 'Agile Flows connected intent to outcomes end-to-end so feedback moved faster than blockers.',
    situation: 'Value died in handoffs and issues surfaced only after release.',
    changes: [
      'Mapped intent-to-outcome steps with owners',
      'Shortened feedback loops with shared demos',
      'Removed extra handoffs that delayed fixes',
    ],
    impact: 'Feedback arrived sooner and work flowed without stalls.',
    route: '/marketplace/guides/dq-agile-flows',
    icon: GitBranch,
    gradient: 'bg-gradient-to-br from-[#1b2553] via-[#30478a] to-[#e1513b]',
    accent: '#f0f6ff',
    image: 'https://image2url.com/r2/default/images/1770025109470-b2166816-791e-4ee2-be27-3d57e1e1de96.png',
  },
  {
    id: 'transform',
    number: 7,
    category: 'Agile 6xD',
    title: 'Agile 6xD',
    story:
      'Problem: Transformation succeeded in pilots but stalled at scale. Response: Agile 6xD made change repeatable across diagnose, design, deliver, deploy, drive, and defend.',
    problem: 'Transformation succeeded in pilots but stalled at scale.',
    response: 'Agile 6xD made change repeatable across diagnose, design, deliver, deploy, drive, and defend.',
    situation: 'Every decision waited for exec sign-off, stalling rollouts.',
    changes: [
      'Defined decisions to delegate versus escalate',
      'Set clear guardrails and success measures',
      'Instituted weekly trust-but-verify reviews',
    ],
    impact: 'Teams shipped faster while leaders focused on strategic calls.',
    route: '/marketplace/guides/dq-agile-6xd',
    icon: Sparkles,
    gradient: 'bg-gradient-to-br from-[#131e42] via-[#1f2c63] to-[#e1513b]',
    accent: '#f0f6ff',
    image: 'https://image2url.com/r2/default/images/1770026507869-cfe44464-3090-4295-b90e-76feed9666df.png',
  },
];

const FEATURE_CARDS_DEFAULT = [
  {
    title: 'Operating DNA',
    icon: IconOne,
    description: 'How organisations think, decide, and act under pressure and change.',
  },
  {
    title: 'Built for Change',
    icon: IconInfinity,
    description: 'Designed to adapt continuously as strategy, context, and scale evolve.',
  },
  {
    title: 'Seven Elements',
    icon: IconSeven,
    description: 'Connected responses that realign work when traditional models break.',
  },
];

const ACTION_CARDS_DEFAULT: ActionCard[] = [
  {
    title: 'Storybooks',
    icon: BookOpen,
    badge: 'Storybooks',
    description:
      'See the thinking and stories behind the Golden Honeycomb and how DQ chose to work this way. Start here when you want the “why” that shaped the system.',
    tags: ['Narratives', 'Decisions', 'Origins'],
    cta: 'Read the story',
    path: 'https://preview.shorthand.com/Pg0KQCF1Rp904ao7',
    bg: 'bg-[#fde6de]',
    accent: 'text-[#e1513b]',
    badgeColor: 'text-[#e1513b]',
    iconColor: '#e1513b',
  },
  {
    title: 'Learning Center',
    icon: GraduationCap,
    badge: 'Learning',
    description:
      'Build the capabilities expected inside this operating system. Practical paths that help you apply GHC in real decisions and delivery.',
    tags: ['Guided paths', 'Practice', 'Skills'],
    cta: 'Start learning',
    path: '/lms',
    bg: 'bg-[#f0f6ff]',
    accent: 'text-[#131e42]',
    badgeColor: 'text-[#131e42]',
    iconColor: '#e1513b',
  },
  {
    title: 'Knowledge Center',
    icon: Users,
    badge: 'Guidance',
    description:
      'When work gets complex, this is where you find the plays, guardrails, and references that keep execution aligned and moving.',
    tags: ['Plays', 'Guardrails', 'References'],
    cta: 'Find what you need',
    path: '/marketplace/guides',
    bg: 'bg-[#e6ebff]',
    accent: 'text-[#131e42]',
    badgeColor: 'text-[#131e42]',
    iconColor: '#131e42',
  },
  {
    title: 'Viva Engage',
    icon: Briefcase,
    badge: 'Community',
    description:
      'Watch GHC in motion through conversations and collaboration. Ask, share, and see how teams live the operating system every day.',
    tags: ['Conversation', 'Collaboration', 'Community'],
    cta: 'Join the conversation',
    path: 'https://engage.cloud.microsoft/main/feed',
    bg: 'bg-white',
    accent: 'text-[#131e42]',
    badgeColor: 'text-[#131e42]',
    iconColor: '#e1513b',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: i * 0.05 },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

/* -----------------------------------------
   Honeycomb SVG background
   ----------------------------------------- */

function HoneycombPattern() {
  const rows = 6;
  const cols = 10;
  const size = 48;
  const width = size * Math.sqrt(3);
  const height = size * 2;
  const offsetX = width / 2;
  const offsetY = height / 2;

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.4]"
      viewBox={`0 0 ${cols * width + offsetX} ${rows * height + offsetY}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="ghc-hex-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(0,0%,70%)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="hsl(0,0%,70%)" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="ghc-hex-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(0,0%,60%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(0,0%,60%)" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <g fill="url(#ghc-hex-fill)" stroke="url(#ghc-hex-stroke)" strokeWidth="1">
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => {
            const x = col * width + (row % 2) * (width / 2) + offsetX;
            const y = row * (height * 0.75) + offsetY;
            const points = [
              [x, y - size],
              [x + (size * Math.sqrt(3)) / 2, y - size / 2],
              [x + (size * Math.sqrt(3)) / 2, y + size / 2],
              [x, y + size],
              [x - (size * Math.sqrt(3)) / 2, y + size / 2],
              [x - (size * Math.sqrt(3)) / 2, y - size / 2],
            ]
              .map(([px, py]) => `${px},${py}`)
              .join(' ');
            return <polygon key={`${row}-${col}`} points={points} />;
          })
        )}
      </g>
    </svg>
  );
}

/* -----------------------------------------
   Floating orbs (framer-motion)
   ----------------------------------------- */

function FloatingOrbs() {
  const orbs = [
    { size: 60, x: '12%', y: '18%', delay: 0, duration: 8 },
    { size: 45, x: '85%', y: '22%', delay: 1, duration: 10 },
    { size: 55, x: '72%', y: '58%', delay: 2, duration: 9 },
    { size: 40, x: '22%', y: '68%', delay: 0.5, duration: 11 },
    { size: 50, x: '48%', y: '38%', delay: 1.5, duration: 7 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {orbs.map((orb, i) => (
        <motion.div
          key={i} // NOSONAR: index is stable for static orbs
          className="absolute rounded-full bg-[#d4a574] opacity-[0.15]"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            x: [0, 20, -15, 0],
            y: [0, -18, 12, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}

/* -----------------------------------------
   Main component
   ----------------------------------------- */

type LandingOverrides = {
  badgeLabel?: string;
  heroHeadline?: string;
  heroHeadlineHighlightWord?: string;
  heroHeadlineFontSize?: string;
  heroCTA?: string;
  heroSupporting?: string;
  heroSingleLine?: boolean;
  heroSupportingSingleLine?: boolean;
  heroFootnote?: string;
  heroCTALink?: string;
  foundationTitle?: string;
  foundationSubtitle?: string;
  foundationTitleFontSize?: string;
  foundationSubtitleFontSize?: string;
  foundationCards?: typeof FEATURE_CARDS_DEFAULT;
  foundationCTA?: string;
  foundationCTATo?: string;
  foundationFootnote?: string;
  responsesTitle?: string;
  responsesIntro?: string;
  responsesTitleFontSize?: string;
  responsesIntroFontSize?: string;
  responsesSequential?: boolean;
  responsesLayout?: 'carousel' | 'classes-grid' | 'chips-grid';
  responseCards?: CompetencyCard[];
  responseTags?: string[];
  responsesCTALabel?: string;
  responsesCTATo?: string;
  responsesCTALocked?: boolean;
  bottomCTA?: string;
  actionCards?: ActionCard[];
  finalHeadline?: string;
  finalSubtitle?: string;
  finalCTALabel?: string;
  finalCTATo?: string;
  finalCTASecondaryLabel?: string;
  finalCTASecondaryTo?: string;
  finalHeadlineFontSize?: string;
  finalSubtitleFontSize?: string;
  takeActionTitle?: string;
  takeActionSubtitle?: string;
  takeActionTitleFontSize?: string;
  takeActionSubtitleFontSize?: string;
  takeActionLayout?: 'grid' | 'feature';
};

type GHCLandingProps = {
  badgeLabel?: string;
  overrides?: LandingOverrides;
};

export function GHCLanding({ badgeLabel, overrides }: GHCLandingProps) { // NOSONAR: props are intentionally mutable for component flexibility
  const navigate = useNavigate();

  const heroHeadline = overrides?.heroHeadline;
  const heroHeadlineHighlightWord = overrides?.heroHeadlineHighlightWord;
  const heroHeadlineFontSize = overrides?.heroHeadlineFontSize;
  const heroCTA = overrides?.heroCTA ?? 'Read the Storybook';
  const heroSupporting =
    overrides?.heroSupporting ??
    'DQ built an operating system of seven responses so you can see what broke in work — and how to realign it.';
  const heroSingleLine = overrides?.heroSingleLine ?? true;
  const heroSupportingSingleLine = overrides?.heroSupportingSingleLine ?? false;
  const heroFootnote = overrides?.heroFootnote;
  const heroCTALink = overrides?.heroCTALink ?? 'https://preview.shorthand.com/Pg0KQCF1Rp904ao7';

  const handleReadStorybook = useCallback(() => {
    const isExternal = /^https?:\/\//i.test(heroCTALink);
    if (isExternal) {
      window.open(heroCTALink, '_blank', 'noopener,noreferrer');
      return;
    }
    navigate(heroCTALink);
  }, [heroCTALink, navigate]);

  const scrollToCarousel = useCallback(() => {
    document.getElementById('ghc-carousel')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const renderHeroHeadline = () => {
    const baseStyle = {
      fontSize: heroHeadlineFontSize ?? 'clamp(40px, 5vw, 70px)',
      lineHeight: 1.05,
      whiteSpace: heroSingleLine ? 'nowrap' as const : 'normal' as const,
    };
    const highlightClass = 'text-[#e1513b] underline decoration-[#e1513b] decoration-4 underline-offset-8';

    if (heroHeadline) {
      if (heroHeadlineHighlightWord) {
        const lowerHeadline = heroHeadline.toLowerCase();
        const lowerHighlight = heroHeadlineHighlightWord.toLowerCase();
        const startIndex = lowerHeadline.indexOf(lowerHighlight);

        if (startIndex !== -1) {
          const before = heroHeadline.slice(0, startIndex);
          const highlight = heroHeadline.slice(startIndex, startIndex + heroHeadlineHighlightWord.length);
          const after = heroHeadline.slice(startIndex + heroHeadlineHighlightWord.length);

          return (
            <span className="ghc-font-display font-bold text-white" style={baseStyle}>
              {before}
              <span className={highlightClass}>{highlight}</span>
              {after}
            </span>
          );
        }
      }

      return (
        <span className="ghc-font-display font-bold text-white" style={baseStyle}>
          <span className={highlightClass}>{heroHeadline}</span>
        </span>
      );
    }

    return (
      <span
        className="ghc-font-display font-bold text-white"
        style={{
          fontSize: 'clamp(40px, 5vw, 70px)',
          lineHeight: 1.05,
          whiteSpace: 'nowrap',
        }}
      >
        The world of work is{' '}
        <span className={highlightClass}>
          broken.
        </span>
      </span>
    );
  };

  return (
    <div className="ghc-page flex min-h-screen flex-col bg-[hsl(var(--ghc-background))]">
      <Header />

      {/* -----------------------------------------
          1. HERO SECTION — match reference hero UI
          ----------------------------------------- */}
      <section
        className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-24 pb-16"
        style={{
          background: 'linear-gradient(135deg, #131e42 0%, #1b2553 45%, #e1513b 100%)',
        }}
      >
        <div className="absolute inset-0 z-0">
          <HoneycombPattern />
        </div>
        <FloatingOrbs />

        <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 text-center max-w-4xl">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-[#f0f6ff]/20 border border-[#e1513b]/50 shadow-sm px-4 py-1.5 text-sm text-[#e1513b] backdrop-blur mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-4 w-4 text-[#e1513b]" />
            <span>{badgeLabel ?? 'The Golden Honeycomb of Competencies (GHC)'}</span>
          </motion.div>
          <motion.div
            className="mx-auto flex flex-col items-center justify-center text-center gap-4"
            style={{ maxWidth: '100%' }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {renderHeroHeadline()}
            <span
              className="text-white/85 inline-block text-center"
              style={{
                fontSize: 'clamp(16px, 2.6vw, 20px)',
                lineHeight: 1.1,
                maxWidth: heroSupportingSingleLine ? '100%' : '900px',
                margin: '0 auto',
                whiteSpace: heroSupportingSingleLine ? 'nowrap' : 'normal',
              }}
            >
              {heroSupporting}
            </span>
          </motion.div>
          <motion.div
            className="flex flex-wrap gap-4 justify-center mt-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              type="button"
              onClick={handleReadStorybook}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold border border-[#f0f6ff]/50 text-[#f0f6ff] bg-white/10 hover:bg-white/15 transition-colors shadow-sm"
            >
              <BookOpen className="h-5 w-5 text-white" />
              {heroCTA}
              <ArrowRight className="h-5 w-5 text-white" />
            </button>
          </motion.div>
          {heroFootnote ? (
            <motion.div
              className="flex items-center justify-center gap-8 text-sm text-white/80 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <span className="text-white/85 text-sm md:text-base">{heroFootnote}</span>
            </motion.div>
          ) : null}
        </div>

        <motion.button
          type="button"
          onClick={scrollToCarousel}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#b0b0b0] hover:text-[#2c2c2c] transition-colors"
          aria-label="Scroll to next section"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] font-medium">DISCOVER</span>
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </motion.button>
      </section>

      {/* -----------------------------------------
          2. WHAT IS GHC SECTION
          ----------------------------------------- */}
      <SectionWhatIsGHC content={overrides} />

      {/* -----------------------------------------
          3. SEVEN RESPONSES CAROUSEL
          ----------------------------------------- */}
      <SectionCarousel
        content={overrides}
      />

      {/* -----------------------------------------
          4. TAKE ACTION SECTION
          ----------------------------------------- */}
      <SectionTakeAction navigate={navigate} content={overrides} />

      {/* -----------------------------------------
          5. FINAL CTA SECTION
          ----------------------------------------- */}
      <SectionFinalCTA navigate={navigate} content={overrides} />

      <Footer isLoggedIn={false} />
    </div>
  );
}

/* -----------------------------------------
   Section: What is GHC
   ----------------------------------------- */

interface SectionWhatIsGHCProps {
  content?: LandingOverrides;
}

function SectionWhatIsGHC({ content }: SectionWhatIsGHCProps) { // NOSONAR: props are intentionally mutable
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const foundationTitle = content?.foundationTitle ?? 'What is the Golden Honeycomb?';
  const foundationSubtitle = content?.foundationSubtitle ?? 'Not a framework to memorise, but an operating system for modern work.';
  const foundationTitleFontSize = content?.foundationTitleFontSize;
  const foundationSubtitleFontSize = content?.foundationSubtitleFontSize;
  const foundationCards = content?.foundationCards ?? FEATURE_CARDS_DEFAULT;
  const foundationFootnote = content?.foundationFootnote;
  const isTwoCardLayout = foundationCards.length === 2;

  return (
    <section id="ghc-what" ref={ref} className="py-20 md:py-28 bg-[#f0f6ff]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-6xl mx-auto"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          custom={0}
        >
          <motion.p
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full bg-[#f0f6ff]/20 border border-[#e1513b]/50 shadow-sm px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-[#e1513b] backdrop-blur mb-4 mx-auto justify-center"
          >
            THE FOUNDATION
          </motion.p>
          <div className="mx-auto w-fit text-center space-y-3">
            <motion.h2
              variants={itemVariants}
              className="ghc-font-display text-4xl md:text-6xl font-bold text-[#131e42] text-center"
              style={{
                fontSize: foundationTitleFontSize ?? '36px',
                lineHeight: 1.05,
              }}
            >
              {foundationTitle}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-[#4a5678] text-base md:text-lg leading-relaxed max-w-6xl mx-auto text-center md:whitespace-nowrap"
              style={{
                fontSize: foundationSubtitleFontSize ?? '18px',
              }}
            >
              {foundationSubtitle}
            </motion.p>
          </div>

        </motion.div>

        <motion.div
          className={`grid grid-cols-1 ${isTwoCardLayout ? 'md:grid-cols-2 lg:grid-cols-2 max-w-5xl' : 'md:grid-cols-3 max-w-6xl'} gap-8 mt-14 mx-auto`}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          custom={1}
        >
          {foundationCards.map((card) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-white border border-[#e0e7ff] shadow-sm hover:shadow-md transition-shadow text-center px-10 py-10"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#ffe7e0] flex items-center justify-center mx-auto mb-6">
                <card.icon className="h-6 w-6 text-[#e1513b]" />
              </div>
              <h3 className="ghc-font-display text-2xl font-semibold text-[#131e42] mb-4">
                {card.title}
              </h3>
              <p className="text-[#4a5678] text-sm leading-relaxed max-w-[22rem] mx-auto">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {foundationFootnote ? (
          <motion.p
            variants={itemVariants}
            className="mt-8 text-sm md:text-base text-[#4a5678] text-center max-w-4xl mx-auto px-4"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {foundationFootnote}
          </motion.p>
        ) : null}

        {/* CTA removed per request */}
      </div>
    </section>
  );
}

/* -----------------------------------------
   Section: Seven Responses Carousel
   ----------------------------------------- */

interface SectionCarouselProps {
  content?: LandingOverrides;
}

function SectionCarousel({ content }: SectionCarouselProps) { // NOSONAR: props are intentionally mutable

  const responsesTitle = content?.responsesTitle ?? 'Seven Responses in Action';
  const responsesIntro =
    content?.responsesIntro ??
    'Each exists because something in traditional work stopped working. Problem → response.';
  const responsesTitleFontSize = content?.responsesTitleFontSize ?? '36px';
  const responsesIntroFontSize = content?.responsesIntroFontSize ?? '18px';
  const responsesSequential = content?.responsesSequential ?? false;
  const responsesLayout = content?.responsesLayout ?? 'carousel';
  const responseTags =
    content?.responseTags ??
    ['Vision', 'House of Values', 'Persona', 'Agile TMS', 'Agile SoS', 'Agile Flows', 'Agile 6xD'];
  const responseCards = content?.responseCards ?? COMPETENCY_CARDS_DEFAULT;
  const responsesCTALabel = content?.responsesCTALabel;
  const responsesCTATo = content?.responsesCTATo;
  const responsesCTALocked = content?.responsesCTALocked ?? Boolean(responsesCTALabel && /coming soon/i.test(responsesCTALabel));

  if (responsesSequential) {
    return (
      <SevenResponsesRailCarousel
        id="ghc-carousel"
        title={responsesTitle}
        subtitle={responsesIntro}
        titleFontSize={responsesTitleFontSize}
        subtitleFontSize={responsesIntroFontSize}
        tags={responseTags}
        cards={responseCards}
        itemLabel="Perspective"
        ctaLabel={responsesCTALabel}
        ctaTo={responsesCTATo}
        ctaLocked={responsesCTALocked}
      />
    );
  }

  if (responsesLayout === 'chips-grid') {
    return <ProductShowcase />;
  }

  if (responsesLayout === 'classes-grid') {
    return (
      <ClassGrid
        id="ghc-carousel"
        title={responsesTitle}
        subtitle={responsesIntro}
        titleFontSize={responsesTitleFontSize}
        subtitleFontSize={responsesIntroFontSize}
        tags={responseTags}
        cards={responseCards}
        variant="list"
      />
    );
  }

  return (
    <SevenResponsesRailCarousel
      id="ghc-carousel"
      title={responsesTitle}
      subtitle={responsesIntro}
      titleFontSize={responsesTitleFontSize}
      subtitleFontSize={responsesIntroFontSize}
      tags={responseTags}
      cards={responseCards}
      itemLabel="Response"
      ctaLabel={responsesCTALabel}
      ctaTo={responsesCTATo}
      ctaLocked={responsesCTALocked}
    />
  );
}

interface CompetencyCardProps {
  card: CompetencyCard;
  variant?: 'default' | 'stage';
}

const getProblemText = (card: CompetencyCard, hasLens: boolean) => {
  if (card.executionQuestion) return card.executionQuestion;
  if (hasLens && card.lensLine1) return card.lensLine1;
  return card.problem;
};

const getResponseText = (card: CompetencyCard, hasLens: boolean) => {
  if (card.executionLens) return card.executionLens;
  if (hasLens && card.lensLine2) return card.lensLine2;
  return card.response;
};

function CompetencyCard({ card, variant = 'default' }: CompetencyCardProps) { // NOSONAR: props are intentionally mutable
  const navigate = useNavigate();
  const hasLens = Boolean(card.lensLine1 || card.lensLine2);
  const isStage = variant === 'stage';
  const problemText = getProblemText(card, hasLens);
  const responseText = getResponseText(card, hasLens);

  return (
    <article
      className={`relative overflow-hidden rounded-3xl bg-white border border-[#e5e9f5] shadow-sm flex flex-col ${
        isStage ? 'md:max-h-[60vh]' : 'min-h-[560px] h-full'
      }`}
    >
      <div className={`${isStage ? 'h-40 md:h-44' : 'h-[240px] md:h-[280px]'} w-full overflow-hidden`}>
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className={`flex flex-col flex-1 ${isStage ? 'p-4 md:p-5 gap-2' : 'p-6 gap-4'}`}>
        <div className={`flex items-start justify-between ${isStage ? 'min-h-[52px]' : 'min-h-[64px]'}`}>
          <h3
            className="ghc-font-display text-xl md:text-2xl font-semibold text-[#131e42] max-w-[80%] leading-tight"
            style={{ fontSize: '20px' }}
          >
            {card.title}
          </h3>
          <span className="bg-[#f0f6ff] text-[#1f2d5c] text-xs px-3 py-1 rounded-full font-semibold tracking-wide">
            {card.category}
          </span>
        </div>

        <div className={`flex items-center gap-2 ${isStage ? 'text-xs' : 'text-sm'} text-[#6b7390]`}>
          <Hexagon className="h-4 w-4" />
          <span>DQ Workspace · Real scenario</span>
        </div>

        <div className={`flex flex-col gap-2 ${isStage ? '' : 'min-h-[160px]'}`}>
          <p
            className={`text-[#131e42] text-base md:text-lg leading-snug font-normal ${isStage ? 'min-h-[40px]' : 'min-h-[52px]'}`}
            style={{ fontSize: '16px' }}
          >
            <span className="font-semibold">Problem:</span>{' '}
            {problemText}
          </p>

          <p
            className={`text-[#4a5678] text-sm md:text-base leading-relaxed font-normal ${
              isStage ? 'line-clamp-2 min-h-[40px]' : 'min-h-[88px]'
            }`}
            style={{ fontSize: '16px' }}
          >
            <span className="font-semibold">Response:</span>{' '}
            {responseText}
          </p>
        </div>

        <div className={isStage ? 'pt-0.5' : 'mt-auto pt-2'}>
          <button
            type="button"
            onClick={() => navigate(card.route)}
            className="text-[#e1513b] font-semibold inline-flex items-center gap-1 hover:underline"
          >
            {card.ctaLabel ?? 'Explore in Knowledge Center'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function ResponseRailCard({ card }: { card: CompetencyCard }) { // NOSONAR: props are intentionally mutable
  const navigate = useNavigate();
  const question = card.executionQuestion ?? card.problem;
  const description = card.executionLens ?? card.response;
  const blocker = card.executionBlocker;
  const isLocked = Boolean(card.ctaLabel && /knowledge center/i.test(card.ctaLabel));

  return (
    <article className="rounded-3xl bg-white border border-[#e5e9f5] shadow-[0_18px_48px_rgba(3,15,53,0.10),0_2px_8px_rgba(3,15,53,0.06)] overflow-hidden h-full flex flex-col">
      <img
        src={card.image}
        alt={card.title}
        className="w-full h-[200px] sm:h-[220px] md:h-[250px] lg:h-[280px] object-cover object-center"
        loading="lazy"
        decoding="async"
      />

      <div className="px-6 pb-6 pt-5 flex flex-col flex-1">
        <h3 className="ghc-font-display text-xl md:text-2xl font-semibold text-[#131e42]" style={{ fontSize: '20px' }}>
          {card.title}
        </h3>

        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#6b7390]">
          <Hexagon className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
          <span>DQ Workspace · Real scenario</span>
        </div>

        <p className="mt-4 text-[#131e42] leading-[1.28] font-semibold" style={{ fontSize: '16px' }}>
          {question}
        </p>

        {blocker ? (
          <p className="mt-2 text-[#6b7390] text-sm leading-snug">
            {blocker}
          </p>
        ) : null}

        <p className="mt-3 text-[#4a5678] leading-snug font-normal" style={{ fontSize: '16px' }}>
          {description}
        </p>

        <button
          type="button"
          onClick={isLocked ? undefined : () => navigate(card.route)}
          aria-disabled={isLocked}
          className={[
            'mt-auto pt-5 font-semibold inline-flex items-center gap-2 self-start',
            isLocked
              ? 'text-[#8c94b3] cursor-not-allowed'
              : 'text-[hsl(var(--accent))] hover:underline',
          ].join(' ')}
        >
          {isLocked ? <Lock className="h-4 w-4" /> : null}
          {card.ctaLabel ?? 'Explore in Knowledge Center →'}
        </button>
      </div>
    </article>
  );
}

function SevenResponsesRailCarousel({ // NOSONAR: props are intentionally mutable
  id,
  title,
  subtitle,
  titleFontSize,
  subtitleFontSize,
  tags,
  cards,
  itemLabel = 'Response',
  ctaLabel,
  ctaTo,
  ctaLocked,
}: {
  id: string;
  title: string;
  subtitle: string;
  titleFontSize?: string;
  subtitleFontSize?: string;
  tags: string[];
  cards: CompetencyCard[];
  itemLabel?: string;
  ctaLabel?: string;
  ctaTo?: string;
  ctaLocked?: boolean;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const isCTALocked = ctaLocked ?? Boolean(ctaLabel && /coming soon/i.test(ctaLabel));

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    if (isPaused) return;
    const id = globalThis.setInterval(() => {
      emblaApi.scrollNext();
    }, 6500);
    return () => globalThis.clearInterval(id);
  }, [emblaApi, isPaused]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const handleCTA = useCallback(() => {
    if (!ctaTo || isCTALocked) return;
    const isExternal = /^https?:\/\//i.test(ctaTo);
    if (isExternal) {
      window.open(ctaTo, '_blank', 'noopener,noreferrer');
      return;
    }
    navigate(ctaTo);
  }, [ctaTo, navigate, isCTALocked]);

  return (
    <section id={id} className="relative py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.24em] bg-[hsl(var(--accent)/0.10)] border border-[hsl(var(--accent)/0.35)] text-[hsl(var(--accent))] shadow-sm backdrop-blur">
              THE FRAMEWORK
            </span>
            <h2
              className="ghc-font-display text-4xl md:text-5xl font-semibold text-[#131e42] mt-4 leading-[1.05]"
              style={titleFontSize ? { fontSize: titleFontSize } : undefined}
            >
              {title}
            </h2>
            <p
              className="text-[#4a5678] mt-3 text-lg md:text-xl leading-snug"
              style={subtitleFontSize ? { fontSize: subtitleFontSize } : undefined}
            >
              {subtitle}
            </p>
          </div>

          <section
            aria-label="Interactive carousel"
            className="mt-10 grid grid-cols-1 lg:grid-cols-[34%_66%] gap-8 lg:gap-10 items-start"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <aside className="p-5 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#6b7390]">
                  {itemLabel} {selectedIndex + 1} of {cards.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={scrollPrev}
                    className="w-10 h-10 rounded-full bg-white/95 backdrop-blur border border-[#dce5ff] shadow-sm flex items-center justify-center text-[#131e42] hover:bg-[#f0f6ff] hover:text-[hsl(var(--accent))] transition-colors"
                    aria-label="Previous response"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={scrollNext}
                    className="w-10 h-10 rounded-full bg-white/95 backdrop-blur border border-[#dce5ff] shadow-sm flex items-center justify-center text-[#131e42] hover:bg-[#f0f6ff] hover:text-[hsl(var(--accent))] transition-colors"
                    aria-label="Next response"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1" aria-label="Response list">
                {tags.map((tag, i) => {
                  const isActive = i === selectedIndex;
                  const number = String(i + 1).padStart(2, '0');
                  return (
                    <li key={tag}>
                      <button
                        type="button"
                        onClick={() => scrollTo(i)}
                        className={[
                          'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                          isActive ? 'text-[#131e42]' : 'text-[#4a5678] hover:text-[#131e42]',
                        ].join(' ')}
                        aria-current={isActive ? 'step' : undefined}
                      >
                        <span className={`text-xs font-semibold ${isActive ? 'text-[#e1513b]' : 'text-[#9aa4c6]'}`}>
                          {number}
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            isActive ? 'text-[#131e42] underline underline-offset-4 decoration-[#e1513b] decoration-2' : 'text-[#4a5678]'
                          }`}
                        >
                          {tag}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </aside>

            <div className="min-w-0">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {cards.map((card) => (
                    <div key={card.id} className="flex-[0_0_100%] min-w-0">
                      <ResponseRailCard card={card} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-5 lg:hidden" aria-label="Response progress">
                {cards.map((_, i) => (
                  <button
                    key={i} // NOSONAR: index is stable for static carousel dots
                    type="button"
                    onClick={() => scrollTo(i)}
                    className={[
                      'transition-all duration-300 rounded-full',
                      i === selectedIndex
                        ? 'w-6 h-2 bg-[hsl(var(--accent))]'
                        : 'w-2 h-2 bg-[#131e42]/40 hover:bg-[#131e42]/60',
                    ].join(' ')}
                    aria-label={`Go to response ${i + 1}`}
                  />
                ))}
              </div>

              {ctaLabel ? (
                <div className="mt-12 flex justify-center">
                  <button
                    type="button"
                    onClick={isCTALocked ? undefined : handleCTA}
                    aria-disabled={isCTALocked}
                    disabled={isCTALocked}
                    className={[
                      'inline-flex items-center gap-3 rounded-xl px-7 py-3.5 font-semibold transition border backdrop-blur',
                      isCTALocked
                        ? 'bg-[#0f172a]/70 text-white/80 border-white/15 cursor-not-allowed shadow-[0_12px_32px_rgba(6,12,26,0.35)]'
                        : 'bg-[#151c2d] text-white border-transparent shadow-[0_10px_28px_rgba(12,20,40,0.28)] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(12,20,40,0.32)]'
                    ].join(' ')}
                  >
                    {isCTALocked ? <Lock className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                    <span className="text-base">{ctaLabel}</span>
                    {!isCTALocked ? <ArrowRight className="h-5 w-5" /> : null}
                  </button>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function ClassGrid({ // NOSONAR: props are intentionally mutable
  id,
  title,
  subtitle,
  titleFontSize,
  subtitleFontSize,
  tags,
  cards,
}: {
  id: string;
  title: string;
  subtitle: string;
  titleFontSize?: string;
  subtitleFontSize?: string;
  tags: string[];
  cards: CompetencyCard[];
}) {
  const [activeClass, setActiveClass] = useState(tags[0] ?? '');
  const filteredCards = activeClass === 'All Products'
    ? cards
    : cards.filter((card) => card.category === activeClass);

  const classCode = (category: string) => {
    const start = category.lastIndexOf('(');
    const end = start >= 0 ? category.indexOf(')', start + 1) : -1;
    if (start >= 0 && end > start + 1) {
      return category.slice(start + 1, end);
    }
    return category;
  };

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const scrollByCards = (direction: 'prev' | 'next') => {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.querySelector<HTMLElement>('article');
    const cardWidth = card ? card.getBoundingClientRect().width + 24 /* gap */ : 360;
    const delta = direction === 'next' ? cardWidth * 2 : -cardWidth * 2;
    node.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section id={id} className="relative py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.24em] bg-[hsl(var(--accent)/0.10)] border border-[hsl(var(--accent)/0.35)] text-[hsl(var(--accent))] shadow-sm backdrop-blur">
              PRODUCTS
            </span>
            <h2
              className="ghc-font-display text-4xl md:text-5xl font-semibold text-[#131e42] mt-4 leading-[1.05]"
              style={titleFontSize ? { fontSize: titleFontSize } : undefined}
            >
              {title}
            </h2>
            <p
              className="text-[#4a5678] mt-3 text-lg md:text-xl leading-snug"
              style={subtitleFontSize ? { fontSize: subtitleFontSize } : undefined}
            >
              {subtitle}
            </p>
          </div>

          <div className="mt-10 space-y-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex flex-wrap gap-3" aria-label="Product classes">
                {tags.map((tag) => {
                  const isActive = tag === activeClass;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveClass(tag)}
                      className={[
                        'px-4 py-2 rounded-full text-sm font-semibold border transition-colors shadow-sm',
                        isActive
                          ? 'bg-[#0c1a3a] text-white border-[#0c1a3a]'
                          : 'bg-white text-[#131e42] border-[#dce5ff] hover:border-[#0c1a3a] hover:text-[#0c1a3a]'
                      ].join(' ')}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollByCards('prev')}
                  className="w-10 h-10 rounded-full border border-[#dce5ff] text-[#0c1a3a] bg-white hover:bg-[#f5f7ff] shadow-sm"
                  aria-label="Scroll products left"
                >
                  <ChevronLeft className="h-5 w-5 mx-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByCards('next')}
                  className="w-10 h-10 rounded-full border border-[#0c1a3a] text-white bg-[#0c1a3a] hover:brightness-105 shadow-sm"
                  aria-label="Scroll products right"
                >
                  <ChevronRight className="h-5 w-5 mx-auto" />
                </button>
              </div>
            </div>

            <div
              ref={scrollerRef}
              className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
            >
              {filteredCards.map((card) => (
                <article
                  key={card.id}
                  className="snap-start flex-none w-[320px] md:w-[360px] lg:w-[400px] rounded-3xl border border-[#e5e9f5] bg-white shadow-md overflow-hidden flex flex-col"
                >
                  <div
                    className="h-48 w-full relative"
                    style={{
                      background: card.gradient,
                    }}
                  >
                    <div className="p-4 text-white text-sm font-semibold uppercase tracking-[0.18em]">
                      {classCode(card.category)}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col gap-3 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold text-[#131e42] leading-tight">{card.title}</h3>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7390] mt-1">
                          {card.category}
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7390]">
                        {classCode(card.category)}
                      </span>
                    </div>
                    <p className="text-sm text-[#131e42] leading-snug">
                      {card.executionQuestion}
                    </p>
                    <p className="text-sm text-[#4a5678] leading-snug">
                      {card.executionLens}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (card.route.startsWith('http')) {
                          globalThis.open(card.route, '_blank', 'noopener,noreferrer');
                        } else {
                          globalThis.location.href = card.route;
                        }
                      }}
                      className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#0c1a3a] hover:underline"
                    >
                      {card.ctaLabel ?? 'Open Product'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -----------------------------------------
   Section: Take Action
   ----------------------------------------- */

const TakeActionHeader = ({
  title,
  subtitle,
  titleFontSize,
  subtitleFontSize,
  isInView,
  extraLine,
}: {
  title: string;
  subtitle: string;
  titleFontSize?: string;
  subtitleFontSize?: string;
  isInView: boolean;
  extraLine?: string;
}) => (
  <motion.div
    className="text-center mb-6 md:mb-12"
    initial={{ opacity: 0, y: 20 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5 }}
  >
    <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] bg-[#f0f6ff]/40 border border-[#e0e7ff] text-[#131e42] shadow-sm backdrop-blur mx-auto mb-1.5">
      TAKE ACTION
    </p>
    <h2
      className="ghc-font-display text-3xl md:text-4xl font-semibold text-[#131e42] mb-1.5 md:mb-3"
      style={{ fontSize: titleFontSize ?? '36px' }}
    >
      {title}
    </h2>
    <p
      className="text-[#4a5678] max-w-3xl mx-auto text-base md:text-lg"
      style={{ fontSize: subtitleFontSize ?? '18px', whiteSpace: 'nowrap' }}
    >
      {subtitle}
    </p>
    {extraLine ? <p className="text-[#6b7280] text-sm mt-1.5">{extraLine}</p> : null}
  </motion.div>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TakeActionGridLayout = ({
  refEl,
  isInView,
  cards,
  title,
  subtitle,
  titleFontSize,
  subtitleFontSize,
  handleNavigate,
  isActionLocked,
}: {
  refEl: React.RefObject<HTMLDivElement>;
  isInView: boolean;
  cards: ActionCard[];
  title: string;
  subtitle: string;
  titleFontSize?: string;
  subtitleFontSize?: string;
  handleNavigate: (path: string) => void;
  isActionLocked: (card: ActionCard) => boolean;
}) => (
  <section
    ref={refEl}
    className="py-12 md:py-16"
    style={{
      background: 'linear-gradient(180deg, #f0f6ff 0%, #ffffff 55%, #f0f6ff 100%)',
    }}
  >
    <div className="container mx-auto px-4 md:px-6 lg:px-10">
      <TakeActionHeader
        title={title}
        subtitle={subtitle}
        titleFontSize={titleFontSize}
        subtitleFontSize={subtitleFontSize}
        isInView={isInView}
        extraLine="Start small, then go deeper."
      />

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {cards.map((card, idx) => {
          const stripColors = ['from-[#dfe9ff] to-[#c7d7ff]', 'from-[#e9dcff] to-[#d7c4ff]', 'from-[#ffe8d6] to-[#ffd7b5]'];
          const strip = stripColors[idx] ?? stripColors[0];
          const isPrimary = card.variant === 'primary';
          const locked = isActionLocked(card);
          return (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="rounded-xl p-5 shadow-sm border border-[#e6eaf5] bg-white flex flex-col min-h-[300px] transition-all hover:shadow-md hover:border-[#cfd7f0]"
            >
              <div className={`h-2 w-full rounded-t-xl -mt-5 -mx-5 mb-4 bg-gradient-to-r ${strip}`} />

              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f5f7ff] border border-[#e6eaf5] flex items-center justify-center">
                  <card.icon className="h-5 w-5" style={{ color: card.iconColor }} />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] ${
                    isPrimary ? 'bg-[#131e42] text-white' : 'bg-[#eef1fb] text-[#131e42]'
                  }`}
                >
                  {card.badge}
                </span>
              </div>

              <h3 className="mt-3 text-[22px] font-semibold text-[#131e42]">{card.title}</h3>
              <p className="mt-2 text-sm text-[#4a5678] leading-relaxed whitespace-pre-line">{card.description}</p>

              {card.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-[#f5f7ff] text-[#4a5678] text-[11px] font-medium border border-[#e6eaf5]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <button
                type="button"
                onClick={locked ? undefined : () => handleNavigate(card.path)}
                aria-disabled={locked}
                className={`mt-auto w-full inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-lg border px-3 py-2 transition ${(() => {
                  if (locked) return 'opacity-50 cursor-not-allowed border-[#e6eaf5] text-[#9aa4c6]';
                  if (isPrimary) return 'bg-[#131e42] text-white border-[#131e42] hover:opacity-90';
                  return 'border-[#d5dbea] text-[#131e42] bg-white hover:bg-[#f5f7ff]';
                })()}`}
              >
                {locked ? <Lock className="h-4 w-4" /> : null}
                {card.cta}
                {locked ? (
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#9aa4c6]">(Coming soon)</span>
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </section>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TakeActionPrimaryLayout = ({
  refEl,
  isInView,
  cards,
  title,
  subtitle,
  titleFontSize,
  subtitleFontSize,
  handleNavigate,
  isActionLocked,
}: {
  refEl: React.RefObject<HTMLDivElement>;
  isInView: boolean;
  cards: ActionCard[];
  title: string;
  subtitle: string;
  titleFontSize?: string;
  subtitleFontSize?: string;
  handleNavigate: (path: string) => void;
  isActionLocked: (card: ActionCard) => boolean;
}) => { // NOSONAR: complexity acceptable for action cards rendering
  const primaryCard = cards.find((card) => card.variant === 'primary') ?? cards[0];
  const secondaryCards = cards.filter((card) => card !== primaryCard);
  const hasPrimary = Boolean(primaryCard);
  const primaryLocked = primaryCard ? isActionLocked(primaryCard) : false;

  return (
    <section
      ref={refEl}
      className="py-20 md:py-24"
      style={{
        background: 'linear-gradient(180deg, #f0f6ff 0%, #ffffff 55%, #f0f6ff 100%)',
      }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <TakeActionHeader
          title={title}
          subtitle={subtitle}
          titleFontSize={titleFontSize}
          subtitleFontSize={subtitleFontSize}
          isInView={isInView}
        />

        {hasPrimary ? (
          <div className="grid gap-6 max-w-6xl mx-auto">
            {primaryCard ? (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="group relative p-8 md:p-10 rounded-3xl border shadow-[0_18px_36px_rgba(0,0,0,0.12)] bg-gradient-to-br from-[#131e42] via-[#1f2c63] to-[#e1513b] text-white"
              >
                <div className="flex flex-col md:flex-row md:items-start md:gap-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
                    <primaryCard.icon className="h-7 w-7" style={{ color: '#f0f6ff' }} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#fbd7cd]">
                        {primaryCard.badge}
                      </span>
                      <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/15 border border-white/10 text-white">
                        Start
                      </span>
                    </div>
                    <h3 className="ghc-font-display text-2xl md:text-3xl font-semibold">
                      {primaryCard.title}
                    </h3>
                    <p className="text-base md:text-lg text-white/90 leading-relaxed">
                      {primaryCard.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {primaryCard.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-white/15 text-white px-3 py-1 text-xs font-medium border border-white/20"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={primaryLocked ? undefined : () => handleNavigate(primaryCard.path)}
                    aria-disabled={primaryLocked}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#131e42] font-semibold shadow-[0_10px_24px_rgba(0,0,0,0.18)] hover:bg-[#f0f6ff] transition-colors ${
                      primaryLocked ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                  >
                    {primaryLocked ? <Lock className="h-5 w-5" /> : null}
                    {primaryCard.cta}
                    {primaryLocked ? (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#e5e5e5]">(Coming soon)</span>
                    ) : (
                      <ArrowRight className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>
            ) : null}

            {secondaryCards.length ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={containerVariants}
                custom={0}
              >
                {secondaryCards.map((item) => {
                  const locked = isActionLocked(item);
                  return (
                    <motion.div
                      key={item.title}
                      variants={itemVariants}
                      whileHover={{ y: -6 }}
                      className={`group relative p-7 md:p-8 rounded-3xl ${item.bg} border border-[#e3e8f5] shadow-[0_10px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.09)] transition-all`}
                    >
                      <div className="flex items-start gap-4 md:gap-5">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white shadow-[0_6px_16px_rgba(0,0,0,0.08)] flex items-center justify-center">
                          <item.icon className="h-6 w-6" style={{ color: item.iconColor }} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className={`text-xs font-semibold tracking-[0.18em] uppercase ${item.badgeColor}`}>
                            {item.badge}
                          </p>
                          <h3 className="ghc-font-display text-xl md:text-2xl font-semibold text-[#131e42]">
                            {item.title}
                          </h3>
                          <p className="text-sm md:text-base text-[#4a5678] leading-relaxed">{item.description}</p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-full bg-white/75 text-[#131e42] px-3 py-1 text-xs font-medium shadow-sm cursor-default"
                              >
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.iconColor }} />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={locked ? undefined : () => handleNavigate(item.path)}
                        aria-disabled={locked}
                        className={`inline-flex items-center gap-1 text-sm font-semibold mt-6 ${
                          locked ? 'text-[#9aa4c6] cursor-not-allowed' : `${item.accent} group-hover:underline`
                        }`}
                      >
                        {item.cta}
                        {locked ? <Lock className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                        {locked ? (
                          <span className="text-[10px] uppercase tracking-[0.18em] text-[#9aa4c6]">(Coming soon)</span>
                        ) : null}
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : null}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={containerVariants}
            custom={0}
          >
            {cards.map((item) => {
              const locked = isActionLocked(item);
              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className={`group relative p-7 md:p-9 rounded-3xl ${item.bg} shadow-[0_10px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] transition-all`}
                >
                  <div className="flex items-start gap-4 md:gap-5">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white shadow-[0_6px_16px_rgba(0,0,0,0.08)] flex items-center justify-center">
                      <item.icon className="h-6 w-6" style={{ color: item.iconColor }} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className={`text-xs font-semibold tracking-[0.18em] uppercase ${item.badgeColor}`}>
                        {item.badge}
                      </p>
                      <h3 className="ghc-font-display text-xl md:text-2xl font-semibold text-[#131e42]">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-[#4a5678]">{item.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full bg-white/75 text-[#131e42] px-3 py-1 text-xs font-medium shadow-sm cursor-default"
                          >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.iconColor }} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={locked ? undefined : () => handleNavigate(item.path)}
                    aria-disabled={locked}
                    className={`inline-flex items-center gap-1 text-sm font-semibold mt-6 ${
                      locked ? 'text-[#9aa4c6] cursor-not-allowed' : `${item.accent} group-hover:underline`
                    }`}
                  >
                    {item.cta}
                    {locked ? <Lock className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                    {locked ? (
                      <span className="text-[10px] uppercase tracking-[0.18em] text-[#9aa4c6]">(Coming soon)</span>
                    ) : null}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};
function SectionTakeAction({ navigate, content }: { navigate: (path: string) => void; content?: LandingOverrides }) { // NOSONAR: complexity acceptable for action section rendering
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const actionCards = content?.actionCards ?? ACTION_CARDS_DEFAULT;
  const takeActionTitle = content?.takeActionTitle ?? 'Bring it to life';
  const takeActionSubtitle =
    content?.takeActionSubtitle ?? 'Understanding is the start. GHC becomes real through application, practice, and lived experience.';
  const takeActionTitleFontSize = content?.takeActionTitleFontSize;
  const takeActionSubtitleFontSize = content?.takeActionSubtitleFontSize;
  const takeActionLayout = content?.takeActionLayout ?? 'grid';
  const isActionLocked = (card: ActionCard) => /knowledge center/i.test(card.title);
  const handleNavigate = (path: string) => {
    if (path.startsWith('http')) {
      window.open(path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(path);
    }
  };

  if (takeActionLayout === 'grid') {
    return (
      <section
        ref={ref}
        className="py-12 md:py-16"
        style={{
          background: 'linear-gradient(180deg, #f0f6ff 0%, #ffffff 55%, #f0f6ff 100%)',
        }}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-10">
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] bg-[#f0f6ff]/40 border border-[#e0e7ff] text-[#131e42] shadow-sm backdrop-blur mx-auto mb-1.5">
              TAKE ACTION
            </p>
            <h2
              className="ghc-font-display text-3xl md:text-4xl font-semibold text-[#131e42] mb-1.5"
              style={{ fontSize: takeActionTitleFontSize ?? '36px' }}
            >
              {takeActionTitle}
            </h2>
            <p
              className="text-[#4a5678] max-w-3xl mx-auto text-base md:text-lg"
              style={{ fontSize: takeActionSubtitleFontSize ?? '18px' }}
            >
              {takeActionSubtitle}
            </p>
            <p className="text-[#6b7280] text-sm mt-1.5">Start small, then go deeper.</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {actionCards.map((card, idx) => {
              const stripColors = ['from-[#dfe9ff] to-[#c7d7ff]', 'from-[#e9dcff] to-[#d7c4ff]', 'from-[#ffe8d6] to-[#ffd7b5]'];
              const strip = stripColors[idx] ?? stripColors[0];
              const isPrimary = card.variant === 'primary';
              return (
                <motion.div
                  key={card.title}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className="rounded-xl p-5 shadow-sm border border-[#e6eaf5] bg-white flex flex-col min-h-[300px] transition-all hover:shadow-md hover:border-[#cfd7f0]"
                >
                  <div className={`h-2 w-full rounded-t-xl -mt-5 -mx-5 mb-4 bg-gradient-to-r ${strip}`} />

                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f5f7ff] border border-[#e6eaf5] flex items-center justify-center">
                      <card.icon className="h-5 w-5" style={{ color: card.iconColor }} />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.14em] ${
                        isPrimary ? 'bg-[#131e42] text-white' : 'bg-[#eef1fb] text-[#131e42]'
                      }`}
                    >
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="mt-3 text-[22px] font-semibold text-[#131e42]">{card.title}</h3>
                  <p className="mt-2 text-sm text-[#4a5678] leading-relaxed whitespace-pre-line">{card.description}</p>

                  {card.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full bg-[#f5f7ff] text-[#4a5678] text-[11px] font-medium border border-[#e6eaf5]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={isActionLocked(card) ? undefined : () => handleNavigate(card.path)}
                    aria-disabled={isActionLocked(card)}
                    className={`mt-auto w-full inline-flex items-center justify-center gap-2 text-sm font-semibold rounded-lg border px-3 py-2 transition ${(() => {
                      if (isActionLocked(card)) return 'opacity-50 cursor-not-allowed border-[#e6eaf5] text-[#9aa4c6]';
                      if (isPrimary) return 'bg-[#131e42] text-white border-[#131e42] hover:opacity-90';
                      return 'border-[#d5dbea] text-[#131e42] bg-white hover:bg-[#f5f7ff]';
                    })()}`}
                  >
                    {isActionLocked(card) ? <Lock className="h-4 w-4" /> : null}
                    {card.cta}
                    {isActionLocked(card) ? (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#9aa4c6]">(Coming soon)</span>
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    );
  }

  const primaryCard = actionCards.find((card) => card.variant === 'primary') ?? actionCards[0];
  const secondaryCards = actionCards.filter((card) => card !== primaryCard);
  const hasPrimary = Boolean(primaryCard);
  const isPrimaryLight = Boolean(primaryCard?.bg?.includes('#e6ebff'));

  return (
    <section
      ref={ref}
      className="py-20 md:py-24"
      style={{
        background: 'linear-gradient(180deg, #f0f6ff 0%, #ffffff 55%, #f0f6ff 100%)',
      }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.24em] bg-[#f0f6ff]/20 border border-[#e1513b]/50 text-[#e1513b] shadow-sm backdrop-blur mx-auto mb-2">
            TAKE ACTION
          </p>
          <h2
            className="ghc-font-display text-3xl md:text-4xl font-semibold text-[#131e42] mb-3"
            style={{ fontSize: takeActionTitleFontSize ?? '36px' }}
          >
            {takeActionTitle}
          </h2>
          <p
            className="text-[#4a5678] max-w-2xl mx-auto text-lg"
            style={{ fontSize: takeActionSubtitleFontSize ?? '18px', whiteSpace: 'nowrap' }}
          >
            {takeActionSubtitle}
          </p>
        </motion.div>

        {hasPrimary ? (
          <div className="grid gap-6 max-w-6xl mx-auto">
            {primaryCard ? (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className={`group relative p-8 md:p-10 rounded-3xl border shadow-[0_18px_36px_rgba(0,0,0,0.12)] ${
                  primaryCard?.bg ?? 'bg-gradient-to-br from-[#131e42] via-[#1f2c63] to-[#e1513b]'
                } ${isPrimaryLight ? 'text-[#131e42]' : 'text-white'}`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:gap-6">
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-[0_6px_16px_rgba(0,0,0,0.12)] ${
                      isPrimaryLight ? 'bg-white border border-[#d9e3ff]' : 'bg-white/15 border border-white/20'
                    }`}
                  >
                    <primaryCard.icon className="h-7 w-7" style={{ color: isPrimaryLight ? '#e1513b' : '#f0f6ff' }} />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold tracking-[0.18em] uppercase ${
                          isPrimaryLight ? 'text-[#131e42]' : 'text-[#fbd7cd]'
                        }`}
                      >
                        {primaryCard.badge}
                      </span>
                      <span
                        className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                          isPrimaryLight ? 'bg-white border border-[#d9e3ff] text-[#131e42]' : 'bg-white/15 border border-white/10 text-white'
                        }`}
                      >
                        Start
                      </span>
                    </div>
                    <h3 className="ghc-font-display text-2xl md:text-3xl font-semibold">
                      {primaryCard.title}
                    </h3>
                    <p className={`text-base md:text-lg leading-relaxed ${isPrimaryLight ? 'text-[#4a5678]' : 'text-white/90'}`}>
                      {primaryCard.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {primaryCard.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                            isPrimaryLight ? 'bg-white text-[#131e42] border border-[#d9e3ff]' : 'bg-white/15 text-white border border-white/20'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${isPrimaryLight ? 'bg-[#e1513b]' : 'bg-white/80'}`} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={isActionLocked(primaryCard) ? undefined : () => handleNavigate(primaryCard.path)}
                    aria-disabled={isActionLocked(primaryCard)}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-colors ${
                      isPrimaryLight
                        ? 'bg-transparent border border-[#d9e3ff] text-[#131e42] hover:bg-white/60'
                        : 'bg-white text-[#131e42] shadow-[0_10px_24px_rgba(0,0,0,0.18)] hover:bg-[#f0f6ff]'
                    }`}
                  >
                    {isActionLocked(primaryCard) ? <Lock className="h-5 w-5" /> : null}
                    {primaryCard.cta}
                    {isActionLocked(primaryCard) ? (
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#9aa4c6]">(Coming soon)</span>
                    ) : null}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ) : null}

            {secondaryCards.length ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={containerVariants}
                custom={0}
              >
                {secondaryCards.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={itemVariants}
                    whileHover={{ y: -6 }}
                    className={`group relative p-7 md:p-8 rounded-3xl ${item.bg} border border-[#e3e8f5] shadow-[0_10px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.09)] transition-all`}
                  >
                    <div className="flex items-start gap-4 md:gap-5">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white shadow-[0_6px_16px_rgba(0,0,0,0.08)] flex items-center justify-center">
                        <item.icon className="h-6 w-6" style={{ color: item.iconColor }} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className={`text-xs font-semibold tracking-[0.18em] uppercase ${item.badgeColor}`}>
                          {item.badge}
                        </p>
                        <h3 className="ghc-font-display text-xl md:text-2xl font-semibold text-[#131e42]">
                          {item.title}
                        </h3>
                        <p className="text-sm md:text-base text-[#4a5678] leading-relaxed">{item.description}</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 rounded-full bg-white/75 text-[#131e42] px-3 py-1 text-xs font-medium shadow-sm cursor-default"
                            >
                              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.iconColor }} />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={isActionLocked(item) ? undefined : () => handleNavigate(item.path)}
                      aria-disabled={isActionLocked(item)}
                      className={`inline-flex items-center gap-1 text-sm font-semibold mt-6 ${
                        isActionLocked(item) ? 'text-[#9aa4c6] cursor-not-allowed' : `${item.accent} group-hover:underline`
                      }`}
                    >
                      {isActionLocked(item) ? <Lock className="h-4 w-4" /> : null}
                      {item.cta}
                      {isActionLocked(item) ? (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#9aa4c6]">(Coming soon)</span>
                      ) : null}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            ) : null}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={containerVariants}
            custom={0}
          >
            {actionCards.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className={`group relative p-7 md:p-9 rounded-3xl ${item.bg} shadow-[0_10px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] transition-all`}
              >
                <div className="flex items-start gap-4 md:gap-5">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white shadow-[0_6px_16px_rgba(0,0,0,0.08)] flex items-center justify-center">
                    <item.icon className="h-6 w-6" style={{ color: item.iconColor }} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className={`text-xs font-semibold tracking-[0.18em] uppercase ${item.badgeColor}`}>
                      {item.badge}
                    </p>
                    <h3 className="ghc-font-display text-xl md:text-2xl font-semibold text-[#131e42]">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-[#4a5678]">{item.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-white/75 text-[#131e42] px-3 py-1 text-xs font-medium shadow-sm cursor-default"
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.iconColor }} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={isActionLocked(item) ? undefined : () => handleNavigate(item.path)}
                  aria-disabled={isActionLocked(item)}
                  className={`inline-flex items-center gap-1 text-sm font-semibold mt-6 ${
                    isActionLocked(item) ? 'text-[#9aa4c6] cursor-not-allowed' : `${item.accent} group-hover:underline`
                  }`}
                >
                  {isActionLocked(item) ? <Lock className="h-4 w-4" /> : null}
                  {item.cta}
                  {isActionLocked(item) ? (
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#9aa4c6]">(Coming soon)</span>
                  ) : null}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* -----------------------------------------
   Section: Final CTA
   ----------------------------------------- */

function SectionFinalCTA({ navigate, content }: { navigate: (path: string) => void; content?: LandingOverrides }) { // NOSONAR: props are intentionally mutable
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const finalHeadline = content?.finalHeadline ?? 'Work aligned inside the Golden Honeycomb';
  const finalSubtitle =
    content?.finalSubtitle ??
    'The Golden Honeycomb comes to life inside the DQ Digital Workspace, guiding tools, decisions, and daily work.';
  const primaryCTAHidden = content?.finalCTALabel === '' || content?.finalCTALabel === null;
  const finalCTALabel = primaryCTAHidden ? null : (content?.finalCTALabel ?? 'Go to the DQ Digital Workspace');
  const finalCTATo = primaryCTAHidden ? null : (content?.finalCTATo ?? '/');
  const finalCTASecondaryLabel = content?.finalCTASecondaryLabel;
  const finalCTASecondaryTo = content?.finalCTASecondaryTo;
  const finalHeadlineFontSize = content?.finalHeadlineFontSize;
  const finalSubtitleFontSize = content?.finalSubtitleFontSize;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden dq-gradient-animated"
      style={{
        background: 'linear-gradient(120deg, #131e42 0%, #1b2553 45%, #e1513b 100%)',
      }}
    >
      <div className="dq-digital-bg" aria-hidden="true">
        <svg viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="dq-digital-glow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(240,246,255,0.6)" />
              <stop offset="100%" stopColor="rgba(225,81,59,0.6)" />
            </linearGradient>
          </defs>
          <path className="dq-digital-line" d="M-40 140 L240 90 L520 160 L820 110 L1160 170 L1480 120" />
          <path className="dq-digital-line alt" d="M-60 260 L180 220 L520 300 L860 240 L1180 320 L1500 260" />
          <path className="dq-digital-line" d="M-40 400 L260 360 L520 420 L820 370 L1120 430 L1460 380" />
          <path className="dq-digital-line alt" d="M-80 520 L220 500 L520 560 L840 520 L1160 580 L1500 540" />
          <path className="dq-digital-line" d="M120 60 L280 180 L460 80 L640 200 L820 120 L1040 220 L1240 140" />
          <path className="dq-digital-line alt" d="M240 120 L420 260 L620 150 L840 300 L1040 190 L1260 320" />

          <circle className="dq-digital-dot" cx="240" cy="90" r="3.5" />
          <circle className="dq-digital-dot alt" cx="520" cy="160" r="4" />
          <circle className="dq-digital-dot" cx="820" cy="110" r="3" />
          <circle className="dq-digital-dot alt" cx="1160" cy="170" r="4.5" />
          <circle className="dq-digital-dot" cx="180" cy="220" r="3" />
          <circle className="dq-digital-dot alt" cx="520" cy="300" r="4" />
          <circle className="dq-digital-dot" cx="860" cy="240" r="3.5" />
          <circle className="dq-digital-dot alt" cx="1180" cy="320" r="4" />
          <circle className="dq-digital-dot" cx="260" cy="360" r="3" />
          <circle className="dq-digital-dot alt" cx="520" cy="420" r="4" />
          <circle className="dq-digital-dot" cx="820" cy="370" r="3.5" />
          <circle className="dq-digital-dot alt" cx="1120" cy="430" r="4" />
          <circle className="dq-digital-dot" cx="220" cy="500" r="3" />
          <circle className="dq-digital-dot alt" cx="520" cy="560" r="4" />
          <circle className="dq-digital-dot" cx="840" cy="520" r="3.5" />
          <circle className="dq-digital-dot alt" cx="1160" cy="580" r="4" />
          <circle className="dq-digital-dot" cx="420" cy="260" r="3.5" />
          <circle className="dq-digital-dot alt" cx="640" cy="200" r="4" />
          <circle className="dq-digital-dot" cx="1040" cy="220" r="3.5" />
          <circle className="dq-digital-dot alt" cx="1260" cy="320" r="4" />
        </svg>
      </div>
      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="relative min-h-[420px] lg:min-h-[520px] flex items-center">
          <motion.div
            className="relative z-10 max-w-3xl py-16 md:py-20 px-2 sm:px-4 md:px-0 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="ghc-font-display font-bold text-4xl sm:text-5xl md:text-5xl lg:text-6xl leading-[1.1] text-white tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{ fontSize: finalHeadlineFontSize }}
            >
              {finalHeadline}
            </motion.h2>
            <motion.p
              className="mt-6 text-base sm:text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              style={{ fontSize: finalSubtitleFontSize }}
            >
              {finalSubtitle}
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
            <div className="flex flex-wrap gap-3">
              {finalCTALabel && finalCTATo ? (
                <button
                  type="button"
                  onClick={() => {
                    if (finalCTATo.startsWith('http')) {
                      window.open(finalCTATo, '_blank', 'noopener,noreferrer');
                    } else {
                      navigate(finalCTATo);
                    }
                  }}
                  className="inline-flex items-center gap-2.5 h-[52px] px-7 rounded-lg bg-white text-[#131e42] font-semibold text-base shadow-xl shadow-black/12 transition transform hover:-translate-y-0.5 hover:bg-white/95"
                >
                  {finalCTALabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : null}
              {finalCTASecondaryLabel && finalCTASecondaryTo ? (
                <button
                  type="button"
                  onClick={() => {
                    if (finalCTASecondaryTo.startsWith('http')) {
                      window.open(finalCTASecondaryTo, '_blank', 'noopener,noreferrer');
                    } else {
                      navigate(finalCTASecondaryTo);
                    }
                  }}
                  className="inline-flex items-center gap-2.5 h-[52px] px-7 rounded-lg border border-white/60 text-white font-semibold text-base shadow-lg shadow-black/10 transition transform hover:-translate-y-0.5 hover:bg-white/10"
                >
                  {finalCTASecondaryLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : null}
            </div>
        </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default GHCLanding;
