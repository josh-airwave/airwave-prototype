/**
 * ScreenExporter — Dev-only utility
 *
 * Press 'E' to export the current feature's screens.
 * Claude keeps export-screens.ts updated as you work.
 *
 * Uses html-to-image (SVG foreignObject) for pixel-perfect captures.
 */
import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigation } from '../navigation/Router'
import { toPng } from 'html-to-image'
import JSZip from 'jszip'
import { CURRENT_EXPORT } from './export-screens'

function waitForRender(ms = 600): Promise<void> {
  return new Promise(resolve => {
    requestAnimationFrame(() => setTimeout(resolve, ms))
  })
}

function pauseAllVideos() {
  document.querySelectorAll('video').forEach(v => {
    try {
      v.pause()
      if (v.readyState >= 1 && v.duration > 1) v.currentTime = 1
    } catch (_) {}
  })
}

export function ScreenExporter() {
  try {
    return <ScreenExporterInner />
  } catch (e) {
    console.warn('[ScreenExporter] render error, skipping:', e)
    return null
  }
}

function ScreenExporterInner() {
  const { reset } = useNavigation()
  const [exporting, setExporting] = useState(false)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [error, setError] = useState(false)
  const busyRef = useRef(false)

  // If we've errored, just bail
  if (error) return null

  const doExport = useCallback(async () => {
    if (busyRef.current) return
    try {
      const { feature, screens } = CURRENT_EXPORT
      if (screens.length === 0) return

    busyRef.current = true
    setExporting(true)

    const zip = new JSZip()

    for (let i = 0; i < screens.length; i++) {
      const s = screens[i]
      setStep(i + 1)
      setName(s.name)

      reset(s.screen, s.params)
      await waitForRender(s.delay ?? 1200)
      pauseAllVideos()
      await waitForRender(400)

      const el = document.querySelector('[data-screen-export="phone-frame"]') as HTMLElement
      if (!el) continue

      try {
        // Get exact rendered dimensions
        const rect = el.getBoundingClientRect()
        const pixelRatio = 2

        // 1x1 gray pixel as fallback for cross-origin images that fail CORS
        const PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPk3KFb1AAAAABJRU5ErkJggg=='

        const opts = {
          width: rect.width,
          height: rect.height,
          pixelRatio,
          cacheBust: true,
          skipFonts: true,
          imagePlaceholder: PLACEHOLDER,
          // Skip export overlay and prototype-only UI hints
          filter: (node: HTMLElement) => {
            if (node?.hasAttribute?.('data-export-overlay')) return false
            if (node?.hasAttribute?.('data-prototype-only')) return false
            return true
          },
          style: {
            animationDuration: '0s',
            animationDelay: '0s',
            transitionDuration: '0s',
            transitionDelay: '0s',
          },
        }

        // First call can fail due to image loading; retry once
        let dataUrl: string
        try {
          dataUrl = await toPng(el, opts)
        } catch (_) {
          await waitForRender(500)
          dataUrl = await toPng(el, opts)
        }

        // Convert data URL to blob
        const res = await fetch(dataUrl)
        const blob = await res.blob()
        const idx = String(i + 1).padStart(2, '0')
        zip.file(`${idx}-${s.name}.png`, blob)
      } catch (err) {
        console.warn(`[Export] Failed: ${s.name}`, err)
      }
    }

    setName('Zipping...')
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(zipBlob)
    a.download = `${feature}-${new Date().toISOString().slice(0, 10)}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    reset('ChannelList')
    setExporting(false)
    busyRef.current = false
    } catch (err) {
      console.warn('[ScreenExporter] export error:', err)
      setError(true)
      setExporting(false)
      busyRef.current = false
    }
  }, [reset])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if ((e.target as HTMLElement)?.isContentEditable) return
      if ((e.key === 'e' || e.key === 'E') && !e.metaKey && !e.ctrlKey && !e.altKey && !busyRef.current) {
        e.preventDefault()
        doExport()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [doExport])

  if (!exporting) return null

  const total = CURRENT_EXPORT.screens.length

  return (
    <div data-export-overlay style={{
      position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
      zIndex: 99999, pointerEvents: 'none',
    }}>
      <div style={{
        background: 'rgba(0,0,0,0.88)', color: 'white', padding: '10px 20px',
        borderRadius: 10, fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 500,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', minWidth: 220,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 14, height: 14, border: '2px solid rgba(255,255,255,0.25)',
            borderTopColor: 'white', borderRadius: '50%', animation: 'export-spin 0.7s linear infinite',
          }} />
          <span>{CURRENT_EXPORT.label}</span>
        </div>
        <div style={{ fontSize: 11, opacity: 0.5 }}>
          Screen {step} of {total} &middot; {name}
        </div>
      </div>
      <style>{`@keyframes export-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
