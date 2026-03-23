import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "./components/Header";

import { MarketplaceRouter } from "./pages/marketplace/MarketplaceRouter";
import { CommunitiesRouter } from "./communities/CommunitiesRouter";
import { App } from './App';

import MarketplaceDetailsPage from "./pages/marketplace/MarketplaceDetailsPage";
import LmsCourseDetailPage from "./pages/lms/LmsCourseDetailPage";
import LmsCourseReviewsPage from "./pages/lms/LmsCourseReviewsPage";

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
import OnboardingLanding from "./pages/OnboardingLanding";
import { OnboardingJourney } from "./pages/OnboardingJourney";
import ComingSoonPage from "./pages/ComingSoonPage";
import GrowthSectorsComingSoon from "./pages/GrowthSectorsComingSoon";
import SixXDProductsLanding from "./pages/6XDProductsLanding";
import NotFound from "./pages/NotFound";
import AdminGuidesList from "./pages/admin/guides/AdminGuidesList";
import GuideEditor from "./pages/admin/guides/GuideEditor";
const GHCInspectorPage = React.lazy(() => import("./pages/admin/ghc-inspector/GHCInspectorPage"));
import EventsPage from "./pages/events/EventsPage";
import { DWSChatProvider } from "./components/DWSChatProvider";
import ThankYou from "./pages/ThankYou";
import UnitProfilePage from "./pages/UnitProfilePage";
import WorkPositionProfilePage from "./pages/WorkPositionProfilePage";
import RoleProfilePage from "./pages/RoleProfilePage";
import WomenEntrepreneursPage from "./pages/WomenEntrepreneursPage";
import GHCLanding from "./pages/GHCLanding";
import SixXDLanding from "./pages/6XDLanding";

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DWSChatProvider>
            <Routes>
            <Route path="/discover-dq" element={<ComingSoonPage />} />
            <Route path="/coming-soon" element={<ComingSoonPage />} />
            <Route path="/growth-sectors-coming-soon" element={<GrowthSectorsComingSoon />} />
            <Route path="/products" element={<SixXDProductsLanding />} />
            <Route path="/dq-products" element={<SixXDProductsLanding />} />
            <Route path="/knowledge-center/products" element={<SixXDProductsLanding />} />
            {/* Strategy pages */}
            <Route path="/ghc" element={<GHCLanding />} />
            <Route path="/6xd" element={<SixXDLanding />} />
            <Route path="/6xd-products" element={<SixXDProductsLanding />} />
            {/* LMS */}
            <Route path="/courses/:itemId" element={<LmsCourseDetailPage />} />
            <Route path="/lms" element={<LmsCourses />} />
            <Route path="/lms/:slug/reviews" element={<LmsCourseReviewsPage />} />
            <Route path="/lms/:slug" element={<LmsCourseDetailPageWrapper />} />
            {/* Onboarding - specific routes before wildcard */}
            <Route path="/onboarding/welcome" element={<OnboardingLanding />} />
            <Route path="/onboarding/journey" element={<OnboardingJourney />} />
            <Route path="/onboarding/start" element={<div>HR-style form lives here</div>} />
            <Route path="/onboarding/profile" element={<div className="p-10 text-center text-lg font-semibold text-[#030F35]">Profile setup experience will be available shortly.</div>} />
            <Route path="/onboarding/tools" element={<div className="p-10 text-center text-lg font-semibold text-[#030F35]">Tool exploration hub is on the way.</div>} />
            <Route path="/onboarding/first-task" element={<div className="p-10 text-center text-lg font-semibold text-[#030F35]">Guided first task templates launch soon.</div>} />
            <Route path="/onboarding/:itemId/details" element={<MarketplaceDetailsPage marketplaceType="onboarding" />} />
            <Route path="/onboarding/:itemId" element={<MarketplaceDetailsPage marketplaceType="onboarding" />} />
            {/* Marketplace */}
            <Route path="/marketplace/*" element={<MarketplaceRouter />} />
            <Route path="/guides" element={<Navigate to="/marketplace/guides" replace />} />
            <Route path="/knowledge-hub" element={<Navigate to="/marketplace/guides" replace />} />
            {/* Admin */}
            <Route path="/admin/guides" element={<AdminGuidesList />} />
            <Route path="/admin/guides/new" element={<GuideEditor />} />
            <Route path="/admin/guides/:id" element={<GuideEditor />} />
            <Route path="/admin/ghc-inspector" element={<React.Suspense fallback={<div className="p-6 text-center">Loading...</div>}><GHCInspectorPage /></React.Suspense>} />
            {/* Dashboard */}
            <Route path="/dashboard/*" element={<DashboardRouter />} />
            {/* Other pages */}
            <Route path="/asset-library" element={<AssetLibraryPage />} />
            <Route path="/blueprints" element={<BlueprintsPage />} />
            <Route path="/blueprints/:projectId" element={<BlueprintsPage />} />
            <Route path="/blueprints/:projectId/:folderId" element={<BlueprintsPage />} />
            <Route path="/play/dq-agile-kpis" element={<DQAgileKPIsPage />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/%20marketplace/news" element={<Navigate to="/marketplace/news" replace />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/communities/*" element={<CommunitiesRouter />} />
            <Route path="/work-directory/units/:slug" element={<UnitProfilePage />} />
            <Route path="/work-directory/positions/:slug" element={<WorkPositionProfilePage />} />
            <Route path="/roles/:slug" element={<RoleProfilePage />} />
            <Route path="/women-entrepreneurs" element={<WomenEntrepreneursPage />} />
            <Route path="/404" element={<NotFound />} />
            {/* App catch-all - must be last */}
            <Route path="/*" element={<App />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </DWSChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
