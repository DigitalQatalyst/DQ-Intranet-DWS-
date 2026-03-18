import React from 'react';
import { NewsCard as CardsNewsCard, ResourceCard as CardsResourceCard, EventCard as CardsEventCard, ServiceHighlightCard } from './Cards';
import { Download, ExternalLink, FileText, BookOpen, Calculator, Play } from 'lucide-react';

// NewsCard wrapper
export const NewsCard = ({
  content,
  onQuickView,
  onReadMore = () => undefined, // Add default no-op function to make it optional in the wrapper
  ...props
}) => {
  const newsItem = {
    id: content.title,
    title: content.title,
    description: content.description,
    excerpt: content.description || content.title.substring(0, 100) + (content.title.length > 100 ? '...' : ''),
    imageUrl: content.imageUrl,
    tags: content.tags || [],
    date: content.date,
    category: content.tags?.[0] || 'News',
    source: content.source || 'TechNews Daily',
    sourceLogoUrl: content.sourceLogoUrl
  };

  const pill =
    (content.tags || []).some((tag) =>
      typeof tag === 'string'
        ? tag.toLowerCase().includes('podcast')
        : false
    )
      ? { text: 'Play', icon: <Play size={12} />, variant: 'info' as const }
      : undefined;
  
  return <CardsNewsCard item={newsItem} pill={pill} onQuickView={onQuickView} onReadMore={onReadMore} {...props} />;
};

// EventCard wrapper
export const EventCard = ({
  content,
  isUpcoming,
  onQuickView,
  onRegister = () => undefined, // Add default no-op function
  ...props
}) => {
  const eventItem = {
    id: content.title,
    title: content.title,
    description: content.description,
    dateTime: content.dateTime,
    location: content.location,
    imageUrl: content.imageUrl,
    tags: content.tags || [],
    organizer: content.organizer || content.location || 'Event Organizer',
    source: content.organizer || 'Event Host' // Add source information
  };
  
  return <CardsEventCard 
    item={eventItem} 
    onQuickView={onQuickView} 
    onRegister={onRegister} // Pass the onRegister prop
    {...props} 
  />;
};

// ResourceCard wrapper
export const ResourceCard = ({
  content,
  onQuickView,
  onAccessResource = () => undefined, // Add default for required callback
  onDownload,
  ...props
}) => {
  // Get appropriate icon based on resource type
  const getResourceIcon = type => {
    switch (type?.toLowerCase()) {
      case 'guide':
        return <BookOpen size={24} className="text-blue-600" />;
      case 'template':
      case 'templates':
        return <FileText size={24} className="text-blue-600" />;
      case 'tool':
        return <Calculator size={24} className="text-blue-600" />;
      case 'documentation':
        return <FileText size={24} className="text-blue-600" />;
      case 'video':
        return <ExternalLink size={24} className="text-blue-600" />;
      case 'article':
        return <FileText size={24} className="text-blue-600" />;
      default:
        return <FileText size={24} className="text-blue-600" />;
    }
  };

  // Map resource type to valid resourceType values
  const mapResourceType = (type) => {
    const typeMap = {
      'templates': 'template',
      'guides': 'guide',
      'tools': 'tool',
      'docs': 'documentation',
      'videos': 'video',
      'articles': 'article'
    };
    return typeMap[type?.toLowerCase()] || type?.toLowerCase() || 'guide';
  };

  // Create resourceItem that matches ResourceItem interface
  const resourceItem = {
    id: content.title,
    title: content.title,
    category: content.category || content.type || 'Resources', // Required: category field
    description: content.description,
    tags: content.tags || [],
    resourceType: mapResourceType(content.type), // Required: resourceType field
    fileSize: content.fileSize || (Math.random() * 5).toFixed(1) + ' MB',
    downloadCount: content.downloadCount || Math.floor(Math.random() * 1000) + 100,
    accessCount: content.accessCount || Math.floor(Math.random() * 5000) + 500,
    thumbnailUrl: content.imageUrl, // Map imageUrl to thumbnailUrl
    isExternal: content.isExternal || false,
    lastUpdated: content.lastUpdated || 'January 2024'
  };

  return (
    <CardsResourceCard 
      item={resourceItem} 
      onQuickView={onQuickView} 
      onAccessResource={onAccessResource}
      onDownload={onDownload}
      {...props} 
    />
  );
};

// Re-export ServiceHighlightCard as-is
export { ServiceHighlightCard };
