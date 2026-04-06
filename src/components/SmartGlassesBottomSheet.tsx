import React from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { VideoThumbnail } from './VideoThumbnail'
import { galleryItems } from '../data/mock'
import { useNavigation } from '../navigation/Router'

interface SmartGlassesBottomSheetProps {
  open: boolean
  onClose: () => void
}

export function SmartGlassesBottomSheet({ open, onClose }: SmartGlassesBottomSheetProps) {
  const { push } = useNavigation()
  const [durations, setDurations] = React.useState<Record<string, string>>({})

  if (!open) return null

  const previewItems = galleryItems.slice(0, 4)

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 200,
        }}
      />
      {/* Sheet — full height up to status bar */}
      <div style={{
        position: 'absolute',
        top: 44,
        bottom: 0,
        left: 0,
        right: 0,
        background: colors.white,
        borderRadius: '20px 20px 0 0',
        zIndex: 201,
        overflowY: 'auto',
        padding: '12px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: colors.gray300 }} />
        </div>

        {/* Connected Info Card */}
        <div style={{
          border: `1.5px solid ${colors.coolMedium}`,
          borderRadius: 12,
          padding: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: fonts.weight.semibold, color: colors.almostBlack }}>
                Airwave
              </div>
              <div style={{ fontSize: '20px', fontWeight: fonts.weight.semibold, color: colors.almostBlack }}>
                Glasses
              </div>
              <div style={{ fontSize: fonts.size.lg, color: colors.neutral400, marginTop: 4 }}>
                Model:
              </div>
              <div style={{ fontSize: fonts.size.lg, color: colors.neutral400 }}>
                AIRWAVE_DA9D
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.success }} />
                <span style={{ fontSize: fonts.size.lg, color: colors.success, fontWeight: fonts.weight.medium }}>
                  Connected
                </span>
              </div>
              <div style={{ fontSize: fonts.size.sm, color: colors.neutral400, marginTop: 6 }}>
                Battery
              </div>
              <div style={{ fontSize: '24px', fontWeight: fonts.weight.bold, color: colors.almostBlack, lineHeight: 1.1 }}>
                79%
              </div>
            </div>
          </div>

          {/* Update Firmware button */}
          <div
            onClick={(e) => {
              e.stopPropagation()
              push('FirmwareUpdate')
              setTimeout(() => onClose(), 100)
            }}
            style={{
              width: '100%',
              marginTop: 12,
              padding: '10px 0',
              borderRadius: 8,
              background: colors.primary,
              color: colors.white,
              fontSize: fonts.size.md,
              fontWeight: fonts.weight.semibold,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              gap: 6,
            }}
            role="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Update Firmware
          </div>
        </div>

        {/* Disconnect button */}
        <div
          style={{
            width: '100%',
            minHeight: 56,
            borderRadius: 12,
            background: colors.coolLight,
            color: colors.almostBlack,
            fontSize: fonts.size.lg,
            fontWeight: fonts.weight.semibold,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          role="button"
        >
          Disconnect Glasses
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: colors.coolMedium }} />

        {/* Files on Glasses */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: '20px', fontWeight: fonts.weight.bold, color: colors.almostBlack, whiteSpace: 'nowrap' }}>
              Files on Glasses: 0
            </span>
            <button style={{
              fontSize: fonts.size.lg,
              fontWeight: fonts.weight.medium,
              color: colors.neutral400,
              padding: '6px 16px',
              border: `1px solid ${colors.gray300}`,
              borderRadius: 8,
              background: 'transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              Import All
            </button>
          </div>
          <p style={{
            fontSize: fonts.size.lg,
            color: colors.almostBlack,
            lineHeight: 1.6,
            margin: 0,
          }}>
            Airwave Glasses import files through a special Wi-Fi connection on the glasses. You will see an alert to connect, please tap "Join" in order to import.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: colors.coolMedium }} />

        {/* Gallery Preview */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
          }}>
            <span style={{ fontSize: '20px', fontWeight: fonts.weight.bold, color: colors.almostBlack }}>
              Gallery
            </span>
            <button
              onClick={() => { onClose(); push('Gallery') }}
              style={{
                fontSize: fonts.size.lg,
                fontWeight: fonts.weight.medium,
                color: colors.almostBlack,
                padding: '6px 16px',
                border: `1px solid ${colors.gray300}`,
                borderRadius: 8,
                background: 'transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              View All
            </button>
          </div>

          {/* Gallery items horizontal scroll */}
          <div style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 4,
          }}>
            {previewItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onClose(); push('ShareView', { itemId: item.id }) }}
                style={{
                  width: 128,
                  height: 218,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#1a1a2e',
                  flexShrink: 0,
                  position: 'relative',
                  padding: 0,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {item.type === 'video' && item.videoUrl ? (
                  <VideoThumbnail
                    src={item.videoUrl}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onDurationDetected={(dur) => setDurations(prev => ({ ...prev, [item.id]: dur }))}
                  />
                ) : (
                  <img
                    src={item.thumbnail}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                {item.type === 'video' && (
                  <span style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    color: colors.white,
                    fontSize: '22px',
                    fontWeight: fonts.weight.semibold,
                    textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                    pointerEvents: 'none',
                  }}>
                    {durations[item.id] || ''}
                  </span>
                )}
                {item.type === 'photo' && (
                  <img
                    src="/icons/ic_photo_camera_white.png"
                    alt=""
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      width: 24,
                      height: 24,
                      objectFit: 'contain',
                      opacity: 0.8,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom safe area */}
        <div style={{ height: 16 }} />
      </div>
    </>
  )
}
