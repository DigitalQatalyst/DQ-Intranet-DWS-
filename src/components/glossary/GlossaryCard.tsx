import React from 'react';
import { Link } from 'react-router-dom';

export interface GlossaryTerm {
  id: string;
  term: string;
  short_definition: string;
  full_definition?: string;
  category: string;
  used_in: string[];
  related_terms?: string[];
  status: 'Active' | 'Deprecated';
  slug?: string;
  owner?: string;
  last_updated?: string;
}

interface GlossaryCardProps {
  term: GlossaryTerm;
  onClick?: (term: GlossaryTerm) => void;
  isFirst?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  'frameworks-models': 'Frameworks & Models',
  'ways-of-working': 'Ways of Working',
  'governance-systems': 'Governance & Systems',
  'platforms-tools': 'Platforms & Tools',
  'metrics-performance': 'Metrics & Performance',
  'roles-structures': 'Roles & Structures',
};

const USED_IN_LABELS: Record<string, string> = {
  'dws-core': 'DWS Core',
  'l24-working-rooms': 'L24 Working Rooms',
  'learning-center': 'Learning Center',
  'marketplaces': 'Marketplaces',
  'governance': 'Governance',
};

const getCategoryLabel = (category: string): string => {
  return CATEGORY_LABELS[category] || category;
};

const getUsedInLabel = (usedIn: string): string => {
  return USED_IN_LABELS[usedIn] || usedIn;
};

export const GlossaryCard: React.FC<GlossaryCardProps> = ({ term, onClick, isFirst = false }) => {
  const slug = term.slug || term.id;
  const detailPath = `/knowledge-center/glossary/${slug}`;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(term);
    }
  };

  return (
    <Link
      to={detailPath}
      onClick={handleClick}
      className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-150 h-full flex flex-col group block"
      style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}
    >
      {/* Glossary Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Term Name - Primary Heading (bold, largest) */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
          {term.term}
          {term.status === 'Deprecated' && (
            <span className="ml-2 text-xs font-normal text-amber-600">(Deprecated)</span>
          )}
        </h3>

        {/* Short Definition - Supporting Text (readable body text) */}
        <p className="text-sm font-normal text-gray-600 mb-5 leading-relaxed line-clamp-2 flex-grow">
          {term.short_definition}
        </p>

        {/* Metadata - Category and Used In (smaller, muted text) */}
        <div className="mt-auto pt-4 border-t border-gray-100 space-y-1.5">
          {term.category && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Category</span>{' '}
              <span className="text-gray-700">{getCategoryLabel(term.category)}</span>
            </div>
          )}
          {term.used_in && term.used_in.length > 0 && (
            <div className="text-xs text-gray-500">
              <span className="font-medium">Used in</span>{' '}
              <span className="text-gray-600">
                {term.used_in.map((usedIn, idx) => (
                  <span key={idx}>
                    {getUsedInLabel(usedIn)}
                    {idx < term.used_in.length - 1 && ' · '}
                  </span>
                ))}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GlossaryCard;

