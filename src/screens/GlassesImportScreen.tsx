import React, { useState, useEffect, useMemo } from 'react'
import { colors, fonts } from '../styles/theme'
import { useNavigation } from '../navigation/Router'
import { galleryItems } from '../data/mock'

/**
 * Glasses Import Screen - replicates the iOS PreFlightScreen flow.
 *
 * Flow:
 *   1. "Connecting to your Glasses WiFi" with spinner (~1.5s)
 *   2. "Importing media from glasses" with per-item progress bar
 *   3. All imported - thumbnails show, Done + Share enable
 *
 * Header: "Importing files (N)" during import, "Imported files (N)" after.
 * Thumbnail strip: 38x65 cells, selected cell has purple border, progress bar on unfinished items.
 * Preview area: shows current item's progress during import, or the media after.
 * Footer: play/pause (disabled for photos) and trash.
 */

type ImportPhase = 'connecting' | 'importing' | 'done'

interface ImportingItem {
  id: string
  type: 'video' | 'photo'
  thumbnail: string
  videoUrl?: string
  duration?: string
  progress: number // 0..1
  isImport: boolean // false once fully imported
}

// Items the glasses "have" to import - 4 items for a good demo
const IMPORT_SOURCE = galleryItems.slice(0, 4).map(g => ({
  id: g.id,
  type: g.type as 'video' | 'photo',
  thumbnail: g.thumbnail,
  videoUrl: g.videoUrl,
  duration: g.duration,
}))

export function GlassesImportScreen({ params }: { params?: Record<string, unknown> }) {
  const { pop } = useNavigation()
  const freezeState = params?.freezeState === true
  const initialPhase = (params?.initialPhase as ImportPhase) || 'connecting'
  const initialSelectedIndex = typeof params?.initialSelectedIndex === 'number' ? params.initialSelectedIndex : 0

  const [phase, setPhase] = useState<ImportPhase>(initialPhase)
  const [items, setItems] = useState<ImportingItem[]>(
    IMPORT_SOURCE.map(s => ({
      ...s,
      progress: freezeState && initialPhase === 'done' ? 1 : 0,
      isImport: !(freezeState && initialPhase === 'done'),
    }))
  )
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex)
  const [playingVideo, setPlayingVideo] = useState(false)

  const selectedItem = items[selectedIndex]
  const allDone = phase === 'done'

  // Phase progression - skipped in freeze mode for screen captures
  useEffect(() => {
    if (freezeState) return

    // Connecting phase - 2.5s (WiFi connection takes a moment)
    if (phase === 'connecting') {
      const t = setTimeout(() => setPhase('importing'), 2500)
      return () => clearTimeout(t)
    }

    // Importing phase - sequentially fill each item, 1.8s each
    if (phase === 'importing') {
      let cancelled = false
      const runItem = (idx: number) => {
        if (cancelled || idx >= items.length) {
          if (!cancelled) setPhase('done')
          return
        }
        const duration = 1800
        const start = Date.now()
        const tick = () => {
          if (cancelled) return
          const elapsed = Date.now() - start
          const t = Math.min(1, elapsed / duration)
          setItems(prev => {
            const next = [...prev]
            next[idx] = { ...next[idx], progress: t, isImport: t < 1 }
            return next
          })
          if (t < 1) {
            requestAnimationFrame(tick)
          } else {
            runItem(idx + 1)
          }
        }
        tick()
      }
      runItem(0)
      return () => { cancelled = true }
    }
  }, [phase, freezeState])

  // Any item still importing?
  const isStillImporting = items.some(it => it.isImport)
  const headerTitle = allDone
    ? `Imported files (${items.length})`
    : `Importing files (${items.length})`

  const statusText = useMemo(() => {
    if (phase === 'connecting') return 'Connecting to your Glasses WiFi'
    if (phase === 'importing') return 'Importing media from glasses'
    return ''
  }, [phase])

  const handleDone = () => {
    pop()
  }

  const handleShare = () => {
    // In the real app this opens the share menu - for prototype we just pop back
    pop()
  }

  const handleDelete = () => {
    if (!selectedItem) return
    const newItems = items.filter((_, i) => i !== selectedIndex)
    if (newItems.length === 0) {
      pop()
      return
    }
    setItems(newItems)
    setSelectedIndex(Math.min(selectedIndex, newItems.length - 1))
  }

  const isVideo = selectedItem?.type === 'video'
  const showProgressPreview = selectedItem?.isImport

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: colors.white,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: `1px solid ${colors.border}`,
        minHeight: 44,
      }}>
        <button
          onClick={handleDone}
          disabled={isStillImporting}
          style={{
            background: 'none', border: 'none',
            color: isStillImporting ? colors.neutral400 : colors.primary,
            fontSize: fonts.size.lg, fontWeight: fonts.weight.semibold,
            fontFamily: fonts.family,
            cursor: isStillImporting ? 'default' : 'pointer',
            padding: 4,
          }}
        >
          Done
        </button>
        <div style={{
          fontSize: fonts.size.lg, fontWeight: fonts.weight.bold,
          fontFamily: fonts.family, color: colors.almostBlack,
          whiteSpace: 'nowrap',
        }}>
          {headerTitle}
        </div>
        <button
          onClick={handleShare}
          disabled={isStillImporting}
          style={{
            background: isStillImporting ? colors.coolLight : colors.primary,
            border: 'none', borderRadius: 8,
            color: isStillImporting ? colors.neutral400 : colors.white,
            fontSize: fonts.size.md, fontWeight: fonts.weight.semibold,
            fontFamily: fonts.family,
            cursor: isStillImporting ? 'default' : 'pointer',
            padding: '6px 14px',
          }}
        >
          Share
        </button>
      </div>

      {/* Thumbnail strip */}
      <div style={{
        display: 'flex', gap: 4,
        padding: '12px 24px',
        overflowX: 'auto',
        background: colors.white,
      }}>
        {items.map((item, idx) => {
          const isSelected = idx === selectedIndex
          const showProgress = item.isImport
          return (
            <button
              key={item.id}
              onClick={() => setSelectedIndex(idx)}
              style={{
                position: 'relative',
                width: 38, height: 65,
                borderRadius: 4,
                background: colors.coolLight,
                border: isSelected ? `3px solid ${colors.polyPurple}` : `1px solid ${colors.neutralGray}`,
                padding: 0,
                cursor: 'pointer',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {!item.isImport && (
                <img
                  src={item.thumbnail}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              )}
              {showProgress && (
                <div style={{
                  position: 'absolute', bottom: 4, left: 4, right: 4,
                  height: 4, background: colors.coolMedium, borderRadius: 100,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${item.progress * 100}%`, height: '100%',
                    background: colors.primaryDark,
                    transition: 'width 0.1s linear',
                  }} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Preview area */}
      <div style={{
        flex: 1, padding: '0 24px 16px',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          flex: 1,
          background: colors.coolLight,
          border: `1px solid ${colors.neutralGray}`,
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {showProgressPreview ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 12,
              padding: 24,
            }}>
              <div style={{
                fontSize: fonts.size.md, fontWeight: fonts.weight.medium,
                fontFamily: fonts.family, color: colors.primaryDark,
                textAlign: 'center',
              }}>
                {statusText}
              </div>
              {phase === 'importing' ? (
                <div style={{
                  width: 240, height: 6,
                  background: colors.coolMedium, borderRadius: 100,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${(selectedItem?.progress ?? 0) * 100}%`, height: '100%',
                    background: colors.primaryDark,
                    transition: 'width 0.1s linear',
                  }} />
                </div>
              ) : (
                // Spinner for connecting phase
                <div style={{
                  width: 36, height: 36,
                  border: `3px solid ${colors.neutralGray}`,
                  borderTopColor: colors.neutral500,
                  borderRadius: '50%',
                  animation: 'spin 0.9s linear infinite',
                }} />
              )}
            </div>
          ) : (
            <>
              {isVideo && playingVideo && selectedItem?.videoUrl ? (
                <video
                  src={selectedItem.videoUrl}
                  autoPlay
                  controls={false}
                  onEnded={() => setPlayingVideo(false)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <img
                  src={selectedItem?.thumbnail}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              )}
              {isVideo && selectedItem?.duration && !playingVideo && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  background: colors.almostBlack,
                  color: colors.white,
                  padding: '3px 10px', borderRadius: 6,
                  fontSize: fonts.size.sm, fontWeight: fonts.weight.semibold,
                  fontFamily: fonts.family,
                }}>
                  {selectedItem.duration}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer - play/pause and trash */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 32,
        padding: '12px 16px 28px',
      }}>
        <button
          onClick={() => isVideo && setPlayingVideo(p => !p)}
          disabled={!isVideo || showProgressPreview}
          style={{
            width: 44, height: 44, borderRadius: 22,
            background: colors.coolLight, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: (isVideo && !showProgressPreview) ? 'pointer' : 'default',
            opacity: (isVideo && !showProgressPreview) ? 1 : 0.4,
          }}
        >
          {playingVideo ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill={colors.almostBlack}>
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill={colors.almostBlack}>
              <polygon points="8,5 19,12 8,19" />
            </svg>
          )}
        </button>
        <button
          onClick={handleDelete}
          disabled={!selectedItem || showProgressPreview}
          style={{
            width: 44, height: 44, borderRadius: 22,
            background: colors.coolLight, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: (selectedItem && !showProgressPreview) ? 'pointer' : 'default',
            opacity: (selectedItem && !showProgressPreview) ? 1 : 0.4,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.redStatus} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
