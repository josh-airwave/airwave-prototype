import React from 'react'

interface PhoneFrameProps {
  children: React.ReactNode
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div
      data-screen-export="phone-frame"
      style={{
        width: 393,
        height: 852,
        borderRadius: 44,
        overflow: 'hidden',
        position: 'relative',
        background: '#fff',
        boxShadow: '0 0 0 3px #1a1a2e, 0 25px 80px rgba(0,0,0,0.5)',
      }}
    >
      {/* Status bar */}
      <div style={{
        height: 54,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding: '0 28px 6px',
        background: '#fff',
        position: 'relative',
        zIndex: 100,
      }}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>9:41</span>
        {/* Dynamic island */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 126,
          height: 36,
          borderRadius: 20,
          background: '#000',
        }} />
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
            <path d="M1 8.5h2v3H1zM5 6h2v5.5H5zM9 3.5h2V12H9zM13 1h2v10.5h-2z" fill="#111"/>
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M8 3.3a6.4 6.4 0 014.5 1.9l1.1-1.1A8.2 8.2 0 008 1.2a8.2 8.2 0 00-5.6 2.9l1.1 1.1A6.4 6.4 0 018 3.3zm0 3.2c1.1 0 2.1.4 2.8 1.2l1.1-1.1A5.4 5.4 0 008 4.8a5.4 5.4 0 00-3.9 1.8l1.1 1.1c.7-.8 1.7-1.2 2.8-1.2zM8 8.7c.6 0 1.2.3 1.6.7l1.1-1.1A3.5 3.5 0 008 7a3.5 3.5 0 00-2.7 1.3l1.1 1.1c.4-.4 1-.7 1.6-.7zM8 10.4a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" fill="#111"/>
          </svg>
          <div style={{
            width: 27, height: 13, border: '1.5px solid #111', borderRadius: 4,
            display: 'flex', alignItems: 'center', padding: 1.5,
          }}>
            <div style={{ width: '100%', height: '100%', background: '#34C759', borderRadius: 2 }} />
          </div>
        </div>
      </div>

      {/* Screen content */}
      <div style={{
        height: 'calc(100% - 54px)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {children}
      </div>
    </div>
  )
}
