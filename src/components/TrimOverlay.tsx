import React, { useState, useRef, useEffect, useCallback } from 'react'
import { colors, fonts } from '../styles/theme'

interface TrimOverlayProps {
  videoUrl: string
  initialStart?: number
  initialEnd?: number
  onSave: (trimStart: number, trimEnd: number) => void
  onCancel: () => void
}

const FRAME_COUNT = 20
const FRAME_H = 56
const HANDLE_W = 16

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  const ms = Math.floor((s % 1) * 10)
  return `${m}:${sec.toString().padStart(2, '0')}.${ms}`
}

export function TrimOverlay({ videoUrl, initialStart = 0, initialEnd = 1, onSave, onCancel }: TrimOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const [frames, setFrames] = useState<string[]>([])
  const [trimStart, setTrimStart] = useState(initialStart)
  const [trimEnd, setTrimEnd] = useState(initialEnd)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [dragging, setDragging] = useState<'start' | 'end' | 'playhead' | null>(null)

  // Extract filmstrip frames
  useEffect(() => {
    const offscreen = document.createElement('video')
    offscreen.src = videoUrl
    offscreen.muted = true
    offscreen.preload = 'auto'
    offscreen.playsInline = true
    offscreen.crossOrigin = 'anonymous'

    const canvas = document.createElement('canvas')
    canvas.width = 80
    canvas.height = FRAME_H * 2
    const ctx = canvas.getContext('2d')!

    const extracted: string[] = []
    let idx = 0

    offscreen.addEventListener('loadedmetadata', () => {
      setDuration(offscreen.duration)
      seekNext()
    })

    function seekNext() {
      if (idx >= FRAME_COUNT) {
        setFrames(extracted)
        offscreen.src = ''
        return
      }
      offscreen.currentTime = (idx / FRAME_COUNT) * offscreen.duration
    }

    offscreen.addEventListener('seeked', () => {
      ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height)
      extracted.push(canvas.toDataURL('image/jpeg', 0.4))
      idx++
      seekNext()
    })

    return () => { offscreen.src = '' }
  }, [videoUrl])

  // Sync video playback to trim region
  useEffect(() => {
    const video = videoRef.current
    if (!video || !duration) return

    const onMeta = () => {
      setDuration(video.duration)
      video.currentTime = trimStart * video.duration
    }

    const onTime = () => {
      const t = video.currentTime
      setCurrentTime(t)
      const endTime = trimEnd * duration
      if (t >= endTime) {
        video.currentTime = trimStart * duration
      }
    }

    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('timeupdate', onTime)
    video.play().catch(() => {})

    return () => {
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('timeupdate', onTime)
    }
  }, [duration, trimStart, trimEnd])

  // Set video to trim start when handles change
  useEffect(() => {
    const video = videoRef.current
    if (video && duration && dragging === 'start') {
      video.currentTime = trimStart * duration
    }
  }, [trimStart])

  useEffect(() => {
    const video = videoRef.current
    if (video && duration && dragging === 'end') {
      video.currentTime = trimEnd * duration
    }
  }, [trimEnd])

  const getStripBounds = () => {
    if (!stripRef.current) return { left: 0, width: 1 }
    const rect = stripRef.current.getBoundingClientRect()
    return { left: rect.left + HANDLE_W, width: rect.width - HANDLE_W * 2 }
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return
    const { left, width } = getStripBounds()
    const pos = Math.max(0, Math.min(1, (e.clientX - left) / width))

    if (dragging === 'start') {
      setTrimStart(Math.min(pos, trimEnd - 0.02))
    } else if (dragging === 'end') {
      setTrimEnd(Math.max(pos, trimStart + 0.02))
    } else if (dragging === 'playhead') {
      // Constrain playhead within trim range
      const clamped = Math.max(trimStart, Math.min(trimEnd, pos))
      if (videoRef.current && duration) {
        videoRef.current.currentTime = clamped * duration
        videoRef.current.pause()
      }
    }
  }, [dragging, trimStart, trimEnd, duration])

  const handleMouseUp = () => {
    if (dragging === 'playhead' && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
    setDragging(null)
  }

  // Normalized playhead position within the strip (0-1 of full duration)
  const playheadNorm = duration > 0 ? currentTime / duration : 0

  return (
    <div
      style={{
        position: 'absolute', inset: 0, background: '#000', zIndex: 300,
        display: 'flex', flexDirection: 'column',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', flexShrink: 0,
      }}>
        <button onClick={onCancel} style={{
          color: colors.white, fontSize: fonts.size.lg, fontWeight: fonts.weight.medium,
        }}>
          Cancel
        </button>
        <span style={{ color: colors.white, fontSize: fonts.size.lg, fontWeight: fonts.weight.bold }}>
          Trim Video
        </span>
        <button onClick={() => onSave(trimStart, trimEnd)} style={{
          color: '#FFD60A', fontSize: fonts.size.lg, fontWeight: fonts.weight.bold,
        }}>
          Save
        </button>
      </div>

      {/* Video Preview */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 0, padding: '0 24px',
      }}>
        <video
          ref={videoRef}
          src={videoUrl}
          playsInline
          autoPlay
          style={{ width: '100%', maxHeight: '100%', borderRadius: 8, objectFit: 'contain' }}
        />
      </div>

      {/* Time labels */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '8px 24px 4px',
        color: 'rgba(255,255,255,0.7)', fontSize: fonts.size.sm, fontFamily: 'monospace',
      }}>
        <span>{duration > 0 ? formatTime(trimStart * duration) : '0:00.0'}</span>
        <span>{duration > 0 ? formatTime(trimEnd * duration) : '0:00.0'}</span>
      </div>

      {/* Filmstrip with trim handles */}
      <div
        ref={stripRef}
        style={{
          margin: '0 16px 32px',
          position: 'relative',
          height: FRAME_H + 8,
          userSelect: 'none',
        }}
      >
        {/* Filmstrip frames — full width between handles */}
        <div style={{
          position: 'absolute',
          top: 4,
          left: HANDLE_W,
          right: HANDLE_W,
          height: FRAME_H,
          display: 'flex',
          overflow: 'hidden',
          borderRadius: 2,
        }}>
          {frames.length > 0 ? frames.map((src, i) => (
            <img key={i} src={src} alt="" style={{
              flex: 1, minWidth: 0, height: FRAME_H, objectFit: 'cover',
            }} />
          )) : (
            Array.from({ length: FRAME_COUNT }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: FRAME_H, background: '#333' }} />
            ))
          )}
        </div>

        {/* Dimmed left region (before trim start) */}
        <div style={{
          position: 'absolute', top: 4, left: HANDLE_W, height: FRAME_H,
          width: `calc(${trimStart * 100}% * (100% - ${HANDLE_W * 2}px) / 100%)`,
          background: 'rgba(0,0,0,0.65)',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Dimmed right region (after trim end) */}
        <div style={{
          position: 'absolute', top: 4, right: HANDLE_W, height: FRAME_H,
          width: `calc(${(1 - trimEnd) * 100}% * (100% - ${HANDLE_W * 2}px) / 100%)`,
          background: 'rgba(0,0,0,0.65)',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Yellow selection frame — connects the two handles */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: `calc(${HANDLE_W}px + ${trimStart} * (100% - ${HANDLE_W * 2}px))`,
          right: `calc(${HANDLE_W}px + ${1 - trimEnd} * (100% - ${HANDLE_W * 2}px))`,
          height: FRAME_H + 8,
          borderTop: '4px solid #FFD60A',
          borderBottom: '4px solid #FFD60A',
          pointerEvents: 'none',
          zIndex: 3,
        }} />

        {/* Left handle — attached to yellow frame */}
        <div
          onMouseDown={(e) => { e.preventDefault(); setDragging('start') }}
          style={{
            position: 'absolute',
            top: 0,
            left: `calc(${trimStart} * (100% - ${HANDLE_W * 2}px))`,
            width: HANDLE_W,
            height: FRAME_H + 8,
            background: '#FFD60A',
            borderRadius: '6px 0 0 6px',
            cursor: 'ew-resize',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 4,
          }}
        >
          <div style={{ width: 3, height: 24, background: '#000', borderRadius: 2, opacity: 0.3 }} />
        </div>

        {/* Right handle — attached to yellow frame */}
        <div
          onMouseDown={(e) => { e.preventDefault(); setDragging('end') }}
          style={{
            position: 'absolute',
            top: 0,
            right: `calc(${1 - trimEnd} * (100% - ${HANDLE_W * 2}px))`,
            width: HANDLE_W,
            height: FRAME_H + 8,
            background: '#FFD60A',
            borderRadius: '0 6px 6px 0',
            cursor: 'ew-resize',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 4,
          }}
        >
          <div style={{ width: 3, height: 24, background: '#000', borderRadius: 2, opacity: 0.3 }} />
        </div>

        {/* Playhead — draggable, moves with playback */}
        <div
          onMouseDown={(e) => { e.preventDefault(); setDragging('playhead') }}
          style={{
            position: 'absolute',
            top: -4,
            left: `calc(${HANDLE_W}px + ${playheadNorm} * (100% - ${HANDLE_W * 2}px) - 1.5px)`,
            width: 3,
            height: FRAME_H + 16,
            background: colors.white,
            borderRadius: 2,
            boxShadow: '0 0 6px rgba(0,0,0,0.5)',
            cursor: 'ew-resize',
            zIndex: 5,
          }}
        >
          {/* Top knob */}
          <div style={{
            position: 'absolute', top: -4, left: -4, width: 11, height: 11,
            borderRadius: '50%', background: colors.white,
            boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
          }} />
        </div>
      </div>
    </div>
  )
}
