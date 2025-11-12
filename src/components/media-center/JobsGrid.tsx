import { useMemo } from 'react';
import { JOBS, type JobItem } from '@/data/media/jobs';
import type { FiltersValue } from './types';
import { JobCard } from './cards/JobCard';

interface GridProps {
  query: {
    tab: string;
    q?: string;
    filters?: FiltersValue;
  };
}

const matchesSelection = (value: string | undefined, selections?: string[]) =>
  !selections?.length || (value && selections.includes(value));

export default function JobsGrid({ query }: GridProps) {
  const items = useMemo(() => {
    const search = query.q?.toLowerCase() ?? '';
    return JOBS.filter((job) => {
      if (!search) return true;
      return job.title.toLowerCase().includes(search) || job.summary.toLowerCase().includes(search);
    })
      .filter((job) => matchesSelection(job.department, query.filters?.department))
      .filter((job) => matchesSelection(job.location, query.filters?.location))
      .filter((job) => matchesSelection(job.type, query.filters?.contract))
      .filter((job) => matchesSelection(job.sfiaLevel, query.filters?.sfiaLevel))
      .filter((job) => matchesSelection(job.roleType, query.filters?.deptType))
      .sort((a, b) => (a.postedOn < b.postedOn ? 1 : -1));
  }, [query]);

  if (query.tab !== 'opportunities' || items.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <h3 className="font-medium text-gray-800">Available Items ({items.length})</h3>
        <span>Updated every Monday</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((job: JobItem) => (
          <JobCard key={job.id} job={job} href={`/marketplace/opportunities/${job.id}`} />
        ))}
      </div>
    </section>
  );
}
