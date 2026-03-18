import { useState, useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';

export default function CDSServiceDetailPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[id^="introduction"], [id^="campaign-mandate"], [id^="relevant-ecosystem"], [id^="campaign-planning-timeline"], [id^="campaign-planning-tracker"], [id^="purpose"], [id^="implementation-guidelines"]');
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
      content: `Marketing at DigitalQatalyst is not just about brand presence-it is a structured practice of shaping the organization's narrative, educating the digital economy, and orchestrating movements across channels and stakeholders. The Marketing Campaigns Design System (CDS) offers a unified operating framework for how campaigns are conceived, planned, designed, deployed, and reviewed-anchored by DQ's five strategic Content Pillars.`
    },
    {
      id: 'who-is-this-for',
      title: '1.2 Who is this for?',
      content: `Across DigitalQatalyst, campaigns are how ideas turn into movements-how insight becomes visibility, visibility becomes engagement, and engagement becomes growth. CDS is for the people responsible for making those movements happen. It serves marketing leaders setting strategic direction, campaign specialists designing narratives and journeys, designers and creators shaping visual and multimedia assets, and DevOps and WebOps teams deploying campaigns across platforms. It also supports delivery and product teams who initiate campaigns to generate demand, and data analysts who measure performance and optimize outcomes. For anyone involved in planning, executing, or scaling marketing campaigns at DQ, CDS provides the shared operating system that brings structure and alignment to collective effort.`
    },
    {
      id: 'problem-solved',
      title: '1.3 What problem does it solve?',
      content: `Without a unified system, campaigns often evolve as isolated efforts-planned differently by each team, executed with inconsistent standards, and measured unevenly across channels. This leads to fragmented brand expression, slower execution, and missed opportunities to build momentum across the pipeline. CDS transforms campaigns from ad-hoc activities into a disciplined, repeatable practice. It provides a common framework anchored in DQ's content pillars, shared standards, and clear roles, enabling teams to collaborate with confidence and speed. By embedding consistency, quality benchmarks, and performance thinking into every stage of campaign design and delivery, CDS reduces friction, improves effectiveness, and ensures that every campaign contributes coherently to DQ's brand, growth, and market leadership.`
    },
    {
      id: 'marcom-mandate',
      title: '1.4 DQ MarCom | Mandate',
      content: `The Marketing & Communication (MarCom) Unit in DQ works along with the BD Unit to orchestrate leads, opportunities, and deals for the organisation offerings. The joint mandate of Marketing and BD is "To Accelerate Efficient DCO & DBP Deals Pipeline (Traffic | Contacts | Leads | Opportunities) in DQ". Across the organisation, success is measured in terms of contribution to (1) DQ Insight, (2) DQ Agility, (3) DQ Growth. Marketing campaigns are the primary activities undertaken to build the DQ Brand and generate followership and leads.`
    },
    {
      id: 'marcom-ecosystem',
      title: '1.5 DQ MarCom | Ecosystem',
      content: `The DQ MarCom Unit delivers targeted promotional and lead-generation campaigns in collaboration with key units across the organization. Operating as a centralized support function, it ensures each campaign aligns with both the strategic goals of the unit it supports and the broader DQ brand and business objectives.

DQ Organisation: Branding positioning.

DQ Delivery Units: Leads generation (DQ Designs and Deploys).

DQ Products Units: Leads generation (DQ DT2.0 and DCO offerings).`
    },
    {
      id: 'purpose',
      title: '1.6 DQ CDS | Purpose',
      content: `At its core, the Campaigns Design System (CDS) is a mechanism for ensuring consistency, quality, and strategic clarity across all outputs. It transforms campaign activity into a disciplined process of storytelling, brand expression, and stakeholder engagement while embedding visual and narrative standards that unify the brand experience. This ensures every campaign is impactful, aligned, repeatable, and reflective of DQ's digital leadership.

Provide a standardized, high-impact system for managing all marketing campaigns.

Empower teams to build campaigns that align with DQ's vision, values, and voice.

Accelerate production, improve consistency, and enhance campaign effectiveness.`
    },
    {
      id: 'key-stakeholders',
      title: '1.7 DQ CDS | Key Stakeholders',
      content: `CDS standardizes campaign execution and enables collaboration across diverse stakeholders, providing a shared system, language, and quality benchmarks to co-create high-quality, brand-aligned campaigns.

Marketing Leadership – Strategic alignment and oversight.

Campaign Beneficiaries – All stakeholders across the organisation.

Campaign Specialists – Campaign planning, scripting, and content design.

Designers & Creators – Visual identity, videos, carousels.

DevOps / WebOps – Programming, deployment, asset integration.

Campaign Data Analysts – Measurement, reporting, optimization.

Delivery / Products Teams – Cross-functional campaign initiators.`
    },
    {
      id: 'campaigns-strategy',
      title: '2.1 Stage 00 - Campaigns Strategy',
      content: `This section defines the strategic foundation of DQ campaigns: the Content Pillars, target channels, overall lifecycle, and roles. It establishes the strategic layer of the CDS by clarifying how DQ's core messages, brand presence, and offerings are structured and delivered across multiple campaigns. A unified strategy ensures that all campaigns, regardless of target audience or format, are consistent with DQ's positioning as a leading digital transformation partner.

This consistency is achieved through integration of five clearly defined content pillars, a well-mapped channel distribution logic, a repeatable campaign lifecycle, and the active participation of cross-functional roles. Together, these strategic components enable DQ to operate with clarity, scale campaigns efficiently, and achieve maximum brand and business impact.`
    },
    {
      id: 'content-pillars',
      title: '2.2 DQ CDS | 5 Content Pillars',
      content: `The foundation of every DQ marketing campaign is built upon five core content pillars. These pillars are strategic expressions of DQ's value proposition and positioning.

Thought Leadership & Insight: Advance DQ as the brain trust for digital transformation.

Product & Service Value: Showcase the functionality and outcomes of DQ products.

Brand Identity & Culture: Humanize the brand through emotion and values.

Education & Enablement: Teach and enable audiences to take action.

Community & Ecosystem: Highlight DQ's role as a movement, not just a company.

Structuring campaigns around these pillars ensures consistent messaging and measurable outcomes.`
    },
    {
      id: 'dq-story-framework',
      title: '2.3 DQ CDS | The DQ Story Framework',
      content: `The DQ Value Proposition and Operating Model is encapsulated in the Golden HoneyComb of Competencies (GHC). The 7th element expands into the research-driven 6xD (6 Primary Dimensions for Digital Success), defining worldview, strategic pillars, and product architecture. These frameworks act as the narrative engine behind all campaign storytelling, providing vocabulary, themes, and structural alignment so every campaign reinforces DQ's identity and positioning.`
    },
    {
      id: 'campaign-lifecycle',
      title: '2.4 DQ MarCom | Campaign Lifecycle',
      content: `A repeatable structure that moves from strategic intent to execution with clarity and speed. Four core stages:

Planning – Strategy, objectives, storyboarding.

Design – Scripts, visuals, messaging, prompts.

Execution – Programming, scheduling, deployment.

Governance – Monitoring, review, reporting, retros.`
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
                Campaign Design System (CDS)
              </h1>

              <p className="text-base text-white/80 max-w-xl leading-relaxed">
                CDS is DQ's specialized framework for creating consistent, high-impact campaign and marketing materials at scale. It provides unified guidelines, strategic workflows, and brand standards for professional campaign development.
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