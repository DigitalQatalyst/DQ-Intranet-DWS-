import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon } from 'lucide-react';
import { CDS_SERVICE_CARDS } from '@/data/cdsServiceCards';
import MarkdownRenderer from '../../components/guides/MarkdownRenderer';
import { SummaryTable } from '../../pages/guidelines/wfh-guidelines/SummaryTable';
import { FullTableModal } from '../../pages/guidelines/wfh-guidelines/FullTableModal';

export default function CDSServiceDetailPage() {
  const { cardId } = useParams<{ cardId: string }>();

  const card = CDS_SERVICE_CARDS.find(c => c.id === cardId);

  const [tableModalOpen, setTableModalOpen] = useState<{ [key: string]: boolean }>({});
  const [activeSection, setActiveSection] = useState<string>('overview');
  const introSection = card?.content.subsections?.find(s => s.id === '1');
  const defaultVersion = '1.0.1';
  const defaultDate = '23.10.2025';
  const heroMeta = (() => {
    if (!introSection?.content) return { date: '', version: '' };
    const versionMatch = introSection.content.match(/Version\s*([^|\n]+)/i);
    const dateMatch = introSection.content.match(/Date:\s*([^\n]+)/i);
    return {
      version: versionMatch ? versionMatch[1].trim() : defaultVersion,
      date: dateMatch ? dateMatch[1].trim() : defaultDate
    };
  })();

  const getSectionId = (rawId: string) =>
    rawId.toLowerCase().replace(/\./g, '-').replace(/\s+/g, '-');

  const openTableModal = (subsectionId: string) => {
    setTableModalOpen(prev => ({ ...prev, [subsectionId]: true }));
  };

  const closeTableModal = (subsectionId: string) => {
    setTableModalOpen(prev => ({ ...prev, [subsectionId]: false }));
  };

  // Scroll tracking with IntersectionObserver (aligned with CI.DS behaviour)
  useEffect(() => {
    if (!card) return;

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -70% 0px',
      threshold: [0, 0.1, 0.5, 1]
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const visibleEntries = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => {
          if (b.intersectionRatio !== a.intersectionRatio) {
            return b.intersectionRatio - a.intersectionRatio;
          }
          return a.boundingClientRect.top - b.boundingClientRect.top;
        });

      if (visibleEntries.length > 0) {
        const currentEntry = visibleEntries[0];
        const currentId = currentEntry.target.id;

        const isStageTitle = card.content.subsections?.some(s => {
          const sectionId = getSectionId(s.id);
          return sectionId === currentId && s.title.toLowerCase().includes('stage');
        });

        if (isStageTitle) {
          setActiveSection(currentId);
          return;
        }

        const stageMatch = currentId?.match(/^(\d+)-/);
        if (stageMatch) {
          const stageId = stageMatch[1];
          const stageSubsection = card.content.subsections?.find(s => {
            const sectionId = getSectionId(s.id);
            return sectionId === stageId && s.title.toLowerCase().includes('stage');
          });

          if (stageSubsection) {
            setActiveSection(stageId);
            return;
          }
        }

        if (currentId) {
          setActiveSection(currentId);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const overviewElement = document.getElementById('overview');
    if (overviewElement && card.content.overview) {
      observer.observe(overviewElement);
    }

    card.content.subsections?.forEach((subsection) => {
      const sectionId = getSectionId(subsection.id);
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [card]);

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">CDS Service Card Not Found</h1>
          <p className="text-gray-600 mb-8">The requested CDS service card could not be found.</p>
          <Link
            to="/marketplace/design-system?tab=cds"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to CDS Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 pt-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900 flex items-center">
            <HomeIcon className="w-4 h-4 mr-1" />
            Home
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <Link to="/marketplace" className="hover:text-gray-900">Marketplace</Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <Link
            to="/marketplace/design-system?tab=cds"
            className="hover:text-gray-900"
          >
            Design System
          </Link>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">CDS</span>
          <ChevronRightIcon className="w-4 h-4 mx-2" />
          <span className="text-gray-900 font-medium">{card.title}</span>
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
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-inter text-white">
                CDS Framework
              </h1>
            </div>

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
                <section id="overview" className="mb-12 scroll-mt-24">
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#030E31] via-[#0A1A3B] to-transparent rounded-full"></div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 pl-6 font-inter tracking-tight">
                      Overview
                    </h2>
                  </div>
                  <div className="pl-6 prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <MarkdownRenderer body={card.content.overview} />
                  </div>
                </section>
              )}

              {/* Subsections */}
              {card.content.subsections?.map((subsection, index) => {
                const sectionId = getSectionId(subsection.id);
                // Check if this is a main section (whole number like "1", "2", "3") or subsection (like "1.1", "3.1")
                const isMainSection = /^\d+$/.test(subsection.id);
                return (
                  <section
                    key={subsection.id}
                    id={sectionId}
                    className={`mb-12 scroll-mt-24 ${index === 0 && !card.content.overview ? 'mt-0' : ''}`}
                  >
                    <div className="relative">
                      {/* Only show gradient bar for main sections (whole numbers) */}
                      {isMainSection && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#030E31] via-[#0A1A3B] to-transparent rounded-full"></div>
                      )}
                      <h2 className={`${isMainSection ? 'text-3xl md:text-4xl pl-6' : 'text-2xl md:text-3xl pl-12'} font-bold text-gray-900 mb-8 font-inter tracking-tight`}>
                        {subsection.title}
                      </h2>
                    </div>
                    <div className={`${isMainSection ? 'pl-6' : 'pl-12'} prose prose-lg max-w-none text-gray-700 leading-relaxed`}>
                      <MarkdownRenderer body={subsection.content} />
                    </div>

                    {subsection.tableData && (
                      <div className={`mt-6 ${isMainSection ? 'pl-6' : 'pl-12'}`}>
                        <SummaryTable
                          data={subsection.tableData.data}
                          columns={subsection.tableData.columns}
                          onViewFullTable={() => openTableModal(subsection.id)}
                        />
                        <FullTableModal
                          isOpen={tableModalOpen[subsection.id] || false}
                          onClose={() => closeTableModal(subsection.id)}
                          title={subsection.title}
                          data={subsection.tableData.data}
                          columns={subsection.tableData.columns}
                        />
                      </div>
                    )}

                    {subsection.contentAfterTable && (
                      <div className={`mt-6 ${isMainSection ? 'pl-6' : 'pl-12'} prose max-w-none`}>
                        <MarkdownRenderer body={subsection.contentAfterTable} />
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="bg-gray-50 p-6">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Contents
                  </h2>
                  <div className="space-y-2">
                    {(card.content.overview || card.content.subsections?.find(s => s.id === '1' && s.title.includes('Introduction'))) && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const introSection = card.content.subsections?.find(s => s.id === '1');
                          const sectionId = introSection ? getSectionId(introSection.id) : 'overview';
                          handleNavClick(e, sectionId);
                        }}
                        style={{ outline: 'none', border: 'none' }}
                        className={`block w-full text-left px-3 py-2 text-sm transition-all duration-200 outline-none ${
                          activeSection === '1' || activeSection === 'overview'
                            ? 'bg-blue-200 text-blue-900 font-medium outline-none'
                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none active:outline-none'
                        }`}
                      >
                        1. Introduction
                      </button>
                    )}
                    {card.content.subsections
                      ?.filter((subsection) => {
                        const title = subsection.title || '';
                        // Only show: "Who is this for?", "What problem does it solve?", and whole number stages
                        const isWholeNumber = /^\d+$/.test(subsection.id);
                        const isStage = title.toLowerCase().includes('stage');
                        return (
                          title === 'Who is this for?' ||
                          title === 'What problem does it solve?' ||
                          (isWholeNumber && isStage && subsection.id !== '1')
                        );
                      })
                      .map((subsection) => {
                        const sectionId = getSectionId(subsection.id);
                        const isActive = activeSection === sectionId;
                        const originalIndex = card.content.subsections?.findIndex(s => s.id === subsection.id) ?? -1;
                        let stageCount = 0;
                        if (originalIndex >= 0 && card.content.subsections) {
                          for (let i = 0; i <= originalIndex; i++) {
                            const sub = card.content.subsections[i];
                            if (sub && /^\d+$/.test(sub.id) && sub.title.toLowerCase().includes('stage')) {
                              stageCount++;
                            }
                          }
                        }
                        const isStage = subsection.title.toLowerCase().includes('stage');
                        // For stages, use the ID number directly (already whole numbers: 2, 3, 4, etc.)
                        const baseStageTitle = subsection.title.replace(/^\d+\.\s*/, '').trim();
                        const displayTitle = isStage
                          ? `${subsection.id}. ${baseStageTitle}`
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
      <Footer />
    </div>
  );
}
