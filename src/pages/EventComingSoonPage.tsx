import React from "react";
import { useLocation } from "react-router-dom";
import ComingSoonCountdownPage from "../components/common/ComingSoonCountdownPage";

const EventComingSoonPage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const title = params.get("title") || "DQ Event";

  return (
    <ComingSoonCountdownPage
      title={title}
      description="Registration for this DQ event is being set up in the Digital Workspace. Please check back closer to the event date."
    />
  );
};

export default EventComingSoonPage;
