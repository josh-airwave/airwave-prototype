/**
 * Current Feature Export
 *
 * This file is maintained by Claude. Do not edit manually.
 * Press 'E' in the prototype to export these screens as a zip.
 *
 * Updated by Claude each time a feature is built or modified.
 */

export const CURRENT_EXPORT = {
  feature: 'firmware-update',
  label: 'Firmware Update Flow',
  screens: [
    // ── Entry point ──
    { screen: 'ChannelList', name: 'home-glasses-connected', delay: 1200 },

    // ── Happy path ──
    { screen: 'FirmwareUpdate', name: 'step1-downloading', params: { freezeState: true, initialStepIndex: 0, initialProgress: 12 } },
    { screen: 'FirmwareUpdate', name: 'step2-updating-glasses', params: { freezeState: true, initialStepIndex: 1, initialProgress: 49 } },
    { screen: 'FirmwareUpdate', name: 'step3-restarting', params: { freezeState: true, initialStepIndex: 3, initialProgress: 89 } },
    { screen: 'FirmwareUpdate', name: 'step4-reconnecting', params: { freezeState: true, initialStepIndex: 4, initialProgress: 96 } },
    { screen: 'FirmwareUpdate', name: 'complete-all-set', params: { freezeState: true, initialStepIndex: 5, initialProgress: 100 } },

    // ── Failure states ──
    { screen: 'FirmwareUpdate', name: 'error-download-failed', params: { freezeState: true, initialStepIndex: 0, initialProgress: 12, initialFailure: 'download_failed' } },
    { screen: 'FirmwareUpdate', name: 'error-update-interrupted', params: { freezeState: true, initialStepIndex: 2, initialProgress: 68, initialFailure: 'update_interrupted' } },
    { screen: 'FirmwareUpdate', name: 'error-reconnect-failed', params: { freezeState: true, initialStepIndex: 4, initialProgress: 96, initialFailure: 'reconnect_failed' } },

    // ── Retry state ──
    { screen: 'FirmwareUpdate', name: 'retrying', params: { freezeState: true, initialStepIndex: 0, initialProgress: 12, initialRetrying: true } },
  ] as { screen: string; name: string; params?: Record<string, unknown>; delay?: number }[],
}
