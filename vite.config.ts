import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import fs from 'fs'
import path from 'path'

// Vite plugin: accepts layout updates from Prototype edit mode and writes to source files
function layoutUpdatePlugin() {
  return {
    name: 'layout-update',
    configureServer(server: any) {
      server.middlewares.use('/api/layout', (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }
        let body = ''
        req.on('data', (chunk: string) => { body += chunk })
        req.on('end', () => {
          try {
            const { screen, sectionOrder } = JSON.parse(body)
            const screenFile = path.resolve(__dirname, `src/screens/${screen}.tsx`)
            if (!fs.existsSync(screenFile)) {
              res.statusCode = 404
              res.end(JSON.stringify({ error: 'Screen file not found' }))
              return
            }
            let content = fs.readFileSync(screenFile, 'utf-8')
            // Find and replace the sectionOrder useState initializer
            const regex = /useState\(\[([^\]]*)\]\)/
            const newOrder = sectionOrder.map((s: string) => `'${s}'`).join(', ')
            content = content.replace(regex, `useState([${newOrder}])`)
            fs.writeFileSync(screenFile, content, 'utf-8')
            console.log(`[layout-update] Updated ${screen} section order to: [${newOrder}]`)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, order: sectionOrder }))
          } catch (e: any) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: e.message }))
          }
        })
      })
    }
  }
}

export default defineConfig(({ command }) => {
  const isElectron = process.env.ELECTRON === 'true'

  return {
    plugins: [
      react(),
      layoutUpdatePlugin(),
      ...(isElectron ? [
        electron([{
          entry: 'electron/main.ts',
          vite: {
            build: {
              outDir: 'dist-electron',
            },
          },
        }]),
        renderer(),
      ] : []),
    ],
    base: './',
    server: {
      port: 5000,
      strictPort: true,
      host: '0.0.0.0',
      allowedHosts: true,
      hmr: {
        clientPort: 443,
        timeout: 120000,
      },
    },
  }
})
