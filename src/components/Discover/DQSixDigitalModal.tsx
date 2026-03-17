import { useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";
import type { SixDigitalId } from "./Discover_SixDigitalSection";

interface SixDigitalService {
  id: string;
  name: string;
  description: string;
  provider: string;
  type: "Learning" | "Service";
  action: "knowledge" | "learning";
}

export interface SixDigitalModalData {
  id: SixDigitalId;
  title: string;
  label: string;
  modalDescription: string;
  keyAreas: string[];
  services: SixDigitalService[];
}

interface SixDigitalModalProps {
  dimension: SixDigitalModalData | null;
  isOpen: boolean;
  onClose: () => void;
  onExploreKnowledge: (id: SixDigitalId) => void;
  onExploreLearning: (id: SixDigitalId) => void;
}

const serviceTypeBadgeColors: Record<SixDigitalService["type"], string> = {
  Learning: "bg-[#030F35]/10 text-[#030F35]",
  Service: "bg-[#FB5535]/10 text-[#FB5535]",
};

const focusableSelectors =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const DQSixDigitalModal = ({
  dimension,
  isOpen,
  onClose,
  onExploreKnowledge,
  onExploreLearning,
}: SixDigitalModalProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    lastFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    document.body.classList.add("overflow-hidden");
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 50);

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
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      const isShift = event.shiftKey;
      const active = document.activeElement as HTMLElement | null;

      if (!isShift && active === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (isShift && active === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
      lastFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !dimension) {
    return null;
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleServiceAction = (action: "knowledge" | "learning") => {
    if (action === "knowledge") {
      onExploreKnowledge(dimension.id);
    } else {
      onExploreLearning(dimension.id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 sm:px-6"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="six-digital-modal-title"
      aria-describedby="six-digital-modal-description"
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
                {dimension.label}
              </span>
              <h2 id="six-digital-modal-title" className="text-2xl font-semibold text-[#030F35] sm:text-3xl">
                {dimension.title}
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close dimension details"
              className="rounded-md border border-slate-200 p-2 text-[#030F35] transition hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/50"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
            <p id="six-digital-modal-description" className="text-base leading-relaxed text-slate-600">
              {dimension.modalDescription}
            </p>

            <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5">
              <h3 className="text-lg font-semibold text-[#030F35]">Key Areas</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {dimension.keyAreas.map((area) => (
                  <li key={area} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#FB5535]" aria-hidden="true" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <h3 className="text-lg font-semibold text-[#030F35]">Available Services</h3>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {dimension.services.map((service) => (
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
                        onClick={() => handleServiceAction(service.action)}
                        className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#131E42] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#0F1A4F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#99B2FF]"
                      >
                        Explore Service
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[#FB5535]">
                  Next Action
                </p>
                <p className="text-sm text-slate-600">
                  Continue exploring the knowledge pathways for this dimension.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onExploreKnowledge(dimension.id)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#131E42] px-5 py-2.5 font-semibold text-white shadow-lg transition hover:bg-[#0F1A4F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#99B2FF]"
              >
                Visit Knowledge Center
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DQSixDigitalModal;
