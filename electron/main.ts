import { app, BrowserWindow, protocol } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

function createWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 960,
    resizable: true,
    backgroundColor: '#1a1a2e',
    title: 'Airwave Prototype',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

// Register a file protocol so absolute paths like /icons/foo.png
// resolve to the dist folder (works in packaged app too)
app.whenReady().then(() => {
  protocol.interceptFileProtocol('file', (request, callback) => {
    let url = request.url.replace('file://', '')
    url = decodeURIComponent(url)

    // If the file exists as-is, serve it (handles loadFile and normal paths)
    if (fs.existsSync(url)) {
      return callback(url)
    }

    // For absolute paths like /icons/foo.png, /media/foo.mp4, /images/foo.png
    // Try resolving relative to the dist folder
    const distPath = path.join(__dirname, '../dist', url)
    if (fs.existsSync(distPath)) {
      return callback(distPath)
    }

    // Also check the asar.unpacked path for media files
    const unpackedPath = distPath.replace('app.asar', 'app.asar.unpacked')
    if (fs.existsSync(unpackedPath)) {
      return callback(unpackedPath)
    }

    // Fallback
    callback(url)
  })

  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
