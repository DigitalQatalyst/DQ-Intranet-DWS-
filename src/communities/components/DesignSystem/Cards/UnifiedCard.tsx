import React, { useState } from 'react';
import { designTokens, tagVariants } from './designTokens';
// Unified Content Schema
export interface CardMedia {
  type: 'image' | 'icon' | 'avatar';
  src?: string;
  alt?: string;
  icon?: React.ReactNode;
  fallbackIcon?: React.ReactNode;
}
export interface CardTag {
  text: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
}
export interface CardMetadata {
  date?: string;
  author?: string;
  rating?: number;
  location?: string;
  fileSize?: string;
  downloadCount?: number;
  attendeeCount?: number;
  [key: string]: any;
}
export interface CardCTA {
  text: string;
  onClick: (e: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  disabled?: boolean;
}
export interface CardPill {
  text: string;
  icon?: React.ReactNode;
  variant?: 'warning' | 'success' | 'info' | 'secondary';
  animate?: boolean;
}
export interface CardContent {
  title: string;
  subtitle?: string;
  description?: string;
  tags?: CardTag[];
  media?: CardMedia;
  metadata?: CardMetadata;
  primaryCTA?: CardCTA;
  secondaryCTA?: CardCTA;
  pill?: CardPill;
  actions?: React.ReactNode;
}
export interface CardVariantConfig {
  type: 'news' | 'event' | 'service' | 'report' | 'promo' | 'feature' | 'service-highlight' | 'marketplace';
  gradient?: {
    from: string;
    to: string;
  };
  layout?: 'standard' | 'gradient' | 'feature';
  maxTags?: number;
}
export interface UnifiedCardProps {
  content: CardContent;
  variant: CardVariantConfig;
  isActive?: boolean;
  isBookmarked?: boolean;
  isComingSoon?: boolean;
  onQuickView?: () => void;
  onToggleBookmark?: () => void;
  className?: string;
  'data-id'?: string;
}

// ── Layout class helpers ────────────────────────────────────────────────────────

function getLayoutClasses(
  layout: CardVariantConfig['layout'],
  gradient: CardVariantConfig['gradient'],
  isActive: boolean,
  isComingSoon: boolean,
): string[] {
  if (layout === 'gradient') {
    if (isComingSoon) return ['bg-gradient-to-br from-gray-300 to-gray-500 opacity-60 hover:opacity-70 cursor-not-allowed']
    if (gradient) return [`bg-gradient-to-br ${gradient.from} ${gradient.to}`, 'text-white border-none shadow-lg hover:shadow-xl']
    return []
  }
  const base = ['bg-white', designTokens.visual.border]
  if (layout === 'feature' && isActive) base.push('ring-2 ring-blue-500 ring-opacity-50')
  if (isComingSoon) {
    const shade = layout === 'feature' ? 'from-gray-100 to-gray-200 opacity-70' : 'from-gray-50 to-gray-100 opacity-70'
    base.push(`bg-gradient-to-br ${shade} cursor-not-allowed`)
  }
  return base
}

// ── Sub-component helpers ──────────────────────────────────────────────────────

function CardMediaSection({ media, layout }: { media: CardMedia; layout: CardVariantConfig['layout'] }) {
  const cls = 'h-12 w-12 flex-shrink-0 mr-3 flex items-center justify-center'
  if (media.type === 'image' || media.type === 'avatar') {
    return (
      <div className={cls}>
        <img src={media.src} alt={media.alt || ''} className="h-12 w-12 object-contain rounded-md" />
      </div>
    )
  }
  if (media.type === 'icon') {
    return (
      <div className={`${cls} ${layout === 'gradient' ? 'bg-white bg-opacity-20 rounded-full' : 'bg-gray-100 rounded-md text-gray-500'}`}>
        {media.icon || media.fallbackIcon}
      </div>
    )
  }
  return null
}

const PILL_VARIANTS: Record<string, string> = {
  warning: 'bg-yellow-400 text-gray-800',
  success: 'bg-green-400 text-white',
  info: 'bg-blue-400 text-white',
  secondary: 'bg-gray-400 text-white',
}

function CardPillBadge({ pill }: { pill: CardPill }) {
  return (
    <div className={`absolute ${designTokens.spacing.pill.position.top} ${designTokens.spacing.pill.position.right} ${designTokens.spacing.pill.padding} rounded-full text-xs font-bold flex items-center z-10 ${PILL_VARIANTS[pill.variant || 'warning']} ${pill.animate ? 'animate-pulse' : ''}`}>
      {pill.icon && <span className="mr-1">{pill.icon}</span>}
      {pill.text}
    </div>
  )
}

function CardTagList({ tags, maxTags }: { tags: CardTag[]; maxTags: number }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.slice(0, maxTags).map((tag, i) => (
        <span key={i} className={`inline-flex items-center ${designTokens.spacing.pill.padding} rounded-full text-xs font-medium truncate ${tagVariants[tag.variant || 'primary']}`}>
          {tag.text}
        </span>
      ))}
    </div>
  )
}

function buildMetadataItems(metadata: CardMetadata): string[] {
  return [
    metadata.date,
    metadata.author,
    metadata.location,
    metadata.fileSize,
    metadata.attendeeCount ? `${metadata.attendeeCount} attendees` : undefined,
  ].filter(Boolean) as string[]
}

function CardMetadataRow({ metadata, layout }: { metadata: CardMetadata; layout: CardVariantConfig['layout'] }) {
  const items = buildMetadataItems(metadata)
  if (items.length === 0) return null
  return (
    <div className={`${designTokens.typography.metadata.size} ${layout === 'gradient' ? 'text-white text-opacity-75' : designTokens.typography.metadata.color} ${designTokens.spacing.content.marginBottom}`}>
      {items.join(' • ')}
    </div>
  )
}

function CardCTARow({ primaryCTA, secondaryCTA, actions, title }: Pick<CardContent, 'primaryCTA' | 'secondaryCTA' | 'actions' | 'title'>) {
  if (!primaryCTA && !secondaryCTA) return null
  return (
    <div className="mt-auto border-t border-gray-100 p-4 pt-5">
      {actions && <div className="mb-4">{actions}</div>}
      <div className="flex justify-between gap-2">
        {secondaryCTA && (
          <button onClick={secondaryCTA.onClick} disabled={secondaryCTA.disabled}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition-colors whitespace-nowrap min-w-[120px] flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`${secondaryCTA.text} for ${title}`}>
            {secondaryCTA.text}
          </button>
        )}
        {primaryCTA && (
          <button onClick={primaryCTA.onClick} disabled={primaryCTA.disabled}
            className={`px-4 py-2 text-sm font-bold rounded-md transition-colors whitespace-nowrap flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${primaryCTA.variant === 'secondary' ? 'text-blue-600 bg-white border border-blue-600 hover:bg-blue-50' : 'text-white bg-blue-600 hover:bg-blue-700'}`}
            aria-label={`${primaryCTA.text} for ${title}`}>
            {primaryCTA.text}
            {primaryCTA.icon && <span className="ml-2">{primaryCTA.icon}</span>}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export const UnifiedCard: React.FC<UnifiedCardProps> = ({
  content,
  variant,
  isActive = false,
  isBookmarked: _isBookmarked = false,
  isComingSoon = false,
  onQuickView,
  onToggleBookmark: _onToggleBookmark,
  className = '',
  'data-id': dataId
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const isGradient = variant.layout === 'gradient'

  const cardClass = [
    'flex flex-col', designTokens.visual.minHeight, designTokens.visual.borderRadius,
    designTokens.visual.shadow.default, designTokens.visual.shadow.hover,
    designTokens.transitions.hover, 'overflow-hidden',
    onQuickView ? 'cursor-pointer' : '',
    ...getLayoutClasses(variant.layout, variant.gradient, isActive, isComingSoon),
    className,
  ].join(' ')

  const handleKeyDown = onQuickView
    ? (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onQuickView() } }
    : undefined

  return (
    <div
      className={cardClass}
      onClick={onQuickView}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-id={dataId}
      role={onQuickView ? 'button' : undefined}
      tabIndex={onQuickView ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={onQuickView ? `View details for ${content.title}` : undefined}
    >
      {content.pill && <CardPillBadge pill={content.pill} />}

      <div className={`${designTokens.spacing.card.padding} flex flex-col h-full relative`}>
        {/* Header */}
        <div className="flex items-start mb-5">
          {content.media && <CardMediaSection media={content.media} layout={variant.layout} />}
          <div className="flex-grow min-h-[72px] flex flex-col justify-center">
            <h3 className={`${designTokens.typography.title.size} ${designTokens.typography.title.weight} ${isGradient ? 'text-white' : designTokens.typography.title.color} ${designTokens.typography.title.lineHeight} line-clamp-2 min-h-[48px]`}>
              {content.title}
            </h3>
            {content.subtitle && (
              <p className={`${designTokens.typography.subtitle.size} ${isGradient ? 'text-white text-opacity-75' : designTokens.typography.subtitle.color} min-h-[20px] mt-1`}>
                {content.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {content.description && (
          <div className={designTokens.spacing.content.marginBottom}>
            <p className={`${designTokens.typography.description.size} ${isGradient ? 'text-white text-opacity-90' : designTokens.typography.description.color} ${designTokens.typography.description.lineHeight} line-clamp-3 min-h-[60px]`}>
              {content.description}
            </p>
          </div>
        )}

        {/* Metadata */}
        {content.metadata && <CardMetadataRow metadata={content.metadata} layout={variant.layout} />}

        {/* Tags */}
        <div className="flex justify-between items-center mt-auto">
          {content.tags && content.tags.length > 0 && <CardTagList tags={content.tags} maxTags={variant.maxTags || 2} />}
        </div>
      </div>

      {/* Standard CTAs */}
      {!isGradient && (
        <CardCTARow primaryCTA={content.primaryCTA} secondaryCTA={content.secondaryCTA} actions={content.actions} title={content.title} />
      )}

      {/* Gradient layout CTA */}
      {isGradient && content.primaryCTA && (
        <div className="p-6 pt-0">
          <button
            onClick={content.primaryCTA.onClick}
            disabled={content.primaryCTA.disabled || isComingSoon}
            className={`w-full px-4 py-2 rounded-md font-medium transition-all duration-300 flex items-center justify-center ${isComingSoon ? 'bg-white text-gray-500 cursor-not-allowed' : 'bg-white text-blue-700 hover:bg-blue-50 border border-white/20'} ${isHovered && !isComingSoon ? 'opacity-100' : 'opacity-80'}`}
            aria-label={`${content.primaryCTA.text} for ${content.title}`}
          >
            {content.primaryCTA.text}
            {content.primaryCTA.icon && <span className="ml-2">{content.primaryCTA.icon}</span>}
          </button>
        </div>
      )}

      {/* Hover overlay for gradient cards */}
      {isGradient && !isComingSoon && (
        <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-500 rounded-lg"
          style={{ opacity: isHovered ? 1 : 0 }} />
      )}
    </div>
  )
}
