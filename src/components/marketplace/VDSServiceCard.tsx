import React from 'react';
import type { VDSServiceCard as VDSServiceCardType } from '@/data/vdsServiceCards';

interface VDSServiceCardProps {
  card: VDSServiceCardType;
  onClick: () => void;
}

export const VDSServiceCardComponent: React.FC<VDSServiceCardProps> = ({ card, onClick }) => {
  const imageUrl = card.imageUrl || '/images/vds.png';

  return (
    <div
      className="flex flex-col min-h-[340px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer guidelines-theme"
      onClick={onClick}
    >
      {/* Featured Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={card.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.className = 'relative h-48 bg-gradient-to-br from-blue-400 to-blue-600';
            }
          }}
        />
      </div>

      {/* Card Content */}
      <div className="px-4 pt-3 pb-2 flex-grow flex flex-col">
        <div className="flex items-start mb-2">
          <div className="flex-grow">
            <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 leading-tight">
              {card.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <div className="mb-3">
          <p className="text-sm text-gray-600 line-clamp-3 leading-snug">
            {card.description}
          </p>
        </div>

        {/* V.DS Tag */}
        <div className="mb-3">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: 'var(--guidelines-primary-surface)',
              color: 'var(--guidelines-primary)'
            }}
          >
            V.DS
          </span>
        </div>
      </div>

      {/* Footer with CTA */}
      <div className="mt-auto pt-3 border-t border-gray-100 px-4 pb-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="w-full inline-flex items-center justify-center rounded-full bg-[var(--guidelines-primary-solid)] text-white text-sm font-semibold px-4 py-2 transition-all hover:bg-[var(--guidelines-primary-solid-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--guidelines-ring-color)]"
          aria-label="View details"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
