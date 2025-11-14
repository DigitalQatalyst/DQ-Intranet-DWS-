import React, { useEffect, useMemo } from "react";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { BecomeLeadHero } from "../components/BecomeLeadHero";
import { LeadershipMeaningSection } from "../components/LeadershipMeaningSection";
import { LeadershipGrowthJourney } from "../components/LeadershipGrowthJourney";
import { LeaderPersonasSection } from "../components/LeaderPersonasSection";
import { LeadershipQuizBanner } from "../components/LeadershipQuizBanner";
import { LeadershipStoriesSection } from "../components/LeadershipStoriesSection";
import { ProgramsThatBuildLeadersSection } from "../components/ProgramsThatBuildLeadersSection";
import { LeadToolsSection } from "../components/leadspace/LeadToolsSection";
import styles from "./DiscoverDQ.module.css";

const DiscoverLeadPage: React.FC = () => {
  // Set document title
  useEffect(() => {
    document.title = "Become a Lead | DQ Digital Workspace";
  }, []);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <>
      <Header />
      <main
        id="app-content"
        className={`${styles.dwsDiscover} ${prefersReducedMotion ? styles.reducedMotion : ""} relative z-0 bg-transparent`}
      >
        {/* Hero Section */}
        <div id="hero" className="scroll-mt-[72px]">
          <BecomeLeadHero />
        </div>

        {/* What Leadership Means at DQ Section */}
        <LeadershipMeaningSection />

        {/* Leadership Growth Journey Section */}
        <LeadershipGrowthJourney />

        {/* Who Are You as a Leader? Section */}
        <LeaderPersonasSection />

        {/* Leadership Quiz Banner Section */}
        <LeadershipQuizBanner />

        {/* Voices That Lead Section */}
        <LeadershipStoriesSection />

        {/* Programs That Build Leaders Section */}
        <ProgramsThatBuildLeadersSection />

        {/* Lead Tools & Opportunities Section */}
        <LeadToolsSection />
      </main>
      <Footer />
    </>
  );
};

export default DiscoverLeadPage;
