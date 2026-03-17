import React from 'react';
import { getAIToolDataById } from '@/data/marketplace/ai-tools';
import { getServiceTabContent } from '@/data/marketplace/services-center-tabs';

interface AIToolTabRendererProps {
  item: any;
  tabId: string;
  marketplaceType: string;
  itemDescription: string;
  getUniqueKey: (prefix: string, id: any, index: number) => string;
  renderBlocks: (blocks: any[]) => React.ReactNode;
}

export const AIToolTabRenderer: React.FC<AIToolTabRendererProps> = ({
  item,
  tabId,
  marketplaceType,
  itemDescription,
  getUniqueKey,
  renderBlocks
}) => {
  const toolData = getAIToolDataById(item?.id);
  if (!toolData) return null;

  // About Tab
  if (tabId === 'about') {
    return (
      <div className="space-y-8">
        <div className="text-gray-700 text-lg leading-relaxed mb-4">
          {itemDescription}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-gray-900">Key Features Included</h4>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {toolData.features.keyFeatures.map((feature, index) => (
              <div key={getUniqueKey('key-feature', feature, index)} className="group flex items-start gap-3 rounded-xl bg-white p-4 border border-gray-100 transition-all duration-200 hover:border-blue-300 hover:shadow-md">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // System Requirements Tab
  if (tabId === 'system_requirements') {
    const requirements = toolData.systemRequirements;
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">System Requirements</h2>
          <p className="text-sm text-gray-600">
            Ensure your system meets these specifications for optimal {toolData.name} performance
          </p>
        </div>

        <div className="border-l-4 bg-white p-5 rounded-r-lg shadow-sm" style={{ borderLeftColor: '#FB5535' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Minimum Requirements</h3>
          <ul className="space-y-2.5">
            {Object.entries(requirements.minimum).map(([key, value]) => (
              <li key={key} className="flex items-start gap-3">
                <span className="text-xs font-semibold text-gray-500 uppercase w-24 flex-shrink-0 pt-0.5">
                  {key.replaceAll(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-sm text-gray-700 flex-1">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-l-4 bg-white p-5 rounded-r-lg shadow-sm" style={{ borderLeftColor: '#030F35' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Requirements</h3>
          <ul className="space-y-2.5">
            {Object.entries(requirements.recommended).map(([key, value]) => (
              <li key={key} className="flex items-start gap-3">
                <span className="text-xs font-semibold text-gray-500 uppercase w-24 flex-shrink-0 pt-0.5">
                  {key.replaceAll(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-sm text-gray-700 flex-1">{value}</span>
              </li>
            ))}
          </ul>
        </div>

        {requirements.additionalNotes && requirements.additionalNotes.length > 0 && (
          <div className="border-l-4 border-gray-400 bg-white p-5 rounded-r-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
            <ul className="space-y-2">
              {requirements.additionalNotes.map((note, index) => (
                <li key={getUniqueKey('additional-note', note, index)} className="flex items-start gap-2">
                  <span className="text-gray-400 mt-0.5">•</span>
                  <span className="text-sm text-gray-700">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Licenses Tab
  if (tabId === 'licenses') {
    const content = getServiceTabContent(marketplaceType, item?.id, tabId);
    return (
      <div className="space-y-8">
        {content?.blocks && content.blocks.length > 0 && content.blocks[0].type === 'p' && (
          <div className="text-gray-700 text-lg leading-relaxed">
            {content.blocks[0].text}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-green-400/20 blur-3xl"></div>
            <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl"></div>
            <div className="absolute right-4 top-4 opacity-5">
              <svg className="h-24 w-24 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Subscription Status</p>
                  <p className="text-xs text-gray-500 mt-0.5">Current License State</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-4xl font-black text-green-700">{toolData.license.subscriptionStatus}</p>
                <div className="flex h-3 w-3 items-center justify-center">
                  <span className="absolute h-3 w-3 animate-ping rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative h-3 w-3 rounded-full bg-green-600 shadow-lg shadow-green-500/50"></span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800 bg-green-100/50 rounded-lg px-3 py-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium">Fully operational & ready to use</span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl"></div>
            <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-indigo-400/20 blur-2xl"></div>
            <div className="absolute right-4 top-4 opacity-5">
              <svg className="h-24 w-24" style={{ color: '#1A2E6E' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
              </svg>
            </div>
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg" style={{
                  background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)',
                  boxShadow: '0 10px 25px -5px rgba(26, 46, 110, 0.5)'
                }}>
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Expiry Date</p>
                  <p className="text-xs text-gray-500 mt-0.5">License Validity</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-4xl font-black" style={{ color: '#1A2E6E' }}>{toolData.license.expiryDate}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-900 bg-blue-100/50 rounded-lg px-3 py-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">No expiration - continuous access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Visit Site Tab
  if (tabId === 'visit_site') {
    const content = getServiceTabContent(marketplaceType, item?.id, tabId);
    const urlField = content?.action?.urlField;
    const computedUrl = (urlField && item?.[urlField]) || content?.action?.fallbackUrl || toolData.homepage || '#';

    return (
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          <div className="relative px-8 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                  <svg className="h-9 w-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">{toolData.name}</h3>
                  <p className="text-blue-100 text-sm">Official Website</p>
                </div>
              </div>
              <a
                href={computedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-blue-50 text-gray-900 rounded-xl font-bold transition-all duration-200 hover:scale-105 shadow-xl"
              >
                Visit Website
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {content?.blocks && content.blocks.length > 0 && (
          <div className="text-gray-700 text-lg leading-relaxed">
            {renderBlocks(content.blocks)}
          </div>
        )}
      </div>
    );
  }

  return null;
};
