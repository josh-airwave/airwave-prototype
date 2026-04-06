import React, { useState, useEffect, useRef } from 'react'
import { colors, fonts, radius } from '../styles/theme'
import { useNavigation } from '../navigation/Router'

/**
 * Firmware Update Screen
 *
 * One button, one seamless flow. Handles APP + BES behind the scenes.
 * User just sees: Downloading → Updating → Glasses Restarting → Reconnecting → Done
 *
 * Tap the glasses image during any step to simulate a failure.
 */

type FailureType = 'download_failed' | 'bluetooth_lost' | 'update_interrupted' | 'reconnect_failed' | null

interface StepConfig {
  key: string
  label: string
  sublabel: string
  duration: number
  progressRange: [number, number]
}

const STEPS: StepConfig[] = [
  {
    key: 'downloading',
    label: 'Downloading Update',
    sublabel: 'Grabbing the latest software from the server...',
    duration: 4000,
    progressRange: [0, 25],
  },
  {
    key: 'updating_app',
    label: 'Updating Your Glasses',
    sublabel: 'Installing software update. Keep your glasses nearby.',
    duration: 6000,
    progressRange: [25, 60],
  },
  {
    key: 'updating_firmware',
    label: 'Updating Your Glasses',
    sublabel: 'Almost there — finishing up the update...',
    duration: 5000,
    progressRange: [60, 85],
  },
  {
    key: 'restarting',
    label: 'Glasses Restarting',
    sublabel: 'Your glasses are rebooting. This is normal — just a moment.',
    duration: 4000,
    progressRange: [85, 93],
  },
  {
    key: 'reconnecting',
    label: 'Reconnecting',
    sublabel: 'Waiting for your glasses to reconnect to the app...',
    duration: 3000,
    progressRange: [93, 99],
  },
  {
    key: 'done',
    label: "You're All Set!",
    sublabel: 'Your glasses are updated and ready to go.',
    duration: 0,
    progressRange: [100, 100],
  },
]

const FAILURE_CONFIG: Record<string, { title: string; message: string }> = {
  download_failed: {
    title: 'Download Failed',
    message: 'We couldn\'t reach the server. Check your internet connection and try again.',
  },
  bluetooth_lost: {
    title: 'Connection Lost',
    message: 'Bluetooth connection to your glasses was interrupted. Make sure your glasses are turned on and nearby.',
  },
  update_interrupted: {
    title: 'Update Interrupted',
    message: 'The update was interrupted. Don\'t worry — your glasses are safe. Please try again.',
  },
  reconnect_failed: {
    title: 'Couldn\'t Reconnect',
    message: 'Your glasses restarted but we couldn\'t reconnect. Try moving closer, or reconnect from the home screen.',
  },
}

export function FirmwareUpdateScreen({ params }: { params?: Record<string, unknown> }) {
  const { pop } = useNavigation()

  // Export freeze mode: when params.freezeState is true, skip all timers/animation
  // and render the exact state specified by params
  const freezeState = params?.freezeState === true
  const initialStepIndex = typeof params?.initialStepIndex === 'number' ? params.initialStepIndex : 0
  const initialProgress = typeof params?.initialProgress === 'number' ? params.initialProgress : 0
  const initialFailure = (params?.initialFailure as FailureType) ?? null
  const initialRetrying = params?.initialRetrying === true

  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex)
  const [progress, setProgress] = useState(freezeState ? initialProgress : 0)
  const [failure, setFailure] = useState<FailureType>(initialFailure)
  const [isRetrying, setIsRetrying] = useState(initialRetrying)
  const [retryKey, setRetryKey] = useState(0)
  const animRef = useRef<number>(0)
  const stepTimerRef = useRef<number>(0)

  const currentStep = STEPS[currentStepIndex] || STEPS[0]
  const isDone = currentStep.key === 'done'
  const isFailed = failure != null
  const isRestartPhase = currentStep.key === 'restarting' || currentStep.key === 'reconnecting'

  // Animate progress within the current step (skipped in freeze mode)
  useEffect(() => {
    if (freezeState) return
    if (isDone || isFailed) {
      if (isDone) setProgress(100)
      return
    }

    const [start, end] = currentStep.progressRange
    const stepDuration = currentStep.duration
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const t = Math.min(1, elapsed / stepDuration)
      const eased = 1 - Math.pow(1 - t, 2)
      const value = Math.round(start + (end - start) * eased)
      setProgress(value)

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }

    animRef.current = requestAnimationFrame(animate)

    stepTimerRef.current = window.setTimeout(() => {
      if (currentStepIndex < STEPS.length - 1) {
        setCurrentStepIndex(prev => prev + 1)
      }
    }, stepDuration)

    return () => {
      cancelAnimationFrame(animRef.current)
      clearTimeout(stepTimerRef.current)
    }
  }, [currentStepIndex, failure, retryKey, freezeState])

  const simulateFailure = () => {
    if (isDone || isFailed || isRetrying) return
    cancelAnimationFrame(animRef.current)
    clearTimeout(stepTimerRef.current)

    const key = currentStep.key
    if (key === 'downloading') setFailure('download_failed')
    else if (key === 'updating_app' || key === 'updating_firmware') setFailure('update_interrupted')
    else if (key === 'restarting' || key === 'reconnecting') setFailure('reconnect_failed')
  }

  const handleRetry = () => {
    setIsRetrying(true)
    setFailure(null)
    setTimeout(() => {
      setIsRetrying(false)
      setRetryKey(prev => prev + 1)
    }, 1000)
  }

  // Ring & colors
  const ringColor = isFailed ? colors.danger : isDone ? colors.success : isRestartPhase ? '#F5A623' : colors.primary
  const bgTint = isFailed
    ? 'rgba(255, 59, 48, 0.06)'
    : isDone
      ? 'rgba(73, 174, 123, 0.08)'
      : isRestartPhase
        ? 'rgba(245, 166, 35, 0.08)'
        : 'rgba(22, 91, 195, 0.06)'

  const failureInfo = failure ? FAILURE_CONFIG[failure] : null

  // Simplified 4-dot indicator: Download → Update → Restart → Done
  const dots = ['Download', 'Update', 'Restart', 'Done']
  const getDotState = (dotIndex: number) => {
    // Map dots to step ranges
    const dotToStepRange: [number, number][] = [
      [0, 0],    // Download = step 0
      [1, 2],    // Update = steps 1-2
      [3, 4],    // Restart = steps 3-4
      [5, 5],    // Done = step 5
    ]
    const [rangeStart, rangeEnd] = dotToStepRange[dotIndex]

    if (isFailed && currentStepIndex >= rangeStart && currentStepIndex <= rangeEnd) return 'failed'
    if (currentStepIndex > rangeEnd) return 'complete'
    if (currentStepIndex >= rangeStart && currentStepIndex <= rangeEnd) return isDone ? 'complete' : 'active'
    return 'pending'
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
        {(isDone || isFailed) && (
          <button
            onClick={pop}
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
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
        padding: '32px 24px',
        gap: 24,
      }}>

        {/* Glasses with status ring */}
        <div
          onClick={simulateFailure}
          title={undefined} // simulateFailure still works on click, tooltip hidden
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: bgTint,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'background 0.5s ease',
            cursor: !isDone && !isFailed ? 'pointer' : 'default',
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
              strokeDashoffset={`${2 * Math.PI * 76 * (1 - progress / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
              style={{ transition: 'stroke-dashoffset 0.3s ease-out, stroke 0.5s ease' }}
            />
          </svg>

          {/* Center content */}
          {isDone ? (
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
          {!isDone && !isFailed && !isRetrying && !isRestartPhase && (
            <div style={{
              position: 'absolute', inset: -2, borderRadius: '50%',
              border: '2px solid transparent', borderTopColor: colors.primary,
              animation: 'spin 2s linear infinite', opacity: 0.2,
            }} />
          )}
        </div>

        {/* Progress percentage */}
        <div style={{
          fontSize: '52px',
          fontWeight: fonts.weight.bold,
          fontFamily: fonts.family,
          color: isFailed ? colors.danger : isDone ? colors.success : isRestartPhase ? '#F5A623' : colors.primary,
          lineHeight: 1,
          transition: 'color 0.5s ease',
        }}>
          {isFailed ? '' : `${progress}%`}
        </div>

        {/* Label */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: fonts.size.xxl,
            fontWeight: fonts.weight.semibold,
            fontFamily: fonts.family,
            color: isFailed ? colors.danger : isRestartPhase ? '#F5A623' : colors.almostBlack,
            marginBottom: 8,
          }}>
            {isFailed ? failureInfo?.title : isRetrying ? 'Retrying...' : currentStep.label}
          </div>
          <div style={{
            fontSize: fonts.size.md,
            color: colors.neutral,
            fontFamily: fonts.family,
            lineHeight: 1.5,
            maxWidth: 300,
            margin: '0 auto',
          }}>
            {isFailed ? failureInfo?.message : isRetrying ? 'Reconnecting and restarting...' : currentStep.sublabel}
          </div>
        </div>

        {/* Step indicators — 4 clean dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 4 }}>
          {dots.map((label, i) => {
            const state = getDotState(i)
            const dotColor = state === 'failed' ? colors.danger
              : state === 'complete' ? colors.success
              : state === 'active' ? (isRestartPhase && i === 2 ? '#F5A623' : colors.primary)
              : colors.neutralGray
            const icon = state === 'failed' ? '!' : state === 'complete' ? '\u2713' : String(i + 1)

            return (
              <React.Fragment key={label}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: dotColor,
                  color: state === 'pending' ? colors.neutral400 : colors.white,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: fonts.size.sm, fontWeight: fonts.weight.bold, fontFamily: fonts.family,
                  transition: 'all 0.4s ease',
                }}>
                  {icon}
                </div>
                {i < dots.length - 1 && (
                  <div style={{
                    width: 40, height: 3, borderRadius: 2,
                    background: state === 'failed' ? colors.danger
                      : state === 'complete' ? colors.success
                      : colors.neutralGray,
                    transition: 'background 0.4s ease',
                  }} />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Tap hint (prototype only, hidden during export) */}
        {!isDone && !isFailed && (
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
        {isDone ? (
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
