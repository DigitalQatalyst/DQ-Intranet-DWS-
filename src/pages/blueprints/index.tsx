import React, { useMemo, useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { MarketplaceCard } from "../../components/Cards";
import { ResponsiveCardGrid } from "../../components/Cards/ResponsiveCardGrid";
import {
  ArrowLeft,
  HomeIcon,
  ChevronRightIcon,
  FolderOpen,
  Search,
  Palette,
  Settings,
  Zap,
  FileText,
  Eye,
  Download,
  X,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { SearchBar } from "../../components/SearchBar";

interface Blueprint {
  id: string;
  title: string;
  description: string;
  lastUpdated?: string;
  author?: string;
  url?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  blueprints: Blueprint[];
  color: string;
}

interface Folder {
  id: string;
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  color: "blue" | "orange";
  content: string[];
  purpose: string;
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
      },
      {
        id: "dtma-2",
        title: "Assessment Framework Blueprint",
        description:
          "Comprehensive framework for evaluating learner progress and competency.",
        lastUpdated: "2025-10-08",
        author: "Assessment Team",
      },
      {
        id: "dtma-3",
        title: "Platform Integration Design",
        description:
          "Technical blueprint for integrating DTMA with existing DQ platforms.",
        lastUpdated: "2025-10-05",
        author: "Technical Architecture Team",
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
      },
      {
        id: "dt20-2",
        title: "User Experience Design",
        description:
          "Comprehensive UX/UI design blueprint with wireframes and prototypes.",
        lastUpdated: "2025-10-11",
        author: "UX Design Team",
      },
      {
        id: "dt20-3",
        title: "Integration Strategy",
        description:
          "Blueprint for integrating with third-party systems and APIs.",
        lastUpdated: "2025-10-09",
        author: "Integration Team",
      },
      {
        id: "dt20-4",
        title: "Security & Compliance Framework",
        description:
          "Security architecture and compliance requirements documentation.",
        lastUpdated: "2025-10-07",
        author: "Security Team",
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
      },
      {
        id: "portal-2",
        title: "Self-Service Features",
        description:
          "Blueprint for implementing customer self-service capabilities.",
        lastUpdated: "2025-10-04",
        author: "Product Team",
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
      },
      {
        id: "analytics-2",
        title: "Dashboard & Visualization Design",
        description:
          "Design patterns for analytics dashboards and data visualization.",
        lastUpdated: "2025-10-01",
        author: "BI Team",
      },
      {
        id: "analytics-3",
        title: "AI/ML Integration Blueprint",
        description:
          "Framework for integrating machine learning models and AI capabilities.",
        lastUpdated: "2025-09-28",
        author: "AI/ML Team",
      },
    ],
  },
];

// Folder definitions
const folders: Folder[] = [
  {
    id: "discern",
    name: "DISCERN",
    description:
      "Explore and analyze portfolio data — access blueprint repositories and insights",
    icon: Search,
    color: "blue",
    purpose:
      "Users explore organizational portfolios, view blueprint repositories, and analyze data to identify opportunities or reference models.",
    content: [
      "Blueprint Repositories (Repo Blueprints)",
      "Portfolio Dashboards",
      "Knowledge Insights",
      "Data Visualizations",
    ],
  },
  {
    id: "designs",
    name: "DESIGNS",
    description:
      "Architect and define solutions — translate insights into design specifications",
    icon: Palette,
    color: "orange",
    purpose:
      "Users access architectural and solution design blueprints that define system structure, workflows, and design templates.",
    content: [
      "Requirements Specification Reports (RSR)",
      "High-Level Architecture Designs (HLAD)",
      "Low-Level Architecture Designs (LLAD)",
      "Design Blueprints / Specs",
    ],
  },
  {
    id: "deploys",
    name: "DEPLOYS",
    description:
      "Build, integrate, and operationalize — implement ready-to-use solution patterns",
    icon: Zap,
    color: "blue",
    purpose:
      "Users deploy or configure internal DWS solutions using standardized patterns, build guides, and component-level blueprints.",
    content: [
      "Solution Patterns",
      "Deployment Plans",
      "Configuration Guides",
      "Test Cases / QA Reports",
    ],
  },
  {
    id: "drive",
    name: "DRIVE",
    description:
      "Support and evolve — manage operations, feedback, and continuous improvement",
    icon: Settings,
    color: "orange",
    purpose:
      "Users access support tools, submit service or feedback requests, and view reports for continuous optimization and improvement.",
    content: [
      "Operations Manuals",
      "Support & Maintenance Plans",
      "Feedback Reports",
      "Service Requests",
    ],
  },
];

// Dummy blueprint data for each folder
const folderBlueprints: Record<string, Blueprint[]> = {
  discern: [
    {
      id: "discern-1",
      title: "Portfolio Analytics Dashboard",
      description:
        "Comprehensive dashboard for analyzing organizational portfolio performance and identifying optimization opportunities.",
      lastUpdated: "2025-01-15",
      author: "Analytics Team",
      url: "#",
    },
    {
      id: "discern-2",
      title: "Blueprint Repository Index",
      description:
        "Centralized index of all blueprint repositories with search and categorization capabilities.",
      lastUpdated: "2025-01-12",
      author: "Repository Team",
      url: "#",
    },
    {
      id: "discern-3",
      title: "Knowledge Insights Engine",
      description:
        "AI-powered insights engine for extracting actionable knowledge from organizational data.",
      lastUpdated: "2025-01-10",
      author: "AI/ML Team",
      url: "#",
    },
    {
      id: "discern-4",
      title: "Data Visualization Framework",
      description:
        "Standardized framework for creating consistent and effective data visualizations.",
      lastUpdated: "2025-01-08",
      author: "Visualization Team",
      url: "#",
    },
  ],
  designs: [
    {
      id: "designs-1",
      title: "Requirements Specification Template",
      description:
        "Comprehensive template for documenting system requirements with validation frameworks.",
      lastUpdated: "2025-01-14",
      author: "Requirements Team",
      url: "#",
    },
    {
      id: "designs-2",
      title: "High-Level Architecture Patterns",
      description:
        "Collection of proven architectural patterns for enterprise system design.",
      lastUpdated: "2025-01-11",
      author: "Architecture Team",
      url: "#",
    },
    {
      id: "designs-3",
      title: "Low-Level Design Specifications",
      description:
        "Detailed technical specifications for component-level system design.",
      lastUpdated: "2025-01-09",
      author: "Technical Design Team",
      url: "#",
    },
    {
      id: "designs-4",
      title: "Design System Blueprint",
      description:
        "Comprehensive design system blueprint with UI/UX guidelines and components.",
      lastUpdated: "2025-01-07",
      author: "Design Team",
      url: "#",
    },
  ],
  deploys: [
    {
      id: "deploys-1",
      title: "Solution Deployment Patterns",
      description:
        "Standardized patterns for deploying enterprise solutions across different environments.",
      lastUpdated: "2025-01-13",
      author: "DevOps Team",
      url: "#",
    },
    {
      id: "deploys-2",
      title: "Configuration Management Guide",
      description:
        "Comprehensive guide for managing system configurations and environment variables.",
      lastUpdated: "2025-01-10",
      author: "Configuration Team",
      url: "#",
    },
    {
      id: "deploys-3",
      title: "Integration Testing Framework",
      description:
        "Automated testing framework for validating system integrations and deployments.",
      lastUpdated: "2025-01-08",
      author: "QA Team",
      url: "#",
    },
    {
      id: "deploys-4",
      title: "Deployment Automation Scripts",
      description:
        "Collection of reusable scripts for automating deployment processes.",
      lastUpdated: "2025-01-06",
      author: "Automation Team",
      url: "#",
    },
  ],
  drive: [
    {
      id: "drive-1",
      title: "Operations Manual Template",
      description:
        "Standardized template for creating comprehensive operations and maintenance manuals.",
      lastUpdated: "2025-01-12",
      author: "Operations Team",
      url: "#",
    },
    {
      id: "drive-2",
      title: "Support Process Framework",
      description:
        "Framework for managing support requests and maintenance activities.",
      lastUpdated: "2025-01-09",
      author: "Support Team",
      url: "#",
    },
    {
      id: "drive-3",
      title: "Feedback Collection System",
      description:
        "System for collecting, analyzing, and acting on user feedback and improvement suggestions.",
      lastUpdated: "2025-01-07",
      author: "Feedback Team",
      url: "#",
    },
    {
      id: "drive-4",
      title: "Service Request Management",
      description:
        "Blueprint for managing service requests and tracking resolution progress.",
      lastUpdated: "2025-01-05",
      author: "Service Management Team",
      url: "#",
    },
  ],
};

export default function BlueprintsPage() {
  const { projectId, folderId } = useParams<{
    projectId?: string;
    folderId?: string;
  }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter projects and blueprints based on search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;

    const query = searchQuery.toLowerCase();
    return projects
      .map((project) => ({
        ...project,
        blueprints: project.blueprints.filter(
          (blueprint) =>
            blueprint.title.toLowerCase().includes(query) ||
            blueprint.description.toLowerCase().includes(query) ||
            project.name.toLowerCase().includes(query)
        ),
      }))
      .filter(
        (project) =>
          project.name.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.blueprints.length > 0
      );
  }, [searchQuery]);

  const currentProject = projectId
    ? projects.find((p) => p.id === projectId)
    : null;

  const showProjects = !projectId;
  const showFolders = !!projectId && !!currentProject && !folderId;
  const showBlueprints = !!projectId && !!currentProject && !!folderId;

  const currentFolder = folderId
    ? folders.find((f) => f.id === folderId)
    : null;
  const currentBlueprints = folderId ? folderBlueprints[folderId] || [] : [];

  // Simple no-op handler
  const noop = () => undefined;

  // Modal handlers
  const openModal = (blueprint: Blueprint) => {
    setSelectedBlueprint(blueprint);
    setIsModalOpen(true);

    // Prevent background scrolling
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlueprint(null);

    // Restore background scrolling
    document.body.style.overflow = "unset";
  };

  // Cleanup effect to restore scrolling when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Download handler
  const handleDownload = (blueprint: Blueprint) => {
    // Create a dummy download link for now
    const link = document.createElement("a");
    link.href = "#"; // Replace with actual blueprint URL
    link.download = `${blueprint.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="container mx-auto px-0">
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
                    {showFolders ? (
                      <Link
                        to="/blueprints"
                        className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                      >
                        Blueprints
                      </Link>
                    ) : (
                      <span className="ml-1 text-gray-500 md:ml-2">
                        Blueprints
                      </span>
                    )}
                  </div>
                </li>
                {showFolders && currentProject && (
                  <li aria-current="page">
                    <div className="flex items-center">
                      <ChevronRightIcon size={16} className="text-gray-400" />
                      <span className="ml-1 text-gray-500 md:ml-2">
                        {currentProject.name}
                      </span>
                    </div>
                  </li>
                )}
                {showBlueprints && currentProject && currentFolder && (
                  <>
                    <li>
                      <div className="flex items-center">
                        <ChevronRightIcon size={16} className="text-gray-400" />
                        <Link
                          to={`/blueprints/${projectId}`}
                          className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                        >
                          {currentProject.name}
                        </Link>
                      </div>
                    </li>
                    <li aria-current="page">
                      <div className="flex items-center">
                        <ChevronRightIcon size={16} className="text-gray-400" />
                        <span className="ml-1 text-gray-500 md:ml-2">
                          {currentFolder.name}
                        </span>
                      </div>
                    </li>
                  </>
                )}
              </ol>
            </nav>

            {/* Page Header */}
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "#030F35" }}
            >
              DQ Blueprints
            </h1>
            <p className="text-gray-600 mb-6">
              Welcome to the DQ Blueprints page. Explore a variety of blueprints
              for our digital transformation projects. Click on a project name
              below to view the associated blueprints. Use the search bar to
              find specific blueprints or browse by project.
            </p>

            {/* Search Bar - Only show on projects view */}
            {showProjects && (
              <div className="mb-6">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>
            )}
          </div>

          {/* Back Button */}
          {showFolders && (
            <button
              className="mb-4 inline-flex items-center gap-2 transition-colors hover:opacity-80"
              style={{ color: "#1A2E6E" }}
              onClick={() => navigate("/blueprints")}
            >
              <ArrowLeft size={18} /> Back to Projects
            </button>
          )}
          {showBlueprints && (
            <button
              className="mb-4 inline-flex items-center gap-2 transition-colors hover:opacity-80"
              style={{ color: "#1A2E6E" }}
              onClick={() => navigate(`/blueprints/${projectId}`)}
            >
              <ArrowLeft size={18} /> Back to Folders
            </button>
          )}

          {/* Projects Grid */}
          {showProjects && (
            <ResponsiveCardGrid>
              {filteredProjects.map((project) => {
                const item = {
                  id: project.id,
                  title: project.name,
                  description: project.description,
                  provider: {
                    name: `${project.blueprints.length} Blueprint${
                      project.blueprints.length !== 1 ? "s" : ""
                    }`,
                    logoUrl:
                      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
                  },
                  tags: [project.color.toUpperCase()],
                };
                return (
                  <div key={project.id} className="blueprint-card">
                    <style>{`.blueprint-card button:empty{display:none}`}</style>
                    <MarketplaceCard
                      item={item}
                      config={{
                        primaryCTA: "",
                        secondaryCTA: "View Blueprints",
                      }}
                      onQuickView={noop}
                      onViewDetails={() =>
                        navigate(`/blueprints/${project.id}`)
                      }
                      onToggleBookmark={noop}
                      onAddToComparison={noop}
                      onPrimaryAction={noop}
                    />
                  </div>
                );
              })}
            </ResponsiveCardGrid>
          )}

          {/* No Results Message */}
          {showProjects && filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria
              </p>
            </div>
          )}

          {/* Folders Grid */}
          {showFolders && currentProject && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentProject.name}
                </h2>
                <p className="text-gray-600">{currentProject.description}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {folders.map((folder) => {
                  const IconComponent = folder.icon;

                  // Professional color mixing for each folder type
                  const getFolderColors = (folderId: string) => {
                    switch (folderId) {
                      case "discern":
                        return {
                          iconBg: "#1A2E6E", // Deep blue
                          cardBg:
                            "linear-gradient(135deg, rgba(26, 46, 110, 0.03) 0%, rgba(3, 15, 53, 0.02) 100%)",
                          hoverArrow: "#1A2E6E",
                        };
                      case "designs":
                        return {
                          iconBg: "#FF6B35", // Orangeish
                          cardBg:
                            "linear-gradient(135deg, rgba(255, 107, 53, 0.03) 0%, rgba(251, 85, 53, 0.02) 100%)",
                          hoverArrow: "#FF6B35",
                        };
                      case "deploys":
                        return {
                          iconBg: "#1A2E6E", // Deep blue
                          cardBg:
                            "linear-gradient(135deg, rgba(26, 46, 110, 0.03) 0%, rgba(3, 15, 53, 0.02) 100%)",
                          hoverArrow: "#1A2E6E",
                        };
                      case "drive":
                        return {
                          iconBg: "#FF6B35", // Orangeish
                          cardBg:
                            "linear-gradient(135deg, rgba(255, 107, 53, 0.03) 0%, rgba(251, 85, 53, 0.02) 100%)",
                          hoverArrow: "#FF6B35",
                        };
                      default:
                        return {
                          iconBg: "#1A2E6E",
                          cardBg:
                            "linear-gradient(135deg, rgba(26, 46, 110, 0.02) 0%, rgba(3, 15, 53, 0.02) 100%)",
                          hoverArrow: "#1A2E6E",
                        };
                    }
                  };

                  const colors = getFolderColors(folder.id);

                  return (
                    <div
                      key={folder.id}
                      className="group relative border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
                      style={{
                        background: colors.cardBg,
                      }}
                      onClick={() => {
                        navigate(`/blueprints/${projectId}/${folder.id}`);
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div
                            className="p-3 rounded-xl transition-transform group-hover:scale-105"
                            style={{
                              backgroundColor: colors.iconBg,
                            }}
                          >
                            <IconComponent size={28} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-xl font-bold mb-2"
                            style={{ color: "#030F35" }}
                          >
                            {folder.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                            {folder.description}
                          </p>
                          <p className="text-xs text-gray-500 mb-4 italic">
                            {folder.purpose}
                          </p>
                          <div className="space-y-1">
                            {folder.content.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-xs text-gray-600"
                              >
                                <div
                                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{
                                    backgroundColor: "rgba(26, 46, 110, 0.6)",
                                  }}
                                />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor: colors.hoverArrow,
                          }}
                        >
                          <ArrowLeft
                            size={16}
                            className="text-white rotate-180"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Blueprints List */}
          {showBlueprints && currentProject && currentFolder && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentFolder.name}
                </h2>
                <p className="text-gray-600">{currentFolder.description}</p>
              </div>

              {currentBlueprints.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {currentBlueprints.map((blueprint) => (
                    <div
                      key={blueprint.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255, 107, 53, 0.02) 0%, rgba(26, 46, 110, 0.02) 50%, rgba(3, 15, 53, 0.03) 100%)",
                      }}
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
                <div className="text-center py-12 text-gray-500">
                  <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                  <p>No blueprints available for this folder yet.</p>
                </div>
              )}
            </div>
          )}
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
