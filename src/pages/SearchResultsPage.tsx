import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

const useQuery = () => new URLSearchParams(useLocation().search);

interface SearchResultCard {
  id: string;
  title: string;
  description: string;
  href: string;
}

const SearchResultsPage: React.FC = () => {
  const params = useQuery();
  const query = params.get("query") || "";
  const trimmedQuery = query.trim();

  const matchedResults = useMemo(() => {
    if (!trimmedQuery) return [];
    const normalized = trimmedQuery.toLowerCase();

    const catalog: Record<string, SearchResultCard> = {
      it: {
        id: "it",
        title: "IT & Systems Support",
        description:
          "Helpdesk, access requests, device provisioning, and app support for every squad.",
        href: "/it-systems-support",
      },
      hr: {
        id: "hr",
        title: "HR & Finance Services",
        description: "Leave policies, payroll assistance, and benefits support in one place.",
        href: "/hr-finance-services",
      },
      facilities: {
        id: "facilities",
        title: "Facilities & Logistics",
        description: "Seat requests, office logistics, travel coordination, and on-site support.",
        href: "/facilities-logistics",
      },
    };

    const matchesIT = /\bit\b/.test(normalized) || normalized.includes("device") || normalized.includes("system");
    const matchesHR = /\bhr\b/.test(normalized) || normalized.includes("leave");
    const matchesFacilities = normalized.includes("seat") || normalized.includes("office");

    const results: SearchResultCard[] = [];
    if (matchesIT) results.push(catalog.it);
    if (matchesHR) results.push(catalog.hr);
    if (matchesFacilities) results.push(catalog.facilities);

    return results;
  }, [trimmedQuery]);

  const hasQuery = trimmedQuery.length > 0;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#101848] mb-4">
          Search results for "{query}"
        </h1>
        <p className="text-[#101848]/70 mb-8">
          We're still wiring up the full DQ search experience. For now, this page confirms that your search is working end-to-end.
        </p>

        <div className="space-y-4 mb-10 text-left">
          {!hasQuery && (
            <div className="bg-[#F3F4F6] border border-[#101848]/10 rounded-2xl p-6 text-[#101848]/80">
              Try searching for <strong>IT</strong>, <strong>HR</strong>, or <strong>office seating</strong> to see sample marketplace matches.
            </div>
          )}

          {hasQuery && matchedResults.length === 0 && (
            <div className="bg-[#F3F4F6] border border-[#101848]/10 rounded-2xl p-6 text-[#101848]/80">
              No mock results matched "{query}". Try keywords like <strong>IT</strong>, <strong>HR</strong>, <strong>leave</strong>, <strong>seat</strong>, or <strong>office</strong>.
            </div>
          )}

          {matchedResults.map((result) => (
            <div key={result.id} className="bg-white border border-[#101848]/10 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#101848]">{result.title}</h2>
              <p className="text-[#101848]/70 mt-2">{result.description}</p>
              <Link
                to={result.href}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-[#3478F6] text-white text-sm font-medium shadow hover:bg-[#275ECC] transition-colors"
              >
                Open in Marketplace →
              </Link>
            </div>
          ))}
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3478F6] text-white text-sm font-medium shadow-md hover:bg-[#275ECC] transition-colors"
        >
          &larr; Back to Digital Workspace home
        </Link>
      </div>
    </div>
  );
};

export default SearchResultsPage;
