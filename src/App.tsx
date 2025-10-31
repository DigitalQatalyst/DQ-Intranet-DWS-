import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import SignInPage from "./pages/SignInPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import LeadFormPopup from "./components/LeadFormPopup";
import WorkspaceLanding from "./pages/WorkspaceLanding";
import OnboardingMarketplacePage from "./pages/OnboardingMarketplace";

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
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}

