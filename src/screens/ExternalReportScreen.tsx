import React, { useState, useEffect } from 'react'
import { colors, fonts } from '../styles/theme'
import { useNavigation } from '../navigation/Router'
import { videoIntelReports, VideoIntelReport } from '../data/mock'

function confidenceColor(c: number) {
  if (c >= 0.9) return colors.success
  if (c >= 0.8) return colors.warning
  return colors.danger
}

export function ExternalReportScreen({ params }: { params?: Record<string, unknown> }) {
  const { push } = useNavigation()
  const reportId = (params?.reportId as string) || 'vr3'
  const report = videoIntelReports.find(r => r.id === reportId) || videoIntelReports[0]

  // Simulate "loading" the external page
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setTimeout(() => setLoaded(true), 600) }, [])

  // Feedback state
  const [feedbackState, setFeedbackState] = useState<'none' | 'not_helpful_form' | 'submitted'>('none')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  // Notify tech callback
  const notifyTech = params?.onNotifyTech as ((type: string, message?: string) => void) | undefined

  const handleHelpful = () => {
    setFeedbackState('submitted')
    notifyTech?.('helpful')
  }
  const handleNotHelpful = () => {
    setFeedbackState('not_helpful_form')
  }
  const handleSubmitFeedback = () => {
    setFeedbackState('submitted')
    notifyTech?.('not_helpful', feedbackMessage)
  }

  // Parse hourly table for display
  const fields = report.ocrFields
  const isHourlyReport = fields.some(f => f.label.match(/^HR \d+/))
  const hourlyFields = isHourlyReport ? fields.filter(f => f.label.match(/^HR \d+/)) : []
  const nonHourlyFields = isHourlyReport ? fields.filter(f => !f.label.match(/^HR \d+/)) : fields

  // Build hourly rows
  const hasActuals = hourlyFields.some(f => f.label.match(/— Hourly Actual$/))
  const hourlyRows: Record<string, Record<string, string>>[] = []
  for (const f of hourlyFields) {
    const match = f.label.match(/^HR (\d+) — (.+)$/)
    if (!match) continue
    const [, hr, col] = match
    const idx = parseInt(hr) - 1
    if (!hourlyRows[idx]) hourlyRows[idx] = { hr }
    hourlyRows[idx][col] = f.editedValue ?? f.value
  }
  const columns = hasActuals
    ? ['Hourly Goal', 'Cumulative Goal', 'Hourly Actual', 'Cumulative Actual']
    : ['Hourly Goal', 'Cumulative Goal']

  if (!loaded) {
    return (
      <div style={{
        height: '100%', background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, border: `3px solid ${colors.neutralGray}`,
          borderTopColor: colors.primary, borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <span style={{ fontSize: 13, color: colors.coolText, fontFamily: fonts.family }}>Loading report...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', background: '#fff' }}>
      {/* Airwave branded header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: `1px solid ${colors.border}`,
        background: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: colors.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: fonts.family, color: colors.almostBlack }}>
            Airwave Report
          </span>
        </div>
        <span style={{ fontSize: 11, color: colors.coolText, fontFamily: fonts.family }}>
          Shared by {report.technician}
        </span>
      </div>

      {/* Report content */}
      <div style={{ padding: '16px' }}>
        {/* Title & metadata */}
        <h1 style={{
          fontSize: 20, fontWeight: 700, fontFamily: fonts.family,
          color: colors.almostBlack, margin: '0 0 8px',
        }}>
          {report.title}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginBottom: 12 }}>
          {report.machine && (
            <span style={{ fontSize: 12, color: colors.coolText, fontFamily: fonts.family }}>
              Machine: <strong style={{ color: colors.almostBlack }}>{report.machine}</strong>
            </span>
          )}
          {report.location && (
            <span style={{ fontSize: 12, color: colors.coolText, fontFamily: fonts.family }}>
              Location: <strong style={{ color: colors.almostBlack }}>{report.location}</strong>
            </span>
          )}
          <span style={{ fontSize: 12, color: colors.coolText, fontFamily: fonts.family }}>
            {report.date} &bull; {report.time}
          </span>
        </div>

        {/* Source video thumbnail */}
        <div style={{
          position: 'relative', borderRadius: 10, overflow: 'hidden',
          marginBottom: 14, background: '#000', aspectRatio: '16/9',
        }}>
          <video
            src={report.sourceVideoUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            playsInline muted
          />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </div>
          </div>
        </div>

        {/* Summary */}
        <p style={{
          fontSize: 13, color: colors.coolText, fontFamily: fonts.family,
          lineHeight: 1.5, margin: '0 0 16px',
        }}>
          {report.summary}
        </p>

        {/* Non-hourly OCR fields */}
        {nonHourlyFields.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: fonts.family, color: colors.almostBlack, margin: '0 0 8px' }}>
              {isHourlyReport ? 'Machine Parameters' : 'Readings'}
            </h2>
            <div style={{ border: `1px solid ${colors.neutralGray}`, borderRadius: 8, overflow: 'hidden' }}>
              {nonHourlyFields.map((f, idx) => (
                <div key={f.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: idx % 2 === 0 ? '#fff' : colors.coolLight,
                  borderBottom: idx < nonHourlyFields.length - 1 ? `1px solid ${colors.neutralGray}` : 'none',
                }}>
                  <span style={{ fontSize: 12, color: colors.coolText, fontFamily: fonts.family }}>{f.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, fontFamily: fonts.family, color: colors.almostBlack }}>
                      {f.editedValue ?? f.value}
                    </span>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: confidenceColor(f.confidence) }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hourly production table */}
        {hourlyRows.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: fonts.family, color: colors.almostBlack, margin: '0 0 8px' }}>
              Production Tracking
            </h2>
            <div style={{ border: `1px solid ${colors.neutralGray}`, borderRadius: 8, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `36px ${columns.map(() => '1fr').join(' ')}`,
                background: colors.coolLight,
                borderBottom: `1px solid ${colors.neutralGray}`,
              }}>
                <div style={{ padding: '6px 4px', fontSize: 10, fontWeight: 700, fontFamily: fonts.family, color: colors.almostBlack, textAlign: 'center' }}>HR</div>
                {columns.map(col => (
                  <div key={col} style={{
                    padding: '6px 4px', fontSize: 9, fontWeight: 600,
                    fontFamily: fonts.family, color: colors.coolText, textAlign: 'center',
                    borderLeft: `1px solid ${colors.neutralGray}`,
                  }}>
                    {col.split(' ').map((w, i) => <div key={i}>{w}</div>)}
                  </div>
                ))}
              </div>
              {/* Rows */}
              {hourlyRows.map((row, idx) => (
                <div key={idx} style={{
                  display: 'grid',
                  gridTemplateColumns: `36px ${columns.map(() => '1fr').join(' ')}`,
                  borderBottom: idx < hourlyRows.length - 1 ? `1px solid ${colors.neutralGray}` : 'none',
                }}>
                  <div style={{ padding: '6px 4px', fontSize: 12, fontWeight: 700, fontFamily: fonts.family, textAlign: 'center', color: colors.almostBlack }}>
                    {row.hr}
                  </div>
                  {columns.map(col => (
                    <div key={col} style={{
                      padding: '6px 4px', fontSize: 13, fontWeight: 600,
                      fontFamily: fonts.family, textAlign: 'center',
                      color: colors.almostBlack,
                      borderLeft: `1px solid ${colors.neutralGray}`,
                    }}>
                      {row[col] || '—'}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detected Objects */}
        {report.detectedObjects.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: fonts.family, color: colors.almostBlack, margin: '0 0 8px' }}>
              Objects Detected
            </h2>
            {report.detectedObjects.map(obj => (
              <div key={obj.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0',
                borderBottom: `1px solid ${colors.neutralGray}`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: colors.primaryLight15,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: colors.primary, fontFamily: fonts.family,
                  flexShrink: 0,
                }}>
                  {obj.count}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: fonts.family, color: colors.almostBlack }}>
                    {obj.label}
                  </div>
                  {obj.details && (
                    <div style={{ fontSize: 11, color: colors.coolText, fontFamily: fonts.family, marginTop: 1 }}>
                      {obj.details}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback widget */}
      <div style={{
        padding: '16px',
        borderTop: `1px solid ${colors.neutralGray}`,
        background: colors.coolLight,
      }}>
        {feedbackState === 'none' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 600, fontFamily: fonts.family, color: colors.almostBlack, marginBottom: 12 }}>
              Was this report helpful?
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={handleHelpful}
                style={{
                  padding: '10px 28px', borderRadius: 10,
                  background: colors.success, color: '#fff',
                  border: 'none', cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, fontFamily: fonts.family,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                  <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                </svg>
                Helpful
              </button>
              <button
                onClick={handleNotHelpful}
                style={{
                  padding: '10px 28px', borderRadius: 10,
                  background: '#fff', color: colors.coolText,
                  border: `1.5px solid ${colors.neutralGray}`, cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, fontFamily: fonts.family,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.coolText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 15V19a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" />
                  <path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
                </svg>
                Not Helpful
              </button>
            </div>
          </div>
        )}

        {feedbackState === 'not_helpful_form' && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, fontFamily: fonts.family, color: colors.almostBlack, marginBottom: 8 }}>
              What else do you need?
            </div>
            <textarea
              autoFocus
              value={feedbackMessage}
              onChange={e => setFeedbackMessage(e.target.value)}
              placeholder="Tell us what would make this more useful..."
              style={{
                width: '100%', minHeight: 72, padding: 10, borderRadius: 8,
                border: `1.5px solid ${colors.neutralGray}`, fontFamily: fonts.family,
                fontSize: 13, resize: 'vertical', outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = colors.primary}
              onBlur={e => e.target.style.borderColor = colors.neutralGray}
            />
            <button
              onClick={handleSubmitFeedback}
              style={{
                marginTop: 8, padding: '10px 24px', borderRadius: 10,
                background: colors.primary, color: '#fff',
                border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600, fontFamily: fonts.family,
                width: '100%',
              }}
            >
              Submit Feedback
            </button>
          </div>
        )}

        {feedbackState === 'submitted' && (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, fontFamily: fonts.family, color: colors.almostBlack }}>
              Thank you for your feedback!
            </div>
            <div style={{ fontSize: 12, color: colors.coolText, fontFamily: fonts.family, marginTop: 4 }}>
              The technician will be notified.
            </div>
          </div>
        )}

        {/* Airwave branding footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          marginTop: 20, paddingTop: 12,
          borderTop: `1px solid ${colors.neutralGray}`,
        }}>
          <div style={{
            width: 18, height: 18, borderRadius: 4,
            background: colors.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
            </svg>
          </div>
          <span style={{ fontSize: 11, color: colors.coolText, fontFamily: fonts.family }}>
            Powered by Airwave
          </span>
        </div>
      </div>

      {/* Bottom padding */}
      <div style={{ height: 20 }} />
    </div>
  )
}
