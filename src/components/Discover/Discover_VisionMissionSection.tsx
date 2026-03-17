import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DiscoverSectionTitle } from './DiscoverSectionTitle';

export const Discover_VisionMissionSection: React.FC = () => {
  const navigate = useNavigate();

  const handleExploreKnowledgeCenter = () => {
    navigate('/marketplace/guides');
  };

  return (
    <section className="bg-gray-50 py-16 md:py-24" id="vision-mission" aria-labelledby="vm-heading">
      <div className="mx-auto px-6 md:px-8" style={{ maxWidth: '1120px' }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '28px' }}>
          <DiscoverSectionTitle id="vm-heading">
            Vision &amp; Mission
          </DiscoverSectionTitle>
          <p
            className="text-base md:text-lg mx-auto leading-relaxed"
            style={{ 
              color: 'var(--dws-text-dim)',
              maxWidth: '660px',
              marginTop: '12px',
            }}
          >
            Defines why DQ exists and how we design, build, and deliver meaningful outcomes together.
          </p>
        </div>

        {/* Cards Container - Centered with explicit gap */}
        <div 
          className="flex flex-col md:flex-row items-stretch justify-center"
          style={{ gap: '32px' }}
        >
          {/* Vision Card */}
          <div
            className="vision-mission-card bg-white flex flex-col"
            style={{
              width: '500px',
              maxWidth: '500px',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <h3
              className="vision-mission-title"
              style={{
                fontSize: '22px',
                fontWeight: 600,
                lineHeight: 1.35,
                maxWidth: '90%',
                color: '#030F35',
                margin: 0,
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              }}
            >
              DQ Vision – Perfecting Life's Transactions
            </h3>

            <p
              className="vision-mission-body"
              style={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: '#4B5563',
                maxWidth: '95%',
                marginTop: '16px',
                marginBottom: 0,
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              }}
            >
              Life moves through countless interactions between people and systems.
              <br />
              The DQ Vision exists to reduce friction in those moments.
              <br />
              Designing clarity, trust, and momentum where it matters most.
            </p>

            <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
              <a
                href="https://digital-qatalyst.shorthandstories.com/5d87ac25-6eb5-439e-a861-845787aa8e59/index.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#131E42',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#0F1633';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#131E42';
                }}
              >
                Read the DQ Vision Story →
              </a>
            </div>
          </div>

          {/* Mission Card */}
          <div
            className="vision-mission-card bg-white flex flex-col"
            style={{
              width: '500px',
              maxWidth: '500px',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <h3
              className="vision-mission-title"
              style={{
                fontSize: '22px',
                fontWeight: 600,
                lineHeight: 1.35,
                maxWidth: '90%',
                color: '#030F35',
                margin: 0,
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              }}
            >
              DQ Mission – Building a Smarter, Connected Future
            </h3>

            <p
              className="vision-mission-body"
              style={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: '#4B5563',
                maxWidth: '95%',
                marginTop: '16px',
                marginBottom: 0,
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              }}
            >
              Our mission is to connect people, processes, and platforms.
              <br />
              So teams can learn faster, collaborate better, and adapt with confidence.
              <br />
              Turning intent into outcomes through structured, scalable systems.
            </p>

            <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleExploreKnowledgeCenter();
                }}
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#131E42',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#0F1633';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#131E42';
                }}
              >
                Explore the Knowledge Center →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1023px) {
          .vision-mission-card {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
        
        @media (max-width: 767px) {
          .vision-mission-card {
            padding: 24px !important;
          }
          
          .vision-mission-title {
            font-size: 20px !important;
          }
          
          .vision-mission-body {
            font-size: 14px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Discover_VisionMissionSection;
