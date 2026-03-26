import React from 'react'
import { colors, fonts } from '../styles/theme'

interface AvatarProps {
  emoji: string
  size?: number
  online?: boolean
  name?: string
}

// Channel icon mapping: icon type -> { iconIndex (1-16), bgColor }
// These map to the actual Icon_N.png files from the iOS app
const channelIconConfig: Record<string, { iconIndex: number; bgColor: string }> = {
  gear: { iconIndex: 1, bgColor: '#6B7280' },
  app: { iconIndex: 3, bgColor: '#3478F6' },
  waveform: { iconIndex: 9, bgColor: '#165BC3' },
  trophy: { iconIndex: 5, bgColor: '#F59E0B' },
  chart: { iconIndex: 7, bgColor: '#D4A017' },
  group: { iconIndex: 2, bgColor: '#6366F1' },
  chat: { iconIndex: 4, bgColor: '#3B82F6' },
  design: { iconIndex: 6, bgColor: '#EC4899' },
  rocket: { iconIndex: 8, bgColor: '#EF4444' },
}

function ChannelIcon({ type, size }: { type: string; size: number }) {
  const config = channelIconConfig[type] || { iconIndex: 1, bgColor: '#6B7280' }

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: config.bgColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <img
        src={`/icons/Icon_${config.iconIndex}.png`}
        alt=""
        style={{ width: size * 0.55, height: size * 0.55, objectFit: 'contain' }}
      />
    </div>
  )
}

export function Avatar({ emoji, size = 40, online, name }: AvatarProps) {
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2) : ''
  const isUrl = emoji && (emoji.startsWith('http://') || emoji.startsWith('https://'))
  const isIcon = emoji && emoji.startsWith('icon:')

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {isIcon ? (
        <ChannelIcon type={emoji.replace('icon:', '')} size={size} />
      ) : (
        <div style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: isUrl ? colors.gray100 : colors.almostBlack,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.5,
          overflow: 'hidden',
        }}>
          {isUrl ? (
            <img
              src={emoji}
              alt={name || ''}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
          ) : emoji ? (
            <span>{emoji}</span>
          ) : (
            <span style={{
              fontSize: size * 0.35,
              fontWeight: fonts.weight.semibold,
              color: colors.white,
            }}>
              {initials}
            </span>
          )}
        </div>
      )}
      {online !== undefined && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: size * 0.28,
          height: size * 0.28,
          borderRadius: '50%',
          background: online ? colors.success : colors.gray300,
          border: `2px solid ${colors.white}`,
        }} />
      )}
    </div>
  )
}
