import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowRightLeft,
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Lock,
  Cog,
  Globe,
  GraduationCap,
  Layers,
  Lightbulb,
  RefreshCw,
  Rocket,
  RotateCcw,
  ShoppingBag,
  ShieldCheck,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SectionBadge } from '@/components/SectionBadge';
import ComingSoonCard from '@/components/ComingSoonCard';

const HERO_ORBS = [
  {
    className: 'left-[-120px] top-[-80px] h-[420px] w-[420px]',
    duration: 7.5,
  },
  {
    className: 'right-[-140px] top-[120px] h-[520px] w-[520px]',
    duration: 9,
  },
  {
    className: 'bottom-[-160px] left-[30%] h-[600px] w-[600px]',
    duration: 10,
  },
];

const CLARITY_CARDS = [
  {
    title: 'Accelerate Clarity',
    description:
      'Structured blueprints and shared architecture align teams from strategy to live deployment without ambiguity.',
    icon: Cog,
  },
  {
    title: 'Reduce Reinvention',
    description:
      'Proven systems built inside real delivery cycles prevent fragmentation and repeated mistakes across teams.',
    icon: ShieldCheck,
  },
  {
    title: 'Scale Execution',
    description:
      'Unified platforms connect strategy, governance, and operations into one consistent execution model.',
    icon: Workflow,
  },
];

const FRAMEWORK_CARDS = [
  {
    title: 'Digital Economy (DE)',
    description:
      'Transform your business to thrive in the digital economy with data-driven decisions that unlock new revenue and increase profitability.',
    icon: Globe,
  },
  {
    title: 'Digital Cognitive Organisation (DCO)',
    description:
      'Leverage AI and automation to drive smarter decision-making and enhance operational agility in real-time.',
    icon: Brain,
  },
  {
    title: 'Digital Business Platform (DBP)',
    description:
      'Streamline workflows and improve collaboration with a unified platform that integrates all key business functions.',
    icon: Layers,
  },
  {
    title: 'Digital Transformation 2.0 (DT2.0)',
    description:
      'Accelerate your transformation with strategic digital technologies that enhance performance and meet evolving customer needs.',
    icon: RefreshCw,
  },
  {
    title: 'Digital Worker & Workspace (DW/WS)',
    description:
      'Empower your workforce with intelligent tools that boost productivity, collaboration, and engagement in the digital workspace.',
    icon: Users,
  },
  {
    title: 'Digital Accelerators',
    description:
      'Speed up your transformation with ready-to-use, scalable solutions that drive fast implementation and continuous growth.',
    icon: Zap,
  },
];

const FILTER_OPTIONS = [
  'All Offerings',
  'Class 01 DBP Services',
  'Class 02 DT 2.0',
  'Class 03 DCO',
  'Class 04 TxM',
];

type Product = {
  name: string;
  subtitle: string;
  description: string;
  cta: string;
  icon: typeof Briefcase;
};

type ProductClass = {
  id: string;
  filter: string;
  label: string;
  title: string;
  intro: string;
  icon: typeof Briefcase;
  products: Product[];
};

const PRODUCT_CLASSES: ProductClass[] = [
  {
    id: 'class-01',
    filter: 'Class 01 DBP Services',
    label: 'Class 01',
    title: 'DBP Services',
    intro:
      'Delivery services that design and deploy unified Digital Business Platforms with execution discipline built in.',
    icon: Briefcase,
    products: [
      {
        name: 'DBP Designs',
        subtitle: 'Strategy, Architecture, Roadmaps',
        description:
          'Blueprint-based advisory defining digital strategy, architecture, operating models, and sector transformation roadmaps.',
        cta: 'Understand DBP Design',
        icon: Briefcase,
      },
      {
        name: 'DBP Deploys',
        subtitle: 'Platform Implementation',
        description:
          'Blueprint-driven SaaS implementations operationalising Experience 4.0, Agility 4.0, Intelligence 4.0, Workspace 4.0, and Sector 4.0 platforms.',
        cta: 'Understand DBP Deploy',
        icon: Layers,
      },
    ],
  },
  {
    id: 'class-02',
    filter: 'Class 02 DT 2.0',
    label: 'Class 02',
    title: 'DT 2.0 Product',
    intro:
      'Digital Transformation 2.0 platforms industrialising strategy, design, deployment, and adoption as a continuous execution system.',
    icon: RotateCcw,
    products: [
      {
        name: 'DTMP',
        subtitle: 'Specification & Orchestration Platform',
        description:
          'End-to-end DBP specification and orchestration platform accelerating strategy, design, deployment, and adoption across the organisation.',
        cta: 'Explore DTMP',
        icon: RotateCcw,
      },
      {
        name: 'TMaaS',
        subtitle: 'Transformation as a Service',
        description:
          'Marketplace-driven managed transformation enabling scalable Transformation-as-a-Service across sectors.',
        cta: 'Explore TMaaS',
        icon: Briefcase,
      },
      {
        name: 'DTO4T / TwinGM AI',
        subtitle: 'AI-Guided Transformation',
        description:
          'AI-guided digital twin platform reinforcing precision transformation and continuous execution discipline.',
        cta: 'Explore DTO4T',
        icon: Zap,
      },
    ],
  },
  {
    id: 'class-03',
    filter: 'Class 03 DCO',
    label: 'Class 03',
    title: 'DCO Product',
    intro:
      'Insight and capability systems anchoring how organisations understand, align, and scale digital transformation.',
    icon: Lightbulb,
    products: [
      {
        name: 'DTMI',
        subtitle: 'Digital Transformation Market Insights',
        description: 'Global digital transformation insights structured by 6xD and sector lenses.',
        cta: 'Explore DTMI',
        icon: Brain,
      },
      {
        name: 'DTMA',
        subtitle: 'Digital Transformation Academy',
        description:
          'Digital Transformation Academy building competencies required to operate in Digital Cognitive Organisations.',
        cta: 'Start in DTMA',
        icon: GraduationCap,
      },
      {
        name: 'DTMB (6xD / GHC Series)',
        subtitle: 'Published Intellectual Foundation',
        description:
          "Published intellectual foundation codifying DQ's transformation frameworks and execution discipline.",
        cta: 'Read 6xD Books',
        icon: BookOpen,
      },
    ],
  },
  {
    id: 'class-04',
    filter: 'Class 04 TxM',
    label: 'Class 04',
    title: 'TxM Platform',
    intro:
      'Transaction ecosystems transforming complex journeys into orchestrated, governed, and repeatable economic execution.',
    icon: ArrowRightLeft,
    products: [
      {
        name: 'TxM (B2B2C)',
        subtitle: 'Consumer Ecosystems',
        description:
          'Consumer and experience ecosystems powered by unified DBPs enabling near-perfect life transactions.',
        cta: 'Explore B2B2C Platform',
        icon: ArrowRightLeft,
      },
      {
        name: 'TxM (B2B2B)',
        subtitle: 'Enterprise Ecosystems',
        description:
          'Enterprise and partner ecosystems enabling scalable, real-time collaboration and digital transactions.',
        cta: 'Explore B2B2B Platform',
        icon: Users,
      },
    ],
  },
];

const SECTOR_GROUPS = [
  {
    title: 'Cross-Sector Initiatives',
    description:
      'Common Digital Business Platforms enabling Experience, Agility, Intelligence, and Workspace transformation across industries.',
    items: [
      { label: 'Experience 4.0', href: 'https://corp-web.qatalyst.tech/services/experience-4-0' },
      { label: 'Agility 4.0', href: 'https://corp-web.qatalyst.tech/services/agility-4-0' },
      { label: 'Intelligence 4.0', comingSoon: true },
      { label: 'Workspace 4.0', comingSoon: true },
      { label: 'Governance 4.0', comingSoon: true },
      { label: 'BackOffice 4.0', comingSoon: true },
    ],
    symbol: '◆',
  },
  {
    title: 'Primary Sector',
    description: 'Field and resource industries accelerating digital harvesting and operational efficiency.',
    items: [
      { label: 'Mining 4.0', comingSoon: true },
      { label: 'Farming 4.0', href: 'https://corp-web.qatalyst.tech/services/farming-4-0' },
    ],
    symbol: '▲',
  },
  {
    title: 'Secondary Sector',
    description: 'Production and infrastructure sectors modernising facilities, logistics, and industrial systems.',
    items: [
      { label: 'Plant 4.0', href: 'https://corp-web.qatalyst.tech/services/plant-4-0' },
      { label: 'Logistics 4.0', href: 'https://corp-web.qatalyst.tech/services/logistics-4-0' },
      { label: 'Infrastructure 4.0', href: 'https://corp-web.qatalyst.tech/services/infrastructure-4-0' },
    ],
    symbol: '■',
  },
  {
    title: 'Tertiary Sector',
    description: 'Transaction-based industries transforming government, retail, and service ecosystems.',
    items: [
      { label: 'Government 4.0', href: 'https://corp-web.qatalyst.tech/services/government-4-0' },
      { label: 'Services 4.0', href: 'https://corp-web.qatalyst.tech/services/service-4-0' },
      { label: 'Retail 4.0', href: 'https://corp-web.qatalyst.tech/services/retail-4-0' },
    ],
    symbol: '●',
  },
  {
    title: 'Quaternary Sector',
    description: 'Life and wellbeing industries redefined through intelligent hospitality and wellness ecosystems.',
    items: [
      { label: 'Hospitality 4.0', href: 'https://corp-web.qatalyst.tech/services/hospitality-4-0' },
      { label: 'Wellness 4.0', href: 'https://corp-web.qatalyst.tech/services/wellness-4-0' },
    ],
    symbol: '✦',
  },
];

const PATHS = [
  {
    label: 'New Joiners & Teams',
    title: 'Start with DTMA',
    description: 'Structured onboarding and capability pathways built for high-velocity transformation teams.',
    cta: 'Start in DTMA',
    icon: GraduationCap,
    comingSoon: true,
  },
  {
    label: 'Leaders & Strategists',
    title: 'Explore DTMI Insight',
    description: 'Gain the strategic context, insight signals, and governance models behind DQ execution.',
    cta: 'Explore DTMI Insight',
    href: 'https://corp-web.qatalyst.tech/marketplace/dtmi',
    icon: BarChart3,
  },
  {
    label: 'Delivery Teams',
    title: 'Explore Product Marketplace',
    description: 'Move directly into platform delivery, accelerators, and deployment playbooks.',
    cta: 'Go to Marketplace',
    icon: Rocket,
    comingSoon: true,
  },
];

export default function SixXDProductsLanding() {
  const [activeFilter, setActiveFilter] = useState(FILTER_OPTIONS[0]);

  const filteredClasses = useMemo(() => {
    if (activeFilter === 'All Offerings') return PRODUCT_CLASSES;
    return PRODUCT_CLASSES.filter((item) => item.filter === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <Header />
      <div className="bg-background text-foreground">
      <section id="hero" className="relative min-h-[85vh] overflow-hidden gradient-dws">
        <div className="absolute inset-0">
          {HERO_ORBS.map((orb, index) => (
            <motion.div
              key={orb.className}
              className={`absolute rounded-full bg-white/5 blur-3xl ${orb.className}`}
              animate={{ y: [0, 30, 0], x: [0, -15, 0] }}
              transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
            />
          ))}
        </div>
        <div className="relative z-10 flex min-h-[85vh] items-center justify-center px-4 py-24 text-center">
          <div className="max-w-4xl">
            <SectionBadge label="DQ Products" variant="dark" />
            <motion.h1
              className="font-display text-4xl font-bold text-white sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              Transformation fails when execution is <span className="text-white/70">fragmented.</span>
            </motion.h1>
            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              DQ products turn digital ambition into continuous, structured execution across unified Digital Business
              Platforms.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <Button
                size="lg"
                variant="ghost"
                className="!bg-white font-semibold !text-primary hover:!bg-white/90 rounded-xl"
                asChild
              >
                <a href="/marketplace/directory/products">
                  Explore Product Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="!border-white !bg-white !text-[#0B2B6B] hover:!bg-white/95 !rounded-xl"
                asChild
              >
                <a
                  href="https://corp-web.qatalyst.tech/marketplace/dtmi"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Explore 6xD & DTMI
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="clarity" className="bg-[#f0f6ff] py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <SectionBadge label="The DQ Impact" />
            <motion.h2
              className="mt-2 font-display text-3xl font-bold sm:text-4xl"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              Transformation as Execution Discipline
            </motion.h2>
            <motion.p
              className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              At DQ, transformation is not a project. It is how we operate — designed, systemised, and executed through unified Digital Business Platforms.
            </motion.p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {CLARITY_CARDS.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  className="glass-card rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  viewport={{ once: true, margin: '-50px' }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg text-white gradient-hero">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold">{card.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{card.description}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="gradient-divider mb-10 mt-10" />
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <a href="#products">See All Product Classes</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="framework" className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <SectionBadge label="Structure" className="mx-auto" />
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Built on the 6x Digital Framework</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
              The Six Dimensions of Digital Transformation (6xD) redefines digital transformation, unlocking growth and
              driving faster, more efficient outcomes.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FRAMEWORK_CARDS.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    className="group relative overflow-hidden rounded-2xl border bg-[#f9fbff] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{ borderColor: 'hsl(var(--primary) / 0.12)' }}
                    initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true, margin: '-50px' }}
                >
                  <div className="absolute left-0 right-0 top-0 h-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 gradient-hero" />
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white gradient-hero">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-[15px] font-semibold">{card.title}</h3>
                  </div>
                  <p className="mb-5 mt-4 text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                  <button
                    type="button"
                    aria-disabled="true"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary/60 cursor-not-allowed"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Read More
                  </button>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: '-50px' }}
          >
            <Button size="lg" className="rounded-xl px-8 font-semibold text-white gradient-hero hover:opacity-90" asChild>
              <a
                href="https://digital-qatalyst.shorthandstories.com/4d9b256d-1632-4c32-bc0c-73d9cdfa57fc/index.html"
                target="_blank"
                rel="noreferrer"
              >
                Read the 6xD Books
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-[#25406F] text-[#25406F] hover:bg-[#25406F]/5" asChild>
              <a href="/marketplace/guides/dq-6xd">
                Explore DTMI Insights
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <section id="products" className="bg-[#f0f6ff] py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <SectionBadge label="Architecture" className="mx-auto" />
            <motion.h2
              className="mt-2 font-display text-3xl font-bold sm:text-4xl"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              The Four Classes of DQ Offerings
            </motion.h2>
            <motion.p
              className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              DQ offerings form a structured progression from blueprint advisory to automated transformation and live economic ecosystems.
            </motion.p>
          </div>

          <div className="flex flex-wrap gap-3">
            {FILTER_OPTIONS.map((option) => {
              const isActive = option === activeFilter;
              return (
                <Button
                  key={option}
                  variant="ghost"
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                    isActive
                      ? 'border-transparent text-white shadow-md gradient-hero'
                      : 'border-border bg-card text-muted-foreground hover:border-[hsl(var(--primary)/0.3)]'
                  }`}
                  onClick={() => setActiveFilter(option)}
                >
                  {option}
                </Button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              className="mt-12 space-y-16"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {filteredClasses.map((productClass, classIndex) => {
                const Icon = productClass.icon;
                return (
                  <div key={productClass.id} className="space-y-6">
                    {classIndex > 0 && <div className="gradient-divider" />}
                    <div>
                      <div className="gradient-left-border pl-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white gradient-hero">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                              {productClass.label}
                            </p>
                            <h3 className="text-lg font-bold">{productClass.title}</h3>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 pl-4 text-sm text-muted-foreground">{productClass.intro}</p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {productClass.products.map((product, index) => {
                        const ProductIcon = product.icon;
                        return (
                          <motion.div
                            key={product.name}
                            className="flex h-full flex-col rounded-xl border border-border bg-card p-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, margin: '-50px' }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white gradient-hero">
                                <ProductIcon className="h-5 w-5" />
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {productClass.filter}
                              </Badge>
                            </div>
                            <h4 className="mt-4 font-display text-base font-semibold">{product.name}</h4>
                            <p className="mt-1 text-xs text-[hsl(var(--primary)/0.7)]">{product.subtitle}</p>
                            <p className="mt-3 flex-1 text-sm text-muted-foreground">{product.description}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-5 w-full cursor-not-allowed opacity-75"
                              disabled
                              aria-disabled="true"
                            >
                              <Lock className="mr-2 h-4 w-4" />
                              {product.cta}
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section id="sectors" className="bg-section-muted py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <SectionBadge label="Coverage" className="mx-auto" />
            <motion.h2
              className="mt-2 font-display text-3xl font-bold sm:text-4xl"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              viewport={{ once: true }}
            >
              Driving Transformation Across Sectors
            </motion.h2>
            <motion.p
              className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              viewport={{ once: true }}
            >
              DQ Blueprints accelerate structured digital transformation across cross-sector and industry-specific domains.
            </motion.p>
          </div>

          <div className="space-y-5">
            {SECTOR_GROUPS.map((group, index) => (
              <motion.div
                key={group.title}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 md:p-8 transition-all duration-300 hover:shadow-lg"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="absolute left-0 right-0 top-0 h-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100 gradient-hero" />
                <div className="absolute right-[-40px] top-[-40px] h-32 w-32 rounded-full bg-primary/5 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-primary">
                  <span className="text-primary/70">{group.symbol}</span>
                  <span>{group.title}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{group.description}</p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {group.items.map((item, tagIndex) => (
                    // Sector tag with optional coming soon styling
                    <motion.a
                      key={item.label}
                      href={item.href ?? '#'}
                      target={item.href ? '_blank' : undefined}
                      rel={item.href ? 'noreferrer' : undefined}
                      onClick={item.comingSoon ? (event) => event.preventDefault() : undefined}
                      aria-disabled={item.comingSoon ? 'true' : undefined}
                      className={`
                        group/tag inline-flex items-center rounded-xl px-5 py-2.5 text-xs font-semibold transition-all duration-200
                        ${item.comingSoon
                          ? 'cursor-not-allowed border border-muted-foreground/20 bg-muted text-muted-foreground'
                          : 'border border-primary/15 bg-primary/[0.06] text-primary hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.14] hover:shadow-md hover:shadow-primary/5'}
                      `}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, delay: index * 0.08 + tagIndex * 0.04 }}
                      viewport={{ once: true }}
                    >
                      {item.label}
                      {item.comingSoon && (
                        <span className="ml-2 rounded-full border border-muted-foreground/30 bg-white/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          Coming Soon
                        </span>
                      )}
                      {!item.comingSoon && (
                        <ArrowRight className="ml-2 h-3.5 w-3.5 -translate-x-2 opacity-0 transition-all duration-200 group-hover/tag:translate-x-0 group-hover/tag:opacity-100" />
                      )}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="paths" className="bg-[#f0f6ff] py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <SectionBadge label="When" className="mx-auto" />
            <motion.h2
              className="mt-2 font-display text-3xl font-bold sm:text-4xl"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              Choose Your Path
            </motion.h2>
            <motion.p
              className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              Choose the path that matches how you engage with DQ products and delivery systems.
            </motion.p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PATHS.map((path, index) => {
              const Icon = path.icon;
              return (
                path.comingSoon ? (
                  <ComingSoonCard
                    key={path.title}
                    icon={Icon}
                    audience={path.label}
                    title={path.title}
                    desc={path.description}
                    index={index}
                    pillText="Coming soon"
                  />
                ) : (
                  <motion.div
                    key={path.title}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-10 text-center"
                    style={{ borderColor: 'hsl(var(--border))' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.12 }}
                    viewport={{ once: true, margin: '-50px' }}
                  >
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 gradient-hero group-hover:opacity-100" />
                    <div className="relative z-10 flex h-full flex-col items-center">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-xl">
                        <div className="absolute inset-0 rounded-xl gradient-hero transition-opacity duration-500 group-hover:opacity-0" />
                        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <Icon className="relative h-6 w-6 text-white" />
                      </div>
                      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--primary)/0.6)] transition-colors duration-500 group-hover:text-white/70">
                        {path.label}
                      </p>
                      <h3 className="mt-3 font-display text-xl font-semibold transition-colors duration-500 group-hover:text-white">
                        {path.title}
                      </h3>
                      <p className="mt-3 text-sm text-muted-foreground transition-colors duration-500 group-hover:text-white/80">
                        {path.description}
                      </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-auto w-full transition-colors duration-500 group-hover:border-transparent group-hover:bg-white/90 group-hover:text-primary sm:w-auto"
                      asChild
                    >
                      <a href={path.href ?? '#'} target={path.href ? '_blank' : undefined} rel={path.href ? 'noreferrer' : undefined}>
                        {path.cta}
                      </a>
                    </Button>
                    </div>
                  </motion.div>
                )
              );
            })}
          </div>
        </div>
      </section>

      <section id="closing" className="relative overflow-hidden gradient-dws py-28 md:py-36">
        <div className="absolute inset-0">
          <div className="absolute right-[-200px] top-[-180px] h-[420px] w-[420px] rounded-full blur-[120px]" style={{ backgroundColor: 'rgba(251,85,53,0.25)' }} />
          <div className="absolute left-[-180px] bottom-[-180px] h-[480px] w-[480px] rounded-full blur-[140px]" style={{ backgroundColor: 'rgba(0,33,128,0.2)' }} />
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.035,
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="text-white">
              <SectionBadge label="System" variant="dark" />
              <motion.h2
                className="mt-5 text-3xl font-bold leading-[1.3] sm:text-4xl lg:text-[3.25rem]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                viewport={{ once: true }}
              >
                Execution Becomes System.
                <br />
                <span className="bg-[linear-gradient(90deg,_#FB5535_0%,_rgba(251,85,53,0.6)_100%)] bg-clip-text text-transparent">
                  System Becomes Scale.
                </span>
              </motion.h2>
              <motion.div
                className="mt-5 h-[3px] w-3 rounded-full bg-gradient-to-r from-white/50 to-white/10"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16 }}
                viewport={{ once: true }}
              />
              <motion.p
                className="mt-6 text-base text-white/55"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24 }}
                viewport={{ once: true }}
              >
                Internal first. Delivery proven. Navigate the system.
              </motion.p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { label: 'Explore Product Marketplace', icon: ShoppingBag, href: 'https://corp-web.qatalyst.tech/products' },
                { label: 'Explore DTMI Insight', icon: BookOpen, href: 'https://corp-web.qatalyst.tech/dtmi' },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center gap-4 no-underline"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[15px] font-semibold text-white">{item.label}</span>
                    </a>
                    <ArrowRight className="h-4 w-4 text-white transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </>
  );
}
