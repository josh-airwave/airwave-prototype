import React, { useState, useCallback, useRef } from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { Header } from '../components/Header'
import { VideoThumbnail } from '../components/VideoThumbnail'
import { useNavigation } from '../navigation/Router'
import { galleryItems } from '../data/mock'

export function GalleryScreen() {
  const { push, pop } = useNavigation()
  const [durations, setDurations] = useState<Record<string, string>>({})
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const handleDuration = useCallback((id: string, dur: string) => {
    setDurations(prev => ({ ...prev, [id]: dur }))
  }, [])

  const toggleItem = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const toggleSelectAll = (items: typeof galleryItems) => {
    const allSelected = items.every(i => selectedIds.has(i.id))
    const next = new Set(selectedIds)
    if (allSelected) {
      items.forEach(i => next.delete(i.id))
    } else {
      items.forEach(i => next.add(i.id))
    }
    setSelectedIds(next)
  }

  const longPressTimerRef = useRef<number>(0)

  const handleItemPress = (item: typeof galleryItems[0]) => {
    if (selectMode) {
      toggleItem(item.id)
    } else {
      push(item.type === 'video' ? 'VideoZoom' : 'ImageZoom', { itemId: item.id })
    }
  }

  const handleLongPressStart = (item: typeof galleryItems[0]) => {
    if (selectMode) return
    longPressTimerRef.current = window.setTimeout(() => {
      setSelectMode(true)
      setSelectedIds(new Set([item.id]))
    }, 500)
  }

  const handleLongPressEnd = () => {
    clearTimeout(longPressTimerRef.current)
  }

  const grouped = galleryItems.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = []
    acc[item.date].push(item)
    return acc
  }, {} as Record<string, typeof galleryItems>)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: colors.white }}>
      {selectMode ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px 8px', position: 'relative',
        }}>
          {/* Left: Delete */}
          <button
            onClick={() => setSelectedIds(new Set())}
            style={{
              color: selectedIds.size > 0 ? colors.danger : colors.neutral400,
              fontSize: fonts.size.md, fontWeight: fonts.weight.medium,
              minWidth: 60, textAlign: 'left',
            }}
          >
            Delete
          </button>
          {/* Center: Title */}
          <span style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            fontSize: fonts.size.xl, fontWeight: fonts.weight.bold, color: colors.textPrimary,
            whiteSpace: 'nowrap',
          }}>
            {selectedIds.size > 0 ? `Selected (${selectedIds.size})` : 'Select'}
          </span>
          {/* Right: Cancel */}
          <button
            onClick={() => { setSelectMode(false); setSelectedIds(new Set()) }}
            style={{ color: colors.primary, fontSize: fonts.size.md, fontWeight: fonts.weight.medium }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <Header
          title="Gallery"
          showBack
          onBack={pop}
          rightAction={
            <button
              onClick={() => setSelectMode(true)}
              style={{ color: colors.primary, fontSize: fonts.size.md, fontWeight: fonts.weight.semibold }}
            >
              Select
            </button>
          }
        />
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 100px' }}>
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 16px 4px',
            }}>
              <div>
                <div style={{ fontSize: fonts.size.lg, fontWeight: fonts.weight.bold }}>{date}</div>
                <div style={{ fontSize: fonts.size.sm, color: colors.textSecondary }}>
                  {items[0].time}
                </div>
              </div>
              <button
                onClick={() => {
                  if (selectMode) {
                    toggleSelectAll(items)
                  } else {
                    // Share All - select all in batch and go to ShareView
                    const ids = items.map(i => i.id)
                    push('ShareView', { itemId: ids[0], batchIds: ids })
                  }
                }}
                style={{
                  padding: '4px 12px',
                  border: `1px solid ${colors.gray300}`,
                  borderRadius: radius.sm,
                  fontSize: fonts.size.sm,
                  fontWeight: fonts.weight.medium,
                }}
              >
                {selectMode
                  ? (items.every(i => selectedIds.has(i.id)) ? 'Unselect All' : 'Select All')
                  : 'Share All'
                }
              </button>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 2,
              padding: '8px 2px',
            }}>
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleItemPress(item)}
                  onMouseDown={() => handleLongPressStart(item)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart(item)}
                  onTouchEnd={handleLongPressEnd}
                  style={{
                    position: 'relative',
                    aspectRatio: '3/5',
                    background: colors.coolMedium,
                    borderRadius: 4,
                    overflow: 'hidden',
                    padding: 0,
                    border: 'none',
                    cursor: 'pointer',
                  }}>
                  {item.type === 'video' && item.videoUrl ? (
                    <VideoThumbnail
                      src={item.videoUrl}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onDurationDetected={(dur) => handleDuration(item.id, dur)}
                      scrubDuration={5}
                    />
                  ) : (
                    <img
                      src={item.thumbnail}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                  {/* Duration overlay for videos */}
                  {item.type === 'video' && (
                    <span style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      color: colors.white,
                      fontSize: '22px',
                      fontWeight: fonts.weight.semibold,
                      textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                      pointerEvents: 'none',
                    }}>
                      {durations[item.id] || ''}
                    </span>
                  )}
                  {/* Camera icon for photos */}
                  {item.type === 'photo' && (
                    <img
                      src="/icons/ic_photo_camera_white.png"
                      alt=""
                      style={{
                        position: 'absolute',
                        bottom: 6,
                        right: 6,
                        width: 20,
                        height: 20,
                        objectFit: 'contain',
                        opacity: 0.8,
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                  {/* Selection checkmark - top right corner */}
                  {selectMode && (
                    <div style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: selectedIds.has(item.id) ? colors.primary : 'rgba(255,255,255,0.6)',
                      border: selectedIds.has(item.id) ? 'none' : '2px solid rgba(255,255,255,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                    }}>
                      {selectedIds.has(item.id) && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Next button - slides up when items selected in select mode */}
      {selectMode && selectedIds.size > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 24,
          left: '15%',
          right: '15%',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <button
            onClick={() => {
              const ids = [...selectedIds]
              push('ShareView', { itemId: ids[0], batchIds: ids })
            }}
            style={{
              width: '100%',
              height: 56,
              borderRadius: 61,
              background: colors.primary,
              color: colors.white,
              fontSize: fonts.size.lg,
              fontWeight: fonts.weight.bold,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22,91,195,0.4)',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
