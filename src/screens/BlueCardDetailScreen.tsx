import React, { useState, useRef, useEffect } from 'react'
import { colors, fonts } from '../styles/theme'
import { useNavigation } from '../navigation/Router'
import { blueCards, channels } from '../data/mock'

interface ChatMsg {
  id: string
  from: 'blue' | 'user'
  text: string
  time: string
}

function now() {
  const d = new Date()
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

export function BlueCardDetailScreen({ params }: { params?: Record<string, unknown> }) {
  const { pop, push } = useNavigation()
  const cardId = (params?.cardId as string) || blueCards[0].id
  const card = blueCards.find(c => c.id === cardId) || blueCards[0]
  const initialReply = params?.initialReply as string | undefined
  const [showShareSheet, setShowShareSheet] = useState(false)
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const didSendInitial = useRef(false)

  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 'm1', from: 'blue', text: "I've processed the media you shared and generated a report. Here's what I found:", time: '4:10 PM' },
    // card is rendered inline after m1
    { id: 'm2', from: 'blue', text: 'Would you like me to highlight any specific sections or generate action items from this report?', time: '4:11 PM' },
  ])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // Auto-send initial reply from the card's reply field
  useEffect(() => {
    if (initialReply && !didSendInitial.current) {
      didSendInitial.current = true
      setTimeout(() => sendMessage(initialReply), 300)
    }
  }, [])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: ChatMsg = { id: `u${Date.now()}`, from: 'user', text: text.trim(), time: now() }
    setMessages(prev => [...prev, userMsg])
    setInputText('')

    // Simulate Blue reply after a short delay
    setTimeout(() => {
      const replies = [
        "Based on the report, I identified 3 key action items. Would you like me to list them?",
        "I found several safety observations in the video. The framing inspection on floor 2 needs follow-up.",
        "The transcription is complete. I noticed mentions of electrical rough-in delays — want me to flag those for the team?",
        "I've cross-referenced this with previous reports. There's a recurring issue with the elevator shaft alignment.",
      ]
      const reply: ChatMsg = {
        id: `b${Date.now()}`,
        from: 'blue',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: now(),
      }
      setMessages(prev => [...prev, reply])
    }, 1200)
  }

  const handlePTT = () => {
    setIsRecording(true)
    // Simulate recording + transcription
    setTimeout(() => {
      setIsRecording(false)
      sendMessage("Can you summarize the key findings from this inspection?")
    }, 2000)
  }

  const [playingId, setPlayingId] = useState<string | null>(null)
  const [listenedIds, setListenedIds] = useState<Set<string>>(new Set())

  const togglePlayback = (id: string) => {
    if (playingId === id) {
      setPlayingId(null)
    } else {
      setPlayingId(id)
      setListenedIds(prev => new Set(prev).add(id))
      setTimeout(() => setPlayingId(null), 3000)
    }
  }

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: '#F6F6F6',
    }}>
      {/* Header — AI-generated title summarizing the conversation */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 16px',
        background: colors.white,
        borderBottom: `1px solid ${colors.border}`,
        flexShrink: 0,
      }}>
        <button onClick={pop} style={{ padding: 4, flexShrink: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div style={{
          flex: 1, fontSize: fonts.size.md, fontWeight: fonts.weight.bold,
          color: colors.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {card.title}
        </div>
      </div>

      {/* Conversation */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {messages.map((msg, idx) => (
          <React.Fragment key={msg.id}>
            {(() => {
              const isBlue = msg.from === 'blue'
              const isListened = listenedIds.has(msg.id)
              const isPlaying = playingId === msg.id
              const playBtnColor = isListened ? '#ADCEFF' : '#165BC3'

              // Play button colors per state:
              // Blue msg unplayed: dark blue bg (#165BC3), white icon
              // Blue msg played: light lavender bg (#D6E4F7), dark blue icon (#165BC3)
              // User msg unplayed: white bg, muted gray icon (#9CA3AF)
              // User msg played: light gray bg (#E8ECF0), lighter gray icon (#C4CCD6)
              const blueBtnBg = isListened ? '#D6E4F7' : '#165BC3'
              const blueBtnIcon = isListened ? '#165BC3' : '#FFFFFF'
              const userBtnBg = '#FFFFFF'
              const userBtnIcon = isListened ? '#63758B' : '#165BC3'

              return isBlue ? (
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <img src="/avatars/blue-avatar.png" alt="" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, alignSelf: 'flex-end' }} />
                  <div style={{ maxWidth: '85%' }}>
                    <div style={{
                      background: colors.white, borderRadius: 8,
                      padding: '12px 14px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                    }}>
                      <button
                        onClick={() => togglePlayback(msg.id)}
                        style={{
                          width: 48, height: 48, borderRadius: '50%',
                          background: blueBtnBg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, cursor: 'pointer', marginTop: 2,
                        }}
                      >
                        {isPlaying ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill={blueBtnIcon}>
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill={blueBtnIcon}>
                            <polygon points="6,3 20,12 6,21" />
                          </svg>
                        )}
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: fonts.size.md, color: colors.almostBlack, lineHeight: 1.5 }}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: fonts.size.xs, color: colors.textTertiary, marginTop: 2, marginLeft: 4 }}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                  <div style={{ maxWidth: '85%' }}>
                    <div style={{
                      background: '#E4EAF3', borderRadius: 8,
                      padding: '12px 14px',
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                    }}>
                      <button
                        onClick={() => togglePlayback(msg.id)}
                        style={{
                          width: 48, height: 48, borderRadius: '50%',
                          background: userBtnBg,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, cursor: 'pointer', marginTop: 2,
                        }}
                      >
                        {isPlaying ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill={userBtnIcon}>
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill={userBtnIcon}>
                            <polygon points="6,3 20,12 6,21" />
                          </svg>
                        )}
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: fonts.size.md, color: colors.almostBlack, lineHeight: 1.5 }}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: fonts.size.xs, color: colors.textTertiary, marginTop: 2, textAlign: 'right', marginRight: 4 }}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Render the card after the first Blue message */}
            {msg.id === 'm1' && (
              <div style={{
                background: colors.white, borderRadius: 20, overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 16, marginBottom: 12,
                marginLeft: 0, marginRight: 0,
              }}>
                {card.videoUrl && (
                  <button
                    onClick={() => push('VideoZoom', { videoUrl: card.videoUrl })}
                    style={{
                      position: 'relative', width: '100%', height: 180,
                      overflow: 'hidden', borderRadius: 12, background: '#000',
                      padding: 0, border: 'none', cursor: 'pointer', display: 'block',
                    }}
                  >
                    <video src={card.videoUrl} preload="metadata" muted playsInline
                      onLoadedMetadata={e => { const v = e.currentTarget; v.currentTime = Math.min(2, Math.max(0.1, v.duration - 0.1)) }}
                      style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        objectFit: 'cover', filter: 'blur(20px) brightness(0.6)', transform: 'scale(1.2)',
                      }}
                    />
                    <video src={card.videoUrl} preload="metadata" muted playsInline
                      onLoadedMetadata={e => { const v = e.currentTarget; v.currentTime = Math.min(2, Math.max(0.1, v.duration - 0.1)) }}
                      style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)', height: '100%',
                        borderRadius: 6, objectFit: 'contain', zIndex: 1,
                      }}
                    />
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 44, height: 44, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.45)', zIndex: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <polygon points="6,3 20,12 6,21" />
                      </svg>
                    </div>
                  </button>
                )}
                <div style={{ marginTop: 10 }} />
                <div style={{ fontSize: fonts.size.lg, fontWeight: fonts.weight.semibold, color: colors.almostBlack, lineHeight: '1.3', marginBottom: 12 }}>
                  {card.title}
                </div>
                <div style={{ fontSize: fonts.size.md, color: colors.almostBlack, lineHeight: '1.5', marginBottom: 12 }}>
                  {card.summary}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => push('ReportView', { reportId: card.reportId || card.id })} style={{
                    paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
                    borderRadius: 8, background: colors.coolGray, border: 'none',
                    fontSize: fonts.size.md, fontWeight: fonts.weight.semibold,
                    color: colors.neutral500, cursor: 'pointer', minWidth: 100,
                  }}>View Report</button>
                  <button onClick={() => push('ShareFlow', { reportId: card.reportId || card.id })} style={{
                    paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10,
                    borderRadius: 8, background: colors.coolGray, border: 'none',
                    fontSize: fonts.size.md, fontWeight: fonts.weight.semibold,
                    color: colors.neutral500, cursor: 'pointer', minWidth: 100,
                  }}>Share</button>
                </div>
                {/* Card timestamp */}
                <div style={{ fontSize: fonts.size.xs, color: colors.textTertiary, marginTop: 8 }}>
                  4:10 PM
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Message input + PTT bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px 24px',
        background: colors.white,
        borderTop: `1px solid ${colors.border}`,
        flexShrink: 0,
      }}>
        {/* Text input */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center',
          background: colors.coolLight, borderRadius: 24,
          padding: '0 4px 0 16px', height: 44,
        }}>
          <input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(inputText) }}
            placeholder="Ask Blue anything..."
            style={{
              flex: 1, border: 'none', background: 'transparent', outline: 'none',
              fontSize: fonts.size.md, color: colors.almostBlack,
              fontFamily: fonts.family,
            }}
          />
          {/* Send button */}
          {inputText.trim() && (
            <button
              onClick={() => sendMessage(inputText)}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: colors.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          )}
        </div>

        {/* PTT button */}
        <button
          onMouseDown={handlePTT}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: isRecording ? '#EF4444' : colors.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: isRecording ? '0 0 16px rgba(239,68,68,0.4)' : '0 2px 8px rgba(22,91,195,0.3)',
            transition: 'all 0.2s',
          }}
        >
          {isRecording ? (
            // Recording indicator — pulsing dot
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'white' }} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <rect x="3" y="4" width="3" height="16" rx="1.5" />
              <rect x="8" y="7" width="3" height="10" rx="1.5" />
              <rect x="13" y="2" width="3" height="20" rx="1.5" />
              <rect x="18" y="6" width="3" height="12" rx="1.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Share bottom sheet */}
      {showShareSheet && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 200,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
          <div onClick={() => setShowShareSheet(false)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}
          />
          <div style={{
            position: 'relative', background: colors.white,
            borderRadius: '20px 20px 0 0', padding: '16px 16px 32px',
            maxHeight: '60%', overflowY: 'auto',
          }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: colors.gray300, margin: '0 auto 16px' }} />
            <div style={{ fontSize: fonts.size.lg, fontWeight: fonts.weight.bold, marginBottom: 12, textAlign: 'center' }}>
              Share to...
            </div>
            {channels.filter(c => c.type !== 'blue').map(channel => (
              <button
                key={channel.id}
                onClick={() => {
                  setShowShareSheet(false)
                  push('Chat', { channelId: channel.id, channelType: channel.type })
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '12px 8px', textAlign: 'left',
                  borderBottom: `1px solid ${colors.divider}`,
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: colors.coolMedium,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: fonts.weight.bold, color: colors.textSecondary,
                  overflow: 'hidden',
                }}>
                  {channel.avatar.startsWith('http') || channel.avatar.startsWith('/') ? (
                    <img src={channel.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    channel.name.charAt(0)
                  )}
                </div>
                <span style={{ fontSize: fonts.size.md, fontWeight: fonts.weight.medium, color: colors.textPrimary }}>
                  {channel.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
