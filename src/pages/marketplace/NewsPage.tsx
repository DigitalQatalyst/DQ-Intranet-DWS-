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
    { id: '1', title: 'New Project Management Tool Rollout', description: "We're excited to announce the launch of our new project management tool that will streamline collaboration across teams.", date: 'June 15, 2023', category: 'IT', tags: ['Project Management'], image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop' },
    { id: '2', title: 'Q3 Town Hall Meeting', description: 'Join us for our quarterly town hall meeting where leadership will share company updates and answer questions.', date: 'June 12, 2023', category: 'HR', tags: ['Town Hall'], image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop' },
    { id: '3', title: 'Summer Team Building Event', description: "Get ready for our annual summer team-building event! This year we'll be having a beach day with activities and food.", date: 'June 10, 2023', category: 'Social', tags: ['Team Building'], image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop' },
    { id: '4', title: 'DQ Team Wins Industry Award', description: "Congratulations to our product team for winning the prestigious Innovation Award at this year's Tech Summit!", date: 'June 8, 2023', category: 'Achievement', tags: ['Award'], image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop' },
    { id: '5', title: 'New Security Training Required', description: "All employees must complete the updated security awareness training by the end of the month.", date: 'June 5, 2023', category: 'Training', tags: ['Security'], image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop' },
    { id: '6', title: 'Office Renovation Updates', description: 'Check out the latest updates on our office renovation project, including new meeting rooms and collaborative spaces.', date: 'June 1, 2023', category: 'HR', tags: ['Renovation'], image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop' },
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
