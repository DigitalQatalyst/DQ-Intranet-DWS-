import React from 'react';
import { Clock } from 'lucide-react';

interface SixXDCard {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

const SIXD_CARDS: SixXDCard[] = [
  {
    title: "Digital Economy (DE)",
    subtitle: "Why should organisations change?",
    description: "Understand shifts in market logic, customer behaviour, and value creation that drive transformation.",
    imageUrl: "/images/services/digital-economy.jpg"
  },
  {
    title: "Digital Cognitive Organisation (DCO)",
    subtitle: "Where are organisations headed?",
    description: "The future enterprise: intelligent, adaptive, and orchestrated for seamless coordination.",
    imageUrl: "/images/services/digital-cognitive-organisation.jpg"
  },
  {
    title: "Digital Business Platforms (DBP)",
    subtitle: "What must be built to enable transformation?",
    description: "Modular, integrated architectures that unify operations and enable scalable transformation.",
    imageUrl: "/images/services/digital-business-platforms.png"
  },
  {
    title: "Digital Transformation 2.0 (DT2.0)",
    subtitle: "How should transformation be designed and deployed?",
    description: "Methods, flows, and governance frameworks that make change repeatable and outcome-driven.",
    imageUrl: "/images/services/digital-transformation-2.jpg"
  },
  {
    title: "Digital Worker & Workspace (DW:WS)",
    subtitle: "Who delivers the change, and how do they work?",
    description: "Redefining roles, skills, and digitally enabled workplaces for effective transformation delivery.",
    imageUrl: "/images/services/digital-worker-workspace.jpg"
  },
  {
    title: "Digital Accelerators (Tools)",
    subtitle: "When will value be realised?",
    description: "Tools, systems, and strategies that compress time-to-value and scale measurable impact.",
    imageUrl: "/images/services/digital-accelerators..jpg"
  }
];

export const SixXDComingSoonCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {SIXD_CARDS.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow border border-gray-200 p-3 transition-all duration-300 hover:shadow-md flex flex-col h-[400px]"
        >
          {/* Image - Match GuideCard styling */}
          <div className="rounded-lg overflow-hidden mb-2 bg-slate-50 h-40 min-h-[160px] max-h-[160px] flex-shrink-0">
            <img
              src={card.imageUrl}
              alt={card.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Card Content */}
          <div className="flex flex-col flex-1">
            {/* Title - Match GuideCard styling */}
            <h3 className="font-semibold text-gray-900 mb-1.5 line-clamp-2 min-h-[44px] flex-shrink-0">
              {card.title}
            </h3>

            {/* Subtitle - Italic tagline */}
            <p className="text-sm text-gray-500 mb-2 italic line-clamp-1 flex-shrink-0">
              {card.subtitle}
            </p>

            {/* Description - Match GuideCard styling */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-2 min-h-[36px] leading-snug flex-shrink-0">
              {card.description}
            </p>

            {/* Spacer to push button to bottom */}
            <div className="flex-grow min-h-[8px]"></div>

            {/* Footer with Coming Soon Button - Match GuideCard styling */}
            <div className="pt-2.5 border-t border-gray-100 flex-shrink-0">
              <button
                disabled
                className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-full text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                aria-label="Coming Soon"
              >
                <Clock size={16} />
                <span>Coming Soon</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
