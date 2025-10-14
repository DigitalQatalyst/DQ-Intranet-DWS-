import React from "react";
import { Search, Filter, Building2, MapPin, Users, Star } from "lucide-react";

export default function DirectorySection() {
  const organizations = [
    {
      name: "Abu Dhabi Investment Authority",
      category: "Financial Services",
      location: "Abu Dhabi",
      employees: "500+",
      rating: 4.8,
      description: "Leading sovereign wealth fund managing global investments",
    },
    {
      name: "Masdar City",
      category: "Technology & Innovation",
      location: "Abu Dhabi",
      employees: "200+",
      rating: 4.6,
      description: "Sustainable urban development and clean technology hub",
    },
    {
      name: "Etihad Airways",
      category: "Aviation",
      location: "Abu Dhabi",
      employees: "1000+",
      rating: 4.4,
      description: "National airline of the UAE connecting the world",
    },
    {
      name: "Abu Dhabi University",
      category: "Education",
      location: "Abu Dhabi",
      employees: "300+",
      rating: 4.7,
      description: "Premier educational institution fostering innovation",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Organization Directory
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Connect with leading organizations across Abu Dhabi's enterprise
            ecosystem
          </p>

          {/* Search and Filter Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search organizations..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter size={20} />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {organizations.map((org, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {org.name}
                    </h3>
                    <p className="text-sm text-gray-600">{org.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">
                    {org.rating}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{org.description}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {org.location}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  {org.employees}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors">
            Load More Organizations
          </button>
        </div>
      </div>
    </div>
  );
}
