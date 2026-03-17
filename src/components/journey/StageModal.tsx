import { useEffect, useRef } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { ArrowRight, X } from "lucide-react";
import type { DwsStage } from "../../data/dwsStages";

type StageModalProps = {
  stage: DwsStage | null;
  isOpen: boolean;
  onClose: () => void;
};

const focusableSelectors =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const StageModal = ({ stage, isOpen, onClose }: StageModalProps) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

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


  if (!isOpen || !stage) {
    return null;
  }

  const handleOverlayClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

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
          <div className="flex items-start justify-between px-6 py-6 sm:px-8 sm:py-8">
            <div className="space-y-3 flex-1">
              <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
                {stage.level}
              </span>
              <h2 id="stage-modal-title" className="text-3xl font-bold text-gray-900">
                {stage.title}
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close stage details"
              className="rounded-md bg-pink-50 border border-pink-200 p-2 text-gray-700 transition hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/50"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 space-y-8 overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8">
            <p id="stage-modal-description" className="text-base leading-relaxed text-gray-700">
              {stage.about}
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">About this stage</h3>
                <p className="text-sm leading-relaxed text-gray-700">{stage.subtitle}</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Key Benefits</h3>
                <ul className="space-y-2.5 text-sm text-gray-700">
                  {stage.keyBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-[#FB5535] flex-shrink-0" aria-hidden="true" />
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">About This Level</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Level Summary</h4>
                  <p className="text-sm leading-relaxed text-gray-700">{stage.levelSummary}</p>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">Growth Expectations</h4>
                  <ul className="space-y-2.5 text-sm text-gray-700">
                    {stage.growthExpectations.map((expectation, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-[#FB5535] flex-shrink-0" aria-hidden="true" />
                        <span className="leading-relaxed">{expectation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">What Good Looks Like</h4>
                  <ul className="space-y-2.5 text-sm text-gray-700">
                    {stage.whatGoodLooksLike.map((item, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-[#FB5535] flex-shrink-0" aria-hidden="true" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-[#FB5535] mb-1">
                  NEXT ACTION
                </p>
                <p className="text-sm text-gray-600">
                  Take the next recommended step to continue your growth journey.
                </p>
              </div>
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-400 px-6 py-3 font-bold text-white shadow-lg cursor-not-allowed opacity-70"
              >
                Coming Soon
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StageModal;
