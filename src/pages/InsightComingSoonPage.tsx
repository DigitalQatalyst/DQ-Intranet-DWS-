import React from "react";
import { useLocation } from "react-router-dom";
import ComingSoonCountdownPage from "../components/common/ComingSoonCountdownPage";

const InsightComingSoonPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const title = params.get("title") || "DQ Insight";

  return (
    <ComingSoonCountdownPage
      title={title}
      description="This DQ Insight is being published into the Digital Workspace. Check back soon or explore other updates in Workspace Insights."
    />
  );
};

export default InsightComingSoonPage;
