import React from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { Header } from '../components/Header'
import { Avatar } from '../components/Avatar'
import { savedMessages } from '../data/mock'

export function SavedMessagesScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header title="Saved Messages" showBack />
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {savedMessages.map(msg => (
          <div key={msg.id} style={{
            background: colors.primaryLight,
            borderRadius: radius.lg,
            padding: 16,
            marginBottom: 12,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}>
              <span style={{ fontSize: fonts.size.lg, fontWeight: fonts.weight.bold }}>
                {msg.channel}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: fonts.size.sm, color: colors.textSecondary }}>
                  {msg.timestamp}
                </span>
                <span style={{ fontSize: 14, color: colors.primary }}>🔖</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <Avatar emoji={msg.sender.avatar} size={32} name={msg.sender.name} />
              <div>
                <div style={{ fontSize: fonts.size.md, fontWeight: fonts.weight.semibold }}>
                  {msg.sender.name}
                </div>
                {msg.type === 'link' ? (
                  <div style={{
                    background: colors.white,
                    borderRadius: radius.md,
                    padding: 12,
                    marginTop: 8,
                  }}>
                    <div style={{ fontSize: fonts.size.sm, color: colors.textSecondary }}>
                      docs.google.com
                    </div>
                    <div style={{
                      fontSize: fonts.size.sm,
                      color: colors.primary,
                      marginTop: 4,
                      wordBreak: 'break-all',
                    }}>
                      {msg.linkUrl}
                    </div>
                  </div>
                ) : (
                  <div style={{
                    fontSize: fonts.size.md,
                    color: colors.textSecondary,
                    marginTop: 4,
                    lineHeight: 1.4,
                  }}>
                    {msg.content}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
