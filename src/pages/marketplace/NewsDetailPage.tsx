import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight,
  Home,
  BookmarkIcon,
  Share2,
  Eye
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { fetchNewsArticle, fetchRelatedArticles } from '../../services/newsService';
import type { NewsArticleWithDetails } from '../../types/news';

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<NewsArticleWithDetails | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsArticleWithDetails[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch article data from Supabase
  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the article (by ID or slug)
        const article = await fetchNewsArticle(id);
        
        if (article) {
          setItem(article);
          
          // Fetch related articles
          const related = await fetchRelatedArticles(article.id, article.category_id);
          setRelatedNews(related);
          
          // Check if bookmarked (requires user ID - implement based on your auth)
          // const userId = 'current-user-id'; // Get from auth context
          // const bookmarked = await isArticleBookmarked(article.id, userId);
          // setIsBookmarked(bookmarked);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        console.error('Error loading article:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    
    loadArticle();
  }, [id]);

  const handleToggleBookmark = async () => {
    if (!item) return;
    
    try {
      // TODO: Get user ID from auth context
      // const userId = 'current-user-id';
      // const newBookmarkState = await toggleBookmark(item.id, userId);
      // setIsBookmarked(newBookmarkState);
      
      // For now, just toggle locally
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.title,
        text: item?.description,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">News Not Found</h2>
            <p className="text-gray-600 mb-6">The news article you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/marketplace/opportunities')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors"
            >
              Back to News
            </button>
          </div>
        </main>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  const publishedOn = formatDate(item.published_at);
  const publisherDisplay = item.publisher_department 
    ? `${item.publisher_name || 'Digital Qatalyst'} • ${item.publisher_department}`
    : item.publisher_name || 'Digital Qatalyst';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
                <Home size={16} className="mr-1" />
                Home
              </Link>
              <ChevronRight size={16} />
              <Link to="/marketplace/opportunities" className="hover:text-blue-600 transition-colors">
                News & Opportunities
              </Link>
              <ChevronRight size={16} />
              <span className="text-gray-900 font-medium truncate">{item.title}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section with Image */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-6">
            {/* Featured Image - Consistent margins */}
            {item.featured_image_url && (
              <div className="w-full mb-8">
                <img
                  src={item.featured_image_url}
                  alt={item.title}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </div>
            )}

            <div className="flex gap-8">
              {/* Main Content Area */}
              <div className="flex-1 max-w-3xl">
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>

                {/* Description */}
                <p className="text-base text-gray-700 mb-6 leading-relaxed">
                  {item.description}
                </p>

                {/* Meta Information Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.category_name && (
                    <span 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: item.category_color ? `${item.category_color}20` : '#DBEAFE',
                        color: item.category_color || '#1E40AF'
                      }}
                    >
                      {item.category_name}
                    </span>
                  )}
                  {item.tags && item.tags.map((tag) => (
                    <span key={tag.id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {tag.name}
                    </span>
                  ))}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Updated {publishedOn || 'TBA'}
                  </span>
                </div>

                {/* Stats and Action Buttons */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye size={16} />
                      {item.views_count.toLocaleString()} views
                    </span>
                    {item.comment_count > 0 && (
                      <span className="flex items-center gap-1">
                        💬 {item.comment_count} {item.comment_count === 1 ? 'comment' : 'comments'}
                      </span>
                    )}
                    {Object.values(item.reaction_counts).reduce((a, b) => (a || 0) + (b || 0), 0) > 0 && (
                      <span className="flex items-center gap-1">
                        ❤️ {Object.values(item.reaction_counts).reduce((a, b) => (a || 0) + (b || 0), 0)} reactions
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleToggleBookmark}
                      className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                        isBookmarked
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <BookmarkIcon size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-8">
              {/* Main Content Area */}
              <div className="flex-1 max-w-3xl">
                {/* Article Content - Render HTML content from database */}
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />

                  {/* News Info Box */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      News Info
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Category</p>
                        <p className="text-sm font-medium text-blue-600">{item.category_name || 'General'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        <p className="text-sm font-medium text-gray-900 capitalize">{item.status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Published</p>
                        <p className="text-sm font-medium text-blue-600">{publishedOn || 'TBA'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Publisher</p>
                        <p className="text-sm font-medium text-gray-900">{publisherDisplay}</p>
                      </div>
                      {item.is_featured && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Featured</p>
                          <p className="text-sm font-medium text-orange-600">⭐ Featured Article</p>
                        </div>
                      )}
                      {item.is_pinned && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Pinned</p>
                          <p className="text-sm font-medium text-purple-600">📌 Pinned</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Back Button */}
                  <div className="mt-8">
                    <button
                      onClick={() => navigate('/marketplace/opportunities')}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm"
                    >
                      ← Back to News
                    </button>
                  </div>
                </div>

                {/* Sidebar - Related News */}
                <aside className="w-80 flex-shrink-0">
                  <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Related News
                    </h3>
                    <div className="space-y-4">
                      {relatedNews.length > 0 ? (
                        relatedNews.map((relatedItem) => (
                          <Link
                            key={relatedItem.id}
                            to={`/marketplace/opportunities/${relatedItem.id}`}
                            className="flex gap-3 group"
                          >
                            <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                              {relatedItem.featured_image_url ? (
                                <img
                                  src={relatedItem.featured_image_url}
                                  alt={relatedItem.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                {relatedItem.title}
                              </h4>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {relatedItem.description}
                              </p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No related news available</p>
                      )}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default NewsDetailPage;
