import { SFIA_LEVELS, type JobItem } from '@/data/media/jobs';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: JobItem;
  href?: string;
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1200&q=80'
];

export function JobCard({ job, href }: JobCardProps) {
  const imageSrc = job.image || fallbackImages[Math.abs(job.id.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0)) % fallbackImages.length];
  const sfia = SFIA_LEVELS[job.sfiaLevel];

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="relative mb-3">
        <img src={imageSrc} alt={job.title} className="h-40 w-full rounded-xl object-cover" loading="lazy" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          {job.type}
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="mb-2 text-xs text-gray-500">
          {job.type} · {job.location} · {job.roleType}
        </div>
        {sfia && (
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-[#1A2E6E]">
            {sfia.label}
            <span className="text-[11px] text-[#4C5A86]">{sfia.detail}</span>
          </div>
        )}
        <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{job.summary}</p>
        <div className="mt-4 flex gap-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{job.department}</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{job.location}</span>
        </div>
        <div className="mt-auto" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        {href ? (
          <Link
            to={href}
            className="h-9 rounded-xl border border-gray-300 text-center text-sm font-semibold text-gray-800 leading-9 transition hover:bg-gray-50"
          >
            View Details
          </Link>
        ) : (
          <button className="h-9 rounded-xl border border-gray-300 text-sm font-semibold text-gray-800 transition hover:bg-gray-50">
            View Details
          </button>
        )}
        {job.applyUrl ? (
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noreferrer"
            className="h-9 rounded-xl bg-[#1A2E6E] text-center text-sm font-semibold text-white leading-9 transition hover:bg-[#132456]"
          >
            Apply
          </a>
        ) : href ? (
          <Link
            to={href}
            className="h-9 rounded-xl bg-[#1A2E6E] text-center text-sm font-semibold text-white leading-9 transition hover:bg-[#132456]"
          >
            Apply
          </Link>
        ) : (
          <button className="h-9 rounded-xl bg-[#1A2E6E] text-sm font-semibold text-white transition hover:bg-[#132456]">
            Apply
          </button>
        )}
      </div>
    </article>
  );
}
