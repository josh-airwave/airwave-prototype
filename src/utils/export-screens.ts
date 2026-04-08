/**
 * Current Feature Export
 *
 * This file is maintained by Claude. Do not edit manually.
 * Press 'E' in the prototype to export these screens as a zip.
 *
 * Updated by Claude each time a feature is built or modified.
 */

const blueBase = { screen: 'Blue', params: { channelId: 'blue', channelType: 'blue' } }
const reportId = 'vr4'

export const CURRENT_EXPORT = {
  feature: 'share-report-flow',
  label: 'Share Report Flow',
  screens: [
    // ── 1. Blue Feed — starting point ──
    { screen: 'Blue', name: 'blue-feed', params: { channelId: 'blue', channelType: 'blue' }, delay: 1500 },

    // ── 2. Share Drawer (overlay on Blue) ──
    { screen: 'ShareFlow', name: 'share-drawer', params: { reportId, initialStep: 'drawer' }, base: blueBase, delay: 1500 },

    // ── 3. Share to Chat — channel picker ──
    { screen: 'ShareFlow', name: 'share-to-chat', params: { reportId, initialStep: 'chat_list' }, base: blueBase, delay: 1500 },

    // ── 4. Share Externally — native share sheet ──
    { screen: 'ShareFlow', name: 'share-sheet', params: { reportId, initialStep: 'share_sheet' }, base: blueBase, delay: 1500 },

    // ── 5. iMessage compose — before sending ──
    { screen: 'ShareFlow', name: 'imessage-compose', params: { reportId, initialStep: 'imessage' }, base: blueBase, delay: 1500 },

    // ── 6. iMessage sent — delivered message ──
    { screen: 'ShareFlow', name: 'imessage-sent', params: { reportId, initialStep: 'imessage', initialSent: true }, base: blueBase, delay: 1500 },

    // ── 7. Report viewed notification ──
    { screen: 'ShareFlow', name: 'notif-viewed', params: { reportId, initialStep: 'done', initialSent: true, initialShowViewed: true }, base: blueBase, delay: 1500 },

    // ── 8. Helpful feedback notification ──
    { screen: 'ShareFlow', name: 'notif-feedback', params: { reportId, initialStep: 'done', initialSent: true, initialShowViewed: true, initialShowFeedback: true }, base: blueBase, delay: 1500 },

    // ── 9. External Report — top of page ──
    { screen: 'ExternalReport', name: 'report-top', params: { reportId, skipLoading: true }, delay: 2000 },

    // ── 10. External Report — helpful / not helpful buttons ──
    { screen: 'ExternalReport', name: 'report-feedback-buttons', params: { reportId, skipLoading: true }, delay: 2000 },

    // ── 11. Helpful selected — thank you confirmation ──
    { screen: 'ExternalReport', name: 'report-helpful-submitted', params: { reportId, skipLoading: true, initialFeedbackState: 'submitted' }, delay: 2000 },

    // ── 12. Not Helpful form — empty ──
    { screen: 'ExternalReport', name: 'report-not-helpful-form', params: { reportId, skipLoading: true, initialFeedbackState: 'not_helpful_form' }, delay: 2000 },

    // ── 13. Not Helpful form — filled out ──
    { screen: 'ExternalReport', name: 'report-not-helpful-filled', params: { reportId, skipLoading: true, initialFeedbackState: 'not_helpful_form', initialFeedbackName: 'Sarah Chen', initialFeedbackMessage: 'The hourly actuals for hours 5-8 are hard to read. Could you re-record that section of the board?' }, delay: 2000 },

    // ── 14. Not Helpful submitted — thank you + View in Blue Feed button ──
    { screen: 'ExternalReport', name: 'report-not-helpful-submitted', params: { reportId, skipLoading: true, initialFeedbackState: 'submitted' }, delay: 2000 },

    // ── 15. Blue Feed — Not Helpful feedback card visible ──
    { screen: 'Blue', name: 'blue-feed-with-feedback', params: { channelId: 'blue', channelType: 'blue' }, delay: 1500, seedFeedback: { reportId: 'vr4', name: 'Sarah Chen', message: 'The hourly actuals for hours 5-8 are hard to read. Could you re-record that section of the board?' } },
  ] as { screen: string; name: string; params?: Record<string, unknown>; delay?: number; base?: { screen: string; params?: Record<string, unknown> }; seedFeedback?: { reportId: string; name: string; message: string } }[],
}
