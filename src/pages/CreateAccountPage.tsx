import { FormEvent, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * CreateAccountPage
 * - Lightweight account creation before the HR-style onboarding form
 * - After creation, redirect to /onboarding/start (your full form + uploads)
 * Wire this endpoint:
 *   POST /api/auth/create-account   { name, email }
 */

export default function CreateAccountPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const location = useLocation();
  const redirectTarget = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");
    if (!redirect) return "/onboarding/start";
    if (/^https?:\/\//i.test(redirect)) return "/onboarding/start";
    return redirect.startsWith("/") ? redirect : "/onboarding/start";
  }, [location.search]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setMessage(null);

    const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOK) {
      setMessage("Enter your name and a valid email.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) throw new Error("Create failed");
      // Move into the HR-style onboarding flow:
      window.location.href = redirectTarget;
    } catch {
      setMessage("Could not create account. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(115deg, #FF6A3D 0%, #B24B5A 35%, #2E3A6D 70%, #0C1E54 100%)",
      }}
    >
      <div className="w-full max-w-md bg-white/95 rounded-xl shadow-xl border border-black/5 p-6 sm:p-8">
        <div className="text-xs tracking-widest text-[#030F35] font-bold mb-2">
          DQ WORKSPACE
        </div>
        <h1 className="text-2xl font-semibold text-[#030F35]">Create your DQ Workspace account</h1>
        <p className="text-sm text-gray-600 mt-1">
          Use your Microsoft work email to get started.
        </p>

        <form onSubmit={handleCreate} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FB5535]"
              placeholder="Jane Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FB5535]"
              placeholder="name@company.com"
              required
            />
          </div>

          {message && (
            <div className="text-sm text-[#030F35] bg-[#030F35]/5 rounded-md p-2">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-[#030F35] text-white py-2 font-medium disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Creating…" : "Continue to Onboarding"}
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          <a href="/signin" className="text-[#030F35] hover:underline">
            Already have an account? Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
