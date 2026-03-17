import React from "react";
export interface Provider {
  name: string;
  logoUrl: string;
}
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  provider: Provider;
  tags: string[];
}
export interface MarketplaceCardConfig {
  primaryCTA: string;
  secondaryCTA: string;
}
export interface MarketplaceCardProps {
  item: MarketplaceItem;
  isBookmarked?: boolean;
  config?: MarketplaceCardConfig;
  onQuickView: () => void;
  onToggleBookmark: () => void;
  onAddToComparison: () => void;
  onViewDetails: () => void;
  onPrimaryAction: () => void;
  "data-id"?: string;
}
export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
  item,
  isBookmarked: _isBookmarked = false, // Reserved for future bookmark functionality
  config = { primaryCTA: "Get Started", secondaryCTA: "View Details" },
  onQuickView,
  onViewDetails,
  "data-id": dataId,
}) => {
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails();
  };

  return (
    <div
      className="flex flex-col min-h-[340px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
      style={{ border: "1px solid rgba(251, 85, 53, 0.2)" }}
      onClick={onQuickView}
      data-id={dataId}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onQuickView();
        }
      }}
      aria-label={`View details for ${item.title} by ${item.provider.name}`}
    >
      {/* Card Header with fixed height for title and provider */}
      <div
        className="px-4 py-5 flex-grow flex flex-col"
        style={{
          background:
            "linear-gradient(135deg, rgba(251, 85, 53, 0.05) 0%, rgba(3, 15, 53, 0.05) 100%)",
        }}
      >
        <div className="flex items-start mb-5">
          <div className="flex-grow min-h-[72px] flex flex-col justify-center">
            <h3
              className="font-bold line-clamp-2 min-h-[48px] leading-snug"
              style={{ color: "#030F35" }}
            >
              {item.title}
            </h3>
            <p
              className="text-sm min-h-[20px] mt-1"
              style={{ color: "#FB5535" }}
            >
              {item.provider.name}
            </p>
          </div>
        </div>
        {/* Description with consistent height */}
        <div className="mb-5">
          <p className="text-sm text-gray-700 line-clamp-3 min-h-[60px] leading-relaxed">
            {item.description}
          </p>
        </div>
        {/* Tags - fixed position */}
      </div>
      {/* Card Footer - with two buttons */}
      <div
        className="mt-auto p-4 pt-5"
        style={{ borderTop: "1px solid rgba(251, 85, 53, 0.2)" }}
      >
        <div className="flex justify-between gap-2">
          <button
            onClick={handleViewDetails}
            className="px-4 py-2 text-sm font-medium bg-white rounded-md transition-all whitespace-nowrap min-w-[120px] flex-1 border-2"
            style={{
              color: "#030F35",
              borderColor: "#030F35",
              backgroundColor: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(3, 15, 53, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
            }}
          >
            {config.secondaryCTA}
          </button>
          <button
            className="px-4 py-2 text-sm font-bold text-white rounded-md transition-all whitespace-nowrap flex-1"
            style={{
              background: "linear-gradient(135deg, #FB5535 0%, #030F35 100%)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            {config.primaryCTA}
          </button>
        </div>
      </div>
    </div>
  );
};
