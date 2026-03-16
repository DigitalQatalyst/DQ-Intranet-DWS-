import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { formatDateShort, getNewsTypeDisplay } from '@/utils/newsUtils';
import { parseBold } from '@/utils/contentParsing';
import { AudioPlayer } from '@/components/media-center/shared/AudioPlayer';
import { generateAnnouncementHeading, buildOverview, generateBlogSummary } from './contentHelpers';

interface ArticleContentProps {
  article: NewsItem;
  related: NewsItem[];
  shouldUseNewLayout: boolean;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({
  article,
  related,
  shouldUseNewLayout,
}) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'details' | 'updates' | 'overview' | 'timeline'>(() => 'overview');
  const isPodcast = article.format === 'Podcast' || article.tags?.some(tag => tag.toLowerCase().includes('podcast'));
  const hasAudio = isPodcast && article.audioUrl;
  const overview = buildOverview(article);
  const isBlog = article.type === 'Thought Leadership' && article.format !== 'Podcast';
  const isNonNews = isBlog || isPodcast; // blogs and podcasts share the same layout treatment

  if (shouldUseNewLayout) {
    return (
      <div id="article-content">
        {hasAudio && article.audioUrl && <AudioPlayer audioUrl={article.audioUrl} />}
        
        {/* Tab Bar */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {isBlog ? 'Overview' : 'Details'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('updates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'updates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Updates
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-6 space-y-6">
          {activeTab === 'details' ? (
            <div className="space-y-6">
              {/* Heading with Accent Bar */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4 relative pl-4">
                <span className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-blue-500" />
                Article Overview
              </h2>

            {/* Paragraph */}
            <p className="text-gray-700 leading-relaxed">
              This comprehensive article provides detailed insights into the latest developments and trends in the industry. 
              Learn about key concepts, best practices, and practical applications that you can implement immediately.
            </p>

            {/* Checklist */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Key Takeaways</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Understanding fundamental concepts and principles</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Practical implementation strategies and techniques</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Real-world case studies and examples</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Future trends and emerging opportunities</span>
                </li>
              </ul>
            </div>

            {/* Divider */}
            <hr className="border-gray-200" />

            {/* Another Section */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 relative pl-4">
              <span className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-emerald-500" />
              Detailed Analysis
            </h2>

            <div className="space-y-4">
              {generateBlogSummary(article).map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            </div>
          ) : (
            <section aria-label="Latest Updates" className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                No new updates have been posted for this announcement yet. Check back soon.
              </p>
            </section>
          )}
        </div>

        {/* Related Articles Section - outside tab content to span full width */}
        {related && related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{isBlog ? 'Related Blogs' : 'Related Announcements'}</h2>
              <a 
                href={`/marketplace/opportunities${location.search || ''}`}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
              >
                Browse all news
                <span>→</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related
                .filter(item => {
                  if (isBlog) {
                    return item.type === 'Thought Leadership' && item.format !== 'Podcast';
                  }
                  return true;
                })
                .slice(0, 3)
                .map((item) => {
                const newsTypeDisplay = getNewsTypeDisplay(item);
                return (
                  <div
                    key={item.id}
                    className="flex flex-col rounded-lg p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col flex-grow space-y-3">
                      <span className="inline-block px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide text-gray-600 bg-gray-100 self-start">
                        {newsTypeDisplay?.label || 'Article'}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 leading-snug">
                        {item.title || 'Untitled'}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 flex-grow">
                        {item.excerpt || 'No description available.'}
                      </p>
                      <a
                        href={`/marketplace/news/${item.id}${location.search || ''}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors mt-auto"
                      >
                        Read more
                        <span>→</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    );
  }

  return (
    <>
      {/* Tab Bar */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Article sections">
          {isNonNews ? (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'details'
                    ? 'border-[#1A2E6E] text-[#1A2E6E]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('updates')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'updates'
                    ? 'border-[#1A2E6E] text-[#1A2E6E]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Updates
              </button>
            </>
          ) : (
            <>
              {(['overview', 'updates', 'details', 'timeline'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-[#1A2E6E] text-[#1A2E6E]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </>
          )}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {isNonNews ? (
          (activeTab === 'details' || activeTab === 'overview') ? (
            <article className="space-y-3">
              {hasAudio && article.audioUrl && <AudioPlayer audioUrl={article.audioUrl} />}
              {article.content ? (
                article.content.split('\n').map((line, index) => {
                  const trimmed = line.trim();
                  if (!trimmed) return <div key={index} className="h-2" />;
                  if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                    return <h3 key={index} className="text-sm font-bold text-gray-900 mt-4">{trimmed.replace(/\*\*/g, '')}</h3>;
                  }
                  if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
                    return <h3 key={index} className="text-sm font-bold text-gray-900 mt-4">{trimmed.replace(/^#+\s+/, '')}</h3>;
                  }
                  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                    return (
                      <div key={index} className="flex items-start gap-2 ml-4">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                        <p className="text-sm text-gray-700 leading-relaxed">{parseBold(trimmed.replace(/^[-*]\s+/, ''))}</p>
                      </div>
                    );
                  }
                  if (/^\d+\.\s+/.test(trimmed)) {
                    const num = trimmed.match(/^(\d+)\.\s+/)?.[1];
                    const text = trimmed.replace(/^\d+\.\s+/, '');
                    return (
                      <div key={index} className="flex items-start gap-2 ml-4">
                        <span className="shrink-0 text-sm font-semibold text-gray-500">{num}.</span>
                        <p className="text-sm text-gray-700 leading-relaxed">{parseBold(text)}</p>
                      </div>
                    );
                  }
                  return <p key={index} className="text-sm text-gray-700 leading-relaxed">{parseBold(trimmed)}</p>;
                })
              ) : (
                overview.map((paragraph, index) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;
                  return <p key={index} className="text-gray-700 text-sm leading-normal mb-2">{parseBold(trimmed)}</p>;
                })
              )}
            </article>
          ) : (
            <section aria-label="Latest Updates" className="space-y-4">
              <p className="text-gray-600 text-sm leading-normal">
                No new updates have been posted for this announcement yet. Check back soon.
              </p>
            </section>
          )
        ) : (
          // News/Announcement: Overview / Updates / Details / Timeline tabs
          (() => {
            const tabKey = activeTab as 'overview' | 'updates' | 'details' | 'timeline';
            const sectionMap: Record<string, string> = {
              overview: article.why ?? '',
              updates: article.what ?? '',
              details: article.how ?? '',
              timeline: article.when ?? '',
            };
            const sectionContent = sectionMap[tabKey] ?? '';

            // Special template for "Overview" tab (formerly Why)
            const renderWhyTab = (raw: string) => {
              if (!raw.trim()) {
                return <p className="text-[#475467] text-base italic">No content available for this section yet.</p>;
              }
              const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
              const bullets: string[] = [];
              let purposeLabel = '';
              let paragraphLines: string[] = [];
              let inBullets = false;

              for (let i = 0; i < lines.length; i++) {
                const l = lines[i];
                if (l.endsWith(':') && !l.startsWith('-')) {
                  purposeLabel = l;
                  inBullets = true;
                } else if (inBullets && (l.startsWith('- ') || l.startsWith('* '))) {
                  bullets.push(l.replace(/^[-*]\s+/, ''));
                } else if (!inBullets) {
                  paragraphLines.push(l);
                }
              }

              return (
                <div className="max-w-[760px] space-y-8">
                  {/* Paragraph */}
                  {paragraphLines.length > 0 && (
                    <p className="text-base font-normal leading-[1.75] text-[#475467]">
                      {paragraphLines.join(' ')}
                    </p>
                  )}

                  {/* Purpose section with accent bar */}
                  {(purposeLabel || bullets.length > 0) && (
                    <div className="space-y-3">
                      {purposeLabel && (
                        <h4 className="flex items-center gap-2 text-xl font-semibold leading-snug text-gray-900">
                          <span className="w-1 h-6 rounded-full bg-[#0f2055] shrink-0" />
                          {purposeLabel}
                        </h4>
                      )}
                      <ul className="space-y-[11px] pt-1">
                        {bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5" />
                            </svg>
                            <span className="text-base font-normal leading-[1.6] text-[#475467]">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            };

            const renderContent = (raw: string) => {
              if (!raw.trim()) {
                return (
                  <p className="text-gray-500 text-sm italic">
                    No content available for this section yet.
                  </p>
                );
              }
              return raw.split('\n').map((line, index) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                  return <h3 key={index} className="text-sm font-bold text-gray-900 mt-4 mb-1">{trimmed.replace(/\*\*/g, '')}</h3>;
                }
                if (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### ')) {
                  return <h3 key={index} className="text-sm font-bold text-gray-900 mt-4 mb-1">{trimmed.replace(/^#+\s+/, '')}</h3>;
                }
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  return (
                    <div key={index} className="flex items-start gap-2 ml-4 mb-1">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                      <p className="text-sm text-gray-700 leading-relaxed">{parseBold(trimmed.replace(/^[-*]\s+/, ''))}</p>
                    </div>
                  );
                }
                if (/^\d+\.\s+/.test(trimmed)) {
                  const num = trimmed.match(/^(\d+)\.\s+/)?.[1];
                  const text = trimmed.replace(/^\d+\.\s+/, '');
                  return (
                    <div key={index} className="flex items-start gap-2 ml-4 mb-1">
                      <span className="shrink-0 text-sm font-semibold text-gray-500">{num}.</span>
                      <p className="text-sm text-gray-700 leading-relaxed">{parseBold(text)}</p>
                    </div>
                  );
                }
                return <p key={index} className="text-sm text-gray-700 leading-relaxed mb-3">{parseBold(trimmed)}</p>;
              });
            };

            // Overview tab uses special template
            if (tabKey === 'overview') {
              return <article>{renderWhyTab(sectionContent)}</article>;
            }

            // Updates tab uses same template as Overview
            const renderUpdatesTab = (raw: string) => {
              if (!raw.trim()) {
                return <p className="text-[#475467] text-base italic">No content available for this section yet.</p>;
              }
              const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
              const headingLine = lines[0] ?? '';
              const bullets: string[] = [];
              let sectionLabel = '';
              let paragraphLines: string[] = [];
              let inBullets = false;

              for (let i = 1; i < lines.length; i++) {
                const l = lines[i];
                if (l.endsWith(':') && !l.startsWith('-')) {
                  sectionLabel = l;
                  inBullets = true;
                } else if (inBullets && (l.startsWith('- ') || l.startsWith('* '))) {
                  bullets.push(l.replace(/^[-*]\s+/, ''));
                } else if (!inBullets) {
                  paragraphLines.push(l);
                }
              }

              return (
                <div className="max-w-[760px] space-y-8">
                  <p className="text-base font-normal leading-[1.75] text-[#475467]">{headingLine}</p>
                  {paragraphLines.length > 0 && (
                    <p className="text-base font-normal leading-[1.75] text-[#475467]">{paragraphLines.join(' ')}</p>
                  )}
                  {(sectionLabel || bullets.length > 0) && (
                    <div className="space-y-3">
                      {sectionLabel && (
                        <h4 className="flex items-center gap-2 text-xl font-semibold leading-snug text-gray-900">
                          <span className="w-1 h-6 rounded-full bg-[#0f2055] shrink-0" />
                          {sectionLabel}
                        </h4>
                      )}
                      <ul className="space-y-[11px] pt-1">
                        {bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5" />
                            </svg>
                            <span className="text-base font-normal leading-[1.6] text-[#475467]">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            };

            if (tabKey === 'updates') {
              return <article>{renderUpdatesTab(sectionContent)}</article>;
            }

            // Details tab: paragraphs + optional "Label:" heading with green checkmarks
            const renderDetailsTab = (raw: string) => {
              if (!raw.trim()) {
                return <p className="text-[#475467] text-base italic">No content available for this section yet.</p>;
              }
              const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
              const paragraphs: string[] = [];
              const sections: { label: string; bullets: string[] }[] = [];
              let currentSection: { label: string; bullets: string[] } | null = null;

              for (const l of lines) {
                if (l.endsWith(':') && !l.startsWith('-') && !l.startsWith('*')) {
                  currentSection = { label: l.replace(/:$/, ''), bullets: [] };
                  sections.push(currentSection);
                } else if (currentSection && (l.startsWith('- ') || l.startsWith('* '))) {
                  currentSection.bullets.push(l.replace(/^[-*]\s+/, ''));
                } else if (!currentSection) {
                  paragraphs.push(l);
                }
              }

              return (
                <div className="max-w-[760px] space-y-8">
                  {paragraphs.length > 0 && (
                    <div className="space-y-[18px]">
                      {paragraphs.map((p, i) => (
                        <p key={i} className="text-base font-normal leading-[1.75] text-[#475467]">{p}</p>
                      ))}
                    </div>
                  )}
                  {sections.map((sec, si) => (
                    <div key={si} className="space-y-3">
                      <h4 className="flex items-center gap-2 text-xl font-semibold leading-snug text-gray-900">
                        <span className="w-1 h-6 rounded-full bg-[#0f2055] shrink-0" />
                        {sec.label}
                      </h4>
                      <ul className="space-y-[11px] pt-1">
                        {sec.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-5" />
                            </svg>
                            <span className="text-base font-normal leading-[1.6] text-[#475467]">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              );
            };

            if (tabKey === 'details') {
              return <article>{renderDetailsTab(sectionContent)}</article>;
            }

            return <article className="space-y-3">{renderContent(sectionContent)}</article>;
          })()
        )}
      </div>

      {/* Related Articles Section */}
      {related && related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">{isBlog ? 'Related Blogs' : 'Related Announcements'}</h2>
            <a 
              href={`/marketplace/opportunities${location.search || ''}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              Browse all news
              <span>→</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.slice(0, 3).map((item) => {
              const newsTypeDisplay = getNewsTypeDisplay(item);
              return (
                <div
                  key={item.id}
                  className="flex flex-col rounded-lg p-6 bg-white border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col flex-grow space-y-3">
                    <span className="inline-block px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide text-gray-600 bg-gray-100 self-start">
                      {newsTypeDisplay?.label || 'Article'}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                      {item.title || 'Untitled'}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 flex-grow">
                      {item.excerpt || 'No description available.'}
                    </p>
                    <a
                      href={`/marketplace/news/${item.id}${location.search || ''}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors mt-auto"
                    >
                      Read more
                      <span>→</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
};
