import { useEffect, useMemo, useState } from 'react';
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

export default function JobsGrid({ query }: GridProps) {
  const [sourceItems, setSourceItems] = useState<JobItem[]>(JOBS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('@/lib/supabaseClient');
        const supabase = (mod as any).supabase as any;
        const { data, error } = await supabase
          .from('jobs')
          .select('id,title,department,roleType,location,type,seniority,sfiaLevel,summary,description,responsibilities,requirements,benefits,postedOn,applyUrl,image');
        if (error) throw error;
        if (!cancelled && Array.isArray(data)) setSourceItems(data as JobItem[]);
      } catch {
        if (!cancelled) setSourceItems(JOBS);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    const search = query.q?.toLowerCase() ?? '';
    return sourceItems
      .filter((job) => {
        if (!search) return true;
        return job.title.toLowerCase().includes(search) || job.summary.toLowerCase().includes(search);
      })
      .filter((job) => {
        const matches = (val?: string, sel?: string[]) => !sel?.length || (val && sel.includes(val));
        const f = query.filters || {};
        const postedWithin = f.postedWithin;
        let withinOk = true;
        if (postedWithin && postedWithin.length) {
          const days = postedWithin.includes('Last 7 days') ? 7 : postedWithin.includes('Last 30 days') ? 30 : undefined;
          if (days) {
            const posted = new Date(job.postedOn).getTime();
            const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
            withinOk = posted >= cutoff;
          }
        }
        return (
          matches(job.department, f.department) &&
          matches(job.location, f.location) &&
          matches(job.type, f.contract) &&
          matches(job.sfiaLevel, f.sfiaLevel) &&
          matches(job.roleType, f.deptType) &&
          withinOk
        );
      })
      .sort((a, b) => (a.postedOn < b.postedOn ? 1 : -1));
  }, [query, sourceItems]);

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
