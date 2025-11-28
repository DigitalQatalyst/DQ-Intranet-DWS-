import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import SignInPage from "./pages/SignInPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import LeadFormPopup from "./components/LeadFormPopup";
import WorkspaceLanding from "./pages/WorkspaceLanding";
import OnboardingMarketplacePage from "./pages/OnboardingMarketplace";
import ComingSoonCountdownPage from "./components/common/ComingSoonCountdownPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ServiceComingSoonPage from "./pages/ServiceComingSoonPage";
import InsightComingSoonPage from "./pages/InsightComingSoonPage";
import ResourceComingSoonPage from "./pages/ResourceComingSoonPage";
import EventComingSoonPage from "./pages/EventComingSoonPage";
import FooterLinkComingSoonPage from "./pages/FooterLinkComingSoonPage";

export function App() {
  return (
    <>
      <LeadFormPopup />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage redirectTo="/onboarding/start" />} />
        <Route path="/signup" element={<CreateAccountPage />} />
        <Route path="/onboarding" element={<OnboardingMarketplacePage />} />
        <Route path="/onboarding-flows" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding/start" element={<div>HR-style form lives here</div>} />
        <Route
          path="/onboarding/welcome"
          element={
            <div className="p-10 text-center text-lg font-semibold text-[#030F35]">
              Welcome to DQ onboarding — dedicated content is coming soon.
            </div>
          }
        />
        <Route
          path="/onboarding/profile"
          element={
            <div className="p-10 text-center text-lg font-semibold text-[#030F35]">
              Profile setup experience will be available shortly.
            </div>
          }
        />
        <Route
          path="/onboarding/tools"
          element={
            <div className="p-10 text-center text-lg font-semibold text-[#030F35]">
              Tool exploration hub is on the way.
            </div>
          }
        />
        <Route
          path="/onboarding/first-task"
          element={
            <div className="p-10 text-center text-lg font-semibold text-[#030F35]">
              Guided first task templates launch soon.
            </div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <div className="p-10 text-center text-lg font-semibold text-[#030F35]">
              DQ workspace dashboard launches soon.
            </div>
          }
        />
        <Route path="/workspace" element={<WorkspaceLanding />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/service-coming-soon" element={<ServiceComingSoonPage />} />
        <Route path="/insight-coming-soon" element={<InsightComingSoonPage />} />
        <Route path="/resource-coming-soon" element={<ResourceComingSoonPage />} />
        <Route path="/event-coming-soon" element={<EventComingSoonPage />} />
        <Route path="/workspace-link-coming-soon" element={<FooterLinkComingSoonPage />} />
        <Route
          path="/it-systems-support"
          element={<ComingSoonCountdownPage title="IT & Systems Support" />}
        />
        <Route
          path="/hr-finance-services"
          element={<ComingSoonCountdownPage title="HR & Finance Services" />}
        />
        <Route
          path="/facilities-logistics"
          element={<ComingSoonCountdownPage title="Facilities & Logistics" />}
        />
        <Route
          path="/associates-directory"
          element={<ComingSoonCountdownPage title="Associates Directory" />}
        />
        <Route
          path="/certifications-onboarding"
          element={<ComingSoonCountdownPage title="Certifications & Onboarding" />}
        />
        <Route
          path="/training-materials"
          element={<ComingSoonCountdownPage title="Training Materials" />}
        />
        <Route
          path="/news-announcements"
          element={<ComingSoonCountdownPage title="News & Announcements" />}
        />
        <Route
          path="/asset-library"
          element={<ComingSoonCountdownPage title="Asset Library" />}
        />
        <Route
          path="/scrum-master-space"
          element={<ComingSoonCountdownPage title="Scrum Master Space" />}
        />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}

