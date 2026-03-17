import React from 'react';
import { Hexagon } from 'lucide-react';
import type { Perspective } from '@/data/perspectives';
import GeometricIllustration from '@/components/perspectives/GeometricIllustration';

type PerspectiveCardProps = {
  perspective: Perspective;
  onExplore?: () => void;
};

export default function PerspectiveCard({ perspective, onExplore }: PerspectiveCardProps) {
  return (
    <article className="rounded-3xl bg-white border border-[#e5e9f5] shadow-[0_18px_48px_rgba(3,15,53,0.10),0_2px_8px_rgba(3,15,53,0.06)] overflow-hidden h-full flex flex-col">
      {/* Copy */}
      <div className="px-6 pb-6 pt-3 flex flex-col flex-1">
        {/* Header block: illustration + title/tag + meta */}
        <div className="flex flex-col">
          <div>
            {perspective.imageSrc ? (
              <img
                src={perspective.imageSrc}
                alt={perspective.title}
                className="w-[112px] h-[72px] object-contain opacity-[0.92]"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <GeometricIllustration
                type={perspective.illustration}
                className="w-[120px] h-[80px] opacity-[0.72]"
              />
            )}
          </div>

          {/* Small gap: image -> title */}
          <div className="mt-3 flex items-start justify-between gap-4">
            <h3 className="ghc-font-display text-2xl md:text-3xl font-bold text-[#131e42] leading-tight max-w-[70%]">
              {perspective.title}
            </h3>
            <span className="shrink-0 rounded-full border border-[hsl(var(--accent)/0.22)] bg-[hsl(var(--accent)/0.07)] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[hsl(var(--accent)/0.95)]">
              {perspective.tag}
            </span>
          </div>

          {/* Meta line */}
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#6b7390]">
            <Hexagon className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
            <span>{perspective.subtitle}</span>
          </div>
        </div>

        {/* Question headline (main anchor) */}
        <p className="mt-5 ghc-font-display text-xl md:text-2xl font-semibold text-[#131e42] leading-[1.28] min-h-[60px]">
          {perspective.question}
        </p>

        {/* Description (calm, constrained width) */}
        <p className="mt-2.5 text-[#4a5678] text-sm md:text-base leading-snug line-clamp-2 min-h-[44px] md:max-w-[70%]">
          {perspective.description}
        </p>

        <button
          type="button"
          onClick={onExplore}
          className="mt-auto pt-5 text-[hsl(var(--accent))] font-semibold inline-flex items-center gap-1 hover:underline self-start"
        >
          Explore in Knowledge Center →
        </button>
      </div>
    </article>
  );
}
