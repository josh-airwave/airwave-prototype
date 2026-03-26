import React, { useRef, useEffect } from 'react'

interface VideoThumbnailProps {
  src: string
  style?: React.CSSProperties
  onDurationDetected?: (duration: string) => void
  scrubDuration?: number // seconds to scrub through the entire video, default 10
}

export function VideoThumbnail({ src, style, onDurationDetected, scrubDuration = 10 }: VideoThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const durationReported = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleMeta = () => {
      const dur = video.duration
      if (!dur || !isFinite(dur)) return

      if (onDurationDetected && !durationReported.current) {
        durationReported.current = true
        const m = Math.floor(dur / 60)
        const s = Math.floor(dur % 60)
        onDurationDetected(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
      }

      // Smooth timelapse: play first 15s of video at accelerated rate
      const previewLength = Math.min(15, dur)
      const rate = Math.min(16, Math.max(1, previewLength / scrubDuration))
      video.playbackRate = rate
      video.currentTime = 0
      video.play().catch(() => {})

      // Loop back to start when we hit 15s
      const onTimeUpdate = () => {
        if (video.currentTime >= previewLength) {
          video.currentTime = 0
        }
      }
      video.addEventListener('timeupdate', onTimeUpdate)
      video.addEventListener('ended', () => { video.currentTime = 0; video.play().catch(() => {}) })
    }

    video.addEventListener('loadedmetadata', handleMeta)

    // Also try if metadata already loaded
    if (video.readyState >= 1) handleMeta()

    return () => {
      video.removeEventListener('loadedmetadata', handleMeta)
      video.pause()
    }
  }, [src, scrubDuration])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <video
        ref={videoRef}
        src={src}
        muted
        preload="auto"
        playsInline
        style={{ ...style, pointerEvents: 'none' }}
      />
    </div>
  )
}
