import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface GlossaryDetailAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const GlossaryDetailAccordion: React.FC<GlossaryDetailAccordionProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="text-xl font-bold text-gray-900 pr-4 flex-1">
          {title}
        </h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-0">
          <div className="text-gray-700 leading-relaxed">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlossaryDetailAccordion;

