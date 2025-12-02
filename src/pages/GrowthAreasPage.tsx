import React, { useMemo, useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Target,
  Heart,
  Users,
  CheckSquare,
  Shield,
  GitBranch,
  Package,
  Globe,
  Lightbulb,
  Building2,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import DNAHexagonDiagram from "../components/GrowthAreas/DNAHexagonDiagram";

const GrowthChart = lazy(() => import("./GrowthAreasChart"));

interface GrowthSector {
  id: string;
  name: string;
  tag: string;
  icon: LucideIcon;
  accent: "blue" | "teal" | "purple" | "indigo" | "orange" | "rose" | "emerald";
  description: string;
  growthIndex: number;
  previousGrowthIndex?: number;
  href: string;
}

const growthSectors: GrowthSector[] = [
  {
    id: "the-vision",
    name: "The Vision",
    tag: "Purpose",
    icon: Target,
    accent: "blue",
    description:
      "Why we exist and the outcomes we pursue. Vision keeps every initiative centered on the value we create.",
    growthIndex: 92,
    previousGrowthIndex: 84,
    href: "/strategy",
  },
  {
    id: "the-hov",
    name: "The HoV",
    tag: "Culture",
    icon: Heart,
    accent: "rose",
    description:
      "How we behave—habits, values, and ways of working. HoV creates the environment where teams learn and collaborate.",
    growthIndex: 88,
    previousGrowthIndex: 81,
    href: "/culture",
  },
  {
    id: "the-personas",
    name: "The Personas",
    tag: "Identity",
    icon: Users,
    accent: "purple",
    description:
      "Who we are—roles, skills, and responsibilities. Personas clarify strengths and pathways for growth.",
    growthIndex: 85,
    previousGrowthIndex: 79,
    href: "/personas",
  },
  {
    id: "agile-tms",
    name: "Agile TMS",
    tag: "Tasks",
    icon: CheckSquare,
    accent: "teal",
    description:
      "How we work—tasks, boards, and delivery cadence. TMS keeps priorities visible across teams.",
    growthIndex: 78,
    previousGrowthIndex: 68,
    href: "/tasks",
  },
  {
    id: "agile-sos",
    name: "Agile SOS",
    tag: "Governance",
    icon: Shield,
    accent: "indigo",
    description:
      "How we govern—rhythms, decisions, and accountability. SOS aligns leadership with momentum.",
    growthIndex: 90,
    previousGrowthIndex: 83,
    href: "/governance",
  },
  {
    id: "agile-flows",
    name: "Agile Flows",
    tag: "Value Streams",
    icon: GitBranch,
    accent: "emerald",
    description:
      "How we orchestrate—value streams from idea to impact. Flows coordinate dependencies and outcomes.",
    growthIndex: 86,
    previousGrowthIndex: 80,
    href: "/value-streams",
  },
  {
    id: "agile-dtmf",
    name: "Agile DTMF",
    tag: "Products",
    icon: Package,
    accent: "orange",
    description:
      "What we offer—product catalog, services, and SLAs. DTMF keeps our portfolio current and discoverable.",
    growthIndex: 82,
    previousGrowthIndex: 75,
    href: "/products",
  },
];

const accentColors: Record<string, { gradient: string; text: string; bg: string }> = {
  blue: {
    gradient: "linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)",
    text: "text-blue-600",
    bg: "bg-blue-50",
  },
  teal: {
    gradient: "linear-gradient(90deg, #14B8A6 0%, #5EEAD4 100%)",
    text: "text-teal-600",
    bg: "bg-teal-50",
  },
  purple: {
    gradient: "linear-gradient(90deg, #9333EA 0%, #C084FC 100%)",
    text: "text-purple-600",
    bg: "bg-purple-50",
  },
  indigo: {
    gradient: "linear-gradient(90deg, #4F46E5 0%, #818CF8 100%)",
    text: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  orange: {
    gradient: "linear-gradient(90deg, #FB5535 0%, #F97316 100%)",
    text: "text-orange-600",
    bg: "bg-orange-50",
  },
  rose: {
    gradient: "linear-gradient(90deg, #F43F5E 0%, #FB7185 100%)",
    text: "text-rose-600",
    bg: "bg-rose-50",
  },
  emerald: {
    gradient: "linear-gradient(90deg, #10B981 0%, #34D399 100%)",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
  },
};

interface WhyInvestReason {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
}

const whyInvestReasons: WhyInvestReason[] = [
  {
    title: "Empowered Learning Environment",
    description:
      "Continuous learning through role-based paths, certifications, and mentoring programs designed to help every employee grow their skills and confidence.",
    icon: GraduationCap,
    iconColor: "text-blue-600",
  },
  {
    title: "Connected Collaboration Network",
    description:
      "Work smarter with a fully integrated digital ecosystem — connecting teams, tools, and ideas across projects and locations.",
    icon: Globe,
    iconColor: "text-green-600",
  },
  {
    title: "Streamlined Workflows",
    description:
      "Simplified processes and automated tools that remove blockers, accelerate delivery, and let teams focus on what matters most.",
    icon: CheckSquare,
    iconColor: "text-teal-600",
  },
  {
    title: "Robust Digital Infrastructure",
    description:
      "Reliable, scalable, and secure platforms built to support collaboration, innovation, and agile delivery across all teams.",
    icon: Building2,
    iconColor: "text-indigo-600",
  },
  {
    title: "Innovation Culture",
    description:
      "An environment that encourages experimentation and co-creation — with innovation labs, idea hubs, and recognition for creative solutions.",
    icon: Lightbulb,
    iconColor: "text-amber-500",
  },
  {
    title: "People-First Experience",
    description:
      "Balanced, inclusive, and well-being-centered culture that supports employee growth, belonging, and happiness.",
    icon: Heart,
    iconColor: "text-rose-600",
  },
];

const SectorCard = React.memo<{
  sector: GrowthSector;
  IconComponent: LucideIcon;
}>(({ sector, IconComponent }) => {
  const accent = accentColors[sector.accent || "blue"];
  return (
    <article className="group relative bg-white rounded-xl border border-neutral-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col min-h-[240px]">
      <div className="h-1" style={{ background: accent.gradient }} />
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`${accent.bg} ${accent.text} p-2.5 rounded-lg transition-transform duration-200 group-hover:scale-110`}>
            <IconComponent size={22} />
          </div>
          <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
            {sector.tag}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-[#0E1446] mb-3 leading-tight">{sector.name}</h3>
        <p className="text-sm text-neutral-600 leading-relaxed mb-4 flex-1 clamp-2">{sector.description}</p>
        <div className="mb-4 pt-2 border-t border-neutral-100">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0E1446]">{sector.growthIndex}</span>
            <span className="text-xs text-neutral-500">Growth Index</span>
          </div>
        </div>
        <div className="mt-auto pt-2">
          <a
            href={sector.href}
            onClick={(e) => e.preventDefault()}
            className={`inline-flex items-center gap-1.5 text-sm font-semibold ${accent.text} transition-all duration-200 group-hover:gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
            aria-label={`Show more about ${sector.name} - ${sector.tag}`}
          >
            Show More
            <ArrowRight size={14} className="transition-transform" />
          </a>
        </div>
      </div>
    </article>
  );
});

SectorCard.displayName = "SectorCard";

const GrowthAreasPage: React.FC = () => {
  const [showComparison, setShowComparison] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const chartData = useMemo(
    () =>
      growthSectors.map((sector) => ({
        name: sector.name,
        value: sector.growthIndex,
        previousValue: sector.previousGrowthIndex || 0,
      })),
    []
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-transparent">
        <section
          id="growth-dimensions"
          style={{ background: "#fff", padding: "48px 0 80px" }}
          aria-labelledby="growth-dimensions-heading"
        >
          <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px" }}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#030F35] font-semibold hover:text-[#0a1a3d] transition-colors mb-8"
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Link>

            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <h2
                id="growth-dimensions-heading"
                style={{
                  color: "#030F35",
                  fontWeight: 700,
                  fontSize: 44,
                  margin: "0 0 8px",
                  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
                  letterSpacing: "0.04em",
                }}
              >
                Growth Dimensions
              </h2>
              <p className="clamp-2" style={{ color: "#5b667a", margin: 0 }}>
                Seven connected dimensions shaping how DQ learns, collaborates, and delivers value across its global ecosystem.
              </p>
            </div>

            <div
              style={{
                overflowX: "auto",
                overflowY: "visible",
                padding: "20px 0",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div style={{ minWidth: 1200 }}>
                <DNAHexagonDiagram
                  nodes={[
                    { id: 1, role: "center", title: growthSectors[0].name, subtitle: growthSectors[0].tag, fill: "navy", growthIndex: growthSectors[0].growthIndex },
                    { id: 2, role: "leftBot", title: growthSectors[1].name, subtitle: growthSectors[1].tag, fill: "navy", growthIndex: growthSectors[1].growthIndex },
                    { id: 3, role: "rightBot", title: growthSectors[2].name, subtitle: growthSectors[2].tag, fill: "navy", growthIndex: growthSectors[2].growthIndex },
                    { id: 4, role: "rightMid", title: growthSectors[3].name, subtitle: growthSectors[3].tag, fill: "white", growthIndex: growthSectors[3].growthIndex },
                    { id: 5, role: "rightTop", title: growthSectors[4].name, subtitle: growthSectors[4].tag, fill: "white", growthIndex: growthSectors[4].growthIndex },
                    { id: 6, role: "leftTop", title: growthSectors[5].name, subtitle: growthSectors[5].tag, fill: "white", growthIndex: growthSectors[5].growthIndex },
                    { id: 7, role: "leftMid", title: growthSectors[6].name, subtitle: growthSectors[6].tag, fill: "white", growthIndex: growthSectors[6].growthIndex },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="insights"
          className="bg-[#F8FAFC] py-16 md:py-24"
          aria-labelledby="insights-heading"
        >
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(14,20,70,0.08)] border border-neutral-200 p-8 md:p-10">
              <div className="flex flex-col items-center gap-5 mb-8 md:mb-10">
                <div className="text-center">
                  <h2
                    id="insights-heading"
                    className="font-serif text-3xl md:text-4xl font-bold tracking-[0.04em] text-[#030F35] leading-none"
                    style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
                  >
                    DQ DNA Growth Potential
                  </h2>
                  <p className="text-neutral-600 mt-3 text-sm md:text-base">
                    Data-driven signals of how DQ teams learn, deliver, and collaborate across the seven DNA dimensions.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label
                    htmlFor="yoy-toggle"
                    className="text-sm font-medium text-neutral-700 cursor-pointer select-none whitespace-nowrap"
                  >
                    Show Year-over-Year
                  </label>
                  <button
                    id="yoy-toggle"
                    role="switch"
                    aria-checked={showComparison}
                    aria-label="Toggle year-over-year comparison"
                    onClick={() => setShowComparison(!showComparison)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1447FF] focus-visible:ring-offset-2 ${
                      showComparison ? "bg-[#1447FF]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
                        showComparison ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <Suspense
                fallback={
                  <div className="w-full flex items-center justify-center" style={{ height: 400 }}>
                    <div className="text-center">
                      <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                      <p className="text-gray-600 text-sm">Loading chart...</p>
                    </div>
                  </div>
                }
              >
                <GrowthChart
                  chartData={chartData}
                  showComparison={showComparison}
                  onHoverChange={setHoveredBar}
                  hoveredBar={hoveredBar}
                />
              </Suspense>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Why Grow with DQ Digital Workspace
              </h2>
              <p className="mt-4 text-gray-600 text-base md:text-lg">
                Connect, learn, and thrive in an environment built for innovation, growth, and impact — wherever you work.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyInvestReasons.map((reason, index) => {
                const IconComponent = reason.icon;
                return (
                  <div key={index} className="space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <IconComponent size={32} className={reason.iconColor} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{reason.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[#030F35] font-semibold hover:text-[#0a1a3d] transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default GrowthAreasPage;

