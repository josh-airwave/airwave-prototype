import React from 'react'
import { colors, fonts } from '../styles/theme'
import { useNavigation } from '../navigation/Router'
import { blueCards } from '../data/mock'
import { BlueCard } from '../components/BlueCard'

export function BlueScreen() {
  const { pop, push } = useNavigation()

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: '#EFF3F8',
    }}>
      {/* Header — back arrow, Blue avatar + name + Online status */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 16px',
        background: colors.white,
        borderBottom: `1px solid ${colors.border}`,
      }}>
        <button onClick={pop} style={{ padding: 4 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <img
          src="/avatars/blue-avatar.png"
          alt="Blue"
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <div style={{ fontSize: fonts.size.lg, fontWeight: fonts.weight.bold, color: colors.textPrimary }}>
            Blue
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: fonts.size.sm }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: '#22C55E',
            }} />
            <span style={{ color: '#22C55E', fontWeight: fonts.weight.medium }}>Online</span>
          </div>
        </div>
      </div>

      {/* Card feed */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: 16, paddingBottom: 120 }}>
        {blueCards.map(card => (
          <BlueCard
            key={card.id}
            card={card}
            onCardPress={() => push('BlueCardDetail', { cardId: card.id })}
            onVideoPress={() => push('VideoZoom', { videoUrl: card.videoUrl })}
            onViewReport={() => push('ReportView', { reportId: card.id })}
            onShare={() => push('BlueCardDetail', { cardId: card.id, openShare: true })}
            onReply={(text) => push('BlueCardDetail', { cardId: card.id, initialReply: text })}
          />
        ))}
      </div>

      {/* Island is rendered by the Router via AirwaveIsland component */}
    </div>
  )
}
