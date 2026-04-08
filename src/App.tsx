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

    </div>
    </PrototypeModeProvider>
  )
}
