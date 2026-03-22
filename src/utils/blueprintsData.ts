// Utility to get blueprints data for integration with guides marketplace
// This exports the blueprints data structure from the blueprints page

export interface Blueprint {
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

export interface Project {
  id: string;
  name: string;
  description: string;
  blueprints: Blueprint[];
  color: string;
}

// Mock projects data (same as in blueprints page)
const projects: Project[] = [
  {
    id: "dtma",
    name: "DTMA - Digital Transformation Management Academy",
    description: "Comprehensive training and development programs for digital transformation leaders and practitioners.",
    color: "blue",
    blueprints: [
      {
        id: "dtma-1",
        title: "DTMA Learning Path Architecture",
        description: "Complete blueprint for structuring the learning journey and curriculum design.",
        lastUpdated: "2025-10-10",
        author: "Learning Design Team",
        projectId: "dtma",
        projectName: "DTMA - Digital Transformation Management Academy",
        category: "design",
      },
      {
        id: "dtma-2",
        title: "Assessment Framework Blueprint",
        description: "Comprehensive framework for evaluating learner progress and competency.",
        lastUpdated: "2025-10-08",
        author: "Assessment Team",
        projectId: "dtma",
        projectName: "DTMA - Digital Transformation Management Academy",
        category: "design",
      },
      {
        id: "dtma-3",
        title: "Platform Integration Design",
        description: "Technical blueprint for integrating DTMA with existing DQ platforms.",
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
    name: "DQ 2.0 - Digital Transformation",
    description: "Strategic initiatives and transformation programs for organizational digital maturity.",
    color: "purple",
    blueprints: [
      {
        id: "dt20-1",
        title: "Digital Transformation Roadmap",
        description: "Comprehensive roadmap for organizational digital transformation journey.",
        lastUpdated: "2025-10-12",
        author: "Transformation Office",
        projectId: "dt20",
        projectName: "DQ 2.0 - Digital Transformation",
        category: "discern",
      },
      {
        id: "dt20-2",
        title: "Change Management Framework",
        description: "Framework for managing organizational change during digital transformation.",
        lastUpdated: "2025-10-09",
        author: "Change Management Team",
        projectId: "dt20",
        projectName: "DQ 2.0 - Digital Transformation",
        category: "design",
      },
    ],
  },
  {
    id: "dbp",
    name: "DBP - Digital Business Platform",
    description: "Platform architecture and implementation blueprints for digital business capabilities.",
    color: "green",
    blueprints: [
      {
        id: "dbp-1",
        title: "Platform Architecture Blueprint",
        description: "Complete architectural blueprint for the Digital Business Platform.",
        lastUpdated: "2025-10-11",
        author: "Architecture Team",
        projectId: "dbp",
        projectName: "DBP - Digital Business Platform",
        category: "design",
      },
      {
        id: "dbp-2",
        title: "Integration Strategy Blueprint",
        description: "Strategy for integrating DBP with existing enterprise systems.",
        lastUpdated: "2025-10-07",
        author: "Integration Team",
        projectId: "dbp",
        projectName: "DBP - Digital Business Platform",
        category: "develop",
      },
    ],
  },
  {
    id: "dxp",
    name: "DXP - Digital Experience Platform",
    description: "Experience design and delivery blueprints for customer and employee experiences.",
    color: "orange",
    blueprints: [
      {
        id: "dxp-1",
        title: "Experience Design System",
        description: "Comprehensive design system for digital experiences across all touchpoints.",
        lastUpdated: "2025-10-06",
        author: "Experience Design Team",
        projectId: "dxp",
        projectName: "DXP - Digital Experience Platform",
        category: "design",
      },
    ],
  },
  {
    id: "dws",
    name: "DWS - Digital Workspace",
    description: "Workspace and collaboration blueprints for digital work environments.",
    color: "teal",
    blueprints: [
      {
        id: "dws-1",
        title: "Workspace Collaboration Framework",
        description: "Framework for enabling collaboration in digital workspaces.",
        lastUpdated: "2025-10-04",
        author: "Workspace Team",
        projectId: "dws",
        projectName: "DWS - Digital Workspace",
        category: "design",
      },
    ],
  },
];

// Additional standalone blueprints
const additionalBlueprints: Blueprint[] = [
  {
    id: "discern-1",
    title: "Portfolio Analytics Dashboard",
    description: "Comprehensive dashboard for analyzing organizational portfolio performance and identifying optimization opportunities.",
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
    description: "Centralized index of all blueprint repositories with search and categorization capabilities.",
    lastUpdated: "2025-01-12",
    author: "Repository Team",
    url: "#",
    projectId: "standalone",
    projectName: "Repository Management",
    category: "discern",
  },
  {
    id: "design-1",
    title: "UI/UX Design System",
    description: "Complete design system blueprint with components, patterns, and guidelines.",
    lastUpdated: "2025-01-14",
    author: "Design Team",
    url: "#",
    projectId: "standalone",
    projectName: "Design System",
    category: "design",
  },
  {
    id: "design-2",
    title: "Integration Strategy",
    description: "Complete redesign strategy with modern UI/UX principles.",
    lastUpdated: "2025-01-11",
    author: "Design Team",
    url: "#",
    projectId: "standalone",
    projectName: "Design Strategy",
    category: "design",
  },
  {
    id: "develop-1",
    title: "Testing Strategy Blueprint",
    description: "Comprehensive testing strategy covering unit, integration, and end-to-end testing approaches.",
    lastUpdated: "2025-01-13",
    author: "QA Team",
    url: "#",
    projectId: "standalone",
    projectName: "Testing Strategy",
    category: "develop",
  },
  {
    id: "deploy-1",
    title: "CI/CD Pipeline Blueprint",
    description: "Complete CI/CD pipeline blueprint for automated deployment workflows.",
    lastUpdated: "2025-01-12",
    author: "DevOps Team",
    url: "#",
    projectId: "standalone",
    projectName: "CI/CD Pipeline",
    category: "deploy",
  },
  {
    id: "deploy-2",
    title: "Monitoring & Alerting Framework",
    description: "Framework for implementing comprehensive monitoring and alerting systems.",
    lastUpdated: "2025-01-08",
    author: "Operations Team",
    url: "#",
    projectId: "standalone",
    projectName: "Monitoring Framework",
    category: "deploy",
  },
];

/**
 * Get all blueprints (from projects and standalone)
 */
export function getAllBlueprints(): Blueprint[] {
  const projectBlueprints = projects.flatMap((project) =>
    project.blueprints.map((blueprint) => ({
      ...blueprint,
      projectId: project.id,
      projectName: project.name,
    }))
  );
  return [...projectBlueprints, ...additionalBlueprints];
}

/**
 * Convert a blueprint to a guide-like format for display in guides marketplace
 */
export function blueprintToGuide(blueprint: Blueprint): any {
  return {
    id: blueprint.id,
    slug: blueprint.id,
    title: blueprint.title,
    summary: blueprint.description,
    heroImageUrl: null,
    lastUpdatedAt: blueprint.lastUpdated ? new Date(blueprint.lastUpdated).toISOString() : new Date().toISOString(),
    authorName: blueprint.author || 'Unknown',
    authorOrg: blueprint.projectName,
    isEditorsPick: false,
    downloadCount: 0,
    guideType: 'Blueprint',
    domain: 'Blueprints',
    functionArea: blueprint.category,
    unit: blueprint.category,
    subDomain: blueprint.category,
    location: null,
    status: 'Approved',
    complexityLevel: null,
    estimatedTimeMin: null,
    // Additional blueprint-specific fields
    blueprintCategory: blueprint.category,
    blueprintProject: blueprint.projectName,
    documentUrl: blueprint.url || '#',
  };
}

/**
 * Get all blueprints converted to guide format
 */
export function getBlueprintsAsGuides(): any[] {
  return getAllBlueprints().map(blueprintToGuide);
}

