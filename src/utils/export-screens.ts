/**
 * Current Feature Export
 *
 * This file is maintained by Claude. Do not edit manually.
 * Press 'E' in the prototype to export these screens as a zip.
 *
 * Updated by Claude each time a feature is built or modified.
 */

export const CURRENT_EXPORT = {
  feature: 'fullscreen-viewer',
  label: 'Fullscreen Media Viewer',
  screens: [
    // ── Video states ──
    { screen: 'ImageZoom', name: 'video-playing', params: { videoUrl: '/media/videos/video-1.mp4', freezeState: true, initialPaused: false, initialProgress: 0.35, initialDuration: 50 }, delay: 2500 },
    { screen: 'ImageZoom', name: 'video-paused', params: { videoUrl: '/media/videos/video-1.mp4', freezeState: true, initialPaused: true, initialProgress: 0.52, initialDuration: 50 }, delay: 2500 },

    // ── Speed controls ──
    { screen: 'ImageZoom', name: 'video-speed-1.5x', params: { videoUrl: '/media/videos/video-3.mp4', freezeState: true, initialPaused: false, initialSpeed: 1.5, initialProgress: 0.4, initialDuration: 15 }, delay: 2500 },
    { screen: 'ImageZoom', name: 'video-speed-2x', params: { videoUrl: '/media/videos/video-3.mp4', freezeState: true, initialPaused: false, initialSpeed: 2, initialProgress: 0.6, initialDuration: 15 }, delay: 2500 },
    { screen: 'ImageZoom', name: 'video-speed-0.5x', params: { videoUrl: '/media/videos/video-3.mp4', freezeState: true, initialPaused: false, initialSpeed: 0.5, initialProgress: 0.25, initialDuration: 15 }, delay: 2500 },

    // ── Reverse playback ──
    { screen: 'ImageZoom', name: 'video-reverse', params: { videoUrl: '/media/videos/video-5.mp4', freezeState: true, initialReversed: true, initialProgress: 0.7, initialDuration: 14 }, delay: 2500 },

    // ── Muted ──
    { screen: 'ImageZoom', name: 'video-muted', params: { videoUrl: '/media/videos/video-5.mp4', freezeState: true, initialMuted: true, initialProgress: 0.45, initialDuration: 14 }, delay: 2500 },

    // ── Zoomed in (pinch to zoom) ──
    { screen: 'ImageZoom', name: 'video-zoomed-250', params: { videoUrl: '/media/videos/video-1.mp4', freezeState: true, initialScale: 2.5, initialProgress: 0.3, initialDuration: 50 }, delay: 2500 },
    { screen: 'ImageZoom', name: 'video-zoomed-400', params: { videoUrl: '/media/videos/video-3.mp4', freezeState: true, initialScale: 4, initialProgress: 0.5, initialDuration: 15 }, delay: 2500 },

    // ── Image viewer ──
    { screen: 'ImageZoom', name: 'image-viewer', params: { imageUrl: '/media/images/pexels-cottonbro-4489737.jpg' }, delay: 1500 },
    { screen: 'ImageZoom', name: 'image-zoomed', params: { imageUrl: '/media/images/pexels-cottonbro-4489737.jpg', freezeState: true, initialScale: 2.5 }, delay: 1500 },

    // ── Chat with video thumbnails ──
    { screen: 'Chat', name: 'chat-backend-videos', params: { channelId: 'c1' }, delay: 1500 },
    { screen: 'Chat', name: 'chat-voice-poc-videos', params: { channelId: 'c3' }, delay: 1500 },
  ] as { screen: string; name: string; params?: Record<string, unknown>; delay?: number }[],
}
