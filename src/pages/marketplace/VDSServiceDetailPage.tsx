import { useState, useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';

export default function VDSServiceDetailPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[id]');
      const scrollPosition = window.scrollY + 200;

      sections.forEach((section) => {
        const element = section as HTMLElement;
        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(element.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    {
      id: 'introduction',
      title: '1.1 Introduction',
      content: `This section introduces the V.DS (Video Design System) as DQ's comprehensive framework for creating strategic, scalable, high-impact video content that drives engagement and delivers measurable business results.

The V.DS is designed to embed greater intentionality, creative excellence, and performance optimization into the way video content is conceptualized, produced, reviewed, and distributed across all DQ platforms and channels.

By anchoring the V.DS within DQ's wider content ecosystem - including DTMB (Books), DTMI (Insights), DTMP (Platform), TMaaS (Deliverables), and DTMA (Academy) - this introduction highlights how video content serves as a strategic driver of brand awareness, thought leadership, and audience engagement.`
    },
    {
      id: 'video-mandate',
      title: '1.2 Video Content Mandate (DQ Units)',
      content: `Multiple units across DQ are responsible for producing video content that delivers strategic impact - content designed to educate, inspire, and drive targeted actions across diverse audiences and platforms.

These video-producing units include:

• DQ Content – Leads video marketing campaigns, brand storytelling initiatives, and multi-platform video content across digital channels.

• DTMA (Digital Transformation Management Academy) – Produces educational video content, course materials, training modules, and instructional videos for capability building.

• DTMI (Digital Transformation Management Insights) – Creates thought leadership videos, expert interviews, trend analysis content, and industry positioning videos.

• DQ Deals – Develops client testimonial videos, case study presentations, proposal support videos, and business development content.

• DQ Designs – Produces product demonstration videos, solution explainer content, and technical showcase videos.

• Internal Communications – Creates company culture videos, leadership messages, team spotlights, and employee engagement content.`
    },
    {
      id: 'relevant-ecosystem',
      title: '1.3 Relevant Ecosystem',
      content: `The V.DS guidelines apply universally across the DQ video ecosystem and must be upheld to maintain consistency, quality, and brand alignment in every video output.

This includes all video formats, platforms, and distribution channels where DQ video content is created or shared:

• Educational and training video content across all learning platforms
• Marketing and promotional videos for digital campaigns and social media
• Thought leadership and expert interview content for industry positioning
• Product demonstration and solution showcase videos for sales enablement
• Client testimonial and case study videos for business development
• Internal communication and culture videos for employee engagement
• Event and webinar recordings for knowledge sharing and lead generation
• Social media video content across all digital marketing channels`
    },
    {
      id: 'purpose',
      title: '1.4 V.DS | Purpose',
      content: `The V.DS is defined as a strategic system that ensures all video content is purposefully planned, professionally produced, and effectively distributed to maximize audience engagement and business impact.

It provides a unified framework that brings creative excellence, technical standards, and performance optimization to the entire video production lifecycle.

By applying V.DS, DQ ensures that every video output - whether an educational course video, marketing campaign content, thought leadership interview, or product demonstration - maintains consistent visual standards, delivers compelling storytelling, and achieves measurable performance outcomes.

This leads to stronger brand recognition, improved audience engagement, enhanced thought leadership positioning, streamlined production processes, and higher return on video content investment across all platforms and channels.`
    }
  ];
  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                Video Design System (V.DS)
              </h1>

              <p className="text-base text-white/80 max-w-xl leading-relaxed">
                V.DS defines DQ's cinematic system for creating strategic, scalable, high-impact video content.
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
                    <div key={section.id} id={section.id} className="scroll-mt-8">
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