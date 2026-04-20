import React from 'react'
import { PrototypeModeProvider } from './components/PrototypeMode'
import { PhoneFrame } from './components/PhoneFrame'
import { Router } from './navigation/Router'
import { ScreenExporter } from './utils/ScreenExporter'
import { ChannelListScreen } from './screens/ChannelListScreen'
import { ChatScreen } from './screens/ChatScreen'
import { BlueScreen } from './screens/BlueScreen'
import { ReportViewScreen } from './screens/ReportViewScreen'
import { GalleryScreen } from './screens/GalleryScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { NotificationsScreen } from './screens/NotificationsScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { WorkspaceScreen } from './screens/WorkspaceScreen'
import { LeaderboardScreen } from './screens/LeaderboardScreen'
import { GroupEditScreen } from './screens/GroupEditScreen'
import { SavedMessagesScreen } from './screens/SavedMessagesScreen'
import { RepliesScreen } from './screens/RepliesScreen'
import { GlassesConnectScreen } from './screens/GlassesConnectScreen'
import { ShareViewScreen } from './screens/ShareViewScreen'
import { ImageZoomScreen } from './screens/ImageZoomScreen'
import { VideoZoomScreen } from './screens/VideoZoomScreen'
import { BlueCardDetailScreen } from './screens/BlueCardDetailScreen'
import { FirmwareUpdateScreen } from './screens/FirmwareUpdateScreen'
import { ShareFlowScreen } from './screens/ShareFlowScreen'
import { ExternalReportScreen } from './screens/ExternalReportScreen'
import { GlassesImportScreen } from './screens/GlassesImportScreen'

const screens: Record<string, React.ComponentType<{ params?: Record<string, unknown> }>> = {
  ChannelList: ChannelListScreen,
  Chat: ChatScreen,
  Blue: BlueScreen,
  ReportView: ReportViewScreen,
  Gallery: GalleryScreen,
  Settings: SettingsScreen,
  Notifications: NotificationsScreen,
  Profile: ProfileScreen,
  Workspace: WorkspaceScreen,
  Leaderboard: LeaderboardScreen,
  GroupEdit: GroupEditScreen,
  SavedMessages: SavedMessagesScreen,
  Replies: RepliesScreen,
  GlassesConnect: GlassesConnectScreen,
  ShareView: ShareViewScreen,
  ImageZoom: ImageZoomScreen,
  VideoZoom: VideoZoomScreen,
  BlueCardDetail: BlueCardDetailScreen,
  FirmwareUpdate: FirmwareUpdateScreen,
  ShareFlow: ShareFlowScreen,
  ExternalReport: ExternalReportScreen,
  GlassesImport: GlassesImportScreen,
}

export default function App() {
  return (
    <PrototypeModeProvider>
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1a2e',
    }}>
      <PhoneFrame>
        <Router screens={screens} initialScreen="ChannelList">
          <ScreenExporter />
        </Router>
      </PhoneFrame>

      {/* Dev tools - positioned outside the phone frame, hidden from screen exports */}
      <a
        href="/bbox-tool.html"
        target="_blank"
        rel="noopener noreferrer"
        data-prototype-only
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          padding: '8px 14px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8,
          color: 'rgba(255,255,255,0.7)',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "'Outfit', -apple-system, sans-serif",
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          transition: 'all 0.15s',
          zIndex: 9999,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.95)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 7h4v4H7z" />
        </svg>
        Bbox Tool
      </a>
    </div>
    </PrototypeModeProvider>
  )
}
