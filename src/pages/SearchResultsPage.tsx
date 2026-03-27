import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import type { SearchResultCard } from "./SearchResultsPage.types";
import { getSearchMatches } from "@/utils/searchRouter";

const useQuery = () => new URLSearchParams(useLocation().search);

const SearchResultsPage: React.FC = () => {
  const params = useQuery();
  const query = params.get("query") || "";
  const trimmedQuery = query.trim();

  const matchedResults = useMemo<SearchResultCard[]>(
    () => (trimmedQuery ? getSearchMatches(trimmedQuery) : []),
    [trimmedQuery]
  );

  const hasQuery = trimmedQuery.length > 0;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#101848] mb-4">
          Search results for "{query}"
        </h1>
        <p className="text-[#101848]/70 mb-8">
          This search suggests the best-fit DQ marketplaces based on your words, with a short summary and a quick way to open each space.
        </p>

        <div className="space-y-4 mb-10 text-left">
          {!hasQuery && (
            <div className="bg-[#F3F4F6] border border-[#101848]/10 rounded-2xl p-6 text-[#101848]/80">
              Try searching for <strong>IT help</strong>, <strong>HR leave</strong>,{' '}
              <strong>news</strong>, <strong>jobs</strong>, <strong>learning</strong>, or{' '}
              <strong>directory</strong> to see live marketplace matches.
            </div>
          )}

          {hasQuery && matchedResults.length === 0 && (
            <div className="bg-[#F3F4F6] border border-[#101848]/10 rounded-2xl p-6 text-[#101848]/80">
              No marketplaces matched "{query}". Try keywords like <strong>IT help</strong>,{' '}
              <strong>HR</strong>, <strong>office seating</strong>, <strong>news</strong>,{' '}
              <strong>jobs</strong>, or <strong>guides</strong>.
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
