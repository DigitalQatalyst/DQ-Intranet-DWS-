import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import { MarketplaceRouter } from "./pages/marketplace/MarketplaceRouter";
import { CommunitiesRouter } from "./communities/CommunitiesRouter";
import { App } from './App';

import MarketplaceDetailsPage from "./pages/marketplace/MarketplaceDetailsPage";
import LmsCourseDetailPage from "./pages/lms/LmsCourseDetailPage";
import LmsCourseReviewsPage from "./pages/lms/LmsCourseReviewsPage";
import LmsCourseAssessmentPage from "./pages/lms/LmsCourseAssessmentPage";
import LmsLessonPage from "./pages/lms/LmsLessonPage";

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
            {/* Public routes — no auth required */}
            <Route path="/404" element={<NotFound />} />
            <Route path="/coming-soon" element={<ComingSoonPage />} />
            <Route path="/growth-sectors-coming-soon" element={<GrowthSectorsComingSoon />} />

            {/* All other routes require authentication */}
            <Route path="/discover-dq" element={<ProtectedRoute><ComingSoonPage /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><SixXDProductsLanding /></ProtectedRoute>} />
            <Route path="/dq-products" element={<ProtectedRoute><SixXDProductsLanding /></ProtectedRoute>} />
            <Route path="/knowledge-center/products" element={<ProtectedRoute><SixXDProductsLanding /></ProtectedRoute>} />
            {/* Strategy pages */}
            <Route path="/ghc" element={<ProtectedRoute><GHCLanding /></ProtectedRoute>} />
            <Route path="/6xd" element={<ProtectedRoute><SixXDLanding /></ProtectedRoute>} />
            <Route path="/6xd-products" element={<ProtectedRoute><SixXDProductsLanding /></ProtectedRoute>} />
            {/* LMS */}
            <Route path="/courses/:itemId" element={<ProtectedRoute><LmsCourseDetailPage /></ProtectedRoute>} />
            <Route path="/lms" element={<ProtectedRoute><LmsCourses /></ProtectedRoute>} />
            <Route path="/lms/:slug/reviews" element={<ProtectedRoute><LmsCourseReviewsPage /></ProtectedRoute>} />
            <Route path="/lms/:slug/assessment" element={<ProtectedRoute><LmsCourseAssessmentPage /></ProtectedRoute>} />
            <Route path="/lms/:courseSlug/lesson/:lessonId" element={<ProtectedRoute><LmsLessonPage /></ProtectedRoute>} />
            <Route path="/lms/:slug" element={<ProtectedRoute><LmsCourseDetailPageWrapper /></ProtectedRoute>} />
            {/* Onboarding */}
            <Route path="/onboarding/welcome" element={<ProtectedRoute><OnboardingLanding /></ProtectedRoute>} />
            <Route path="/onboarding/journey" element={<ProtectedRoute><OnboardingJourney /></ProtectedRoute>} />
            <Route path="/onboarding/start" element={<ProtectedRoute><div>HR-style form lives here</div></ProtectedRoute>} />
            <Route path="/onboarding/profile" element={<ProtectedRoute><div className="p-10 text-center text-lg font-semibold text-[#030F35]">Profile setup experience will be available shortly.</div></ProtectedRoute>} />
            <Route path="/onboarding/tools" element={<ProtectedRoute><div className="p-10 text-center text-lg font-semibold text-[#030F35]">Tool exploration hub is on the way.</div></ProtectedRoute>} />
            <Route path="/onboarding/first-task" element={<ProtectedRoute><div className="p-10 text-center text-lg font-semibold text-[#030F35]">Guided first task templates launch soon.</div></ProtectedRoute>} />
            <Route path="/onboarding/:itemId/details" element={<ProtectedRoute><MarketplaceDetailsPage marketplaceType="onboarding" /></ProtectedRoute>} />
            <Route path="/onboarding/:itemId" element={<ProtectedRoute><MarketplaceDetailsPage marketplaceType="onboarding" /></ProtectedRoute>} />
            {/* Marketplace */}
            <Route path="/marketplace/*" element={<ProtectedRoute><MarketplaceRouter /></ProtectedRoute>} />
            <Route path="/guides" element={<Navigate to="/marketplace/guides" replace />} />
            <Route path="/knowledge-hub" element={<Navigate to="/marketplace/guides" replace />} />
            {/* Admin */}
            <Route path="/admin/guides" element={<ProtectedRoute><AdminGuidesList /></ProtectedRoute>} />
            <Route path="/admin/guides/new" element={<ProtectedRoute><GuideEditor /></ProtectedRoute>} />
            <Route path="/admin/guides/:id" element={<ProtectedRoute><GuideEditor /></ProtectedRoute>} />
            <Route path="/admin/ghc-inspector" element={<ProtectedRoute><React.Suspense fallback={<div className="p-6 text-center">Loading...</div>}><GHCInspectorPage /></React.Suspense></ProtectedRoute>} />
            {/* Dashboard */}
            <Route path="/dashboard/*" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
            {/* Other pages */}
            <Route path="/asset-library" element={<ProtectedRoute><AssetLibraryPage /></ProtectedRoute>} />
            <Route path="/blueprints" element={<ProtectedRoute><BlueprintsPage /></ProtectedRoute>} />
            <Route path="/blueprints/:projectId" element={<ProtectedRoute><BlueprintsPage /></ProtectedRoute>} />
            <Route path="/blueprints/:projectId/:folderId" element={<ProtectedRoute><BlueprintsPage /></ProtectedRoute>} />
            <Route path="/play/dq-agile-kpis" element={<ProtectedRoute><DQAgileKPIsPage /></ProtectedRoute>} />
            <Route path="/thank-you" element={<ProtectedRoute><ThankYou /></ProtectedRoute>} />
            <Route path="/%20marketplace/news" element={<Navigate to="/marketplace/news" replace />} />
            <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
            <Route path="/communities/*" element={<ProtectedRoute><CommunitiesRouter /></ProtectedRoute>} />
            <Route path="/work-directory/units/:slug" element={<ProtectedRoute><UnitProfilePage /></ProtectedRoute>} />
            <Route path="/work-directory/positions/:slug" element={<ProtectedRoute><WorkPositionProfilePage /></ProtectedRoute>} />
            <Route path="/roles/:slug" element={<ProtectedRoute><RoleProfilePage /></ProtectedRoute>} />
            <Route path="/women-entrepreneurs" element={<ProtectedRoute><WomenEntrepreneursPage /></ProtectedRoute>} />
            {/* App catch-all - must be last */}
            <Route path="/*" element={<ProtectedRoute><App /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </DWSChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
