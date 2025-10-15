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
theirs
};

export default OnboardingFlowsPage;
