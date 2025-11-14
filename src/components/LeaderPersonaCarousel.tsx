import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { FadeInUpOnScroll } from "./AnimationUtils";

type LeaderPersonaStory = {
  id: string;
  name: string;
  titleHighlight?: string;
  description: string;
  imageSrc: string;
};

interface LeaderPersonaCarouselProps {
  stories: LeaderPersonaStory[];
}

const LeaderPersonaCard: React.FC<{
  story: LeaderPersonaStory;
  index: number;
}> = ({ story, index }) => {
  return (
    <FadeInUpOnScroll delay={index * 0.1}>
      <article className="relative h-[300px] overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
        {/* Background Image */}
        <img
          src={story.imageSrc}
          alt={story.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-end p-6 text-white">
          {/* Optional badge */}
          <div className="absolute top-4 right-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white">
              <Users size={12} />
              <span>Leadership Persona</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-white mb-2">
            {story.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-white/80 leading-relaxed line-clamp-2">
            {story.description}
          </p>
        </div>
      </article>
    </FadeInUpOnScroll>
  );
};

export const LeaderPersonaCarousel: React.FC<LeaderPersonaCarouselProps> = ({
  stories,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount =
        activeIndex * (carouselRef.current.scrollWidth / stories.length);
      carouselRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  }, [activeIndex, stories.length]);

  const handlePrev = () =>
    setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % stories.length);

  return (
    <div className="relative">
      {/* Carousel Track */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth gap-6 pb-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {stories.map((story, index) => (
          <div
            key={story.id}
            className="min-w-full sm:min-w-[calc(100%/2-12px)] lg:min-w-[calc(100%/3-16px)] flex-shrink-0 snap-center"
          >
            <LeaderPersonaCard story={story} index={index} />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center transform -translate-y-1/2 pointer-events-none px-4">
        <button
          className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-all pointer-events-auto"
          onClick={handlePrev}
          aria-label="Previous persona"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center text-gray-800 hover:bg-white transition-all pointer-events-auto"
          onClick={handleNext}
          aria-label="Next persona"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-4 gap-2">
        {stories.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              activeIndex === index ? "bg-[#FB5535] w-6" : "bg-gray-300"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to persona ${index + 1}`}
          />
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default LeaderPersonaCarousel;

