import React from "react";
import HeroSection from "./HeroSection";
import GrowthAreasSection from "./GrowthAreasSection";
import DirectorySection from "./DirectorySection";

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "72px",
  background: "#f8f9fb",
};

const DiscoverAbuDhabiPage: React.FC = () => {
  return (
    <div style={containerStyle}>
      <HeroSection />
      <GrowthAreasSection />
      <DirectorySection />
    </div>
  );
};

export default DiscoverAbuDhabiPage;
