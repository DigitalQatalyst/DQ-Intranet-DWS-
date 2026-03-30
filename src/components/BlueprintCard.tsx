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
    <div 
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onView(blueprint)}
    >
      <h3 className="text-lg font-bold mb-3" style={{ color: "#030F35" }}>
        {blueprint.title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {blueprint.description}
      </p>
    </div>
  );
};

export default BlueprintCard;
