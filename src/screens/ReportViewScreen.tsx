import React from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { Header } from '../components/Header'
import { reports } from '../data/mock'

export function ReportViewScreen({ params }: { params?: Record<string, unknown> }) {
  const reportId = (params?.reportId as string) || 'r1'
  const report = reports.find(r => r.id === reportId) || reports[0]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header title="Document" showBack />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Report header */}
        <div style={{
          background: '#1a1a2e',
          padding: '24px 20px',
          textAlign: 'center',
        }}>
          <h1 style={{
            color: colors.white,
            fontSize: fonts.size.xl,
            fontWeight: fonts.weight.bold,
            lineHeight: 1.4,
          }}>
            MT 06 Tool 104 219 Shift Report
          </h1>
        </div>

        <div style={{ padding: 20 }}>
          {/* Metadata */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: fonts.size.sm, color: colors.textSecondary }}>
              <strong>Report Type:</strong> inspection_report
            </div>
            <div style={{ fontSize: fonts.size.sm, color: colors.textSecondary }}>
              <strong>Technician:</strong> Josh Lee
            </div>
            <div style={{ fontSize: fonts.size.sm, color: colors.textSecondary }}>
              <strong>Date:</strong> {report.date} &bull; <strong>Time:</strong> 07:51 PM EDT
            </div>
          </div>

          {/* Content */}
          <h2 style={{
            fontSize: fonts.size.lg,
            fontWeight: fonts.weight.bold,
            marginBottom: 12,
          }}>
            Inspection Summary
          </h2>
          <p style={{
            fontSize: fonts.size.md,
            color: colors.textSecondary,
            lineHeight: 1.7,
            marginBottom: 20,
          }}>
            The inspection focused on recent enhancements to the reporting and analytics features within the project management and documentation systems. Key improvements include the ability to edit published reports across mobile and web platforms, streamlined shift summary reporting for field technicians, and the successful implementation of tools for extracting and organizing multilingual data, all of which contribute to more efficient operations and improved data accuracy.
          </p>

          <h2 style={{
            fontSize: fonts.size.lg,
            fontWeight: fonts.weight.bold,
            marginBottom: 12,
          }}>
            Source Video
          </h2>
          <div style={{
            height: 180,
            background: '#334155',
            borderRadius: radius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <button style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.white,
              fontSize: 20,
            }}>
              ▶
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: '12px 16px 28px',
        borderTop: `1px solid ${colors.border}`,
        background: colors.white,
      }}>
        <button style={{
          background: '#1a1a2e',
          color: colors.white,
          padding: '10px 20px',
          borderRadius: radius.full,
          fontSize: fonts.size.md,
          fontWeight: fonts.weight.medium,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          Search this Document ✓
        </button>
      </div>

      {/* Floating action buttons */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 16,
        alignItems: 'center',
      }}>
        {['👍', '👎'].map(emoji => (
          <button key={emoji} style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: colors.gray100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}>
            {emoji}
          </button>
        ))}
        <button style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: colors.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(22,91,195,0.4)',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <rect x="4" y="2" width="4" height="20" rx="2" />
            <rect x="10" y="5" width="4" height="14" rx="2" />
            <rect x="16" y="2" width="4" height="20" rx="2" />
          </svg>
        </button>
        <button style={{ fontSize: 20 }}>💬</button>
        <button style={{ fontSize: 20 }}>📤</button>
      </div>
    </div>
  )
}
