import React from 'react'
import { colors, fonts } from '../styles/theme'
import { Avatar } from './Avatar'
import type { Message } from '../data/mock'
import { users, galleryItems } from '../data/mock'
import { useNavigation } from '../navigation/Router'

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
  const { push } = useNavigation()
  const sender = users.find(u => u.id === message.senderId)

  const showHeader = isStandalone || isFirstInGroup
  const showAvatar = !isOwn && (isStandalone || isLastInGroup)
  const isGrouped = isFirstInGroup || isMiddleInGroup || isLastInGroup
  const showTail = isStandalone || isLastInGroup
  const isLeft = !isOwn

  // Play button logic matches production app: show only if message has audio OR text content
  const hasAudio = message.type === 'audio'
  const hasTextContent = message.content != null && message.content.length > 0
  const showPlayButton = message.type !== 'system' && message.type !== 'image' && message.type !== 'video' && message.type !== 'link' && (hasAudio || hasTextContent)

  // Sent as text indicator
  const isSentAsText = !hasAudio && hasTextContent && message.type !== 'link' && message.type !== 'system'

  // Border radius: 8px default, 4px tight for grouped
  let borderRadius = '8px'
  if (isFirstInGroup) borderRadius = '8px 8px 4px 4px'
  else if (isMiddleInGroup) borderRadius = '4px'
  else if (isLastInGroup) borderRadius = '4px 4px 8px 8px'

  const bubbleBg = isOwn ? colors.blurpleLightSolid : colors.white
  const textColor = colors.almostBlack

  // Parse @mentions and URLs — make mentions bold, URLs blue
  const renderMessageText = (text: string) => {
    if (!text) return null
    // Split on @mentions and URLs
    const parts = text.split(/(@\w[\w\s]*?\b)|(https?:\/\/[^\s]+)/g)
    return parts.map((part, i) => {
      if (!part) return null
      if (part.startsWith('@')) {
        return <span key={i} style={{ fontWeight: fonts.weight.bold, color: colors.almostBlack }}>{part}</span>
      }
      if (part.startsWith('http')) {
        return <span key={i} style={{ color: colors.primary, fontWeight: fonts.weight.bold }}>{part}</span>
      }
      return <span key={i}>{part}</span>
    })
  }

  // Read/heard counts — use message data or fallback
  const readCount = message.readCount != null ? message.readCount : Math.floor(Math.random() * 12) + 3
  const heardCount = message.heardCount != null ? message.heardCount : 0

  return (
    <div>
      {/* Thread reply pill */}
      {message.replyCount != null && message.replyCount > 0 && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '8px 16px 4px',
        }}>
          <div style={{
            background: 'rgba(22, 91, 195, 0.08)',
            borderRadius: 20,
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            <span style={{
              fontSize: fonts.size.sm,
              fontWeight: fonts.weight.medium,
              color: colors.primary,
              fontFamily: fonts.family,
            }}>
              {message.replyCount} {message.replyCount === 1 ? 'Reply' : 'Replies'}
            </span>
          </div>
        </div>
      )}

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
            {/* Share icon — top right of bubble */}
            {!message.failed && (isStandalone || isFirstInGroup) && message.type !== 'system' && (
              <div style={{
                position: 'absolute',
                top: 6,
                right: 6,
                zIndex: 2,
                opacity: 0.3,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </div>
            )}

            {/* Image messages — tappable, with optional text below */}
            {message.type === 'image' && message.imageUrl && (
              <div>
                <div
                  onClick={() => push('ImageZoom', { itemId: message.id, imageUrl: message.imageUrl })}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={message.imageUrl}
                    alt=""
                    style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
                  />
                </div>
                {message.content && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 0,
                    padding: '6px 4px 6px 4px',
                  }}>
                    {/* Play button for image+text messages */}
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
                    <div style={{
                      flex: 1,
                      padding: '4px 10px 4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                    }}>
                      <div style={{ fontSize: fonts.size.md, lineHeight: '20px' }}>
                        {renderMessageText(message.content)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Video messages — thumbnail with play overlay, tap opens ShareView */}
            {message.type === 'video' && message.imageUrl && (
              <div>
                <div
                  onClick={() => {
                    const match = galleryItems.find(g => g.videoUrl === message.videoUrl)
                    push('ShareView', { itemId: match?.id || 'g1' })
                  }}
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  <img
                    src={message.imageUrl}
                    alt=""
                    style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
                  />
                  {/* Play overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.25)',
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                        <polygon points="7,3 21,12 7,21" />
                      </svg>
                    </div>
                  </div>
                </div>
                {message.content && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 0,
                    padding: '6px 4px 6px 4px',
                  }}>
                    <button style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: colors.primary,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, border: 'none', cursor: 'pointer',
                      margin: '2px 0 2px 2px',
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <polygon points="7,3 21,12 7,21" />
                      </svg>
                    </button>
                    <div style={{
                      flex: 1, padding: '4px 10px 4px 8px',
                      display: 'flex', alignItems: 'center',
                    }}>
                      <div style={{ fontSize: fonts.size.md, lineHeight: '20px' }}>
                        {renderMessageText(message.content)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Link preview card — rendered separately, no play button */}
            {message.type === 'link' && message.linkPreview && (
              <div style={{ overflow: 'hidden' }}>
                {message.linkPreview.image && (
                  <img
                    src={message.linkPreview.image}
                    alt=""
                    style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                  />
                )}
                <div style={{ padding: '8px 10px' }}>
                  <div style={{
                    fontSize: fonts.size.md,
                    fontWeight: fonts.weight.medium,
                    color: colors.almostBlack,
                  }}>
                    {message.linkPreview.title}
                  </div>
                  <div style={{
                    fontSize: fonts.size.sm,
                    color: '#909090',
                    marginTop: 2,
                  }}>
                    {message.linkPreview.url}
                  </div>
                </div>
                {message.content && (
                  <div style={{ padding: '0 10px 8px', fontSize: fonts.size.md, lineHeight: '20px' }}>
                    {renderMessageText(message.content)}
                  </div>
                )}
              </div>
            )}

            {/* Text / audio messages — play button layout */}
            {message.type !== 'image' && message.type !== 'video' && message.type !== 'system' && message.type !== 'link' && (
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
                    {message.content && (
                      <div style={{ fontSize: fonts.size.md, lineHeight: '20px' }}>
                        {renderMessageText(message.content)}
                      </div>
                    )}
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

          {/* Failed message indicator (orange !) */}
          {message.failed && (
            <div style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              [isOwn ? 'left' : 'right']: -24,
            }}>
              <div style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: `2px solid ${colors.warning}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ color: colors.warning, fontSize: '11px', fontWeight: fonts.weight.bold, lineHeight: 1 }}>!</span>
              </div>
            </div>
          )}

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

      {/* Read + Heard receipts — shown below the last message in a group */}
      {(isStandalone || isLastInGroup) && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 6,
          padding: '4px 16px 0',
          height: 20,
        }}>
          {/* Eye icon = read count */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            background: colors.coolMedium,
            borderRadius: 20,
            padding: '1px 6px',
            height: 16,
          }}>
            <svg width="13" height="10" viewBox="0 0 24 24" fill="none" stroke={colors.coolText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span style={{ fontSize: '10px', color: colors.coolText, fontFamily: fonts.family, fontWeight: fonts.weight.medium }}>{readCount}</span>
          </div>

          {/* Speaker icon = heard count (only if > 0) */}
          {heardCount > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              background: 'rgba(22, 91, 195, 0.12)',
              borderRadius: 20,
              padding: '1px 6px',
              height: 16,
            }}>
              <svg width="12" height="10" viewBox="0 0 24 24" fill="none" stroke={colors.almostBlack} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <span style={{ fontSize: '10px', color: colors.almostBlack, fontFamily: fonts.family, fontWeight: fonts.weight.medium }}>{heardCount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
