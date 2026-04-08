export interface User {
  id: string
  name: string
  avatar: string
  title?: string
  location?: string
  online?: boolean
}

export interface Channel {
  id: string
  name: string
  type: 'group' | 'dm' | 'channel' | 'blue'
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount?: number
  members?: User[]
  muted?: boolean
}

// Blue AI card — generated from shared media
export interface BlueCard {
  id: string
  title: string
  summary: string
  mediaPreview?: string[]  // thumbnail URLs for the media mosaic
  videoUrl?: string        // if the card is from a video
  fileCount: number
  sharedBy: User
  buttons: ('View Report' | 'Share')[]
  replyCount?: number
  reportId?: string        // links to a VideoIntelReport
}

export interface Message {
  id: string
  senderId: string
  type: 'text' | 'audio' | 'image' | 'video' | 'link' | 'system'
  content: string
  timestamp: string
  date?: string              // For date separators: 'Friday, Apr 03', 'Today, Apr 06'
  reactions?: { emoji: string; count: number }[]
  audioDuration?: string
  imageUrl?: string
  videoUrl?: string             // Video URL for video messages
  videoDuration?: string        // Duration label for video thumbnail e.g. "0:48"
  linkPreview?: { title: string; url: string; image?: string }
  replyTo?: string
  replyCount?: number        // Thread reply pill count
  readCount?: number         // Eye icon count
  heardCount?: number        // Speaker icon count
  failed?: boolean           // Failed to send indicator
}

export interface Report {
  id: string
  title: string
  summary: string
  type: 'inspection' | 'safety' | 'daily_recap' | 'shift_summary'
  date: string
  sharedBy: User
  videoThumbnail: string
  fileCount: number
  threadCount?: number
  tags?: string[]
}

// --- Video Intelligence Report Types ---

export interface OcrField {
  id: string
  label: string
  value: string
  confidence: number       // 0-1, Blue's confidence in the reading
  frameTimestamp: number    // seconds into the video where this was captured
  frameUrl: string         // source frame image URL
  edited?: boolean         // tech corrected this field
  editedValue?: string     // the corrected value
  bbox?: { x: number; y: number; w: number; h: number }  // normalized 0-1 coords for highlight box
}

export interface DetectedObject {
  id: string
  label: string
  count: number
  confidence: number
  frameTimestamp: number
  frameUrl: string
  details?: string         // e.g. "United Rentals" brand, serial number
  bbox?: { x: number; y: number; w: number; h: number }  // normalized 0-1 coords for highlight box
}

export interface VideoIntelReport {
  id: string
  title: string
  templateName: string
  machine?: string
  location?: string
  technician: string
  date: string
  time: string
  sourceVideoUrl: string
  sourceVideoThumbnail: string
  ocrFields: OcrField[]
  detectedObjects: DetectedObject[]
  summary: string
  status: 'draft' | 'reviewed' | 'submitted'
}

export interface GalleryItem {
  id: string
  type: 'photo' | 'video'
  thumbnail: string
  videoUrl?: string
  duration?: string
  date: string
  time: string
}

export interface LeaderboardEntry {
  user: User
  points: number
  rank: number
}

export interface PointsBreakdown {
  category: string
  description: string
  pointsPerAction: number
  totalPoints: number
}

export interface ReplyThread {
  id: string
  title: string
  channel: string
  replyCount: number
  summary: string
  participants: User[]
  timestamp: string
}

export interface SavedMessage {
  id: string
  channel: string
  sender: User
  content: string
  timestamp: string
  type: 'text' | 'link'
  linkUrl?: string
}

export interface Workspace {
  id: string
  name: string
  avatar: string
  unreadCount?: number
}

// --- Mock Users ---
export const users: User[] = [
  { id: '1', name: 'Josh Lee', avatar: 'https://i.pravatar.cc/80?u=josh', title: 'CEO', location: 'California', online: true },
  { id: '2', name: 'Pankaj Prasad', avatar: 'https://i.pravatar.cc/80?u=pankaj', title: 'CTO', online: true },
  { id: '3', name: 'Vijai Anand', avatar: 'https://i.pravatar.cc/80?u=vijai', title: 'CTO @ Airwave', online: true },
  { id: '4', name: 'Darcy Bonner', avatar: 'https://i.pravatar.cc/80?u=darcy', title: 'Head of Customer', online: true },
  { id: '5', name: 'Santi', avatar: 'https://i.pravatar.cc/80?u=santi', online: true },
  { id: '6', name: 'Ram', avatar: 'https://i.pravatar.cc/80?u=ram', title: 'QA Lead', online: false },
  { id: '7', name: 'Ty Lim', avatar: 'https://i.pravatar.cc/80?u=tylim', title: 'Chief Shipping Officer', online: false },
  { id: '8', name: 'Murali', avatar: 'https://i.pravatar.cc/80?u=murali', online: true },
  { id: '9', name: 'Shree', avatar: 'https://i.pravatar.cc/80?u=shree', title: 'Tester', online: false },
  { id: '10', name: 'Airwave Support', avatar: 'https://i.pravatar.cc/80?u=support', online: true },
  { id: '11', name: 'Blue', avatar: 'https://i.pravatar.cc/80?u=blue-ai', title: 'AI Assistant', online: true },
  { id: '12', name: 'Meagan Faryna', avatar: 'https://i.pravatar.cc/80?u=meagan', online: false },
  { id: '13', name: 'Rajesh', avatar: 'https://i.pravatar.cc/80?u=rajesh', title: 'Full Stack Developer', online: false },
  { id: '14', name: 'Heather Rees', avatar: 'https://i.pravatar.cc/80?u=heather', online: true },
  { id: '15', name: 'David Triana', avatar: 'https://i.pravatar.cc/80?u=david', online: false },
  { id: '16', name: 'Kelli Harper', avatar: 'https://i.pravatar.cc/80?u=kelli', title: 'Production Tech', online: false },
]

export const currentUser = users[0]

// --- Mock Channels ---
export const channels: Channel[] = [
  { id: 'blue', name: 'Blue', type: 'blue', avatar: '/avatars/blue-avatar.png', lastMessage: 'Daily Blue Testing and Insights report ready', lastMessageTime: '4:11 PM' },
  { id: 'c1', name: 'Backend', type: 'group', avatar: 'icon:gear', lastMessage: '@Vijai anand  please review...', lastMessageTime: '10:42 PM', members: Array.from({ length: 19 }, (_, i) => users[i % users.length]) },
  { id: 'c2', name: 'App', type: 'channel', avatar: 'icon:app', lastMessage: 'I would like to know if this...', lastMessageTime: '10:23 PM' },
  { id: 'c3', name: 'Voice to Voice PoC', type: 'channel', avatar: 'icon:waveform', lastMessage: 'The voice options is prett...', lastMessageTime: '9:52 PM', unreadCount: 1 },
  { id: 'c4', name: 'Murali', type: 'dm', avatar: 'https://i.pravatar.cc/80?u=murali', lastMessage: 'Murali reacted 👍 to "Let me..."', lastMessageTime: '9:43 PM' },
  { id: 'c5', name: 'Airwave 500', type: 'channel', avatar: 'icon:trophy', lastMessage: 'I see - the mobile experie...', lastMessageTime: '9:39 PM' },
  { id: 'c6', name: 'Sales Insights', type: 'channel', avatar: 'icon:chart', lastMessage: 'New lead from Delta Faucet...', lastMessageTime: '8:42 PM' },
  { id: 'c7', name: 'Pankaj Prasad and Santi', type: 'group', avatar: 'icon:group', lastMessage: 'Attachment: 1 Image', lastMessageTime: '9:27 AM' },
  { id: 'c8', name: 'Vijai anand', type: 'dm', avatar: 'https://i.pravatar.cc/80?u=vijai', lastMessage: 'Side note, is there a way y...', lastMessageTime: '9:22 AM' },
  { id: 'c9', name: 'General', type: 'channel', avatar: 'icon:chat', lastMessage: 'Ram reacted 👍 to "@Pankaj P..."', lastMessageTime: '9:22 AM' },
  { id: 'c10', name: 'Darcy Bonner', type: 'dm', avatar: 'https://i.pravatar.cc/80?u=darcy', lastMessage: 'Hey @Josh - I set up time...', lastMessageTime: '9:11 AM' },
  { id: 'c11', name: 'Design', type: 'channel', avatar: 'icon:design', lastMessage: 'Updated the mockups for...', lastMessageTime: '8:45 AM' },
  { id: 'c12', name: 'Releases', type: 'channel', avatar: 'icon:rocket', lastMessage: 'v2.96 deployed to prod...', lastMessageTime: '8:30 AM' },
]

// --- Mock Messages ---
export const chatMessages: Record<string, Message[]> = {
  // Backend channel — matches production app screenshots
  c1: [
    // --- Friday, Apr 03 ---
    { id: 'b1', senderId: '6', type: 'video', content: '@Vijai anand can you pls check? for some question, Blue isn\'t giving the right answers', timestamp: '10:15 PM', date: 'Friday, Apr 03', videoUrl: '/media/videos/video-1.mp4', videoDuration: '0:50', replyCount: 8, readCount: 15 },
    { id: 'b2', senderId: '2', type: 'audio', content: 'This is fixed now we upgraded the model to gpt 5 which is more intelligent and follows the prompts correctly so this should be fixed now', timestamp: '10:42 PM', date: 'Friday, Apr 03', readCount: 15 },
    { id: 'b3', senderId: '1', type: 'text', content: '@Sundar Merged these', timestamp: '10:55 PM', date: 'Friday, Apr 03', readCount: 15 },
    { id: 'b4', senderId: '6', type: 'video', content: '@vijay am getting summary but i don\'t get the proper responses in DMV @Vijai anand', timestamp: '11:04 PM', date: 'Friday, Apr 03', videoUrl: '/media/videos/video-11.mp4', videoDuration: '0:29', readCount: 15 },

    // --- Today, Apr 06 ---
    { id: 'b5', senderId: '2', type: 'video', content: 'Here is the firmware OTA update flow recording', timestamp: '10:58 PM', date: 'Today, Apr 06', videoUrl: '/media/videos/video-5.mp4', videoDuration: '0:14', readCount: 15 },
    { id: 'b6', senderId: '5', type: 'link', content: '', timestamp: '11:05 PM', date: 'Today, Apr 06', linkPreview: { title: 'stagecoreapi.wvlnth.net', url: 'stagecoreapi.wvlnth.net', image: 'https://placehold.co/400x200/165BC3/165BC3?text=+' } },
    { id: 'b7', senderId: '5', type: 'text', content: '@Sundar is this the final URL? https://stagecoreapi.wvlnth.net/sg_firmwares', timestamp: '11:05 PM', date: 'Today, Apr 06' },
    { id: 'b8', senderId: '5', type: 'text', content: 'I\'m getting error 401', timestamp: '11:06 PM', date: 'Today, Apr 06' },
    { id: 'b9', senderId: '5', type: 'audio', content: 'oh, my mistake, not sending the token... sorry', timestamp: '11:06 PM', date: 'Today, Apr 06', failed: true, readCount: 13, heardCount: 1 },
  ],
  c7: [
    { id: 'm1', senderId: '2', type: 'link', content: '', timestamp: '9:25 AM', linkPreview: { title: 'BES Progress', url: 'web.wvlnth.net/dashboard', image: 'https://placehold.co/400x220/165BC3/ffffff?text=BES+Progress' } },
    { id: 'm2', senderId: '2', type: 'text', content: 'Progress (0, 0, BES Progress: success)', timestamp: '9:25 AM' },
    { id: 'm3', senderId: '2', type: 'text', content: 'Progress (0, 100, BES Progress: update)', timestamp: '9:25 AM' },
    { id: 'm4', senderId: '2', type: 'audio', content: 'BES updated but had to turn off glasses and force close app the first time to get the wifi to connect to the glasses', timestamp: '9:26 AM', audioDuration: '0:24' },
    { id: 'm5', senderId: '1', type: 'text', content: 'Confirmed in the xy app. I will try and update my other glasses now as well', timestamp: '9:27 AM' },
    { id: 'm6', senderId: '1', type: 'video', content: '', timestamp: '9:27 AM', videoUrl: '/media/videos/video-12.mp4', videoDuration: '0:22' },
    { id: 'm7', senderId: '1', type: 'audio', content: 'Thank you.', timestamp: '9:28 AM', audioDuration: '0:04' },
  ],
  // App channel
  c2: [
    { id: 'a1', senderId: '3', type: 'text', content: 'I would like to know if this new build fixes the crash on launch', timestamp: '10:10 PM', readCount: 8 },
    { id: 'a2', senderId: '6', type: 'video', content: 'Here is a screen recording of the crash', timestamp: '10:15 PM', videoUrl: '/media/videos/video-4.mp4', videoDuration: '0:35', readCount: 8 },
    { id: 'a3', senderId: '1', type: 'text', content: '@Ram can you try clearing the cache and reinstalling?', timestamp: '10:18 PM', readCount: 8 },
    { id: 'a4', senderId: '6', type: 'video', content: 'This is the error I see after reinstalling', timestamp: '10:20 PM', videoUrl: '/media/videos/video-13.mp4', videoDuration: '0:18', readCount: 8 },
    { id: 'a5', senderId: '2', type: 'audio', content: 'Ok I found the issue, it was a missing migration on the database side. Pushing a fix now.', timestamp: '10:23 PM', readCount: 8 },
  ],
  // Voice to Voice PoC channel
  c3: [
    { id: 'v1', senderId: '1', type: 'text', content: 'Could you please remember to test the voice latency with the new endpoint?', timestamp: '9:31 AM', readCount: 5 },
    { id: 'v2', senderId: '2', type: 'text', content: 'Yes, testing now. The voice options are pretty good actually.', timestamp: '9:45 PM', readCount: 5 },
    { id: 'v3', senderId: '5', type: 'video', content: 'Quick demo of the voice response time', timestamp: '9:48 PM', videoUrl: '/media/videos/video-3.mp4', videoDuration: '0:15', readCount: 5 },
    { id: 'v4', senderId: '5', type: 'audio', content: 'Quick update on the voice testing', timestamp: '9:50 PM', audioDuration: '0:32', readCount: 5 },
    { id: 'v5', senderId: '2', type: 'text', content: 'Latency is around 200ms which is acceptable', timestamp: '9:52 PM', readCount: 5 },
  ],
  // Murali DM
  c4: [
    { id: 'd1', senderId: '8', type: 'text', content: 'Hey, I just finished testing the glasses pairing flow', timestamp: '9:30 PM', readCount: 1 },
    { id: 'd2', senderId: '8', type: 'video', content: 'Check out this recording of the pairing sequence', timestamp: '9:32 PM', videoUrl: '/media/videos/video-7.mp4', videoDuration: '0:58', readCount: 1 },
    { id: 'd3', senderId: '1', type: 'text', content: 'Looks good! The animation is smooth', timestamp: '9:35 PM', readCount: 1 },
    { id: 'd4', senderId: '8', type: 'video', content: '', timestamp: '9:38 PM', videoUrl: '/media/videos/video-14.mp4', videoDuration: '0:25', readCount: 1 },
    { id: 'd5', senderId: '8', type: 'audio', content: 'Let me know if you want me to test anything else before we ship', timestamp: '9:43 PM', audioDuration: '0:08', readCount: 1 },
  ],
  // Airwave 500
  c5: [
    { id: 'aw1', senderId: '4', type: 'text', content: 'I see - the mobile experience for the leaderboard needs work', timestamp: '9:20 PM', readCount: 12 },
    { id: 'aw2', senderId: '4', type: 'video', content: 'This is what it looks like on an iPhone SE', timestamp: '9:25 PM', videoUrl: '/media/videos/video-1.mp4', videoDuration: '0:50', readCount: 12 },
    { id: 'aw3', senderId: '1', type: 'text', content: '@Darcy Bonner good catch, we need to adjust the layout for smaller screens', timestamp: '9:30 PM', readCount: 12 },
    { id: 'aw4', senderId: '7', type: 'video', content: 'Here is the full walkthrough on a small screen', timestamp: '9:35 PM', videoUrl: '/media/videos/video-6.mp4', videoDuration: '1:00', readCount: 12 },
    { id: 'aw5', senderId: '4', type: 'text', content: 'The points breakdown page is especially hard to read', timestamp: '9:39 PM', readCount: 12 },
  ],
  // Sales Insights
  c6: [
    { id: 's1', senderId: '4', type: 'text', content: 'New lead from Delta Faucet - they want a demo next week', timestamp: '8:30 PM', readCount: 6 },
    { id: 's2', senderId: '4', type: 'video', content: 'Their current warehouse setup', timestamp: '8:33 PM', videoUrl: '/media/videos/video-12.mp4', videoDuration: '0:22', readCount: 6 },
    { id: 's3', senderId: '1', type: 'text', content: 'Great, I will set up the call. @Darcy Bonner can you prep the deck?', timestamp: '8:38 PM', readCount: 6 },
    { id: 's4', senderId: '7', type: 'audio', content: 'I spoke with their VP of operations, they are very interested in the hands free documentation feature', timestamp: '8:42 PM', audioDuration: '0:15', readCount: 6 },
  ],
  // Vijai anand DM
  c8: [
    { id: 'va1', senderId: '3', type: 'text', content: 'Side note, is there a way you can make Blue respond faster for the enterprise clients?', timestamp: '9:00 AM', readCount: 1 },
    { id: 'va2', senderId: '1', type: 'text', content: 'Yes, we are working on edge caching for the most common queries', timestamp: '9:10 AM', readCount: 1 },
    { id: 'va3', senderId: '3', type: 'video', content: 'Watch this - the response takes 4 seconds on JCI', timestamp: '9:15 AM', videoUrl: '/media/videos/video-8.mp4', videoDuration: '0:15', readCount: 1 },
    { id: 'va4', senderId: '1', type: 'text', content: 'That is too slow. Let me look into it today', timestamp: '9:22 AM', readCount: 1 },
  ],
  // General
  c9: [
    { id: 'g1m', senderId: '6', type: 'text', content: 'Ram reacted 👍 to "@Pankaj Prasad great work on the release"', timestamp: '9:00 AM', readCount: 18 },
    { id: 'g2m', senderId: '2', type: 'video', content: 'Team lunch today!', timestamp: '9:05 AM', videoUrl: '/media/videos/video-11.mp4', videoDuration: '0:29', readCount: 18 },
    { id: 'g3m', senderId: '5', type: 'video', content: 'Office tour for the new hires', timestamp: '9:10 AM', videoUrl: '/media/videos/video-9.mp4', videoDuration: '0:31', readCount: 18 },
    { id: 'g4m', senderId: '8', type: 'text', content: 'Welcome aboard everyone! 🎉', timestamp: '9:15 AM', readCount: 18 },
    { id: 'g5m', senderId: '1', type: 'audio', content: 'Quick reminder - all hands meeting at 2pm today in the main conference room', timestamp: '9:22 AM', audioDuration: '0:11', readCount: 18 },
  ],
  // Darcy Bonner DM
  c10: [
    { id: 'db1', senderId: '4', type: 'text', content: 'Hey @Josh - I set up time with the Morgantown team for Thursday', timestamp: '8:50 AM', readCount: 1 },
    { id: 'db2', senderId: '1', type: 'text', content: 'Perfect, I will prep the demo glasses', timestamp: '8:55 AM', readCount: 1 },
    { id: 'db3', senderId: '4', type: 'video', content: 'BTW here is the walkthrough they sent of their facility', timestamp: '9:00 AM', videoUrl: '/media/videos/video-10.mp4', videoDuration: '0:41', readCount: 1 },
    { id: 'db4', senderId: '4', type: 'video', content: 'And the floor plan', timestamp: '9:05 AM', videoUrl: '/media/videos/video-13.mp4', videoDuration: '0:18', readCount: 1 },
    { id: 'db5', senderId: '1', type: 'text', content: 'Got it, thanks! This will help with the demo setup', timestamp: '9:11 AM', readCount: 1 },
  ],
  // Design
  c11: [
    { id: 'de1', senderId: '7', type: 'text', content: 'Updated the mockups for the new settings page', timestamp: '8:30 AM', readCount: 7 },
    { id: 'de2', senderId: '7', type: 'video', content: 'Here is the new layout', timestamp: '8:32 AM', videoUrl: '/media/videos/video-14.mp4', videoDuration: '0:25', readCount: 7 },
    { id: 'de3', senderId: '1', type: 'text', content: 'Love the clean look. Can we also update the icons?', timestamp: '8:38 AM', readCount: 7 },
    { id: 'de4', senderId: '7', type: 'video', content: 'Prototype animation of the transition', timestamp: '8:40 AM', videoUrl: '/media/videos/video-2.mp4', videoDuration: '1:18', readCount: 7 },
    { id: 'de5', senderId: '7', type: 'text', content: 'Will update icons in the next pass', timestamp: '8:45 AM', readCount: 7 },
  ],
  // Releases
  c12: [
    { id: 'r1', senderId: '2', type: 'text', content: 'v2.96 deployed to prod. All smoke tests passing.', timestamp: '8:15 AM', readCount: 14 },
    { id: 'r2', senderId: '2', type: 'video', content: 'Dashboard showing all green', timestamp: '8:18 AM', videoUrl: '/media/videos/video-1.mp4', videoDuration: '0:50', readCount: 14 },
    { id: 'r3', senderId: '6', type: 'video', content: 'Full regression test recording', timestamp: '8:22 AM', videoUrl: '/media/videos/mma-audit.mp4', videoDuration: '1:23', readCount: 14 },
    { id: 'r4', senderId: '1', type: 'text', content: 'Great work team. Smooth release. 🚀', timestamp: '8:30 AM', readCount: 14 },
  ],
}

// --- Blue AI Cards ---
export const blueCards: BlueCard[] = [
  {
    id: 'bc1',
    title: 'MT 06 Tool 104 219 — Machine Audit',
    summary: 'Blue processed 1:23 of video from the injection molding controller display at MT 06 Tool 104 219. OCR extracted cycle parameters including injection speed, pressure, cushion time, fill time, plasticizing time, and cycle time from the Nissei controller screen.',
    videoUrl: '/media/videos/mma-audit.mp4',
    fileCount: 1,
    sharedBy: users[0],
    buttons: ['View Report', 'Share'],
    replyCount: 2,
    reportId: 'vr1',
  },
  {
    id: 'bc2',
    title: 'Production Whiteboard — Shift Tracking',
    summary: 'Blue processed video of the hour-by-hour production whiteboard at Delta Faucet Jackson. OCR extracted hourly goal, cumulative goal, hourly actual, and cumulative actual counts for all 8 hours of the shift from the handwritten tracking board.',
    videoUrl: '/media/videos/whiteboard.mp4',
    fileCount: 1,
    sharedBy: users[0],
    buttons: ['View Report', 'Share'],
    replyCount: 1,
    reportId: 'vr2',
  },
  {
    id: 'bc3',
    title: 'Yard Equipment Inventory',
    summary: 'Blue processed video from the equipment yard at Bay 1-2. Object detection identified scissor lifts, boom lifts, a forklift, and a dumpster. OCR captured serial numbers and brand labels from United Rentals and Republic Services equipment.',
    videoUrl: '/media/videos/machine-yard.mp4',
    fileCount: 1,
    sharedBy: users[2],
    buttons: ['View Report', 'Share'],
    replyCount: 0,
    reportId: 'vr3',
  },
  {
    id: 'bc4',
    title: 'Hour-by-Hour Production Sheet — Kelli Harper',
    summary: 'Blue processed video of the hour-by-hour production sheet recorded by Kelli Harper at Delta Faucet Jackson. OCR extracted hourly goal, cumulative goal, hourly actual, and cumulative actual counts for all 8 hours of the shift.',
    videoUrl: '/media/videos/hour-by-hour-sheet.mp4',
    fileCount: 1,
    sharedBy: users[15],
    buttons: ['View Report', 'Share'],
    replyCount: 0,
    reportId: 'vr4',
  },
]

// --- Mock Reports (Blue AI) ---
export const reports: Report[] = [
  {
    id: 'r1',
    title: 'Daily Project & Report Updates',
    summary: 'This video transcript covers updates on editing and saving reports, developing an Electron app for processing Mitsubishi Electric PDFs, tracking tech imports and...',
    type: 'daily_recap',
    date: 'Mar 24, 2026',
    sharedBy: users[0],
    videoThumbnail: 'https://placehold.co/320x180/1e3a5f/ffffff?text=Daily+Recap',
    fileCount: 1,
  },
  {
    id: 'r2',
    title: 'Airwave Smart Glasses Shift Summary',
    summary: "Shift Summary: What We Built, Why, and How to Test It describes Airwave's smart glasses used at Delta Faucet's Morgantown plant for recording machine audits and g...",
    type: 'shift_summary',
    date: 'Mar 23, 2026',
    sharedBy: users[2],
    videoThumbnail: 'https://placehold.co/320x180/1a1a2e/ffffff?text=Shift+Summary',
    fileCount: 1,
  },
  {
    id: 'r3',
    title: 'FMV3 SLV4 Control Panel Inspection',
    summary: 'FMV3 SLV4 Control Panel inspection report details a scheduled wiring and verification task for the PrimSat Low Voltage Panel at Mt. Juliet 1. Technician T...',
    type: 'inspection',
    date: 'Mar 21, 2026',
    sharedBy: users[4],
    videoThumbnail: 'https://placehold.co/320x180/064e3b/ffffff?text=Inspection+Report',
    fileCount: 1,
  },
  {
    id: 'r4',
    title: 'March 16, 2026 Daily Recap',
    summary: 'This daily summary for March 16, 2026, covers a Friday update process, onboarding a Tetra Tech technician for DoD soil sampling in Indian Head, Maryla...',
    type: 'daily_recap',
    date: 'Mar 16, 2026',
    sharedBy: users[0],
    videoThumbnail: 'https://placehold.co/320x180/1e3a5f/ffffff?text=Mar+16+Recap',
    fileCount: 1,
  },
  {
    id: 'r5',
    title: 'Budget Racing Challenge',
    summary: 'Participants discussed a unique racing event involving $500 cars. The challenge is to keep the cars running for 20 hours on the track. The experience and creativity of maintaining these vehicles received admi...',
    type: 'daily_recap',
    date: 'Mar 21, 2026',
    sharedBy: users[0],
    videoThumbnail: 'https://placehold.co/320x180/7c3aed/ffffff?text=Racing+Challenge',
    fileCount: 1,
    threadCount: 1,
    tags: ['#Random'],
  },
]

// --- Mock Gallery (real media from /public/media/) ---
export const galleryItems: GalleryItem[] = [
  // Mar 23, 2026 batch
  { id: 'g1', type: 'video', thumbnail: '/media/images/pexels-cottonbro-4489737.jpg', videoUrl: '/media/videos/video-1.mp4', duration: '00:50', date: 'Mar 23, 2026', time: '4:40 PM' },
  { id: 'g2', type: 'video', thumbnail: '/media/images/pexels-thisisengineering-3861438.jpg', videoUrl: '/media/videos/video-2.mp4', duration: '01:18', date: 'Mar 23, 2026', time: '4:40 PM' },
  { id: 'g3', type: 'video', thumbnail: '/media/images/pexels-cottonbro-4489765.jpg', videoUrl: '/media/videos/video-3.mp4', duration: '00:15', date: 'Mar 23, 2026', time: '4:40 PM' },
  { id: 'g4', type: 'video', thumbnail: '/media/images/pexels-tiger-lily-4481258.jpg', videoUrl: '/media/videos/video-4.mp4', duration: '00:35', date: 'Mar 23, 2026', time: '4:40 PM' },
  { id: 'g5', type: 'video', thumbnail: '/media/images/pexels-tiger-lily-4481532.jpg', videoUrl: '/media/videos/video-5.mp4', duration: '00:14', date: 'Mar 23, 2026', time: '4:40 PM' },
  { id: 'g6', type: 'video', thumbnail: '/media/images/pexels-tiger-lily-4483608.jpg', videoUrl: '/media/videos/video-6.mp4', duration: '01:00', date: 'Mar 23, 2026', time: '4:40 PM' },
  { id: 'g7', type: 'photo', thumbnail: '/media/images/pexels-alexazabache-3757147.jpg', date: 'Mar 23, 2026', time: '4:40 PM' },
  { id: 'g8', type: 'photo', thumbnail: '/media/images/pexels-jopwell-1325725.jpg', date: 'Mar 23, 2026', time: '4:40 PM' },
  // Mar 13, 2026 batch
  { id: 'g9', type: 'video', thumbnail: '/media/images/pexels-watorious-4025501.jpg', videoUrl: '/media/videos/video-7.mp4', duration: '00:58', date: 'Mar 13, 2026', time: '9:01 PM' },
  { id: 'g10', type: 'video', thumbnail: '/media/images/pexels-marosmarkovic-1451416.jpg', videoUrl: '/media/videos/video-8.mp4', duration: '00:15', date: 'Mar 13, 2026', time: '9:01 PM' },
  { id: 'g11', type: 'video', thumbnail: '/media/images/pexels-jibarofoto-1659747.jpg', videoUrl: '/media/videos/video-9.mp4', duration: '00:31', date: 'Mar 13, 2026', time: '9:01 PM' },
  { id: 'g12', type: 'photo', thumbnail: '/media/images/pexels-kseniachernaya-5691639.jpg', date: 'Mar 13, 2026', time: '9:01 PM' },
  { id: 'g13', type: 'photo', thumbnail: '/media/images/pexels-jacobyclarkephoto-1579356.jpg', date: 'Mar 13, 2026', time: '9:01 PM' },
  { id: 'g14', type: 'photo', thumbnail: '/media/images/pexels-thiagomobile-2317640.jpg', date: 'Mar 13, 2026', time: '9:01 PM' },
  // Mar 8, 2026 batch
  { id: 'g15', type: 'video', thumbnail: '/media/images/mma-audit-thumb.jpg', videoUrl: '/media/videos/mma-audit.mp4', duration: '01:23', date: 'Mar 8, 2026', time: '2:15 PM' },
  { id: 'g16', type: 'video', videoUrl: '/media/videos/whiteboard.mp4', thumbnail: '/media/videos/whiteboard.mp4', duration: '00:41', date: 'Mar 8, 2026', time: '2:15 PM' },
  { id: 'g17', type: 'video', videoUrl: '/media/videos/machine-yard.mp4', thumbnail: '/media/videos/machine-yard.mp4', duration: '00:29', date: 'Mar 8, 2026', time: '2:15 PM' },
  { id: 'g18', type: 'photo', thumbnail: '/media/images/pexels-thisisengineering-3861438.jpg', date: 'Mar 8, 2026', time: '2:15 PM' },
]

// --- Mock Leaderboard ---
export const leaderboard: LeaderboardEntry[] = [
  { user: users[1], points: 142680, rank: 1 },
  { user: users[5], points: 59890, rank: 2 },
  { user: users[6], points: 55720, rank: 3 },
  { user: users[4], points: 48900, rank: 4 },
  { user: users[3], points: 46080, rank: 5 },
  { user: users[2], points: 29930, rank: 6 },
  { user: users[0], points: 18160, rank: 7 },
  { user: users[8], points: 14540, rank: 8 },
  { user: { id: 'ps', name: 'PS Hariharan', avatar: 'https://i.pravatar.cc/80?u=ps' }, points: 9190, rank: 9 },
  { user: users[12], points: 7570, rank: 10 },
  { user: users[11], points: 7000, rank: 11 },
  { user: users[7], points: 6380, rank: 12 },
]

export const pointsBreakdown: PointsBreakdown[] = [
  { category: 'Reactions', description: 'React to a question or answer.', pointsPerAction: 5, totalPoints: 6030 },
  { category: 'Recorded', description: 'Record a message over 10 seconds', pointsPerAction: 10, totalPoints: 1720 },
  { category: 'Ask Question in Blue', description: 'Ask a question in Blue', pointsPerAction: 20, totalPoints: 2380 },
  { category: 'Add video in chat', description: 'Add new video in chat', pointsPerAction: 25, totalPoints: 6025 },
  { category: 'Add Video to Blue', description: 'Add new video to Blue', pointsPerAction: 30, totalPoints: 2070 },
]

// --- Mock Reply Threads ---
export const replyThreads: ReplyThread[] = [
  {
    id: 'rt1',
    title: 'Title Pending',
    channel: '#Voice to Voice PoC',
    replyCount: 1,
    summary: '',
    participants: [users[0], users[2]],
    timestamp: 'Mar 24, 9:07 AM',
  },
  {
    id: 'rt2',
    title: 'Gateway Timeout Investigation',
    channel: '#General',
    replyCount: 8,
    summary: 'Participants reported gateway timeout (504) errors and bad gateway issues affecting message delivery. They discussed experiences across platforms and asked for diagnostics. The root cause remains unclear due to limited monitoring information.',
    participants: [users[0], users[1], users[2], users[3], users[4]],
    timestamp: 'Mar 24, 8:35 AM',
  },
  {
    id: 'rt3',
    title: 'Meeting Cancellation Discussion',
    channel: '#General',
    replyCount: 3,
    summary: 'Team discussed rescheduling the Friday standup meeting.',
    participants: [users[0], users[3]],
    timestamp: 'Mar 24, 7:49 AM',
  },
]

// --- Mock Saved Messages ---
export const savedMessages: SavedMessage[] = [
  {
    id: 'sm1',
    channel: '#Darcy Bonner',
    sender: users[3],
    content: '',
    timestamp: 'Mar 13, 9:48 AM',
    type: 'link',
    linkUrl: 'https://docs.google.com/presentation/d/1L5lLvq1HxOOVMtwO6i6WyyH74KBSBfgOLHXgoQ68a20/edit',
  },
  {
    id: 'sm2',
    channel: '#Releases',
    sender: users[2],
    content: 'Hey Team, We are planning to deploy the Backend changes for these features',
    timestamp: 'Mar 13, 12:34 AM',
    type: 'text',
  },
]

// --- Mock Workspaces ---
export const workspaces: Workspace[] = [
  { id: 'w1', name: 'Airwave HQ', avatar: '🏢' },
  { id: 'w2', name: 'Delta Faucet - Morg...', avatar: '🔺' },
  { id: 'w3', name: 'JCI Glasses Sandbox', avatar: '🔬' },
  { id: 'w4', name: 'ICE GROUP CHI...', avatar: '🧊', unreadCount: 2 },
  { id: 'w5', name: 'E3 Pro', avatar: '⚡' },
]

// --- Inspection Report Templates ---
export const reportTemplates = [
  { id: 'rt1', name: 'f350.csv', type: 'inspection' as const },
  { id: 'rt2', name: 'ssg.csv', type: 'inspection' as const },
  { id: 'rt3', name: 'agi.csv', type: 'inspection' as const },
  { id: 'rt4', name: 'm07.csv', type: 'inspection' as const },
  { id: 'rt5', name: 'daily.csv', type: 'inspection' as const },
]

// --- Video Intelligence Reports ---
const frameBase = '/media/images/pexels-cottonbro-4489737.jpg' // placeholder for source frames

export const videoIntelReports: VideoIntelReport[] = [
  // --- vr1: MMA Machine Controller Display ---
  {
    id: 'vr1',
    title: 'MT 06 Tool 104 219 — Machine Audit',
    templateName: 'Injection Molding Machine Audit',
    machine: 'MT 06 Tool 104 219',
    location: 'Delta Faucet — Jackson, TN',
    technician: 'Josh Lee',
    date: 'Apr 07, 2026',
    time: '3:42 PM CDT',
    sourceVideoUrl: '/media/videos/mma-audit.mp4',
    sourceVideoThumbnail: '/media/videos/mma-audit.mp4',
    status: 'draft',
    summary: 'Blue processed 1:23 of video from the Nissei SI-200-6S H450E Φ46 controller (No. 62, Monitor Data screen) at MT 06 Tool 104 219. OCR extracted cycle parameters, process settings, and 227 shots of cycle data from the controller screen.',
    ocrFields: [
      // Row 1 — top parameter bar on controller display
      { id: 'ocr-screw-pos', label: 'Screw Position', value: '2.057 in', confidence: 0.95, frameTimestamp: 2.1, frameUrl: frameBase, bbox: { x: 0.20, y: 0.20, w: 0.35, h: 0.06 } },
      { id: 'ocr-inj-speed', label: 'Injection Speed', value: '-0.11 in/s', confidence: 0.96, frameTimestamp: 2.1, frameUrl: frameBase, bbox: { x: 0.20, y: 0.20, w: 0.35, h: 0.06 } },
      { id: 'ocr-inj-pressure', label: 'Injection Pressure', value: '125 in/10Pa', confidence: 0.78, frameTimestamp: 2.1, frameUrl: frameBase, bbox: { x: 0.38, y: 0.12, w: 0.25, h: 0.06 } },
      { id: 'ocr-rev', label: 'REV', value: '35 rpm', confidence: 0.97, frameTimestamp: 2.1, frameUrl: frameBase, bbox: { x: 0.64, y: 0.12, w: 0.12, h: 0.06 } },
      { id: 'ocr-clamp-pos', label: 'Clamp Position', value: '0.000 in', confidence: 0.87, frameTimestamp: 2.1, frameUrl: frameBase, bbox: { x: 0.77, y: 0.06, w: 0.18, h: 0.05 } },
      { id: 'ocr-ej-pos', label: 'Ejector Position', value: '0.000 in', confidence: 0.97, frameTimestamp: 2.1, frameUrl: frameBase, bbox: { x: 0.77, y: 0.12, w: 0.18, h: 0.06 } },
      // Row 2 — second parameter bar
      { id: 'ocr-cycle-time', label: 'Cycle Time (Objective)', value: '59.34s', confidence: 0.95, frameTimestamp: 2.1, frameUrl: frameBase, bbox: { x: 0.05, y: 0.19, w: 0.18, h: 0.06 } },
      { id: 'ocr-cushion-pos', label: 'Cushion Position', value: '0.209 in', confidence: 0.94, frameTimestamp: 2.1, frameUrl: frameBase, bbox: { x: 0.28, y: 0.19, w: 0.18, h: 0.06 } },
      { id: 'ocr-min-cushion', label: 'Min Cushion Position', value: '0.209 in', confidence: 0.93, frameTimestamp: 2.1, frameUrl: frameBase, bbox: { x: 0.28, y: 0.19, w: 0.18, h: 0.06 } },
      { id: 'ocr-fill-time', label: 'Fill Injection Time', value: '0.51s', confidence: 0.93, frameTimestamp: 2.1, frameUrl: frameBase, bbox: { x: 0.48, y: 0.19, w: 0.18, h: 0.06 } },
      { id: 'ocr-plast-time', label: 'Plasticizing Time', value: '14.37s', confidence: 0.91, frameTimestamp: 2.1, frameUrl: frameBase, bbox: { x: 0.68, y: 0.19, w: 0.18, h: 0.06 } },
    ],
    detectedObjects: [
      { id: 'obj-display', label: 'Machine Controller Display', count: 1, confidence: 0.98, frameTimestamp: 2.0, frameUrl: frameBase, details: 'Nissei SI-200-6S H450E Φ46, Controller No. 62, Monitor Data screen', bbox: { x: 0.05, y: 0.03, w: 0.90, h: 0.90 } },
      { id: 'obj-data-table', label: 'Shot Data Table', count: 1, confidence: 0.94, frameTimestamp: 5.0, frameUrl: frameBase, details: '227 shots logged, columns: Cycle Time, Injection Time, Pack Press, Cushion Position, Plast. Time, Heater Temp', bbox: { x: 0.05, y: 0.30, w: 0.90, h: 0.60 } },
    ],
  },
  // --- vr2: Production Whiteboard ---
  {
    id: 'vr2',
    title: 'Production Whiteboard — Shift Tracking',
    templateName: 'Hour-by-Hour Production Report',
    machine: 'MT 06 Tool 104 219',
    location: 'Delta Faucet — Jackson, TN',
    technician: 'Josh Lee',
    date: 'Apr 07, 2026',
    time: '4:15 PM CDT',
    sourceVideoUrl: '/media/videos/whiteboard.mp4',
    sourceVideoThumbnail: '/media/videos/whiteboard.mp4',
    status: 'draft',
    summary: 'Blue processed video of the hour-by-hour production whiteboard. OCR extracted hourly goal and cumulative goal counts for all 8 hours of the shift.',
    ocrFields: [
      { id: 'ocr1', label: 'HR 1 — Hourly Goal', value: '25', confidence: 0.97, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.69, w: 0.14, h: 0.05 } },
      { id: 'ocr2', label: 'HR 1 — Cumulative Goal', value: '25', confidence: 0.97, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.69, w: 0.16, h: 0.05 } },
      { id: 'ocr3', label: 'HR 2 — Hourly Goal', value: '28', confidence: 0.94, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.74, w: 0.14, h: 0.05 } },
      { id: 'ocr4', label: 'HR 2 — Cumulative Goal', value: '53', confidence: 0.91, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.74, w: 0.16, h: 0.05 } },
      { id: 'ocr5', label: 'HR 3 — Hourly Goal', value: '23', confidence: 0.96, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.79, w: 0.14, h: 0.05 } },
      { id: 'ocr6', label: 'HR 3 — Cumulative Goal', value: '76', confidence: 0.89, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.79, w: 0.16, h: 0.05 } },
      { id: 'ocr7', label: 'HR 4 — Hourly Goal', value: '28', confidence: 0.93, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.84, w: 0.14, h: 0.05 } },
      { id: 'ocr8', label: 'HR 4 — Cumulative Goal', value: '104', confidence: 0.87, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.84, w: 0.16, h: 0.05 } },
      { id: 'ocr9', label: 'HR 5 — Hourly Goal', value: '25', confidence: 0.95, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.89, w: 0.14, h: 0.05 } },
      { id: 'ocr10', label: 'HR 5 — Cumulative Goal', value: '129', confidence: 0.84, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.89, w: 0.16, h: 0.05 } },
      { id: 'ocr11', label: 'HR 6 — Hourly Goal', value: '23', confidence: 0.94, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.94, w: 0.14, h: 0.05 } },
      { id: 'ocr12', label: 'HR 6 — Cumulative Goal', value: '152', confidence: 0.78, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.94, w: 0.16, h: 0.05 } },
      { id: 'ocr13', label: 'HR 7 — Hourly Goal', value: '28', confidence: 0.92, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.69, w: 0.14, h: 0.05 } },
      { id: 'ocr14', label: 'HR 7 — Cumulative Goal', value: '180', confidence: 0.76, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.69, w: 0.16, h: 0.05 } },
      { id: 'ocr15', label: 'HR 8 — Hourly Goal', value: '25', confidence: 0.93, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.74, w: 0.14, h: 0.05 } },
      { id: 'ocr16', label: 'HR 8 — Cumulative Goal', value: '205', confidence: 0.81, frameTimestamp: 3.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.74, w: 0.16, h: 0.05 } },
    ],
    detectedObjects: [
      { id: 'obj-whiteboard', label: 'Production Whiteboard', count: 1, confidence: 0.96, frameTimestamp: 3.0, frameUrl: frameBase, details: 'Hour-by-hour tracking board', bbox: { x: 0.05, y: 0.10, w: 0.90, h: 0.80 } },
    ],
  },
  // --- vr3: Yard Equipment Inventory ---
  {
    id: 'vr3',
    title: 'Yard Equipment Inventory',
    templateName: 'Equipment Audit',
    location: 'Jackson Yard — Bay 1-2',
    technician: 'Josh Lee',
    date: 'Apr 07, 2026',
    time: '2:15 PM CDT',
    sourceVideoUrl: '/media/videos/machine-yard.mp4',
    sourceVideoThumbnail: '/media/videos/machine-yard.mp4',
    status: 'reviewed',
    summary: 'Blue processed video of equipment yard inspection. OCR identified rental source as United Rentals (800-UR-RENTS). Object detection cataloged 1 orange scissor lift under inspection, 3 boom lifts, 5 red scissor lifts, 1 forklift, and open battery compartment.',
    ocrFields: [
      { id: 'yocr1', label: 'Rental Company Phone', value: '800-UR-RENTS', confidence: 0.94, frameTimestamp: 2.0, frameUrl: '/images/yard1.png', bbox: { x: 0.22, y: 0.06, w: 0.50, h: 0.04 } },
    ],
    detectedObjects: [
      { id: 'obj1', label: 'Scissor Lift (Underside)', count: 1, confidence: 0.98, frameTimestamp: 2.0, frameUrl: '/images/yard1.png', details: 'Orange electric scissor lift, scissors raised, hydraulic cylinder and X-pattern linkage visible', bbox: { x: 0.05, y: 0.18, w: 0.90, h: 0.60 } },
      { id: 'obj2', label: 'Scissor Lift (Side)', count: 1, confidence: 0.97, frameTimestamp: 24.5, frameUrl: '/images/yard4.png', details: 'Same unit, side/rear view — warning labels, non-marking rubber tires, hydraulic hoses along arms', bbox: { x: 0.0, y: 0.50, w: 0.85, h: 0.45 } },
      { id: 'obj3', label: 'Battery Compartment', count: 1, confidence: 0.96, frameTimestamp: 5.0, frameUrl: '/images/yard2.png', details: 'Open battery bay with lead-acid cells, white terminal caps, black cable wiring', bbox: { x: 0.40, y: 0.52, w: 0.50, h: 0.28 } },
      { id: 'obj4', label: 'Forklift', count: 1, confidence: 0.95, frameTimestamp: 5.0, frameUrl: '/images/yard4.png', details: 'Yellow, parked inside loading Bay 2', bbox: { x: 0.0, y: 0.08, w: 0.30, h: 0.38 } },
      { id: 'obj5', label: 'Boom Lift Fleet', count: 3, confidence: 0.91, frameTimestamp: 12.0, frameUrl: '/images/yard3.png', details: 'Orange articulated and blue boom lifts in rental depot yard', bbox: { x: 0.05, y: 0.02, w: 0.75, h: 0.35 } },
      { id: 'obj6', label: 'Red Scissor Lift Cluster', count: 5, confidence: 0.89, frameTimestamp: 12.0, frameUrl: '/images/yard3.png', details: 'Cluster of red scissor lifts (Genie/Skyjack style) in yard', bbox: { x: 0.20, y: 0.08, w: 0.50, h: 0.30 } },
    ],
  },
  // --- vr4: Kelli Harper Hour-by-Hour Sheet ---
  {
    id: 'vr4',
    title: 'Hour-by-Hour Production Sheet — Kelli Harper',
    templateName: 'Hour-by-Hour Production Report',
    machine: 'MT 06 Tool 104 219',
    location: 'Delta Faucet — Jackson, TN',
    technician: 'Kelli Harper',
    date: 'Apr 07, 2026',
    time: '5:30 PM CDT',
    sourceVideoUrl: '/media/videos/hour-by-hour-sheet.mp4',
    sourceVideoThumbnail: '/media/videos/hour-by-hour-sheet.mp4',
    status: 'draft',
    summary: 'Blue processed video of the hour-by-hour production sheet recorded by Kelli Harper. OCR extracted hourly goal, cumulative goal, hourly actual, and cumulative actual counts for the shift.',
    ocrFields: [
      { id: 'kh-ocr1', label: 'HR 1 — Hourly Goal', value: '25', confidence: 0.96, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.69, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr2', label: 'HR 1 — Cumulative Goal', value: '25', confidence: 0.95, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.69, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr3', label: 'HR 1 — Hourly Actual', value: '27', confidence: 0.93, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.46, y: 0.69, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr4', label: 'HR 1 — Cumulative Actual', value: '27', confidence: 0.92, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.62, y: 0.69, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr5', label: 'HR 2 — Hourly Goal', value: '28', confidence: 0.94, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.74, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr6', label: 'HR 2 — Cumulative Goal', value: '53', confidence: 0.91, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.74, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr7', label: 'HR 2 — Hourly Actual', value: '30', confidence: 0.90, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.46, y: 0.74, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr8', label: 'HR 2 — Cumulative Actual', value: '57', confidence: 0.88, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.62, y: 0.74, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr9', label: 'HR 3 — Hourly Goal', value: '23', confidence: 0.95, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.79, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr10', label: 'HR 3 — Cumulative Goal', value: '76', confidence: 0.89, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.79, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr11', label: 'HR 3 — Hourly Actual', value: '22', confidence: 0.87, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.46, y: 0.79, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr12', label: 'HR 3 — Cumulative Actual', value: '79', confidence: 0.85, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.62, y: 0.79, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr13', label: 'HR 4 — Hourly Goal', value: '28', confidence: 0.93, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.84, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr14', label: 'HR 4 — Cumulative Goal', value: '104', confidence: 0.87, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.84, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr15', label: 'HR 4 — Hourly Actual', value: '26', confidence: 0.89, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.46, y: 0.84, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr16', label: 'HR 4 — Cumulative Actual', value: '105', confidence: 0.84, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.62, y: 0.84, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr17', label: 'HR 5 — Hourly Goal', value: '25', confidence: 0.95, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.89, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr18', label: 'HR 5 — Cumulative Goal', value: '129', confidence: 0.83, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.89, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr19', label: 'HR 5 — Hourly Actual', value: '24', confidence: 0.88, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.46, y: 0.89, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr20', label: 'HR 5 — Cumulative Actual', value: '129', confidence: 0.82, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.62, y: 0.89, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr21', label: 'HR 6 — Hourly Goal', value: '23', confidence: 0.94, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.94, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr22', label: 'HR 6 — Cumulative Goal', value: '152', confidence: 0.79, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.94, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr23', label: 'HR 6 — Hourly Actual', value: '25', confidence: 0.86, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.46, y: 0.94, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr24', label: 'HR 6 — Cumulative Actual', value: '154', confidence: 0.78, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.62, y: 0.94, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr25', label: 'HR 7 — Hourly Goal', value: '28', confidence: 0.92, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.69, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr26', label: 'HR 7 — Cumulative Goal', value: '180', confidence: 0.76, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.69, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr27', label: 'HR 7 — Hourly Actual', value: '29', confidence: 0.85, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.46, y: 0.69, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr28', label: 'HR 7 — Cumulative Actual', value: '183', confidence: 0.74, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.62, y: 0.69, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr29', label: 'HR 8 — Hourly Goal', value: '25', confidence: 0.93, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.12, y: 0.74, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr30', label: 'HR 8 — Cumulative Goal', value: '205', confidence: 0.80, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.28, y: 0.74, w: 0.16, h: 0.05 } },
      { id: 'kh-ocr31', label: 'HR 8 — Hourly Actual', value: '23', confidence: 0.84, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.46, y: 0.74, w: 0.14, h: 0.05 } },
      { id: 'kh-ocr32', label: 'HR 8 — Cumulative Actual', value: '206', confidence: 0.77, frameTimestamp: 2.0, frameUrl: frameBase, bbox: { x: 0.62, y: 0.74, w: 0.16, h: 0.05 } },
    ],
    detectedObjects: [
      { id: 'kh-obj1', label: 'Production Sheet', count: 1, confidence: 0.97, frameTimestamp: 2.0, frameUrl: frameBase, details: 'Hour-by-hour production tracking sheet', bbox: { x: 0.05, y: 0.10, w: 0.90, h: 0.80 } },
    ],
  },
]
