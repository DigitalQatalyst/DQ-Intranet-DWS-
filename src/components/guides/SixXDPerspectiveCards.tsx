import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SIX_XD_PERSPECTIVES } from '../../pages/guides/glossaryFilters';

export interface SixXDPerspectiveCard {
  id: string;
  name: string;
  code: string;
  question: string;
  description: string;
}

export const SIX_XD_PERSPECTIVE_CARDS: SixXDPerspectiveCard[] = [
  {
    id: 'digital-economy',
    name: 'Digital Economy',
    code: 'DE',
    question: 'Why should organisations change?',
    description: 'Understand shifts in market logic, customer behaviour, and value creation that drive transformation in the digital age.',
  },
  {
    id: 'dco',
    name: 'Digital Cognitive Organisation',
    code: 'DCO',
    question: 'Where are organisations headed?',
    description: 'Discover the future enterprise—intelligent, adaptive, and orchestrated—capable of learning and responding seamlessly.',
  },
  {
    id: 'dbp',
    name: 'Digital Business Platforms',
    code: 'DBP',
    question: 'What must be built to enable transformation?',
    description: 'Explore modular, integrated architectures that unify operations and make transformation scalable and resilient.',
  },
  {
    id: 'dt2-0',
    name: 'Digital Transformation 2.0',
    code: 'DT2.0',
    question: 'How should transformation be designed and deployed?',
    description: 'Learn the methods, flows, and governance needed to make change repeatable and outcome-driven.',
  },
  {
    id: 'dw-ws',
    name: 'Digital Worker & Workspace',
    code: 'DW:WS',
    question: 'Who delivers the change, and how do they work?',
    description: 'Redefine roles, skills, and digitally enabled workplaces so teams can deliver and sustain transformation effectively.',
  },
  {
    id: 'digital-accelerators',
    name: 'Digital Accelerators',
    code: 'Tools',
    question: 'When will value be realised, and how fast?',
    description: 'Discover tools, systems, and strategies that compress time-to-value and scale measurable impact.',
  },
];

interface PerspectiveCardProps {
  card: SixXDPerspectiveCard;
  onClick: () => void;
}

const PerspectiveCard: React.FC<PerspectiveCardProps> = ({ card, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all group flex flex-col h-full min-h-[280px]"
    >
      {/* Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-blue-100 text-blue-700 border-blue-200">
          6xD
        </span>
        <span className="text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full font-medium">
          {card.code}
        </span>
      </div>

      {/* Perspective Name */}
      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[var(--guidelines-primary)] transition-colors">
        {card.name}
      </h3>

      {/* Human-centric Question (italic) */}
      <p className="text-sm text-gray-600 italic mb-3 leading-relaxed">
        {card.question}
      </p>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-grow">
        {card.description}
      </p>

      {/* Soft CTA */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className="mt-auto w-full bg-[#162862] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1e3568] transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <span>Explore perspective</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};

interface SixXDPerspectiveCardsProps {
  onCardClick: (perspectiveId: string) => void;
}

export const SixXDPerspectiveCards: React.FC<SixXDPerspectiveCardsProps> = ({ onCardClick }) => {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Agile 6xD Framework</h2>
        <p className="text-gray-600">
          Explore the six essential perspectives that guide digital transformation
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {SIX_XD_PERSPECTIVE_CARDS.map((card) => (
          <PerspectiveCard
            key={card.id}
            card={card}
            onClick={() => onCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SixXDPerspectiveCards;


