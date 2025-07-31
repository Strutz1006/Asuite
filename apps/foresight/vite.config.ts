import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5177,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@aesyros/shared-state': path.resolve(__dirname, '../../packages/shared-state/src'),
      '@aesyros/supabase': path.resolve(__dirname, '../../packages/supabase/src'),
      '@aesyros/auth': path.resolve(__dirname, '../../packages/auth/src')
    }
  }
})