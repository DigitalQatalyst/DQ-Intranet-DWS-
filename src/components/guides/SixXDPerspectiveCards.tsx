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
      className="bg-white border border-gray-200 rounded-2xl cursor-pointer hover:shadow-md transition-all flex flex-col overflow-hidden"
    >
      {/* Image — flush to top */}
      <div className="w-full flex-shrink-0 bg-gradient-to-br from-[#030E31] to-[#162862] flex items-center justify-center" style={{ height: '180px' }}>
        <span className="text-5xl font-bold text-white/20 select-none">{card.code}</span>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-2 flex-shrink-0">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-blue-100 text-blue-700 border-blue-200">
            6xD
          </span>
          <span className="text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full font-medium border border-gray-200">
            {card.code}
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
          {card.name}
        </h3>

        {/* Question (italic) */}
        <p className="text-sm text-gray-500 italic mb-2 flex-shrink-0" style={{
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {card.question}
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
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="w-full bg-[#030E31] text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-[#020A28] transition-colors flex items-center justify-center gap-2"
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
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


