import React, { useState } from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { Header } from '../components/Header'
import { videoIntelReports } from '../data/mock'
import type { OcrField, DetectedObject } from '../data/mock'
import { useNavigation } from '../navigation/Router'

// Confidence color: green ≥ 0.9, orange ≥ 0.8, red < 0.8
function confidenceColor(c: number) {
  if (c >= 0.9) return colors.success
  if (c >= 0.8) return colors.warning
  return colors.danger
}

function formatTimestamp(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

// Parse OCR fields into the whiteboard table structure
function parseHourlyTable(fields: OcrField[]) {
  const hours: Record<number, Record<string, OcrField>> = {}
  for (const f of fields) {
    const match = f.label.match(/HR (\d+) — (.+)/)
    if (match) {
      const hr = parseInt(match[1])
      const col = match[2]
      if (!hours[hr]) hours[hr] = {}
      hours[hr][col] = f
    }
  }
  return hours
}

function SourceFrameBadge({ field, onTap }: { field: OcrField | DetectedObject; onTap: () => void }) {
  return (
    <button
      onClick={onTap}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        background: colors.coolLight, border: `1px solid ${colors.neutralGray}`,
        borderRadius: 4, padding: '2px 5px', cursor: 'pointer',
        fontSize: 10, color: colors.coolText, fontFamily: fonts.family,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={colors.coolText} strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {formatTimestamp(field.frameTimestamp)}
    </button>
  )
}

function EditableCell({ field, onEdit }: { field: OcrField; onEdit: (id: string, value: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [tempValue, setTempValue] = useState(field.editedValue ?? field.value)
  const displayValue = field.editedValue ?? field.value

  if (editing) {
    return (
      <input
        autoFocus
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => {
          setEditing(false)
          if (tempValue !== field.value) onEdit(field.id, tempValue)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
        }}
        style={{
          width: '100%', border: `2px solid ${colors.primary}`,
          borderRadius: 4, padding: '4px 6px', fontSize: 14,
          fontFamily: fonts.family, fontWeight: 600,
          textAlign: 'center', outline: 'none',
          background: '#EEF4FF',
        }}
      />
    )
  }

  return (
    <div
      onClick={() => setEditing(true)}
      style={{
        cursor: 'pointer', position: 'relative',
        padding: '4px 6px', borderRadius: 4,
        background: field.edited ? 'rgba(73, 174, 123, 0.08)' : 'transparent',
        border: `1px solid ${field.edited ? colors.success : 'transparent'}`,
        textAlign: 'center', fontWeight: 600, fontSize: 14,
        fontFamily: fonts.family, color: colors.almostBlack,
        minHeight: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {displayValue}
      {field.edited && (
        <span style={{
          position: 'absolute', top: -6, right: -4,
          fontSize: 8, color: colors.success, fontWeight: 600,
          background: colors.white, padding: '0 2px', borderRadius: 2,
        }}>EDITED</span>
      )}
    </div>
  )
}

export function ReportViewScreen({ params }: { params?: Record<string, unknown> }) {
  const { push } = useNavigation()
  const reportId = (params?.reportId as string) || 'vr1'
  const report = videoIntelReports.find(r => r.id === reportId) || videoIntelReports[0]
  const isHourlyReport = report.id === 'vr1'

  const [fields, setFields] = useState(report.ocrFields)
  const [objects] = useState(report.detectedObjects)

  const handleEdit = (id: string, newValue: string) => {
    setFields(prev => prev.map(f =>
      f.id === id ? { ...f, edited: true, editedValue: newValue } : f
    ))
  }

  const hourlyTable = isHourlyReport ? parseHourlyTable(fields) : null
  const columns = ['Hourly Goal', 'Cumulative Goal', 'Hourly Actual', 'Cumulative Actual']

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: colors.white }}>
      <Header title="Report" showBack />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Report header */}
        <div style={{
          background: colors.primaryDark,
          padding: '20px 16px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)', borderRadius: 4,
              padding: '3px 8px', fontSize: 11, color: 'rgba(255,255,255,0.7)',
              fontFamily: fonts.family, fontWeight: 500, textTransform: 'uppercase',
            }}>
              {report.status}
            </div>
          </div>
          <h1 style={{
            color: colors.white, fontSize: 18, fontWeight: 700,
            fontFamily: fonts.family, lineHeight: 1.3, margin: 0,
          }}>
            {report.title}
          </h1>
          <div style={{
            marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.6)',
            fontFamily: fonts.family, lineHeight: 1.6,
          }}>
            {report.machine && <div>Machine: {report.machine}</div>}
            {report.location && <div>Location: {report.location}</div>}
            <div>Technician: {report.technician}</div>
            <div>{report.date} &bull; {report.time}</div>
          </div>
        </div>

        {/* Source video — portrait orientation */}
        <div style={{ padding: '12px 16px 0' }}>
          <div
            onClick={() => push('ImageZoom', { videoUrl: report.sourceVideoUrl })}
            style={{
              position: 'relative', borderRadius: 8, overflow: 'hidden',
              cursor: 'pointer', background: '#000',
            }}
          >
            <video
              src={report.sourceVideoUrl}
              muted playsInline preload="metadata"
              onLoadedData={(e) => { const v = e.currentTarget; if (v.duration > 1) v.currentTime = 1 }}
              style={{ width: '100%', aspectRatio: '9/16', objectFit: 'contain', display: 'block', pointerEvents: 'none', background: '#000' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={colors.almostBlack}>
                  <polygon points="7,3 21,12 7,21" />
                </svg>
              </div>
            </div>
            <div style={{
              position: 'absolute', bottom: 8, left: 8,
              fontSize: 11, color: colors.white, fontFamily: fonts.family,
              fontWeight: 500, background: 'rgba(0,0,0,0.6)',
              padding: '2px 8px', borderRadius: 4,
            }}>
              Source Video
            </div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ padding: '12px 16px' }}>
          <p style={{
            fontSize: 13, color: colors.textSecondary, lineHeight: 1.6,
            fontFamily: fonts.family, margin: 0,
          }}>
            {report.summary}
          </p>
        </div>

        {/* Hourly Production Table (for vr1) */}
        {isHourlyReport && hourlyTable && (
          <div style={{ padding: '0 16px 12px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <h2 style={{
                fontSize: 15, fontWeight: 700, fontFamily: fonts.family,
                color: colors.almostBlack, margin: 0,
              }}>
                Production Tracking
              </h2>
              <span style={{
                fontSize: 10, color: colors.coolText, fontFamily: fonts.family,
              }}>Tap any cell to edit</span>
            </div>

            {/* Table */}
            <div style={{
              border: `1px solid ${colors.neutralGray}`,
              borderRadius: 8, overflow: 'hidden',
            }}>
              {/* Header row */}
              <div style={{
                display: 'grid', gridTemplateColumns: '36px 1fr 1fr 1fr 1fr',
                background: colors.coolLight, borderBottom: `1px solid ${colors.neutralGray}`,
              }}>
                <div style={{ padding: '6px 4px', fontSize: 10, fontWeight: 700, fontFamily: fonts.family, color: colors.almostBlack, textAlign: 'center' }}>HR</div>
                {columns.map(col => (
                  <div key={col} style={{
                    padding: '6px 2px', fontSize: 9, fontWeight: 600,
                    fontFamily: fonts.family, color: colors.coolText,
                    textAlign: 'center', borderLeft: `1px solid ${colors.neutralGray}`,
                    lineHeight: 1.2,
                  }}>
                    {col.split(' ').map((w, i) => <div key={i}>{w}</div>)}
                  </div>
                ))}
              </div>

              {/* Data rows */}
              {Object.keys(hourlyTable).sort((a, b) => Number(a) - Number(b)).map((hr, idx) => {
                const row = hourlyTable[Number(hr)]
                const isLast = idx === Object.keys(hourlyTable).length - 1
                return (
                  <div key={hr} style={{
                    display: 'grid', gridTemplateColumns: '36px 1fr 1fr 1fr 1fr',
                    borderBottom: isLast ? 'none' : `1px solid ${colors.neutralGray}`,
                    alignItems: 'center',
                  }}>
                    <div style={{
                      padding: '8px 4px', fontSize: 13, fontWeight: 700,
                      fontFamily: fonts.family, color: colors.almostBlack,
                      textAlign: 'center',
                    }}>{hr}</div>
                    {columns.map(col => {
                      const field = row[col]
                      if (!field) return <div key={col} style={{ borderLeft: `1px solid ${colors.neutralGray}`, padding: 8 }}>—</div>
                      return (
                        <div key={col} style={{
                          borderLeft: `1px solid ${colors.neutralGray}`,
                          padding: '4px 3px',
                        }}>
                          <EditableCell field={field} onEdit={handleEdit} />
                          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            <SourceFrameBadge
                              field={field}
                              onTap={() => push('ImageZoom', { videoUrl: report.sourceVideoUrl })}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>

            {/* Confidence legend */}
            <div style={{
              display: 'flex', gap: 12, marginTop: 8, justifyContent: 'flex-end',
            }}>
              {[
                { label: 'High', color: colors.success },
                { label: 'Medium', color: colors.warning },
                { label: 'Low', color: colors.danger },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color }} />
                  <span style={{ fontSize: 9, color: colors.coolText, fontFamily: fonts.family }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Non-table OCR Fields (for yard report) */}
        {!isHourlyReport && fields.length > 0 && (
          <div style={{ padding: '0 16px 12px' }}>
            <h2 style={{
              fontSize: 15, fontWeight: 700, fontFamily: fonts.family,
              color: colors.almostBlack, margin: '0 0 8px',
            }}>
              Text Detected (OCR)
            </h2>
            {fields.map(f => (
              <div key={f.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 0',
                borderBottom: `1px solid ${colors.neutralGray}`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: colors.coolText, fontFamily: fonts.family, marginBottom: 2 }}>
                    {f.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: 16, fontWeight: 700, fontFamily: fonts.family,
                      color: colors.almostBlack,
                    }}>
                      {f.editedValue ?? f.value}
                    </span>
                    {f.edited && (
                      <span style={{
                        fontSize: 9, color: colors.success, fontWeight: 600,
                        background: colors.successLight, padding: '1px 4px', borderRadius: 3,
                      }}>EDITED</span>
                    )}
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: confidenceColor(f.confidence) }} />
                  </div>
                </div>
                <SourceFrameBadge
                  field={f}
                  onTap={() => push('ImageZoom', { videoUrl: report.sourceVideoUrl })}
                />
              </div>
            ))}
          </div>
        )}

        {/* Detected Objects */}
        {objects.length > 0 && (
          <div style={{ padding: '0 16px 12px' }}>
            <h2 style={{
              fontSize: 15, fontWeight: 700, fontFamily: fonts.family,
              color: colors.almostBlack, margin: '0 0 8px',
            }}>
              Objects Detected
            </h2>
            {objects.map(obj => (
              <div key={obj.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 0',
                borderBottom: `1px solid ${colors.neutralGray}`,
              }}>
                {/* Count badge */}
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: colors.primaryLight15,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontSize: 18, fontWeight: 700, color: colors.primary,
                    fontFamily: fonts.family,
                  }}>{obj.count}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 600, fontFamily: fonts.family,
                    color: colors.almostBlack,
                  }}>
                    {obj.label}
                  </div>
                  {obj.details && (
                    <div style={{ fontSize: 11, color: colors.coolText, fontFamily: fonts.family, marginTop: 1 }}>
                      {obj.details}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: confidenceColor(obj.confidence) }} />
                  <SourceFrameBadge
                    field={obj}
                    onTap={() => push('ImageZoom', { videoUrl: report.sourceVideoUrl })}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom padding */}
        <div style={{ height: 80 }} />
      </div>

      {/* Bottom action bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '10px 16px 28px',
        borderTop: `1px solid ${colors.border}`,
        background: colors.white,
      }}>
        <button style={{
          background: colors.primary, color: colors.white,
          padding: '12px 32px', borderRadius: radius.full,
          fontSize: 15, fontWeight: 600, fontFamily: fonts.family,
          display: 'flex', alignItems: 'center', gap: 8,
          border: 'none', cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Submit Report
        </button>
      </div>
    </div>
  )
}
