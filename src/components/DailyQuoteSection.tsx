import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { FadeInUpOnScroll } from './AnimationUtils';
import { dailyQuotes, type DailyQuote } from '../data/dailyQuotes';

const DailyQuoteSection = () => {
  const [currentQuote, setCurrentQuote] = useState<DailyQuote>(dailyQuotes[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleNewQuote = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * dailyQuotes.length);
      setCurrentQuote(dailyQuotes[randomIndex]);
      setIsRefreshing(false);
    }, 300);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 mb-16 mt-12">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 md:p-6 overflow-hidden relative">
        <FadeInUpOnScroll className="text-center mb-4 relative z-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 clamp-1">
            Today's Inspiration
          </h2>
          <div>
            <p className="text-base sm:text-lg text-gray-600 mx-auto clamp-1 leading-tight whitespace-normal sm:whitespace-nowrap max-w-full sm:max-w-4xl">
              A moment of wisdom to guide your journey
            </p>
          </div>
        </FadeInUpOnScroll>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 mx-auto flex flex-col overflow-hidden"
            style={{
              width: '100%',
              maxWidth: '1030px',
              minHeight: 'auto'
            }}
          >
            {/* Large quote mark */}
            <div className="mb-3 flex-shrink-0">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                className="text-coral-500"
                style={{ color: 'rgba(251, 85, 53, 0.4)' }}
              >
                <path
                  d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Quote text */}
            <div className="mb-3 flex-1 min-h-0">
              <p className="text-gray-700 leading-relaxed italic font-medium" style={{ fontSize: '16px' }}>
                {currentQuote.text}
              </p>
            </div>

            {/* Author info */}
            <div className="flex items-center justify-between gap-4 flex-shrink-0 w-full">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                  style={{ backgroundColor: 'rgba(251, 85, 53, 0.4)' }}
                >
                  {getInitials(currentQuote.author)}
                </div>

                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <p className="text-base font-semibold text-gray-900 leading-tight truncate">
                    {currentQuote.author}
                  </p>
                </div>
              </div>

              {/* Refresh button */}
              <button
                onClick={handleNewQuote}
                disabled={isRefreshing}
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Get new quote"
                title="New Quote"
              >
                <RefreshCw 
                  size={20} 
                  className={`transition-transform duration-300 ${isRefreshing ? 'animate-spin' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuoteSection;
