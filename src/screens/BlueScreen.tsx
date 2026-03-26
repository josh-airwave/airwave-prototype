import React from 'react'
import { colors, fonts } from '../styles/theme'
import { Header } from '../components/Header'
import { ContentCard } from '../components/ContentCard'
import { useNavigation } from '../navigation/Router'
import { reports } from '../data/mock'

export function BlueScreen() {
  const { push } = useNavigation()

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header
        title="Blue"
        showBack
        rightAction={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#E8F0FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={colors.primary}>
                <circle cx="12" cy="8" r="5" />
                <path d="M3 21c0-4.97 4.03-9 9-9s9 4.03 9 9" />
              </svg>
            </div>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: colors.success,
            }} />
            <span style={{ fontSize: fonts.size.sm, color: colors.success }}>Online</span>
          </div>
        }
      />
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {reports.map(report => (
          <ContentCard
            key={report.id}
            report={report}
            onViewReport={() => push('ReportView', { reportId: report.id })}
          />
        ))}
      </div>

      {/* Bottom actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '12px 16px 28px',
        borderTop: `1px solid ${colors.border}`,
        background: colors.white,
      }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: 4,
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.gray500} strokeWidth="1.8">
            <circle cx="7" cy="14" r="4" />
            <circle cx="17" cy="14" r="4" />
            <path d="M11 14h2" />
            <path d="M3 14V10a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v4" />
          </svg>
        </button>
        <button style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 12px rgba(22,91,195,0.4)`,
          marginTop: -16,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <rect x="4" y="2" width="4" height="20" rx="2" />
            <rect x="10" y="5" width="4" height="14" rx="2" />
            <rect x="16" y="2" width="4" height="20" rx="2" />
          </svg>
        </button>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button style={{ padding: 4, display: 'flex' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.gray500} strokeWidth="1.8">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </button>
          <button style={{ padding: 4, display: 'flex' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.gray500} strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
