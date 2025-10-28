import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/communities/components/ui/button';
interface MediaPostContentProps {
  metadata: {
    media_url?: string;
    media_urls?: string[];
    caption?: string;
    media_type?: string;
    source_url?: string;
  };
  title: string;
  content?: string;
  content_html?: string;
}
export function MediaPostContent({
  metadata,
  title,
  content,
  content_html
}: MediaPostContentProps) {
  const mediaUrls = metadata.media_urls || (metadata.media_url ? [metadata.media_url] : []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const mediaType = metadata.media_type || 'image';
  if (mediaUrls.length === 0) {
    return <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">No media available for this post.</p>
      </div>;
  }
  const hasMultiple = mediaUrls.length > 1;
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % mediaUrls.length);
  };
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + mediaUrls.length) % mediaUrls.length);
  };
  const renderMediaContent = () => {
    const currentUrl = mediaUrls[currentIndex];
    // Handle video content
    if (mediaType === 'video' || currentUrl?.match(/\.(mp4|webm|ogg)$/i)) {
      return <div className="relative w-full pt-[56.25%] bg-black">
          <video src={currentUrl} controls className="absolute inset-0 w-full h-full object-contain" poster="/placeholder.svg">
            Your browser does not support the video tag.
          </video>
        </div>;
    }
    // Default to image
    return <img src={currentUrl} alt={metadata.caption || title} className="w-full object-contain max-h-[600px]" onError={e => {
      e.currentTarget.src = "/placeholder.svg";
    }} />;
  };
  return <div className="space-y-4">
      {/* Media Preview */}
      <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
        {renderMediaContent()}
        {/* Carousel Controls */}
        {hasMultiple && <>
            <Button variant="secondary" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10" onClick={goToPrevious}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="secondary" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10" onClick={goToNext}>
              <ChevronRight className="h-5 w-5" />
            </Button>
            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-medium text-gray-700">
              {currentIndex + 1} / {mediaUrls.length}
            </div>
          </>}
      </div>
      {/* Caption */}
      {metadata.caption && <p className="text-sm text-gray-600 italic border-l-2 border-gray-300 pl-4 py-1">
          {metadata.caption}
        </p>}
      {/* Source Link */}
      {metadata.source_url && <div className="flex items-center text-sm text-blue-600">
          <ExternalLink className="h-4 w-4 mr-1.5" />
          <a href={metadata.source_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            View original source
          </a>
        </div>}
      {/* Additional Content */}
      {(content || content_html) && <div className="prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 mt-4">
          {content_html ? <div dangerouslySetInnerHTML={{
        __html: content_html
      }} /> : <p className="whitespace-pre-wrap leading-relaxed">{content}</p>}
        </div>}
    </div>;
}