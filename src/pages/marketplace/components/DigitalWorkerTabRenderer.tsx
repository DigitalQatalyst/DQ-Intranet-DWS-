import React from 'react';
import { getDigitalWorkerServiceById } from '@/data/marketplace/digital-worker';

interface DigitalWorkerTabRendererProps {
  item: any;
  tabId: string;
  getUniqueKey: (prefix: string, id: any, index: number) => string;
}

export const DigitalWorkerTabRenderer: React.FC<DigitalWorkerTabRendererProps> = ({
  item,
  tabId,
  getUniqueKey
}) => {
  const dwService = getDigitalWorkerServiceById(item?.id);
  if (!dwService) return null;

  // About Tab
  if (tabId === 'about') {
    return (
      <div className="space-y-8">
        <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
          {dwService.about.overview}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-gray-900">Key Highlights</h4>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {dwService.keyHighlights.map((highlight, index) => (
              <div key={getUniqueKey('dw-highlight', highlight, index)} className="group flex items-start gap-3 rounded-xl bg-white p-4 border border-gray-100 transition-all duration-200 hover:border-blue-300 hover:shadow-md">
                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 font-medium leading-relaxed">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Requirements Tab
  if (tabId === 'requirements') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Requirements</h2>
          <p className="text-sm text-gray-600">
            Ensure these requirements are met before implementing {dwService.title}
          </p>
        </div>

        <div className="border-l-4 bg-white p-6 rounded-r-lg shadow-sm" style={{ borderLeftColor: '#030F35' }}>
          <ul className="space-y-4">
            {dwService.requirements.map((requirement, index) => (
              <li key={getUniqueKey('dw-requirement', requirement, index)} className="flex items-start gap-4">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md mt-0.5" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700 flex-1 leading-relaxed">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Tools Tab
  if (tabId === 'tools') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Tools & Technologies</h2>
          <p className="text-sm text-gray-600">
            Technologies and platforms used in this service
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dwService.tools.map((tool, index) => (
            <div key={getUniqueKey('dw-tool', tool, index)} className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-5 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-blue-300">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-400/10 blur-2xl"></div>
              <div className="relative flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <span className="text-gray-900 font-semibold leading-relaxed">{tool}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sample Use Case Tab
  if (tabId === 'sample_use_case') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sample Use Case</h2>
          <p className="text-sm text-gray-600">
            Real-world implementation scenario for {dwService.title}
          </p>
        </div>

        <div className="space-y-4">
          {dwService.sampleUseCase.steps.map((step, index) => (
            <div key={getUniqueKey('use-case-step', step, index)} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white" style={{ background: 'linear-gradient(135deg, #1A2E6E 0%, #152347 100%)' }}>
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 pt-1.5">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-gray-700 leading-relaxed">{step}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
