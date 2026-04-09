/**
 * Current Feature Export
 *
 * This file is maintained by Claude. Do not edit manually.
 * Press 'E' in the prototype to export these screens as a zip.
 *
 * Updated by Claude each time a feature is built or modified.
 */

const fw1 = { freezeState: true, updatePreset: '1_update' }
const fw2 = { freezeState: true, updatePreset: '2_updates' }
const fw3 = { freezeState: true, updatePreset: '3_updates' }

export const CURRENT_EXPORT = {
  feature: 'firmware-update-flow',
  label: 'Firmware Update Flow',
  screens: [
    // ── 1 update - happy path ──

    // Single update - downloading
    { screen: 'FirmwareUpdate', name: '1up-downloading', params: { ...fw1, initialUpdateIndex: 0, initialPhaseIndex: 0, initialProgress: 40, initialCompletedUpdates: 0 }, delay: 1500 },

    // Single update - installing
    { screen: 'FirmwareUpdate', name: '1up-installing', params: { ...fw1, initialUpdateIndex: 0, initialPhaseIndex: 1, initialProgress: 65, initialCompletedUpdates: 0 }, delay: 1500 },

    // Single update - glasses restarting
    { screen: 'FirmwareUpdate', name: '1up-restarting', params: { ...fw1, initialUpdateIndex: 0, initialPhaseIndex: 2, initialProgress: 50, initialCompletedUpdates: 0 }, delay: 1500 },

    // Single update - reconnecting
    { screen: 'FirmwareUpdate', name: '1up-reconnecting', params: { ...fw1, initialUpdateIndex: 0, initialPhaseIndex: 3, initialProgress: 60, initialCompletedUpdates: 0 }, delay: 1500 },

    // Single update - all done
    { screen: 'FirmwareUpdate', name: '1up-done', params: { ...fw1, initialAllDone: true, initialProgress: 100, initialCompletedUpdates: 1 }, delay: 1500 },

    // ── 1 update - error states ──

    { screen: 'FirmwareUpdate', name: '1up-error-download', params: { ...fw1, initialUpdateIndex: 0, initialPhaseIndex: 0, initialProgress: 25, initialCompletedUpdates: 0, initialFailure: 'download_failed' }, delay: 1500 },

    { screen: 'FirmwareUpdate', name: '1up-error-interrupted', params: { ...fw1, initialUpdateIndex: 0, initialPhaseIndex: 1, initialProgress: 40, initialCompletedUpdates: 0, initialFailure: 'update_interrupted' }, delay: 1500 },

    { screen: 'FirmwareUpdate', name: '1up-error-reconnect', params: { ...fw1, initialUpdateIndex: 0, initialPhaseIndex: 2, initialProgress: 30, initialCompletedUpdates: 0, initialFailure: 'reconnect_failed' }, delay: 1500 },

    // ── 2 updates - happy path ──

    // Update 1 of 2 - downloading
    { screen: 'FirmwareUpdate', name: '2up-1-downloading', params: { ...fw2, initialUpdateIndex: 0, initialPhaseIndex: 0, initialProgress: 40, initialCompletedUpdates: 0 }, delay: 1500 },

    // Update 1 of 2 - installing
    { screen: 'FirmwareUpdate', name: '2up-1-installing', params: { ...fw2, initialUpdateIndex: 0, initialPhaseIndex: 1, initialProgress: 65, initialCompletedUpdates: 0 }, delay: 1500 },

    // Update 2 of 2 - downloading (1 complete)
    { screen: 'FirmwareUpdate', name: '2up-2-downloading', params: { ...fw2, initialUpdateIndex: 1, initialPhaseIndex: 0, initialProgress: 30, initialCompletedUpdates: 1 }, delay: 1500 },

    // Update 2 of 2 - installing (1 complete)
    { screen: 'FirmwareUpdate', name: '2up-2-installing', params: { ...fw2, initialUpdateIndex: 1, initialPhaseIndex: 1, initialProgress: 55, initialCompletedUpdates: 1 }, delay: 1500 },

    // 2 updates - glasses restarting
    { screen: 'FirmwareUpdate', name: '2up-restarting', params: { ...fw2, initialUpdateIndex: 1, initialPhaseIndex: 2, initialProgress: 50, initialCompletedUpdates: 1 }, delay: 1500 },

    // 2 updates - reconnecting
    { screen: 'FirmwareUpdate', name: '2up-reconnecting', params: { ...fw2, initialUpdateIndex: 1, initialPhaseIndex: 3, initialProgress: 60, initialCompletedUpdates: 1 }, delay: 1500 },

    // 2 updates - all done
    { screen: 'FirmwareUpdate', name: '2up-done', params: { ...fw2, initialAllDone: true, initialProgress: 100, initialCompletedUpdates: 2 }, delay: 1500 },

    // ── 2 updates - error states ──

    // Download failed on update 1 (0 complete)
    { screen: 'FirmwareUpdate', name: '2up-error-download', params: { ...fw2, initialUpdateIndex: 0, initialPhaseIndex: 0, initialProgress: 25, initialCompletedUpdates: 0, initialFailure: 'download_failed' }, delay: 1500 },

    // Update interrupted on update 2 (1 complete)
    { screen: 'FirmwareUpdate', name: '2up-error-interrupted', params: { ...fw2, initialUpdateIndex: 1, initialPhaseIndex: 1, initialProgress: 40, initialCompletedUpdates: 1, initialFailure: 'update_interrupted' }, delay: 1500 },

    // Reconnect failed (1 complete)
    { screen: 'FirmwareUpdate', name: '2up-error-reconnect', params: { ...fw2, initialUpdateIndex: 1, initialPhaseIndex: 2, initialProgress: 30, initialCompletedUpdates: 1, initialFailure: 'reconnect_failed' }, delay: 1500 },

    // ── 3 updates - happy path ──

    // Update 1 of 3 - downloading
    { screen: 'FirmwareUpdate', name: '3up-1-downloading', params: { ...fw3, initialUpdateIndex: 0, initialPhaseIndex: 0, initialProgress: 40, initialCompletedUpdates: 0 }, delay: 1500 },

    // Update 1 of 3 - installing
    { screen: 'FirmwareUpdate', name: '3up-1-installing', params: { ...fw3, initialUpdateIndex: 0, initialPhaseIndex: 1, initialProgress: 65, initialCompletedUpdates: 0 }, delay: 1500 },

    // Update 2 of 3 - downloading (1 complete)
    { screen: 'FirmwareUpdate', name: '3up-2-downloading', params: { ...fw3, initialUpdateIndex: 1, initialPhaseIndex: 0, initialProgress: 30, initialCompletedUpdates: 1 }, delay: 1500 },

    // Update 2 of 3 - installing (1 complete)
    { screen: 'FirmwareUpdate', name: '3up-2-installing', params: { ...fw3, initialUpdateIndex: 1, initialPhaseIndex: 1, initialProgress: 55, initialCompletedUpdates: 1 }, delay: 1500 },

    // Update 3 of 3 - downloading (2 complete)
    { screen: 'FirmwareUpdate', name: '3up-3-downloading', params: { ...fw3, initialUpdateIndex: 2, initialPhaseIndex: 0, initialProgress: 45, initialCompletedUpdates: 2 }, delay: 1500 },

    // Update 3 of 3 - installing (2 complete)
    { screen: 'FirmwareUpdate', name: '3up-3-installing', params: { ...fw3, initialUpdateIndex: 2, initialPhaseIndex: 1, initialProgress: 70, initialCompletedUpdates: 2 }, delay: 1500 },

    // 3 updates - glasses restarting
    { screen: 'FirmwareUpdate', name: '3up-restarting', params: { ...fw3, initialUpdateIndex: 2, initialPhaseIndex: 2, initialProgress: 50, initialCompletedUpdates: 2 }, delay: 1500 },

    // 3 updates - reconnecting
    { screen: 'FirmwareUpdate', name: '3up-reconnecting', params: { ...fw3, initialUpdateIndex: 2, initialPhaseIndex: 3, initialProgress: 60, initialCompletedUpdates: 2 }, delay: 1500 },

    // 3 updates - all done
    { screen: 'FirmwareUpdate', name: '3up-done', params: { ...fw3, initialAllDone: true, initialProgress: 100, initialCompletedUpdates: 3 }, delay: 1500 },

    // ── 3 updates - error states ──

    // Download failed on update 1 (0 complete)
    { screen: 'FirmwareUpdate', name: '3up-error-download', params: { ...fw3, initialUpdateIndex: 0, initialPhaseIndex: 0, initialProgress: 25, initialCompletedUpdates: 0, initialFailure: 'download_failed' }, delay: 1500 },

    // Update interrupted on update 2 (1 complete)
    { screen: 'FirmwareUpdate', name: '3up-error-interrupted', params: { ...fw3, initialUpdateIndex: 1, initialPhaseIndex: 1, initialProgress: 40, initialCompletedUpdates: 1, initialFailure: 'update_interrupted' }, delay: 1500 },

    // Reconnect failed on update 3 (2 complete)
    { screen: 'FirmwareUpdate', name: '3up-error-reconnect', params: { ...fw3, initialUpdateIndex: 2, initialPhaseIndex: 2, initialProgress: 30, initialCompletedUpdates: 2, initialFailure: 'reconnect_failed' }, delay: 1500 },
  ] as { screen: string; name: string; params?: Record<string, unknown>; delay?: number; base?: { screen: string; params?: Record<string, unknown> }; seedFeedback?: { reportId: string; name: string; message: string }; scrollToBottom?: boolean }[],
}
