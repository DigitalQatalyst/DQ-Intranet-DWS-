import React from "react";
import { useLocation } from "react-router-dom";
import ComingSoonCountdownPage from "../components/common/ComingSoonCountdownPage";

const ServiceComingSoonPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const service = params.get("service") || "Service";

  return (
    <ComingSoonCountdownPage
      title={service}
      description="This service is being onboarded into the DQ Digital Workspace. Please check back soon or explore other available services."
    />
  );
};

export default ServiceComingSoonPage;
