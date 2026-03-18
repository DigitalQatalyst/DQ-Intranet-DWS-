import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon } from 'lucide-react';
import { CIDS_SERVICE_CARDS } from '@/data/cidsServiceCards';
import MarkdownRenderer from '../../components/guides/MarkdownRenderer';
import { SummaryTable } from '../../pages/guidelines/wfh-guidelines/SummaryTable';
import { FullTableModal } from '../../pages/guidelines/wfh-guidelines/FullTableModal';

export default function CIDSServiceDetailPage() {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  
  const card = CIDS_SERVICE_CARDS.find(c => c.id === cardId);
  
  // Modal state management for tables
  const [tableModalOpen, setTableModalOpen] = useState<{ [key: string]: boolean }>({});
  
  // Active section tracking
  const [activeSection, setActiveSection] = useState<string>('overview');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  
  const openTableModal = (subsectionId: string) => {
    setTableModalOpen(prev => ({ ...prev, [subsectionId]: true }));
  };
  
  const closeTableModal = (subsectionId: string) => {
    setTableModalOpen(prev => ({ ...prev, [subsectionId]: false }));
  };

  // Scroll tracking with IntersectionObserver
  useEffect(() => {
    if (!card) return;

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -70% 0px',
      threshold: [0, 0.1, 0.5, 1]
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Sort entries by intersection ratio and position to find the most visible section
      const visibleEntries = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => {
          // Prioritize entries with higher intersection ratio
          if (b.intersectionRatio !== a.intersectionRatio) {
            return b.intersectionRatio - a.intersectionRatio;
          }
          // If ratios are equal, prioritize the one higher on the page
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });

      if (visibleEntries.length > 0) {
        const currentEntry = visibleEntries[0];
        const currentId = currentEntry.target.id;
        
        // Check if this is a Stage title itself (e.g., "3" for Stage 01)
        const isStageTitle = card.content.subsections?.some(s => {
          const sectionId = s.id.toLowerCase().replace(/\./g, '-').replace(/\s+/g, '-');
          return sectionId === currentId && s.title.startsWith('Stage');
        });
        
        if (isStageTitle) {
          // If viewing the Stage title itself, highlight it
          setActiveSection(currentId);
          return;
        }
        
        // Check if this is a subsection of a Stage (e.g., "3-1" is a subsection of Stage "3")
        // If so, highlight the Stage title in navigation instead of the subsection
        const stageMatch = currentId.match(/^(\d+)-/);
        if (stageMatch) {
          const stageId = stageMatch[1];
          // Check if this Stage exists in the subsections
          const stageSubsection = card.content.subsections?.find(s => {
            const sectionId = s.id.toLowerCase().replace(/\./g, '-').replace(/\s+/g, '-');
            return sectionId === stageId && s.title.startsWith('Stage');
          });
          
          if (stageSubsection) {
            // Highlight the Stage title when viewing its subsections
            setActiveSection(stageId);
            return;
          }
        }
        
        // For other sections (like "1-1", "1-2", "overview", etc.), highlight them directly
        setActiveSection(currentId);
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe overview section
    const overviewElement = document.getElementById('overview');
    if (overviewElement) {
      observer.observe(overviewElement);
    }

    // Observe all subsection sections
    card.content.subsections?.forEach((subsection) => {
      const sectionId = subsection.id.toLowerCase().replace(/\./g, '-').replace(/\s+/g, '-');
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [card]);

  // Handle smooth scroll on navigation click
  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!card) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Card Not Found</h1>
            <p className="text-gray-600 mb-6">The requested CI.DS service card could not be found.</p>
            <Link
              to="/marketplace/design-system?tab=cids"
              className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--guidelines-primary-solid)] text-white text-sm font-semibold hover:bg-[var(--guidelines-primary-solid-hover)] transition-colors"
            >
              Back to CI.DS Services
            </Link>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 guidelines-theme">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
      {/* Breadcrumbs - Above Hero Section */}
      <div className="container mx-auto px-4 pt-4 max-w-[90rem]">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                <HomeIcon size={16} className="mr-1" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <Link to="/marketplace/design-system?tab=cids" className="ml-1 text-gray-500 hover:text-gray-700 md:ml-2">
                  DQ Design System
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <Link to="/marketplace/design-system?tab=cids" className="ml-1 text-gray-500 hover:text-gray-700 md:ml-2">
                  CI.DS
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1 text-gray-700 md:ml-2">{card.title}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      {/* Hero Section */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/images/content.PNG)',
          }}
        />

        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 text-white bg-[#030E31]/60">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight font-inter text-white">
              {card.title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-white/90 font-inter font-semibold">
              <span>DQ Design</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20"></div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-[90rem]">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12 min-h-0">
              {/* Overview Section */}
              {card.content.overview && (
                <section id="overview" className="mb-16 scroll-mt-24">
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#030E31] via-[#0A1A3B] to-transparent rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 pl-6 font-inter tracking-tight">
                      1. Introduction
                    </h2>
                  </div>
                  <div className="pl-6 prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <React.Suspense fallback={<div className="animate-pulse text-gray-400">Loading content…</div>}>
                      <MarkdownRenderer body={card.content.overview} />
                    </React.Suspense>
                  </div>
                </section>
              )}

              {/* Subsections */}
              {card.content.subsections && card.content.subsections.length > 0 && (
                <div>
                  {card.content.subsections.map((subsection) => {
                    const sectionId = subsection.id.toLowerCase().replace(/\./g, '-').replace(/\s+/g, '-');

                    // Check if this is a main section (whole number) or subsection
                    const isMainSection = /^\d+$/.test(subsection.id);

                    // Decide whether to prefix with the numeric ID
                    const shouldPrefixWithId =
                      subsection.id !== '1.05' &&
                      subsection.id !== '1.06' &&
                      /^\d/.test(subsection.id);

                    let displayTitle = subsection.title;

                    if (shouldPrefixWithId) {
                      // If the id is a whole number (e.g. "2", "3", "4"), add a dot after it
                      if (/^\d+$/.test(subsection.id)) {
                        displayTitle = `${subsection.id}. ${subsection.title}`;
                      } else {
                        // For decimal-style ids (e.g. "1.1", "2.7", "5.10"), prepend as-is
                        displayTitle = `${subsection.id} ${subsection.title}`;
                      }
                    }

                    return (
                      <section key={subsection.id} id={sectionId} className="mb-16 scroll-mt-24">
                        <div className="relative">
                          {/* Only show gradient bar for main sections */}
                          {isMainSection && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#030E31] via-[#0A1A3B] to-transparent rounded-full"></div>
                          )}
                          <h2 className={`${isMainSection ? 'text-3xl md:text-4xl pl-6' : 'text-2xl md:text-3xl pl-12'} font-bold text-gray-900 mb-8 font-inter tracking-tight`}>
                            {displayTitle}
                          </h2>
                        </div>
                        <div className={`${isMainSection ? 'pl-6' : 'pl-12'} prose prose-lg max-w-none text-gray-700 leading-relaxed`}>
                          {subsection.tableData ? (
                            <>
                              <React.Suspense fallback={<div className="animate-pulse text-gray-400">Loading content…</div>}>
                                <MarkdownRenderer body={subsection.content} />
                              </React.Suspense>
                              <SummaryTable
                                title=""
                                columns={subsection.tableData.columns}
                                data={subsection.tableData.data}
                                onViewFull={() => openTableModal(subsection.id)}
                              />
                              {subsection.contentAfterTable && (
                                <React.Suspense fallback={<div className="animate-pulse text-gray-400">Loading content…</div>}>
                                  <MarkdownRenderer body={subsection.contentAfterTable} />
                                </React.Suspense>
                              )}
                              <FullTableModal
                                isOpen={tableModalOpen[subsection.id] || false}
                                onClose={() => closeTableModal(subsection.id)}
                                title={`${subsection.id} ${subsection.title}`}
                                columns={subsection.tableData.columns}
                                data={subsection.tableData.data}
                              />
                            </>
                          ) : (
                            <React.Suspense fallback={<div className="animate-pulse text-gray-400">Loading content…</div>}>
                              <MarkdownRenderer body={subsection.content} />
                            </React.Suspense>
                          )}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="bg-gray-50 p-6">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Contents
                  </h2>
                  <div className="space-y-2">
                    {card.content.overview && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(e, 'overview');
                        }}
                        style={{ outline: 'none', border: 'none' }}
                        className={`block w-full text-left px-3 py-2 text-sm transition-all duration-200 outline-none ${
                          activeSection === 'overview'
                            ? 'bg-blue-200 text-blue-900 font-medium outline-none'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none active:outline-none'
                        }`}
                      >
                        1. Introduction
                      </button>
                    )}
                    {card.content.subsections
                      ?.filter((subsection) => {
                        // Only show: "Who is this for?", "What problem does it solve?", and all Stage titles
                        return (
                          subsection.title === 'Who is this for?' ||
                          subsection.title === 'What problem does it solve?' ||
                          subsection.title.startsWith('Stage')
                        );
                      })
                      .map((subsection) => {
                        const sectionId = subsection.id.toLowerCase().replace(/\./g, '-').replace(/\s+/g, '-');
                        const isActive = activeSection === sectionId;
                        // Find the original index in the full subsections array to calculate stage number correctly
                        const originalIndex = card.content.subsections?.findIndex(s => s.id === subsection.id) ?? -1;
                        // Count how many Stage titles come before this one (including this one) in the original array
                        let stageCount = 0;
                        if (originalIndex >= 0 && card.content.subsections) {
                          for (let i = 0; i <= originalIndex; i++) {
                            if (card.content.subsections[i]?.title.startsWith('Stage')) {
                              stageCount++;
                            }
                          }
                        }
                        // Add number prefix only for Stage titles: 3 for first Stage, 4 for second, etc.
                        const displayTitle = subsection.title.startsWith('Stage') 
                          ? `${stageCount + 2}. ${subsection.title}`
                          : subsection.title;
                        return (
                          <button
                            key={subsection.id}
                            onClick={(e) => {
                              e.preventDefault();
                              handleNavClick(e, sectionId);
                            }}
                            style={{ outline: 'none', border: 'none' }}
                            className={`block w-full text-left px-3 py-2 text-sm transition-all duration-200 outline-none ${
                              isActive
                                ? 'bg-blue-200 text-blue-900 font-medium outline-none'
                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none active:outline-none'
                            }`}
                          >
                            {displayTitle}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
}
