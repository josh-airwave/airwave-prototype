import React, { useState, useEffect, useRef } from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { useNavigation } from '../navigation/Router'

/**
 * Firmware Update Screen — Multi-update sequential flow
 *
 * Handles up to 3 sequential firmware updates:
 *   1. MTK (Android system) — rare, complex
 *   2. APP (glasses Android application) — no restart required
 *   3. BES (BES microcontroller firmware) — requires glasses restart
 *
 * Shows clear progress per update (1 of 3, 2 of 3, etc.)
 * Handles interruptions with reassurance messaging about partial completion.
 *
 * Tap the glasses image during any step to simulate a failure.
 */

// ── Types ──

type FailureType = 'download_failed' | 'bluetooth_lost' | 'update_interrupted' | 'reconnect_failed' | null

interface UpdateStep {
  id: string
  phases: PhaseConfig[]
}

interface PhaseConfig {
  key: string
  label: string
  sublabel: string
  duration: number
}

// What's new in this update — shown to the tech
const WHATS_NEW = [
  'Improved wake word tuning',
  'Voice to Voice conversations with Blue from your glasses',
  'Performance and stability improvements',
]

// ── Update step definitions (internal, not shown to tech) ──

function makeSteps(count: number): UpdateStep[] {
  // The last update always includes restart/reconnect (BES)
  const steps: UpdateStep[] = []
  for (let i = 0; i < count; i++) {
    const isLast = i === count - 1
    const phases: PhaseConfig[] = [
      { key: 'downloading', label: 'Downloading Update', sublabel: 'Grabbing the latest software from the server...', duration: 3000 + Math.random() * 2000 },
      { key: 'installing', label: 'Installing Update', sublabel: 'Keep your glasses nearby while we install.', duration: 4000 + Math.random() * 3000 },
    ]
    if (isLast) {
      phases.push(
        { key: 'restarting', label: 'Glasses Restarting', sublabel: 'Your glasses are rebooting. This is normal.', duration: 4000 },
        { key: 'reconnecting', label: 'Reconnecting', sublabel: 'Waiting for your glasses to reconnect...', duration: 3000 },
      )
    }
    steps.push({ id: `step-${i}`, phases })
  }
  return steps
}

// Preset update scenarios
const UPDATE_PRESETS: Record<string, UpdateStep[]> = {
  '2_updates': makeSteps(2),
  '3_updates': makeSteps(3),
  '1_update': makeSteps(1),
}

const FAILURE_CONFIG: Record<string, { title: string; message: string }> = {
  download_failed: {
    title: 'Download Failed',
    message: 'We couldn\'t reach the server. Check your Wi-Fi or internet connection and try again.',
  },
  bluetooth_lost: {
    title: 'Connection Lost',
    message: 'Bluetooth connection to your glasses was interrupted. Make sure your glasses are turned on and nearby.',
  },
  update_interrupted: {
    title: 'Update Interrupted',
    message: 'The update was interrupted, but don\'t worry — your glasses are safe.',
  },
  reconnect_failed: {
    title: 'Couldn\'t Reconnect',
    message: 'Your glasses restarted but we couldn\'t reconnect. Try moving closer, or reconnect from the home screen.',
  },
}

// ── Component ──

export function FirmwareUpdateScreen({ params }: { params?: Record<string, unknown> }) {
  const { pop } = useNavigation()

  // Which updates to run
  const preset = (params?.updatePreset as string) || '2_updates'
  const updates = UPDATE_PRESETS[preset] || UPDATE_PRESETS['2_updates']
  const totalUpdates = updates.length

  // Freeze mode for screen exports
  const freezeState = params?.freezeState === true
  const initialUpdateIndex = typeof params?.initialUpdateIndex === 'number' ? params.initialUpdateIndex : 0
  const initialPhaseIndex = typeof params?.initialPhaseIndex === 'number' ? params.initialPhaseIndex : 0
  const initialProgress = typeof params?.initialProgress === 'number' ? params.initialProgress : 0
  const initialFailure = (params?.initialFailure as FailureType) ?? null
  const initialCompletedUpdates = typeof params?.initialCompletedUpdates === 'number' ? params.initialCompletedUpdates : 0

  // State
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(initialUpdateIndex)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(initialPhaseIndex)
  const [progress, setProgress] = useState(freezeState ? initialProgress : 0)
  const [failure, setFailure] = useState<FailureType>(initialFailure)
  const [completedUpdates, setCompletedUpdates] = useState(initialCompletedUpdates)
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const [allDone, setAllDone] = useState(false)
  const animRef = useRef<number>(0)
  const phaseTimerRef = useRef<number>(0)

  const currentUpdate = updates[currentUpdateIndex]
  const currentPhase = currentUpdate?.phases[currentPhaseIndex]
  const isFailed = failure != null
  const isRestartPhase = currentPhase?.key === 'restarting' || currentPhase?.key === 'reconnecting'
  const remainingUpdates = totalUpdates - completedUpdates

  // Calculate overall progress across all updates
  const getOverallProgress = () => {
    if (allDone) return 100
    const progressPerUpdate = 100 / totalUpdates
    const completedProgress = completedUpdates * progressPerUpdate

    if (!currentUpdate) return completedProgress

    const totalPhases = currentUpdate.phases.length
    const phaseProgress = currentPhaseIndex / totalPhases
    const withinPhaseProgress = progress / 100 / totalPhases
    const currentUpdateProgress = (phaseProgress + withinPhaseProgress) * progressPerUpdate

    return Math.round(completedProgress + currentUpdateProgress)
  }

  const overallProgress = getOverallProgress()

  // Animate progress within current phase
  useEffect(() => {
    if (freezeState || allDone || isFailed || !currentPhase) return

    const { duration } = currentPhase
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const t = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - t, 2)
      setProgress(Math.round(eased * 100))

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    setProgress(0)
    animRef.current = requestAnimationFrame(animate)

    // When phase completes, move to next phase or next update
    phaseTimerRef.current = window.setTimeout(() => {
      const nextPhaseIndex = currentPhaseIndex + 1
      if (nextPhaseIndex < currentUpdate.phases.length) {
        // Next phase within same update
        setCurrentPhaseIndex(nextPhaseIndex)
      } else {
        // Current update complete
        const newCompleted = completedUpdates + 1
        setCompletedUpdates(newCompleted)
        const nextUpdateIndex = currentUpdateIndex + 1
        if (nextUpdateIndex < updates.length) {
          // Move to next update
          setCurrentUpdateIndex(nextUpdateIndex)
          setCurrentPhaseIndex(0)
        } else {
          // All updates done
          setAllDone(true)
          setProgress(100)
        }
      }
    }, duration)

    return () => {
      cancelAnimationFrame(animRef.current)
      clearTimeout(phaseTimerRef.current)
    }
  }, [currentUpdateIndex, currentPhaseIndex, failure, retryKey, freezeState, allDone])

  // Simulate failure on glasses tap
  const simulateFailure = () => {
    if (allDone || isFailed || isRetrying) return
    cancelAnimationFrame(animRef.current)
    clearTimeout(phaseTimerRef.current)

    const key = currentPhase?.key
    if (key === 'downloading') setFailure('download_failed')
    else if (key === 'installing') setFailure('update_interrupted')
    else if (key === 'restarting' || key === 'reconnecting') setFailure('reconnect_failed')
  }

  const handleRetry = () => {
    setIsRetrying(true)
    setFailure(null)
    setTimeout(() => {
      setIsRetrying(false)
      setCurrentPhaseIndex(0) // Restart current update from beginning
      setRetryKey(prev => prev + 1)
    }, 1000)
  }

  // Colors based on state
  const ringColor = isFailed ? colors.danger : allDone ? colors.success : isRestartPhase ? '#F5A623' : colors.primary
  const bgTint = isFailed
    ? 'rgba(255, 59, 48, 0.06)'
    : allDone
      ? 'rgba(73, 174, 123, 0.08)'
      : isRestartPhase
        ? 'rgba(245, 166, 35, 0.08)'
        : 'rgba(22, 91, 195, 0.06)'

  const failureInfo = failure ? FAILURE_CONFIG[failure] : null

  // Build reassurance message for partial failures
  const getFailureReassurance = () => {
    if (completedUpdates === 0) {
      return `We'll pick up right where we left off. ${totalUpdates === 1 ? 'Your update' : `All ${totalUpdates} updates`} will resume when you retry.`
    }
    const done = completedUpdates
    const left = totalUpdates - completedUpdates
    return `${done} of ${totalUpdates} update${done > 1 ? 's' : ''} already completed successfully. ${left} update${left > 1 ? 's' : ''} remaining — we'll continue right where we left off.`
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: colors.white,
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderBottom: `1px solid ${colors.coolMedium}`,
      }}>
        {(allDone || isFailed) && (
          <button
            onClick={pop}
            style={{
              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.almostBlack} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <span style={{
          fontSize: fonts.size.xl,
          fontWeight: fonts.weight.semibold,
          fontFamily: fonts.family,
          color: colors.almostBlack,
        }}>
          Firmware Update
        </span>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 24px',
        gap: 20,
      }}>

        {/* Update counter badge */}
        {totalUpdates > 1 && !allDone && (
          <div style={{
            background: isFailed ? colors.dangerLight : colors.primaryLight15,
            padding: '6px 16px',
            borderRadius: 20,
          }}>
            <span style={{
              fontSize: fonts.size.sm,
              fontWeight: fonts.weight.bold,
              fontFamily: fonts.family,
              color: isFailed ? colors.danger : colors.primary,
            }}>
              {isFailed
                ? `${completedUpdates} of ${totalUpdates} complete`
                : `Update ${currentUpdateIndex + 1} of ${totalUpdates}`
              }
            </span>
          </div>
        )}

        {/* Glasses with status ring */}
        <div
          onClick={simulateFailure}
          style={{
            width: 160, height: 160, borderRadius: '50%',
            background: bgTint,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            transition: 'background 0.5s ease',
            cursor: !allDone && !isFailed ? 'pointer' : 'default',
          }}
        >
          {/* Progress ring */}
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ position: 'absolute', inset: 0 }}>
            <circle cx="80" cy="80" r="76" fill="none" stroke={colors.coolMedium} strokeWidth="3" />
            <circle
              cx="80" cy="80" r="76"
              fill="none"
              stroke={ringColor}
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 76}`}
              strokeDashoffset={`${2 * Math.PI * 76 * (1 - overallProgress / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
              style={{ transition: 'stroke-dashoffset 0.3s ease-out, stroke 0.5s ease' }}
            />
          </svg>

          {/* Center content */}
          {allDone ? (
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" fill={colors.success} />
              <polyline points="20,32 28,40 44,24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          ) : isFailed ? (
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: colors.danger,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'shakeX 0.5s ease',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
          ) : isRetrying ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          ) : isRestartPhase ? (
            <img src="/images/sg_welcome.png" alt="Airwave Glasses" style={{ width: 120, height: 'auto', objectFit: 'contain', animation: 'pulse 2s ease-in-out infinite' }} />
          ) : (
            <img src="/images/sg_welcome.png" alt="Airwave Glasses" style={{ width: 120, height: 'auto', objectFit: 'contain' }} />
          )}

          {/* Spinning accent ring */}
          {!allDone && !isFailed && !isRetrying && !isRestartPhase && (
            <div style={{
              position: 'absolute', inset: -2, borderRadius: '50%',
              border: '2px solid transparent', borderTopColor: colors.primary,
              animation: 'spin 2s linear infinite', opacity: 0.2,
            }} />
          )}
        </div>

        {/* Progress percentage */}
        <div style={{
          fontSize: '48px',
          fontWeight: fonts.weight.bold,
          fontFamily: fonts.family,
          color: isFailed ? colors.danger : allDone ? colors.success : isRestartPhase ? '#F5A623' : colors.primary,
          lineHeight: 1,
          transition: 'color 0.5s ease',
        }}>
          {isFailed ? '' : `${overallProgress}%`}
        </div>

        {/* Label */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: fonts.size.xxl,
            fontWeight: fonts.weight.semibold,
            fontFamily: fonts.family,
            color: isFailed ? colors.danger : allDone ? colors.success : isRestartPhase ? '#F5A623' : colors.almostBlack,
            marginBottom: 8,
          }}>
            {allDone ? "You're All Set!" : isFailed ? failureInfo?.title : isRetrying ? 'Retrying...' : currentPhase?.label}
          </div>
          <div style={{
            fontSize: fonts.size.md,
            color: colors.neutral,
            fontFamily: fonts.family,
            lineHeight: 1.5,
            maxWidth: 300,
            margin: '0 auto',
          }}>
            {allDone
              ? `${totalUpdates === 1 ? 'Your update is' : `All ${totalUpdates} updates are`} installed and your glasses are ready to go.`
              : isFailed
                ? failureInfo?.message
                : isRetrying
                  ? 'Reconnecting and restarting...'
                  : currentPhase?.sublabel
            }
          </div>
        </div>

        {/* What's New — shown when done */}
        {allDone && (
          <div style={{
            background: colors.coolLight,
            borderRadius: 12,
            padding: '14px 18px',
            maxWidth: 320,
            width: '100%',
          }}>
            <div style={{
              fontSize: fonts.size.sm,
              fontWeight: fonts.weight.bold,
              fontFamily: fonts.family,
              color: colors.almostBlack,
              marginBottom: 8,
            }}>
              What's New
            </div>
            {WHATS_NEW.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
                marginBottom: i < WHATS_NEW.length - 1 ? 6 : 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.success} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{
                  fontSize: fonts.size.sm,
                  fontFamily: fonts.family,
                  color: colors.neutral,
                  lineHeight: 1.4,
                }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Failure reassurance card */}
        {isFailed && (
          <div style={{
            background: '#FFF8F0',
            border: '1px solid #FFE0B2',
            borderRadius: 12,
            padding: '12px 16px',
            maxWidth: 320,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <span style={{
              fontSize: fonts.size.sm,
              fontFamily: fonts.family,
              color: '#7A5400',
              lineHeight: 1.5,
            }}>
              {getFailureReassurance()}
            </span>
          </div>
        )}

        {/* Update step indicators */}
        {!allDone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 4 }}>
            {updates.map((update, i) => {
              const state = isFailed && i === currentUpdateIndex ? 'failed'
                : i < completedUpdates ? 'complete'
                : (i === currentUpdateIndex && !isFailed) ? 'active'
                : 'pending'

              const dotColor = state === 'failed' ? colors.danger
                : state === 'complete' ? colors.success
                : state === 'active' ? (isRestartPhase ? '#F5A623' : colors.primary)
                : colors.neutralGray

              const icon = state === 'failed' ? '!'
                : state === 'complete' ? '\u2713'
                : String(i + 1)

              return (
                <React.Fragment key={update.id}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: dotColor,
                    color: state === 'pending' ? colors.neutral400 : colors.white,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: fonts.size.sm, fontWeight: fonts.weight.bold, fontFamily: fonts.family,
                    transition: 'all 0.4s ease',
                  }}>
                    {icon}
                  </div>
                  {i < updates.length - 1 && (
                    <div style={{
                      width: 36, height: 3, borderRadius: 2,
                      background: i < completedUpdates ? colors.success
                        : (isFailed && i === currentUpdateIndex) ? colors.danger
                        : colors.neutralGray,
                      transition: 'background 0.4s ease',
                    }} />
                  )}
                </React.Fragment>
              )
            })}
          </div>
        )}

        {/* Tap hint (prototype only) */}
        {!allDone && !isFailed && (
          <div data-prototype-only style={{
            fontSize: fonts.size.xs, color: colors.neutral400,
            fontFamily: fonts.family, fontStyle: 'italic',
          }}>
            Tap the glasses to simulate a failure
          </div>
        )}
      </div>

      {/* Bottom buttons */}
      <div style={{ padding: '16px 24px 36px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {allDone ? (
          <button
            onClick={pop}
            style={{
              width: '100%', padding: '16px 0', borderRadius: radius.pill,
              background: colors.success, color: colors.white,
              fontSize: fonts.size.xl, fontWeight: fonts.weight.bold, fontFamily: fonts.family,
              cursor: 'pointer', border: 'none',
            }}
          >
            Done
          </button>
        ) : isFailed ? (
          <>
            <button
              onClick={handleRetry}
              style={{
                width: '100%', padding: '16px 0', borderRadius: radius.pill,
                background: colors.primary, color: colors.white,
                fontSize: fonts.size.xl, fontWeight: fonts.weight.bold, fontFamily: fonts.family,
                cursor: 'pointer', border: 'none',
              }}
            >
              Try Again
            </button>
            <button
              onClick={pop}
              style={{
                width: '100%', padding: '14px 0', borderRadius: radius.pill,
                background: 'none', color: colors.neutral,
                fontSize: fonts.size.lg, fontWeight: fonts.weight.medium, fontFamily: fonts.family,
                cursor: 'pointer', border: 'none',
              }}
            >
              Cancel Update
            </button>
          </>
        ) : (
          <div style={{
            width: '100%', padding: '16px 0', borderRadius: radius.pill,
            background: colors.coolLight, color: colors.neutral400,
            fontSize: fonts.size.lg, fontWeight: fonts.weight.medium, fontFamily: fonts.family,
            textAlign: 'center',
          }}>
            {isRestartPhase ? 'Glasses are restarting — please wait...' : 'Please don\'t close the app...'}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shakeX { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.92); } }
      `}</style>
    </div>
  )
}
