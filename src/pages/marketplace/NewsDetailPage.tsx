import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon, Share2, BookmarkIcon, ArrowUpRight } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { fetchAllNews, fetchNewsById } from '@/services/mediaCenterService';

const formatDate = (input: string) =>
  new Date(input).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const fallbackHero =
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80';

const fallbackImages = [
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
];

const MEDIA_SEEN_STORAGE_KEY = 'dq-media-center-seen-items';

const markMediaItemSeen = (kind: 'news' | 'job', id: string) => {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(MEDIA_SEEN_STORAGE_KEY);
    let seen: { news: string[]; jobs: string[] } = { news: [], jobs: [] };
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<{ news: string[]; jobs: string[] }>;
      seen = {
        news: parsed.news ?? [],
        jobs: parsed.jobs ?? []
      };
    }

    const key = kind === 'news' ? 'news' : 'jobs';
    if (!seen[key].includes(id)) {
      seen[key] = [...seen[key], id];
      window.localStorage.setItem(MEDIA_SEEN_STORAGE_KEY, JSON.stringify(seen));
    }
  } catch {
    // Ignore storage errors
  }
};

const buildBody = (article: NewsItem & { content?: string }) => {
  // Use content field if available, otherwise fall back to default paragraphs
  if (article.content) {
    // Split content into blocks, preserving list structure
    const blocks: string[] = [];
    const lines = article.content.split('\n');
    let currentBlock = '';
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const isEmpty = !line;
      const isListLine = /^[-*\d.]\s+/.test(line) || /^  [-*\d.]\s+/.test(line);
      
      if (isEmpty && currentBlock) {
        // Empty line ends current block
        blocks.push(currentBlock.trim());
        currentBlock = '';
        inList = false;
      } else if (isListLine) {
        // List item - add to current block
        if (currentBlock && !inList) {
          // Previous block wasn't a list, start new block
          if (currentBlock.trim()) {
            blocks.push(currentBlock.trim());
          }
          currentBlock = line;
        } else {
          currentBlock += (currentBlock ? '\n' : '') + line;
        }
        inList = true;
      } else if (line) {
        // Regular content line
        if (inList && currentBlock) {
          // End list block, start new block
          blocks.push(currentBlock.trim());
          currentBlock = line;
          inList = false;
        } else {
          currentBlock += (currentBlock ? '\n' : '') + line;
        }
      }
    }

    // Push remaining block
    if (currentBlock.trim()) {
      blocks.push(currentBlock.trim());
    }

    return blocks.filter(p => p.trim());
  }
  
  return [
    article.excerpt,
    'Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments.',
    'This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center.',
    'Read on for the context, quotes, and resources you can plug into right away.'
  ];
};

// Parse bold text (**text** or **text**)
const parseBold = (text: string) => {
  const parts: (string | JSX.Element)[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add bold text
    parts.push(<strong key={match.index} className="font-bold">{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

// Format content with proper markdown parsing
const formatContent = (content: string, index: number) => {
  const trimmed = content.trim();
  if (!trimmed) return null;

  // Parse H1 headings (# Heading) - strip hashtags
  if (trimmed.match(/^#+\s+(.+)$/)) {
    const match = trimmed.match(/^#+\s+(.+)$/);
    if (match && match[1]) {
      let text = match[1].trim();
      // Remove any remaining markdown hashtags from the text
      text = text.replace(/^#+\s*/, '');
      const boldText = parseBold(text);
      // Check if it's H1, H2, or H3 based on number of # at start
      const hashCount = (trimmed.match(/^#+/)?.[0] || '').length;
      if (hashCount === 1) {
        return (
          <h1 key={index} className="text-3xl font-bold mb-6 text-gray-900">
            {boldText}
          </h1>
        );
      } else if (hashCount === 2) {
        return (
          <h2 key={index} className="text-2xl font-bold mb-5 text-gray-900 mt-6">
            {boldText}
          </h2>
        );
      } else {
        return (
          <h3 key={index} className="text-xl font-bold mb-4 text-gray-900 mt-5">
            {boldText}
          </h3>
        );
      }
    }
  }

  // Parse lists (- item, * item, or 1. item, or numbered with ➜)
  const hasListItems = content.split('\n').some(line => {
    const trimmedLine = line.trim();
    return /^[-*]\s+/.test(trimmedLine) || /^\d+\.\s+/.test(trimmedLine) || /^➜\s+/.test(trimmedLine);
  });
  
  if (hasListItems) {
    const lines = content.split('\n').filter(line => line.trim());
    const listItems: Array<{ text: string; level: number; isNumbered: boolean }> = [];
    
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      // Match different list patterns: -, *, ➜, or numbered (1. 2. etc.)
      let itemMatch = trimmedLine.match(/^(\s*)([-*]|\d+\.|➜)\s+(.+)$/);
      if (!itemMatch) {
        // Try matching with ➜ at start without space before
        itemMatch = trimmedLine.match(/^(\s*)(➜)\s*(.+)$/);
      }
      if (itemMatch) {
        const level = (itemMatch[1] || '').length; // Indentation level
        const marker = itemMatch[2] || '';
        const itemText = itemMatch[3] || '';
        const isNumbered = /^\d+\.$/.test(marker);
        listItems.push({ text: itemText.trim(), level, isNumbered });
      }
    });

    if (listItems.length > 0) {
      const ListComponent = listItems[0].isNumbered ? 'ol' : 'ul';
      const listClass = listItems[0].isNumbered 
        ? 'list-decimal list-inside space-y-3 text-gray-700'
        : 'list-disc list-inside space-y-3 text-gray-700';
      
      return (
        <ListComponent key={index} className={listClass}>
          {listItems.map((item, itemIndex) => {
            const boldText = parseBold(item.text);
            const indentStyle = item.level > 0 ? { marginLeft: `${item.level * 1.5}rem` } : {};
            return (
              <li key={itemIndex} className="leading-relaxed" style={indentStyle}>
                {boldText}
              </li>
            );
          })}
        </ListComponent>
      );
    }
  }

  // Regular paragraphs - strip any markdown hashtags that might appear
  let cleanedText = trimmed.replace(/^#+\s*/, '').trim();
  const boldText = parseBold(cleanedText);
  return (
    <p key={index} className="text-gray-700 text-base leading-relaxed mb-4">
      {boldText}
    </p>
  );
};

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const getImageSrc = (item: NewsItem) => {
    if (item.image) return item.image;
    const hash = Math.abs(item.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0));
    return fallbackImages[hash % fallbackImages.length] || fallbackHero;
  };

  const body = article ? buildBody(article) : [];

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    async function loadArticle() {
      setIsLoading(true);
      try {
        const [item, allNews] = await Promise.all([fetchNewsById(id), fetchAllNews()]);
        if (!isMounted) return;
        setArticle(item);
        setRelated(allNews.filter((newsItem) => newsItem.id !== id).slice(0, 3));
        if (item) {
          markMediaItemSeen('news', item.id);
        }
        setLoadError(null);
      } catch (error) {
        if (!isMounted) return;
        // eslint-disable-next-line no-console
        console.error('Error loading news article', error);
        setLoadError('Unable to load this article right now.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadArticle();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {isLoading ? 'Loading article' : 'Article not found'}
          </h1>
          <p className="text-gray-600 mb-6 max-w-md">
            {isLoading
              ? 'Fetching the latest details. Please wait.'
              : "The article you're trying to view is unavailable or has been archived. Please browse the latest announcements."}
          </p>
          {loadError && !isLoading && (
            <p className="text-sm text-red-600 mb-4">{loadError}</p>
          )}
          <button
            onClick={() => navigate(`/marketplace/guides${location.search || ''}`)}
            className="rounded-lg bg-[#030f35] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Media Center
          </button>
        </main>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  const displayAuthor =
    article.type === 'Thought Leadership'
      ? (article.byline || article.author || 'DQ Media Team')
      : article.author;

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB]">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="flex-1">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex items-center text-sm text-gray-600" aria-label="Breadcrumb">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-[#1A2E6E]">
                <HomeIcon size={16} />
                Home
              </Link>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <Link to={`/marketplace/guides${location.search || ''}`} className="hover:text-[#1A2E6E]">
                DQ Media Center
              </Link>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <span className="text-gray-900 line-clamp-1">{article.title}</span>
            </nav>
            <div className="flex gap-2 text-sm text-gray-500">
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 hover:text-[#1A2E6E]">
                <Share2 size={16} />
                Share
              </button>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 hover:text-[#1A2E6E]">
                <BookmarkIcon size={16} />
                Save
              </button>
            </div>
          </div>
        </section>

        <section className="bg-[#F3F6FB] py-8">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Hero Image */}
                <div className="rounded-2xl bg-gray-100 overflow-hidden shadow-sm">
                  <img
                    src={getImageSrc(article)}
                    alt={article.title}
                    className="h-[400px] w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Article Header */}
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                    <span>{formatDate(article.date)}</span>
                    {article.readingTime && (
                      <>
                        <span>•</span>
                        <span>{article.readingTime} min read</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Article Content */}
                <article className="space-y-6">
                  {(() => {
                    interface Section {
                      heading: string | null;
                      items: string[];
                    }
                    const sections: Section[] = [];
                    let currentSection: Section | null = null;

                    body.forEach((paragraph) => {
                      const trimmed = paragraph.trim();
                      if (!trimmed) return;

                      const isHeading = trimmed.match(/^#+\s+(.+)$/); // Any markdown heading (# ## ###) creates new sections

                      if (isHeading) {
                        // Start new section with this heading
                        if (currentSection !== null && currentSection.items.length > 0) {
                          sections.push(currentSection);
                        }
                        currentSection = { heading: trimmed, items: [] };
                      } else {
                        // Add content to current section (or create new section if none exists)
                        if (currentSection === null) {
                          currentSection = { heading: null, items: [] };
                        }
                        if (currentSection !== null) {
                          currentSection.items.push(paragraph);
                        }
                      }
                    });

                    if (currentSection !== null) {
                      const finalSection: Section = currentSection;
                      if (finalSection.items.length > 0) {
                        sections.push(finalSection);
                      }
                    }

                    return sections.map((section, sectionIndex) => {
                      // Check if section has lists
                      const hasLists = section.items.some(item => {
                        const trimmed = item.trim();
                        return trimmed.match(/^[-*\d.]\s+/) || trimmed.match(/^➜\s+/) || item.split('\n').some(line => /^[-*\d.]\s+/.test(line.trim()) || /^➜\s+/.test(line.trim()));
                      });
                      
                      const bgColor = hasLists ? 'bg-blue-50' : 'bg-white';
                      const borderColor = 'border border-gray-200';
                      
                      return (
                        <div key={sectionIndex} className={`${bgColor} ${borderColor} rounded-xl p-8 shadow-sm`}>
                          <div className="space-y-4">
                            {section.heading && (
                              <div>
                                {formatContent(section.heading, 0)}
                              </div>
                            )}
                            {section.items.map((item, itemIndex) => {
                              const formatted = formatContent(item, itemIndex);
                              return formatted;
                            })}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </article>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Article Summary Card */}
                  <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Article Summary</h2>
                    <div className="space-y-4">
                      {article.type && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Type</div>
                          <div className="text-sm text-gray-900 font-medium">{article.type}</div>
                        </div>
                      )}
                      {article.department && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Department</div>
                          <div className="text-sm text-gray-900 font-medium">{article.department}</div>
                        </div>
                      )}
                      {article.location && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Location</div>
                          <div className="text-sm text-gray-900 font-medium">{article.location}</div>
                        </div>
                      )}
                      {article.domain && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Domain</div>
                          <div className="text-sm text-gray-900 font-medium">{article.domain}</div>
                        </div>
                      )}
                      {article.newsType && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">News Type</div>
                          <div className="text-sm text-gray-900 font-medium">{article.newsType}</div>
                        </div>
                      )}
                      {article.newsSource && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Source</div>
                          <div className="text-sm text-gray-900 font-medium">{article.newsSource}</div>
                        </div>
                      )}
                      {article.focusArea && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Focus Area</div>
                          <div className="text-sm text-gray-900 font-medium">{article.focusArea}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Published</div>
                        <div className="text-sm text-gray-900 font-medium">{formatDate(article.date)}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Author</div>
                        <div className="text-sm text-gray-900 font-medium">{displayAuthor}</div>
                      </div>
                      {article.views !== undefined && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Views</div>
                          <div className="text-sm text-gray-900 font-medium">{article.views.toLocaleString()}</div>
                        </div>
                      )}
                      {article.tags && article.tags.length > 0 && (
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tags</div>
                          <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: article.title,
                            text: article.excerpt,
                            url: window.location.href,
                          }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(window.location.href).catch(() => {});
                        }
                      }}
                      className="w-full rounded-xl bg-[#030f35] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-colors shadow-sm inline-flex items-center justify-center gap-2"
                    >
                      <Share2 size={16} />
                      Share Article
                    </button>
                    <button className="w-full rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2">
                      <BookmarkIcon size={16} />
                      Save for Later
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 bg-[#F8FAFF]">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Related Resources</h2>
              <button className="text-sm font-semibold text-[#1A2E6E] inline-flex items-center gap-1">
                See All Resources
                <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <article key={item.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <img
                    src={getImageSrc(item)}
                    alt={item.title}
                    className="mb-4 h-32 w-full rounded-xl object-cover"
                  />
                  <div className="text-xs text-gray-500">{formatDate(item.date)}</div>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">{item.excerpt}</p>
                  <Link
                    to={`/marketplace/news/${item.id}${location.search || ''}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#030f35] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Read Article
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default NewsDetailPage;
