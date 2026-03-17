import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { FadeInUpOnScroll } from './AnimationUtils';
import { fetchAllNews } from '@/services/mediaCenterService';
import type { NewsItem } from '@/data/media/news';
import { getNewsImageSrc } from '@/utils/newsUtils';

interface FeaturedProgram {
  id: string;
  partnership: string;
  title: string;
  description: string;
  learnMoreHref: string;
  applyNowHref?: string;
  backgroundImage?: string;
  category: 'News' | 'Insight' | 'Jobs';
  ctaLabel?: string;
}

const fallbackPrograms: FeaturedProgram[] = [
  {
    id: 'fallback-1',
    partnership: 'Digital Qatalyst',
    title: 'Welcome to the Digital Workspace',
    description:
      'Explore onboarding, services, media, and knowledge resources designed to help every associate start fast and deliver with confidence.',
    learnMoreHref: '/marketplace/guides?tab=guidelines',
    backgroundImage:
      'linear-gradient(90deg, rgba(251, 83, 53, 0.6) 0%, rgba(26, 46, 110, 0.6) 50%, rgba(3, 15, 53, 0.6) 100%), url(/images/honeycomb.png)',
    category: 'News',
  },
];

export const FeaturedNationalProgram: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [programs, setPrograms] = useState<FeaturedProgram[]>([]);
  const activeProgram = programs[activeIndex] ?? null;

  // Auto-advance carousel
  useEffect(() => {
    if (!programs || programs.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % programs.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [programs]);

  // Load latest items from DQ Media Center
  useEffect(() => {
    let isMounted = true;

    async function loadFeatured() {
      try {
        // Fetch latest news and blogs from Media Center
        const newsData = await fetchAllNews();

        if (!isMounted) return;

        if (!newsData || newsData.length === 0) {
          console.warn('No news data available from Media Center');
          setPrograms(fallbackPrograms);
          return;
        }

        // Transform Media Center news data to FeaturedProgram format
        // Show mix of latest announcements and blogs
        const fallbackImages = [
          'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
        ];
        const fallbackHero = 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80';

        // Get 3 latest announcements
        const announcements = newsData
          .filter((item: NewsItem) => {
            const itemType = (item.type || '').toLowerCase();
            return itemType === 'announcement';
          })
          .slice(0, 3);

        // Get 3 latest blogs (Thought Leadership)
        const blogs = newsData
          .filter((item: NewsItem) => {
            const itemType = (item.type || '').toLowerCase();
            return itemType === 'thought leadership';
          })
          .slice(0, 3);

        // Combine and sort by date (newest first)
        const combinedItems = [...announcements, ...blogs].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        const transformedPrograms: FeaturedProgram[] = combinedItems
          .map((item: NewsItem) => {
            // Use the same image resolution logic as Media Center cards
            const imageSrc = getNewsImageSrc(item, fallbackImages, fallbackHero);
            
            return {
              id: item.id,
              partnership: item.author || item.newsSource || 'DQ Communications',
              title: item.title,
              description: item.excerpt || '',
              learnMoreHref: `/marketplace/news/${item.id}`,
              backgroundImage: `url("${imageSrc}")`,
              category: 'News' as const,
              ctaLabel: 'READ STORY',
            };
          });

        setPrograms(transformedPrograms.length > 0 ? transformedPrograms : fallbackPrograms);
        setActiveIndex(0);
      } catch (error) {
        console.error('Failed to load featured updates from Media Center', error);
        if (isMounted) {
          setPrograms(fallbackPrograms);
        }
      }
    }

    loadFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full py-8 px-4">
      <FadeInUpOnScroll className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3 clamp-1">
          Latest Updates
        </h2>
        <div>
          <p className="text-base sm:text-lg text-gray-600 mx-auto text-balance leading-tight whitespace-normal sm:whitespace-nowrap max-w-full sm:max-w-4xl">
            Catch the latest DQ news, insights, and job opportunities curated for quick scanning, with one click to dive deeper.
          </p>
        </div>
      </FadeInUpOnScroll>

      <div className="relative rounded-3xl overflow-hidden shadow-xl w-full max-w-[1506px] mx-auto">
        {activeProgram && (
        <div
          key={activeProgram.id}
          className="h-[360px] p-10 flex flex-col justify-between relative bg-cover bg-center transition-all duration-500"
          style={
            activeProgram.backgroundImage
              ? {
                  backgroundImage: `linear-gradient(to right, rgba(15, 29, 74, 0.45), rgba(15, 29, 74, 0.45)), ${activeProgram.backgroundImage}`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  animation: 'fadeSlideIn 0.6s ease-out'
                }
              : {
                  backgroundColor: 'rgba(15, 29, 74, 0.45)',
                  animation: 'fadeSlideIn 0.6s ease-out'
                }
          }
        >

          <div className="flex-1 flex flex-col justify-center text-white relative z-10">
            <h3 className="font-bold mb-4 text-white max-w-3xl leading-tight" style={{ fontSize: '30px' }}>
              {activeProgram.title}
            </h3>
            <p className="max-w-2xl leading-relaxed text-white/90" style={{ fontSize: '18px' }}>
              {activeProgram.description}
            </p>
          </div>

          <div className="flex items-center relative z-10">
            <a
              href={activeProgram.learnMoreHref}
              className="px-6 py-3 bg-white text-[#0F1D4A] font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg"
            >
              {activeProgram.ctaLabel || (
                <>
                  {activeProgram.category === 'Jobs' && 'VIEW OPPORTUNITY'}
                  {activeProgram.category === 'News' && 'READ STORY'}
                  {activeProgram.category === 'Insight' && 'READ INSIGHT'}
                </>
              )}
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
        )}
      </div>

      {/* Navigation dots */}
      {programs.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {programs.map((program, index) => (
            <button
              key={program.id}
              onClick={() => setActiveIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-orange-500 w-8 h-2' 
                  : 'bg-gray-300 w-2 h-2'
              }`}
              aria-label={`Go to program ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
