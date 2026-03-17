import React from 'react';
import type { CDSServiceCard as CDSServiceCardType } from '@/data/cdsServiceCards';

interface CDSServiceCardProps {
  card: CDSServiceCardType;
  onClick: () => void;
  isSelected?: boolean;
}

export const CDSServiceCardComponent: React.FC<CDSServiceCardProps> = ({ card, onClick, isSelected = false }) => {
  // Handle image URL with spaces by encoding it properly
  const getImageUrl = () => {
    const url = card.imageUrl || '/images/cds.png';
    // If URL has spaces, encode them
    return url.includes(' ') ? url.split('/').map(part => part.includes(' ') ? encodeURIComponent(part) : part).join('/') : url;
  };
  const imageUrl = getImageUrl();

  return (
    <div
      className={`flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 shadow-xl' : ''
      }`}
      style={{ width: '100%', maxWidth: '340px' }}
      onClick={onClick}
    >
      {/* Featured Image */}
      <div className="relative bg-gray-200 overflow-hidden" style={{ height: '140px' }}>
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
      <div className="px-8 pt-6 pb-4 flex-grow flex flex-col">
        <div className="flex items-start mb-4">
          <div className="flex-grow">
            <h3 className="font-bold text-gray-900 text-xl leading-tight line-clamp-2 mb-4">
              {card.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <p className="text-base text-gray-500 leading-relaxed line-clamp-3">
            {card.description}
          </p>
        </div>

        {/* CDS Tag */}
        <div className="mb-5">
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
            style={{
              backgroundColor: 'var(--guidelines-primary-surface)',
              color: 'var(--guidelines-primary)'
            }}
          >
            CDS
          </span>
        </div>
      </div>

      {/* Footer with CTA */}
      <div className="mt-auto px-8 pt-5 pb-6">
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
