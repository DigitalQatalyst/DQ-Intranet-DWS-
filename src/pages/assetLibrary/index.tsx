import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { MarketplaceCard } from "../../components/Cards";
import { ResponsiveCardGrid } from "../../components/Cards/ResponsiveCardGrid";
import {
  FileText,
  ArrowLeft,
  HomeIcon,
  ChevronRightIcon,
  Eye,
  Download,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SearchBar } from "../../components/SearchBar";
import {
  getFilesByCategory,
  formatFileSize,
  getFileIcon,
  AssetFile,
} from "../../data/assetLibraryFiles";

type TopLevelCategory = "DT2.0 DESIGN" | "DT2.0 DEPLOY" | "MARKETING ARTEFACTS";

type DtSubCategory = "Govern" | "BD" | "Delivery";
type MarketingSubCategory = "DT2.0" | "Products";

const topLevelCards: Array<{
  id: TopLevelCategory;
  title: TopLevelCategory;
  description: string;
  color: string;
}> = [
  {
    id: "DT2.0 DESIGN",
    title: "DT2.0 DESIGN",
    description: "Design assets and architectural blueprints",
    color: "blue",
  },
  {
    id: "DT2.0 DEPLOY",
    title: "DT2.0 DEPLOY",
    description: "Deployment patterns and infrastructure guides",
    color: "indigo",
  },
  {
    id: "MARKETING ARTEFACTS",
    title: "MARKETING ARTEFACTS",
    description: "Brand guidelines and marketing materials",
    color: "purple",
  },
];

const dtSecondLevelCards: Array<{
  id: DtSubCategory;
  title: DtSubCategory;
  description: string;
  color: string;
}> = [
  {
    id: "Govern",
    title: "Govern",
    description: "Governance frameworks and compliance assets",
    color: "blue",
  },
  {
    id: "BD",
    title: "BD",
    description: "Business development collateral",
    color: "cyan",
  },
  {
    id: "Delivery",
    title: "Delivery",
    description: "Project delivery guides",
    color: "emerald",
  },
];

// Third level organization cards
const governOrganizations = [
  {
    id: "ABB",
    title: "ABB",
    description: "ABB project assets and resources",
    color: "blue",
  },
  {
    id: "ADIB",
    title: "ADIB",
    description: "ADIB governance materials",
    color: "indigo",
  },
  {
    id: "INVESTUAE",
    title: "INVESTUAE",
    description: "InvestUAE documentation",
    color: "purple",
  },
  {
    id: "SAIB",
    title: "SAIB",
    description: "SAIB compliance frameworks",
    color: "cyan",
  },
];

const bdOrganizations = [
  {
    id: "Hail & Cotton",
    title: "Hail & Cotton",
    description: "Hail & Cotton business proposals",
    color: "green",
  },
  {
    id: "Khalifa Fund",
    title: "Khalifa Fund",
    description: "Khalifa Fund partnership materials",
    color: "orange",
  },
  {
    id: "Neom",
    title: "Neom",
    description: "Neom project documentation",
    color: "red",
  },
  {
    id: "ATC",
    title: "ATC",
    description: "ATC business development assets",
    color: "yellow",
  },
];

const deliveryOrganizations = [
  {
    id: "ADIB",
    title: "ADIB",
    description: "ADIB delivery frameworks",
    color: "blue",
  },
  {
    id: "SAIB",
    title: "SAIB",
    description: "SAIB implementation guides",
    color: "purple",
  },
  {
    id: "InvestUAE",
    title: "InvestUAE",
    description: "InvestUAE delivery assets",
    color: "green",
  },
];

const deployGovernOrganizations = [
  {
    id: "DFSA",
    title: "DFSA",
    description: "DFSA deployment governance",
    color: "blue",
  },
];

const deployBDOrganizations = [
  {
    id: "Commercials",
    title: "Commercials",
    description: "Commercial deployment materials",
    color: "green",
  },
  {
    id: "Proposal Template",
    title: "Proposal Template",
    description: "Deployment proposal templates",
    color: "orange",
  },
  {
    id: "RFPs",
    title: "RFPs",
    description: "Request for Proposal documents",
    color: "purple",
  },
];

const deployDeliveryOrganizations = [
  {
    id: "DFSA",
    title: "DFSA",
    description: "DFSA delivery processes",
    color: "blue",
  },
];

const marketingDT20Organizations = [
  {
    id: "Marketing Library",
    title: "Marketing Library",
    description: "DT2.0 marketing asset library",
    color: "pink",
  },
  {
    id: "Template Library",
    title: "Template Library",
    description: "DT2.0 template collection",
    color: "purple",
  },
];

const marketingProductsOrganizations = [
  {
    id: "DTMA",
    title: "DTMA",
    description: "Digital Transformation Management Academy",
    color: "blue",
  },
  {
    id: "DTMP",
    title: "DTMP",
    description: "Digital Transformation Management Platform",
    color: "indigo",
  },
  {
    id: "DT40T",
    title: "DT40T",
    description: "Digital Transformation 40 Tools",
    color: "green",
  },
  {
    id: "TmaaS",
    title: "TmaaS",
    description: "Transformation as a Service",
    color: "orange",
  },
  {
    id: "D2GPrcsUPtech",
    title: "D2GPrcsUPtech",
    description: "D2G Process UP Technology",
    color: "red",
  },
];

const dfsaDeliveryFolders = [
  {
    id: "Formulate",
    title: "Formulate",
    description: "Project formulation assets",
    color: "blue",
  },
  {
    id: "Specify",
    title: "Specify",
    description: "Specification documents",
    color: "green",
  },
  {
    id: "Deliver",
    title: "Deliver",
    description: "Delivery execution materials",
    color: "orange",
  },
  {
    id: "Transition",
    title: "Transition",
    description: "Transition and handover assets",
    color: "purple",
  },
];

const marketingSecondLevelCards: Array<{
  id: MarketingSubCategory;
  title: MarketingSubCategory;
  description: string;
  color: string;
}> = [
  {
    id: "DT2.0",
    title: "DT2.0",
    description: "DT2.0 focused marketing assets",
    color: "pink",
  },
  {
    id: "Products",
    title: "Products",
    description: "Product marketing assets",
    color: "orange",
  },
];

function useAssetFiles(category: string | null, subcategory: string | null) {
  const [files, setFiles] = useState<AssetFile[] | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!category || !subcategory) {
      setFiles(null);
      return;
    }

    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      const result = getFilesByCategory(category, subcategory);
      setFiles(result);
      setLoading(false);
    }, 500);
  }, [category, subcategory]);

  return { files, loading };
}

export default function AssetLibraryPage() {
  const [level1, setLevel1] = useState<TopLevelCategory | null>(null);
  const [level2, setLevel2] = useState<
    DtSubCategory | MarketingSubCategory | null
  >(null);
  const [level3, setLevel3] = useState<string | null>(null);
  const [level4, setLevel4] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<AssetFile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMarketing = level1 === "MARKETING ARTEFACTS";
  const isDeploy = level1 === "DT2.0 DEPLOY";

  // Local search state for UI parity with marketplaces (visual only)
  const [searchQuery, setSearchQuery] = useState("");

  const { files, loading } = useAssetFiles(
    level1 && level2 && level3
      ? `${level1}-${level2}-${level3}${level4 ? `-${level4}` : ""}`
      : null,
    level1 && level2 && level3 ? "files" : null
  );

  const showTop = !level1;
  const showSecond = !!level1 && !level2;
  const showThird = !!level1 && !!level2 && !level3;
  const showFourth =
    !!level1 &&
    !!level2 &&
    !!level3 &&
    !level4 &&
    level2 === "Delivery" &&
    level3 === "DFSA" &&
    isDeploy;
  const showFiles = !!level1 && !!level2 && !!level3 && (!level4 || !!level4);

  // simple no-op to satisfy handlers that aren't used in the asset library
  const noop = () => undefined;

  // Modal handlers
  const openModal = (asset: AssetFile) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
    document.body.style.overflow = "unset";
  };

  // Download handler
  const handleDownload = (asset: AssetFile) => {
    if (asset.url && asset.url !== "#") {
      const link = document.createElement("a");
      link.href = asset.url;
      link.download = asset.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Cleanup effect to restore scrolling when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="container mx-auto px-0">
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
                <li className="inline-flex items-center">
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                  >
                    <HomeIcon size={16} className="mr-1" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    {showTop ? (
                      <span className="ml-1 text-gray-500 md:ml-2">
                        Asset Library
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setLevel1(null);
                          setLevel2(null);
                          setLevel3(null);
                          setLevel4(null);
                        }}
                        className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                      >
                        Asset Library
                      </button>
                    )}
                  </div>
                </li>
                {level1 && (
                  <li>
                    <div className="flex items-center">
                      <ChevronRightIcon size={16} className="text-gray-400" />
                      {showSecond ? (
                        <span className="ml-1 text-gray-500 md:ml-2">
                          {level1}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setLevel2(null);
                            setLevel3(null);
                            setLevel4(null);
                          }}
                          className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                        >
                          {level1}
                        </button>
                      )}
                    </div>
                  </li>
                )}
                {level2 && (
                  <li>
                    <div className="flex items-center">
                      <ChevronRightIcon size={16} className="text-gray-400" />
                      {showThird ? (
                        <span className="ml-1 text-gray-500 md:ml-2">
                          {level2}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setLevel3(null);
                            setLevel4(null);
                          }}
                          className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                        >
                          {level2}
                        </button>
                      )}
                    </div>
                  </li>
                )}
                {level3 && (
                  <li>
                    <div className="flex items-center">
                      <ChevronRightIcon size={16} className="text-gray-400" />
                      {showFourth || showFiles ? (
                        showFourth ? (
                          <span className="ml-1 text-gray-500 md:ml-2">
                            {level3}
                          </span>
                        ) : (
                          <button
                            onClick={() => setLevel4(null)}
                            className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                          >
                            {level3}
                          </button>
                        )
                      ) : (
                        <span className="ml-1 text-gray-500 md:ml-2">
                          {level3}
                        </span>
                      )}
                    </div>
                  </li>
                )}
                {level4 && (
                  <li aria-current="page">
                    <div className="flex items-center">
                      <ChevronRightIcon size={16} className="text-gray-400" />
                      <span className="ml-1 text-gray-500 md:ml-2">
                        {level4}
                      </span>
                    </div>
                  </li>
                )}
              </ol>
            </nav>
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "#030F35" }}
            >
              Asset Library
            </h1>
            <p className="text-gray-600 mb-6">
              Browse shared design, deployment and marketing artefacts. Access
              templates, guides, and resources for your projects.
            </p>
            <div className="mb-6">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </div>

          {(showSecond || showThird || showFourth || showFiles) && (
            <button
              className="mb-4 inline-flex items-center gap-2 transition-colors hover:opacity-80"
              style={{ color: "#1A2E6E" }}
              onClick={() => {
                if (showFiles && level4) {
                  setLevel4(null);
                } else if (showFiles || showFourth) {
                  setLevel3(null);
                } else if (showThird) {
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
                {topLevelCards.map((card) => {
                  const item = {
                    id: card.id,
                    title: card.title,
                    description: card.description,
                    provider: {
                      name: card.title,
                      logoUrl:
                        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
                    },
                    tags: [card.color.toUpperCase()],
                  };
                  return (
                    <div key={card.id} className="asset-lib-card p-2">
                      <style>{`.asset-lib-card button:empty{display:none}`}</style>
                      <MarketplaceCard
                        item={item}
                        config={{
                          primaryCTA: "",
                          secondaryCTA: "View Details",
                        }}
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
                {(isMarketing
                  ? marketingSecondLevelCards
                  : dtSecondLevelCards
                ).map((card) => {
                  const item = {
                    id: card.id,
                    title: card.title,
                    description: card.description,
                    provider: {
                      name: card.title,
                      logoUrl:
                        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
                    },
                    tags: [card.color.toUpperCase()],
                  };
                  return (
                    <div key={card.id} className="asset-lib-card p-2">
                      <style>{`.asset-lib-card button:empty{display:none}`}</style>
                      <MarketplaceCard
                        item={item}
                        config={{
                          primaryCTA: "",
                          secondaryCTA: "View Details",
                        }}
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

          {showThird && (
            <div className="mx-auto w-full max-w-5xl">
              <ResponsiveCardGrid className="justify-center -m-2">
                {(() => {
                  let organizations: any[] = [];

                  if (level1 === "DT2.0 DESIGN") {
                    if (level2 === "Govern")
                      organizations = governOrganizations;
                    else if (level2 === "BD") organizations = bdOrganizations;
                    else if (level2 === "Delivery")
                      organizations = deliveryOrganizations;
                  } else if (level1 === "DT2.0 DEPLOY") {
                    if (level2 === "Govern")
                      organizations = deployGovernOrganizations;
                    else if (level2 === "BD")
                      organizations = deployBDOrganizations;
                    else if (level2 === "Delivery")
                      organizations = deployDeliveryOrganizations;
                  } else if (level1 === "MARKETING ARTEFACTS") {
                    if (level2 === "DT2.0")
                      organizations = marketingDT20Organizations;
                    else if (level2 === "Products")
                      organizations = marketingProductsOrganizations;
                  }

                  return organizations.map((org) => {
                    const item = {
                      id: org.id,
                      title: org.title,
                      description: org.description,
                      provider: {
                        name: org.title,
                        logoUrl:
                          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
                      },
                      tags: [org.color.toUpperCase()],
                    };
                    return (
                      <div key={org.id} className="asset-lib-card p-2">
                        <style>{`.asset-lib-card button:empty{display:none}`}</style>
                        <MarketplaceCard
                          item={item}
                          config={{
                            primaryCTA: "",
                            secondaryCTA: "View Assets",
                          }}
                          onQuickView={noop}
                          onViewDetails={() => setLevel3(org.id)}
                          onToggleBookmark={noop}
                          onAddToComparison={noop}
                          onPrimaryAction={noop}
                        />
                      </div>
                    );
                  });
                })()}
              </ResponsiveCardGrid>
            </div>
          )}

          {showFourth && (
            <div className="mx-auto w-full max-w-5xl">
              <ResponsiveCardGrid className="justify-center -m-2">
                {dfsaDeliveryFolders.map((folder) => {
                  const item = {
                    id: folder.id,
                    title: folder.title,
                    description: folder.description,
                    provider: {
                      name: folder.title,
                      logoUrl:
                        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
                    },
                    tags: [folder.color.toUpperCase()],
                  };
                  return (
                    <div key={folder.id} className="asset-lib-card p-2">
                      <style>{`.asset-lib-card button:empty{display:none}`}</style>
                      <MarketplaceCard
                        item={item}
                        config={{
                          primaryCTA: "",
                          secondaryCTA: "View Files",
                        }}
                        onQuickView={noop}
                        onViewDetails={() => setLevel4(folder.id)}
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
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {level4 || level3} Assets
                </h2>
                <p className="text-gray-600">
                  {level1} → {level2} → {level3}
                  {level4 ? ` → ${level4}` : ""} files and resources
                </p>
              </div>

              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <div className="text-gray-500">Loading assets...</div>
                </div>
              )}

              {!loading && files && files.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {files.map((asset) => (
                    <div
                      key={asset.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255, 107, 53, 0.02) 0%, rgba(26, 46, 110, 0.02) 50%, rgba(3, 15, 53, 0.03) 100%)",
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: "#1A2E6E" }}
                          >
                            <FileText size={24} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-lg font-semibold mb-2"
                            style={{ color: "#030F35" }}
                          >
                            {asset.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            {asset.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                            {asset.author && (
                              <span className="flex items-center gap-1">
                                <span
                                  className="font-medium"
                                  style={{ color: "rgba(26, 46, 110, 0.7)" }}
                                >
                                  Author:
                                </span>
                                {asset.author}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <span
                                className="font-medium"
                                style={{ color: "rgba(26, 46, 110, 0.7)" }}
                              >
                                Updated:
                              </span>
                              {new Date(
                                asset.lastModified
                              ).toLocaleDateString()}
                            </span>
                            {asset.size && (
                              <span className="flex items-center gap-1">
                                <span
                                  className="font-medium"
                                  style={{ color: "rgba(26, 46, 110, 0.7)" }}
                                >
                                  Size:
                                </span>
                                {formatFileSize(asset.size)}
                              </span>
                            )}
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase font-medium">
                              {asset.type}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(asset)}
                              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                              style={{ backgroundColor: "#FF6B35" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#E04A2B";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#FF6B35";
                              }}
                              title="View Asset"
                            >
                              <Eye size={16} />
                              View
                            </button>
                            <button
                              onClick={() => handleDownload(asset)}
                              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                              style={{ backgroundColor: "#1A2E6E" }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#15255A";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#1A2E6E";
                              }}
                              title="Download Asset"
                            >
                              <Download size={16} />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && files && files.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                  <p>No assets available for this category yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Asset Preview Modal */}
      {isModalOpen && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#1A2E6E" }}
                >
                  <FileText size={24} className="text-white" />
                </div>
                <div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#030F35" }}
                  >
                    {selectedAsset.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedAsset.description}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  {selectedAsset.author && (
                    <span className="flex items-center gap-2">
                      <span
                        className="font-medium"
                        style={{ color: "rgba(26, 46, 110, 0.7)" }}
                      >
                        Author:
                      </span>
                      {selectedAsset.author}
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <span
                      className="font-medium"
                      style={{ color: "rgba(26, 46, 110, 0.7)" }}
                    >
                      Updated:
                    </span>
                    {new Date(selectedAsset.lastModified).toLocaleDateString()}
                  </span>
                  {selectedAsset.size && (
                    <span className="flex items-center gap-2">
                      <span
                        className="font-medium"
                        style={{ color: "rgba(26, 46, 110, 0.7)" }}
                      >
                        Size:
                      </span>
                      {formatFileSize(selectedAsset.size)}
                    </span>
                  )}
                </div>

                {/* Asset Preview Content */}
                <div className="bg-gray-50 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">
                      {getFileIcon(selectedAsset.type)}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                      Asset Preview
                    </h4>
                    <p className="text-gray-500 mb-6">
                      This is a preview of the asset content. In a real
                      implementation, this would show the actual document
                      content or a file viewer.
                    </p>
                    <button
                      onClick={() => handleDownload(selectedAsset)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition-colors"
                      style={{ backgroundColor: "#FF6B35" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#E04A2B";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#FF6B35";
                      }}
                    >
                      <Download size={16} />
                      Download Full Asset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
