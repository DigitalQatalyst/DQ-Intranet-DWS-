import { Link } from 'react-router-dom';
import { Radio, Clock, Play } from 'lucide-react';

interface PodcastSeriesCardProps {
  href?: string;
  title?: string;
}

export function PodcastSeriesCard({
  href,
  title = 'Action-Solver Podcast',
}: PodcastSeriesCardProps) {
  // Use the Action-Solver series image for all podcast series cards
  const coverImage = '/image (12).png';
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Cover Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-900">
        {/* Podcast cover image */}
        <img
          src={coverImage}
          alt={`${title} cover art`}
          className="h-full w-full object-cover object-top"
          loading="lazy"
        />

        {/* Top label - always show GHC */}
        <div className="absolute left-3 top-3 z-10">
          <span className="inline-flex items-center rounded-full bg-teal-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            GHC
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-1 flex-col">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          
          {/* Tagline */}
          <p className="mt-1 text-sm text-gray-600">
            Short conversations that solve real work problems at DQ
          </p>

          {/* Metadata */}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Radio size={14} />
              <span>10 episodes</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>~13 min avg</span>
            </div>
          </div>

          {/* Hosted By */}
          
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4">
          {href ? (
            <Link
              to={href}
              className="flex h-9 items-center justify-center gap-2 rounded-xl bg-[#030f35] text-sm font-semibold text-white transition hover:opacity-90"
            >
              <Play size={16} />
              <span>Play Series</span>
            </Link>
          ) : (
            <button className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[#030f35] text-sm font-semibold text-white transition hover:opacity-90">
              <Play size={16} />
              <span>Play Series</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

