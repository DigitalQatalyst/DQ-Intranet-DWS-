import { useState } from 'react';
import { RefreshCw, Bookmark, Share2 } from 'lucide-react';
import { FadeInUpOnScroll } from './AnimationUtils';
import { dailyQuotes, type DailyQuote } from '../data/dailyQuotes';

type Mood = 'Good' | 'Calm' | 'Focused' | 'Stressed' | 'Tired';

const moodOptions: { mood: Mood; emoji: string }[] = [
  { mood: 'Good', emoji: '😊' },
  { mood: 'Calm', emoji: '😌' },
  { mood: 'Focused', emoji: '🎯' },
  { mood: 'Stressed', emoji: '😰' },
  { mood: 'Tired', emoji: '😴' },
];

const DailyPulseSection = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [currentQuote, setCurrentQuote] = useState<DailyQuote>(dailyQuotes[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * dailyQuotes.length);
    setCurrentQuote(dailyQuotes[randomIndex]);
    setIsExpanded(false);
  };

  const handleSave = () => {
    // Placeholder for save functionality
    console.log('Quote saved:', currentQuote);
  };

  const handleShare = () => {
    // Placeholder for share functionality
    if (navigator.share) {
      navigator.share({
        title: 'Daily Inspiration',
        text: `"${currentQuote.text}" - ${currentQuote.author}`,
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <FadeInUpOnScroll>
            {/* Title and subtitle */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Daily Pulse
              </h2>
              <p className="text-sm text-gray-600">
                Check in with yourself and find inspiration for the day
              </p>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column - Mood check-in */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">
                  How are you feeling?
                </h3>
                
                {/* Mood chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {moodOptions.map(({ mood, emoji }) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      aria-pressed={selectedMood === mood}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        selectedMood === mood
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-1.5">{emoji}</span>
                      {mood}
                    </button>
                  ))}
                </div>

                {/* Helper text */}
                {selectedMood && (
                  <p className="text-sm text-gray-600 animate-fade-in">
                    Selected: <span className="font-medium">{selectedMood}</span>. Here's something to match your day.
                  </p>
                )}
              </div>

              {/* Right column - Quote card */}
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    Today's Inspiration
                  </h3>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleNewQuote}
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="New quote"
                      title="New quote"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button
                      onClick={handleSave}
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Save quote"
                      title="Save quote"
                    >
                      <Bookmark size={16} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Share quote"
                      title="Share quote"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Quote text */}
                <div className="mb-4">
                  <p
                    className={`text-gray-700 leading-relaxed ${
                      isExpanded ? '' : 'line-clamp-3'
                    }`}
                  >
                    "{currentQuote.text}"
                  </p>
                  {currentQuote.text.length > 150 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 focus:outline-none focus:underline"
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>

                {/* Author row */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                    {getInitials(currentQuote.author)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {currentQuote.author}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentQuote.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInUpOnScroll>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default DailyPulseSection;
