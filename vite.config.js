import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Dev/preview only (has no effect on the production build). Allows access
  // through tunnels like *.trycloudflare.com when testing on external browsers.
  server: { allowedHosts: true },
  preview: { allowedHosts: true },
})
