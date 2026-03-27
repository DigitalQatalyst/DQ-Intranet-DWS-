import React, { useState, useRef } from 'react'
import { designTokens, tagVariants } from './designTokens'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  Calendar,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  MapPin,
  Clock,
  ZoomIn,
  Building,
  TrendingUp,
  Download,
  Users,
} from 'lucide-react'
export interface MediaCardProps {
  type:
    | 'news'
    | 'blog'
    | 'video'
    | 'podcast'
    | 'event'
    | 'report'
    | 'toolkit'
    | 'infographic'
    | 'case-study'
    | 'tool'
    | 'announcement'
  title: string
  description?: string
  image?: string
  videoUrl?: string
  audioUrl?: string
  icon?: React.ReactNode
  metadata?: Record<string, string>
  badges?: string[]
  cta: {
    label: string
    href: string
  }
  secondaryCta?: {
    label: string
    href: string
    icon?: React.ReactNode
  }
  onClick?: () => void
  'data-id'?: string
}

const getCTAText = (type: string) => {
  switch (type) {
    case 'news':
    case 'blog':
      return 'Read Article'
    case 'video':
      return 'Watch Now'
    case 'podcast':
      return 'Listen Now'
    case 'event':
      return 'Register Now'
    case 'report':
      return 'Download Report'
    case 'toolkit':
      return 'Access Resource'
    case 'infographic':
      return 'View Infographic'
    case 'case-study':
      return 'Read Case Study'
    case 'tool':
      return 'Launch Tool'
    case 'announcement':
      return 'Learn More'
    default:
      return 'View Details'
  }
}

const CTA_COLORS: Record<string, string> = {
  video: 'bg-red-600 hover:bg-red-700',
  podcast: 'bg-red-600 hover:bg-red-700',
  news: 'bg-blue-600 hover:bg-blue-700',
  blog: 'bg-blue-600 hover:bg-blue-700',
  announcement: 'bg-blue-600 hover:bg-blue-700',
  event: 'bg-emerald-600 hover:bg-emerald-700',
  report: 'bg-purple-600 hover:bg-purple-700',
  toolkit: 'bg-purple-600 hover:bg-purple-700',
  'case-study': 'bg-indigo-600 hover:bg-indigo-700',
  infographic: 'bg-pink-600 hover:bg-pink-700',
  tool: 'bg-gray-600 hover:bg-gray-700',
}

const getCTAColorByType = (type: string) => CTA_COLORS[type] ?? 'bg-gray-600 hover:bg-gray-700'

const TYPE_ICONS: Record<string, React.ReactNode> = {
  video: <Play size={16} />,
  podcast: <Mic size={16} />,
  event: <Calendar size={16} />,
  report: <Download size={16} />,
  toolkit: <Download size={16} />,
  news: <FileText size={16} />,
  blog: <FileText size={16} />,
  'case-study': <FileText size={16} />,
  infographic: <ZoomIn size={16} />,
  tool: <ExternalLink size={16} />,
  announcement: <ExternalLink size={16} />,
}

const FALLBACK_ICONS: Record<string, React.ReactNode> = {
  event: <Calendar size={32} className="text-white opacity-75" />,
  report: <FileText size={32} className="text-white opacity-75" />,
  toolkit: <FileText size={32} className="text-white opacity-75" />,
  infographic: <ImageIcon size={32} className="text-white opacity-75" />,
  'case-study': <Building size={32} className="text-white opacity-75" />,
  tool: <ExternalLink size={32} className="text-white opacity-75" />,
  news: <FileText size={32} className="text-white opacity-75" />,
  blog: <FileText size={32} className="text-white opacity-75" />,
  announcement: <FileText size={32} className="text-white opacity-75" />,
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface VideoOrPodcastSectionProps {
  type: 'video' | 'podcast'
  image?: string
  title: string
  videoUrl?: string
  audioUrl?: string
  isMuted: boolean
  isHovered: boolean
  isPlaying: boolean
  videoRef: React.RefObject<HTMLVideoElement>
  audioRef: React.RefObject<HTMLAudioElement>
  metadata: Record<string, string>
  onPlayClick: (e: React.MouseEvent) => void
  onMuteClick: (e: React.MouseEvent) => void
}

function VideoOrPodcastSection({
  type, image, title, videoUrl, audioUrl, isMuted,
  isHovered, isPlaying, videoRef, audioRef, metadata,
  onPlayClick, onMuteClick,
}: VideoOrPodcastSectionProps) {
  const hasMedia = (type === 'video' && !!videoUrl) || (type === 'podcast' && !!audioUrl)
  return (
    <div className="relative w-full h-48 bg-gray-900 overflow-hidden">
      <img
        src={image || 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=225&fit=crop'}
        alt={title}
        className={`absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
      />
      {videoUrl && type === 'video' && (
        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted={isMuted} loop={false} playsInline preload="metadata">
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      {audioUrl && type === 'podcast' && (
        <audio ref={audioRef} muted={isMuted} preload="metadata">
          <source src={audioUrl} type="audio/mpeg" />
          <source src={audioUrl} type="audio/wav" />
        </audio>
      )}
      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={onPlayClick}
          className={`flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300 transform ${isHovered ? 'scale-110' : 'scale-100'} ${type === 'video' && isPlaying ? 'opacity-0' : ''} ${type === 'podcast' && isPlaying && audioUrl ? 'bg-green-500 bg-opacity-90' : ''}`}
          aria-label={isPlaying ? `Pause ${type}` : `Play ${type}`}
        >
          {type === 'video' && (isPlaying ? <Pause size={24} className="text-gray-900 ml-1" /> : <Play size={24} className="text-gray-900 ml-1" />)}
          {type === 'podcast' && (isPlaying && audioUrl ? <Pause size={24} className={isPlaying ? 'text-white' : 'text-gray-900'} /> : <Mic size={24} className="text-gray-900" />)}
        </button>
      </div>
      {/* Controls overlay */}
      {hasMedia && (isPlaying || isHovered) && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button onClick={onMuteClick} className="flex items-center justify-center w-10 h-10 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors" aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted ? <VolumeX size={16} className="text-white" /> : <Volume2 size={16} className="text-white" />}
          </button>
          <button onClick={onPlayClick} className="flex items-center justify-center w-10 h-10 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <Pause size={16} className="text-white" /> : <Play size={16} className="text-white ml-0.5" />}
          </button>
        </div>
      )}
      {metadata.duration && (
        <div className="absolute top-4 right-4 px-2 py-1 rounded bg-black bg-opacity-75 text-white text-xs font-medium">
          {metadata.duration}
        </div>
      )}
    </div>
  )
}

interface StaticMediaSectionProps {
  type: MediaCardProps['type']
  image?: string
  title: string
  metadata: Record<string, string>
  isHovered: boolean
  onCTA: (e: React.MouseEvent) => void
}

function StaticMediaSection({ type, image, title, metadata, isHovered, onCTA }: StaticMediaSectionProps) {
  return (
    <div className="relative h-48 bg-gray-200 overflow-hidden">
      {image ? (
        <img src={image} alt={title} className={`w-full h-full object-cover object-top transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`} />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          {FALLBACK_ICONS[type]}
        </div>
      )}
      {type === 'event' && metadata.date && (
        <div className="absolute top-4 right-4 px-3 py-2 rounded-lg bg-white text-emerald-600 text-sm font-bold shadow-md">{metadata.date}</div>
      )}
      {type === 'case-study' && metadata.keyMetric && (
        <div className="absolute bottom-3 right-3 px-3 py-2 rounded-lg bg-white text-indigo-600 font-bold shadow-md">
          <div className="flex items-center gap-1"><TrendingUp size={14} />{metadata.keyMetric}</div>
        </div>
      )}
      {type === 'infographic' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button onClick={onCTA} className={`flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-300 transform ${isHovered ? 'scale-110' : 'scale-100'}`} aria-label="View infographic">
            <ZoomIn size={24} className="text-gray-900" />
          </button>
        </div>
      )}
    </div>
  )
}

interface MediaMetadataSectionProps {
  type: MediaCardProps['type']
  metadata: Record<string, string>
}

function MediaMetadataSection({ type, metadata }: MediaMetadataSectionProps) {
  if (Object.keys(metadata).length === 0) return null
  if (type === 'event') {
    return (
      <div className="mb-4 flex-shrink-0 space-y-2">
        {metadata.location && <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={14} /><span>{metadata.location}</span></div>}
        {metadata.time && <div className="flex items-center gap-2 text-sm text-gray-500"><Clock size={14} /><span>{metadata.time}</span></div>}
        {metadata.attendees && <div className="flex items-center gap-2 text-sm text-gray-500"><Users size={14} /><span>{metadata.attendees} attendees</span></div>}
      </div>
    )
  }
  if (type === 'report' || type === 'toolkit') {
    return (
      <div className="mb-4 flex-shrink-0 flex justify-between items-center text-xs text-gray-500 p-2 bg-gray-50 rounded">
        <div className="flex items-center gap-2">
          {metadata.fileSize && <span>{metadata.fileSize}</span>}
          {metadata.fileSize && metadata.updated && <span>•</span>}
          {metadata.updated && <span>Updated {metadata.updated}</span>}
        </div>
        <div className="flex items-center gap-1"><Download size={12} />{metadata.downloadCount || '0'}</div>
      </div>
    )
  }
  return (
    <div className={`mb-4 flex-shrink-0 ${designTokens.typography.metadata.size} ${designTokens.typography.metadata.color} flex items-center gap-2`}>
      {metadata.date && <span>{metadata.date}</span>}
      {metadata.date && (metadata.author || metadata.speaker) && <span>•</span>}
      {(metadata.author || metadata.speaker) && <span>{metadata.author || metadata.speaker}</span>}
      {metadata.industry && <span>{metadata.industry}</span>}
      {metadata.updated && <span>Updated {metadata.updated}</span>}
    </div>
  )
}

interface MediaCTASectionProps {
  type: MediaCardProps['type']
  title: string
  isCtaDisabled: boolean
  ctaColorClass: string
  secondaryCta?: MediaCardProps['secondaryCta']
  onCTA: (e: React.MouseEvent) => void
  onSecondaryCTA: (e: React.MouseEvent) => void
}

function MediaCTASection({ type, title, isCtaDisabled, ctaColorClass, secondaryCta, onCTA, onSecondaryCTA }: MediaCTASectionProps) {
  const icon = TYPE_ICONS[type] ?? null
  if (type === 'event' && secondaryCta) {
    return (
      <div className="flex gap-2">
        <button onClick={onCTA} disabled={isCtaDisabled} aria-disabled={isCtaDisabled}
          className={`flex-1 px-4 py-3 text-sm font-bold text-white rounded-md transition-colors flex items-center justify-center gap-2 ${isCtaDisabled ? 'bg-gray-400 cursor-not-allowed' : ctaColorClass}`}
          aria-label={`Register for event: ${title}`}>
          <Calendar size={16} />Register Now
        </button>
        <button onClick={onSecondaryCTA}
          className="px-3 py-3 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors flex items-center justify-center"
          aria-label="Add to calendar">
          {secondaryCta.icon || <Calendar size={16} />}
        </button>
      </div>
    )
  }
  return (
    <button onClick={onCTA} disabled={isCtaDisabled} aria-disabled={isCtaDisabled}
      className={`w-full px-4 py-3 text-sm font-bold text-white rounded-md transition-colors flex items-center justify-center gap-2 ${isCtaDisabled ? 'bg-gray-400 cursor-not-allowed' : ctaColorClass} focus:outline-none focus:ring-2 focus:ring-[#030F35]/30`}
      aria-label={`${getCTAText(type)}: ${title}`}>
      {icon}
      {getCTAText(type)}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export const MediaCard: React.FC<MediaCardProps> = ({
  type,
  title,
  description,
  image,
  videoUrl,
  audioUrl,
  icon: _icon,
  metadata = {},
  badges = [],
  cta,
  secondaryCta,
  onClick,
  'data-id': dataId,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout>()

  const detailsHref = cta?.href || null
  const ctaColorClass = 'bg-[#030F35] hover:bg-[#021028]'
  const isCtaDisabled = !detailsHref

  const tags = badges.slice(0, 2).map((badge, index) => ({
    text: badge,
    variant: (index === 0 ? 'primary' : 'info') as const,
  }))

  const scheduleAutoPause = (ref: React.RefObject<HTMLVideoElement | HTMLAudioElement>) => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (ref.current) { ref.current.pause(); setIsPlaying(false) }
    }, 10000)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (videoRef.current && videoUrl && type === 'video') {
      videoRef.current.play(); setIsPlaying(true)
      scheduleAutoPause(videoRef as React.RefObject<HTMLVideoElement>)
    }
    if (audioRef.current && audioUrl && type === 'podcast') {
      audioRef.current.play(); setIsPlaying(true)
      scheduleAutoPause(audioRef as React.RefObject<HTMLAudioElement>)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; setIsPlaying(false) }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; setIsPlaying(false) }
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (type === 'video' && videoRef.current) {
      if (isPlaying) { videoRef.current.pause(); setIsPlaying(false) }
      else { videoRef.current.play(); setIsPlaying(true) }
    }
    if (type === 'podcast' && audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false) }
      else { audioRef.current.play(); setIsPlaying(true) }
    }
  }

  const handleMuteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (type === 'video' && videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted) }
    if (type === 'podcast' && audioRef.current) { audioRef.current.muted = !isMuted; setIsMuted(!isMuted) }
  }

  const handleNavigation = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!detailsHref) return
    if (onClick) onClick()
    else window.location.href = detailsHref
  }

  const handleCTA = (e: React.MouseEvent) => handleNavigation(e)
  const handleCardClick = () => handleNavigation()
  const handleSecondaryCTA = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (secondaryCta) window.location.href = secondaryCta.href
  }

  const isVideoOrPodcast = type === 'video' || type === 'podcast'

  return (
    <div
      className={`flex flex-col h-full bg-white ${designTokens.visual.borderRadius} ${designTokens.visual.shadow.default} overflow-hidden transition-all duration-300 ${isHovered ? 'shadow-xl -translate-y-1' : designTokens.visual.shadow.hover} ${detailsHref ? 'cursor-pointer' : ''}`}
      onClick={detailsHref ? handleCardClick : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-id={dataId}
      role={detailsHref ? 'button' : undefined}
      tabIndex={detailsHref ? 0 : undefined}
      onKeyDown={detailsHref ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick() } } : undefined}
      aria-label={detailsHref ? `${type} card: ${title}` : undefined}
    >
      {/* Media Section */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden flex-shrink-0">
        {isVideoOrPodcast ? (
          <VideoOrPodcastSection
            type={type as 'video' | 'podcast'} image={image} title={title}
            videoUrl={videoUrl} audioUrl={audioUrl} isMuted={isMuted}
            isHovered={isHovered} isPlaying={isPlaying}
            videoRef={videoRef} audioRef={audioRef} metadata={metadata}
            onPlayClick={handlePlayClick} onMuteClick={handleMuteClick}
          />
        ) : (
          <StaticMediaSection type={type} image={image} title={title} metadata={metadata} isHovered={isHovered} onCTA={handleCTA} />
        )}
      </div>

      {/* Content Section */}
      <div className={`${designTokens.spacing.card.padding} flex flex-col flex-grow`}>
        <div className="mb-4 flex-shrink-0">
          <h3 className={`${designTokens.typography.title.size} ${designTokens.typography.title.weight} ${designTokens.typography.title.color} ${designTokens.typography.title.lineHeight} line-clamp-2 mb-2`} style={{ minHeight: 'calc(2 * 1.375rem)' }}>
            {title}
          </h3>
          {description && (
            <p className={`${designTokens.typography.description.size} ${designTokens.typography.description.color} ${designTokens.typography.description.lineHeight} line-clamp-2 mb-3`} style={{ minHeight: 'calc(2 * 1.25rem)' }}>
              {description}
            </p>
          )}
        </div>

        <MediaMetadataSection type={type} metadata={metadata} />

        {/* CTA Buttons */}
        <div className="mt-auto flex-shrink-0">
          <MediaCTASection
            type={type} title={title} isCtaDisabled={isCtaDisabled}
            ctaColorClass={ctaColorClass} secondaryCta={secondaryCta}
            onCTA={handleCTA} onSecondaryCTA={handleSecondaryCTA}
          />
        </div>
      </div>
    </div>
  )
}
