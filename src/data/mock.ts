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
}

export interface Message {
  id: string
  senderId: string
  type: 'text' | 'audio' | 'image' | 'video' | 'link' | 'system'
  content: string
  timestamp: string
  reactions?: { emoji: string; count: number }[]
  audioDuration?: string
  imageUrl?: string
  linkPreview?: { title: string; url: string; image?: string }
  replyTo?: string
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
]

export const currentUser = users[0]

// --- Mock Channels ---
export const channels: Channel[] = [
  { id: 'blue', name: 'Blue', type: 'blue', avatar: '/avatars/blue-avatar.png', lastMessage: 'Daily Blue Testing and Insights report ready', lastMessageTime: '4:11 PM' },
  { id: 'c1', name: 'Backend', type: 'channel', avatar: 'icon:gear', lastMessage: '@Vijai anand  please review...', lastMessageTime: '10:42 PM', members: [users[0], users[2], users[3]] },
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
  c7: [
    { id: 'm1', senderId: '2', type: 'image', content: '', timestamp: '9:25 AM', imageUrl: 'https://placehold.co/300x200/e0e7ff/4338ca?text=BES+Progress' },
    { id: 'm2', senderId: '2', type: 'text', content: 'Progress (0, 0, BES Progress: success)', timestamp: '9:25 AM' },
    { id: 'm3', senderId: '2', type: 'text', content: 'Progress (0, 100, BES Progress: update)', timestamp: '9:25 AM' },
    { id: 'm4', senderId: '2', type: 'audio', content: 'BES updated but had to turn off glasses and force close app the first time to get the wifi to connect to the glasses', timestamp: '9:26 AM', audioDuration: '0:24' },
    { id: 'm5', senderId: '1', type: 'text', content: 'Confirmed in the xy app. I will try and update my other glasses now as well', timestamp: '9:27 AM' },
    { id: 'm6', senderId: '1', type: 'image', content: '', timestamp: '9:27 AM', imageUrl: 'https://placehold.co/300x400/fef3c7/92400e?text=Glasses+Version+Screen' },
    { id: 'm7', senderId: '1', type: 'audio', content: 'Thank you.', timestamp: '9:28 AM', audioDuration: '0:04' },
  ],
  c3: [
    { id: 'v1', senderId: '1', type: 'text', content: 'Could you please remember to test the voice latency with the new endpoint?', timestamp: '9:31 AM' },
    { id: 'v2', senderId: '2', type: 'text', content: 'Yes, testing now. The voice options are pretty good actually.', timestamp: '9:45 PM' },
    { id: 'v3', senderId: '5', type: 'audio', content: 'Quick update on the voice testing', timestamp: '9:50 PM', audioDuration: '0:32' },
    { id: 'v4', senderId: '2', type: 'text', content: 'Latency is around 200ms which is acceptable', timestamp: '9:52 PM' },
  ],
}

// --- Blue AI Cards ---
export const blueCards: BlueCard[] = [
  {
    id: 'bc1',
    title: 'Daily Blue Testing and Insights',
    summary: 'This video transcript details a daily inspection and summary report involving testing Blue with Claude, conducting stress tests, analyzing responses, generating reports, and documenting field observations across multiple job sites during the morning shift.',
    videoUrl: '/media/videos/video-1.mp4',
    fileCount: 1,
    sharedBy: users[0],
    buttons: ['View Report', 'Share'],
    replyCount: 3,
  },
  {
    id: 'bc2',
    title: 'Elevator Inspection Summary',
    summary: 'Comprehensive review of elevator shaft installation progress, including structural assessment, safety compliance check, and remaining work items for completion. The inspection identified three areas requiring immediate attention before the next phase of construction can proceed.',
    videoUrl: '/media/videos/video-3.mp4',
    fileCount: 2,
    sharedBy: users[0],
    buttons: ['View Report', 'Share'],
    replyCount: 1,
  },
  {
    id: 'bc3',
    title: 'Site Walk-Through Documentation',
    summary: 'Recorded walk-through of the construction site capturing current progress on framing, electrical rough-in, and plumbing installation across all three floors. Key observations include completed header beams on floor two and pending HVAC ductwork routing on the ground level.',
    videoUrl: '/media/videos/video-5.mp4',
    fileCount: 1,
    sharedBy: users[2],
    buttons: ['View Report', 'Share'],
    replyCount: 0,
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
  { id: 'g16', type: 'video', thumbnail: '/media/images/pexels-umaraffan499-190417.jpg', videoUrl: '/media/videos/video-10.mp4', duration: '00:41', date: 'Mar 8, 2026', time: '2:15 PM' },
  { id: 'g17', type: 'video', thumbnail: '/media/images/pexels-cottonbro-4489737.jpg', videoUrl: '/media/videos/video-11.mp4', duration: '00:29', date: 'Mar 8, 2026', time: '2:15 PM' },
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
