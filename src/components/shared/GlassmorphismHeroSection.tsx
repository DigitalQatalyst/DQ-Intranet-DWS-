import { Link } from 'react-router-dom'
import { Home, ChevronRight } from 'lucide-react'

interface GlassmorphismHeroSectionProps {
  readonly title: string
  readonly subtitle?: string
  readonly date?: string
  readonly author?: string
  readonly breadcrumbs?: ReadonlyArray<{
    readonly label: string
    readonly href?: string
  }>
}

export function GlassmorphismHeroSection({ 
  title, 
  subtitle, 
  date, 
  author,
  breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Guides', href: '/marketplace/guides' },
    { label: title }
  ]
}: GlassmorphismHeroSectionProps) {
  return (
    <div
      className="relative overflow-hidden pt-4 pb-20 px-6"
      style={{
        background: `linear-gradient(to right, #192D6C, #051139)`,
      }}
    >
      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-48 h-48 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, hsl(var(--cta) / 0.6), transparent 70%)' }} />
        <div className="absolute top-[30%] right-[10%] w-64 h-64 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, hsl(260 70% 60% / 0.5), transparent 70%)' }} />
        <div className="absolute bottom-[5%] left-[40%] w-56 h-56 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, hsl(200 80% 60% / 0.5), transparent 70%)' }} />
      </div>

      {/* Fade-to-white gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to top, white, transparent)' }} />

      <div className="container mx-auto relative z-10 max-w-7xl">
        {/* ── Breadcrumbs row — Lovable HeroBanner pattern ── */}
        <nav className="flex items-center justify-between pb-6">
          <ol className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={`${index}-${crumb.label}`} className="flex items-center gap-1">
                {index === 0 && (
                  <Home className="h-3.5 w-3.5" style={{ color: 'hsl(var(--hero-foreground) / 0.5)' }} />
                )}
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="transition-colors hover:opacity-80"
                    style={{ color: 'hsl(var(--hero-foreground) / 0.5)' }}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className="font-medium max-w-[220px] truncate"
                    style={{ color: 'hsl(var(--hero-foreground) / 0.85)' }}
                  >
                    {crumb.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight 
                    className="h-3.5 w-3.5" 
                    style={{ color: 'hsl(var(--hero-foreground) / 0.3)' }} 
                  />
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Glassmorphism content panel */}
        <div
          className="rounded-2xl p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(210,220,255,0.07)',
            border: '1px solid rgba(210,220,255,0.12)',
          }}
        >
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
              style={{ color: 'hsl(var(--hero-foreground))' }}>
              {title}
            </h1>

            {subtitle && (
              <p className="max-w-2xl text-base md:text-lg leading-relaxed"
                style={{ color: 'hsl(var(--hero-muted))' }}>
                {subtitle}
              </p>
            )}

            {(date || author) && (
              <div className="flex items-center gap-4 text-base md:text-lg"
                style={{ color: 'hsl(var(--hero-muted))' }}>
                {date && <span>{date}</span>}
                {author && (
                  <>
                    {date && <span>•</span>}
                    <span>By {author}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}