import React from 'react';
import { Link } from 'react-router-dom';

interface DesignSystemCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
  type: string;
}

export const DesignSystemCard: React.FC<DesignSystemCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  tags = [],
  type
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200 cursor-pointer overflow-hidden" style={{ height: '300px' }}>
      {/* Hero Image - extends to card edges */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-700 to-purple-600" style={{ height: '120px' }}>
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-col px-5 pt-4 pb-4" style={{ height: '180px' }}>
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-lg mb-3 leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 leading-relaxed flex-grow line-clamp-3">
          {description}
        </p>

        {/* Date */}
        <p className="text-sm text-gray-400 mb-4">March 16, 2026</p>

        {/* View Details Button */}
        <Link
          to={`/marketplace/design-system/${id}`}
          className="w-full block text-center px-4 py-2 bg-[#0a1628] text-white rounded-full font-bold text-sm hover:bg-[#162238] transition-colors duration-200 mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
