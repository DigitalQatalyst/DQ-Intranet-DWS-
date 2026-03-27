import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FadeInUpOnScroll } from "../AnimationUtils";
import { Building2, Brain, Layers, Shuffle, Users, Rocket } from "lucide-react";
import DQSixDigitalModal, { SixDigitalModalData } from "./DQSixDigitalModal";
import { DiscoverSectionTitle } from "./DiscoverSectionTitle";

export type SixDigitalId = "D1" | "D2" | "D3" | "D4" | "D5" | "D6";

interface SixDigitalStep extends SixDigitalModalData {
  stepNumber: number;
  shortDescription: string;
  ctaLabel: string;
  icon: React.ReactNode;
}

const createServices = (
  id: SixDigitalId,
  title: string,
): SixDigitalModalData["services"] => [
  {
    id: `${id}-lms`,
    name: "LMS Courses",
    type: "Learning",
    provider: "Learning Center",
    description: `Curated learning paths and certifications to deepen expertise in ${title}.`,
    action: "learning",
  },
  {
    id: `${id}-knowledge`,
    name: "Knowledge Hub",
    type: "Service",
    provider: "Knowledge Center",
    description: `Guides, playbooks, and resources to activate ${title} initiatives.`,
    action: "knowledge",
  },
];

const sixDigitalSteps: SixDigitalStep[] = [
  {
    id: "D1",
    stepNumber: 1,
    label: "Dimension",
    title: "Digital Economy (DE)",
    shortDescription: "How organisations create value, compete, and grow in a digital-first economy.",
    keyAreas: [
      "Understand shifts in market logic and customer behaviour",
      "Align offerings with digital market ecosystems",
      "Strengthen competitiveness in core and emerging markets",
    ],
    ctaLabel: "Explore Digital Economy",
    icon: <Building2 size={24} className="transition-colors duration-300" />,
    modalDescription:
      "How organisations create value, compete, and grow in a digital-first economy.",
    services: createServices("D1", "Digital Economy"),
  },
  {
    id: "D2",
    stepNumber: 2,
    label: "Dimension",
    title: "Digital Cognitive Organisation (DCO)",
    shortDescription: "How organisations think, learn, and decide using data, intelligence, and feedback loops.",
    keyAreas: [
      "Build data-driven decision frameworks",
      "Strengthen organisational learning and memory",
      "Enable adaptive behaviours across teams and systems",
    ],
    ctaLabel: "Explore Cognitive Organisations",
    icon: <Brain size={24} className="transition-colors duration-300" />,
    modalDescription:
      "How organisations think, learn, and decide using data, intelligence, and feedback loops.",
    services: createServices("D2", "Digital Cognitive Organisations"),
  },
  {
    id: "D3",
    stepNumber: 3,
    label: "Dimension",
    title: "Digital Business Platforms (DBP)",
    shortDescription: "Technology platforms that connect services, data, and stakeholders at scale.",
    keyAreas: [
      "Design modular, integrated, and data-driven architectures",
      "Standardise core capabilities and operating platforms",
      "Enable scalable and resilient digital ecosystems",
    ],
    ctaLabel: "Explore Business Platforms",
    icon: <Layers size={24} className="transition-colors duration-300" />,
    modalDescription:
      "Technology platforms that connect services, data, and stakeholders at scale.",
    services: createServices("D3", "Digital Business Platforms"),
  },
  {
    id: "D4",
    stepNumber: 4,
    label: "Dimension",
    title: "Digital Transformation (DT2.0)",
    shortDescription: "Next-generation transformation model for designing and deploying change.",
    keyAreas: [
      "Structure end-to-end transformation flows",
      "Align portfolios, programs, and teams",
      "Govern progress with clear outcomes and metrics",
    ],
    ctaLabel: "Explore Digital Transformation",
    icon: <Shuffle size={24} className="transition-colors duration-300" />,
    modalDescription:
      "Next-generation transformation model for designing and deploying change.",
    services: createServices("D4", "Digital Transformation"),
  },
  {
    id: "D5",
    stepNumber: 5,
    label: "Dimension",
    title: "Digital Worker & Workspace (DW:WS)",
    shortDescription: "Modern digital employee experience — tools, spaces, and ways of working.",
    keyAreas: [
      "Design frictionless digital work journeys",
      "Optimise tools, channels, and workplaces",
      "Improve productivity, focus, and collaboration",
    ],
    ctaLabel: "Explore Worker & Workspace",
    icon: <Users size={24} className="transition-colors duration-300" />,
    modalDescription:
      "Modern digital employee experience — tools, spaces, and ways of working.",
    services: createServices("D5", "Digital Worker & Workspace"),
  },
  {
    id: "D6",
    stepNumber: 6,
    label: "Dimension",
    title: "Digital Accelerators (Tools)",
    shortDescription: "Tools, templates, and automation that speed up delivery and adoption.",
    keyAreas: [
      "Reuse frameworks, templates, and playbooks",
      "Reduce time-to-deliver for digital initiatives",
      "Standardise quality across teams and projects",
    ],
    ctaLabel: "Explore Digital Accelerators",
    icon: <Rocket size={24} className="transition-colors duration-300" />,
    modalDescription:
      "Tools, templates, and automation that speed up delivery and adoption.",
    services: createServices("D6", "Digital Accelerators"),
  },
];

const Discover_SixDigitalSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeDimension, setActiveDimension] = useState<SixDigitalStep | null>(null);

  const progressPercent = ((activeIndex + 1) / sixDigitalSteps.length) * 100;

  const handleOpenModal = (step: SixDigitalStep, index: number) => {
    setActiveDimension(step);
    setActiveIndex(index);
  };

  const handleCloseModal = () => setActiveDimension(null);

  const handleNavigateKnowledgeHub = (id: SixDigitalId) => {
    navigate(`/coming-soon?type=knowledge&dimension=${id}`);
  };

  const handleNavigateLearningCenter = (id: SixDigitalId) => {
    navigate(`/coming-soon?type=lms&dimension=${id}`);
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll className="mb-8 text-center">
          <DiscoverSectionTitle>
            Agile 6xD (Products)
          </DiscoverSectionTitle>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Six digital perspectives guiding how DQ designs, builds, and scales transformation as living systems.
          </p>
        </FadeInUpOnScroll>

        <div className="my-10 hidden lg:block">
          <div className="mx-auto flex w-full max-w-4xl">
            <div className="relative h-2 w-full rounded-full bg-slate-200">
              <div
                className="absolute top-0 left-0 h-2 rounded-full bg-[image:var(--dq-cta-gradient)] transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
              {sixDigitalSteps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 transition-colors ${
                    index <= activeIndex
                      ? "bg-white border-[#1452F0]"
                      : "bg-slate-300 border-white"
                  }`}
                  style={{ left: `calc(${(index / (sixDigitalSteps.length - 1)) * 100}% - 10px)` }}
                  aria-label={`Select ${step.title}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sixDigitalSteps.map((step, index) => (
            <div
              key={step.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 min-w-[300px] flex flex-col flex-shrink-0 md:min-w-0 relative h-full min-h-[420px] ${
                index === activeIndex ? "ring-2 ring-[#1452F0] shadow-lg" : "hover:shadow-lg hover:-translate-y-1"
              }`}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div
                    className={`p-3 rounded-full mr-4 transition-colors duration-300 ${
                      index === activeIndex ? "bg-[#1452F0] text-white" : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                      {step.label}
                    </p>
                    <h3 className="text-xl font-bold text-gray-800 clamp-1">{step.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 clamp-2">{step.shortDescription}</p>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Key Areas:</h4>
                  <ul className="text-gray-600 space-y-1">
                    {step.keyAreas.map((area) => (
                      <li key={area} className="flex items-start">
                        <span
                          className={`mr-2 transition-colors duration-300 ${
                            index === activeIndex ? "text-dq-coral" : "text-dq-navy"
                          }`}
                        >
                          •
                        </span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenModal(step, index)}
                  className="mt-auto text-white font-medium py-2 px-4 rounded-md transition-all duration-300 flex items-center justify-center overflow-hidden group bg-[#131E42] hover:bg-[#0F1A4F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#99B2FF]"
                >
                  View Details
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                    ↗
                  </span>
                </button>
              </div>
              <div
                className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === activeIndex ? "bg-dq-coral text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.id}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DQSixDigitalModal
        dimension={activeDimension}
        isOpen={Boolean(activeDimension)}
        onClose={handleCloseModal}
        onExploreKnowledge={handleNavigateKnowledgeHub}
        onExploreLearning={handleNavigateLearningCenter}
      />
    </section>
  );
};

export default Discover_SixDigitalSection;
