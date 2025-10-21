import React from "react";
import { Building, TrendingUp, Users, Lightbulb } from "lucide-react";

export default function GrowthAreasSection() {
  const growthAreas = [
    {
      icon: <Building size={48} className="text-blue-600" />,
      title: "Real Estate & Infrastructure",
      description: "Leading development projects shaping Abu Dhabi's skyline",
      stats: "50+ Projects",
    },
    {
      icon: <TrendingUp size={48} className="text-green-600" />,
      title: "Financial Services",
      description: "Banking, investment, and fintech innovation hub",
      stats: "25+ Institutions",
    },
    {
      icon: <Users size={48} className="text-purple-600" />,
      title: "Healthcare & Education",
      description: "World-class medical and educational institutions",
      stats: "30+ Organizations",
    },
    {
      icon: <Lightbulb size={48} className="text-orange-600" />,
      title: "Technology & Innovation",
      description: "Cutting-edge tech companies and startups",
      stats: "40+ Companies",
    },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Growth Areas
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the key sectors driving Abu Dhabi's economic transformation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {growthAreas.map((area, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{area.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {area.title}
                </h3>
                <p className="text-gray-600 mb-4">{area.description}</p>
                <div className="text-sm font-medium text-blue-600">
                  {area.stats}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
