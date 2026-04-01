import React from 'react';
import { cn } from '@/lib/media-center-utils';

interface HeroProps {
  title: string;
  description: string;
  badge: string;
  metadata: Array<{ label: string; value: string }>;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ title, description, badge, metadata, className }) => {
  return (
    <section className={cn(
      'relative min-h-[320px] md:min-h-[400px] flex flex-col overflow-hidden',
      className
    )}>
      {/* Gradient Background - dark colors cover most of hero, white starts at very bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #192D6C 0%, #051139 55%, #051139 92%, #ffffff 100%)',
        }}
      />
      
      {/* Mesh Pattern Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(59_130_246_/_0.3),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(34_197_94_/_0.2),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(251_146_60_/_0.1),_transparent_50%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center px-6 sm:px-8 lg:px-12 py-4 md:py-6">
        <div className="w-full">
          {/* Glassmorphism Panel */}
          <div className="bg-black/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500 text-white">
                {badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              {title}
            </h1>

            {/* Description */}
            <p className="text-lg text-white/90 leading-relaxed mb-6">
              {description}
            </p>

            {/* Metadata Chips */}
            <div className="flex flex-wrap gap-3">
              {metadata.map((item, index) => (
                <div 
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-black/5 border border-white/10"
                >
                  <span className="text-xs font-medium text-white/70">{item.label}:</span>
                  <span className="text-xs text-white ml-1">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
