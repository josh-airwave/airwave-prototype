import React, { useState, useRef } from 'react'
import { colors } from '../styles/theme'
import { useNavigation } from '../navigation/Router'
import { galleryItems } from '../data/mock'

export function ImageZoomScreen({ params }: { params?: Record<string, unknown> }) {
  const { pop } = useNavigation()
  const itemId = (params?.itemId as string) || galleryItems[0].id
  const directImageUrl = params?.imageUrl as string | undefined
  const item = galleryItems.find(i => i.id === itemId) || galleryItems[0]

  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const translateStart = useRef({ x: 0, y: 0 })

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
    if (!isDragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setTranslate({
      x: translateStart.current.x + dx,
      y: translateStart.current.y + dy,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1)
      setTranslate({ x: 0, y: 0 })
    } else {
      setScale(2.5)
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
        cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
        userSelect: 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Image area */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={directImageUrl || item.thumbnail}
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
      </div>

      {/* Close button */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '16px 0 36px',
      }}>
        <button
          onClick={pop}
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

      {/* Zoom indicator */}
      {scale > 1 && (
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
