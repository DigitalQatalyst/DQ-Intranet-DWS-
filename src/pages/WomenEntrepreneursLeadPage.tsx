import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const stats = [
  { value: "1,000+", label: "Leaders Empowered" },
  { value: "7", label: "Growth Dimensions" },
  { value: "50+", label: "Leadership Programs" },
  { value: "5", label: "Global Hubs" },
];

const WomenEntrepreneursLeadPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <main className="flex-grow">
        <section className="relative overflow-hidden text-white">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(26,46,110,0.9) 0%, rgba(251,85,53,0.8) 100%), url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative flex flex-col items-center text-center px-6 lg:px-10 pt-28 pb-36 max-w-5xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl lg:text-[48px] font-bold leading-tight tracking-tight">
              Empowering Leadership Across DQ
            </h1>
            <p className="mt-6 text-base md:text-lg text-white/85 max-w-3xl">
              Discover how leadership at DQ drives growth, collaboration, and purpose — inspiring every associate to lead with impact and authenticity.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/marketplace/guides"
                className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg bg-[linear-gradient(135deg,_#FB5535_0%,_#1A2E6E_100%)] hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Explore Leadership Journey
              </Link>
              <Link
                to="/lms"
                className="px-6 py-3 rounded-xl font-semibold text-white border border-white/80 hover:bg-white/10 transition-all"
              >
                Discover the GHC Leader Path
              </Link>
            </div>
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 px-4 py-6 text-center shadow-[0_8px_24px_rgba(26,46,110,0.18)] hover:shadow-[0_10px_28px_rgba(26,46,110,0.25)] transition-all"
                >
                  <p className="text-2xl font-display font-semibold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs md:text-sm text-white/85 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 opacity-35">
            <svg
              viewBox="0 0 1440 120"
              fill="currentColor"
              className="w-full h-full text-[#180D66]"
            >
              <path d="M0,120 L0,90 L30,90 L30,80 L60,80 L60,70 L90,70 L90,80 L120,80 L120,60 L150,60 L150,50 L180,50 L180,70 L210,70 L210,80 L240,80 L240,60 L270,60 L270,40 L300,40 L300,50 L330,50 L330,40 L360,40 L360,20 L390,20 L390,40 L420,40 L420,30 L450,30 L450,20 L480,20 L480,10 L510,10 L510,0 L540,0 L540,10 L570,10 L570,20 L600,20 L600,30 L630,30 L630,40 L660,40 L660,30 L690,30 L690,20 L720,20 L720,10 L750,10 L750,20 L780,20 L780,10 L810,10 L810,30 L840,30 L840,50 L870,50 L870,60 L900,60 L900,70 L930,70 L930,80 L960,80 L960,70 L990,70 L990,50 L1020,50 L1020,40 L1050,40 L1050,50 L1080,50 L1080,60 L1110,60 L1110,40 L1140,40 L1140,30 L1170,30 L1170,40 L1200,40 L1200,50 L1230,50 L1230,60 L1260,60 L1260,50 L1290,50 L1290,40 L1320,40 L1320,30 L1350,30 L1350,20 L1380,20 L1380,10 L1410,10 L1410,20 L1440,20 L1440,120 Z" />
            </svg>
          </div>
        </section>

      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default WomenEntrepreneursLeadPage;

