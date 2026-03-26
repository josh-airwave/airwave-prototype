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
        padding: '12px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === currentUser.id}
          />
        ))}
      </div>

      {/* Message input - matches iOS app exactly */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 4,
        padding: '8px 12px',
        minHeight: 68,
        background: colors.white,
        paddingBottom: 90,
      }}>
        {/* Attachment/camera button */}
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

        {/* Text input with border */}
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
