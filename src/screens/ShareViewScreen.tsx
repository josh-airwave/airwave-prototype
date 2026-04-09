import React, { useState, useRef, useEffect, useCallback } from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { useNavigation } from '../navigation/Router'
import { DraggableSection, usePrototypeMode } from '../components/PrototypeMode'
import { TrimOverlay } from '../components/TrimOverlay'
import { FaceBlurOverlay, FaceRegion } from '../components/FaceBlurOverlay'
import * as tf from '@tensorflow/tfjs'
import * as blazeface from '@tensorflow-models/blazeface'
import { galleryItems } from '../data/mock'

export function ShareViewScreen({ params }: { params?: Record<string, unknown> }) {
  const { pop } = useNavigation()
  const itemId = (params?.itemId as string) || galleryItems[0].id
  const batchIds = (params?.batchIds as string[]) || [itemId]
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(batchIds))
  const [activeId, setActiveId] = useState(itemId)
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrubRef = useRef<HTMLDivElement>(null)
  const blurCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isScrubbing, setIsScrubbing] = useState(false)
  const [showTrim, setShowTrim] = useState(false)
  const [trimRanges, setTrimRanges] = useState<Record<string, { start: number; end: number }>>({})
  const [showTrimToast, setShowTrimToast] = useState(false)
  const [showBlur, setShowBlur] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isReversed, setIsReversed] = useState(false)
  const reverseIntervalRef = useRef<number>(0)
  const [blurRegions, setBlurRegions] = useState<Record<string, FaceRegion[]>>({})
  const [fullscreen, setFullscreen] = useState(false)
  const [fsScale, setFsScale] = useState(1)
  const [fsTranslate, setFsTranslate] = useState({ x: 0, y: 0 })
  const [fsDragging, setFsDragging] = useState(false)
  const [fsPlaying, setFsPlaying] = useState(true)
  const [fsProgress, setFsProgress] = useState(0)
  const [fsDuration, setFsDuration] = useState(0)
  const [fsCurrentTime, setFsCurrentTime] = useState(0)
  const [fsMuted, setFsMuted] = useState(false)
  const [fsScrubbing, setFsScrubbing] = useState(false)
  const fsVideoRef = useRef<HTMLVideoElement>(null)
  const fsScrubRef = useRef<HTMLDivElement>(null)
  const fsDragStart = useRef({ x: 0, y: 0 })
  const fsTranslateStart = useRef({ x: 0, y: 0 })
  const fsSyncTime = useRef(0)  // sync currentTime between preview ↔ fullscreen

  const selectedItems = galleryItems.filter(i => selectedIds.has(i.id))
  const activeItem = galleryItems.find(i => i.id === activeId) || selectedItems[0] || galleryItems[0]
  const isVideo = activeItem.type === 'video' && activeItem.videoUrl

  // Video time tracking
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onTime = () => {
      if (!isScrubbing) {
        // Enforce trim bounds
        const activeTrim = trimRanges[activeId]
        if (activeTrim && video.duration) {
          const trimEndTime = activeTrim.end * video.duration
          if (video.currentTime >= trimEndTime) {
            video.currentTime = activeTrim.start * video.duration
          }
        }
        setCurrentTime(video.currentTime)
        setProgress(video.duration ? video.currentTime / video.duration : 0)
      }
    }
    const onMeta = () => setDuration(video.duration)
    const onEnd = () => setIsPlaying(false)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    video.addEventListener('timeupdate', onTime)
    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('ended', onEnd)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    return () => {
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('ended', onEnd)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
    }
  }, [isScrubbing, activeId, trimRanges])

  // Live face detection + blur on preview video
  // Runs BlazeFace on the preview video so blur tracks faces in real-time
  const previewModelRef = useRef<blazeface.BlazeFaceModel | null>(null)
  useEffect(() => {
    const video = videoRef.current
    const canvas = blurCanvasRef.current
    const regions = blurRegions[activeId]
    if (!video || !canvas || !regions || regions.length === 0) return

    const ctx = canvas.getContext('2d')!
    let animId = 0
    let detectInterval: number = 0
    let liveFaces: { cx: number; cy: number; w: number; h: number }[] = []

    // Load model for preview (reuse if already loaded)
    const init = async () => {
      if (!previewModelRef.current) {
        await tf.ready()
        previewModelRef.current = await blazeface.load()
      }

      // Detection loop - update liveFaces from BlazeFace
      detectInterval = window.setInterval(async () => {
        if (video.paused || video.ended || !previewModelRef.current) return
        try {
          const preds = await previewModelRef.current.estimateFaces(video, false)
          const vw = video.videoWidth || video.clientWidth
          const vh = video.videoHeight || video.clientHeight
          liveFaces = preds.map((p: any) => {
            const tl = p.topLeft as [number, number]
            const br = p.bottomRight as [number, number]
            const w = (br[0] - tl[0]) / vw
            const h = (br[1] - tl[1]) / vh
            return { cx: tl[0] / vw + w / 2, cy: tl[1] / vh + h / 2, w, h }
          })
        } catch {}
      }, 200)
    }
    init()

    // Render loop - draw blur at live detected positions
    const draw = () => {
      canvas.width = video.clientWidth
      canvas.height = video.clientHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!video.paused && !video.ended && liveFaces.length > 0) {
        for (const face of liveFaces) {
          const fx = face.cx * canvas.width
          const fy = face.cy * canvas.height
          const fw = face.w * canvas.width
          const fh = face.h * canvas.height
          const padX = fw * 0.5
          const padY = fh * 0.5
          const bx = Math.max(0, fx - fw / 2 - padX)
          const by = Math.max(0, fy - fh / 2 - padY)
          const bw = Math.min(canvas.width - bx, fw + padX * 2)
          const bh = Math.min(canvas.height - by, fh + padY * 2)
          const sx = (bx / canvas.width) * (video.videoWidth || canvas.width)
          const sy = (by / canvas.height) * (video.videoHeight || canvas.height)
          const sw = (bw / canvas.width) * (video.videoWidth || canvas.width)
          const sh = (bh / canvas.height) * (video.videoHeight || canvas.height)

          for (let pass = 0; pass < 3; pass++) {
            ctx.save()
            ctx.filter = 'blur(30px)'
            ctx.beginPath()
            ctx.ellipse(fx, fy, bw / 2, bh / 2, 0, 0, Math.PI * 2)
            ctx.clip()
            ctx.drawImage(video, sx, sy, sw, sh, bx, by, bw, bh)
            ctx.restore()
          }
          ctx.save()
          ctx.beginPath()
          ctx.ellipse(fx, fy, bw * 0.4, bh * 0.4, 0, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(180, 180, 180, 0.35)'
          ctx.fill()
          ctx.restore()
        }
      }
      animId = requestAnimationFrame(draw)
    }
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      clearInterval(detectInterval)
    }
  }, [activeId, blurRegions])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const SPEED_OPTIONS = [1, 1.5, 2, 0.5]
  const getActiveVideo = () => fullscreen ? fsVideoRef.current : videoRef.current

  const cycleSpeed = () => {
    const video = getActiveVideo()
    if (!video) return
    const idx = SPEED_OPTIONS.indexOf(playbackSpeed)
    const next = SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length]
    setPlaybackSpeed(next)
    if (isReversed) {
      // Restart reverse interval at new speed
      startReverseInterval(video, next)
    } else {
      video.playbackRate = next
    }
  }

  const startReverseInterval = (video: HTMLVideoElement, speed: number) => {
    clearInterval(reverseIntervalRef.current)
    const step = 1 / 30
    const interval = (1000 / 30) / speed
    reverseIntervalRef.current = window.setInterval(() => {
      if (video.currentTime <= 0) {
        clearInterval(reverseIntervalRef.current)
        setIsReversed(false)
        setFsPlaying(false)
        return
      }
      video.currentTime = Math.max(0, video.currentTime - step * speed)
      setFsCurrentTime(video.currentTime)
      setFsProgress(video.duration ? video.currentTime / video.duration : 0)
    }, interval)
  }

  const toggleReverse = () => {
    const video = getActiveVideo()
    if (!video) return
    if (isReversed) {
      // Turn off reverse, restore forward playback
      clearInterval(reverseIntervalRef.current)
      setIsReversed(false)
      video.playbackRate = playbackSpeed
      video.play()
      setFsPlaying(true)
    } else {
      // Turn on reverse, default speed to 0.5
      video.pause()
      setIsReversed(true)
      setPlaybackSpeed(0.5)
      setFsPlaying(true)
      startReverseInterval(video, 0.5)
    }
  }

  // Cleanup reverse interval on unmount
  useEffect(() => {
    return () => clearInterval(reverseIntervalRef.current)
  }, [])

  const handleScrubStart = (e: React.MouseEvent) => {
    setIsScrubbing(true)
    scrub(e)
  }
  const handleScrubMove = (e: React.MouseEvent) => {
    if (isScrubbing) scrub(e)
  }
  const handleScrubEnd = () => setIsScrubbing(false)

  const scrub = (e: React.MouseEvent) => {
    if (!scrubRef.current || !videoRef.current) return
    const rect = scrubRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    setProgress(x)
    videoRef.current.currentTime = x * (videoRef.current.duration || 0)
    setCurrentTime(videoRef.current.currentTime)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  // Draggable section ordering
  const { registerLayout } = usePrototypeMode()
  const [sectionOrder, setSectionOrder] = useState(['preview', 'thumbnails', 'actions'])
  const handleReorder = useCallback((fromId: string, toId: string) => {
    setSectionOrder(prev => {
      const next = [...prev]
      const fromIdx = next.indexOf(fromId)
      const toIdx = next.indexOf(toId)
      if (fromIdx === -1 || toIdx === -1) return prev
      next.splice(fromIdx, 1)
      next.splice(toIdx, 0, fromId)
      registerLayout('ShareViewScreen', next)
      return next
    })
  }, [registerLayout])

  // Register initial layout
  useEffect(() => {
    registerLayout('ShareViewScreen', sectionOrder)
  }, [])

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      if (next.size <= 1) return
      next.delete(id)
      if (activeId === id) setActiveId([...next][0])
    } else {
      next.add(id)
    }
    setSelectedIds(next)
    setActiveId(id)
  }

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'thumbnails':
        return (
          <div style={{ display: 'flex', gap: 8, padding: '8px 24px', overflowX: 'auto' }}>
            {selectedItems.map(item => (
              <div key={item.id} style={{ position: 'relative', flexShrink: 0 }}>
                <button onClick={() => setActiveId(item.id)} style={{
                  width: 38, height: 64, borderRadius: 4, overflow: 'hidden',
                  border: activeId === item.id ? '2px solid #2D81FF' : '2px solid transparent', padding: 0,
                }}>
                  {item.type === 'video' && item.videoUrl ? (
                    <video src={item.videoUrl} muted preload="metadata" playsInline
                      onLoadedMetadata={e => { const v = e.currentTarget; v.currentTime = Math.min(2, Math.max(0.1, v.duration - 0.1)) }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
                  ) : (
                    <img src={item.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </button>
                {/* Remove button - 4px from top-right, white circle with Material close icon */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const next = new Set(selectedIds)
                    next.delete(item.id)
                    if (next.size === 0) { pop(); return }
                    setSelectedIds(next)
                    if (activeId === item.id) setActiveId([...next][0])
                  }}
                  style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 16, height: 16, borderRadius: '50%',
                    background: 'white', border: 'none', padding: 2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                >
                  {/* Material Design close icon */}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#303030">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )
      case 'preview':
        return (
          <div style={{ margin: '0 24px', position: 'relative' }}>
            {/* Video/image container - fixed aspect ratio from Figma: 342x582 (57/97) */}
            <div
              onClick={() => { fsSyncTime.current = videoRef.current?.currentTime || 0; videoRef.current?.pause(); setFullscreen(true) }}
              style={{
                width: 342, maxWidth: '100%', aspectRatio: '57/97',
                borderRadius: 8, overflow: 'hidden', background: '#1a1a1a', position: 'relative',
                cursor: 'pointer',
              }}>
              {isVideo ? (
                <>
                  <video ref={videoRef} key={activeItem.id} src={activeItem.videoUrl} autoPlay playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {/* Blur overlay canvas - renders saved face blurs during playback */}
                  <canvas
                    ref={blurCanvasRef}
                    style={{
                      position: 'absolute', top: 0, left: 0,
                      width: '100%', height: '100%', pointerEvents: 'none',
                    }}
                  />
                </>
              ) : (
                <img src={activeItem.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              {/* Timecode - inside the clipped container */}
              {isVideo && duration > 0 && (
                <div style={{
                  position: 'absolute', top: 6, right: 6, background: '#1A1A1A', color: colors.white,
                  fontSize: '24px', fontFamily: fonts.family, fontWeight: fonts.weight.semibold,
                  padding: '4px 12px', borderRadius: 8, textAlign: 'right', lineHeight: 'normal',
                }}>
                  {formatTime(duration - currentTime)}
                </div>
              )}
              {/* Scrubber - inside the clipped container, 24px from bottom */}
              {isVideo && (
                <div ref={scrubRef} onMouseDown={handleScrubStart} onClick={(e) => e.stopPropagation()} style={{
                  position: 'absolute', bottom: 24, left: 16, right: 16, height: 20,
                  borderRadius: 100, cursor: 'pointer', zIndex: 5,
                }}>
                  {/* barBackground - white with blue border */}
                  <div style={{
                    position: 'absolute', inset: 0, background: colors.white,
                    border: `2px solid ${colors.primary}`, borderRadius: 100,
                  }} />
                  {/* barFilled - blue played portion */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, bottom: 0,
                    width: `${progress * 100}%`, minWidth: 4,
                    background: '#2D81FF', border: '2px solid #ADCEFF',
                    borderRadius: '100px 0 0 100px',
                  }} />
                  {/* thumb - 16x44, positioned so it extends above/below the track */}
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
            </div>
          </div>
        )
      case 'actions':
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 24px 20px', flexShrink: 0 }}>
            {/* Left: Play/Pause, Trim */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Play/Pause - synced with video state */}
              <button onClick={isVideo ? togglePlay : undefined} style={{
                width: 40, height: 40, borderRadius: radius.md, background: colors.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isPlaying && isVideo ? (
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
              {/* Trim */}
              <button
                onClick={isVideo ? () => {
                  videoRef.current?.pause()
                  setShowTrim(true)
                } : undefined}
                style={{
                  width: 40, height: 40, borderRadius: radius.md,
                  background: colors.coolLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.almostBlack} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <line x1="20" y1="4" x2="8.12" y2="15.88" />
                  <line x1="14.47" y1="14.48" x2="20" y2="20" />
                  <line x1="8.12" y1="8.12" x2="12" y2="12" />
                </svg>
              </button>
              {/* Blur Faces */}
              <button
                onClick={isVideo ? () => {
                  videoRef.current?.pause()
                  setShowBlur(true)
                } : undefined}
                style={{
                  width: 40, height: 40, borderRadius: radius.md,
                  background: colors.coolLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.almostBlack} strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.97 4.03-9 8-9s8 4.03 8 9" />
                  <line x1="4" y1="4" x2="20" y2="20" strokeWidth="2.5" stroke={colors.almostBlack} />
                </svg>
              </button>
            </div>
            {/* Right: Share */}
            <button style={{
              background: colors.primary, color: colors.white, fontSize: fonts.size.md,
              fontWeight: fonts.weight.bold, padding: '10px 24px', borderRadius: radius.sm,
            }}>
              Share All
            </button>
          </div>
        )
      default: return null
    }
  }

  return (
    <div
      style={{ height: '100%', display: 'flex', flexDirection: 'column', background: colors.white }}
      onMouseMove={handleScrubMove}
      onMouseUp={handleScrubEnd}
      onMouseLeave={handleScrubEnd}
    >
      {/* Header - Done + title only, Share moved to actions */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: `1px solid ${colors.border}`,
      }}>
        <button onClick={pop} style={{ color: colors.primary, fontSize: fonts.size.lg, fontWeight: fonts.weight.medium, padding: 0 }}>
          Done
        </button>
        <span style={{ fontSize: fonts.size.lg, fontWeight: fonts.weight.bold, color: colors.textPrimary }}>
          Selected files ({selectedIds.size})
        </span>
        <div style={{ width: 50 }} />
      </div>

      {/* Draggable sections */}
      {sectionOrder.map(sectionId => (
        <DraggableSection
          key={sectionId}
          id={sectionId}
          onReorder={handleReorder}
          flex={undefined}
        >
          {renderSection(sectionId)}
        </DraggableSection>
      ))}

      {/* Trim Overlay */}
      {showTrim && isVideo && (
        <TrimOverlay
          videoUrl={activeItem.videoUrl!}
          initialStart={trimRanges[activeId]?.start ?? 0}
          initialEnd={trimRanges[activeId]?.end ?? 1}
          onCancel={() => setShowTrim(false)}
          onSave={(start, end) => {
            setTrimRanges(prev => ({ ...prev, [activeId]: { start, end } }))
            setShowTrim(false)
            setShowTrimToast(true)
            setTimeout(() => setShowTrimToast(false), 2000)
            // Apply trim to playback
            if (videoRef.current) {
              videoRef.current.currentTime = start * duration
            }
          }}
        />
      )}

      {/* Face Blur Overlay */}
      {showBlur && isVideo && (
        <FaceBlurOverlay
          videoUrl={activeItem.videoUrl!}
          initialRegions={blurRegions[activeId]}
          onCancel={() => {
            setShowBlur(false)
            setTimeout(() => videoRef.current?.play(), 100)
          }}
          onDone={(regions) => {
            setBlurRegions(prev => ({ ...prev, [activeId]: regions }))
            setShowBlur(false)
            setTimeout(() => videoRef.current?.play(), 100)
          }}
        />
      )}

      {/* Fullscreen zoom overlay with all playback controls */}
      {fullscreen && (
        <div
          style={{
            position: 'absolute', inset: 0, background: '#000', zIndex: 200,
            display: 'flex', flexDirection: 'column', userSelect: 'none',
          }}
          onMouseMove={(e) => {
            if (fsDragging) {
              setFsTranslate({
                x: fsTranslateStart.current.x + (e.clientX - fsDragStart.current.x),
                y: fsTranslateStart.current.y + (e.clientY - fsDragStart.current.y),
              })
            }
            if (fsScrubbing && fsScrubRef.current && fsVideoRef.current) {
              const rect = fsScrubRef.current.getBoundingClientRect()
              const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
              setFsProgress(x)
              fsVideoRef.current.currentTime = x * (fsVideoRef.current.duration || 0)
              setFsCurrentTime(fsVideoRef.current.currentTime)
            }
          }}
          onMouseUp={() => { setFsDragging(false); setFsScrubbing(false) }}
          onMouseLeave={() => { setFsDragging(false); setFsScrubbing(false) }}
        >
          {/* Media area with timecode + scrubber overlaid inside (same as preview) */}
          <div
            style={{
              flex: 1, position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: fsScale > 1 ? (fsDragging ? 'grabbing' : 'grab') : 'pointer',
            }}
            onWheel={(e) => {
              e.preventDefault()
              const delta = e.deltaY > 0 ? -0.15 : 0.15
              setFsScale(prev => Math.max(1, Math.min(5, prev + delta)))
            }}
            onDoubleClick={() => {
              if (fsScale > 1) { setFsScale(1); setFsTranslate({ x: 0, y: 0 }) }
              else { setFsScale(2.5) }
            }}
            onMouseDown={(e) => {
              if (fsScale > 1) {
                setFsDragging(true)
                fsDragStart.current = { x: e.clientX, y: e.clientY }
                fsTranslateStart.current = { ...fsTranslate }
              }
            }}
            onClick={() => {
              if (fsScale <= 1 && isVideo && fsVideoRef.current) {
                if (fsPlaying) { fsVideoRef.current.pause() } else { fsVideoRef.current.play() }
              }
            }}
          >
            {isVideo ? (
              <video
                ref={fsVideoRef}
                src={activeItem.videoUrl}
                autoPlay playsInline
                muted={fsMuted}
                onTimeUpdate={() => {
                  const v = fsVideoRef.current
                  if (v && !fsScrubbing) {
                    setFsCurrentTime(v.currentTime)
                    setFsProgress(v.duration ? v.currentTime / v.duration : 0)
                  }
                }}
                onLoadedMetadata={() => {
                  if (fsVideoRef.current) {
                    setFsDuration(fsVideoRef.current.duration)
                    fsVideoRef.current.playbackRate = playbackSpeed
                    // Sync to preview video's position so it doesn't restart
                    if (fsSyncTime.current > 0) {
                      fsVideoRef.current.currentTime = fsSyncTime.current
                    }
                  }
                }}
                onPlay={() => setFsPlaying(true)}
                onPause={() => setFsPlaying(false)}
                onEnded={() => setFsPlaying(false)}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transform: `scale(${fsScale}) translate(${fsTranslate.x / fsScale}px, ${fsTranslate.y / fsScale}px)`,
                  transition: fsDragging ? 'none' : 'transform 0.2s ease-out',
                }}
              />
            ) : (
              <img src={activeItem.thumbnail} alt="" draggable={false}
                style={{
                  maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
                  transform: `scale(${fsScale}) translate(${fsTranslate.x / fsScale}px, ${fsTranslate.y / fsScale}px)`,
                  transition: fsDragging ? 'none' : 'transform 0.2s ease-out',
                }}
              />
            )}

            {/* Timecode - top 6, right 6 (same as preview) */}
            {isVideo && fsDuration > 0 && (
              <div style={{
                position: 'absolute', top: 6, right: 6, background: '#1A1A1A', color: colors.white,
                fontSize: '24px', fontFamily: fonts.family, fontWeight: fonts.weight.semibold,
                padding: '4px 12px', borderRadius: 8, textAlign: 'right', lineHeight: 'normal',
                pointerEvents: 'none',
              }}>
                {formatTime(fsDuration - fsCurrentTime)}
              </div>
            )}

            {/* Scrubber - 12px from bottom of video frame, 16px from edges */}
            {isVideo && (
              <div
                ref={fsScrubRef}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  setFsScrubbing(true)
                  if (fsScrubRef.current && fsVideoRef.current) {
                    const rect = fsScrubRef.current.getBoundingClientRect()
                    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
                    setFsProgress(x)
                    fsVideoRef.current.currentTime = x * (fsVideoRef.current.duration || 0)
                    setFsCurrentTime(fsVideoRef.current.currentTime)
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
                  width: `${fsProgress * 100}%`, minWidth: 4,
                  background: '#2D81FF', border: '2px solid #ADCEFF',
                  borderRadius: '100px 0 0 100px',
                }} />
                <div style={{
                  position: 'absolute', top: -12,
                  left: `calc(${fsProgress * 100}% - 8px)`,
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
            {fsScale > 1 && (
              <div style={{
                position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 13,
                padding: '4px 12px', borderRadius: 12, pointerEvents: 'none',
              }}>
                {Math.round(fsScale * 100)}%
              </div>
            )}
          </div>

          {/* Bottom controls: Play/Pause, Mute, Close */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 20px 32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Play/Pause */}
              {isVideo && (
                <button onClick={() => {
                  const v = fsVideoRef.current; if (!v) return
                  if (fsPlaying) {
                    // Pause - stop reverse interval if active, pause video
                    if (isReversed) clearInterval(reverseIntervalRef.current)
                    else v.pause()
                    setFsPlaying(false)
                  } else {
                    // Resume - restart reverse interval if in reverse mode, otherwise play forward
                    if (isReversed) {
                      startReverseInterval(v, playbackSpeed)
                    } else {
                      v.play()
                    }
                    setFsPlaying(true)
                  }
                }} style={{
                  width: 40, height: 40, borderRadius: radius.md, background: colors.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {fsPlaying ? (
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
                  color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: fonts.weight.bold, gap: 4,
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
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="19,20 9,12 19,4" />
                    <line x1="5" y1="4" x2="5" y2="20" />
                  </svg>
                </button>
              )}
              {/* Mute/Unmute - use callback to avoid stale closure */}
              {isVideo && (
                <button onClick={() => {
                  const next = !fsMuted
                  setFsMuted(next)
                  if (fsVideoRef.current) fsVideoRef.current.muted = next
                }} style={{
                  width: 40, height: 40, borderRadius: radius.md,
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {fsMuted ? (
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
              onClick={() => { const t = fsVideoRef.current?.currentTime || 0; fsVideoRef.current?.pause(); setFullscreen(false); setFsScale(1); setFsTranslate({ x: 0, y: 0 }); if (videoRef.current) { videoRef.current.currentTime = t }; setTimeout(() => videoRef.current?.play(), 100) }}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Trim saved toast */}
      {showTrimToast && (
        <div style={{
          position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          background: '#1A1A1A', color: colors.white, fontSize: fonts.size.md,
          fontWeight: fonts.weight.semibold, padding: '10px 24px', borderRadius: 20,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 100, whiteSpace: 'nowrap',
        }}>
          Video trimmed
        </div>
      )}
    </div>
  )
}
