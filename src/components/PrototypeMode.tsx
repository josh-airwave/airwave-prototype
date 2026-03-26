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
  const layoutsRef = useRef<LayoutRegistry>({})

  const registerLayout = useCallback((screen: string, order: string[]) => {
    layoutsRef.current[screen] = order
  }, [])

  const handleToggle = async () => {
    if (editMode) {
      // Exiting edit mode — save all layouts to source files
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
  }

  return (
    <PrototypeModeContext.Provider value={{ editMode, setEditMode, registerLayout }}>
      {children}
      <button
        onClick={handleToggle}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          padding: '8px 16px',
          background: editMode ? colors.danger : colors.primary,
          color: colors.white,
          fontSize: fonts.size.sm,
          fontWeight: fonts.weight.bold,
          borderRadius: 8,
          border: 'none',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {editMode ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Save Layout
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            Prototype
          </>
        )}
      </button>
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
