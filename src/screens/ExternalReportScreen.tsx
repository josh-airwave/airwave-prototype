import React, { useState, useEffect } from 'react'
import { useNavigation } from '../navigation/Router'
import { videoIntelReports } from '../data/mock'
import { feedbackStore } from '../data/feedbackStore'

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

  // Machine Audit (vr1)
  if (reportId === 'vr1') {
    const sections: InspectionSection[] = [
      {
        title: 'Machine Identification',
        summary: 'Visual identification of injection molding machine, controller display, and active tool information.',
        items: [
          { item: 'Record machine make and model', status: 'Complete', comments: 'Nissei SI-200-6S H450E Φ46 identified', source: '0:03' },
          { item: 'Capture machine number / ID', status: 'Complete', comments: 'Machine No. 62 confirmed', source: '0:03' },
          { item: 'Identify active tool number', status: 'Complete', comments: 'Tool 104 219 loaded and running', source: '0:05' },
          { item: 'Verify controller screen is readable', status: 'Partial', comments: 'Monitor Data screen visible, some glare on right side', source: '0:08' },
        ],
      },
      {
        title: 'Process Parameters',
        summary: 'Verification of key injection molding cycle parameters against expected ranges.',
        items: [
          { item: 'Record cycle time', status: 'Complete', comments: '59.34s — within 58-62s target range', source: '0:10' },
          { item: 'Verify injection speed', status: 'Complete', comments: '-0.11 in/s at rest position', source: '0:10' },
          { item: 'Check cushion position', status: 'Complete', comments: '0.209 in — within spec (0.15-0.30)', source: '0:12' },
          { item: 'Verify fill time', status: 'Partial', comments: '0.51s — slightly below 0.55s target, borderline', source: '0:12' },
          { item: 'Record plasticizing time', status: 'Complete', comments: '14.37s — normal range', source: '0:15' },
          { item: 'Check injection pressure', status: 'Incomplete', comments: 'Reading of 125 in/10Pa — units unclear, needs manual verification', source: '0:10' },
        ],
      },
      {
        title: 'Shot Counter & Production',
        summary: 'Production volume tracking and shot count verification from the controller.',
        items: [
          { item: 'Record total shot count', status: 'Complete', comments: '227 shots recorded this run', source: '0:18' },
          { item: 'Verify shot counter matches log', status: 'Incomplete', comments: 'Paper log not visible on video', source: '—' },
          { item: 'Check reject count', status: 'Partial', comments: 'Counter visible but value partially obscured', source: '0:20' },
        ],
      },
      {
        title: 'Safety & Environment',
        summary: 'Verification of machine safety features and surrounding work area conditions.',
        items: [
          { item: 'Guard doors closed during cycle', status: 'Complete', comments: 'Safety interlock engaged', source: '0:22' },
          { item: 'Area around machine clear', status: 'Complete', comments: 'No obstructions, floor clean', source: '0:25' },
          { item: 'Emergency stop accessible', status: 'Complete', comments: 'E-stop button visible and unobstructed', source: '0:22' },
          { item: 'Temperature readings normal', status: 'Partial', comments: 'Barrel temps visible, mold temp display not captured', source: '0:28' },
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
      reportSummary: 'Machine audit of Nissei SI-200-6S at MT 06 Tool 104 219, Delta Faucet Jackson facility. Controller display captured showing cycle parameters, shot counts, and process settings. Fill time slightly below target range; injection pressure units require manual verification. 227 shots recorded this run.',
      statusCounts: { complete, partial, incomplete },
    }
  }

  // Production Whiteboard (vr2 and default)
  const sections: InspectionSection[] = [
    {
      title: 'Board Identification',
      summary: 'Verification of whiteboard location, shift date, and production line identification.',
      items: [
        { item: 'Confirm board location / line', status: 'Complete', comments: 'Line 4 — Assembly, Building B', source: '0:02' },
        { item: 'Verify shift date is current', status: 'Complete', comments: 'Apr 07, 2026 — matches today', source: '0:02' },
        { item: 'Identify shift (1st/2nd/3rd)', status: 'Complete', comments: '1st shift (7:00 AM – 3:30 PM)', source: '0:04' },
        { item: 'Supervisor name recorded', status: 'Partial', comments: 'Initials "JL" visible but full name not written', source: '0:04' },
      ],
    },
    {
      title: 'Hourly Production Counts',
      summary: 'Extraction of hourly goal vs. actual production counts from the handwritten tracking grid.',
      items: [
        { item: 'Hour 1 goal vs actual', status: 'Complete', comments: 'Goal: 25, Actual: 25 — on target', source: '0:06' },
        { item: 'Hour 2 goal vs actual', status: 'Complete', comments: 'Goal: 25, Actual: 26 — ahead by 1', source: '0:06' },
        { item: 'Hour 3 goal vs actual', status: 'Complete', comments: 'Goal: 25, Actual: 23 — behind by 2', source: '0:08' },
        { item: 'Hour 4 goal vs actual', status: 'Complete', comments: 'Goal: 25, Actual: 25 — on target', source: '0:08' },
        { item: 'Hours 5-8 goal vs actual', status: 'Incomplete', comments: 'Not yet filled in — shift in progress', source: '—' },
      ],
    },
    {
      title: 'Cumulative Tracking',
      summary: 'Verification of running cumulative totals and variance calculations on the board.',
      items: [
        { item: 'Cumulative goal calculated correctly', status: 'Complete', comments: 'Cum. goal: 100 after 4 hours ✓', source: '0:10' },
        { item: 'Cumulative actual matches sum', status: 'Partial', comments: 'Written as 63 but sum is 99 — possible transcription lag', source: '0:10' },
        { item: 'Variance column updated', status: 'Incomplete', comments: 'Variance column left blank', source: '—' },
      ],
    },
    {
      title: 'Quality & Downtime Notes',
      summary: 'Capture of any quality issues, downtime events, or notes recorded on the whiteboard.',
      items: [
        { item: 'Scrap / reject count noted', status: 'Partial', comments: 'Tally marks visible but hard to read — appears to be 3', source: '0:14' },
        { item: 'Downtime events recorded', status: 'Complete', comments: '15 min tool change noted at Hour 3', source: '0:14' },
        { item: 'Quality alerts or holds', status: 'Complete', comments: 'No quality holds — "OK" written in QA box', source: '0:16' },
        { item: 'Safety incidents noted', status: 'Complete', comments: 'Zero incidents marked', source: '0:16' },
      ],
    },
    {
      title: 'Board Condition & Legibility',
      summary: 'Assessment of overall whiteboard readability and completeness for shift handoff.',
      items: [
        { item: 'All columns legible', status: 'Partial', comments: 'Hours 1-4 clear, cumulative column smudged', source: '0:18' },
        { item: 'Color coding followed', status: 'Complete', comments: 'Red/green markers used for behind/ahead', source: '0:18' },
        { item: 'Board ready for shift handoff', status: 'Incomplete', comments: 'Hours 5-8 still need to be completed', source: '—' },
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
    reportSummary: 'Production whiteboard audit for Line 4 Assembly, 1st shift at Delta Faucet Jackson. Hourly counts captured for Hours 1-4 showing production mostly on target with a minor dip in Hour 3 due to a 15-minute tool change. Cumulative actual may have a transcription error. Hours 5-8 pending — shift still in progress.',
    statusCounts: { complete, partial, incomplete },
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
  const { reset, push } = useNavigation()
  const reportId = (params?.reportId as string) || 'vr3'
  const report = videoIntelReports.find(r => r.id === reportId) || videoIntelReports[0]
  const { sections, reportSummary, statusCounts } = getInspectionData(reportId)

  // Loading state
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setTimeout(() => setLoaded(true), 600) }, [])

  // Feedback state
  const [feedbackState, setFeedbackState] = useState<'none' | 'not_helpful_form' | 'submitted'>('none')
  const [feedbackName, setFeedbackName] = useState('')
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

  const canSubmit = feedbackName.trim() && feedbackMessage.trim()

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: rc.pageBg }}>
      {/* Safari browser chrome */}
      <div style={{
        background: '#F2F2F7', padding: '6px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: '0.5px solid #C6C6C8',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, color: '#007AFF', fontFamily: font }}>Aa</span>
        <div style={{
          flex: 1, background: '#fff', borderRadius: 8, padding: '6px 10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span style={{ fontSize: 13, color: '#1C1C1E', fontFamily: font }}>
            awv.app/r/{report.id.replace('vr', '')}
          </span>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
          <polyline points="16 6 12 2 8 6" />
          <line x1="12" y1="2" x2="12" y2="15" />
        </svg>
        <button
          onClick={() => reset('ChannelList')}
          style={{
            padding: '3px 8px',
            background: '#E5E5EA',
            border: 'none',
            borderRadius: 6,
            color: '#8E8E93',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: font,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
          </svg>
          Restart
        </button>
      </div>

      {/* Scrollable report content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
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

          {/* Source Video — portrait, playable */}
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: rc.text, fontFamily: font, margin: '0 0 6px', textAlign: 'center' }}>
              Source Video
            </h2>
            <div style={{
              borderRadius: 6, overflow: 'hidden',
              border: `3px solid ${rc.darkHeader}`,
              aspectRatio: '9/16',
              maxHeight: 400,
              margin: '0 auto',
              width: 'fit-content',
            }}>
              <video
                src={report.sourceVideoUrl + '#t=0.1'}
                controls
                preload="metadata"
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
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

        {/* Powered by Airwave footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '12px 16px',
          borderTop: `1px solid ${rc.borderLight}`,
        }}>
          <img
            src="/images/airwave-app-icon.png"
            alt="Airwave"
            style={{ width: 16, height: 16, borderRadius: 3 }}
          />
          <span style={{ fontSize: 10, color: rc.textMed, fontFamily: font }}>
            Powered by Airwave
          </span>
        </div>
      </div>

      <div style={{ height: 80 }} />
      </div>{/* end scrollable */}

      {/* Sticky feedback widget at bottom */}
      <div style={{
        flexShrink: 0,
        padding: '12px 16px',
        background: rc.headerBg,
        borderTop: `1px solid ${rc.borderLight}`,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
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
            <div style={{ fontSize: 13, fontWeight: 600, fontFamily: font, color: rc.text, marginBottom: 8 }}>
              Your Name <span style={{ color: rc.red }}>*</span>
            </div>
            <input
              autoFocus
              value={feedbackName}
              onChange={e => setFeedbackName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: '100%', padding: 8, borderRadius: 6,
                border: `1.5px solid ${rc.borderLight}`, fontFamily: font,
                fontSize: 12, outline: 'none',
                boxSizing: 'border-box',
                marginBottom: 10,
              }}
              onFocus={e => e.target.style.borderColor = rc.navy}
              onBlur={e => e.target.style.borderColor = rc.borderLight}
            />
            <div style={{ fontSize: 13, fontWeight: 600, fontFamily: font, color: rc.text, marginBottom: 6 }}>
              How can the tech be more helpful? <span style={{ color: rc.red }}>*</span>
            </div>
            <textarea
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
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <button
                onClick={() => {
                  setFeedbackState('none')
                  setFeedbackName('')
                  setFeedbackMessage('')
                }}
                style={{
                  padding: '8px 20px', borderRadius: 8,
                  background: '#fff', color: rc.textMed,
                  border: `1.5px solid ${rc.borderLight}`, cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, fontFamily: font,
                }}
              >
                Cancel
              </button>
              <button
                disabled={!canSubmit}
                onClick={() => {
                  if (!canSubmit) return
                  setFeedbackState('submitted')
                  notifyTech?.('not_helpful', feedbackMessage)
                  feedbackStore.add({
                    reportId,
                    reportTitle: report.title,
                    name: feedbackName.trim(),
                    message: feedbackMessage,
                  })
                }}
                style={{
                  flex: 1, padding: '8px 20px', borderRadius: 8,
                  background: canSubmit ? rc.navy : rc.borderLight,
                  color: canSubmit ? '#fff' : rc.textMed,
                  border: 'none',
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  fontSize: 13, fontWeight: 600, fontFamily: font,
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                Submit Feedback
              </button>
            </div>
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
            <button
              onClick={() => push('Blue', { channelId: 'blue', channelType: 'blue' })}
              style={{
                marginTop: 10,
                padding: '8px 20px',
                background: rc.navy,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: font,
                cursor: 'pointer',
              }}
            >
              View in Blue Feed
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
