import React, { useEffect, useState, useRef, Component } from "react";
import {
  Calendar,
  BookOpen,
  Newspaper,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Tag,
  FileText,
  Download,
  ExternalLink,
  Calculator,
  Loader,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FadeInUpOnScroll, StaggeredFadeIn, useInView } from "./AnimationUtils";
import { EventCard, NewsCard, ResourceCard } from "./CardComponents";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl: string;
  source?: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  imageUrl?: string;
  organizer?: string;
}

interface Resource {
  id: string;
  title: string;
  type: string;
  description: string;
  icon: React.ReactNode;
  downloadUrl?: string;
  fileSize?: string;
  downloadCount?: number;
  lastUpdated?: string;
  isExternal?: boolean;
  tags?: string[];
}

interface KnowledgeHubProps {
  graphqlEndpoint?: string;
}

// Mock data for fallback - keep the existing data
const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "Agile Working at DQ | Not Just for Projects",
    excerpt:
      "Discover how agile principles are helping teams across DQ collaborate faster and deliver with confidence.",
    date: "August 21, 2025",
    category: "Agile Working",
    source: "DQ Insights",
    imageUrl:
      "https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "2",
    title: "From Vision to Impact | The DQ Storybook Goes Live!",
    excerpt:
      "The DQ Storybook is now published—bringing together our competencies, values, and transformation journey.",
    date: "August 14, 2025",
    category: "Strategy",
    source: "DQ Governance Office",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "3",
    title: "Leadership Principles | What’s Your Superpower?",
    excerpt:
      "Uncover what makes effective leaders thrive at DQ and explore practical tools to grow your leadership strengths.",
    date: "August 19, 2025",
    category: "Leadership",
    source: "DQ Learning Hub",
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "4",
    title: "Grounded in Growth and Emotional Intelligence",
    excerpt:
      "Learn how emotional intelligence drives collaboration, resilience, and growth across our teams.",
    date: "August 8, 2025",
    category: "Culture",
    source: "DQ Culture Team",
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "5",
    title: "Shifts Allocation Guidelines Released",
    excerpt:
      "New workspace guidelines launched to improve workload balance, transparency, and efficiency.",
    date: "July 25, 2025",
    category: "Policy Update",
    source: "DQ Operations",
    imageUrl:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "6",
    title: "New DQ Innovation Hub Opens",
    excerpt:
      "A digital hub for experimentation and collaboration is now live, inviting teams to explore and innovate together.",
    date: "July 10, 2025",
    category: "Innovation",
    source: "DQ Labs",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
];

const events: Event[] = [
  {
    id: "1",
    title: "DQ Strategy & Mission Forum 2025",
    date: "October 18–19, 2025",
    location: "OPAL Tower, Business Bay, Dubai",
    type: "Forum",
    organizer: "Digital Qatalyst",
    imageUrl:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "2",
    title: "Agile Delivery Circle – Sprint Planning Masterclass",
    date: "October 25, 2025",
    location: "OPAL Tower, Business Bay, Dubai",
    type: "Workshop",
    organizer: "DQ Agile office",
    imageUrl:
      "https://images.unsplash.com/photo-1591115765373-5207764f72e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "3",
    title: "Leadership & Emotional Intelligence Session",
    date: "November 4, 2025",
    location: "OPAL Tower, Business Bay, Dubai",
    type: "Workshop",
    organizer: "DQ Culture & Community",
    imageUrl:
      "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "4",
    title: "Data Fluency Week – Power BI Hands-on",
    date: "November 11–15, 2025",
    location: "OPAL Tower, Business Bay, Dubai",
    type: "Bootcamp",
    organizer: "DQ Analytics Office",
    imageUrl:
      "https://images.unsplash.com/photo-1559223607-a43f990c095d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "5",
    title: "Product Growth & Value Streams Meetup",
    date: "November 21, 2025",
    location: "OPAL Tower, Business Bay, Dubai",
    type: "Meetup",
    organizer: "DQ Deploy Team",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
  },
  {
    id: "6",
    title: "DQ End-of-Year Learning Showcase",
    date: "December 10, 2025",
    location: "OPAL Tower, Business Bay, Dubai",
    type: "Showcase",
    organizer: "DQ Academy",
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  },
];

const resources: Resource[] = [
  {
    id: "1",
    title: "DQ Handbook – Working the Catalyst Way",
    type: "Guide",
    description:
      "Your essential guide to Digital Qatalyst — principles, culture, and collaboration practices that power every team.",
    icon: <FileText size={24} className="text-blue-600" />,
    downloadUrl: "#",
    fileSize: "2.5 MB",
    downloadCount: 1847,
    lastUpdated: "January 2024",
    tags: ["Culture", "Guide"],
  },
  {
    id: "2",
    title: "Agile Playbook – SEDU Framework",
    type: "Template",
    description:
      "Standard agile templates and sprint planning boards aligned to the SEDU delivery model for teams across DQ.",
    icon: <BookOpen size={24} className="text-blue-600" />,
    downloadUrl: "#",
    fileSize: "4.1 MB",
    downloadCount: 3254,
    lastUpdated: "December 2023",
    tags: ["Agile", "Delivery"],
  },
  {
    id: "3",
    title: "Power BI Dashboard Starter Pack",
    type: "Toolkit",
    description:
      "Get prebuilt dashboard templates and data model examples for reporting within DQ projects.",
    icon: <FileText size={24} className="text-blue-600" />,
    downloadUrl: "#",
    fileSize: "1.8 MB",
    downloadCount: 5632,
    lastUpdated: "February 2024",
    tags: ["Analytics", "Power BI"],
  },
  {
    id: "4",
    title: "LLAD Template – Repository Setup",
    type: "Template",
    description:
      "A ready-to-use Logical Layered Architecture Document (LLAD) format for Ardoq and Abacus repository configurations.",
    icon: <BookOpen size={24} className="text-blue-600" />,
    downloadUrl: "#",
    fileSize: "3.2 MB",
    downloadCount: 2187,
    lastUpdated: "January 2024",
    tags: ["Architechture", "Template"],
  },
  {
    id: "5",
    title: "DQ Governance & Compliance Guide",
    type: "Guide",
    description:
      "Comprehensive overview of DQ governance workflows, approvals, and compliance practices for associates.",
    icon: <BookOpen size={24} className="text-blue-600" />,
    downloadUrl: "#",
    fileSize: "4.5 MB",
    downloadCount: 8967,
    lastUpdated: "December 2023",
    tags: ["Governace", "Comliance"],
  },
  {
    id: "6",
    title: "Collaboration Toolkit – Viva & Teams",
    type: "Tool",
    description:
      "Quick-access resources for setting up Viva Engage posts, Teams collaboration boards, and L&D channels.",
    icon: <Calculator size={24} className="text-blue-600" />,
    downloadUrl: "#",
    fileSize: "External",
    downloadCount: 12456,
    lastUpdated: "February 2024",
    tags: ["Collaboration", "L&D"],
  },
];

// Define interface for tab items
type TabId = "news" | "events" | "resources";

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

interface SegmentedTabsProps {
  tabs: TabItem[];
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}

const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full flex justify-center mb-6">
      <div className="inline-flex items-center rounded-full bg-white shadow-sm ring-1 ring-black/5 px-1 py-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative mx-0.5 px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8EFF]/40 inline-flex items-center ${
                isActive
                  ? "bg-[#DDE8FF] text-[#030F35] shadow-[inset_0_-2px_0_0_#5B8EFF]"
                  : "text-[#3b4a66] hover:bg-[#F5F8FF]"
              }`}
              aria-pressed={isActive}
            >
              <span className="mr-2" aria-hidden="true">
                {tab.icon}
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader size={40} className="text-blue-600 animate-spin mb-4" />
    <p className="text-gray-600 font-medium">Loading data...</p>
  </div>
);

// Error message component
const ErrorMessage = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle size={40} className="text-red-500 mb-4" />
    <h3 className="text-lg font-bold text-gray-800 mb-2">Error Loading Data</h3>
    <p className="text-gray-600 max-w-md mx-auto">
      {message || "We couldn't load the data. Please try again later."}
    </p>
  </div>
);

// KnowledgeHub Content Component
const KnowledgeHubContent = ({ graphqlEndpoint }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("news");
  const [isTabChanging, setIsTabChanging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  const tabs: TabItem[] = [
    {
      id: "news",
      label: "News",
      icon: <Newspaper size={16} className="#030F35-600" />,
    },
    {
      id: "events",
      label: "Events",
      icon: <Calendar size={16} className="#030F35-600" />,
    },
    {
      id: "resources",
      label: "Resources",
      icon: <BookOpen size={16} className="#030F35-600" />,
    },
  ];

  // Handle tab change with animation
  const handleTabChange = (id: TabId) => {
    if (activeTab === id) return;
    setIsTabChanging(true);
    setTimeout(() => {
      setActiveTab(id);
      setIsTabChanging(false);
    }, 300);
  };

  // Get data based on active tab
  const getNewsData = () => newsItems;
  const getEventsData = () => events;
  const getResourcesData = () => resources;

  // Helper function to get the appropriate icon for a resource type
  const getResourceIconByType = (type) => {
    switch (type?.toLowerCase()) {
      case "guide":
        return <BookOpen size={24} className="#030F35-600" />;
      case "templates":
        return <FileText size={24} className="#030F35-600" />;
      case "tool":
        return <Calculator size={24} className="#030F35-600" />;
      default:
        return <FileText size={24} className="#030F35-600" />;
    }
  };

  // Add this function to handle event registration
  const handleEventRegister = (event: Event) => {
    // Here you can implement what happens when someone registers for an event
    // For example, open a registration modal, navigate to a registration page, etc.
    console.log("Registering for event:", event.title);

    // Example: Open a registration URL if available
    // if (event.registrationUrl) {
    //   window.open(event.registrationUrl, '_blank');
    // }

    // Or show a confirmation message
    alert(`Registration for "${event.title}" will be available soon!`);
  };

  // Add function to handle resource downloads
  const handleResourceDownload = (resource: Resource) => {
    console.log("Downloading resource:", resource.title);

    if (resource.isExternal) {
      // For external resources, open in new tab
      if (resource.downloadUrl) {
        window.open(resource.downloadUrl, "_blank");
      }
    } else {
      // For internal resources, trigger download
      if (resource.downloadUrl) {
        // Create a temporary link element to trigger download
        const link = document.createElement("a");
        link.href = resource.downloadUrl;
        link.download = `${resource.title}.${
          resource.fileSize?.includes("PDF") ? "pdf" : "zip"
        }`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Fallback for demo purposes
        alert(`Download for "${resource.title}" will begin shortly!`);
      }
    }
  };

  // Add function to handle resource access
  const handleResourceAccess = (resource: Resource) => {
    console.log("Accessing resource:", resource.title);

    if (resource.isExternal) {
      // For external resources, open in new tab
      if (resource.downloadUrl) {
        window.open(resource.downloadUrl, "_blank");
      }
    } else {
      // For internal resources, navigate to detail page
      navigate(`/resources/${resource.id}`);
    }
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <FadeInUpOnScroll className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 clamp-1">
            Stay Ahead with Workspace Insights
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto clamp-2">
            Stay current with DQ updates, insights, and events designed to help
            you work smarter and grow every day.
          </p>
        </FadeInUpOnScroll>
        {/* Segmented Tabs */}
        <SegmentedTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        {/* Tab Content with Fade Transition */}
        <div
          className={`transition-opacity duration-300 ${
            isTabChanging ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Loading State */}
          {isLoading && <LoadingIndicator />}
          {/* Error State */}
          {error && !isLoading && <ErrorMessage message={error.message} />}
          {/* News Tab */}
          {activeTab === "news" && !isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getNewsData().map((item, index) => (
                <div
                  key={item.id}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <NewsCard
                    content={{
                      title: item.title,
                      description: item.excerpt,
                      imageUrl: item.imageUrl,
                      tags: [item.category],
                      date: item.date,
                      source: item.source,
                    }}
                    onQuickView={() => navigate(`/news/${item.id}`)}
                  />
                </div>
              ))}
            </div>
          )}
          {/* Events Tab */}
          {activeTab === "events" && !isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getEventsData().map((event, index) => (
                <div
                  key={event.id}
                  className="animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <EventCard
                    content={{
                      title: event.title,
                      description: `${event.type} at ${event.location}`,
                      dateTime: event.date,
                      location: event.location,
                      imageUrl: event.imageUrl,
                      tags: [event.type],
                      organizer: event.organizer,
                    }}
                    isUpcoming={index === 0}
                    onQuickView={() => navigate(`/events/${event.id}`)}
                    onRegister={() => handleEventRegister(event)}
                  />
                </div>
              ))}
            </div>
          )}
          {/* Resources Tab */}
          {activeTab === "resources" && !isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getResourcesData().map((resource, index) => (
                <div
                  key={resource.id}
                  className="animate-zoom-in"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <ResourceCard
                    content={{
                      title: resource.title,
                      description: resource.description,
                      type: resource.type,
                      icon: resource.icon,
                      tags: resource.tags,
                      downloadUrl: resource.downloadUrl,
                      fileSize: resource.fileSize,
                      downloadCount: resource.downloadCount,
                      lastUpdated: resource.lastUpdated,
                      isExternal: resource.isExternal,
                    }}
                    onQuickView={() => navigate(`/resources/${resource.id}`)}
                    onAccessResource={() => handleResourceAccess(resource)}
                    onDownload={() => handleResourceDownload(resource)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Add keyframes for animations */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.5s ease-out forwards;
        }
        .animate-zoom-in {
          animation: zoom-in 0.5s ease-out forwards;
        }
        .animate-ripple {
          animation: ripple 0.8s ease-out;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

// Main KnowledgeHub component
const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ graphqlEndpoint }) => {
  // Always render without Apollo since we don't have the dependency
  return <KnowledgeHubContent graphqlEndpoint={null} />;
};

export default KnowledgeHub;
