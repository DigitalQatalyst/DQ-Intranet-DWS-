import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import HeroSection from './HeroSection';
import TodaysInspirationSection from './TodaysInspirationSection';
import { FeaturedNationalProgram as WelcomeAndWhatsNewSection } from './WelcomeAndWhatsNewSection';
import ExperienceFutureOfWorkSection from './ExperienceFutureOfWorkSection';
import GrowthJourneySection from './GrowthJourneySection';
import ToolsResourcesServicesSection from './ToolsResourcesServicesSection';
import LatestDQDevelopmentsSection from './LatestDQDevelopmentsSection';
import TransformationBlueprintSection from './TransformationBlueprintSection';

const HomePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Reset loading state when navigating to home page
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-bold">
            Loading Digital Workspace
          </h2>
          <p className="text-blue-200 mt-2">
            Your trusted hub for tools, requests, learning, and collaboration at
            DQ.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <main className="flex-grow">
        <HeroSection />
        <TodaysInspirationSection />
        <WelcomeAndWhatsNewSection />
        <ExperienceFutureOfWorkSection />
        <GrowthJourneySection />
        <ToolsResourcesServicesSection />
        <LatestDQDevelopmentsSection />
        <TransformationBlueprintSection />
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default HomePage;

