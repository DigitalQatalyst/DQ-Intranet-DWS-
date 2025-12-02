import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { ArrowRight, LayoutGrid, List as ListIcon, X } from "lucide-react";
import type { DwsStage, StageService, StageServiceType } from "../../data/dwsStages";
import { stageFilters } from "../../data/dwsStages";
import { useNavigate } from "react-router-dom";

type StageFilter = (typeof stageFilters)[number];
type ViewMode = "grid" | "list";

type StageModalProps = {
  stage: DwsStage | null;
  isOpen: boolean;
  onClose: () => void;
};

const focusableSelectors =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const serviceTypeBadgeColors: Record<StageServiceType, string> = {
  Learning: "bg-[#030F35]/10 text-[#030F35]",
  Service: "bg-[#FB5535]/10 text-[#FB5535]",
};

const StageModal = ({ stage, isOpen, onClose }: StageModalProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const [activeFilter, setActiveFilter] = useState<StageFilter>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    lastFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    document.body.classList.add("overflow-hidden");
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(focusableSelectors);

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      const isShiftPressed = event.shiftKey;
      const active = document.activeElement as HTMLElement | null;

      if (!isShiftPressed && active === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (isShiftPressed && active === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
      if (lastFocusedRef.current) {
        lastFocusedRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setActiveFilter("All");
    setViewMode("grid");
  }, [stage?.id, isOpen]);

  const filteredServices = useMemo(() => {
    if (!stage) {
      return [];
    }
    if (activeFilter === "All") {
      return stage.services;
    }
    return stage.services.filter((service) => service.type === activeFilter);
  }, [stage, activeFilter]);

  if (!isOpen || !stage) {
    return null;
  }

  const handleOverlayClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleExploreService = (serviceName: string) => {
    navigate(`/service-coming-soon?service=${encodeURIComponent(serviceName)}`);
  };

  const renderServiceCard = (service: StageService) => (
  <div
    key={service.id}
    className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
  >
      <div
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${serviceTypeBadgeColors[service.type]}`}
      >
        {service.type}
      </div>
      <h4 className="mt-3 text-lg font-semibold text-[#030F35]">{service.name}</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
      <div className="mt-auto flex items-center justify-between pt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        <span>{service.provider}</span>
        <ArrowRight className="h-4 w-4 text-[#FB5535]" aria-hidden="true" />
      </div>
      <button
        type="button"
        onClick={() => handleExploreService(service.name)}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#030F35] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#030F35]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#030F35]"
      >
        Explore Service
      </button>
    </div>
  );

  const renderServiceRow = (service: StageService) => (
    <div key={service.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${serviceTypeBadgeColors[service.type]}`}
            >
              {service.type}
            </div>
            <h4 className="mt-2 text-lg font-semibold text-[#030F35]">{service.name}</h4>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {service.provider}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
      </div>
      <div className="shrink-0">
        <button
          type="button"
          onClick={() => handleExploreService(service.name)}
          className="inline-flex items-center justify-center rounded-lg bg-[#030F35] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#030F35]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#030F35]"
        >
          Open
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 sm:px-6"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stage-modal-title"
      aria-describedby="stage-modal-description"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_rgba(3,15,53,0.35)] focus:outline-none"
      >
        <div className="flex max-h-[90vh] flex-col">
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
            <div className="space-y-2">
              <span className="inline-flex items-center rounded-full bg-[#030F35]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#030F35]">
                {stage.level}
              </span>
              <h2 id="stage-modal-title" className="text-2xl font-semibold text-[#030F35] sm:text-3xl">
                {stage.title}
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close stage details"
              className="rounded-md border border-slate-200 p-2 text-[#030F35] transition hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/50"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
            <p id="stage-modal-description" className="text-base leading-relaxed text-slate-600">
              {stage.about}
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5">
                <h3 className="text-lg font-semibold text-[#030F35]">About this stage</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{stage.subtitle}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5">
                <h3 className="text-lg font-semibold text-[#030F35]">Key Benefits</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {stage.keyBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#FB5535]" aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <h3 className="text-lg font-semibold text-[#030F35]">Available Services</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
                    <button
                      type="button"
                      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                        viewMode === "grid"
                          ? "bg-[#030F35] text-white shadow"
                          : "text-[#030F35] hover:bg-slate-100"
                      }`}
                      onClick={() => setViewMode("grid")}
                      aria-pressed={viewMode === "grid"}
                    >
                      <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                      Grid
                    </button>
                    <button
                      type="button"
                      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                        viewMode === "list"
                          ? "bg-[#030F35] text-white shadow"
                          : "text-[#030F35] hover:bg-slate-100"
                      }`}
                      onClick={() => setViewMode("list")}
                      aria-pressed={viewMode === "list"}
                    >
                      <ListIcon className="h-4 w-4" aria-hidden="true" />
                      List
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {stageFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    aria-pressed={activeFilter === filter}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                      activeFilter === filter
                        ? "border-[#030F35] bg-[#030F35] text-white shadow"
                        : "border-slate-200 text-[#030F35] hover:bg-slate-100"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {filteredServices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-10 text-center text-slate-500">
                    <p className="text-sm font-semibold text-[#030F35]">
                      No services match this filter yet.
                    </p>
                    <p className="text-sm text-slate-500">
                      Try another filter or explore the full list to keep momentum.
                    </p>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {filteredServices.map(renderServiceCard)}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {filteredServices.map(renderServiceRow)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#FB5535]">
                  Next Action
                </p>
                <p className="text-sm text-slate-600">
                  Take the next recommended step to continue your growth journey.
                </p>
              </div>
              <a
                href={stage.ctaHref}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#131E42] px-5 py-2.5 font-semibold text-white shadow-lg transition hover:bg-[#0F1A4F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#99B2FF]"
              >
                {stage.ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageModal;
