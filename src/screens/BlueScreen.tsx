import React, { useRef, useEffect, useSyncExternalStore } from 'react'
import { colors, fonts } from '../styles/theme'
import { useNavigation } from '../navigation/Router'
import { blueCards } from '../data/mock'
import { BlueCard } from '../components/BlueCard'
import { feedbackStore } from '../data/feedbackStore'

export function BlueScreen() {
  const { pop, push } = useNavigation()
  const scrollRef = useRef<HTMLDivElement>(null)
  const feedbackEntries = useSyncExternalStore(
    feedbackStore.subscribe,
    feedbackStore.getAll,
  )

  // Auto-scroll to bottom to show newest cards
  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
    })
  }, [feedbackEntries])

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: '#EFF3F8',
    }}>
      {/* Header — back arrow, Blue avatar + name + Online status */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '10px 16px',
        background: colors.white,
        borderBottom: `1px solid ${colors.border}`,
        justifyContent: 'center',
      }}>
        <button onClick={pop} style={{ padding: 4, position: 'absolute', left: 16 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <img
          src="/avatars/blue-avatar.png"
          alt="Blue"
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ marginLeft: 8 }}>
          <div style={{ fontSize: fonts.size.md, fontWeight: fonts.weight.bold, color: colors.textPrimary }}>
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
      <div ref={scrollRef} data-scrollable style={{ flex: 1, overflowY: 'auto', paddingTop: 16, paddingBottom: 120 }}>
        {blueCards.map(card => (
          <BlueCard
            key={card.id}
            card={card}
            onCardPress={() => push('BlueCardDetail', { cardId: card.id })}
            onVideoPress={() => push('VideoZoom', { videoUrl: card.videoUrl })}
            onViewReport={() => push('ReportView', { reportId: card.reportId || card.id })}
            onShare={() => push('ShareFlow', { reportId: card.reportId || card.id })}
            onReply={(text) => push('BlueCardDetail', { cardId: card.id, initialReply: text })}
          />
        ))}

        {/* Customer feedback cards at bottom */}
        {feedbackEntries.map(fb => (
          <div
            key={fb.id}
            style={{
              margin: '0 16px 16px', padding: '16px',
              background: '#fff', borderRadius: 16,
              border: '1.5px solid #FECACA',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#FEE2E2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 15V19a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" />
                  <path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', fontFamily: fonts.family }}>
                  Customer Feedback: Not Helpful
                </div>
                <div style={{ fontSize: 11, color: colors.textTertiary, fontFamily: fonts.family }}>
                  {fb.timestamp}
                </div>
              </div>
            </div>

            {/* Remind callout — above the red container */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '10px 12px', marginBottom: 12,
              background: '#EFF6FF', borderRadius: 8,
              border: '1px solid #BFDBFE',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <div style={{ fontSize: 12, color: colors.textPrimary, fontFamily: fonts.family, lineHeight: 1.4 }}>
                Record additional video of the items the customer flagged, then share it with Blue to generate an updated report.
              </div>
            </div>

            {/* Customer name + message + report title */}
            {fb.message && (
              <div style={{
                padding: '10px 12px',
                background: '#FEF2F2', borderRadius: 8,
                borderLeft: '3px solid #DC2626',
                marginBottom: 12,
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: colors.textPrimary, fontFamily: fonts.family,
                  marginBottom: 4,
                }}>
                  {fb.name}
                </div>
                <div style={{
                  fontSize: 13, color: colors.textPrimary, fontFamily: fonts.family,
                  lineHeight: 1.4, marginBottom: 6,
                }}>
                  "{fb.message}"
                </div>
                <div style={{
                  fontSize: 14, color: colors.textPrimary, fontFamily: fonts.family, fontWeight: 600,
                }}>
                  {fb.reportTitle.replace(/\s*[—]\s*[A-Z][a-z].*$/, '')}
                </div>
              </div>
            )}

            {/* View Report button — same style as BlueCard buttons */}
            <button
              onClick={() => push('ReportView', { reportId: fb.reportId })}
              style={{
                paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
                borderRadius: 8, background: colors.coolGray, border: 'none',
                fontSize: fonts.size.md, fontWeight: fonts.weight.semibold,
                color: colors.neutral500, cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              View Report
            </button>
          </div>
        ))}
      </div>

      {/* Island is rendered by the Router via AirwaveIsland component */}
    </div>
  )
}
