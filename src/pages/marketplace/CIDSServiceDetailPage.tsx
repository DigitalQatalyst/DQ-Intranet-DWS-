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
      id: 'who-is-this-for',
      title: '1.2 Who is this for?',
      content: `Across DQ, content is created by many hands and for many purposes - books that define transformation thinking, insights that shape market conversations, learning material that builds capability, proposals that win trust, and deliverables that guide real-world execution. CI.DS is for all of these contributors. It is for the writer shaping an argument, the designer translating complexity into clarity, the subject-matter expert validating accuracy, the marketer preparing content for distribution, and the executive ensuring the message reflects DQ's vision. No matter the format or platform, if someone is responsible for turning ideas into content that represents DQ, CI.DS is the system that supports them.`
    },
    {
      id: 'problem-solved',
      title: '1.3 What problem does it solve?',
      content: `Before CI.DS, content often evolved in isolation. Each unit worked with its own assumptions, formats, and review practices. Valuable ideas were expressed inconsistently, quality depended on individual effort, and teams spent time fixing structure and alignment instead of strengthening the message. CI.DS changes this experience. It provides a shared, end-to-end system that brings order to the entire content lifecycle - from intent and planning to creation, review, and publication. By introducing common standards, roles, and checkpoints, CI.DS removes ambiguity, reduces rework, and makes quality repeatable rather than accidental. As a result, teams spend less time correcting and coordinating, and more time creating content that is clear, credible, and impactful - allowing content to function as a strategic asset that consistently advances DQ's thought leadership, brand trust, and learning mission at scale.`
    },
    {
      id: 'content-mandate',
      title: '1.4 Content Mandate (DQ Units)',
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
      title: '1.5 Relevant Ecosystem',
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
      id: 'purpose',
      title: '1.6 CI.DS | Purpose',
      content: `The CI.DS is defined as a strategic, end-to-end system that ensures all content items are intentionally planned, professionally produced, and strategically promoted.

It provides a unified framework that brings structure, precision, and purpose to the entire content lifecycle.

By applying CI.DS, DQ ensures that every output - whether a whitepaper, insight, visual asset, or course material - is clear in its message, consistent with the brand, and optimized for measurable performance.

This leads to stronger engagement, greater trust from audiences, streamlined production processes, and higher content ROI across all platforms and channels.`
    },
    {
      id: 'key-stakeholders',
      title: '1.7 CI.DS | Key Stakeholders',
      content: `The success of the CI.DS relies on clear role definition and collaboration across a range of key stakeholders. Each participant in the content lifecycle plays a unique role in ensuring that content meets its intended purpose with clarity, quality, and strategic alignment.

Writers are responsible for shaping narratives that align with DQ's tone, logic, and frameworks, grounding every piece in clarity and purpose.

Editors refine the structure, tone, and coherence of written content, ensuring it meets CI.DS quality standards.

Designers translate ideas into visuals, applying the brand's visual language and layout logic to enhance clarity, engagement, and comprehension.

Reviewers - often subject matter experts - validate technical accuracy, conceptual integrity, and narrative strength.

Marketers ensure content visibility and impact by planning distribution strategies, tagging for SEO, and coordinating promotional campaigns.

Executive Approvers provide final validation, ensuring that each content item supports DQ's strategic vision, brand standards, and ecosystem positioning.

Together, these stakeholders uphold a shared commitment to quality and coherence, using CI.DS as the central system that guides planning, creation, validation, and publication.`
    },
    {
      id: 'content-strategy',
      title: '2.1 Stage 00 – Content Item Strategy (CI.DS)',
      content: `Stage 00 defines the strategic lens through which all content items are shaped. It ensures that content is not created in isolation but instead anchored in DQ's narrative, frameworks, product positioning, and distribution strategy. This stage provides the foundational logic that ensures content serves a clear business and branding purpose across the organization.`
    },
    {
      id: 'dq-frameworks',
      title: '2.2 DQ Stories | Frameworks',
      content: `Every piece of content produced under CI.DS must be grounded in DQ's core narrative: the transformation journey toward Digital Cognitive Organizations (DCOs). This overarching story is more than a backdrop - it is the strategic compass that connects DQ's thought leadership, product philosophy, and transformation agenda.

By embedding the DCO story within content, creators ensure consistency of purpose, relevance to the target audience, and alignment with DQ's global positioning. This storytelling framework provides coherence across diverse content formats and strengthens the organization's intellectual footprint in the digital transformation space.`
    },
    {
      id: 'content-artefact-class',
      title: '2.3 Content Artefact Class (CAC)',
      content: `DQ content is generally organized into five Content Artefact Classes (CAC), each representing a strategic category aligned with the intent, audience, and business value of the content produced. These classes provide a high-level framework to ensure that content outputs are not just diverse in format but coherent in purpose.

The five CACs include:

Thought Leadership Artefacts – Designed to shape industry perspectives and establish DQ's intellectual position. Examples include whitepapers, research briefs, anchor papers, and insight decks.

Product & Service Artefacts – Focused on describing, promoting, or enabling adoption of DQ's offerings. This includes solution overviews, proposal decks, use-case templates, and service blueprints.

Brand Identity & Culture Artefacts – These reinforce internal values and external image. Artefacts include culture books, onboarding kits, tone-of-voice guidelines, and brand design manuals.

Education & Enablement Artefacts – Created to build digital capabilities for clients, partners, or internal teams. Includes LMS modules, learning guides, how-to scripts, and certification assessments.

Community & Ecosystem Artefacts – Aimed at engaging the broader market and partner ecosystem. Includes event highlights, partnership announcements, social campaigns, and ecosystem visualizations.

These five CACs act as the backbone of the CI.DS structure and provide direction for the development, review, and strategic use of content across the organization.`
    },
    {
      id: 'content-development-lifecycle',
      title: '2.4 Content Development Lifecycle (CDL)',
      content: `The Content Development Lifecycle (CDL) outlines the full journey of a content item - divided into two core stages: Production and Dissemination. This structured lifecycle embeds quality, alignment, and performance at each step of the process, ensuring every content asset is purposeful and impactful.

Production Stage focuses on transforming strategic ideas into high-quality, brand-aligned content:

Ideation & Validation – Define the strategic intent of the content, align it with relevant DQ frameworks, and validate with key stakeholders.

Briefing & Planning – Document objectives, contributors, and milestones in the CI Brief and CI Tracker.

Drafting & Editing – Create content using approved templates, applying tone, structure, and referencing standards.

Design & Formatting – Shape the content visually with compliant layouts, branded visuals, and multimedia.

Review & Approvals – Conduct structured reviews with SMEs and leaders to finalize content for publishing.

Dissemination Stage focuses on delivering the content with maximum reach, visibility, and feedback:

Publication & SEO Tagging – Distribute content to the right channels with proper metadata, SEO, and publishing standards.

Promotion & Feedback Loop – Activate content through campaigns, track performance metrics, and gather insights for future refinement.

This lifecycle ensures traceability, role clarity, and continuous improvement across all CI.DS-driven content activities.`
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