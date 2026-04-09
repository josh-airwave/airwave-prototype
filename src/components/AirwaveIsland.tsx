import React, { useState } from 'react'
import { colors, fonts } from '../styles/theme'
import { SmartGlassesBottomSheet } from './SmartGlassesBottomSheet'

type IslandMode = 'home' | 'chat' | 'blue' | 'hidden'

interface AirwaveIslandProps {
  mode: IslandMode
  channelType?: 'group' | 'dm' | 'channel' | 'blue'
  onLeaderboardPress?: () => void
  onRecordPress?: () => void
}

export function getIslandMode(screenName: string): IslandMode {
  switch (screenName) {
    case 'ChannelList': return 'home'
    case 'Chat': return 'chat'
    case 'Blue': return 'blue'
    default: return 'hidden'
  }
}

export function AirwaveIsland({ mode, channelType, onLeaderboardPress, onRecordPress }: AirwaveIslandProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  if (mode === 'hidden') return null

  return (
    <>
    <SmartGlassesBottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    <div style={{
      position: 'absolute',
      bottom: 24,
      left: 10,
      right: 10,
      borderRadius: 50,
      background: colors.white,
      boxShadow: '-3px 3px 10px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px',
      height: 56,
      zIndex: 50,
    }}>
      {/* Left element */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', zIndex: 1 }}>
        {(mode === 'home' || mode === 'blue') ? (
          <button
            onClick={() => setSheetOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            <img src="/icons/ic_glasses_black.png" alt="Glasses" style={{ width: 48, height: 28, objectFit: 'contain' }} />
          </button>
        ) : (
          /* Chat mode: reactions emoji button (groups) or avatar placeholder (DMs) */
          <button
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: colors.coolLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
            }}
          >
            {channelType === 'dm' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.97 4.03-9 8-9s8 4.03 8 9" />
              </svg>
            ) : (
              <span style={{ fontSize: 20 }}>😊</span>
            )}
          </button>
        )}
      </div>

      {/* Center: Record / Push-to-Talk button - absolutely centered horizontally */}
      <button
        onClick={onRecordPress}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(22,91,195,0.35)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 2,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <rect x="3" y="4" width="3" height="16" rx="1.5" />
          <rect x="8" y="7" width="3" height="10" rx="1.5" />
          <rect x="13" y="2" width="3" height="20" rx="1.5" />
          <rect x="18" y="6" width="3" height="12" rx="1.5" />
        </svg>
      </button>

      {/* Right element - changes per mode */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, zIndex: 1 }}>
        {mode === 'blue' ? (
          <>
            {/* Chat bubble */}
            <button style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#1A1A1A">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
              </svg>
            </button>
            {/* + button */}
            <button style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </>
        ) : (
          /* Home + Chat mode: Points badge */
          <button
            onClick={onLeaderboardPress}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              background: colors.primary,
              color: colors.white,
              fontSize: fonts.size.sm,
              fontWeight: fonts.weight.bold,
              padding: '6px 12px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '-1px 4px 3px rgba(0,0,0,0.15)',
            }}
          >
            <span style={{ fontSize: '12px' }}>⭐</span>
            <span>18.27K</span>
          </button>
        )}
      </div>
    </div>
    </>
  )
}
