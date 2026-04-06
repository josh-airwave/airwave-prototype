import React from 'react'
import { colors, fonts } from '../styles/theme'
import { Avatar } from './Avatar'
import type { Message } from '../data/mock'
import { users } from '../data/mock'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  // Grouping flags — set by ChatScreen based on adjacent messages
  isFirstInGroup?: boolean
  isMiddleInGroup?: boolean
  isLastInGroup?: boolean
  isStandalone?: boolean
}

export function MessageBubble({
  message,
  isOwn,
  isFirstInGroup = false,
  isMiddleInGroup = false,
  isLastInGroup = false,
  isStandalone = true,
}: MessageBubbleProps) {
  const sender = users.find(u => u.id === message.senderId)

  // Show sender name + timestamp only on first-in-group or standalone
  const showHeader = !isOwn && (isStandalone || isFirstInGroup)
  // Show avatar only on standalone or last-in-group (positioned at bottom)
  const showAvatar = !isOwn && (isStandalone || isLastInGroup)
  // Tight grouping = no extra vertical padding
  const isGrouped = isFirstInGroup || isMiddleInGroup || isLastInGroup

  // Border radius rules matching the real app
  // Default: 8px all corners
  // First in group: normal top, tight bottom (4px)
  // Middle in group: tight all (4px)
  // Last in group: tight top (4px), normal bottom
  // Standalone: normal all (8px)
  let borderRadius = '8px'
  if (isFirstInGroup) {
    borderRadius = isOwn
      ? '8px 8px 4px 4px'
      : '8px 8px 4px 4px'
  } else if (isMiddleInGroup) {
    borderRadius = '4px'
  } else if (isLastInGroup) {
    borderRadius = isOwn
      ? '4px 4px 8px 8px'
      : '4px 4px 8px 8px'
  }

  // Bubble tail: only on standalone or last-in-group
  const showTail = isStandalone || isLastInGroup

  // Bubble colors matching production app
  const bubbleBg = isOwn ? colors.blurpleLightSolid : colors.white
  const textColor = colors.almostBlack

  return (
    <div style={{
      display: 'flex',
      flexDirection: isOwn ? 'row-reverse' : 'row',
      gap: 0,
      padding: isGrouped ? '1px 8px' : '0 8px',
      paddingTop: (isStandalone || isFirstInGroup) ? 16 : 1,
      alignItems: 'flex-end',
    }}>
      {/* Avatar column — 30px wide, only shows image on standalone/last */}
      {!isOwn && (
        <div style={{ width: 30, flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          {showAvatar && <Avatar emoji={sender?.avatar || ''} size={28} name={sender?.name} />}
        </div>
      )}

      <div style={{
        maxWidth: isOwn ? '80%' : '83%',
        marginLeft: isOwn ? 'auto' : 0,
        marginRight: isOwn ? 4 : 0,
      }}>
        {/* Sender name + timestamp — above the bubble */}
        {showHeader && (
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 6,
            marginBottom: 3,
            marginLeft: 4,
          }}>
            <span style={{
              fontSize: fonts.size.md,
              fontWeight: fonts.weight.medium,
              fontFamily: fonts.family,
              color: colors.almostBlack,
            }}>
              {sender?.name}
            </span>
            <span style={{
              fontSize: fonts.size.sm,
              fontWeight: fonts.weight.regular,
              color: '#909090',
            }}>
              {message.timestamp}
            </span>
          </div>
        )}

        {/* Own message timestamp — above bubble, right-aligned */}
        {isOwn && (isStandalone || isFirstInGroup) && (
          <div style={{
            fontSize: fonts.size.sm,
            color: '#909090',
            marginBottom: 3,
            textAlign: 'right',
            paddingRight: 4,
          }}>
            {message.timestamp}
          </div>
        )}

        {/* Bubble */}
        <div style={{ position: 'relative' }}>
          <div style={{
            background: bubbleBg,
            color: textColor,
            padding: message.type === 'image' ? '4px' : '8px 12px',
            borderRadius,
            fontSize: fonts.size.md,
            fontWeight: fonts.weight.regular,
            fontFamily: fonts.family,
            lineHeight: '17px',
            position: 'relative',
          }}>
            {/* Text message */}
            {message.type === 'text' && message.content}

            {/* Audio message */}
            {message.type === 'audio' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                minWidth: 180,
                padding: '2px 0',
              }}>
                <button style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: colors.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: 'none',
                  cursor: 'pointer',
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <polygon points="6,3 20,12 6,21" />
                  </svg>
                </button>
                <div style={{ flex: 1 }}>
                  {message.content && (
                    <div style={{
                      fontSize: fonts.size.md,
                      color: textColor,
                      lineHeight: '17px',
                      paddingRight: 32,
                    }}>
                      {message.content}
                    </div>
                  )}
                </div>
                <span style={{
                  fontSize: fonts.size.sm,
                  color: '#909090',
                  flexShrink: 0,
                  alignSelf: 'flex-end',
                }}>
                  {message.audioDuration}
                </span>
              </div>
            )}

            {/* Image message */}
            {message.type === 'image' && (
              <div style={{
                borderRadius: 6,
                overflow: 'hidden',
              }}>
                <img
                  src={message.imageUrl}
                  alt=""
                  style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                />
                {message.content && (
                  <div style={{ padding: '6px 8px', fontSize: fonts.size.md, color: textColor }}>
                    {message.content}
                  </div>
                )}
              </div>
            )}

            {/* Link preview */}
            {message.type === 'link' && message.linkPreview && (
              <div>
                <div style={{
                  color: colors.primary,
                  fontWeight: fonts.weight.bold,
                  fontSize: fonts.size.md,
                  marginBottom: 4,
                  wordBreak: 'break-all',
                }}>
                  {message.linkPreview.url}
                </div>
                {message.content && (
                  <div style={{ fontSize: fonts.size.md, color: textColor }}>{message.content}</div>
                )}
              </div>
            )}
          </div>

          {/* Bubble tail — small SVG curve at bottom corner */}
          {showTail && !isOwn && (
            <svg
              width="8" height="12"
              viewBox="0 0 8 12"
              style={{ position: 'absolute', bottom: 0, left: -7 }}
            >
              <path d="M8 0 C8 6, 4 10, 0 12 L8 12 Z" fill={colors.white} />
            </svg>
          )}
          {showTail && isOwn && (
            <svg
              width="8" height="12"
              viewBox="0 0 8 12"
              style={{ position: 'absolute', bottom: 0, right: -7 }}
            >
              <path d="M0 0 C0 6, 4 10, 8 12 L0 12 Z" fill={colors.blurpleLightSolid} />
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
