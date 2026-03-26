import React from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { Header } from '../components/Header'
import { SearchBar } from '../components/SearchBar'
import { Avatar } from '../components/Avatar'
import { replyThreads } from '../data/mock'

export function RepliesScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header title="Replies" showBack />
      <div style={{ padding: '8px 0 0' }}>
        <SearchBar />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {replyThreads.map(thread => (
          <div key={thread.id} style={{
            background: colors.primaryLight,
            borderRadius: radius.lg,
            padding: 16,
            marginBottom: 12,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 4,
            }}>
              <h3 style={{
                fontSize: fonts.size.xl,
                fontWeight: fonts.weight.bold,
                flex: 1,
                lineHeight: 1.3,
              }}>
                {thread.title}
              </h3>
              <span style={{ fontSize: fonts.size.sm, color: colors.textSecondary, flexShrink: 0, marginLeft: 8 }}>
                {thread.timestamp}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <span style={{ fontSize: fonts.size.sm, color: colors.textSecondary }}>
                {thread.channel}
              </span>
              <span style={{
                color: colors.primary,
                fontSize: fonts.size.sm,
                fontWeight: fonts.weight.semibold,
              }}>
                {thread.replyCount} {thread.replyCount === 1 ? 'Reply' : 'Replies'}
              </span>
            </div>
            {thread.summary && (
              <>
                <div style={{ fontSize: fonts.size.sm, color: colors.textSecondary, marginBottom: 4 }}>
                  Summary:
                </div>
                <p style={{
                  fontSize: fonts.size.md,
                  color: colors.textSecondary,
                  lineHeight: 1.5,
                  marginBottom: 8,
                }}>
                  {thread.summary}
                </p>
              </>
            )}
            <div style={{ display: 'flex', gap: -4 }}>
              {thread.participants.slice(0, 5).map((p, i) => (
                <div key={p.id} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: 5 - i }}>
                  <Avatar emoji={p.avatar} size={28} name={p.name} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
