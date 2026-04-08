import React, { useState, useEffect } from 'react'
import { useNavigation } from '../navigation/Router'
import { videoIntelReports } from '../data/mock'

// Colors matching production report style
const rc = {
  navy: '#1a4fa0',
  darkHeader: '#0B1C2E',
  pageBg: '#f7fafd',
  cardBg: '#fff',
  tableBg: '#fafdff',
  headerBg: '#e9f2fb',
  borderLight: '#e3eaf2',
  borderHeader: '#d2e3f7',
  text: '#222',
  textMed: '#444',
  green: '#1e7d3c',
  greenBg: '#eafbe7',
  gold: '#b48a00',
  goldBg: '#fffbe6',
  red: '#c12a2a',
  redBg: '#fdeaea',
  accentBorder: '#1a4fa0',
  summaryBg: '#e9f2fb',
}

const font = "'Segoe UI', Arial, sans-serif"

// Mock inspection data per report
interface InspectionItem {
  item: string
  status: 'Complete' | 'Partial' | 'Incomplete' | 'N/A'
  comments: string
  source: string
}

interface InspectionSection {
  title: string
  summary: string
  items: InspectionItem[]
}

function getInspectionData(reportId: string): { sections: InspectionSection[], reportSummary: string, statusCounts: { complete: number, partial: number, incomplete: number } } {
  // Yard Equipment Inventory inspection
  if (reportId === 'vr3') {
    const sections: InspectionSection[] = [
      {
        title: 'Equipment Identification',
        summary: 'Visual identification of all equipment in the yard area, including make/model, serial numbers, and rental company markings.',
        items: [
          { item: 'Record equipment make and model on video', status: 'Complete', comments: 'JLG 1932R scissor lift identified', source: '0:02' },
          { item: 'Capture serial number / asset tag', status: 'Complete', comments: 'Serial visible on unit plate', source: '0:08' },
          { item: 'Identify rental company branding', status: 'Complete', comments: 'United Rentals — 800-UR-RENTS', source: '0:02' },
          { item: 'Count all units in bay area', status: 'Complete', comments: '11 units total across Bay 1-2', source: '0:12' },
        ],
      },
      {
        title: 'Physical Condition',
        summary: 'Visual inspection of equipment exterior condition, structural integrity, and any visible damage or wear.',
        items: [
          { item: 'Inspect frame and chassis for damage', status: 'Complete', comments: 'No structural damage observed', source: '0:05' },
          { item: 'Check tires / wheels condition', status: 'Complete', comments: 'Non-marking rubber tires, good condition', source: '0:24' },
          { item: 'Inspect hydraulic system for leaks', status: 'Partial', comments: 'Hoses visible, minor seepage noted on boom lift #2', source: '0:15' },
          { item: 'Check battery compartment', status: 'Complete', comments: 'Lead-acid cells intact, terminals clean', source: '0:05' },
          { item: 'Document paint / cosmetic condition', status: 'Complete', comments: 'Standard wear, no major cosmetic issues', source: '0:10' },
        ],
      },
      {
        title: 'Safety Equipment',
        summary: 'Verification that all required safety labels, guards, and emergency equipment are present and legible.',
        items: [
          { item: 'Warning labels present and legible', status: 'Complete', comments: 'All ANSI labels visible on scissor lift', source: '0:24' },
          { item: 'Emergency stop button accessible', status: 'Incomplete', comments: 'Not verified on video — unit was powered off', source: '—' },
          { item: 'Guard rails / safety gates intact', status: 'Complete', comments: 'Platform rails in place', source: '0:02' },
          { item: 'Fire extinguisher present (forklifts)', status: 'Incomplete', comments: 'Forklift was parked, not inspected closely', source: '—' },
        ],
      },
      {
        title: 'Yard Organization',
        summary: 'Assessment of equipment placement, spacing, and overall yard organization for safe access and operations.',
        items: [
          { item: 'Equipment properly parked in designated bays', status: 'Complete', comments: 'All units in Bay 1-2 area', source: '0:12' },
          { item: 'Adequate spacing between units', status: 'Partial', comments: 'Scissor lift cluster slightly tight, boom lifts OK', source: '0:12' },
          { item: 'Clear access paths maintained', status: 'Complete', comments: 'Main aisle clear for forklift traffic', source: '0:05' },
          { item: 'Charging stations accessible', status: 'Incomplete', comments: 'Not captured on video', source: '—' },
        ],
      },
      {
        title: 'Documentation',
        summary: 'Final documentation steps including inventory count confirmation and report generation.',
        items: [
          { item: 'Record total equipment count by type', status: 'Complete', comments: '1 scissor (inspect), 5 red scissor, 3 boom, 1 forklift', source: '0:12' },
          { item: 'Note any units requiring maintenance', status: 'Partial', comments: 'Boom lift #2 flagged for hydraulic check', source: '0:15' },
          { item: 'Generate inspection report', status: 'Complete', comments: 'Auto-generated by Airwave Blue', source: '—' },
        ],
      },
    ]

    let complete = 0, partial = 0, incomplete = 0
    for (const s of sections) {
      for (const i of s.items) {
        if (i.status === 'Complete') complete++
        else if (i.status === 'Partial') partial++
        else if (i.status === 'Incomplete') incomplete++
      }
    }

    return {
      sections,
      reportSummary: 'Yard equipment inventory inspection covering Bay 1-2 at Jackson Yard. 11 rental units cataloged including scissor lifts, boom lifts, and one forklift. One hydraulic seepage noted on boom lift #2 for follow-up. Safety labels confirmed on inspected units; emergency stops and charging stations not verified on video.',
      statusCounts: { complete, partial, incomplete },
    }
  }

  // Default / generic fallback
  return {
    sections: [],
    reportSummary: 'Inspection report generated by Airwave Blue.',
    statusCounts: { complete: 0, partial: 0, incomplete: 0 },
  }
}

function StatusBadge({ label, count, color, bg }: { label: string, count: number, color: string, bg: string }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 6px', borderRadius: 4,
      fontSize: 11, fontWeight: 600, fontFamily: font,
      color, background: bg, marginRight: 4,
    }}>
      {label}: {count}
    </span>
  )
}

export function ExternalReportScreen({ params }: { params?: Record<string, unknown> }) {
  const { reset } = useNavigation()
  const reportId = (params?.reportId as string) || 'vr3'
  const report = videoIntelReports.find(r => r.id === reportId) || videoIntelReports[0]
  const { sections, reportSummary, statusCounts } = getInspectionData(reportId)

  // Loading state
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setTimeout(() => setLoaded(true), 600) }, [])

  // Feedback state
  const [feedbackState, setFeedbackState] = useState<'none' | 'not_helpful_form' | 'submitted'>('none')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const notifyTech = params?.onNotifyTech as ((type: string, message?: string) => void) | undefined

  if (!loaded) {
    return (
      <div style={{
        height: '100%', background: rc.pageBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, border: `3px solid ${rc.borderLight}`,
          borderTopColor: rc.navy, borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <span style={{ fontSize: 13, color: rc.textMed, fontFamily: font }}>Loading report...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', background: rc.pageBg }}>
      {/* Dark navy header */}
      <div style={{
        background: rc.darkHeader, padding: '14px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: font,
          textAlign: 'center',
        }}>
          {report.title}
        </span>
      </div>

      {/* White card container */}
      <div style={{ margin: '12px 10px', background: rc.cardBg, borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        {/* Metadata row */}
        <div style={{
          textAlign: 'center', padding: '12px 16px',
          fontSize: 12, color: rc.textMed, fontFamily: font,
          lineHeight: 1.6,
        }}>
          <div><strong style={{ color: rc.text }}>Report Type:</strong> inspection_report</div>
          <div><strong style={{ color: rc.text }}>Technician:</strong> {report.technician}</div>
          <div><strong style={{ color: rc.text }}>Date/Time:</strong> {report.date} &bull; {report.time}</div>
          {report.location && <div><strong style={{ color: rc.text }}>Location:</strong> {report.location}</div>}
        </div>

        {/* Inspection Summary + Source Video */}
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: rc.text, fontFamily: font, margin: '0 0 6px' }}>
              Inspection Summary
            </h2>
            <p style={{ fontSize: 12, color: rc.textMed, fontFamily: font, lineHeight: 1.5, margin: 0 }}>
              {reportSummary}
            </p>
          </div>

          {/* Source Video */}
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: rc.text, fontFamily: font, margin: '0 0 6px', textAlign: 'center' }}>
              Source Video
            </h2>
            <div style={{
              position: 'relative', borderRadius: 6, overflow: 'hidden',
              border: `3px solid ${rc.darkHeader}`,
              aspectRatio: '16/9',
            }}>
              <video
                src={report.sourceVideoUrl}
                poster={report.sourceVideoThumbnail}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                playsInline muted
              />
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <polygon points="6,3 20,12 6,21" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary box with status badges */}
        <div style={{
          margin: '0 16px 16px',
          background: rc.summaryBg,
          borderLeft: `5px solid ${rc.accentBorder}`,
          padding: '12px 14px',
          borderRadius: '0 6px 6px 0',
        }}>
          <div style={{ fontSize: 12, color: rc.navy, fontFamily: font, lineHeight: 1.6 }}>
            <div><strong>Inspection Status:</strong></div>
            <div style={{ marginTop: 4 }}>
              <StatusBadge label="Complete" count={statusCounts.complete} color={rc.green} bg={rc.greenBg} />
              <StatusBadge label="Partial" count={statusCounts.partial} color={rc.gold} bg={rc.goldBg} />
              <StatusBadge label="Incomplete" count={statusCounts.incomplete} color={rc.red} bg={rc.redBg} />
            </div>
          </div>
        </div>

        {/* Inspection sections */}
        {sections.map((section, sIdx) => (
          <div key={sIdx} style={{ padding: '0 16px 16px' }}>
            {/* Section heading */}
            <h2 style={{
              fontSize: 15, fontWeight: 600, color: rc.navy, fontFamily: font,
              margin: '8px 0 4px', letterSpacing: '0.01em',
              borderBottom: `2px solid ${rc.navy}`, paddingBottom: 4,
            }}>
              {section.title}
            </h2>
            <p style={{
              fontSize: 12, color: rc.textMed, fontFamily: font,
              lineHeight: 1.5, margin: '0 0 8px',
            }}>
              {section.summary}
            </p>

            {/* Inspection table */}
            <div style={{
              border: `1px solid ${rc.borderLight}`,
              borderRadius: 6, overflow: 'hidden',
              background: rc.tableBg,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 72px 1fr 40px',
                background: rc.headerBg,
                borderBottom: `2px solid ${rc.borderHeader}`,
              }}>
                {['Item', 'Status', 'Comments', 'Src'].map(col => (
                  <div key={col} style={{
                    padding: '6px 8px', fontSize: 10, fontWeight: 600,
                    color: rc.navy, fontFamily: font,
                    textAlign: col === 'Src' ? 'center' : 'left',
                  }}>
                    {col}
                  </div>
                ))}
              </div>

              {/* Table rows */}
              {section.items.map((item, iIdx) => (
                <div key={iIdx} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 72px 1fr 40px',
                  borderBottom: iIdx < section.items.length - 1 ? `1px solid ${rc.borderLight}` : 'none',
                }}>
                  <div style={{ padding: '7px 8px', fontSize: 11, color: rc.text, fontFamily: font, lineHeight: 1.3 }}>
                    {item.item}
                  </div>
                  <div style={{ padding: '7px 4px', fontSize: 10, fontFamily: font, display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{
                      display: 'inline-block', padding: '1px 5px', borderRadius: 3,
                      fontSize: 9, fontWeight: 600,
                      color: item.status === 'Complete' ? rc.green : item.status === 'Partial' ? rc.gold : item.status === 'Incomplete' ? rc.red : rc.textMed,
                      background: item.status === 'Complete' ? rc.greenBg : item.status === 'Partial' ? rc.goldBg : item.status === 'Incomplete' ? rc.redBg : '#f0f0f0',
                    }}>
                      {item.status}
                    </span>
                  </div>
                  <div style={{ padding: '7px 8px', fontSize: 10, color: rc.textMed, fontFamily: font, lineHeight: 1.3 }}>
                    {item.comments}
                  </div>
                  <div style={{ padding: '7px 4px', fontSize: 10, color: rc.navy, fontFamily: font, textAlign: 'center', fontWeight: 600 }}>
                    {item.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Feedback widget */}
        <div style={{
          padding: '16px',
          borderTop: `1px solid ${rc.borderLight}`,
          background: rc.headerBg,
        }}>
          {feedbackState === 'none' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: font, color: rc.text, marginBottom: 10 }}>
                Was this report helpful?
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button
                  onClick={() => { setFeedbackState('submitted'); notifyTech?.('helpful') }}
                  style={{
                    padding: '8px 24px', borderRadius: 8,
                    background: rc.green, color: '#fff',
                    border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, fontFamily: font,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                    <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                  </svg>
                  Helpful
                </button>
                <button
                  onClick={() => setFeedbackState('not_helpful_form')}
                  style={{
                    padding: '8px 24px', borderRadius: 8,
                    background: '#fff', color: rc.textMed,
                    border: `1.5px solid ${rc.borderLight}`, cursor: 'pointer',
                    fontSize: 13, fontWeight: 600, fontFamily: font,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={rc.textMed} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: font, color: rc.text, marginBottom: 6 }}>
                What else do you need?
              </div>
              <textarea
                autoFocus
                value={feedbackMessage}
                onChange={e => setFeedbackMessage(e.target.value)}
                placeholder="Tell us what would make this more useful..."
                style={{
                  width: '100%', minHeight: 64, padding: 8, borderRadius: 6,
                  border: `1.5px solid ${rc.borderLight}`, fontFamily: font,
                  fontSize: 12, resize: 'vertical', outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = rc.navy}
                onBlur={e => e.target.style.borderColor = rc.borderLight}
              />
              <button
                onClick={() => { setFeedbackState('submitted'); notifyTech?.('not_helpful', feedbackMessage) }}
                style={{
                  marginTop: 6, padding: '8px 20px', borderRadius: 8,
                  background: rc.navy, color: '#fff',
                  border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, fontFamily: font,
                  width: '100%',
                }}
              >
                Submit Feedback
              </button>
            </div>
          )}

          {feedbackState === 'submitted' && (
            <div style={{ textAlign: 'center', padding: '6px 0' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={rc.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: font, color: rc.text, marginTop: 4 }}>
                Thank you for your feedback!
              </div>
              <div style={{ fontSize: 11, color: rc.textMed, fontFamily: font, marginTop: 2 }}>
                The technician will be notified.
              </div>
            </div>
          )}
        </div>

        {/* Powered by Airwave footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '12px 16px',
          borderTop: `1px solid ${rc.borderLight}`,
        }}>
          <div style={{
            width: 16, height: 16, borderRadius: 3,
            background: rc.navy,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
            </svg>
          </div>
          <span style={{ fontSize: 10, color: rc.textMed, fontFamily: font }}>
            Powered by Airwave
          </span>
        </div>
      </div>

      {/* Restart prototype button */}
      <div
        onClick={() => reset('ChannelList')}
        style={{
          margin: '0 10px 16px', padding: '10px',
          textAlign: 'center', cursor: 'pointer',
          fontSize: 12, color: rc.navy, fontFamily: font, fontWeight: 600,
          background: rc.cardBg, borderRadius: 8,
          border: `1px dashed ${rc.borderHeader}`,
        }}
      >
        Restart Prototype
      </div>

      <div style={{ height: 12 }} />
    </div>
  )
}
