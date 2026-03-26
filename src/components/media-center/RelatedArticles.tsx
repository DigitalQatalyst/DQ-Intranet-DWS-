import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/media-center-utils';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  thumbnail?: string;
}

interface RelatedArticlesProps {
  articles: Article[];
  className?: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ articles, className }) => {
  return (
    <section className={cn('py-12 bg-gray-50', className)}>
      <div className="mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 relative pl-4">
            <span className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-blue-500" />
            Related Articles
          </h2>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/media-center/courses/${article.id}`}
              className="group block bg-[hsl(0_0%_100%)] border border-[hsl(0_0%_88%)] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-[hsl(210_100%_70%)]"
            >
              {/* Article Image */}
              {article.thumbnail && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="p-6">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[hsl(210_100%_70%_/10%)] text-[hsl(210_100%_70%)]">
                    {article.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-[hsl(0_0%_4%)] mb-2 line-clamp-2 group-hover:text-[hsl(210_100%_70%)] transition-colors">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[hsl(0_0%_64%)] mb-4 line-clamp-3">
                  {article.description}
                </p>

                {/* Read Time */}
                <div className="flex items-center text-xs text-[hsl(0_0%_64%)]">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {article.readTime}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedArticles;
