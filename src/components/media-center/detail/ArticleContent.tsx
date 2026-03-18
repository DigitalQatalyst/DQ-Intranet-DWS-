import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import type { NewsItem } from '@/data/media/news';
import { getNewsTypeDisplay } from '@/utils/newsUtils';
import { parseBold } from '@/utils/contentParsing';
import { AudioPlayer } from '@/components/media-center/shared/AudioPlayer';
import { buildOverview } from './contentHelpers';

interface ArticleContentProps {
  article: NewsItem;
  related: NewsItem[];
  shouldUseNewLayout: boolean;
}

// ─── Shared block renderers ────────────────────────────────────────────────

/** Accent-bar heading */
const BlockHeading = ({ text }: { text: string }) => (
  <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
    <span className="h-6 w-1 rounded-full bg-[#0f2055] shrink-0" />
    {text}
  </h2>
);

/** Body paragraph */
const BlockParagraph = ({ text }: { text: React.ReactNode }) => (
  <p className="text-base font-normal leading-[1.75] text-[#475467]">{text}</p>
);

/** Green circle checklist */
const BlockChecklist = ({ items }: { items: string[] }) => (
  <ul className="space-y-[11px]">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
        <span className="text-base font-normal leading-[1.6] text-[#475467]">{item}</span>
      </li>
    ))}
  </ul>
);

/** Divider */
// const BlockDivider = () => <hr className="border-border" />;

// ─── Tab content parsers ───────────────────────────────────────────────────

/**
 * Parses raw text with optional "Label:" section headers + bullet lists.
 * Returns rendered JSX blocks.
 */
const renderStructuredContent = (raw: string) => {
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
          {paragraphs.map((p, i) => <BlockParagraph key={i} text={p} />)}
        </div>
      )}
      {sections.map((sec, si) => (
        <div key={si} className="space-y-3">
          <BlockHeading text={sec.label} />
          <div className="pt-1">
            <BlockChecklist items={sec.bullets} />
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Tab bar ──────────────────────────────────────────────────────────────

type NewsTab = 'overview' | 'updates' | 'details' | 'timeline';
type BlogTab = 'overview' | 'highlights' | 'impact' | 'takeaways';
type NonNewsTab = 'overview' | 'updates';

const TabBar = <T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}) => (
  <div className="border-b border-border">
    <div className="flex gap-0 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`relative whitespace-nowrap px-5 py-3 text-sm font-medium transition-colors ${
            active === tab.id
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
          {active === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-full" />
          )}
        </button>
      ))}
    </div>
  </div>
);

// ─── Related items section ─────────────────────────────────────────────────

type ContentKind = 'blog' | 'podcast' | 'announcement';

const RelatedSection = ({
  items,
  kind,
  locationSearch,
}: {
  items: NewsItem[];
  kind: ContentKind;
  locationSearch: string;
}) => {
  if (!items.length) return null;

  const filtered = (() => {
    if (kind === 'blog') return items.filter(i => i.type === 'Thought Leadership' && i.format !== 'Podcast');
    if (kind === 'podcast') return items.filter(i => i.format === 'Podcast' || i.tags?.some(t => t.toLowerCase().includes('podcast')));
    return items.filter(i => i.type !== 'Thought Leadership');
  })();

  const visible = filtered.slice(0, 3);
  if (!visible.length) return null;

  const heading = kind === 'blog' ? 'Related Blogs' : kind === 'podcast' ? 'Related Podcasts' : 'Related Announcements';
  const browseLabel = kind === 'blog' ? 'Browse all blogs' : kind === 'podcast' ? 'Browse all podcasts' : 'Browse all news';

  return (
    <section className="border-t border-border bg-muted/30 px-0 py-12 mt-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{heading}</h2>
        <a
          href={`/marketplace/media-center${locationSearch || ''}`}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {browseLabel} <ArrowRight className="h-4 w-4" />
        </a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(item => {
          const typeDisplay = getNewsTypeDisplay(item);
          const isItemPodcast = item.format === 'Podcast' || item.tags?.some(t => t.toLowerCase().includes('podcast'));
          const linkLabel = isItemPodcast ? 'Listen now' : 'Read more';
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-2 hover:shadow-sm transition-shadow"
            >
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {typeDisplay?.label || 'Article'}
              </span>
              <h3 className="text-sm font-bold text-foreground leading-snug">
                {item.title || 'Untitled'}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2 flex-grow">
                {item.excerpt || 'No description available.'}
              </p>
              <a
                href={`/marketplace/news/${item.id}${locationSearch || ''}`}
                className="flex items-center gap-1 text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors mt-1"
              >
                {linkLabel} <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ─── Main component ────────────────────────────────────────────────────────

export const ArticleContent: React.FC<ArticleContentProps> = ({ article, related }) => {
  const location = useLocation();
  const isPodcast = article.format === 'Podcast' || article.tags?.some(t => t.toLowerCase().includes('podcast'));
  const isBlog = article.type === 'Thought Leadership' && article.format !== 'Podcast';
  const hasAudio = isPodcast && article.audioUrl;
  const overview = buildOverview(article);

  // Blog: Overview + Highlights + Impact + Takeaways
  const [blogTab, setBlogTab] = useState<BlogTab>('overview');
  // Non-news podcasts: Overview + Updates
  const [nonNewsTab, setNonNewsTab] = useState<NonNewsTab>('overview');
  // News/announcements: Overview + Updates + Details + Timeline
  const [newsTab, setNewsTab] = useState<NewsTab>('overview');

  if (isBlog) {
    const blogTabs = [
      { id: 'overview' as BlogTab, label: 'Overview' },
      { id: 'highlights' as BlogTab, label: 'Highlights' },
      { id: 'impact' as BlogTab, label: 'Impact' },
      { id: 'takeaways' as BlogTab, label: 'Takeaways' },
    ];

    return (
      <div id="article-content" className="space-y-6">
        <TabBar tabs={blogTabs} active={blogTab} onChange={setBlogTab} />

        <div className="py-2 max-w-[760px] space-y-6">
          {blogTab === 'overview' ? (
            article.content ? (
              (() => {
                const lines = article.content.split('\n').map(l => l.trim()).filter(Boolean);
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
                  <div className="space-y-6">
                    {paragraphs.map((p, i) => <BlockParagraph key={i} text={parseBold(p)} />)}
                    {sections.map((sec, si) => (
                      <div key={si} className="space-y-3">
                        <BlockHeading text={sec.label} />
                        <div className="pt-1">
                          <ul className="space-y-[11px]">
                            {sec.bullets.map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                <span className="text-base font-normal leading-[1.6] text-[#475467]">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()
            ) : (
              overview.map((p, i) => p.trim() ? <BlockParagraph key={i} text={parseBold(p.trim())} /> : null)
            )
          ) : blogTab === 'highlights' || blogTab === 'impact' || blogTab === 'takeaways' ? (
            (() => {
              const raw = blogTab === 'highlights' ? (article.what ?? '') : blogTab === 'impact' ? (article.how ?? '') : (article.when ?? '');
              return renderStructuredContent(raw);
            })()
          ) : (
            <p className="text-[#475467] text-base italic">
              No content available for this section yet. Check back soon.
            </p>
          )}
        </div>

        <RelatedSection items={related} kind="blog" locationSearch={location.search} />
      </div>
    );
  }

  if (isPodcast) {
    const podcastTabs = [
      { id: 'overview' as NonNewsTab, label: 'Overview' },
      { id: 'updates' as NonNewsTab, label: 'Updates' },
    ];

    return (
      <div id="article-content" className="space-y-6">
        {hasAudio && article.audioUrl && <AudioPlayer audioUrl={article.audioUrl} />}

        <TabBar tabs={podcastTabs} active={nonNewsTab} onChange={setNonNewsTab} />

        <div className="py-2 max-w-[760px] space-y-6">
          {nonNewsTab === 'overview' ? (
            article.content ? (
              article.content.split('\n').map((line, i) => {
                const t = line.trim();
                if (!t) return null;
                if (t.startsWith('# ') || t.startsWith('## ') || t.startsWith('### '))
                  return <BlockHeading key={i} text={t.replace(/^#+\s+/, '')} />;
                if (t.startsWith('- ') || t.startsWith('* '))
                  return <BlockChecklist key={i} items={[t.replace(/^[-*]\s+/, '')]} />;
                return <BlockParagraph key={i} text={parseBold(t)} />;
              })
            ) : (
              overview.map((p, i) => p.trim() ? <BlockParagraph key={i} text={parseBold(p.trim())} /> : null)
            )
          ) : (
            <p className="text-[#475467] text-base italic">
              No updates have been posted yet. Check back soon.
            </p>
          )}
        </div>

        <RelatedSection items={related} kind="podcast" locationSearch={location.search} />
      </div>
    );
  }

  // News / Announcements — 4 tabs
  const newsTabs = [
    { id: 'overview' as NewsTab, label: 'Overview' },
    { id: 'updates' as NewsTab, label: 'Updates' },
    { id: 'details' as NewsTab, label: 'Details' },
    { id: 'timeline' as NewsTab, label: 'Timeline' },
  ];

  const sectionMap: Record<NewsTab, string> = {
    overview: article.why ?? '',
    updates: article.what ?? '',
    details: article.how ?? '',
    timeline: article.when ?? '',
  };

  return (
    <div id="article-content" className="space-y-6">
      <TabBar tabs={newsTabs} active={newsTab} onChange={setNewsTab} />

      <div className="py-2">
        {renderStructuredContent(sectionMap[newsTab])}
      </div>

      <RelatedSection items={related} kind="announcement" locationSearch={location.search} />
    </div>
  );
};
