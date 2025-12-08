import React, { useCallback, useEffect, useState, useRef, lazy } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  BookmarkIcon,
  Calendar,
  Clock,
  MapPin,
  Download,
  ChevronRightIcon,
  HomeIcon,
  ExternalLinkIcon,
  PlayCircleIcon,
  MicIcon,
  FileTextIcon,
  CalendarDaysIcon,
  MegaphoneIcon,
  Building,
  AlertCircleIcon,
  Volume2Icon,
  VolumeXIcon,
  Loader,
} from 'lucide-react'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { MediaCard } from '../../components/Cards/MediaCard'
import { getFallbackKnowledgeHubItems } from '../../utils/fallbackData'
import {
  getVideoDuration,
  VideoDurationInfo,
  formatDuration,
  getVideoPosterUrl,
} from '../../utils/videoUtils'
import {
  getAudioUrl,
  getVideoUrl,
  getPosterUrl,
  getDuration,
  isAudioItem,
  isVideoItem,
} from '../../utils/mediaSelectors'
// Helper function to resolve the primary audio URL
const resolveAudioUrl = (item: any): string | null => {
  return getAudioUrl(item)
}
// Helper function to resolve the primary video URL
const resolveVideoUrl = (item: any): string | null => {
  return getVideoUrl(item)
}
const MediaDetailPage: React.FC = () => {
  const { type, id } = useParams<{
    type: string
    id: string
  }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<any | null>(null)
  const [relatedItems, setRelatedItems] = useState<any[]>([])
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.75)
  const [audioAvailable, setAudioAvailable] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)
  const audioInitializedRef = useRef(false)
  // Video player state
  const [videoAvailable, setVideoAvailable] = useState(true)
  const [videoLoading, setVideoLoading] = useState(true)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isClientSide, setIsClientSide] = useState(false)
  const [isStreamingSource, setIsStreamingSource] = useState(false)
  const [videoDuration, setVideoDuration] = useState<VideoDurationInfo>({
    seconds: 0,
    formatted: '',
    available: false,
  })
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const videoUrlRef = useRef<string | null>(null)
  const videoInitializedRef = useRef(false)
  // Check if we're on the client side to avoid SSR hydration issues
  useEffect(() => {
    setIsClientSide(true)
  }, [])
  useEffect(() => {
    const fetchMediaDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        // In a real app, this would be an API call
        // For now, we'll use the fallback data
        const allItems = getFallbackKnowledgeHubItems()
        const foundItem = allItems.find((item) => item.id === id)
        if (foundItem) {
          setItem(foundItem)
          // Get related items (same type, different ID)
          const related = allItems
            .filter(
              (item) =>
                item.id !== id &&
                item.mediaType.toLowerCase().replace(/\s+/g, '-') === type,
            )
            .slice(0, 3) // Only take the first 3
          setRelatedItems(related)
        } else {
          setError('Media not found')
        }
      } catch (err) {
        console.error('Error fetching media details:', err)
        setError('Failed to load media details')
      } finally {
        setLoading(false)
      }
    }
    if (id) {
      fetchMediaDetails()
    }
  }, [id, type])
  // Client-side only initialization of video player
  useEffect(() => {
    // Only run on the client side
    if (!isClientSide) return
    // Reset video state when item changes
    if (isVideoPlaying) {
      setIsVideoPlaying(false)
    }
    setVideoLoading(true)
    setVideoError(null)
    videoInitializedRef.current = false
    // Initialize video if it's a video type
    if (isVideoItem(item)) {
      const initializeVideo = async () => {
        try {
          // Resolve video URL using our selector
          const videoUrl = getVideoUrl(item)
          if (!videoUrl) {
            setVideoAvailable(false)
            setVideoLoading(false)
            return
          }
          videoUrlRef.current = videoUrl
          // Check if it's a streaming source (HLS or DASH)
          const isStreaming =
            videoUrl.includes('.m3u8') || videoUrl.includes('.mpd')
          setIsStreamingSource(isStreaming)
          // Get initial duration from metadata using our selector
          const durationInfo = getDuration(item)
          setVideoDuration(durationInfo)
          // Mark video as available
          setVideoAvailable(true)
          setVideoLoading(false)
          videoInitializedRef.current = true
        } catch (err) {
          console.error('Error initializing video:', err)
          setVideoError('Failed to initialize video player')
          setVideoAvailable(false)
          setVideoLoading(false)
        }
      }
      initializeVideo()
    }
    // Cleanup function
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ''
        videoRef.current.load()
      }
    }
  }, [item, isClientSide])
  // Add event listeners to video element when it's available
  useEffect(() => {
    if (!videoRef.current || !isClientSide) return
    const video = videoRef.current
    const handlePlay = () => setIsVideoPlaying(true)
    const handlePause = () => setIsVideoPlaying(false)
    const handleEnded = () => setIsVideoPlaying(false)
    const handleError = (e: Event) => {
      console.error('Video playback error:', e)
      setVideoError('Error playing video. Please try again.')
      setVideoAvailable(false)
    }
    const handleLoadStart = () => setVideoLoading(true)
    const handleCanPlay = () => setVideoLoading(false)
    const handleLoadedMetadata = () => {
      // Update duration from video element if needed using our selector
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        const updatedDuration = getDuration(item, video)
        setVideoDuration(updatedDuration)
      }
    }
    // Add event listeners
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    // Cleanup function
    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [videoRef.current, isClientSide, item])
  // Client-side only initialization of audio player
  useEffect(() => {
    // Reset player state when item changes
    if (isPlaying) {
      setIsPlaying(false)
    }
    setCurrentTime(0)
    setDuration(0)
    // Check if audio is available for this item using our selector
    if (item) {
      const audioUrl = getAudioUrl(item)
      audioUrlRef.current = audioUrl
      setAudioAvailable(!!audioUrl)
      // Reset the initialization flag when item changes
      audioInitializedRef.current = false
    }
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current.load()
      }
    }
  }, [item])
  // Initialize audio element on client-side only
  const initializeAudioPlayer = useCallback(() => {
    if (
      !audioInitializedRef.current &&
      audioUrlRef.current &&
      !audioRef.current
    ) {
      // Create audio element
      const audio = new Audio()
      // Add event listeners
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime)
      })
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
      })
      audio.addEventListener('ended', () => {
        setIsPlaying(false)
      })
      audio.addEventListener('error', () => {
        console.error('Audio error:', audio.error)
        setAudioAvailable(false)
      })
      // Set volume
      audio.volume = volume
      // Set source
      audio.src = audioUrlRef.current
      audio.load()
      // Store reference
      audioRef.current = audio
      audioInitializedRef.current = true
    }
    return () => {
      if (audioRef.current) {
        const audio = audioRef.current
        audio.pause()
        audio.removeEventListener('timeupdate', () => {})
        audio.removeEventListener('loadedmetadata', () => {})
        audio.removeEventListener('ended', () => {})
        audio.removeEventListener('error', () => {})
      }
    }
  }, [volume])
  // Handle video play button click
  const handlePlayVideo = useCallback(() => {
    if (!videoRef.current || !videoUrlRef.current || !videoAvailable) return
    try {
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoPlaying(true)
            setVideoLoading(false)
          })
          .catch((err) => {
            console.error('Error playing video:', err)
            // Most likely a user interaction issue (autoplay policy)
            if (err.name === 'NotAllowedError') {
              setVideoError('Playback requires user interaction')
            } else {
              setVideoError('Error playing video')
            }
          })
      }
    } catch (err) {
      console.error('Error starting video playback:', err)
      setVideoError('Failed to start video playback')
    }
  }, [videoAvailable])
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // In a real app, this would call an API to update the bookmark status
  }
  // Audio player functions
  const togglePlayPause = useCallback(() => {
    if (!audioAvailable) return
    // Initialize audio player on first interaction if needed
    if (!audioInitializedRef.current) {
      initializeAudioPlayer()
    }
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Error playing audio:', err)
          setAudioAvailable(false)
        })
    }
  }, [audioAvailable, isPlaying, initializeAudioPlayer])
  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return '0:00'
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current || !audioAvailable) return
      const progressBar = e.currentTarget
      const clickPosition = e.clientX - progressBar.getBoundingClientRect().left
      const progressBarWidth = progressBar.clientWidth
      const seekTime = (clickPosition / progressBarWidth) * duration
      audioRef.current.currentTime = seekTime
      setCurrentTime(seekTime)
    },
    [audioAvailable, duration],
  )
  const skipBackward = useCallback(
    (seconds: number) => {
      if (!audioRef.current || !audioAvailable) return
      const newTime = Math.max(audioRef.current.currentTime - seconds, 0)
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    },
    [audioAvailable],
  )
  const skipForward = useCallback(
    (seconds: number) => {
      if (!audioRef.current || !audioAvailable) return
      const newTime = Math.min(audioRef.current.currentTime + seconds, duration)
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    },
    [audioAvailable, duration],
  )
  const handleVolumeChange = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current || !audioAvailable) return
      const volumeBar = e.currentTarget
      const clickPosition = e.clientX - volumeBar.getBoundingClientRect().left
      const volumeBarWidth = volumeBar.clientWidth
      const newVolume = Math.max(0, Math.min(1, clickPosition / volumeBarWidth))
      audioRef.current.volume = newVolume
      setVolume(newVolume)
    },
    [audioAvailable],
  )
  const toggleMute = useCallback(() => {
    if (!audioRef.current || !audioAvailable) return
    if (audioRef.current.volume > 0) {
      audioRef.current.volume = 0
      setVolume(0)
    } else {
      audioRef.current.volume = 0.75
      setVolume(0.75)
    }
  }, [audioAvailable])
  // Add keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard events if we're on a podcast page
      if (type !== 'podcast' || !audioAvailable) return
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault() // Prevent scrolling with spacebar
          togglePlayPause()
          break
        case 'ArrowRight':
          skipForward(10)
          break
        case 'ArrowLeft':
          skipBackward(10)
          break
        case 'm':
          toggleMute()
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [
    type,
    audioAvailable,
    togglePlayPause,
    skipForward,
    skipBackward,
    toggleMute,
  ])
  // Get the icon based on media type
  const getMediaTypeIcon = () => {
    if (!type) return null
    switch (type.toLowerCase()) {
      case 'news':
      case 'blog':
        return <FileTextIcon size={20} className="text-blue-600" />
      case 'video':
        return <PlayCircleIcon size={20} className="text-blue-600" />
      case 'podcast':
        return <MicIcon size={20} className="text-blue-600" />
      case 'report':
      case 'guide':
      case 'toolkits-templates':
      case 'infographic':
        return <FileTextIcon size={20} className="text-blue-600" />
      case 'event':
        return <CalendarDaysIcon size={20} className="text-blue-600" />
      case 'announcement':
        return <MegaphoneIcon size={20} className="text-blue-600" />
      default:
        return <FileTextIcon size={20} className="text-blue-600" />
    }
  }
  // Get the primary CTA text based on media type
  const getPrimaryCTAText = () => {
    if (!type) return 'View Details'
    switch (type.toLowerCase()) {
      case 'news':
      case 'blog':
        return 'Read Full Article'
      case 'video':
        return 'Watch Full Video'
      case 'podcast':
        return 'Listen to Full Episode'
      case 'report':
      case 'guide':
      case 'toolkits-templates':
      case 'infographic':
        return 'Download Now'
      case 'event':
        return 'Register Now'
      case 'announcement':
        return 'View Full Announcement'
      default:
        return 'View Full Details'
    }
  }
  // Get the media type label
  const getMediaTypeLabel = () => {
    if (!type) return 'Media'
    switch (type.toLowerCase()) {
      case 'news':
        return 'News Article'
      case 'blog':
        return 'Blog Post'
      case 'video':
        return 'Video'
      case 'podcast':
        return 'Podcast Episode'
      case 'report':
        return 'Report'
      case 'guide':
        return 'Guide'
      case 'toolkits-templates':
        return 'Toolkit & Templates'
      case 'infographic':
        return 'Infographic'
      case 'event':
        return 'Event'
      case 'announcement':
        return 'Announcement'
      default:
        return 'Media'
    }
  }
  // Render content based on media type
  const renderMediaContent = () => {
    if (!item || !type) return null
    switch (type.toLowerCase()) {
      case 'news':
      case 'blog':
        return (
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {item.description}
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Abu Dhabi's business landscape continues to evolve, offering
              unprecedented opportunities for enterprises at every stage of
              development. The recent initiatives announced by the government
              are set to transform how businesses operate within the emirate.
            </p>
            {item.imageUrl && (
              <div className="my-8">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full rounded-lg shadow-md"
                />
                <p className="text-sm text-gray-500 mt-2 italic">
                  Image: {item.title} - Courtesy of {item.provider.name}
                </p>
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4">
              Key Developments
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              The new framework provides substantial benefits for businesses,
              particularly in the areas of licensing, financing, and market
              access. Companies can now leverage these advantages to accelerate
              their growth trajectories.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Industry experts predict that these changes will particularly
              benefit SMEs and startups, creating a more dynamic ecosystem for
              innovation and entrepreneurship.
            </p>
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6">
              "These initiatives represent a significant step forward in Abu
              Dhabi's economic diversification strategy. Businesses that take
              advantage of these opportunities will be well-positioned for
              success in the coming years." - Economic Analyst
            </blockquote>
            <p className="text-gray-700 leading-relaxed">
              For more information on how these developments might affect your
              business, contact the Abu Dhabi Department of Economic Development
              or visit their official website.
            </p>
          </div>
        )
      case 'video':
        return (
          <div>
            <div className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-lg mb-6 overflow-hidden">
              <div className="relative w-full h-full">
                {videoAvailable ? (
                  <>
                    {/* Video player with poster overlay */}
                    <div
                      className={`absolute inset-0 z-10 ${isVideoPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}
                    >
                      <img
                        src={getPosterUrl(item)}
                        alt={`Thumbnail for ${item.title}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Dark overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30"></div>
                      {/* Play button overlay */}
                      <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={handlePlayVideo}
                        role="button"
                        tabIndex={0}
                        aria-label="Play video"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handlePlayVideo()
                          }
                        }}
                      >
                        <div className="flex items-center justify-center w-20 h-20 bg-blue-600/90 rounded-full shadow-lg backdrop-blur-sm group-hover:bg-blue-700">
                          {videoLoading ? (
                            <Loader
                              size={48}
                              className="text-white animate-spin"
                            />
                          ) : (
                            <PlayCircleIcon
                              size={48}
                              className="text-white ml-1"
                            />
                          )}
                        </div>
                      </div>
                      {/* Duration badge - Only show if duration is available */}
                      {videoDuration.available && (
                        <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-full text-white text-sm backdrop-blur-sm">
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            <span>{videoDuration.formatted}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Video element with controls */}
                    {isClientSide && (
                      <video
                        ref={videoRef}
                        src={
                          isStreamingSource
                            ? undefined
                            : videoUrlRef.current || undefined
                        }
                        className="w-full h-full object-cover rounded-lg aspect-video"
                        controls
                        controlsList="nodownload"
                        preload="metadata"
                        poster={getPosterUrl(item)}
                        playsInline
                        loading="lazy"
                        onLoadedMetadata={() => {
                          // Update duration from video element when metadata is loaded
                          if (
                            videoRef.current &&
                            videoRef.current.duration &&
                            !isNaN(videoRef.current.duration) &&
                            videoRef.current.duration > 0
                          ) {
                            const updatedDuration = getDuration(
                              item,
                              videoRef.current,
                            )
                            setVideoDuration(updatedDuration)
                          }
                        }}
                        onDurationChange={() => {
                          // This event fires when the duration attribute has been updated
                          if (
                            videoRef.current &&
                            videoRef.current.duration &&
                            !isNaN(videoRef.current.duration) &&
                            videoRef.current.duration > 0
                          ) {
                            const updatedDuration = getDuration(
                              item,
                              videoRef.current,
                            )
                            setVideoDuration(updatedDuration)
                          } else {
                            // If duration is invalid, reset to unavailable state
                            setVideoDuration({
                              seconds: 0,
                              formatted: '',
                              available: false,
                            })
                          }
                        }}
                        onError={() => {
                          // If there's an error loading the video, reset the duration
                          setVideoDuration({
                            seconds: 0,
                            formatted: '',
                            available: false,
                          })
                        }}
                      >
                        {/* Add caption/subtitle track if available */}
                        {item.captionsUrl && (
                          <track
                            kind="subtitles"
                            src={item.captionsUrl}
                            srcLang="en"
                            label="English"
                            default
                          />
                        )}
                        {/* For HLS streaming sources */}
                        {isStreamingSource &&
                          videoUrlRef.current &&
                          videoUrlRef.current.includes('.m3u8') && (
                            <source
                              src={videoUrlRef.current}
                              type="application/x-mpegURL"
                            />
                          )}
                        {/* For DASH streaming sources */}
                        {isStreamingSource &&
                          videoUrlRef.current &&
                          videoUrlRef.current.includes('.mpd') && (
                            <source
                              src={videoUrlRef.current}
                              type="application/dash+xml"
                            />
                          )}
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {/* Loading overlay */}
                    {videoLoading && isVideoPlaying && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                        <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
                          <Loader
                            size={48}
                            className="text-white animate-spin"
                          />
                        </div>
                      </div>
                    )}
                    {/* Error message */}
                    {videoError && (
                      <div className="absolute bottom-4 right-4 bg-red-500/80 text-white px-4 py-2 rounded-md backdrop-blur-sm z-20">
                        {videoError}
                      </div>
                    )}
                  </> /* Video unavailable state */
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 h-full bg-gray-800">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center shadow-lg mb-6">
                      <AlertCircleIcon
                        size={32}
                        className="text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-white text-xl font-medium mb-2">
                      Video Unavailable
                    </h3>
                    <p className="text-gray-300 mb-6 max-w-md">
                      We couldn't load the video for this content. The file
                      might be unavailable or in an unsupported format.
                    </p>
                    <button
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={() => navigate(-1)}
                    >
                      Return to Previous Page
                    </button>
                  </div>
                )}
              </div>
            </div>
            {videoAvailable && (
              <>
                {/* Interactive transcript highlights */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FileTextIcon size={18} className="mr-2 text-blue-600" />
                    Transcript Highlights
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        time: '00:45',
                        title: "Introduction to Abu Dhabi's business ecosystem",
                      },
                      {
                        time: '03:12',
                        title: 'Key growth sectors and opportunities',
                      },
                      {
                        time: '08:27',
                        title: 'Government support initiatives for businesses',
                      },
                      {
                        time: '15:33',
                        title: 'Case studies of successful enterprises',
                      },
                      {
                        time: '21:05',
                        title: 'Practical steps for business development',
                      },
                    ].map((highlight, index) => (
                      <button
                        key={index}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-start group"
                        onClick={() => {
                          if (videoRef.current) {
                            // Parse time string to seconds
                            const [min, sec] = highlight.time
                              .split(':')
                              .map(Number)
                            const timeInSeconds = min * 60 + sec
                            // Set current time and play
                            videoRef.current.currentTime = timeInSeconds
                            handlePlayVideo()
                          }
                        }}
                      >
                        <div className="flex-shrink-0 w-16 text-blue-600 font-medium">
                          {highlight.time}
                        </div>
                        <div className="flex-grow">{highlight.title}</div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircleIcon size={18} className="text-blue-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Video description */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Video Description
                  </h2>
                  <p className="text-gray-700 mb-4">{item.description}</p>
                  <p className="text-gray-700">
                    In this insightful video, experts discuss the latest trends
                    and opportunities in Abu Dhabi's business landscape. Learn
                    about key strategies for growth and how to leverage
                    available resources.
                  </p>
                </div>
              </>
            )}
          </div>
        )
      case 'podcast':
        return (
          <div className="relative overflow-hidden rounded-xl mb-8">
            {/* Episode artwork as background with overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-sm"
              style={{
                backgroundImage: `url(${item.imageUrl || 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'})`,
                filter: 'brightness(0.3)',
              }}
            ></div>
            {/* Audio player content */}
            <div className="relative z-10 p-6 md:p-8 flex flex-col items-center">
              {/* Episode artwork (non-blurred version) */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden shadow-lg mb-6">
                <img
                  src={
                    item.imageUrl ||
                    'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {audioAvailable ? (
                <>
                  {/* Large play button */}
                  <button
                    className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg mb-6 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={togglePlayPause}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                    ) : (
                      <PlayCircleIcon size={36} aria-hidden="true" />
                    )}
                  </button>
                  {/* Current timestamp - prominently displayed */}
                  <div className="text-white text-xl font-medium mb-4">
                    <span aria-live="polite">{formatTime(currentTime)}</span> /{' '}
                    <span>{formatTime(duration)}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full max-w-2xl mb-4">
                    <div
                      className="h-3 bg-gray-700 bg-opacity-60 rounded-full w-full relative cursor-pointer"
                      onClick={handleProgressClick}
                      role="slider"
                      aria-label="Audio progress"
                      aria-valuemin={0}
                      aria-valuemax={duration || 100}
                      aria-valuenow={currentTime}
                      aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowRight') {
                          e.preventDefault()
                          skipForward(5)
                        } else if (e.key === 'ArrowLeft') {
                          e.preventDefault()
                          skipBackward(5)
                        }
                      }}
                    >
                      <div
                        className="h-3 bg-blue-600 rounded-full relative"
                        style={{
                          width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                        }}
                      >
                        {/* Draggable handle */}
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md"></div>
                      </div>
                    </div>
                  </div>
                  {/* Additional controls */}
                  <div className="flex items-center justify-center space-x-6 mt-2">
                    {/* Rewind 15s */}
                    <button
                      className="p-2 text-white hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                      onClick={() => skipBackward(15)}
                      aria-label="Rewind 15 seconds"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M11 17l-5-5 5-5"></path>
                        <path d="M18 17l-5-5 5-5"></path>
                      </svg>
                    </button>
                    {/* Previous */}
                    <button
                      className="p-2 text-white hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                      aria-label="Previous episode"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polygon points="19 20 9 12 19 4 19 20"></polygon>
                        <line x1="5" y1="19" x2="5" y2="5"></line>
                      </svg>
                    </button>
                    {/* Play/Pause (mobile version) */}
                    <button
                      className="md:hidden p-2 text-white hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                      onClick={togglePlayPause}
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect x="6" y="4" width="4" height="16"></rect>
                          <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                      ) : (
                        <PlayCircleIcon size={32} aria-hidden="true" />
                      )}
                    </button>
                    {/* Next */}
                    <button
                      className="p-2 text-white hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                      aria-label="Next episode"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polygon points="5 4 15 12 5 20 5 4"></polygon>
                        <line x1="19" y1="5" x2="19" y2="19"></line>
                      </svg>
                    </button>
                    {/* Forward 15s */}
                    <button
                      className="p-2 text-white hover:text-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
                      onClick={() => skipForward(15)}
                      aria-label="Forward 15 seconds"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M13 17l5-5-5-5"></path>
                        <path d="M6 17l5-5-5-5"></path>
                      </svg>
                    </button>
                  </div>
                  {/* Volume control */}
                  <div className="flex items-center mt-4 space-x-2">
                    <button
                      onClick={toggleMute}
                      className="text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1"
                      aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                    >
                      {volume === 0 ? (
                        <VolumeXIcon size={20} aria-hidden="true" />
                      ) : (
                        <Volume2Icon size={20} aria-hidden="true" />
                      )}
                    </button>
                    <div
                      className="w-24 h-2 bg-gray-700 bg-opacity-60 rounded-full cursor-pointer"
                      onClick={handleVolumeChange}
                      role="slider"
                      aria-label="Volume"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={volume * 100}
                      aria-valuetext={`Volume ${Math.round(volume * 100)}%`}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (!audioRef.current) return
                        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                          e.preventDefault()
                          const newVolume = Math.min(1, volume + 0.1)
                          audioRef.current.volume = newVolume
                          setVolume(newVolume)
                        } else if (
                          e.key === 'ArrowLeft' ||
                          e.key === 'ArrowDown'
                        ) {
                          e.preventDefault()
                          const newVolume = Math.max(0, volume - 0.1)
                          audioRef.current.volume = newVolume
                          setVolume(newVolume)
                        }
                      }}
                    >
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{
                          width: `${volume * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  {/* Keyboard shortcuts info */}
                  <div className="mt-6 text-gray-300 text-sm">
                    <p className="text-center">
                      Keyboard shortcuts: Space/K (play/pause), ← → (seek), M
                      (mute)
                    </p>
                  </div>
                </> /* Audio unavailable state */
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center shadow-lg mb-6">
                    <AlertCircleIcon
                      size={32}
                      className="text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-white text-xl font-medium mb-2">
                    Audio Unavailable
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-md">
                    We couldn't load the audio for this episode. The file might
                    be unavailable or in an unsupported format.
                  </p>
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => navigate(-1)}
                  >
                    Return to Previous Page
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      case 'report':
      case 'guide':
      case 'toolkits-templates':
      case 'infographic':
        return (
          <div>
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="md:w-2/3">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Overview
                </h2>
                <p className="text-gray-700 mb-4">{item.description}</p>
                <p className="text-gray-700 mb-4">
                  This comprehensive resource provides valuable insights and
                  practical tools for businesses operating in Abu Dhabi. Whether
                  you're looking to establish, grow, or transform your
                  enterprise, this document offers actionable guidance tailored
                  to the local business environment.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Key Highlights
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="text-blue-600 mr-2">•</div>
                      <span className="text-gray-700">
                        Market analysis and growth projections for key sectors
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-600 mr-2">•</div>
                      <span className="text-gray-700">
                        Regulatory framework and compliance guidelines
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-600 mr-2">•</div>
                      <span className="text-gray-700">
                        Strategic planning templates and financial models
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="text-blue-600 mr-2">•</div>
                      <span className="text-gray-700">
                        Case studies of successful business implementations
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Document Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span className="text-gray-900 font-medium">PDF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pages:</span>
                    <span className="text-gray-900 font-medium">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">File Size:</span>
                    <span className="text-gray-900 font-medium">
                      {item.fileSize || '4.2 MB'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-gray-900 font-medium">
                      {item.date || 'January 2024'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Downloads:</span>
                    <span className="text-gray-900 font-medium">
                      {item.downloadCount || '1,247'}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md flex items-center justify-center">
                      <Download size={18} className="mr-2" />
                      Download Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                Table of Contents
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">1.</span> Executive Summary
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">2.</span> Market Overview and
                  Opportunities
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">3.</span> Regulatory Framework
                  and Compliance
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">4.</span> Strategic Planning and
                  Implementation
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">5.</span> Financial Models and
                  Projections
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">6.</span> Case Studies and
                  Success Stories
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">7.</span> Resources and Further
                  Reading
                </p>
              </div>
            </div>
          </div>
        )
      case 'event':
        return (
          <div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden mb-8">
              <div className="p-8 text-white">
                <div className="flex items-center mb-4">
                  <CalendarDaysIcon size={24} className="mr-2" />
                  <span className="font-bold">
                    {item.date || 'June 15-16, 2023'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                <div className="flex items-center mb-4">
                  <MapPin size={20} className="mr-2" />
                  <span>
                    {item.location || 'Abu Dhabi National Exhibition Centre'}
                  </span>
                </div>
                <p className="mb-6">{item.description}</p>
                <button className="px-6 py-2 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50">
                  Register Now
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Event Details
                </h3>
                <div className="space-y-3">
                  <div className="flex">
                    <Calendar
                      size={18}
                      className="text-blue-600 mr-3 flex-shrink-0"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Date & Time</p>
                      <p className="text-gray-700">
                        {item.date || 'June 15-16, 2023'}, 9:00 AM - 5:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <MapPin
                      size={18}
                      className="text-blue-600 mr-3 flex-shrink-0"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-700">
                        {item.location ||
                          'Abu Dhabi National Exhibition Centre'}
                      </p>
                      <p className="text-gray-700">Hall 5, Gate 3</p>
                    </div>
                  </div>
                  <div className="flex">
                    <FileTextIcon
                      size={18}
                      className="text-blue-600 mr-3 flex-shrink-0"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Registration</p>
                      <p className="text-gray-700">
                        Free for Abu Dhabi business license holders
                      </p>
                      <p className="text-gray-700">AED 500 for others</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Organizer</h3>
                <div className="flex items-start">
                  {item.provider?.logoUrl && (
                    <img
                      src={item.provider.logoUrl}
                      alt={item.provider.name}
                      className="w-16 h-16 object-contain rounded-md mr-4"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.provider?.name || 'Abu Dhabi Chamber of Commerce'}
                    </p>
                    <p className="text-gray-700 mb-2">
                      Supporting business growth and economic development in Abu
                      Dhabi.
                    </p>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      Visit Website
                      <ExternalLinkIcon size={16} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Event Agenda</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">Day 1 - June 15</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex">
                      <span className="text-gray-500 w-20">9:00 AM</span>
                      <span className="text-gray-700">
                        Registration & Welcome Coffee
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-20">10:00 AM</span>
                      <span className="text-gray-700">
                        Opening Ceremony & Keynote Address
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-20">11:30 AM</span>
                      <span className="text-gray-700">
                        Panel Discussion: Business Growth Opportunities
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-20">1:00 PM</span>
                      <span className="text-gray-700">Networking Lunch</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-20">2:30 PM</span>
                      <span className="text-gray-700">
                        Workshop Sessions (Multiple Tracks)
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-20">5:00 PM</span>
                      <span className="text-gray-700">
                        Day 1 Closing Remarks
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Day 2 - June 16</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex">
                      <span className="text-gray-500 w-20">9:30 AM</span>
                      <span className="text-gray-700">
                        Industry Roundtables
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-20">11:00 AM</span>
                      <span className="text-gray-700">
                        Presentation: Market Insights & Trends
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-20">12:30 PM</span>
                      <span className="text-gray-700">Networking Lunch</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-20">2:00 PM</span>
                      <span className="text-gray-700">
                        One-on-One Business Matchmaking
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-20">4:30 PM</span>
                      <span className="text-gray-700">
                        Closing Ceremony & Next Steps
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'announcement':
        return (
          <div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">
                Important Announcement
              </h2>
              <p className="text-gray-700">{item.description}</p>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6 leading-relaxed">
                We are pleased to inform all stakeholders about this important
                development that will impact the business community in Abu
                Dhabi. This announcement represents a significant step forward
                in our ongoing efforts to support enterprise growth and
                innovation.
              </p>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                What This Means For You
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Businesses operating in Abu Dhabi can expect several benefits
                from this announcement, including streamlined processes,
                enhanced support services, and new opportunities for growth and
                expansion.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                The implementation timeline will begin next month, with full
                rollout expected to be completed by the end of the quarter.
                During this transition period, additional resources will be
                available to assist businesses with any adjustments needed.
              </p>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Next Steps
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We encourage all business owners and managers to review the
                detailed information provided on our official website.
                Additionally, a series of informational webinars will be
                conducted in the coming weeks to address questions and provide
                further clarification.
              </p>
              <p className="text-gray-700 leading-relaxed">
                For specific inquiries, please contact our dedicated support
                team at support@example.com or call our hotline at
                +971-2-XXX-XXXX during business hours.
              </p>
            </div>
          </div>
        )
      default:
        return (
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6">{item.description}</p>
            <p className="text-gray-700">
              No additional content available for this media type.
            </p>
          </div>
        )
    }
  }
  // Get card type for related items
  const getCardType = (mediaType: string) => {
    switch (mediaType.toLowerCase()) {
      case 'news':
        return 'news'
      case 'blog':
        return 'blog'
      case 'event':
        return 'event'
      case 'video':
        return 'video'
      case 'podcast':
        return 'podcast'
      case 'report':
      case 'guide':
      case 'toolkits & templates':
      case 'infographic':
        return 'resource'
      case 'announcement':
        return 'announcement'
      default:
        return 'resource'
    }
  }
  // Get additional props for related items
  const getAdditionalProps = (item: any) => {
    const type = getCardType(item.mediaType)
    switch (type) {
      case 'news':
      case 'blog':
        return {
          source: item.provider.name,
          date: item.date,
        }
      case 'event':
        return {
          location: item.location,
          date: item.date,
          organizer: item.provider.name,
          isUpcoming: new Date(item.date) > new Date(),
        }
      case 'video':
      case 'podcast':
        return {
          source: item.provider.name,
          date: item.date,
          duration: item.duration,
        }
      case 'resource':
        return {
          resourceType: item.mediaType,
          downloadCount: item.downloadCount,
          fileSize: item.fileSize,
          lastUpdated: item.date,
        }
      case 'announcement':
        return {
          source: item.provider.name,
          date: item.date,
        }
      default:
        return {}
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[300px] flex-grow">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    )
  }
  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <div className="container mx-auto px-4 py-8 flex-grow">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error || 'Media not found'}
            </h2>
            <p className="text-gray-600 mb-6">
              The requested media item could not be found or is no longer
              available.
            </p>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block"
            >
              Return to Home
            </Link>
          </div>
        </div>
        <Footer isLoggedIn={false} />
      </div>
    )
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Breadcrumbs */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2">
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
                    <Link
                      to="/marketplace/guides"
                      className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2"
                    >
                      Guides
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRightIcon size={16} className="text-gray-400" />
                    <span className="ml-1 text-gray-500 md:ml-2">
                      {getMediaTypeLabel()}
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            {/* Full-width hero content */}
            <div className="w-full">
              {/* Media Type Badge */}
              <div className="flex items-center mb-4">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {getMediaTypeIcon()}
                  <span className="ml-1">{getMediaTypeLabel()}</span>
                </span>
              </div>
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight max-w-4xl">
                {item.title}
              </h1>
              {/* Provider information - moved from sidebar and made compact - Logo removed */}
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 mb-4 flex items-center">
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {item.provider?.name || 'Unknown Provider'}
                    </h3>
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center ml-2"
                    >
                      View Profile
                      <ChevronRightIcon size={14} className="ml-1" />
                    </a>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-1">
                    {item.provider?.description ||
                      'Provider information not available.'}
                  </p>
                </div>
              </div>
              {/* Provider and metadata row - responsive layout */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {item.date && (
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1 text-gray-500" />
                      <span>{item.date}</span>
                    </div>
                  )}
                  {item.duration && (
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1 text-gray-500" />
                      <span>{item.duration}</span>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1 text-gray-500" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(item.tags || []).map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${index % 3 === 0 ? 'bg-blue-50 text-blue-700' : index % 3 === 1 ? 'bg-indigo-50 text-indigo-700' : 'bg-purple-50 text-purple-700'}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {/* Prominent Video Player - Only show for video type */}
              {type === 'video' && (
                <div className="w-full mb-8 overflow-hidden rounded-xl shadow-lg">
                  <div className="aspect-w-16 aspect-h-9 relative">
                    {videoAvailable ? (
                      <>
                        {/* Video player with poster overlay */}
                        <div
                          className={`absolute inset-0 z-10 ${isVideoPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}
                        >
                          <img
                            src={getPosterUrl(item)}
                            alt={`Video: ${item.title}`}
                            className="w-full h-full object-cover min-w-[400px]"
                          />
                          {/* Dark overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
                          {/* Play button overlay */}
                          <div
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            onClick={handlePlayVideo}
                            role="button"
                            tabIndex={0}
                            aria-label="Play video"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                handlePlayVideo()
                              }
                            }}
                          >
                            <div className="flex items-center justify-center w-24 h-24 bg-blue-600/90 rounded-full shadow-xl backdrop-blur-sm hover:bg-blue-700 transition-colors">
                              {videoLoading ? (
                                <Loader
                                  size={64}
                                  className="text-white animate-spin"
                                />
                              ) : (
                                <PlayCircleIcon
                                  size={64}
                                  className="text-white"
                                />
                              )}
                            </div>
                          </div>
                          {/* Duration badge - Only show if duration is available */}
                          {videoDuration.available && (
                            <div className="absolute bottom-6 left-6 bg-black/60 px-4 py-2 rounded-full text-white text-sm backdrop-blur-sm flex items-center">
                              <Clock size={16} className="mr-2" />
                              <span>{videoDuration.formatted}</span>
                            </div>
                          )}
                        </div>
                        {/* Video element with controls */}
                        {isClientSide && (
                          <video
                            ref={videoRef}
                            src={
                              isStreamingSource
                                ? undefined
                                : videoUrlRef.current || undefined
                            }
                            className="w-full h-full object-cover rounded-lg aspect-video"
                            controls
                            controlsList="nodownload"
                            preload="metadata"
                            poster={getPosterUrl(item)}
                            playsInline
                            loading="lazy"
                            onLoadedMetadata={() => {
                              // Update duration from video element when metadata is loaded
                              if (
                                videoRef.current &&
                                videoRef.current.duration &&
                                !isNaN(videoRef.current.duration) &&
                                videoRef.current.duration > 0
                              ) {
                                const updatedDuration = getDuration(
                                  item,
                                  videoRef.current,
                                )
                                setVideoDuration(updatedDuration)
                              }
                            }}
                            onDurationChange={() => {
                              // This event fires when the duration attribute has been updated
                              if (
                                videoRef.current &&
                                videoRef.current.duration &&
                                !isNaN(videoRef.current.duration) &&
                                videoRef.current.duration > 0
                              ) {
                                const updatedDuration = getDuration(
                                  item,
                                  videoRef.current,
                                )
                                setVideoDuration(updatedDuration)
                              } else {
                                // If duration is invalid, reset to unavailable state
                                setVideoDuration({
                                  seconds: 0,
                                  formatted: '',
                                  available: false,
                                })
                              }
                            }}
                            onError={() => {
                              // If there's an error loading the video, reset the duration
                              setVideoDuration({
                                seconds: 0,
                                formatted: '',
                                available: false,
                              })
                            }}
                          >
                            {/* Add caption/subtitle track if available */}
                            {item.captionsUrl && (
                              <track
                                kind="subtitles"
                                src={item.captionsUrl}
                                srcLang="en"
                                label="English"
                                default
                              />
                            )}
                            {/* For HLS streaming sources */}
                            {isStreamingSource &&
                              videoUrlRef.current &&
                              videoUrlRef.current.includes('.m3u8') && (
                                <source
                                  src={videoUrlRef.current}
                                  type="application/x-mpegURL"
                                />
                              )}
                            {/* For DASH streaming sources */}
                            {isStreamingSource &&
                              videoUrlRef.current &&
                              videoUrlRef.current.includes('.mpd') && (
                                <source
                                  src={videoUrlRef.current}
                                  type="application/dash+xml"
                                />
                              )}
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {/* Loading overlay */}
                        {videoLoading && isVideoPlaying && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                            <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
                              <Loader
                                size={48}
                                className="text-white animate-spin"
                              />
                            </div>
                          </div>
                        )}
                        {/* Error message */}
                        {videoError && (
                          <div className="absolute bottom-4 right-4 bg-red-500/80 text-white px-4 py-2 rounded-md backdrop-blur-sm z-20">
                            {videoError}
                          </div>
                        )}
                      </> /* Video unavailable state */
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-8 h-full bg-gray-800">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center shadow-lg mb-6">
                          <AlertCircleIcon
                            size={32}
                            className="text-white"
                            aria-hidden="true"
                          />
                        </div>
                        <h3 className="text-white text-xl font-medium mb-2">
                          Video Unavailable
                        </h3>
                        <p className="text-gray-300 mb-6 max-w-md">
                          We couldn't load the video for this content. The file
                          might be unavailable or in an unsupported format.
                        </p>
                        <button
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          onClick={() => navigate(-1)}
                        >
                          Return to Previous Page
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Content Column - now full width */}
            <div className="md:col-span-12">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                {type === 'video' ? (
                  <>
                    {/* Transcript highlights for video type */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <FileTextIcon
                          size={18}
                          className="mr-2 text-blue-600"
                        />
                        Transcript Highlights
                      </h3>
                      <div className="space-y-3">
                        {[
                          {
                            time: '00:45',
                            title:
                              "Introduction to Abu Dhabi's business ecosystem",
                          },
                          {
                            time: '03:12',
                            title: 'Key growth sectors and opportunities',
                          },
                          {
                            time: '08:27',
                            title:
                              'Government support initiatives for businesses',
                          },
                          {
                            time: '15:33',
                            title: 'Case studies of successful enterprises',
                          },
                          {
                            time: '21:05',
                            title: 'Practical steps for business development',
                          },
                        ].map((highlight, index) => (
                          <button
                            key={index}
                            className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-start group"
                            onClick={() => {
                              if (videoRef.current) {
                                // Parse time string to seconds
                                const [min, sec] = highlight.time
                                  .split(':')
                                  .map(Number)
                                const timeInSeconds = min * 60 + sec
                                // Set current time and play
                                videoRef.current.currentTime = timeInSeconds
                                handlePlayVideo()
                              }
                            }}
                          >
                            <div className="flex-shrink-0 w-16 text-blue-600 font-medium">
                              {highlight.time}
                            </div>
                            <div className="flex-grow">{highlight.title}</div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <PlayCircleIcon
                                size={18}
                                className="text-blue-600"
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Video description */}
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Video Description
                      </h2>
                      <p className="text-gray-700 mb-4">{item.description}</p>
                      <p className="text-gray-700">
                        In this insightful video, experts discuss the latest
                        trends and opportunities in Abu Dhabi's business
                        landscape. Learn about key strategies for growth and how
                        to leverage available resources.
                      </p>
                    </div>
                  </>
                ) : type === 'event' ? (
                  <>
                    {/* Enhanced Event Hero Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                      {/* Calendar and Countdown Column */}
                      <div className="md:col-span-4 lg:col-span-3">
                        <div className="flex flex-col items-center">
                          {/* Calendar Visual Element */}
                          <div className="w-full max-w-[240px] bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 mb-6">
                            {/* Calendar Header */}
                            <div className="bg-blue-600 text-white text-center py-2">
                              <p className="text-sm font-medium uppercase tracking-wider">
                                {item.date
                                  ? new Date(
                                      item.date.split('-')[0],
                                    ).toLocaleString('default', {
                                      month: 'long',
                                    })
                                  : 'June'}
                              </p>
                            </div>
                            {/* Calendar Day */}
                            <div className="py-6 text-center">
                              <span className="text-6xl font-bold text-gray-900">
                                {item.date ? item.date.split('-')[1] : '15'}
                              </span>
                              <p className="text-gray-600 font-medium mt-1">
                                {item.date
                                  ? new Date(
                                      item.date.split('-')[0],
                                    ).toLocaleString('default', {
                                      weekday: 'long',
                                    })
                                  : 'Thursday'}
                              </p>
                              <p className="text-gray-500 mt-1">
                                {item.date ? item.date.split('-')[0] : '2023'}
                              </p>
                            </div>
                          </div>
                          {/* Countdown Timer */}
                          <div className="w-full bg-blue-50 rounded-lg p-4 border border-blue-100">
                            <h4 className="text-sm font-semibold text-blue-800 mb-3 text-center">
                              Event Countdown
                            </h4>
                            <div className="flex justify-center space-x-3">
                              {/* Days */}
                              <div className="flex flex-col items-center">
                                <div className="bg-white w-14 h-14 rounded-lg shadow-sm flex items-center justify-center border border-gray-100">
                                  <span className="text-xl font-bold text-gray-800">
                                    14
                                  </span>
                                </div>
                                <span className="text-xs text-gray-600 mt-1">
                                  Days
                                </span>
                              </div>
                              {/* Hours */}
                              <div className="flex flex-col items-center">
                                <div className="bg-white w-14 h-14 rounded-lg shadow-sm flex items-center justify-center border border-gray-100">
                                  <span className="text-xl font-bold text-gray-800">
                                    08
                                  </span>
                                </div>
                                <span className="text-xs text-gray-600 mt-1">
                                  Hours
                                </span>
                              </div>
                              {/* Minutes */}
                              <div className="flex flex-col items-center">
                                <div className="bg-white w-14 h-14 rounded-lg shadow-sm flex items-center justify-center border border-gray-100">
                                  <span className="text-xl font-bold text-gray-800">
                                    45
                                  </span>
                                </div>
                                <span className="text-xs text-gray-600 mt-1">
                                  Minutes
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Event Details and Registration Column */}
                      <div className="md:col-span-8 lg:col-span-9">
                        {/* Event Description */}
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Event Description
                          </h3>
                          <p className="text-gray-700 mb-4">
                            {item.description}
                          </p>
                          <p className="text-gray-700">
                            Join industry leaders and experts for this exclusive
                            event focused on business growth opportunities in
                            Abu Dhabi. Network with peers, gain valuable
                            insights, and discover resources to accelerate your
                            business journey.
                          </p>
                        </div>
                        {/* Enhanced Registration Button */}
                        <div className="mb-6">
                          <button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex items-center justify-center">
                            <span className="mr-2">Register Now</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <p className="text-sm text-gray-500 mt-2 text-center sm:text-left">
                            <span className="font-medium text-blue-600">
                              Limited seats available!
                            </span>{' '}
                            Register early to secure your spot.
                          </p>
                        </div>
                        {/* Key Event Details Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Location Card */}
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex">
                            <div className="mr-4 text-blue-600">
                              <MapPin size={24} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Location
                              </h4>
                              <p className="text-gray-700">
                                {item.location ||
                                  'Abu Dhabi National Exhibition Centre'}
                              </p>
                              <p className="text-gray-600 text-sm">
                                Hall 5, Gate 3
                              </p>
                              <a
                                href="#"
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-1"
                              >
                                View Map
                                <ChevronRightIcon size={14} className="ml-1" />
                              </a>
                            </div>
                          </div>
                          {/* Organizer Card */}
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex">
                            <div className="mr-4 text-blue-600">
                              <Building size={24} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Organizer
                              </h4>
                              <p className="text-gray-700">
                                {item.provider?.name ||
                                  'Abu Dhabi Chamber of Commerce'}
                              </p>
                              <p className="text-gray-600 text-sm">
                                Official Event Organizer
                              </p>
                              <a
                                href="#"
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-1"
                              >
                                Organizer Profile
                                <ChevronRightIcon size={14} className="ml-1" />
                              </a>
                            </div>
                          </div>
                          {/* Time Card */}
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex">
                            <div className="mr-4 text-blue-600">
                              <Clock size={24} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Time
                              </h4>
                              <p className="text-gray-700">9:00 AM - 5:00 PM</p>
                              <p className="text-gray-600 text-sm">
                                Check-in starts at 8:30 AM
                              </p>
                            </div>
                          </div>
                          {/* Registration Info Card */}
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex">
                            <div className="mr-4 text-blue-600">
                              <FileTextIcon size={24} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                Registration
                              </h4>
                              <p className="text-gray-700">
                                Free for Abu Dhabi business license holders
                              </p>
                              <p className="text-gray-600 text-sm">
                                AED 500 for others
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Event Agenda Section */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Calendar size={20} className="mr-2 text-blue-600" />
                        Event Agenda
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                              Day 1 -{' '}
                              {item.date ? item.date.split('-')[1] : '15'}{' '}
                              {item.date
                                ? new Date(
                                    item.date.split('-')[0],
                                  ).toLocaleString('default', {
                                    month: 'long',
                                  })
                                : 'June'}
                            </h4>
                            <div className="space-y-3">
                              <div className="flex">
                                <div className="w-20 text-blue-600 font-medium">
                                  9:00 AM
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">
                                    Registration & Welcome Coffee
                                  </p>
                                </div>
                              </div>
                              <div className="flex">
                                <div className="w-20 text-blue-600 font-medium">
                                  10:00 AM
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">
                                    Opening Ceremony & Keynote Address
                                  </p>
                                  <p className="text-gray-600 text-sm">
                                    By H.E. Abdullah Al Marzooqi, Department of
                                    Economic Development
                                  </p>
                                </div>
                              </div>
                              <div className="flex">
                                <div className="w-20 text-blue-600 font-medium">
                                  11:30 AM
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">
                                    Panel Discussion: Business Growth
                                    Opportunities
                                  </p>
                                  <p className="text-gray-600 text-sm">
                                    Industry leaders share insights on market
                                    expansion
                                  </p>
                                </div>
                              </div>
                              <div className="flex">
                                <div className="w-20 text-blue-600 font-medium">
                                  1:00 PM
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">
                                    Networking Lunch
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          {item.date && item.date.includes('-') && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                                Day 2 - {parseInt(item.date.split('-')[1]) + 1}{' '}
                                {new Date(
                                  item.date.split('-')[0],
                                ).toLocaleString('default', {
                                  month: 'long',
                                })}
                              </h4>
                              <div className="space-y-3">
                                <div className="flex">
                                  <div className="w-20 text-blue-600 font-medium">
                                    9:30 AM
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">
                                      Industry Roundtables
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                      Sector-specific discussions and networking
                                    </p>
                                  </div>
                                </div>
                                <div className="flex">
                                  <div className="w-20 text-blue-600 font-medium">
                                    11:00 AM
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">
                                      Presentation: Market Insights & Trends
                                    </p>
                                  </div>
                                </div>
                                <div className="flex">
                                  <div className="w-20 text-blue-600 font-medium">
                                    2:00 PM
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">
                                      Closing Ceremony & Next Steps
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  renderMediaContent()
                )}
              </div>
            </div>
          </div>
          {/* Related Resources */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Related Resources
              </h2>
              <Link
                to="/marketplace/guides"
                className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
              >
                See All Resources
                <ChevronRightIcon size={16} className="ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {relatedItems.map((relatedItem) => (
                <div
                  key={relatedItem.id}
                  className="h-full cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/media/${relatedItem.mediaType.toLowerCase().replace(/\s+/g, '-')}/${relatedItem.id}`,
                    )
                  }
                >
                  <MediaCard
                    type={getCardType(relatedItem.mediaType)}
                    title={relatedItem.title}
                    description={relatedItem.description}
                    image={relatedItem.imageUrl}
                    tags={relatedItem.tags || []}
                    {...getAdditionalProps(relatedItem)}
                    cta={{
                      label: 'View Details',
                      onClick: (e) => {
                        e.stopPropagation()
                        navigate(
                          `/media/${relatedItem.mediaType.toLowerCase().replace(/\s+/g, '-')}/${relatedItem.id}`,
                        )
                      },
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer isLoggedIn={false} />
    </div>
  )
}
export default MediaDetailPage
