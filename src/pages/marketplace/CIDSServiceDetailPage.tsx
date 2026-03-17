// DEPLOYMENT: 2026-03-17 - Force Vercel deployment for feature branch
// FINAL VERSION: 2026-03-17 - Complete Design System Marketplace Implementation
// Updated: 2026-03-17 - Design System Marketplace with improved scroll functionality
import { useState, useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';

export default function CIDSServiceDetailPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[id^="introduction"], [id^="content-mandate"], [id^="relevant-ecosystem"], [id^="content-planning-timeline"], [id^="content-planning-tracker"], [id^="purpose"], [id^="implementation-guidelines"]');
      const scrollPosition = window.scrollY + 200;

      let currentSection = '';
      sections.forEach((section) => {
        const element = section as HTMLElement;
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          currentSection = element.id;
        }
      });

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const sections = [
    {
      id: 'introduction',
      title: '1.1 Introduction',
      content: `This section introduces the CI.DS (Content Intelligence Design System) as the formal replacement of the CI.PF (Content Item Production Framework), signalling a shift from a static set of production rules to a dynamic, modular, and quality-driven content system.

The CI.DS is designed to embed greater intentionality, traceability, and performance assurance into the way content is envisioned, created, reviewed, and delivered across all DQ platforms.

By anchoring the CI.DS within DQ's wider ecosystem - including DTMB (Books), DTMI (Insights), DTMP (Platform), TMaaS (Deliverables), and DTMA (Academy) - this introduction highlights how content is no longer a support function, but a strategic driver of thought leadership, brand credibility, and organizational learning.`
    },
    {
      id: 'content-mandate',
      title: '1.2 Content Mandate (DQ Units)',
      content: `Multiple units across DQ are tasked with producing content that delivers strategic impact - content designed to influence decisions, spark engagement, and drive targeted actions across diverse scenarios.

These content-producing units include:

• DTMB (Digital Transformation Management Books) – Develops long-form publications and whitepapers that articulate strategic frameworks, transformation logic, and thought leadership.

• DTMI (Digital Transformation Management Insights) – Publishes analytical insights, trend overviews, and high-frequency thought leadership pieces aligned to market and sector dynamics.

• DTMA (Digital Transformation Management Academy) – Produces structured learning content, training modules, and course materials to support digital capability building.

• DQ Designs – Generates architecture diagrams, strategic blueprints, and design specifications for products, platforms, and organizational constructs.

• DQ Deploys – Delivers implementation-focused content such as guides, manuals, technical documents, and use-case playbooks.

• DQ Deals – Crafts strategic proposals, bid responses, capability decks, and customized engagement presentations.

• DQ Content – Leads multimedia, editorial, and campaign-driven content across digital channels, including social posts, scripts, videos, and creative assets.`
    },
    {
      id: 'relevant-ecosystem',
      title: '1.3 Relevant Ecosystem',
      content: `The CI.DS guidelines apply universally across the DQ content ecosystem and must be upheld to maintain consistency, quality, and brand alignment in every content output.

This includes all formats, platforms, and touchpoints where DQ content is created or shared:

• Within internal DQ documentation and communications

• In DTMB Papers and formal publications

• In DTMA Course Materials and Learning Assets

• Across DTMI Insights and all social media channels

• Within BD proposals, sales decks, and outreach content

• In client-facing deliverables, reports, and strategic outputs`
    },
    {
      id: 'content-planning-timeline',
      title: '1.4 Content Planning | Timeline & Milestones',
      content: `Content planning within CI.DS follows a structured approach that ensures strategic alignment, quality delivery, and measurable outcomes. This section outlines the essential timeline and milestone framework for content development.

The planning process includes:

• Strategic content mapping and audience analysis

• Content calendar development and resource allocation

• Quality checkpoints and review milestones

• Distribution planning and performance tracking

• Stakeholder alignment and approval workflows`
    },
    {
      id: 'content-planning-tracker',
      title: '1.5 Content Planning | Tracker',
      content: `The content planning tracker provides a comprehensive system for monitoring content development progress, ensuring accountability, and maintaining quality standards throughout the production lifecycle.

Key tracking elements include:

• Content status and progress indicators

• Quality assurance checkpoints and approvals

• Resource allocation and timeline management

• Performance metrics and outcome measurement

• Stakeholder feedback and iteration tracking`
    },
    {
      id: 'purpose',
      title: '1.6 CI.DS | Purpose',
      content: `The CI.DS is defined as a strategic, end-to-end system that ensures all content items are intentionally planned, professionally produced, and strategically promoted.

It provides a unified framework that brings structure, precision, and purpose to the entire content lifecycle.

By applying CI.DS, DQ ensures that every output - whether a whitepaper, insight, visual asset, or course material - is clear in its message, consistent with the brand, and optimized for measurable performance.

This leads to stronger engagement, greater trust from audiences, streamlined production processes, and higher content ROI across all platforms and channels.`
    },
    {
      id: 'implementation-guidelines',
      title: '1.7 Implementation Guidelines',
      content: `This section provides comprehensive guidelines for implementing CI.DS across all DQ content production workflows, ensuring consistent application and maximum effectiveness.

Implementation includes:

• Team training and capability building programs

• Tool integration and workflow optimization

• Quality assurance processes and review protocols

• Performance measurement and continuous improvement

• Change management and adoption strategies

The implementation approach is designed to be scalable, flexible, and adaptable to different team structures and content requirements while maintaining the core principles and standards of CI.DS.`
    }
  ];
  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate the exact position accounting for header and padding
      const headerHeight = 80; // Approximate header height
      const additionalOffset = 32; // Additional padding for better positioning
      const elementPosition = element.offsetTop - headerHeight - additionalOffset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
    setActiveSection(sectionId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(to right, #192D6C, #051139)' }}>
        {/* soft bottom fade into page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero content — card box on gradient */}
          <div className="pt-8 pb-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/15 px-10 py-14 w-full min-h-[256px] flex flex-col justify-center">
              {/* Framework Badge */}
              <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded text-sm font-medium mb-6 w-fit">
                FRAMEWORK
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Content Intelligence Design System (CI.DS)
              </h1>

              <p className="text-base text-white/80 max-w-xl leading-relaxed">
                CI.DS is DQ's intelligent system for turning ideas into consistent, high-impact content at scale. It provides unified guidelines, components, and tools for professional content production.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Table of Contents - Left Side */}
            <div className="w-80">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4">Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content - Right Side */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="space-y-12">
                  {sections.map((section) => (
                    <div key={section.id} id={section.id} className="scroll-mt-32">
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {section.title}
                      </h2>
                      <div className="prose prose-gray max-w-none">
                        {section.content.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer isLoggedIn={false} />
    </div>
  );
}