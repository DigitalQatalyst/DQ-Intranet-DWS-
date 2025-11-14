import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  TrendingUp,
  Clock,
  MapPin,
  Check,
  Users,
  Target,
  Workflow,
  AlertTriangle,
  ShieldCheck,
  Megaphone,
  Sparkles,
  ArrowRight,
  X,
  ChevronRight,
} from "lucide-react";
import {
  AnimatedText,
  FadeInUpOnScroll,
  StaggeredFadeIn,
} from "../components/AnimationUtils";
import { LeadershipMeaningSection } from "../components/LeadershipMeaningSection";
import { LeadershipGrowthJourney } from "../components/LeadershipGrowthJourney";
import { LeaderPersonasSection } from "../components/LeaderPersonasSection";
import { LeadershipQuizBanner } from "../components/LeadershipQuizBanner";

// Types
type PathCard = {
  key: string;
  title: string;
  desc: string;
  bullets: string[];
  cta: { label: string; href: string };
};

type CapTile = {
  key: string;
  icon: string;
  title: string;
  blurb: string;
  tags: string[];
};

type ImpactMetric = {
  key: string;
  title: string;
  value: string;
  desc: string;
  trend: string;
};

type Program = {
  key: string;
  title: string;
  blurb: string;
  tags: string[];
  href: string;
};

type Job = {
  title: string;
  area: string;
  location: string;
  tags: string[];
  href: string;
};

type Event = {
  title: string;
  date: string;
  time: string;
  location: string;
  href: string;
};

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  image?: string;
};

// Data
const HERO_METRICS = [
  { icon: "TrendingUp", value: "120+", label: "Initiatives with appointed Leads" },
  { icon: "Clock", value: "20–30%", label: "Typical time alongside role" },
  { icon: "MapPin", value: "DXB & NBO", label: "Locations supported" },
];

const PATHS: PathCard[] = [
  {
    key: "squad",
    title: "Squad Lead",
    desc: "Drive rituals, unblock delivery, and keep outcomes moving each sprint.",
    bullets: [
      "Stand-ups, Planning, Reviews, Retros",
      "Flow visibility with boards & dashboards",
      "Early risk identification & escalation",
    ],
    cta: { label: "Apply for Squad Lead", href: "#apply?role=squad" },
  },
  {
    key: "practice",
    title: "Practice Lead",
    desc: "Raise craft quality and standards across a discipline (e.g., Data, UX, Engineering).",
    bullets: [
      "Playbooks, DoR/DoD, quality gates",
      "Mentor growth & feedback culture",
      "Chapter sessions and code reviews",
    ],
    cta: { label: "Apply for Practice Lead", href: "#apply?role=practice" },
  },
  {
    key: "community",
    title: "Community Lead",
    desc: "Connect chapters and knowledge across locations to accelerate learning.",
    bullets: [
      "Knowledge sharing & facilitation",
      "Cross-studio collaboration",
      "Events, demos, and spotlights",
    ],
    cta: { label: "Apply for Community Lead", href: "#apply?role=community" },
  },
  {
    key: "stream",
    title: "Project/Stream Lead",
    desc: "Orchestrate outcomes across teams for a time-boxed initiative or program.",
    bullets: [
      "OKRs, scope & dependency mapping",
      "Stakeholder comms & reporting",
      "Release planning & readiness",
    ],
    cta: { label: "Apply for Stream Lead", href: "#apply?role=stream" },
  },
];

const CAP_TILES: CapTile[] = [
  {
    key: "facilitation",
    icon: "Users",
    title: "Facilitation",
    blurb: "Guide rituals that end with clear next steps.",
    tags: ["Time-boxed", "Outcome-first", "Actions captured"],
  },
  {
    key: "prioritization",
    icon: "Target",
    title: "Prioritization",
    blurb: "Keep focus on outcomes and cut noise early.",
    tags: ["OKRs visible", "Now/Next/Later", "Scope trade-offs"],
  },
  {
    key: "flow",
    icon: "Workflow",
    title: "Flow & Visibility",
    blurb: "Make work transparent so blockers surface quickly.",
    tags: ["Board hygiene", "WIP limits", "Dashboards"],
  },
  {
    key: "risk",
    icon: "AlertTriangle",
    title: "Risk & Escalation",
    blurb: "Escalate with context before blockers age.",
    tags: ["Risk owners", "Mitigations", "No surprises"],
  },
  {
    key: "quality",
    icon: "ShieldCheck",
    title: "Quality & Standards",
    blurb: "Apply DoR/DoD and gates to protect excellence.",
    tags: ["Definitions", "Checks", "Fewer defects"],
  },
  {
    key: "communication",
    icon: "Megaphone",
    title: "Communication",
    blurb: "Crisp updates and value-focused demos.",
    tags: ["Briefs", "Stakeholder sync", "Async first"],
  },
  {
    key: "coaching",
    icon: "Sparkles",
    title: "Coaching & Feedback",
    blurb: "Develop people faster with useful feedback.",
    tags: ["1:1s", "Pair & shadow", "Recognition"],
  },
];

const IMPACT_METRICS: ImpactMetric[] = [
  { key: "cycle", title: "Cycle Time ↓", value: "18% faster", desc: "Average story completion speed", trend: "Improved" },
  { key: "throughput", title: "Throughput ↑", value: "+22%", desc: "Stories completed per sprint", trend: "Improved" },
  { key: "predictability", title: "Predictability ↑", value: "+34%", desc: "Sprint goals achieved", trend: "Improved" },
  { key: "blockers", title: "Blocker Age ↓", value: "-27%", desc: "Average blocker duration", trend: "Improved" },
  { key: "clarity", title: "Team Clarity ↑", value: "+32%", desc: "Associates clear on priorities", trend: "Improved" },
  { key: "defects", title: "Defects Escaped ↓", value: "-16%", desc: "Post-release bugs", trend: "Improved" },
];

const PROGRAMS: Program[] = [
  {
    key: "ldp",
    title: "Leads Development Program",
    blurb: "Cohort-based learning with coaching, practice, and reflection.",
    tags: ["Cohort", "Coaching"],
    href: "#apply",
  },
  {
    key: "proximity",
    title: "Lead Proximity Initiative",
    blurb: "Short shadowing stints alongside active Leads in delivery.",
    tags: ["Shadow", "On-the-job"],
    href: "#journey",
  },
  {
    key: "bootcamp",
    title: "Leadership Bootcamp",
    blurb: "One sprint of focused practice on rituals, visibility, and flow.",
    tags: ["Sprint", "Rituals"],
    href: "#apply",
  },
];

const JOBS: Job[] = [
  { title: "Team Lead – DXB Studio", area: "Delivery", location: "DXB", tags: ["Sprint cadence", "1:1s"], href: "#apply" },
  { title: "Project Lead – Stream A", area: "Orchestration", location: "DXB/NBO", tags: ["OKRs", "Dependencies"], href: "#apply" },
  { title: "Culture Champion", area: "Community", location: "NBO", tags: ["Feedback", "Recognition"], href: "#apply" },
  { title: "Practice Coach – Data", area: "Practice", location: "DXB", tags: ["Quality", "Standards"], href: "#apply" },
];

const EVENTS: Event[] = [
  { title: "Leads Onboarding Session", date: "Mar 15, 2025", time: "2:00 PM", location: "Teams", href: "#" },
  { title: "Leadership Workshop: Facilitation", date: "Mar 22, 2025", time: "10:00 AM", location: "DXB Office", href: "#" },
  { title: "Community Leads Sync", date: "Mar 28, 2025", time: "3:00 PM", location: "Teams", href: "#" },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Al-Mansoori",
    role: "Squad Lead, DXB",
    quote: "Leading a squad has accelerated my growth and helped me see the bigger picture of delivery. The support from other Leads is incredible.",
  },
  {
    name: "James Kariuki",
    role: "Practice Lead, NBO",
    quote: "Being a Practice Lead lets me raise the bar for quality while mentoring others. It's the perfect balance of technical and leadership growth.",
  },
  {
    name: "Fatima Hassan",
    role: "Community Lead, DXB",
    quote: "Connecting people across locations and sharing knowledge has been incredibly rewarding. Every event and demo brings new insights.",
  },
];

// Quiz questions
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What energizes you most in your work?",
    options: [
      { value: "coach", label: "Helping others grow and succeed" },
      { value: "orchestrator", label: "Aligning teams and removing blockers" },
      { value: "connector", label: "Building bridges between people and ideas" },
    ],
  },
  {
    id: 2,
    question: "When a sprint goal is at risk, you:",
    options: [
      { value: "orchestrator", label: "Map dependencies and adjust scope quickly" },
      { value: "coach", label: "Coach the team to find solutions together" },
      { value: "connector", label: "Reach out to other teams for support" },
    ],
  },
  {
    id: 3,
    question: "Your ideal day includes:",
    options: [
      { value: "connector", label: "Facilitating knowledge sharing sessions" },
      { value: "coach", label: "1:1s and pair programming" },
      { value: "orchestrator", label: "Planning and tracking progress" },
    ],
  },
  {
    id: 4,
    question: "What's your superpower?",
    options: [
      { value: "coach", label: "Giving actionable feedback that helps people grow" },
      { value: "orchestrator", label: "Making complex work visible and manageable" },
      { value: "connector", label: "Creating spaces where ideas flow freely" },
    ],
  },
];

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  TrendingUp,
  Clock,
  MapPin,
  Users,
  Target,
  Workflow,
  AlertTriangle,
  ShieldCheck,
  Megaphone,
  Sparkles,
};

const WomenEntrepreneursLeadPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizStep, setQuizStep] = useState(0);
  const [quizResult, setQuizResult] = useState<"coach" | "orchestrator" | "connector" | null>(null);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [storyForm, setStoryForm] = useState({ name: "", role: "", story: "" });
  const quizContainerRef = React.useRef<HTMLDivElement>(null);

  // Set document title
  useEffect(() => {
    document.title = "Become a Lead | DQ Digital Workspace";
  }, []);

  // Scroll quiz to current question
  useEffect(() => {
    if (quizContainerRef.current && !quizResult) {
      const questionElement = quizContainerRef.current.children[quizStep] as HTMLElement;
      if (questionElement) {
        questionElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [quizStep, quizResult]);

  // Quiz handlers
  const handleQuizAnswer = (questionId: number, value: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      calculateQuizResult({ ...quizAnswers, [questionId]: value });
    }
  };

  const calculateQuizResult = (answers: Record<number, string>) => {
    const counts: Record<string, number> = { coach: 0, orchestrator: 0, connector: 0 };
    Object.values(answers).forEach((answer) => {
      if (answer in counts) counts[answer]++;
    });
    const maxCount = Math.max(...Object.values(counts));
    const result = Object.keys(counts).find((key) => counts[key] === maxCount) as "coach" | "orchestrator" | "connector";
    setQuizResult(result);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizStep(0);
    setQuizResult(null);
  };

  const getRecommendedPath = (style: string) => {
    if (style === "coach") return PATHS.find((p) => p.key === "practice") || PATHS[0];
    if (style === "orchestrator") return PATHS.find((p) => p.key === "stream") || PATHS[0];
    return PATHS.find((p) => p.key === "community") || PATHS[0];
  };

  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Story submitted:", storyForm);
    setStoryModalOpen(false);
    setStoryForm({ name: "", role: "", story: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <main className="flex-grow">
        {/* Hero Section */}
        <section id="hero" className="relative isolate grid h-[clamp(560px,70vh,740px)] min-h-[560px] place-items-center overflow-hidden bg-[#030F35] text-white scroll-mt-[72px]">
          <div className="absolute inset-0 -z-10">
            <img
              src="https://images.unsplash.com/photo-1583759604327-f9dcd23499d5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340"
              alt="Leadership"
              className="h-full w-full object-cover"
              style={{ objectPosition: "center top" }}
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(0deg,rgba(3,15,53,0.65)_0%,rgba(3,15,53,0.1)_100%)]"
              style={{ animation: "pulse-gradient 8s ease-in-out infinite alternate" }}
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-[1080px] flex-col items-center px-6 text-center sm:px-10 lg:px-12">
            <div className="flex w-full flex-col items-center gap-3 text-center md:gap-4">
              <h1
                className="font-serif text-4xl font-bold tracking-[0.04em] text-white sm:text-5xl lg:text-6xl"
                style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
              >
                <AnimatedText text="Become a Lead at DQ" gap="0.6rem" className="inline-block" />
              </h1>
              <FadeInUpOnScroll delay={0.1}>
                <p className="mx-auto mb-3 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg md:mb-4">
                  Guide squads, grow people, and accelerate value delivery across DQ.
                </p>
              </FadeInUpOnScroll>

              <StaggeredFadeIn
                staggerDelay={0.12}
                className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-3 md:gap-4"
              >
                {HERO_METRICS.map((metric) => {
                  const IconComponent = iconMap[metric.icon] || TrendingUp;
                  return (
                    <div
                      key={metric.label}
                      className="rounded-2xl bg-white/10 backdrop-blur ring-1 ring-white/15 px-4 py-2 md:px-5 md:py-2.5 hover:ring-white/25 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030F35]"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent size={16} className="text-white/90" />
                        <div className="text-xl md:text-2xl font-semibold tracking-tight text-white">
                          {metric.value}
                        </div>
                      </div>
                      <div className="text-[11px] md:text-xs uppercase tracking-[0.12em] text-white/80">
                        {metric.label}
                      </div>
                    </div>
                  );
                })}
              </StaggeredFadeIn>

              <StaggeredFadeIn staggerDelay={0.15} className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href="#apply"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("apply");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0B1C3A] shadow-[0_18px_45px_rgba(9,20,45,0.35)] transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030F35]"
                >
                  Apply to Become a
                </a>
                <a
                  href="#paths"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("paths");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-full border border-white/55 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(9,20,45,0.3)] transition hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#030F35]"
                >
                  Explore Leadership Paths
                </a>
              </StaggeredFadeIn>
            </div>
          </div>

          <style>{`
        @keyframes pulse-gradient {
          0% {
            opacity: 0.45;
          }
          50% {
            opacity: 0.65;
          }
          100% {
            opacity: 0.45;
          }
        }
      `}</style>
        </section>

        {/* What Leadership Means at DQ Section */}
        <LeadershipMeaningSection />

        {/* Leadership Growth Journey Section */}
        <LeadershipGrowthJourney />

        {/* Who Are You as a Leader? Section */}
        <LeaderPersonasSection />

        {/* Leadership Quiz Banner Section */}
        <LeadershipQuizBanner />

        {/* Leadership Paths Section */}
        <section id="paths" className="bg-[#F6FAFB] py-20 scroll-mt-[72px]" aria-labelledby="paths-heading">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-center sm:px-10 lg:px-12">
            <h2
              id="paths-heading"
              className="font-serif text-3xl font-bold tracking-[0.04em] text-[#030F35] sm:text-4xl"
              style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
            >
              Leadership Paths
            </h2>
            <p className="mx-auto max-w-2xl text-slate-600">
              Choose the path that fits your strengths. All roles start with a short shadow sprint and onboarding.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PATHS.map((path) => (
                <div
                  key={path.key}
                  className="flex flex-col rounded-2xl bg-white shadow-md ring-1 ring-black/5 p-6 hover:shadow-lg transition min-h-[390px]"
                >
                  <h3 className="text-xl font-bold text-[#030F35] mb-2">{path.title}</h3>
                  <p className="text-slate-600 mb-4 flex-1">{path.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {path.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check size={16} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={path.cta.href}
                    className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#030F35] px-4 text-sm font-semibold text-white hover:bg-[#0a1b4f] transition whitespace-nowrap"
                  >
                    {path.cta.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Principles Section */}
        <section id="principles" className="bg-gray-50 py-16 md:py-24 scroll-mt-[72px]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2
                className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.04em] text-[#030F35] mb-3"
                style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
              >
                Leadership Principles
              </h2>
              <p className="text-base md:text-lg max-w-[780px] mx-auto leading-relaxed text-slate-600">
                The mindset and habits we expect from every DQ Lead.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
              <div className="bg-white rounded-2xl shadow-md ring-1 ring-black/5 flex flex-col h-full p-8 md:p-10">
                <h3
                  className="font-serif text-2xl md:text-3xl font-bold tracking-[0.03em] text-[#030F35] mb-4 md:mb-6"
                  style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif', letterSpacing: "0.5px" }}
                >
                  Lead with Clarity
                </h3>
                <div className="flex-1 mb-6 space-y-3">
                  <p className="text-base md:text-lg leading-relaxed text-slate-700">
                    Help teams see priorities, outcomes, and the next right move.
                  </p>
                  <p className="text-base md:text-lg leading-relaxed text-slate-700">
                    Make work visible (boards, dashboards, brief updates).
                  </p>
                  <p className="text-base md:text-lg leading-relaxed text-slate-700">
                    Align OKRs, scope, and cadence; cut noise fast.
                  </p>
                </div>
                <div className="mt-auto">
                  <a
                    href="#capabilities"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#030F35] text-white font-semibold hover:bg-[#0a1b4f] transition"
                  >
                    View Role Expectations
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md ring-1 ring-black/5 flex flex-col h-full p-8 md:p-10">
                <h3
                  className="font-serif text-2xl md:text-3xl font-bold tracking-[0.03em] text-[#030F35] mb-4 md:mb-6"
                  style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif', letterSpacing: "0.5px" }}
                >
                  Grow People, Grow Value
                </h3>
                <div className="flex-1 mb-6 space-y-3">
                  <p className="text-base md:text-lg leading-relaxed text-slate-700">
                    Coach, unblock, and create conditions where work—and people—thrive.
                  </p>
                  <p className="text-base md:text-lg leading-relaxed text-slate-700">
                    Guard standards (DoR/DoD, quality gates) and feedback culture.
                  </p>
                  <p className="text-base md:text-lg leading-relaxed text-slate-700">
                    Communicate early; celebrate learning and progress.
                  </p>
                </div>
                <div className="mt-auto">
                  <a
                    href="#programs"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#030F35] text-white font-semibold hover:bg-[#0a1b4f] transition"
                  >
                    See Coaching Playbook
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quiz Section */}
        <section id="quiz" className="bg-white py-16 md:py-24 scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="text-center mb-12">
              <h2
                className="font-serif text-3xl md:text-4xl font-bold tracking-[0.04em] text-[#030F35] mb-3"
                style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
              >
                Who Are You as a Leader?
              </h2>
              <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-600">
                Answer a few quick questions to discover your leadership style and next step.
              </p>
            </div>

            {!quizResult ? (
              <div ref={quizContainerRef} className="overflow-x-auto snap-x snap-mandatory flex gap-4 pb-3">
                {QUIZ_QUESTIONS.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`min-w-[320px] md:min-w-[560px] snap-start rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5 ${
                      idx === quizStep ? "ring-2 ring-[#030F35]" : "opacity-50"
                    }`}
                  >
                    <h3 className="text-xl font-bold text-[#030F35] mb-4">Question {q.id}</h3>
                    <p className="text-lg text-slate-700 mb-6">{q.question}</p>
                    <div className="space-y-3">
                      {q.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleQuizAnswer(q.id, option.value)}
                          className="w-full text-left px-4 py-3 rounded-lg border-2 border-slate-200 hover:border-[#030F35] hover:bg-slate-50 transition text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#030F35]"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-black/5 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-[#030F35] mb-4">Your Leadership Style</h3>
                <div className="text-3xl font-bold text-[#030F35] mb-2 capitalize">{quizResult}</div>
                <p className="text-slate-600 mb-6">
                  {quizResult === "coach"
                    ? "You excel at developing people and creating growth opportunities. Your strength is in giving feedback and building capability."
                    : quizResult === "orchestrator"
                    ? "You're great at aligning teams, managing dependencies, and keeping delivery on track. Your strength is in making complex work manageable."
                    : "You thrive on connecting people and ideas. Your strength is in facilitating knowledge sharing and building bridges across teams."}
                </p>
                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Recommended Path:</p>
                  <p className="text-lg font-bold text-[#030F35]">{getRecommendedPath(quizResult).title}</p>
                </div>
                <div className="flex gap-3">
                  <a
                    href="#apply"
                    className="inline-flex items-center justify-center rounded-lg bg-[#030F35] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a1b4f] transition"
                  >
                    Apply Now
                  </a>
                  <a
                    href="#stories"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-[#030F35] px-6 py-3 text-sm font-semibold text-[#030F35] hover:bg-slate-50 transition"
                  >
                    Find a Mentor
                  </a>
                </div>
                <button
                  onClick={resetQuiz}
                  className="mt-4 text-sm text-slate-600 hover:text-[#030F35] underline"
                >
                  Retake Quiz
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Voices That Lead Section */}
        <section id="stories" className="bg-[#F6FAFB] py-16 md:py-24 scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="text-center mb-12">
              <h2
                className="font-serif text-3xl md:text-4xl font-bold tracking-[0.04em] text-[#030F35] mb-3"
                style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
              >
                Voices That Lead
              </h2>
              <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-600">
                Share your leadership moments and learn from others.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-6">
              {TESTIMONIALS.map((testimonial, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5"
                >
                  <p className="text-slate-700 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#030F35]">{testimonial.name}</p>
                      <p className="text-sm text-slate-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5 text-center">
              <h3 className="text-xl font-bold text-[#030F35] mb-2">Share Your Story</h3>
              <p className="text-slate-600 mb-4">Help others learn from your leadership journey.</p>
              <button
                onClick={() => setStoryModalOpen(true)}
                className="inline-flex items-center justify-center rounded-lg bg-[#030F35] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a1b4f] transition"
              >
                Share Your Story
              </button>
            </div>
          </div>

          {/* Story Modal */}
          {storyModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setStoryModalOpen(false)}>
              <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-[#030F35]">Share Your Story</h3>
                  <button onClick={() => setStoryModalOpen(false)} className="text-slate-600 hover:text-[#030F35]">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleStorySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={storyForm.name}
                      onChange={(e) => setStoryForm({ ...storyForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#030F35] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={storyForm.role}
                      onChange={(e) => setStoryForm({ ...storyForm, role: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#030F35] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Story</label>
                    <textarea
                      value={storyForm.story}
                      onChange={(e) => setStoryForm({ ...storyForm, story: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#030F35] focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center rounded-lg bg-[#030F35] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a1b4f] transition"
                    >
                      Submit Story
                    </button>
                    <button
                      type="button"
                      onClick={() => setStoryModalOpen(false)}
                      className="px-6 py-3 text-sm font-semibold text-slate-600 hover:text-[#030F35]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>

        {/* Ideas That Move Section */}
        <section id="media" className="bg-white py-16 md:py-24 scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="text-center mb-12">
              <h2
                className="font-serif text-3xl md:text-4xl font-bold tracking-[0.04em] text-[#030F35] mb-3"
                style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
              >
                Ideas That Move
              </h2>
              <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-600">
                Articles and resources on leading at DQ. Videos and podcasts coming soon.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="rounded-2xl bg-white shadow-md ring-1 ring-black/5 overflow-hidden">
                  <div className="h-48 bg-slate-200"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#030F35] mb-2">Leadership Article {idx}</h3>
                    <p className="text-slate-600 mb-4 line-clamp-2">
                      Learn how effective Leads drive outcomes and build high-performing teams through clarity and coaching.
                    </p>
                    <a
                      href="#"
                      className="text-sm font-semibold text-[#030F35] hover:underline inline-flex items-center gap-1"
                    >
                      Read in Media Marketplace
                      <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capability Playbook Section */}
        <section id="capabilities" className="bg-gray-50 py-16 md:py-24 scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="text-center mb-12">
              <h2
                className="font-serif text-3xl md:text-4xl font-bold tracking-[0.04em] text-[#030F35] mb-3"
                style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
              >
                Capability Playbook
              </h2>
              <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-600">
                Seven capabilities every DQ Lead demonstrates in practice.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CAP_TILES.map((cap) => {
                const IconComponent = iconMap[cap.icon] || Users;
                return (
                  <div
                    key={cap.key}
                    className="group rounded-2xl bg-white ring-1 ring-black/5 shadow-sm hover:shadow-md transition p-5 md:p-6 flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <IconComponent size={24} className="text-[#030F35]" />
                      <h3 className="text-lg font-bold text-[#030F35]">{cap.title}</h3>
                    </div>
                    <p className="text-slate-600 mb-4 flex-1">{cap.blurb}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cap.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href="#journey"
                      className="text-sm font-semibold text-[#030F35] hover:underline inline-flex items-center gap-1"
                    >
                      See examples
                      <ArrowRight size={16} />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Leadership Impact Dashboard Section */}
        <section id="impact" className="bg-white py-16 md:py-24 scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="text-center mb-12">
              <h2
                className="font-serif text-3xl md:text-4xl font-bold tracking-[0.04em] text-[#030F35] mb-3"
                style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
              >
                Leadership Impact Dashboard
              </h2>
              <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-600">
                Data-driven signals of how new Leads accelerate delivery, collaboration, and clarity within their teams.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {IMPACT_METRICS.map((metric) => (
                <div
                  key={metric.key}
                  className="rounded-xl bg-white ring-1 ring-black/5 shadow-sm p-5 md:p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-600">{metric.title}</div>
                    <div className="text-2xl md:text-3xl font-semibold text-[#030F35] mt-1">{metric.value}</div>
                    <div className="text-xs text-slate-500 mt-2">{metric.desc}</div>
                  </div>
                  <div className="mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
                    {metric.trend}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="#programs"
                className="inline-flex items-center justify-center rounded-lg bg-[#030F35] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a1b4f] transition"
              >
                See the Metrics Playbook
              </a>
            </div>
          </div>
        </section>

        {/* Lead Toolkit Section */}
        <section id="toolkit" className="bg-gray-50 py-16 md:py-24 scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="text-center mb-12">
              <h2
                className="font-serif text-3xl md:text-4xl font-bold tracking-[0.04em] text-[#030F35] mb-3"
                style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
              >
                Lead Toolkit & Operating Rhythm
              </h2>
              <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-600">
                Explore the core rhythms and tools that enable every DQ Lead to guide delivery, collaboration, and growth.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5">
                <h3 className="text-xl font-bold text-[#030F35] mb-4">Rhythm & Ceremonies</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Daily Stand-up</strong> – Quick pulse on priorities, blockers, and flow.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Sprint Planning</strong> – Align on outcomes and scope for the iteration.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Review & Demo</strong> – Showcase progress and gather feedback.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Retrospective</strong> – Reflect, improve, and reset the cadence.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Risk Review</strong> – Surface issues early and plan mitigations.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>1:1 Coaching Sessions</strong> – Focus on growth and feedback.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Showcase or Sync</strong> – Share learnings across squads and practices.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5">
                <h3 className="text-xl font-bold text-[#030F35] mb-4">Toolkit & Artifacts</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Boards & Dashboards</strong> – Track progress, WIP, and flow metrics.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>OKRs</strong> – Keep focus on measurable outcomes.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Story Maps</strong> – Visualize journeys and work slices.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Risk Log</strong> – Maintain transparency and accountability.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Definitions (DoR / DoD)</strong> – Ensure shared quality standards.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Playbooks & Checklists</strong> – Follow proven DQ practices.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={20} className="text-[#030F35] mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">
                      <strong>Insights Reports</strong> – Share data and impact summaries.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              <a
                href="#programs"
                className="inline-flex items-center justify-center rounded-lg bg-[#030F35] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a1b4f] transition"
              >
                Open Lead Toolkit Repository
                <ArrowRight size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section id="programs" className="bg-white py-16 md:py-24 scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="text-center mb-12">
              <h2
                className="font-serif text-3xl md:text-4xl font-bold tracking-[0.04em] text-[#030F35] mb-3"
                style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
              >
                Programs That Build Leaders
              </h2>
              <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-600">
                Pathways to practice leadership with support and structure.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {PROGRAMS.map((program) => (
                <div key={program.key} className="rounded-2xl bg-white shadow-md ring-1 ring-black/5 overflow-hidden">
                  <div className="h-48 bg-slate-200"></div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#030F35] mb-2">{program.title}</h3>
                    <p className="text-slate-600 mb-4">{program.blurb}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {program.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={program.href}
                      className="inline-flex items-center justify-center rounded-lg bg-[#030F35] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a1b4f] transition w-full"
                    >
                      View Program
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Opportunities Section */}
        <section id="jobs" className="bg-[#F6FAFB] py-16 md:py-24 scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="text-center mb-12">
              <h2
                className="font-serif text-3xl md:text-4xl font-bold tracking-[0.04em] text-[#030F35] mb-3"
                style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
              >
                Opportunities
              </h2>
              <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-600">
                Open roles and pathways to step in as a Lead.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {JOBS.map((job, idx) => (
                <div key={idx} className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5">
                  <h3 className="text-xl font-bold text-[#030F35] mb-2">{job.title}</h3>
                  <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
                    <span>{job.area}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                  </div>
                  <p className="text-slate-600 mb-4">
                    Focus on {job.tags.join(", ").toLowerCase()} to drive outcomes.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={job.href}
                      className="flex-1 inline-flex items-center justify-center rounded-lg bg-[#030F35] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a1b4f] transition"
                    >
                      Apply
                    </a>
                    <a
                      href="#journey"
                      className="px-4 py-2 text-sm font-semibold text-[#030F35] hover:underline"
                    >
                      Learn more
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events & FAQ Section */}
        <section id="events" className="bg-white py-16 md:py-24 scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="text-center mb-12">
              <h2
                className="font-serif text-3xl md:text-4xl font-bold tracking-[0.04em] text-[#030F35] mb-3"
                style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
              >
                Upcoming Events
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-16">
              {EVENTS.map((event, idx) => (
                <div key={idx} className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5">
                  <h3 className="text-lg font-bold text-[#030F35] mb-2">{event.title}</h3>
                  <div className="text-sm text-slate-600 space-y-1 mb-4">
                    <p>{event.date}</p>
                    <p>{event.time}</p>
                    <p>{event.location}</p>
                  </div>
                  <a
                    href={event.href}
                    className="text-sm font-semibold text-[#030F35] hover:underline inline-flex items-center gap-1"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-gray-50 py-16 md:py-24 scroll-mt-[72px]">
          <div className="mx-auto max-w-4xl px-6 md:px-8">
            <div className="text-center mb-12">
              <h2
                className="font-serif text-3xl md:text-4xl font-bold tracking-[0.04em] text-[#030F35] mb-3"
                style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "Who can apply to become a Lead?",
                  a: "Any DQ associate with experience in delivery, coaching, or facilitation can apply. We look for people who demonstrate leadership potential and a commitment to growing others.",
                },
                {
                  q: "How much time does a Lead role take?",
                  a: "Most Lead roles require 20–30% of your time alongside your primary role. The exact commitment varies by path and initiative scope.",
                },
                {
                  q: "Do I keep my current role?",
                  a: "Yes, Lead roles are typically additive to your existing responsibilities. You'll work with your manager to balance both roles effectively.",
                },
                {
                  q: "Can I apply from different locations (DXB/NBO)?",
                  a: "Yes, we support Leads across both DXB and NBO locations. Some roles may be location-specific, but many can be done remotely or with travel.",
                },
                {
                  q: "What if I'm not selected this time?",
                  a: "We encourage you to seek feedback, continue developing your skills, and apply again in future cycles. Many successful Leads applied multiple times.",
                },
                {
                  q: "How are Leads evaluated over time?",
                  a: "Leads receive regular feedback through 1:1s, peer reviews, and impact metrics. We focus on growth and continuous improvement rather than punitive evaluation.",
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5"
                >
                  <summary className="font-semibold text-[#030F35] cursor-pointer list-none">
                    <span className="flex items-center justify-between">
                      {faq.q}
                      <ChevronRight size={20} className="text-slate-400" />
                    </span>
                  </summary>
                  <p className="mt-4 text-slate-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Application Journey Section */}
        <section id="journey" className="bg-white py-16 md:py-24 scroll-mt-[72px]">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="text-center mb-12">
              <h2
                className="font-serif text-3xl md:text-4xl font-bold tracking-[0.04em] text-[#030F35] mb-3"
                style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
              >
                Your Application Journey
              </h2>
              <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-600">
                A simple path from interest to onboarding.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              {[
                { step: "1", title: "Prepare", desc: "Explore paths, talk to your manager." },
                { step: "2", title: "Submit", desc: "Fill the Lead application form." },
                { step: "3", title: "Screen", desc: "Alignment chat with a Lead or panel." },
                { step: "4", title: "Shadow Sprint", desc: "1–2 weeks of shadowing and practice." },
                { step: "5", title: "Decision & Onboarding", desc: "Confirmation, goals, onboarding sprint." },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#030F35] text-white flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-[#030F35] mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="#apply"
                className="inline-flex items-center justify-center rounded-lg bg-[#030F35] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a1b4f] transition"
              >
                Open Application Form
                <ArrowRight size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </section>

        {/* Footer CTA & Apply Anchor */}
        <div id="apply" className="h-0 w-0" aria-hidden="true" />
        <section className="bg-gradient-to-r from-[#030F35] to-[#0a1b4f] py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
            <h2
              className="font-serif text-3xl md:text-4xl font-bold tracking-[0.04em] text-white mb-3"
              style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
            >
              Ready to Begin?
            </h2>
            <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto">
              Submit your application; we'll respond within one sprint.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#030F35] shadow-lg transition hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Apply to Become a Lead
              </a>
              <a
                href="#stories"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/55 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Talk to a Lead
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default WomenEntrepreneursLeadPage;
