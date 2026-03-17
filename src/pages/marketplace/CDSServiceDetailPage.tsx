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
      content: `This section introduces the CDS (Campaign Design System) as DQ's specialized framework for creating consistent, high-impact campaign and marketing materials at scale that drive engagement and deliver measurable business results.

The CDS is designed to embed greater strategic thinking, creative excellence, and performance optimization into the way campaign content is conceptualized, developed, executed, and measured across all DQ marketing channels and initiatives.

By anchoring the CDS within DQ's wider marketing ecosystem - including brand management, content marketing, digital advertising, and lead generation - this introduction highlights how campaign content serves as a strategic driver of brand awareness, lead generation, and business growth.`
    },
    {
      id: 'campaign-mandate',
      title: '1.2 Campaign Content Mandate (DQ Units)',
      content: `Multiple units across DQ are responsible for producing campaign content that delivers strategic marketing impact - content designed to attract, engage, and convert target audiences across various channels and touchpoints.

These campaign-producing units include:

• DQ Content – Leads integrated marketing campaigns, brand awareness initiatives, and multi-channel promotional content across digital platforms.

• DQ Deals – Develops business development campaigns, client acquisition initiatives, and partnership marketing content.

• DTMI (Digital Transformation Management Insights) – Creates thought leadership campaigns, industry positioning initiatives, and expert-driven marketing content.

• DTMA (Digital Transformation Management Academy) – Produces educational marketing campaigns, course promotion content, and capability-building initiatives.

• DQ Designs – Develops product marketing campaigns, solution promotion content, and technical marketing materials.

• Internal Marketing – Creates employer branding campaigns, recruitment marketing, and internal engagement initiatives.`
    },
    {
      id: 'relevant-ecosystem',
      title: '1.3 Relevant Ecosystem',
      content: `The CDS guidelines apply universally across the DQ campaign ecosystem and must be upheld to maintain consistency, quality, and brand alignment in every campaign output.

This includes all campaign formats, channels, and marketing touchpoints where DQ campaign content is created or deployed:

• Digital advertising campaigns across all paid media channels

• Email marketing campaigns and automated sequences

• Social media campaigns and organic content initiatives

• Content marketing campaigns and thought leadership series

• Product launch campaigns and solution promotion initiatives

• Event marketing campaigns and webinar promotion content

• Partnership and co-marketing campaign materials

• Internal campaigns and employee engagement initiatives`
    },
    {
      id: 'campaign-planning-timeline',
      title: '1.4 Campaign Planning | Timeline & Milestones',
      content: `Campaign planning within CDS follows a structured approach that ensures strategic alignment, creative excellence, and measurable outcomes. This section outlines the essential timeline and milestone framework for campaign development.

The planning process includes:

• Strategic campaign mapping and target audience analysis

• Campaign calendar development and resource allocation

• Creative development checkpoints and approval milestones

• Media planning and distribution strategy development

• Performance tracking setup and measurement framework

• Stakeholder alignment and campaign approval workflows`
    },
    {
      id: 'campaign-planning-tracker',
      title: '1.5 Campaign Planning | Tracker',
      content: `The campaign planning tracker provides a comprehensive system for monitoring campaign development progress, ensuring accountability, and maintaining quality standards throughout the campaign lifecycle.

Key tracking elements include:

• Campaign status and progress indicators

• Creative review checkpoints and approvals

• Budget allocation and timeline management

• Performance metrics and ROI measurement

• Stakeholder feedback and iteration tracking

• Media performance and optimization insights`
    },
    {
      id: 'purpose',
      title: '1.6 CDS | Purpose',
      content: `CDS defines DQ's unified approach to creating strategic, scalable, high-impact marketing campaigns. The CDS is defined as a strategic system that ensures all campaign content is purposefully planned, professionally executed, and effectively measured to maximize marketing impact and business results.

It provides a unified framework that brings strategic thinking, creative excellence, and performance optimization to the entire campaign development lifecycle.

By applying CDS, DQ ensures that every campaign output - whether a digital advertising campaign, email marketing sequence, social media initiative, or integrated marketing program - maintains consistent brand standards, delivers compelling messaging, and achieves measurable performance outcomes.

This leads to stronger brand recognition, improved lead generation, enhanced market positioning, streamlined campaign development processes, and higher return on marketing investment across all channels and initiatives.`
    },
    {
      id: 'implementation-guidelines',
      title: '1.7 Implementation Guidelines',
      content: `This section provides comprehensive guidelines for implementing CDS across all DQ campaign development workflows, ensuring consistent application and maximum marketing effectiveness.

Implementation includes:

• Team training and creative capability building programs

• Tool integration and campaign workflow optimization

• Quality assurance processes and creative review protocols

• Performance measurement and campaign optimization strategies

• Change management and adoption strategies across marketing teams

The implementation approach is designed to be scalable, flexible, and adaptable to different campaign types and marketing objectives while maintaining the core principles and brand standards of CDS.`
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