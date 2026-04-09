import React from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { Avatar } from './Avatar'
import { useNavigation } from '../navigation/Router'
import { currentUser, workspaces } from '../data/mock'
import { useStatusBar } from './PhoneFrame'

export function SideDrawer() {
  const { drawerOpen, setDrawerOpen, push } = useNavigation()
  const { setDark } = useStatusBar()

  React.useEffect(() => {
    if (drawerOpen) setDark(true)
    return () => { if (drawerOpen) setDark(false) }
  }, [drawerOpen])

  if (!drawerOpen) return null

  return (
    <>
      {/* Overlay - extends up behind status bar */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: 'absolute',
          top: -54,
          left: 0,
          right: 0,
          bottom: 0,
          background: colors.overlay,
          zIndex: 200,
        }}
      />
      {/* Drawer */}
      <div style={{
        position: 'absolute',
        top: -54,
        left: 0,
        bottom: 0,
        width: 'calc(100% - 70px)',
        background: colors.white,
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* User profile - avatar + name side by side (extra top padding for status bar) */}
        <div style={{ padding: '110px 20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <Avatar emoji={currentUser.avatar} size={64} name={currentUser.name} />
              <div style={{
                position: 'absolute',
                bottom: -2,
                left: 42,
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: colors.success,
                border: `2.5px solid ${colors.white}`,
              }} />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: fonts.weight.bold, color: colors.textPrimary }}>
                {currentUser.name}
              </div>
              <div style={{
                fontSize: fonts.size.lg,
                color: colors.textPrimary,
                marginTop: 1,
              }}>
                Online
              </div>
            </div>
          </div>
        </div>

        {/* Status - in grouped card */}
        <div style={{ padding: '0 16px', marginBottom: 8 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 16px',
            background: colors.coolLight,
            borderRadius: radius.md,
          }}>
            <span style={{ fontSize: 18, opacity: 0.5 }}>&#128578;</span>
            <span style={{ fontSize: fonts.size.lg, color: colors.textPrimary, flex: 1 }}>Online</span>
            <span style={{ color: colors.textTertiary, cursor: 'pointer', fontSize: 16 }}>&#10005;</span>
          </div>
        </div>

        {/* Edit Profile + Settings - in grouped card */}
        <div style={{ padding: '0 16px', marginBottom: 8 }}>
          <div style={{
            background: colors.coolLight,
            borderRadius: radius.md,
            overflow: 'hidden',
          }}>
            <button
              onClick={() => { setDrawerOpen(false); push('Profile') }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 16px',
                width: '100%',
                textAlign: 'left',
                borderBottom: `1px solid ${colors.borderGray}`,
              }}
            >
              <img src="/icons/ic_profile_menu.png" alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
              <span style={{ fontSize: fonts.size.lg, fontWeight: fonts.weight.semibold }}>Edit Profile</span>
            </button>
            <button
              onClick={() => { setDrawerOpen(false); push('Settings') }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 16px',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <img src="/icons/ic_settings_menu.png" alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
              <span style={{ fontSize: fonts.size.lg, fontWeight: fonts.weight.semibold }}>Settings</span>
            </button>
          </div>
        </div>

        {/* Invite Contacts - separate card */}
        <div style={{ padding: '0 16px', marginBottom: 16 }}>
          <div style={{
            background: colors.coolLight,
            borderRadius: radius.md,
          }}>
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 16px',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <img src="/icons/ic_share_menu.png" alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
              <span style={{ fontSize: fonts.size.lg, fontWeight: fonts.weight.semibold }}>Invite Contacts</span>
            </button>
          </div>
        </div>

        {/* Workspaces header */}
        <div style={{ padding: '4px 20px 12px' }}>
          <div style={{ fontSize: '18px', fontWeight: fonts.weight.bold, color: colors.textPrimary }}>
            Workspaces
          </div>
        </div>

        {/* Workspace items - each in its own rounded card */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {workspaces.map(ws => (
            <button
              key={ws.id}
              onClick={() => setDrawerOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                width: '100%',
                textAlign: 'left',
                background: colors.coolLight,
                borderRadius: radius.md,
              }}
            >
              {/* Circular dark avatar with initials */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: colors.almostBlack,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: colors.white,
                flexShrink: 0,
              }}>
                {ws.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <span style={{
                fontSize: fonts.size.lg,
                fontWeight: fonts.weight.medium,
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {ws.name}
              </span>
              {ws.unreadCount && (
                <span style={{
                  background: colors.primary,
                  color: colors.white,
                  fontSize: fonts.size.xs,
                  fontWeight: fonts.weight.bold,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {ws.unreadCount}
                </span>
              )}
              <span style={{ color: colors.textTertiary, fontSize: 18, letterSpacing: 2 }}>&#8943;</span>
            </button>
          ))}
        </div>

        {/* Add or Join Workspace */}
        <button
          onClick={() => {
            setDrawerOpen(false)
            push('Workspace')
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '16px 20px',
            color: colors.primary,
            fontSize: fonts.size.lg,
            fontWeight: fonts.weight.medium,
          }}
        >
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          Add or Join Workspace
        </button>
      </div>
    </>
  )
}
