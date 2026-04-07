import React, { useState, useRef } from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { useNavigation } from '../navigation/Router'
import { galleryItems } from '../data/mock'

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

const SPEEDS = [1, 1.5, 2, 0.5]

export function ImageZoomScreen({ params }: { params?: Record<string, unknown> }) {
  const { pop } = useNavigation()
  const itemId = (params?.itemId as string) || galleryItems[0].id
  const directImageUrl = params?.imageUrl as string | undefined
  const directVideoUrl = params?.videoUrl as string | undefined
  const item = galleryItems.find(i => i.id === itemId) || galleryItems[0]

  const isVideo = !!directVideoUrl || item.type === 'video'
  const videoSrc = directVideoUrl || item.videoUrl
  const imageSrc = directImageUrl || item.thumbnail

  // Zoom & pan
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const translateStart = useRef({ x: 0, y: 0 })

  // Video state
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrubRef = useRef<HTMLDivElement>(null)
  const reverseIntervalRef = useRef<number>(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isReversed, setIsReversed] = useState(false)

  const cycleSpeed = () => {
    const idx = SPEEDS.indexOf(playbackSpeed)
    const next = SPEEDS[(idx + 1) % SPEEDS.length]
    setPlaybackSpeed(next)
    if (videoRef.current) videoRef.current.playbackRate = next
  }

  const startReverseInterval = (v: HTMLVideoElement, speed: number) => {
    clearInterval(reverseIntervalRef.current)
    const step = 1 / 30
    reverseIntervalRef.current = window.setInterval(() => {
      if (v.currentTime <= 0) {
        clearInterval(reverseIntervalRef.current)
        setIsPlaying(false)
        return
      }
      v.currentTime = Math.max(0, v.currentTime - step * speed)
      setCurrentTime(v.currentTime)
      setProgress(v.duration ? v.currentTime / v.duration : 0)
    }, 1000 / 30)
  }

  const toggleReverse = () => {
    const v = videoRef.current
    if (!v) return
    if (isReversed) {
      clearInterval(reverseIntervalRef.current)
      setIsReversed(false)
      if (isPlaying) v.play()
    } else {
      v.pause()
      setIsReversed(true)
      if (isPlaying) startReverseInterval(v, playbackSpeed)
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
        userSelect: 'none',
      }}
      onMouseMove={(e) => {
        if (isDragging) {
          setTranslate({
            x: translateStart.current.x + (e.clientX - dragStart.current.x),
            y: translateStart.current.y + (e.clientY - dragStart.current.y),
          })
        }
        if (isScrubbing && scrubRef.current && videoRef.current) {
          const rect = scrubRef.current.getBoundingClientRect()
          const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
          setProgress(x)
          videoRef.current.currentTime = x * (videoRef.current.duration || 0)
          setCurrentTime(videoRef.current.currentTime)
        }
      }}
      onMouseUp={() => { setIsDragging(false); setIsScrubbing(false) }}
      onMouseLeave={() => { setIsDragging(false); setIsScrubbing(false) }}
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
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
        }}
        onWheel={(e) => {
          e.preventDefault()
          const delta = e.deltaY > 0 ? -0.15 : 0.15
          setScale(prev => Math.max(1, Math.min(5, prev + delta)))
        }}
        onDoubleClick={() => {
          if (scale > 1) { setScale(1); setTranslate({ x: 0, y: 0 }) }
          else { setScale(2.5) }
        }}
        onMouseDown={(e) => {
          if (scale > 1) {
            setIsDragging(true)
            dragStart.current = { x: e.clientX, y: e.clientY }
            translateStart.current = { ...translate }
          }
        }}
        onClick={() => {
          if (scale <= 1 && isVideo && videoRef.current) {
            if (isReversed) {
              if (isPlaying) {
                clearInterval(reverseIntervalRef.current)
                setIsPlaying(false)
              } else {
                startReverseInterval(videoRef.current, playbackSpeed)
                setIsPlaying(true)
              }
            } else {
              if (isPlaying) { videoRef.current.pause() } else { videoRef.current.play() }
            }
          }
        }}
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
              if (videoRef.current) {
                setDuration(videoRef.current.duration)
                videoRef.current.playbackRate = playbackSpeed
              }
            }}
            onTimeUpdate={() => {
              const v = videoRef.current
              if (v && !isScrubbing) {
                setCurrentTime(v.currentTime)
                setProgress(v.duration ? v.currentTime / v.duration : 0)
              }
            }}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
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
              maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
              transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
          />
        )}

        {/* Timecode — top right, matching ShareView */}
        {isVideo && duration > 0 && (
          <div style={{
            position: 'absolute', top: 6, right: 6, background: '#1A1A1A', color: colors.white,
            fontSize: '24px', fontFamily: fonts.family, fontWeight: fonts.weight.semibold,
            padding: '4px 12px', borderRadius: 8, textAlign: 'right', lineHeight: 'normal',
            pointerEvents: 'none',
          }}>
            {formatTime(duration - currentTime)}
          </div>
        )}

        {/* Scrubber — matching ShareView style */}
        {isVideo && (
          <div
            ref={scrubRef}
            onMouseDown={(e) => {
              e.stopPropagation()
              setIsScrubbing(true)
              if (scrubRef.current && videoRef.current) {
                const rect = scrubRef.current.getBoundingClientRect()
                const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                setProgress(x)
                videoRef.current.currentTime = x * (videoRef.current.duration || 0)
                setCurrentTime(videoRef.current.currentTime)
              }
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute', bottom: 24, left: 16, right: 16, height: 20,
              borderRadius: 100, cursor: 'pointer', zIndex: 5,
            }}
          >
            <div style={{
              position: 'absolute', inset: 0, background: colors.white,
              border: `2px solid ${colors.primary}`, borderRadius: 100,
            }} />
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: `${progress * 100}%`, minWidth: 4,
              background: '#2D81FF', border: '2px solid #ADCEFF',
              borderRadius: '100px 0 0 100px',
            }} />
            <div style={{
              position: 'absolute', top: -12,
              left: `calc(${progress * 100}% - 8px)`,
              width: 16, height: 44, borderRadius: 10,
              background: '#F2F5F9', border: '2px solid white',
              boxShadow: '0 4px 4px rgba(0,0,0,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 2, height: 28, background: '#DFDFDF' }} />
            </div>
          </div>
        )}

        {/* Zoom indicator */}
        {scale > 1 && (
          <div style={{
            position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 13,
            padding: '4px 12px', borderRadius: 12, pointerEvents: 'none',
          }}>
            {Math.round(scale * 100)}%
          </div>
        )}
      </div>

      {/* Bottom controls — matching ShareView exactly */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 20px 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Play/Pause */}
          {isVideo && (
            <button onClick={() => {
              const v = videoRef.current; if (!v) return
              if (isPlaying) {
                if (isReversed) clearInterval(reverseIntervalRef.current)
                else v.pause()
                setIsPlaying(false)
              } else {
                if (isReversed) startReverseInterval(v, playbackSpeed)
                else v.play()
                setIsPlaying(true)
              }
            }} style={{
              width: 40, height: 40, borderRadius: radius.md, background: colors.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}>
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>
          )}
          {/* Speed */}
          {isVideo && (
            <button onClick={cycleSpeed} style={{
              height: 40, borderRadius: radius.md, paddingInline: 10,
              background: playbackSpeed !== 1 ? colors.primary : 'rgba(255,255,255,0.15)',
              color: 'white', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: fonts.weight.bold, gap: 4,
              fontFamily: fonts.family,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              {playbackSpeed}x
            </button>
          )}
          {/* Reverse */}
          {isVideo && (
            <button onClick={toggleReverse} style={{
              width: 40, height: 40, borderRadius: radius.md,
              background: isReversed ? colors.primary : 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="19,20 9,12 19,4" />
                <line x1="5" y1="4" x2="5" y2="20" />
              </svg>
            </button>
          )}
          {/* Mute/Unmute */}
          {isVideo && (
            <button onClick={() => {
              const next = !isMuted
              setIsMuted(next)
              if (videoRef.current) videoRef.current.muted = next
            }} style={{
              width: 40, height: 40, borderRadius: radius.md,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer',
            }}>
              {isMuted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          )}
        </div>
        {/* Close */}
        <button
          onClick={(e) => { e.stopPropagation(); clearInterval(reverseIntervalRef.current); videoRef.current?.pause(); pop() }}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
