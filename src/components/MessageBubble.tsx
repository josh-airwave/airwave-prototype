import React from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { Avatar } from './Avatar'
import type { Message } from '../data/mock'
import { users } from '../data/mock'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const sender = users.find(u => u.id === message.senderId)

  return (
    <div style={{
      display: 'flex',
      flexDirection: isOwn ? 'row-reverse' : 'row',
      gap: 8,
      padding: '4px 8px',
      alignItems: 'flex-end',
    }}>
      {!isOwn && <Avatar emoji={sender?.avatar || ''} size={28} name={sender?.name} />}
      <div style={{ maxWidth: '80%' }}>
        {!isOwn && (
          <div style={{
            fontSize: fonts.size.sm,
            fontWeight: fonts.weight.semibold,
            color: colors.textPrimary,
            marginBottom: 2,
            marginLeft: 4,
          }}>
            {sender?.name}
          </div>
        )}
        <div style={{
          background: isOwn ? colors.primary : colors.white,
          color: isOwn ? colors.white : colors.almostBlack,
          padding: message.type === 'image' ? '4px' : '4px 12px 8px',
          borderRadius: 14,
          fontSize: fonts.size.md,
          fontWeight: fonts.weight.regular,
          lineHeight: 1.4,
        }}>
          {message.type === 'audio' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              minWidth: 180,
              padding: '4px 0',
            }}>
              <button style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: isOwn ? 'rgba(255,255,255,0.2)' : colors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.white,
                fontSize: 14,
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </button>
              <div style={{ flex: 1 }}>
                <div style={{
                  height: 3,
                  background: isOwn ? 'rgba(255,255,255,0.3)' : colors.gray300,
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: '30%',
                    height: '100%',
                    background: isOwn ? colors.white : colors.primary,
                    borderRadius: 2,
                  }} />
                </div>
                {message.content && (
                  <div style={{ fontSize: fonts.size.sm, marginTop: 4 }}>
                    {message.content}
                  </div>
                )}
              </div>
              <span style={{ fontSize: fonts.size.xs, opacity: 0.7, flexShrink: 0 }}>
                {message.audioDuration}
              </span>
            </div>
          )}
          {message.type === 'image' && (
            <div style={{
              borderRadius: radius.md,
              overflow: 'hidden',
              marginBottom: message.content ? 8 : 0,
            }}>
              <img
                src={message.imageUrl}
                alt=""
                style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
              />
              {message.content && <div style={{ padding: '4px 8px' }}>{message.content}</div>}
            </div>
          )}
          {message.type === 'text' && message.content}
        </div>
        <div style={{
          fontSize: fonts.size.sm,
          color: colors.secondaryGray,
          marginTop: 2,
          textAlign: isOwn ? 'right' : 'left',
          paddingLeft: 4,
          paddingRight: 4,
        }}>
          {message.timestamp}
        </div>
      </div>
    </div>
  )
}
