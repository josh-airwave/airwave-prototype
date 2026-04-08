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

function EditableCell({ field, onEdit, editable = true }: { field: OcrField; onEdit: (id: string, value: string) => void; editable?: boolean }) {
  const [editing, setEditing] = useState(false)
  const [tempValue, setTempValue] = useState(field.editedValue ?? field.value)
  const displayValue = field.editedValue ?? field.value

  if (editing && editable) {
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
      onClick={() => editable && setEditing(true)}
      style={{
        cursor: editable ? 'pointer' : 'default', position: 'relative',
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

// Generic inline-editable text for any report field
function InlineEdit({ value, onChange, style, inputStyle, multiline, dark, editable = true }: {
  value: string
  onChange: (v: string) => void
  style?: React.CSSProperties
  inputStyle?: React.CSSProperties
  multiline?: boolean
  dark?: boolean
  editable?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [temp, setTemp] = useState(value)
  const [edited, setEdited] = useState(false)

  if (!editable) {
    return <span style={style}>{value}</span>
  }

  if (editing) {
    const shared: React.CSSProperties = {
      width: '100%', border: `1.5px solid ${dark ? 'rgba(255,255,255,0.4)' : colors.primary}`,
      borderRadius: 6, padding: '6px 8px', outline: 'none',
      background: dark ? 'rgba(255,255,255,0.12)' : '#EEF4FF',
      color: dark ? colors.white : undefined,
      fontFamily: fonts.family,
      ...style, ...inputStyle,
    }
    if (multiline) {
      return (
        <textarea
          autoFocus
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          onBlur={() => {
            setEditing(false)
            if (temp !== value) { onChange(temp); setEdited(true) }
          }}
          rows={3}
          style={{ ...shared, resize: 'vertical' }}
        />
      )
    }
    return (
      <input
        autoFocus
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        onBlur={() => {
          setEditing(false)
          if (temp !== value) { onChange(temp); setEdited(true) }
        }}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
        style={shared}
      />
    )
  }

  return (
    <span
      onClick={() => { setTemp(value); setEditing(true) }}
      style={{
        cursor: 'pointer', borderBottom: '1px dashed rgba(128,128,128,0.3)',
        ...style,
        ...(edited ? { background: 'rgba(73,174,123,0.1)', borderRadius: 3, padding: '0 2px' } : {}),
      }}
    >
      {value}
    </span>
  )
}

function isStaticImage(url: string) {
  return /\.(png|jpg|jpeg|gif|webp)$/i.test(url)
}

export function ReportViewScreen({ params }: { params?: Record<string, unknown> }) {
  const { push } = useNavigation()
  const reportId = (params?.reportId as string) || 'vr1'
  const report = videoIntelReports.find(r => r.id === reportId) || videoIntelReports[0]
  const isHourlyReport = report.ocrFields.some(f => f.label.match(/^HR \d+/))

  const [fields, setFields] = useState(report.ocrFields)
  const [objects, setObjects] = useState(report.detectedObjects)
  const [status, setStatus] = useState(report.status)
  const [title, setTitle] = useState(report.title)
  const [machine, setMachine] = useState(report.machine || '')
  const [location, setLocation] = useState(report.location || '')
  const [technician, setTechnician] = useState(report.technician)
  const [date, setDate] = useState(report.date)
  const [time, setTime] = useState(report.time)
  const [summary, setSummary] = useState(report.summary)
  const [editMode, setEditMode] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showAddContext, setShowAddContext] = useState(false)
  const [addingContext, setAddingContext] = useState(false)

  const handleEdit = (id: string, newValue: string) => {
    setFields(prev => prev.map(f =>
      f.id === id ? { ...f, edited: true, editedValue: newValue } : f
    ))
  }

  const handleSubmit = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setStatus('submitted')
      setSubmitted(true)
    }, 1500)
  }

  const hourlyTable = isHourlyReport ? parseHourlyTable(fields) : null
  const machineFields = isHourlyReport ? fields.filter(f => !f.label.match(/^HR \d+/)) : []
  // Detect which columns exist in the data
  const hasActuals = isHourlyReport && fields.some(f => f.label.match(/— Hourly Actual$/))
  const baseColumns = hasActuals
    ? ['Hourly Goal', 'Cumulative Goal', 'Hourly Actual', 'Cumulative Actual', 'Variance']
    : ['Hourly Goal', 'Cumulative Goal']
  const columns = baseColumns

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: colors.white }}>
      <Header title="Report" showBack rightAction={
        !submitted ? (
          <button
            onClick={() => setEditMode(!editMode)}
            style={{
              padding: '5px 12px', borderRadius: 8,
              background: editMode ? colors.primary : 'transparent',
              color: editMode ? colors.white : colors.primary,
              fontSize: 13, fontWeight: 600, fontFamily: fonts.family,
              border: editMode ? 'none' : `1.5px solid ${colors.primary}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            {editMode ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                Done
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </>
            )}
          </button>
        ) : null
      } />
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
              background: status === 'submitted' ? 'rgba(73,174,123,0.3)' : 'rgba(255,255,255,0.15)',
              borderRadius: 4,
              padding: '3px 8px', fontSize: 11,
              color: status === 'submitted' ? '#A8F0C6' : 'rgba(255,255,255,0.7)',
              fontFamily: fonts.family, fontWeight: 500, textTransform: 'uppercase',
            }}>
              {status}
            </div>
          </div>
          <h1 style={{
            color: colors.white, fontSize: 18, fontWeight: 700,
            fontFamily: fonts.family, lineHeight: 1.3, margin: 0,
          }}>
            <InlineEdit value={title} onChange={setTitle} dark editable={editMode}
              style={{ color: colors.white, fontSize: 18, fontWeight: 700, fontFamily: fonts.family }} />
          </h1>
          <div style={{
            marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.6)',
            fontFamily: fonts.family, lineHeight: 1.6,
          }}>
            {report.machine && <div>Machine: <InlineEdit value={machine} onChange={setMachine} dark editable={editMode} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }} /></div>}
            {report.location && <div>Location: <InlineEdit value={location} onChange={setLocation} dark editable={editMode} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }} /></div>}
            <div>Technician: <InlineEdit value={technician} onChange={setTechnician} dark editable={editMode} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }} /></div>
            <div><InlineEdit value={date} onChange={setDate} dark editable={editMode} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }} /> &bull; <InlineEdit value={time} onChange={setTime} dark editable={editMode} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }} /></div>
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
          <InlineEdit
            value={summary}
            onChange={setSummary}
            multiline
            editable={editMode}
            style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6, fontFamily: fonts.family, display: 'block' }}
          />
        </div>

        {/* Machine Parameters (for vr1 — controller screen OCR) */}
        {isHourlyReport && machineFields.length > 0 && (
          <div style={{ padding: '0 16px 12px' }}>
            <h2 style={{
              fontSize: 15, fontWeight: 700, fontFamily: fonts.family,
              color: colors.almostBlack, margin: '0 0 8px',
            }}>
              Machine Parameters
            </h2>
            <div style={{
              border: `1px solid ${colors.neutralGray}`, borderRadius: 8,
              overflow: 'hidden',
            }}>
              {machineFields.map((f, idx) => (
                <div key={f.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px',
                  borderBottom: idx < machineFields.length - 1 ? `1px solid ${colors.neutralGray}` : 'none',
                  background: idx % 2 === 0 ? colors.white : colors.coolLight,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: colors.coolText, fontFamily: fonts.family, marginBottom: 2 }}>
                      {f.label}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <EditableCell field={f} onEdit={handleEdit} editable={editMode} />
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: confidenceColor(f.confidence), flexShrink: 0 }} />
                    </div>
                  </div>
                  <SourceFrameBadge
                    field={f}
                    onTap={() => {
                      const srcParams = isStaticImage(f.frameUrl)
                        ? { imageUrl: f.frameUrl }
                        : { videoUrl: report.sourceVideoUrl, sourceTime: f.frameTimestamp }
                      push('ImageZoom', { ...srcParams, sourceLabel: f.label, sourceValue: f.editedValue ?? f.value, sourceConfidence: f.confidence, sourceBbox: f.bbox, sourceFieldId: f.id })
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
                display: 'grid', gridTemplateColumns: `36px ${columns.map(() => '1fr').join(' ')}`,
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
                    display: 'grid', gridTemplateColumns: `36px ${columns.map(() => '1fr').join(' ')}`,
                    borderBottom: isLast ? 'none' : `1px solid ${colors.neutralGray}`,
                    alignItems: 'center',
                  }}>
                    <div style={{
                      padding: '8px 4px', fontSize: 13, fontWeight: 700,
                      fontFamily: fonts.family, color: colors.almostBlack,
                      textAlign: 'center',
                    }}>{hr}</div>
                    {columns.map(col => {
                      // Variance is computed: Actual - Goal
                      if (col === 'Variance') {
                        const goal = row['Hourly Goal']
                        const actual = row['Hourly Actual']
                        if (!goal || !actual) return <div key={col} style={{ borderLeft: `1px solid ${colors.neutralGray}`, padding: 8, textAlign: 'center', fontSize: 14, color: colors.coolText }}>—</div>
                        const diff = parseInt(actual.editedValue ?? actual.value) - parseInt(goal.editedValue ?? goal.value)
                        const varColor = diff >= 0 ? colors.success : colors.danger
                        return (
                          <div key={col} style={{ borderLeft: `1px solid ${colors.neutralGray}`, padding: '8px 3px', textAlign: 'center', fontSize: 14, fontWeight: 700, fontFamily: fonts.family, color: varColor }}>
                            {diff >= 0 ? `+${diff}` : diff}
                          </div>
                        )
                      }
                      const field = row[col]
                      if (!field) return <div key={col} style={{ borderLeft: `1px solid ${colors.neutralGray}`, padding: 8, textAlign: 'center', fontSize: 14, color: colors.coolText }}>—</div>
                      return (
                        <div key={col} style={{
                          borderLeft: `1px solid ${colors.neutralGray}`,
                          padding: '4px 3px',
                        }}>
                          <EditableCell field={field} onEdit={handleEdit} editable={editMode} />
                          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            <SourceFrameBadge
                              field={field}
                              onTap={() => {
                                const srcParams = isStaticImage(field.frameUrl)
                                  ? { imageUrl: field.frameUrl }
                                  : { videoUrl: report.sourceVideoUrl, sourceTime: field.frameTimestamp }
                                push('ImageZoom', { ...srcParams, sourceLabel: field.label, sourceValue: field.editedValue ?? field.value, sourceConfidence: field.confidence, sourceBbox: field.bbox, sourceFieldId: field.id })
                              }}
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
                    <InlineEdit
                      value={f.editedValue ?? f.value}
                      onChange={(v) => handleEdit(f.id, v)}
                      editable={editMode}
                      style={{ fontSize: 16, fontWeight: 700, fontFamily: fonts.family, color: colors.almostBlack }}
                    />
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: confidenceColor(f.confidence), flexShrink: 0 }} />
                  </div>
                </div>
                <SourceFrameBadge
                  field={f}
                  onTap={() => {
                    const srcParams = isStaticImage(f.frameUrl)
                      ? { imageUrl: f.frameUrl }
                      : { videoUrl: report.sourceVideoUrl, sourceTime: f.frameTimestamp }
                    push('ImageZoom', { ...srcParams, sourceLabel: f.label, sourceValue: f.editedValue ?? f.value, sourceConfidence: f.confidence, sourceBbox: f.bbox, sourceFieldId: f.id })
                  }}
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
                  <InlineEdit
                    value={String(obj.count)}
                    onChange={(v) => {
                      const n = parseInt(v)
                      if (n != null && !isNaN(n)) setObjects(prev => prev.map(o => o.id === obj.id ? { ...o, count: n } : o))
                    }}
                    editable={editMode}
                    style={{ fontSize: 18, fontWeight: 700, color: colors.primary, fontFamily: fonts.family, textAlign: 'center' }}
                    inputStyle={{ width: 36, textAlign: 'center' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <InlineEdit
                    value={obj.label}
                    onChange={(v) => setObjects(prev => prev.map(o => o.id === obj.id ? { ...o, label: v } : o))}
                    editable={editMode}
                    style={{ fontSize: 14, fontWeight: 600, fontFamily: fonts.family, color: colors.almostBlack }}
                  />
                  {obj.details && (
                    <InlineEdit
                      value={obj.details}
                      onChange={(v) => setObjects(prev => prev.map(o => o.id === obj.id ? { ...o, details: v } : o))}
                      editable={editMode}
                      style={{ fontSize: 11, color: colors.coolText, fontFamily: fonts.family, marginTop: 1, display: 'block' }}
                    />
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: confidenceColor(obj.confidence) }} />
                  <SourceFrameBadge
                    field={obj}
                    onTap={() => {
                      const srcParams = isStaticImage(obj.frameUrl)
                        ? { imageUrl: obj.frameUrl }
                        : { videoUrl: report.sourceVideoUrl, sourceTime: obj.frameTimestamp }
                      push('ImageZoom', { ...srcParams, sourceLabel: obj.label, sourceValue: String(obj.count), sourceConfidence: obj.confidence, sourceBbox: obj.bbox })
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom padding */}
        <div style={{ height: 80 }} />

        {/* Submitted success banner — shows inline at bottom of scroll */}
        {submitted && (
          <div style={{
            margin: '0 16px 20px', padding: '16px',
            background: '#F0FAF4', border: `1px solid ${colors.success}`,
            borderRadius: 12, textAlign: 'center',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: colors.success, margin: '0 auto 10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div style={{
              fontSize: 16, fontWeight: 700, fontFamily: fonts.family,
              color: colors.almostBlack, marginBottom: 4,
            }}>
              Report Submitted
            </div>
            <div style={{
              fontSize: 13, color: colors.textSecondary, fontFamily: fonts.family,
              lineHeight: 1.5,
            }}>
              Your report has been submitted for review. You can still view it from the Reports tab.
            </div>
          </div>
        )}
      </div>

      {/* Add Context overlay */}
      {showAddContext && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 30,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            width: '100%', background: colors.white,
            borderRadius: '16px 16px 0 0', padding: '20px 16px 32px',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <h3 style={{
                fontSize: 17, fontWeight: 700, fontFamily: fonts.family,
                color: colors.almostBlack, margin: 0,
              }}>
                Add Context
              </h3>
              <button onClick={() => setShowAddContext(false)} style={{
                width: 28, height: 28, borderRadius: '50%',
                background: colors.coolLight, display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.almostBlack} strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <p style={{
              fontSize: 13, color: colors.textSecondary, fontFamily: fonts.family,
              lineHeight: 1.5, margin: '0 0 16px',
            }}>
              Add a video or photo to this report. Blue will process the new media and update the report with any additional data found.
            </p>

            {addingContext ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  width: 40, height: 40, border: `3px solid ${colors.neutralGray}`,
                  borderTopColor: colors.primary, borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto 12px',
                }} />
                <div style={{
                  fontSize: 14, fontWeight: 600, fontFamily: fonts.family,
                  color: colors.almostBlack, marginBottom: 4,
                }}>
                  Processing video...
                </div>
                <div style={{
                  fontSize: 12, color: colors.textSecondary, fontFamily: fonts.family,
                }}>
                  Blue is extracting data from your video
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => {
                    setAddingContext(true)
                    setTimeout(() => {
                      setAddingContext(false)
                      setShowAddContext(false)
                    }, 2500)
                  }}
                  style={{
                    flex: 1, padding: '14px 0', borderRadius: 12,
                    background: colors.coolLight, border: `1px solid ${colors.neutralGray}`,
                    cursor: 'pointer', textAlign: 'center',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto 6px' }}>
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: fonts.family, color: colors.almostBlack }}>
                    From Gallery
                  </div>
                </button>
                <button
                  onClick={() => {
                    setAddingContext(true)
                    setTimeout(() => {
                      setAddingContext(false)
                      setShowAddContext(false)
                    }, 2500)
                  }}
                  style={{
                    flex: 1, padding: '14px 0', borderRadius: 12,
                    background: colors.coolLight, border: `1px solid ${colors.neutralGray}`,
                    cursor: 'pointer', textAlign: 'center',
                  }}
                >
                  <img src="/icons/ic_glasses_black.png" alt="Glasses" style={{ width: 32, height: 20, objectFit: 'contain', display: 'block', margin: '2px auto 6px' }} />
                  <div style={{ fontSize: 13, fontWeight: 600, fontFamily: fonts.family, color: colors.almostBlack }}>
                    Import from Glasses
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom action bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        padding: '10px 16px 28px',
        borderTop: `1px solid ${colors.border}`,
        background: colors.white,
      }}>
        {submitted ? (
          <button
            onClick={() => { /* TODO: share flow */ }}
            style={{
              background: colors.white, color: colors.primary,
              padding: '12px 32px', borderRadius: 10,
              fontSize: 15, fontWeight: 600, fontFamily: fonts.family,
              display: 'flex', alignItems: 'center', gap: 8,
              border: `2px solid ${colors.primary}`, cursor: 'pointer',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share Report
          </button>
        ) : (
          <>
            <button
              onClick={() => setShowAddContext(true)}
              style={{
                background: colors.white, color: colors.primary,
                padding: '12px 20px', borderRadius: 10,
                fontSize: 14, fontWeight: 600, fontFamily: fonts.family,
                display: 'flex', alignItems: 'center', gap: 6,
                border: `1.5px solid ${colors.primary}`, cursor: 'pointer',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Context
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                background: submitting ? colors.neutralGray : colors.primary,
                color: colors.white,
                padding: '12px 24px', borderRadius: 10,
                fontSize: 15, fontWeight: 600, fontFamily: fonts.family,
                display: 'flex', alignItems: 'center', gap: 8,
                border: 'none', cursor: submitting ? 'default' : 'pointer',
                opacity: submitting ? 0.8 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              {submitting ? (
                <>
                  <div style={{
                    width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Submitting...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Submit
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Spinner animation */}
      {(submitting || addingContext) && (
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      )}
    </div>
  )
}
