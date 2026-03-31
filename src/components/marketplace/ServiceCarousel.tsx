import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  gradientFrom?: string;
  gradientTo?: string;
  isActive?: boolean;
};

export default function ServiceCarousel({
  services,
  renderCard,
}: {
  services: Service[];
  renderCard: (s: Service) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisibleCount(w < 640 ? 1 : w < 1024 ? 2 : 4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(services.length / visibleCount));

  const scrollTo = (index: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: "smooth" });
  };

  const handleNext = () => {
    const i = Math.min(activeIndex + 1, totalSlides - 1);
    setActiveIndex(i); scrollTo(i);
  };

  const handlePrev = () => {
    const i = Math.max(activeIndex - 1, 0);
    setActiveIndex(i); scrollTo(i);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      if (idx !== activeIndex) setActiveIndex(idx);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeIndex]);

  return (
    <div className="relative">
      {/* Track */}
      <div
        ref={ref}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-6 gap-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {Array.from({ length: totalSlides }).map((_, page) => (
          <div key={page} className="flex-shrink-0 w-full flex gap-6 snap-center">
            {services
              .slice(page * visibleCount, (page + 1) * visibleCount)
              .map((s) => (
                <div key={s.id} className="flex-1 min-w-0">
                  {renderCard(s)}
                </div>
              ))}
            {page === totalSlides - 1 &&
              Array.from({ length: (page + 1) * visibleCount - services.length })
                .map((_, i) => <div key={`empty-${i}`} className="flex-1" />)}
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={activeIndex === 0}
        aria-label="Previous"
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center pointer-events-auto ${
          activeIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
        }`}
      >
        <ChevronLeft className="h-4 w-4 text-[#101848]" />
      </button>
      <button
        type="button"
        onClick={handleNext}
        disabled={activeIndex === totalSlides - 1}
        aria-label="Next"
        className={`absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center pointer-events-auto ${
          activeIndex === totalSlides - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
        }`}
      >
        <ChevronRight className="h-4 w-4 text-[#101848]" />
      </button>

      {/* Line dots */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => { setActiveIndex(i); scrollTo(i); }}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-[6px] rounded-full transition-all duration-300 ${
              activeIndex === i ? "w-[22px] bg-blue-600" : "w-[6px] bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
