import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import SignInPage from "./pages/SignInPage";
import CreateAccountPage from "./pages/CreateAccountPage";
import LeadFormPopup from "./components/LeadFormPopup";

export function App() {
  return (
    <>
      <LeadFormPopup />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<CreateAccountPage />} />
        <Route
          path="/onboarding/start"
          element={<div>HR-style form lives here</div>}
        />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </>
  );
}
