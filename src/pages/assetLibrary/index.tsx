import React, { useMemo, useState } from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { MarketplaceCard } from '../../components/Cards';
import { ResponsiveCardGrid } from '../../components/Cards/ResponsiveCardGrid';
import { FileText, ArrowLeft, HomeIcon, ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../../components/SearchBar';


type TopLevelCategory = 'DT2.0 DESIGN' | 'DT2.0 DEPLOY' | 'MARKETING ARTEFACTS';

type DtSubCategory = 'Design' | 'BD' | 'Delivery';
type MarketingSubCategory = 'DT2.0' | 'Products';

interface FileItem {
  id: string;
  name: string;
  url?: string;
  size?: number;
  lastModified?: string;
}

const topLevelCards: Array<{ id: TopLevelCategory; title: TopLevelCategory; description: string; color: string; }> = [
  { id: 'DT2.0 DESIGN', title: 'DT2.0 DESIGN', description: 'Design assets and documents', color: '' },
  { id: 'DT2.0 DEPLOY', title: 'DT2.0 DEPLOY', description: 'Deployment assets and runbooks', color: '' },
  { id: 'MARKETING ARTEFACTS', title: 'MARKETING ARTEFACTS', description: 'Marketing materials and resources', color: '' }
];

const dtSecondLevelCards: Array<{ id: DtSubCategory; title: DtSubCategory; description: string; color: string; }> = [
  { id: 'Design', title: 'Design', description: 'Blueprints, UX, architecture', color: '' },
  { id: 'BD', title: 'BD', description: 'Business development collateral', color: '' },
  { id: 'Delivery', title: 'Delivery', description: 'Project delivery guides', color: '' }
];

const marketingSecondLevelCards: Array<{ id: MarketingSubCategory; title: MarketingSubCategory; description: string; color: string; }> = [
  { id: 'DT2.0', title: 'DT2.0', description: 'DT2.0 focused marketing assets', color: '' },
  { id: 'Products', title: 'Products', description: 'Product marketing assets', color: '' }
];

function useSharePointFiles(pathSegments: string[]) {
  const [files, setFiles] = useState<FileItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const joinedPath = pathSegments.join('/');
    const load = async () => {
      if (joinedPath.length === 0) {
        setFiles(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // NOTE: Replace this stub with a real SharePoint fetch when available.
        // The previous code incorrectly awaited `setFiles(joinedPath)` which
        // attempted to call the state setter as if it were a fetch function.
        const mock: FileItem[] = [
          { id: '1', name: `${joinedPath}-Sample.pdf`, url: undefined, lastModified: new Date().toISOString() },
          { id: '2', name: `${joinedPath}-Diagram.png`, url: undefined, lastModified: new Date().toISOString() }
        ];
        // simulate small latency
        await new Promise((r) => setTimeout(r, 150));
        setFiles(mock);
      } catch (err) {
        const e = err as { message?: string } | undefined;
        setError(e?.message || 'Failed to load files');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pathSegments]);

  return { files, loading, error };
}

export default function AssetLibraryPage() {
  const [level1, setLevel1] = useState<TopLevelCategory | null>(null);
  const [level2, setLevel2] = useState<DtSubCategory | MarketingSubCategory | null>(null);

  const isMarketing = level1 === 'MARKETING ARTEFACTS';

  // breadcrumbs previously used for a compact inline trail; the header now uses marketplace-style markup

  // Local search state for UI parity with marketplaces (visual only)
  const [searchQuery, setSearchQuery] = useState('');

  const pathSegments = useMemo(() => {
    const segments: string[] = [];
    if (level1) segments.push(level1);
    if (level2) segments.push(level2);
    return segments;
  }, [level1, level2]);

  const { files, loading, error } = useSharePointFiles(
    // Only fetch when we are at the leaf (after picking second level)
    level1 && level2 ? pathSegments : []
  );

  const showTop = !level1;
  const showSecond = !!level1 && !level2;
  const showFiles = !!level1 && !!level2;

  // simple no-op to satisfy handlers that aren't used in the asset library
  const noop = () => undefined;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="container mx-auto px-0">
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
                <li className="inline-flex items-center">
                  <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                    <HomeIcon size={16} className="mr-1" />
                    <span>Home</span>
                  </Link>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <span className="ml-1 text-gray-500 md:ml-2">Asset Library</span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Asset Library</h1>
            <p className="text-gray-600 mb-6">Browse shared design, deployment and marketing artefacts.</p>
            <div className="mb-6">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
          </div>

          {(showSecond || showFiles) && (
            <button
              className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
              onClick={() => {
                if (showFiles) {
                  setLevel2(null);
                } else if (showSecond) {
                  setLevel1(null);
                }
              }}
            >
              <ArrowLeft size={18} /> Back
            </button>
          )}

          {showTop && (
            <div className="mx-auto w-full max-w-5xl">
              <ResponsiveCardGrid className="justify-center -m-2">
                {topLevelCards.map(card => {
                  const item = {
                    id: card.id,
                    title: card.title,
                    description: card.description,
                    provider: { name: card.title, logoUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==' },
                    tags: [card.color.toUpperCase()]
                  };
                  return (
                    <div key={card.id} className="asset-lib-card p-2">
                      <style>{`.asset-lib-card button:empty{display:none}`}</style>
                      <MarketplaceCard
                        item={item}
                        config={{ primaryCTA: '', secondaryCTA: 'View Details' }}
                        onQuickView={noop}
                        onViewDetails={() => setLevel1(card.id)}
                        onToggleBookmark={noop}
                        onAddToComparison={noop}
                        onPrimaryAction={noop}
                      />
                    </div>
                  );
                })}
              </ResponsiveCardGrid>
            </div>
          )}

          {showSecond && (
            <div className="mx-auto w-full max-w-5xl">
              <ResponsiveCardGrid className="justify-center -m-2">
                {(isMarketing ? marketingSecondLevelCards : dtSecondLevelCards).map(card => {
                  const item = {
                    id: card.id,
                    title: card.title,
                    description: card.description,
                    provider: { name: card.title, logoUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==' },
                    tags: [card.color.toUpperCase()]
                  };
                  return (
                    <div key={card.id} className="asset-lib-card p-2">
                      <style>{`.asset-lib-card button:empty{display:none}`}</style>
                      <MarketplaceCard
                        item={item}
                        config={{ primaryCTA: '', secondaryCTA: 'View Details' }}
                        onQuickView={noop}
                        onViewDetails={() => setLevel2(card.id)}
                        onToggleBookmark={noop}
                        onAddToComparison={noop}
                        onPrimaryAction={noop}
                      />
                    </div>
                  );
                })}
              </ResponsiveCardGrid>
            </div>
          )}

{showFiles && (
  <div className="bg-white rounded-xl shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">Files</h2>
    </div>
    {loading && (
      <div className="text-gray-500">Loading files...</div>
    )}
    {error && (
      <div className="text-red-600">{error}</div>
    )}
    {!loading && !error && (
      <ul className="divide-y divide-gray-100">
        {(files || []).map(f => (
          <li key={f.id} className="py-3 flex items-center gap-3">
            <FileText size={18} className="text-gray-400" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{f.name}</div>
              {f.lastModified && (
                <div className="text-xs text-gray-500">Updated {new Date(f.lastModified).toLocaleDateString()}</div>
              )}
            </div>
            {f.url && (
              <a
                href={f.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Open
              </a>
            )}
          </li>
        ))}
        {files && files.length === 0 && (
          <li className="py-3 text-sm text-gray-500">No files found.</li>
        )}
      </ul>
    )}
  </div>
)}
        </div>
      </main>
      <Footer />
    </div>
  );
} 