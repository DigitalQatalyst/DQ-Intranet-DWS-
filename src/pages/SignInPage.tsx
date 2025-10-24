import { FormEvent, SVGProps, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../components/Header";

type SignInPageProps = {
  redirectTo?: string;
};

/**
 * SignInPage (Microsoft SSO)
 * - Email "Next" triggers your magic link/OTP endpoint
 * - "Sign in with Microsoft" redirects to your OAuth start route
 * - Brand: #030F35 (navy), #FB5535 (accent)
 * Wire these endpoints:
 *   POST /api/auth/request-access   { email }
 *   GET  /api/auth/microsoft        (redirects to Microsoft OAuth)
 */

export default function SignInPage({ redirectTo = "/onboarding/start" }: SignInPageProps = {}) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTarget = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const candidate = params.get("redirect") ?? redirectTo;
    if (!candidate) return redirectTo;
    if (/^https?:\/\//i.test(candidate)) return redirectTo;
    return candidate.startsWith("/") ? candidate : redirectTo;
  }, [location.search, redirectTo]);

  useEffect(() => {
    if (!isLoading && user) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isLoading, user, redirectTarget, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(115deg, #FF6A3D 0%, #B24B5A 35%, #2E3A6D 70%, #0C1E54 100%)",
      }}
    >
      <div className="w-full max-w-md">
        <SignInCard redirectTarget={redirectTarget} />
      </div>
    </div>
  );
}

type SignInCardProps = {
  redirectTarget: string;
};

function SignInCard({ redirectTarget }: SignInCardProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleNext(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      setMessage("Please enter a valid email address.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setMessage("Check your inbox for a magic link / OTP to continue.");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function microsoftSignIn() {
    // Your server should start the OAuth flow here and redirect to Microsoft
    const params = new URLSearchParams({ redirect: redirectTarget });
    window.location.href = `/api/auth/microsoft?${params.toString()}`;
  }

  return (
    <div className="bg-white/95 rounded-xl shadow-xl border border-black/5">
      <div className="p-6 sm:p-8">
        <div className="text-xs tracking-widest text-[#030F35] font-bold mb-2">
          DQ WORKSPACE
        </div>
        <h1 className="text-2xl font-semibold text-[#030F35]">Sign in</h1>
        <p className="text-sm text-gray-600 mt-1">
          Sign in to access <span className="font-medium">DQ Workspace</span>
        </p>

        <form onSubmit={handleNext} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FB5535]"
              placeholder="name@company.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <a href="/signup" className="text-[#030F35] hover:underline">
              No account? <span className="font-medium">Create one</span>
            </a>
          </div>

          {message && (
            <div className="text-sm text-[#030F35] bg-[#030F35]/5 rounded-md p-2">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-28 ml-auto block rounded-md bg-[#1f4ed8] text-white py-2 font-medium disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Sending…" : "Next"}
          </button>
        </form>
      </div>

      <div className="px-6 sm:px-8 pb-6">
        <button
          type="button"
          onClick={microsoftSignIn}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md bg-white py-2 hover:bg-gray-50"
        >
          <MicrosoftLogo className="h-5 w-5" />
          <span className="text-sm">Sign in with Microsoft</span>
        </button>
      </div>
    </div>
  );
}

function MicrosoftLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 23 23" aria-hidden="true" {...props}>
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="13" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="13" width="9" height="9" fill="#00A4EF" />
      <rect x="13" y="13" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}
