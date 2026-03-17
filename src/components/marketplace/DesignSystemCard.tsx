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
    <div className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer h-[350px] flex flex-col p-3 pb-0">
      {/* Hero Image */}
      <div className="rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-blue-900 via-blue-700 to-purple-600">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-40 object-cover"
          loading="lazy"
        />
      </div>

      {/* Card Body */}
      <div className="flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
          {description}
        </p>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>

        {/* View Details Button */}
        <Link
          to={`/marketplace/design-system/${id}?tab=${type}`}
          className="w-full block text-center px-6 py-2 bg-[#0a1628] text-white rounded-full font-bold text-sm hover:bg-[#162238] transition-colors duration-200 mb-[-12px]"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
