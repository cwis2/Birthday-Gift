
import { defineConfig } from '@lovable.dev/vite-tanstack-config'

export default defineConfig({
  vite: {
    base: process.env['VITE_BASE_PATH'] ?? '/Birthday-Gift/',
  },
  ...(process.env['NETLIFY'] === 'true' ? { nitro: false } : {}),
  tanstackStart: {
    spa: {
      enabled: true,
    },
  },
})
