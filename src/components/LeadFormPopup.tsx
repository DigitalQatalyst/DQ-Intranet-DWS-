import {
  FormEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const openRoles = [
  "Design Lead",
  "Development Lead",
  "LMS Lead",
  "Operations Lead",
  "Associate – Internship",
  "Other",
];

const serviceCategories = [
  "Design",
  "Development",
  "Training",
  "Operations",
  "Content",
  "Other",
];

const formEndpoint = "https://formsubmit.co/nnpmservices24atgmail.com";

let resolveOpen: (() => void) | null = null;
let resolveClose: (() => void) | null = null;

const focusableSelector =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return [] as HTMLElement[];
  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelector),
  ).filter((el) => !el.hasAttribute("disabled"));
}

export function openLeadPopup() {
  if (resolveOpen) {
    resolveOpen();
  } else {
    window.dispatchEvent(new Event("open-lead-popup"));
  }
}

export default function LeadFormPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const closePopup = useCallback(() => {
    if (!isOpen || isClosing) return;
    setIsClosing(true);
    window.setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    }, 200);
  }, [isClosing, isOpen]);

  const openPopup = useCallback(() => {
    setIsOpen(true);
    setIsClosing(false);
  }, []);

  useEffect(() => {
    resolveOpen = openPopup;
    resolveClose = closePopup;
    const handleOpen = () => openPopup();
    const handleClose = () => closePopup();
    window.addEventListener("open-lead-popup", handleOpen);
    window.addEventListener("close-lead-popup", handleClose);
    return () => {
      resolveOpen = null;
      resolveClose = null;
      window.removeEventListener("open-lead-popup", handleOpen);
      window.removeEventListener("close-lead-popup", handleClose);
    };
  }, [openPopup, closePopup]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    triggerRef.current = previouslyFocused ?? null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 150);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePopup();
      } else if (event.key === "Tab") {
        const focusable = getFocusableElements(panelRef.current);
        if (!focusable.length) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, closePopup]);

  const popupState = useMemo(
    () => (isOpen && !isClosing ? "open" : "closed"),
    [isOpen, isClosing],
  );

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closePopup();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!event.currentTarget.checkValidity()) {
      event.preventDefault();
    }
  };

  if (!isOpen && !isClosing) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onMouseDown={handleBackdropClick}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 transition-opacity duration-150"
        data-open={popupState}
        style={{
          opacity: popupState === "open" ? 1 : 0,
        }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-form-title"
        className="relative z-[101] w-full max-w-[720px] rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 p-6 md:p-8 opacity-0 scale-95 translate-y-2 transition-all duration-200 ease-out"
        data-open={popupState}
        style={{
          opacity: popupState === "open" ? 1 : 0,
          transform:
            popupState === "open"
              ? "scale(1) translateY(0)"
              : "scale(0.95) translateY(8px)",
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#1A2E6E]">
              JOIN THE MOVEMENT
            </p>
            <h2
              id="lead-form-title"
              className="mt-2 text-2xl md:text-[26px] font-bold text-[#030F35] leading-snug"
            >
              Become a Lead
            </h2>
            <p className="mt-2 text-sm md:text-[15px] text-gray-600">
              Step forward in your DQ journey. Leads drive collaboration,
              mentor associates, and shape how our digital workspace grows.
              Tell us where you'd like to contribute — we'll connect with you
              about available leadership roles.
            </p>
            <p className="mt-2 text-sm">
              <strong className="font-medium text-[#131E42]">Before you apply:</strong>{" "}
              <a
                href="https://digital-qatalyst.shorthandstories.com/d77fd279-6d03-4f27-8211-745c3df5bbf3/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0030E3] underline underline-offset-4 hover:text-[#002180]"
              >
                read the 6 leadership principles ↗
              </a>
            </p>
          </div>
          <button
            type="button"
            onClick={closePopup}
            className="ml-4 inline-flex items-center justify-center rounded-full p-2 text-[#1A2E6E] transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FB5535]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form
          action={formEndpoint}
          method="POST"
          className="mt-6 space-y-4"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="_subject" value="New Lead Application (DWS)" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value="/thank-you" />
          <input type="hidden" name="_category" value="Leadership Application" />
          <input type="hidden" name="_source" value="DWS-Landing" />
          <input type="hidden" name="_version" value="DQ2.0-Q1" />

          <div>
            <label className="mb-2 block text-sm font-medium text-[#030F35]">
              Full Name
            </label>
            <input
              ref={firstFieldRef}
              type="text"
              name="name"
              required
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-gray-200 px-3 py-3 focus:border-[#FB5535] focus:outline-none focus:ring-2 focus:ring-[#FB5535] invalid:border-red-500 invalid:ring-2 invalid:ring-red-500/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#030F35]">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@company.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-3 focus:border-[#FB5535] focus:outline-none focus:ring-2 focus:ring-[#FB5535] invalid:border-red-500 invalid:ring-2 invalid:ring-red-500/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#030F35]">
              Open Role
            </label>
            <select
              name="openRole"
              required
              defaultValue=""
              className="w-full rounded-lg border border-gray-200 px-3 py-3 bg-white text-sm focus:border-[#FB5535] focus:outline-none focus:ring-2 focus:ring-[#FB5535] invalid:border-red-500 invalid:ring-2 invalid:ring-red-500/40"
            >
              <option value="" disabled>
                Select a role
              </option>
              {openRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#030F35]">
              Service Category
            </label>
            <select
              name="serviceCategory"
              defaultValue=""
              className="w-full rounded-lg border border-gray-200 px-3 py-3 bg-white text-sm focus:border-[#FB5535] focus:outline-none focus:ring-2 focus:ring-[#FB5535]/30"
            >
              <option value="" disabled>
                Select a category
              </option>
              {serviceCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#030F35]">
              Linked Project / Studio <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              name="linkedProject"
              placeholder="Project Phoenix, DFSA, DQ Studio, etc."
              className="w-full rounded-lg border border-gray-200 px-3 py-3 focus:border-[#FB5535] focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#030F35]">
              Message / Motivation
            </label>
            <textarea
              name="message"
              rows={4}
              required
              placeholder="Share your leadership experience, achievements, and how you’d like to mentor others."
              className="w-full rounded-lg border border-gray-200 px-3 py-3 focus:border-[#FB5535] focus:outline-none focus:ring-2 focus:ring-[#FB5535]/40"
            />
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-1.5 h-4 w-4 rounded border-gray-300 text-[#030F35] focus:ring-[#FB5535] focus:ring-offset-0"
            />
            <span>I agree to be contacted about this leadership opportunity.</span>
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#030F35] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#030F35]/20 hover:-translate-y-0.5 hover:shadow-xl transition focus:outline-none focus:ring-2 focus:ring-[#FB5535]/60"
          >
            Submit Leadership Application →
          </button>
          <p className="text-xs text-gray-500">
            Your submission will be reviewed by the DQ Leadership team as part of our active Lead
            recruitment and capability mapping process.
          </p>
        </form>
      </div>
    </div>
  );
}
