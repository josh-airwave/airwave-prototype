import React from 'react'
import { colors, fonts } from '../styles/theme'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export function SearchBar({ placeholder = 'Search', value = '', onChange }: SearchBarProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0 12px',
      height: 46,
      background: colors.cloudGray,
      borderRadius: 5,
      margin: '12px 12px 0',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.placeholderColor} strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        style={{
          border: 'none',
          background: 'transparent',
          outline: 'none',
          fontSize: fonts.size.md,
          color: colors.textPrimary,
          width: '100%',
        }}
      />
    </div>
  )
}
