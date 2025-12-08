import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AssetLibraryPage from '../assetLibrary';
import { MarketplacePage } from '../../components/marketplace/MarketplacePage';
import MarketplaceDetailsPage from './MarketplaceDetailsPage';
import ActivitiesPage from './ActivitiesPage';
import { DollarSign, Briefcase, Calendar, BookOpen } from 'lucide-react';
import { getMarketplaceConfig } from '../../utils/marketplaceConfig';
const GuideDetailPage = React.lazy(() => import('../guides/GuideDetailPage'));
const GlossaryPage = React.lazy(() => import('../guides/GlossaryPage'));
const FAQsPage = React.lazy(() => import('../guides/FAQsPage'));
const TestimonialsDetailPage = React.lazy(() => import('../guides/TestimonialsDetailPage'));
const NewsPage = React.lazy(() => import('./NewsPage'));
const NewsDetailPage = React.lazy(() => import('./NewsDetailPage'));
// Promo cards for courses marketplace
const coursePromoCards = [{
  id: 'finance-promo',
  type: 'promo' as const,
  title: 'Looking for funding?',
  description: 'Explore financial opportunities and resources to grow your business.',
  icon: <DollarSign size={24} className="text-white" />,
  path: '/marketplace/financial',
  gradientFrom: 'from-blue-600',
  gradientTo: 'to-indigo-700'
}, {
  id: 'advisory-promo',
  type: 'promo' as const,
  title: 'Need expert advice?',
  description: 'Connect with industry experts and get personalized guidance.',
  icon: <Briefcase size={24} className="text-white" />,
  path: '/marketplace/non-financial',
  gradientFrom: 'from-purple-600',
  gradientTo: 'to-pink-500'
}];
export const coursePromoTiles = coursePromoCards;
// Promo cards for financial services marketplace
const financialPromoCards = [{
  id: 'courses-promo',
  title: 'Improve your skills',
  description: 'Discover courses to enhance your financial knowledge.',
  icon: <Calendar size={24} className="text-white" />,
  path: '/marketplace/courses',
  gradientFrom: 'from-green-500',
  gradientTo: 'to-teal-400'
}, {
  id: 'advisory-promo',
  title: 'Need expert advice?',
  description: 'Connect with industry experts and get personalized guidance.',
  icon: <Briefcase size={24} className="text-white" />,
  path: '/marketplace/non-financial',
  gradientFrom: 'from-purple-600',
  gradientTo: 'to-pink-500'
}];
// Promo cards for non-financial services marketplace
const nonFinancialPromoCards = [{
  id: 'courses-promo',
  title: 'Improve your skills',
  description: 'Discover courses to enhance your business knowledge.',
  icon: <Calendar size={24} className="text-white" />,
  path: '/marketplace/courses',
  gradientFrom: 'from-green-500',
  gradientTo: 'to-teal-400'
}, {
  id: 'finance-promo',
  title: 'Looking for funding?',
  description: 'Explore financial opportunities and resources to grow your business.',
  icon: <DollarSign size={24} className="text-white" />,
  path: '/marketplace/financial',
  gradientFrom: 'from-blue-600',
  gradientTo: 'to-indigo-700'
}];
// Promo cards for knowledge hub marketplace
const knowledgeHubPromoCards = [{
  id: 'courses-promo',
  title: 'Enhance your skills',
  description: 'Discover courses to develop your business capabilities.',
  icon: <BookOpen size={24} className="text-white" />,
  path: '/marketplace/courses',
  gradientFrom: 'from-green-500',
  gradientTo: 'to-teal-400'
}, {
  id: 'finance-promo',
  title: 'Explore funding options',
  description: 'Find financial services to support your business growth.',
  icon: <DollarSign size={24} className="text-white" />,
  path: '/marketplace/financial',
  gradientFrom: 'from-blue-600',
  gradientTo: 'to-indigo-700'
}];
export const MarketplaceRouter: React.FC = () => {
  // Get configurations
  const coursesConfig = getMarketplaceConfig('courses');
  const financialConfig = getMarketplaceConfig('financial');
  const nonFinancialConfig = getMarketplaceConfig('non-financial');
  const knowledgeHubConfig = getMarketplaceConfig('knowledge-hub');
  const guidesConfig = getMarketplaceConfig('guides');
  // State for bookmarked items and comparison
  const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, string[]>>({
    courses: [],
    financial: [],
    'non-financial': [],
    'knowledge-hub': [],
    guides: []
  });
  
  // Toggle bookmark for an item
  const handleToggleBookmark = (marketplaceType: string, itemId: string) => {
    setBookmarkedItems(prev => {
      const currentItems = prev[marketplaceType] || [];
      const updatedItems = currentItems.includes(itemId) ? currentItems.filter(id => id !== itemId) : [...currentItems, itemId];
      return {
        ...prev,
        [marketplaceType]: updatedItems
      };
    });
  };
  
  return <Routes>
      {/* Courses Marketplace */}
      <Route path="/courses" element={<MarketplacePage marketplaceType="courses" title={coursesConfig.title} description={coursesConfig.description} promoCards={coursePromoCards} />} />
      <Route path="/courses/:itemId" element={<MarketplaceDetailsPage marketplaceType="courses" bookmarkedItems={bookmarkedItems.courses} onToggleBookmark={itemId => handleToggleBookmark('courses', itemId)} />} />
      
      {/* Financial Services Marketplace */}
      <Route path="/financial" element={<MarketplacePage marketplaceType="financial" title={financialConfig.title} description={financialConfig.description} promoCards={financialPromoCards} />} />
      <Route path="/financial/:itemId" element={<MarketplaceDetailsPage marketplaceType="financial" bookmarkedItems={bookmarkedItems.financial} onToggleBookmark={itemId => handleToggleBookmark('financial', itemId)} />} />
      
      {/* Services Center - Non-Financial Services Marketplace */}
      <Route path="/services-center" element={<MarketplacePage marketplaceType="non-financial" title={nonFinancialConfig.title} description={nonFinancialConfig.description} promoCards={nonFinancialPromoCards} />} />
      <Route path="/services-center/:itemId" element={<MarketplaceDetailsPage marketplaceType="non-financial" bookmarkedItems={bookmarkedItems['non-financial']} onToggleBookmark={itemId => handleToggleBookmark('non-financial', itemId)} />} />
      
      {/* Backward compatibility: /non-financial redirects to /services-center */}
      <Route path="/non-financial" element={<Navigate to="/marketplace/services-center" replace />} />
      <Route path="/non-financial/:itemId" element={<Navigate to="/marketplace/services-center/:itemId" replace />} />
      
      {/* Guides Marketplace (canonical) */}
      <Route path="/guides" element={<MarketplacePage marketplaceType="guides" title={guidesConfig.title} description={guidesConfig.description} promoCards={knowledgeHubPromoCards} />} />
      <Route path="/guides/glossary" element={<React.Suspense fallback={<div className="p-6 text-center">Loading...</div>}><GlossaryPage /></React.Suspense>} />
      <Route path="/guides/faqs" element={<React.Suspense fallback={<div className="p-6 text-center">Loading...</div>}><FAQsPage /></React.Suspense>} />
      <Route path="/guides/testimonials" element={<React.Suspense fallback={<div className="p-6 text-center">Loading...</div>}><TestimonialsDetailPage /></React.Suspense>} />
      <Route path="/guides/:itemId" element={<React.Suspense fallback={<div className="p-6 text-center">Loading...</div>}><GuideDetailPage /></React.Suspense>} />
      
      {/* Backward compatibility: Knowledge Hub routes (aliased to Guides) */}
      <Route path="/knowledge-hub" element={<MarketplacePage marketplaceType="knowledge-hub" title={knowledgeHubConfig.title} description={knowledgeHubConfig.description} promoCards={knowledgeHubPromoCards} />} />
      <Route path="/knowledge-hub/:itemId" element={<MarketplaceDetailsPage marketplaceType="knowledge-hub" bookmarkedItems={bookmarkedItems['knowledge-hub']} onToggleBookmark={itemId => handleToggleBookmark('knowledge-hub', itemId)} />} />
      {/* News & Opportunities Marketplace */}
      <Route path="/news" element={<NewsPage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />
      <Route path="/opportunities" element={<NewsPage />} />
      <Route path="/opportunities/:id" element={<NewsDetailPage />} />
      {/* Asset Library */}
      <Route path="/asset-library" element={<AssetLibraryPage />} />
      <Route path="/marketplace/activities" element={<ActivitiesPage />} />
    </Routes>;
};

