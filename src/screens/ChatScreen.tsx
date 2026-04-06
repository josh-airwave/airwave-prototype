import React from 'react'
import { colors, fonts } from '../styles/theme'
import { Header } from '../components/Header'
import { MessageBubble } from '../components/MessageBubble'
import { useNavigation } from '../navigation/Router'
import { channels, chatMessages, currentUser } from '../data/mock'

export function ChatScreen({ params }: { params?: Record<string, unknown> }) {
  const { push } = useNavigation()
  const channelId = (params?.channelId as string) || 'c1'
  const channel = channels.find(c => c.id === channelId)
  const messages = chatMessages[channelId] || chatMessages.c1 || []

  // Compute grouping flags for each message
  const getGrouping = (index: number) => {
    const msg = messages[index]
    const prev = index > 0 ? messages[index - 1] : null
    const next = index < messages.length - 1 ? messages[index + 1] : null
    const samePrev = prev?.senderId === msg.senderId && prev?.date === msg.date
    const sameNext = next?.senderId === msg.senderId && next?.date === msg.date

    if (samePrev && sameNext) return { isMiddleInGroup: true, isStandalone: false }
    if (!samePrev && sameNext) return { isFirstInGroup: true, isStandalone: false }
    if (samePrev && !sameNext) return { isLastInGroup: true, isStandalone: false }
    return { isStandalone: true }
  }

  // Check if a message needs a date separator above it
  const needsDateSeparator = (index: number) => {
    const msg = messages[index]
    if (!msg.date) return false
    if (index === 0) return true
    const prev = messages[index - 1]
    return prev.date !== msg.date
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
          <React.Fragment key={msg.id}>
            {/* Date separator */}
            {needsDateSeparator(i) && msg.date && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 16px 4px',
                gap: 10,
              }}>
                <div style={{ flex: 1, height: 1, background: colors.neutralGray }} />
                <span style={{
                  fontSize: fonts.size.sm,
                  fontWeight: fonts.weight.regular,
                  fontFamily: fonts.family,
                  color: colors.neutral,
                  whiteSpace: 'nowrap',
                }}>
                  {msg.date}
                </span>
                <div style={{ flex: 1, height: 1, background: colors.neutralGray }} />
              </div>
            )}
            <MessageBubble
              message={msg}
              isOwn={msg.senderId === currentUser.id}
              {...getGrouping(i)}
            />
          </React.Fragment>
        ))}
      </div>

      {/* Bottom spacer — Airwave Island renders via Router */}
      <div style={{ height: 80 }} />
    </div>
  )
}
