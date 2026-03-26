import React, { useState } from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { Header } from '../components/Header'
import { Avatar } from '../components/Avatar'
import { users } from '../data/mock'

export function GroupEditScreen() {
  const [muted, setMuted] = useState(false)
  const members = [users[0], users[1], users[4]]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header title="Edit Group" showBack />
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {/* Group avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: colors.gray100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}>
              👥
            </div>
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.white,
              fontSize: 12,
              border: `2px solid ${colors.white}`,
            }}>
              ✏️
            </div>
          </div>
        </div>

        {/* Group name */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: fonts.size.xs, color: colors.textSecondary, fontWeight: fonts.weight.semibold, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>
            GROUP NAME
          </label>
          <input
            type="text"
            placeholder="Group Name"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: `1px solid ${colors.gray200}`,
              borderRadius: radius.sm,
              fontSize: fonts.size.md,
              outline: 'none',
            }}
          />
        </div>

        {/* People */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 0',
          width: '100%',
          textAlign: 'left',
          borderBottom: `1px solid ${colors.gray100}`,
        }}>
          <span style={{ fontSize: 18 }}>👥</span>
          <span style={{ fontSize: fonts.size.md, fontWeight: fonts.weight.medium, flex: 1 }}>
            People
          </span>
          <span style={{ fontSize: fonts.size.sm, color: colors.textSecondary }}>
            {members.length} People in Group
          </span>
          <span style={{ color: colors.textTertiary }}>›</span>
        </button>

        {/* Members list */}
        {members.map(member => (
          <div key={member.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 0',
            borderBottom: `1px solid ${colors.gray100}`,
          }}>
            <Avatar emoji={member.avatar} size={36} name={member.name} />
            <span style={{ fontSize: fonts.size.md, fontWeight: fonts.weight.medium, flex: 1 }}>
              {member.name}
            </span>
            <span style={{ fontSize: 18, color: colors.textTertiary }}>👤</span>
            <span style={{ color: colors.textTertiary }}>⋯</span>
          </div>
        ))}

        {/* Add people */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 0',
          width: '100%',
          textAlign: 'left',
        }}>
          <span style={{ fontSize: 18 }}>➕</span>
          <span style={{ fontSize: fonts.size.md, fontWeight: fonts.weight.medium }}>
            Add People to Group
          </span>
          <span style={{ color: colors.textTertiary, marginLeft: 'auto' }}>›</span>
        </button>

        {/* Notification sound */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 0',
          width: '100%',
          textAlign: 'left',
          borderBottom: `1px solid ${colors.gray100}`,
        }}>
          <span style={{ fontSize: 18 }}>🔊</span>
          <span style={{ fontSize: fonts.size.md, fontWeight: fonts.weight.medium }}>
            Change Notification Sound
          </span>
          <span style={{ color: colors.textTertiary, marginLeft: 'auto' }}>›</span>
        </button>

        {/* Mute */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: `1px solid ${colors.gray100}`,
        }}>
          <span style={{ fontSize: fonts.size.md, fontWeight: fonts.weight.medium }}>Mute Group</span>
          <button
            onClick={() => setMuted(!muted)}
            style={{
              width: 48, height: 28, borderRadius: 14,
              background: muted ? colors.primary : colors.gray300,
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: 12,
              background: colors.white,
              position: 'absolute',
              top: 2,
              left: muted ? 22 : 2,
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>

        {/* Leave */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 0',
          color: colors.danger,
          fontSize: fonts.size.md,
          fontWeight: fonts.weight.medium,
        }}>
          🚪 Leave Group
        </button>

        {/* Done */}
        <button style={{
          width: '100%',
          padding: '12px 0',
          background: colors.gray100,
          borderRadius: radius.full,
          fontSize: fonts.size.md,
          fontWeight: fonts.weight.semibold,
          color: colors.textSecondary,
          marginTop: 8,
        }}>
          Done
        </button>

        {/* Delete */}
        <button style={{
          width: '100%',
          padding: '12px 0',
          fontSize: fonts.size.md,
          fontWeight: fonts.weight.medium,
          color: colors.danger,
          textAlign: 'center',
          marginTop: 12,
        }}>
          Delete Group
        </button>
      </div>
    </div>
  )
}
