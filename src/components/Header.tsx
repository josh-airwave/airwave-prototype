import React from 'react'
import { colors, fonts } from '../styles/theme'
import { useNavigation } from '../navigation/Router'

interface HeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  showMenu?: boolean
  showCompose?: boolean
  showRestart?: boolean
  rightAction?: React.ReactNode
  onBack?: () => void
}

export function Header({ title, subtitle, showBack, showMenu, showCompose, showRestart, rightAction, onBack }: HeaderProps) {
  const { pop, reset, setDrawerOpen, canGoBack } = useNavigation()

  const hasLeftAction = (showBack && canGoBack) || showMenu
  const hasRightAction = showCompose || !!rightAction

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 16px',
      background: colors.white,
      borderBottom: `1px solid ${colors.border}`,
      minHeight: 40,
    }}>
      {/* Left slot — absolute so it doesn't affect title centering */}
      <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 12 }}>
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

      {/* Center title — always centered */}
      <div>
        <div style={{
          fontSize: fonts.size.lg,
          fontWeight: fonts.weight.bold,
          textAlign: 'center',
          color: colors.black,
        }}>
          {title}
        </div>
        {subtitle && (
          <div style={{
            fontSize: fonts.size.md,
            fontWeight: fonts.weight.regular,
            color: colors.primary,
            textAlign: 'center',
          }}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Right slot — absolute so it doesn't affect title centering */}
      <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 8 }}>
        {showCompose && (
          <button style={{ padding: 4, display: 'flex', alignItems: 'center' }}>
            <img src="/icons/ic_new_message.png" alt="Compose" style={{ width: 24, height: 24, objectFit: 'contain' }} />
          </button>
        )}
        {rightAction}
        {showRestart && (
          <button
            onClick={() => reset('ChannelList')}
            style={{
              padding: '3px 8px',
              background: colors.coolGray,
              border: 'none',
              borderRadius: 6,
              color: colors.textTertiary,
              fontSize: 11,
              fontWeight: 600,
              fontFamily: fonts.family,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={colors.textTertiary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
            </svg>
            Restart
          </button>
        )}
      </div>
    </div>
  )
}
