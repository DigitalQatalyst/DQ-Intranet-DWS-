import React from 'react';

const Shimmer = ({ className }: { className: string }) => (
  <div className={`relative overflow-hidden rounded-md bg-white/10 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
);

const ContentShimmer = ({ className }: { className: string }) => (
  <div className={`relative overflow-hidden rounded-md bg-gray-200 ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
);

export const ArticleSkeleton: React.FC = () => (
  <div className="flex min-h-screen flex-col bg-white animate-pulse">
    {/* Hero skeleton */}
    <div className="relative overflow-hidden pt-4 pb-16 px-6" style={{ background: '#081540' }}>
      {/* Glow orb */}
      <div className="absolute top-[10%] right-[5%] w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #2a2f8f 0%, transparent 70%)' }} />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '130px', background: 'linear-gradient(to bottom, transparent 0%, #1a2a6e 20%, #6b7ab5 55%, #b8bccf 80%, #ffffff 100%)' }} />

      <div className="container mx-auto relative z-10" style={{ maxWidth: '1336px' }}>
        {/* Breadcrumb row */}
        <div className="flex items-center gap-2 mb-6" style={{ height: '60px' }}>
          <Shimmer className="h-3 w-4" />
          <Shimmer className="h-3 w-12" />
          <Shimmer className="h-3 w-2" />
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-3 w-2" />
          <Shimmer className="h-3 w-16" />
        </div>

        {/* Glassmorphism panel skeleton */}
        <div
          className="backdrop-blur-xl bg-white/[0.07] border border-white/[0.12] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] space-y-4"
          style={{ minHeight: '160px', padding: '32px 48px' }}
        >
          <Shimmer className="h-8 w-3/4" />
          <Shimmer className="h-8 w-1/2" />
          <Shimmer className="h-4 w-full mt-2" />
          <Shimmer className="h-4 w-5/6" />
        </div>
      </div>
    </div>

    {/* Body skeleton */}
    <main className="flex-1 px-6 pb-12">
      <div className="container mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3 pt-8" style={{ maxWidth: '1336px' }}>
        {/* Main content col */}
        <div className="lg:col-span-2 space-y-4">
          <ContentShimmer className="h-4 w-full" />
          <ContentShimmer className="h-4 w-11/12" />
          <ContentShimmer className="h-4 w-4/5" />
          <ContentShimmer className="h-4 w-full" />
          <ContentShimmer className="h-4 w-3/4" />
          <div className="pt-4 space-y-3">
            <ContentShimmer className="h-6 w-48" />
            <ContentShimmer className="h-4 w-full" />
            <ContentShimmer className="h-4 w-11/12" />
            <ContentShimmer className="h-4 w-5/6" />
          </div>
          <div className="pt-4 space-y-3">
            <ContentShimmer className="h-6 w-40" />
            <ContentShimmer className="h-4 w-full" />
            <ContentShimmer className="h-4 w-4/5" />
          </div>
        </div>

        {/* Sidebar col */}
        <aside className="order-first lg:order-last space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-3">
            <ContentShimmer className="h-5 w-32" />
            <ContentShimmer className="h-3 w-full" />
            <ContentShimmer className="h-3 w-5/6" />
            <ContentShimmer className="h-3 w-4/5" />
            <div className="pt-2 space-y-2">
              <ContentShimmer className="h-3 w-24" />
              <ContentShimmer className="h-3 w-20" />
              <ContentShimmer className="h-3 w-28" />
            </div>
          </div>
        </aside>
      </div>
    </main>
  </div>
);
