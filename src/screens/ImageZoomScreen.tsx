import React, { useState, useRef, useEffect } from 'react'
import { colors } from '../styles/theme'
import { useNavigation } from '../navigation/Router'
import { galleryItems } from '../data/mock'

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

export function ImageZoomScreen({ params }: { params?: Record<string, unknown> }) {
  const { pop } = useNavigation()
  const itemId = (params?.itemId as string) || galleryItems[0].id
  const directImageUrl = params?.imageUrl as string | undefined
  const directVideoUrl = params?.videoUrl as string | undefined
  const item = galleryItems.find(i => i.id === itemId) || galleryItems[0]

  const isVideo = !!directVideoUrl || item.type === 'video'
  const videoSrc = directVideoUrl || item.videoUrl
  const imageSrc = directImageUrl || item.thumbnail

  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const dragStart = useRef({ x: 0, y: 0 })
  const translateStart = useRef({ x: 0, y: 0 })
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrubRef = useRef<HTMLDivElement>(null)
  const controlsTimer = useRef<number>(0)

  // Auto-hide controls after 3 seconds of inactivity
  useEffect(() => {
    if (!isVideo) return
    const resetTimer = () => {
      setShowControls(true)
      clearTimeout(controlsTimer.current)
      controlsTimer.current = window.setTimeout(() => {
        if (isPlaying) setShowControls(false)
      }, 3000)
    }
    resetTimer()
    return () => clearTimeout(controlsTimer.current)
  }, [isPlaying, isVideo])

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setScale(prev => Math.max(1, Math.min(5, prev + delta)))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    translateStart.current = { ...translate }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      setTranslate({
        x: translateStart.current.x + dx,
        y: translateStart.current.y + dy,
      })
    }
    if (isScrubbing && scrubRef.current && videoRef.current) {
      const rect = scrubRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      setProgress(x)
      videoRef.current.currentTime = x * (videoRef.current.duration || 0)
      setCurrentTime(videoRef.current.currentTime)
    }
    // Show controls on mouse move
    if (isVideo) {
      setShowControls(true)
      clearTimeout(controlsTimer.current)
      controlsTimer.current = window.setTimeout(() => {
        if (isPlaying) setShowControls(false)
      }, 3000)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsScrubbing(false)
  }

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1)
      setTranslate({ x: 0, y: 0 })
    } else if (!isVideo) {
      setScale(2.5)
    }
  }

  const handleMediaClick = () => {
    if (scale > 1) return
    if (isVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  return (
    <div
      style={{
        height: '100%',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : isVideo ? 'pointer' : 'zoom-in',
        userSelect: 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Media area */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        onClick={handleMediaClick}
      >
        {isVideo && videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            playsInline
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onLoadedMetadata={() => {
              if (videoRef.current) setDuration(videoRef.current.duration)
            }}
            onTimeUpdate={() => {
              const v = videoRef.current
              if (v && !isScrubbing) {
                setCurrentTime(v.currentTime)
                setProgress(v.duration ? v.currentTime / v.duration : 0)
              }
            }}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
          />
        ) : (
          <img
            src={imageSrc}
            alt=""
            draggable={false}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
          />
        )}

        {/* Pause overlay */}
        {isVideo && !isPlaying && (
          <div style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <polygon points="7,3 21,12 7,21" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Video controls bar */}
      {isVideo && (
        <div style={{
          position: 'absolute',
          bottom: 70,
          left: 0,
          right: 0,
          padding: '0 16px',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: showControls ? 'auto' : 'none',
        }}>
          {/* Scrubber bar */}
          <div
            ref={scrubRef}
            onMouseDown={(e) => {
              e.stopPropagation()
              setIsScrubbing(true)
              const rect = scrubRef.current!.getBoundingClientRect()
              const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
              setProgress(x)
              if (videoRef.current) {
                videoRef.current.currentTime = x * (videoRef.current.duration || 0)
                setCurrentTime(videoRef.current.currentTime)
              }
            }}
            style={{
              height: 20,
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: '100%',
              height: 3,
              background: 'rgba(255,255,255,0.3)',
              borderRadius: 2,
              position: 'relative',
            }}>
              <div style={{
                width: `${progress * 100}%`,
                height: '100%',
                background: colors.white,
                borderRadius: 2,
              }} />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: `${progress * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: colors.white,
                boxShadow: '0 0 4px rgba(0,0,0,0.5)',
              }} />
            </div>
          </div>

          {/* Controls row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 0',
          }}>
            {/* Left: play/pause + timecode */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (videoRef.current) {
                    if (isPlaying) videoRef.current.pause()
                    else videoRef.current.play()
                  }
                }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 4, display: 'flex', alignItems: 'center',
                }}
              >
                {isPlaying ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <rect x="5" y="3" width="5" height="18" rx="1" />
                    <rect x="14" y="3" width="5" height="18" rx="1" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <polygon points="6,3 20,12 6,21" />
                  </svg>
                )}
              </button>
              <span style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: 12,
                fontFamily: "'Outfit', sans-serif",
                fontVariantNumeric: 'tabular-nums',
              }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right: mute */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMuted(!isMuted)
                if (videoRef.current) videoRef.current.muted = !isMuted
              }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 4, display: 'flex', alignItems: 'center',
              }}
            >
              {isMuted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Close button */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '16px 0 36px',
      }}>
        <button
          onClick={(e) => { e.stopPropagation(); videoRef.current?.pause(); pop() }}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            border: '2px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Zoom indicator (images only) */}
      {!isVideo && scale > 1 && (
        <div style={{
          position: 'absolute',
          top: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.6)',
          color: colors.white,
          fontSize: 13,
          padding: '4px 12px',
          borderRadius: 12,
        }}>
          {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  )
}
