import React from "react";
import { FileText, Eye, Download } from "lucide-react";

interface Blueprint {
  id: string;
  title: string;
  description: string;
  lastUpdated?: string;
  author?: string;
  url?: string;
  projectId: string;
  projectName: string;
  category: "discern" | "design" | "develop" | "deploy";
}

interface BlueprintCardProps {
  blueprint: Blueprint;
  onView: (blueprint: Blueprint) => void;
  onDownload: (blueprint: Blueprint) => void;
}

export const BlueprintCard: React.FC<BlueprintCardProps> = ({
  blueprint,
  onView,
  onDownload,
}) => {
  return (
    <div className="flex flex-col min-h-[340px] bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Card Header with fixed height for title and project */}
      <div className="px-4 py-5 flex-grow flex flex-col">
        <div className="flex items-start mb-5">
          <div
            className="h-12 w-12 rounded-md flex items-center justify-center flex-shrink-0 mr-3"
            style={{ backgroundColor: "#1A2E6E" }}
          >
            <FileText size={24} className="text-white" />
          </div>
          <div className="flex-grow min-h-[72px] flex flex-col justify-center">
            <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[48px] leading-snug">
              {blueprint.title}
            </h3>
            <p className="text-sm text-gray-500 min-h-[20px] mt-1">
              {blueprint.projectName}
            </p>
          </div>
        </div>
        {/* Description with consistent height */}
        <div className="mb-5">
          <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px] leading-relaxed">
            {blueprint.description}
          </p>
        </div>
        {/* Tags and Actions in same row - fixed position */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-wrap gap-1 max-w-[70%]">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium truncate"
              style={{
                backgroundColor:
                  blueprint.category === "discern" ||
                  blueprint.category === "develop"
                    ? "rgba(26, 46, 110, 0.1)"
                    : "rgba(255, 107, 53, 0.1)",
                color:
                  blueprint.category === "discern" ||
                  blueprint.category === "develop"
                    ? "#1A2E6E"
                    : "#FF6B35",
                borderColor:
                  blueprint.category === "discern" ||
                  blueprint.category === "develop"
                    ? "rgba(26, 46, 110, 0.2)"
                    : "rgba(255, 107, 53, 0.2)",
                border: "1px solid",
              }}
            >
              {blueprint.category.toUpperCase()}
            </span>
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <button
              onClick={() => onView(blueprint)}
              className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              aria-label="View blueprint"
              title="View blueprint"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onDownload(blueprint)}
              className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
              aria-label="Download blueprint"
              title="Download blueprint"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>
      {/* Card Footer - with two buttons */}
      <div className="mt-auto border-t border-gray-100 p-4 pt-5">
        <div className="flex justify-between gap-2">
          <button
            onClick={() => onView(blueprint)}
            className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap min-w-[120px] flex-1"
            style={{
              color: "#1A2E6E",
              borderColor: "#1A2E6E",
            }}
          >
            View Details
          </button>
          <button
            onClick={() => onDownload(blueprint)}
            className="px-4 py-2 text-sm font-bold text-white rounded-md transition-colors whitespace-nowrap flex-1"
            style={{ backgroundColor: "#FF6B35" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E04A2B";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FF6B35";
            }}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlueprintCard;
