import React, { useState, useRef, useEffect } from 'react'
import { colors, fonts } from '../styles/theme'
import * as tf from '@tensorflow/tfjs'
import * as blazeface from '@tensorflow-models/blazeface'

export interface FaceRegion {
  id: number
  x: number      // normalized center x 0-1
  y: number      // normalized center y 0-1
  width: number   // normalized 0-1
  height: number  // normalized 0-1
  enabled: boolean
}

interface TrackedFace {
  id: number
  // Current smoothed position (normalized)
  cx: number
  cy: number
  w: number
  h: number
  enabled: boolean
  // Tracking state
  missedFrames: number // how many consecutive frames this face wasn't detected
  lastSeenTime: number // timestamp of last detection
}

interface FaceBlurOverlayProps {
  videoUrl: string
  initialRegions?: FaceRegion[]
  onDone: (regions: FaceRegion[]) => void
  onCancel: () => void
}

const DETECT_INTERVAL = 150  // ms between detection runs
const MATCH_THRESHOLD = 0.25 // normalized distance - much more generous for moving faces
const MAX_MISSED_FRAMES = 8  // remove face after this many consecutive misses
const SMOOTH_FACTOR = 0.4    // how quickly position updates (0=no update, 1=instant)

function trackedToRegion(t: TrackedFace): FaceRegion {
  return {
    id: t.id,
    x: t.cx - t.w / 2,
    y: t.cy - t.h / 2,
    width: t.w,
    height: t.h,
    enabled: t.enabled,
  }
}

export function FaceBlurOverlay({ videoUrl, initialRegions, onDone, onCancel }: FaceBlurOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const modelRef = useRef<blazeface.BlazeFaceModel | null>(null)
  const animRef = useRef<number>(0)
  const detectRef = useRef<number>(0)
  const [faces, setFaces] = useState<FaceRegion[]>(initialRegions || [])
  const [loading, setLoading] = useState(true)
  const [detecting, setDetecting] = useState(false)

  // Core tracking state - lives in refs to avoid stale closures
  const trackedRef = useRef<TrackedFace[]>(
    (initialRegions || []).map(r => ({
      id: r.id,
      cx: r.x + r.width / 2,
      cy: r.y + r.height / 2,
      w: r.width,
      h: r.height,
      enabled: r.enabled,
      missedFrames: 0,
      lastSeenTime: Date.now(),
    }))
  )
  const nextIdRef = useRef(initialRegions?.length || 0)

  // Load BlazeFace model
  useEffect(() => {
    let cancelled = false
    async function loadModel() {
      await tf.ready()
      const model = await blazeface.load()
      if (!cancelled) {
        modelRef.current = model
        setLoading(false)
      }
    }
    loadModel()
    return () => { cancelled = true }
  }, [])

  // Face detection loop with proper tracking
  useEffect(() => {
    if (loading || !modelRef.current) return
    const video = videoRef.current
    if (!video) return

    const detect = async () => {
      if (!video || video.paused || video.ended || !modelRef.current) return
      setDetecting(true)

      try {
        const predictions = await modelRef.current.estimateFaces(video, false)
        const vw = video.videoWidth || video.clientWidth
        const vh = video.videoHeight || video.clientHeight

        // Convert predictions to normalized center+size
        const detections = predictions.map((pred: any) => {
          const tl = pred.topLeft as [number, number]
          const br = pred.bottomRight as [number, number]
          const w = (br[0] - tl[0]) / vw
          const h = (br[1] - tl[1]) / vh
          return {
            cx: (tl[0] / vw) + w / 2,
            cy: (tl[1] / vh) + h / 2,
            w,
            h,
          }
        })

        const tracked = trackedRef.current
        const matchedTracked = new Set<number>()  // indices into tracked
        const matchedDet = new Set<number>()      // indices into detections

        // Greedy matching: find closest pairs first
        const pairs: { ti: number; di: number; dist: number }[] = []
        for (let ti = 0; ti < tracked.length; ti++) {
          for (let di = 0; di < detections.length; di++) {
            const dx = tracked[ti].cx - detections[di].cx
            const dy = tracked[ti].cy - detections[di].cy
            const dist = Math.sqrt(dx * dx + dy * dy)
            pairs.push({ ti, di, dist })
          }
        }
        pairs.sort((a, b) => a.dist - b.dist)

        for (const { ti, di, dist } of pairs) {
          if (matchedTracked.has(ti) || matchedDet.has(di)) continue
          if (dist > MATCH_THRESHOLD) continue

          // Match found - update tracked face position with smoothing
          matchedTracked.add(ti)
          matchedDet.add(di)

          const det = detections[di]
          tracked[ti].cx += (det.cx - tracked[ti].cx) * SMOOTH_FACTOR
          tracked[ti].cy += (det.cy - tracked[ti].cy) * SMOOTH_FACTOR
          tracked[ti].w += (det.w - tracked[ti].w) * SMOOTH_FACTOR
          tracked[ti].h += (det.h - tracked[ti].h) * SMOOTH_FACTOR
          tracked[ti].missedFrames = 0
          tracked[ti].lastSeenTime = Date.now()
        }

        // Increment missed frames for unmatched tracked faces
        for (let ti = 0; ti < tracked.length; ti++) {
          if (!matchedTracked.has(ti)) {
            tracked[ti].missedFrames++
          }
        }

        // Remove faces that have been missing too long
        const surviving = tracked.filter(t => t.missedFrames < MAX_MISSED_FRAMES)

        // Add new faces for unmatched detections
        for (let di = 0; di < detections.length; di++) {
          if (matchedDet.has(di)) continue
          const det = detections[di]
          // Only add if it's not too close to an existing face (prevent duplicates)
          const tooClose = surviving.some(t => {
            const dx = t.cx - det.cx
            const dy = t.cy - det.cy
            return Math.sqrt(dx * dx + dy * dy) < 0.1
          })
          if (!tooClose) {
            surviving.push({
              id: nextIdRef.current++,
              cx: det.cx,
              cy: det.cy,
              w: det.w,
              h: det.h,
              enabled: true,
              missedFrames: 0,
              lastSeenTime: Date.now(),
            })
          }
        }

        trackedRef.current = surviving
        setFaces(surviving.map(trackedToRegion))
      } catch (e) {
        // Silently handle detection errors
      }
      setDetecting(false)
    }

    detectRef.current = window.setInterval(detect, DETECT_INTERVAL)
    return () => clearInterval(detectRef.current)
  }, [loading])

  // Draw blur canvas loop - runs every animation frame
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')!

    const draw = () => {
      canvas.width = video.clientWidth
      canvas.height = video.clientHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!video.paused && !video.ended) {
        const tracked = trackedRef.current
        for (const face of tracked) {
          if (!face.enabled) continue

          // Convert normalized center+size to pixel coords
          const fx = face.cx * canvas.width
          const fy = face.cy * canvas.height
          const fw = face.w * canvas.width
          const fh = face.h * canvas.height

          // Generous padding so blur covers the whole head
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

          // Multiple blur passes for truly opaque blur
          for (let pass = 0; pass < 3; pass++) {
            ctx.save()
            ctx.filter = 'blur(30px)'
            ctx.beginPath()
            ctx.ellipse(fx, fy, bw / 2, bh / 2, 0, 0, Math.PI * 2)
            ctx.clip()
            ctx.drawImage(video, sx, sy, sw, sh, bx, by, bw, bh)
            ctx.restore()
          }
          // Final solid tinted pass to ensure face is unrecognizable
          ctx.save()
          ctx.beginPath()
          ctx.ellipse(fx, fy, bw * 0.4, bh * 0.4, 0, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(180, 180, 180, 0.35)'
          ctx.fill()
          ctx.restore()
        }
      }
      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const toggleFace = (id: number) => {
    const tracked = trackedRef.current
    for (const t of tracked) {
      if (t.id === id) t.enabled = !t.enabled
    }
    setFaces(tracked.map(trackedToRegion))
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#000', zIndex: 300,
      display: 'flex', flexDirection: 'column',
    }}>
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
          Blur Faces
          {loading && <span style={{ fontSize: fonts.size.sm, fontWeight: fonts.weight.regular, marginLeft: 8, color: 'rgba(255,255,255,0.5)' }}>Loading model...</span>}
        </span>
        <button onClick={() => onDone(faces)} style={{
          color: colors.primary, fontSize: fonts.size.lg, fontWeight: fonts.weight.bold,
        }}>
          Done
        </button>
      </div>

      {/* Video + Canvas stack */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 0, padding: '0 24px', position: 'relative',
      }}>
        <div style={{ position: 'relative', width: '100%', maxHeight: '100%' }}>
          <video
            ref={videoRef}
            src={videoUrl}
            playsInline
            autoPlay
            loop
            muted
            style={{ width: '100%', borderRadius: 8, objectFit: 'contain', display: 'block' }}
          />
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              borderRadius: 8, pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Detected faces list */}
      <div style={{
        padding: '12px 16px 28px',
        flexShrink: 0,
      }}>
        {faces.length === 0 && !loading && (
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: fonts.size.md, textAlign: 'center', padding: '8px 0' }}>
            {detecting ? 'Detecting faces...' : 'No faces detected. Play the video to detect faces.'}
          </div>
        )}
        {faces.length > 0 && (
          <>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: fonts.size.sm, marginBottom: 8 }}>
              Tap a face to toggle blur ({faces.filter(f => f.enabled).length} of {faces.length} blurred)
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {faces.map((face, i) => (
                <button
                  key={face.id}
                  onClick={() => toggleFace(face.id)}
                  style={{
                    width: 48, height: 48, borderRadius: 8, flexShrink: 0,
                    background: face.enabled ? colors.primary : '#333',
                    border: face.enabled ? '2px solid #ADCEFF' : '2px solid #555',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', position: 'relative',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={face.enabled ? 'white' : '#888'} strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.97 4.03-9 8-9s8 4.03 8 9" />
                  </svg>
                  <div style={{
                    position: 'absolute', top: -4, right: -4,
                    width: 16, height: 16, borderRadius: '50%',
                    background: face.enabled ? colors.primary : '#555',
                    color: 'white', fontSize: '9px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1.5px solid #000',
                  }}>
                    {i + 1}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
