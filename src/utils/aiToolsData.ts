/**
 * AI Tools Data Configuration
 * 
 * This file contains structured data for AI tools in the Services Center.
 * Designed to be easily migrated to a database in the future.
 */

export interface AIToolData {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: string;
  homepage: string;
  license: {
    subscriptionStatus: 'Active' | 'Inactive' | 'Pending';
    expiryDate: string; // Use 'N/A' for no expiry, or ISO date string
    licenseType?: string;
    totalSeats?: number;
    renewalDate?: string;
  };
  features: {
    keyFeatures: string[];
    highlights: string[];
  };
  systemRequirements: {
    minimum: {
      os: string;
      processor: string;
      ram: string;
      storage: string;
      display: string;
      internet: string;
      browser?: string;
    };
    recommended: {
      processor: string;
      ram: string;
      storage: string;
      display: string;
      internet: string;
      os?: string;
      browser?: string;
    };
    additionalNotes: string[];
  };
  about: {
    overview: string;
  };
  provider: {
    name: string;
    logoUrl: string;
  };
}

/**
 * AI Tools Database
 * Each tool's data is structured for easy database migration
 */
export const AI_TOOLS_DATA: Record<string, AIToolData> = {
  'cursor-ai': {
    id: '10',
    name: 'Cursor AI',
    shortName: 'Cursor',
    description: 'AI-powered code editor that accelerates development with intelligent code completion',
    category: 'AI Tools',
    homepage: 'https://cursor.sh',
    license: {
      subscriptionStatus: 'Active',
      expiryDate: 'N/A',
      licenseType: 'Business Pro Plan',
      totalSeats: 50,
      renewalDate: 'December 2025',
    },
    features: {
      keyFeatures: [
        'AI-Powered Code Completion',
        'Natural Language Editing',
        'Chat-Based Coding Assistant',
        'AI-Assisted Debugging',
        'Multi-Model Support',
        'Context-Aware Intelligence',
      ],
      highlights: [
        'Intelligent autocomplete that understands your codebase context',
        'Write code using natural language commands',
        'Ask questions and get explanations directly in the editor',
        'Access to GPT-4, Claude Sonnet, and more AI models',
        'Analyzes your entire codebase for relevant suggestions',
        'Built on VS Code foundation with enhanced AI capabilities',
      ],
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 10+ (64-bit), macOS 10.15+, Linux (Ubuntu 18.04+, Debian 10+, RHEL 8+)',
        processor: 'Intel Core i3 or AMD equivalent (2.0 GHz+)',
        ram: '4 GB (8 GB recommended for optimal AI performance)',
        storage: '500 MB available disk space',
        display: '1280 x 720 resolution minimum',
        internet: 'Stable broadband (minimum 5 Mbps recommended)',
      },
      recommended: {
        os: 'Latest Windows, macOS, or Linux',
        processor: 'Intel Core i5/i7/i9 or AMD Ryzen 5/7/9 (2.5 GHz+)',
        ram: '16 GB or more for large codebases',
        storage: 'SSD with at least 1 GB free space',
        display: '1920 x 1080 or higher resolution',
        internet: 'High-speed broadband (10+ Mbps)',
      },
      additionalNotes: [
        'GPU acceleration not required but may improve performance',
        'Works best with modern web browsers for documentation access',
        'Some advanced AI features may require higher bandwidth',
        'For team deployments, ensure network supports multiple simultaneous AI requests',
      ],
    },
    about: {
      overview: 'Cursor AI is an advanced AI-powered code editor that revolutionizes the way developers write, edit, and debug code. Built on the foundation of Visual Studio Code, Cursor integrates cutting-edge artificial intelligence to provide intelligent code completion, natural language editing, and context-aware suggestions.',
    },
    provider: {
      name: 'Digital Innovation',
      logoUrl: '/DWS-Logo.png',
    },
  },
  'lovable-ai': {
    id: '11',
    name: 'Lovable AI',
    shortName: 'Lovable',
    description: 'Low-code AI platform for building full-stack web applications with natural language',
    category: 'AI Tools',
    homepage: 'https://lovable.dev',
    license: {
      subscriptionStatus: 'Active',
      expiryDate: 'N/A',
      licenseType: 'Team Plan',
      totalSeats: 25,
      renewalDate: 'January 2026',
    },
    features: {
      keyFeatures: [
        'Natural Language Development',
        'Full-Stack Code Generation',
        'Real-Time Preview',
        'Instant Deployment',
        'Code Ownership',
        'AI-Powered Iterations',
      ],
      highlights: [
        'Describe your application in plain English and get complete code',
        'Creates modern web apps using React, TypeScript, and Node.js',
        'See your application come to life in real-time',
        'Deploy to production with a single click',
        'Export and own all generated code',
        'Intelligent updates that maintain existing functionality',
      ],
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 10+, macOS 10.13+, or modern Linux',
        processor: 'Intel Core i3 or AMD equivalent (2.0 GHz+)',
        ram: '4 GB (8 GB recommended for larger projects)',
        storage: 'No local storage required (cloud-based)',
        display: '1366 x 768 minimum (1920 x 1080 recommended)',
        internet: 'Stable broadband (minimum 10 Mbps down, 2 Mbps up)',
        browser: 'Latest Chrome (recommended), Firefox, Edge, or Safari',
      },
      recommended: {
        os: 'Latest Windows, macOS, or Linux',
        processor: 'Intel Core i5/i7 or AMD Ryzen 5/7 (2.5 GHz+)',
        ram: '16 GB or more for complex applications',
        storage: 'No local storage required (cloud-based)',
        display: '1920 x 1080+ with multiple monitors',
        internet: 'High-speed broadband (25+ Mbps)',
        browser: 'Latest Google Chrome with ad blockers disabled',
      },
      additionalNotes: [
        'Cloud-based platform - no local installation required',
        'Stable internet connection critical for real-time code generation',
        'Google Chrome recommended for best experience',
        'Mobile device testing requires iOS 12+ or Android 8+',
        'Team collaboration works best with Microsoft Teams or Zoom',
      ],
    },
    about: {
      overview: 'Lovable AI is a revolutionary low-code platform that harnesses the power of artificial intelligence to transform natural language descriptions into fully functional web applications. By combining AI-powered code generation with modern development frameworks, Lovable enables teams to rapidly build, iterate, and deploy production-ready applications without extensive coding expertise.',
    },
    provider: {
      name: 'Digital Innovation',
      logoUrl: '/DWS-Logo.png',
    },
  },
  'chatgpt': {
    id: '12',
    name: 'ChatGPT',
    shortName: 'ChatGPT',
    description: 'Advanced conversational AI assistant for content creation, research, and problem-solving',
    category: 'AI Tools',
    homepage: 'https://chat.openai.com',
    license: {
      subscriptionStatus: 'Active',
      expiryDate: 'N/A',
      licenseType: 'Enterprise Plan',
      totalSeats: 100,
      renewalDate: 'March 2026',
    },
    features: {
      keyFeatures: [
        'Advanced Conversational AI',
        'Content Generation & Writing',
        'Code Generation & Debugging',
        'Data Analysis & Insights',
        'Multi-Language Support',
        'Image Understanding (GPT-4)',
      ],
      highlights: [
        'Engage in natural conversations and get intelligent responses to complex queries',
        'Generate high-quality content including articles, emails, reports, and creative writing',
        'Write, debug, and explain code across multiple programming languages',
        'Analyze data, create summaries, and extract insights from documents',
        'Communicate and create content in over 50 languages with native-level fluency',
        'Upload and analyze images to get descriptions, extract text, and answer visual questions',
      ],
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 10+, macOS 10.13+, Linux, iOS 12+, Android 8+',
        processor: 'Any modern processor (1.0 GHz+)',
        ram: '2 GB minimum',
        storage: 'No local storage required (cloud-based)',
        display: '1024 x 768 resolution minimum',
        internet: 'Stable internet connection (minimum 3 Mbps)',
        browser: 'Chrome 90+, Firefox 88+, Safari 14+, Edge 90+',
      },
      recommended: {
        os: 'Latest Windows, macOS, Linux, iOS, or Android',
        processor: 'Multi-core processor (2.0 GHz+)',
        ram: '4 GB or more for optimal multitasking',
        storage: 'No local storage required (cloud-based)',
        display: '1920 x 1080 or higher resolution',
        internet: 'High-speed broadband (10+ Mbps)',
        browser: 'Latest Chrome or Edge for best performance',
      },
      additionalNotes: [
        'Cloud-based platform accessible from any device with a web browser',
        'Mobile apps available for iOS and Android devices',
        'Stable internet connection required for real-time responses',
        'GPT-4 features require Enterprise subscription',
        'Data privacy and security measures comply with enterprise standards',
      ],
    },
    about: {
      overview: 'ChatGPT is a cutting-edge conversational AI assistant powered by OpenAI\'s GPT-4 technology. It excels at natural language understanding and generation, making it an invaluable tool for content creation, research, coding assistance, data analysis, and problem-solving. ChatGPT helps teams work more efficiently by providing intelligent responses, generating high-quality content, and offering insights across a wide range of topics and tasks.',
    },
    provider: {
      name: 'Digital Innovation',
      logoUrl: '/DWS-Logo.png',
    },
  },
  'mokkup-ai': {
    id: '20',
    name: 'Mokkup.ai',
    shortName: 'Mokkup',
    description: 'AI-powered mockup generator for creating professional product presentations and designs',
    category: 'AI Tools',
    homepage: 'https://mokkup.ai',
    license: {
      subscriptionStatus: 'Active',
      expiryDate: 'N/A',
      licenseType: 'Business Plan',
      totalSeats: 30,
      renewalDate: 'February 2026',
    },
    features: {
      keyFeatures: [
        'AI-Powered Mockup Generation',
        'Smart Background Removal',
        'Instant Product Visualization',
        'Multiple Device Templates',
        'Batch Processing',
        'High-Resolution Export',
      ],
      highlights: [
        'Generate professional mockups automatically using AI technology',
        'Remove backgrounds and enhance product images with one click',
        'Preview your designs on various devices, apparel, and packaging instantly',
        'Access thousands of templates for phones, laptops, tablets, and merchandise',
        'Process multiple images simultaneously for efficient workflow',
        'Export in high resolution (up to 4K) for print and digital use',
      ],
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 10+, macOS 10.14+, Linux, iOS 13+, Android 9+',
        processor: 'Any modern processor (1.5 GHz+)',
        ram: '2 GB minimum',
        storage: 'No local storage required (cloud-based)',
        display: '1280 x 800 resolution minimum',
        internet: 'Stable internet connection (minimum 5 Mbps)',
        browser: 'Chrome 88+, Firefox 85+, Safari 14+, Edge 88+',
      },
      recommended: {
        os: 'Latest Windows, macOS, or mobile OS',
        processor: 'Multi-core processor (2.5 GHz+)',
        ram: '8 GB or more for large image processing',
        storage: 'No local storage required (cloud-based)',
        display: '1920 x 1080 or higher resolution',
        internet: 'High-speed broadband (15+ Mbps)',
        browser: 'Latest Chrome or Safari for optimal performance',
      },
      additionalNotes: [
        'Cloud-based platform - works on any device with internet access',
        'Mobile apps available for iOS and Android',
        'Larger images may require faster internet connection',
        'Supports PNG, JPG, and SVG file formats',
        'Best results with high-quality source images (1000px+ width)',
      ],
    },
    about: {
      overview: 'Mokkup.ai is an intelligent mockup generation platform that leverages artificial intelligence to create stunning product visualizations in seconds. Perfect for designers, marketers, and e-commerce businesses, Mokkup.ai transforms simple product images into professional presentations across thousands of templates including devices, apparel, packaging, and print materials.',
    },
    provider: {
      name: 'Digital Innovation',
      logoUrl: '/DWS-Logo.png',
    },
  },
  'voiceflow': {
    id: '21',
    name: 'Voiceflow',
    shortName: 'Voiceflow',
    description: 'AI agent platform for building, launching, and scaling voice and chat agents for customer service',
    category: 'AI Tools',
    homepage: 'https://www.voiceflow.com',
    license: {
      subscriptionStatus: 'Active',
      expiryDate: 'N/A',
      licenseType: 'Enterprise Plan',
      totalSeats: 40,
      renewalDate: 'April 2026',
    },
    features: {
      keyFeatures: [
        'Voice AI Agents',
        'Chat Agent Builder',
        'Visual Flow Designer',
        'Multi-Channel Deployment',
        'Enterprise Integrations',
        'Analytics & Observability',
      ],
      highlights: [
        'Design and deploy human-like voice agents for phone support that scale effortlessly',
        'Build sophisticated chat agents with deep customization and interface control',
        'Create conversation flows visually with drag-and-drop designer for rapid prototyping',
        'Deploy agents across phone, web chat, mobile apps, and messaging platforms',
        'Integrate with Salesforce, Zendesk, Shopify, Snowflake, and your entire tech stack',
        'Monitor performance, track interactions, and optimize agent responses with built-in analytics',
      ],
    },
    systemRequirements: {
      minimum: {
        os: 'Windows 10+, macOS 10.14+, Linux (modern distributions)',
        processor: 'Any modern processor (2.0 GHz+)',
        ram: '4 GB minimum',
        storage: 'No local storage required (cloud-based)',
        display: '1366 x 768 resolution minimum',
        internet: 'Stable broadband connection (minimum 10 Mbps)',
        browser: 'Chrome 90+, Firefox 88+, Safari 14+, Edge 90+',
      },
      recommended: {
        os: 'Latest Windows, macOS, or Linux',
        processor: 'Multi-core processor (2.5 GHz+)',
        ram: '8 GB or more for complex agent workflows',
        storage: 'No local storage required (cloud-based)',
        display: '1920 x 1080 or higher resolution',
        internet: 'High-speed broadband (25+ Mbps)',
        browser: 'Latest Chrome for optimal performance and features',
      },
      additionalNotes: [
        'Cloud-based platform accessible from any device with modern browser',
        'Voice agent testing requires microphone access',
        'Collaborative features work best with stable internet connection',
        'API integrations may require developer knowledge for advanced workflows',
        'SOC-2 compliant with GDPR compliance for enterprise security',
      ],
    },
    about: {
      overview: 'Voiceflow is a purpose-built platform for Product teams to design, build, and deploy AI agents for customer service across voice and chat channels. Trusted by 4,000+ customers with over 200,000 users, Voiceflow enables teams to automate customer support, build conversational interfaces, and scale AI interactions with deep customization, enterprise integrations, and comprehensive analytics.',
    },
    provider: {
      name: 'Digital Innovation',
      logoUrl: '/DWS-Logo.png',
    },
  },
};

/**
 * Helper function to get AI tool data by service ID
 */
export function getAIToolDataById(serviceId: string): AIToolData | undefined {
  return Object.values(AI_TOOLS_DATA).find(tool => tool.id === serviceId);
}

/**
 * Helper function to get AI tool data by tool key
 */
export function getAIToolData(toolKey: 'cursor-ai' | 'lovable-ai' | 'chatgpt' | 'mokkup-ai' | 'voiceflow'): AIToolData {
  return AI_TOOLS_DATA[toolKey];
}

