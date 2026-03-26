import { Link } from 'react-router-dom';
import { Radio, Play } from 'lucide-react';

interface PodcastSeriesCardProps {
  href?: string;
  title?: string;
  description?: string;
  episodeCount?: number;
  avgDuration?: number;
}

const PODCAST_COLOR = '#F97316';

export function PodcastSeriesCard({
  href,
  title = 'Action-Solver Podcast',
  description = 'Short conversations that solve real work problems at DQ',
  episodeCount,
  avgDuration,
}: PodcastSeriesCardProps) {
  const coverImage = '/image (12).png';

  const inner = (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer min-h-[360px]">
      {/* Image */}
      <div className="shrink-0 overflow-hidden rounded-t-2xl">
        <img
          src={coverImage}
          alt={`${title} cover art`}
          className="h-48 w-full object-cover object-center transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3">
        {/* Tag row */}
        <div className="mb-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: `${PODCAST_COLOR}18`, color: PODCAST_COLOR }}
          >
            Podcast
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug mb-1.5">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1">
          {description}
        </p>

        {/* Meta */}
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
          {episodeCount !== undefined && (
            <span className="flex items-center gap-1">
              <Radio size={12} />
              {episodeCount} {episodeCount === 1 ? 'episode' : 'episodes'}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-2">
          <span className="flex h-9 items-center justify-center gap-2 rounded-full bg-[#030f35] text-sm font-semibold text-white transition hover:opacity-90">
            <Play size={14} />
            Play Series
          </span>
        </div>
      </div>
    </article>
  );

  if (href) {
    return <Link to={href} className="flex h-full flex-col no-underline">{inner}</Link>;
  }
  return <div className="flex h-full flex-col">{inner}</div>;
}
