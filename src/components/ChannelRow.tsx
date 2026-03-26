import React from 'react'
import { colors, fonts } from '../styles/theme'
import { Avatar } from './Avatar'
import type { Channel } from '../data/mock'

interface ChannelRowProps {
  channel: Channel
  onPress: () => void
}

export function ChannelRow({ channel, onPress }: ChannelRowProps) {
  return (
    <button
      onClick={onPress}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 12px',
        width: '100%',
        height: 76,
        textAlign: 'left',
        borderBottom: `1px solid ${colors.divider}`,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = colors.gray50)}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <Avatar emoji={channel.avatar} size={45} name={channel.name} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}>
          <span style={{
            fontSize: fonts.size.md,
            fontWeight: fonts.weight.bold,
            color: colors.textPrimary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {channel.name}
          </span>
          <span style={{
            fontSize: fonts.size.sm,
            color: colors.secondaryGray,
            flexShrink: 0,
            marginLeft: 8,
          }}>
            {channel.lastMessageTime}
          </span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: fonts.size.md,
            color: colors.secondaryGray,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}>
            {channel.lastMessage}
          </span>
          {channel.unreadCount ? (
            <span style={{
              background: colors.primary,
              color: colors.white,
              fontSize: fonts.size.sm,
              fontWeight: fonts.weight.bold,
              minWidth: 18,
              height: 18,
              borderRadius: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 5px',
              marginLeft: 8,
              flexShrink: 0,
            }}>
              {channel.unreadCount}
            </span>
          ) : null}
          {channel.muted && (
            <span style={{ fontSize: 14, color: colors.gray400, marginLeft: 8 }}>&#128263;</span>
          )}
        </div>
      </div>
    </button>
  )
}
