import React from 'react'
import { colors, fonts } from '../styles/theme'
import { Avatar } from './Avatar'
import type { Message } from '../data/mock'
import { users } from '../data/mock'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
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

  const showHeader = isStandalone || isFirstInGroup
  const showAvatar = !isOwn && (isStandalone || isLastInGroup)
  const isGrouped = isFirstInGroup || isMiddleInGroup || isLastInGroup
  const showTail = isStandalone || isLastInGroup
  const isLeft = !isOwn

  // Sent as text indicator — voice messages don't get this
  const isSentAsText = message.type === 'text' || message.type === 'link' || message.type === 'image'
  // All messages get a play button (voice-first app) unless it's a system message or image-only
  const showPlayButton = message.type !== 'system' && message.type !== 'image'

  // Border radius: 8px default, 4px tight for grouped
  let borderRadius = '8px'
  if (isFirstInGroup) borderRadius = '8px 8px 4px 4px'
  else if (isMiddleInGroup) borderRadius = '4px'
  else if (isLastInGroup) borderRadius = '4px 4px 8px 8px'

  const bubbleBg = isOwn ? colors.blurpleLightSolid : colors.white
  const textColor = colors.almostBlack

  // Parse @mentions and make them bold
  const renderMessageText = (text: string) => {
    if (!text) return null
    const parts = text.split(/(@\w[\w\s]*?\b)/g)
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return <span key={i} style={{ fontWeight: fonts.weight.bold, color: colors.almostBlack }}>{part}</span>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div>
      {/* Sender + timestamp header */}
      {showHeader && (
        <div style={{
          padding: '0 12px',
          paddingTop: 16,
          paddingBottom: 3,
          paddingLeft: isLeft ? 42 : 12,
          textAlign: isOwn ? 'right' : 'left',
        }}>
          <span style={{
            fontSize: fonts.size.sm,
            fontWeight: fonts.weight.regular,
            fontFamily: fonts.family,
            color: '#909090',
          }}>
            {isLeft ? `${sender?.name} ` : ''}{message.timestamp}{isSentAsText ? ' (Sent as Text)' : ''}
          </span>
        </div>
      )}

      {/* Message row */}
      <div style={{
        display: 'flex',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        padding: isGrouped && !isFirstInGroup ? '1px 8px' : '0 8px',
        alignItems: 'flex-end',
      }}>
        {/* Avatar column — 30px wide */}
        {isLeft && (
          <div style={{ width: 30, flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            {showAvatar && <Avatar emoji={sender?.avatar || ''} size={28} name={sender?.name} />}
          </div>
        )}

        {/* Bubble */}
        <div style={{
          maxWidth: isOwn ? '80%' : '85%',
          marginLeft: isOwn ? 'auto' : 0,
          marginRight: isOwn ? 4 : 0,
          position: 'relative',
        }}>
          <div style={{
            background: bubbleBg,
            color: textColor,
            borderRadius,
            fontSize: fonts.size.md,
            fontWeight: fonts.weight.regular,
            fontFamily: fonts.family,
            lineHeight: '20px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Image messages */}
            {message.type === 'image' && message.imageUrl && (
              <div>
                <img
                  src={message.imageUrl}
                  alt=""
                  style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                />
                {message.content && (
                  <div style={{ padding: '8px 12px', fontSize: fonts.size.md, color: textColor }}>
                    {renderMessageText(message.content)}
                  </div>
                )}
              </div>
            )}

            {/* Text / audio / link messages — all get play button layout */}
            {message.type !== 'image' && message.type !== 'system' && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 0,
                padding: '6px 4px 6px 4px',
              }}>
                {/* Play button */}
                {showPlayButton && (
                  <button style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: colors.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: 'none',
                    cursor: 'pointer',
                    margin: '2px 0 2px 2px',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <polygon points="7,3 21,12 7,21" />
                    </svg>
                  </button>
                )}

                {/* Message content */}
                <div style={{
                  flex: 1,
                  padding: '4px 10px 4px 8px',
                  minHeight: showPlayButton ? 44 : undefined,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <div style={{ width: '100%' }}>
                    {/* Link preview */}
                    {message.type === 'link' && message.linkPreview && (
                      <div style={{ marginBottom: message.content ? 6 : 0 }}>
                        <span style={{
                          color: colors.primary,
                          fontWeight: fonts.weight.bold,
                          wordBreak: 'break-all',
                        }}>
                          {message.linkPreview.url}
                        </span>
                      </div>
                    )}

                    {/* Text content */}
                    {message.content && (
                      <div style={{ fontSize: fonts.size.md, lineHeight: '20px' }}>
                        {renderMessageText(message.content)}
                      </div>
                    )}

                    {/* Audio duration badge */}
                    {message.type === 'audio' && message.audioDuration && (
                      <div style={{
                        fontSize: fonts.size.xs,
                        color: '#909090',
                        marginTop: 2,
                      }}>
                        {message.audioDuration}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bubble tail */}
          {showTail && isLeft && (
            <svg width="8" height="12" viewBox="0 0 8 12" style={{ position: 'absolute', bottom: 0, left: -7 }}>
              <path d="M8 0 C8 6, 4 10, 0 12 L8 12 Z" fill={colors.white} />
            </svg>
          )}
          {showTail && isOwn && (
            <svg width="8" height="12" viewBox="0 0 8 12" style={{ position: 'absolute', bottom: 0, right: -7 }}>
              <path d="M0 0 C0 6, 4 10, 8 12 L0 12 Z" fill={colors.blurpleLightSolid} />
            </svg>
          )}
        </div>
      </div>

      {/* Read receipts — shown below the last message in a group */}
      {(isStandalone || isLastInGroup) && (
        <div style={{
          display: 'flex',
          justifyContent: isOwn ? 'flex-end' : 'flex-end',
          alignItems: 'center',
          gap: 6,
          padding: '4px 16px 0',
          height: 20,
        }}>
          {/* Eye icon = read count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#BABABA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span style={{ fontSize: '11px', color: '#BABABA', fontFamily: fonts.family }}>{Math.floor(Math.random() * 12) + 3}</span>
          </div>
        </div>
      )}
    </div>
  )
}
