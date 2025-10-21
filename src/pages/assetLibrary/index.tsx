import { useMemo, useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import {
  FileText,
  HomeIcon,
  ChevronRightIcon,
  Eye,
  Download,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SearchBar } from "../../components/SearchBar";
import {
  mockAssetFiles,
  formatFileSize,
  getFileIcon,
  AssetFile,
} from "../../data/assetLibraryFiles";

// Asset Card Component matching BlueprintCard structure
const AssetCard = ({
  asset,
  onView,
  onDownload,
}: {
  asset: AssetFile;
  onView: (asset: AssetFile) => void;
  onDownload: (asset: AssetFile) => void;
}) => (
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
            {asset.name}
          </h3>
          <p className="text-sm text-gray-500 min-h-[20px] mt-1">
            {asset.project || asset.category}
          </p>
        </div>
      </div>
      {/* Description with consistent height */}
      <div className="mb-5">
        <p className="text-sm text-gray-600 line-clamp-3 min-h-[60px] leading-relaxed">
          {asset.description}
        </p>
      </div>
      {/* Tags and Actions in same row - fixed position */}
      <div className="flex justify-between items-center mt-auto">
        <div className="flex flex-wrap gap-1 max-w-[70%]">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium truncate"
            style={{
              backgroundColor: "rgba(26, 46, 110, 0.1)",
              color: "#1A2E6E",
              borderColor: "rgba(26, 46, 110, 0.2)",
              border: "1px solid",
            }}
          >
            {asset.type.toUpperCase()}
          </span>
          {asset.size && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium truncate"
              style={{
                backgroundColor: "rgba(255, 107, 53, 0.1)",
                color: "#FF6B35",
                borderColor: "rgba(255, 107, 53, 0.2)",
                border: "1px solid",
              }}
            >
              {formatFileSize(asset.size)}
            </span>
          )}
        </div>
        <div className="flex space-x-2 flex-shrink-0">
          <button
            onClick={() => onView(asset)}
            className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
            aria-label="View asset"
            title="View asset"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onDownload(asset)}
            className="p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
            aria-label="Download asset"
            title="Download asset"
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
          onClick={() => onView(asset)}
          className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap min-w-[120px] flex-1"
          style={{
            color: "#1A2E6E",
            borderColor: "#1A2E6E",
          }}
        >
          View Details
        </button>
        <button
          onClick={() => onDownload(asset)}
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

export default function AssetLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<AssetFile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    subcategories: true,
    projects: true,
  });

  // Get all assets from mock data
  const allAssets = useMemo(() => mockAssetFiles, []);

  // Get unique values for filters
  const uniqueCategories = useMemo(() => {
    const categorySet = new Set(allAssets.map((asset) => asset.category));
    return Array.from(categorySet).sort();
  }, [allAssets]);

  const uniqueSubcategories = useMemo(() => {
    const subcategorySet = new Set(allAssets.map((asset) => asset.subcategory));
    return Array.from(subcategorySet).sort();
  }, [allAssets]);

  const uniqueProjects = useMemo(() => {
    const projectSet = new Set(
      allAssets.map((asset) => asset.project).filter(Boolean)
    );
    return Array.from(projectSet).sort();
  }, [allAssets]);

  // Filter assets based on search and selected filters
  const filteredAssets = useMemo(() => {
    let filtered = allAssets;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(query) ||
          asset.description.toLowerCase().includes(query) ||
          asset.category.toLowerCase().includes(query) ||
          asset.subcategory.toLowerCase().includes(query) ||
          asset.project?.toLowerCase().includes(query) ||
          asset.author?.toLowerCase().includes(query)
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((asset) =>
        selectedCategories.includes(asset.category)
      );
    }

    // Filter by selected subcategories
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter((asset) =>
        selectedSubcategories.includes(asset.subcategory)
      );
    }

    // Filter by selected projects
    if (selectedProjects.length > 0) {
      filtered = filtered.filter(
        (asset) => asset.project && selectedProjects.includes(asset.project)
      );
    }

    return filtered;
  }, [
    allAssets,
    searchQuery,
    selectedCategories,
    selectedSubcategories,
    selectedProjects,
  ]);

  // Handle filter toggles
  const toggleCategoryFilter = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleSubcategoryFilter = (subcategory: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  const toggleProjectFilter = (project: string) => {
    setSelectedProjects((prev) =>
      prev.includes(project)
        ? prev.filter((p) => p !== project)
        : [...prev, project]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedProjects([]);
    setSearchQuery("");
  };

  // Toggle accordion section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Modal handlers
  const openModal = (asset: AssetFile) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
    document.body.style.overflow = "unset";
  };

  // Download handler
  const handleDownload = (asset: AssetFile) => {
    const link = document.createElement("a");
    link.href = asset.url || "#";
    link.download = `${asset.name}.${asset.type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                >
                  <HomeIcon size={16} className="mr-1" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">
                    Asset Library
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#030F35" }}>
            Asset Library
          </h1>
          <p className="text-gray-600 mb-6">
            Browse shared design, deployment and marketing artefacts. Access
            templates, guides, and resources for your projects.
          </p>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>

          <div className="flex gap-6">
            {/* Filter Sidebar */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Filter size={20} />
                    Filters
                  </h2>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear All
                  </button>
                </div>

                {/* Categories Filter Accordion */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection("categories")}
                    className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3 hover:text-gray-700"
                  >
                    <span>Categories ({uniqueCategories.length})</span>
                    {expandedSections.categories ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  {expandedSections.categories && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uniqueCategories.map((category) => (
                        <label
                          key={category}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategoryFilter(category)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subcategories Filter Accordion */}
                <div className="mb-6">
                  <button
                    onClick={() => toggleSection("subcategories")}
                    className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3 hover:text-gray-700"
                  >
                    <span>Subcategories ({uniqueSubcategories.length})</span>
                    {expandedSections.subcategories ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  {expandedSections.subcategories && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uniqueSubcategories.map((subcategory) => (
                        <label
                          key={subcategory}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubcategories.includes(
                              subcategory
                            )}
                            onChange={() =>
                              toggleSubcategoryFilter(subcategory)
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{subcategory}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Projects Filter Accordion */}
                <div>
                  <button
                    onClick={() => toggleSection("projects")}
                    className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3 hover:text-gray-700"
                  >
                    <span>Projects ({uniqueProjects.length})</span>
                    {expandedSections.projects ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  {expandedSections.projects && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {uniqueProjects.map((project) => (
                        <label
                          key={project}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedProjects.includes(project)}
                            onChange={() => toggleProjectFilter(project)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{project}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Assets Grid */}
            <div className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredAssets.length} asset
                  {filteredAssets.length !== 1 ? "s" : ""}
                </p>
              </div>

              {filteredAssets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {filteredAssets.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      onView={openModal}
                      onDownload={handleDownload}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No assets found
                  </h3>
                  <p className="text-gray-500">
                    Try adjusting your search criteria or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Asset Preview Modal */}
      {isModalOpen && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#1A2E6E" }}
                >
                  <FileText size={24} className="text-white" />
                </div>
                <div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#030F35" }}
                  >
                    {selectedAsset.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedAsset.description}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  {selectedAsset.author && (
                    <span className="flex items-center gap-2">
                      <span
                        className="font-medium"
                        style={{ color: "rgba(26, 46, 110, 0.7)" }}
                      >
                        Author:
                      </span>
                      {selectedAsset.author}
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <span
                      className="font-medium"
                      style={{ color: "rgba(26, 46, 110, 0.7)" }}
                    >
                      Updated:
                    </span>
                    {new Date(selectedAsset.lastModified).toLocaleDateString()}
                  </span>
                  {selectedAsset.size && (
                    <span className="flex items-center gap-2">
                      <span
                        className="font-medium"
                        style={{ color: "rgba(26, 46, 110, 0.7)" }}
                      >
                        Size:
                      </span>
                      {formatFileSize(selectedAsset.size)}
                    </span>
                  )}
                </div>

                {/* Asset Preview Content */}
                <div className="bg-gray-50 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">
                      {getFileIcon(selectedAsset.type)}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                      Asset Preview
                    </h4>
                    <p className="text-gray-500 mb-6">
                      This is a preview of the asset content. In a real
                      implementation, this would show the actual document
                      content or a file viewer.
                    </p>
                    <button
                      onClick={() => handleDownload(selectedAsset)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition-colors"
                      style={{ backgroundColor: "#FF6B35" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#E04A2B";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#FF6B35";
                      }}
                    >
                      <Download size={16} />
                      Download Full Asset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
