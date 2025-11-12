import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { HomeIcon, ChevronRightIcon, Share2, BookmarkIcon, ArrowUpRight } from 'lucide-react';
import { NEWS, type NewsItem } from '@/data/media/news';

const formatDate = (input: string) =>
  new Date(input).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const fallbackHero =
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80';

const buildBody = (article: NewsItem) => {
  return [
    article.excerpt,
    'Since launching, DQ teams continue to connect dots across studios, squads, and journeys. Every announcement is an opportunity to reinforce a shared language, codify repeatable wins, and inspire new experiments.',
    'This story highlights the rituals, playbooks, and leadership behaviors that help teams deliver value faster—while keeping culture, clarity, and craft at the center.',
    'Read on for the context, quotes, and resources you can plug into right away.'
  ];
};

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const article = NEWS.find((item) => item.id === id);
  const related = NEWS.filter((item) => item.id !== id).slice(0, 3);
  const body = article ? buildBody(article) : [];

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Article not found</h1>
          <p className="text-gray-600 mb-6 max-w-md">
            The article you’re trying to view is unavailable or has been archived. Please browse the latest announcements.
          </p>
          <button
            onClick={() => navigate('/marketplace/news')}
            className="rounded-lg bg-[#1A2E6E] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Media Center
          </button>
        </main>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

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
              <Link to="/marketplace/news" className="hover:text-[#1A2E6E]">
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

        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-6 py-10">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#1A2E6E]">
              {article.type}
            </span>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">{article.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>{article.byline || article.author}</span>
              <span>{formatDate(article.date)}</span>
              <span>{article.views} views</span>
              {article.location && <span>{article.location}</span>}
              {article.newsSource && <span>{article.newsSource}</span>}
              {article.focusArea && <span>{article.focusArea}</span>}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-6 pb-6">
            <div className="mb-8 rounded-2xl bg-gray-100">
              <img
                src={article.image || fallbackHero}
                alt={article.title}
                className="h-[420px] w-full rounded-2xl object-cover"
                loading="lazy"
              />
            </div>
            <article className="prose prose-lg max-w-none text-gray-700">
              {body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>
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
                    src={item.image || fallbackHero}
                    alt={item.title}
                    className="mb-4 h-32 w-full rounded-xl object-cover"
                  />
                  <div className="text-xs text-gray-500">{formatDate(item.date)}</div>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-3">{item.excerpt}</p>
                  <Link
                    to={`/marketplace/news/${item.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#1A2E6E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#132456]"
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
