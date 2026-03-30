import React from "react";
import { useLocation } from "react-router-dom";
import ComingSoonCountdownPage from "../components/common/ComingSoonCountdownPage";

const FooterLinkComingSoonPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const title = params.get("title") || "DQ Digital Workspace";

  return (
    <ComingSoonCountdownPage
      title={title}
      description="This section of the DQ Digital Workspace is being set up and will be available in the next release."
    />
  );
};

export default FooterLinkComingSoonPage;
