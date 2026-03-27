import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Shield, Lightbulb } from 'lucide-react';
import { getDesignSystemItemById } from '../../utils/designSystemData';
import DetailPageLayout from '@/components/detail-page/DetailPageLayout';
import type { ContentBlock } from '@/components/detail-page/TabContent';
import type { SidebarConfig } from '@/components/detail-page/MetadataSidebar';
import type { RelatedItem } from '@/components/detail-page/RelatedItems';

export const DesignSystemFrameworkPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const item = cardId ? getDesignSystemItemById(cardId) : null;
  const navigate = useNavigate();

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Design System Not Found</h1>
            <p className="text-gray-600 mb-6">The design system you're looking for doesn't exist.</p>
            <Link
              to="/marketplace/design-system"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a1628] text-white rounded-lg hover:bg-[#162238] transition-colors"
            >
              Back to Design Systems
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getFrameworkName = (type: string) => {
    switch (type) {
      case 'cids': return 'Content Intelligence Design System';
      case 'vds': return 'Video Design System';
      case 'cds': return 'Campaign Design System';
      default: return 'Design System';
    }
  };

  const getServiceDetailPath = (type: string) => {
    switch (type) {
      case 'cids': return '/marketplace/cids-service-detail';
      case 'vds': return '/marketplace/vds-service-detail';
      case 'cds': return '/marketplace/cds-service-detail';
      default: return '/marketplace/design-system';
    }
  };

  const handleStartFramework = () => {
    const servicePath = getServiceDetailPath(item.type);
    navigate(servicePath);
  };

  // Tab content blocks
  const serviceDetailsBlocks: ContentBlock[] = [
    {
      type: "paragraph",
      text: `${getFrameworkName(item.type)} is a comprehensive design system that provides a unified approach to creating consistent, high-quality content. It includes guidelines, components, and tools that help teams work more efficiently and maintain brand consistency across all touchpoints.`
    },
    { type: "heading", text: "Framework Highlights" },
    {
      type: "checklist",
      items: [
        "Comprehensive component library with reusable elements",
        "Clear design guidelines and best practices",
        "Scalable architecture for enterprise-level projects",
        "Cross-platform compatibility and responsive design",
        "Accessibility-first approach with WCAG compliance"
      ]
    },
  ];

  const learningOutcomesBlocks: ContentBlock[] = [
    { type: "heading", text: "What You'll Learn" },
    {
      type: "checklist",
      items: [
        "Understand core design system principles and methodologies",
        "Implement consistent component patterns across projects",
        "Apply accessibility standards and best practices",
        "Maintain brand consistency in all design deliverables",
        "Collaborate effectively using shared design tokens",
        "Scale design systems for enterprise-level applications"
      ]
    },
  ];

  const curriculumBlocks: ContentBlock[] = [
    { type: "heading", text: "Module 1: Introduction to Design Systems" },
    { type: "paragraph", text: "This module introduces the design system framework, its origins, and why it matters for consistent user experiences." },
    { type: "heading", text: "Lessons" },
    {
      type: "checklist",
      items: [
        "Welcome & Framework Overview (5 min)",
        "The Story Behind the System (8 min)",
        "Design Principles & Guidelines (10 min)",
        "Component Architecture (12 min)",
        "Design Tokens & Variables (8 min)",
        "Implementation Best Practices (10 min)",
        "Accessibility Standards (7 min)",
        "Summary & Knowledge Check (5 min)"
      ]
    },
  ];

  const reviewsBlocks: ContentBlock[] = [
    { type: "heading", text: "Reviews & Feedback" },
    { type: "paragraph", text: "Highly rated by design professionals across the organization." },
    {
      type: "custom",
      render: () => (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4.8</div>
              <div className="text-sm text-gray-600">out of 5</div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
                <span className="text-gray-600">(89 reviews)</span>
              </div>
              <p className="text-gray-600">Excellent framework with comprehensive guidelines</p>
            </div>
          </div>
        </div>
      )
    },
  ];

  const frameworkTabs = [
    { id: "details", label: "Service Details", blocks: serviceDetailsBlocks },
    { id: "outcomes", label: "Learning Outcomes", blocks: learningOutcomesBlocks },
    { id: "curriculum", label: "Curriculum", blocks: curriculumBlocks },
    { id: "reviews", label: "Reviews", blocks: reviewsBlocks },
  ];

  const frameworkSidebar: SidebarConfig = {
    summaryTitle: "Framework Summary",
    rows: [
      { label: "Duration", value: "2-3hrs" },
      { label: "Components", value: "50+" },
      { label: "Level", value: "Intermediate" },
      { label: "Type", value: "Framework" },
    ],
    ctaLabel: "Start Framework",
    ctaOnClick: handleStartFramework,
    secondaryCtaLabel: "Save for Later",
    showActions: true,
    tags: ["Design System", "Components", "Guidelines", "Accessibility"]
  };

  const relatedFrameworks: RelatedItem[] = [
    {
      title: "Visual Design System (V.DS)",
      description: "Comprehensive visual design guidelines and components.",
      category: "Framework",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: "Campaign Design System (CDS)",
      description: "Specialized components for campaign and marketing materials.",
      category: "Framework",
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: "Design System Best Practices",
      description: "Learn advanced techniques for design system management.",
      category: "Course",
      icon: <Lightbulb className="h-5 w-5" />
    },
  ];

  return (
    <DetailPageLayout
      title={getFrameworkName(item.type)}
      badge="Framework"
      description={`A comprehensive design system providing unified guidelines and components for consistent, high-impact content.`}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Marketplace", href: "/marketplace" },
        { label: "Design Systems", href: "/marketplace/design-system" },
        { label: item.title }
      ]}
      tabs={frameworkTabs}
      sidebarConfig={frameworkSidebar}
      relatedTitle="Related Frameworks"
      relatedBrowseLabel="Browse all frameworks"
      relatedItems={relatedFrameworks}
    />
  );
};

export default DesignSystemFrameworkPage;