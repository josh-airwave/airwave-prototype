/**
 * Current Feature Export
 *
 * This file is maintained by Claude. Do not edit manually.
 * Press 'E' in the prototype to export these screens as a zip.
 *
 * Updated by Claude each time a feature is built or modified.
 */

const blueBase = { screen: 'Blue', params: { channelId: 'blue', channelType: 'blue' } }

export const CURRENT_EXPORT = {
  feature: 'share-report-flow',
  label: 'Share Report Flow',
  screens: [
    // ── Blue Feed ──
    { screen: 'Blue', name: 'blue-feed', params: { channelId: 'blue', channelType: 'blue' }, delay: 1500 },

    // ── Share Drawer (overlay on Blue) ──
    { screen: 'ShareFlow', name: 'share-drawer', params: { reportId: 'vr1', initialStep: 'drawer' }, base: blueBase, delay: 1500 },

    // ── Share to Chat (overlay on Blue) ──
    { screen: 'ShareFlow', name: 'share-to-chat', params: { reportId: 'vr1', initialStep: 'chat_list' }, base: blueBase, delay: 1500 },

    // ── Share Externally (overlay on Blue) ──
    { screen: 'ShareFlow', name: 'share-externally', params: { reportId: 'vr1', initialStep: 'share_sheet' }, base: blueBase, delay: 1500 },

    // ── iMessage share (overlay on Blue) ──
    { screen: 'ShareFlow', name: 'share-imessage', params: { reportId: 'vr1', initialStep: 'imessage' }, base: blueBase, delay: 1500 },

    // ── Share done (overlay on Blue) ──
    { screen: 'ShareFlow', name: 'share-done', params: { reportId: 'vr1', initialStep: 'done' }, base: blueBase, delay: 2500 },

    // ── External Report (top) ──
    { screen: 'ExternalReport', name: 'report-top', params: { reportId: 'vr1', skipLoading: true }, delay: 2000 },

    // ── External Report (feedback: helpful/not helpful) ──
    { screen: 'ExternalReport', name: 'report-feedback-default', params: { reportId: 'vr1', skipLoading: true }, delay: 2000 },

    // ── External Report (not helpful form) ──
    { screen: 'ExternalReport', name: 'report-feedback-form', params: { reportId: 'vr1', skipLoading: true, initialFeedbackState: 'not_helpful_form' }, delay: 2000 },

    // ── External Report (not helpful form filled) ──
    { screen: 'ExternalReport', name: 'report-feedback-form-filled', params: { reportId: 'vr1', skipLoading: true, initialFeedbackState: 'not_helpful_form', initialFeedbackName: 'Sarah Chen', initialFeedbackMessage: 'The report was missing the pressure readings from the second shift. Would be helpful to include all shifts.' }, delay: 2000 },

    // ── External Report (submitted confirmation) ──
    { screen: 'ExternalReport', name: 'report-feedback-submitted', params: { reportId: 'vr1', skipLoading: true, initialFeedbackState: 'submitted' }, delay: 2000 },

    // ── Blue Feed with Not Helpful card ──
    { screen: 'Blue', name: 'blue-feed-with-feedback', params: { channelId: 'blue', channelType: 'blue' }, delay: 1500 },
  ] as { screen: string; name: string; params?: Record<string, unknown>; delay?: number; base?: { screen: string; params?: Record<string, unknown> } }[],
}
