import { SFIA_LEVELS, type JobItem } from '@/data/media/jobs';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: JobItem;
  href?: string;
  search?: string;
}

// Appropriate job-related images for different role types
const getJobImage = (job: JobItem): string => {
  // If job has an explicit image, use it
  if (job.image) {
    return job.image;
  }
  
  // Otherwise, select appropriate image based on role type
  const roleTypeImages: Record<JobItem['roleType'], string[]> = {
    'HR': [
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80'
    ],
    'Tech': [
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
    ],
    'Design': [
      'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1200&q=80'
    ],
    'Ops': [
      'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80'
    ],
    'Finance': [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80'
    ]
  };
  
  const images = roleTypeImages[job.roleType] || [
    'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=1200&q=80'
  ];
  
  // Use job ID to consistently select the same image for the same job
  const index = Math.abs(job.id.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0)) % images.length;
  return images[index];
};

export function JobCard({ job, href, search }: JobCardProps) {
  const imageSrc = '/job openings.jpg';
  const sfia = SFIA_LEVELS[job.sfiaLevel];

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="relative">
        <img 
          src={imageSrc} 
          alt={job.title} 
          className="h-40 w-full object-cover" 
          loading="lazy"
        />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          {job.type}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
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
          <p className="mt-2 text-sm text-gray-700 line-clamp-3">{job.summary}</p>
          <div className="mt-4 flex gap-2">
            <span className="rounded bg-gray-100 px-2 py-1 text-xs">{job.department}</span>
            <span className="rounded bg-gray-100 px-2 py-1 text-xs">{job.location}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 grid grid-cols-2 gap-3">
          {href ? (
            <Link
              to={`${href}${search || ''}`}
              className="h-9 rounded-xl border border-gray-300 text-center text-sm font-semibold text-gray-800 leading-9 transition hover:bg-gray-50"
            >
              View Details
            </Link>
          ) : (
            <button className="h-9 rounded-xl border border-gray-300 text-sm font-semibold text-gray-800 transition hover:bg-gray-50">
              View Details
            </button>
          )}
          {href ? (
            <Link
              to={`${href}/apply${search || ''}`}
              className="h-9 rounded-xl bg-[#030f35] text-center text-sm font-semibold text-white leading-9 transition hover:opacity-90"
            >
              Apply
            </Link>
          ) : job.applyUrl ? (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="h-9 rounded-xl bg-[#030f35] text-center text-sm font-semibold text-white leading-9 transition hover:opacity-90"
            >
              Apply
            </a>
          ) : (
            <button className="h-9 rounded-xl bg-[#030f35] text-sm font-semibold text-white transition hover:opacity-90">
              Apply
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
