/**
 * Current Feature Export
 *
 * This file is maintained by Claude. Do not edit manually.
 * Press 'E' in the prototype to export these screens as a zip.
 *
 * Updated by Claude each time a feature is built or modified.
 */

const fw = { freezeState: true, updatePreset: '3_updates' }

export const CURRENT_EXPORT = {
  feature: 'firmware-update-flow',
  label: 'Firmware Update Flow',
  screens: [
    // ── Happy path: 3 sequential updates ──

    // Update 1 of 3 — downloading
    { screen: 'FirmwareUpdate', name: 'update-1-downloading', params: { ...fw, initialUpdateIndex: 0, initialPhaseIndex: 0, initialProgress: 40, initialCompletedUpdates: 0 }, delay: 1500 },

    // Update 1 of 3 — installing
    { screen: 'FirmwareUpdate', name: 'update-1-installing', params: { ...fw, initialUpdateIndex: 0, initialPhaseIndex: 1, initialProgress: 65, initialCompletedUpdates: 0 }, delay: 1500 },

    // Update 2 of 3 — downloading (1 complete)
    { screen: 'FirmwareUpdate', name: 'update-2-downloading', params: { ...fw, initialUpdateIndex: 1, initialPhaseIndex: 0, initialProgress: 30, initialCompletedUpdates: 1 }, delay: 1500 },

    // Update 2 of 3 — installing (1 complete)
    { screen: 'FirmwareUpdate', name: 'update-2-installing', params: { ...fw, initialUpdateIndex: 1, initialPhaseIndex: 1, initialProgress: 55, initialCompletedUpdates: 1 }, delay: 1500 },

    // Update 3 of 3 — downloading (2 complete)
    { screen: 'FirmwareUpdate', name: 'update-3-downloading', params: { ...fw, initialUpdateIndex: 2, initialPhaseIndex: 0, initialProgress: 45, initialCompletedUpdates: 2 }, delay: 1500 },

    // Update 3 of 3 — installing (2 complete)
    { screen: 'FirmwareUpdate', name: 'update-3-installing', params: { ...fw, initialUpdateIndex: 2, initialPhaseIndex: 1, initialProgress: 70, initialCompletedUpdates: 2 }, delay: 1500 },

    // Glasses restarting
    { screen: 'FirmwareUpdate', name: 'glasses-restarting', params: { ...fw, initialUpdateIndex: 2, initialPhaseIndex: 2, initialProgress: 50, initialCompletedUpdates: 2 }, delay: 1500 },

    // Reconnecting
    { screen: 'FirmwareUpdate', name: 'reconnecting', params: { ...fw, initialUpdateIndex: 2, initialPhaseIndex: 3, initialProgress: 60, initialCompletedUpdates: 2 }, delay: 1500 },

    // All done — with What's New
    { screen: 'FirmwareUpdate', name: 'all-done', params: { ...fw, initialAllDone: true, initialProgress: 100, initialCompletedUpdates: 3 }, delay: 1500 },

    // ── Error states ──

    // Download failed — 0 of 3 complete
    { screen: 'FirmwareUpdate', name: 'error-download-failed', params: { ...fw, initialUpdateIndex: 0, initialPhaseIndex: 0, initialProgress: 25, initialCompletedUpdates: 0, initialFailure: 'download_failed' }, delay: 1500 },

    // Update interrupted — 1 of 3 complete (failed during update 2)
    { screen: 'FirmwareUpdate', name: 'error-update-interrupted', params: { ...fw, initialUpdateIndex: 1, initialPhaseIndex: 1, initialProgress: 40, initialCompletedUpdates: 1, initialFailure: 'update_interrupted' }, delay: 1500 },

    // Reconnect failed — 2 of 3 complete (failed during restart)
    { screen: 'FirmwareUpdate', name: 'error-reconnect-failed', params: { ...fw, initialUpdateIndex: 2, initialPhaseIndex: 2, initialProgress: 30, initialCompletedUpdates: 2, initialFailure: 'reconnect_failed' }, delay: 1500 },
  ] as { screen: string; name: string; params?: Record<string, unknown>; delay?: number; base?: { screen: string; params?: Record<string, unknown> }; seedFeedback?: { reportId: string; name: string; message: string }; scrollToBottom?: boolean }[],
}
