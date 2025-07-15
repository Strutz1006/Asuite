import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
        '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
        '../../packages/ui/src/components/AppNavigation.tsx',
        '../../packages/ui/src/components/AppLayout.tsx',
      ],
      safelist: [
        'bg-slate-800/90',
        'backdrop-blur-lg',
        'backdrop-blur-xl'
      ]
    }),
  ],
  server: {
    port: 5173,
    host: true
  }
})
