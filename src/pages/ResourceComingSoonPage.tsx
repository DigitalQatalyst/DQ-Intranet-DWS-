import React from "react";
import { useLocation } from "react-router-dom";
import ComingSoonCountdownPage from "../components/common/ComingSoonCountdownPage";

const ResourceComingSoonPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const title = params.get("title") || "DQ Resource";

  return (
    <ComingSoonCountdownPage
      title={title}
      description="This DQ resource is being onboarded into the Digital Workspace library. It will be available to download soon."
    />
  );
};

export default ResourceComingSoonPage;
