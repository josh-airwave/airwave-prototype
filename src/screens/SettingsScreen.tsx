import React from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { Header } from '../components/Header'
import { useNavigation } from '../navigation/Router'

function GroupedMenuSection({ label, items, onItemPress }: {
  label?: string
  items: { title: string; rightDetail?: string; key: string; textColor?: string; leftIcon?: React.ReactNode }[]
  onItemPress?: (item: typeof items[0]) => void
}) {
  return (
    <div style={{ marginTop: 16 }}>
      {label && (
        <div style={{
          fontSize: fonts.size.lg,
          fontWeight: fonts.weight.medium,
          color: colors.crystalGray,
          marginBottom: 8,
        }}>
          {label}
        </div>
      )}
      <div style={{
        background: colors.coolLight,
        borderRadius: radius.md,
        overflow: 'hidden',
      }}>
        {items.map((item, i) => (
          <button
            key={item.key}
            onClick={() => onItemPress?.(item)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 18px',
              width: '100%',
              height: 50,
              textAlign: 'left',
              borderBottom: i < items.length - 1 ? `1px solid ${colors.borderGray}` : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              {item.leftIcon}
              <span style={{
                fontSize: fonts.size.lg,
                fontWeight: fonts.weight.semibold,
                color: item.textColor || colors.almostBlack,
              }}>
                {item.title}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {item.rightDetail && (
                <span style={{ fontSize: fonts.size.md, color: colors.neutral400 }}>
                  {item.rightDetail}
                </span>
              )}
              {!item.textColor && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.neutral400} strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export function SettingsScreen() {
  const { push } = useNavigation()

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: colors.white }}>
      <Header title="Settings" showBack />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 20px' }}>
        <GroupedMenuSection
          label="General"
          items={[
            { title: 'Notifications', key: 'notifications' },
            { title: 'Blocked Contacts', rightDetail: '0', key: 'blockedContactsList' },
          ]}
          onItemPress={(item) => {
            if (item.key === 'notifications') push('Notifications')
          }}
        />

        <GroupedMenuSection
          label="Help & Support"
          items={[
            { title: 'Terms & Conditions', key: 'terms' },
            { title: 'Privacy Policy', key: 'policy' },
          ]}
        />

        {/* Logout - iOS: bg settingsGray (#EDEDED), text errorRed (#FF3B30) */}
        <div style={{ marginTop: 16 }}>
          <div style={{
            background: colors.settingsGray,
            borderRadius: radius.md,
            overflow: 'hidden',
          }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '0 18px',
              width: '100%',
              height: 50,
              textAlign: 'left',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.danger} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span style={{
                fontSize: fonts.size.lg,
                fontWeight: fonts.weight.semibold,
                color: colors.danger,
              }}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
