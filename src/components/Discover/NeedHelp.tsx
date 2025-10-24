import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NeedHelp: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section 
      className="py-16 md:py-20" 
      style={{ background: 'var(--dws-grad-hero)' }}
      aria-labelledby="help-heading"
    >
      <div className="dws-container max-w-[800px] mx-auto px-6 md:px-8 text-center">
        <h2
          id="help-heading"
          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          style={{ color: 'var(--dws-white)' }}
        >
          Need Help?
        </h2>
        <p
          className="text-base md:text-lg leading-relaxed mb-8 max-w-[600px] mx-auto"
          style={{ color: 'rgba(255, 255, 255, 0.9)' }}
        >
          Get quick support or connect with our workspace team to keep every initiative moving.
        </p>
        <button
          onClick={() => navigate('/support')}
          className="dws-btn-primary inline-flex items-center gap-2 dws-focus-ring"
          style={{
            background: 'var(--dws-white)',
            color: 'var(--dws-navy-900)',
          }}
          aria-label="Get Support"
        >
          Get Support
        </button>
      </div>
    </section>
  );
};

export default NeedHelp;

