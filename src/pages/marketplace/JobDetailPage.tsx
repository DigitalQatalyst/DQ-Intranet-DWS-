import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon, MapPin, Briefcase, Clock, Share2, ArrowUpRight } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { JOBS, SFIA_LEVELS, type JobItem } from '@/data/media/jobs';

const formatDate = (input: string) =>
  new Date(input).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const fallbackHero =
  'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1600&q=80';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const job = JOBS.find((item) => item.id === id);
  const related = JOBS.filter((item) => item.id !== id).slice(0, 3);

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-2 text-2xl font-semibold text-gray-900">Role not found</h1>
          <p className="mb-6 max-w-md text-gray-600">
            The opportunity you’re trying to view is unavailable. Browse the latest openings in the Media Center.
          </p>
          <button
            onClick={() => navigate('/marketplace/opportunities')}
            className="rounded-lg bg-[#1A2E6E] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Opportunities
          </button>
        </main>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  const sfia = SFIA_LEVELS[job.sfiaLevel];

  const metaRows: Array<{ label: string; value: string; icon: React.ReactNode }> = [
    { label: 'Department', value: job.department, icon: <Briefcase size={16} className="text-[#1A2E6E]" /> },
    { label: 'Role Type', value: job.roleType, icon: <Briefcase size={16} className="text-[#1A2E6E]" /> },
    { label: 'Location', value: job.location, icon: <MapPin size={16} className="text-[#1A2E6E]" /> },
    { label: 'Contract', value: job.type, icon: <Clock size={16} className="text-[#1A2E6E]" /> },
    {
      label: 'SFIA Level',
      value: sfia ? `${sfia.label} · ${sfia.detail}` : job.sfiaLevel,
      icon: <ArrowUpRight size={16} className="text-[#1A2E6E]" />
    },
    { label: 'Posted', value: formatDate(job.postedOn), icon: <Clock size={16} className="text-[#1A2E6E]" /> }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F6FB]">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="flex-1">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <nav className="flex items-center text-sm text-gray-600" aria-label="Breadcrumb">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-[#1A2E6E]">
                <HomeIcon size={16} />
                Home
              </Link>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <Link to="/marketplace/news" className="hover:text-[#1A2E6E]">
                DQ Media Center
              </Link>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <Link to="/marketplace/opportunities" className="hover:text-[#1A2E6E]">
                Opportunities & Openings
              </Link>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <span className="text-gray-900 line-clamp-1">{job.title}</span>
            </nav>
            <div className="flex gap-2 text-sm text-gray-500">
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 hover:text-[#1A2E6E]">
                <Share2 size={16} />
                Share
              </button>
              {job.applyUrl && (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-[#1A2E6E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#132456]"
                >
                  Apply Now
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                <div className="mb-8 rounded-2xl bg-gray-100">
                  <img
                    src={job.image || fallbackHero}
                    alt={job.title}
                    className="h-[420px] w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#1A2E6E]">
                    {job.roleType} role
                  </span>
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#1A2E6E]">
                    Internal Mobility · Current associates only
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-lg text-gray-700">{job.summary}</p>
                  <div className="grid gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:grid-cols-2">
                    {metaRows.map((row) => (
                      <div key={row.label} className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
                          {row.icon}
                        </span>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">{row.label}</p>
                          <p className="text-sm font-semibold text-gray-900">{row.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <article className="prose prose-gray mt-10 max-w-none">
                  <h2>About the role</h2>
                  <p>{job.description}</p>

                  <h3>Responsibilities</h3>
                  <ul>
                    {job.responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h3>Requirements</h3>
                  <ul>
                    {job.requirements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h3>What you get</h3>
                  <ul>
                    {job.benefits.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              </div>

              <aside className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">Ready to apply?</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Internal transfers stay open for active DQ associates. Share the rituals you lead and the SFIA evidence that backs your move.
                  </p>
                  {job.applyUrl && (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#1A2E6E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#132456]"
                    >
                      Apply on DQ Careers
                    </a>
                  )}
                  <button
                    onClick={() => navigate(-1)}
                    className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    Back
                  </button>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900">Latest openings</h3>
                  <div className="mt-4 space-y-4">
                    {related.map((item: JobItem) => (
                      <Link
                        key={item.id}
                        to={`/marketplace/opportunities/${item.id}`}
                        className="group flex gap-3 rounded-xl border border-transparent p-3 hover:border-gray-200"
                      >
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <img src={item.image || fallbackHero} alt={item.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-[#1A2E6E]">
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.location} · {item.type}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default JobDetailPage;
