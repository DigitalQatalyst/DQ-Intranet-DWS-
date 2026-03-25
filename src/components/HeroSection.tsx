import React from 'react';
import { ArrowRight, Sparkles, Lock } from 'lucide-react';
import {
  AnimatedText,
  FadeInUpOnScroll,
  StaggeredFadeIn,
} from './AnimationUtils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Header';
import { heroContent } from '../data/landingPageContent';
import ParticleWaveBackground from './ParticleWaveBackground';

interface HeroSectionProps {
  "data-id"?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ "data-id": dataId }) => {
  const { user, login } = useAuth();
  const isAuthenticated = Boolean(user);
  const onboardingPath = "/onboarding/welcome";
  const navigate = useNavigate();
  const handleOnboardingCta = () => {
    navigate(onboardingPath);
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #082f49 50%, #0a1628 100%)',
        height: "100vh",
      }}
      data-id={dataId}
    >
      {/* Three.js particle wave */}
      <ParticleWaveBackground />

      {/* Soft cyan/blue glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)', filter: 'blur(120px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', filter: 'blur(150px)' }} />

      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,22,40,0.6) 100%)' }} />
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-normal overflow-visible whitespace-nowrap">
            <AnimatedText text={heroContent.title} gap="1rem" />
          </h1>
          <FadeInUpOnScroll delay={0.8}>
            <p className="text-xl text-white/90 mb-8">
              {heroContent.subtitle}
            </p>
          </FadeInUpOnScroll>
        </div>
        {/* Coming Soon AI Search Bar */}
        <FadeInUpOnScroll delay={1.2} className="w-full max-w-3xl mb-10">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Search input row */}
            <div className="p-2 md:p-3">
              <div className="flex items-center gap-2">
                {/* Input field */}
                <div className="flex-grow relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Sparkles className="w-5 h-5 text-gray-300" />
                  </div>
                  <input
                    type="text"
                    disabled
                    placeholder={
                      isAuthenticated
                        ? `Hi ${user?.firstName ?? 'there'}, your AI assistant is coming soon...`
                        : 'AI-powered search — coming soon...'
                    }
                    className="w-full py-3 pl-12 pr-4 outline-none text-gray-400 rounded-lg bg-gray-50 cursor-not-allowed select-none"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-500 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                      {" "}Coming Soon
                    </span>
                  </div>
                </div>
                {/* Disabled submit button */}
                <button
                  type="button"
                  disabled
                  className="ml-1 p-3 rounded-lg bg-gray-100 cursor-not-allowed text-gray-300 flex items-center justify-center"
                >
                  <Lock className="w-5 h-5" />
                </button>
              </div>
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
          <button
            type="button"
            onClick={handleOnboardingCta}
            className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl text-center flex items-center justify-center border-2 border-gray-200"
          >
            <span>Start Your Onboarding Journey</span>{' '}
            <ArrowRight
              size={18}
              className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </StaggeredFadeIn>
      </div>
    </div>
  );
};

export default HeroSection;
