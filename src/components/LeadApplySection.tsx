import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Briefcase, Phone, X } from "lucide-react";
import { FadeInUpOnScroll } from "./AnimationUtils";

const floatingShapes = [
  { size: 120, color: "rgba(3,15,53,0.15)", delay: 0, duration: 15, className: "top-[10%] left-[5%]" },
  { size: 80, color: "rgba(251, 85, 53, 0.18)", delay: 1.8, duration: 18, className: "top-[32%] left-[14%]" },
  { size: 150, color: "rgba(3,15,53,0.12)", delay: 1, duration: 20, className: "bottom-[18%] left-[12%]" },
  { size: 100, color: "rgba(255,255,255,0.12)", delay: 2.6, duration: 16, className: "top-[22%] right-[12%]" },
  { size: 70, color: "rgba(3,15,53,0.10)", delay: 2.1, duration: 14, className: "top-[60%] right-[6%]" },
  { size: 130, color: "rgba(251, 85, 53, 0.20)", delay: 1.2, duration: 22, className: "bottom-[12%] right-[18%]" },
];

type CardConfig = {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  ariaLabel?: string;
  testId?: string;
};

type SupportStatus = { type: "ok" | "err"; text: string };

const LeadApplySection = () => {
  const navigate = useNavigate();

  const cards = useMemo<CardConfig[]>(
    () => [
      {
        id: "card-1",
        icon: <Users size={28} className="text-[#FB5535]" />,
        title: "Open DQ Workspace",
        description:
          "Lead — access the right tools, services, and dashboards to drive progress every day.",
        cta: "Open Now →",
        onClick: () => navigate("/workspace"),
        ariaLabel: "Open DQ Workspace",
        testId: "open-dq-workspace-cta",
      },
      {
        id: "card-2",
        icon: <Briefcase size={28} className="text-[#FB5535]" />,
        title: "Become a Lead",
        description:
          "Co-work — take the next step in your DQ journey, mentor peers, and help shape how we grow.",
        cta: "Apply Now →",
        onClick: () => window.dispatchEvent(new Event("open-lead-popup")),
      },
    ],
    [navigate]
  );

  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isSendingSupport, setIsSendingSupport] = useState(false);
  const [supportStatus, setSupportStatus] = useState<SupportStatus | null>(null);
  const supportModalRef = useRef<HTMLDivElement | null>(null);
  const supportNameRef = useRef<HTMLInputElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  const openSupportModal = () => {
    lastFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIsSupportModalOpen(true);
  };

  const closeSupportModal = () => {
    setIsSupportModalOpen(false);
  };

  useEffect(() => {
    if (!isSupportModalOpen) {
      document.body.classList.remove("overflow-hidden");
      if (lastFocusedElementRef.current) {
        lastFocusedElementRef.current.focus();
      }
      setIsSendingSupport(false);
      setSupportStatus(null);
      return;
    }

    document.body.classList.add("overflow-hidden");
    const timer = window.setTimeout(() => supportNameRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(timer);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isSupportModalOpen]);

  useEffect(() => {
    if (!isSupportModalOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSupportModal();
        return;
      }

      if (event.key !== "Tab" || !supportModalRef.current) {
        return;
      }

      const focusable = supportModalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusable.length === 0) {
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
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSupportModalOpen]);

  const handleSupportSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSendingSupport) {
      return;
    }

    setIsSendingSupport(true);
    setSupportStatus(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      setSupportStatus({ type: "err", text: "Please fill all fields." });
      setIsSendingSupport(false);
      return;
    }

    try {
      console.log("Support request submitted", { name, email, message, source: "DWS • Get Support" });
      await new Promise((resolve) => window.setTimeout(resolve, 600));
      setSupportStatus({ type: "ok", text: "Thanks! Our team will get back to you shortly." });
      form.reset();
      supportNameRef.current?.focus();
    } catch (error) {
      setSupportStatus({ type: "err", text: "Something went wrong. Please try again." });
    } finally {
      setIsSendingSupport(false);
    }
  };

  const supportStatusId = supportStatus ? "support-modal-status" : undefined;
  const supportDelay = 0.3 + cards.length * 0.2;

  return (
    <section
      id="ready-move"
      className="relative overflow-hidden bg-[linear-gradient(135deg,#FB5535_0%,#1A2E6E_50%,#030F35_100%)] py-20 pb-16 md:pb-20 text-white scroll-mt-[96px]"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingShapes.map(({ size, color, delay, duration, className }, index) => (
          <div
            key={`${index}-${size}`}
            className={`absolute rounded-full opacity-30 animate-float ${className}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: color,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 text-center">
        <FadeInUpOnScroll>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Move Work Forward?
          </h2>
        </FadeInUpOnScroll>
        <FadeInUpOnScroll delay={0.2}>
          <p className="text-lg text-gray-200 mb-12 max-w-3xl mx-auto">
            Work smarter in the DQ Digital Workspace — lead, co-work, and grow together.
          </p>
        </FadeInUpOnScroll>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {cards.map(({ id, icon, title, description, cta, onClick, ariaLabel, testId }, idx) => (
            <FadeInUpOnScroll key={id} delay={0.3 + idx * 0.2} className="flex">
              <article className="flex h-[350px] w-[320px] flex-col justify-between rounded-2xl bg-white p-6 text-left shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div>
                  <div className="mb-3 flex justify-center">
                    <div className="inline-flex items-center justify-center rounded-full bg-[#FB5535]/10 p-3">
                      {icon}
                    </div>
                  </div>
                  <h3 className="mb-3 text-center text-lg font-semibold text-[#030F35]">{title}</h3>
                  <p className="text-center text-gray-600 leading-relaxed">{description}</p>
                </div>
                <button
                  type="button"
                  onClick={onClick}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      onClick();
                    }
                  }}
                  aria-label={ariaLabel}
                  data-testid={testId}
                  className="mx-auto mt-6 rounded-md bg-[linear-gradient(135deg,#FB5535_0%,#1A2E6E_50%,#030F35_100%)] px-5 py-2.5 font-semibold text-white shadow-[0_6px_20px_rgba(3,15,53,0.18)] transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/60 focus:ring-offset-2 focus:ring-offset-white"
                >
                  {cta}
                </button>
              </article>
            </FadeInUpOnScroll>
          ))}
          <FadeInUpOnScroll delay={supportDelay} className="flex">
            <article
              id="get-support"
              className="flex h-[350px] w-[320px] flex-col justify-between rounded-2xl bg-white p-6 text-left shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="mb-3 flex justify-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-[#FB5535]/10 p-3">
                    <Phone size={28} className="text-[#FB5535]" />
                  </div>
                </div>
                <h3 className="mb-3 text-center text-lg font-semibold text-[#030F35]">Get Support</h3>
                <p className="text-center text-gray-600 leading-relaxed">
                  Own — reach out to DQ Support for quick help and unblock what matters most.
                </p>
              </div>
              <button
                type="button"
                onClick={openSupportModal}
                className="mx-auto mt-6 rounded-md bg-[linear-gradient(135deg,#FB5535_0%,#1A2E6E_50%,#030F35_100%)] px-5 py-2.5 font-semibold text-white shadow-[0_6px_20px_rgba(3,15,53,0.18)] transition-transform duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/60 focus:ring-offset-2 focus:ring-offset-white"
              >
                Get in Touch → 
              </button>
            </article>
          </FadeInUpOnScroll>
        </div>
      </div>

      {isSupportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-modal-title"
          aria-describedby={supportStatusId}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 sm:px-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeSupportModal();
            }
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            ref={supportModalRef}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 id="support-modal-title" className="text-xl font-semibold text-[#030F35]">
                Contact Us
              </h3>
              <button
                type="button"
                aria-label="Close support form"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-[#030F35] transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/50 focus:ring-offset-1"
                onClick={closeSupportModal}
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleSupportSubmit}>
              <div>
                <label htmlFor="support-name" className="block text-sm font-medium text-[#030F35]">
                  Name
                </label>
                <input
                  id="support-name"
                  name="name"
                  ref={supportNameRef}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[#0B1220] placeholder:text-gray-400 caret-[#030F35] outline-none transition focus:border-[#030F35] focus:ring-2 focus:ring-[#030F35]"
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="support-email" className="block text-sm font-medium text-[#030F35]">
                  Email
                </label>
                <input
                  id="support-email"
                  type="email"
                  name="email"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-[#0B1220] placeholder:text-gray-400 caret-[#030F35] outline-none transition focus:border-[#030F35] focus:ring-2 focus:ring-[#030F35]"
                  autoComplete="email"
                />
              </div>

              <div>
                <label htmlFor="support-message" className="block text-sm font-medium text-[#030F35]">
                  Message
                </label>
                <textarea
                  id="support-message"
                  name="message"
                  rows={4}
                  className="mt-1 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-[#0B1220] placeholder:text-gray-400 caret-[#030F35] outline-none transition focus:border-[#030F35] focus:ring-2 focus:ring-[#030F35]"
                  placeholder="How can we help you?"
                />
              </div>

              {supportStatus && (
                <p
                  id={supportStatusId}
                  role="status"
                  className={`rounded-lg border p-2 text-sm ${
                    supportStatus.type === "ok"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {supportStatus.text}
                </p>
              )}

              <button
                type="submit"
                disabled={isSendingSupport}
                className="w-full rounded-xl bg-[#030F35] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#FB5535]/60 focus:ring-offset-2 focus:ring-offset-white"
              >
                {isSendingSupport ? "Sending…" : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0);
            opacity: 0.3;
          }
          33% {
            transform: translateY(-30px) translateX(20px) rotate(5deg);
            opacity: 0.6;
          }
          66% {
            transform: translateY(20px) translateX(-15px) rotate(-3deg);
            opacity: 0.4;
          }
          100% {
            transform: translateY(0) translateX(0) rotate(0);
            opacity: 0.3;
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default LeadApplySection;
