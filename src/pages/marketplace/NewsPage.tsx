import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ChevronDown, Search, Calendar, Building2, MapPin } from 'lucide-react';

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

const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => {
  const primaryTag = item.tags && item.tags.length > 0 ? item.tags[0] : item.category || 'News';
  const publishedOn = formatDate(item.date);
  return (
    <article className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
      {/* Image with date badge */}
      <div className="relative h-48 bg-gray-200">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
        )}
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded shadow-md">
          <span className="text-xs font-medium text-gray-900">{publishedOn || 'TBA'}</span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
        
        {/* Meta information */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{publishedOn || 'TBA'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>{item.provider?.name || 'DQ Intranet'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{primaryTag}</span>
          </div>
        </div>
        
        <Link 
          to={`/marketplace/opportunities/${item.id}`} 
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded font-medium transition-colors"
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
  
  // Collapsible sections state
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [dateOpen, setDateOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);

  const items = [
    { id: '1', title: 'Digital Qatalyst Launches AI-Powered Workspace Platform', description: "We're thrilled to announce the launch of our revolutionary AI-powered Digital Workspace Platform, designed to transform how teams collaborate and innovate in 2025.", date: 'October 28, 2025', category: 'Technology', tags: ['AI', 'Innovation'], image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop', provider: { name: 'Digital Qatalyst • Technology' } },
    { id: '2', title: 'Q4 2025 Town Hall: Year-End Achievements & 2026 Vision', description: 'Join our leadership team on November 5th as we celebrate our accomplishments this year and unveil our strategic vision for 2026.', date: 'October 25, 2025', category: 'Company', tags: ['Town Hall', 'Leadership'], image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop', provider: { name: 'Digital Qatalyst • HR' } },
    { id: '3', title: 'Annual Innovation Week: November 10-14, 2025', description: "Save the date! Our annual Innovation Week returns with workshops, hackathons, and guest speakers from leading tech companies. Let's innovate together!", date: 'October 22, 2025', category: 'Events', tags: ['Innovation', 'Team Building'], image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', provider: { name: 'Digital Qatalyst • Events' } },
    { id: '4', title: 'DQ Recognized as Top Workplace for Innovation 2025', description: "Proud moment! Digital Qatalyst has been named one of the Top 10 Most Innovative Workplaces by Tech Excellence Awards 2025.", date: 'October 20, 2025', category: 'Achievement', tags: ['Award', 'Recognition'], image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop', provider: { name: 'Digital Qatalyst • Communications' } },
    { id: '5', title: 'New Cybersecurity Protocols: Mandatory Training by Nov 15', description: "As part of our commitment to data security, all team members must complete the updated cybersecurity training module by November 15, 2025.", date: 'October 18, 2025', category: 'Security', tags: ['Training', 'Compliance'], image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop', provider: { name: 'Digital Qatalyst • IT Security' } },
    { id: '6', title: 'New Abu Dhabi Office Space: Grand Opening December 2025', description: 'Exciting news! Our expanded Abu Dhabi office featuring state-of-the-art collaboration spaces, wellness areas, and innovation labs opens next month.', date: 'October 15, 2025', category: 'Facilities', tags: ['Office', 'Expansion'], image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop', provider: { name: 'Digital Qatalyst • Facilities' } },
  ];

  // Filter items based on search query, category, date, and tags
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesDate = selectedDate ? new Date(item.date || '').toLocaleDateString() === selectedDate : true;
    const matchesTags = selectedTags.length > 0 ? selectedTags.every(tag => item.tags?.includes(tag)) : true;

    return matchesSearch && matchesCategory && matchesDate && matchesTags;
  });

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

        {/* Main Content with Sidebar */}
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
                  {['IT', 'HR', 'Social', 'Achievement', 'Training'].map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded ${category === selectedCategory ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'} transition`}
                    >
                      {category}
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
                  {['Project Management', 'Team Building', 'Security', 'Award', 'Renovation'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded ${selectedTags.includes(tag) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'} transition`}
                    >
                      {tag}
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
          </div>
        </div>
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default NewsPage;
