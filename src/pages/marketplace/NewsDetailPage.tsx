import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight,
  Home,
  BookmarkIcon,
  Share2
} from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  date?: string;
  category?: string;
  tags?: string[];
  provider?: { name: string };
  image?: string;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - same as NewsPage
  const newsItems: NewsItem[] = [
    { 
      id: '1', 
      title: 'New Project Management Tool Rollout', 
      description: "We're excited to announce the launch of our new project management tool that will streamline collaboration across teams.", 
      date: 'June 15, 2023', 
      category: 'IT', 
      tags: ['Project Management'], 
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      provider: { name: 'DQ Intranet' }
    },
    { 
      id: '2', 
      title: 'Q3 Town Hall Meeting', 
      description: 'Join us for our quarterly town hall meeting where leadership will share company updates and answer questions.', 
      date: 'June 12, 2023', 
      category: 'HR', 
      tags: ['Town Hall'], 
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
      provider: { name: 'DQ Intranet' }
    },
    { 
      id: '3', 
      title: 'Summer Team Building Event', 
      description: "Get ready for our annual summer team-building event! This year we'll be having a beach day with activities and food.", 
      date: 'June 10, 2023', 
      category: 'Social', 
      tags: ['Team Building'], 
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
      provider: { name: 'DQ Intranet' }
    },
    { 
      id: '4', 
      title: 'DQ Team Wins Industry Award', 
      description: "Congratulations to our product team for winning the prestigious Innovation Award at this year's Tech Summit!", 
      date: 'June 8, 2023', 
      category: 'Achievement', 
      tags: ['Award'], 
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      provider: { name: 'DQ Intranet' }
    },
    { 
      id: '5', 
      title: 'New Security Training Required', 
      description: "All employees must complete the updated security awareness training by the end of the month.", 
      date: 'June 5, 2023', 
      category: 'Training', 
      tags: ['Security'], 
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
      provider: { name: 'DQ Intranet' }
    },
    { 
      id: '6', 
      title: 'Office Renovation Updates', 
      description: 'Check out the latest updates on our office renovation project, including new meeting rooms and collaborative spaces.', 
      date: 'June 1, 2023', 
      category: 'HR', 
      tags: ['Renovation'], 
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      provider: { name: 'DQ Intranet' }
    },
  ];

  useEffect(() => {
    setLoading(true);
    // Find the news item by id
    const foundItem = newsItems.find(item => item.id === id);
    if (foundItem) {
      setItem(foundItem);
      // Get related news (same category, different id)
      const related = newsItems
        .filter(item => item.id !== id && item.category === foundItem.category)
        .slice(0, 3);
      setRelatedNews(related);
    }
    setLoading(false);
  }, [id]);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
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

  const primaryTag = item.tags && item.tags.length > 0 ? item.tags[0] : item.category || 'News';
  const publishedOn = formatDate(item.date);

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
            {item.image && (
              <div className="w-full mb-8">
                <img
                  src={item.image}
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
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.category || 'General'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {primaryTag}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Updated {publishedOn || 'TBA'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pb-6 border-b border-gray-200">
                  <button
                    onClick={toggleBookmark}
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
                {/* Article Content */}
                <div className="prose max-w-none">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Purpose
                    </h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      This announcement represents a significant development for our organization. 
                      The initiatives outlined here are designed to enhance collaboration, improve 
                      efficiency, and create new opportunities for growth and innovation across all teams.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Lifecycle
                    </h2>
                    <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-2">
                      <li><strong>Draft</strong>: authored by domain SME</li>
                      <li><strong>Review</strong>: peer and PMO review</li>
                      <li><strong>Approve</strong>: sign-off by owner</li>
                      <li><strong>Publish</strong>: catalog entry with version tag</li>
                      <li><strong>Retire</strong>: superseded, archived</li>
                    </ol>

                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Versioning Rules
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                      <li>SemVer (MAJOR.MINOR.PATCH)</li>
                      <li>Changelog and migration notes required</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Quality Gates
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                      <li>Customer outcomes defined</li>
                      <li>Risks and controls identified</li>
                      <li>Templates and metrics attached</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Ownership
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                      <li>Blueprint owner maintains roadmap and reviews every 6 months</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Process
                    </h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      Detailed process information and workflows will be outlined here to guide 
                      implementation and ensure consistency across all teams.
                    </p>
                  </div>

                  {/* News Info Box */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      News Info
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Domain</p>
                        <p className="text-sm font-medium text-blue-600">{item.category || 'Digital Workspace'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Function Area</p>
                        <p className="text-sm font-medium text-gray-900">{primaryTag}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                        <p className="text-sm font-medium text-blue-600">{publishedOn || 'Oct 2, 2025'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Publisher</p>
                        <p className="text-sm font-medium text-gray-900">{item.provider?.name || 'PMO • Digital Qatalyst'}</p>
                      </div>
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
                              {relatedItem.image ? (
                                <img
                                  src={relatedItem.image}
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
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default NewsDetailPage;
