import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const VisionMission: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-50 py-16 md:py-24" id="vision-mission" aria-labelledby="vm-heading">
      <div className="dws-container max-w-[1200px] mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="vm-heading"
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.04em] text-[#030F35] mb-3"
            style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
          >
            Vision &amp; Mission
          </h2>
          <p
            className="text-base md:text-lg max-w-[780px] mx-auto leading-relaxed clamp-2"
            style={{ color: 'var(--dws-text-dim)' }}
          >
            The foundation that drives every associate's purpose, growth, and contribution to the DQ ecosystem.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Vision Card */}
          <div className="dws-card bg-white flex flex-col h-full p-8 md:p-10" style={{ border: '1px solid var(--dws-line)' }}>
            <h3
              className="font-serif text-2xl md:text-3xl font-bold tracking-[0.03em] text-[#030F35] mb-4 md:mb-6"
              style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif', letterSpacing: '0.5px' }}
            >
              DQ Vision – Perfecting Life's Transactions
            </h3>
            
            <div className="flex-1 mb-6">
              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--dws-text)' }}>
                We empower associates to turn innovation into impact through seamless, dependable workflows that make collaboration effortless and progress meaningful.
              </p>
            </div>

            <div className="mt-auto">
              <button
                onClick={() => navigate('/strategy')}
                className="dws-btn-primary inline-flex items-center gap-2"
                aria-label="Explore Strategy Center to learn more about DQ Vision"
              >
                Explore Strategy Center
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Mission Card */}
          <div className="dws-card bg-white flex flex-col h-full p-8 md:p-10" style={{ border: '1px solid var(--dws-line)' }}>
            <h3
              className="font-serif text-2xl md:text-3xl font-bold tracking-[0.03em] text-[#030F35] mb-4 md:mb-6"
              style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif', letterSpacing: '0.5px' }}
            >
              DQ Mission – Building a Smarter, Connected Future
            </h3>
            
            <div className="flex-1 mb-6">
              <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--dws-text)' }}>
                We connect people, processes, and platforms to enable smarter work—helping every Qatalyst learn faster, collaborate better, and lead with purpose.
              </p>
            </div>

            <div className="mt-auto">
              <button
                onClick={() => navigate('/mission')}
                className="dws-btn-primary inline-flex items-center gap-2"
                aria-label="View Mission Brief to understand DQ Mission"
              >
                View Mission Brief
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
