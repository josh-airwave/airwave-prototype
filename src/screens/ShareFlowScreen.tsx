import React, { useState, useEffect } from 'react'
import { colors, fonts } from '../styles/theme'
import { useNavigation } from '../navigation/Router'
import { videoIntelReports } from '../data/mock'

type FlowStep = 'drawer' | 'share_sheet' | 'imessage' | 'done'

export function ShareFlowScreen({ params }: { params?: Record<string, unknown> }) {
  const { push, pop } = useNavigation()
  const reportId = (params?.reportId as string) || 'vr3'
  const report = videoIntelReports.find(r => r.id === reportId) || videoIntelReports[0]
  const shortUrl = `awv.app/r/${report.id.replace('vr', '')}`

  const [step, setStep] = useState<FlowStep>('drawer')
  const [copied, setCopied] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [showViewedNotif, setShowViewedNotif] = useState(false)
  const [showFeedbackNotif, setShowFeedbackNotif] = useState(false)

  // Auto-advance: after sending iMessage, show "viewed" notification, then "helpful" feedback
  useEffect(() => {
    if (sent) {
      const t1 = setTimeout(() => setShowViewedNotif(true), 2000)
      const t2 = setTimeout(() => setShowFeedbackNotif(true), 4500)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [sent])

  // Drawer step — "Share to Chat" / "Share Externally"
  if (step === 'drawer') {
    return (
      <div style={{ height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
        onClick={() => pop()}
      >
        <div style={{
          background: '#fff', borderRadius: '16px 16px 0 0', padding: '8px 0 24px',
        }} onClick={e => e.stopPropagation()}>
          {/* Drag handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 12px' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: colors.neutralGray }} />
          </div>

          <div style={{ padding: '0 16px 8px', fontSize: 16, fontWeight: 700, fontFamily: fonts.family, color: colors.almostBlack }}>
            Share Report
          </div>

          {/* Share to Chat */}
          <button
            onClick={() => pop()}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', width: '100%',
              background: 'transparent', border: 'none', cursor: 'pointer',
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: colors.primaryLight15,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 15, fontWeight: 600, fontFamily: fonts.family, color: colors.almostBlack }}>Share to Chat</div>
              <div style={{ fontSize: 12, color: colors.coolText, fontFamily: fonts.family }}>Send to a channel or person in Airwave</div>
            </div>
          </button>

          {/* Share Externally */}
          <button
            onClick={() => setStep('share_sheet')}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', width: '100%',
              background: 'transparent', border: 'none', cursor: 'pointer',
            }}
          >
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: 'rgba(73,174,123,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 15, fontWeight: 600, fontFamily: fonts.family, color: colors.almostBlack }}>Share Externally</div>
              <div style={{ fontSize: 12, color: colors.coolText, fontFamily: fonts.family }}>Send link via text, email, or other apps</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.coolText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  // iOS Share Sheet simulation
  if (step === 'share_sheet') {
    const apps = [
      { name: 'Messages', color: '#34C759', icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
      )},
      { name: 'WhatsApp', color: '#25D366', icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5H8c-.2 0-.5.1-.8.4C6.9 7.1 6.3 7.7 6.3 9s.9 2.4 1 2.6c.1.2 1.8 2.7 4.3 3.8 2.5 1.1 2.5.7 2.9.7.4 0 1.6-.6 1.8-1.2.2-.6.2-1.1.1-1.2-.1-.2-.3-.3-.6-.4z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3C3.9 14.9 3.4 13.5 3.4 12 3.4 7.3 7.3 3.4 12 3.4S20.6 7.3 20.6 12 16.7 20 12 20z"/></svg>
      )},
      { name: 'Mail', color: '#007AFF', icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      )},
      { name: 'Copy Link', color: '#8E8E93', icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      )},
    ]

    return (
      <div style={{ height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
        onClick={() => setStep('drawer')}
      >
        <div style={{
          background: '#F2F2F7', borderRadius: '16px 16px 0 0',
          padding: '0 0 24px',
        }} onClick={e => e.stopPropagation()}>
          {/* Drag handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: '#C7C7CC' }} />
          </div>

          {/* Link preview card */}
          <div style={{
            margin: '8px 16px 16px', padding: '12px',
            background: '#fff', borderRadius: 12,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 8,
              background: colors.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: fonts.family, color: colors.almostBlack, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {report.title}
              </div>
              <div style={{ fontSize: 12, color: colors.coolText, fontFamily: fonts.family }}>
                {shortUrl}
              </div>
            </div>
          </div>

          {/* App icons */}
          <div style={{
            display: 'flex', justifyContent: 'space-around',
            padding: '0 24px 16px',
          }}>
            {apps.map(app => (
              <button
                key={app.name}
                onClick={() => {
                  if (app.name === 'Messages') {
                    setStep('imessage')
                  } else if (app.name === 'Copy Link') {
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }
                }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 12,
                  background: app.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {app.icon}
                </div>
                <span style={{ fontSize: 10, fontFamily: fonts.family, color: colors.coolText }}>
                  {app.name === 'Copy Link' && copied ? 'Copied!' : app.name}
                </span>
              </button>
            ))}
          </div>

          {/* Actions list */}
          <div style={{ margin: '0 16px', background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
            {['Copy', 'Add to Reading List', 'Add to Shared Links', 'Markup'].map((action, idx) => (
              <div key={action} style={{
                padding: '12px 16px', fontSize: 15, fontFamily: fonts.family,
                color: action === 'Copy' ? colors.primary : colors.almostBlack,
                borderBottom: idx < 3 ? `0.5px solid ${colors.neutralGray}` : 'none',
              }}>
                {action}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // iMessage compose + OG preview simulation
  if (step === 'imessage' || step === 'done') {
    return (
      <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        {/* Push notification banners */}
        {showViewedNotif && (
          <div
            onClick={() => setShowViewedNotif(false)}
            style={{
              position: 'absolute', top: 56, left: 8, right: 8, zIndex: 100,
              background: '#fff', borderRadius: 14, padding: '10px 12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              display: 'flex', alignItems: 'center', gap: 10,
              animation: 'slideDown 0.3s ease-out',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: colors.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: fonts.family, color: colors.almostBlack }}>Airwave</div>
              <div style={{ fontSize: 12, fontFamily: fonts.family, color: colors.coolText }}>
                "{report.title}" was viewed
              </div>
            </div>
            <span style={{ fontSize: 10, color: colors.coolText, fontFamily: fonts.family, marginLeft: 'auto', flexShrink: 0 }}>now</span>
          </div>
        )}

        {showFeedbackNotif && (
          <div
            onClick={() => {
              setShowFeedbackNotif(false)
              // Navigate to the external report to show feedback
            }}
            style={{
              position: 'absolute', top: showViewedNotif ? 112 : 56, left: 8, right: 8, zIndex: 99,
              background: '#fff', borderRadius: 14, padding: '10px 12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              display: 'flex', alignItems: 'center', gap: 10,
              animation: 'slideDown 0.3s ease-out',
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: colors.success,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, fontFamily: fonts.family, color: colors.almostBlack }}>Airwave</div>
              <div style={{ fontSize: 12, fontFamily: fonts.family, color: colors.coolText }}>
                Customer found your report helpful!
              </div>
            </div>
            <span style={{ fontSize: 10, color: colors.coolText, fontFamily: fonts.family, marginLeft: 'auto', flexShrink: 0 }}>now</span>
          </div>
        )}

        {/* iMessage header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 12px',
          borderBottom: `0.5px solid ${colors.neutralGray}`,
          background: '#F6F6F6',
        }}>
          <button onClick={() => setStep('share_sheet')} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#007AFF', fontSize: 16, fontFamily: fonts.family, display: 'flex', alignItems: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 600, fontFamily: fonts.family, color: colors.almostBlack }}>Customer</div>
            <div style={{ fontSize: 11, color: colors.coolText, fontFamily: fonts.family }}>iMessage</div>
          </div>
          <div style={{ width: 20 }} />
        </div>

        {/* Message thread */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px', background: '#fff' }}>
          {/* Sent message with OG preview */}
          {sent && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
              <div style={{ maxWidth: '80%' }}>
                {/* OG link preview card */}
                <div
                  onClick={() => push('ExternalReport', { reportId })}
                  style={{
                    background: '#E9E9EB', borderRadius: 14, overflow: 'hidden',
                    marginBottom: 4, cursor: 'pointer',
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ height: 120, background: '#000', position: 'relative', overflow: 'hidden' }}>
                    <video
                      src={report.sourceVideoUrl}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      playsInline muted
                    />
                    <div style={{
                      position: 'absolute', bottom: 6, left: 8,
                      background: 'rgba(0,0,0,0.6)', color: 'white',
                      fontSize: 9, fontWeight: 600, fontFamily: fonts.family,
                      padding: '2px 6px', borderRadius: 4,
                      display: 'flex', alignItems: 'center', gap: 3,
                    }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
                      </svg>
                      Airwave
                    </div>
                  </div>
                  {/* OG text */}
                  <div style={{ padding: '8px 10px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: fonts.family, color: colors.almostBlack }}>
                      {report.title}
                    </div>
                    <div style={{ fontSize: 11, color: colors.coolText, fontFamily: fonts.family, marginTop: 2 }}>
                      {shortUrl}
                    </div>
                  </div>
                </div>
                {/* Blue bubble */}
                <div style={{
                  background: '#007AFF', color: 'white',
                  padding: '8px 12px', borderRadius: '18px 18px 4px 18px',
                  fontSize: 15, fontFamily: fonts.family, lineHeight: 1.35,
                }}>
                  Here's the report from today's inspection. Let me know if you need anything else.
                </div>
                <div style={{ fontSize: 10, color: colors.coolText, fontFamily: fonts.family, textAlign: 'right', marginTop: 3 }}>
                  Delivered
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Compose bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px 24px',
          borderTop: `0.5px solid ${colors.neutralGray}`,
          background: '#F6F6F6',
        }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center',
            background: '#fff', borderRadius: 20, border: `1px solid ${colors.neutralGray}`,
            padding: '8px 12px', minHeight: 36,
          }}>
            {!sent && (
              <span style={{ fontSize: 14, fontFamily: fonts.family, color: colors.almostBlack }}>
                Here's the report from today's inspection. Let me know if you need anything else.
              </span>
            )}
            {sent && (
              <span style={{ fontSize: 14, fontFamily: fonts.family, color: colors.neutral400 }}>iMessage</span>
            )}
          </div>
          {!sent ? (
            <button
              onClick={() => { setSending(true); setTimeout(() => { setSending(false); setSent(true) }, 800) }}
              disabled={sending}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: sending ? colors.neutralGray : '#007AFF',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          ) : null}
        </div>

        <style>{`
          @keyframes slideDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

  return null
}
