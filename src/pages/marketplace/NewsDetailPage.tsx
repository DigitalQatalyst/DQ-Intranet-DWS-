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
      title: 'Digital Qatalyst Launches AI-Powered Workspace Platform', 
      description: "We're thrilled to announce the launch of our revolutionary AI-powered Digital Workspace Platform, designed to transform how teams collaborate and innovate in 2025.", 
      date: 'October 28, 2025', 
      category: 'Technology', 
      tags: ['AI', 'Innovation'], 
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
      provider: { name: 'Digital Qatalyst • Technology' }
    },
    { 
      id: '2', 
      title: 'Q4 2025 Town Hall: Year-End Achievements & 2026 Vision', 
      description: 'Join our leadership team on November 5th as we celebrate our accomplishments this year and unveil our strategic vision for 2026.', 
      date: 'October 25, 2025', 
      category: 'Company', 
      tags: ['Town Hall', 'Leadership'], 
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
      provider: { name: 'Digital Qatalyst • HR' }
    },
    { 
      id: '3', 
      title: 'Annual Innovation Week: November 10-14, 2025', 
      description: "Save the date! Our annual Innovation Week returns with workshops, hackathons, and guest speakers from leading tech companies. Let's innovate together!", 
      date: 'October 22, 2025', 
      category: 'Events', 
      tags: ['Innovation', 'Team Building'], 
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      provider: { name: 'Digital Qatalyst • Events' }
    },
    { 
      id: '4', 
      title: 'DQ Recognized as Top Workplace for Innovation 2025', 
      description: "Proud moment! Digital Qatalyst has been named one of the Top 10 Most Innovative Workplaces by Tech Excellence Awards 2025.", 
      date: 'October 20, 2025', 
      category: 'Achievement', 
      tags: ['Award', 'Recognition'], 
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      provider: { name: 'Digital Qatalyst • Communications' }
    },
    { 
      id: '5', 
      title: 'New Cybersecurity Protocols: Mandatory Training by Nov 15', 
      description: "As part of our commitment to data security, all team members must complete the updated cybersecurity training module by November 15, 2025.", 
      date: 'October 18, 2025', 
      category: 'Security', 
      tags: ['Training', 'Compliance'], 
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
      provider: { name: 'Digital Qatalyst • IT Security' }
    },
    { 
      id: '6', 
      title: 'New Abu Dhabi Office Space: Grand Opening December 2025', 
      description: 'Exciting news! Our expanded Abu Dhabi office featuring state-of-the-art collaboration spaces, wellness areas, and innovation labs opens next month.', 
      date: 'October 15, 2025', 
      category: 'Facilities', 
      tags: ['Office', 'Expansion'], 
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      provider: { name: 'Digital Qatalyst • Facilities' }
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
                      Overview
                    </h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      At Digital Qatalyst, we believe in keeping our team informed and engaged with the latest 
                      developments across our organization. This announcement reflects our commitment to transparency, 
                      innovation, and continuous improvement as we work together to deliver exceptional value to our clients 
                      and stakeholders.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Key Highlights
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                      <li>Enhanced collaboration tools and processes to streamline team workflows</li>
                      <li>New opportunities for professional development and skill enhancement</li>
                      <li>Initiatives aligned with our core values of innovation, excellence, and integrity</li>
                      <li>Focus on employee well-being and work-life balance</li>
                      <li>Commitment to sustainable growth and community impact</li>
                    </ul>

                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Impact on Teams
                    </h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      This initiative will positively impact various teams across Digital Qatalyst, fostering 
                      better communication, knowledge sharing, and cross-functional collaboration. We encourage 
                      all team members to actively participate and contribute their insights to make this a success.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Next Steps
                    </h2>
                    <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-2">
                      <li>Review the details and familiarize yourself with the changes</li>
                      <li>Attend upcoming information sessions and Q&A forums</li>
                      <li>Reach out to your team lead or HR for any questions or clarifications</li>
                      <li>Provide feedback through our internal communication channels</li>
                      <li>Stay tuned for follow-up announcements and updates</li>
                    </ol>

                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Our Culture
                    </h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      This announcement embodies Digital Qatalyst's culture of continuous learning, adaptability, 
                      and excellence. We value every team member's contribution and are committed to creating an 
                      environment where innovation thrives and everyone can reach their full potential.
                    </p>

                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Get Involved
                    </h2>
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      We encourage you to engage with this initiative by sharing your thoughts, asking questions, 
                      and collaborating with your colleagues. Together, we can make Digital Qatalyst an even better 
                      place to work and grow.
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
