import React from 'react'
import { colors, fonts } from '../styles/theme'
import { useNavigation } from '../navigation/Router'

interface HeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  showMenu?: boolean
  showCompose?: boolean
  rightAction?: React.ReactNode
  onBack?: () => void
}

export function Header({ title, subtitle, showBack, showMenu, showCompose, rightAction, onBack }: HeaderProps) {
  const { pop, setDrawerOpen, canGoBack } = useNavigation()

  const hasLeftAction = (showBack && canGoBack) || showMenu
  const hasRightAction = showCompose || !!rightAction

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px',
      background: colors.white,
      borderBottom: `1px solid ${colors.border}`,
      minHeight: 40,
    }}>
      {/* Left slot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 30 }}>
        {showBack && canGoBack && (
          <button onClick={onBack || pop} style={{ fontSize: 22, color: colors.primary, padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        {showMenu && (
          <button onClick={() => setDrawerOpen(true)} style={{ padding: 4 }}>
            <img src="/icons/hamburger-menu.png" alt="Menu" style={{ width: 22, height: 22, objectFit: 'contain' }} />
          </button>
        )}
      </div>

      {/* Center title */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: fonts.size.lg,
          fontWeight: fonts.weight.bold,
          textAlign: hasLeftAction ? 'center' : 'left',
          color: colors.black,
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{
            fontSize: fonts.size.md,
            fontWeight: fonts.weight.regular,
            color: colors.primary,
            textAlign: hasLeftAction ? 'center' : 'left',
          }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Right slot — matches left width for centering */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 30, justifyContent: 'flex-end' }}>
        {showCompose && (
          <button style={{ padding: 4, display: 'flex', alignItems: 'center' }}>
            <img src="/icons/ic_new_message.png" alt="Compose" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          </button>
        )}
        {rightAction}
      </div>
    </div>
  )
}
