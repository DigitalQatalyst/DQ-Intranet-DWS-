import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'

interface NewsItem {
  id: string
  title: string
  description: string
  date?: string
  category?: string
  tags?: string[]
  provider?: { name: string }
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const NewsCard: React.FC<{ item: NewsItem }> = ({ item }) => {
  const primaryTag = item.tags && item.tags.length > 0 ? item.tags[0] : item.category || 'News'
  const publishedOn = formatDate(item.date)
  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
            {primaryTag}
          </span>
          {publishedOn && (
            <span className="text-xs text-gray-500">{publishedOn}</span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 leading-snug mb-1">
          {item.title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
          {item.description}
        </p>
        <Link
          to={`/media/news/${item.id}`}
          className="inline-flex items-center text-sm font-medium text-rose-600 hover:text-rose-700"
        >
          Read more <span aria-hidden className="ml-1">→</span>
        </Link>
      </div>
    </article>
  )
}

const NewsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const items = [
    {
      id: '1',
      title: 'New Project Management Tool Rollout',
      description: "We're excited to announce the launch of our new project management tool that will streamline collaboration across teams.",
      date: 'June 15, 2023',
      category: 'IT',
    },
    {
      id: '2',
      title: 'Q3 Town Hall Meeting',
      description: 'Join us for our quarterly town hall meeting where leadership will share company updates and answer questions.',
      date: 'June 12, 2023',
      category: 'HR',
    },
    {
      id: '3',
      title: 'Summer Team Building Event',
      description: "Get ready for our annual summer team building event! This year we'll be having a beach day with activities and food.",
      date: 'June 10, 2023',
      category: 'Social',
    },
    {
      id: '4',
      title: 'DQ Team Wins Industry Award',
      description: "Congratulations to our product team for winning the prestigious Innovation Award at this year's Tech Summit!",
      date: 'June 8, 2023',
      category: 'Achievement',
    },
    {
      id: '5',
      title: 'New Security Training Required',
      description: "All employees must complete the updated security awareness training by the end of the month.",
      date: 'June 5, 2023',
      category: 'Training',
    },
    {
      id: '6',
      title: 'Office Renovation Updates',
      description: 'Check out the latest updates on our office renovation project, including new meeting rooms and collaborative spaces.',
      date: 'June 1, 2023',
      category: 'HR',
    },
  ]

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <main className="container mx-auto px-4 py-8 flex-grow flex">
        {/* Sidebar Filters */}
        <div className="w-1/4 bg-white p-6 shadow-md border-r border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>

          {/* Category Filter */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Category</h3>
            <div className="space-y-2">
              <button className="px-4 py-2 rounded-full text-sm text-blue-600 border border-blue-600 hover:bg-blue-100">IT</button>
              <button className="px-4 py-2 rounded-full text-sm text-blue-600 border border-blue-600 hover:bg-blue-100">HR</button>
              <button className="px-4 py-2 rounded-full text-sm text-blue-600 border border-blue-600 hover:bg-blue-100">Social</button>
              <button className="px-4 py-2 rounded-full text-sm text-blue-600 border border-blue-600 hover:bg-blue-100">Achievement</button>
              <button className="px-4 py-2 rounded-full text-sm text-blue-600 border border-blue-600 hover:bg-blue-100">Training</button>
            </div>
          </div>

          {/* Date Filter */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Date</h3>
            <div className="space-y-2">
              <button className="px-4 py-2 rounded-full text-sm text-blue-600 border border-blue-600 hover:bg-blue-100">Last 7 Days</button>
              <button className="px-4 py-2 rounded-full text-sm text-blue-600 border border-blue-600 hover:bg-blue-100">This Month</button>
              <button className="px-4 py-2 rounded-full text-sm text-blue-600 border border-blue-600 hover:bg-blue-100">This Year</button>
            </div>
          </div>

          {/* Tag Filter */}
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Tags</h3>
            <div className="space-y-2">
              <button className="px-4 py-2 rounded-full text-sm text-blue-600 border border-blue-600 hover:bg-blue-100">Project Management</button>
              <button className="px-4 py-2 rounded-full text-sm text-blue-600 border border-blue-600 hover:bg-blue-100">Team Building</button>
              <button className="px-4 py-2 rounded-full text-sm text-blue-600 border border-blue-600 hover:bg-blue-100">Security</button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-3/4 pl-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Latest News & Announcements</h1>
            <p className="text-gray-600 mt-2">
              Stay up-to-date with the latest company news and announcements
            </p>
          </header>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search news..."
              className="w-full p-3 border border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* News Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </section>
        </div>
      </main>
      <Footer isLoggedIn={false} />
    </div>
  )
}

export default NewsPage
