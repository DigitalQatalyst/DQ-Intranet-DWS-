import React, { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { SFIA_LEVELS, type JobItem } from '@/data/media/jobs';
import { fetchJobById } from '@/services/mediaCenterService';
import { submitJobApplication } from '@/services/jobApplicationsService';

const JobApplicationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState<JobItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoadError('Job ID is required.');
      setIsLoading(false);
      return;
    }
    let isMounted = true;

    async function loadJob(jobId: string) {
      setIsLoading(true);
      try {
        const item = await fetchJobById(jobId);
        if (!isMounted) return;
        setJob(item);
        setLoadError(item ? null : 'Role not found.');
      } catch (error) {
        if (!isMounted) return;
        // eslint-disable-next-line no-console
        console.error('Error loading job for application form', error);
        setLoadError('Unable to load this opportunity right now.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadJob(id);

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header toggleSidebar={() => {}} sidebarOpen={false} />
        <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-2 text-2xl font-semibold text-gray-900">
            {isLoading ? 'Loading role' : 'Role not found'}
          </h1>
          <p className="mb-6 max-w-md text-gray-600">
            {isLoading
              ? 'Fetching the latest details. Please wait.'
              : "The opportunity you're trying to apply for is unavailable. Browse the latest openings in the Media Center."}
          </p>
          {loadError && !isLoading && (
            <p className="mb-4 text-sm text-red-600">{loadError}</p>
          )}
          <button
            onClick={() => navigate(`/marketplace/opportunities${location.search || '?tab=opportunities'}`)}
            className="rounded-lg bg-[#030f35] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to Opportunities
          </button>
        </main>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !job) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const currentRole = String(formData.get('currentRole') || '').trim();
    const locationValue = String(formData.get('location') || '').trim();
    const sfiaLevel = String(formData.get('sfiaLevel') || '').trim();
    const motivation = String(formData.get('motivation') || '').trim();

    if (!name || !email || !currentRole || !locationValue || !sfiaLevel || !motivation) {
      setSubmitError('All fields are required. Please complete the form before submitting.');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      jobId: job.id,
      jobTitle: job.title,
      name,
      email,
      currentRole,
      location: locationValue,
      sfiaLevel,
      motivation
    };

    try {
      await submitJobApplication(payload);
      setIsSubmitted(true);
      // Disable form after successful submission
      event.currentTarget.reset();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to submit your application right now. Please try again later.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sfiaOptions = Object.entries(SFIA_LEVELS);

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
              <Link to={`/marketplace/news${location.search || ''}`} className="hover:text-[#1A2E6E]">
                DQ Media Center
              </Link>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <Link to={`/marketplace/opportunities${location.search || ''}`} className="hover:text-[#1A2E6E]">
                Opportunities &amp; Openings
              </Link>
              <ChevronRightIcon size={16} className="mx-2 text-gray-400" />
              <span className="text-gray-900 line-clamp-1">Apply for {job.title}</span>
            </nav>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#1A2E6E]">Job Application</p>
                  <h1 className="mt-2 text-2xl font-bold text-gray-900">Apply for {job.title}</h1>
                  <p className="mt-2 text-sm text-gray-700 max-w-xl">
                    You're applying for an internal opportunity in DQ. Share your current role, SFIA evidence, and why you're
                    excited about this move.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-900">Role Summary</p>
                    <p className="mt-1 text-sm text-gray-900 font-semibold">{job.department}</p>
                    <p className="text-sm text-gray-700">
                      {job.location} · {job.type} · {job.roleType} role
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-900">Overview</p>
                    <p className="mt-1 text-sm text-gray-700 leading-relaxed">{job.summary}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">Application form</h2>
                <p className="mt-1 text-sm text-gray-600">
                  <span className="font-semibold">All fields are required.</span> Your responses help the hiring team understand your
                  readiness for this move.
                </p>

                <form className="mt-4 space-y-4" onSubmit={handleSubmit} noValidate>
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-semibold text-gray-900">
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      disabled={isSubmitted}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#1A2E6E] focus:outline-none focus:ring-1 focus:ring-[#1A2E6E] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-semibold text-gray-900">
                      Work email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      disabled={isSubmitted}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#1A2E6E] focus:outline-none focus:ring-1 focus:ring-[#1A2E6E] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor="currentRole" className="mb-1 block text-sm font-semibold text-gray-900">
                      Current role / squad
                    </label>
                    <input
                      id="currentRole"
                      name="currentRole"
                      required
                      disabled={isSubmitted}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#1A2E6E] focus:outline-none focus:ring-1 focus:ring-[#1A2E6E] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="location" className="mb-1 block text-sm font-semibold text-gray-900">
                        Preferred location
                      </label>
                      <select
                        id="location"
                        name="location"
                        required
                        defaultValue={job.location}
                        disabled={isSubmitted}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#1A2E6E] focus:outline-none focus:ring-1 focus:ring-[#1A2E6E] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="Dubai">Dubai</option>
                        <option value="Nairobi">Nairobi</option>
                        <option value="Riyadh">Riyadh</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="sfiaLevel" className="mb-1 block text-sm font-semibold text-gray-900">
                        Current SFIA level
                      </label>
                      <select
                        id="sfiaLevel"
                        name="sfiaLevel"
                        required
                        defaultValue={job.sfiaLevel}
                        disabled={isSubmitted}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#1A2E6E] focus:outline-none focus:ring-1 focus:ring-[#1A2E6E] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        {sfiaOptions.map(([key, value]) => (
                          <option key={key} value={key}>
                            {value.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="motivation" className="mb-1 block text-sm font-semibold text-gray-900">
                      Why this move now?
                    </label>
                    <textarea
                      id="motivation"
                      name="motivation"
                      rows={4}
                      required
                      disabled={isSubmitted}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-[#1A2E6E] focus:outline-none focus:ring-1 focus:ring-[#1A2E6E] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Share your motivation, relevant experience, and the SFIA evidence that backs this move."
                    />
                  </div>

                  {submitError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                      {submitError}
                    </div>
                  )}

                  {isSubmitted && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
                      Application received. The hiring team will review your details and follow up via email.
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || isSubmitted}
                      className="inline-flex flex-1 items-center justify-center rounded-xl bg-[#030f35] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-70"
                    >
                      {isSubmitting ? 'Submitting... Please wait' : 'Submit application'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const tab = (location.state as { tab?: string } | null)?.tab || 'opportunities';
                        navigate(`/marketplace/opportunities/${job.id}`, { state: { tab } });
                      }}
                      disabled={isSubmitting}
                      className="inline-flex flex-1 items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-70"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer isLoggedIn={false} />
    </div>
  );
};

export default JobApplicationPage;
