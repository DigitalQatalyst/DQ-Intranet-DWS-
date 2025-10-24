import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const WorkspaceComingSoon: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-white">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />

      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-[#030F35] via-[#1A2E6E] to-[#FB5535] py-20 sm:py-24">
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

          <div className="relative mx-auto flex max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="w-full rounded-3xl border border-white/25 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-lg sm:p-12">
              <div className="flex justify-center">
                <img
                  src="/dq_logo8.png"
                  alt="DQ Digital Workspace"
                  className="h-16 w-auto sm:h-20"
                />
              </div>

              <div className="mt-8 space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  DQ Workspace Coming Soon
                </h1>
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                  We’re setting up your workspace tools, dashboards, and services. Check back shortly to
                  launch straight into your DQ experience.
                </p>
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#030F35] transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Go Back Home
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default WorkspaceComingSoon;
