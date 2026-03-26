import React from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { Header } from '../components/Header'

export function WorkspaceScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header title="Add or Join Workspace" showBack />
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{
            fontSize: fonts.size.xl,
            fontWeight: fonts.weight.bold,
            color: colors.primary,
            marginBottom: 8,
          }}>
            Simplify your team communication
          </h2>
          <p style={{
            fontSize: fonts.size.md,
            color: colors.textSecondary,
            lineHeight: 1.5,
          }}>
            with Airwave workspaces. Customize permissions, organize Channels, and easily onboard team members.
          </p>
        </div>

        {/* Add New Workspace */}
        <button style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: 16,
          width: '100%',
          textAlign: 'left',
          border: `1px solid ${colors.gray200}`,
          borderRadius: radius.lg,
          marginBottom: 12,
        }}>
          <span style={{ fontSize: 28, marginTop: 2 }}>🏢</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: fonts.size.xl, fontWeight: fonts.weight.bold, marginBottom: 4 }}>
              Add New Workspace
            </div>
            <div style={{ fontSize: fonts.size.md, color: colors.textSecondary, lineHeight: 1.4 }}>
              If you would like to create a workspace for your company or for your friends and family.
            </div>
          </div>
          <span style={{ color: colors.textTertiary, marginTop: 8 }}>›</span>
        </button>

        {/* Join Existing */}
        <button style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: 16,
          width: '100%',
          textAlign: 'left',
          border: `1px solid ${colors.gray200}`,
          borderRadius: radius.lg,
        }}>
          <span style={{ fontSize: 28, marginTop: 2 }}>☁️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: fonts.size.xl, fontWeight: fonts.weight.bold, marginBottom: 4 }}>
              Join Existing Workspace
            </div>
            <div style={{ fontSize: fonts.size.md, color: colors.textSecondary, lineHeight: 1.4 }}>
              If you were invited to join an existing workspace by your colleague or employer.
            </div>
          </div>
          <span style={{ color: colors.textTertiary, marginTop: 8 }}>›</span>
        </button>
      </div>
    </div>
  )
}
