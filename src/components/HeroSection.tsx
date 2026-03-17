import React, { useEffect, useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import {
  AnimatedText,
  FadeInUpOnScroll,
  StaggeredFadeIn,
} from './AnimationUtils';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Header';
import { heroContent } from '../data/landingPageContent';
import { getSearchMatches } from '@/utils/searchRouter';

interface HeroSectionProps {
  "data-id"?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ "data-id": dataId }) => {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  const onboardingPath = "/onboarding/welcome";
  const ctaHref = isAuthenticated
    ? onboardingPath
    : `/signin?redirect=${encodeURIComponent(onboardingPath)}`;
  const [prompt, setPrompt] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;

    // Send to custom DWS chat widget via custom event
    // This works even if the provider isn't directly imported
    try {
      // Dispatch event that the chat widget listens to
      globalThis.dispatchEvent(new CustomEvent('dq-hero-sent-to-chat', {
        detail: { message: trimmed }
      }));

      // Also try the direct event name
      globalThis.dispatchEvent(new CustomEvent('dws-chat-send-message', {
        detail: { message: trimmed }
      }));

      setPrompt('');
      return;
    } catch (error) {
      console.error('Chat error:', error);
      // Fall through to search routing
    }

    // Fallback: if chat is not available, route using our DWS search router
    const matches = getSearchMatches(trimmed);
    if (matches.length === 1) {
      navigate(matches[0].href);
    } else {
      navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    }
    setPrompt('');
  };

  // Show suggestion pills with delay after focus
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isSearchFocused) {
      timer = setTimeout(() => {
        setShowSuggestions(true);
      }, 500);
    } else {
      setShowSuggestions(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isSearchFocused]);

  const suggestionPills = heroContent.suggestionPills;

  return (
    <div
      className="relative w-full bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.7)), url('https://images.unsplash.com/photo-1517651685227-828652601fa3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2670')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
      data-id={dataId}
    >
      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-purple-600/40 mix-blend-multiply"
        style={{
          animation: "pulse-gradient 8s ease-in-out infinite alternate",
        }}
      ></div>
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-normal overflow-visible">
            <AnimatedText text={heroContent.title} gap="1rem" />
          </h1>
          <FadeInUpOnScroll delay={0.8}>
            <p className="text-xl text-white/90 mb-8">
              {heroContent.subtitle}
            </p>
          </FadeInUpOnScroll>
        </div>
        {/* AI Assistant Interface with animation */}
        <FadeInUpOnScroll delay={1.2} className="w-full max-w-3xl mb-10">
          <div
            className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
              isSearchFocused ? "shadow-xl transform scale-105" : ""
            }`}
          >
            <div className="p-2 md:p-3" data-hero-search-connected="dws-chat-widget">
              <form className="flex items-center" onSubmit={handleSubmit}>
                {/* Input field with AI indicator */}
                <div className="flex-grow relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={isAuthenticated ? "Hi ".concat(user?.firstName ?? "there", ", what can we help you find today?") : "What can we help you find today?"}
                    className={`w-full py-3 pl-12 pr-4 outline-none text-gray-700 rounded-lg bg-gray-50 transition-all duration-300 ${
                      isSearchFocused ? 'bg-white ring-2 ring-blue-500' : ''
                    }`}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                      setTimeout(() => setIsSearchFocused(false), 200);
                    }}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>AI Ready</span>
                    </span>
                  </div>
                </div>
                {/* Submit button */}
                <button
                  type="submit"
                  aria-label="Ask AI Assistant"
                  disabled={prompt.trim() === ''}
                  className={`ml-2 p-3 rounded-lg flex items-center justify-center transition-all ${
                    prompt.trim()
                      ? 'bg-[image:var(--dq-cta-gradient)] hover:brightness-105 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-200 cursor-not-allowed text-gray-400'
                  }`}
                  title="Ask the AI Assistant"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </button>
              </form>
            </div>
            {/* AI Assistant prompts with enhanced styling */}
            <div
              className={`bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-t border-blue-100 transition-all duration-500 ease-in-out ${
                showSuggestions
                  ? "opacity-100 max-h-32"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-xs font-medium text-blue-700">AI Assistant Examples:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestionPills.map((pill) => (
                  <button
                    key={`suggestion-pill-${pill}`}
                    className="text-xs bg-white border border-blue-200 rounded-full px-3 py-1.5 text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                    style={{
                      opacity: showSuggestions ? 1 : 0,
                      transform: showSuggestions
                        ? "translateY(0)"
                        : "translateY(10px)",
                      transition:
                        "opacity 0.3s ease-out, transform 0.3s ease-out",
                      transitionDelay: `${0.1 + suggestionPills.indexOf(pill) * 0.1}s`,
                    }}
                    onClick={() => {
                      setPrompt(pill);
                      setIsSearchFocused(true);
                    }}
                  >
                    {pill}
                  </button>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span>Powered by AI - I can explain features, guide you, and help you find what you need</span>
              </p>
              <p id="hero-chat-hint" className="text-xs text-blue-500 mt-1 flex items-center gap-1">
                <span className="inline-block w-4 h-px bg-blue-300" aria-hidden="true" />
                <span>Connected to the chat — your question opens in the assistant (bottom-right)</span>
              </p>
            </div>
          </div>
        </FadeInUpOnScroll>
        {/* Call to Action Buttons with animations */}
        <StaggeredFadeIn
          staggerDelay={0.2}
          className="flex flex-col sm:flex-row gap-4 mt-2"
        >
          <button
            onClick={() => {
              const section = document.getElementById('tools-resources-services');
              section?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }}
            className="px-8 py-3 bg-[linear-gradient(135deg,_#FB5535_0%,_#1A2E6E_50%,_#030F35_100%)] hover:brightness-105 text-white font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center flex items-center justify-center overflow-hidden group"
          >
            <span className="relative z-10">
              Browse Marketplaces
            </span>
            <ArrowRight
              size={18}
              className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300"
            />
            {/* Ripple effect on hover */}
            <span className="absolute inset-0 overflow-hidden rounded-lg">
              <span className="absolute inset-0 bg-white/20 transform scale-0 opacity-0 group-hover:scale-[2.5] group-hover:opacity-100 rounded-full transition-all duration-700 origin-center"></span>
            </span>
          </button>
          <Link
            to={ctaHref}
            className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center flex items-center justify-center border-2 border-gray-200"
          >
            <span>Start Your Onboarding Journey</span>
            <ArrowRight
              size={18}
              className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </StaggeredFadeIn>
      </div>
      {/* Add keyframes for gradient animation */}
      <style>{`
        @keyframes pulse-gradient {
          0% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
