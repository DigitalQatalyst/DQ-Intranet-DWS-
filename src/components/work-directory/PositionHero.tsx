import React from 'react';

interface PositionHeroProps {
  title: string;
  unitName?: string | null;
  location?: string | null;
  sfiaLevel?: string | null;
  tags?: string[];
  bannerImageUrl?: string | null;
  description?: string | null;
}

export function PositionHero({
  title,
  unitName,
  location,
  sfiaLevel,
  tags = [],
  bannerImageUrl,
  description,
}: PositionHeroProps) {
  return (
    <section className="rounded-3xl text-white shadow-xl overflow-hidden">
      <div className="relative p-6 sm:p-10 bg-gradient-to-br from-[#030F35] via-[#1A2E6E] to-[#4B61D1]">
        {bannerImageUrl && (
          <div className="absolute inset-0">
            <img
              src={bannerImageUrl}
              alt={title}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#030F35]/90 via-[#1A2E6E]/80 to-[#4B61D1]/80" />
          </div>
        )}
        <div className="relative space-y-4">
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-blue-100">
            {unitName && (
              <span className="px-3 py-1 rounded-full bg-white/10 text-white">{unitName}</span>
            )}
            {location && (
              <span className="px-3 py-1 rounded-full bg-white/10 text-white">{location}</span>
            )}
            {sfiaLevel && (
              <span className="px-3 py-1 rounded-full bg-white/10 text-white">{sfiaLevel}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-bold mt-2">{title}</h1>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="px-2 py-1 rounded-full bg-white/10 text-white/90 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {description && (
            <p className="text-blue-100 text-sm leading-relaxed max-w-3xl">{description}</p>
          )}
        </div>
      </div>
    </section>
  );
}

