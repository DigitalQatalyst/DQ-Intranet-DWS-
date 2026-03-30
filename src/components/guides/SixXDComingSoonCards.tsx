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
        key={`item-`}
        className="bg-white rounded-2xl shadow border border-gray-200 transition-all duration-300 hover:shadow-md flex flex-col overflow-hidden"
      >
        {/* Image — flush to top */}
        <div className="w-full flex-shrink-0 bg-slate-50" style={{ height: '180px' }}>
          <img
            src={card.imageUrl}
            alt={card.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-2 flex-shrink-0">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-blue-100 text-blue-700 border-blue-200">
              6xD
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-1.5 flex-shrink-0" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.375rem'
          }}>
            {card.title}
          </h3>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 italic mb-2 flex-shrink-0" style={{
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {card.subtitle}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 flex-shrink-0" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.25rem'
          }}>
            {card.description}
          </p>

          {/* Button — no separator */}
          <div className="mt-auto flex-shrink-0">
            <button
              disabled
              className="w-full px-4 py-2.5 bg-gray-100 text-gray-400 rounded-full text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
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
