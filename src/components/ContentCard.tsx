import React from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { Avatar } from './Avatar'
import type { Report } from '../data/mock'

interface ContentCardProps {
  report: Report
  onViewReport?: () => void
  onShare?: () => void
}

export function ContentCard({ report, onViewReport, onShare }: ContentCardProps) {
  return (
    <div style={{
      background: colors.white,
      borderRadius: radius.lg,
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      margin: '0 0 16px',
    }}>
      {/* Video thumbnail */}
      <div style={{
        position: 'relative',
        height: 160,
        background: '#1e3a5f',
        overflow: 'hidden',
      }}>
        <img
          src={report.videoThumbnail}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <button style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.white,
          fontSize: 20,
        }}>
          ▶
        </button>
      </div>

      <div style={{ padding: 16 }}>
        {/* File count & shared by */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
          fontSize: fonts.size.sm,
          color: colors.textSecondary,
        }}>
          <span>{report.fileCount} file{report.fileCount > 1 ? 's' : ''}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>Shared by:</span>
            <Avatar emoji={report.sharedBy.avatar} size={20} name={report.sharedBy.name} />
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: fonts.size.xl,
          fontWeight: fonts.weight.bold,
          color: colors.textPrimary,
          marginBottom: 8,
          lineHeight: 1.3,
        }}>
          {report.title}
        </h3>

        {/* Tags */}
        {report.tags && (
          <div style={{ marginBottom: 8 }}>
            {report.tags.map(tag => (
              <span key={tag} style={{
                fontSize: fonts.size.sm,
                color: colors.primary,
              }}>{tag}</span>
            ))}
          </div>
        )}

        {/* Summary */}
        <p style={{
          fontSize: fonts.size.md,
          color: colors.textSecondary,
          lineHeight: 1.5,
          marginBottom: 12,
        }}>
          {report.summary}
        </p>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onViewReport}
            style={{
              padding: '8px 16px',
              border: `1.5px solid ${colors.gray300}`,
              borderRadius: radius.full,
              fontSize: fonts.size.md,
              fontWeight: fonts.weight.medium,
              color: colors.textPrimary,
            }}
          >
            View Report
          </button>
          <button
            onClick={onShare}
            style={{
              padding: '8px 16px',
              border: `1.5px solid ${colors.gray300}`,
              borderRadius: radius.full,
              fontSize: fonts.size.md,
              fontWeight: fonts.weight.medium,
              color: colors.textPrimary,
            }}
          >
            Share
          </button>
        </div>
      </div>
    </div>
  )
}
