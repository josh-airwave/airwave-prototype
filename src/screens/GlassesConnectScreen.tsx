import React from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { Header } from '../components/Header'
import { useNavigation } from '../navigation/Router'
import { galleryItems } from '../data/mock'

export function GlassesConnectScreen() {
  const { push } = useNavigation()

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: colors.white }}>
      <Header title="Airwave HQ" subtitle="8 People Online ›" showBack />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
        {/* Connection warning */}
        <div style={{
          background: colors.dangerLight,
          borderRadius: radius.lg,
          padding: 16,
          textAlign: 'center',
          marginTop: 16,
        }}>
          <p style={{
            fontSize: fonts.size.md,
            color: colors.danger,
            lineHeight: 1.5,
            marginBottom: 12,
          }}>
            We've lost connection to your Airwave Glasses. Please reconnect your glasses! Make sure your Glasses are turned on and in range.
          </p>
          <button style={{
            width: '100%',
            padding: '14px 0',
            background: colors.danger,
            color: colors.white,
            borderRadius: radius.pill,
            fontSize: fonts.size.lg,
            fontWeight: fonts.weight.bold,
          }}>
            Connect Glasses
          </button>
        </div>

        {/* Gallery preview */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 24,
          marginBottom: 12,
        }}>
          <h3 style={{ fontSize: fonts.size.xl, fontWeight: fonts.weight.bold, color: colors.almostBlack }}>Gallery</h3>
          <button
            onClick={() => push('Gallery')}
            style={{
              padding: '6px 16px',
              border: `1px solid ${colors.neutralGray}`,
              borderRadius: radius.sm,
              fontSize: fonts.size.sm,
              fontWeight: fonts.weight.medium,
              color: colors.almostBlack,
            }}
          >
            View All
          </button>
        </div>
        <div style={{
          display: 'flex',
          gap: 4,
          overflowX: 'auto',
          paddingBottom: 8,
        }}>
          {galleryItems.slice(0, 4).map(item => (
            <button
              key={item.id}
              onClick={() => push(item.type === 'video' ? 'VideoZoom' : 'ImageZoom', { itemId: item.id })}
              style={{
                width: 100,
                height: 100,
                borderRadius: radius.sm,
                background: colors.cloudBlack,
                flexShrink: 0,
                overflow: 'hidden',
                position: 'relative',
                padding: 0,
                border: 'none',
              }}
            >
              <img
                src={item.thumbnail}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {item.duration && (
                <span style={{
                  position: 'absolute',
                  bottom: 4,
                  left: 4,
                  background: 'rgba(0,0,0,0.6)',
                  color: colors.white,
                  fontSize: fonts.size.xs,
                  padding: '2px 6px',
                  borderRadius: 4,
                }}>
                  {item.duration}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
