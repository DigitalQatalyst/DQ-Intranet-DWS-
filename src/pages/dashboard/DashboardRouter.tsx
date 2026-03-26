import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { DocumentsPage } from "./documents";
import { Overview } from "./overview";
import { ServiceRequestsPage } from "./serviceRequests";
import { isOnboardingCompleted } from "../../services/DataverseService";
import { OnboardingForm } from "./onboarding/OnboardingForm";
import ProfilePage from "./profile";
import SupportPage from "./support";
import SettingsPage from "./settings";
import { ChatInterface } from "../../components/Chat/ChatInterface";
import ComingSoonPage from "../ComingSoonPage";
import LearningPage from "./LearningPage";
import { WorkspacePage } from "./workspace";

// Form imports
import BookConsultationForEntrepreneurship from "../forms/BookConsultationForEntrepreneurship";
import CancelLoan from "../forms/CancelLoan";
import DisburseApprovedLoan from "../forms/DisburseApprovedLoan";
import FacilitateCommunication from "../forms/FacilitateCommunication";
import IssueSupportLetter from "../forms/IssueSupportLetter";
import NeedsAssessmentForm from "../forms/NeedsAssessmentForm";
import ReallocationOfLoanDisbursement from "../forms/ReallocationOfLoanDisbursement";
import RequestForFunding from "../forms/RequestForFunding";
import RequestForMembership from "../forms/RequestForMembership";
import RequestToAmendExistingLoanDetails from "../forms/RequestToAmendExistingLoanDetails";
import TrainingInEntrepreneurship from "../forms/TrainingInEntrepreneurship";
import CollateralUserGuide from "../forms/CollateralUserGuide";

// Main Dashboard Router Component
const DashboardRouter = () => {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const completed = await isOnboardingCompleted();
        setOnboardingComplete(!!completed);
        if (!completed) {
          if (!location.pathname.includes("/dashboard/onboarding")) {
            navigate("/dashboard/onboarding", { replace: true });
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        // no-op
      }
    };
    checkOnboarding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If onboarding is complete and user is on onboarding route, send to overview
  useEffect(() => {
    if (
      onboardingComplete &&
      location.pathname.includes("/dashboard/onboarding")
    ) {
      navigate("/dashboard/learning", { replace: true });
    }
  }, [onboardingComplete, location.pathname, navigate]);

  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    navigate("/dashboard/learning", { replace: true });
  };

  // useEffect(() => {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //         setIsLoggedIn(true);
  //     } else {
  //         navigate('/', { replace: true });
  //     }
  // }, [navigate]);

  return (
    <DashboardLayout
      onboardingComplete={onboardingComplete}
      setOnboardingComplete={setOnboardingComplete}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
    >
      <Routes>
        <Route
          index
          element={
            <Navigate
              to={onboardingComplete ? "learning" : "onboarding"}
              replace
            />
          }
        />
        <Route
          path="onboarding"
          element={
            <OnboardingForm
              onComplete={handleOnboardingComplete}
              isRevisit={onboardingComplete}
            />
          }
        />
        <Route path="overview" element={<Overview />} />
        <Route
          path="documents"
          element={
            <DocumentsPage
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
        <Route
          path="requests"
          element={
            <ServiceRequestsPage
              setIsOpen={setIsOpen}
              isLoggedIn={isLoggedIn}
            />
          }
        />
        <Route
          path="reporting"
          element={<Navigate to="reporting-obligations" replace />}
        />
        <Route path="reporting-obligations" element={<Navigate to="/dashboard/coming-soon?label=Reporting%20Obligations" replace />} />
        <Route
          path="reporting-obligations/obligations"
          element={<Navigate to="/dashboard/coming-soon?label=Reporting%20Obligations" replace />}
        />
        <Route
          path="reporting-obligations/submitted"
          element={<Navigate to="/dashboard/coming-soon?label=Submitted%20Reports" replace />}
        />
        <Route
          path="reporting-obligations/received"
          element={<Navigate to="/dashboard/coming-soon?label=Received%20Reports" replace />}
        />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="chat-support" element={<ChatInterface />} />

        {/* New Sidebar Routes */}
        <Route path="learning" element={<LearningPage />} />
        <Route path="workspace" element={<WorkspacePage />} />
        <Route path="approvals" element={<Navigate to="/dashboard/coming-soon?label=Approvals" replace />} />
        <Route path="compliance-tasks" element={<Navigate to="/dashboard/coming-soon?label=Compliance%20Tasks" replace />} />
        <Route path="notifications" element={<Navigate to="/dashboard/coming-soon?label=Notifications" replace />} />
        <Route path="messages" element={<Navigate to="/dashboard/coming-soon?label=Messages" replace />} />
        <Route path="performance/overview" element={<Navigate to="/dashboard/coming-soon?label=Performance%20Overview" replace />} />
        <Route path="performance/tasks" element={<Navigate to="/dashboard/coming-soon?label=Task%20Completion" replace />} />
        <Route path="performance/turnaround" element={<Navigate to="/dashboard/coming-soon?label=Request%20Turnaround" replace />} />
        <Route path="performance/timeline" element={<Navigate to="/dashboard/coming-soon?label=Activity%20Timeline" replace />} />
        <Route path="coming-soon" element={<ComingSoonPage />} />

        {/* Forms Routes */}
        <Route
          path="forms/book-consultation-for-entrepreneurship"
          element={<BookConsultationForEntrepreneurship />}
        />
        <Route path="forms/cancel-loan" element={<CancelLoan />} />

        <Route
          path="forms/collateral-user-guide"
          element={<CollateralUserGuide />}
        />

        <Route
          path="forms/disburse-approved-loan"
          element={<DisburseApprovedLoan />}
        />
        <Route
          path="forms/facilitate-communication"
          element={<FacilitateCommunication />}
        />
        <Route
          path="forms/issue-support-letter"
          element={<IssueSupportLetter />}
        />
        <Route
          path="forms/needs-assessment-form"
          element={<NeedsAssessmentForm />}
        />
        <Route
          path="forms/reallocation-of-loan-disbursement"
          element={<ReallocationOfLoanDisbursement />}
        />
        <Route
          path="forms/request-for-funding"
          element={<RequestForFunding />}
        />
        <Route
          path="forms/request-for-membership"
          element={<RequestForMembership />}
        />
        <Route
          path="forms/request-to-amend-existing-loan-details"
          element={<RequestToAmendExistingLoanDetails />}
        />
        <Route
          path="forms/training-in-entrepreneurship"
          element={<TrainingInEntrepreneurship />}
        />



        <Route path="*" element={<Navigate to={onboardingComplete ? "learning" : "onboarding"} replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRouter;
