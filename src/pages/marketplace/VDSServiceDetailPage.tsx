import { useState, useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';

export default function VDSServiceDetailPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  // Scroll spy functionality
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
      id: 'who-is-this-for',
      title: '1.2 Who is this for?',
      content: `Across DigitalQatalyst, video content is created by diverse teams and for multiple purposes - onboarding videos that introduce DQ's culture, learning modules that build capability, marketing campaigns that generate engagement, thought leadership pieces that establish authority, and strategic narratives that drive transformation. V.DS is for all of these creators. It serves scriptwriters crafting compelling narratives, video editors refining rhythm and flow, video designers producing visuals and motion sequences, video reviewers ensuring quality and accuracy, marketers strategizing distribution and performance, and executive approvers validating brand alignment. Whether someone is filming authentic testimonials, generating AI-powered explainers, or producing cinematic brand stories, V.DS provides the unified framework that guides every stage from ideation to publication, ensuring consistent excellence across all DQ video outputs.`
    },
    {
      id: 'problem-solved',
      title: '1.3 What problem does it solve?',
      content: `Before V.DS, video production often evolved inconsistently across teams - each unit working with different standards, formats, and review processes. Videos were created without strategic alignment, quality varied based on individual effort, and teams spent time fixing misalignments instead of enhancing storytelling impact. V.DS transforms this experience by providing a shared, end-to-end system that brings structure and intentionality to the entire video lifecycle - from strategic planning and ideation to scripting, storyboarding, production, review, and distribution. By introducing common standards, clear roles, and quality checkpoints, V.DS removes ambiguity, reduces rework, and makes cinematic excellence repeatable rather than accidental. As a result, teams spend less time correcting and coordinating, and more time creating videos that are visually compelling, narratively coherent, and strategically aligned - allowing video content to function as a powerful asset that consistently advances DQ's thought leadership, brand trust, and audience engagement at scale.`
    },
    {
      id: 'video-mandate',
      title: '1.4 Video Content Mandate (DQ Units)',
      content: `Multiple units across DQ contribute to producing exceptional, high-impact video content that shapes perception, influences decisions, and inspires meaningful action. Each unit develops video outputs aligned with its function, audience, and strategic purpose.

Primary Video-Producing Units:

• DQ Marketing – Produces campaign, social, and brand videos designed to captivate audiences and strengthen emotional engagement.

• DQ HRA – Creates onboarding, training, and culture videos that enhance internal alignment, learning, and belonging.

• DQ DTMA – Develops high-quality eLearning and course videos, merging pedagogical clarity with cinematic execution.

• DQ Stories – Crafts narrative-driven explainers and storytelling videos that simplify complex ideas with visual elegance and impact.`
    },
    {
      id: 'relevant-ecosystem',
      title: '1.5 Relevant Ecosystem',
      content: `The V.DS standards define the creative and technical DNA of every DQ video. They apply universally across the content ecosystem to ensure cinematic consistency, storytelling harmony, and production excellence across all video types and delivery channels.

Where V.DS Applies:

• Internal communications and executive briefings that require clarity and professionalism

• DTMB companion and promotional videos that visually extend DQ's thought leadership

• DTMA learning modules and course materials designed for immersive, high-retention education

• DTMI insights and thought-leadership videos that distill ideas with elegance and authority

• Business development, proposals, and client presentations that demand credibility and impact

• DQ brand campaigns and social storytelling assets that build emotional connection and trust

Mandate: Every DQ video - whatever its format, length, or platform - must exemplify cinematic quality, narrative precision, and visual excellence, meeting the highest standard of impact and brand distinction.`
    },
    {
      id: 'purpose',
      title: '1.6 V.DS | Purpose',
      content: `The V.DS is a strategic, end-to-end system that governs how video content is conceptualized, produced, and distributed. It transforms creativity into structured excellence, ensuring every output delivers clarity, emotion, and measurable performance.

Core Outcomes:

• Cinematic quality that elevates DQ's brand presence and message delivery.

• Narrative coherence ensuring every frame supports the story.

• Seamless collaboration across creative, technical, and strategic teams.

• Optimized viewer engagement through data-driven insights and design.

• Consistent brand expression across every channel and audience touchpoint.`
    },
    {
      id: 'key-stakeholders',
      title: '1.7 V.DS | Key Stakeholders',
      content: `Delivering high-impact video excellence requires collaboration among distinct creative and operational roles, each accountable for maintaining DQ's quality standards and production flow.

Scriptwriters design compelling narratives, structure pacing, and maintain message fidelity to DQ's tone and purpose.

Video Editors refine rhythm, transitions, and storytelling flow for maximum clarity and emotional engagement.

Video Designers produce visuals, animation, and motion sequences that enhance storytelling and brand recognition.

Video Reviewers ensure technical soundness, conceptual accuracy, and adherence to production standards.

Marketers strategize distribution, SEO optimization, and performance tracking for amplified reach and ROI.

Executive Approvers guarantee that each video upholds DQ's vision, values, and excellence benchmarks before release.`
    },
    {
      id: 'video-strategy',
      title: '2.1 Stage 00 – Video Strategy (V.PF)',
      content: `Stage 00 defines the strategic lens through which all video productions are conceived. It ensures videos are not produced in isolation but anchored in DQ's overarching narrative, frameworks, product positioning, and audience engagement strategy. This stage guarantees that every video serves a clear business, educational, or branding purpose, directly contributing to DQ's strategic and communication objectives.

By establishing this strategic foundation, each video aligns with DQ's transformation philosophy, enhances the quality of visual storytelling, and reinforces thought leadership through cinematic impact, emotional resonance, and narrative clarity.`
    },
    {
      id: 'dq-frameworks',
      title: '2.2 DQ Stories | Frameworks',
      content: `Every video created under the V.DS (Video Design System) must align with DQ's master narrative: the transformation journey toward Digital Cognitive Organizations (DCO), serving as the creative compass for all scriptwriting, visual design, and emotional tone. By embedding this DCO story, each video reinforces DQ's transformation mission and intellectual leadership, engages audiences through purposeful storytelling and high-impact visuals, and delivers consistent, cinematic cohesion across DQ's global ecosystem, ultimately strengthening its emotional and visual footprint while elevating brand perception and audience engagement worldwide.`
    },
    {
      id: 'video-artefact-class',
      title: '2.3 Video Artefact Class (VAC)',
      content: `DQ video productions are organized into five Video Artefact Classes (VACs) that serve as high-level frameworks guiding creative direction, quality standards, and message coherence. These classes ensure every DQ video remains diverse in form yet unified in purpose, tone, and impact - maintaining full alignment with DQ's strategic vision and cinematic standards of excellence.

The five Video Artefact Classes (VACs) include:

Thought Leadership Videos – Designed to shape perspectives, communicate insight, and establish DQ's authority through powerful storytelling and visual intelligence.

Product & Service Videos – Created to demonstrate, promote, or enable adoption of DQ's offerings through engaging walkthroughs and solution-driven narratives.

Brand & Culture Videos – Developed to strengthen internal identity and external reputation, capturing DQ's essence and people in motion.

Education & Learning Videos – Produced to simplify complex ideas, enhance digital literacy, and foster capability-building through visually engaging learning experiences.

Community & Ecosystem Videos – Crafted to engage markets, partners, and audiences through storytelling that connects and inspires participation in DQ's wider ecosystem.

These VACs form the backbone of the V.DS, ensuring all video content meets DQ's high creative and technical standards - balancing diversity with coherence and consistently delivering visual impact aligned to DQ's vision.`
    },
    {
      id: 'video-development-lifecycle',
      title: '2.4 Video Development Lifecycle (VDL)',
      content: `The Video Development Lifecycle (VDL) defines the two interconnected phases of video production - Creation and Distribution - ensuring each project flows through structured creativity, rigorous quality control, and data-driven release strategies.

Creation Phase transforms ideas into visually and emotionally compelling deliverables through a structured creative and technical workflow:

Ideation & Validation – Define the creative vision, storyline, and alignment with DQ's strategy and overarching narrative.

Production Strategy & Planning – Document objectives, contributors, and milestones in the Video Production Tracker, setting schedules, resources, and requirements for both filmed and AI-generated projects.

Scripting & Storyboarding – Convert approved ideas into concise scripts and visual boards, balancing clarity, pacing, and emotional tone.

Video Production & Composition – Execute creation across two paths: filmed videos emphasizing authenticity and emotion, and AI-generated videos offering efficiency and scalability - each aligned to purpose and DQ standards.

Review & Refinement – Perform final reviews to confirm narrative consistency, visual polish, and brand alignment before distribution.

Distribution Phase focuses on maximizing video visibility and measuring viewer impact:

Publishing & Tagging – Upload videos with metadata, subtitles, and SEO alignment.

Promotion & Analytics Loop – Launch campaigns, monitor engagement metrics, and refine strategies for continuous improvement.

Goal: Deliver cinematic-quality videos that consistently reflect DQ's brand excellence and drive emotional and intellectual connection.`
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