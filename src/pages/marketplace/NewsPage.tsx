import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ChevronDown, Search, Calendar, Building2, MapPin, Eye, Star, Pin } from 'lucide-react';
import { fetchNewsArticles, fetchNewsCategories, fetchNewsTags } from '../../services/newsService';
import type { NewsArticleWithDetails, NewsCategory, NewsTag } from '../../types/news';

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const NewsCard: React.FC<{ item: NewsArticleWithDetails }> = ({ item }) => {
  const primaryTag = item.tags && item.tags.length > 0 ? item.tags[0].name : item.category_name || 'News';
  const publishedOn = formatDate(item.published_at);
  const publisherDisplay = item.publisher_department 
    ? `${item.publisher_name || 'Digital Qatalyst'} • ${item.publisher_department}`
    : item.publisher_name || 'Digital Qatalyst';
  return (
    <article className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      {/* Image with badges */}
      <div className="relative h-48 bg-gray-200">
        {item.featured_image_url ? (
          <img 
            src={item.featured_image_url} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
        )}
        {/* Date Badge */}
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded shadow-md">
          <span className="text-xs font-medium text-gray-900">{publishedOn || 'TBA'}</span>
        </div>
        {/* Featured Badge */}
        {item.is_featured && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded shadow-md flex items-center gap-1">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-medium">Featured</span>
          </div>
        )}
        {/* Pinned Badge */}
        {item.is_pinned && (
          <div className="absolute bottom-3 left-3 bg-purple-500 text-white px-2 py-1 rounded shadow-md flex items-center gap-1">
            <Pin size={12} />
            <span className="text-xs font-medium">Pinned</span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
        
        {/* Category Badge */}
        {item.category_name && (
          <div className="mb-3">
            <span 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: item.category_color ? `${item.category_color}20` : '#DBEAFE',
                color: item.category_color || '#1E40AF'
              }}
            >
              {item.category_name}
            </span>
          </div>
        )}
        
        {/* Meta information */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{publishedOn || 'TBA'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>{publisherDisplay}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{primaryTag}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{item.views_count.toLocaleString()} views</span>
          </div>
        </div>
        
        <Link 
          to={`/marketplace/opportunities/${item.id}`} 
          className="block w-full text-white text-center py-2.5 rounded font-medium transition-colors"
          style={{ backgroundColor: '#030F35' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#020B28'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#030F35'}
        >
          Read More
        </Link>
      </div>
    </article>
  );
};

const NewsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [items, setItems] = useState<NewsArticleWithDetails[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [tags, setTags] = useState<NewsTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Collapsible sections state
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [dateOpen, setDateOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);

  // Fetch data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [articlesData, categoriesData, tagsData] = await Promise.all([
          fetchNewsArticles({ status: 'published' }, 1, 100),
          fetchNewsCategories(),
          fetchNewsTags()
        ]);
        setItems(articlesData.articles);
        setCategories(categoriesData);
        setTags(tagsData);
        setError(null);
      } catch (err) {
        console.error('Error loading news data:', err);
        setError('Failed to load news articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter items based on search query, category, date, and tags
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category_id === selectedCategory : true;
    const matchesDate = selectedDate ? new Date(item.published_at || '').toLocaleDateString() === selectedDate : true;
    const matchesTags = selectedTags.length > 0 ? selectedTags.every(tag => item.tags?.some(t => t.name === tag)) : true;

    return matchesSearch && matchesCategory && matchesDate && matchesTags;
  });

  // Get unique dates from items
  const uniqueDates = Array.from(new Set(items.map(item => item.published_at ? new Date(item.published_at).toLocaleDateString() : null).filter(Boolean)));

  // Handle category filter
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  // Handle date filter
  const handleDateClick = (date: string) => {
    setSelectedDate(date === selectedDate ? null : date);
  };

  // Handle tag filter
  const handleTagClick = (tag: string) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Header Section */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Latest News & Announcements</h1>
          <p className="text-gray-600 mt-2">Stay up-to-date with the latest company news and announcements</p>
        </header>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or description"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">Error loading news</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading news articles...</p>
            </div>
          </div>
        )}

        {/* Main Content with Sidebar */}
        {!loading && (
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>

            {/* Category Filter */}
            <div className="mb-4 border-b border-gray-200 pb-4">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-3"
              >
                <span>Category</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>
              {categoryOpen && (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded ${category.id === selectedCategory ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'} transition`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Filter */}
            <div className="mb-4 border-b border-gray-200 pb-4">
              <button
                onClick={() => setDateOpen(!dateOpen)}
                className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-3"
              >
                <span>Time Range</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dateOpen ? 'rotate-180' : ''}`} />
              </button>
              {dateOpen && (
                <div className="space-y-2">
                  {['Last 7 Days', 'This Month', 'This Year'].map((dateRange) => (
                    <button
                      key={dateRange}
                      onClick={() => handleDateClick(dateRange)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded ${dateRange === selectedDate ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'} transition`}
                    >
                      {dateRange}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tag Filter */}
            <div className="mb-4">
              <button
                onClick={() => setTagsOpen(!tagsOpen)}
                className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-3"
              >
                <span>Tags</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${tagsOpen ? 'rotate-180' : ''}`} />
              </button>
              {tagsOpen && (
                <div className="space-y-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagClick(tag.name)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded ${selectedTags.includes(tag.name) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'} transition`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Available Items Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Available Items ({filteredItems.length})</h2>
              <span className="text-sm text-gray-500">Showing {filteredItems.length} of {items.length} items</span>
            </div>

            {/* News Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </section>
            
            {/* Empty State */}
            {filteredItems.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No news articles found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
        )}
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default NewsPage;
