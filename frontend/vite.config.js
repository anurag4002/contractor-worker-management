import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Use polling to avoid inotify watcher limits on some Linux systems
      usePolling: true,
      // Polling interval in milliseconds
      interval: 100,
      // Ignore heavy or irrelevant folders
      ignored: ['**/node_modules/**', '**/.git/**', '**/logs/**']
    }
  }
})
