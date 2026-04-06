import React from 'react'
import { colors, fonts } from '../styles/theme'
import { Header } from '../components/Header'
import { MessageBubble } from '../components/MessageBubble'
import { useNavigation } from '../navigation/Router'
import { channels, chatMessages, currentUser } from '../data/mock'

export function ChatScreen({ params }: { params?: Record<string, unknown> }) {
  const { push } = useNavigation()
  const channelId = (params?.channelId as string) || 'c7'
  const channel = channels.find(c => c.id === channelId)
  const messages = chatMessages[channelId] || chatMessages.c7 || []

  // Compute grouping flags for each message
  const getGrouping = (index: number) => {
    const msg = messages[index]
    const prev = index > 0 ? messages[index - 1] : null
    const next = index < messages.length - 1 ? messages[index + 1] : null
    const samePrev = prev?.senderId === msg.senderId
    const sameNext = next?.senderId === msg.senderId

    if (samePrev && sameNext) return { isMiddleInGroup: true, isStandalone: false }
    if (!samePrev && sameNext) return { isFirstInGroup: true, isStandalone: false }
    if (samePrev && !sameNext) return { isLastInGroup: true, isStandalone: false }
    return { isStandalone: true }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: colors.cloudGray }}>
      <Header
        title={channel?.name || 'Chat'}
        subtitle={channel?.type === 'group' ? `${channel.members?.length || 3} People ›` : undefined}
        showBack
        rightAction={
          channel?.type === 'group' ? (
            <button
              onClick={() => push('GroupEdit', { channelId })}
              style={{ fontSize: 14, color: colors.textTertiary }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textTertiary} strokeWidth="2">
                <circle cx="12" cy="5" r="1.5" fill={colors.textTertiary} />
                <circle cx="12" cy="12" r="1.5" fill={colors.textTertiary} />
                <circle cx="12" cy="19" r="1.5" fill={colors.textTertiary} />
              </svg>
            </button>
          ) : undefined
        }
      />

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '4px 0 8px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === currentUser.id}
            {...getGrouping(i)}
          />
        ))}
      </div>

      {/* Message input — matches iOS app */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 4,
        padding: '8px 12px',
        minHeight: 68,
        background: colors.white,
        paddingBottom: 90,
      }}>
        {/* Camera button */}
        <button style={{
          padding: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 44,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.gray400} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </button>

        {/* Text input */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          border: `1px solid ${colors.lightGrey}`,
          borderRadius: 18,
          padding: '0 8px',
          minHeight: 44,
        }}>
          <input
            type="text"
            placeholder="Message"
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: fonts.size.md,
              fontFamily: fonts.family,
              width: '100%',
              color: colors.textPrimary,
              padding: '10px 4px',
            }}
          />
        </div>

        {/* Send button */}
        <button style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginBottom: 3,
          border: 'none',
          cursor: 'pointer',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  )
}
