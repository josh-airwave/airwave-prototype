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

  const isVideo = !!directVideoUrl || (!directImageUrl && item.type === 'video')
  const videoSrc = directVideoUrl || item.videoUrl
  const imageSrc = directImageUrl || item.thumbnail

  // Source frame mode - opened from a report source badge
  const sourceTime = params?.sourceTime as number | undefined
  const sourceLabel = params?.sourceLabel as string | undefined
  const sourceValue = params?.sourceValue as string | undefined
  const sourceConfidence = params?.sourceConfidence as number | undefined
  const sourceBbox = params?.sourceBbox as { x: number; y: number; w: number; h: number } | undefined
  const isSourceMode = sourceTime != null || (directImageUrl != null && sourceLabel != null)
  const [sourceEditing, setSourceEditing] = useState(false)
  const [sourceEditValue, setSourceEditValue] = useState(sourceValue || '')

  // Freeze params for screen export
  const freezeState = params?.freezeState as boolean | undefined
  const initialScale = (params?.initialScale as number) ?? 1
  const initialSpeed = (params?.initialSpeed as number) ?? 1
  const initialPaused = params?.initialPaused as boolean | undefined
  const initialMuted = params?.initialMuted as boolean | undefined
  const initialReversed = params?.initialReversed as boolean | undefined
  const initialProgress = (params?.initialProgress as number) ?? 0
  const initialDuration = (params?.initialDuration as number) ?? 48

  // Video content rect - where the actual video renders within the container (for object-fit: contain)
  const mediaContainerRef = useRef<HTMLDivElement>(null)
  const [videoContentRect, setVideoContentRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null)

  // Source mode zoom - compute transform-origin mapped to element coords (accounting for object-fit: contain)
  const sourceOrigin = (() => {
    if (!isSourceMode || !sourceBbox) return undefined
    const bboxCenterX = sourceBbox.x + sourceBbox.w / 2
    const bboxCenterY = sourceBbox.y + sourceBbox.h / 2
    if (videoContentRect) {
      const container = mediaContainerRef.current
      if (container) {
        const cW = container.clientWidth
        const cH = container.clientHeight
        const px = videoContentRect.left + bboxCenterX * videoContentRect.width
        const py = videoContentRect.top + bboxCenterY * videoContentRect.height
        return `${(px / cW) * 100}% ${(py / cH) * 100}%`
      }
    }
    return `${bboxCenterX * 100}% ${bboxCenterY * 100}%`
  })()

  // Zoom & pan
  const [scale, setScale] = useState(freezeState ? initialScale : 1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const translateStart = useRef({ x: 0, y: 0 })

  // Video state
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrubRef = useRef<HTMLDivElement>(null)
  const reverseIntervalRef = useRef<number>(0)
  const [isPlaying, setIsPlaying] = useState(isSourceMode ? false : (freezeState ? !initialPaused : true))
  const [currentTime, setCurrentTime] = useState(freezeState ? initialProgress * initialDuration : 0)
  const [duration, setDuration] = useState(freezeState ? initialDuration : 0)
  const [progress, setProgress] = useState(freezeState ? initialProgress : 0)
  const [isMuted, setIsMuted] = useState(freezeState ? !!initialMuted : false)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(freezeState ? initialSpeed : 1)
  const [isReversed, setIsReversed] = useState(freezeState ? !!initialReversed : false)

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
      setPlaybackSpeed(0.5)
      if (isPlaying) startReverseInterval(v, 0.5)
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
        ref={mediaContainerRef}
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
            autoPlay={!freezeState && !isSourceMode}
            playsInline
            muted={isMuted || !!freezeState}
            onPlay={() => { if (!freezeState) setIsPlaying(true) }}
            onPause={() => { if (!freezeState) setIsPlaying(false) }}
            onEnded={() => setIsPlaying(false)}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                if (isSourceMode && sourceTime != null) {
                  videoRef.current.pause()
                  videoRef.current.currentTime = sourceTime
                  setDuration(videoRef.current.duration)
                  setCurrentTime(sourceTime)
                  setProgress(videoRef.current.duration ? sourceTime / videoRef.current.duration : 0)
                } else if (freezeState) {
                  videoRef.current.pause()
                  videoRef.current.currentTime = initialProgress * (videoRef.current.duration || initialDuration)
                  setDuration(videoRef.current.duration || initialDuration)
                } else {
                  setDuration(videoRef.current.duration)
                }
                videoRef.current.playbackRate = playbackSpeed
                // Compute where the video content actually renders within the container (for bbox alignment)
                if (isSourceMode && sourceBbox && mediaContainerRef.current) {
                  const v = videoRef.current
                  const container = mediaContainerRef.current
                  const cW = container.clientWidth
                  const cH = container.clientHeight
                  const vW = v.videoWidth
                  const vH = v.videoHeight
                  if (vW && vH) {
                    const containerRatio = cW / cH
                    const videoRatio = vW / vH
                    let rLeft = 0, rTop = 0, rWidth = cW, rHeight = cH
                    if (videoRatio > containerRatio) {
                      // Video is wider - letterbox top/bottom
                      rHeight = cW / videoRatio
                      rTop = (cH - rHeight) / 2
                    } else {
                      // Video is taller - letterbox left/right
                      rWidth = cH * videoRatio
                      rLeft = (cW - rWidth) / 2
                    }
                    setVideoContentRect({ left: rLeft, top: rTop, width: rWidth, height: rHeight })
                  }
                }
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
              width: '100%', height: '100%', objectFit: isSourceMode ? 'contain' : 'cover',
              transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
              transformOrigin: sourceOrigin || 'center center',
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
          />
        ) : (
          <img
            src={imageSrc}
            alt=""
            draggable={false}
            onLoad={(e) => {
              if (isSourceMode && sourceBbox && mediaContainerRef.current) {
                const img = e.currentTarget
                const container = mediaContainerRef.current
                const cW = container.clientWidth
                const cH = container.clientHeight
                const iW = img.naturalWidth
                const iH = img.naturalHeight
                if (iW && iH) {
                  const containerRatio = cW / cH
                  const imgRatio = iW / iH
                  let rLeft = 0, rTop = 0, rWidth = cW, rHeight = cH
                  if (imgRatio > containerRatio) {
                    rHeight = cW / imgRatio
                    rTop = (cH - rHeight) / 2
                  } else {
                    rWidth = cH * imgRatio
                    rLeft = (cW - rWidth) / 2
                  }
                  setVideoContentRect({ left: rLeft, top: rTop, width: rWidth, height: rHeight })
                }
              }
            }}
            style={{
              maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
              transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
              transformOrigin: sourceOrigin || 'center center',
              transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            }}
          />
        )}

        {/* Bounding box highlight overlay - positioned within actual video content area */}
        {isSourceMode && sourceBbox && videoContentRect && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
            transformOrigin: sourceOrigin || 'center center',
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }}>
            {/* Inner wrapper matches video content area (accounts for letterboxing) */}
            <div style={{
              position: 'absolute',
              left: videoContentRect ? videoContentRect.left : 0,
              top: videoContentRect ? videoContentRect.top : 0,
              width: videoContentRect ? videoContentRect.width : '100%',
              height: videoContentRect ? videoContentRect.height : '100%',
            }}>
              <div style={{
                position: 'absolute',
                left: `${sourceBbox.x * 100}%`,
                top: `${sourceBbox.y * 100}%`,
                width: `${sourceBbox.w * 100}%`,
                height: `${sourceBbox.h * 100}%`,
                border: '2px solid #60A5FA',
                borderRadius: 3,
                boxShadow: '0 0 0 2000px rgba(0,0,0,0.4)',
                background: 'rgba(96,165,250,0.08)',
              }} />
            </div>
          </div>
        )}

        {/* Timecode - top right, matching ShareView */}
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

        {/* Scrubber - matching ShareView style */}
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

      {/* Source frame card - verify and edit what Blue read */}
      {isSourceMode && sourceLabel && (
        <div style={{
          padding: '10px 16px 6px',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 12, padding: '14px 16px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <div style={{
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <div style={{
                fontSize: 11, color: 'rgba(255,255,255,0.5)',
                fontFamily: fonts.family, fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                {sourceLabel}
              </div>
              {sourceConfidence != null && (
                <div style={{
                  fontSize: 10, fontFamily: fonts.family, fontWeight: 600,
                  padding: '2px 6px', borderRadius: 4,
                  background: sourceConfidence >= 0.9 ? 'rgba(73,174,123,0.2)' : sourceConfidence >= 0.8 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                  color: sourceConfidence >= 0.9 ? '#6EE7A0' : sourceConfidence >= 0.8 ? '#FCD34D' : '#FCA5A5',
                }}>
                  {Math.round(sourceConfidence * 100)}% confidence
                </div>
              )}
            </div>

            <div
              onClick={() => { if (!sourceEditing) setSourceEditing(true) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                cursor: sourceEditing ? 'default' : 'pointer',
                height: 36,
              }}
            >
              {sourceEditing ? (
                <input
                  autoFocus
                  value={sourceEditValue}
                  onChange={(e) => setSourceEditValue(e.target.value)}
                  onBlur={() => setSourceEditing(false)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setSourceEditing(false) }}
                  style={{
                    fontSize: 22, fontWeight: 700, color: 'white',
                    fontFamily: fonts.family, background: 'transparent',
                    border: 'none', borderBottom: '2px solid #60A5FA',
                    padding: 0, outline: 'none', width: '100%',
                  }}
                />
              ) : (
                <span style={{
                  fontSize: 22, fontWeight: 700, color: 'white',
                  fontFamily: fonts.family,
                }}>
                  {sourceEditValue || '-'}
                </span>
              )}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={sourceEditing ? '#60A5FA' : 'rgba(255,255,255,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>

            <div style={{
              fontSize: 11, color: 'rgba(255,255,255,0.35)',
              fontFamily: fonts.family, marginTop: 6,
            }}>
              Tap value to correct{sourceTime != null ? <> &bull; Blue read at {formatTime(sourceTime)}</> : null}
            </div>
          </div>
        </div>
      )}

      {/* Bottom controls - matching ShareView exactly */}
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
