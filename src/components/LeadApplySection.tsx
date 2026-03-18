import { useNavigate } from "react-router-dom";
import { ShoppingBag, BookOpen, ArrowRight } from "lucide-react";
import { FadeInUpOnScroll } from "./AnimationUtils";

const LeadApplySection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-28 md:py-36" style={{ background: 'linear-gradient(135deg, #0E1446 0%, #6B3E5C 55%, #FB5535 100%)' }}>
      {/* Oversized blurred blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[rgba(251,85,53,0.25)] blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-[rgba(0,33,128,0.2)] blur-[140px] rounded-full"></div>
      
      {/* Subtle dotted radial overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      ></div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-8 max-w-[1280px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-7 items-center">
          {/* Left column - Text block */}
          <div>
            <FadeInUpOnScroll>
              {/* Small pill badge */}
              {/* Heading */}
              <h2 className="text-[3rem] md:text-[3.25rem] font-bold leading-[1.1] mb-4">
                <span className="text-white block">Transformation Becomes Blueprint.</span>
                <span 
                  className="block bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #FB5535 0%, rgba(251,85,53,0.6) 100%)'
                  }}
                >
                  Blueprint Becomes Delivery.
                </span>
              </h2>

              {/* Thin accent bar */}
              <div 
                className="h-[3px] w-[12px] mb-6 animate-fade-in"
                style={{ 
                  backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.5), rgba(255,255,255,0.1))',
                  animationDelay: '0.2s' 
                }}
              ></div>

              {/* Supporting sentence */}
              <p className="text-white/55 text-base md:text-lg leading-relaxed">
                Explore 6xD to see how DQ products turn strategy into action.
              </p>
            </FadeInUpOnScroll>
          </div>

          {/* Right column - CTA stack */}
          <div className="flex flex-col gap-4 md:gap-[16px]">
            <FadeInUpOnScroll delay={0.1}>
              <button
                onClick={() => navigate('/6xd')}
                className="group w-full flex items-center justify-between px-5 md:px-6 py-5 md:py-[22px] bg-white/5 hover:bg-white/10 backdrop-blur-md border hover:border-[rgba(255,255,255,0.2)] rounded-[18px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={20} className="text-white" />
                  </div>
                  <span className="text-[15px] font-semibold text-white">
                    Explore Agile 6xD
                  </span>
                </div>
                <ArrowRight 
                  size={20} 
                  className="text-white transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" 
                />
              </button>
            </FadeInUpOnScroll>

            <FadeInUpOnScroll delay={0.2}>
              <button
                onClick={() => navigate('/6xd-products')}
                className="group w-full flex items-center justify-between px-5 md:px-6 py-5 md:py-[22px] bg-white/5 hover:bg-white/10 backdrop-blur-md border hover:border-[rgba(255,255,255,0.2)] rounded-[18px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <span className="text-[15px] font-semibold text-white">
                    Explore DQ Products
                  </span>
                </div>
                <ArrowRight 
                  size={20} 
                  className="text-white transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" 
                />
              </button>
            </FadeInUpOnScroll>
          </div>
        </div>
      </div>

      {/* Add keyframe for accent bar animation */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scaleX(0);
            transform-origin: left;
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default LeadApplySection;
