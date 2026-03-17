import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { OnboardingChatbot } from '../components/OnboardingChatbot';
import { GuidelineSection } from '../pages/strategy/shared/GuidelineSection';

interface JourneyPhase {
  id: string;
  month: number;
  title: string;
  subtitle: string;
  theme: string;
  primaryQuestion: string;
  whatMonthIsAbout?: string[];
  focusAreas: string[];
  whatAssociateIsDoing: string[];
  keyOutcomes: string[];
}

const journeyPhases: JourneyPhase[] = [
  {
    id: 'month-1-integrate',
    month: 1,
    title: 'Integrate',
    subtitle: 'Absorb the DQ System',
    theme: 'Belonging, Clarity, Foundation',
    primaryQuestion: 'Do I understand how DQ works and what is expected of me?',
    focusAreas: [
      'Integration into the DQ system as a whole',
      'Adoption of DQ DNA (GHC)',
      'Introduction to 6x Digitals',
      'Role clarity and expectations',
      'Understanding tools, workflows, and communication patterns'
    ],
    whatAssociateIsDoing: [
      'Learning how work flows at DQ',
      'Observing cultural behaviors and rituals',
      'Completing guided onboarding tasks (S00, simulations, shadowing)',
      'Building confidence in systems and structure'
    ],
    keyOutcomes: [
      'DQ structure & towers',
      'GHC principles',
      '6x Digitals',
      'Role expectations',
      'Feeling oriented, supported, and grounded'
    ]
  },
  {
    id: 'month-2-apply',
    month: 2,
    title: 'Apply',
    subtitle: 'Operate the DQ DNA in Real Work',
    theme: 'Execution, Consistency, Confidence',
    primaryQuestion: 'Can I apply what I learned in real work situations?',
    focusAreas: [
      'Applying DQ DNA in daily tasks',
      'Executing role responsibilities with less supervision',
      'Learning through real outputs, not theory',
      'Reducing dependency on supervision'
    ],
    whatAssociateIsDoing: [
      'Delivering real work aligned with DQ standards',
      'Practicing DQ ways of working (communication, documentation, ownership)',
      'Receiving structured coaching and feedback',
      'Adjusting based on feedback'
    ],
    keyOutcomes: [
      'Improved speed to productivity',
      'Reduced dependency on managers',
      'Observable alignment to DQ work patterns',
      'Cultural values seen in behavior, not just understanding'
    ]
  },
  {
    id: 'month-3-amplify',
    month: 3,
    title: 'Amplify',
    subtitle: 'Own the Role & Strengthen the System',
    theme: 'Ownership, Impact, Influence',
    primaryQuestion: 'Can I independently own my position and positively impact the DQ system?',
    whatMonthIsAbout: [
      'Moving from participant → contributor',
      'Demonstrating ownership without being asked',
      'Influencing outcomes, not just completing tasks',
      'Becoming a net-positive force in the system'
    ],
    focusAreas: [
      'Independent ownership of responsibilities',
      'Proactive problem-solving',
      'Strengthening team workflows',
      'Cultural reinforcement (living the DNA visibly)',
      'Early leadership behaviors (even without title)'
    ],
    whatAssociateIsDoing: [
      'Operating with minimal supervision',
      'Flagging issues early and proposing solutions',
      'Supporting peers or processes',
      'Showing accountability and initiative'
    ],
    keyOutcomes: [
      'Associate is fully embedded into DQ',
      'Trusted to deliver independently',
      'Seen as aligned with DQ culture and standards',
      'Ready for long-term growth within DQ'
    ]
  }
];

// Sidebar navigation component matching Guidelines style
interface SideNavProps {
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
}

const sections = [
  { id: 'overall-philosophy', label: 'Overall Philosophy' },
  { id: 'month-1-integrate', label: 'Month 1 — Integrate' },
  { id: 'month-2-apply', label: 'Month 2 — Apply' },
  { id: 'month-3-amplify', label: 'Month 3 — Amplify' },
  { id: 'progress-tracking', label: 'Progress Tracking' },
  { id: 'getting-started', label: 'Getting Started' },
];

function SideNav({ activeSection, onSectionClick }: SideNavProps) {
  const [currentSection, setCurrentSection] = useState(activeSection || 'overall-philosophy');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          if (sectionId) {
            setCurrentSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (activeSection) {
      setCurrentSection(activeSection);
    }
  }, [activeSection]);

  const handleClick = (sectionId: string) => {
    setCurrentSection(sectionId);
    onSectionClick?.(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto bg-white border border-gray-200 shadow-sm rounded-xl p-4">
      <div className="pr-2">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Contents
        </h3>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => handleClick(section.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  currentSection === section.id
                    ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// Simplified Hero Section matching Guidelines style
function HeroSection() {
  return (
    <div className="relative w-full min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15
        }}
      />
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #030F35 0%, #1A2E6E 40%, #2A3F7F 70%, #1A2E6E 100%)'
        }}
      />
      <div className="relative z-10 h-full flex items-center px-6 md:px-12 lg:px-16 xl:px-24 py-20">
        <div className="w-full max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="text-white max-w-4xl">
            {/* Eyebrow Label */}
            <div className="text-sm font-medium text-white/70 mb-6 tracking-wider uppercase">
              DQ Onboarding Framework
      </div>

            {/* Primary Headline */}
            <h1 className="text-[72px] font-bold mb-8 leading-[1.05] font-inter text-white">
              Your First 3 Months at DQ
          </h1>

            {/* Supporting Description */}
            <p className="text-[23px] text-white/90 mb-8 leading-relaxed font-inter max-w-3xl">
              This page will guide you through what is expected of you during your first three months at DQ from integration and learning to execution and ownership.
            </p>

            {/* Minimal Metadata */}
            <div className="text-sm text-white/60 font-inter">
              Updated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · DQ Onboarding
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OnboardingJourney() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      
      {/* Hero Section */}
      <HeroSection />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Sticky Side Navigation (placed before main content for accessibility) */}
            <aside className="lg:col-span-1">
              <SideNav />
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {/* Overall Philosophy */}
              <GuidelineSection id="overall-philosophy" title="Overall Philosophy">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Onboarding at DQ is a 90-day integration and role-enablement journey, designed to ensure every associate is:
                </p>
                <ul className="space-y-2 mb-6 text-gray-700 list-disc pl-6">
                  <li>Fully embedded into the DQ system</li>
                  <li>Aligned to DQ DNA (GHC) and 6x Digitals (6xD)</li>
                  <li>Operationally effective in their specific position</li>
                  <li>Ready to independently contribute and create impact</li>
                </ul>
              </GuidelineSection>

              {/* Journey Phases */}
              {journeyPhases.map((phase) => (
                <GuidelineSection
                  key={phase.id}
                  id={phase.id}
                  title={`Month ${phase.month} — ${phase.title} (${phase.subtitle})`}
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#030E31] mb-2">Theme:</h3>
                    <p className="text-gray-700">{phase.theme}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#030E31] mb-2">Primary Question:</h3>
                    <p className="text-gray-700 italic">"{phase.primaryQuestion}"</p>
                  </div>

                  {phase.whatMonthIsAbout && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-[#030E31] mb-2">What Month {phase.month} Is Really About:</h3>
                      <ul className="space-y-2 text-gray-700 list-disc pl-6">
                        {phase.whatMonthIsAbout.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#030E31] mb-3">Focus Areas:</h3>
                    <ul className="space-y-2 text-gray-700 list-disc pl-6">
                      {phase.focusAreas.map((area, areaIndex) => (
                        <li key={areaIndex}>{area}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#030E31] mb-3">What the Associate Is Doing:</h3>
                    <ul className="space-y-2 text-gray-700 list-disc pl-6">
                      {phase.whatAssociateIsDoing.map((activity, activityIndex) => (
                        <li key={activityIndex}>{activity}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#030E31] mb-3">Key Outcomes:</h3>
                    {phase.month === 1 ? (
                      <>
                        <p className="text-gray-700 mb-3 font-medium">Clear understanding of:</p>
                        <ul className="space-y-2 text-gray-700 list-disc pl-6">
                          {phase.keyOutcomes.map((outcome, outcomeIndex) => (
                            <li key={outcomeIndex}>{outcome}</li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <ul className="space-y-2 text-gray-700 list-disc pl-6">
                        {phase.keyOutcomes.map((outcome, outcomeIndex) => (
                          <li key={outcomeIndex}>{outcome}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </GuidelineSection>
              ))}

              {/* Progress Tracking */}
              <GuidelineSection id="progress-tracking" title="5. Progress Tracking">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Your onboarding progress at DQ is tracked across the 3-month onboarding journey to ensure structured integration, role readiness, and cultural alignment. Progress tracking is designed to provide clarity, visibility, and timely support.
                </p>
                
                <h3 className="text-xl font-semibold text-[#030E31] mb-3 mt-6">
                  DQ DNA & Framework Adoption
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Your understanding and adoption of DQ's DNA (GHC) and Agile 6xD / 6x Digitals are tracked throughout Month 1 and reinforced in Months 2 and 3. This ensures alignment with DQ's ways of working, decision-making, and execution standards.
                </p>

                <h3 className="text-xl font-semibold text-[#030E31] mb-3 mt-6">
                  Position & Role Execution
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Your progress in onboarding into your specific position is tracked based on:
                </p>
                <ul className="space-y-2 text-gray-700 mb-6 list-disc pl-6">
                  <li>Role clarity and responsibility alignment</li>
                  <li>Completion of role-based onboarding tasks</li>
                  <li>Application of learnings in real work scenarios</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-6">
                  This ensures you are not only learning, but progressively becoming effective in your role.
                </p>

                <h3 className="text-xl font-semibold text-[#030E31] mb-3 mt-6">
                  Monthly Progress Milestones
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Progress is reviewed across the onboarding phases:
                </p>
                <ul className="space-y-2 text-gray-700 mb-6 list-disc pl-6">
                  <li>Month 1 – Integration: Understanding DQ systems, DNA, frameworks, and role</li>
                  <li>Month 2 – Application: Applying DQ DNA and frameworks in day-to-day work</li>
                  <li>Month 3 – Ownership: Independent role ownership and system contribution</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  Your combined progress provides a clear view of where you are in your onboarding journey, what has been achieved, and what comes next.
                </p>
              </GuidelineSection>

              {/* Getting Started */}
              <GuidelineSection id="getting-started" title="6. Getting Started">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Your onboarding journey begins with Month 1: Integration into the DQ System.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Start by engaging with the onboarding materials and activities provided through DQ's Digital Canvas and Learning Systems. These are intentionally structured to help you:
                </p>
                <ul className="space-y-2 text-gray-700 mb-6 list-disc pl-6">
                  <li>Understand how DQ operates (GHC)</li>
                  <li>Learn how DQ designs, builds, and scales through Agile 6xD and its products</li>
                  <li>Gain clarity on your position, responsibilities, and expectations</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-6">
                  This onboarding journey is a guided experience designed to support your learning, integration, and confidence-building over the first three months. Take the time to understand the foundations, actively participate in tasks and discussions, and reach out to your Line Manager or HR whenever clarification or support is needed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    onClick={() => navigate('/onboarding/welcome')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#030E31] border-2 border-[#030E31] font-semibold rounded-lg hover:bg-[#030E31] hover:text-white transition-all duration-200"
                  >
                    Back to Overview
                  </button>
                </div>
              </GuidelineSection>
            </div>
          </div>
        </div>
      </main>

      <OnboardingChatbot />
      <Footer />
    </div>
  );
}
