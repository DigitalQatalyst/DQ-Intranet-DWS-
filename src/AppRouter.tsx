import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MarketplaceRouter } from "./pages/marketplace/MarketplaceRouter";
import { App } from './App';
import Communities from "./communities/pages/Communities";
import Home from "./communities/pages/Home";
import CommunityFeed from "./communities/pages/CommunityFeed";
import Community from "./communities/pages/Community";
import CommunityMembers from "./communities/pages/CommunityMembers";
import CommunitySettings from "./communities/pages/CommunitySettings";
import CommunityAnalytics from "./communities/pages/CommunityAnalytics";
import ModerationDashboard from "./communities/pages/ModerationDashboard";
import MessagingDashboard from "./communities/pages/MessagingDashboard";
import ActivityCenter from "./communities/pages/ActivityCenter";
import CreatePost from "./communities/pages/CreatePost";
import PostDetail from "./communities/pages/PostDetail";
import ProfileDashboard from "./communities/pages/ProfileDashboard";
import { AuthProvider as CommunitiesAuthProvider } from "./communities/contexts/AuthProvider";
import { CommunitiesRouter } from "./communities/CommunitiesRouter";

import MarketplaceDetailsPage from "./pages/marketplace/MarketplaceDetailsPage";
import LmsCourseDetailPage from "./pages/lms/LmsCourseDetailPage";
import LmsCourseReviewsPage from "./pages/lms/LmsCourseReviewsPage";
import LmsLessonPage from "./pages/lms/LmsLessonPage";
import LmsCourseAssessmentPage from "./pages/lms/LmsCourseAssessmentPage";
import MyLearningDashboard from "./pages/lms/MyLearningDashboard";

// Wrapper component to force remount on slug change
const LmsCourseDetailPageWrapper = () => {
  const { slug } = useParams<{ slug: string }>();
  return <LmsCourseDetailPage key={slug} />;
};
import LmsCourses from "./pages/LmsCourses";
import AssetLibraryPage from "./pages/assetLibrary";
import BlueprintsPage from "./pages/blueprints";
import DQAgileKPIsPage from "./pages/play/DQAgileKPIsPage";
import DashboardRouter from "./pages/dashboard/DashboardRouter";
import DiscoverDQ from "./pages/DiscoverDQ";
import ComingSoonPage from "./pages/ComingSoonPage";
import DiscoverDQComingSoon from "./pages/DiscoverDQComingSoon";
import GrowthSectorsComingSoon from "./pages/GrowthSectorsComingSoon";
import NotFound from "./pages/NotFound";
import OnboardingLanding from "./pages/OnboardingLanding";
import { OnboardingJourney } from "./pages/OnboardingJourney";
import GHCLanding from "./pages/GHCLanding";
import SixXDLanding from "./pages/6XDLanding";
import SixXDProductsLanding from "./pages/6XDProductsLanding";
import DigitalAcceleratorsLanding from "./pages/DigitalAcceleratorsLanding";
import AdminGuidesList from "./pages/admin/guides/AdminGuidesList";
import GuideEditor from "./pages/admin/guides/GuideEditor";
const GHCInspectorPage = React.lazy(() => import("./pages/admin/ghc-inspector/GHCInspectorPage"));
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EventsPage from "./pages/events/EventsPage";
import ChatBot from "./bot/ChatBot";
import ThankYou from "./pages/ThankYou";
import UnitProfilePage from "./pages/UnitProfilePage";
import WorkPositionProfilePage from "./pages/WorkPositionProfilePage";
import RoleProfilePage from "./pages/RoleProfilePage";
import WomenEntrepreneursPage from "./pages/WomenEntrepreneursPage";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function AppRouter() {

  const client = new ApolloClient({
    link: new HttpLink({
      uri: "https://9609a7336af8.ngrok-free.app/services-api",
    }), // <-- Use HttpLink
    cache: new InMemoryCache(),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <CommunitiesAuthProvider>
            <ChatBot />
            <ProtectedRoute>
              <Routes>
                <Route path="/discover-dq" element={<DiscoverDQComingSoon />} />
                <Route path="/coming-soon" element={<ComingSoonPage />} />
                <Route path="/growth-sectors-coming-soon" element={<GrowthSectorsComingSoon />} />
                <Route path="/onboarding/welcome" element={<OnboardingLanding />} />
                <Route path="/onboarding/journey" element={<OnboardingJourney />} />
                <Route path="/ghc" element={<GHCLanding />} />
                <Route path="/6xd" element={<SixXDLanding />} />
                <Route path="/6xd-products" element={<SixXDProductsLanding />} />
                <Route path="/knowledge-center/products/digital-accelerators" element={<DigitalAcceleratorsLanding />} />
                <Route path="/marketplace/*" element={<MarketplaceRouter />} />
                <Route path="/*" element={<App />} />
                <Route path="/courses/:itemId" element={<LmsCourseDetailPage />} />
                <Route path="/lms" element={<LmsCourses />} />
                <Route path="/lms/my-learning" element={<MyLearningDashboard />} />
                <Route path="/lms/:courseSlug/lesson/:lessonId" element={<LmsLessonPage />} />
                <Route path="/lms/:slug/reviews" element={<LmsCourseReviewsPage />} />
                <Route path="/lms/:slug/assessment" element={<LmsCourseAssessmentPage />} />
                <Route
                  path="/lms/:slug"
                  element={<LmsCourseDetailPageWrapper />}
                />
                <Route
                  path="/onboarding/:itemId"
                  element={
                    <MarketplaceDetailsPage
                      marketplaceType="onboarding"
                    />
                  }
                />
                {/* Dashboard */}
                <Route
                  path="/dashboard/*"
                  element={<DashboardRouter />}
                />
                {/* Admin Section */}
                <Route path="/admin/guides" element={<AdminGuidesList />} />
                <Route path="/admin/guides/new" element={<GuideEditor />} />
                <Route path="/admin/guides/:id" element={<GuideEditor />} />
                <Route path="/admin/ghc-inspector" element={<React.Suspense fallback={<div>Loading...</div>}><GHCInspectorPage /></React.Suspense>} />

                {/* Onboarding & Directory */}
                <Route path="/onboarding/:itemId/details" element={<MarketplaceDetailsPage marketplaceType="onboarding" />} />
                <Route path="/work-directory/units/:slug" element={<UnitProfilePage />} />
                <Route path="/work-directory/positions/:slug" element={<WorkPositionProfilePage />} />
                <Route path="/roles/:slug" element={<RoleProfilePage />} />

                {/* Messaging & Communities */}
                {/* Note: I've used the CommunitiesRouter here. 
    Ensure the routes from 'develop' (Feed, Analytics, etc.) 
    are moved into the CommunitiesRouter component. 
*/}
                <Route path="/communities/*" element={<CommunitiesRouter />} />
                <Route path="/messages" element={<MessagingDashboard />} />

                {/* Utilities */}
                <Route path="/asset-library" element={<AssetLibraryPage />} />
                <Route path="/thank-you" element={<ThankYou />} />
                <Route path="/404" element={<NotFound />} />

                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </ProtectedRoute>
          </CommunitiesAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
    </QueryClientProvider>
  );
}
