import { useMemo, useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import {
  HomeIcon,
  ChevronRightIcon,
  FileText,
  Eye,
  Download,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SearchBar } from "../../components/SearchBar";

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

interface Project {
  id: string;
  name: string;
  description: string;
  blueprints: Blueprint[];
  color: string;
}

// Mock data - replace with actual data from your backend
const projects: Project[] = [
  {
    id: "dtma",
    name: "DTMA - Digital Transformation Management Academy",
    description:
      "Comprehensive training and development programs for digital transformation leaders and practitioners.",
    color: "blue",
    blueprints: [
      {
        id: "dtma-1",
        title: "DTMA Learning Path Architecture",
        description:
          "Complete blueprint for structuring the learning journey and curriculum design.",
        lastUpdated: "2025-10-10",
        author: "Learning Design Team",
        projectId: "dtma",
        projectName: "DTMA - Digital Transformation Management Academy",
        category: "design",
      },
      {
        id: "dtma-2",
        title: "Assessment Framework Blueprint",
        description:
          "Comprehensive framework for evaluating learner progress and competency.",
        lastUpdated: "2025-10-08",
        author: "Assessment Team",
        projectId: "dtma",
        projectName: "DTMA - Digital Transformation Management Academy",
        category: "design",
      },
      {
        id: "dtma-3",
        title: "Platform Integration Design",
        description:
          "Technical blueprint for integrating DTMA with existing DQ platforms.",
        lastUpdated: "2025-10-05",
        author: "Technical Architecture Team",
        projectId: "dtma",
        projectName: "DTMA - Digital Transformation Management Academy",
        category: "develop",
      },
    ],
  },
  {
    id: "dt20",
    name: "DT 2.0 - Digital Transformation Platform",
    description:
      "Next-generation digital transformation platform for enterprise-wide initiatives.",
    color: "indigo",
    blueprints: [
      {
        id: "dt20-1",
        title: "System Architecture Overview",
        description:
          "High-level architecture and technical design for the DT 2.0 platform.",
        lastUpdated: "2025-10-12",
        author: "Solution Architects",
        projectId: "dt20",
        projectName: "DT 2.0 - Digital Transformation Platform",
        category: "design",
      },
      {
        id: "dt20-2",
        title: "User Experience Design",
        description:
          "Comprehensive UX/UI design blueprint with wireframes and prototypes.",
        lastUpdated: "2025-10-11",
        author: "UX Design Team",
        projectId: "dt20",
        projectName: "DT 2.0 - Digital Transformation Platform",
        category: "design",
      },
      {
        id: "dt20-3",
        title: "Integration Strategy",
        description:
          "Blueprint for integrating with third-party systems and APIs.",
        lastUpdated: "2025-10-09",
        author: "Integration Team",
        projectId: "dt20",
        projectName: "DT 2.0 - Digital Transformation Platform",
        category: "develop",
      },
      {
        id: "dt20-4",
        title: "Security & Compliance Framework",
        description:
          "Security architecture and compliance requirements documentation.",
        lastUpdated: "2025-10-07",
        author: "Security Team",
        projectId: "dt20",
        projectName: "DT 2.0 - Digital Transformation Platform",
        category: "deploy",
      },
    ],
  },
  {
    id: "customer-portal",
    name: "Customer Portal Enhancement",
    description:
      "Enhanced customer-facing portal with improved functionality and user experience.",
    color: "cyan",
    blueprints: [
      {
        id: "portal-1",
        title: "Portal Redesign Blueprint",
        description: "Complete redesign strategy with modern UI/UX principles.",
        lastUpdated: "2025-10-06",
        author: "Portal Team",
        projectId: "customer-portal",
        projectName: "Customer Portal Enhancement",
        category: "design",
      },
      {
        id: "portal-2",
        title: "Self-Service Features",
        description:
          "Blueprint for implementing customer self-service capabilities.",
        lastUpdated: "2025-10-04",
        author: "Product Team",
        projectId: "customer-portal",
        projectName: "Customer Portal Enhancement",
        category: "develop",
      },
    ],
  },
  {
    id: "data-analytics",
    name: "Data Analytics Platform",
    description:
      "Advanced analytics and business intelligence platform for data-driven decision making.",
    color: "purple",
    blueprints: [
      {
        id: "analytics-1",
        title: "Data Pipeline Architecture",
        description: "Blueprint for ETL processes and data warehouse design.",
        lastUpdated: "2025-10-03",
        author: "Data Engineering Team",
        projectId: "data-analytics",
        projectName: "Data Analytics Platform",
        category: "discern",
      },
      {
        id: "analytics-2",
        title: "Dashboard & Visualization Design",
        description:
          "Design patterns for analytics dashboards and data visualization.",
        lastUpdated: "2025-10-01",
        author: "BI Team",
        projectId: "data-analytics",
        projectName: "Data Analytics Platform",
        category: "design",
      },
      {
        id: "analytics-3",
        title: "AI/ML Integration Blueprint",
        description:
          "Framework for integrating machine learning models and AI capabilities.",
        lastUpdated: "2025-09-28",
        author: "AI/ML Team",
        projectId: "data-analytics",
        projectName: "Data Analytics Platform",
        category: "develop",
      },
    ],
  },
];

// Additional standalone blueprints for each category
const additionalBlueprints: Blueprint[] = [
  // Discern blueprints
  {
    id: "discern-1",
    title: "Portfolio Analytics Dashboard",
    description:
      "Comprehensive dashboard for analyzing organizational portfolio performance and identifying optimization opportunities.",
    lastUpdated: "2025-01-15",
    author: "Analytics Team",
    url: "#",
    projectId: "standalone",
    projectName: "Portfolio Management",
    category: "discern",
  },
  {
    id: "discern-2",
    title: "Blueprint Repository Index",
    description:
      "Centralized index of all blueprint repositories with search and categorization capabilities.",
    lastUpdated: "2025-01-12",
    author: "Repository Team",
    url: "#",
    projectId: "standalone",
    projectName: "Repository Management",
    category: "discern",
  },
  {
    id: "discern-3",
    title: "Knowledge Insights Engine",
    description:
      "AI-powered insights engine for extracting actionable knowledge from organizational data.",
    lastUpdated: "2025-01-10",
    author: "AI/ML Team",
    url: "#",
    projectId: "standalone",
    projectName: "Knowledge Management",
    category: "discern",
  },
  {
    id: "discern-4",
    title: "Data Visualization Framework",
    description:
      "Standardized framework for creating consistent and effective data visualizations.",
    lastUpdated: "2025-01-08",
    author: "Visualization Team",
    url: "#",
    projectId: "standalone",
    projectName: "Data Visualization",
    category: "discern",
  },
  // Design blueprints
  {
    id: "designs-1",
    title: "Requirements Specification Template",
    description:
      "Comprehensive template for documenting system requirements with validation frameworks.",
    lastUpdated: "2025-01-14",
    author: "Requirements Team",
    url: "#",
    projectId: "standalone",
    projectName: "Requirements Management",
    category: "design",
  },
  {
    id: "designs-2",
    title: "High-Level Architecture Patterns",
    description:
      "Collection of proven architectural patterns for enterprise system design.",
    lastUpdated: "2025-01-11",
    author: "Architecture Team",
    url: "#",
    projectId: "standalone",
    projectName: "Architecture Patterns",
    category: "design",
  },
  {
    id: "designs-3",
    title: "Low-Level Design Specifications",
    description:
      "Detailed technical specifications for component-level system design.",
    lastUpdated: "2025-01-09",
    author: "Technical Design Team",
    url: "#",
    projectId: "standalone",
    projectName: "Technical Design",
    category: "design",
  },
  {
    id: "designs-4",
    title: "Design System Blueprint",
    description:
      "Comprehensive design system blueprint with UI/UX guidelines and components.",
    lastUpdated: "2025-01-07",
    author: "Design Team",
    url: "#",
    projectId: "standalone",
    projectName: "Design System",
    category: "design",
  },
  // Develop blueprints
  {
    id: "develop-1",
    title: "Development Standards Framework",
    description:
      "Comprehensive framework for maintaining consistent development practices across teams.",
    lastUpdated: "2025-01-13",
    author: "Development Team",
    url: "#",
    projectId: "standalone",
    projectName: "Development Standards",
    category: "develop",
  },
  {
    id: "develop-2",
    title: "Code Review Guidelines",
    description:
      "Detailed guidelines for conducting effective code reviews and maintaining code quality.",
    lastUpdated: "2025-01-10",
    author: "Quality Assurance Team",
    url: "#",
    projectId: "standalone",
    projectName: "Code Quality",
    category: "develop",
  },
  {
    id: "develop-3",
    title: "Testing Strategy Blueprint",
    description:
      "Comprehensive testing strategy covering unit, integration, and end-to-end testing approaches.",
    lastUpdated: "2025-01-08",
    author: "QA Team",
    url: "#",
    projectId: "standalone",
    projectName: "Testing Strategy",
    category: "develop",
  },
  {
    id: "develop-4",
    title: "CI/CD Pipeline Design",
    description:
      "Blueprint for designing continuous integration and deployment pipelines.",
    lastUpdated: "2025-01-06",
    author: "DevOps Team",
    url: "#",
    projectId: "standalone",
    projectName: "CI/CD Pipeline",
    category: "develop",
  },
  // Deploy blueprints
  {
    id: "deploy-1",
    title: "Solution Deployment Patterns",
    description:
      "Standardized patterns for deploying enterprise solutions across different environments.",
    lastUpdated: "2025-01-13",
    author: "DevOps Team",
    url: "#",
    projectId: "standalone",
    projectName: "Deployment Patterns",
    category: "deploy",
  },
  {
    id: "deploy-2",
    title: "Configuration Management Guide",
    description:
      "Comprehensive guide for managing system configurations and environment variables.",
    lastUpdated: "2025-01-10",
    author: "Configuration Team",
    url: "#",
    projectId: "standalone",
    projectName: "Configuration Management",
    category: "deploy",
  },
  {
    id: "deploy-3",
    title: "Monitoring & Alerting Framework",
    description:
      "Framework for implementing comprehensive monitoring and alerting systems.",
    lastUpdated: "2025-01-08",
    author: "Operations Team",
    url: "#",
    projectId: "standalone",
    projectName: "Monitoring Framework",
    category: "deploy",
  },
  {
    id: "deploy-4",
    title: "Disaster Recovery Plan",
    description:
      "Comprehensive disaster recovery and business continuity planning blueprint.",
    lastUpdated: "2025-01-05",
    author: "Operations Team",
    url: "#",
    projectId: "standalone",
    projectName: "Disaster Recovery",
    category: "deploy",
  },
];

export default function BlueprintsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    projects: true,
    categories: true,
  });

  // Get all blueprints from projects and additional blueprints
  const allBlueprints = useMemo(() => {
    const projectBlueprints = projects.flatMap((project) =>
      project.blueprints.map((blueprint) => ({
        ...blueprint,
        projectId: project.id,
        projectName: project.name,
      }))
    );
    return [...projectBlueprints, ...additionalBlueprints];
  }, []);

  // Get unique projects for filter
  const uniqueProjects = useMemo(() => {
    const projectSet = new Set(allBlueprints.map((bp) => bp.projectName));
    return Array.from(projectSet).sort();
  }, [allBlueprints]);

  // Filter blueprints based on search and selected filters
  const filteredBlueprints = useMemo(() => {
    let filtered = allBlueprints;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (blueprint) =>
          blueprint.title.toLowerCase().includes(query) ||
          blueprint.description.toLowerCase().includes(query) ||
          blueprint.projectName.toLowerCase().includes(query) ||
          blueprint.author?.toLowerCase().includes(query)
      );
    }

    // Filter by selected projects
    if (selectedProjects.length > 0) {
      filtered = filtered.filter((blueprint) =>
        selectedProjects.includes(blueprint.projectName)
      );
    }

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((blueprint) =>
        selectedCategories.includes(blueprint.category)
      );
    }

    return filtered;
  }, [allBlueprints, searchQuery, selectedProjects, selectedCategories]);

  // Handle project filter toggle
  const toggleProjectFilter = (projectName: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectName)
        ? prev.filter((p) => p !== projectName)
        : [...prev, projectName]
    );
  };

  // Handle category filter toggle
  const toggleCategoryFilter = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedProjects([]);
    setSelectedCategories([]);
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
  const openModal = (blueprint: Blueprint) => {
    setSelectedBlueprint(blueprint);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlueprint(null);
    document.body.style.overflow = "unset";
  };

  // Download handler
  const handleDownload = (blueprint: Blueprint) => {
    const link = document.createElement("a");
    link.href = "#";
    link.download = `${blueprint.title}.pdf`;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <span className="ml-1 text-gray-500 md:ml-2">Blueprints</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#030F35" }}>
            DQ Blueprints
          </h1>
          <p className="text-gray-600 mb-6">
            Explore comprehensive blueprints for digital transformation
            projects. Use filters to narrow down by project or category.
          </p>

          <div className="flex gap-6">
            {/* Filter Sidebar */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
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

                {/* Search Bar */}
                <div className="mb-6">
                  <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </div>

                {/* Projects Filter Accordion */}
                <div className="mb-6">
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
                      {uniqueProjects.map((projectName) => (
                        <label
                          key={projectName}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedProjects.includes(projectName)}
                            onChange={() => toggleProjectFilter(projectName)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{projectName}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Categories Filter Accordion */}
                <div>
                  <button
                    onClick={() => toggleSection("categories")}
                    className="flex items-center justify-between w-full text-sm font-medium text-gray-900 mb-3 hover:text-gray-700"
                  >
                    <span>Categories (4)</span>
                    {expandedSections.categories ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>
                  {expandedSections.categories && (
                    <div className="space-y-2">
                      {[
                        { id: "discern", name: "Discern" },
                        { id: "design", name: "Design" },
                        { id: "develop", name: "Develop" },
                        { id: "deploy", name: "Deploy" },
                      ].map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => toggleCategoryFilter(category.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{category.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Blueprints Grid */}
            <div className="flex-1">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredBlueprints.length} blueprint
                  {filteredBlueprints.length !== 1 ? "s" : ""}
                </p>
              </div>

              {filteredBlueprints.length > 0 ? (
                <div className="grid gap-4 grid-cols-2">
                  {filteredBlueprints.map((blueprint) => (
                    <div
                      key={blueprint.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: "#1A2E6E" }}
                          >
                            <FileText size={24} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="text-xs px-2 py-1 rounded-full text-white font-medium"
                              style={{
                                backgroundColor:
                                  blueprint.category === "discern" ||
                                  blueprint.category === "develop"
                                    ? "#1A2E6E"
                                    : "#FF6B35",
                              }}
                            >
                              {blueprint.category.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {blueprint.projectName}
                            </span>
                          </div>
                          <h3
                            className="text-lg font-semibold mb-2"
                            style={{ color: "#030F35" }}
                          >
                            {blueprint.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            {blueprint.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                            {blueprint.author && (
                              <span className="flex items-center gap-1">
                                <span
                                  className="font-medium"
                                  style={{ color: "rgba(26, 46, 110, 0.7)" }}
                                >
                                  Author:
                                </span>
                                {blueprint.author}
                              </span>
                            )}
                            {blueprint.lastUpdated && (
                              <span className="flex items-center gap-1">
                                <span
                                  className="font-medium"
                                  style={{ color: "rgba(26, 46, 110, 0.7)" }}
                                >
                                  Updated:
                                </span>
                                {new Date(
                                  blueprint.lastUpdated
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(blueprint)}
                              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                              style={{ backgroundColor: "#FF6B35" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#E04A2B";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#FF6B35";
                              }}
                              title="View Blueprint"
                            >
                              <Eye size={16} />
                              View
                            </button>
                            <button
                              onClick={() => handleDownload(blueprint)}
                              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                              style={{ backgroundColor: "#1A2E6E" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#15255A";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#1A2E6E";
                              }}
                              title="Download Blueprint"
                            >
                              <Download size={16} />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No blueprints found
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

      {/* Blueprint Preview Modal */}
      {isModalOpen && selectedBlueprint && (
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
                    {selectedBlueprint.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedBlueprint.description}
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
                  {selectedBlueprint.author && (
                    <span className="flex items-center gap-2">
                      <span
                        className="font-medium"
                        style={{ color: "rgba(26, 46, 110, 0.7)" }}
                      >
                        Author:
                      </span>
                      {selectedBlueprint.author}
                    </span>
                  )}
                  {selectedBlueprint.lastUpdated && (
                    <span className="flex items-center gap-2">
                      <span
                        className="font-medium"
                        style={{ color: "rgba(26, 46, 110, 0.7)" }}
                      >
                        Updated:
                      </span>
                      {new Date(
                        selectedBlueprint.lastUpdated
                      ).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Blueprint Preview Content */}
                <div className="bg-gray-50 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <FileText
                      size={64}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                      Blueprint Preview
                    </h4>
                    <p className="text-gray-500 mb-6">
                      This is a preview of the blueprint content. In a real
                      implementation, this would show the actual blueprint
                      document or a PDF viewer.
                    </p>
                    <button
                      onClick={() => handleDownload(selectedBlueprint)}
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
                      Download Full Document
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
