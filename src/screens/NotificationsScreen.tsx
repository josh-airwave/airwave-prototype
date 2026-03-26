import React, { useState } from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { Header } from '../components/Header'

export function NotificationsScreen() {
  const [muteAll, setMuteAll] = useState(false)
  const [muteReactions, setMuteReactions] = useState(true)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header title="Notifications" showBack />
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
        {/* Work Hours */}
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            fontSize: fonts.size.md,
            fontWeight: fonts.weight.semibold,
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            Work Hours <span style={{ color: colors.primary, fontSize: 14 }}>ℹ</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'FROM', value: 'Monday' },
              { label: 'TO', value: 'Friday' },
              { label: 'FROM', value: '7:30AM' },
              { label: 'TO', value: '5:30PM' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: fonts.size.xs, color: colors.textSecondary, marginBottom: 4 }}>
                  {item.label}
                </div>
                <div style={{
                  padding: '10px 12px',
                  border: `1px solid ${colors.gray200}`,
                  borderRadius: radius.sm,
                  fontSize: fonts.size.md,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  {item.value}
                  <span style={{ color: colors.textTertiary, fontSize: 10 }}>▼</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${colors.border}`, margin: '0 16px' }} />

        {/* Muted Notifications */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          width: '100%',
          textAlign: 'left',
          fontSize: fonts.size.md,
          fontWeight: fonts.weight.semibold,
        }}>
          Muted Notifications
          <span style={{ color: colors.textTertiary }}>›</span>
        </button>

        {/* Toggle items */}
        {[
          { label: 'Mute All Notifications', checked: muteAll, onChange: () => setMuteAll(!muteAll) },
          { label: 'Mute Reactions', checked: muteReactions, onChange: () => setMuteReactions(!muteReactions) },
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: `1px solid ${colors.gray100}`,
          }}>
            <span style={{ fontSize: fonts.size.md, fontWeight: fonts.weight.medium }}>{item.label}</span>
            <button
              onClick={item.onChange}
              style={{
                width: 48,
                height: 28,
                borderRadius: 14,
                background: item.checked ? colors.primary : colors.gray300,
                position: 'relative',
                transition: 'background 0.2s',
              }}
            >
              <div style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                background: colors.white,
                position: 'absolute',
                top: 2,
                left: item.checked ? 22 : 2,
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
        ))}

        {/* Clear all */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          width: '100%',
          color: colors.danger,
          fontSize: fonts.size.md,
          fontWeight: fonts.weight.medium,
        }}>
          Clear All Notifications
          <span style={{ fontSize: 18 }}>🗑️</span>
        </button>
      </div>
    </div>
  )
}
