import React, { useState } from 'react'
import { colors, fonts } from '../styles/theme'
import { Header } from '../components/Header'
import { Avatar } from '../components/Avatar'
import { leaderboard, pointsBreakdown } from '../data/mock'

export function LeaderboardScreen() {
  const [tab, setTab] = useState<'leaderboard' | 'points'>('leaderboard')

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header title="Pankaj Prasad and Santi" showBack />

      {/* Tab bar */}
      <div style={{
        display: 'flex',
        borderBottom: `2px solid ${colors.gray200}`,
      }}>
        {(['leaderboard', 'points'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '12px 0',
              fontSize: fonts.size.md,
              fontWeight: fonts.weight.semibold,
              color: tab === t ? colors.textPrimary : colors.textSecondary,
              borderBottom: tab === t ? `2px solid ${colors.textPrimary}` : 'none',
              marginBottom: -2,
              textTransform: 'capitalize',
            }}
          >
            {t === 'leaderboard' ? 'LeaderBoard' : 'Points'}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'leaderboard' ? (
          <div style={{ padding: '8px 0' }}>
            {leaderboard.map(entry => (
              <div key={entry.rank} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                borderBottom: `1px solid ${colors.gray100}`,
              }}>
                <Avatar emoji={entry.user.avatar} size={40} name={entry.user.name} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: fonts.size.md, fontWeight: fonts.weight.semibold }}>
                    {entry.user.name}
                  </div>
                  {entry.user.title && (
                    <div style={{ fontSize: fonts.size.xs, color: colors.textSecondary }}>
                      {entry.user.title}
                    </div>
                  )}
                </div>
                <span style={{
                  background: colors.primary,
                  color: colors.white,
                  fontSize: fonts.size.sm,
                  fontWeight: fonts.weight.bold,
                  padding: '4px 10px',
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}>
                  ⭐ {(entry.points / 1000).toFixed(2)}K
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 16 }}>
            <h2 style={{
              fontSize: fonts.size.xxl,
              fontWeight: fonts.weight.bold,
              marginBottom: 16,
            }}>
              Points Breakdown
            </h2>
            {pointsBreakdown.map(item => (
              <div key={item.category} style={{
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: `1px solid ${colors.gray100}`,
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}>
                  <div style={{
                    fontSize: fonts.size.lg,
                    fontWeight: fonts.weight.bold,
                  }}>
                    {item.category} = {item.pointsPerAction} Points
                  </div>
                  <div style={{
                    fontSize: fonts.size.lg,
                    fontWeight: fonts.weight.medium,
                    color: colors.textSecondary,
                  }}>
                    {item.totalPoints.toLocaleString()}
                  </div>
                </div>
                <div style={{ fontSize: fonts.size.sm, color: colors.textSecondary, marginTop: 4 }}>
                  &bull; {item.description}
                </div>
              </div>
            ))}
            <div style={{
              textAlign: 'right',
              fontSize: fonts.size.xl,
              fontWeight: fonts.weight.bold,
              color: colors.danger,
              marginTop: 8,
            }}>
              Total points = 18,155
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
