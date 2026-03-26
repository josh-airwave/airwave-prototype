import React from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { Header } from '../components/Header'
import { Avatar } from '../components/Avatar'
import { currentUser } from '../data/mock'

export function ProfileScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header
        title="Edit Profile"
        showBack
        rightAction={
          <button style={{ color: colors.primary, fontSize: fonts.size.md, fontWeight: fonts.weight.semibold }}>
            Done
          </button>
        }
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <Avatar emoji={currentUser.avatar} size={80} name={currentUser.name} />
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: colors.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.white,
              fontSize: 14,
              border: `2px solid ${colors.white}`,
            }}>
              ✏️
            </div>
          </div>
        </div>

        {/* Form fields */}
        {[
          { label: 'DISPLAY NAME', value: currentUser.name },
          { label: 'TITLE / SKILLS', value: '', placeholder: 'What is your title or skillset?' },
          { label: 'ABOUT', value: '', placeholder: 'Write a few words about yourself', multiline: true },
          { label: 'LOCATION', value: currentUser.location || '' },
        ].map(field => (
          <div key={field.label} style={{ marginBottom: 20 }}>
            <label style={{
              fontSize: fonts.size.xs,
              fontWeight: fonts.weight.semibold,
              color: colors.textSecondary,
              textTransform: 'uppercase' as const,
              letterSpacing: 0.5,
              display: 'block',
              marginBottom: 6,
            }}>
              {field.label}
            </label>
            {field.multiline ? (
              <textarea
                defaultValue={field.value}
                placeholder={field.placeholder}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${colors.gray200}`,
                  borderRadius: radius.sm,
                  fontSize: fonts.size.md,
                  fontFamily: 'inherit',
                  resize: 'none',
                  height: 80,
                  outline: 'none',
                }}
              />
            ) : (
              <input
                type="text"
                defaultValue={field.value}
                placeholder={field.placeholder}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${colors.gray200}`,
                  borderRadius: radius.sm,
                  fontSize: fonts.size.md,
                  outline: 'none',
                }}
              />
            )}
          </div>
        ))}

        {/* Delete account */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 0',
          color: colors.danger,
          fontSize: fonts.size.md,
          fontWeight: fonts.weight.medium,
        }}>
          🗑️ Delete Account?
        </button>
      </div>
    </div>
  )
}
