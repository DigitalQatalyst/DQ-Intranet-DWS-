import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HomeIcon, ChevronRightIcon, MapPin, Building2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { WorkPosition } from "@/data/workDirectoryTypes";
import { getWorkPositionBySlug } from "@/api/workDirectory";

const RoleProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [position, setPosition] = useState<WorkPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      const result = await getWorkPositionBySlug(slug);
      if (!result) {
        setError("We could not find this role profile.");
        setPosition(null);
      } else {
        setPosition(result);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />
        <main className="container mx-auto px-4 py-10 flex-grow">
          <div className="text-center py-12">
            <div className="text-sm text-gray-500">Loading role profile…</div>
          </div>
        </main>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  // Error state - position not found
  if (!position && error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header toggleSidebar={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />
        <main className="container mx-auto px-4 py-10 flex-grow flex items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Role Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find a role with that slug. The role may have been removed or the link may be incorrect.
            </p>
            <Link
              to="/marketplace/work-directory?tab=positions"
              className="inline-flex items-center px-4 py-2 bg-[#030F35] text-white rounded-full hover:bg-[#051040] transition-colors"
            >
              Back to Positions
            </Link>
          </div>
        </main>
        <Footer isLoggedIn={false} />
      </div>
    );
  }

  if (!position) {
    return null;
  }

  const locationLabel = (loc: string | null) => {
    if (!loc) return null;
    const normalized = loc.trim().toUpperCase();
    if (normalized === "HOME") return "Remote";
    return loc;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />
      <main className="container mx-auto px-4 py-10 flex-grow space-y-8">
        {/* Breadcrumb */}
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
              <Link to="/marketplace/work-directory?tab=positions" className="ml-1 hover:text-gray-800">
                DQ Work Directory
              </Link>
            </li>
            <li className="inline-flex items-center text-gray-500">
              <ChevronRightIcon size={16} className="text-gray-400" />
              <span className="ml-1">Roles</span>
            </li>
            <li className="inline-flex items-center text-gray-700">
              <ChevronRightIcon size={16} className="text-gray-400" />
              <span className="ml-1">{position.positionName}</span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="rounded-3xl text-white shadow-xl overflow-hidden">
          <div
            className="relative p-6 sm:p-10 bg-gradient-to-br from-[#030F35] via-[#1A2E6E] to-[#4B61D1]"
          >
            {position.bannerImageUrl && (
              <div className="absolute inset-0">
                <img
                  src={position.bannerImageUrl}
                  alt={position.positionName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#030F35]/90 via-[#1A2E6E]/80 to-[#4B61D1]/80" />
              </div>
            )}
            <div className="relative space-y-4">
              {/* Tags */}
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-blue-100">
                {position.roleFamily && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white">
                    {position.roleFamily}
                  </span>
                )}
                {position.location && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white flex items-center gap-1">
                    <MapPin size={14} className="text-blue-200" />
                    {locationLabel(position.location)}
                  </span>
                )}
                {position.sfiaLevel && (
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white">
                    SFIA {position.sfiaLevel}
                  </span>
                )}
              </div>

              {/* Title */}
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl sm:text-4xl font-bold mt-2">
                  {position.heroTitle || position.positionName}
                </h1>
                {position.unit && (
                  <div className="flex items-center gap-2 text-sm text-blue-100">
                    <Building2 size={16} className="text-blue-200" />
                    <span>{position.unit}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Role Section */}
        {position.summary && (
          <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Role</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {position.summary}
            </p>
          </section>
        )}

        {/* Responsibilities Section */}
        <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Responsibilities</h2>
          {position.responsibilities && position.responsibilities.length > 0 ? (
            <ul className="space-y-2 list-disc list-inside text-slate-700">
              {position.responsibilities.map((item, index) => (
                <li key={index} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No responsibilities listed.</p>
          )}
        </section>

        {/* Expectations Section */}
        {position.expectations && (
          <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Expectations</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {position.expectations}
            </p>
          </section>
        )}

        {/* Role Context Section */}
        {position.description && (
          <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Role Context</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {position.description}
            </p>
          </section>
        )}

        {/* Reporting Section */}
        {position.reportsTo && (
          <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Reporting</h2>
            <p className="text-slate-700 leading-relaxed">
              {position.reportsTo}
            </p>
          </section>
        )}

        {/* Navigation Links */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/marketplace/work-directory?tab=positions"
            className="inline-flex items-center text-sm font-semibold text-[#030F35] hover:text-[#051040]"
          >
            ← Back to Positions
          </Link>
          {position.unitSlug && (
            <Link
              to={`/work-directory/units/${position.unitSlug}`}
              className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              View unit profile →
            </Link>
          )}
        </div>
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default RoleProfilePage;

