import React from 'react'
import { colors, fonts } from '../styles/theme'
import { BlueCard as BlueCardType } from '../data/mock'

interface BlueCardProps {
  card: BlueCardType
  onCardPress?: () => void
  onVideoPress?: () => void
  onViewReport?: () => void
  onShare?: () => void
  onReply?: (text: string) => void
}

export function BlueCard({ card, onCardPress, onVideoPress, onViewReport, onShare, onReply }: BlueCardProps) {
  const [replyText, setReplyText] = React.useState('')
  return (
    <div
      onClick={onCardPress}
      style={{
        background: colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        margin: '0 16px 16px',
        padding: 16,
        cursor: onCardPress ? 'pointer' : 'default',
      }}
    >
      {/* Video thumbnail — blurry bg + portrait center */}
      {card.videoUrl && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onVideoPress?.()
          }}
          style={{
            position: 'relative', width: '100%', height: 174,
            overflow: 'hidden', borderRadius: 12, background: '#000',
            padding: 0, border: 'none', cursor: 'pointer', display: 'block',
          }}
        >
          <video src={card.videoUrl} preload="metadata" muted playsInline
            onLoadedMetadata={e => { const v = e.currentTarget; v.currentTime = Math.min(2, Math.max(0.1, v.duration - 0.1)) }}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover', filter: 'blur(20px) brightness(0.6)', transform: 'scale(1.2)',
            }}
          />
          <video src={card.videoUrl} preload="metadata" muted playsInline
            onLoadedMetadata={e => { const v = e.currentTarget; v.currentTime = Math.min(2, Math.max(0.1, v.duration - 0.1)) }}
            style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', height: '100%',
              borderRadius: 6, objectFit: 'contain', zIndex: 1,
            }}
          />
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(0,0,0,0.45)', zIndex: 2,
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <polygon points="6,3 20,12 6,21" />
            </svg>
          </div>
        </button>
      )}

      {/* Title */}
      <div style={{ marginTop: 10 }} />
      <div style={{
        fontSize: fonts.size.lg, fontWeight: fonts.weight.semibold,
        color: colors.almostBlack, lineHeight: '1.3', marginBottom: 4,
      }}>
        {card.title}
      </div>

      {/* Summary — 4 lines max */}
      <div style={{
        fontSize: fonts.size.md, fontWeight: fonts.weight.regular,
        color: colors.almostBlack, lineHeight: '1.5',
        display: '-webkit-box', WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical' as any, overflow: 'hidden',
        marginBottom: 12,
      }}>
        {card.summary}
      </div>

      {/* Action buttons + reply count */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        {card.buttons.includes('View Report') && (
          <button onClick={(e) => { e.stopPropagation(); onViewReport?.() }} style={{
            paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
            borderRadius: 8, background: colors.coolGray, border: 'none',
            fontSize: fonts.size.md, fontWeight: fonts.weight.semibold,
            color: colors.neutral500, cursor: 'pointer', minWidth: 100,
          }}>
            View Report
          </button>
        )}
        {card.buttons.includes('Share') && (
          <button onClick={(e) => { e.stopPropagation(); onShare?.() }} style={{
            paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
            borderRadius: 8, background: colors.coolGray, border: 'none',
            fontSize: fonts.size.md, fontWeight: fonts.weight.semibold,
            color: colors.neutral500, cursor: 'pointer', minWidth: 100,
          }}>
            Share
          </button>
        )}
      </div>

      {/* Reply field */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex', alignItems: 'center',
          background: colors.coolLight, borderRadius: 24,
          padding: '0 4px 0 16px', height: 40,
        }}
      >
        <input
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && replyText.trim()) {
              onReply?.(replyText.trim())
              setReplyText('')
            }
          }}
          placeholder="Reply..."
          style={{
            flex: 1, border: 'none', background: 'transparent', outline: 'none',
            fontSize: fonts.size.md, color: colors.almostBlack,
            fontFamily: fonts.family,
          }}
        />
        {replyText.trim() && (
          <button
            onClick={() => {
              onReply?.(replyText.trim())
              setReplyText('')
            }}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: colors.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
