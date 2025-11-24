import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HomeIcon, ChevronRightIcon } from "lucide-react";
import NotFound from "./NotFound";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { WorkPosition } from "@/data/workDirectoryTypes";
import { getWorkPositionBySlug } from "@/api/workDirectory";

const WorkPositionProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [position, setPosition] = useState<WorkPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      const result = await getWorkPositionBySlug(slug);
      if (!result) {
        setError("We could not find this role profile.");
        setPosition(null);
      } else {
        setPosition(result);
        setError(null);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  const backHref = "/marketplace/work-directory?tab=positions";

  // Handle 404 - position not found
  if (!loading && !position && error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />
        <main className="container mx-auto px-4 py-10 flex-grow flex items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Position Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find a position with that slug. The position may have been removed or the link may be incorrect.
            </p>
            <Link
              to={backHref}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Positions
            </Link>
          </div>
        </main>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  const renderList = (items: string[], emptyText: string) => {
    if (!items || items.length === 0) {
      return <p className="text-sm text-slate-500">{emptyText}</p>;
    }
    return (
      <ul className="space-y-2 list-disc list-inside text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />
      <main className="container mx-auto px-4 py-10 flex-grow space-y-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm text-gray-600">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                <HomeIcon size={16} className="mr-1" />
                Home
              </Link>
            </li>
            <li className="inline-flex items-center text-gray-500">
              <ChevronRightIcon size={16} className="text-gray-400" />
              <Link to="/marketplace/work-directory" className="ml-1 hover:text-gray-800">
                DQ Work Directory
              </Link>
            </li>
            <li className="inline-flex items-center text-gray-500">
              <ChevronRightIcon size={16} className="text-gray-400" />
              <span className="ml-1">Positions</span>
            </li>
            {position && (
              <li className="inline-flex items-center text-gray-700">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1">{position.positionName}</span>
              </li>
            )}
          </ol>
        </nav>

        {loading && <div className="text-sm text-gray-500">Loading role profile…</div>}

        {position && (
          <>
            {/* Image Banner - Full width at top if available */}
            {position?.imageUrl && (
              <section className="rounded-2xl overflow-hidden mb-6">
                <img
                  src={position.imageUrl}
                  alt={position?.positionName || 'Position banner'}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    // Hide image if it fails to load
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </section>
            )}

            <section className="rounded-3xl bg-gradient-to-br from-[#030F35] via-[#1A2E6E] to-[#4B61D1] text-white shadow-xl p-6 sm:p-10">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-blue-100">
                    {position?.roleFamily && (
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white">{position.roleFamily}</span>
                    )}
                    {position?.unit && (
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white">{position.unit}</span>
                    )}
                    {position?.location && (
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white">{position.location}</span>
                    )}
                    {(position?.sfiaLevel || position?.sfiaRating) && (
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white">
                        {position.sfiaLevel || position.sfiaRating}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 uppercase tracking-wide">Role profile</p>
                    <h1 className="text-3xl sm:text-4xl font-bold mt-2">{position?.positionName || 'TBC'}</h1>
                  </div>
                </div>
                <div className="w-full lg:w-1/3 rounded-2xl bg-white/10 px-5 py-4 text-sm text-blue-50">
                  <h2 className="text-base font-semibold text-white mb-1">Role profile</h2>
                  <p>Internal reference to understand scope, responsibilities and expectations for this position.</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-3">
              <h2 className="text-xl font-semibold text-slate-900">About this role</h2>
              <p className="text-slate-700 leading-relaxed">
                {position?.description ||
                  position?.summary ||
                  "No description available yet. This role profile has not been fully documented yet. Please refer to your sector lead for more details."}
              </p>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-3">
              <h2 className="text-xl font-semibold text-slate-900">Key responsibilities</h2>
              {position.responsibilities && position.responsibilities.length > 0 ? (
                <ul className="space-y-2 list-disc list-inside text-slate-700">
                  {position.responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">Responsibilities coming soon.</p>
              )}
            </section>

            {position?.expectations && (
              <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-3">
                <h2 className="text-xl font-semibold text-slate-900">Expectations</h2>
                <p className="text-slate-700 leading-relaxed">
                  {position.expectations}
                </p>
              </section>
            )}

            <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Role context</h2>
              <dl className="grid gap-4 sm:grid-cols-2 text-sm text-slate-600">
                <div>
                  <dt className="font-medium text-slate-700">Unit</dt>
                  <dd>{position?.unit || "TBC"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-700">Sector / Department</dt>
                  <dd>{position?.department || position?.roleFamily || "TBC"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-700">Location</dt>
                  <dd>{position?.location || "TBC"}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-700">SFIA level</dt>
                  <dd>{position?.sfiaLevel || position?.sfiaRating || "TBC"}</dd>
                </div>
                {position?.contractType && (
                  <div>
                    <dt className="font-medium text-slate-700">Contract Type</dt>
                    <dd>{position.contractType}</dd>
                  </div>
                )}
                {position?.status && (
                  <div>
                    <dt className="font-medium text-slate-700">Status</dt>
                    <dd>{position.status}</dd>
                  </div>
                )}
              </dl>
            </section>

            <section className="flex flex-wrap gap-3 pt-2">
              <Link
                to={backHref}
                className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900"
              >
                ← Back to Positions
              </Link>
              {position?.unitSlug && (
                <Link
                  to={`/work-directory/units/${position.unitSlug}`}
                  className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  View unit profile
                </Link>
              )}
            </section>
          </>
        )}
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default WorkPositionProfilePage;
