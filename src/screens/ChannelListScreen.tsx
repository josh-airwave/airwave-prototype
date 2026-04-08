import React from 'react'
import { colors, fonts } from '../styles/theme'
import { Header } from '../components/Header'
import { SearchBar } from '../components/SearchBar'
import { ChannelRow } from '../components/ChannelRow'
import { SideDrawer } from '../components/SideDrawer'
import { useNavigation } from '../navigation/Router'
import { channels } from '../data/mock'

// Shortcut rows with colored backgrounds matching iOS app
function ShortcutRow({ icon, label, bgColor, onPress }: {
  icon: React.ReactNode
  label: string
  bgColor: string
  onPress?: () => void
}) {
  return (
    <button
      onClick={onPress}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '14px 16px',
        width: '100%',
        textAlign: 'left',
        background: bgColor,
        borderBottom: `1px solid ${colors.white}`,
      }}
    >
      <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        {icon}
      </div>
      <span style={{ fontSize: '18px', fontWeight: fonts.weight.semibold, flex: 1, color: colors.textPrimary }}>
        {label}
      </span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.neutral400} strokeWidth="2.5" strokeLinecap="round">
        <polyline points="9 6 15 12 9 18" />
      </svg>
    </button>
  )
}

export function ChannelListScreen() {
  const { push } = useNavigation()

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', background: colors.white }}>
      <Header
        title="Airwave HQ"
        subtitle="6 People Online ›"
        showMenu
        showCompose
        showRestart
      />
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 90 }}>
        <SearchBar />

        <div style={{ marginTop: 8 }}>
          {/* Saved Messages - uses ic_saved_msgs.png (blue bookmark) */}
          <ShortcutRow
            bgColor="#EDE9F8"
            icon={<img src="/icons/ic_saved_msgs.png" alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />}
            label="Saved Messages"
            onPress={() => push('SavedMessages')}
          />

          {/* Replies - uses reply_arrow_icon.png (blue arrow badge) */}
          <ShortcutRow
            bgColor="#E3EEFB"
            icon={<img src="/icons/reply_arrow_icon.png" alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />}
            label="Replies"
            onPress={() => push('Replies')}
          />

          {/* Mentions - uses mention_icon.png (green @ circle) */}
          <ShortcutRow
            bgColor="#E5F5EC"
            icon={<img src="/icons/mention_icon.png" alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />}
            label="Mentions"
          />
        </div>

        {/* Channel list */}
        {channels.map(channel => (
          <ChannelRow
            key={channel.id}
            channel={channel}
            onPress={() => push(
              channel.type === 'blue' ? 'Blue' : 'Chat',
              { channelId: channel.id, channelType: channel.type }
            )}
          />
        ))}
      </div>
      <SideDrawer />
    </div>
  )
}
