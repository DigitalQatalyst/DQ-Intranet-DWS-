<<<<<<< ours
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  FileText,
  LifeBuoy,
  MessageCircle,
  MessageCircleQuestion,
  Sparkles,
  Target,
  User,
  UserCog,
  Users,
} from "lucide-react";

type StepKey = "welcome" | "profile" | "tools" | "firstTask";
type ChecklistKey = "watch" | "profile" | "join" | "lms" | "ship";

// --- Toggle this to match EJP strictly (no pre-footer) ---
const SHOW_MOMENTUM = false;

interface OnboardingProgress {
  steps: Record<StepKey, boolean>;
  checklist: Record<ChecklistKey, boolean>;
  selected_template: string | null;
  percent: number;
}

interface StepCard {
  key: StepKey;
  stepNumber: string;
  title: string;
  description: string;
  bullets: string[];
  ctaPath: string;
  icon: React.ElementType;
}

interface TeamCard {
  title: string;
  description: string;
  ctaLabel: string;
  icon: React.ElementType;
  action: () => void;
}

interface FirstTaskOption {
  id: string;
  title: string;
  description: string;
  ctaPath: string;
  icon: React.ElementType;
}

interface SectionHeaderProps {
  id: string;
  title: string;
  description: string;
  eyebrow?: string;
}

const STORAGE_KEY = "dq_onboarding_progress";

const defaultProgress: OnboardingProgress = {
  steps: { welcome: false, profile: false, tools: false, firstTask: false },
  checklist: { watch: false, profile: false, join: false, lms: false, ship: false },
  selected_template: null,
  percent: 0,
};

const calculatePercent = (data: OnboardingProgress) => {
  const completedSteps = Object.values(data.steps).filter(Boolean).length;
  const completedChecklist = Object.values(data.checklist).filter(Boolean).length;
  const totalItems = Object.keys(data.steps).length + Object.keys(data.checklist).length;
  return totalItems === 0 ? 0 : Math.round(((completedSteps + completedChecklist) / totalItems) * 100);
};

const loadStoredProgress = (): OnboardingProgress => {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    const parsed = JSON.parse(stored) as Partial<OnboardingProgress>;
    const merged: OnboardingProgress = {
      steps: { ...defaultProgress.steps, ...(parsed.steps || {}) },
      checklist: { ...defaultProgress.checklist, ...(parsed.checklist || {}) },
      selected_template: parsed.selected_template ?? defaultProgress.selected_template,
      percent: typeof parsed.percent === "number" ? parsed.percent : defaultProgress.percent,
    };
    merged.percent = calculatePercent(merged);
    return merged;
  } catch {
    return defaultProgress;
  }
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ id, title, description, eyebrow }) => (
  <div className="space-y-2">
    {eyebrow ? (
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1A2E6E]">{eyebrow}</p>
    ) : null}
    <h2 id={id} className="text-2xl md:text-3xl font-semibold tracking-tight text-[#030F35]">
      {title}
    </h2>
    <p className="text-base leading-relaxed text-slate-600">{description}</p>
  </div>
);

const stepCards: StepCard[] = [
  {
    key: "welcome",
    stepNumber: "Step 1",
    title: "Welcome to DQ",
    description: "Get oriented with DQ’s purpose, values, and the teams you’ll collaborate with.",
    bullets: ['Watch the 2-min "Why DQ" intro', "Meet your Chapter & Squad", 'Explore the "How We Deliver" guide'],
    ctaPath: "/onboarding/welcome",
    icon: Sparkles,
  },
  {
    key: "profile",
    stepNumber: "Step 2",
    title: "Set Up Your Profile",
    description: "Make it easy for teammates to find and collaborate with you.",
    bullets: ["Add your role & skills", "Choose notifications", "Link GitHub, SharePoint, or Email"],
    ctaPath: "/onboarding/profile",
    icon: UserCog,
  },
  {
    key: "tools",
    stepNumber: "Step 3",
    title: "Explore Tools & Marketplaces",
    description: "Access all the essentials that power your daily work — from learning to requests.",
    bullets: ["Services & Requests", "DQ LMS Learning", "Communities & Surveys"],
    ctaPath: "/onboarding/tools",
    icon: Compass,
  },
  {
    key: "firstTask",
    stepNumber: "Step 4",
    title: "Complete Your First Task",
    description: "Jump into a guided task that helps you create early value with confidence.",
    bullets: ["Pick a template", "Follow 3 simple steps", "Share your outcome"],
    ctaPath: "/onboarding/first-task",
    icon: CheckCircle2,
  },
];

const checklistItems: { key: ChecklistKey; label: string }[] = [
  { key: "watch", label: 'Watch "Why DQ" orientation' },
  { key: "profile", label: "Complete your profile & notifications" },
  { key: "join", label: "Join your Chapter & Squad channels" },
  { key: "lms", label: "Enroll in your first LMS learning path" },
  { key: "ship", label: 'Ship a "First Task" and share your progress' },
];

const firstTaskOptions: FirstTaskOption[] = [
  {
    id: "tools",
    title: "Set up your working tools",
    description: "Get access to email, repositories, and daily essentials so you can collaborate fast.",
    ctaPath: "/onboarding/first-task?template=tools",
    icon: Target,
  },
  {
    id: "improve-page",
    title: "Improve one page",
    description: "Refine copy, spacing, or layout on a Digital Workspace surface to make it clearer.",
    ctaPath: "/onboarding/first-task?template=page",
    icon: FileText,
  },
  {
    id: "micro-guide",
    title: "Create a micro-guide",
    description: "Capture a 1-pager that helps others ramp up faster on a shared tool or workflow.",
    ctaPath: "/onboarding/first-task?template=guide",
    icon: MessageCircle,
  },
];

const completionActions = [
  { label: "Open DQ Workspace", path: "/workspace" },
  { label: "Plan Next 30 Days", path: "/dashboard" },
  { label: "Browse LMS Paths", path: "/marketplace/courses" },
];

const OnboardingFlowsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState<OnboardingProgress>(() => loadStoredProgress());
  const [displayedPercent, setDisplayedPercent] = useState(progress.percent);
  const navigate = useNavigate();
  const stepsSectionRef = useRef<HTMLElement | null>(null);
  const faqSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    setDisplayedPercent(progress.percent);
  }, [progress.percent]);

  const isComplete = progress.percent >= 100;

  const handleStartJourney = () => {
    // EJP behavior: remain on page and smooth scroll (no route change)
    stepsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleStepNavigate = (stepKey: StepKey, path: string) => {
    setProgress((prev) => {
      const updated: OnboardingProgress = { ...prev, steps: { ...prev.steps, [stepKey]: true } };
      updated.percent = calculatePercent(updated);
      return updated;
    });
    navigate(path);
  };

  const handleChecklistToggle = (itemKey: ChecklistKey) => {
    setProgress((prev) => {
      const updated: OnboardingProgress = {
        ...prev,
        checklist: { ...prev.checklist, [itemKey]: !prev.checklist[itemKey] },
      };
      updated.percent = calculatePercent(updated);
      return updated;
    });
  };

  const handleMarkAllDone = () => {
    setProgress((prev) => ({
      steps: { welcome: true, profile: true, tools: true, firstTask: true },
      checklist: { watch: true, profile: true, join: true, lms: true, ship: true },
      selected_template: prev.selected_template,
      percent: 100,
    }));
  };

  const handleTemplateSelect = (option: FirstTaskOption) => {
    setProgress((prev) => {
      const updated: OnboardingProgress = {
        ...prev,
        steps: { ...prev.steps, firstTask: true },
        selected_template: option.id,
      };
      updated.percent = calculatePercent(updated);
      return updated;
    });
    navigate(option.ctaPath);
  };

  const handleSupportNavigation = (path: string) => navigate(path);

  const resetProgress = () => setProgress(defaultProgress);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <main className="flex-1" aria-labelledby="hero-heading">
        {/* EJP compact header */}
        <section className="bg-[#F8FAFC] border-b border-slate-200/70 py-8 md:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="rounded-md px-1 py-0.5 text-slate-500 transition hover:text-[#030F35] focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40"
                  >
                    Home
                  </button>
                </li>
                <li className="text-slate-400">/</li>
                <li className="text-slate-700 font-medium">Onboarding</li>
              </ol>
            </nav>

            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3 md:max-w-3xl">
                <h1 id="hero-heading" className="text-3xl md:text-4xl font-bold tracking-tight text-[#030F35]">
                  DQ Onboarding Flows
                </h1>
                <p className="text-base leading-relaxed text-slate-600">
                  Follow guided steps to connect with DQ’s culture, set up your essentials, and deliver your first wins with confidence.
                </p>

                {isComplete ? (
                  <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-[#030F35]">
                      🎉 Onboarding complete — great start! What will you improve next?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {completionActions.map((action) => (
                        <button
                          key={action.label}
                          type="button"
                          onClick={() => navigate(action.path)}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#030F35] transition hover:border-[#FB5535]/60 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40"
                        >
                          {action.label}
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={handleStartJourney}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FB5535] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40"
                  aria-label="Start my onboarding journey"
                >
                  Start My Journey
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2) Progress band */}
        <section aria-labelledby="progress-heading" className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900" id="progress-heading">
                    {displayedPercent}% complete
                  </p>
                  <p className="text-xs text-slate-500">Progress saves automatically to this device.</p>
                </div>
                <button
                  type="button"
                  onClick={resetProgress}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#FB5535] transition hover:text-[#d9442a] focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40 md:w-auto"
                  aria-label="Reset onboarding progress"
                >
                  Reset Progress
                </button>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#FB5535] transition-all duration-500 ease-out"
                  style={{ width: `${displayedPercent}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3) Story strip */}
        <section aria-labelledby="story-heading" className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <SectionHeader
              id="story-heading"
              title="Arrive. Set up. Explore. Win."
              description="Every DQ associate begins here — discovering purpose, tools, and confidence to deliver their first impact."
            />
          </div>
        </section>

        {/* 4) Step grid */}
        <section aria-labelledby="steps-heading" className="py-10 md:py-12" ref={stepsSectionRef} id="steps">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <SectionHeader
              id="steps-heading"
              eyebrow="Journey"
              title="Four Core Onboarding Stages"
              description="Move through each stage to get oriented, personalize your space, master the tools, and deliver your first win."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {stepCards.map((step) => {
                const Icon = step.icon;
                const isDone = progress.steps[step.key];
                return (
                  <div key={step.key} className="flex min-h-[240px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">{step.stepNumber}</span>
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#FB5535]">
                            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                            Saved
                          </span>
                        ) : null}
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#030F35]/10 text-[#030F35]">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg md:text-xl font-semibold text-[#030F35]">{step.title}</h3>
                        <p className="text-sm md:text-base leading-relaxed text-slate-600">{step.description}</p>
                      </div>
                      <ul className="space-y-2 text-sm text-slate-600">
                        {step.bullets.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-[#FB5535]" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-auto pt-4">
                      <button
                        type="button"
                        onClick={() => handleStepNavigate(step.key, step.ctaPath)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FB5535] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40 md:w-auto"
                        aria-label={`Continue to ${step.title}`}
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5) Meet your team */}
        <section aria-labelledby="team-heading" className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <SectionHeader
              id="team-heading"
              eyebrow="Support Network"
              title="Meet Your Team"
              description="Know who to lean on — your manager, your chapter, and your squad."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {[
                {
                  title: "Your Manager",
                  description: "Understand expectations, priorities, and how success is measured.",
                  ctaLabel: "View Profile",
                  icon: User,
                  action: () => handleSupportNavigation("/profile/manager"),
                },
                {
                  title: "Your Chapter",
                  description: "Connect with peers who share your discipline and craft.",
                  ctaLabel: "Open Channel",
                  icon: Users,
                  action: () => handleSupportNavigation("/communities"),
                },
                {
                  title: "Your Squad",
                  description: "Stay aligned with the team you deliver alongside every day.",
                  ctaLabel: "See Board",
                  icon: Target,
                  action: () => handleSupportNavigation("/squads/board"),
                },
                {
                  title: "Mentor / Coach",
                  description: "Lean on a guide who accelerates your learning curve.",
                  ctaLabel: "Request Intro",
                  icon: LifeBuoy,
                  action: () => handleSupportNavigation("/mentorship/request"),
                },
              ].map((card: TeamCard) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-xl">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#030F35]/10 text-[#030F35]">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg md:text-xl font-semibold text-[#030F35]">{card.title}</h3>
                      <p className="text-sm md:text-base leading-relaxed text-slate-600">{card.description}</p>
                    </div>
                    <div className="mt-auto pt-4">
                      <button
                        type="button"
                        onClick={card.action}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#030F35] transition hover:border-[#FB5535]/60 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40 md:w-auto"
                        aria-label={card.ctaLabel}
                      >
                        {card.ctaLabel}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6) First-week checklist */}
        <section aria-labelledby="checklist-heading" className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <SectionHeader
                id="checklist-heading"
                eyebrow="Week One"
                title="First Week Checklist"
                description="Complete these essentials to finish onboarding and get ready for your first impact."
              />
              <button
                type="button"
                onClick={handleMarkAllDone}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#030F35] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40 md:w-auto"
              >
                Mark All Done
              </button>
            </div>
            <div className="space-y-4">
              {checklistItems.map((item) => (
                <label
                  key={item.key}
                  htmlFor={`checklist-${item.key}`}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:border-[#FB5535]/50 md:px-6"
                >
                  <input
                    id={`checklist-${item.key}`}
                    type="checkbox"
                    checked={progress.checklist[item.key]}
                    onChange={() => handleChecklistToggle(item.key)}
                    className="h-5 w-5 rounded-md border-slate-300 text-[#FB5535] focus:ring-[#FB5535]/40"
                    aria-label={item.label}
                  />
                  <span className="flex-1 text-sm md:text-base font-medium text-[#030F35]">{item.label}</span>
                  {progress.checklist[item.key] ? <CheckCircle2 className="h-5 w-5 text-[#FB5535]" aria-hidden="true" /> : null}
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* 7) Guided first task */}
        <section aria-labelledby="templates-heading" className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <SectionHeader id="templates-heading" eyebrow="Deliver" title="Ship a Small Win" description="Start small. Deliver something visible in your first week." />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
              {firstTaskOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = progress.selected_template === option.id;
                return (
                  <div key={option.id} className={`flex min-h-[240px] flex-col rounded-2xl border p-6 shadow-lg ${isSelected ? "border-[#FB5535]" : "border-slate-200"}`}>
                    <div className="space-y-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#030F35]/10 text-[#030F35]">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg md:text-xl font-semibold text-[#030F35]">{option.title}</h3>
                        <p className="text-sm md:text-base leading-relaxed text-slate-600">{option.description}</p>
                      </div>
                    </div>
                    <div className="mt-auto pt-4">
                      <button
                        type="button"
                        onClick={() => handleTemplateSelect(option)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FB5535] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40 md:w-auto"
                        aria-label={`Use template: ${option.title}`}
                      >
                        Choose Template
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 8) Help & support */}
        <section aria-labelledby="support-heading" className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <SectionHeader id="support-heading" eyebrow="Need Assistance" title="Stuck? Get Help Fast" description="Reach the right teams and communities instantly so momentum never slows down." />
            <div className="flex flex-wrap justify-start gap-3 md:justify-between">
              {[
                { label: "Request Support", icon: LifeBuoy, action: () => handleSupportNavigation("/requests/new") },
                { label: "Ask in Communities", icon: MessageCircle, action: () => handleSupportNavigation("/communities") },
                { label: "Message Your Manager", icon: User, action: () => handleSupportNavigation("/profile/manager") },
                { label: "Onboarding FAQ", icon: MessageCircleQuestion, action: () => faqSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }) },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.action}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#030F35] transition hover:border-[#FB5535]/60 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40"
                  >
                    <Icon className="h-5 w-5 text-[#FB5535]" aria-hidden="true" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 9) FAQ */}
        <section aria-labelledby="faq-heading" className="py-10 md:py-12" ref={faqSectionRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
            <SectionHeader id="faq-heading" eyebrow="Answers" title="Onboarding FAQ" description="Quick guidance for the most common questions during your first week." />
            <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-8">
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-semibold text-[#030F35]">How long does onboarding take?</h3>
                <p className="text-base leading-relaxed text-slate-600">Most associates complete core steps in one day; the checklist runs through week one.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-semibold text-[#030F35]">Where do I track progress?</h3>
                <p className="text-base leading-relaxed text-slate-600">Use the progress bar above or visit your profile timeline.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-semibold text-[#030F35]">Who approves my access?</h3>
                <p className="text-base leading-relaxed text-slate-600">Your manager and Services &amp; Requests team handle it automatically once submitted.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 10) Momentum (pre-footer) — optional to match EJP */}
        {SHOW_MOMENTUM && (
          <section aria-labelledby="momentum-heading" className="bg-[#030F35] py-16 md:py-20 text-white border-t border-[#1A2E6E]/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Keep Momentum</p>
                <h2 id="momentum-heading" className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Continue Building Impact
                </h2>
                <p className="text-base leading-relaxed text-white/80">
                  Keep your journey going with these guides and feedback loops.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                {[
                  { label: "DQ Governance & Guidelines", path: "/governance" },
                  { label: "Security & Privacy Basics", path: "/security" },
                  { label: "Performance & Feedback", path: "/performance" },
                  { label: "Submit Improvement Idea", path: "/improvements/new" },
                ].map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => navigate(link.path)}
                    className="inline-flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-left text-sm font-semibold text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
=======
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FadeInUpOnScroll } from "../components/AnimationUtils";
import { Button } from "../components/Button";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Filter,
  ListChecks,
  Search,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import type {
  FlowFormat,
  FlowPhase,
  FlowPopularity,
  OnboardingFlow,
  OnboardingFlowStep,
} from "../data/onboardingFlows";
import { ONBOARDING_FLOWS } from "../data/onboardingFlows";

type FilterKey = "phase" | "role" | "time" | "format" | "popularity";

type FilterState = {
  phase: FlowPhase[];
  role: string[];
  time: string[];
  format: FlowFormat[];
  popularity: FlowPopularity[];
};

type FlowProgressState = Record<string, Record<string, boolean>>;

type ModalSize = "md" | "lg";

const FILTER_STORAGE_KEY = "dws_onboarding_filters";
const PROGRESS_STORAGE_KEY = "dws_onboarding_progress";
const DEBOUNCE_MS = 250;

const phaseOptions: FlowPhase[] = ["Discover", "Set Up", "Connect", "Grow"];
const roleOptions = ["Engineering", "Product", "Design", "Marketing", "Operations"];
const timeOptions = ["<15m", "15–30m", "30–60m", ">60m"];
const formatOptions: FlowFormat[] = ["Checklist", "Interactive", "Video", "Guide"];
const popularityOptions: FlowPopularity[] = ["Most used", "New"];

const defaultFilters: FilterState = {
  phase: [],
  role: [],
  time: [],
  format: [],
  popularity: [],
};

const loadFilterState = (): FilterState => {
  if (typeof window === "undefined") return defaultFilters;
  try {
    const stored = window.localStorage.getItem(FILTER_STORAGE_KEY);
    if (!stored) return defaultFilters;
    const parsed = JSON.parse(stored) as Partial<FilterState>;
    return {
      phase: parsed.phase ?? [],
      role: parsed.role ?? [],
      time: parsed.time ?? [],
      format: parsed.format ?? [],
      popularity: parsed.popularity ?? [],
    };
  } catch {
    return defaultFilters;
  }
};

const saveFilterState = (state: FilterState) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(state));
};

const loadProgressState = (): FlowProgressState => {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored) as FlowProgressState;
  } catch {
    return {};
  }
};

const saveProgressState = (state: FlowProgressState) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
};

const calculateFlowCompletion = (flow: OnboardingFlow, progress: FlowProgressState) => {
  const steps = flow.steps.length;
  if (steps === 0) return 0;
  const flowProgress = progress[flow.id] ?? {};
  const completed = flow.steps.filter((step) => flowProgress[step.id]).length;
  return Math.round((completed / steps) * 100);
};

const filterFlowByTime = (flow: OnboardingFlow, filters: string[]) => {
  if (filters.length === 0) return true;
  return filters.some((token) => {
    switch (token) {
      case "<15m":
        return flow.time < 15;
      case "15–30m":
        return flow.time >= 15 && flow.time <= 30;
      case "30–60m":
        return flow.time > 30 && flow.time <= 60;
      case ">60m":
        return flow.time > 60;
      default:
        return false;
    }
  });
};

const ModalShell: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: ModalSize;
  children: ReactNode;
}> = ({ open, onClose, title, subtitle, size = "md", children }) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocused.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.classList.add("overflow-hidden");
    const timer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(timer);
      lastFocused.current?.focus();
    };
  }, [open, onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  if (!open) return null;

  const maxWidth = size === "lg" ? "max-w-4xl" : "max-w-2xl";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 sm:px-6"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div
        ref={dialogRef}
        className={`relative z-10 w-full ${maxWidth} overflow-hidden rounded-3xl bg-white shadow-[0_30px_100px_rgba(3,15,53,0.3)]`}
      >
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
          <div>
            <h3 className="text-xl font-semibold text-[#030F35] sm:text-2xl">{title}</h3>
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 p-2 text-[#030F35] transition hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6 sm:px-8">{children}</div>
      </div>
    </div>
  );
};

const FilterCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, checked, onChange }) => (
  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-[#030F35] transition hover:border-[#FB5535]/50">
    <span>{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-slate-300 text-[#FB5535] focus:ring-[#FB5535]"
    />
  </label>
);

const FlowCardSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="h-5 w-24 rounded-full bg-slate-200" />
    <div className="mt-4 h-5 w-48 rounded bg-slate-200" />
    <div className="mt-2 h-4 w-full rounded bg-slate-200" />
    <div className="mt-1 h-4 w-5/6 rounded bg-slate-200" />
    <div className="mt-6 h-4 w-32 rounded bg-slate-200" />
    <div className="mt-6 flex gap-3">
      <div className="h-10 flex-1 rounded-xl bg-slate-200" />
      <div className="h-10 flex-1 rounded-xl bg-slate-100" />
    </div>
  </div>
);

const OnboardingFlowsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => {
    const stored = loadFilterState();
    const paramsState: Partial<FilterState> = {};

    const parseParam = (key: FilterKey) => {
      const value = searchParams.get(key);
      if (!value) return undefined;
      return decodeURIComponent(value)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    };

    const phaseParam = parseParam("phase") as FlowPhase[] | undefined;
    const roleParam = parseParam("role");
    const timeParam = parseParam("time");
    const formatParam = parseParam("format") as FlowFormat[] | undefined;
    const popularityParam = parseParam("popularity") as FlowPopularity[] | undefined;

    if (phaseParam) paramsState.phase = phaseParam;
    if (roleParam) paramsState.role = roleParam;
    if (timeParam) paramsState.time = timeParam;
    if (formatParam) paramsState.format = formatParam;
    if (popularityParam) paramsState.popularity = popularityParam;

    return { ...stored, ...paramsState };
  });

  const [searchInput, setSearchInput] = useState(() => searchParams.get("q") ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(searchInput);
  const [loading, setLoading] = useState(true);
  const [detailsFlow, setDetailsFlow] = useState<OnboardingFlow | null>(null);
  const [stepperFlow, setStepperFlow] = useState<OnboardingFlow | null>(null);
  const [stepperIndex, setStepperIndex] = useState(0);
  const [flowProgress, setFlowProgress] = useState<FlowProgressState>(() => loadProgressState());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<Record<FilterKey, boolean>>({
    phase: true,
    role: true,
    time: true,
    format: true,
    popularity: true,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchInput.trim().toLowerCase());
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 250);
  }, []);

  useEffect(() => {
    saveFilterState(filters);
    const params: Record<string, string> = {};
    const trimmedQuery = searchInput.trim();
    if (trimmedQuery) params.q = trimmedQuery;
    (["phase", "role", "time", "format", "popularity"] as FilterKey[]).forEach((key) => {
      const value = filters[key];
      if (value.length) params[key] = value.join(",");
    });
    setSearchParams(params, { replace: true });
  }, [filters, searchInput, setSearchParams]);

  useEffect(() => {
    saveProgressState(flowProgress);
  }, [flowProgress]);

  const toggleFilter = (key: FilterKey, value: string) => {
    setFilters((prev) => {
      const current = new Set(prev[key]);
      if (current.has(value)) current.delete(value);
      else current.add(value);
      return { ...prev, [key]: Array.from(current) };
    });
  };

  const clearFilters = () => setFilters(defaultFilters);

  const filteredFlows = useMemo(() => {
    return ONBOARDING_FLOWS.filter((flow) => {
      if (debouncedQuery) {
        const matcher = `${flow.title} ${flow.description}`.toLowerCase();
        if (!matcher.includes(debouncedQuery)) return false;
      }
      if (filters.phase.length && !filters.phase.includes(flow.phase)) return false;
      if (
        filters.role.length &&
        !flow.roles.some((role) => role === "All" || filters.role.includes(role))
      )
        return false;
      if (!filterFlowByTime(flow, filters.time)) return false;
      if (filters.format.length && !filters.format.includes(flow.format)) return false;
      if (filters.popularity.length && (!flow.popularity || !filters.popularity.includes(flow.popularity)))
        return false;
      return true;
    });
  }, [filters, debouncedQuery]);

  const handleStartFlow = (flow: OnboardingFlow) => {
    const progress = flowProgress[flow.id] ?? {};
    const firstIncompleteIndex = flow.steps.findIndex((step) => !progress[step.id]);
    setStepperFlow(flow);
    setStepperIndex(firstIncompleteIndex === -1 ? 0 : firstIncompleteIndex);
  };

  const handleMarkStepDone = (flow: OnboardingFlow, step: OnboardingFlowStep) => {
    setFlowProgress((prev) => {
      const currentFlow = prev[flow.id] ?? {};
      return {
        ...prev,
        [flow.id]: { ...currentFlow, [step.id]: true },
      };
    });
  };

  const getStepperCompletion = (flow: OnboardingFlow) => {
    const completed = calculateFlowCompletion(flow, flowProgress);
    return completed;
  };

  const allStepsComplete = (flow: OnboardingFlow) => {
    const progress = flowProgress[flow.id] ?? {};
    return flow.steps.every((step) => progress[step.id]);
  };

  const renderFilterSection = (title: string, key: FilterKey, options: string[]) => (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-[#030F35]"
        onClick={() => setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }))}
        aria-expanded={accordionOpen[key]}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${accordionOpen[key] ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {accordionOpen[key] ? (
        <div className="space-y-2">
          {options.map((option) => (
            <FilterCheckbox
              key={option}
              label={option}
              checked={filters[key].includes(option)}
              onChange={() => toggleFilter(key, option)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#030F35]">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#030F35] via-[#1A2E6E] to-[#FB5535] py-16 text-white">
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
          <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
            <FadeInUpOnScroll className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Digital Qatalyst
              </span>
              <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">Onboarding Flows</h1>
              <p className="text-base text-white/85 md:text-lg">
                Discover guided flows to get productive fast in the Digital Workspace.
              </p>
            </FadeInUpOnScroll>
            <FadeInUpOnScroll className="w-full max-w-xl">
              <label className="flex items-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white/90 focus-within:bg-white/15 focus-within:ring-2 focus-within:ring-white/40">
                <Search className="h-4 w-4" aria-hidden="true" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search flows by title or description"
                  className="flex-1 bg-transparent placeholder:text-white/60 focus:outline-none"
                />
              </label>
            </FadeInUpOnScroll>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto flex max-w-7xl gap-8 px-4 sm:px-6">
            <aside className="hidden w-72 flex-shrink-0 flex-col gap-4 lg:flex">
              <FadeInUpOnScroll className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[#030F35]">Filters</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-[#FB5535] hover:underline"
                >
                  Clear
                </button>
              </FadeInUpOnScroll>
              <FadeInUpOnScroll>
                {renderFilterSection("Journey Phase", "phase", phaseOptions)}
              </FadeInUpOnScroll>
              <FadeInUpOnScroll>
                {renderFilterSection("Role", "role", roleOptions)}
              </FadeInUpOnScroll>
              <FadeInUpOnScroll>
                {renderFilterSection("Time to Complete", "time", timeOptions)}
              </FadeInUpOnScroll>
              <FadeInUpOnScroll>
                {renderFilterSection("Format", "format", formatOptions)}
              </FadeInUpOnScroll>
              <FadeInUpOnScroll>
                {renderFilterSection("Popularity", "popularity", popularityOptions)}
              </FadeInUpOnScroll>
            </aside>

            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between lg:hidden">
                <Button
                  variant="outline"
                  onClick={() => setFiltersOpen(true)}
                  icon={<Filter className="h-4 w-4" aria-hidden="true" />}
                >
                  Filters
                </Button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-[#FB5535] hover:underline"
                >
                  Clear
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <FlowCardSkeleton key={index} />
                  ))}
                </div>
              ) : filteredFlows.length === 0 ? (
                <FadeInUpOnScroll className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FB5535]/10 text-[#FB5535]">
                    <ListChecks className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-[#030F35]">No flows match your filters yet.</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Try adjusting your filters or search to explore additional onboarding flows.
                  </p>
                  <Button
                    onClick={clearFilters}
                    className="mt-6 bg-[linear-gradient(135deg,#030F35_0%,#FB5535_100%)] text-white hover:brightness-105 focus-visible:ring-[#FB5535]"
                    icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
                  >
                    Clear Filters
                  </Button>
                </FadeInUpOnScroll>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredFlows.map((flow) => {
                    const completion = calculateFlowCompletion(flow, flowProgress);
                    const badgeClass =
                      flow.phase === "Discover"
                        ? "bg-[#FB5535]/15 text-[#FB5535]"
                        : flow.phase === "Set Up"
                        ? "bg-[#030F35]/10 text-[#030F35]"
                        : flow.phase === "Connect"
                        ? "bg-[#1A2E6E]/10 text-[#1A2E6E]"
                        : "bg-[#0F5C8C]/10 text-[#0F5C8C]";
                    return (
                      <FadeInUpOnScroll key={flow.id}>
                        <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl">
                          <div className="flex items-start justify-between gap-4">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                              {flow.phase}
                            </span>
                            {flow.popularity ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#FB5535]/10 px-3 py-1 text-xs font-semibold text-[#FB5535]">
                                <Star className="h-3.5 w-3.5" aria-hidden="true" /> {flow.popularity}
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-4 space-y-2">
                            <h3 className="text-lg font-semibold text-[#030F35]">{flow.title}</h3>
                            <p className="line-clamp-2 text-sm text-slate-600">{flow.description}</p>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-[#FB5535]" aria-hidden="true" />
                              {flow.time} min
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3.5 w-3.5 text-[#030F35]" aria-hidden="true" />
                              {flow.roles.join(", ")}
                            </span>
                            {typeof flow.usage === "number" ? (
                              <span className="inline-flex items-center gap-1">
                                <Sparkles className="h-3.5 w-3.5 text-[#FB5535]" aria-hidden="true" />
                                {flow.usage} used
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-6 flex items-center justify-between rounded-xl bg-[#F9FBFF] px-3 py-2 text-xs font-semibold text-[#030F35]">
                            <span>{completion}% complete</span>
                            <div className="h-1.5 w-24 rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-[linear-gradient(135deg,#FB5535_0%,#030F35_100%)]"
                                style={{ width: `${completion}%` }}
                              />
                            </div>
                          </div>
                          <div className="mt-6 flex flex-col gap-3">
                            <Button
                              onClick={() => handleStartFlow(flow)}
                              className="w-full bg-[linear-gradient(135deg,#030F35_0%,#FB5535_100%)] text-white hover:brightness-105 focus-visible:ring-[#FB5535]"
                              icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                            >
                              Start Flow
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setDetailsFlow(flow)}
                              className="w-full border-[#030F35]/40 text-[#030F35] hover:bg-[#030F35]/10 focus-visible:ring-[#FB5535]"
                              icon={<ChevronRight className="h-4 w-4" aria-hidden="true" />}
                              iconPosition="right"
                            >
                              View Details
                            </Button>
                          </div>
                        </article>
                      </FadeInUpOnScroll>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer isLoggedIn={false} />

      {/* Filters drawer mobile */}
      <ModalShell
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
      >
        <div className="space-y-4">
          {renderFilterSection("Journey Phase", "phase", phaseOptions)}
          {renderFilterSection("Role", "role", roleOptions)}
          {renderFilterSection("Time to Complete", "time", timeOptions)}
          {renderFilterSection("Format", "format", formatOptions)}
          {renderFilterSection("Popularity", "popularity", popularityOptions)}
        </div>
      </ModalShell>

      {/* Details modal */}
      <ModalShell
        open={detailsFlow !== null}
        onClose={() => setDetailsFlow(null)}
        title={detailsFlow?.title ?? "Flow details"}
        subtitle={detailsFlow ? `${detailsFlow.phase} • ${detailsFlow.time} min • ${detailsFlow.format}` : undefined}
        size="lg"
      >
        {detailsFlow ? (
          <DetailsTabs
            flow={detailsFlow}
            onStart={() => {
              setDetailsFlow(null);
              handleStartFlow(detailsFlow);
            }}
            completion={calculateFlowCompletion(detailsFlow, flowProgress)}
          />
        ) : null}
      </ModalShell>

      {/* Stepper modal */}
      <ModalShell
        open={stepperFlow !== null}
        onClose={() => {
          setStepperFlow(null);
          setStepperIndex(0);
        }}
        title={stepperFlow?.title ?? "Flow progress"}
        subtitle={
          stepperFlow
            ? `${stepperFlow.steps.length} steps • ${stepperFlow.time} min • ${stepperFlow.format}`
            : undefined
        }
        size="lg"
      >
        {stepperFlow ? (
          <StepperModalContent
            flow={stepperFlow}
            currentIndex={stepperIndex}
            onIndexChange={setStepperIndex}
            onCompleteStep={(step) => handleMarkStepDone(stepperFlow, step)}
            completion={getStepperCompletion(stepperFlow)}
            onExploreWorkspace={() => {
              setStepperFlow(null);
              navigate("/workspace");
            }}
            isFlowComplete={allStepsComplete(stepperFlow)}
            progressState={flowProgress[stepperFlow.id] ?? {}}
          />
        ) : null}
      </ModalShell>
    </div>
  );

  function DetailsTabs({
    flow,
    onStart,
    completion,
  }: {
    flow: OnboardingFlow;
    onStart: () => void;
    completion: number;
  }) {
    const [activeTab, setActiveTab] = useState<"overview" | "steps">("overview");
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "overview"
                ? "bg-[#030F35] text-white shadow"
                : "bg-[#F3F4F6] text-[#030F35] hover:bg-[#E5E7EB]"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("steps")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeTab === "steps"
                ? "bg-[#030F35] text-white shadow"
                : "bg-[#F3F4F6] text-[#030F35] hover:bg-[#E5E7EB]"
            }`}
          >
            Steps
          </button>
        </div>

        {activeTab === "overview" ? (
          <div className="space-y-6 text-sm text-slate-600">
            <p>{flow.description}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <OverviewList title="Outcomes" items={flow.outcomes} />
              {flow.prerequisites?.length ? (
                <OverviewList title="Prerequisites" items={flow.prerequisites} />
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-[#F9FBFF] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FB5535]">Meta</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>Time: {flow.time} minutes</li>
                  <li>Roles: {flow.roles.join(", ")}</li>
                  <li>Format: {flow.format}</li>
                  <li>Completion: {completion}%</li>
                </ul>
              </div>
              {flow.tools?.length ? (
                <div className="rounded-2xl border border-slate-200 bg-[#F9FBFF] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FB5535]">
                    Tools & Links
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-[#030F35]">
                    {flow.tools.map((tool) => (
                      <li key={tool.label}>
                        <a href={tool.href} className="inline-flex items-center gap-2 text-[#030F35] hover:underline">
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          {tool.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ol className="space-y-3 text-sm text-slate-600">
              {flow.steps.map((step, index) => (
                <li key={step.id} className="rounded-2xl border border-slate-200 bg-[#F9FBFF] p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#030F35]/10 text-sm font-semibold text-[#030F35]">
                      {index + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-[#030F35]">{step.title}</p>
                      <p>{step.action}</p>
                      {step.link ? (
                        <a href={step.link} className="inline-flex items-center gap-2 text-[#FB5535] hover:underline">
                          Open resource
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <Button
              onClick={onStart}
              className="bg-[linear-gradient(135deg,#030F35_0%,#FB5535_100%)] text-white hover:brightness-105 focus-visible:ring-[#FB5535]"
            >
              Start Flow
            </Button>
          </div>
        )}
      </div>
    );
  }

  function OverviewList({ title, items }: { title: string; items: string[] }) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-[#F9FBFF] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FB5535]">{title}</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FB5535]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function StepperModalContent({
    flow,
    currentIndex,
    onIndexChange,
    onCompleteStep,
    completion,
    onExploreWorkspace,
    isFlowComplete,
    progressState,
  }: {
    flow: OnboardingFlow;
    currentIndex: number;
    onIndexChange: (index: number) => void;
    onCompleteStep: (step: OnboardingFlowStep) => void;
    completion: number;
    onExploreWorkspace: () => void;
    isFlowComplete: boolean;
    progressState: Record<string, boolean>;
  }) {
    const currentStep = flow.steps[currentIndex];
    const nextDisabled = currentIndex >= flow.steps.length - 1;

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between text-sm font-semibold text-[#030F35]">
            <span>
              Step {currentIndex + 1} of {flow.steps.length}
            </span>
            <span>{completion}% complete</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-[linear-gradient(135deg,#FB5535_0%,#030F35_100%)] transition-all duration-500"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {isFlowComplete ? (
          <div className="space-y-4 rounded-2xl border border-green-200 bg-green-50 p-6 text-center text-sm text-green-700">
            <p className="text-base font-semibold text-green-700">Flow completed! 🚀</p>
            <p>
              You’ve completed every step in this flow. Head to the Digital Workspace to keep the momentum going.
            </p>
            <Button
              onClick={onExploreWorkspace}
              className="bg-[linear-gradient(135deg,#030F35_0%,#FB5535_100%)] text-white hover:brightness-105 focus-visible:ring-[#FB5535]"
              icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
              iconPosition="right"
            >
              Go to Digital Workspace
            </Button>
          </div>
        ) : (
          <>
            <div className="rounded-2xl border border-slate-200 bg-[#F9FBFF] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FB5535]">
                {flow.steps.length > 1 ? `Step ${currentIndex + 1}` : "Action"}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-[#030F35]">{currentStep.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{currentStep.action}</p>
              {currentStep.link ? (
                <a
                  href={currentStep.link}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#FB5535] hover:underline"
                >
                  Open resource
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  onCompleteStep(currentStep);
                  if (currentIndex < flow.steps.length - 1) {
                    onIndexChange(currentIndex + 1);
                  }
                }}
                className="bg-[linear-gradient(135deg,#030F35_0%,#FB5535_100%)] text-white hover:brightness-105 focus-visible:ring-[#FB5535]"
                icon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
                iconPosition="right"
              >
                Mark Step Done
              </Button>
              <Button
                variant="outline"
                onClick={() => onIndexChange(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="border-[#030F35]/40 text-[#030F35] hover:bg-[#030F35]/10 focus-visible:ring-[#FB5535]"
              >
                Back
              </Button>
              <Button
                variant="outline"
                onClick={() => onIndexChange(Math.min(flow.steps.length - 1, currentIndex + 1))}
                disabled={nextDisabled}
                className="border-[#030F35]/40 text-[#030F35] hover:bg-[#030F35]/10 focus-visible:ring-[#FB5535]"
              >
                Next
              </Button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FB5535]">
                Flow Overview
              </p>
              <ol className="mt-3 space-y-2 text-sm text-slate-600">
                {flow.steps.map((step, index) => {
                  const done = progressState[step.id];
                  return (
                    <li key={step.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#030F35]/10 text-xs font-semibold text-[#030F35]">
                          {index + 1}
                        </span>
                        <span>{step.title}</span>
                      </div>
                      {done ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FB5535]/10 px-2.5 py-1 text-xs font-semibold text-[#FB5535]">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Done
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </div>
          </>
        )}
      </div>
    );
  }
>>>>>>> theirs
};

export default OnboardingFlowsPage;
