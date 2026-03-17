import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { useNavigate } from 'react-router-dom';
import type { Perspective } from '@/data/perspectives';
import { perspectives as defaultPerspectives } from '@/data/perspectives';
import PerspectiveCard from '@/components/perspectives/PerspectiveCard';
import PerspectiveNav from '@/components/perspectives/PerspectiveNav';

const AUTO_ROTATE_MS = 6500;

const perspectiveRoutes: Record<Perspective['illustration'], string> = {
  economy: '/marketplace/guides/digital-economy',
  cognitive: '/marketplace/guides/digital-cognitive-organisation',
  platforms: '/marketplace/guides/digital-business-platforms',
  transformation: '/marketplace/guides/digital-transformation-2',
  workspace: '/marketplace/guides/digital-worker-workspace',
  accelerators: '/knowledge-center/products/digital-accelerators',
};

type SixPerspectivesCarouselProps = {
  id?: string;
  badge?: string;
  title: string;
  subtitle: string;
  titleFontSize?: string;
  subtitleFontSize?: string;
  perspectives?: Perspective[];
};

export default function SixPerspectivesCarousel({
  id = 'ghc-carousel',
  badge = 'THE FRAMEWORK',
  title,
  subtitle,
  titleFontSize,
  subtitleFontSize,
  perspectives = defaultPerspectives,
}: SixPerspectivesCarouselProps) {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollSnaps = useMemo(() => (emblaApi ? emblaApi.scrollSnapList() : []), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    if (isPaused) return;
    const id = window.setInterval(() => {
      emblaApi.scrollNext();
    }, AUTO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [emblaApi, isPaused]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <section id={id} className="relative py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-6xl">
          {/* Header */}
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.24em] bg-[hsl(var(--accent)/0.10)] border border-[hsl(var(--accent)/0.35)] text-[hsl(var(--accent))] shadow-sm backdrop-blur">
              {badge}
            </span>
            <h2
              className="ghc-font-display text-4xl md:text-5xl font-semibold text-[#131e42] mt-4 leading-[1.05]"
              style={titleFontSize ? { fontSize: titleFontSize } : undefined}
            >
              {title}
            </h2>
            <p
              className="text-[#4a5678] mt-3 text-lg md:text-xl leading-snug"
              style={subtitleFontSize ? { fontSize: subtitleFontSize } : undefined}
            >
              {subtitle}
            </p>
          </div>

          {/* Two-column rail + carousel */}
          <div
            className="mt-10 grid grid-cols-1 lg:grid-cols-[34%_66%] gap-8 lg:gap-10 items-start"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <PerspectiveNav
              perspectives={perspectives}
              activeIndex={selectedIndex}
              onSelect={scrollTo}
              onPrev={scrollPrev}
              onNext={scrollNext}
            />

            <div className="min-w-0">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {perspectives.map((p) => (
                    <div key={p.id} className="flex-[0_0_100%] min-w-0">
                      <PerspectiveCard
                        perspective={p}
                        onExplore={() => {
                          const to = perspectiveRoutes[p.illustration] ?? '/marketplace/guides';
                          navigate(to);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Dot indicators (mobile) */}
              {scrollSnaps.length > 1 ? (
                <div className="flex justify-center gap-2 mt-5 lg:hidden" aria-label="Perspective progress">
                  {scrollSnaps.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollTo(i)}
                      className={[
                        'transition-all duration-300 rounded-full',
                        i === selectedIndex
                          ? 'w-6 h-2 bg-[hsl(var(--accent))]'
                          : 'w-2 h-2 bg-[#131e42]/40 hover:bg-[#131e42]/60',
                      ].join(' ')}
                      aria-label={`Go to perspective ${i + 1}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

