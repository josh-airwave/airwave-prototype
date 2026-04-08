import React, { createContext, useContext, useState, useRef, useCallback } from 'react'
import { colors, fonts } from '../styles/theme'

// --- Layout registry: screens register their section orders ---
type LayoutRegistry = Record<string, string[]>

interface PrototypeModeContextType {
  editMode: boolean
  setEditMode: (v: boolean) => void
  registerLayout: (screen: string, order: string[]) => void
}

const PrototypeModeContext = createContext<PrototypeModeContextType>({
  editMode: false,
  setEditMode: () => {},
  registerLayout: () => {},
})

export function usePrototypeMode() {
  return useContext(PrototypeModeContext)
}

export function PrototypeModeProvider({ children }: { children: React.ReactNode }) {
  const [editMode, setEditMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const layoutsRef = useRef<LayoutRegistry>({})

  const registerLayout = useCallback((screen: string, order: string[]) => {
    layoutsRef.current[screen] = order
  }, [])

  const handleToggle = async () => {
    if (editMode) {
      for (const [screen, order] of Object.entries(layoutsRef.current)) {
        try {
          const res = await fetch('/api/layout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ screen, sectionOrder: order }),
          })
          const data = await res.json()
          if (data.success) {
            console.log(`[Prototype] Saved ${screen} layout: [${order.join(', ')}]`)
          } else {
            console.error(`[Prototype] Failed to save ${screen}:`, data.error)
          }
        } catch (e) {
          console.error(`[Prototype] Error saving ${screen}:`, e)
        }
      }
    }
    setEditMode(!editMode)
    setMenuOpen(false)
  }

  return (
    <PrototypeModeContext.Provider value={{ editMode, setEditMode, registerLayout }}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            padding: '8px 16px',
            background: editMode ? colors.danger : 'rgba(255,255,255,0.12)',
            color: colors.white,
            fontSize: fonts.size.sm,
            fontWeight: fonts.weight.bold,
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          Dev Tools
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
            <polyline points={menuOpen ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
          </svg>
        </button>

        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 6,
            background: '#1e1e2e',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            overflow: 'hidden',
            minWidth: 200,
          }}>
            <button
              onClick={handleToggle}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 14px', border: 'none',
                background: 'none', color: editMode ? '#f87171' : colors.white,
                fontSize: 13, cursor: 'pointer', textAlign: 'left',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              {editMode ? 'Save Layout' : 'Edit Layout'}
            </button>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <a
              href="/bbox-tool.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 14px', border: 'none',
                background: 'none', color: colors.white,
                fontSize: 13, cursor: 'pointer', textDecoration: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <rect x="7" y="7" width="10" height="10" rx="1" strokeDasharray="3 2" />
              </svg>
              Bbox Tool
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" style={{ marginLeft: 'auto' }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </PrototypeModeContext.Provider>
  )
}

// --- Draggable Section ---
interface DraggableSectionProps {
  id: string
  children: React.ReactNode
  onReorder: (fromId: string, toId: string) => void
  style?: React.CSSProperties
  flex?: number | string
}

export function DraggableSection({ id, children, onReorder, style, flex }: DraggableSectionProps) {
  const { editMode } = usePrototypeMode()
  const [isOver, setIsOver] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  if (!editMode) {
    return <div style={{ ...style, flex, minHeight: flex ? 0 : undefined }}>{children}</div>
  }

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', id)
        e.dataTransfer.effectAllowed = 'move'
        setIsDragging(true)
      }}
      onDragEnd={() => setIsDragging(false)}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setIsOver(true)
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsOver(false)
        const fromId = e.dataTransfer.getData('text/plain')
        if (fromId && fromId !== id) {
          onReorder(fromId, id)
        }
      }}
      style={{
        ...style,
        flex,
        minHeight: flex ? 0 : undefined,
        opacity: isDragging ? 0.3 : 1,
        cursor: 'grab',
        position: 'relative',
        outline: isOver ? `2px dashed ${colors.primary}` : `1px dashed rgba(22,91,195,0.3)`,
        outlineOffset: -1,
        transition: 'opacity 0.15s',
      }}
    >
      {/* Section label */}
      <div style={{
        position: 'absolute',
        top: 2,
        left: 4,
        fontSize: '9px',
        fontWeight: 700,
        color: colors.primary,
        background: 'rgba(255,255,255,0.9)',
        padding: '1px 4px',
        borderRadius: 3,
        zIndex: 10,
        pointerEvents: 'none',
        textTransform: 'uppercase',
        letterSpacing: 1,
      }}>
        {id}
      </div>
      {children}
    </div>
  )
}
